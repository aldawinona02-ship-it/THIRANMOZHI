# Implementation Plan - Modern EdTech Transformation

This plan outlines the steps to transform THIRANMOZHI into a professional-grade edtech platform with a clean design system and a seamless user flow.

## 🎨 1. Design System & Global Styles
We will replace the current ad-hoc styling with a unified "Premium Pastel" system.
- **Palette**: Soft but high-contrast pastels (Indigo-600 for primary, Rose-500 for secondary, Emerald-500 for success).
- **Typography**: Nunito for UI, Baloo Thambi 2 for Tamil content.
- **Components**: Standardized cards, buttons (pill-shaped, shadow-depth), and progress bars.

### [MODIFY] [styles.css](file:///c:/Users/Jaysukh%20Sesham/OneDrive/Desktop/THIRANMOZHI-1/css/styles.css)
- Reset variables for a unified theme.
- Define global classes for `.glass-card`, `.btn-premium`, and `.section-title`.

## 🚀 2. Navigation & User Flow
We will implement a linear, guided experience.
1. **Landing (`index.html`)**: Clear "Start Learning" button.
2. **Onboarding (`student-info.html`)**: Simplified student data entry.
3. **Assessment (`pre-test.html` -> `test.html`)**: Guided 9-test sequence to determine learning style.
4. **Result (`result.html`)**: Celebration of completion and style reveals.
5. **Dashboard (`dashboard.html`)**: The "Home Base" showing progress and weak letters.
6. **Practice (`learning.html` -> `tracing.html`)**: Adaptive lessons based on AI recommendations.

## 🧠 3. Adaptive Engine Refinement
The `adaptive-engine.js` will be upgraded to be more proactive.
- **Mistake Matrix**: Track not just if a letter was missed, but what it was confused with (e.g., ழ vs ள).
- **Personalized Path**: Generate a dynamic list of letters to practice based on performance.
- **Real-time Updates**: Ensure the dashboard reflects every practice session immediately.

## 🛠️ 4. UI Overhaul per Page
- **Landing Page**: Add value props and a massive, friendly CTA.
- **Test Page**: Move from "test" to "activity" - make instructions clear and visual.
- **Dashboard**: Use "Duolingo-style" progress rings and achievement badges.
- **Learning Page**: Focus on one letter at a time with clean, high-contrast visuals.

## ✅ Verification Plan
- **Flow Validation**: Manually walk through the entire flow as a new user.
- **State Audit**: Check `localStorage` after each step to ensure data matches the UI.
- **Visual Consistency**: Compare all pages for font sizing, color usage, and spacing.
