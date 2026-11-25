"use strict";

// ---- Courses -------------------------------------------------------------

// Each focus has a library of units (every drill, grouped by kind) and a short guided course through it.
// A course lesson names a skill, lists a few library drills in teaching order as "<unit id>-<number>",
// and ends with a checkpoint: a fresh mix built from `check` (by default, the lesson's own drills).
function itemsOf(unit) {
  const items = unit.phrases ? unit.drills.map((drill) => drill.prompt) : unit.drills.flatMap((drill) => drill.prompt.split(" "));
  return [...new Set(items.filter(Boolean))];
}

const courseLesson = (id, name, drills, check = drills) => ({ id, name, drills, check });
const numbered = (unitId, from, to) => Array.from({ length: to - from + 1 }, (_, index) => `${unitId}-${from + index}`);

// Kept so progress from the earlier 100-drill course carries over where the same run still exists.
const legacyRuns = [
  "27", "80", "4=", "`9", "-3", "518", "0-=", "`46", "907", "2=5", "1638", "29-4", "5`07", "=372", "9086",
  "47390", "`1=52", "80624", "7-359", "2-6=8", "264907", "`58-31", "=70842", "952-67", "7`3=60",
  "3840915", "=27`609", "65-0482", "1`4-793", "8905=32", "3-781=25", "0682`945", "5=921-73", "`482-710", "2674059=",
  "73826-401", "=1495`820", "827=3-051", "`296-5817", "4=70`2639"
];

