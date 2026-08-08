'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import DetailPanel from './DetailPanel';

const initialNodes = [
  {
    id: "client",
    type: "custom",
    position: { x: 50, y: 300 },
    data: {
      label: "Client / Browser",
      subline: "User Interface",
      iconName: "Monitor",
      colorClass: "text-blue-400",
      glowClass: "bg-blue-500/20",
      borderClass: "border-blue-500/50",
      handles: [{ id: "right", position: "right", type: "source" }],
      details: {
        description:
          "This is where users interact with the online compiler. They write code, choose a programming language, and click the Run button. The browser sends the request to the backend and later displays the execution result.",

        specs: [
          { label: "Framework", value: "Next.js + React" },
          { label: "Editor", value: "Monaco Editor" }
        ],

        flow: [
          "User writes code.",
          "Selects a programming language.",
          "Clicks the Run button.",
          "Sends the request to the backend.",
          "Displays the execution result."
        ]
      }
    }
  },

  {
    id: "gateway",
    type: "custom",
    position: { x: 350, y: 300 },
    data: {
      label: "API Gateway",
      subline: "Request Handler",
      iconName: "Network",
      colorClass: "text-cyan-400",
      glowClass: "bg-cyan-500/20",
      borderClass: "border-cyan-500/50",
      handles: [
        { id: "left", position: "left", type: "target" },
        { id: "right", position: "right", type: "source" }
      ],
      details: {
        description:
          "The API Gateway is the first backend service. Every request passes through it before reaching the execution system.",

        specs: [
          { label: "Role", value: "Receive Requests" },
          { label: "Next Step", value: "Redis Queue" }
        ],

        flow: [
          "Receives the execution request.",
          "Checks if the request is valid.",
          "If valid, forwards it to Redis Queue.",
          "If invalid, immediately returns an error.",
          "Limits too many requests from the same user."
        ]
      }
    }
  },

  {
    id: "redis",
    type: "custom",
    position: { x: 650, y: 300 },
    data: {
      label: "Redis Queue",
      subline: "Waiting Line",
      iconName: "Database",
      colorClass: "text-red-400",
      glowClass: "bg-red-500/20",
      borderClass: "border-red-500/50",
      handles: [
        { id: "left", position: "left", type: "target" },
        { id: "right", position: "right", type: "source" }
      ],
      details: {
        description:
          "Redis works like a waiting line. Every code execution request is stored here until a worker becomes available.",

        specs: [
          { label: "Technology", value: "Redis + BullMQ" },
          { label: "Purpose", value: "Manage Jobs" }
        ],

        flow: [
          "Receives execution requests.",
          "Stores them in order.",
          "Waits until a worker is free.",
          "Sends the next job to an available worker."
        ]
      }
    }
  },

  {
    id: "worker",
    type: "custom",
    position: { x: 950, y: 300 },
    data: {
      label: "Worker Pool",
      subline: "Code Executor",
      iconName: "Cpu",
      colorClass: "text-emerald-400",
      glowClass: "bg-emerald-500/20",
      borderClass: "border-emerald-500/50",
      handles: [
        { id: "left", position: "left", type: "target" },
        { id: "top", position: "top", type: "source" },
        { id: "bottom", position: "bottom", type: "source" },
        { id: "right", position: "right", type: "source" }
      ],
      details: {
        description:
          "A Worker is a background process that runs user code. Multiple workers run at the same time, allowing the system to execute many requests without slowing down.",

        specs: [
          { label: "Workers", value: "Multiple Running Together" },
          { label: "Jobs per Worker", value: "One at a Time" },
          { label: "Scaling", value: "Add More Workers Anytime" }
        ],

        flow: [
          "Continuously watches the Redis Queue.",
          "Picks the next available job.",
          "Creates a secure Docker container.",
          "Runs the user's code.",
          "Collects the output.",
          "Deletes the temporary container.",
          "Waits for the next job."
        ]
      }
    }
  },

  {
    id: "sandbox1",
    type: "custom",
    position: { x: 1250, y: 150 },
    data: {
      label: "JavaScript Sandbox",
      subline: "Secure Environment",
      iconName: "Box",
      colorClass: "text-yellow-400",
      glowClass: "bg-yellow-500/20",
      borderClass: "border-yellow-500/50",
      handles: [{ id: "left", position: "left", type: "target" }],
      details: {
        description:
          "The JavaScript code runs inside its own isolated Docker container. This keeps the main server safe even if the code crashes or contains harmful commands.",

        specs: [
          { label: "Language", value: "JavaScript" },
          { label: "Runtime", value: "Node.js" },
          { label: "Time Limit", value: "5 Seconds" }
        ],

        flow: [
          "Creates a temporary Docker container.",
          "Runs the JavaScript code.",
          "Captures output or errors.",
          "Deletes the container after execution."
        ],

        security: [
          "Docker isolation",
          "Protected by gVisor",
          "No internet access"
        ]
      }
    }
  },

  {
    id: "sandbox2",
    type: "custom",
    position: { x: 1250, y: 300 },
    data: {
      label: "Python Sandbox",
      subline: "Secure Environment",
      iconName: "Box",
      colorClass: "text-blue-400",
      glowClass: "bg-blue-500/20",
      borderClass: "border-blue-500/50",
      handles: [{ id: "left", position: "left", type: "target" }],
      details: {
        description:
          "Python programs are executed inside an isolated Docker container to protect the server from unsafe code.",

        specs: [
          { label: "Language", value: "Python" },
          { label: "Runtime", value: "Python 3.11" },
          { label: "Time Limit", value: "5 Seconds" }
        ],

        flow: [
          "Creates a temporary container.",
          "Runs the Python program.",
          "Collects the output.",
          "Removes the container."
        ],

        security: [
          "Docker isolation",
          "Protected by gVisor",
          "No internet access"
        ]
      }
    }
  },

  {
    id: "sandbox3",
    type: "custom",
    position: { x: 1250, y: 450 },
    data: {
      label: "Go Sandbox",
      subline: "Secure Environment",
      iconName: "Box",
      colorClass: "text-cyan-400",
      glowClass: "bg-cyan-500/20",
      borderClass: "border-cyan-500/50",
      handles: [{ id: "left", position: "left", type: "target" }],
      details: {
        description:
          "Go programs run inside their own isolated container. After execution, the output is returned and the container is automatically removed.",

        specs: [
          { label: "Language", value: "Go" },
          { label: "Runtime", value: "Go 1.21" },
          { label: "Time Limit", value: "5 Seconds" }
        ],

        flow: [
          "Creates a temporary container.",
          "Runs the Go program.",
          "Collects the output.",
          "Deletes the container."
        ],

        security: [
          "Docker isolation",
          "Protected by gVisor",
          "No internet access"
        ]
      }
    }
  }
];

const initialEdges = [
  { id: 'e1-2', source: 'client', target: 'gateway', animated: true, style: { stroke: '#38BDF8', strokeWidth: 2 } },
  { id: 'e2-3', source: 'gateway', target: 'redis', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
  { id: 'e3-4', source: 'redis', target: 'worker', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'e4-5', source: 'worker', sourceHandle: 'top', target: 'sandbox1', animated: true, style: { stroke: '#EAB308', strokeWidth: 2 } },
  { id: 'e4-6', source: 'worker', sourceHandle: 'right', target: 'sandbox2', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'e4-7', source: 'worker', sourceHandle: 'bottom', target: 'sandbox3', animated: true, style: { stroke: '#06B6D4', strokeWidth: 2 } },
];

export default function InteractiveMap() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-transparent"
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
        <Controls className="bg-[#0a0a0f] border-white/10 fill-white text-white" />
      </ReactFlow>

      {/* Slide-out detail panel */}
      <DetailPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
