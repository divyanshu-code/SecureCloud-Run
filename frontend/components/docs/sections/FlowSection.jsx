'use client';

import { motion } from 'framer-motion';
import { Play, ShieldCheck, ListTree, Cpu, Box, Trash2, ArrowRight } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const steps = [
  {
    stepNumber: '01',
    title: 'Client Request',
    icon: Play,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    description: 'The user finishes writing their code in the browser and clicks the "Run" button.',
    details: [
      'The Monaco Editor extracts the raw string of the source code.',
      'The frontend packages the code, the selected programming language, and the user JWT token into a JSON payload.',
      'An HTTP POST request is dispatched to the backend API Gateway (`/api/v1/execute`).'
    ]
  },
  {
    stepNumber: '02',
    title: 'API Gateway Verification',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    description: 'When a user clicks "Run," the request first arrives at the API Gateway. The gateway validates the request, ensures it follows the required rules, and checks that the user is not sending too many requests. If the request passes these checks, it is forwarded to the Redis Queue. Otherwise, it is rejected with an error message.',
    details: [
      'Authentication: Validates the JWT to ensure the user is authorized.',
      'Rate Limiting: Checks Redis to ensure the user hasn\'t exceeded their quota (e.g., 10 requests per minute).',
      'Payload Validation: Ensures the source code string does not exceed the maximum allowed size (e.g., 50KB) to prevent memory exhaustion attacks.',
      'If all checks pass, the API constructs a Job Object.'
    ]
  },
  {
    stepNumber: '03',
    title: 'Redis Queueing',
    icon: ListTree,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    description: 'Once the request is validated, the API creates a job containing the user\'s code and selected programming language.This job is added to the Redis Queue, where it waits for the next available worker.By using a queue, the platform can safely handle many users at the same time without slowing down or overloading the server.',
    details: [
      'The API server immediately responds to the client with a Job ID (e.g., HTTP 202 Accepted) and closes the connection to free up threads.',
      'The Job waits in the queue until a worker is ready to process it.',
      'Why? This prevents the API from crashing during high-traffic spikes. If 1,000 users click "Run" simultaneously, they simply pile up in Redis while the workers chew through them at a safe, controlled pace.'
    ]
  },
  {
    stepNumber: '04',
    title: 'Worker Assignment',
    icon: Cpu,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    description: 'The internal Worker Pool constantly polls the Redis queue for new jobs.',
    details: [
      'An idle Node.js worker pulls the next available job off the queue.',
      'The worker marks the job status as "Active" in Redis.',
      'Once a worker is busy, it will not accept any new jobs until it finishes. Other available workers in the horizontally scaled pool will continue pulling the remaining jobs.'
    ]
  },
  {
    stepNumber: '05',
    title: 'Sandboxed Execution',
    icon: Box,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    description: 'The worker picks the next job from the queue and runs the user\'s code inside a secure container.After execution, it collects the output and finishes the job.',
    details: [
      'Volume Mount: The worker writes the user code to a temporary file in a tightly controlled `/tmp` directory.',
      'Container Spawn: A fresh Docker container is launched using the appropriate language image (e.g., `python:3.11-alpine`).',
      'Execution: The code is compiled (if necessary) and run inside the container under the strict supervision of the gVisor user-space kernel.',
      'Stream Capture: The worker attaches to the container\'s `stdout` and `stderr` streams, streaming the output to memory.'
    ]
  },
  {
    stepNumber: '06',
    title: 'Cleanup & Response',
    icon: Trash2,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    description: 'The execution concludes, the sandbox is destroyed, and the output is delivered.',
    details: [
      'Destruction: Regardless of success, failure, or a timeout (e.g., > 5 seconds), the worker ruthlessly kills the Docker container and deletes the temporary files.',
      'State Update: The captured `stdout`/`stderr` and execution time are saved back to Redis, and the job is marked as "Completed".',
      'Delivery: The client, which has been polling the API (or listening via WebSockets) using the Job ID, receives the final output.'
    ]
  }
];

export default function FlowSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-4xl pb-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Execution Flow</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          Follow the complete lifecycle of a code execution request. Starting from the moment a user clicks "Run," this guide explains how the request is validated, queued, processed by a worker, executed inside a secure Docker container, and finally returned to the user as the execution result.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative mt-12">
        {/* Vertical Line connecting the steps */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-red-500/50 to-purple-500/50 hidden md:block" />

        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.stepNumber}
                variants={itemVariants}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12"
              >
                {/* Step Indicator (Left) */}
                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 z-10 shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#0B1120] ${step.bg} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                    <Icon className={step.color} size={24} />
                  </div>
                  <div className="font-mono text-sm font-bold text-gray-500">
                    STEP {step.stepNumber}
                  </div>
                </div>

                {/* Content Card (Right) */}
                <div className={`flex-1 p-6 rounded-2xl border ${step.border} bg-white/5 backdrop-blur-sm relative overflow-hidden group transition-colors duration-300`}>
                  <h3 className={`text-2xl font-bold ${step.color} mb-3`}>{step.title}</h3>
                  <p className="text-white text-base leading-relaxed mb-6 font-medium">
                    {step.description}
                  </p>

                  <div className="space-y-3">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                        <ArrowRight size={16} className={`shrink-0 mt-0.5 ${step.color} opacity-70`} />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
}
