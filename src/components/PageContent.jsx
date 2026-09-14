import React, { useState } from 'react';
import {
  Cloud,
  Zap,
  ShieldCheck,
  Cpu,
  Activity,
  Terminal,
  Lock,
  Server,
  CheckCircle2,
  Globe,
  Sliders,
  Database,
  Code2,
  BarChart3,
  Layers,
  Radio,
  Send,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const initialPagesData = [
  // Page 0: COVER
  {
    id: 0,
    type: 'cover',
    title: 'CLOUDBYTE',
    subtitle: 'Distributed Notification Engine & Architecture Specification',
    edition: 'v4.2.0 • Dark Mode Edition',
    badge: 'Enterprise Architecture'
  },
  // Page 1: ARCHITECTURE OVERVIEW
  {
    id: 1,
    type: 'overview',
    title: 'Distributed System Architecture',
    chapter: 'CHAPTER 01',
    description: 'Cloudbyte operates on a multi-region event bus processing high-concurrency payloads with guaranteed sub-10ms delivery latency.'
  },
  // Page 2: NOTIFICATION ENGINE & SIMULATOR
  {
    id: 2,
    type: 'engine',
    title: 'Notification Pipeline Simulator',
    chapter: 'CHAPTER 02',
    description: 'Interactive pipeline runner for real-time payload dispatch and queue processing.'
  },
  // Page 3: EVENT STREAM CODE SPEC
  {
    id: 3,
    type: 'code',
    title: 'Developer SDK & Integrations',
    chapter: 'CHAPTER 03',
    description: 'Seamless API integration via WebSocket stream and REST webhooks.'
  },
  // Page 4: ZERO TRUST SECURITY
  {
    id: 4,
    type: 'security',
    title: 'Zero-Trust Data Vault & Encryption',
    chapter: 'CHAPTER 04',
    description: 'End-to-end hardware-isolated payload encryption and RBAC token authentication.'
  },
  // Page 5: SYSTEM METRICS
  {
    id: 5,
    type: 'metrics',
    title: 'Global Delivery Analytics',
    chapter: 'CHAPTER 05',
    description: 'Real-time telemetry monitoring processing over 50,000 requests per second across 42 edge locations.'
  },
  // Page 6: BACK COVER
  {
    id: 6,
    type: 'backcover',
    title: 'CLOUDBYTE INC.',
    subtitle: 'Next-Generation Event Messaging Platform',
    status: 'ALL SYSTEMS OPERATIONAL'
  }
];

export function PageContent({ page, customData, onEditPage }) {
  const [copied, setCopied] = useState(false);
  const [simState, setSimState] = useState({
    sentCount: 1420,
    activeChannel: 'webhook',
    status: 'idle',
    lastEvent: null
  });

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSim = () => {
    setSimState(prev => ({ ...prev, status: 'dispatching' }));
    setTimeout(() => {
      setSimState(prev => ({
        sentCount: prev.sentCount + 1,
        status: 'delivered',
        lastEvent: `evt_${Math.random().toString(36).substring(2, 9)}`
      }));
    }, 600);
  };

  const pageInfo = customData || page;

  // Render Cover Page
  if (pageInfo.type === 'cover') {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-between bg-gradient-to-br from-[#06070a] via-[#0b0d14] to-[#040508] relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Top Emblem */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>{pageInfo.badge || 'Cloudbyte Specification'}</span>
          </div>
          <span className="text-xs font-mono text-gray-500">Vol. IV</span>
        </div>

        {/* Center Title */}
        <div className="my-auto z-10 flex flex-col gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold font-display tracking-tight text-metallic leading-tight">
              {pageInfo.title}
            </h1>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
              {pageInfo.subtitle}
            </p>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mt-2"></div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 flex justify-between items-center z-10 text-xs text-gray-500 font-mono">
          <span>{pageInfo.edition}</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        </div>
      </div>
    );
  }

  // Render Back Cover Page
  if (pageInfo.type === 'backcover') {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-between bg-gradient-to-tl from-[#040508] via-[#090b10] to-[#06070a] relative overflow-hidden border border-white/5">
        <div className="flex justify-between items-center text-xs font-mono text-gray-500">
          <span>INDEX & END</span>
          <span>PAGE {pageInfo.id}</span>
        </div>

        <div className="my-auto flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-metallic">{pageInfo.title}</h2>
          <p className="text-xs text-gray-400 max-w-xs">{pageInfo.subtitle}</p>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{pageInfo.status}</span>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-gray-600 border-t border-white/10 pt-4">
          &copy; 2026 Cloudbyte Systems Inc. All Rights Reserved.
        </div>
      </div>
    );
  }

  // Standard Page Render
  return (
    <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-[#08090e] text-gray-200 relative overflow-hidden border border-white/5">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            {pageInfo.chapter}
          </span>
          <span className="text-xs font-semibold text-gray-300 truncate max-w-[140px]">
            {pageInfo.title}
          </span>
        </div>
        <span className="text-xs font-mono text-gray-500">PG. 0{pageInfo.id}</span>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          {pageInfo.description}
        </p>

        {/* Dynamic Chapter Content based on page.type */}
        {pageInfo.type === 'overview' && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <div className="text-xs font-bold text-gray-200">Edge Clusters</div>
              <div className="text-[11px] text-gray-400">42 Nodes online in 18 regions worldwide.</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <div className="text-xs font-bold text-gray-200">Latency Target</div>
              <div className="text-[11px] text-gray-400">Average roundtrip 4.2ms global edge.</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <div className="text-xs font-bold text-gray-200">Queue Isolation</div>
              <div className="text-[11px] text-gray-400">Zero cross-tenant buffer interference.</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-xs font-bold text-gray-200">Failover SLA</div>
              <div className="text-[11px] text-gray-400">99.999% uptime with active replication.</div>
            </div>
          </div>
        )}

        {pageInfo.type === 'engine' && (
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Dispatch Channel
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="flex gap-2">
              {['webhook', 'push', 'sms'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setSimState(prev => ({ ...prev, activeChannel: ch }))}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    simState.activeChannel === ch
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {ch.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#040508] border border-white/5 flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between text-gray-400">
                <span>Payload:</span>
                <span className="text-indigo-300">JSON (256 bytes)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Dispatched Total:</span>
                <span className="text-white font-bold">{simState.sentCount}</span>
              </div>
              {simState.lastEvent && (
                <div className="flex justify-between text-emerald-400 text-[10px] pt-1 border-t border-white/5">
                  <span>Last ID:</span>
                  <span>{simState.lastEvent}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleRunSim}
              disabled={simState.status === 'dispatching'}
              className="glass-btn justify-center text-xs font-sans bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/30 text-indigo-200 mt-1"
            >
              {simState.status === 'dispatching' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <Send className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>{simState.status === 'dispatching' ? 'Dispatching Payload...' : 'Test Trigger Payload'}</span>
            </button>
          </div>
        )}

        {pageInfo.type === 'code' && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> App.jsx Integration
              </span>
              <button
                onClick={() => handleCopyCode(`import { Cloudbyte } from '@cloudbyte/sdk';\nconst cb = new Cloudbyte({ apiKey: 'cb_live_89a' });\nawait cb.notify({ topic: 'orders', payload: { id: 101 } });`)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-gray-300 overflow-x-auto leading-relaxed">
              <code>
                <span className="text-indigo-400">import</span> &#123; Cloudbyte &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-300">'@cloudbyte/sdk'</span>;<br /><br />
                <span className="text-purple-400">const</span> cb = <span className="text-indigo-400">new</span> Cloudbyte(&#123;<br />
                &nbsp;&nbsp;apiKey: <span className="text-emerald-300">'cb_live_sec_99x'</span>,<br />
                &nbsp;&nbsp;region: <span className="text-emerald-300">'us-east-1'</span><br />
                &#125;);<br /><br />
                <span className="text-gray-500">// Trigger event broadcast</span><br />
                <span className="text-indigo-400">await</span> cb.dispatch(&#123;<br />
                &nbsp;&nbsp;event: <span className="text-emerald-300">'user.signup'</span>,<br />
                &nbsp;&nbsp;data: &#123; id: 4092 &#125;<br />
                &#125;);
              </code>
            </pre>
          </div>
        )}

        {pageInfo.type === 'security' && (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-300">Hardware Isolated HSM</div>
                <div className="text-[11px] text-gray-400">AES-256-GCM envelope encryption for all payload strings.</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <Database className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-200">Ephemeral Storage</div>
                <div className="text-[11px] text-gray-400">Payload memory scrubbed instantly after dispatch confirmation.</div>
              </div>
            </div>
          </div>
        )}

        {pageInfo.type === 'metrics' && (
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-purple-400" /> Edge Delivery Rate
                </span>
                <span className="text-white font-bold">99.992%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[94%] rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="text-gray-500 text-[10px]">AVG LATENCY</div>
                <div className="text-sm font-bold text-cyan-400">3.8 ms</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="text-gray-500 text-[10px]">THROUGHPUT</div>
                <div className="text-sm font-bold text-indigo-400">54.2K /s</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Edit Prompt */}
      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-500 font-mono">
        <span>CONFIDENTIAL ARCHITECTURE</span>
        {onEditPage && (
          <button
            onClick={() => onEditPage(pageInfo)}
            className="hover:text-indigo-400 text-gray-400 underline transition-colors"
          >
            Edit Page Content
          </button>
        )}
      </div>
    </div>
  );
}
