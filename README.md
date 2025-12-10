# 🖥️ Moinuddin's System Interface (v1.0.0)

![System Status](https://img.shields.io/badge/System-ONLINE-success?style=for-the-badge&logo=vercel)
![Framework](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Database](https://img.shields.io/badge/Redis-Vercel%20KV-red?style=for-the-badge&logo=redis)
![AI Core](https://img.shields.io/badge/AI-Gemini%20%2B%20Groq-blue?style=for-the-badge&logo=google-gemini)

> **"It ain't much, but it's honest work."**

A **High-Performance System Interface** masquerading as a personal portfolio. Designed to demonstrate backend architecture, security protocols, and interactive system design capabilities.

**[🚀 Launch Live System](https://moinuddin.vercel.app)**

---

## ⚡ System Architecture

This project is not a standard static website. It is a **Single Page Application (SPA)** architected to behave like a developer tool (Postman/Terminal). It features a real-time command interface, secure data transmission, and an autonomous AI kernel.

### 🧠 1. The MAGI_SYSTEM (Hybrid AI Kernel)
The chatbot (`/api/chat`) is powered by a **3-Layer Failover Intelligence System**:
1.  **Primary Layer:** Google Gemini 2.0 Flash Lite (Low latency, high context).
2.  **Secondary Layer:** Groq Llama 3 (70B) (Ultra-fast fallback if Google rate-limits).
3.  **Survival Layer:** Local Regex/Keyword matching (Offline mode if all APIs fail).

> **Flex:** The AI uses **RAG (Retrieval Augmented Generation)** to answer questions based strictly on my resume context. It handles multi-lingual greetings and technical engineering queries.

### 🔒 2. Secure Uplink (Contact Gateway)
The contact form (`/api/send`) is hardened against spam and abuse:
* **Rate Limiting:** Blocks IPs sending >3 requests/minute using an in-memory cache.
* **Honeypot:** Hidden fields detect and ban bots silently.
* **DNS Validation:** Verifies MX records to ensure email domains actually exist.
* **IP Forensics:** Logs sender metadata (IP, User-Agent) for security auditing.

### 👁️ 3. Real-Time Telemetry
* **Visitor Counter:** A serverless Redis (Vercel KV) implementation that tracks unique visitors without bloating the client.
* **Live Clock:** Detects user timezone and syncs with server time.

---

## 🛠️ Tech Stack

| Component | Technology | Use Case |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | SSR, API Routes, Edge Network |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **Animations** | Framer Motion | GPU-accelerated physics & transitions |
| **Database** | Vercel KV (Redis) | High-speed visitor counting |
| **AI Models** | Gemini Pro & Llama 3 | Context-aware chatbot logic |
| **Email** | Resend API | Transactional email delivery |

---

## 🚀 Installation & Setup

Clone the repository to deploy your own instance of the system.

### 1. Clone the Repository
git clone [https://github.com/Codesmith-23/system-portfolio.git](https://github.com/Codesmith-23/system-portfolio.git)

cd system-portfolio

### 2. Install dependencies
npm install

### 3. Configure Environment Variables
Create a .env.local file in the root directory. You need API keys for the AI and Email services.

### AI Services (Get one or both)
GEMINI_API_KEY="AIzaSy..."
GROQ_API_KEY="gsk_..."

### Email Service (Resend.com)
RESEND_API_KEY="re_..."
CONTACT_EMAIL="your-email@example.com"

### Database (Vercel KV - Optional for local dev)
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."



### 4. Run Development Server

npm run dev

Access the system at http://localhost:3000.


### 🛡️ Security Protocols
Input Sanitization: All user inputs are sanitized to prevent XSS attacks.

Header Hardening: X-Frame-Options and Content-Security-Policy configured in next.config.mjs.

Error Handling: Custom error.tsx and not-found.tsx to mimic system crashes rather than generic 404s.


### 👨‍💻 About The Architect
Mohammed Moinuddin Shaikh

Role: Backend Developer / System Architect

Focus: Scalable APIs, Distributed Systems, Cloud Computing

Education: B.E. Information Technology, MHSSCE

