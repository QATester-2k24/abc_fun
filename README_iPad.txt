ABC FUN - iPAD READY VERSION

What is included:
- Touch-first A-Z alphabet buttons
- Text input (letter or word)
- Voice input when the browser provides SpeechRecognition
- Spoken pronunciation
- Responsive portrait and landscape layouts
- PWA manifest for Add to Home Screen
- Service worker for offline game assets after the first load
- 26 local image assets

HOW TO USE ON iPAD
1. Upload this entire folder to an HTTPS website (GitHub Pages, Netlify, Vercel, your own hosting, etc.).
2. Open the HTTPS game URL in Safari.
3. Test touch and pronunciation.
4. Use Safari Share -> Add to Home Screen to install it like an app.
5. For voice input, allow microphone access when prompted. Voice recognition support depends on the iPadOS/Safari version; if unavailable, text and touch input still work.

IMPORTANT
- Do not upload only index.html. The images folder, style.css, script.js, manifest.json and service-worker.js are required.
- The service worker works on HTTPS or localhost, not when opening index.html directly from Files.
- The speech synthesis pronunciation can work without internet, but voice recognition may depend on browser/network support.
