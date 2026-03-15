# AI-Driven Adaptive Learning & Gamification Plan

This plan expands the Thiranmozhi system into an intelligent, adaptive learning platform that continuously learns from student behavior and rewards progress.

## Proposed Changes

### 1. AI-Based Learning Style Detection
- **Metrics Tracking**: Update `app.state.progress` to include `session_metrics` (speed, accuracy, interaction depth).
- **Dynamic Recalculation**: Modify `app.recalculateStyle()` to weight recent performance metrics alongside initial test scores.
- **Adaptive Lessons**: Adjust `adaptive-engine.js` to prioritize content types (visual, auditory, kinesthetic) based on real-time VAK updates.

### 2. Intelligent Error Analysis
- **Confusion Tracking**: Enhance `app.recordMistake(asked, answered)` to identify patterns where specific letters are frequently swapped.
- **Remedial Content**: Implement a "Comparison Screen" component in `learning.html` that triggers when a confusion pair (e.g., ழ vs ள) is detected.

### 3. Smart Progress Dashboard
- **Granular Progress**: Implement four distinct progress bars on `dashboard.html`:
    - Uyir (Vowels)
    - Mei (Consonants)
    - Writing Accuracy (Tracing scores)
    - Pronunciation (Audio recognition scores)
- **AI Recommendations**: Logic to suggest specific lessons based on the "Weak Letters" section.

### 4. Gamification System
- **Badge Engine**: Add `achievements` to student state.
- **Milestones**:
    - "Uyir Master" (100% Vowel accuracy)
    - "Writing Star" (>90% average tracing accuracy)
- **UI Feedback**: Toast notifications or modal popups when a badge is earned.

## Verification Plan
### Automated Tests
- Simulate series of mistakes to verify "Weak Letter" detection.
- Simulate fast/accurate tracing to verify VAK score shifts.
- Trigger badge conditions to verify state updates.
