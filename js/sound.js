"use strict";

// ---- Key sounds ------------------------------------------------------------------------
// A quiet key sound in the spirit of a Cherry MX2A Silent Red, made with the Web Audio API (no sound files).
// The switch is linear and damped at both ends, so there is no click or bump: a press is a muffled, rounded pop
// as the damper meets the bottom, with a faint touch of keycap, and a release is a soft low puff. Each press
// varies a little in pitch and level, so a run of keys sounds like typing rather than a metronome, and Space
// and Return sound deeper, like the bigger keys they are. Sounds stay off until the Sound switch turns them on.
// sound-demo.html, next to index.html, plays this sound beside other presets for comparison.

const keySound = { context: null, out: null, noise: null, soften: null, wet: null, down: new Map() };

// Per key size: `bump` is the faint keycap tick, `tap` the muffled low-pass thump of the damper, `body` a short
// falling tone and `release` the puff on the way up. A layer without a level is left out. Measured on renders, a
// letter key centers around 590 Hz with little in the 1–3 kHz click range and none above 3 kHz, and is done in
// about 30 ms; Space and Return center around 470 Hz, and a release is about 20 dB below a press.
const switchSounds = {
  key: {
    bump: { frequency: 1400, q: 0.8, level: 0.1, decay: 0.012, attack: 0.003 },
    tap: { type: "lowpass", frequency: 900, q: 0.5, level: 1, decay: 0.035, attack: 0.005 },
    body: { frequency: 190, level: 0.07, decay: 0.04, attack: 0.005 },
    release: { type: "lowpass", frequency: 700, q: 0.5, level: 0.12, decay: 0.02, attack: 0.004 }
  },
  wide: {
    bump: { frequency: 1150, q: 0.8, level: 0.08, decay: 0.014, attack: 0.003 },
    tap: { type: "lowpass", frequency: 650, q: 0.5, level: 1.3, decay: 0.045, attack: 0.006 },
    body: { frequency: 145, level: 0.09, decay: 0.05, attack: 0.006 },
    release: { type: "lowpass", frequency: 520, q: 0.5, level: 0.12, decay: 0.024, attack: 0.004 }
  }
};

// The whole mix: overall level, the low-pass that takes the edge off, and how much room is added.
const soundMix = { level: 0.25, tone: 1600, room: 0.1 };

const vary = (value, spread) => value * (1 + (Math.random() * 2 - 1) * spread);

// A short, soft room: decaying stereo noise for the convolver.
function roomImpulse(context) {
  const length = Math.round(context.sampleRate * 0.22);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let index = 0; index < length; index++) data[index] = (Math.random() * 2 - 1) * (1 - index / length) ** 3;
  }
  return impulse;
}

// The audio context starts on the first sound, which always follows a key press or click, as browsers require.
function soundContext() {
  if (!keySound.context) {
    const Context = window.AudioContext ?? window.webkitAudioContext;
    if (!Context) return null;
    const context = new Context({ latencyHint: "interactive" });
    // One shared stretch of white noise; each click plays a different part of it.
    const noise = context.createBuffer(1, Math.round(context.sampleRate * 0.3), context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
    const out = context.createGain();
    out.gain.value = soundMix.level;
    const soften = context.createBiquadFilter();
    soften.type = "lowpass";
    soften.frequency.value = soundMix.tone;
    soften.Q.value = 0.5;
    const room = context.createConvolver();
    room.buffer = roomImpulse(context);
    const wet = context.createGain();
    wet.gain.value = soundMix.room;
    out.connect(soften);
    soften.connect(context.destination);
    soften.connect(room).connect(wet).connect(context.destination);
    Object.assign(keySound, { context, out, noise, soften, wet });
  }
  if (keySound.context.state === "suspended") keySound.context.resume();
  return keySound.context;
}

// Filtered noise: the click of the switch, the tap of the keycap, or the tick on release. A low-pass `type`
// gives a muffled thump instead, as from a damped switch.
function noiseBurst(at, { frequency, q, level, decay, attack = 0.0015, type = "bandpass" }) {
  const { context, out, noise } = keySound;
  const source = context.createBufferSource();
  source.buffer = noise;
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = vary(frequency, 0.08);
  filter.Q.value = q;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(vary(level, 0.15), at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  source.connect(filter).connect(gain).connect(out);
  source.start(at, Math.random() * 0.15, decay + 0.01);
}

// Soft saturation curves, one per amount of drive: they round the tone off and add overtones.
const driveCurves = new Map();
function driveCurve(drive) {
  if (!driveCurves.has(drive)) {
    const curve = new Float32Array(1024);
    for (let index = 0; index < curve.length; index++) {
      const x = index / (curve.length - 1) * 2 - 1;
      curve[index] = Math.tanh(drive * x) / Math.tanh(drive);
    }
    driveCurves.set(drive, curve);
  }
  return driveCurves.get(drive);
}

// A short falling tone: the body of the key reaching the bottom. `drop` is how far the pitch falls,
// `harmonic` adds a tone an octave up, and `drive` saturates the body. The octave and the overtones are what
// let a low thud come through laptop speakers, which play little below about 150 Hz.
function thock(at, { frequency, level, decay, attack = 0.003, drop = 0.62, harmonic = 0, drive = 0 }) {
  const { context, out } = keySound;
  const start = vary(frequency, 0.06);
  const body = context.createGain();
  const tones = [[1, 1], [2, harmonic]].filter(([, share]) => share > 0).map(([multiple, share]) => {
    const tone = context.createOscillator();
    tone.frequency.setValueAtTime(start * multiple, at);
    tone.frequency.exponentialRampToValueAtTime(start * multiple * drop, at + decay);
    const mix = context.createGain();
    mix.gain.value = share;
    tone.connect(mix).connect(body);
    return tone;
  });
  let shaped = body;
  if (drive > 0) {
    const shaper = context.createWaveShaper();
    shaper.curve = driveCurve(drive);
    shaper.oversample = "2x";
    shaped = body.connect(shaper);
  }
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(vary(level, 0.15), at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  shaped.connect(gain).connect(out);
  for (const tone of tones) {
    tone.start(at);
    tone.stop(at + decay + 0.02);
  }
}

const soundProfile = (key) => (key === " " || key === "Enter" ? switchSounds.wide : switchSounds.key);

// A layer without a level is left out: a linear switch has no tactile bump, for one.
function playPress(key) {
  const profile = soundProfile(key);
  const at = keySound.context.currentTime + 0.002;
  if (profile.bump?.level) noiseBurst(at, profile.bump);
  if (profile.tap?.level) noiseBurst(at + 0.006, profile.tap);
  if (profile.body?.level) thock(at + 0.006, profile.body);
}

function playRelease(key, delay = 0) {
  const { release } = soundProfile(key);
  if (release?.level) noiseBurst(keySound.context.currentTime + 0.002 + delay, release);
}

// Called for keys that type into the exercise (characters, Return in code, Delete); held-down repeats stay quiet.
function keyPressSound(event) {
  if (!settings.sound || event.repeat || !soundContext()) return;
  playPress(event.key);
  keySound.down.set(event.code || event.key, event.key);
}

// The release only sounds for a key whose press did.
function keyReleaseSound(event) {
  const id = event.code || event.key;
  const key = keySound.down.get(id);
  if (key === undefined) return;
  keySound.down.delete(id);
  if (settings.sound && keySound.context) playRelease(key);
}

// Turning sounds on plays one press and release, so you hear what you chose.
function previewKeySound() {
  if (!soundContext()) return;
  playPress("a");
  playRelease("a", 0.09);
}