function numberRowCourse() {
  const reachKeys = [..."`1234567890-="];
  const reach = (key) => `${homeOf[key]}${key}${homeOf[key]}`;
  const climb = (digit) => `${columnOf[digit].slice(1)}${digit}`;
  const reverse = (text) => [...text].reverse().join("");
  const weave = (numbers, letters, letterFirst = false) => [...numbers].map((digit, index) => (letterFirst ? letters[index] + digit : digit + letters[index])).join("");
  const handDrills = (hand, keys) => {
    const k = [...keys];
    const trill = (a, b) => `${a}${b}${a}${b} ${b}${a}${b}${a}`;
    return [
      { title: `${hand} hand: ${k[0]} to ${k[4]} and back`, prompt: `${keys} ${reverse(keys)}` },
      { title: `${hand} hand: three-key runs`, prompt: `${keys.slice(0, 3)} ${keys.slice(1, 4)} ${keys.slice(2, 5)}` },
      { title: `${hand} hand: three-key runs back`, prompt: `${reverse(keys.slice(2, 5))} ${reverse(keys.slice(1, 4))} ${reverse(keys.slice(0, 3))}` },
      ...[[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [1, 3], [2, 4], [0, 3], [1, 4], [0, 4]]
        .map(([a, b]) => ({ title: `${hand} hand: ${k[a]} and ${k[b]}`, prompt: trill(k[a], k[b]) })),
      { title: `${hand} hand: zigzag`, prompt: `${k[0]}${k[2]}${k[1]}${k[3]}${k[2]}${k[4]} ${k[4]}${k[2]}${k[3]}${k[1]}${k[2]}${k[0]}` },
      { title: `${hand} hand: outside in`, prompt: `${k[0]}${k[4]}${k[1]}${k[3]}${k[2]} ${k[2]}${k[3]}${k[1]}${k[4]}${k[0]}` }
    ];
  };

  const units = [
    {
      id: "reach", name: "Reach and return", short: "Reaches",
      instruction: "Reach from the home key to the number and come straight back. Keep the other fingers resting on the home row.",
      drills: [
        ...reachKeys.map((key) => ({ title: `Reach for ${keyName(key)}`, prompt: repeatItems([reach(key)], 3) })),
        ...reachKeys.slice(0, -1).map((key, index) => ({
          title: `Reach for ${keyName(key)} and ${keyName(reachKeys[index + 1])}`,
          prompt: repeatItems([reach(key), reach(reachKeys[index + 1])], 2)
        })),
        { title: "Left-hand reaches", prompt: [..."`12345"].map(reach).join(" ") },
        { title: "Right-hand reaches", prompt: [..."67890-="].map(reach).join(" ") },
        { title: "Both hands, alternating", prompt: [..."17283940"].map(reach).join(" ") }
      ]
    },
    {
      id: "paths", name: "Finger paths", short: "Paths",
      instruction: "Climb the finger's column one row at a time, then come back down the same way.",
      drills: [
        ...digitKeys.map((digit) => ({ title: `Climb to ${digit}`, prompt: repeatItems([climb(digit), reverse(climb(digit))], 2) })),
        ...digitKeys.map((digit) => ({ title: `Whole column to ${digit}`, prompt: repeatItems([columnOf[digit] + digit, reverse(columnOf[digit] + digit)], 2) })),
        { title: "Left index columns", prompt: repeatItems([climb("4"), climb("5")], 2) },
        { title: "Right index columns", prompt: repeatItems([climb("7"), climb("6")], 2) },
        { title: "Left-hand climbs", prompt: [..."12345"].map(climb).join(" ") },
        { title: "Right-hand climbs", prompt: [..."67890"].map(climb).join(" ") },
        { title: "Alternating climbs 1", prompt: [..."4738"].map(climb).join(" ") },
        { title: "Alternating climbs 2", prompt: [..."2910"].map(climb).join(" ") },
        { title: "Alternating climbs 3", prompt: [..."5647"].map(climb).join(" ") },
        { title: "Alternating climbs 4", prompt: [..."3829"].map(climb).join(" ") }
      ]
    },
    {
      id: "hands", name: "One hand at a time", short: "One hand",
      instruction: "Type each number with one hand only. Keep the other hand resting on its home keys.",
      drills: [...handDrills("Left", "12345"), ...handDrills("Right", "67890")]
    },
    {
      id: "alternation", name: "Number–letter alternation", short: "Number–letter",
      instruction: "Alternate numbers and letters. Each reach up should end with the finger back near home.",
      generate: () => Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => {
        const digit = pick(digitKeys);
        return digit + pick([...columnOf[digit]]);
      }).join(""),
      drills: [
        { title: "Left digits with home keys", prompt: weave("12345", "asdfg") },
        { title: "Right digits with home keys", prompt: weave("67890", "hjkl;") },
        { title: "Home keys, then left digits", prompt: weave("12345", "asdfg", true) },
        { title: "Home keys, then right digits", prompt: weave("67890", "hjkl;", true) },
        { title: "Left digits with the top row", prompt: weave("12345", "qwert") },
        { title: "Right digits with the top row", prompt: weave("67890", "yuiop") },
        { title: "Top row, then left digits", prompt: weave("12345", "qwert", true) },
        { title: "Top row, then right digits", prompt: weave("67890", "yuiop", true) },
        { title: "Left digits with the bottom row", prompt: weave("12345", "zxcvb") },
        { title: "Right digits with the bottom row", prompt: weave("67890", "nm,./") },
        { title: "Left digits, right letters", prompt: weave("1234", "jkl;") },
        { title: "Right digits, left letters", prompt: weave("6789", "asdf") },
        { title: "Right letters, left digits", prompt: weave("1234", "jkl;", true) },
        { title: "Left letters, right digits", prompt: weave("6789", "asdf", true) },
        { title: "Grid squares", prompt: "a1 b2 c3 d4 e5 f6 g7 h8" },
        { title: "Grid squares backwards", prompt: "h1 g2 f3 e4 d5 c6 b7 a8" },
        { title: "Chess openings", prompt: "e4 e5 d4 d5 c4 c5 f4 f5" },
        { title: "Grid diagonal", prompt: "a8 b7 c6 d5 e4 f3 g2 h1" },
        { title: "Left index pair", prompt: "4f5g4f5g" },
        { title: "Right index pair", prompt: "7j6h7j6h" },
        { title: "Middle fingers", prompt: "3d8k3d8k" },
        { title: "Ring fingers", prompt: "2s9l2s9l" },
        { title: "Little fingers", prompt: "1a0;1a0;" },
        { title: "Odd digits", prompt: "1a3d5g7j9l" },
        { title: "Even digits", prompt: "2s4f6h8k0;" }
      ]
    },
    {
      id: "runs", name: "Pairs and runs", short: "Pairs & runs",
      instruction: "Pairs across both hands come first, left to right and then right to left, then same-hand pairs and longer runs.",
      generate: () => Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => pick(digitKeys)).join(""),
      drills: [
        ...[..."12345"].map((left) => ({ title: `Cross-hand pairs from ${left}`, prompt: [..."67890"].map((right) => left + right).join(" ") })),
        ...[..."67890"].map((right) => ({ title: `Cross-hand pairs from ${right}`, prompt: [..."12345"].map((left) => right + left).join(" ") })),
        { title: "Left-hand pairs up", prompt: "12 23 34 45" },
        { title: "Left-hand pairs down", prompt: "21 32 43 54" },
        { title: "Right-hand pairs up", prompt: "67 78 89 90" },
        { title: "Right-hand pairs down", prompt: "76 87 98 09" },
        ...["518", "907", "1638", "9086", "47390", "80624", "264907", "=70842", "3840915", "65-0482", "3-781=25", "0682`945", "73826-401", "827=3-051", "`296-5817", "4=70`2639"]
          .map((run) => ({ title: `${run.length}-key run`, prompt: run }))
      ]
    },
    {
      id: "words", name: "Numbers in words", short: "In words", phrases: true,
      instruction: "Type numbers the way they appear in everyday words and phrases.",
      drills: [
        "3 cats 4 dogs 5 hens", "room 404 room 12 room 7", "page 17 page 42 page 300", "v2 v3 v10 v1", "b12 a4 c7 d9",
        "1st 2nd 3rd 4th 5th", "6th 7th 8th 9th 10th", "11 eggs 12 rolls 13 pies", "bus 42 to gate 8", "row 3 seat 14",
        "top 10 and top 20", "mp3 mp4 h264 4k", "2 or 3 more times", "for 5 to 10 minutes", "level 9 of 12", "year 1 and year 2",
        "track 6 side b", "flight 207 at 6", "apt 5b floor 3", "add 4 cups and 2 eggs", "test 1 test 2 test 3", "only 1 in 10 left",
        "zone 7 area 51", "win 3 lose 1 tie 2", "x2 x3 x4 x10", "route 66 exit 12", "p2p b2b 24h 365", "step 1 then step 2"
      ].map((prompt, index) => ({ title: `Everyday numbers ${index + 1}`, prompt }))
    },
    {
      id: "shifted", name: "Shifted row", short: "Shifted",
      instruction: "Hold Shift with the opposite hand, then tap the number key for its symbol.",
      drills: [
        ...numberRow.map(([base, upper]) => ({ title: `${keyName(base)} and ${upper}`, prompt: `${base}${upper}${base}${upper} ${upper}${base}${upper}${base}` })),
        { title: "Left shifted neighbours", prompt: "!@ @# #$ $% %!" },
        { title: "Right shifted neighbours", prompt: "^& &* *( () )^" },
        ...["$5 $10 $25 $99", "50% 75% 100% 5%", "#3 #12 #40 #7", "(1) (2) (3) (4)", "a*b c*d 2*3", "x+y z+1 a+b", "5! 3! 10! 2!",
          "@home @work @team", "a_b c_d snake_case", "~/docs ~/src ~/app", "1+1=2 2+2=4 3+3=6"]
          .map((prompt, index) => ({ title: `Symbols in use ${index + 1}`, prompt }))
      ]
    },
    {
      id: "formats", name: "Real formats", short: "Formats", phrases: true,
      instruction: "Practice the formats you meet every day: dates, times, prices, versions, and more.",
      drills: [
        ["ISO dates", "2024-06-18 2025-01-02 1999-12-31"], ["Day and month", "18/06 25/12 01/01 30/04"], ["24-hour times", "09:45 12:30 18:05 23:59"],
        ["12-hour times", "7:15 am 8:40 pm 11:05 am"], ["Prices", "$19.99 $4.50 $120 $0.99"], ["Percentages", "15% 40% 99.9% 7.5%"],
        ["Phone numbers", "555-0132 555-0199 555-0147"], ["International numbers", "+1 555 0100 +44 20 7946 0018"], ["Version numbers", "v1.2.3 v2.0.1 v10.4.0"],
        ["IP addresses", "192.168.0.1 10.0.0.8 127.0.0.1"], ["Sums", "3+4=7 9-5=4 12+8=20"], ["Products", "2*3=6 8*7=56 9*9=81"],
        ["Fractions", "1/2 3/4 7/8 5/16"], ["Scores", "3-1 2-2 0-4 5-3"], ["Ranges", "10-20 30-40 1-100"],
        ["Measurements", "12kg 3.5m 250ml 40cm"], ["Temperatures", "21c 72f -5c 98.6f"], ["Numbered lists", "1. 2. 3. 4. 5."],
        ["Postal codes", "90210 10001 60614 94103"], ["Order numbers", "order 58213-07 ref 4471-2"], ["Hex colours", "#ff8800 #00aa33 #1e1e2e"],
        ["Coordinates", "51.50, -0.12 40.71, -74.00"], ["Years", "1999 2000 2024 2025"], ["Durations", "1h 30m 45s 2h 05m"],
        ["Screen ratios", "16:9 4:3 21:9 1:1"], ["Array indexes", "arr[0] arr[12] list[3]"], ["Price ranges", "$5-$10 $20-$30 $99-$149"],
        ["Thousands", "1,000 25,000 1,250,000"]
      ].map(([title, prompt]) => ({ title, prompt }))
    }
  ];

  // Fixed mixes of two units at a time. They were this focus's checkpoints before each lesson had its own;
  // the unit keeps its id so earlier progress still counts.
  const random = seededRandom(2024);
  const byId = (id) => units.find((unit) => unit.id === id);
  const checkpointDrills = [["reach", "paths"], ["hands", "alternation"], ["runs", "words"], ["shifted", "formats"]].flatMap(([a, b], group) => {
    const pool = [...itemsOf(byId(a)), ...itemsOf(byId(b))];
    return Array.from({ length: 6 }, (_, index) => {
      const items = [];
      for (const item of shuffle(pool, random)) {
        items.push(item);
        if (items.join(" ").length >= 32) break;
      }
      return { title: `Review ${group + 1}.${index + 1}: ${byId(a).short} and ${byId(b).short}`, prompt: items.join(" ") };
    });
  });
  units.push({
    id: "checkpoints", name: "Mixed review", short: "Review", review: true,
    instruction: "Fixed mixes from two units at a time, for extra review.", drills: checkpointDrills
  });

  return {
    id: "number", name: "Number row", units,
    lessons: [
      courseLesson("reach", "Reach the number keys",
        ["reach-18", "reach-20", "paths-21", "paths-22", "reach-16", "reach-22", "reach-15", "reach-23", "reach-26", "reach-27"]),
      courseLesson("hands", "Type numbers with one hand", ["hands-1", "hands-2", "hands-3", "hands-14", "hands-16", "hands-17", "hands-18", "hands-29"]),
      courseLesson("pairs", "Type number pairs and runs", ["runs-1", "runs-3", "runs-5", "runs-6", "runs-8", "runs-10", "runs-15", "runs-17", "runs-19"]),
      courseLesson("letters", "Mix numbers with letters",
        ["alternation-1", "alternation-2", "alternation-5", "alternation-6", "alternation-9", "alternation-10", "alternation-15", "alternation-17"]),
      courseLesson("words", "Type numbers in everyday words", ["words-1", "words-2", "words-3", "words-6", "words-9", "words-10", "words-14", "words-20"]),
      courseLesson("formats", "Type dates and times", ["formats-23", "formats-1", "formats-2", "formats-3", "formats-4", "formats-24", "formats-7", "formats-9"]),
      courseLesson("symbols", "Type symbols and prices",
        ["shifted-14", "shifted-15", "shifted-5", "shifted-6", "shifted-16", "shifted-17", "formats-5", "shifted-19", "shifted-26"])
    ],
    text: { name: "Numbers in context", short: "Numbers", kind: "sentences", list: numberSentences }
  };
}

