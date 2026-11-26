"use strict";

// Block world, Daniel's theme: tips with secret words, surprise scenes after flawless runs, secret words and cheat mode.

// In block world, every third tip or so lets Daniel in on a secret word.
const takeDanielTip = shuffledBag([
  "Daniel secret: type OINK for pigs. Lots of pigs.",
  "Daniel secret: type ZOMBIE and watch that wall.",
  "Daniel secret: the dolphins come when you type DOLPHIN.",
  "Daniel secret: type FLOSS or DAB to start a dance-off.",
  "Daniel secret: type DISCO. The pigs brought sunglasses.",
  "Daniel secret: type PARTY to invite everybody.",
  "Daniel secret: feeling brave? Type CHAOS.",
  "Finish with zero typos and something silly happens."
]);

// ---- Block world surprises ----------------------------------------------------------------
// After a typo-free finish with the block world theme on, a short scene plays over the page.
// Everyday scenes rotate (never the same twice in a row); about one in ten is a rare scene, and every
// fifth flawless finish in a row always is. Some scenes hide small extras that only show up now and then.
const spriteSizes = {"grass":[12,12],"lava":[12,12],"diamondore":[12,12],"goldore":[12,12],"emeraldore":[12,12],"redore":[12,12],"gem":[12,9],"emerald":[8,9],"heart":[9,8],"apple":[10,11],"torch":[8,12],"chest":[12,10],"potion":[10,12],"cake":[12,11],"bread":[12,7],"bucket":[12,9],"bomb":[11,11],"slime":[10,10],"pig":[12,11],"chick":[10,10],"fish":[12,6],"mushroom":[10,10],"flower":[7,9],"star":[9,9],"coin":[8,8],"carrot":[10,11],"cookie":[8,8],"sword":[13,14],"pickaxe":[13,10],"arrow":[16,5],"xp":[5,5],"dragonup":[31,20],"dragondown":[31,20],"rider1":[15,16],"rider2":[15,16],"stonepick":[13,10],"crown":[7,5],"dcoin":[8,8],"zombie1":[16,19],"zombie2":[16,19]};
Object.assign(spriteSizes, {"dolphin":[26,12],"shades":[12,3],"hat":[5,6],"brick":[12,12],"blockpig1":[25,20],"blockpig2":[25,20],"zwalk1":[18,29],"zwalk2":[18,29],"bwalk1":[15,21],"bwalk2":[15,21],"zfloss1":[21,29],"zfloss2":[21,29],"zfloss3":[21,29],"bfloss1":[17,21],"bfloss2":[17,21],"bfloss3":[17,21],"vwalk1":[16,34],"vwalk2":[16,34],"vdab1":[23,34],"vdab2":[23,34],"wing1":[12,8],"wing2":[12,8]});
const everydayScenes = ["zombie", "dragon", "treasure", "slime", "fireworks", "parade", "slimes",
  "wallbreak", "flyingpigs", "pigdisco", "dolphins", "pigtower", "dance", "pigriders"];
const rareScenes = ["stampede", "jackpot", "squad", "pigrain", "zombieparty"];
const surpriseCheers = ["FLAWLESS!", "NO TYPOS!", "PERFECT RUN!", "CLEAN!", "GG!"];
const secretCheers = ["DANIEL MODE!", "SPEEDRUN?!", "KEYBOARD WIZARD", "+100 XP", "LEGENDARY!", "OINK OINK!", "EEE EEE!", "BRAAAINS!"];
const takeDolphinLine = shuffledBag([
  "EEE EEE! (THAT MEANS HI)", "I CAN'T SPELL DOLPHIN", "IS THIS LAVA? SPICY!", "I FORGOT HOW TO SWIM",
  "WHAT IF FISH ARE JUST WET BIRDS", "I TYPE WITH MY NOSE", "WHO TURNED OFF THE OCEAN?", "I AM 90% SPLASH",
  "BUBBLES ARE JUST AIR HUGS", "I ATE A KEYBOARD. CRUNCHY.", "WAIT, WHERE'S THE WATER?", "I'M A FISH! (I'M NOT)",
  "QWERTY? MORE LIKE SQUIRTY", "MY BRAIN IS ONE BIG BUBBLE", "I LOST A RACE TO A ROCK", "THE SEA IS JUST BIG SOUP",
  "HELLO, I AM A BANANA", "I THINK I LEFT THE OVEN ON", "I CAN COUNT TO POTATO", "I'M NOT WET, YOU'RE WET",
  "DO PIGS SWIM? ASKING FOR A PIG", "I SNEEZED AND MADE A WAVE"
]);
const typoLines = ["OOPS! ME TOO. FLIPPERS.", "TYPO? I CALL THAT JAZZ.", "THAT KEY WAS SLIPPERY", "EVEN DOLPHINS MISS KEYS",
  "SHAKE IT OFF! EEE!", "I TYPE WITH MY NOSE, SO...", "IT'S FINE. I'M WET."];
const zombieLines = ["OOPS. WRONG DOOR.", "SORRY ABOUT YOUR WALL!", "IS DANIEL HOME?", "I CAME FOR THE TYPOS",
  "HEEERE'S ZOMBIE!", "I'LL PAY FOR THAT. NOT.", "WHO PUT A WALL THERE?"];
let lastSurprise = null;
let surpriseTimer = null;
let flawlessStreak = 0;
const chance = (odds) => Math.random() < odds;

function pixelSprite(name, scale, frames) {
  const [width, height] = spriteSizes[frames ? `${name}1` : name] ?? spriteSizes[`${name}up`];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width * scale);
  svg.setAttribute("height", height * scale);
  svg.setAttribute("shape-rendering", "crispEdges");
  (frames ?? [name]).forEach((id, index) => {
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#p-${id}`);
    if (frames) use.setAttribute("class", index ? "frame-b" : "frame-a");
    svg.append(use);
  });
  return svg;
}

function surpriseRunner(content, { top, dur, delay = 0, leftward = false, bubble = null }) {
  const runner = element("div", leftward ? "surprise-runner leftward" : "surprise-runner");
  runner.style.cssText = `--top: ${top}; --dur: ${dur}s; --delay: ${delay}s`;
  if (bubble) runner.append(element("span", "surprise-bubble", bubble));
  runner.append(content);
  return runner;
}

function fallingLoot(x, delay, dur, drift, name = pick(["coin", "coin", "gem", "emerald", "heart", "star", "xp"]), top = null) {
  const item = element("div", "surprise-drop");
  item.style.cssText = `left: ${x}; top: ${top ?? (name === "xp" ? "-20px" : "-40px")}; --delay: ${delay}s; --dur: ${dur}s; --drift: ${drift}px`;
  item.append(pixelSprite(name, name === "xp" ? 5 : 4));
  return item;
}

