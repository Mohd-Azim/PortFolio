import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server, Cpu, Database, Share2, Shield, Play, Pause, RefreshCw,
  GitBranch, Eye, Brain, Key, Terminal, BarChart2, Layers, CheckCircle2,
  ArrowRight, Code2, Workflow, Network, Zap, Lock, RotateCcw, Box, Globe
} from 'lucide-react'

/* ─── HLD simulation scripts ─────────────────────────────────────────────── */
const SIM_SCRIPTS = {
  'cache-hit': [
    { node: 'client',  log: 'Client: Dispatched GET /api/v1/subscription/10298', activePath: [] },
    { node: 'gateway', log: 'API Gateway: JWT authenticated. Rate-limit OK (100/100). Routing…', activePath: ['client-gateway'] },
    { node: 'lb',      log: 'Load Balancer: Round-Robin → App Instance 2 (10.0.1.42)', activePath: ['client-gateway', 'gateway-lb'] },
    { node: 'app',     log: 'App Server #2 [VThread-12804]: Querying Redis key sub:10298…', activePath: ['client-gateway', 'gateway-lb', 'lb-app'] },
    { node: 'redis',   log: '✅ Redis HIT! Subscription state found. Returned in <1ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis'] },
    { node: 'app',     log: 'App Server #2: HTTP 200 payload ready. Emitting Prometheus counter.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-monitor'] },
    { node: 'client',  log: '🎉 Client: Subscription badge rendered. RTT = 12ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-monitor', 'app-client'] },
  ],
  'cache-miss': [
    { node: 'client',  log: 'Client: Dispatched GET /api/v1/subscription/10298', activePath: [] },
    { node: 'gateway', log: 'API Gateway: JWT authenticated. Path matched /subscription.', activePath: ['client-gateway'] },
    { node: 'lb',      log: 'Load Balancer: Healthy route → App Instance 3 (10.0.1.43)', activePath: ['client-gateway', 'gateway-lb'] },
    { node: 'app',     log: 'App Server #3: Redis MISS on key sub:10298 → fallback to DB.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis'] },
    { node: 'db',      log: 'PostgreSQL: Index scan on subscription_pk. Row fetched in 8ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-db'] },
    { node: 'app',     log: 'App Server #3: DB row cached in Redis (TTL=300s). Telemetry sent.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-db', 'app-redis-write', 'app-monitor'] },
    { node: 'client',  log: '🎉 Client: Data delivered from DB. Cache warmed. RTT = 45ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-redis', 'app-db', 'app-redis-write', 'app-monitor', 'app-client'] },
  ],
  'write-kafka': [
    { node: 'client',  log: 'Client: POST /api/v1/billing/charge { action: RENEW }', activePath: [] },
    { node: 'gateway', log: 'API Gateway: Blocked malicious headers. Signature verified.', activePath: ['client-gateway'] },
    { node: 'lb',      log: 'Load Balancer: Routed to App Instance 1 (10.0.1.41)', activePath: ['client-gateway', 'gateway-lb'] },
    { node: 'app',     log: 'App Server #1: DB transaction opened. Charging account…', activePath: ['client-gateway', 'gateway-lb', 'lb-app'] },
    { node: 'kafka',   log: '📨 Kafka: Published "billing.charge.success" → Partition #2', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-kafka'] },
    { node: 'db',      log: 'PostgreSQL: Billing audit record persisted. Monitoring dispatched.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-kafka', 'app-db', 'app-monitor'] },
    { node: 'client',  log: '🎉 Client: Payment accepted. Kafka event async. RTT = 15ms.', activePath: ['client-gateway', 'gateway-lb', 'lb-app', 'app-kafka', 'app-db', 'app-monitor', 'app-client'] },
  ],
}

