
const items = {
  A:{word:"Apple",image:"images/apple.png",animation:"apple"},
  B:{word:"Ball",image:"images/ball.png",animation:"ball"},
  C:{word:"Cat",image:"images/cat.png",animation:"cat"},
  D:{word:"Dog",image:"images/dog.png",animation:"dog"},
  E:{word:"Elephant",image:"images/elephant.png",animation:"cat"},
  F:{word:"Fish",image:"images/fish.png",animation:"ball"},
  G:{word:"Giraffe",image:"images/giraffe.png",animation:"cat"},
  H:{word:"Horse",image:"images/horse.png",animation:"apple"},
  I:{word:"Ice Cream",image:"images/icecream.png",animation:"ball"},
  J:{word:"Juice",image:"images/juice.png",animation:"apple"},
  K:{word:"Kite",image:"images/kite.png",animation:"butterfly"},
  L:{word:"Lion",image:"images/lion.png",animation:"cat"},
  M:{word:"Monkey",image:"images/monkey.png",animation:"cat"},
  N:{word:"Nest",image:"images/nest.png",animation:"apple"},
  O:{word:"Orange",image:"images/orange.png",animation:"apple"},
  P:{word:"Penguin",image:"images/penguin.png",animation:"cat"},
  Q:{word:"Queen",image:"images/queen.png",animation:"apple"},
  R:{word:"Rabbit",image:"images/rabbit.png",animation:"cat"},
  S:{word:"Sun",image:"images/sun.png",animation:"spin"},
  T:{word:"Tiger",image:"images/tiger.png",animation:"cat"},
  U:{word:"Umbrella",image:"images/umbrella.png",animation:"butterfly"},
  V:{word:"Van",image:"images/van.png",animation:"ball"},
  W:{word:"Whale",image:"images/whale.png",animation:"ball"},
  X:{word:"Xylophone",image:"images/xylophone.png",animation:"spin"},
  Y:{word:"Yacht",image:"images/yacht.png",animation:"ball"},
  Z:{word:"Zebra",image:"images/zebra.png",animation:"cat"}
};

let soundOn = true;
const letterEl = document.getElementById("letter");
const objectEl = document.getElementById("object");
const wordEl = document.getElementById("word");
const sentenceEl = document.getElementById("sentence");
const keyboardEl = document.getElementById("keyboard");
const textInput = document.getElementById("textInput");
const textSubmit = document.getElementById("textSubmit");
const voiceBtn = document.getElementById("voiceBtn");
const listenBtn = document.getElementById("listenBtn");
const listenText = document.getElementById("listenText");
const statusEl = document.getElementById("status");

Object.keys(items).forEach(letter => {
  const btn = document.createElement("button");
  btn.className = "key";
  btn.textContent = letter;
  btn.dataset.letter = letter;
  btn.type = "button";
  btn.setAttribute("aria-label", `Letter ${letter}`);
  btn.addEventListener("click", () => showLetter(letter));
  keyboardEl.appendChild(btn);
});

function showLetter(letter) {
  const data = items[letter];
  letterEl.textContent = letter;
  objectEl.src = data.image;
  objectEl.alt = data.word;
  wordEl.textContent = data.word;
  sentenceEl.textContent = `${letter} is for ${data.word}!`;

  objectEl.className = "object " + data.animation;
  letterEl.style.animation = "none";
  void letterEl.offsetWidth;
  letterEl.style.animation = "pop .45s ease-out";

  document.querySelectorAll(".key").forEach(k =>
    k.classList.toggle("active", k.dataset.letter === letter)
  );

  if (soundOn) speak(`${letter}. ${data.word}. ${letter} is for ${data.word}.`);
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    statusEl.textContent = "Audio pronunciation is not available in this browser.";
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.78;
  u.pitch = 1.18;
  u.volume = 1;
  speechSynthesis.speak(u);
}

document.addEventListener("keydown", e => {
  if (document.activeElement === textInput) return;
  const letter = e.key.toUpperCase();
  if (items[letter]) {
    e.preventDefault();
    showLetter(letter);
  }
});

document.getElementById("speakBtn").addEventListener("click", () => {
  const l = letterEl.textContent;
  const d = items[l];
  speak(`${l}. ${d.word}. ${l} is for ${d.word}.`);
});

document.getElementById("soundBtn").addEventListener("click", function() {
  soundOn = !soundOn;
  this.textContent = soundOn ? "🔊" : "🔇";
  if (!soundOn && "speechSynthesis" in window) speechSynthesis.cancel();
});