const hopping = (name, scale, extra = null) => {
  const hop = element("div", "surprise-hop");
  hop.append(pixelSprite(name, scale));
  if (extra) hop.append(extra);
  return hop;
};
const bouncing = (scale, delay = 0) => {
  const slime = element("div", "surprise-bounce");
  slime.style.animationDelay = `${delay}s`;
  slime.append(pixelSprite("slime", scale));
  return slime;
};

function dragonWith(rider) {
  const dragon = element("div");
  dragon.style.cssText = "position: relative; transform: scaleX(-1)";
  dragon.append(pixelSprite("dragon", 4, ["dragonup", "dragondown"]));
  if (rider) {
    const chick = pixelSprite("chick", 2.5);
    chick.classList.add("surprise-rider");
    dragon.append(chick);
  }
  return dragon;
}

// Loot dropped along a flight path, timed to fall from under whoever is flying over that spot.
const lootTrail = (count, top, flight, special = false) => Array.from({ length: count }, (_, i) => {
  const share = 1 - (i + .5) / count;
  const name = special && i === Math.floor(count / 2) ? "dcoin" : undefined;
  return fallingLoot(`${Math.round(share * 100)}vw`, (1 - share) * flight * .94 + .3, 2.8 + Math.random() * .8, Math.round(Math.random() * 40 - 20), name, top);
});

function fireworks(count, heart) {
  const colours = ["#ff5a5a", "#ffd83a", "#5ff0e6", "#7ed957", "#d97be0", "#ff9a3c"];
  const parts = [];
  for (let i = 0; i < count; i++) {
    const x = 12 + (76 / (count - 1)) * i + (Math.random() * 6 - 3);
    const rise = Math.round(innerHeight * (.42 + Math.random() * .22));
    const launch = i * .75 + Math.random() * .3;
    const climb = 1.3;
    const rocket = element("div", "surprise-rocket");
    rocket.style.cssText = `left: ${x}vw; top: calc(100vh - 20px); --rise: ${rise}px; --dur: ${climb}s; --delay: ${launch}s`;
    parts.push(rocket);
    const colour = pick(colours);
    const shape = heart && i === Math.floor(count / 2);
    const sparks = shape ? 24 : 16;
    for (let s = 0; s < sparks; s++) {
      const angle = (s / sparks) * Math.PI * 2;
      // A heart-shaped burst follows the classic heart curve; the others are rings.
      const [dx, dy] = shape
        ? [16 * Math.sin(angle) ** 3 * 5.5, -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * 5.5]
        : [Math.cos(angle) * (70 + Math.random() * 30), Math.sin(angle) * (70 + Math.random() * 30)];
      const spark = element("div", "surprise-spark");
      spark.style.cssText = `left: ${x}vw; top: calc(100vh - 20px - ${rise}px); --c: ${shape ? "#ff5a7a" : colour}; --dx: ${Math.round(dx)}px; --dy: ${Math.round(dy)}px; --delay: ${launch + climb}s`;
      parts.push(spark);
    }
  }
  return parts;
}

const between = (low, high) => low + Math.random() * (high - low);

// A sprite that loops through four frames in the given order (a frame may repeat), `step` seconds each.
function loopSprite(base, order, scale, step) {
  const svg = pixelSprite(base, scale, [`${base}1`, `${base}2`]);
  svg.replaceChildren();
  svg.classList.add("surprise-frames");
  svg.style.setProperty("--cycle", `${order.length * step}s`);
  order.forEach((frame, index) => {
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#p-${base}${frame}`);
    use.style.setProperty("--at", `${-((order.length - index) % order.length) * step}s`);
    svg.append(use);
  });
  return svg;
}

// The blocky sprites face the viewer and to the left; this turns one to face right.
function facingRight(node) {
  const flip = element("div", "surprise-flip");
  flip.append(node);
  return flip;
}

const walker = (base, scale, frame = ".32s") => {
  const sprite = pixelSprite(base, scale, [`${base}1`, `${base}2`]);
  sprite.style.setProperty("--frame", frame);
  return sprite;
};

// A blocky pig, with optional sunglasses, a party hat, wings, or a baby zombie riding on its back.
function blockPig(scale, { walk = true, shades = false, hat = false, wings = false, rider = false } = {}) {
  const wrap = element("div", "surprise-props");
  wrap.append(walk ? walker("blockpig", scale) : pixelSprite("blockpig1", scale));
  const prop = (sprite, x, y) => {
    sprite.classList.add("surprise-prop");
    sprite.style.left = `${x * scale}px`;
    sprite.style.top = `${y * scale}px`;
    wrap.append(sprite);
  };
  if (shades) prop(pixelSprite("shades", scale), 0, 7);
  if (hat) prop(pixelSprite("hat", scale), 3.5, -2);
  if (wings) prop(walker("wing", scale, ".3s"), 11, -6);
  if (rider) prop(walker("bwalk", scale * .8, ".26s"), 9, -12);
  return wrap;
}

// A dolphin leaps out of the bottom of its layer and dives back in, maybe saying something silly at the top.
function dolphinLeap({ x, span, height, at = 0, leap = 2.6, line = null, scale = 4, wrap = 0 }) {
  const sideways = element("div", "surprise-leap-x");
  sideways.style.cssText = `left: ${Math.round(x)}px; top: 100%; --span: ${Math.round(span)}px; --leap: ${leap}s; --at: ${at}s`;
  const upDown = element("div", "surprise-leap-y");
  upDown.style.setProperty("--height", `${Math.round(height)}px`);
  const tilt = element("div", "surprise-leap-r");
  tilt.style.setProperty("--tilt", span > 0 ? "38deg" : "-38deg");
  const sprite = pixelSprite("dolphin", scale);
  tilt.append(span > 0 ? sprite : facingRight(sprite));
  if (line) {
    const bubble = element("span", wrap ? "surprise-bubble wrap" : "surprise-bubble", line);
    bubble.style.cssText = `--say-at: ${at + leap * .16}s; --say-dur: ${leap * .82}s${wrap ? `; --wrap: ${wrap}px` : ""}`;
    upDown.append(bubble);
  }
  upDown.append(tilt);
  sideways.append(upDown);
  const middle = 13 * scale;
  const splash = (left, delay) => Array.from({ length: 9 }, () => {
    const drop = element("div", "surprise-spark");
    drop.style.cssText = `left: ${Math.round(left)}px; top: calc(100% - 12px); --c: ${pick(["#5ff0e6", "#ffffff", "#8fd3ff"])}; --dx: ${Math.round(between(-50, 50))}px; --dy: ${-Math.round(between(70, 150))}px; --delay: ${delay}s`;
    return drop;
  });
  return [sideways, ...splash(x + middle, at + .1), ...splash(x + span + middle, at + leap - .15)];
}