/* ─── Design patterns data ────────────────────────────────────────────────── */
const PATTERNS = [
  {
    icon: Globe,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    category: 'API Design',
    title: 'REST + Contract-First Design',
    summary: 'APIs versioned via URI (/v1/) with OpenAPI 3 contracts published before implementation. Response envelopes, pagination cursors, and idempotency keys enforced at gateway.',
    bullets: ['URI versioning /api/v1/', 'OpenAPI 3 contract first', 'Idempotency-Key header', 'Cursor-based pagination'],
    tag: 'API',
  },
  {
    icon: Shield,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    category: 'API Design',
    title: 'API Gateway + Circuit Breaker',
    summary: 'Centralised API Gateway handles auth, rate-limiting, and SSL termination. Circuit Breaker (Resilience4j) short-circuits failing downstream services, enabling graceful degradation.',
    bullets: ['JWT / OAuth2 at edge', 'Rate limiting (100 req/min)', 'Resilience4j circuit breaker', 'Fallback + bulkhead isolation'],
    tag: 'API',
  },
  {
    icon: GitBranch,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    category: 'Microservice',
    title: 'CQRS (Command Query Segregation)',
    summary: 'Write model and read model are fully separate. Commands mutate the primary DB and publish events to Kafka. Read replicas and Redis projections serve low-latency reads.',
    bullets: ['Command → Postgres write DB', 'Kafka event projection', 'Redis read cache (TTL 300s)', 'Independent scaling of reads'],
    tag: 'Microservice',
  },
  {
    icon: RotateCcw,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    category: 'Distributed',
    title: 'SAGA Pattern (Distributed Transactions)',
    summary: 'Choreography-based SAGA replaces 2PC across microservices. Each service commits locally and publishes domain events. Compensating transactions handle rollback on failure.',
    bullets: ['No distributed ACID locks', 'Compensating transactions', 'Kafka event choreography', 'Outbox pattern for at-least-once'],
    tag: 'Distributed',
  },
  {
    icon: Box,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    category: 'Microservice',
    title: 'Strangler Fig + Sidecar',
    summary: 'Legacy monolith migrated incrementally — new Java 21 microservices strangle the old system feature-by-feature. Sidecar containers handle observability (logs, metrics, traces).',
    bullets: ['Feature-flag-driven cutover', 'Parallel run + traffic split', 'Envoy / Linkerd sidecar', 'OpenTelemetry tracing'],
    tag: 'Microservice',
  },
  {
    icon: Zap,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    category: 'Distributed',
    title: 'Event-Driven + Outbox Pattern',
    summary: 'Events are written atomically to an outbox table in the same DB transaction as business data. A relay process tails the outbox and publishes to Kafka — guaranteeing exactly-once semantics.',
    bullets: ['Transactional outbox table', 'Debezium CDC relay', 'At-least-once Kafka delivery', 'Idempotent consumers'],
    tag: 'Distributed',
  },
  {
    icon: Lock,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    category: 'API Design',
    title: 'Zero-Trust Security (JWT + RBAC)',
    summary: 'Every service-to-service call is authenticated. JWT tokens carry role claims verified at each service boundary. RBAC rules enforced in Spring Security, with refresh-token rotation.',
    bullets: ['JWT + RBAC per endpoint', 'mTLS between services', 'Token rotation (15 min TTL)', 'Bot detection + reCAPTCHA'],
    tag: 'API',
  },
  {
    icon: Workflow,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    category: 'Distributed',
    title: 'Bulkhead + Rate Limiting',
    summary: 'Thread pools and semaphores are partitioned per downstream dependency (Bulkhead). Rate limiters at API Gateway prevent abuse. Virtual Threads (Java 21) allow high concurrency at low memory.',
    bullets: ['Semaphore bulkhead per service', 'Token-bucket rate limiter', 'Java 21 Virtual Threads', 'Backpressure via Kafka lag'],
    tag: 'Distributed',
  },
]

