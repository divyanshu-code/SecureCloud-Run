# SecureCloud Run

## What is it?
**SecureCloud Run** is a highly scalable, secure remote code execution engine and interactive playground. It allows users to write, execute, and test code in multiple programming languages directly from their web browser, instantly seeing the results in a sleek, real-time interface.

## Why is it?
Executing untrusted code submitted by random users on a web server is incredibly dangerous. A malicious user could write an infinite loop to freeze the server, a memory bomb to crash it, or a network scanner to hack internal systems.

### Why not just use Virtual Machines (VMs)?
While traditional Virtual Machines provide excellent security and total isolation, they are incredibly heavy and slow. Booting up a brand new VM for every single code execution would take several seconds (or minutes) and consume gigabytes of RAM. For a real-time code playground, we need executions to start in milliseconds, not minutes. 

### Why not just use Docker?
Docker solves the speed problem. Containers boot in milliseconds and share the host's operating system kernel. However, **Docker containers are not virtual machines**. Because they share the underlying OS kernel, a highly sophisticated attacker could potentially exploit a vulnerability in the Linux kernel to "break out" of the container and take over the host machine. Docker alone is not safe enough for running completely untrusted, anonymous code.

### The Solution: Docker + gVisor
To achieve both the **speed of Docker** and the **security of VMs**, SecureCloud Run relies on **gVisor**. 
gVisor is an application kernel written by Google that acts as a secure sandbox between the Docker container and the host machine. Instead of letting the Docker container talk directly to the host's Linux kernel, gVisor intercepts every system call and handles it in user-space. This provides a virtually impenetrable boundary. Even if a user breaks out of the Docker container, they are still trapped inside the gVisor sandbox, unable to touch the host server.

## Features
*   **Military-Grade Sandboxing (gVisor + Docker):** Untrusted code runs in heavily restricted Docker containers, wrapped inside a gVisor sandbox.
*   **Strict Resource Limits:** Zero network access, dropped kernel privileges, and strict limits on CPU, RAM (512MB), and Threads (250).
*   **Multi-Language Support:** Execute code in **JavaScript, Python, Java, C++, Rust, and Go**.
*   **Real-Time Execution:** Powered by Socket.IO, users see their code queueing, running, and completing in absolute real-time.
*   **Highly Scalable Architecture:** Uses **BullMQ** and **Redis** to manage a robust asynchronous job queue. Whether you have 10 or 1,000+ jobs queued simultaneously, the main API server remains perfectly responsive. You can effortlessly scale throughput by simply spinning up additional worker nodes (Warm Pool) connected to the same Redis instance to process jobs in parallel.
*   **Execution Metrics:** Tracks exact execution time and peak memory consumption.
*   **Premium Editor:** Features an embedded, customizable **Monaco Editor**.
*   **Execution History:** All executed jobs are securely saved to a PostgreSQL database.

---

## Tech Stack

### Frontend
*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS & Framer Motion
*   **Editor:** Monaco Editor (`@monaco-editor/react`)
*   **State Management:** Zustand
*   **Real-time Communication:** Socket.IO Client

### Backend & Infrastructure
*   **Server:** Node.js with Express.js
*   **Database:** PostgreSQL (managed via Prisma ORM)
*   **Job Queue:** BullMQ powered by Redis
*   **Sandbox Engine:** Docker
*   **Runtime Security:** gVisor (`runsc`)
*   **Real-time Communication:** Socket.IO

---

## How it Works (The Flow)

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

1.  **Code Submission:** The user types code in the frontend editor and clicks "Run". The request is sent to the Express backend.
2.  **Queueing:** The backend creates a new job in PostgreSQL with a status of `PENDING` and pushes the job into the **BullMQ** Redis queue. It immediately responds with the user's queue position.
3.  **Worker Processing:** A background worker constantly listens to Redis and pulls the next available job. It updates the database to `RUNNING` and notifies the frontend via Socket.IO.
4.  **Secure Sandboxing:** The worker creates a temporary workspace for the code, then spins up a Docker container using the **gVisor** runtime. It applies strict constraints (no network, dropped privileges, 512MB RAM cap).
5.  **Execution & Monitoring:** The code compiles and runs. The worker monitors the container's standard output and memory usage live.
6.  **Cleanup & Delivery:** Once finished, the container and workspace are instantly destroyed. The output and metrics are saved to the database, and the final payload is broadcasted back to the user via Socket.IO.

---

## How to Setup the Project

### Prerequisites
Before you begin, ensure you have the following installed and running on your machine:
1.  **Node.js** (v18 or higher)
2.  **Docker Desktop** (or Docker Engine on Linux)
3.  **PostgreSQL** (Local instance or cloud DB like Supabase/Neon)
4.  **Redis** (Local instance or cloud Redis like Upstash)

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone <your-repo-url>
cd SecureCloud-Run
```

### 2. Backend Setup
Navigate to the backend directory and install the necessary dependencies:
```bash
cd backend
npm install
```

Create a new file named `.env` in the `backend/` directory and configure your environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database & Redis Connection
# Replace with your actual Postgres and Redis credentials
DATABASE_URL="postgresql://user:password@localhost:5432/securecloud?schema=public"
REDIS_URL="redis://localhost:6379"

# Security Secrets (Generate random strings for these)
JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-session-secret"

# Worker Configuration
ENABLE_WORKER="true"
QUEUE_JOB_ATTEMPTS=3
```

Initialize your database schema using Prisma, then start the development server:
```bash
npx prisma db push
npm run dev
```
*Your backend is now running on http://localhost:5000.*

### 3. Frontend Setup
Open a **new** terminal window (leave the backend running), navigate to the frontend directory, and install the dependencies:
```bash
cd frontend
npm install
```

Create a new file named `.env.local` in the `frontend/` directory and point it to your backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the Next.js frontend server:
```bash
npm run dev
```

### 4. You're ready! 🎉
Open **[http://localhost:3000](http://localhost:3000)** in your browser. Create an account, head over to the Playground, and start securely executing code!
