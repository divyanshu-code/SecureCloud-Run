'use client';

import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const faqs = [
  {
    question: 'Why not just use AWS Lambda instead of a custom Worker Pool?',
    answer: 'AWS Lambda is fantastic, but it has severe limitations for arbitrary code execution. Lambda environments are heavily restricted, making it extremely difficult to compile C++ or run strict gVisor sandboxes. By using dedicated EC2 instances, we retain 100% control over the kernel, memory limits, and the Docker daemon, allowing us to enforce much stricter security guarantees than Lambda provides out-of-the-box.'
  },
  {
    question: 'What happens if a user writes an infinite loop?',
    answer: 'Every execution job has a strict 5-second timeout enforced by the worker process. If a container is still running after 5 seconds, the worker issues a `SIGKILL` to forcefully terminate the Docker container, freeing up the worker to pull the next job from Redis.'
  },
  {
    question: 'How do you prevent malicious users from crashing the server with memory leaks?',
    answer: 'We leverage Linux cgroups (Control Groups) via Docker. Each container is strictly limited to 128 MB of RAM. If a user\'s code exceeds this limit, the Linux kernel instantly terminates the process with an OOMKilled (Out Of Memory) error. Because the memory is physically capped by the OS, it is impossible for user code to exhaust the host server\'s RAM.'
  },
  {
    question: 'Why is Redis used instead of PostgreSQL for the queue?',
    answer: 'PostgreSQL is built for durability, while Redis is built for raw speed. A queue requires thousands of rapid inserts, updates, and deletes per second as jobs transition from waiting -> active -> completed. Doing this in PostgreSQL would cause massive transaction locks and I/O bottlenecks. Redis operates entirely in-memory, making it the perfect tool for a high-throughput FIFO queue.'
  },
  {
    question: 'Can user code access the internet to download dependencies?',
    answer: 'No. Containers are launched with `--network none`. This completely disables the network interface inside the sandbox. This strict rule guarantees that malicious users cannot use our servers to launch DDoS attacks, mine cryptocurrency, or exfiltrate sensitive data.'
  }
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-[#0a0a0f] rounded-xl overflow-hidden transition-colors hover:border-white/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <HelpCircle className={isOpen ? 'text-blue-400' : 'text-gray-500'} size={20} />
          <h3 className="font-semibold text-white text-lg">{question}</h3>
        </div>
        <ChevronDown 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} 
          size={20} 
        />
      </button>
      
      {/* Animated Dropdown Content */}
      <motion.div 
        initial={false} 
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} 
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2 bg-[#11111a]">
          {answer}
        </div>
      </motion.div>
    </div>
  );
};

export default function FaqSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-3xl pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          Answers to the most common engineering and architecture questions regarding SecureCloud Run.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

    </motion.div>
  );
}
