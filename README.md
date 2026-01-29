# Samriddhi: AI-Powered Citizen Welfare Portal

Samriddhi is a high-performance, multilingual e-governance platform designed to bridge the information gap between the Indian government and its citizens. By leveraging the **Gemini 3.0 API**, it provides semantic search, real-time eligibility matching, and automated document verification.

## 🚀 The Problem
Citizens often struggle to navigate the vast landscape of government welfare schemes due to:
*   **Information Asymmetry**: Unawareness of available benefits.
*   **Linguistic Barriers**: Difficulty understanding official documentation in non-native languages.
*   **Procedural Complexity**: Confusion regarding eligibility and required documents.
*   **Grievance Delays**: Lack of transparency and speed in redressal.

## ✨ The Solution: Samriddhi
A "Single Source of Truth" for citizen empowerment that humanizes the bureaucratic experience through AI.

### Core Features
*   **🤖 Gemini Semantic Search**: An intent-aware search bar that understands natural language queries (e.g., "I need help with my crops") rather than just keywords.
*   **🎙️ Multilingual Voice Assistant**: Integrated **Gemini Live API** supporting 26 regional languages for hands-free guidance and real-time conversation.
*   **🔍 AI Eligibility Engine**: Users describe their life context, and the AI matches them with the most relevant schemes instantly.
*   **📸 Smart Document Verification**: Uses computer vision to analyze uploaded IDs (Aadhaar, Ration Card) against scheme criteria to provide instant qualification feedback.
*   **⚖️ Grievance Redressal Hub**: A streamlined portal to report service failures with AI-driven priority tagging and real-time status tracking.
*   **🏥 Health & Support Directory**: Real-time schedules for free health camps and an emergency helpline directory with "AI Guidance Call" capabilities.

## 🛠️ Tech Stack
*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **AI Framework**: `@google/genai` (Gemini 3 Flash & Gemini 2.5 Flash Native Audio)
*   **Icons**: Lucide React
*   **Routing**: React Router 7
*   **State Management**: React Hooks (Context API for translations)

## 🧠 Gemini API Integration Points
*   **`gemini-3-flash-preview`**: Used for semantic search, eligibility analysis, document OCR/verification, and text translations.
*   **`gemini-2.5-flash-native-audio-preview-12-2025`**: Powers the **Samriddhi Sahayak** voice assistant for low-latency, human-like verbal interaction.

## 📦 Installation & Setup
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/samriddhi.git
    cd samriddhi
    ```
2.  **Environment Configuration**:
    The application requires an environment variable `API_KEY` for Google GenAI services.
3.  **Run Development Server**:
    The project uses standard ES modules. Serve the `index.html` using a local dev server (e.g., Vite or Live Server).

## 🛡️ Privacy & Security
Samriddhi prioritizes citizen data safety:
*   **In-Memory Processing**: Document scans for verification are processed in-memory and not persisted to external storage.
*   **End-to-End Encryption**: Secure communication with government-grade encryption protocols.
*   **OTP-Based Access**: Secure login using mobile number authentication.

---
*Built with ❤️ for a Digitally Empowered Bharat.*