function homeRowCourse() {
  return {
    id: "home", name: "Home row",
    text: { name: "Home-row words", short: "Words", kind: "words", list: homeWords },
    units: [
      {
        id: "keys", name: "Home keys", short: "Keys",
        instruction: "Rest all eight fingers on the home row, with a thumb over Space, and tap without looking. Feel for the bumps on F and J.",
        drills: [
          ["Index fingers and Space", "fff jjj fj jf fj jf"], ["Middle fingers", "ddd kkk dk kd dk kd"], ["Ring fingers", "sss lll sl ls sl ls"],
          ["Little fingers", "aaa ;;; a; ;a a; ;a"], ["Reach for g", "fgf fgf gfg gfg"], ["Reach for h", "jhj jhj hjh hjh"],
          ["g and h", "fg jh gh hg fg jh"], ["Left-hand run", "asdf fdsa asdf fdsa"], ["Right-hand run", "jkl; ;lkj jkl; ;lkj"],
          ["Whole row", "asdfg hjkl; asdfg hjkl;"], ["Whole row back", ";lkjh gfdsa ;lkjh gfdsa"], ["Left pairs", "as sd df fg"],
          ["Right pairs", "hj jk kl l;"], ["Left pairs back", "gf fd ds sa"], ["Right pairs back", ";l lk kj jh"],
          ["Mirror pairs", "fj dk sl a; fj dk sl a;"], ["Mirror pairs back", "jf kd ls ;a jf kd ls ;a"], ["Cross pairs", "fk dj sl ;a fk dj"],
          ["Wide pairs", "ak sj dl f; ak sj"], ["Doubles left", "ff dd ss aa gg"], ["Doubles right", "jj kk ll ;; hh"],
          ["Bounce left", "fdf sas dsd fgf"], ["Bounce right", "jkj l;l klk jhj"], ["Apostrophe reach", ";'; l'l ;'; a's"]
        ].map(([title, prompt]) => ({ title, prompt }))
      },
      {
        id: "words", name: "Home-row words", short: "Words",
        instruction: "Every word here uses only the home row. Keep your hands still and let the fingers do the work.",
        drills: [
          ...sampledDrills(homeWords, 26, 5, 101, (n) => `Home-row words ${n}`),
          // Words as soon as the keys allow: the first three need only the eight home keys, the last two add G and H.
          ...[
            ["First words: a sad dad", "a sad dad"], ["First words: ask a lad", "ask a lad; all fall"], ["First words: a lass asks", "a lass asks dad"],
            ["Words with g and h", "a glad lad has a flag"], ["More words with g and h", "has a hall; had a flash"]
          ].map(([title, prompt]) => ({ title, prompt }))
        ]
      },
      {
        id: "phrases", name: "Home-row phrases", short: "Phrases",
        instruction: "Short phrases with a semicolon in the middle. Tap the semicolon with your right pinky.",
        drills: sampledDrills([...homeWords, "a", "as", "a"], 24, 6, 202, (n) => `Home-row phrases ${n}`, (items) => `${items.slice(0, 3).join(" ")}; ${items.slice(3).join(" ")}`)
      },
      {
        id: "rhythm", name: "Rhythm", short: "Rhythm",
        instruction: "Each word appears twice. Type the second one a little faster than the first.",
        drills: sampledDrills(homeWords, 24, 4, 303, (n) => `Rhythm ${n}`, (items) => items.flatMap((word) => [word, word]).join(" "))
      }
    ],
    // Words arrive as soon as the keys allow, and doubled words (rhythm) run through the word lessons.
    lessons: [
      courseLesson("keys", "Find the home keys", ["keys-1", "keys-2", "keys-3", "keys-4", "words-27", "words-28", "keys-16"]),
      courseLesson("reach", "Reach for G and H", ["keys-5", "keys-6", "keys-7", "words-30", "words-31", "keys-10", "keys-11"]),
      courseLesson("words", "Type home-row words", ["words-29", "words-1", "rhythm-1", "words-2", "rhythm-2", "words-3", "keys-24"]),
      courseLesson("phrases", "Type short home-row phrases", ["phrases-1", "rhythm-3", "phrases-2", "phrases-3", "rhythm-4"])
    ]
  };
}

