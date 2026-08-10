'use client';

import { useState } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import Toolbar from './Toolbar';
import OutputPanel from './OutputPanel';
import HistoryModal from './HistoryModal';
import { executionService } from '@/src/services/execution.service';
import { useExecutionStore } from '@/src/store/execution.store';
import toast from 'react-hot-toast';

const defaultCodes = {
  javascript: `// Welcome to the SecureCloud Run,\n// write your code here\n\n`,
  python: `# Welcome to the SecureCloud Run,\n# write your code here\n\n`,
  go: `// Welcome to the SecureCloud Run,\n// write your code here\n\n`,
  rust: `// Welcome to the SecureCloud Run,\n// write your code here\n\n`,
  java: `// Welcome to the SecureCloud Run,\n// write your code here\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}\n`,
  cpp: `// Welcome to the SecureCloud Run,\n// write your code here\n\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}\n`
};

export default function PlaygroundLayout() {
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [code, setCode] = useState(defaultCodes['javascript']);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    executionStatus,
    executionOutput,
    executionError,
    executionMetrics,
    setExecutionStatus,
    setCurrentJob,
    setExecutionError,
    setExecutionOutput,
    setExecutionMetrics
  } = useExecutionStore();

  const isExecuting = executionStatus === 'queued' || executionStatus === 'running';

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(defaultCodes[newLang]);
    setExecutionOutput('');
    setExecutionError('');
    setExecutionMetrics(null);
  };

  const handleRun = async () => {
    if (process.env.NEXT_PUBLIC_SHOWCASE_MODE === 'true') {
      toast('Code execution is disabled in Showcase Mode because the Docker infrastructure is offline.', { icon: '🚧' });
      return;
    }

    try {
      setExecutionStatus('queued');
      setExecutionOutput('');
      setExecutionError('');
      setExecutionMetrics(null);

      // Submit job to backend API
      const response = await executionService.submitJob(language, code);

      // Store the returned metadata in Zustand (DO NOT wait for output)
      setCurrentJob({
        jobId: response.jobId,
        language: language,
        position: response.position
      });

      toast.success(`Job queued successfully! Position: ${response.position}`);

    } catch (err) {
      setExecutionStatus('failed');
      setExecutionError(err.message || 'Failed to submit job to execution engine.');
      toast.error('Job submission failed.');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] overflow-hidden rounded-t-xl border border-white/10 shadow-2xl relative z-10">

      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      <Toolbar
        language={language} setLanguage={handleLanguageChange}
        theme={theme} setTheme={setTheme}
        fontSize={fontSize} setFontSize={setFontSize}
        isExecuting={isExecuting} onRun={handleRun}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal">

          <Panel defaultSize={65} minSize={30}>
            <div className="h-full pt-2 bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={language}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  padding: { top: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                }}
              />
            </div>
          </Panel>

          <Separator className="w-1.5 bg-black/50 hover:bg-primary/50 transition-colors cursor-col-resize flex items-center justify-center">
            <div className="h-8 w-0.5 bg-white/20 rounded" />
          </Separator>

          <Panel defaultSize={35} minSize={20}>
            <OutputPanel
              output={executionOutput}
              error={executionError}
              isExecuting={isExecuting}
              metrics={executionMetrics}
            />
          </Panel>

        </Group>
      </div>
    </div>
  );
}
