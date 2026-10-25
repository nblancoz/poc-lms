# POC LMS — Virtual AI Tutor with Voice Interaction

A functional Proof of Concept (POC) demonstrating an artificial intelligence-assisted learning experience on an LMS platform. It enables students to interact with lesson material through both text and voice, receive contextual pedagogical explanations narrated with native pronunciation, and maintain strict access control and persistent conversation continuity.

---

## 1. Key Features

- **Syllabus & Lesson Viewer**: Structured navigation of courses and lessons featuring rich Markdown content rendering (`remark-gfm`).
- **Contextual AI Tutor**: Warm, human, and pedagogical responses strictly bounded by the current lesson material. Inquiries outside the scope of the lesson are politely declined (`"No tengo información en esta lección para responder a eso."`).
- **Voice Interaction (STT & TTS)**:
  - **Speech-to-Text (STT)**: Real-time microphone dictation transcribing queries directly into the input field prior to submission, complete with recording indicators, a quick-stop bar, and a 7-second silence watchdog timer.
  - **Bilingual Text-to-Speech (TTS)**: Natural, human-like narration via the Web Speech API utilizing standard semantic HTML tags (`<span lang="en">` with `rehype-raw`) to pronounce English terms and dialogues with native US English phonetics, while delivering pedagogical explanations with high-fidelity neural Spanish voices.
  - **Bidirectional Acoustic Feedback Prevention**: Coordinated audio state that stops speech playback when activating the microphone and disables the microphone when narration begins, preventing audio loopbacks.
- **Access Control & Anti-IDOR Protection**: Strict authorization ensuring that lessons and chat histories can only be accessed by enrolled students.
- **Conversation Continuity**: Conversation history persistently stored in a relational database (PostgreSQL) associated with the specific student and lesson.
- **Resilience & Incident Recovery**: Reactive interaction statuses (`ready`, `thinking`, `offline`, `error`, `listening`) with network disconnection detection (`navigator.onLine`) and granular retry capabilities preserving user input.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, `react-markdown`, `rehype-raw`, `remark-gfm`, `@heroicons/react`.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, `@google/genai` (Official Google Gemini SDK), Zod, JWT, bcryptjs.
- **Database**: PostgreSQL 16 (via Docker Compose) managed with Prisma.
- **Code Quality**: ESLint 9 (Flat Config), Prettier, Strict TypeScript, Commitlint.

---

## 3. Prerequisites

- **Node.js**: Version `>= 24.0.0` (managed via `.nvmrc` or `nvm use`).
- **pnpm**: Version `>= 10.0.0` (`npm install -g pnpm` or `brew install pnpm`).
- **Docker & Docker Compose**: For running the PostgreSQL database container.

---

## 4. Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/nblancoz/poc-lms.git
cd poc-lms
```

### Step 2: Configure environment variables

Copy the sample environment file to configure your local setup:

```bash
cp .env.example .env
```

> **AI Provider Note**: By default, the application is preconfigured with a deterministic **Pedagogical Mock Provider** that requires no API keys, enabling reviewers to immediately test 100% of the functional flows (voice dictation, bilingual synthesis, boundaries, and security). To connect to live Gemini models, set `AI_PROVIDER=gemini` and provide your `GEMINI_API_KEY`.

### Step 3: Start the database

Launch the PostgreSQL service in the background:

```bash
docker compose up -d
```

### Step 4: Install dependencies

Install all root and workspace dependencies (`backend` and `frontend`):

```bash
pnpm install
```

### Step 5: Initialize and seed the database

Apply Prisma database migrations and seed preconfigured test users, courses, and lessons:

```bash
pnpm run db:setup
```

### Step 6: Start the development environment

Run both the backend API and frontend development server concurrently:

```bash
pnpm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 5. Preconfigured Test Accounts

The seeded database includes two accounts configured to demonstrate role-based access control and IDOR prevention:

| Profile / Account        | Email                          | Password      | Enrollment Status       | Evaluation Purpose                                                      |
| :----------------------- | :----------------------------- | :------------ | :---------------------- | :---------------------------------------------------------------------- |
| **Enrolled Student**     | `student.enrolled@example.com` | `password123` | **Enrolled** in courses | Full access to lessons, voice dictation, AI tutor, and chat history.    |
| **Unauthorized Student** | `student.noaccess@example.com` | `password123` | **Not Enrolled**        | Validation of access denial (anti-IDOR) and blocked lesson/chat access. |

> **Quick User Switcher (`UserSwitcher`)**: The top navigation bar includes an instant profile switcher allowing reviewers to toggle between the authorized and unauthorized accounts without having to manually log out and log in.

---

## 6. Functional Verification and Walkthrough

Follow these steps to evaluate the end-to-end functionality of the POC:

