"use strict";

// ---- Keyboard facts --------------------------------------------------------

const fingers = {
  LP: "Left pinky", LR: "Left ring finger", LM: "Left middle finger", LI: "Left index finger",
  RI: "Right index finger", RM: "Right middle finger", RR: "Right ring finger", RP: "Right pinky",
  T: "Thumb"
};
const zones = { P: "pinky", R: "ring", M: "middle", I: "index", T: "thumb" };
const numberRow = [
  ["`", "~", "LP"], ["1", "!", "LP"], ["2", "@", "LR"], ["3", "#", "LM"],
  ["4", "$", "LI"], ["5", "%", "LI"], ["6", "^", "RI"], ["7", "&", "RI"],
  ["8", "*", "RM"], ["9", "(", "RR"], ["0", ")", "RP"], ["-", "_", "RP"], ["=", "+", "RP"]
];
const keyNames = { "`": "backtick", "-": "hyphen", "=": "equals", ";": "semicolon", ",": "comma", ".": "period", "/": "slash" };
const keyName = (key) => keyNames[key] ?? key;
// The home key each number-row key is reached from, and the column (bottom, home, top) under each digit.
const homeOf = { "`": "a", 1: "a", 2: "s", 3: "d", 4: "f", 5: "f", 6: "j", 7: "j", 8: "k", 9: "l", 0: ";", "-": ";", "=": ";" };
const columnOf = { 1: "zaq", 2: "xsw", 3: "cde", 4: "vfr", 5: "bgt", 6: "nhy", 7: "mju", 8: ",ki", 9: ".lo", 0: "/;p" };
const digitKeys = [..."1234567890"];

// ---- Word lists and sentences ------------------------------------------------