// A zombie walks up to a brick wall, knocks, smashes straight through it, and a crowd follows through the hole.
function wallBreak(crowd = ["baby", "baby"]) {
  const scale = 4, size = 12 * scale, rows = 4, cols = 2;
  const floor = Math.round(innerHeight * .8);
  const wallX = Math.round(innerWidth * .58);
  const dur = 8.6, breakAt = dur * .46;
  const wall = element("div", "surprise-wall");
  wall.style.cssText = `left: ${wallX}px; top: ${floor - rows * size}px; width: ${cols * size}px; height: ${rows * size}px; --shake-at: ${dur * .32 + .1}s`;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const brick = element("div", "surprise-brick");
      brick.style.cssText = `position: absolute; left: ${col * size}px; top: ${row * size}px; --break-at: ${breakAt}s; --dx: ${Math.round(between(-80, 320))}px; --up: ${-Math.round(between(40, 200))}px; --rot: ${Math.round(between(-420, 420))}deg`;
      brick.append(pixelSprite("brick", scale));
      wall.append(brick);
    }
  }
  const zombieWidth = 18 * scale, zombieHeight = 29 * scale;
  const zombie = element("div", "surprise-walk");
  zombie.style.cssText = `--top: ${floor - zombieHeight}px; --dur: ${dur}s; --stop: ${wallX - zombieWidth + 12}px`;
  const after = element("span", "surprise-bubble surprise-timed", pick(zombieLines));
  after.style.cssText = `--say-at: ${breakAt + .5}s; --say-dur: ${dur - breakAt - 1}s`;
  zombie.append(after, facingRight(walker("zwalk", scale, ".34s")));
  const knock = element("div", "surprise-say surprise-timed", pick(["KNOCK KNOCK!", "ANYBODY HOME?", "LITTLE PIG, LET ME IN!"]));
  knock.style.cssText = `left: ${wallX - zombieWidth / 2}px; top: ${floor - zombieHeight - 46}px; translate: -50% 0; --say-at: ${dur * .3}s; --say-dur: ${dur * .16}s`;
  const boom = element("div", "surprise-pop", pick(["BOOM!", "CRASH!", "KA-POW!", "SMASH!"]));
  boom.style.cssText = `left: ${wallX + size}px; top: ${floor - rows * size - 30}px; --pop-at: ${breakAt}s`;
  const dust = Array.from({ length: 14 }, () => {
    const puff = element("div", "surprise-spark");
    puff.style.cssText = `left: ${wallX + size}px; top: ${floor - Math.round(between(20, rows * size))}px; --c: ${pick(["#b0a89a", "#d8c3a5", "#8a8a8a"])}; --dx: ${Math.round(between(-120, 160))}px; --dy: ${-Math.round(between(40, 140))}px; --delay: ${breakAt}s`;
    return puff;
  });
  const followers = crowd.map((kind, index) => {
    const [content, height] = {
      baby: () => [walker("bwalk", 3.4, ".24s"), 21 * 3.4],
      zombie: () => [walker("zwalk", 3.4, ".34s"), 29 * 3.4],
      villager: () => [walker("vwalk", 3.4, ".3s"), 34 * 3.4],
      pig: () => [blockPig(3, { hat: true }), 20 * 3]
    }[kind]();
    const bubble = index === 0 ? pick(["WAIT FOR US!", "ME TOO! ME TOO!", "IS THIS THE PARTY?"]) : null;
    return surpriseRunner(facingRight(content), { top: `${floor - Math.round(height)}px`, dur: 4.6, delay: breakAt + .2 + index * .42, bubble });
  });
  return [wall, knock, boom, zombie, ...dust, ...followers];
}

function dolphinShow() {
  const width = innerWidth;
  return [
    { x: width * .06, span: width * .26, at: 0 },
    { x: width * .8, span: -width * .26, at: 1.4 },
    { x: width * .3, span: width * .24, at: 2.8 },
    { x: width * .64, span: -width * .22, at: 4.2 }
  ].flatMap((leap) => dolphinLeap({ ...leap, height: innerHeight * between(.5, .62), line: takeDolphinLine() }));
}

function flyingPigs() {
  return [0, 1, 2].map((index) => {
    const bob = element("div", "surprise-bob");
    bob.style.animationDelay = `${-index * .25}s`;
    bob.append(blockPig(index === 1 ? 3.2 : 2.6, { walk: false, wings: true, shades: index === 2 }));
    const bubble = index === 0 ? pick(["WHEN PIGS FLY!", "I BELIEVE I CAN FLY", "LOOK MA, NO HANDS!", "OINK! I'M A BIRD NOW", "PLANE? NO. PIG."]) : index === 2 ? "WHEEE!" : null;
    return surpriseRunner(bob, { top: `${16 + index * 15}vh`, dur: 7.4 - index * .5, delay: index * .8, leftward: true, bubble });
  });
}