document.getElementById("fullscreenBtn").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  } catch (_) {
    statusEl.textContent = "Use Safari's Share menu → Add to Home Screen for app-like mode.";
  }
});

// Text + voice input.
const wordToLetter = {};
Object.keys(items).forEach(letter => wordToLetter[items[letter].word.toLowerCase()] = letter);

const spokenLetters = {
  a:"A",ay:"A",eh:"A", b:"B",bee:"B", c:"C",see:"C",sea:"C",
  d:"D",dee:"D", e:"E", f:"F",ef:"F", g:"G",gee:"G", h:"H",aitch:"H",
  i:"I",eye:"I", j:"J",jay:"J", k:"K",kay:"K", l:"L",el:"L",
  m:"M",em:"M", n:"N",en:"N", o:"O",oh:"O", p:"P",pee:"P",
  q:"Q",cue:"Q", r:"R",are:"R", s:"S",ess:"S", t:"T",tea:"T",
  u:"U",you:"U", v:"V",vee:"V", w:"W","double u":"W",
  x:"X",ex:"X", y:"Y",why:"Y", z:"Z",zee:"Z",zed:"Z"
};

function normalizeInput(value) {
  const raw = value.toLowerCase().trim();
  if (!raw) return null;
  if (/^[a-z]$/.test(raw)) return raw.toUpperCase();
  if (wordToLetter[raw]) return wordToLetter[raw];
  if (spokenLetters[raw]) return spokenLetters[raw];

  for (const word of Object.keys(wordToLetter)) {
    if (raw.includes(word)) return wordToLetter[word];
  }
  const tokens = raw.replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  for (const token of tokens) if (spokenLetters[token]) return spokenLetters[token];
  return null;
}

function processInput(value, source) {
  const letter = normalizeInput(value);
  if (letter) {
    showLetter(letter);
    statusEl.textContent = source === "voice"
      ? `Heard: "${value}" → ${letter}`
      : `Typed: "${value}" → ${letter}`;
    return true;
  }
  statusEl.textContent = `Try A–Z or a word such as Apple.`;
  return false;
}

textSubmit.addEventListener("click", () => processInput(textInput.value, "text"));
textInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    processInput(textInput.value, "text");
  }
});

// iPad Safari support varies by iOS/Safari version.
// We expose the API when the browser provides it and otherwise give a clear fallback.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

function setListening(on) {
  listening = on;
  listenBtn.classList.toggle("listening", on);
  voiceBtn.classList.toggle("listening", on);
  listenText.textContent = on ? "Listening..." : "Say a letter or word";
}

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;

  recognition.onstart = () => {
    setListening(true);
    statusEl.textContent = "🎤 Listening... Say a letter or word.";
  };

  recognition.onresult = event => {
    const results = event.results[0];
    let best = "";
    for (let i = 0; i < results.length; i++) {
      best = results[i].transcript;
      if (normalizeInput(best)) break;
    }
    textInput.value = best;
    processInput(best, "voice");
  };

  recognition.onerror = event => {
    const messages = {
      "not-allowed":"Microphone permission was denied. Allow microphone access in Safari.",
      "no-speech":"I didn't hear anything. Please try again.",
      "audio-capture":"No microphone was found.",
      "network":"Voice recognition needs a network connection in this browser."
    };
    statusEl.textContent = messages[event.error] || `Voice error: ${event.error}`;
  };

  recognition.onend = () => setListening(false);

  const startVoice = () => {
    if (listening) { recognition.stop(); return; }
    try { recognition.start(); } catch (_) {}
  };
  listenBtn.addEventListener("click", startVoice);
  voiceBtn.addEventListener("click", startVoice);
} else {
  listenBtn.addEventListener("click", () => {
    statusEl.textContent = "Voice recognition isn't available in this Safari version. Try Chrome/Edge or use Text input.";
  });
  voiceBtn.addEventListener("click", () => {
    statusEl.textContent = "Voice recognition isn't available in this Safari version. Try Chrome/Edge or use Text input.";
  });
}

// Prevent accidental browser zoom/scroll gestures while playing.
document.addEventListener("gesturestart", e => e.preventDefault(), {passive:false});
document.addEventListener("gesturechange", e => e.preventDefault(), {passive:false});
document.addEventListener("gestureend", e => e.preventDefault(), {passive:false});

// Service worker for offline use when served from HTTPS/localhost.
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}

showLetter("A");
