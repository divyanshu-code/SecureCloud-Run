<div align="center">

  <h1>🚀 SecureCloud Run</h1>
  
  <p>
    <strong>A highly scalable, secure, and real-time remote code execution engine.</strong>
  </p>

  <p>
    <a href="#features"><img alt="Features" src="https://img.shields.io/badge/Features-Military%20Grade%20Sandbox-00e5ff?style=flat-square"></a>
    <a href="#tech-stack"><img alt="Tech Stack" src="https://img.shields.io/badge/Stack-Next.js%20%7C%20Docker%20%7C%20Redis-blueviolet?style=flat-square"></a>
    <a href="https://github.com/divyanshu-code/SecureCloud-Run/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square"></a>
    <a href="https://github.com/divyanshu-code/SecureCloud-Run/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"></a>
  </p>
</div>

---

## 📖 Table of Contents
- [What is it?](#-what-is-it)
- [Why SecureCloud Run?](#-why-securecloud-run)
- [Features](#-features)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Tech Stack](#-tech-stack)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 What is it?
**SecureCloud Run** is an open-source, interactive code execution platform. It allows users to write, execute, and test code in multiple programming languages directly from their web browser. By leveraging Docker and gVisor, it ensures that all untrusted code is executed in a strictly isolated, real-time environment.

---

## 🤔 Why SecureCloud Run?
Executing untrusted code submitted by anonymous users on a web server is inherently dangerous. A malicious user could write an infinite loop to freeze the server, a memory bomb to crash it, or a network scanner to hack internal systems.

### Why not Virtual Machines (VMs)?
While VMs provide total isolation, they are incredibly heavy. Booting a VM for every single code execution takes seconds (or minutes) and consumes gigabytes of RAM. For a real-time code playground, we need executions to start in milliseconds.

### Why not just Docker?
Docker solves the speed problem. Containers boot in milliseconds. However, containers share the host's operating system kernel. A sophisticated attacker could exploit a kernel vulnerability to "break out" of the container. Docker alone is not safe enough for untrusted code.

### The Solution: Docker + gVisor
To achieve the **speed of Docker** and the **security of VMs**, SecureCloud Run relies on **gVisor**. 
gVisor is an application kernel written by Google that acts as a secure sandbox between the Docker container and the host machine. It intercepts every system call and handles it in user-space. Even if a user breaks out of the Docker container, they remain trapped inside the gVisor sandbox, unable to touch the host server.

---

<a id="features"></a>
## ✨ Features
- **🔒 Military-Grade Sandboxing:** Untrusted code runs in heavily restricted Docker containers wrapped inside a gVisor sandbox.
- **🛡️ Strict Resource Limits:** Zero network access, dropped kernel privileges, and strict limits on CPU, RAM (512MB), and Threads (250).
- **🌍 Multi-Language Support:** Execute code in **JavaScript, Node.js, Python, Java, C++, Rust, and Go**.
- **⚡ Real-Time Execution:** Powered by Socket.IO, users see their code queueing, running, and completing in absolute real-time without refreshing.
- **📈 Infinite Scalability:** Uses **BullMQ** and **Redis** to manage a robust asynchronous job queue. Whether you have 10 or 1,000+ jobs queued simultaneously, the main API remains perfectly responsive. Scale throughput effortlessly by spinning up additional worker nodes (Warm Pool).
- **📊 Execution Metrics:** Tracks exact execution time and peak memory consumption dynamically.
- **💻 Premium Editor:** Features an embedded, customizable **Monaco Editor** (VS Code engine).
- **📝 Execution History:** All executed jobs are securely saved to a PostgreSQL database for user review.

---

## 🔄 Architecture & Data Flow

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Next.js
    participant API as Express API
    participant DB as PostgreSQL
    participant Redis as BullMQ
    participant Worker
    participant Sandbox as Docker and gVisor

    User->>NextJS: Clicks "Run Code"
    NextJS->>API: POST /api/execute (language, code)
    API->>DB: Create Job (Status: PENDING)
    API->>Redis: Enqueue Job
    API-->>NextJS: Return JobID & Queue Position
    NextJS->>User: Show "Waiting in Queue..."

    Redis->>Worker: Dequeue Job
    Worker->>DB: Update Status (RUNNING)
    Worker->>API: Emit "Status: RUNNING" via Socket.IO
    API->>NextJS: Broadcast Status
    
    Worker->>Sandbox: Create workspace & Spin up container
    Note over Sandbox: Restrict Network, Memory, CPU, PIDs
    Sandbox-->>Worker: Stream Execution Output & Memory Stats
    Worker->>Sandbox: Destroy Container & Workspace
    
    Worker->>DB: Save Output & Metrics, Update Status (COMPLETED)
    Worker->>API: Emit "Result" via Socket.IO
    API->>NextJS: Broadcast Final Output
    NextJS->>User: Display Result
```

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion, Monaco Editor, Zustand, Socket.IO Client.
- **Backend:** Node.js, Express.js, Prisma ORM.
- **Infrastructure:** Docker, gVisor (`runsc`), PostgreSQL, Redis (BullMQ), Socket.IO.

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
1. **Node.js** (v18 or higher)
2. **Docker Desktop** (Must be running)
3. **PostgreSQL** (Local or cloud)
4. **Redis** (Local or cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SecureCloud-Run.git
cd SecureCloud-Run
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Replace with your actual Postgres and Redis credentials
DATABASE_URL="postgresql://user:password@localhost:5432/securecloud?schema=public"
REDIS_URL="redis://localhost:6379"

JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-session-secret"

ENABLE_WORKER="true"
QUEUE_JOB_ATTEMPTS=3
```
Initialize the database and start the server:
```bash
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start the frontend application:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🤝 Contributing
Contributions are always welcome! Whether it's reporting a bug, discussing a new feature, or submitting a Pull Request, your input is highly valued. 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