1. **Lesson Access & Curriculum**:
   - Navigate to [http://localhost:5173](http://localhost:5173) using the **Enrolled Student** profile.
   - Select the course _"Practical Everyday English & Pronunciation"_ and open the lesson _"Essential Travel English & Airport Navigation"_.
   - Review the structured Markdown content, dialogues, and pronunciation guidance.

2. **Speech-to-Text (STT) Dictation**:
   - In the right-hand AI Tutor chat panel, click the **microphone button** in the input bar.
   - Grant microphone permissions when prompted by the browser and speak your question aloud (e.g., _"What is the difference between carry-on luggage and checked baggage?"_).
   - Observe real-time transcription into the input field before submission.
   - Click **Send** (or press `Enter`).

3. **Contextual Reply & Bilingual Text-to-Speech (TTS)**:
   - The tutor returns a warm, structured pedagogical explanation.
   - Click the **"Listen"** button located on the assistant's response bubble.
   - Experience the bilingual speech synthesis: pedagogical explanations are narrated with a natural Spanish voice, while English terms and dialogues (e.g., `"carry-on luggage"`) are seamlessly pronounced with native US English phonetics.
   - Click the microphone while audio is playing to confirm that playback stops immediately to prevent acoustic loopback.

4. **Testing Contextual Boundaries (Off-Topic Inquiries)**:
   - Ask an off-topic question unrelated to the lesson (e.g., _"What is the recipe for Neapolitan pizza?"_ or _"Who won the soccer world cup?"_).
   - Confirm that the AI tutor strictly enforces lesson boundaries with the standardized response:  
     `"No tengo información en esta lección para responder a eso."`

5. **Access Control & Anti-IDOR Verification**:
   - Use the **User Switcher** in the top bar to switch to the **Unauthorized Student** (`student.noaccess@example.com`).
   - Attempt to navigate to the previous lesson URL.
   - Verify that access is explicitly denied, preventing unauthorized inspection of both the lesson content and previous chat messages.

6. **Conversation Continuity & Persistence**:
   - Switch back to the **Enrolled Student** profile.
   - Return to the lesson or refresh the browser page (`F5`).
   - Verify that all previous exchanges and suggestions are retrieved intact from the database.

7. **Incident Handling & Recovery**:
   - Click the microphone and remain silent for 7 seconds.
   - Notice the silence watchdog timeout trigger the alert _"No se detectó ninguna voz"_ with the recovery action _"Reintentar micrófono"_.
   - Simulate an offline event (via browser DevTools offline mode or disconnecting network); observe the tutor status update to `"offline"`, preventing lost messages and offering retry upon reconnection.

---

## 7. Design and Architecture Decisions

- **Native Web Speech API**: Leveraged browser-native `SpeechRecognition` and `SpeechSynthesis`. This eliminates recurring third-party API costs, minimizes round-trip latency, and prevents exposing secrets or API keys on the client side.
- **Semantic Tagging (`<span lang="en">`) with `rehype-raw`**: Rather than relying on fragile stopword dictionaries, the AI tutor wraps English terminology and dialogues in standard HTML tags with language attributes (`lang="en"`). The Markdown renderer cleanly handles them for accessibility (`a11y`), while the synthesis hook deterministically routes segments to native language voices.
- **Decoupled AI Provider Architecture (`AiProvider`)**: The backend separates business logic from specific LLM vendors via an extensible interface. It supports the official Google Gemini SDK (`@google/genai`) for production and a deterministic `MockAiProvider` for automated testing and offline evaluations.
- **Server-Side IDOR Protection**: Authorization is enforced at the controller and middleware level (`enrollment.middleware.ts`), verifying cryptographic JWTs and querying the database enrollment table before serving any lesson data or chat session.
- **Quick Profile Switcher for Frictionless Auditing**: Integrated client-side preset switcher allowing evaluators to rapidly test permission boundaries without repetitive credential entry.

---

## 8. Known Limitations and Scope Boundaries

- **Browser Web Speech API Support**: The Web Speech API is supported across Google Chrome, Microsoft Edge, Brave, and modern versions of Safari. In browsers lacking full support (such as desktop Firefox), the interface gracefully degrades: the microphone button is hidden or disabled, informing the user that text input remains available.
- **POC Scope Boundaries**: In accordance with the evaluation instructions, non-essential LMS modules (such as course authoring tools, certificate generators, and payment processing) were deliberately omitted to focus exclusively on the core AI and voice learning experience.

---

## 9. Available Scripts

The following commands are available from the root repository:

```bash
# Run backend (:3000) and frontend (:5173) concurrently
pnpm run dev

# Execute database migrations and seed data
pnpm run db:setup

# Run strict TypeScript checks across all workspaces
pnpm run typecheck

# Run static analysis with ESLint
pnpm run lint

# Auto-format all code with Prettier
pnpm run format

# Verify code formatting with Prettier
pnpm run format:check

# Build both backend and frontend bundles for production
pnpm run build
```

---

## 10. License

This project is licensed under the terms described in the [LICENSE](./LICENSE) file.