const surpriseScenes = {
  // A zombie walks into a brick wall, then right through it. Baby zombies follow through the hole.
  wallbreak: () => wallBreak(chance(.3) ? ["baby", "baby", "baby"] : ["baby", "baby"]),
  // Pigs with wings fly over.
  flyingpigs: flyingPigs,
  // Pigs in sunglasses (and party hats) dance under disco lights.
  pigdisco: () => {
    const set = element("div", "surprise-set");
    const lights = Array.from({ length: 22 }, () => {
      const light = element("div", "surprise-blink");
      light.style.cssText = `left: ${Math.round(between(2, 96))}vw; top: ${Math.round(between(4, 90))}vh; --c: ${pick(["#ff5ac8", "#5ff0e6", "#ffd83a", "#7ed957", "#d97be0"])}; --delay: ${-between(0, .5).toFixed(2)}s`;
      return light;
    });
    const pigs = [0, 1, 2, 3].map((index) => {
      const spot = element("div");
      spot.style.cssText = `left: ${10 + index * 21}vw; top: 62vh`;
      const dancer = element("div", "surprise-dance");
      dancer.style.setProperty("--delay", `${-index * .2}s`);
      dancer.append(blockPig(3, { shades: true, hat: index % 2 === 1 }));
      if (index === 1) spot.append(element("span", "surprise-bubble", pick(["OINK OINK, BABY!", "DEAL WITH IT.", "SNOUT GROOVE!", "MUD IS MY DANCE FLOOR"])));
      spot.append(dancer);
      return spot;
    });
    set.append(element("div", "surprise-disco"), ...lights, ...pigs);
    return [set];
  },
  // Dolphins leap across the bottom of the screen, each saying something silly.
  dolphins: dolphinShow,
  // Pigs drop out of the sky into a tower, which wobbles and falls over.
  pigtower: () => {
    const scale = 3, step = 13 * scale, count = 5;
    const tower = element("div", "surprise-tower");
    tower.style.cssText = `left: calc(50vw - ${12 * scale}px); top: 84vh`;
    for (let index = 0; index < count; index++) {
      const drop = element("div", "surprise-stack");
      drop.style.cssText = `bottom: ${index * step}px; --delay: ${index * .65}s`;
      drop.append(blockPig(scale, { walk: false, hat: index === count - 1 }));
      if (index === count - 1) {
        const bubble = element("span", "surprise-bubble surprise-timed", pick(["I CAN SEE MY HOUSE!", "TALLEST PIG EVER!", "DON'T SNEEZE...", "WHO'S IN CHARGE HERE?"]));
        bubble.style.cssText = `--say-at: ${index * .65 + 1}s; --say-dur: 2.4s`;
        drop.append(bubble);
      }
      tower.append(drop);
    }
    const uhOh = element("div", "surprise-say surprise-timed", "UH OH.");
    uhOh.style.cssText = `left: calc(50vw + 70px); top: calc(84vh - ${count * step + 60}px); --say-at: 5.3s; --say-dur: 2s`;
    return [tower, uhOh];
  },
  // Zombies and baby zombies do the floss while a villager dabs in the middle.
  dance: () => {
    const set = element("div", "surprise-set");
    const cast = [["zfloss", 29], ["bfloss", 21], ["vdab", 34], ["bfloss", 21], ["zfloss", 29]];
    set.append(...cast.map(([base, height], index) => {
      const scale = 3.4;
      const spot = element("div");
      spot.style.cssText = `left: ${8 + index * 18}vw; top: calc(78vh - ${Math.round(height * scale)}px)`;
      const sprite = base === "vdab" ? loopSprite("vdab", [1, 2, 2, 2], scale, .3) : loopSprite(base, [1, 2, 3, 2], scale, .15);
      if (index === 0) spot.append(element("span", "surprise-bubble", pick(["FLOSS TIME!", "MY HIPS DON'T LIE", "BRAINS? NO. MOVES."])));
      if (base === "vdab") spot.append(element("span", "surprise-bubble", pick(["DAB!", "DAB ON 'EM!", "HMMM... DAB."])));
      if (index === 3) spot.append(element("span", "surprise-bubble", "I'M LEARNING!"));
      spot.append(sprite);
      return spot;
    }));
    return [set];
  },
  // Baby zombies race by, riding pigs.
  pigriders: () => [0, 1, 2].map((index) => surpriseRunner(blockPig(3, { rider: true }), {
    top: `${50 + index * 10}vh`, dur: 6.2, delay: index * .7, leftward: true,
    bubble: index === 0 ? pick(["GIDDY-UP, PIGGY!", "BABY ZOMBIE EXPRESS!", "YEEHAW!", "NO BRAKES!"]) : null
  })),

  // A zombie flees from a tiny chick. Sometimes the chick wears a crown; sometimes the zombie drops a carrot. Sometimes the chick wears a crown; sometimes the zombie drops a carrot.
  zombie: () => {
    const zombie = pixelSprite("zombie", 4, ["zombie1", "zombie2"]);
    zombie.style.setProperty("--frame", ".3s");
    let crown = null;
    if (chance(.3)) {
      crown = pixelSprite("crown", 2.5);
      crown.classList.add("surprise-crown");
    }
    const scene = [
      surpriseRunner(zombie, { top: "60vh", dur: 6.2, bubble: pick(["AAAH!", "RUN!", "NOPE!", "TOO FAST!"]) }),
      surpriseRunner(hopping("chick", 4, crown), { top: "calc(60vh + 34px)", dur: 6.2, delay: .9 })
    ];
    if (chance(.25)) scene.push(fallingLoot("45vw", 3, 2.6, 30, "carrot", "calc(60vh + 30px)"));
    return scene;
  },
  // A dragon swoops across, dropping loot. Sometimes a chick rides along, and a golden D coin is in the loot.
  dragon: () => [surpriseRunner(dragonWith(chance(.3)), { top: "26vh", dur: 6.8, leftward: true }), ...lootTrail(11, "calc(26vh + 40px)", 6.8, chance(.2))],
  // Loot rains down. Now and then a golden D coin is hidden in it.
  treasure: () => {
    const rain = Array.from({ length: 34 }, () =>
      fallingLoot(`${Math.round(Math.random() * 96)}vw`, Math.random() * 2.4, 2.8 + Math.random() * 1.6, Math.round(Math.random() * 60 - 30)));
    if (chance(.2)) rain.push(fallingLoot(`${Math.round(20 + Math.random() * 60)}vw`, 2.6, 4.2, 0, "dcoin"));
    return rain;
  },
  // A slime boings across. Sometimes a tiny one trails far behind, asking it to wait.
  slime: () => {
    const scene = [surpriseRunner(bouncing(6), { top: "62vh", dur: 7.4, bubble: pick(["BOING!", "BLOOP!", "GG!"]) })];
    if (chance(.35)) scene.push(surpriseRunner(bouncing(2.5, .3), { top: "calc(62vh + 36px)", dur: 7.4, delay: 2.2, bubble: "WAIT!" }));
    return scene;
  },
  // Fireworks. Now and then one bursts into a heart.
  fireworks: () => [element("div", "surprise-glow"), ...fireworks(5, chance(.2))],
  // Chicks march across in single file. Sometimes the last one is the knight on his chicken.
  parade: () => {
    const scene = Array.from({ length: 6 }, (_, i) => surpriseRunner(hopping("chick", 4), { top: "calc(62vh + 20px)", dur: 7, delay: i * .55, bubble: i === 0 ? "FOLLOW ME!" : null }));
    if (chance(.25)) {
      const knight = pixelSprite("rider", 3, ["rider1", "rider2"]);
      knight.style.setProperty("--frame", ".4s");
      scene.push(surpriseRunner(knight, { top: "calc(62vh + 12px)", dur: 7, delay: 6 * .55 + .4 }));
    }
    return scene;
  },
  // A slime family: big, medium and small, each bouncing to its own beat.
  slimes: () => [
    surpriseRunner(bouncing(7), { top: "58vh", dur: 7.6, bubble: "FAMILY TRIP!" }),
    surpriseRunner(bouncing(4.5, .4), { top: "calc(58vh + 26px)", dur: 7.6, delay: .9 }),
    surpriseRunner(bouncing(2.5, .2), { top: "calc(58vh + 48px)", dur: 7.6, delay: 1.7 })
  ],

  // Rare: a stampede of chickens with the knight leading the charge.
  stampede: () => {
    const scene = [];
    for (let i = 0; i < 7; i++) {
      const knight = i % 3 === 0;
      const runner = knight ? pixelSprite("rider", 3, ["rider1", "rider2"]) : hopping("chick", 3.5);
      if (knight) runner.style.setProperty("--frame", ".3s");
      scene.push(surpriseRunner(runner, { top: `calc(${52 + (i % 3) * 7}vh + ${knight ? 0 : 10}px)`, dur: 5.6, delay: i * .35, bubble: i === 0 ? "CHAAARGE!" : null }));
    }
    return scene;
  },
  // Rare: a jackpot of gems and ore, with a giant gem in the middle.
  jackpot: () => {
    const big = element("div", "surprise-drop");
    big.style.cssText = "left: calc(50vw - 72px); top: -120px; --delay: .2s; --dur: 4.6s; --drift: 0px";
    big.append(pixelSprite("gem", 12));
    return [element("div", "surprise-glow"), big, ...Array.from({ length: 46 }, () =>
      fallingLoot(`${Math.round(Math.random() * 96)}vw`, Math.random() * 3, 2.6 + Math.random() * 1.8, Math.round(Math.random() * 50 - 25), pick(["gem", "gem", "emerald", "diamondore", "goldore", "coin"])))];
  },
  // Rare: three dragons in formation, dropping a trail of loot.
  squad: () => [
    surpriseRunner(dragonWith(chance(.5)), { top: "22vh", dur: 6.8, leftward: true }),
    surpriseRunner(dragonWith(false), { top: "12vh", dur: 6.8, delay: .6, leftward: true }),
    surpriseRunner(dragonWith(false), { top: "32vh", dur: 6.8, delay: .6, leftward: true }),
    ...lootTrail(9, "calc(22vh + 40px)", 6.8, true)
  ],
  // Rare: it rains pigs. Some wear sunglasses, some have wings (they still fall).
  pigrain: () => [element("div", "surprise-glow"), ...Array.from({ length: 26 }, () => {
    const pig = element("div", "surprise-drop");
    pig.style.cssText = `left: ${Math.round(between(0, 92))}vw; top: -90px; --delay: ${between(0, 3.2).toFixed(2)}s; --dur: ${between(2.8, 4.4).toFixed(2)}s; --drift: ${Math.round(between(-40, 40))}px`;
    const spin = element("div", "surprise-spin");
    spin.style.setProperty("--spin-dur", `${between(1, 2.4).toFixed(2)}s`);
    spin.append(blockPig(between(1.6, 2.8), { walk: false, shades: chance(.2), wings: chance(.15) }));
    pig.append(spin);
    return pig;
  })],
  // Rare: the wall comes down and everybody pours through: zombies, baby zombies, a villager and pigs in party hats.
  zombieparty: () => [...wallBreak(["baby", "pig", "villager", "baby", "zombie", "pig"]), ...fireworks(3, false)],
  // Secret word only: all at once.
  chaos: () => [...wallBreak(), ...dolphinShow(), ...flyingPigs()]
};

