import { Terminal, Clock, HardDrive, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import ExecutionStatus from './ExecutionStatus';
import { useExecutionStore } from '@/src/store/execution.store';

export default function OutputPanel() {
  const { executionStatus, executionMetrics } = useExecutionStore();
  const isExecuting = executionStatus === 'queued' || executionStatus === 'running';

  const metrics = executionMetrics?.metrics || {};
  const { stdout, stderr, exitCode, executionTimeMs, memoryUsageMb, systemError } = metrics;

  // Differentiate status
  let displayStatus = 'Success';
  let statusColor = 'text-green-400';
  let StatusIcon = CheckCircle2;

  if (executionMetrics?.status === 'Failed') {
    if (systemError) {
      displayStatus = 'Timeout / System Error';
      statusColor = 'text-orange-400';
      StatusIcon = AlertTriangle;
    } else if (exitCode !== 0) {
      if (stderr && stderr.toLowerCase().includes('compile')) {
        displayStatus = 'Compilation Error';
        statusColor = 'text-red-400';
        StatusIcon = XCircle;
      } else {
        displayStatus = `Runtime Error (Exit ${exitCode})`;
        statusColor = 'text-red-400';
        StatusIcon = XCircle;
      }
    } else {
      displayStatus = 'Failed';
      statusColor = 'text-red-400';
      StatusIcon = XCircle;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#050508] border-l border-white/5 relative">

      {/* Panel Header */}
      <div className="flex items-center px-4 py-2 bg-[#0a0a0f] border-b border-white/10 shrink-0 justify-between">
        <div className="flex items-center">
          <Terminal size={16} className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-200 uppercase tracking-wider">Output</span>
        </div>
        {executionMetrics && !isExecuting && (
          <div className="text-xs text-gray-500 font-mono">
            {new Date(executionMetrics.createdAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed relative">
        {isExecuting ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#050508]/80 backdrop-blur-sm z-10">
            <ExecutionStatus />
          </div>
        ) : !executionMetrics ? (
          <div className="flex items-center justify-center h-full text-gray-600 italic">
            Run your code to see the output here.
          </div>
        ) : (
          <div className="space-y-4">

            {/* System Error Highlight */}
            {systemError && (
              <pre className="text-orange-400 whitespace-pre-wrap bg-orange-500/10 p-3 rounded border border-orange-500/20 shadow-inner">
                {systemError}
              </pre>
            )}

            {/* Standard Output */}
            {stdout && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">stdout</div>
                <pre className="text-gray-300 whitespace-pre-wrap">{stdout}</pre>
              </div>
            )}

            {/* Standard Error (Highlighted) */}
            {stderr && (
              <div className="space-y-1">
                <div className="text-xs text-red-500/70 uppercase tracking-wider">stderr</div>
                <pre className="text-red-400 whitespace-pre-wrap bg-red-500/5 p-3 rounded border border-red-500/10 shadow-inner">
                  {stderr}
                </pre>
              </div>
            )}

            {/* Fallback for old simple output */}
            {!stdout && !stderr && !systemError && executionMetrics.output && (
              <pre className="text-gray-300 whitespace-pre-wrap">{executionMetrics.output}</pre>
            )}

          </div>
        )}
      </div>

      {/* Metrics Footer */}
      {executionMetrics && !isExecuting && (
        <div className="shrink-0 flex flex-wrap gap-y-2 items-center justify-between px-4 py-2 bg-[#0a0a0f] border-t border-white/10 text-xs shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">

          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            <div className={`flex items-center space-x-1.5 ${statusColor}`}>
              <StatusIcon size={14} />
              <span className="font-semibold tracking-wide uppercase">{displayStatus}</span>
            </div>

            <div className="w-px h-3 bg-white/20" />

            {/* Execution Time */}
            <div className="flex items-center space-x-1.5 text-gray-400">
              <Clock size={14} />
              <span>{executionTimeMs !== undefined ? executionTimeMs : executionMetrics.executionTimeMs}ms</span>
            </div>

            {/* Memory Usage */}
            {memoryUsageMb && (
              <>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <HardDrive size={14} />
                  <span>{memoryUsageMb} MB</span>
                </div>
              </>
            )}
          </div>

          <div className="text-gray-600 flex items-center space-x-2">
            <span className="uppercase">{executionMetrics.language}</span>
            <span>•</span>
            <span>SecureCloud Node</span>
          </div>
        </div>
      )}

    </div>
  );
}
