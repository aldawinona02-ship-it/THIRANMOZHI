# Thiranmozhi - Tamil.my Feature Parity Plan

You requested that we clone the exact functions of the reference app (`tamil.my`) to create a "final proper product". 

According to the metadata and source of `tamil.my`, their core functionality includes five distinct pillars: **Speak, Write, Type, Read, & Grammar**. 

Currently, Thiranmozhi excels at **Write** (the tracing canvas) and basic Reading (letter identification on the map). To achieve true feature parity and build a comprehensive product, we will implement the missing pillars.

## User Review Required
> [!IMPORTANT]
> This is a significant expansion of the application's scope. Please review the proposed modules below and confirm if you want me to proceed with building all of them.

## Proposed Changes

We will introduce 4 new standalone modules that can be accessed from the `dashboard.html` or the Map.

### 1. Speech Recognition (Speak Module)
We will leverage HTML5 `webkitSpeechRecognition` configured for Tamil (`ta-IN`) to listen to the student's pronunciation and validate it.
#### [NEW] `speech.html` & `speech.js`
- UI with a microphone button and audio visualizations.
- Prompts the user with a Tamil letter or word.
- Evaluates the spoken input against the target string and awards XP.

### 2. Tamil Typing Mechanics (Type Module)
We will build a phonetic typing engine so users don't need a physical Tamil keyboard to practice.
#### [NEW] `typing.html` & `typing.js`
- Displays words on screen.
- User types phonetically (e.g., typing 'a' 'm' 'm' 'a' produces 'அம்மா').
- Tracks typing speed and accuracy.

### 3. Reading Comprehension (Read Module)
#### [NEW] `reading.html` & `reading.js`
- Short, simple sentences in Tamil.
- Uses `ResponsiveVoice.js` (or native SpeechSynthesis) to read the sentence aloud.
- Multiple choice comprehension questions.

### 4. Grammar Sandbox (Grammar Module)
#### [NEW] `grammar.html` & `grammar.js`
- Interactive lessons explaining the difference between Uyir (Vowels), Mei (Consonants), and Uyirmei (Compound).
- Drag-and-drop mechanics to build compound letters (e.g., க் + அ = க).

## Verification Plan
1. **Automated Verification:** We will ensure `localStorage` cleanly routes users back and forth between the new modules and the central dashboard.
2. **Manual Verification:** We will ask you to test the Speech API using your microphone, and the Typing engine using your keyboard.