/* ─── LLD content ─────────────────────────────────────────────────────────── */
const LLD_SECTIONS = [
  {
    title: 'DB Schema — Subscription Service',
    icon: Database,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    code: `-- Core subscription table
CREATE TABLE subscriptions (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT      NOT NULL,
  plan_id       VARCHAR(32) NOT NULL,
  status        VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  -- CHECK (status IN ('ACTIVE','PAUSED','CANCELLED'))
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  renews_at     TIMESTAMPTZ NOT NULL,
  cancelled_at  TIMESTAMPTZ,
  idempotency_key VARCHAR(64) UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sub_user ON subscriptions(user_id);
CREATE INDEX idx_sub_renews ON subscriptions(renews_at)
  WHERE status = 'ACTIVE';

-- Billing audit log (append-only)
CREATE TABLE billing_events (
  id          BIGSERIAL PRIMARY KEY,
  sub_id      BIGINT REFERENCES subscriptions(id),
  event_type  VARCHAR(32) NOT NULL,
  amount_paise INT        NOT NULL,
  status      VARCHAR(16) NOT NULL,
  kafka_offset BIGINT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
  },
  {
    title: 'REST API Contracts',
    icon: Code2,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    code: `# Subscription Lifecycle Endpoints

GET    /api/v1/subscriptions/{userId}
  → 200 { id, plan, status, renewsAt }
  → 404 if no active subscription
  Headers: Authorization: Bearer <JWT>

POST   /api/v1/billing/charge
  Body: { userId, planId, action: RENEW }
  Headers: Idempotency-Key: <uuid>
  → 202 Accepted  (event published to Kafka)
  → 409 Conflict  (duplicate idempotency key)

PATCH  /api/v1/subscriptions/{id}/cancel
  → 200 { cancelledAt, refundEligible: true/false }

# Pagination
GET    /api/v1/billing/history?cursor=<token>&limit=20
  → 200 { items: [...], nextCursor, totalCount }`,
  },
  {
    title: 'Service Class Design',
    icon: Box,
    color: 'text-primary',
    bg: 'bg-primary/10',
    code: `// Layered architecture (Clean / Hexagonal)
@Service
class SubscriptionService {
  // Ports (interfaces)
  SubscriptionRepository repo;
  CachePort              cache;    // Redis
  EventPublisher         events;   // Kafka

  @Transactional
  SubscriptionDTO charge(ChargeCmd cmd) {
    // 1. Idempotency guard
    if (repo.existsByIdempotencyKey(cmd.key()))
      throw new DuplicateRequestException();

    // 2. Business invariant
    Subscription sub = repo.findActiveByUser(cmd.userId())
      .orElseThrow(SubscriptionNotFoundException::new);

    // 3. Domain mutation
    sub.renew(cmd.planId());

    // 4. Persist + publish (outbox pattern)
    repo.save(sub);
    events.publish(new BillingChargedEvent(sub));

    // 5. Invalidate cache
    cache.evict("sub:" + cmd.userId());
    return SubscriptionDTO.from(sub);
  }
}`,
  },
  {
    title: 'Kafka Event Schema',
    icon: Layers,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    code: `// Avro schema — billing.charge.success
{
  "namespace": "dev.mohdazim.billing",
  "type": "record",
  "name": "BillingChargedEvent",
  "fields": [
    { "name": "eventId",      "type": "string" },
    { "name": "userId",       "type": "long"   },
    { "name": "subscriptionId","type": "long"  },
    { "name": "planId",       "type": "string" },
    { "name": "amountPaise",  "type": "int"    },
    { "name": "occurredAt",   "type": "string" },
    { "name": "idempotencyKey","type": "string"}
  ]
}

// Topic config
Topic:      billing.events
Partitions: 12  (keyed by userId)
Replication: 3
Retention:  7 days
Consumer group: billing-processor, notification-svc`,
  },
  {
    title: 'Caching Strategy (Redis)',
    icon: Cpu,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    code: `// Cache-aside pattern implementation
@Cacheable(value = "subscriptions", key = "#userId",
           unless = "#result == null")
public SubscriptionDTO getSubscription(Long userId) {
  return repo.findActiveByUser(userId)
    .map(SubscriptionDTO::from)
    .orElse(null);
}

// Redis key structure
sub:{userId}         → JSON payload, TTL 300s
sub:plan:{planId}    → plan metadata, TTL 3600s
rate:{ip}:{endpoint} → counter, TTL 60s (rate-limit)

// Eviction strategy
@CacheEvict(value = "subscriptions", key = "#userId")
public void cancelSubscription(Long userId) { ... }

// Distributed lock for concurrent renewal requests
RLock lock = redisson.getLock("renew:" + userId);
lock.tryLock(1, 5, TimeUnit.SECONDS);`,
  },
  {
    title: 'CI/CD Pipeline',
    icon: Workflow,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    code: `# GitHub Actions — Zero-Downtime Deploy
name: Build → Test → Deploy

on: push to main

jobs:
  build:
    - mvn clean package -DskipTests
    - SonarQube quality gate (≥80% coverage)

  test:
    - mvn test (unit + integration)
    - Testcontainers: PostgreSQL + Redis + Kafka

  security-scan:
    - OWASP Dependency-Check
    - Trivy container vulnerability scan

  deploy:
    - docker build --target production
    - docker push ECR registry
    - aws ecs update-service --force-new-deployment
    # Health check: ECS waits for /actuator/health = UP
    # Rollback: automatic if health check fails × 3`,
  },
]

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const PATTERN_TAGS = ['All', 'API', 'Microservice', 'Distributed']