function topRowCourse() {
  const shortWords = topWords.filter((word) => word.length <= 4);
  const longWords = topWords.filter((word) => word.length >= 5);
  return {
    id: "top", name: "Top row", text: { name: "Top-row words", short: "Words", kind: "words", list: topWords },
    units: [
      {
        id: "keys", name: "Top keys", short: "Keys",
        instruction: "Reach up from the home row and come back down. Keep the reaching finger light.",
        drills: [
          ["Reach for r and u", "frf juj frf juj"], ["Reach for e and i", "ded kik ded kik"], ["Reach for w and o", "sws lol sws lol"],
          ["Reach for q and p", "aqa ;p; aqa ;p;"], ["Reach for t and y", "ftf jyj ftf jyj"], ["Left top run", "qwert trewq qwert trewq"],
          ["Right top run", "yuiop poiuy yuiop poiuy"], ["Whole top row", "qwertyuiop poiuytrewq"], ["Index climbs", "fr ft ju jy fr ft ju jy"],
          ["Middle climbs", "de ki ed ik de ki"], ["Ring climbs", "sw lo ws ol sw lo"], ["Little climbs", "aq ;p qa p; aq ;p"],
          ["Top pairs left", "qw we er rt"], ["Top pairs right", "yu ui io op"], ["Mirror reaches", "ru ei wo qp ty"],
          ["Mirror reaches back", "ur ie ow pq yt"], ["e and r", "er re ere rer"], ["t and h", "th ht the het"], ["o and u", "ou uo out our"],
          ["i and o", "io oi oil toil"], ["Home and top, left", "as qw df er gh ty"], ["Home and top, right", "jk ui l; op hj yu"],
          ["Common pairs", "th he er re es ed"], ["More common pairs", "to it is at or ou"],
          // Words after each pair of reaches, using only the home row and the top keys learned so far.
          ["Words with r and u", "jar fur rug sugar dusk"], ["Words with e and i", "red said fire like ride"],
          ["Words with t and y", "the try day yes stay"], ["Words with w and o", "how who work slow world"],
          ["Words with q and p", "up top quiet equal pie"]
        ].map(([title, prompt]) => ({ title, prompt }))
      },
      {
        id: "short", name: "Short words", short: "Short words",
        instruction: "Short words from the home and top rows. Return to home row between words.",
        drills: sampledDrills(shortWords, 26, 6, 404, (n) => `Short words ${n}`)
      },
      {
        id: "long", name: "Longer words", short: "Longer words",
        instruction: "Longer words that move between the home and top rows.",
        drills: sampledDrills(longWords, 26, 4, 505, (n) => `Longer words ${n}`)
      },
      {
        id: "phrases", name: "Top-row phrases", short: "Phrases",
        instruction: "Word sequences that mix short and long words at an even pace.",
        drills: [
          ...sampledDrills(topWords, 24, 5, 606, (n) => `Top-row phrases ${n}`),
          // Real phrases using only the home and top rows.
          ...["you were right", "the house is quiet", "look at the street", "she wrote a story", "pour the hot tea",
            "a quiet day at the sea", "keep your head up", "the forest is quiet", "we sat out there", "type the letter"]
            .map((prompt, index) => ({ title: `Short phrase ${index + 1}`, prompt }))
        ]
      }
    ],
    lessons: [
      courseLesson("index", "Reach up for R, U, E and I", ["keys-1", "keys-25", "keys-2", "keys-26", "keys-10", "keys-17"]),
      courseLesson("middle", "Reach up for T, Y, W and O", ["keys-5", "keys-27", "keys-9", "keys-3", "keys-28", "keys-11", "keys-18"]),
      courseLesson("corners", "Reach the corners: Q and P", ["keys-4", "keys-29", "keys-12", "keys-6", "keys-7", "keys-8"]),
      courseLesson("words", "Type common top-row words", ["keys-23", "keys-24", "short-1", "short-2", "long-1", "long-2"]),
      courseLesson("phrases", "Type short phrases", numbered("phrases", 25, 30), numbered("phrases", 25, 34))
    ]
  };
}

