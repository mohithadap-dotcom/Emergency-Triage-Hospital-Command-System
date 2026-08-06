import React from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  Radio,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SystemHealth, LogEntry } from '../types';

interface ObservabilityProps {
  systemHealth: SystemHealth;
  logs: LogEntry[];
  onRefreshTelemetry: () => void;
}

export const ObservabilityView: React.FC<ObservabilityProps> = ({
  systemHealth,
  logs,
  onRefreshTelemetry,
}) => {
  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            System Observability & Infrastructure Telemetry (SEOC Node #01)
          </h2>
          <p className="text-xs text-stone-500">
            Real-time monitoring of PostgreSQL database pool, Redis cache hit rates, WebSocket event mesh, and Gemini AI API gateway health.
          </p>
        </div>

        <button
          onClick={onRefreshTelemetry}
          className="bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs px-3 py-1.5 rounded flex items-center space-x-1.5 transition-colors self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Ping Telemetry</span>
        </button>
      </div>

      {/* Grid of System Engines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Postgres Status */}
        <div className="bg-white text-stone-900 p-3.5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-sky-400" />
              PostgreSQL DB
            </span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              {systemHealth.postgres.status}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Active Pools:</span>
              <span className="font-mono font-bold text-stone-900">{systemHealth.postgres.connections} conn</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Query Latency:</span>
              <span className="font-mono font-bold text-emerald-400">{systemHealth.postgres.latencyMs} ms</span>
            </div>
          </div>
        </div>

        {/* Redis Status */}
        <div className="bg-white text-stone-900 p-3.5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-400" />
              Redis Cache
            </span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              {systemHealth.redis.status}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Memory Usage:</span>
              <span className="font-mono font-bold text-stone-900">{systemHealth.redis.memoryUsedMB} MB</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Cache Hit Rate:</span>
              <span className="font-mono font-bold text-emerald-400">{systemHealth.redis.cacheHitRatePercent}%</span>
            </div>
          </div>
        </div>

        {/* WebSockets Gateway */}
        <div className="bg-white text-stone-900 p-3.5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              WebSockets Mesh
            </span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              {systemHealth.webSockets.gatewayStatus}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Live DEOC Sockets:</span>
              <span className="font-mono font-bold text-stone-900">{systemHealth.webSockets.activeConnections} active</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Cluster Nodes:</span>
              <span className="font-mono font-bold text-emerald-400">{systemHealth.activeNodes} Node Pods</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Gateway */}
        <div className="bg-white text-stone-900 p-3.5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              Gemini AI Engine
            </span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              {systemHealth.geminiAi.apiStatus}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>API Gateway Ping:</span>
              <span className="font-mono font-bold text-emerald-400">{systemHealth.geminiAi.latencyMs} ms</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>CPU / RAM Load:</span>
              <span className="font-mono font-bold text-stone-900">
                {systemHealth.cpuUsagePercent}% / {systemHealth.memoryUsagePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Stream Console */}
      <div className="bg-cream rounded-lg border border-stone-200 p-3.5 space-y-2">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <span className="text-xs font-mono font-bold text-stone-600 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            LIVE SYSTEM AUDIT LOG STREAM
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            STDOUT STREAM ACTIVE
          </span>
        </div>

        <div className="font-mono text-[11px] space-y-1.5 max-h-60 overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 border-b border-stone-200 pb-1">
              <span className="text-stone-500 text-[10px] shrink-0">{log.timestamp}</span>
              <span
                className={`font-bold shrink-0 px-1 rounded text-[9px] ${
                  log.level === 'WARN'
                    ? 'bg-amber-500 text-slate-950'
                    : log.level === 'AUDIT'
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {log.level}
              </span>
              <span className="text-amber-400 font-bold shrink-0">[{log.source}]</span>
              <span className="text-stone-800">{log.message}</span>
              <span className="text-stone-500 text-[10px] ml-auto shrink-0">({log.user})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
