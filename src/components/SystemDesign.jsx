import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Network, Server, Cpu, Database, Share2, Shield, Play, Pause, RefreshCw,
  GitBranch, Eye, Brain, Key, Terminal, BarChart2, Layers, CheckCircle2
} from 'lucide-react'

export default function SystemDesign() {
  const [activeTab, setActiveTab] = useState('hld') // 'hld' | 'rag' | 'patterns'
  const [requestType, setRequestType] = useState('cache-hit') // 'cache-hit' | 'cache-miss' | 'write-kafka'
  const [simStep, setSimStep] = useState(0) // 0 to 6
  const [isPlaying, setIsPlaying] = useState(false)
  const [simLogs, setSimLogs] = useState([])

  // HLD nodes representation coordinates
  const nodes = {
    client: { label: 'Client (User)', icon: Eye, color: 'text-sky-400 border-sky-500/30' },
    gateway: { label: 'API Gateway', icon: Shield, color: 'text-red-400 border-red-500/30' },
    lb: { label: 'Load Balancer', icon: Share2, color: 'text-yellow-400 border-yellow-500/30' },
    app: { label: 'App Cluster (Java 21)', icon: Server, color: 'text-primary border-primary/30' },
    redis: { label: 'Redis Cache', icon: Cpu, color: 'text-emerald-400 border-emerald-500/30' },
    db: { label: 'PostgreSQL DB', icon: Database, color: 'text-violet-400 border-violet-500/30' },
    kafka: { label: 'Kafka Event Broker', icon: Layers, color: 'text-fuchsia-400 border-fuchsia-500/30' },
    monitor: { label: 'Prometheus Log', icon: BarChart2, color: 'text-teal-400 border-teal-500/30' }
  }

  // Simulations step script based on request type
  const getSimScript = () => {
    if (requestType === 'cache-hit') {
      return [
        { node: 'client', log: 'Client: Dispatched GET /api/v1/subscription/10298', activePath: [] },
        { node: 'gateway', log: 'API Gateway: Authenticated JWT. Rate limit check passed (100/100). Routing to Load Balancer.', activePath: ['client-gateway'] },
        { node: 'lb', log: 'Load Balancer: Round-Robin lookup complete. Redirecting request to App Instance 2 (IP: 10.0.1.42).', activePath: ['client-gateway', 'gateway-lb'] },
        { node: 'app', log: 'App Server #2: Thread pooled (Virtual Thread #12804). Querying Redis cluster for caching key: sub:10298.', activePath: ['client-gateway', 'gateway-lb', 'lb-app'] },
        { node: 'redis', log: 'Redis Cache: REDIS HIT! Key found. Returning subscription state payload in <1ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis'] },
        { node: 'app', log: 'App Server #2: Formatted HTTP 200 payload. Logging metrics to Prometheus.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-monitor'] },
        { node: 'client', log: 'Client: Success! Subscription badge rendered. Round-Trip Time: 12ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-monitor', 'app-client'] }
      ]
    } else if (requestType === 'cache-miss') {
      return [
        { node: 'client', log: 'Client: Dispatched GET /api/v1/subscription/10298', activePath: [] },
        { node: 'gateway', log: 'API Gateway: Authenticated JWT. Request matched path routing configs.', activePath: ['client-gateway'] },
        { node: 'lb', log: 'Load Balancer: Routing traffic to healthy App Instance 3 (IP: 10.0.1.43).', activePath: ['client-gateway', 'gateway-lb'] },
        { node: 'app', log: 'App Server #3: Checked Redis for cache key. REDIS MISS! Fallback to database queries.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis'] },
        { node: 'db', log: 'PostgreSQL DB: Primary master query executed. Scan index match: subscription_pk.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-db'] },
        { node: 'app', log: 'App Server #3: Fetched row. Wrote result to Redis cache with 300s TTL. Sending log telemetry.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-db', 'app-redis-write', 'app-monitor'] },
        { node: 'client', log: 'Client: Success! Data fetched from DB. Cache warmed up. Round-Trip Time: 45ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-db', 'app-redis-write', 'app-monitor', 'app-client'] }
      ]
    } else {
      // write-kafka
      return [
        { node: 'client', log: 'Client: Dispatched POST /api/v1/billing/charge (Action: RENEW)', activePath: [] },
        { node: 'gateway', log: 'API Gateway: Blocked malicious headers. Verified request payload signature.', activePath: ['client-gateway'] },
        { node: 'lb', log: 'Load Balancer: Routing traffic to App Instance 1 (IP: 10.0.1.41).', activePath: ['client-gateway', 'gateway-lb'] },
        { node: 'app', log: 'App Server #1: Initiated database transaction block. Charging account.', activePath: ['client-gateway', 'gateway-lb', 'lb-app'] },
        { node: 'kafka', log: 'Kafka Event Broker: Published transaction event "billing.charge.success" to Topic partition #2.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-kafka'] },
        { node: 'db', log: 'PostgreSQL DB: Persisted billing audit transaction logs. Dispatched monitoring state.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-kafka', 'app-db', 'app-monitor'] },
        { node: 'client', log: 'Client: Payment accepted! Event processed asynchronously via Kafka. Round-Trip Time: 15ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-kafka', 'app-db', 'app-monitor', 'app-client'] }
      ]
    }
  }

  const script = getSimScript()

  // Loop simulation interval
  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setInterval(() => {
        setSimStep((step) => {
          if (step >= 6) {
            setIsPlaying(false)
            return 6
          }
          return step + 1
        })
      }, 1600)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  useEffect(() => {
    // Sync logs list with current steps
    const currentLogs = script.slice(0, simStep + 1).map((s) => s.log)
    setSimLogs(currentLogs)
  }, [simStep, requestType])

  const handleReset = () => {
    setSimStep(0)
    setIsPlaying(false)
  }

  const triggerStepSim = (type) => {
    setRequestType(type)
    setSimStep(0)
    setIsPlaying(true)
  }

  return (
    <section id="system-design" className="relative z-10 py-24 bg-background">
      <div className="section-container">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-primary">Architecture</p>
          <h2 className="section-title mt-2">Enterprise System Design</h2>
          <p className="section-subtitle max-w-2xl">
            HLD, LLD, and workflow pipelines built for scale, resilience, and low-latency performance.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex justify-center border-b border-border/60">
          <div className="flex gap-8">
            <button
              onClick={() => { setActiveTab('hld'); handleReset() }}
              className={`pb-4 text-sm font-semibold transition-all ${
                activeTab === 'hld'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Million-User Scale HLD
            </button>
            <button
              onClick={() => setActiveTab('rag')}
              className={`pb-4 text-sm font-semibold transition-all ${
                activeTab === 'rag'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              AI RAG & Agentic Design
            </button>
               <button
                 onClick={() => setActiveTab('lld')}
                 className={`pb-4 text-sm font-semibold transition-all ${
                   activeTab === 'lld'
                     ? 'border-b-2 border-primary text-primary'
                     : 'text-muted-foreground hover:text-foreground'
                 }`}
               >
                 LLD Diagram
               </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`pb-4 text-sm font-semibold transition-all ${
                activeTab === 'patterns'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Design Patterns (SAGA / CQRS)
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: HLD Simulation */}
            {activeTab === 'hld' && (
              <motion.div
                key="hld-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 lg:grid-cols-3"
              >
                {/* Visual Architecture Canvas */}
                <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between h-[480px] relative overflow-hidden bg-black/10">
                  
                  {/* SVG Connection Paths Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-border/40 fill-none" strokeWidth="2">
                    {/* Path mapping */}
                    <path id="client-gateway" d="M 50 200 L 150 200" className={script[simStep].activePath.includes('client-gateway') ? 'stroke-primary animate-pulse' : ''} />
                    <path id="gateway-lb" d="M 210 200 L 300 200" className={script[simStep].activePath.includes('gateway-lb') ? 'stroke-primary animate-pulse' : ''} />
                    
                    <path id="lb-app" d="M 360 200 L 450 180" className={script[simStep].activePath.includes('lb-app') ? 'stroke-primary animate-pulse' : ''} />
                    <path id="app-redis" d="M 510 180 L 610 90" className={script[simStep].activePath.includes('app-redis') ? 'stroke-primary animate-pulse' : ''} strokeDasharray="4 4" />
                    <path id="app-redis-write" d="M 510 180 L 610 90" className={script[simStep].activePath.includes('app-redis-write') ? 'stroke-emerald-400 animate-pulse' : ''} />
                    <path id="app-kafka" d="M 510 180 L 610 200" className={script[simStep].activePath.includes('app-kafka') ? 'stroke-fuchsia-400 animate-pulse' : ''} />
                    <path id="app-db" d="M 510 180 L 610 310" className={script[simStep].activePath.includes('app-db') ? 'stroke-violet-400 animate-pulse' : ''} />
                    <path id="app-monitor" d="M 480 150 L 330 90" className={script[simStep].activePath.includes('app-monitor') ? 'stroke-teal-400 animate-pulse' : ''} strokeDasharray="4 4" />
                    <path id="app-client" d="M 450 180 C 300 280, 150 280, 50 200" className={script[simStep].activePath.includes('app-client') ? 'stroke-emerald-400 animate-pulse' : ''} />
                  </svg>

                  {/* Nodes Grid Map */}
                  <div className="relative w-full h-full min-h-[360px]">
                    {/* Client */}
                    <div style={{ left: '10px', top: '175px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-24 text-center transition-all ${simStep === 0 || simStep === 6 ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 0 || simStep === 6 ? 'border-primary ring-2 ring-primary/20 text-primary' : 'border-border text-muted-foreground'}`}>
                        <Eye size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-foreground">Client App</span>
                    </div>

                    {/* Gateway */}
                    <div style={{ left: '130px', top: '175px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-24 text-center transition-all ${simStep === 1 ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 1 ? 'border-red-500 ring-2 ring-red-500/20 text-red-400' : 'border-border text-muted-foreground'}`}>
                        <Shield size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-foreground">API Gateway</span>
                    </div>

                    {/* Load Balancer */}
                    <div style={{ left: '280px', top: '175px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-28 text-center transition-all ${simStep === 2 ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 2 ? 'border-yellow-500 ring-2 ring-yellow-500/20 text-yellow-400' : 'border-border text-muted-foreground'}`}>
                        <Share2 size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-foreground">Load Balancer</span>
                    </div>

                    {/* Prometheus Monitor */}
                    <div style={{ left: '280px', top: '50px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-28 text-center transition-all`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg border-border text-muted-foreground`}>
                        <BarChart2 size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-teal-400">Telemetry Log</span>
                    </div>

                    {/* Active App Server Node */}
                    <div style={{ left: '430px', top: '150px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-28 text-center transition-all ${simStep === 3 || simStep === 5 ? 'scale-110' : ''}`}>
                      <div className={`w-14 h-14 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 3 || simStep === 5 ? 'border-primary ring-2 ring-primary/20 text-primary' : 'border-border text-muted-foreground'}`}>
                        <Server size={22} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-primary">App Server Cluster</span>
                    </div>

                    {/* Redis Cache Node */}
                    <div style={{ left: '600px', top: '50px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-28 text-center transition-all ${simStep === 4 && requestType !== 'write-kafka' ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 4 && requestType !== 'write-kafka' ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-400' : 'border-border text-muted-foreground'}`}>
                        <Cpu size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-emerald-400">Redis Cache</span>
                    </div>

                    {/* Kafka Queue */}
                    <div style={{ left: '600px', top: '175px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-28 text-center transition-all ${simStep === 4 && requestType === 'write-kafka' ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 4 && requestType === 'write-kafka' ? 'border-fuchsia-500 ring-2 ring-fuchsia-500/20 text-fuchsia-400' : 'border-border text-muted-foreground'}`}>
                        <Layers size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-fuchsia-400">Kafka Broker</span>
                    </div>

                    {/* PostgreSQL Database */}
                    <div style={{ left: '600px', top: '290px' }} className={`absolute flex flex-col items-center gap-1.5 z-10 w-28 text-center transition-all ${simStep === 4 && requestType === 'cache-miss' ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl border bg-card flex items-center justify-center shadow-lg ${simStep === 4 && requestType === 'cache-miss' ? 'border-violet-500 ring-2 ring-violet-500/20 text-violet-400' : 'border-border text-muted-foreground'}`}>
                        <Database size={20} />
                      </div>
                      <span className="text-[10px] font-semibold font-mono tracking-tight text-violet-400">PostgreSQL DB</span>
                    </div>
                  </div>

                  {/* Simulator Control Dashboard */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4 bg-card/10 select-none">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5 text-xs font-semibold"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        {isPlaying ? 'Pause' : 'Play Flow'}
                      </button>
                      <button
                        onClick={handleReset}
                        className="p-2 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                        title="Reset simulation"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>

                    {/* Flow selectors */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerStepSim('cache-hit')}
                        className={`px-3 py-1.5 text-xs rounded-full font-mono border transition-all ${
                          requestType === 'cache-hit'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-border bg-background hover:bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        GET (Cache Hit)
                      </button>
                      <button
                        onClick={() => triggerStepSim('cache-miss')}
                        className={`px-3 py-1.5 text-xs rounded-full font-mono border transition-all ${
                          requestType === 'cache-miss'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-border bg-background hover:bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        GET (Cache Miss)
                      </button>
                      <button
                        onClick={() => triggerStepSim('write-kafka')}
                        className={`px-3 py-1.5 text-xs rounded-full font-mono border transition-all ${
                          requestType === 'write-kafka'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-border bg-background hover:bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        POST (Kafka Audit)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Ticker Logs */}
                <div className="glass-card p-6 flex flex-col justify-between h-[480px]">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4 font-mono select-none">
                    <Terminal size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-foreground">Pipeline Console logs</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 space-y-3.5 no-scrollbar scroll-smooth">
                    {simLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2"
                      >
                        <span className="text-primary select-none">&gt;&gt;</span>
                        <span>{log}</span>
                      </motion.div>
                    ))}
                    {isPlaying && (
                      <div className="flex gap-1 items-center py-1 select-none">
                        <span className="w-1 h-3.5 bg-primary animate-pulse" />
                        <span className="text-[10px] text-muted-foreground animate-pulse">Running step {simStep + 1}/7...</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50 font-mono text-[10px] text-muted-foreground leading-relaxed select-none">
                    <span className="text-primary font-semibold">Scale Capabilities:</span> Dispatches events to Kafka topics, writes to Redis Cache with configured TTLs, maintains database consistency, and records Prometheus telemetry metric payloads.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: AI RAG & Agentic Workflow */}
            {activeTab === 'rag' && (
              <motion.div
                key="rag-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-3"
              >
                {/* Stage 1 */}
                <div className="glass-card p-6 flex flex-col justify-between border border-border/60">
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-400">
                      <Layers size={20} />
                    </div>
                    <h3 className="text-base font-bold mb-2">1. Ingestion & Embedding</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enterprise document logs, runbooks, and configurations are read and split into tokens. We parse text chunks using size/overlap metrics to preserve contextual sentences.
                    </p>
                    <ul className="mt-4 text-xs font-mono space-y-2 text-primary/80">
                      <li>• Chunk Size: 500 characters</li>
                      <li>• Chunk Overlap: 100 characters</li>
                      <li>• Model: text-embedding-3-small</li>
                    </ul>
                  </div>
                  <div className="mt-6 text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-4">
                    Vectorized chunks are indexed.
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="glass-card p-6 flex flex-col justify-between border border-border/60">
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Brain size={20} />
                    </div>
                    <h3 className="text-base font-bold mb-2">2. Vector Search (RAG)</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      User queries are vectorized dynamically. We run a cosine-similarity semantic index query on pgvector to fetch top-K configurations.
                    </p>
                    <ul className="mt-4 text-xs font-mono space-y-2 text-primary/80">
                      <li>• Index: ScaNN / IVFFlat</li>
                      <li>• Semantic Match Limit: Top 5 Chunks</li>
                      <li>• Spring AI Vector Framework</li>
                    </ul>
                  </div>
                  <div className="mt-6 text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-4">
                    Relevant context is combined.
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="glass-card p-6 flex flex-col justify-between border border-border/60">
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400">
                      <Key size={20} />
                    </div>
                    <h3 className="text-base font-bold mb-2">3. Multi-Agent reasoning</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The enriched context is fed into LLMs. AI Agents use structured Tool Calling to perform tasks (such as checking system metrics or clearing cache keys).
                    </p>
                    <ul className="mt-4 text-xs font-mono space-y-2 text-primary/80">
                      <li>• Model: GPT-4o / Claude 3.5 Sonnet</li>
                      <li>• Orchestrator-Worker agent pattern</li>
                      <li>• Target: Auto-remediation runbooks</li>
                    </ul>
                  </div>
                  <div className="mt-6 text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-4">
                    Resolves issues in &lt;3 seconds.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: LLD Simulation */}
            {activeTab === 'lld' && (
              <motion.div
                key="lld-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 lg:grid-cols-2"
              >
                {/* Placeholder LLD diagram */}
                <div className="glass-card p-6 flex flex-col justify-center items-center h-[300px]">
                  <h3 className="text-lg font-semibold mb-2">Low-Level Design</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Detailed component interactions, database schema snippets, and code level flow.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Design Patterns */}
            {activeTab === 'patterns' && (
              <motion.div
                key="patterns-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {/* CQRS */}
                <div className="glass-card p-6 border border-border/60 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400">
                      <GitBranch size={20} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">CQRS (Command Query Responsibility Segregation)</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Splits the read model from the write model to maximize microservice scaling. Write transactions execute on the primary database, while read requests query specialized caching indexes.
                    </p>
                    <div className="bg-black/25 font-mono text-xs p-3 rounded-lg border border-border/50 text-zinc-300 leading-relaxed">
                      <span className="text-yellow-400">Command Side</span>: Client HTTP POST &rarr; App &rarr; Postgres (Write DB) &rarr; Publish Event to Kafka.<br/><br/>
                      <span className="text-emerald-400">Query Side</span>: Kafka Event &rarr; Update Read Model &rarr; Redis Cache &rarr; Client HTTP GET check.
                    </div>
                  </div>
                  <div className="mt-6 text-xs text-primary/80 font-mono select-none">
                    Ensures write latency is independent of index updates.
                  </div>
                </div>

                {/* SAGA Orchestration */}
                <div className="glass-card p-6 border border-border/60 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">SAGA Pattern (Distributed Transactions)</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Maintains eventual consistency across separate microservice databases. Instead of holding standard ACID locks, services commit local rows and publish updates. If a step fails, the orchestrator triggers rollbacks.
                    </p>
                    <div className="bg-black/25 font-mono text-xs p-3 rounded-lg border border-border/50 text-zinc-300 leading-relaxed">
                      <span className="text-primary">Step 1</span>: Book Order (Order DB: PENDING)
                      <br />
                      <span className="text-primary">Step 2</span>: Process Charge (Billing DB: CHARGED)
                      <br />
                      <span className="text-red-400">Step 3 (FAIL)</span>: Reserve Stock (Inventory DB: OUT_OF_STOCK)
                      <br />
                      <span className="text-yellow-500">Compensate</span>: Refund Billing & Cancel Order (Order DB: CANCELLED)
                    </div>
                  </div>
                  <div className="mt-6 text-xs text-primary/80 font-mono select-none">
                    Prevents network resource locks across microservice clusters.
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
