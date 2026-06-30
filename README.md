# LASTSAVE - The Last-Minute Life Saver

**Track:** Problem Statement 1 - The Last-Minute Life Saver  
**Hackathon:** Vibe2Ship (Google for Developers + Coding Ninjas)

## What It Does

LASTSAVE is an AI-powered productivity companion that detects deadline paralysis and autonomously drafts your submissions. When the system fails, it generates calm, actionable recovery paths.

## Built With

- Google AI Studio (Gemini) for structured task classification and content synthesis
- Spring Boot (WebFlux) for reactive SSE streaming
- React + TypeScript + Tailwind CSS for immersive dark-mode UI
- Zustand + Framer Motion for state management and transitions

## Key Features

- Autonomous task classification (HIRE, CODE, DECK, THESIS, EMAIL)
- Live reasoning stream — watch the AI think in real-time
- Focus shield — blocks distractions during crunch time
- Phoenix recovery — automatic backup plans when submission fails
- Task manager with localStorage persistence
- PWA support for mobile installation

## Setup

### Prerequisites

- Java 21
- Node.js 20+
- Maven

### Backend
cd lastsave-backend
mvn spring-boot:run

### Frontend
bash
cd lastsave-frontend
npm install
npm run dev

### Environment Variables
Create lastsave-backend/src/main/resources/application.yml:
yaml
gemini:
  api:
    key: YOUR_GEMINI_API_KEY_HERE
server:
  port: 8080
Get your API key from: https://aistudio.google.com
Architecture
plain
[React Frontend] ←→ [Spring Boot Backend] ←→ [Google Gemini API]
     ↓                      ↓
[Zustand Store]      [Reactive SSE Stream]
[Framer Motion]      [Task Classification]
Screens
HOME — Task manager with upcoming deadlines
CRUNCH — Live AI reasoning stream
SEND — Draft preview with confidence score
SAFE — Recovery paths when submission fails
Note
The app includes robust fallback handling for API reliability. When Google Gemini API is under load, the system gracefully degrades to structured pre-written drafts while maintaining full Gemini integration architecture.
Team
Solo project for Vibe2Ship Hackathon

