import { useEffect, useState, useRef } from 'react'

const SCRIPT = [
  // 1. Maven clean package
  { type: 'input', text: 'mvn clean package -DskipTests' },
  { type: 'output', text: '[INFO] Scanning for projects...', delay: 350 },
  { type: 'output', text: '[INFO] ------------------------------------------------------------------------', delay: 80 },
  { type: 'output', text: '[INFO] Building paytm-billing-service 1.0.0-SNAPSHOT', delay: 80 },
  { type: 'output', text: '[INFO] ------------------------------------------------------------------------', delay: 80 },
  { type: 'output', text: '[INFO] --- maven-clean-plugin:3.2.0:clean (default-clean) ---', delay: 180 },
  { type: 'output', text: '[INFO] --- maven-resources-plugin:3.3.0:resources (default-resources) ---', delay: 180 },
  { type: 'output', text: '[INFO] --- maven-compiler-plugin:3.11.0:compile (default-compile) ---', delay: 250 },
  { type: 'output', text: '[INFO] Recompiling the module: paytm-billing-service (42 sources)', delay: 180 },
  { type: 'output', text: '[INFO] --- maven-jar-plugin:3.3.0:jar (default-jar) ---', delay: 250 },
  { type: 'output', text: '[INFO] Building jar: /target/paytm-billing-service-1.0.0.jar', delay: 80 },
  { type: 'output', text: '[INFO] ------------------------------------------------------------------------', delay: 80 },
  { type: 'output', text: '[INFO] BUILD SUCCESS', delay: 180 },
  { type: 'output', text: '[INFO] Total time:  3.482 s', delay: 80 },
  { type: 'output', text: '[INFO] Finished at: 2026-06-28T02:19:00Z', delay: 80 },
  { type: 'output', text: '[INFO] ------------------------------------------------------------------------', delay: 180 },

  // 2. Spring boot run
  { type: 'input', text: 'java -jar target/paytm-billing-service-1.0.0.jar' },
  { type: 'output', text: '  .   ____          _            __ _ _', delay: 80 },
  { type: 'output', text: ' /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\', delay: 40 },
  { type: 'output', text: '( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\', delay: 40 },
  { type: 'output', text: ' \\\\/  ___)| |_)| |  | | | || (_| |  ) ) ) )', delay: 40 },
  { type: 'output', text: '  \'  |____| .__|_|  |_|_| |__\\__, | / / / /', delay: 40 },
  { type: 'output', text: ' =========|_|==============|___/=/_/_/_/', delay: 40 },
  { type: 'output', text: ' :: Spring Boot ::                (v3.2.0)', delay: 80 },
  { type: 'output', text: '', delay: 80 },
  { type: 'output', text: '2026-06-28T02:19:01.102Z  INFO 84210 --- [main] d.m.b.BillingApplication : Starting BillingApplication v1.0.0...', delay: 180 },
  { type: 'output', text: '2026-06-28T02:19:01.104Z  INFO 84210 --- [main] d.m.b.BillingApplication : Active profiles: production, aws-cloud', delay: 80 },
  { type: 'output', text: '2026-06-28T02:19:01.890Z  INFO 84210 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)', delay: 180 },
  { type: 'output', text: '2026-06-28T02:19:02.015Z  INFO 84210 --- [main] o.a.c.c.C[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext', delay: 80 },
  { type: 'output', text: '2026-06-28T02:19:02.435Z  INFO 84210 --- [main] o.s.d.r.c.RedisConnectionFactory        : Connecting to Redis server at 127.0.0.1:6379', delay: 120 },
  { type: 'output', text: '2026-06-28T02:19:02.890Z  INFO 84210 --- [main] o.a.k.c.c.ConsumerConfig                : Kafka ConsumerConfig: bootstrap.servers = [127.0.0.1:9092]', delay: 120 },
  { type: 'output', text: '2026-06-28T02:19:03.220Z  INFO 84210 --- [main] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 14 endpoint(s) beneath base path \'/actuator\'', delay: 120 },
  { type: 'output', text: '2026-06-28T02:19:03.542Z  INFO 84210 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path \'\'', delay: 180 },
  { type: 'output', text: '2026-06-28T02:19:03.550Z  INFO 84210 --- [main] d.m.b.BillingApplication : Started BillingApplication in 2.654 seconds', delay: 180 },
  { type: 'output', text: '2026-06-28T02:19:05.121Z  INFO 84210 --- [nio-8080-exec-1] d.m.b.c.BillingController : GET /api/v1/subscriptions - status: 200 (OK) in 14ms', delay: 350 },
  { type: 'output', text: '2026-06-28T02:19:06.402Z  INFO 84210 --- [kafka-listener] d.m.b.s.KafkaConsumer    : Received event on topic \'billing.events\': userId=10928, action=RENEWAL', delay: 350 },

  // 3. Git commands
  { type: 'input', text: 'git status' },
  { type: 'output', text: 'On branch main', delay: 120 },
  { type: 'output', text: 'Your branch is up to date with \'origin/main\'.', delay: 40 },
  { type: 'output', text: 'nothing to commit, working tree clean', delay: 40 },
  { type: 'input', text: 'git log --oneline -n 3' },
  { type: 'output', text: '* 8a7b6c5 (HEAD -> main, origin/main) feat: add Spring AI RAG pipeline for incident intelligence', delay: 180 },
  { type: 'output', text: '* 4f3e2d1 refactor: migrate Paytm subscription engine to Java 21', delay: 80 },
  { type: 'output', text: '* 9c8b7a6 feat: setup Kafka events and Redis distributed lock', delay: 80 },

  // 4. Docker commands
  { type: 'input', text: 'docker ps' },
  { type: 'output', text: 'CONTAINER ID   IMAGE         COMMAND                  STATUS         PORTS', delay: 180 },
  { type: 'output', text: 'a58d6e3c12a4   mysql:8.0     "docker-entrypoint..."   Up 4 hours     0.0.0.0:3306->3306/tcp', delay: 60 },
  { type: 'output', text: '7b2c9d8e74a1   kafka:latest  "/etc/confluent/do..."   Up 4 hours     0.0.0.0:9092->9092/tcp', delay: 60 },
  { type: 'output', text: '3f1e9d8c42a2   redis:7.2     "docker-entrypoint..."   Up 4 hours     0.0.0.0:6379->6379/tcp', delay: 60 },
  { type: 'output', text: 'c8d7e6b5a412   billing-app   "java -jar app.jar"      Up 2 minutes   0.0.0.0:8080->8080/tcp', delay: 60 },

  // 5. AWS commands
  { type: 'input', text: 'aws ecs describe-services --cluster billing-cluster --services billing-service' },
  { type: 'output', text: 'Service: billing-service  |  Cluster: billing-cluster', delay: 200 },
  { type: 'output', text: 'Status: ACTIVE  |  DesiredCount: 5  |  RunningCount: 5  |  PendingCount: 0', delay: 80 },
  { type: 'output', text: 'Deployments: [Primary: ACTIVE, TaskDefinition: paytm-billing:42]', delay: 80 },
  { type: 'output', text: 'Service updated successfully! Zero downtime maintained.', delay: 180 },

  // 6. Display Skills
  { type: 'input', text: './display-skills.sh' },
  { type: 'output', text: ' __ _     _ _ _      ', delay: 80 },
  { type: 'output', text: '/ _\\ |__ (_) | |___  ', delay: 40 },
  { type: 'output', text: '\\ \\| \'_ \\| | | / __| ', delay: 40 },
  { type: 'output', text: '_\\ \\ | | | | | \\__ \\ ', delay: 40 },
  { type: 'output', text: '\\__/_| |_|_|_|_|___/ ', delay: 80 },
  { type: 'output', text: '', delay: 40 },
  { type: 'output', text: '[ Languages ]', delay: 80 },
  { type: 'output', text: 'Java          [███████████████████-] 95%', delay: 80 },
  { type: 'output', text: 'Python        [█████████████████---] 85%', delay: 60 },
  { type: 'output', text: 'SQL           [██████████████████--] 90%', delay: 60 },
  { type: 'output', text: '[ Frameworks & Backend ]', delay: 80 },
  { type: 'output', text: 'Spring Boot   [███████████████████-] 95%', delay: 80 },
  { type: 'output', text: 'Microservices [██████████████████--] 92%', delay: 60 },
  { type: 'output', text: 'Kafka         [██████████████████--] 88%', delay: 60 },
  { type: 'output', text: '[ Cloud & DevOps ]', delay: 80 },
  { type: 'output', text: 'Docker        [███████████████-----] 75%', delay: 60 },
  { type: 'output', text: 'AWS Cloud     [████████████████----] 80%', delay: 60 },
  { type: 'output', text: 'Spring AI     [█████████████████---] 85%', delay: 60 },
  { type: 'output', text: '', delay: 80 },
  { type: 'input', text: 'clear' },
]

export default function InteractiveTerminal() {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const terminalBodyRef = useRef(null)
  
  // Track typing state locally to avoid state delay racing
  const typingTimerRef = useRef(null)
  const outputTimerRef = useRef(null)

  // Autoscroll logic (only scrolls the terminal container, not the browser window)
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [displayedLines, typedText])

  useEffect(() => {
    if (isPaused) {
      // Clear timers to hold printing on hover
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      if (outputTimerRef.current) clearTimeout(outputTimerRef.current)
      return
    }

    const runScript = () => {
      // Loop cycle restart check
      if (currentIdx >= SCRIPT.length) {
        setDisplayedLines([])
        setCurrentIdx(0)
        setTypedText('')
        return
      }

      const item = SCRIPT[currentIdx]

      if (item.type === 'input') {
        // Handle input typing
        if (item.text === 'clear') {
          // Special clean up execution
          setTypedText('clear')
          outputTimerRef.current = setTimeout(() => {
            setDisplayedLines([])
            setTypedText('')
            setCurrentIdx(0)
          }, 800)
          return
        }

        let charIndex = 0
        const textToType = item.text

        const typeChar = () => {
          if (isPaused) return
          
          if (charIndex <= textToType.length) {
            setTypedText(textToType.substring(0, charIndex))
            charIndex++
            typingTimerRef.current = setTimeout(typeChar, 40)
          } else {
            // Typing complete, add line and move forward
            setDisplayedLines((prev) => [...prev, { type: 'input', text: textToType }])
            setTypedText('')
            setCurrentIdx((idx) => idx + 1)
          }
        }
        typeChar()
      } else {
        // Handle log/output rendering with specified delay
        outputTimerRef.current = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, { type: 'output', text: item.text }])
          setCurrentIdx((idx) => idx + 1)
        }, item.delay || 100)
      }
    }

    runScript()

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      if (outputTimerRef.current) clearTimeout(outputTimerRef.current)
    }
  }, [currentIdx, isPaused])

  const formatLineColor = (text) => {
    if (text.startsWith('[INFO]')) {
      if (text.includes('BUILD SUCCESS')) return 'text-emerald-400 font-bold'
      return 'text-sky-400/80'
    }
    if (text.includes('INFO') && text.includes('---')) {
      // Spring Boot Log Line styling
      return 'text-zinc-300'
    }
    if (text.includes(':: Spring Boot ::')) {
      return 'text-emerald-400 font-semibold'
    }
    if (text.startsWith('* ')) {
      // Git log styling
      return 'text-yellow-400/90'
    }
    if (text.includes('CONTAINER ID')) {
      return 'text-zinc-400 font-bold'
    }
    if (text.startsWith('Service:') || text.startsWith('Status:')) {
      // AWS status outputs
      return 'text-violet-400'
    }
    if (text.includes('[ Languages ]') || text.includes('[ Frameworks & Backend ]') || text.includes('[ Cloud & DevOps ]')) {
      return 'text-primary font-bold mt-2'
    }
    if (text.includes('██████████')) {
      return 'text-emerald-400 font-mono'
    }
    return 'text-zinc-200'
  }

  return (
    <div 
      className="overflow-hidden rounded-lg shadow-2xl border border-zinc-700/80"
      style={{ background: '#0d1117' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-zinc-700/60 px-4 py-3 select-none" style={{ background: '#161b22' }}>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-zinc-400">
            bash — azim@paytm-billing-platform
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPaused ? (
            <span className="text-[10px] text-yellow-400 font-semibold font-mono bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded animate-pulse">
              ❚❚ PAUSED
            </span>
          ) : (
            <span className="text-[10px] text-emerald-400 font-semibold font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              ● ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div 
        ref={terminalBodyRef}
        className="p-4 sm:p-6 font-mono text-xs leading-relaxed overflow-y-auto h-[240px] sm:h-[350px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        style={{ background: '#0d1117' }}
      >
        <div className="space-y-1">
          {displayedLines.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {line.type === 'input' ? (
                <div>
                  <span className="text-emerald-500">azim@paytm-billing:~$</span>{' '}
                  <span className="text-white font-medium">{line.text}</span>
                </div>
              ) : (
                <div className={formatLineColor(line.text)}>{line.text}</div>
              )}
            </div>
          ))}

          {/* Current input line details (rendered character-by-character) */}
          {!isPaused && SCRIPT[currentIdx]?.type === 'input' && (
            <div className="whitespace-pre-wrap">
              <span className="text-emerald-500">azim@paytm-billing:~$</span>{' '}
              <span className="text-white font-medium">{typedText}</span>
              <span className="w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse inline-block align-middle" />
            </div>
          )}
        </div>
      </div>
      
      {/* Visual background ambient glow behind terminal */}
      <div className="absolute -inset-4 -z-10 rounded-2xl blur-2xl opacity-30 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(30,120,200,0.15), rgba(100,60,180,0.12), rgba(30,120,200,0.15))' }} />
    </div>
  )
}