function bottomRowCourse() {
  return {
    id: "bottom", name: "Bottom row", text: { name: "All-letter sentences", short: "Pangrams", kind: "sentences", list: pangrams },
    units: [
      {
        id: "keys", name: "Bottom keys", short: "Keys",
        instruction: "Drop down from the home row and come back up. Keep your wrists still.",
        drills: [
          ["Reach for v and m", "fvf jmj fvf jmj"], ["Reach for c and comma", "dcd k,k dcd k,k"], ["Reach for x and period", "sxs l.l sxs l.l"],
          ["Reach for z and slash", "aza ;/; aza ;/;"], ["Reach for b and n", "fbf jnj fbf jnj"], ["Left bottom run", "zxcvb bvcxz zxcvb bvcxz"],
          ["Right bottom run", "nm,./ /.,mn nm,./ /.,mn"], ["Whole bottom row", "zxcvbnm,./ /.,mnbvcxz"], ["Index drops", "fv fb jm jn fv fb jm jn"],
          ["Middle drops", "dc k, cd ,k dc k,"], ["Ring drops", "sx l. xs .l sx l."], ["Little drops", "az ;/ za /; az ;/"],
          ["Bottom pairs left", "zx xc cv vb"], ["Bottom pairs right", "nm m, ,. ./"], ["Mirror drops", "vm c, x. z/ bn"],
          ["Mirror drops back", "mv ,c .x /z nb"], ["Column climbs left", "vfr cde xsw zaq"], ["Column climbs right", "mju ,ki .lo /;p"],
          ["c and v", "cv vc cove cave"], ["b and n", "bn nb bin nab"], ["m and n", "mn nm man men"], ["x and z", "xz zx zax xyz"],
          ["Common pairs", "an in on en un nd"], ["More common pairs", "ma me mi mo be by"],
          // Words after each group of reaches, using the rows learned so far.
          ["Words with v, m, b and n", "move very brave name number"], ["Words with c, x, comma and period", "come back, six boxes. next exam."],
          ["Words with z and slash", "zebra zone size lazy and/or"]
        ].map(([title, prompt]) => ({ title, prompt }))
      },
      {
        id: "words", name: "Bottom-row words", short: "Words",
        instruction: "Every word uses at least one bottom-row letter.",
        drills: sampledDrills(bottomWords, 26, 5, 707, (n) => `Bottom-row words ${n}`)
      },
      {
        id: "pangrams", name: "All the letters", short: "Pangrams", phrases: true,
        instruction: "Each line uses every letter of the alphabet at least once, or very nearly.",
        drills: pangrams.map((prompt, index) => ({ title: `Pangram ${index + 1}`, prompt }))
      },
      {
        id: "punctuation", name: "Comma, period and slash", short: "Comma & period",
        instruction: "Bottom-row words with the comma, period and slash on the right side of the row.",
        drills: sampledDrills(bottomWords, 24, 5, 808, (n) => `Comma, period and slash ${n}`, ([a, b, c, d, e]) => `${a}, ${b}, ${c}. ${d}/${e}.`)
      },
      {
        id: "passages", name: "Short passages", short: "Passages", phrases: true,
        instruction: "Lowercase sentences that use all three letter rows, with commas and periods.",
        drills: [
          "the old bus stops by the river at noon. we climb in, find a seat near the back, and watch the town go by.",
          "a small brown fox sleeps under the bench. when the wind picks up, it wakes, stretches, and jumps over the wall.",
          "every morning we walk to the market, buy fresh bread and milk, and come home before the rain.",
          "the jazz band plays six songs. people dance, clap, and sing. by midnight, the street is quiet again.",
          "we packed the van with boxes, a lamp, and a very old map. then we drove north, slowly, all night.",
          "my brother can juggle five lemons. he cannot cook, but he makes excellent toast."
        ].map((prompt, index) => ({ title: `Passage ${index + 1}`, prompt }))
      }
    ],
    // Pangrams stay in the library as extra variety; the course ends with plain lowercase passages.
    lessons: [
      courseLesson("index", "Drop down for V, M, B and N", ["keys-1", "keys-5", "keys-9", "keys-20", "keys-21", "keys-25"]),
      courseLesson("middle", "Reach C, X, comma and period", ["keys-2", "keys-3", "keys-10", "keys-11", "keys-19", "keys-26"]),
      courseLesson("corners", "Reach Z and slash", ["keys-4", "keys-12", "keys-22", "keys-27", "keys-6", "keys-7"]),
      courseLesson("words", "Type bottom-row words", ["keys-23", "keys-24", "words-1", "words-2", "words-3", "punctuation-1"]),
      courseLesson("passages", "Type a short passage", numbered("passages", 1, 3), numbered("passages", 4, 6))
    ]
  };
}