const homeWords = ["add", "adds", "ads", "alas", "all", "alfalfa", "ash", "ask", "asks", "dad", "dads", "dash", "fad", "fads", "fall", "falls", "flag", "flags", "flak", "flash", "flask", "flasks", "gaff", "gal", "gala", "galas", "gall", "gas", "gash", "glad", "glass", "had", "half", "hall", "halls", "has", "hash", "jag", "jags", "lad", "lads", "lag", "lags", "lash", "lass", "sad", "saga", "sagas", "salad", "salads", "sash", "shall", "slash", "skald", "gaffs", "jakfa"].filter((word) => word !== "jakfa");
const topWords = ["the", "to", "it", "is", "of", "he", "we", "you", "they", "that", "this", "with", "what", "were", "where", "their", "there", "here", "she", "her", "for", "are", "or", "our", "out", "up", "so", "if", "at", "do", "go", "get", "got", "how", "who", "why", "way", "day", "say", "said", "saw", "see", "sea", "tea", "tree", "eat", "ate", "red", "yes", "yet", "try", "tip", "top", "toy", "two", "too", "look", "like", "life", "wife", "write", "wrote", "quite", "quiet", "quest", "quote", "query", "equal", "sugar", "house", "horse", "water", "after", "other", "great", "pretty", "purpose", "power", "people", "would", "should", "story", "light", "right", "sight", "high", "girl", "works", "world", "worth", "earth", "first", "forest", "fruit", "pie", "pipe", "ripe", "type", "typist", "poetry", "prayer", "upper", "outer", "tower", "report", "support", "thought", "though", "through", "kettle", "purple", "great", "street", "sister", "letter", "happy", "really"];
const bottomWords = ["zebra", "zero", "zone", "zoom", "zip", "zinc", "buzz", "jazz", "fizz", "quiz", "maze", "size", "prize", "doze", "lazy", "crazy", "box", "fox", "mix", "six", "wax", "tax", "next", "text", "exam", "exit", "extra", "cave", "five", "give", "have", "live", "love", "move", "over", "very", "vote", "view", "value", "brave", "every", "back", "bank", "black", "book", "bike", "best", "bring", "brown", "cabin", "cable", "came", "camp", "can", "car", "cat", "clean", "clear", "climb", "club", "come", "cream", "cube", "dance", "men", "man", "many", "mind", "mine", "moon", "more", "much", "name", "near", "new", "nice", "night", "none", "not", "now", "number", "minimum", "maximum", "vacuum", "convex", "combine", "member", "banana", "cinnamon", "common", "become", "behind", "beyond"];
const commonWords = ["time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child", "world", "school", "state", "family", "group", "country", "problem", "hand", "part", "place", "case", "week", "system", "program", "question", "work", "night", "point", "home", "water", "room", "mother", "area", "money", "story", "fact", "month", "right", "study", "book", "eye", "job", "word", "issue", "side", "kind", "head", "house", "friend", "father", "power", "hour", "game", "line"];
const pangrams = [
  "the quick brown fox jumps over the lazy dog", "pack my box with five dozen liquor jugs", "how vexingly quick daft zebras jump",
  "sphinx of black quartz judge my vow", "the five boxing wizards jump quickly", "jackdaws love my big sphinx of quartz",
  "quick zephyrs blow vexing daft jim", "waltz bad nymph for quick jigs vex", "bright vixens jump dozy fowl quack",
  "jinxed wizards pluck ivy from the big quilt", "we promptly judged antique ivory buckles for the next prize",
  "a quick movement of the enemy will jeopardize six gunboats", "few quips galvanized the mock jury box",
  "sixty zippers were quickly picked from the woven jute bag", "back in june we delivered oxygen equipment of the same size",
  "five or six big jet planes zoomed quickly by the tower", "grumpy wizards make toxic brew for the evil queen and jack",
  "the wizard quickly jinxed the gnomes before they vaporized", "my girl wove six dozen plaid jackets before she quit",
  "the job requires extra pluck and zeal from every young wage earner", "puzzled women bequeath jerks very exotic gifts",
  "crazy fredrick bought many very exquisite opal jewels", "two driven jocks help fax my big quiz", "public junk dwarves hug my quartz fox"
];
const names = ["Anna", "Ben", "Clara", "David", "Emma", "Felix", "Grace", "Hugo", "Iris", "Jack", "Kate", "Leo", "Mia", "Noah", "Olga", "Paul", "Quinn", "Rosa", "Sam", "Tara", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zoe"];
const places = ["London", "Paris", "Tokyo", "Oslo", "Lima", "Cairo", "Rome", "Berlin", "Madrid", "Dublin", "Vienna", "Prague", "Seoul", "Delhi", "Sydney", "Toronto", "Boston", "Chicago", "Denver", "Austin", "Quebec", "Zurich", "Lisbon", "Athens", "Nairobi", "Bangkok"];
const calendarWords = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const acronyms = ["NASA", "USB", "HTML", "CSS", "GPS", "FAQ", "ASAP", "DIY", "RSVP", "PDF", "CSV", "URL", "API", "CPU", "RAM", "SSD", "LED", "UFO", "ATM", "PIN", "VIP", "CEO", "UK", "USA", "EU", "UN", "TV", "DVD", "BBQ", "AKA", "ETA", "FYI", "IOU", "JPEG", "PNG", "GIF", "SQL", "JSON", "XML", "HTTP"];
const capitalSentences = [
  "The bus to Oslo leaves on Monday.", "Anna and Ben met Clara in Rome.", "We fly to Tokyo in April.", "Leo reads a book every Sunday.",
  "Is Paris colder than Berlin in May?", "Mia said the CEO would call at noon.", "Grace moved from Dublin to Lisbon.",
  "Our team in Austin uses HTML and CSS.", "Hugo bought a TV and a DVD player.", "Send the PDF to Kate before Friday.",
  "The UN met in Geneva last June.", "Zoe and Sam drove from Boston to Denver.", "Victor saw the Northern Lights in Norway.",
  "Iris paints in Vienna every December.", "Please RSVP by Tuesday, Felix.", "Rosa found a cafe near the old harbor in Porto.",
  "The ETA for the parcel is Thursday.", "Noah learned Python and SQL in March.", "Quinn will visit Prague and Zurich.",
  "Tara wrote to the BBC in July.", "Wendy runs a DIY club in Toronto.", "David keeps his notes in a JSON file.",
  "Olga teaches at a school in Athens.", "The GPS lost its signal near Lake Como.", "Paul and Emma met in New York in October.",
  "Yara flew from Seoul to Sydney on a Saturday."
];
const contractions = ["it's", "don't", "can't", "won't", "I'm", "you're", "we're", "they're", "isn't", "aren't", "wasn't", "weren't", "I've", "you've", "we'll", "they'll", "she's", "he's", "that's", "there's", "let's", "couldn't", "wouldn't", "shouldn't", "doesn't", "didn't", "hasn't", "haven't", "I'd", "you'd"];
const hyphenated = ["well-known", "up-to-date", "long-term", "self-made", "part-time", "co-op", "x-ray", "e-mail", "follow-up", "check-in", "log-in", "one-way", "two-thirds", "mother-in-law", "high-end", "low-key", "re-enter", "full-time", "old-fashioned", "so-called", "t-shirt", "pre-order", "real-time", "eye-catching", "short-lived", "open-source", "in-depth", "well-being"];
const punctuationSentences = [
  "Wait, is that your bag? No, it's mine.", "She said, \"Let's meet at noon.\"", "Bring three things: a map, a torch, and water.",
  "The plan was simple; the weather was not.", "Well, that's odd! Who left the door open?", "It's a well-known fact: cats don't like baths.",
  "He asked, \"Are you sure?\" I said, \"Yes.\"", "Pack light (one bag, two shoes) and go.", "Our long-term goal is clear; our next step isn't.",
  "Stop! Look both ways, then cross.", "The menu lists soup, salad, and bread [vegan].", "I'd say yes; she'd say no; they'd ask why.",
  "Choose red, blue, or green, but choose now.", "The note read: \"Back in five minutes.\"", "Is it lunch time yet? It's only ten.",
  "We're up-to-date, aren't we? Not quite.", "Read the guide (page two) before you start.", "Hey, you! Yes, you: come here, please.",
  "The answer, as always, was 'it depends.'", "First, wash; then, dry; finally, fold."
];
const codeSnippets = [
  "if (x > 0) { y += 1; }", "for (let i = 0; i < n; i++) {}", "const sum = (a, b) => a + b;", "while (i < 10) { i++; }",
  "return { ok: true, id: 7 };", "items.map((x) => x * 2);", "let name = user?.name ?? 'guest';", "def add(a, b): return a + b",
  "print(f\"{name}: {score}\")", "x = [i * i for i in range(5)]", "if a and not b: pass", "SELECT * FROM users WHERE id = 1;",
  "<a href=\"/home\">Home</a>", "<input type=\"text\" />", "{ \"id\": 1, \"tags\": [\"a\", \"b\"] }", "git commit -m \"fix typo\"",
  "npm run build && npm test", "ls -la | grep \".txt\"", "echo $HOME > ~/path.txt", "#include <stdio.h>",
  "int main() { return 0; }", "fn main() { println!(\"hi\"); }", "match x { Some(v) => v, None => 0 }", "arr[i] = arr[i - 1] + 1;",
  "a = b if c else d", "obj['key'] = [1, 2, 3];"
];
const numberSentences = [
  "The 7:45 train to Leeds leaves from platform 3 and gets in at 10:20.", "Our flat is at 18 Elm Road, apartment 4B, on the 2nd floor.",
  "She paid $12.50 for 3 notebooks and $4 for a pen.", "The meeting moved from 2:30 to 3:15 on Thursday, May 9.",
  "Version 2.4.1 fixes 17 bugs and adds 3 new settings.", "Mix 250 g of flour with 2 eggs and 150 ml of milk.",
  "The bus takes 45 minutes, so we left at 8:10 sharp.", "Call 555-0142 between 9 and 5 to book a table for 6.",
  "Sales rose 12% in Q3, from 1,850 units to 2,072.", "Room 214 has 30 seats; room 108 has only 12.",
  "The marathon is 42.2 km, and he finished in 3:58:41.", "Order #40917 shipped on 2025-03-14 in 2 boxes.",
  "Set the oven to 180 degrees and bake for 25 to 30 minutes.", "The score was 3-2 after 90 minutes and 4-2 after extra time.",
  "Chapter 11 starts on page 236 and ends on page 259.", "Gate 22 opens at 6:40 for flight 818 to Oslo.",
  "Our team of 8 wrote 1,204 tests in 5 weeks.", "The 4 bedrooms total 96 square meters across 2 floors.",
  "We need 3 cables, 2 adapters and 1 spare battery.", "Turn left after 400 m, then right at the 2nd light.",
  "Tickets cost $35 each, or $90 for a pack of 3.", "The 1969 landing used a computer with 4 KB of memory.",
  "Save 20% on orders over $50 until 31 December.", "Bring 2 photos, 1 form and a fee of $15 to window 7."
];