const rareCheers = { stampede: "STAMPEDE!", jackpot: "JACKPOT!", squad: "DRAGON SQUAD!", pigrain: "IT'S RAINING PIGS!", zombieparty: "ZOMBIE PARTY!" };

// Scenes play at this fraction of the speed their timings are written for, so there is time to read the jokes.
// Lower is slower; 1 is the original speed.
const sceneSpeed = .55;
function playSlowly(...nodes) {
  for (const node of nodes) {
    for (const animation of node.getAnimations({ subtree: true })) animation.playbackRate = sceneSpeed;
  }
}

// A dolphin pops up in the corner now and then after a typo, to say it misses keys too.
let typoDolphinAt = -Infinity;
function typoDolphin() {
  if (settings.festive !== "pixel" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (performance.now() - typoDolphinAt < 25000 || !chance(.25)) return;
  typoDolphinAt = performance.now();
  const peek = element("div", "surprise-peek");
  peek.append(element("span", "surprise-bubble", pick(typoLines)), pixelSprite("dolphin", 3));
  peek.addEventListener("animationend", (event) => {
    if (event.target === peek) peek.remove();
  });
  get("pixel-surprise").append(peek);
  playSlowly(peek);
}

// Every so often a dolphin leaps out of a lava pool beside the page and says something silly.
// It only happens when the side margins are wide enough to show it.
function ambientDolphin() {
  if (settings.festive !== "pixel" || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const margin = (innerWidth - Math.min(1176, innerWidth - 64)) / 4;
  if (margin < 60) return;
  const scale = 2.5, span = 50, onRight = chance(.5);
  const center = onRight ? innerWidth - margin : margin;
  const parts = dolphinLeap({
    x: center - 13 * scale - span / 2 * (onRight ? -1 : 1), span: onRight ? -span : span, height: between(190, 270),
    leap: 2.4, line: takeDolphinLine(), scale, wrap: Math.min(170, margin * 2 - 24)
  });
  get("pixel-pond").append(...parts);
  playSlowly(...parts);
  setTimeout(() => parts.forEach((part) => part.remove()), 6500 / sceneSpeed);
}
(function scheduleDolphin() {
  setTimeout(() => {
    ambientDolphin();
    scheduleDolphin();
  }, between(14000, 26000));
})();

function pixelSurprise(name, cheer) {
  if (settings.festive !== "pixel" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const milestone = flawlessStreak > 0 && flawlessStreak % 5 === 0;
  const choice = name ?? (milestone || chance(.1) ? pick(rareScenes) : pick(everydayScenes.filter((option) => option !== lastSurprise)));
  lastSurprise = choice;
  let text = cheer ?? rareCheers[choice] ?? pick(surpriseCheers);
  if (!cheer && flawlessStreak >= 3 && (milestone || chance(.5))) text = `x${flawlessStreak} STREAK!`;
  else if (!cheer && !rareCheers[choice] && chance(.08)) text = pick(secretCheers);
  const stage = get("pixel-surprise");
  stage.replaceChildren(element("div", "surprise-toast", text), ...surpriseScenes[choice]());
  playSlowly(stage);
  clearTimeout(surpriseTimer);
  surpriseTimer = setTimeout(() => stage.replaceChildren(), 12000 / sceneSpeed);
}

// ---- Slot machine keys ------------------------------------------------------------------------
// After a typo-free finish, three neighbouring letter keys spin like the reels of a slot machine, stop one
// at a time, hold, and roll on back to their letters. About one finish in three is three of a kind and the
// keys light up; every fifth flawless finish in a row is a jackpot of golden D coins.
const slotSymbols = ["coin", "gem", "heart", "star", "apple", "cake", "slime", "pig", "diamondore"];
const slotRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
let slotRun = null;

// Fills a reel with a strip of faces and rolls it downward from `from` to `to`: a small pull back, a fast spin,
// a braking run that overshoots a little, and a settle. A one-character face is the key's own letter;
// any other face names a sprite.
function rollReel(reel, from, to, duration, delay = 0) {
  const windup = Math.min(90, duration * .07), settle = Math.min(160, duration * .12), brake = Math.min(480, duration * .4);
  const speed = .02; // cells per millisecond at full spin
  const travel = Math.max(2, Math.round(speed * (duration - windup - settle - brake) + speed * brake / 3));
  const faces = [to, ...Array.from({ length: travel - 1 }, () => pick(slotSymbols)), from];
  const strip = element("span", "slot-strip");
  strip.style.height = `${faces.length * 100}%`;
  strip.append(...faces.map((face) => {
    const cell = element("span", "slot-cell");
    cell.append(face.length === 1 ? element("span", "slot-letter", face) : pixelSprite(face, 1));
    return cell;
  }));
  reel.replaceChildren(strip);
  // `moved` is how many cells the strip has rolled; the strip's own height is faces.length cells.
  const at = (moved) => ({ transform: `translateY(${(-(travel - moved) / faces.length * 100).toFixed(3)}%)` });
  const brakeFrom = travel - speed * brake / 3;
  return strip.animate([
    { ...at(0), easing: "ease-out" },
    { ...at(-.12), offset: windup / duration, easing: "linear" },
    { ...at(brakeFrom), offset: (duration - settle - brake) / duration, easing: "cubic-bezier(.33, 1, .68, 1)" },
    { ...at(travel + .14), offset: (duration - settle) / duration, easing: "ease-in-out" },
    at(travel)
  ], { duration, delay, fill: "both" });
}

function clearSlots() {
  if (!slotRun) return;
  slotRun.timers.forEach(clearTimeout);
  slotRun.animations.forEach((animation) => animation.cancel());
  for (const key of slotRun.keys) {
    key.classList.remove("slot-spin", "slot-win");
    key.querySelectorAll(".slot-reel, .slot-bubble").forEach((node) => node.remove());
  }
  slotRun = null;
}

// Rolls the reels back to their letters. `quick` is for a new exercise starting while they still show symbols.
function rollSlotsBack(run, quick = false) {
  if (slotRun !== run || run.rolling) return;
  run.rolling = true;
  run.timers.forEach(clearTimeout);
  run.animations.forEach((animation) => animation.cancel());
  run.animations = run.keys.map((key, index) => {
    key.classList.remove("slot-win");
    key.querySelector(".slot-bubble")?.remove();
    const reel = key.querySelector(".slot-reel");
    reel.classList.add("fading");
    return rollReel(reel, run.faces[index], run.letters[index], quick ? 260 : 700, quick ? 0 : index * 150);
  });
  Promise.all(run.animations.map((animation) => animation.finished)).then(() => {
    if (slotRun === run) clearSlots();
  }, () => {});
}

function spinSlotKeys(jackpot = false) {
  if (settings.festive !== "pixel" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (keyboardFigure.hidden || keyboard.getClientRects().length === 0) return;
  clearSlots();
  const row = pick(slotRows);
  const start = Math.floor(Math.random() * (row.length - 2));
  const keys = [...row.slice(start, start + 3)].map((letter) => keyMap.get(letter).key);
  const triple = jackpot || chance(.3);
  let faces = Array.from({ length: 3 }, () => pick(slotSymbols));
  if (triple) faces = Array(3).fill(jackpot ? "dcoin" : faces[0]);
  else if (faces[0] === faces[1] && faces[1] === faces[2]) faces[2] = pick(slotSymbols.filter((symbol) => symbol !== faces[0]));
  const run = { keys, faces, letters: keys.map((key) => key.querySelector(".base").textContent), timers: [], animations: [], rolling: false };
  slotRun = run;
  const stops = [1300, 1750, 2200];
  run.animations = keys.map((key, index) => {
    const reel = element("span", "slot-reel");
    key.classList.add("slot-spin");
    key.append(reel);
    // Each reel clunks as it lands.
    run.timers.push(setTimeout(() => {
      if (settings.sound && soundContext()) playPress(" ");
    }, stops[index] - 160));
    return rollReel(reel, run.letters[index], faces[index], stops[index]);
  });
  const settled = stops.at(-1) + 60;
  const nearMiss = !triple && faces[0] === faces[1];
  if (triple || nearMiss) {
    run.timers.push(setTimeout(() => {
      if (triple) keys.forEach((key) => key.classList.add("slot-win"));
      const line = jackpot ? "JACKPOT!" : triple ? pick(["THREE OF A KIND!", "WINNER!", "TRIPLE!", "BIG WIN!"]) : "SO CLOSE!";
      keys[1].append(element("span", "surprise-bubble slot-bubble", line));
    }, settled));
  }
  run.timers.push(setTimeout(() => rollSlotsBack(run), settled + (triple ? 2600 : nearMiss ? 1800 : 1400)));
}

// A new exercise hides the result banner; any reels still showing symbols roll straight back to their letters.
new MutationObserver(() => {
  if (resultBanner.hidden && slotRun) rollSlotsBack(slotRun, true);
}).observe(resultBanner, { attributes: true, attributeFilter: ["hidden"] });

// Counts typo-free finishes in a row (this session) and plays a surprise for each one.
function noteFinish(flawless) {
  dismissFingerCheck();
  flawlessStreak = flawless ? flawlessStreak + 1 : 0;
  if (!flawless) return;
  pixelSurprise();
  spinSlotKeys(flawlessStreak % 5 === 0);
}

// The block world theme has no button: typing "daniel" anywhere turns it on, and typing it again turns it off.
const secretWord = "daniel";
let secretTyped = "";

function noteSecretKey(event) {
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
  if (event.target.closest("input, select, textarea, [contenteditable]")) return;
  secretTyped = (secretTyped + event.key.toLowerCase()).slice(-secretWord.length);
  if (secretTyped !== secretWord) return;
  secretTyped = "";
  event.preventDefault();
  settings.festive = settings.festive === "pixel" ? null : "pixel";
  saveSettings();
  applyFestiveTheme();
  // The letters of the word were typed into the exercise; start it over so they don't count as typos.
  if (round.endedAt === null && round.position + round.mistakes > 0) startRound(false);
  else showFingerCheck(round.endedAt === null && welcomePanel.hidden);
  if (settings.festive === "pixel") setTimeout(() => pixelSurprise(pick(["zombie", "wallbreak", "dance"]), "HI DANIEL!"), 150);
}

// More secret words, for block world only. Typing one plays its scene. If the exercise was asking for
// exactly those letters, it was just typing and nothing happens; otherwise the exercise starts over so
// the letters don't count as typos.
const funWords = {
  oink: [["flyingpigs", "pigdisco", "pigtower", "pigriders", "pigrain"], "OINK OINK!"],
  zombie: [["wallbreak"], "BRAAAINS!"],
  dolphin: [["dolphins"], "EEE EEE!"],
  disco: [["pigdisco"], "PIG DISCO!"],
  floss: [["dance"], "FLOSS TIME!"],
  dab: [["dance"], "DAB!"],
  party: [["zombieparty"], "PARTY TIME!"],
  chaos: [["chaos"], "TOTAL CHAOS!"]
};
let funTyped = "";

function noteFunWord(event) {
  if (settings.festive !== "pixel" || event.defaultPrevented) return;
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
  if (event.target.closest("input, select, textarea, [contenteditable]")) return;
  funTyped = (funTyped + event.key.toLowerCase()).slice(-8);
  const word = Object.keys(funWords).find((candidate) => funTyped.endsWith(candidate));
  if (!word) return;
  funTyped = "";
  const inRound = resultBanner.hidden && round.endedAt === null;
  if (inRound && round.pending.length === 0
    && round.characters.slice(round.position - word.length + 1, round.position + 1).toLowerCase() === word) return;
  event.preventDefault();
  if (round.endedAt === null && round.position + round.mistakes > 0) startRound(false);
  const [scenes, cheer] = funWords[word];
  setTimeout(() => pixelSurprise(pick(scenes), cheer), 120);
}

// Cheat mode (block world only, this session only): three backticks turn it on or off, and with it on,
// typing a, b, c finishes the current exercise as a flawless win. Cheat wins are never saved.
const cheatToggle = "```";
const cheatWord = "abc";
let cheatTyped = "";
let cheatMode = false;

function pixelToast(text) {
  const stage = get("pixel-surprise");
  stage.replaceChildren(element("div", "surprise-toast", text));
  clearTimeout(surpriseTimer);
  surpriseTimer = setTimeout(() => stage.replaceChildren(), 5000);
}

function cheatWin() {
  if (!resultBanner.hidden || round.endedAt !== null) startRound(false);
  const total = round.characters.length;
  Object.assign(round, { cheated: true, pending: [], position: total, correct: total, mistakes: 0, lastWrong: null, lastKeyAt: null, activeMs: Math.max(1200, total * 55) });
  round.typoPositions.clear();
  round.misses.clear();
  for (const cell of round.cells) cell.classList.add("done");
  renderPending();
  updateProgress();
  finishRound();
}

function noteCheatKey(event) {
  if (settings.festive !== "pixel" || event.defaultPrevented) return;
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
  if (event.target.closest("input, select, textarea, [contenteditable]")) return;
  // A backtick the exercise is asking for is just typing, not part of the code.
  const expected = resultBanner.hidden && round.endedAt === null ? round.characters[round.position] : null;
  const key = event.key === "`" && expected === "`" ? "·" : event.key.toLowerCase();
  cheatTyped = (cheatTyped + key).slice(-cheatToggle.length);
  if (cheatTyped === cheatToggle) {
    cheatTyped = "";
    event.preventDefault();
    cheatMode = !cheatMode;
    if (cheatMode) document.documentElement.dataset.cheats = "on";
    else delete document.documentElement.dataset.cheats;
    // The backticks went into the exercise as typos; start it over.
    if (round.endedAt === null && round.position + round.mistakes > 0) startRound(false);
    pixelToast(cheatMode ? "CHEATS ON" : "CHEATS OFF");
    return;
  }
  if (cheatMode && cheatTyped === cheatWord) {
    cheatTyped = "";
    event.preventDefault();
    cheatWin();
  }
}

// ---- Finger check ------------------------------------------------------------------------------
// Before each exercise in block world, someone from block world pops up in the bottom corner with a joke about
// putting fingers on the right keys, and ducks away on the first key. The jokes are silly, but the advice in each
// one is real and matches the keyboard guide's fingering (content.js, keyboard.js). A line with `keys` only
// comes up when the exercise has at least one of those keys.
const fingerWarnings = [
  // The zombie wants to eat any finger in the wrong place.
  { who: "zombie", line: "Left fingers on A S D F. Right fingers on J K L ;. Any finger that wanders off is my snack." },
  { who: "zombie", line: "Feel the little bumps on F and J? Your index fingers live there. Fingers that move out get nibbled." },
  { who: "zombie", line: "Space is for THUMBS. Press it with any other finger and I bite that finger. Braaains!" },
  { who: "zombie", line: "After every reach, the finger goes back to the home row. Fingers that don't come home... I find them." },
  { who: "zombie", line: "Capital letter? Hold Shift with the OTHER hand. Same-hand Shift looks crunchy. Mmm." },
  { who: "zombie", line: "No peeking at the keys! Peekers get nibbled. Eyes on the screen, find the keys by feel." },
  { who: "zombie", line: "Your pinkies rest on A and ;. A lazy pinky is a tasty pinky." },
  { who: "zombie", line: "Curve your fingers like you're holding a tiny apple. Flat fingers look like zombie pancakes." },
  { who: "zombie", line: "I used the wrong fingers once. Now I have no fingers. Learn from me: A S D F, J K L ;." },
  { who: "zombie", line: "Typing with one finger? That finger gets VERY tired. And VERY tasty. Use all ten." },
  { who: "zombie", keys: "qaz", line: "Q, A and Z belong to your left pinky. Use any other finger and I nibble it. Fair is fair." },
  { who: "zombie", keys: "yhn", line: "Y, H and N are RIGHT index keys. Grab them with your left hand and that hand is lunch." },
  { who: "zombie", keys: "b", line: "B is a LEFT index key, even if it looks far. Right hand reaching for B? CHOMP." },
  { who: "zombie", keys: "4567", line: "4 and 5: left index. 6 and 7: right index. Mix them up and I start counting your fingers." },
  { who: "zombie", keys: "\n", line: "Return is the right pinky's job. Slap it with your whole hand and I take the hand. Kidding. Mostly." },
  { who: "baby", line: "Me small. Me still bite. Left pinky on A, right pinky on ;. Now!" },
  { who: "baby", line: "Me so hungry. Me only eat wrong fingers. Keep yours on the home row and me stay hungry. Sad." },
  // The dolphin has no fingers and can't believe you aren't using yours properly.
  { who: "dolphin", line: "If I had fingers, I'd keep them on the home row all day. You HAVE fingers! Ten of them!" },
  { who: "dolphin", line: "I type with my NOSE and I still hit the right keys. You have fingers. Index fingers on F and J!" },
  { who: "dolphin", line: "I'd trade the whole ocean for ten fingers. And I'd put them on A S D F and J K L ;. Every time." },
  { who: "dolphin", line: "EEE EEE! That means: thumbs on Space. Not your index finger. THUMBS. I'd give anything for thumbs." },
  { who: "dolphin", line: "You have two pinkies and you let them do nothing? I have ZERO pinkies. Zero!" },
  { who: "dolphin", line: "My flippers can't feel the bumps on F and J. Your fingers can! That's how you find home without looking." },
  { who: "dolphin", line: "If I had fingers, I'd never look down at the keyboard. Eyes on the screen, like a pro. Hint hint." },
  { who: "dolphin", keys: "swxlo", line: "S, W and X are left ring finger keys. L and O are right ring finger keys. I don't even have ring fingers. You have two!" },
  { who: "dolphin", keys: "p;", line: "If I had a right pinky, I'd press P and ; with it every single time. You have one. Use it!" },
  { who: "dolphin", keys: "ei", line: "The E key is for your left middle finger, the I key for your right. I'd use mine if I had any. Sad flippers." },
  // The pig always uses the correct hooves, and wants you to know it.
  { who: "pig", line: "I always use the correct hooves. Left hoof on A S D F, right hoof on J K L ;. Very proper. Oink." },
  { who: "pig", line: "Even I press Space with my thumb-hooves. Thumbs on Space, please. Oink." },
  { who: "pig", line: "A proper pig goes back to the home row after every reach. Like going back to the mud. Ahh." },
  { who: "pig", line: "Pigs never look at the keyboard. We type by feel. And by smell. You can skip the smell part." },
  { who: "pig", line: "Capital L? Left Shift. Capital A? Right Shift. Always the opposite hoof. Easy peasy, oinky squeezy." },
  { who: "pig", line: "Snout check: index fingers on the F and J bumps. Feel them? Excellent. Oink of approval." },
  { who: "pig", line: "Slow and correct beats fast and sloppy. Mud should be sloppy. Fingers should not." },
  { who: "pig", line: "Wrists straight, fingers curved, shoulders relaxed. I'm a PIG and I do it. What's your excuse?" },
  { who: "pig", keys: "cm", line: "C is left middle finger. M is right index finger. I never mix them up, because I'm perfect. Oink." },
  { who: "pig", keys: ",.", line: "Comma: right middle finger. Period: right ring finger. Pig grammar is VERY proper." },
  { who: "pig", keys: "/'", line: "Slash and quote both belong to the right pinky. My hooves never miss. Well, almost never." },
  // The rest of the gang.
  { who: "chick", line: "Peep! Every finger has its own keys. Don't make one finger do all the work. Peep!" },
  { who: "chick", keys: "rtfgvb", line: "Peep! R, T, F, G, V and B all belong to your left index finger. Busy little finger!" },
  { who: "chick", keys: "yuhjnm", line: "Peep peep! Y, U, H, J, N and M are all right index finger keys. The busiest finger in town!" },
  { who: "slime", line: "Boing! Bouncing is for slimes. Fingers tap lightly, then spring right back to the home row." },
  { who: "villager", keys: "x", line: "Hrrm. Trade offer: you press X with your left ring finger, I give you one emerald. Hmmm." },
  { who: "villager", keys: "z", line: "Hmmm. Z is the left pinky's key. Not the ring finger. Hrrrm." },
  { who: "dragon", line: "RAWR! I guard treasure. You guard the home row. Fingers on A S D F and J K L ; before you start!" },
  { who: "dragon", keys: "1234567890", line: "Numbers: reach up from the home row with the same finger. 1 is left pinky, 0 is right pinky. RAWR!" },
  { who: "knight", line: "By my honour: thumbs on Space, index fingers on F and J, and NO peeking. Onward!" },
  { who: "knight", keys: "-=[]", line: "Hark! Hyphen, equals and the brackets belong to the right pinky. A long reach, but a noble one." }
];
// Everyone faces right, toward their speech bubble.
const fingerCast = {
  zombie: () => pixelSprite("zombie", 4, ["zombie1", "zombie2"]),
  baby: () => facingRight(walker("bwalk", 3.6, ".4s")),
  dolphin: () => facingRight(pixelSprite("dolphin", 3.4)),
  pig: () => facingRight(blockPig(3.2, { walk: false, shades: true })),
  chick: () => hopping("chick", 4.4),
  slime: () => pixelSprite("slime", 6),
  villager: () => facingRight(pixelSprite("vwalk1", 3)),
  dragon: () => pixelSprite("dragon", 3, ["dragonup", "dragondown"]),
  knight: () => pixelSprite("rider", 3.6, ["rider1", "rider2"])
};
const fingerCheckBox = get("finger-check");
const usedWarnings = new Set();
let lastWarner = null;

// A line that hasn't come up yet (all of them once every line has), from someone other than last time.
// Lines about this exercise's own keys come up a bit more often than their share.
function takeFingerWarning() {
  const text = round.characters.toLowerCase();
  const fits = fingerWarnings.filter((warning) => !warning.keys || [...warning.keys].some((key) => text.includes(key)));
  let fresh = fits.filter((warning) => !usedWarnings.has(warning));
  if (fresh.length === 0) {
    fits.forEach((warning) => usedWarnings.delete(warning));
    fresh = fits;
  }
  const someoneNew = fresh.filter((warning) => warning.who !== lastWarner);
  if (someoneNew.length) fresh = someoneNew;
  const aboutTheseKeys = fresh.filter((warning) => warning.keys);
  const warning = aboutTheseKeys.length && chance(.4) ? pick(aboutTheseKeys) : pick(fresh);
  usedWarnings.add(warning);
  lastWarner = warning.who;
  return warning;
}

// Called as each exercise starts; `show` is false while the welcome choice is up.
function showFingerCheck(show = true) {
  if (!show || settings.festive !== "pixel") {
    fingerCheckBox.hidden = true;
    return;
  }
  const { who, line } = takeFingerWarning();
  const say = element("div", "finger-check-say");
  say.append(element("strong", "finger-check-title", "FINGER CHECK!"), element("span", "", line));
  const speaker = element("div", `finger-check-who ${who}`);
  speaker.append(fingerCast[who]());
  fingerCheckBox.classList.remove("leaving");
  // Hiding it first, with a layout in between, restarts the pop-up animation when one is already showing.
  fingerCheckBox.hidden = true;
  fingerCheckBox.getBoundingClientRect();
  fingerCheckBox.replaceChildren(speaker, say);
  fingerCheckBox.hidden = false;
}

// The first key of the exercise (or leaving it) sends whoever it was back down.
function dismissFingerCheck() {
  if (fingerCheckBox.hidden || fingerCheckBox.classList.contains("leaving")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) fingerCheckBox.hidden = true;
  else fingerCheckBox.classList.add("leaving");
}
fingerCheckBox.addEventListener("animationend", (event) => {
  if (event.animationName !== "finger-check-out") return;
  fingerCheckBox.hidden = true;
  fingerCheckBox.classList.remove("leaving");
});
// The course map and history pages cover the exercise, so the finger check goes too.
const coverWatch = new MutationObserver(() => {
  if (!library.hidden || !get("history").hidden) dismissFingerCheck();
});
for (const page of [library, get("history")]) coverWatch.observe(page, { attributes: true, attributeFilter: ["hidden"] });