function capitalsCourse() {
  const letterDrill = (letter) => {
    const upper = letter.toUpperCase();
    return { title: `Capital ${upper}`, prompt: `${upper}${letter} ${letter}${upper} ${upper}${letter}${upper} ${upper}${letter}` };
  };
  return {
    id: "capitals", name: "Capitals and Shift", text: { name: "Capitals in context", short: "Sentences", kind: "sentences", list: capitalSentences },
    units: [
      {
        id: "shift", name: "Shift with the opposite hand", short: "Opposite Shift",
        instruction: "Hold Shift with the hand that is not typing the letter, then release it before the next key.",
        drills: [
          { title: "Left home capitals", prompt: "Aa Ss Dd Ff Gg" }, { title: "Left top capitals", prompt: "Qq Ww Ee Rr Tt" },
          { title: "Left bottom capitals", prompt: "Zz Xx Cc Vv Bb" }, { title: "Right home capitals", prompt: "Hh Jj Kk Ll Hh" },
          { title: "Right top capitals", prompt: "Yy Uu Ii Oo Pp" }, { title: "Right bottom capitals", prompt: "Nn Mm Nn Mm" },
          ...[..."etaoinshrdlucmwfgy"].map(letterDrill)
        ]
      },
      {
        id: "starts", name: "Sentence starts", short: "Starts", phrases: true,
        instruction: "Each sentence starts with a capital. Hold Shift with the opposite hand, type the letter, then let go.",
        drills: [
          "The sun is out. We can go.", "It is late. Turn off the light.", "My bag is red. Your bag is blue.",
          "Open the door. Let the cat in.", "We ate early. Then we read.", "Rain fell all day. Nobody minded.",
          "Keep it short. Say it twice.", "Look up. The stars are out.", "Dinner is ready. Wash your hands.",
          "Go left here. Stop at the gate."
        ].map((prompt, index) => ({ title: `Sentence starts ${index + 1}`, prompt }))
      },
      {
        id: "names", name: "Names and places", short: "Names",
        instruction: "Each word starts with a capital letter. Shift, letter, release, then the rest of the word.",
        drills: sampledDrills([...names, ...places], 26, 4, 909, (n) => `Names and places ${n}`)
      },
      {
        id: "acronyms", name: "All caps", short: "All caps",
        instruction: "Hold Shift for a whole acronym, or use Caps Lock if that is easier for you.",
        drills: sampledDrills(acronyms, 24, 5, 1102, (n) => `All caps ${n}`)
      },
      {
        id: "sentences", name: "Sentence capitals", short: "Sentences", phrases: true,
        instruction: "Full sentences with capitals at the start and on names, places and acronyms.",
        drills: capitalSentences.map((prompt, index) => ({ title: `Sentence ${index + 1}`, prompt }))
      },
      {
        id: "calendar", name: "Days and months", short: "Calendar",
        instruction: "Days of the week and months of the year, each with a capital letter.",
        drills: sampledDrills(calendarWords, 24, 4, 1001, (n) => `Days and months ${n}`)
      }
    ],
    // Acronyms come before the full sentences, which use them; days and months stay in the library.
    lessons: [
      courseLesson("shift", "Hold Shift with the opposite hand", ["shift-1", "shift-4", "shift-2", "shift-5", "shift-3", "shift-6"]),
      courseLesson("starts", "Capitalize sentence starts", numbered("starts", 1, 5)),
      courseLesson("names", "Capitalize names and places", ["names-1", "names-2", "names-3", "starts-6", "starts-7"]),
      courseLesson("acronyms", "Type acronyms in all caps", numbered("acronyms", 1, 3)),
      courseLesson("sentences", "Use capitals in full sentences", numbered("sentences", 1, 4), numbered("sentences", 5, 26))
    ]
  };
}

function punctuationCourse() {
  return {
    id: "punctuation", name: "Punctuation", text: { name: "Punctuation in context", short: "Sentences", kind: "sentences", list: punctuationSentences },
    units: [
      {
        id: "comma", name: "Comma and period", short: "Comma & period",
        instruction: "Use your right middle finger for the comma and your right ring finger for the period.",
        drills: sampledDrills(commonWords, 26, 5, 1203, (n) => `Comma and period ${n}`, ([a, b, c, d, e]) => `${a}, ${b}, ${c}. ${d}, ${e}.`)
      },
      {
        id: "colon", name: "Semicolon and colon", short: "Colon",
        instruction: "The semicolon sits under your right pinky; add Shift with your left hand for the colon.",
        drills: sampledDrills(commonWords, 24, 4, 1304, (n) => `Semicolon and colon ${n}`, ([a, b, c, d]) => `${a}: ${b}; ${c}: ${d};`)
      },
      {
        id: "quotes", name: "Apostrophes and quotes", short: "Quotes",
        instruction: "The apostrophe is next to the semicolon. Add Shift with your left hand for double quotes.",
        drills: [
          ...sampledDrills(contractions, 12, 5, 1405, (n) => `Contractions ${n}`),
          ...sampledDrills(commonWords, 12, 3, 1506, (n) => `Quotes ${n}`, ([a, b, c]) => `"${a}" '${b}' "${c}"`)
        ]
      },
      {
        id: "marks", name: "Questions, exclamations and hyphens", short: "? ! -",
        instruction: "Question and exclamation marks need Shift; the hyphen sits next to 0 on the number row.",
        drills: [
          ...sampledDrills(hyphenated, 12, 4, 1607, (n) => `Hyphenated words ${n}`),
          ...sampledDrills(commonWords, 12, 3, 1708, (n) => `Questions and exclamations ${n}`, ([a, b, c]) => `${a}? ${b}! ${c}?`)
        ]
      },
      {
        id: "brackets", name: "Brackets and slashes", short: "Brackets",
        instruction: "Parentheses sit on 9 and 0 with Shift; square brackets and the slash belong to your right pinky.",
        drills: sampledDrills(commonWords, 24, 4, 1809, (n) => `Brackets and slashes ${n}`, ([a, b, c, d]) => `(${a}) [${b}] ${c}/${d}`)
      },
      {
        id: "sentences", name: "Punctuation in sentences", short: "Sentences", phrases: true,
        instruction: "Whole sentences: dialogue, questions, lists and more. Type every mark exactly as shown.",
        drills: punctuationSentences.map((prompt, index) => ({ title: `Sentence ${index + 1}`, prompt }))
      }
    ],
    // Comma and period were taught in Bottom row, so the course starts with the new marks and ends with real
    // sentences: dialogue (2, 7), questions (1, 15) and lists (3, 13), then a checkpoint of the other sentences.
    lessons: [
      courseLesson("colon", "Use the semicolon and colon", numbered("colon", 1, 4)),
      courseLesson("quotes", "Type apostrophes and quotes", ["quotes-1", "quotes-2", "quotes-13", "quotes-14"]),
      courseLesson("marks", "Ask, exclaim and hyphenate", ["marks-1", "marks-13", "marks-2", "marks-14"]),
      courseLesson("brackets", "Add brackets and slashes", numbered("brackets", 1, 3)),
      courseLesson("sentences", "Write dialogue, questions and lists", ["sentences-2", "sentences-7", "sentences-1", "sentences-15", "sentences-3", "sentences-13"],
        [4, 5, 6, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20].map((n) => `sentences-${n}`))
    ]
  };
}