export default function SystemDesign() {
  const [activeTab, setActiveTab]       = useState('hld')
  const [requestType, setRequestType]   = useState('cache-hit')
  const [simStep, setSimStep]           = useState(0)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [simLogs, setSimLogs]           = useState([])
  const [patternFilter, setPatternFilter] = useState('All')
  const [lldActive, setLldActive]       = useState(0)

  const script = SIM_SCRIPTS[requestType]

  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setInterval(() => {
        setSimStep((step) => {
          if (step >= 6) { setIsPlaying(false); return 6 }
          return step + 1
        })
      }, 1500)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  useEffect(() => {
    setSimLogs(script.slice(0, simStep + 1).map((s) => s.log))
  }, [simStep, requestType])

  const handleReset = () => { setSimStep(0); setIsPlaying(false) }
  const triggerSim  = (type) => { setRequestType(type); setSimStep(0); setIsPlaying(true) }

  const isPathActive = (id) => script[simStep].activePath.includes(id)

  const filteredPatterns = patternFilter === 'All'
    ? PATTERNS
    : PATTERNS.filter(p => p.tag === patternFilter)

  const tabs = [
    { id: 'hld',      label: 'HLD Simulation' },
    { id: 'rag',      label: 'AI RAG Design' },
    { id: 'lld',      label: 'LLD & Code Design' },
    { id: 'patterns', label: 'Design Patterns' },
  ]

  return (
    <section id="system-design" className="relative z-10 py-16 sm:py-24 bg-background">
      <div className="section-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-primary">Architecture</p>
          <h2 className="section-title mt-2">Enterprise System Design</h2>
          <p className="section-subtitle max-w-2xl">
            HLD, LLD, design patterns, and workflow pipelines built for scale, resilience, and low-latency performance.
          </p>
        </motion.div>

        {/* Tab bar — scrollable on mobile */}
        <div className="mt-8 overflow-x-auto border-b border-border/60 no-scrollbar">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); handleReset() }}
                className={`pb-3 px-3 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <AnimatePresence mode="wait">

            {/* ══════════════ HLD TAB ══════════════ */}
            {activeTab === 'hld' && (
              <motion.div
                key="hld"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Flow type buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { type: 'cache-hit',   label: 'GET — Cache Hit' },
                    { type: 'cache-miss',  label: 'GET — Cache Miss' },
                    { type: 'write-kafka', label: 'POST — Kafka Audit' },
                  ].map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={() => triggerSim(type)}
                      className={`px-3 py-1.5 text-xs rounded-full font-mono border transition-all ${
                        requestType === type
                          ? 'bg-primary/10 border-primary text-primary font-bold'
                          : 'border-border bg-background hover:bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 lg:grid-cols-3">

                  {/* ── Architecture Canvas: desktop shows SVG, mobile shows list ── */}
                  <div className="lg:col-span-2 glass-card p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden"
                       style={{ minHeight: '440px' }}>

                    {/* Desktop SVG canvas — hidden on mobile */}
                    <div className="hidden sm:block relative flex-1" style={{ minHeight: '360px' }}>
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none fill-none"
                        strokeWidth="2"
                        style={{ overflow: 'visible' }}
                      >
                        {/* Connection paths */}
                        <path d="M 70 185 L 165 185"
                          className={isPathActive('client-gateway') ? 'stroke-primary animate-pulse' : 'stroke-border/40'} />
                        <path d="M 225 185 L 315 185"
                          className={isPathActive('gateway-lb') ? 'stroke-primary animate-pulse' : 'stroke-border/40'} />
                        <path d="M 375 185 L 450 170"
                          className={isPathActive('lb-app') ? 'stroke-primary animate-pulse' : 'stroke-border/40'} />
                        {/* Redis */}
                        <path d="M 510 155 L 590 75" strokeDasharray="5 4"
                          className={isPathActive('app-redis') ? 'stroke-emerald-400 animate-pulse' : 'stroke-border/30'} />
                        <path d="M 510 155 L 590 75"
                          className={isPathActive('app-redis-write') ? 'stroke-emerald-400 animate-pulse' : 'opacity-0'} />
                        {/* Kafka */}
                        <path d="M 510 170 L 590 185"
                          className={isPathActive('app-kafka') ? 'stroke-fuchsia-400 animate-pulse' : 'stroke-border/40'} />
                        {/* DB */}
                        <path d="M 510 185 L 590 295"
                          className={isPathActive('app-db') ? 'stroke-violet-400 animate-pulse' : 'stroke-border/40'} />
                        {/* Monitor */}
                        <path d="M 460 145 L 330 70" strokeDasharray="5 4"
                          className={isPathActive('app-monitor') ? 'stroke-teal-400 animate-pulse' : 'stroke-border/30'} />
                        {/* Return arc */}
                        <path d="M 450 175 C 300 280, 150 280, 70 195"
                          className={isPathActive('app-client') ? 'stroke-emerald-400 animate-pulse' : 'stroke-border/30'} strokeDasharray="6 4"/>
                      </svg>

                      {/* Node: Client */}
                      <NodeBox step={simStep} active={[0,6]} pos="left-[10px] top-[160px]"
                        icon={Eye} label="Client App" color="text-sky-400" border="border-sky-500" ring="ring-sky-500/20" />
                      {/* Node: API Gateway */}
                      <NodeBox step={simStep} active={[1]} pos="left-[145px] top-[160px]"
                        icon={Shield} label="API Gateway" color="text-red-400" border="border-red-500" ring="ring-red-500/20" />
                      {/* Node: Load Balancer */}
                      <NodeBox step={simStep} active={[2]} pos="left-[295px] top-[160px]"
                        icon={Share2} label="Load Balancer" color="text-yellow-400" border="border-yellow-500" ring="ring-yellow-500/20" />
                      {/* Node: Prometheus (top) */}
                      <NodeBox step={simStep} active={[5]} pos="left-[290px] top-[35px]"
                        icon={BarChart2} label="Prometheus" color="text-teal-400" border="border-teal-500" ring="ring-teal-500/20" small />
                      {/* Node: App Cluster */}
                      <NodeBox step={simStep} active={[3,5]} pos="left-[435px] top-[140px]"
                        icon={Server} label="App Cluster" color="text-primary" border="border-primary" ring="ring-primary/20" large />
                      {/* Node: Redis */}
                      <NodeBox step={simStep} active={requestType !== 'write-kafka' ? [4] : []} pos="left-[580px] top-[40px]"
                        icon={Cpu} label="Redis Cache" color="text-emerald-400" border="border-emerald-500" ring="ring-emerald-500/20" />
                      {/* Node: Kafka */}
                      <NodeBox step={simStep} active={requestType === 'write-kafka' ? [4] : []} pos="left-[580px] top-[160px]"
                        icon={Layers} label="Kafka Broker" color="text-fuchsia-400" border="border-fuchsia-500" ring="ring-fuchsia-500/20" />
                      {/* Node: PostgreSQL */}
                      <NodeBox step={simStep} active={requestType === 'cache-miss' ? [4,5] : requestType === 'write-kafka' ? [5] : []} pos="left-[580px] top-[270px]"
                        icon={Database} label="PostgreSQL" color="text-violet-400" border="border-violet-500" ring="ring-violet-500/20" />
                    </div>

                    {/* Mobile pipeline list — shown only on mobile */}
                    <div className="sm:hidden flex flex-col gap-2.5 flex-1">
                      {[
                        { key:'client',  label:'Client App',    icon:Eye,      color:'text-sky-400',     active:[0,6] },
                        { key:'gateway', label:'API Gateway',   icon:Shield,   color:'text-red-400',      active:[1] },
                        { key:'lb',      label:'Load Balancer', icon:Share2,   color:'text-yellow-400',   active:[2] },
                        { key:'app',     label:'App Cluster',   icon:Server,   color:'text-primary',      active:[3,5] },
                        ...(requestType !== 'write-kafka' ? [{ key:'redis', label:'Redis Cache', icon:Cpu, color:'text-emerald-400', active:[4] }] : []),
                        ...(requestType === 'write-kafka' ? [{ key:'kafka', label:'Kafka Broker', icon:Layers, color:'text-fuchsia-400', active:[4] }] : []),
                        ...(requestType !== 'cache-hit'  ? [{ key:'db', label:'PostgreSQL DB', icon:Database, color:'text-violet-400', active:[4,5] }] : []),
                        { key:'monitor', label:'Prometheus',    icon:BarChart2,color:'text-teal-400',     active:[5] },
                      ].map((node, idx, arr) => {
                        const Icon = node.icon
                        const isActive = node.active.includes(simStep)
                        return (
                          <div key={node.key} className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isActive ? `${node.color} border-current ring-2 ring-current/20 scale-110 bg-current/10` : 'text-muted-foreground border-border'
                            }`}>
                              <Icon size={15} />
                            </div>
                            <span className={`text-xs font-mono font-semibold flex-1 transition-colors ${isActive ? node.color : 'text-muted-foreground'}`}>
                              {node.label}
                            </span>
                            {isActive && <span className="text-[9px] text-primary font-mono animate-pulse">● ACTIVE</span>}
                            {idx < arr.length - 1 && (
                              <div className={`absolute left-[18px] mt-9 w-0.5 h-2.5 ${isActive ? 'bg-primary' : 'bg-border/30'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Controls + progress */}
                    <div className="border-t border-border/40 pt-3 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                        {isPlaying ? 'Pause' : 'Play Flow'}
                      </button>
                      <button onClick={handleReset}
                        className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
                        title="Reset">
                        <RefreshCw size={13} />
                      </button>
                      <div className="flex-1 flex gap-1 items-center min-w-[100px]">
                        {[0,1,2,3,4,5,6].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= simStep ? 'bg-primary' : 'bg-border/40'}`} />
                        ))}
                        <span className="text-[10px] font-mono text-muted-foreground ml-1 whitespace-nowrap">{simStep+1}/7</span>
                      </div>
                    </div>
                  </div>

                  {/* Console logs panel */}
                  <div className="glass-card p-4 sm:p-6 flex flex-col" style={{ minHeight: '440px' }}>
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4 select-none">
                      <Terminal size={14} className="text-primary" />
                      <span className="text-xs font-semibold font-mono">Pipeline Console</span>
                    </div>
                    <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-3 no-scrollbar">
                      {simLogs.map((log, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-2">
                          <span className="text-primary flex-shrink-0 select-none">&gt;&gt;</span>
                          <span className="text-zinc-300 break-words min-w-0">{log}</span>
                        </motion.div>
                      ))}
                      {isPlaying && (
                        <div className="flex gap-1.5 items-center animate-pulse">
                          <span className="w-1 h-3 bg-primary" />
                          <span className="text-[10px] text-muted-foreground">Step {simStep+1}/7 running…</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground leading-relaxed">
                      <span className="text-primary font-semibold">Scale:</span> Kafka events · Redis TTL · DB consistency · Prometheus telemetry
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ RAG TAB ══════════════ */}
            {activeTab === 'rag' && (
              <motion.div
                key="rag"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[
                  { icon: Layers,  color: 'bg-red-500/10 text-red-400',     title: '1. Ingestion & Embedding',
                    desc: 'Enterprise runbooks, API contracts, and configs are chunked and vectorized using text-embedding-3-small. Size/overlap parameters preserve context across boundaries.',
                    bullets: ['Chunk Size: 500 chars', 'Overlap: 100 chars', 'Model: text-embedding-3-small'], footer: 'Chunks indexed in pgvector.' },
                  { icon: Brain,   color: 'bg-emerald-500/10 text-emerald-400', title: '2. Semantic Search (RAG)',
                    desc: 'Queries are vectorized and matched via cosine similarity on pgvector. Top-K chunks retrieved and re-ranked for relevance before LLM prompt construction.',
                    bullets: ['Index: IVFFlat / ScaNN', 'Top-5 chunk retrieval', 'Spring AI VectorStore'], footer: 'Context assembled for LLM.' },
                  { icon: Key,     color: 'bg-violet-500/10 text-violet-400', title: '3. Multi-Agent Reasoning',
                    desc: 'Enriched prompts fed into GPT-4o / Claude 3.5. Orchestrator agents delegate to worker agents via Tool Calling — checking metrics, querying DBs, or triggering remediation.',
                    bullets: ['GPT-4o / Claude 3.5', 'Orchestrator-Worker pattern', 'Auto-remediation runbooks'], footer: 'Resolves incidents in <3s.' },
                ].map(({ icon: Icon, color, title, desc, bullets, footer }) => (
                  <div key={title} className="glass-card p-6 flex flex-col justify-between border border-border/60">
                    <div>
                      <div className={`mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg ${color}`}>
                        <Icon size={20} />
                      </div>
                      <h3 className="text-base font-bold mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                      <ul className="mt-4 text-xs font-mono space-y-1.5 text-primary/80">
                        {bullets.map(b => <li key={b}>• {b}</li>)}
                      </ul>
                    </div>
                    <p className="mt-6 text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-3">{footer}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ══════════════ LLD TAB ══════════════ */}
            {activeTab === 'lld' && (
              <motion.div
                key="lld"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5"
              >
                {/* LLD section selector */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {LLD_SECTIONS.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <button
                        key={i}
                        onClick={() => setLldActive(i)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border whitespace-nowrap transition-all flex-shrink-0 ${
                          lldActive === i
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                        }`}
                      >
                        <Icon size={11} />
                        {s.title.split('—')[0].trim().split(' ').slice(0, 2).join(' ')}
                      </button>
                    )
                  })}
                </div>

                {/* Active LLD panel */}
                {LLD_SECTIONS.map((section, i) => {
                  const Icon = section.icon
                  if (i !== lldActive) return null
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="glass-card p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-5 border-b border-border/50 pb-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${section.bg} ${section.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">{section.title}</h3>
                          <p className="text-[10px] font-mono text-muted-foreground">Low-Level Design · Production Implementation</p>
                        </div>
                      </div>
                      <pre className="overflow-x-auto text-[11px] sm:text-xs leading-relaxed font-mono rounded-lg p-4 no-scrollbar"
                           style={{ background: '#0d1117', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <code>{section.code}</code>
                      </pre>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* ══════════════ PATTERNS TAB ══════════════ */}
            {activeTab === 'patterns' && (
              <motion.div
                key="patterns"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Filter buttons */}
                <div className="flex gap-2 flex-wrap">
                  {PATTERN_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setPatternFilter(tag)}
                      className={`px-3 py-1.5 text-xs rounded-full font-mono border transition-all ${
                        patternFilter === tag
                          ? 'bg-primary/10 border-primary text-primary font-bold'
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                  {filteredPatterns.map((pattern, i) => {
                    const Icon = pattern.icon
                    return (
                      <motion.div
                        key={pattern.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-5 sm:p-6 border border-border/60 flex flex-col gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${pattern.bg}`}>
                            <Icon size={20} className={pattern.color} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm">{pattern.title}</h3>
                              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${pattern.bg} ${pattern.color} ${pattern.border}`}>
                                {pattern.category}
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{pattern.summary}</p>
                          </div>
                        </div>
                        <ul className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/40">
                          {pattern.bullets.map(b => (
                            <li key={b} className="flex items-start gap-1.5 text-[11px] font-mono text-primary/80">
                              <span className="text-primary mt-0.5 flex-shrink-0">▸</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ─── Desktop HLD Node Box helper ─────────────────────────────────────────── */
function NodeBox({ step, active, pos, icon: Icon, label, color, border, ring, large, small }) {
  const isActive = active.includes(step)
  const size = large ? 'w-14 h-14' : small ? 'w-10 h-10' : 'w-12 h-12'
  const iconSize = large ? 22 : small ? 16 : 20
  const width = large ? 'w-28' : small ? 'w-24' : 'w-24'

  return (
    <div
      className={`absolute flex flex-col items-center gap-1.5 z-10 text-center transition-all duration-300 ${width} ${pos} ${isActive ? 'scale-110' : ''}`}
    >
      <div className={`${size} rounded-xl border-2 bg-card flex items-center justify-center shadow-lg transition-all duration-300 ${
        isActive ? `${border} ring-2 ${ring} ${color}` : 'border-border text-muted-foreground'
      }`}>
        <Icon size={iconSize} />
      </div>
      <span className={`text-[9px] font-mono font-semibold leading-tight transition-colors ${isActive ? color : 'text-foreground/60'}`}>
        {label}
      </span>
    </div>
  )
}
