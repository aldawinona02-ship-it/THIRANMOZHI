# 9-Stage Adaptive Flow Implementation Plan (Strict Blueprint)

Refactoring THIRANMOZHI to follow the 9-stage data-driven learning cycle precisely as defined in the user's blueprint.

## 🗺️ The 9-Stage Journey
1.  **Landing (`index.html`)**: Entry point with "Start Test" and "Start Learning".
2.  **Diagnostic (`test.html`)**: 9 activities (3 per VAK type).
3.  **Style Result (`result.html`)**: Reveals identified learner type.
4.  **Dashboard (`dashboard.html`)**: Overview of type, progress, and weak letters.
5.  **Learning (`learning.html`)**: Content delivery branched by learner type.
6.  **Practice (`practice.html`)**: Reinforcement focusing on weak letters.
7.  **Assessment (`assessment.html`)**: Evaluative test to identify new weak letters.
8.  **Final Result (`final-result.html`)**: Performance summary and list of mistakes.
9.  **Adaptive Revision (`adaptive-learning.html`)**: Targeted revision loop.

## 🧠 Data Flow (LocalStorage Keys)
- `learnerType`: (visual/auditory/kinesthetic)
- `visualScore`, `auditoryScore`, `kinestheticScore`
- `progress`: (Uyir/Mei/Uyirmei percentages)
- `weakLetters`: (Array of missed characters)
- `finalScore`: (Latest assessment result)

## Proposed Changes

### [Foundation]
- Create `practice.html`, `assessment.html`, `final-result.html`, `adaptive-learning.html`.
- Ensure all HTML files have correct `<script>` tags referencing the correct paths.

### [Logic Refactor]
- **`main.js`**: Centralize redirection and state sync using the new keys.
- **`tests.js`**: Update to store scores in `visualScore`, etc.
- **`learning.html`**: Use `learnerType` to toggle UI blocks.
- **`adaptive-engine.js`**: Upgrade to support the "Teach -> Practice -> Mini Test" revision loop.

## Verification Plan
- **Manual Walkthrough**: Follow all 9 steps sequentially.
- **Console Check**: Verify no 404s for JS files and no "ReferenceError" during flow.
- **State Audit**: Confirm `localStorage` contains all keys after a full cycle.