function codeCourse() {
  const units = [
    {
      id: "brackets", name: "Brackets", short: "Brackets",
      instruction: "Type each bracket pair together. [ ] and { } share your right pinky. ( and ) sit on 9 and 0, so the right ring finger "
            + "opens and the pinky closes; < and > sit on comma and period, so the right middle finger opens and the ring finger closes.",
      drills: [
        "() () () ()", "[] [] [] []", "{} {} {} {}", "<> <> <> <>", "( ) [ ] { } < >", "([]) ([]) ([])", "{[]} {[]} {[]}", "<()> <()> <()>",
        "f() g() h()", "a[0] b[1] c[2]", "{a} {b} {c}", "<a> <b> <i>", "(a, b) (c, d)", "[1, 2] [3, 4]", "{x: 1} {y: 2}", "<div></div>",
        "((a)) [[b]] {{c}}", "f(g(x)) h(i(y))", "a[b[c]] d[e[f]]", "{a: [b]} {c: (d)}", "if () {}", "for () {}", "fn() -> ()", "list<int> map<k, v>"
      ].map((prompt, index) => ({ title: `Brackets ${index + 1}`, prompt }))
    },
    {
      id: "operators", name: "Operators", short: "Operators",
      instruction: "Operators mix shifted and unshifted keys. Watch which hand holds Shift.",
      drills: [
        "= == ===", "! != !==", "< <= >", "> >= <", "+ += ++", "- -= --", "* *= **", "/ /= //", "% %= %", "&& || !", "a && b", "a || b",
        "!a !b !c", "a ?? b", "a?.b c?.d", "x => x", "(a, b) => a + b", "a == b", "a != b", "a <= b >= c", "i++ j-- k += 2", "x *= 3 y /= 2",
        "a % 2 == 0", "n >= 0 && n < 10"
      ].map((prompt, index) => ({ title: `Operators ${index + 1}`, prompt }))
    },
    {
      id: "slashes", name: "Slashes, pipes and quotes", short: "Slashes",
      instruction: "The backslash and pipe live above Return; the backtick and tilde sit left of 1.",
      drills: [
        "/ / / /", "\\ \\ \\ \\", "| | | |", "~ ~ ~ ~", "` ` ` `", "a/b c/d e/f", "a\\b c\\d", "a|b c|d", "~/src ~/docs", "./app ../lib",
        "'a' 'b' 'c'", "\"a\" \"b\" \"c\"", "`a` `b` `c`", "a || b | c", "cat a | sort | uniq", "C:\\Users\\me", "/usr/local/bin",
        "https://example.com", "// note", "/* note */", "# comment", "'single' \"double\"", "x = 'a' + \"b\"", "`${a}` `${b}`"
      ].map((prompt, index) => ({ title: `Slashes and quotes ${index + 1}`, prompt }))
    },
    {
      id: "snippets", name: "Code snippets", short: "Snippets", phrases: true,
      instruction: "Short lines of real-looking code. Type every space and symbol exactly.",
      drills: codeSnippets.map((prompt, index) => ({ title: `Snippet ${index + 1}`, prompt }))
    }
  ];
  const pool = units.slice(0, 3).flatMap(itemsOf);
  units.push({
    id: "combined", name: "Combined symbols", short: "Combined",
    instruction: "Brackets, operators, slashes and quotes in one stream.",
    drills: sampledDrills(pool, 24, 6, 1910, (n) => `Combined symbols ${n}`)
  });
  // A few of the shortest multi-line samples from Practice and Text, typed as code: Return ends each line.
  const programs = ["Fibonacci generator", "Cart total", "Create a table", "Swap with pointers", "Struct and method", "Iterator chain"]
    .map((title) => codeSamples.find((sample) => sample.title === title)).filter(Boolean);
  units.push({
    id: "programs", name: "Short programs", short: "Programs", phrases: true,
    instruction: "A few lines of real code. Press Return at the end of each line; indentation fills in for you.",
    drills: programs.map((sample) => ({ title: `${sample.title} (${codeLanguages[sample.lang].name})`, prompt: sample.code.split("\n")[0], code: sample }))
  });
  // Practice and text use the multi-line code samples rather than the one-line course snippets.
  return {
    id: "code", name: "Code symbols", code: true, units, text: { name: "Code", short: "Code", kind: "code", list: codeSamples },
    lessons: [
      courseLesson("brackets", "Type brackets", ["brackets-1", "brackets-2", "brackets-3", "brackets-4", "brackets-9", "brackets-10", "brackets-13", "brackets-15"]),
      courseLesson("operators", "Type operators", ["operators-1", "operators-2", "operators-3", "operators-5", "operators-6", "operators-10", "operators-16", "operators-21"]),
      courseLesson("slashes", "Type slashes, pipes and quotes", ["slashes-1", "slashes-2", "slashes-3", "slashes-6", "slashes-10", "slashes-11", "slashes-12", "slashes-15"]),
      courseLesson("snippets", "Type lines of code", ["snippets-1", "snippets-2", "snippets-3", "snippets-6", "snippets-12", "snippets-17"]),
      courseLesson("programs", "Type a short program", ["programs-1"], numbered("programs", 2, programs.length))
    ]
  };
}

