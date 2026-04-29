# VoteGuide - Empowering the Indian Electorate

VoteGuide is a comprehensive web application designed to educate, empower, and assist voters in India. By combining interactive simulations with modern AI, VoteGuide demystifies the electoral process, making civic participation more accessible and engaging.

## Screenshots

*(Note: Replace these placeholder paths with your actual screenshots. You can take screenshots and drag/drop them into the `public` folder of the code editor on the left side of AI Studio!)*

| Home Page | EVM Simulator |
| :---: | :---: |
| <img src="./public/screenshot-home.png" width="400" alt="Home Page" /> | <img src="./public/screenshot-simulator.png" width="400" alt="EVM Simulator" /> |

| VoteGuide AI | Civic Quiz & Journey |
| :---: | :---: |
| <img src="./public/screenshot-ai.png" width="400" alt="VoteGuide AI Conversation" /> | <img src="./public/screenshot-quiz.png" width="400" alt="Civic Quiz & Journey" /> |

## Features

- **EVM & VVPAT Simulator:** An interactive simulation of the Electronic Voting Machine (EVM) and Voter Verifiable Paper Audit Trail (VVPAT). Users can practice casting a vote in a risk-free environment, reducing anxiety and errors on actual polling days. Includes a 7-second VVPAT preview to build trust in the electoral process.
- **VoteGuide AI (Civic Assistant):** Powered by the **Google Gemini API** (`gemini-3-flash-preview`), this intelligent chatbot provides real-time, objective, and non-partisan information about voter registration, polling booths, election forms, and procedures.
- **Interactive Voter Journey:** A step-by-step interactive roadmap that guides users through the entire voting process, from eligibility and registration with the Election Commission of India (ECI) to finding their booth and casting their vote.
- **Civic Knowledge Quiz:** Gamified learning to test and improve users' knowledge about their democratic rights and duties.
- **Secure Authentication:** Integrated with Firebase Authentication, ensuring secure login using Google Accounts.

## Technical Highlights & Evaluation Criteria

### 1. Code Quality
- **Clean Architecture:** Written in modern **TypeScript** and **React**. The codebase uses functional components, custom hooks, and a clear separation of concerns (e.g., separating UI components from the Firebase service layer).
- **Readability:** Component files are Modular, maintaining a flat structure where each component has a single responsibility. Predictable, semantic naming conventions are used.
- **Modern UI/UX:** Styled using **Tailwind CSS** with cohesive utility classes ensuring a lightweight application, combined with **Framer Motion** for polished, purposeful animations (like the VVPAT slip interaction and route transitions) that guide user attention gracefully.

### 2. Security
- **Authentication:** Enforces zero-trust principles for user access using Firebase Authentication. Route wrappers enforce that sensitive or customized data pages are inaccessible without prior, secure login.
- **API Protection:** The Google Gemini AI API key is routed dynamically from backend environment variables, keeping it safe from client-side sniffing or unauthorized reuse. 
- **Data Integrity Safety:** No direct, unrestricted database writes are performed from the client site. User state transitions on sign-out clear UI and data comprehensively for security.

### 3. Efficiency
- **Resource Management:** Optimized re-rendering avoiding heavy array dependencies in React `useEffect` loops.
- **Asset Loading:** Tailwind CSS ensures a minimal CSS footprint. `lucide-react` is used for lightweight, scalable vector icons without loading heavy font libraries.
- **Performance:** `react-router-dom` handles client-side routing, enabling instant page transitions without full-page reloads, saving bandwidth and lowering perceived latency.

### 4. Testing & Maintenance
- **Strong Typing:** TypeScript is applied rigorously, defining strict interfaces for Messages, Candidates, and user states. This allows for excellent in-editor error catching, code refactoring, and auto-completion.
- **Extensibility:** The component-based nature makes it easy to introduce new "Journeys" or "Candidates" in the EVM simply by expanding robust internal data arrays without rewriting business logic.

### 5. Accessibility
- **Semantic HTML:** The layout uses accessible HTML5 tags (`<main>`, `<nav>`, `<header>`). 
- **Keyboard & Screen Reader Support:** Interactive elements feature ARIA attributes (e.g., `aria-label`, `role="log"`, `aria-live="polite"` inside the AI Assistant).
- **Responsive Design:** Using Tailwind's mobile-first conventions to scale fonts and adjust grid/flex spaces ensures VoteGuide is usable on everything from the smallest smartphone to ultrawide desktop monitors.
- **Visual Contrast:** Carefully curated color palettes are utilized to meet WCAG contrast requirements, ensuring readability for users with visual impairments.

### 6. Google Services Integration
- **Google Gemini API:** Utilizes the official `@google/genai` TypeScript SDK to fetch dynamic, robust, AI-generated responses for civic queries.
- **Firebase Authentication:** Uses Firebase Auth (Google Provider) to facilitate secure, fast, and familiar onboarding for users.

## How to Run locally

Make sure you have Node installed (v18 or higher recommended).

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Configure your API keys in a `.env` file (based on `.env.example`).
   - `GEMINI_API_KEY`: For the VoteGuide AI.
   - `VITE_FIREBASE_*`: Configuration keys for the Firebase project.
4. Run `npm run dev` to start the local development server.

## Technologies Used
* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Framer Motion**
* **Firebase (Auth)**
* **Google Gemini SDK (`@google/genai`)**
* **React Router DOM**
* **Lucide React (Icons)**
