export const portfolio = {
  site: {
    domain: 'mohdazim.dev',
    title: 'Mohd Azim — Java Backend Engineer | Spring Boot • Microservices • AI',
    year: 2026,
  },
  personal: {
    firstName: 'Mohd',
    lastName: 'Azim',
    fullName: 'Mohd Azim',
    role: 'Java Backend Engineer',
    tagline:
      'Building scalable enterprise systems with Java, Spring Boot & Microservices. I turn complex problems into clean, performant code.',
    summary:
      "Software Engineer with 3+ years of experience building scalable backend systems using Java, Spring Boot, and Microservices. Delivered high-throughput billing and subscription platforms serving 27M+ end users at Paytm and led a Java 1.6 → Java 21 modernization of a large-scale enterprise codebase.",
    about:
      "I'm a passionate Java Backend Engineer specializing in Backend Development, Spring Boot, Java, Python, REST APIs, and Microservices. I enjoy building scalable enterprise applications and solving complex software engineering problems.",
    domains:
      'telecom billing, enterprise trading, AI-augmented backends and subscription platforms',
    email: 'mohdazim6309@gmail.com',
    phone: '+91-70XXXXXX29',
    location: 'Delhi, India',
    linkedin: 'https://www.linkedin.com/in/mohd-azim-922373204',
    linkedinHandle: 'www.linkedin.com/in/mohd-azim-922373204',
    github: 'https://github.com/Mohd-Azim',
    githubHandle: '@Mohd-Azim',
    resumeUrl: '/resume/resume.pdf',
    availability: 'Open to new opportunities',
    openTo: 'Open to remote & enterprise contracts',
  },
  hero: {
    codeSnippet: {
      name: '"Mohd Azim"',
      role: '"Java Backend Engineer"',
      stack: ['"Java"', '"Spring Boot"', '"Kafka"', '"Python"'],
    },
    badges: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Spring AI'],
  },
  stats: [
    { label: 'Years Experience', value: '3+' },
    { label: 'Projects Completed', value: '12+' },
    { label: 'Technologies', value: '25+' },
    { label: 'Users Served', value: '27M+' },
  ],
  highlights: [
    'Backend Architecture',
    'Clean Code',
    'Performance',
    'API Design',
    'Cloud Native',
  ],
  skills: [
    {
      category: 'Languages',
      items: [
        { name: 'Java', level: 95 },
        { name: 'Python', level: 85 },
        { name: 'SQL', level: 90 },
        { name: 'JavaScript', level: 75 },
        { name: 'TypeScript', level: 72 },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Spring Boot', level: 95 },
        { name: 'Spring Security', level: 88 },
        { name: 'Spring Data JPA', level: 90 },
        { name: 'Hibernate', level: 88 },
        { name: 'REST APIs', level: 95 },
        { name: 'Microservices', level: 92 },
        { name: 'JWT / OAuth2', level: 85 },
      ],
    },
    {
      category: 'Messaging & Data',
      items: [
        { name: 'Apache Kafka', level: 88 },
        { name: 'Redis', level: 85 },
        { name: 'MySQL', level: 90 },
        { name: 'PostgreSQL', level: 88 },
        { name: 'SQL Server', level: 82 },
      ],
    },
    {
      category: 'Cloud & DevOps',
      items: [
        { name: 'AWS (EC2, S3)', level: 80 },
        { name: 'GitHub Actions', level: 88 },
        { name: 'Jenkins', level: 82 },
        { name: 'Azure DevOps', level: 78 },
        { name: 'Docker', level: 75 },
        { name: 'SonarQube', level: 80 },
        { name: 'Grafana', level: 75 },
      ],
    },
    {
      category: 'AI Engineering',
      items: [
        { name: 'Spring AI', level: 85 },
        { name: 'LangChain4j', level: 82 },
        { name: 'RAG Pipelines', level: 88 },
        { name: 'LLM Integration', level: 85 },
      ],
    },
    {
      category: 'Frontend (Working Knowledge)',
      items: [
        { name: 'React.js', level: 72 },
        { name: 'TypeScript', level: 70 },
        { name: 'Thymeleaf', level: 75 },
      ],
    },
  ],
  experience: [
    {
      company: 'Paytm (One97 Communications)',
      role: 'Software Engineer',
      period: 'Sep 2025 – Present',
      location: 'Noida, India',
      highlights: [
        'Led Java 1.6 → Java 21 modernization of a 15-year-old enterprise codebase with zero production downtime.',
        'Built high-throughput Spring Boot APIs for subscription, charging, and billing workflows serving 27M+ users.',
        'Designed asynchronous event-processing pipelines using Kafka and Redis to absorb traffic spikes on billing events.',
        'Implemented API security layer with Spring Security, JWT, rate limiting, bot detection, and Google reCAPTCHA.',
        'Engineered CI/CD pipelines using GitHub Actions with zero-downtime deployments on AWS EC2.',
        'Architected a RAG-based internal knowledge retrieval service using Spring AI and LangChain4j.',
      ],
    },
    {
      company: 'Career Break — Medical Recovery',
      role: 'Planned Break',
      period: 'Aug 2024 – Aug 2025',
      location: 'Delhi, India',
      highlights: [
        'Planned career break for medical recovery; fully recovered and resumed full-time engineering at Paytm in September 2025.',
      ],
    },
    {
      company: 'Publicis Sapient',
      role: 'Associate Software Engineer',
      period: 'Apr 2022 – Jul 2024',
      location: 'Gurugram, India',
      highlights: [
        'Built enterprise Java solutions on Openlink Endur (ETRM platform) for global commodity-trading clients.',
        'Automated complex business workflows and deal-booking processes through Java scripting and SQL validation.',
        'Delivered L3 production support for a mission-critical trading system across global client environments.',
        'Hardened CI/CD pipelines in Azure DevOps and Jenkins with SonarQube quality gates.',
        'Partnered with Front Office and operations stakeholders on deal-booking workflows, UAT, and release sign-offs.',
      ],
    },
  ],
  projects: [
    {
      title: 'High-Scale Subscription & Billing Platform',
      subtitle: 'Paytm · Production',
      description:
        'Distributed Spring Boot backend managing subscription lifecycle and multi-channel billing for 27M+ users across two telecom operators. Built with Kafka-driven async event processing, Redis for shared state, JWT-secured REST APIs, and zero-downtime deployments via GitHub Actions on AWS EC2.',
      techStack: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'MySQL', 'AWS', 'GitHub Actions'],
      features: [
        'Enterprise Billing',
        'Subscription Management',
        'Multi-channel Integration',
        'Zero-downtime Deployments',
        'JWT Security',
      ],
      gradient: 'from-primary to-cyan-500',
      links: { code: null, live: null },
    },
    {
      title: 'Operational Incident Intelligence Service (RAG)',
      subtitle: 'Paytm · Internal Production Tool',
      description:
        'Spring AI and LangChain4j-powered retrieval service built to accelerate incident response. End-to-end ingestion and retrieval pipelines over partner billing configurations, API contracts, and operational runbooks — reducing MTTR on billing-critical incidents.',
      techStack: ['Spring AI', 'LangChain4j', 'Java', 'Spring Boot', 'Vector Store'],
      features: [
        'Document Ingestion',
        'Semantic Search',
        'RAG Pipeline',
        'Metadata Filtering',
        'Incident Runbooks',
      ],
      gradient: 'from-accent to-purple-500',
      links: { code: null, live: null },
    },
    {
      title: 'Agentic Java Backend Service',
      subtitle: 'Personal Project',
      description:
        'Spring Boot 3 service exploring production-grade GenAI integration: Spring AI and LangChain4j with tool-calling patterns, RAG over a vector store, and an agentic task-execution loop demonstrating Java-native LLM integration.',
      techStack: ['Spring Boot 3', 'Spring AI', 'LangChain4j', 'Java 21'],
      features: [
        'Tool Calling',
        'Function Calling',
        'RAG',
        'Agentic Workflows',
        'LLM Integration',
      ],
      gradient: 'from-emerald-500 to-teal-500',
      links: { code: 'https://github.com/Mohd-Azim', live: null },
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'Al Falah University, Faridabad',
      period: '2017 – 2021',
      details: 'Computer Science & Engineering',
    },
  ],
  certifications: [
    { name: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft' },
    { name: 'Spring Boot 3 & Hibernate', issuer: 'Professional Certification' },
    { name: 'SQL & Relational Databases', issuer: 'IBM' },
    { name: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco' },
  ],
  techStack: [
    'Java',
    'Spring Boot',
    'Kafka',
    'Redis',
    'MySQL',
    'PostgreSQL',
    'AWS',
    'Docker',
    'GitHub Actions',
    'Spring AI',
    'LangChain4j',
    'React',
  ],
  testimonials: [
    {
      quote:
        'A rare backend engineer who writes clean, performant code and ships reliably under production pressure. Our billing platform modernization was delivered with zero downtime.',
      author: 'Engineering Lead',
      role: 'Paytm',
    },
  ],
  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'System Design', href: '#system-design' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '#blog' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ],
}