// The basics come first, in the order a new typist should take them; the other focuses are for typists
// who want to work on something specific.
const focusAreas = [homeRowCourse(), topRowCourse(), bottomRowCourse(), capitalsCourse(), punctuationCourse(), numberRowCourse(), codeCourse()];
const basicsPath = ["home", "top", "bottom", "capitals", "punctuation"];
const drills = [];
for (const area of focusAreas) {
  area.units.forEach((unit, unitIndex) => {
    unit.number = unitIndex + 1;
    unit.items = itemsOf(unit);
    unit.list = unit.drills.map((drill, index) => ({ ...drill, area, unit, index: index + 1, id: `${area.id}/${unit.id}-${index + 1}` }));
  });
  const byRef = new Map(area.units.flatMap((unit) => unit.list).map((drill) => [drill.id.slice(area.id.length + 1), drill]));
  const resolve = (ref) => {
    const drill = byRef.get(ref);
    if (!drill) throw new Error(`No drill ${area.id}/${ref}`);
    return drill;
  };
  // Each lesson's drills, then its checkpoint. A checkpoint has no fixed prompt: every attempt draws a fresh
  // mix from `pool` (or, for code, one sample from `samples`), and `prompt` is only a preview for the map.
  area.lessons.forEach((lesson, lessonIndex) => {
    lesson.number = lessonIndex + 1;
    lesson.area = area;
    const steps = lesson.drills.map(resolve);
    for (const [index, drill] of steps.entries()) {
      if (drill.lesson) throw new Error(`${drill.id} is in two lessons`);
      Object.assign(drill, { lesson, step: index + 1 });
    }
    const sources = lesson.check.map(resolve);
    const samples = sources.filter((drill) => drill.code).map((drill) => drill.code);
    const pool = [...new Set(sources.flatMap((drill) => drill.unit.phrases ? [drill.prompt] : drill.prompt.split(" ")).filter(Boolean))];
    const checkpoint = {
      id: `${area.id}/${lesson.id}-check`, area, lesson, unit: null, step: steps.length + 1, checkpoint: true,
      title: `Lesson ${lesson.number} checkpoint`, pool, samples: samples.length ? samples : null,
      prompt: samples.length ? samples[0].code.split("\n")[0] : pool.slice(0, 6).join(" ")
    };
    lesson.list = [...steps, checkpoint];
  });
  // The course path: every lesson's drills and checkpoint, in order.
  area.path = area.lessons.flatMap((lesson) => lesson.list);
  area.drills = [...area.units.flatMap((unit) => unit.list), ...area.lessons.map((lesson) => lesson.list.at(-1))];
  drills.push(...area.drills);
  const practiceUnits = area.units.filter((unit) => !unit.review);
  area.pool = [...new Set(practiceUnits.flatMap((unit) => unit.items))];
  area.characters = new Set(area.pool.join(""));
  area.practiceTypes = [
    { id: "mixed", name: "Mixed", description: `A bit of everything from the ${area.name.toLowerCase()} library.` },
    ...practiceUnits.map((unit) => ({ id: unit.id, name: unit.short, description: unit.instruction, unit })),
    { id: "weak", name: "Weak keys", description: "Built from the keys you miss most often in this focus." }
  ];
  // Code practice is real code, picked by language.
  if (area.code) {
    area.practiceTypes = [
      { id: "mixed", name: "Mixed", description: "Real code in a mix of languages." },
      ...codeGroups.map((group) => ({ id: group.id, name: group.name, description: group.description ?? `Typical ${group.name} exercises.` })),
      { id: "weak", name: "Weak keys", description: "Code that leans on the keys you miss most often in this focus." }
    ];
  }
}
const drillById = new Map(drills.map((drill) => [drill.id, drill]));
const areaById = new Map(focusAreas.map((area) => [area.id, area]));
const passMark = 95;
// Checkpoint and practice lengths run 2–4 minutes at one key per second.
const lengthRange = { min: 120, max: 240 };
// Lesson and library drills repeat their pattern to about this many keys, so each one stays short.
const lessonLength = 60;

for (const area of focusAreas) {
  const option = element("li", "focus-option");
  option.id = `focus-option-${area.id}`;
  option.setAttribute("role", "option");
  option.tabIndex = -1;
  option.dataset.focus = area.id;
  option.append(element("span", "focus-option-name", area.name), icon("check"), element("span", "focus-option-meta"));
  option.addEventListener("click", () => chooseFocus(area.id));
  focusList.append(option);
}

const books = passageData.flatMap(({ paragraphs, ...book }) =>
  paragraphs.map((text) => ({ ...book, text, words: text.split(" ").length })));
const bookBags = {
  short: shuffledBag(books.filter(({ words }) => words <= 100)),
  medium: shuffledBag(books.filter(({ words }) => words > 100 && words <= 200)),
  long: shuffledBag(books.filter(({ words }) => words > 200 && words <= 300))
};
