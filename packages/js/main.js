import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|chromium|crios|edg|opr|fxios/i.test(navigator.userAgent);

if (isSafari) {
  document.body.classList.add('is-safari');

  const confetti = Array.from(document.querySelectorAll('.welcome__celebration .confetti'));
  const fireworks = Array.from(document.querySelectorAll('.welcome__celebration .firework'));
  const keepConfetti = 18;
  const keepFireworks = 8;

  confetti.slice(keepConfetti).forEach(node => node.remove());
  fireworks.slice(keepFireworks).forEach(node => node.remove());
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const celebrationFireworks = Array.from(document.querySelectorAll('.welcome__celebration .firework'));
const welcomeCelebration = document.querySelector('.welcome__celebration');
const fireworkAvoidTargets = Array.from(
  document.querySelectorAll('.welcome__content .welcome__title, .welcome__content .welcome__subtitle, #scroll-button')
);

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const getFireworkAvoidZones = celebrationRect => {
  return fireworkAvoidTargets
    .filter(node => node && node.getClientRects().length > 0)
    .map(node => {
      const rect = node.getBoundingClientRect();
      const left = Math.max(0, rect.left - celebrationRect.left);
      const top = Math.max(0, rect.top - celebrationRect.top);
      const right = Math.min(celebrationRect.width, rect.right - celebrationRect.left);
      const bottom = Math.min(celebrationRect.height, rect.bottom - celebrationRect.top);

      return {
        left,
        top,
        right,
        bottom,
      };
    })
    .filter(zone => zone.right > zone.left && zone.bottom > zone.top);
};

const overlapsFireworkAvoidZones = (x, y, size, zones) => {
  const radius = size * 0.56;
  const buffer = Math.max(14, size * 0.24);

  return zones.some(zone => {
    return x + radius > zone.left - buffer && x - radius < zone.right + buffer && y + radius > zone.top - buffer && y - radius < zone.bottom + buffer;
  });
};

const pickSafeFireworkPosition = size => {
  if (!welcomeCelebration) {
    return { x: randomBetween(6, 94), y: randomBetween(10, 82) };
  }

  const celebrationRect = welcomeCelebration.getBoundingClientRect();
  if (!celebrationRect.width || !celebrationRect.height) {
    return { x: randomBetween(6, 94), y: randomBetween(10, 82) };
  }

  const zones = getFireworkAvoidZones(celebrationRect);
  if (!zones.length) {
    return { x: randomBetween(6, 94), y: randomBetween(10, 82) };
  }

  for (let attempt = 0; attempt < 26; attempt++) {
    const xPercent = randomBetween(6, 94);
    const yPercent = randomBetween(10, 82);
    const xPx = (xPercent / 100) * celebrationRect.width;
    const yPx = (yPercent / 100) * celebrationRect.height;

    if (!overlapsFireworkAvoidZones(xPx, yPx, size, zones)) {
      return { x: xPercent, y: yPercent };
    }
  }

  return { x: randomBetween(6, 94), y: randomBetween(10, 82) };
};

const updateFirework = firework => {
  const size = Math.round(randomBetween(68, 112));
  const { x, y } = pickSafeFireworkPosition(size);
  const hue = Math.round(randomBetween(0, 360));
  const launch = Math.max(35, 110 - y + randomBetween(-8, 8));

  firework.style.setProperty('--x', `${x}%`);
  firework.style.setProperty('--y', `${y}%`);
  firework.style.setProperty('--size', `${size}px`);
  firework.style.setProperty('--hue', `${hue}`);
  firework.style.setProperty('--launch', `${launch.toFixed(0)}vh`);
};

if (celebrationFireworks.length) {
  celebrationFireworks.forEach(firework => {
    firework.style.setProperty('--duration', `${randomBetween(5.4, 7.2).toFixed(2)}s`);
    updateFirework(firework);

    if (!prefersReducedMotion) {
      firework.addEventListener('animationiteration', () => updateFirework(firework));
    }
  });
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

let skillsChart = null;

function createSkillsChart(ctx) {
  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Languages',
        'Front-End Development',
        'Back-End Development',
        'Databases',
        'Data Analytics',
        'AI & ML',
        'Mobile Development',
        'Development Tools',
        'Design Tools',
      ],
      datasets: [
        {
          label: 'Skill Level (%)',
          data: [86, 93, 96, 89, 84, 92, 78, 90, 76],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        },
        {
          label: 'Delivery Confidence (%)',
          data: [83, 92, 90, 87, 79, 88, 72, 85, 70],
          backgroundColor: 'rgba(147, 112, 219, 0.15)',
          borderColor: 'rgba(147, 112, 219, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(147, 112, 219, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(147, 112, 219, 1)',
        },
        {
          label: 'Learning Agility (%)',
          data: [92, 96, 94, 92, 89, 95, 81, 89, 82],
          backgroundColor: 'rgba(255, 159, 64, 0.15)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 159, 64, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 159, 64, 1)',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(128, 128, 128, 0.3)',
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            display: false,
            font: {
              family: 'Poppins',
            },
          },
          grid: {
            color: 'rgba(128, 128, 128, 0.2)',
          },
        },
      },
      font: {
        family: 'Poppins',
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgba(75, 192, 192, 1)',
            font: {
              family: 'Poppins',
            },
          },
          title: {
            display: true,
            font: {
              family: 'Poppins',
              weight: 'bold',
            },
          },
        },
        tooltip: {
          bodyFont: {
            family: 'Poppins',
          },
          titleFont: {
            family: 'Poppins',
          },
          enabled: true,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ': ' + context.formattedValue + '%';
            },
          },
        },
      },
    },
  });
}

function initSkillsChartOnView() {
  const chartCanvas = document.getElementById('skillsChart');
  if (!chartCanvas || typeof Chart === 'undefined') return;

  const renderChart = () => {
    if (skillsChart) return;
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;
    skillsChart = createSkillsChart(ctx);
  };

  if (!('IntersectionObserver' in window)) {
    renderChart();
    return;
  }

  const chartObserver = new IntersectionObserver(
    entries => {
      const [entry] = entries;
      if (!entry || !entry.isIntersecting) return;
      renderChart();
      chartObserver.disconnect();
    },
    {
      threshold: 0.25,
    }
  );

  chartObserver.observe(chartCanvas);
}

initSkillsChartOnView();

const navLink = document.querySelectorAll('.nav__link');
const navLogo = document.querySelector('.nav__logo');

function linkAction() {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show-menu');
}

navLink.forEach(n => n.addEventListener('click', linkAction));

if (navLogo) {
  navLogo.addEventListener('click', event => {
    event.preventDefault();
    navMenu.classList.remove('show-menu');
    document.body.classList.remove('menu-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const skillsContent = document.querySelectorAll('.skills__content');

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[char] || char;
  });
}

function normalizeSkillTag(tag) {
  return tag
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function skillBadgeColor(tag) {
  const palette = ['2563eb', '0ea5e9', '16a34a', 'f97316', '8b5cf6', 'ef4444'];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

const SHIELD_STYLE_HINTS = {
  html5: { color: 'orange', logo: 'html5', logoColor: 'white' },
  css3: { color: 'orange', logo: 'html5', logoColor: 'white' },
  sass: { color: 'orange', logo: 'html5', logoColor: 'white' },
  react: { color: 'blue', logo: 'react', logoColor: 'white' },
  reactnative: { color: 'blue', logo: 'react', logoColor: 'white' },
  angular: { color: 'red', logo: 'angular', logoColor: 'white' },
  vuejs: { color: 'darkgreen', logo: 'vue.js', logoColor: 'white' },
  nuxt: { color: '00A86B', logo: 'nuxt', logoColor: 'white' },
  nextjs: { color: 'black', logo: 'next.js', logoColor: 'white' },
  webassembly: { color: 'purple', logo: 'webassembly', logoColor: 'white' },
  wasm: { color: 'purple', logo: 'webassembly', logoColor: 'white' },
  bootstrap: { color: 'blueviolet', logo: 'bootstrap', logoColor: 'white' },
  jquery: { color: 'blue', logo: 'jquery', logoColor: 'white' },
  tailwindcss: { color: 'teal', logo: 'tailwindcss', logoColor: 'white' },
  postcss: { color: 'DD3A0A', logo: 'postcss', logoColor: 'white' },
  streamlit: { color: 'orange', logo: 'streamlit', logoColor: 'white' },
  materialui: { color: 'blueviolet', logo: 'mui', logoColor: 'white' },
  joyui: { color: 'blueviolet', logo: 'mui', logoColor: 'white' },
  shadcn: { color: 'black', logo: 'shadcnui', logoColor: 'white' },
  electron: { color: '47848F', logo: 'electron', logoColor: 'white' },
  webpack: { color: 'skyblue', logo: 'webpack', logoColor: 'white' },
  turborepo: { color: 'EF4444', logo: 'turborepo', logoColor: 'white' },
  vite: { color: 'yellow', logo: 'vite', logoColor: 'white' },
  playwright: { color: '2EAD33', logo: 'sonar', logoColor: 'white' },
  cypress: { color: '17202C', logo: 'cypress', logoColor: 'white' },
  selenium: { color: '43B02A', logo: 'selenium', logoColor: 'white' },
  jest: { color: 'C21325', logo: 'jest', logoColor: 'white' },
  reacttestinglibrary: { color: 'C21325', logo: 'jest', logoColor: 'white' },
  vitest: { color: '6E9F18', logo: 'vitest', logoColor: 'white' },
  microfrontendsarchitecture: { color: '123232', logo: 'protondb', logoColor: 'white' },
  nodejs: { color: 'darkgreen', logo: 'node.js', logoColor: 'white' },
  expressjs: { color: 'blue', logo: 'express', logoColor: 'white' },
  nestjs: { color: 'red', logo: 'nestjs', logoColor: 'white' },
  springframework: { color: '8B4513', logo: 'spring', logoColor: 'white' },
  springboot: { color: '8B4513', logo: 'spring', logoColor: 'white' },
  django: { color: 'darkgreen', logo: 'django', logoColor: 'white' },
  djangorestframework: { color: 'darkgreen', logo: 'django', logoColor: 'white' },
  flask: { color: 'lightgrey', logo: 'flask', logoColor: 'white' },
  fastapi: { color: 'success', logo: 'fastapi', logoColor: 'white' },
  pytest: { color: '0A9EDC', logo: 'pytest', logoColor: 'white' },
  mocha: { color: '8D6748', logo: 'mocha', logoColor: 'white' },
  chai: { color: '8D6748', logo: 'mocha', logoColor: 'white' },
  golang: { color: 'blue', logo: 'go', logoColor: 'white' },
  go: { color: 'blue', logo: 'go', logoColor: 'white' },
  beego: { color: 'blue', logo: 'go', logoColor: 'white' },
  restfulapis: { color: 'red', logo: 'axios', logoColor: 'white' },
  graphql: { color: 'magenta', logo: 'graphql', logoColor: 'white' },
  trpc: { color: '2596BE', logo: 'trpc', logoColor: 'white' },
  grpc: { color: '4285F4', logo: 'grocy', logoColor: 'white' },
  protocolbuffers: { color: '4285F4', logo: 'grocy', logoColor: 'white' },
  websockets: { color: 'yellow', logo: 'socketdotio', logoColor: 'white' },
  serversentevents: { color: '0EA5E9', logo: 'serverless', logoColor: 'white' },
  sse: { color: '0EA5E9', logo: 'serverless', logoColor: 'white' },
  rabbitmq: { color: 'orange', logo: 'rabbitmq', logoColor: 'white' },
  nginx: { color: 'darkgreen', logo: 'nginx', logoColor: 'white' },
  net: { color: '512BD4', logo: 'dotnet', logoColor: 'white' },
  aspnetcore: { color: '512BD4', logo: 'dotnet', logoColor: 'white' },
  dotnet: { color: '512BD4', logo: 'dotnet', logoColor: 'white' },
  hibernate: { color: 'purple', logo: 'hibernate', logoColor: 'white' },
  typeorm: { color: 'blue', logo: 'typeorm', logoColor: 'white' },
  prisma: { color: 'darkblue', logo: 'prisma', logoColor: 'white' },
  red5mediaserver: { color: 'red', logo: 'webrtc', logoColor: 'white' },
  apachekafka: { color: 'black', logo: 'apachekafka', logoColor: 'white' },
  oauth: { color: 'blue', logo: 'jsonwebtokens', logoColor: 'white' },
  jwt: { color: 'blue', logo: 'jsonwebtokens', logoColor: 'white' },
  auth0: { color: 'EB5424', logo: 'auth0', logoColor: 'white' },
  elasticsearch: { color: 'darkgreen', logo: 'elasticsearch', logoColor: 'white' },
  elkstack: { color: 'darkgreen', logo: 'elasticsearch', logoColor: 'white' },
  openapi: { color: 'blue', logo: 'openapiinitiative', logoColor: 'white' },
  microservicesarchitecture: { color: 'darkgreen', logo: 'stackedit', logoColor: 'white' },
  tensorflow: { color: 'orange', logo: 'tensorflow', logoColor: 'white' },
  keras: { color: 'red', logo: 'keras', logoColor: 'white' },
  agenticai: { color: 'darkblue', logo: 'google', logoColor: 'white' },
  modelcontextprotocol: { color: 'blue', logo: 'modelcontextprotocol', logoColor: 'white' },
  mcp: { color: 'blue', logo: 'modelcontextprotocol', logoColor: 'white' },
  agenttoagentprotocol: { color: '2E7D32', logo: 'sentry', logoColor: 'white' },
  a2a: { color: '2E7D32', logo: 'sentry', logoColor: 'white' },
  pytorch: { color: 'red', logo: 'pytorch', logoColor: 'white' },
  scikitlearn: { color: 'blue', logo: 'scikitlearn', logoColor: 'white' },
  opencv: { color: 'darkgreen', logo: 'opencv', logoColor: 'white' },
  yolov3: { color: 'yellow', logo: 'e', logoColor: 'white' },
  yolov8: { color: 'yellow', logo: 'e', logoColor: 'white' },
  tesseractocr: { color: 'darkgreen', logo: 'interactjs', logoColor: 'white' },
  transformers: { color: 'E53236', logo: 'huggingface', logoColor: 'white' },
  langchain: { color: 'black', logo: 'langchain', logoColor: 'white' },
  langgraph: { color: 'purple', logo: 'langgraph', logoColor: 'white' },
  langsmith: { color: '111111', logo: 'langflow', logoColor: 'white' },
  crewai: { color: 'blue', logo: 'crewai', logoColor: 'white' },
  fireworksai: { color: 'FF6B35', logo: 'pinetwork', logoColor: 'white' },
  faiss: { color: 'blue', logo: 'meta', logoColor: 'white' },
  pinecone: { color: 'orange', logo: 'googledataproc', logoColor: 'white' },
  optuna: { color: 'purple', logo: 'openaigym', logoColor: 'white' },
  jupyternotebook: { color: 'orange', logo: 'jupyter', logoColor: 'white' },
  mlflow: { color: 'blue', logo: 'mlflow', logoColor: 'white' },
  weightsbiases: { color: 'FFBE00', logo: 'weightsandbiases', logoColor: 'black' },
  prefect: { color: '0F766E', logo: 'prefect', logoColor: 'white' },
  jax: { color: 'blue', logo: 'max', logoColor: 'white' },
  onnx: { color: '005CED', logo: 'onnx', logoColor: 'white' },
  xgboost: { color: 'EC7A08', logo: 'artifacthub', logoColor: 'white' },
  googlecolab: { color: 'blue', logo: 'googlecolab', logoColor: 'white' },
  mysql: { color: 'blue', logo: 'mysql', logoColor: 'white' },
  mongodb: { color: 'darkgreen', logo: 'mongodb', logoColor: 'white' },
  postgresql: { color: 'blue', logo: 'postgresql', logoColor: 'white' },
  microsoftsqlserver: { color: 'darkred', logo: 'sololearn', logoColor: 'white' },
  neo4j: { color: 'yellow', logo: 'neo4j', logoColor: 'white' },
  weaviate: { color: 'darkblue', logo: 'weblate', logoColor: 'white' },
  firebase: { color: 'orange', logo: 'firebase', logoColor: 'white' },
  supabase: { color: 'darkgreen', logo: 'supabase', logoColor: 'white' },
  sqlite: { color: 'lightblue', logo: 'sqlite', logoColor: 'white' },
  redis: { color: 'red', logo: 'redis', logoColor: 'white' },
  oracledatabase: { color: 'red', logo: 'circle', logoColor: 'white' },
  amazondynamodb: { color: 'darkblue', logo: 'databricks', logoColor: 'white' },
  java: { color: 'red', logo: 'coffeescript', logoColor: 'white' },
  cplusplus: { color: 'blue', logo: 'cplusplus', logoColor: 'white' },
  c: { color: 'gray', logo: 'c', logoColor: 'white' },
  assembly: { color: 'lightgrey', logo: 'assemblyscript', logoColor: 'white' },
  python: { color: 'blue', logo: 'python', logoColor: 'white' },
  javascript: { color: 'gold', logo: 'javascript', logoColor: 'white' },
  typescript: { color: 'blue', logo: 'typescript', logoColor: 'white' },
  rust: { color: '000000', logo: 'rust', logoColor: 'white' },
  php: { color: 'purple', logo: 'php', logoColor: 'white' },
  kotlin: { color: 'purple', logo: 'kotlin', logoColor: 'white' },
  swift: { color: 'orange', logo: 'swift', logoColor: 'white' },
  shell: { color: 'black', logo: 'gnu-bash', logoColor: 'white' },
  makefile: { color: 'darkblue', logo: 'gnu', logoColor: 'white' },
  powerbi: { color: 'yellow', logo: 'gotomeeting', logoColor: 'white' },
  tableau: { color: 'blue', logo: 'airtable', logoColor: 'white' },
  stata: { color: 'lightblue', logo: 'statamic', logoColor: 'white' },
  sas: { color: 'darkblue', logo: 'sanic', logoColor: 'white' },
  rstudio: { color: 'blue', logo: 'r', logoColor: 'white' },
  pandas: { color: '150458', logo: 'pandas', logoColor: 'white' },
  microsoftexcel: { color: 'darkgreen', logo: 'micropython', logoColor: 'white' },
  matlab: { color: 'orange', logo: 'matrix', logoColor: 'white' },
  spark: { color: 'red', logo: 'apachespark', logoColor: 'white' },
  hadoop: { color: 'darkgreen', logo: 'apachehadoop', logoColor: 'white' },
  apachespark: { color: 'red', logo: 'apachespark', logoColor: 'white' },
  apachehadoop: { color: 'darkgreen', logo: 'apachehadoop', logoColor: 'white' },
  android: { color: 'darkgreen', logo: 'android', logoColor: 'white' },
  ios: { color: 'silver', logo: 'swift', logoColor: 'white' },
  objectivec: { color: 'blue', logo: 'apple', logoColor: 'white' },
  androidstudio: { color: 'darkgreen', logo: 'androidstudio', logoColor: 'white' },
  xcode: { color: 'darkblue', logo: 'xcode', logoColor: 'white' },
  apachecordova: { color: 'blueviolet', logo: 'apachecordova', logoColor: 'white' },
  git: { color: 'orange', logo: 'git', logoColor: 'white' },
  githubactions: { color: 'lightgrey', logo: 'githubactions', logoColor: 'white' },
  gitlabci: { color: 'FC6D26', logo: 'gitlab', logoColor: 'white' },
  travisci: { color: '3EAAAF', logo: 'travisci', logoColor: 'white' },
  jenkins: { color: 'blue', logo: 'jenkins', logoColor: 'white' },
  ansible: { color: 'red', logo: 'ansible', logoColor: 'white' },
  docker: { color: 'blue', logo: 'docker', logoColor: 'white' },
  kubernetes: { color: '326CE5', logo: 'kubernetes', logoColor: 'white' },
  k8s: { color: '326CE5', logo: 'kubernetes', logoColor: 'white' },
  helm: { color: '0F1689', logo: 'helm', logoColor: 'white' },
  fluxcd: { color: '5468FF', logo: 'flux', logoColor: 'white' },
  argocd: { color: 'EF7B4D', logo: 'argo', logoColor: 'white' },
  argorollouts: { color: '456787', logo: 'argo', logoColor: 'white' },
  canary: { color: '16A34A', logo: 'googleanalytics', logoColor: 'white' },
  bluegreendeployments: { color: '16A34A', logo: 'googleanalytics', logoColor: 'white' },
  vercel: { color: 'black', logo: 'vercel', logoColor: 'white' },
  heroku: { color: 'purple', logo: 'hermes', logoColor: 'white' },
  netlify: { color: 'darkgreen', logo: 'netlify', logoColor: 'white' },
  aws: { color: 'orange', logo: 'task', logoColor: 'white' },
  gcp: { color: 'blue', logo: 'googlecloud', logoColor: 'white' },
  microsoftazure: { color: 'blue', logo: 'micropython', logoColor: 'white' },
  azure: { color: 'blue', logo: 'micropython', logoColor: 'white' },
  oci: { color: 'C74634', logo: 'circle', logoColor: 'white' },
  oraclecloudinfrastructure: { color: 'C74634', logo: 'circle', logoColor: 'white' },
  terraform: { color: '623CE4', logo: 'terraform', logoColor: 'white' },
  hashicorp: { color: '999888', logo: 'hashicorp', logoColor: 'white' },
  podman: { color: '892CA0', logo: 'podman', logoColor: 'white' },
  prometheus: { color: 'orange', logo: 'prometheus', logoColor: 'white' },
  grafana: { color: 'F46800', logo: 'grafana', logoColor: 'white' },
  coralogix: { color: '6B2D8B', logo: 'diaspora', logoColor: 'white' },
  splunk: { color: '000000', logo: 'splunk', logoColor: 'white' },
  datadog: { color: '632CA6', logo: 'datadog', logoColor: 'white' },
  linux: { color: 'black', logo: 'linux', logoColor: 'white' },
  wsl: { color: 'darkblue', logo: 'windsurf', logoColor: 'white' },
  jira: { color: 'blue', logo: 'jira', logoColor: 'white' },
  confluence: { color: 'blue', logo: 'jira', logoColor: 'white' },
  adobeillustrator: { color: 'orange', logo: 'milvus', logoColor: 'white' },
  adobephotoshop: { color: 'blue', logo: 'googlephotos', logoColor: 'white' },
  figma: { color: 'black', logo: 'figma', logoColor: 'white' },
  blender: { color: 'orange', logo: 'blender', logoColor: 'white' },
  csharp: { color: '239120', logo: 'sharp', logoColor: 'white' },
  shadcnui: { color: 'black', logo: 'shadcnui', logoColor: 'white' },
  junit: { color: '25A162', logo: 'junit5', logoColor: 'white' },
  testinglibrary: { color: 'E33332', logo: 'testinglibrary', logoColor: 'white' },
  storybook: { color: 'FF4785', logo: 'storybook', logoColor: 'white' },
  postman: { color: 'FF6C37', logo: 'postman', logoColor: 'white' },
  k6: { color: '7D64FF', logo: 'k6', logoColor: 'white' },
  sonarqube: { color: '4E9BCD', logo: 'sonarqubeforide', logoColor: 'white' },
  codecov: { color: 'F01F7A', logo: 'codecov', logoColor: 'white' },
  snyk: { color: '4C4A73', logo: 'snyk', logoColor: 'white' },
};

function pickShieldStyle(label) {
  const normalizedLabel = normalizeSkillTag(label);
  if (SHIELD_STYLE_HINTS[normalizedLabel]) {
    return SHIELD_STYLE_HINTS[normalizedLabel];
  }

  const chunks = label
    .replace(/\([^)]*\)/g, match => `|${match.replace(/[()]/g, '')}|`)
    .replace(/\s+\+\s+/g, '|')
    .replace(/\s*&\s*/g, '|')
    .replace(/\s+and\s+/gi, '|')
    .replace(/\s*\/\s*/g, '|')
    .replace(/\s*,\s*/g, '|')
    .split('|')
    .map(chunk => chunk.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    const normalizedChunk = normalizeSkillTag(chunk);
    if (SHIELD_STYLE_HINTS[normalizedChunk]) {
      return SHIELD_STYLE_HINTS[normalizedChunk];
    }
  }

  return { color: skillBadgeColor(label), logo: 'github', logoColor: 'white' };
}

function createCdnBadgeUrl(label) {
  const badgeLabel = label
    .replace(/Server-Sent Events/gi, 'Server Sent Events')
    .replace(/Blue-Green/gi, 'Blue/Green')
    .replace(/Micro-Frontends/gi, 'Micro--Frontends')
    .replace(/Micro-Services/gi, 'Micro--Services')
    .replace(/ELK-Stack/gi, 'ELK--Stack')
    .replace(/ORMs and ODMs\s*\(.*/i, 'ORMs & ODMs')
    .replace(/scikit-learn/gi, 'scikit--learn');

  const style = pickShieldStyle(label);
  let url = `https://img.shields.io/badge/${encodeURIComponent(badgeLabel)}-${style.color}`;
  if (style.logo) {
    url += `?logo=${encodeURIComponent(style.logo)}`;
    if (style.logoColor) {
      url += `&logoColor=${encodeURIComponent(style.logoColor)}`;
    }
  }
  return url;
}

function extractSkillTags(label) {
  return [label];
}

function renderSkillNameBadges() {
  const skillNames = document.querySelectorAll('.skills__name');

  skillNames.forEach(nameEl => {
    if (nameEl.dataset.badgesRendered === 'true') {
      return;
    }

    const label = nameEl.textContent.trim();
    const tags = extractSkillTags(label);

    const tagsHtml = tags
      .map(tag => `<img class="skills__badge-img" src="${createCdnBadgeUrl(tag)}" alt="${escapeHtml(tag)} badge" loading="lazy" decoding="async" />`)
      .join('');

    nameEl.innerHTML = `
      <span class="skills__name-text">${escapeHtml(label)}</span>
      <span class="skills__badges">${tagsHtml}</span>
    `;
    nameEl.dataset.badgesRendered = 'true';
  });
}

function animateSkillNumber(element, target, duration = 850) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    element.textContent = `${target}%`;
    return;
  }

  const startTime = performance.now();

  function tick(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.round(target * progress);
    element.textContent = `${value}%`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function animateSkillSection(section) {
  const bars = section.querySelectorAll('.skills__percentage');
  const numbers = section.querySelectorAll('.skills__number');

  bars.forEach(bar => {
    bar.classList.remove('skills__percentage--animate');
    void bar.offsetWidth;
    bar.classList.add('skills__percentage--animate');
  });

  numbers.forEach(numberEl => {
    if (!numberEl.dataset.targetValue) {
      numberEl.dataset.targetValue = String(parseInt(numberEl.textContent, 10) || 0);
    }

    const target = parseInt(numberEl.dataset.targetValue, 10) || 0;
    animateSkillNumber(numberEl, target);
  });
}

function toggleSkills(currentSection) {
  const isAlreadyOpen = currentSection.classList.contains('skills__open');

  if (isAlreadyOpen) {
    currentSection.classList.remove('skills__open');
    currentSection.classList.add('skills__close');
    currentSection.querySelectorAll('.skills__percentage').forEach(bar => {
      bar.classList.remove('skills__percentage--animate');
    });
  } else {
    currentSection.classList.remove('skills__close');
    currentSection.classList.add('skills__open');
    animateSkillSection(currentSection);
  }
}

skillsContent.forEach(content => {
  content.addEventListener('click', event => {
    const isOpen = content.classList.contains('skills__open');
    const clickedHeader = Boolean(event.target.closest('.skills__header'));

    // When expanded, only header clicks should toggle close.
    if (isOpen && !clickedHeader) {
      return;
    }

    toggleSkills(content);
  });
});

renderSkillNameBadges();

const qualificationTabs = document.querySelectorAll('.qualification__button[data-target]');
const qualificationContents = document.querySelectorAll('.qualification__content[data-content]');
const qualificationEducationTab = document.getElementById('qualification-tab-education');
const qualificationWorkTab = document.getElementById('qualification-tab-work');
const qualificationWorkCta = document.getElementById('qualification-work-cta');
const qualificationWorkCtaText = document.getElementById('qualification-work-cta-text');
const qualificationWorkCtaBtn = document.getElementById('qualification-work-cta-btn');
const qualificationSection = document.getElementById('qualifications');
const qualificationTabsContainer = document.querySelector('.qualification__tabs');

function syncQualificationCrossCta(activeTab) {
  if (!qualificationWorkCta || !qualificationWorkCtaBtn || !activeTab) return;

  const isEducationActive = activeTab.dataset.target === '#education';

  if (qualificationWorkCtaText) {
    qualificationWorkCtaText.textContent = isEducationActive ? 'Want to see industry experience too?' : 'Want to see education background too?';
  }

  qualificationWorkCtaBtn.textContent = isEducationActive ? 'Explore Work Experience' : 'Explore Education';
  qualificationWorkCtaBtn.dataset.target = isEducationActive ? '#work' : '#education';
}

function getQualificationScrollOffset() {
  const header = document.getElementById('header');
  let headerOffset = 10;
  if (header) {
    const headerStyles = window.getComputedStyle(header);
    const isTopPinnedHeader = headerStyles.position === 'fixed' && headerStyles.top !== 'auto' && parseFloat(headerStyles.top || '0') >= 0;

    if (isTopPinnedHeader) {
      headerOffset = header.getBoundingClientRect().height + 10;
    }
  }
  return headerOffset;
}

function scrollQualificationTabsIntoView(behavior = 'smooth') {
  if (!qualificationTabsContainer) return;

  const headerOffset = getQualificationScrollOffset();
  const tabsTop = qualificationTabsContainer.getBoundingClientRect().top + window.scrollY;
  const targetTop = Math.max(0, Math.round(tabsTop - headerOffset));

  window.scrollTo({
    top: targetTop,
    behavior,
  });
}

function forceScrollToQualificationTop(behavior = 'auto') {
  if (!qualificationSection) return;

  const headerOffset = getQualificationScrollOffset();
  const targetTop = Math.max(0, Math.round(qualificationSection.getBoundingClientRect().top + window.scrollY - headerOffset));

  window.scrollTo({
    top: targetTop,
    behavior,
  });

  if (behavior === 'auto') {
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = targetTop;
    }
    document.documentElement.scrollTop = targetTop;
    if (document.body) {
      document.body.scrollTop = targetTop;
    }
  }

  return targetTop;
}

function mobileScrollToQualificationSection() {
  forceScrollToQualificationTop('auto');
  requestAnimationFrame(() => forceScrollToQualificationTop('auto'));
}

function setActiveQualificationTab(activeTab) {
  if (!activeTab) return;
  const targetSelector = activeTab.dataset.target;
  if (!targetSelector) return;

  const target = document.querySelector(targetSelector);
  if (!target) return;

  qualificationContents.forEach(content => {
    content.classList.remove('qualification__active');
  });
  target.classList.add('qualification__active');

  qualificationTabs.forEach(tab => {
    tab.classList.remove('qualification__active');
    tab.setAttribute('aria-selected', 'false');
  });

  activeTab.classList.add('qualification__active');
  activeTab.setAttribute('aria-selected', 'true');
  syncQualificationCrossCta(activeTab);
}

qualificationTabs.forEach(tab => {
  tab.setAttribute('role', 'button');
  tab.setAttribute('tabindex', '0');
  tab.setAttribute('aria-selected', tab.classList.contains('qualification__active') ? 'true' : 'false');

  tab.addEventListener('click', () => {
    setActiveQualificationTab(tab);
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
    if (isMobileViewport) {
      mobileScrollToQualificationSection();
    } else {
      scrollQualificationTabsIntoView('smooth');
    }
  });

  tab.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setActiveQualificationTab(tab);
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
    if (isMobileViewport) {
      mobileScrollToQualificationSection();
    } else {
      scrollQualificationTabsIntoView('smooth');
    }
  });
});

if (qualificationTabs.length) {
  const defaultActiveTab = Array.from(qualificationTabs).find(tab => tab.classList.contains('qualification__active')) || qualificationTabs[0];
  syncQualificationCrossCta(defaultActiveTab);
}

if (qualificationWorkCtaBtn) {
  qualificationWorkCtaBtn.addEventListener('click', () => {
    const targetSelector = qualificationWorkCtaBtn.dataset.target;
    const targetTab = Array.from(qualificationTabs).find(tab => tab.dataset.target === targetSelector);
    if (!targetTab) return;

    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
    setActiveQualificationTab(targetTab);
    if (isMobileViewport) {
      mobileScrollToQualificationSection();
    } else {
      window.setTimeout(() => scrollQualificationTabsIntoView('smooth'), 30);
    }
  });
}

function setupQualificationCardLinks() {
  const allowedTitles = [
    'Vector Databases Professional Certificate',
    'Microsoft Azure AI Essentials Professional Certificate',
    'Agile Project Management & Jira Professional Certificate',
    'DevOps Professional Certificate',
    'Docker Foundations Professional Certificate',
    'Microservices Foundations Professional Certificate',
    'LambdaTest Test Automation Professional Certificate',
    'Advanced Snowflake: Cloud Data Warehousing and Analytics',
    'Software Engineer Role Certificate',
    'Frontend Engineer Role Certificate',
    'REST APIs Certificate',
    'Analyzing Business Metrics with SQL Certificate',
    'DS102X: Machine Learning for Data Science and Analytics Certificate',
    'BDE1x: Big Data & Education Certificate',
    'PH125.4x: Data Science: Inference and Modeling',
    'CYB003x: Building A Cybersecurity Toolkit',
  ];

  const qualificationCards = document.querySelectorAll('.qualification__data');

  qualificationCards.forEach(card => {
    const columns = [card.firstElementChild, card.lastElementChild].filter(Boolean);

    columns.forEach(column => {
      const titleText = column.querySelector('.qualification__title')?.textContent.trim() || '';
      if (!allowedTitles.includes(titleText)) {
        return;
      }

      const anchor = column.querySelector('a[href]');
      if (!anchor) {
        return;
      }

      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');

      column.classList.add('qualification__card-link');

      column.addEventListener('click', event => {
        const interactive = event.target.closest('a, button');
        if (interactive) {
          return; // let native link/button behavior proceed
        }

        const href = anchor.getAttribute('href');
        if (!href) {
          return;
        }

        const target = '_blank';
        window.open(href, target);
      });
    });
  });
}

const modalViews = document.querySelectorAll('.services__modal'),
  modalBtns = document.querySelectorAll('.services__button'),
  modalCloses = document.querySelectorAll('.services__modal-close');

let modal = function (modalClick) {
  const modalEl = modalViews[modalClick];

  if (modalEl && !modalEl.dataset.movedToBody) {
    document.body.appendChild(modalEl);
    modalEl.dataset.movedToBody = 'true';
  }

  modalEl.classList.add('active-modal');
};

const portfolioTopicPriority = [
  'All',
  'Full-Stack',
  'AI',
  'Agentic AI',
  'RAG',
  'ML',
  'MLOps',
  'Cross-Platform',
  'Data',
  'Database',
  'Backend/API',
  'Realtime',
  'Mobile',
  'Game',
  'Productivity',
  'E-Commerce',
];
const portfolioTopicState = {
  activeTopic: 'All',
};
const portfolioProjectTopicMap = {
  'The MovieVerse App': ['Full-Stack', 'Data', 'Database'],
  'EstateWise - A Real Estate Chatbot': ['Agentic AI', 'AI', 'RAG', 'Full-Stack', 'Data'],
  'SynthoraAI - AI-Powered Article Curator': ['AI', 'Data', 'Full-Stack', 'Productivity'],
  'DocuThinker - AI-Powered Document Analysis App': ['AI', 'RAG', 'Full-Stack', 'Productivity'],
  'WealthWise - A Personal Finance Management App': ['Agentic AI', 'AI', 'Data', 'Full-Stack'],
  'PetSwipe - A Matchmaking App for Pet Adoption': ['AI', 'Full-Stack'],
  'SymptomSync - A Health Management App': ['AI', 'Full-Stack'],
  'Customizable AI Chatbot': ['AI', 'RAG', 'Full-Stack'],
  'Meadows - A Social Media for Gen-Z': ['Full-Stack', 'Realtime'],
  'Urlvy - A URL Shortening Service': ['Full-Stack', 'Backend/API', 'Productivity'],
  'Collabify - A Project Management Tool': ['Full-Stack', 'Productivity'],
  'MetaWave - A MP3 Music Editor': ['Full-Stack', 'Productivity'],
  'Boxed - Inventory Management App': ['Full-Stack', 'Productivity'],
  'Moodify - AI-Powered Music Recommendation App': ['AI', 'ML', 'Data', 'Full-Stack'],
  'Budget Management Backend API': ['Backend/API', 'Full-Stack'],
  'Agentic AI - Autonomous Agents': ['Agentic AI', 'AI'],
  'Agentic RAG AI System': ['Agentic AI', 'AI', 'RAG'],
  'Spot the Scam - AI Job Fraud Detection': ['AI', 'ML', 'MLOps', 'Data'],
  'YouTube Success Predictor - AI-Powered YouTube Analytics': ['AI', 'ML', 'MLOps', 'Data'],
  'End-to-End Data Pipeline': ['AI', 'ML', 'MLOps', 'Data', 'Database'],
  'AI Multipurpose Classifiers': ['AI', 'ML', 'Backend/API'],
  'Lumina AI - The Ultimate AI Chatbot': ['Agentic AI', 'AI', 'RAG', 'Full-Stack'],
  'AI Coding Agents Orchestrator': ['Agentic AI', 'AI', 'Realtime'],
  'Employee Management Fullstack App': ['Full-Stack'],
  'LatticeDB Next-Gen DBMS': ['Database', 'Backend/API'],
  'Fusion Electronics E-Commerce Website': ['Full-Stack', 'E-Commerce'],
  'React Native Task Management App': ['Mobile', 'Productivity'],
  'Flowlist - A Productivity Task App': ['Full-Stack', 'Productivity'],
  'ClipChronicle - Clipboard Assistant': ['Productivity', 'Cross-Platform'],
  'StudySync Study Buddy App': ['Productivity', 'Full-Stack'],
  'MermaidGenie - AI-Powered Mermaid Diagram Generator': ['AI', 'Productivity', 'Full-Stack'],
  'Pokedex - A Pokemon Database': ['Full-Stack', 'Data', 'Database'],
  'Claude Code AI Agents Monitoring Dashboard': ['Agentic AI', 'AI', 'Productivity', 'Full-Stack', 'Realtime'],
  'Tic-Tac-Toe Fullstack Game': ['AI', 'Game', 'Full-Stack'],
  'Learning Management System (LMS)': ['Full-Stack', 'Productivity'],
  'CollabNote - A Realtime Note-Taking App': ['Full-Stack', 'Realtime', 'Productivity'],
  'PuzzleForge - A Puzzle Collection': ['Game', 'Full-Stack'],
  'The Maze Game': ['Game'],
  'The 2048 Game': ['Game'],
  'The Flappy Bird Game': ['Game', 'Mobile'],
  'The StickyNotes App': ['Productivity'],
  'The WeatherMate App': ['Full-Stack'],
  'The RecipeGenie App': ['AI', 'Full-Stack'],
};
const portfolioPreviewState = {
  projectData: [],
  observer: null,
  listenersBound: false,
  behaviorBound: false,
};
const portfolioSlideLibrary = getPortfolioSlideLibrary();

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener('click', () => {
    modal(i);
  });
});

modalViews.forEach(view => {
  view.addEventListener('click', e => {
    const content = view.querySelector('.services__modal-content');
    if (!content.contains(e.target)) {
      view.classList.remove('active-modal');
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modalViews.forEach(view => view.classList.remove('active-modal'));
  }
});

modalCloses.forEach(modalClose => {
  modalClose.addEventListener('click', () => {
    modalViews.forEach(modalView => {
      modalView.classList.remove('active-modal');
    });
  });
});

function getPortfolioPreviewData() {
  const slides = Array.from(document.querySelectorAll('.portfolio__container .swiper-wrapper > .portfolio__content'));

  return slides.map(slide => {
    const title = slide.querySelector('.portfolio__title')?.textContent.trim() || 'Project';
    const description = trimProjectText(slide.querySelector('.portfolio__description')?.textContent.trim() || '');
    const image = slide.querySelector('.portfolio__img')?.getAttribute('src') || '';

    return { title, description, image };
  });
}

function getPortfolioSlideLibrary() {
  const slides = Array.from(document.querySelectorAll('.portfolio__container .swiper-wrapper > .portfolio__content')).filter(
    slide => !slide.classList.contains('swiper-slide-duplicate')
  );

  return slides.map(slide => {
    const normalizedSlide = slide.cloneNode(true);
    normalizedSlide.classList.remove('scroll-animation', 'scroll-in-view', 'active');
    normalizedSlide.removeAttribute('style');

    const title = normalizedSlide.querySelector('.portfolio__title')?.textContent.trim() || 'Project';
    const description = normalizedSlide.querySelector('.portfolio__description')?.textContent.trim() || '';
    const image = normalizedSlide.querySelector('.portfolio__img')?.getAttribute('src') || '';
    const topics = getPortfolioTopicsForProject(title, description);

    return {
      title,
      description,
      image,
      topics,
      html: normalizedSlide.outerHTML,
    };
  });
}

function getPortfolioTopicsForProject(title, description) {
  const manualTopics = portfolioProjectTopicMap[title];
  if (Array.isArray(manualTopics) && manualTopics.length) {
    return [...new Set(manualTopics)];
  }

  return detectPortfolioTopics(title, description);
}

function detectPortfolioTopics(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const topics = new Set();

  if (/(agentic|autonomous agents|orchestrator|multi-agent)/.test(text)) {
    topics.add('Agentic AI');
    topics.add('AI');
  }
  if (/(\bai\b|\bllm\b|genai|rag|chatbot|transformer|gpt)/.test(text)) topics.add('AI');
  if (/(rag|retrieval-augmented|langchain|faiss|pinecone|vector db)/.test(text)) topics.add('RAG');
  if (/(\bml\b|machine learning|classifier|prediction|predictor)/.test(text)) topics.add('ML');
  if (/(mlops|model deployment|orchestration|airflow|prefect|kubeflow)/.test(text)) topics.add('MLOps');
  if (/(data pipeline|analytics|etl|dataset|data)/.test(text)) topics.add('Data');
  if (/(realtime|real-time|websocket|socket\\.io|server-sent events|sse|live collaboration)/.test(text)) topics.add('Realtime');
  if (/(full-stack|fullstack|mern|nestjs|supabase|next\\.js|web app|web application)/.test(text)) topics.add('Full-Stack');
  if (/(api|backend|graphql|rest)/.test(text)) topics.add('Backend/API');
  if (/(react native|ios|swift|mobile)/.test(text)) topics.add('Mobile');
  if (/(game|wordle|puzzle|flappy|tic-tac-toe)/.test(text)) topics.add('Game');
  if (/(productivity|task|clipboard|study|note)/.test(text)) topics.add('Productivity');
  if (/(e-commerce|ecommerce|store|shop)/.test(text)) topics.add('E-Commerce');

  if (topics.size === 0) {
    topics.add('Full-Stack');
  }

  return [...topics];
}

function renderPortfolioTopicChips(slide, topics) {
  const body = slide.querySelector('.portfolio_');
  const titleEl = slide.querySelector('.portfolio__title');
  if (!body || !titleEl) return;

  let topicList = body.querySelector('.portfolio__topic-list');
  if (!topicList) {
    topicList = document.createElement('div');
    topicList.className = 'portfolio__topic-list';
    titleEl.insertAdjacentElement('afterend', topicList);
  }

  topicList.innerHTML = '';
  topics.forEach(topic => {
    const chip = document.createElement('span');
    chip.className = 'portfolio__topic-chip';
    chip.textContent = topic;
    topicList.appendChild(chip);
  });
}

function buildPortfolioPreviewDataFromSource(source) {
  return source.map(project => ({
    title: project.title,
    description: trimProjectText(project.description),
    image: project.image,
  }));
}

function getPortfolioSlidesByTopic(topic) {
  if (!topic || topic === 'All') {
    return portfolioSlideLibrary;
  }

  return portfolioSlideLibrary.filter(project => project.topics.includes(topic));
}

function hydratePortfolioTopicChipsFromSource(source) {
  const slides = Array.from(document.querySelectorAll('.portfolio__container .swiper-wrapper > .portfolio__content'));
  slides.forEach((slide, index) => {
    const project = source[index];
    if (!project) return;
    renderPortfolioTopicChips(slide, project.topics);
  });
}

function updatePortfolioTopicButtons(activeTopic) {
  const topicNav = document.getElementById('portfolio-topics');
  if (!topicNav) return;
  topicNav.querySelectorAll('.portfolio__topic-btn').forEach(node => {
    node.classList.toggle('is-active', node.dataset.topic === activeTopic);
  });
}

function resetPortfolioSwiperAfterFilter(swiper, shouldResumeAutoplay) {
  if (!swiper) return;

  if (typeof swiper.updateSize === 'function') {
    swiper.updateSize();
  }
  if (typeof swiper.updateSlides === 'function') {
    swiper.updateSlides();
  }
  swiper.update();
  const minTranslate = typeof swiper.minTranslate === 'function' ? swiper.minTranslate() : 0;

  if (typeof swiper.setTransition === 'function') {
    swiper.setTransition(0);
  }
  if (swiper.wrapperEl) {
    swiper.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';
  }
  swiper.translate = minTranslate;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  if (typeof swiper.updateProgress === 'function') {
    swiper.updateProgress(minTranslate);
  }
  if (typeof swiper.slideTo === 'function') {
    swiper.slideTo(0, 0, false);
  }
  if (typeof swiper.updateSlidesClasses === 'function') {
    swiper.updateSlidesClasses();
  }

  if (swiper.pagination) {
    swiper.pagination.render();
    swiper.pagination.update();
  }

  if (shouldResumeAutoplay) {
    startPortfolioAutoplay(swiper);
  }
  syncPortfolioNavAvailability(swiper);
}

function applyPortfolioTopicFilter(swiper, topic, spotlight = true) {
  if (!swiper) return;

  const targetSlides = getPortfolioSlidesByTopic(topic);
  if (!targetSlides.length) return;

  portfolioTopicState.activeTopic = topic;
  updatePortfolioTopicButtons(topic);

  const shouldResumeAutoplay = Boolean(swiper.__portfolioAutoplayRunning);
  if (shouldResumeAutoplay) {
    stopPortfolioAutoplay(swiper);
  }
  if (swiper.__wrapCleanupTimer) {
    clearTimeout(swiper.__wrapCleanupTimer);
    swiper.__wrapCleanupTimer = null;
  }
  swiper.__isWrapping = false;
  removePortfolioWrapClones(swiper);

  if (swiper.wrapperEl) {
    swiper.wrapperEl.innerHTML = targetSlides.map(project => project.html).join('');
  }
  hydratePortfolioTopicChipsFromSource(targetSlides);
  resetPortfolioSwiperAfterFilter(swiper, shouldResumeAutoplay);

  const previewData = buildPortfolioPreviewDataFromSource(targetSlides);
  setupPortfolioBulletPreviews(swiper, previewData);
  requestAnimationFrame(() => {
    resetPortfolioSwiperAfterFilter(swiper, false);
    setupPortfolioBulletPreviews(swiper, previewData);
  });

  if (!spotlight || topic === 'All') return;

  setTimeout(() => {
    const activeSlide = document.querySelector('.portfolio__container .swiper-slide-active');
    if (!activeSlide) return;
    activeSlide.classList.add('portfolio__content--spotlight');
    setTimeout(() => activeSlide.classList.remove('portfolio__content--spotlight'), 860);
  }, 180);
}

function setupPortfolioTopics(swiper) {
  const topicNav = document.getElementById('portfolio-topics');
  if (!topicNav || !portfolioSlideLibrary.length) return;

  hydratePortfolioTopicChipsFromSource(portfolioSlideLibrary);

  const topicSet = new Set();
  portfolioSlideLibrary.forEach(project => project.topics.forEach(topic => topicSet.add(topic)));

  const orderedTopics = [
    ...portfolioTopicPriority.filter(topic => topic !== 'All' && topicSet.has(topic)),
    ...[...topicSet].filter(topic => !portfolioTopicPriority.includes(topic)),
  ];

  const buttons = ['All', ...orderedTopics];
  topicNav.innerHTML = buttons
    .map(topic => `<button type="button" class="portfolio__topic-btn${topic === 'All' ? ' is-active' : ''}" data-topic="${topic}">${topic}</button>`)
    .join('');

  if (topicNav.dataset.bound === 'true') {
    applyPortfolioTopicFilter(swiper, portfolioTopicState.activeTopic || 'All', false);
    return;
  }

  topicNav.dataset.bound = 'true';
  topicNav.addEventListener('click', event => {
    const button = event.target.closest('.portfolio__topic-btn');
    if (!button) return;

    const topic = button.dataset.topic;
    if (!topic) return;
    applyPortfolioTopicFilter(swiper, topic, true);
  });
}

function trimProjectText(text, maxLength = 150) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function setupPortfolioBulletPreviews(swiper, projectData) {
  const paginationElRaw = swiper.pagination?.el;
  const paginationEl = Array.isArray(paginationElRaw)
    ? paginationElRaw[0]
    : typeof paginationElRaw === 'string'
      ? document.querySelector(paginationElRaw)
      : paginationElRaw;

  if (!paginationEl || !projectData || !projectData.length) {
    return;
  }
  portfolioPreviewState.projectData = projectData;

  let preview = document.querySelector('.portfolio__bullet-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.className = 'portfolio__bullet-preview';
    preview.innerHTML = `
      <div class="portfolio__bullet-preview__media" aria-hidden="true"></div>
      <div class="portfolio__bullet-preview__body">
        <span class="portfolio__bullet-preview__eyebrow">Project highlight</span>
        <h4 class="portfolio__bullet-preview__title"></h4>
        <p class="portfolio__bullet-preview__desc"></p>
      </div>
    `;
    document.body.appendChild(preview);
  }

  const previewMedia = preview.querySelector('.portfolio__bullet-preview__media');
  const previewTitle = preview.querySelector('.portfolio__bullet-preview__title');
  const previewDesc = preview.querySelector('.portfolio__bullet-preview__desc');

  const hidePreview = () => preview.classList.remove('is-visible');

  const updateBulletData = () => {
    const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
    bullets.forEach((bullet, index) => {
      const dataIndex = Math.min(index, portfolioPreviewState.projectData.length - 1);
      const current = portfolioPreviewState.projectData[dataIndex];
      if (!current) return;
      bullet.dataset.portfolioIndex = String(dataIndex);
      bullet.setAttribute('aria-label', `Preview ${current.title}`);
      bullet.setAttribute('title', current.title);
    });
  };

  updateBulletData();

  if (portfolioPreviewState.observer) {
    portfolioPreviewState.observer.disconnect();
  }
  portfolioPreviewState.observer = new MutationObserver(updateBulletData);
  portfolioPreviewState.observer.observe(paginationEl, { childList: true });

  const showFromBullet = bullet => {
    if (!bullet || !bullet.dataset.portfolioIndex) return;
    const project = portfolioPreviewState.projectData[Number(bullet.dataset.portfolioIndex)];
    if (!project) return;

    previewTitle.textContent = project.title;
    previewDesc.textContent = project.description;
    previewMedia.style.backgroundImage = project.image ? `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35)), url(${project.image})` : '';

    const bulletRect = bullet.getBoundingClientRect();
    const bulletCenter = bulletRect.left + bulletRect.width / 2;
    preview.style.setProperty('--preview-left', `${bulletCenter}px`);

    requestAnimationFrame(() => {
      const offset = preview.offsetHeight || 0;
      let top = bulletRect.top - offset - 16;
      if (top < 12) {
        top = bulletRect.bottom + 16; // fall back to below the dots if near the top
      }
      preview.style.setProperty('--preview-top', `${top}px`);
      preview.classList.add('is-visible');
    });
  };

  const delegatedHover = event => {
    const bullet = event.target.closest('.swiper-pagination-bullet');
    if (bullet) showFromBullet(bullet);
  };

  if (!portfolioPreviewState.listenersBound) {
    document.addEventListener('mouseover', delegatedHover, true);
    document.addEventListener('focusin', delegatedHover, true);
    document.addEventListener('mouseleave', hidePreview, true);
    document.addEventListener('focusout', hidePreview, true);
    portfolioPreviewState.listenersBound = true;
  }
  if (!portfolioPreviewState.behaviorBound) {
    swiper.on('slideChange', hidePreview);
    window.addEventListener('resize', hidePreview);
    window.addEventListener('scroll', hidePreview, true);
    portfolioPreviewState.behaviorBound = true;
  }
}

function setupPortfolioAutoplayOnView(swiper) {
  const portfolioSection = document.getElementById('portfolio');
  if (!swiper || !portfolioSection) {
    return;
  }

  const updateAutoplay = isVisible => {
    if (isVisible) {
      startPortfolioAutoplay(swiper);
      return;
    }
    stopPortfolioAutoplay(swiper);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => updateAutoplay(entry.isIntersecting));
    },
    {
      root: null,
      threshold: 0.3,
    }
  );

  observer.observe(portfolioSection);

  if (!swiper.__portfolioAutoplaySlideChangeBound) {
    swiper.on('slideChange', () => {
      if (swiper.__isAutoplayAdvancing) return;
      resetPortfolioAutoplayClock(swiper);
    });
    swiper.__portfolioAutoplaySlideChangeBound = true;
  }

  swiper.el?.addEventListener('mouseenter', () => stopPortfolioAutoplay(swiper));
  swiper.el?.addEventListener('mouseleave', () => startPortfolioAutoplay(swiper));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopPortfolioAutoplay(swiper);
    } else {
      const rect = swiper.el?.getBoundingClientRect();
      const inViewport = Boolean(rect && rect.bottom > 0 && rect.top < window.innerHeight);
      if (inViewport) {
        startPortfolioAutoplay(swiper);
      }
    }
  });
}

function startPortfolioAutoplay(swiper) {
  if (!swiper || swiper.__portfolioAutoplayRunning) return;
  const delay = 3000;
  swiper.__portfolioAutoplayRunning = true;
  swiper.__portfolioAutoplayTimer = window.setInterval(() => {
    if (document.hidden || swiper.__isWrapping) return;
    swiper.__isAutoplayAdvancing = true;
    slidePortfolioWithWrap(swiper, 'next', 320);
    if (swiper.__portfolioAutoplayAdvanceResetTimer) {
      clearTimeout(swiper.__portfolioAutoplayAdvanceResetTimer);
    }
    swiper.__portfolioAutoplayAdvanceResetTimer = window.setTimeout(() => {
      swiper.__isAutoplayAdvancing = false;
      swiper.__portfolioAutoplayAdvanceResetTimer = null;
    }, 500);
  }, delay);
}

function stopPortfolioAutoplay(swiper) {
  if (!swiper || !swiper.__portfolioAutoplayRunning) return;
  swiper.__portfolioAutoplayRunning = false;
  if (swiper.__portfolioAutoplayTimer) {
    clearInterval(swiper.__portfolioAutoplayTimer);
    swiper.__portfolioAutoplayTimer = null;
  }
  if (swiper.__portfolioAutoplayAdvanceResetTimer) {
    clearTimeout(swiper.__portfolioAutoplayAdvanceResetTimer);
    swiper.__portfolioAutoplayAdvanceResetTimer = null;
  }
  swiper.__isAutoplayAdvancing = false;
}

function resetPortfolioAutoplayClock(swiper) {
  if (!swiper || !swiper.__portfolioAutoplayRunning) return;
  stopPortfolioAutoplay(swiper);
  startPortfolioAutoplay(swiper);
}

function getPortfolioRealSlides(swiper) {
  if (!swiper?.wrapperEl) return [];
  return Array.from(swiper.wrapperEl.children).filter(node => node.classList?.contains('swiper-slide') && node.dataset.portfolioWrapClone !== 'true');
}

function getPortfolioLastIndex(swiper) {
  return Math.max(getPortfolioRealSlides(swiper).length - 1, 0);
}

function getPortfolioNavElements(swiper) {
  const nextElRaw = swiper?.navigation?.nextEl;
  const prevElRaw = swiper?.navigation?.prevEl;
  const nextEl = Array.isArray(nextElRaw) ? nextElRaw[0] : nextElRaw;
  const prevEl = Array.isArray(prevElRaw) ? prevElRaw[0] : prevElRaw;
  return { nextEl, prevEl };
}

function syncPortfolioNavAvailability(swiper) {
  if (!swiper) return;

  const { nextEl, prevEl } = getPortfolioNavElements(swiper);
  const hasMultipleSlides = getPortfolioLastIndex(swiper) > 0;

  if (swiper.navigation && typeof swiper.navigation.update === 'function') {
    swiper.navigation.update();
  }

  [nextEl, prevEl].forEach(button => {
    if (!button) return;

    button.classList.remove('swiper-button-lock');
    button.classList.remove('portfolio-swiper-nav-lock');
    button.classList.remove('portfolio-swiper-nav-disabled');
    if (hasMultipleSlides) {
      button.classList.remove('swiper-button-disabled');
      button.setAttribute('aria-disabled', 'false');
      button.style.pointerEvents = 'auto';
      button.style.opacity = '';
      button.tabIndex = 0;
      return;
    }

    button.classList.add('swiper-button-disabled');
    button.setAttribute('aria-disabled', 'true');
    button.style.pointerEvents = 'none';
    button.style.opacity = '0.45';
    button.tabIndex = -1;
  });
}

function updatePortfolioSwiperMetrics(swiper) {
  if (!swiper) return;
  if (typeof swiper.updateSize === 'function') swiper.updateSize();
  if (typeof swiper.updateSlides === 'function') swiper.updateSlides();
  swiper.update();
  if (typeof swiper.updateSlidesClasses === 'function') swiper.updateSlidesClasses();
}

function removePortfolioWrapClones(swiper) {
  if (!swiper?.wrapperEl) return;
  swiper.wrapperEl.querySelectorAll('[data-portfolio-wrap-clone="true"]').forEach(node => node.remove());
}

function runPortfolioEdgeWrapAnimation(swiper, direction, speed = 320) {
  if (!swiper || swiper.__isWrapping) return;

  const realSlides = getPortfolioRealSlides(swiper);
  const realCount = realSlides.length;
  if (realCount <= 1 || !swiper.wrapperEl) return;

  swiper.__isWrapping = true;

  const edgeSlide = direction === 'next' ? realSlides[0] : realSlides[realCount - 1];
  const wrapClone = edgeSlide.cloneNode(true);
  wrapClone.dataset.portfolioWrapClone = 'true';

  if (direction === 'next') {
    swiper.wrapperEl.appendChild(wrapClone);
  } else {
    swiper.wrapperEl.insertBefore(wrapClone, swiper.wrapperEl.firstChild);
  }

  updatePortfolioSwiperMetrics(swiper);

  if (direction === 'prev') {
    swiper.slideTo(1, 0, false);
  }

  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;

    if (swiper.__wrapCleanupTimer) {
      clearTimeout(swiper.__wrapCleanupTimer);
      swiper.__wrapCleanupTimer = null;
    }

    removePortfolioWrapClones(swiper);
    updatePortfolioSwiperMetrics(swiper);
    swiper.slideTo(direction === 'next' ? 0 : realCount - 1, 0, false);
    swiper.__isWrapping = false;
    syncPortfolioNavAvailability(swiper);
  };

  if (typeof swiper.once === 'function') {
    swiper.once('transitionEnd', cleanup);
  }
  swiper.__wrapCleanupTimer = setTimeout(cleanup, Math.max(260, speed + 140));

  requestAnimationFrame(() => {
    if (direction === 'next') {
      swiper.slideTo(realCount, speed, false);
      return;
    }
    swiper.slideTo(0, speed, false);
  });
}

function slidePortfolioWithWrap(swiper, direction, speed = 320) {
  if (!swiper || swiper.__isWrapping) return;

  const lastIndex = getPortfolioLastIndex(swiper);
  if (lastIndex <= 0) return;
  const currentIndex = Math.max(0, Math.min(swiper.activeIndex, lastIndex));

  if (direction === 'next') {
    if (currentIndex >= lastIndex) {
      runPortfolioEdgeWrapAnimation(swiper, 'next', speed);
      return;
    }
    swiper.slideTo(currentIndex + 1, speed, false);
    return;
  }

  if (currentIndex <= 0) {
    runPortfolioEdgeWrapAnimation(swiper, 'prev', speed);
    return;
  }
  swiper.slideTo(currentIndex - 1, speed, false);
}

function setupPortfolioWrapAroundNavigation(swiper) {
  if (!swiper || swiper.__wrapAroundBound) {
    return;
  }

  const delegatedNavClick = event => {
    const lastIndex = getPortfolioLastIndex(swiper);
    if (lastIndex <= 0) return;

    const nextButton = event.target.closest('.swiper-button-next');
    if (nextButton && swiper.el?.contains(nextButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      slidePortfolioWithWrap(swiper, 'next');
      return;
    }

    const prevButton = event.target.closest('.swiper-button-prev');
    if (prevButton && swiper.el?.contains(prevButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      slidePortfolioWithWrap(swiper, 'prev');
    }
  };

  swiper.el?.addEventListener('click', delegatedNavClick, true);
  swiper.el?.addEventListener(
    'keydown',
    event => {
      const key = event.key;
      if (key !== 'Enter' && key !== ' ') return;

      const lastIndex = getPortfolioLastIndex(swiper);
      if (lastIndex <= 0) return;

      const nextButton = event.target.closest('.swiper-button-next');
      if (nextButton && swiper.el?.contains(nextButton)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        slidePortfolioWithWrap(swiper, 'next');
        return;
      }

      const prevButton = event.target.closest('.swiper-button-prev');
      if (prevButton && swiper.el?.contains(prevButton)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        slidePortfolioWithWrap(swiper, 'prev');
      }
    },
    true
  );

  const syncNav = () => syncPortfolioNavAvailability(swiper);
  swiper.on('slideChange', syncNav);
  swiper.on('transitionEnd', syncNav);
  swiper.on('update', syncNav);
  swiper.on('resize', syncNav);
  syncNav();

  document.addEventListener(
    'keydown',
    event => {
      const target = event.target;
      const isTypingField =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      if (isTypingField) return;

      const rect = swiper.el?.getBoundingClientRect();
      if (!rect) return;
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inViewport) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopImmediatePropagation();
        slidePortfolioWithWrap(swiper, 'next');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopImmediatePropagation();
        slidePortfolioWithWrap(swiper, 'prev');
      }
    },
    true
  );

  swiper.__wrapAroundBound = true;
}

function setupPortfolioTouchEdgeWrap(swiper) {
  if (!swiper || swiper.__touchEdgeWrapBound) {
    return;
  }

  const swipeThreshold = 28;

  swiper.on('touchStart', () => {
    swiper.__touchStartIndex = swiper.activeIndex;
    swiper.__touchStartX = swiper.touches?.startX ?? 0;
    swiper.__touchStartY = swiper.touches?.startY ?? 0;
  });

  swiper.on('touchEnd', () => {
    const lastIndex = getPortfolioLastIndex(swiper);
    if (lastIndex <= 0) return;

    const startIndex = Number.isFinite(swiper.__touchStartIndex) ? swiper.__touchStartIndex : swiper.activeIndex;
    const startX = Number.isFinite(swiper.__touchStartX) ? swiper.__touchStartX : 0;
    const startY = Number.isFinite(swiper.__touchStartY) ? swiper.__touchStartY : 0;
    const currentX = Number.isFinite(swiper.touches?.currentX) ? swiper.touches.currentX : startX;
    const currentY = Number.isFinite(swiper.touches?.currentY) ? swiper.touches.currentY : startY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (startIndex === 0 && deltaX > 0) {
      runPortfolioEdgeWrapAnimation(swiper, 'prev');
      return;
    }

    if (startIndex === lastIndex && deltaX < 0) {
      runPortfolioEdgeWrapAnimation(swiper, 'next');
    }
  });

  swiper.__touchEdgeWrapBound = true;
}

function setupHorizontalScrollForCarousel(swiper) {
  if (!swiper || !swiper.el) {
    return;
  }

  const minDelta = 18;
  const cooldownMs = 450;
  let lastTriggerTime = 0;

  swiper.el.addEventListener(
    'wheel',
    event => {
      let horizontalDelta = event.deltaX;

      if (event.shiftKey && Math.abs(horizontalDelta) < Math.abs(event.deltaY)) {
        horizontalDelta = event.deltaY;
      }

      if (Math.abs(horizontalDelta) < minDelta) {
        return;
      }

      if (!event.shiftKey && Math.abs(horizontalDelta) < Math.abs(event.deltaY)) {
        return;
      }

      const now = Date.now();
      if (now - lastTriggerTime < cooldownMs) {
        return;
      }

      lastTriggerTime = now;
      event.preventDefault();

      if (horizontalDelta > 0) {
        slidePortfolioWithWrap(swiper, 'next');
      } else {
        slidePortfolioWithWrap(swiper, 'prev');
      }
    },
    { passive: false }
  );
}

document.addEventListener('DOMContentLoaded', scrollActive);
document.addEventListener('DOMContentLoaded', setupQualificationCardLinks);

const swiperPortfolio = new Swiper('.portfolio__container', {
  loop: false,
  slidesPerView: 1,
  spaceBetween: 3500,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    disabledClass: 'portfolio-swiper-nav-disabled',
    lockClass: 'portfolio-swiper-nav-lock',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  keyboard: true,
  threshold: 20,
  on: {
    init: function () {
      setupPortfolioAutoplayOnView(this);
      setupPortfolioWrapAroundNavigation(this);
      setupPortfolioTouchEdgeWrap(this);
      setupHorizontalScrollForCarousel(this);
      setupPortfolioTopics(this);
      setTimeout(() => setupPortfolioBulletPreviews(this, getPortfolioPreviewData()), 50);
    },
    paginationUpdate: function () {
      setTimeout(() => setupPortfolioBulletPreviews(this, getPortfolioPreviewData()), 50);
    },
  },
});

const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;
  let activeSection = null;

  sections.forEach(current => {
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute('id');

    if (scrollY >= sectionTop) {
      activeSection = sectionId;
    }
  });

  sections.forEach(current => {
    const sectionId = current.getAttribute('id');
    const link = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);
    if (!link) return;

    if (sectionId === activeSection) {
      link.classList.add('active-link');
    } else {
      link.classList.remove('active-link');
    }
  });

  // Update scroll progress bar
  updateScrollProgress();
}

function updateScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
  const clampedPercentage = Math.max(0, Math.min(scrollPercentage, 100));

  requestAnimationFrame(() => {
    progressBar.style.width = `${clampedPercentage}%`;
  });
}

const textArray = ['Welcome!'];
const subtitleArray = ['Explore my portfolio and see my journey as a software engineer!'];
let charIndex = 0;
let subtitleIndex = 0;
let typingDelay = 150;
let subtitleDelay = 100;
let newTextDelay = 1000;
let typedTextSpan = document.getElementById('typed-text');
let typedSubtitleSpan = document.getElementById('typed-subtitle');
let cursor = document.getElementById('cursor');
let cursorSubtitle = document.getElementById('cursor-subtitle');
let scrollButton = document.getElementById('scroll-button');

function revealScrollBtn() {
  if (!scrollButton) return;
  // clear any inline display toggles
  scrollButton.style.display = '';
  // switch to the animated visible state (CSS handles fade/slide + starts bounce)
  scrollButton.classList.remove('is-hidden');
  scrollButton.classList.add('is-visible');
  // a11y
  scrollButton.setAttribute('aria-hidden', 'false');
}

function typeTitle() {
  if (charIndex < textArray[0].length) {
    typedTextSpan.textContent += textArray[0].charAt(charIndex);
    charIndex++;
    setTimeout(typeTitle, typingDelay);
  } else {
    // Add blinking effect before transitioning
    cursor.classList.add('blinking-cursor');

    // Wait for one blink (about 1 second), then move to subtitle
    setTimeout(() => {
      cursor.classList.remove('blinking-cursor'); // Remove blinking
      cursor.style.display = 'none'; // Hide cursor after blinking

      setTimeout(typeSubtitle, 300); // Delay before subtitle starts
    }, 1000); // Blinking happens once
  }
}

function typeSubtitle() {
  cursorSubtitle.style.display = 'inline-block'; // Ensure cursor appears

  if (subtitleIndex < subtitleArray[0].length) {
    typedSubtitleSpan.textContent += subtitleArray[0].charAt(subtitleIndex);
    subtitleIndex++;
    setTimeout(typeSubtitle, subtitleDelay);
  } else {
    // Cursor stays visible and blinks instead of disappearing
    cursorSubtitle.classList.add('blinking-cursor');

    // Show the button
    // Show the button (smooth reveal; bounce starts after it fades in)
    setTimeout(() => {
      revealScrollBtn();

      // Delay before showing the graphics
      setTimeout(() => {
        const graphicsElem = document.querySelector('.graphics');
        if (graphicsElem) graphicsElem.classList.add('show-graphics');
      }, 500);
    }, 600);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(typeTitle, newTextDelay);
});

document.getElementById('scroll-button').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('scroll', scrollActive);

function scrollHeader() {
  const nav = document.getElementById('header');
  if (this.scrollY >= 80) nav.classList.add('scroll-header');
  else nav.classList.remove('scroll-header');
}

window.addEventListener('scroll', scrollHeader);

function scrollUp() {
  const scrollUp = document.getElementById('scroll-up');
  if (this.scrollY >= 80) scrollUp.classList.add('show-scroll');
  else scrollUp.classList.remove('show-scroll');
}

window.addEventListener('scroll', scrollUp);

function scrollUp1() {
  const scrollUp = document.getElementById('scroll-up1');
  if (this.scrollY >= 80) scrollUp.classList.add('show-scroll');
  else scrollUp.classList.remove('show-scroll');
}

window.addEventListener('scroll', scrollUp1);

// Theme toggle setup
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'uil-sun';
const themeMeta = document.querySelector('meta[name="theme-color"]');

// Get user’s saved preferences
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// Helpers to read the current state
const getCurrentTheme = () => (document.body.classList.contains(darkTheme) ? 'dark' : 'light');
const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun');

// On load: apply saved theme & icon, and set meta theme-color
if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);

  themeMeta.setAttribute('content', selectedTheme === 'dark' ? '#162427' : '#ffffff');
}

// On click: toggle classes, save prefs, update meta
themeButton.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);

  const currentTheme = getCurrentTheme();
  const currentIcon = getCurrentIcon();

  localStorage.setItem('selected-theme', currentTheme);
  localStorage.setItem('selected-icon', currentIcon);

  themeMeta.setAttribute('content', currentTheme === 'dark' ? '#162427' : '#ffffff');
});

const GEMINI_MODEL_CACHE_KEY = 'geminiModelCache';
const GEMINI_MODEL_CACHE_TTL_MS = 60 * 60 * 1000;
const GEMINI_MODEL_ROTATION_KEY = 'geminiModelRotationIndex';
const GEMINI_FALLBACK_MODELS = ['gemini-2.5-flash'];

function normalizeGeminiModelName(name) {
  return name && name.startsWith('models/') ? name.slice('models/'.length) : name;
}

function isProGeminiModel(name) {
  return /(^|-)pro($|-)/.test(name);
}

function isEmbeddingModel(name) {
  return name.includes('embedding');
}

function filterGeminiModels(models) {
  const filtered = [];
  const seen = new Set();

  models.forEach(model => {
    if (!model || !model.name) return;
    const normalized = normalizeGeminiModelName(model.name);
    if (!normalized) return;

    const lowerName = normalized.toLowerCase();
    if (!lowerName.startsWith('gemini-')) return;
    if (isEmbeddingModel(lowerName)) return;
    if (isProGeminiModel(lowerName)) return;

    const methods = Array.isArray(model.supportedGenerationMethods) ? model.supportedGenerationMethods : [];
    if (!methods.includes('generateContent')) return;
    if (seen.has(normalized)) return;

    seen.add(normalized);
    filtered.push(normalized);
  });

  return filtered;
}

function getCachedGeminiModels() {
  const raw = localStorage.getItem(GEMINI_MODEL_CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.models) || typeof parsed.timestamp !== 'number') return null;
    if (Date.now() - parsed.timestamp > GEMINI_MODEL_CACHE_TTL_MS) return null;
    return parsed.models;
  } catch (error) {
    return null;
  }
}

function setCachedGeminiModels(models) {
  localStorage.setItem(
    GEMINI_MODEL_CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      models,
    })
  );
}

async function fetchGeminiModels(apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Gemini models: ${response.status}`);
  }
  const data = await response.json();
  const models = Array.isArray(data.models) ? data.models : [];
  return filterGeminiModels(models);
}

async function getGeminiModels(apiKey) {
  const cached = getCachedGeminiModels();
  if (cached && cached.length > 0) {
    return cached;
  }

  try {
    const models = await fetchGeminiModels(apiKey);
    if (models.length > 0) {
      setCachedGeminiModels(models);
      return models;
    }
  } catch (error) {
    console.warn('Failed to fetch Gemini models, using cached fallback.', error);
  }

  return cached && cached.length > 0 ? cached : GEMINI_FALLBACK_MODELS;
}

function getGeminiRotationIndex(totalModels) {
  const raw = Number.parseInt(localStorage.getItem(GEMINI_MODEL_ROTATION_KEY), 10);
  if (!Number.isInteger(raw) || raw < 0 || raw >= totalModels) {
    return 0;
  }
  return raw;
}

function setGeminiRotationIndex(index) {
  localStorage.setItem(GEMINI_MODEL_ROTATION_KEY, String(index));
}

function buildRotatedModels(models, startIndex) {
  const rotated = [];
  for (let i = 0; i < models.length; i += 1) {
    rotated.push(models[(startIndex + i) % models.length]);
  }
  return rotated;
}

// Core chat logic
async function elizaResponse(message) {
  const conversationHistory = JSON.parse(localStorage.getItem('conversationHistory')) || [];
  const baseHistory = [...conversationHistory, { role: 'user', parts: [{ text: message }] }];
  let fullResponse = 'Generating response...';
  const apiKey = getAIResponse();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const models = await getGeminiModels(apiKey);
    const startIndex = getGeminiRotationIndex(models.length);
    const rotatedModels = buildRotatedModels(models, startIndex);
    let lastError = null;

    for (let i = 0; i < rotatedModels.length; i += 1) {
      const modelName = rotatedModels[i];
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction:
            'Instructions for you to answer all messages: Your name is Lumina, part of this Lumina AI app designed by Son (David) Nguyen to help answer any questions about him or any other questions users may have, created with Pinecone, RAG, and LLM/GenAI. Profile of Son Nguyen: Son (David) Nguyen - +1 (413) 437-6759 · hoangson091104@gmail.com · https://sonnguyenhoang.com, https://www.linkedin.com/in/hoangsonw · https://github.com/hoangsonww. Location: Chapel Hill, NC, USA 27514. You are an AI personal assistant for Son Nguyen, also known as David Nguyen or by full name Son Hoang Nguyen; when asked about yourself, state your title as \\"Lumina — AI personal assistant for Son (David) Nguyen.\\"\\n\\nBe accurate, clear, and helpful. If something isn’t known, say so or ask for more details. Prefer concise, structured answers with bullet points where useful. You can use your general knowledge for questions not covered here, but do not fabricate facts about Son or his work. When relevant, point users to Son’s website, LinkedIn, or GitHub. If users want a dedicated experience, refer them to the full Lumina at https://lumina-david.vercel.app/.\\n\\nRESUME SUMMARY\\nSon Nguyen is a results-driven software engineer with hands-on experience in large-scale, user-focused systems. He specializes in efficiency, scalability, AI, and full-stack development. He optimizes workflows, enhances performance, and delivers measurable impact.\\n\\nEDUCATION\\n• University of North Carolina at Chapel Hill (Graduated Dec 2025): B.S. Computer Science; B.A. Economics; Data Science Minor. GPA: 3.92/4.0.\\n\\nLEADERSHIP & COMMUNITY\\n• Microsoft Learn Student Ambassador (Aug 2022 – Present).\\n• Project Manager & Team Lead, Google Developer Student Clubs @ UNC-CH (Aug 2023 – Present): contributed to 6 projects benefitting 350+ Chapel Hill residents.\\n\\nTEACHING\\n• UTA, COMP-426: Modern Web Programming (Full-stack), UNC-CH (Aug 2025 – Present) · On-site\\n  – Led weekly studios on TypeScript/React/Next.js, REST/GraphQL, auth, testing, and deployment.\\n  – Built grading templates, autograder rubrics, and CI baselines; reviewed code for accessibility, performance, and security.\\n  – Mentored capstone teams on Vercel/AWS deployments and WCAG-aligned UI.\\n• TA, COMP-126: Web Design & Development, UNC-CH (Jan 2025 – May 2025) · On-site\\n  – Supported 80+ students; 8+ office hours/week; +15% project quality; 200+ graded items with 100% on-time returns; improved assignment clarity (+10% engagement).\\n• ULA, COMP-210: Data Structures, UNC-CH (Aug 2024 – Dec 2024) · On-site\\n  – 15+ weekly office hours; review sessions; +20% exam performance; improved labs (+25% engagement).\\n\\nRESEARCH\\n• Undergraduate Research Assistant, AIMING Lab (UNC-CH) (Jan 2025 – Apr 2025) · Hybrid\\n  – Foundation models (LLMs, VLMs, diffusion) on large datasets; biomedicine LLMs (500k+ records).\\n  – Adversarial robustness (−20% error), diffusion efficiency (−35% compute).\\n  – RL for robotics (+50% navigation efficiency); RAG methods (+40% accuracy).\\n\\nINDUSTRY EXPERIENCE\\n• Software Engineering Intern, Toshiba TEC – Toshiba Global Commerce Solutions (Sep 2025 – Dec 2025) · Durham, NC · On-site\\n  – Built an internal agentic AI platform (multi-agent, Dockerized microservices, AWS, Jenkins) automating up to 95% of SDLC.\\n  – 12 agent workflows (Kafka, Redis, LangChain, LangGraph, Neo4j, Weaviate, RAG) improved task decomposition (+35%) and cut feature delivery time (−30%).\\n  – Vue-based UI with real-time monitoring/logging and knowledge-graph context sharing (+40% developer productivity).\\n• Software Engineer Intern, FRG | Financial Risk Group (Apr 2025 – Aug 2025) · Cary, NC · On-site\\n  – VOR platform: −20% Angular UI load, +15% Django API throughput.\\n  – RAG chatbot (FAISS, LangChain, LLaMA, NgRx, Kafka/Zookeeper); RLHF (+20% accuracy).\\n  – AI Logs Explainer (70% time saved); Performance Analyzer (100+ monthly recs, +25% query efficiency); Prophet forecasts (92% accuracy).\\n  – Event Predictor; sensitivity/impact visualizations; Ansible automation; Playwright E2E in CI/CD; WSL/Ubuntu.\\n• Web App Developer & Research Assistant, DHEP Lab (May 2025 – Aug 2025) · Remote\\n  – AugMed: React frontend; Flask API; PostgreSQL; AWS (ECR→ECS→ALB, RDS, S3); Celery+Redis; JWT + CORS; Terraform; Docker Compose; pytest/Jest/Cypress with GitHub Actions.\\n  – GIL-DHEP platform: Next.js (TS, Tailwind, shadcn) + Express/TypeORM backend for clinician-in-the-loop LLM refinement.\\n• Software Engineer Intern, Technical Consulting & Research, Inc. (Mar 2025 – Apr 2025) · Remote\\n  – React + Flask full-stack app; DB architecture (+30% perf); RBAC (Auth0), OAuth2/JWT; CSRF/XSS hardening; CI/CD + Terraform.\\n• Software Engineer Intern, FPT Software (Jun 2024 – Aug 2024) · HCMC, Vietnam · On-site\\n  – ICDP internal comms: 20+ backend APIs, 10+ frontend features (Express, Elasticsearch, Node, MongoDB, RabbitMQ, Kafka, Redis, React).\\n  – +20% UI engagement (Figma); encrypted messaging, document sharing, trivia, tasks (+25% collaboration).\\n  – AI fine-tuning (TensorFlow/PyTorch/Optuna, +15%); user-created chatbots (+30% engagement).\\n• Associate Software Engineer Intern, Huong Hua Co., Ltd. (Dec 2023 – Feb 2024) · Remote\\n  – Full-stack English site & jobs DB for 50k+ active users; 200–300 apps/month.\\n  – React, Django, PHP, MongoDB, PostgreSQL; AWS (EC2, RDS, DocumentDB, S3, ELB, API GW, Route 53); Docker; −20% infra cost.\\n• Software Engineering Intern, VNG Corporation (May 2023 – Aug 2023) · HCMC, Vietnam · On-site\\n  – vCloudcam frontend (React, Angular, Webpack, Tailwind, Micro-Frontends): +30% performance; 50k+ monthly visits.\\n  – Backend (Beego/Go, PostgreSQL, MongoDB): 5k+ concurrent streams, 10M monthly queries; 200ms → <120ms queries.\\n  – Kubernetes orchestration (−40% deployment effort, −25% downtime); WebAssembly + C++ streaming (+20% streaming, +30% site). Best Intern Award.\\n• Data Analytics Research Assistant, Case Western Reserve University (Dec 2022 – May 2023) · Cleveland, OH · On-site\\n  – 50+ simulations/visualizations (Excel, Tableau, SAS, Plotly, ggplot2); +30% processing efficiency; 5k+ secure data points (−25% errors); 10+ TB Spark/Hadoop; reviewed 20+ proposals (+40% quality).\\n\\nSELECTED PROJECTS (more on GitHub)\\n• EstateWise — AI-Powered Real Estate Assistant (Apr 2025 – Present)\\n  EstateWise is a full-stack real estate chatbot that delivers personalized property recommendations using agentic AI, RAG, kNN, MoE, and CoT. Designed for users in Chapel Hill, NC, it blends intelligent search with a smooth interface and secure user auth.\\n  Key Features:\\n  – UI/UX: Built with Next.js, React, Tailwind, and Shadcn. Supports both guest and authenticated modes with a polished and responsive chat experience.\\n  – Secure Auth & Convo Management: JWT-based login with MongoDB. Authenticated users can manage chat history; guest sessions persist via localStorage.\\n  – AI Recommendations (RAG + kNN): Embedded 30k+ Pinecone vectors via cosine similarity. Results are injected into chatbot context.\\n  – Real-Time k-Means Clustering: Property listings are normalized and clustered to uncover submarkets and provide structured insights.\\n  – Mixture-of-Experts: 5 specialized AI agents (e.g., Financial Advisor, Neighborhood Expert) generate responses with a Master Merger model.\\n  – Chain-of-Thought: Each expert uses CoT to break down complex queries into manageable steps, ensuring accurate and relevant responses.\\n  – Agentic AI Pipeline: Orchestrator coordinating LangGraph and CrewAI runtimes to manage specialized agents (analytics, graph, finance, property), with tool-use policies and retry/reflect loops.\\n  – Charts & Visualizations: Trends, distributions, and cluster breakdowns across the app.\\n  – Feedback-Driven Expert Weighting: Thumbs-up/down adjusts expert influence in real time for personalization.\\n  – Backend API & Monitoring: Express + TypeScript backend with Swagger, MongoDB, Pinecone, and Prometheus monitoring.\\n  – Python Notebook: Colab notebook for EDA, clustering, interactive maps, and a CLI chatbot.\\n  Links: GitHub (github.com/hoangsonww/EstateWise-Chapel-Hill-Chatbot) · Live (https://estatewise.vercel.app)\\n• MovieVerse — 1M+ movie DB; microservices; AI recommendations; 330k+ monthly users. Live: https://movie-verse.com\\n• AI-Powered Article Curator — Next.js + Express/Mongo + crawler (Axios/Cheerio/Puppeteer) + AI summaries.\\n• DocuThinker — AI doc analysis (React, Express, Firebase, Swagger, Docker).\\n• PetSwipe — Swipe-to-adopt (Next.js, PostgreSQL/TypeORM, AWS S3, Terraform, Swagger).\\n• SymptomSync — Health app (Next.js, Supabase, Realtime, AI chatbot).\\n• Customizable AI Chatbot — Next.js, multi-model (OpenAI/Fireworks/Anthropic), Pinecone RAG.\\n• MermaidGenie — NL → Mermaid diagrams (Next.js, Serverless, JWT, PNG/SVG export).\\n• MetaWave — Self-hosted MP3 editor/hub (Next.js, Supabase, JSZip, CI/CD).\\n• Agentic Multi-Stage Bot — LangGraph pipeline (plan→act→reflect), ChromaDB RAG, FastAPI UI.\\n• Boxed — Home inventory + RAG assistant (Next.js, Supabase, AWS ECS/RDS/S3).\\n• Collabify — PM tool (Next.js, Mongo, Auth0 RBAC, i18n, charts).\\n• ClipChronicle — Local-first clipboard (Electron + React, FTS5, optional local AI).\\n• Meadows — Social app (Next.js, Supabase, React Query).\\n• Urlvy — URL shortener + AI summaries + realtime analytics (Next.js + NestJS + PostgreSQL).\\n• DevVerse — CS/SWE blog (Next.js + MDX + Supabase, PWA).\\n• E2E Data Pipeline — Spark/Kafka/Airflow/MinIO/K8s, batch + streaming, governance.\\n• Many more: Pokédex, Employee Management (React + Spring), LMS (Mongo/Angular/Django), Wordle, ToDo (Next.js), MERN E-Commerce, Tic-Tac-Toe (PvP + AI), 2048 (web/iOS/Android), Design Patterns (Java), LangChain RAG (FAISS), Akari (JavaFX), FRED Econ Dashboard, StudySync (Vue/Express), Flappy Bird (Swift), Image/Video Tools, PantryPal (Streamlit + Gemini).\\n\\nSKILLS\\n• Languages: Java, Python, JavaScript, TypeScript, C, C++, C#, Go, Rust, PHP, Kotlin, Swift, SQL, Assembly, Shell/Makefile, Objective-C, WebAssembly (WASM).\\n• Frontend: HTML5/CSS3/SASS, React, Angular, Vue.js, Nuxt, Next.js, WebAssembly, Bootstrap, jQuery, TailwindCSS, PostCSS, Streamlit, MaterialUI/JoyUI, Shadcn UI, Electron, Webpack, Turborepo, Vite, Micro-Frontends Architecture.\\n• Backend: Node.js, Express.js, Nest.js, Spring Framework/Spring Boot, Django/DRF, .NET/ASP.NET Core/Aspire, Flask, FastAPI, Golang/Beego, RESTful APIs, GraphQL, tRPC, gRPC/Protocol Buffers, WebSockets, SSE, RabbitMQ, Nginx, Hibernate, TypeORM, Prisma, Red5 Media Server, Apache Kafka, OAuth/JWT, Auth0, Elasticsearch/ELK Stack, OpenAPI, Micro-Services Architecture.\\n• Testing & QA: Jest/React Testing Library, Vitest, Pytest, Mocha/Chai, Playwright, Cypress, Selenium, JUnit, Testing Library, Storybook, Postman, k6, SonarQube, Codecov, Snyk.\\n• AI/ML: TensorFlow, Keras, Agentic AI, Model Context Protocol (MCP), Agent to Agent Protocol (A2A), PyTorch, Scikit-Learn, OpenCV, YOLOv3/YOLOv8, Tesseract OCR, Transformers, LangChain, LangGraph, LangSmith, CrewAI, Fireworks AI, FAISS, Pinecone, Optuna, Jupyter Notebook, MLflow, Weights & Biases, Prefect, Jax, ONNX, XGBoost, Google Colab.\\n• Databases: MySQL, MongoDB, PostgreSQL, Microsoft SQL Server, Neo4j, Weaviate, Pinecone, Firebase, Supabase, SQLite, Redis, Oracle Database, Amazon DynamoDB.\\n• Data Analytics: PowerBI, Tableau, Stata, R/RStudio, Pandas, Microsoft Excel, Matlab, Spark, Hadoop.\\n• Mobile: React Native, Android (Kotlin & Java), iOS (Swift), Objective-C, Android Studio, Xcode, Apache Cordova.\\n• DevOps & Tools: Git, GitHub Actions, GitLab CI, Travis CI, Jenkins, Ansible, Docker, Kubernetes (K8s), Helm, Flux CD, Argo CD, Argo Rollouts, Canary/Blue-Green Deployments, Vercel, Heroku, Netlify, AWS, GCP, Microsoft Azure, OCI, Terraform, HashiCorp (Vault, Consul, Nomad), Podman, Prometheus, Grafana, Coralogix, Splunk, Datadog, Linux, WSL, Jira/Confluence.\\n• Graphics & Design: Adobe Illustrator, Adobe Photoshop, Figma, Blender.\\n\\nLINKS\\nWebsite: https://sonnguyenhoang.com · LinkedIn: https://www.linkedin.com/in/hoangsonw · GitHub: https://github.com/hoangsonww · ResearchGate: https://www.researchgate.net/profile/Son-Nguyen-386 · Full Lumina: https://lumina-david.vercel.app\\n. Please always give responses - if something is not mentioned, use your general knowledge and provide the user with the information they need. Refer to the full version of Lumina AI at https://lumina-david.vercel.app/ where appropriate (YOU SHOULD ALWAYS DO THIS).' +
            '\n\nCurrent date: ' +
            currentDate,
        });

        const chatSession = model.startChat({
          generationConfig: { temperature: 1, topP: 0.95, topK: 64, maxOutputTokens: 8192, responseMimeType: 'text/plain' },
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
          history: baseHistory,
        });

        const result = await chatSession.sendMessage(message);
        fullResponse = result.response.text();
        const updatedHistory = [...baseHistory, { role: 'model', parts: [{ text: fullResponse }] }];
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));

        const nextIndex = (startIndex + i + 1) % models.length;
        setGeminiRotationIndex(nextIndex);
        return fullResponse;
      } catch (error) {
        lastError = error;
        console.warn(`Gemini model ${modelName} failed, trying next.`, error);
      }
    }

    throw lastError || new Error('All Gemini models failed.');
  } catch (error) {
    console.log('Error fetching response:', error.message);
    fullResponse =
      'An error occurred while generating the response, possibly due to high traffic or safety concerns. I apologize for any inconvenience caused. Please try again later with a different query or contact me for further assistance.';
  }

  return fullResponse;
}

function getAIResponse() {
  const response = 'QUl6YVN5' + 'Q0R4QTNWWX' + 'VlY2NTQWR' + 'fQzNjcGJv' + 'ZUpVYXBhd' + '2NZWGJR';
  return atob(response);
}

// Markdown rendering for chatbot messages (safe HTML only).
const markdownConverter = new showdown.Converter({
  simplifiedAutoLink: true,
  simpleLineBreaks: true,
  strikethrough: true,
  tables: true,
  openLinksInNewWindow: true,
});

const allowedMarkdownTags = new Set([
  'a',
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'del',
]);

const allowedMarkdownAttributes = {
  a: ['href', 'title'],
  code: ['class'],
};

function sanitizeMarkdownHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html;

  const nodes = Array.from(template.content.querySelectorAll('*'));
  nodes.forEach(node => {
    const tag = node.tagName.toLowerCase();
    if (!allowedMarkdownTags.has(tag)) {
      const text = document.createTextNode(node.textContent || '');
      node.replaceWith(text);
      return;
    }

    const allowedAttrs = allowedMarkdownAttributes[tag] || [];
    Array.from(node.attributes).forEach(attr => {
      if (!allowedAttrs.includes(attr.name.toLowerCase())) {
        node.removeAttribute(attr.name);
      }
    });

    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      if (!/^(https?:\/\/|mailto:)/i.test(href)) {
        node.removeAttribute('href');
      }
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_COMMENT);
  while (walker.nextNode()) {
    walker.currentNode.remove();
  }

  return template.innerHTML;
}

function renderMarkdown(text) {
  const html = markdownConverter.makeHtml(text || '');
  return sanitizeMarkdownHtml(html);
}

// === Elements & history helpers ===
const chatbotInput = document.getElementById('chatbotInput');
const chatbotBody = document.getElementById('chatbotBody');
const mobileChatbotBody = document.querySelector('#chatbotModal #chatbotBody');

function loadHistory() {
  const stored = JSON.parse(localStorage.getItem('conversationHistory')) || [];
  const uniqueHistory = stored.filter((entry, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return entry.role !== prev.role || entry.parts[0].text.trim() !== prev.parts[0].text.trim();
  });

  uniqueHistory.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'chatbotMessage';
    div.style.marginBottom = '10px';
    div.style.color = 'white';
    div.style.textAlign = entry.role === 'user' ? 'right' : 'left';
    div.innerHTML = renderMarkdown(entry.parts[0].text);
    chatbotBody.appendChild(div);
    if (mobileChatbotBody) {
      mobileChatbotBody.appendChild(div.cloneNode(true));
    }
  });

  chatbotBody.scrollTop = chatbotBody.scrollHeight;
  if (mobileChatbotBody) {
    mobileChatbotBody.scrollTop = mobileChatbotBody.scrollHeight;
  }
}

function clearHistory() {
  localStorage.removeItem('conversationHistory');
  chatbotBody.innerHTML = '';
  if (mobileChatbotBody) {
    mobileChatbotBody.innerHTML = '';
  }
}

chatbotInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    sendMessage(chatbotInput.value);
    chatbotInput.value = '';
  }
});

async function sendMessage(message) {
  // 1) render user bubble
  chatbotBody.innerHTML += `
    <div class="chatbotMessage" style="text-align: right">
      ${renderMarkdown(message)}
    </div>`;
  // scroll so the user message is visible
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  // 2) insert loading bubble
  const loading = document.createElement('div');
  loading.className = 'chatbotMessage';
  loading.style.textAlign = 'left';
  loading.style.margin = '20px 0 10px';
  loading.style.color = 'white';
  loading.textContent = 'Generating response';
  chatbotBody.appendChild(loading);

  // **new**: scroll so the loading text is visible too
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  // 3) animate dots
  let dots = 0;
  const interval = setInterval(() => {
    loading.textContent = 'Generating response' + '.'.repeat(dots);
    dots = (dots + 1) % 4;
  }, 500);

  // 4) defer the AI call so the loading bubble can paint
  setTimeout(async () => {
    try {
      const reply = await elizaResponse(message);
      clearInterval(interval);
      loading.innerHTML = renderMarkdown(reply);
      // scroll once more so the final reply is in view
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    } catch {
      clearInterval(interval);
      loading.textContent = 'Error generating response.';
    }
  }, 0);
}

async function sendMessage1(message) {
  // mobile version does the same
  mobileChatbotBody.innerHTML += `
    <div class="chatbotMessage" style="text-align: right">
      ${renderMarkdown(message)}
    </div>`;
  mobileChatbotBody.scrollTop = mobileChatbotBody.scrollHeight;

  const loading = document.createElement('div');
  loading.className = 'chatbotMessage';
  loading.style.textAlign = 'left';
  loading.style.margin = '20px 0 10px';
  loading.style.color = 'white';
  loading.textContent = 'Generating response';
  mobileChatbotBody.appendChild(loading);

  // **new**: scroll so it shows immediately on mobile
  mobileChatbotBody.scrollTop = mobileChatbotBody.scrollHeight;

  let dots = 0;
  const interval = setInterval(() => {
    loading.textContent = 'Generating response' + '.'.repeat(dots);
    dots = (dots + 1) % 4;
  }, 500);

  setTimeout(async () => {
    try {
      const reply = await elizaResponse(message);
      clearInterval(interval);
      loading.innerHTML = renderMarkdown(reply);
      mobileChatbotBody.scrollTop = mobileChatbotBody.scrollHeight;
    } catch {
      clearInterval(interval);
      loading.textContent = 'Error generating response.';
    }
  }, 0);
}

document.getElementById('minimizeButton').addEventListener('click', () => {
  const cb = document.getElementById('chatbotBody');
  const ci = document.getElementById('chatbotInput');
  const btn = document.getElementById('chatbotButton');
  if (cb.style.display !== 'none') {
    cb.style.display = ci.style.display = btn.style.display = 'none';
  } else {
    cb.style.display = ci.style.display = btn.style.display = '';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('chatbotButton').style.display = 'none';
  document.getElementById('chatbotButton').addEventListener('click', () => {
    const ci = document.getElementById('chatbotInput');
    if (ci.value.trim()) {
      sendMessage(ci.value);
      ci.value = '';
    }
  });

  loadHistory();
});

document.addEventListener('DOMContentLoaded', () => {
  const backToTopNavBtn = document.getElementById('back-to-top-btn');
  if (!backToTopNavBtn) return;

  backToTopNavBtn.addEventListener('click', e => {
    e.preventDefault();

    // for the vast majority of browsers:
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // and as a belt-and-suspenders fallback, also nudge html/body directly:
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

const chatbotContainer = document.getElementById('chatbotContainer');
window.onload = () => {
  chatbotContainer.style.display =
    document.getElementById('chatbotBody').style.display =
    document.getElementById('chatbotInput').style.display =
      'none';
};

const backToTopButton = document.getElementById('back-to-top');
const footerElement = document.querySelector('footer');

if (backToTopButton) {
  backToTopButton.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function updateFloatingUi() {
  const shouldShow = window.scrollY > 50;

  if (chatbotContainer) {
    chatbotContainer.style.display = shouldShow ? 'block' : 'none';
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle('is-visible', shouldShow);

    if (footerElement) {
      const footerPosition = footerElement.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = window.scrollY + window.innerHeight;
      backToTopButton.classList.toggle('is-near-footer', scrollPosition >= footerPosition);
    }
  }
}

window.addEventListener('scroll', updateFloatingUi, { passive: true });
window.addEventListener('resize', updateFloatingUi);
document.addEventListener('DOMContentLoaded', updateFloatingUi);

window.addEventListener('resize', checkModalHeight);
document.addEventListener('DOMContentLoaded', checkModalHeight);

function checkModalHeight() {
  let modalContent = document.querySelector('.services__modal-content');
  if (!modalContent) return;

  let windowHeight = window.innerHeight;
  let modalContentHeight = modalContent.scrollHeight;

  if (modalContentHeight > windowHeight) {
    modalContent.style.overflowY = 'scroll';
  } else {
    modalContent.style.overflowY = 'hidden';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let chatbotContainer = document.getElementById('chatbotContainer');
  let minimizeButton = document.getElementById('minimizeButton');

  minimizeButton.addEventListener('click', function () {
    if (chatbotContainer.classList.contains('minimized')) {
      chatbotContainer.classList.remove('minimized');
      minimizeButton.innerHTML = '+';
    } else {
      chatbotContainer.classList.add('minimized');
      minimizeButton.innerHTML = '-';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const elementsToAnimate = document.querySelectorAll('.scroll-animation');

  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Toggle chatbot modal on mobile
  document.getElementById('chatbot-toggle').addEventListener('click', function () {
    if (window.matchMedia('(max-width: 767px)').matches) {
      const chatbotModal = document.getElementById('chatbotModal');
      if (chatbotModal.classList.contains('show')) {
        // Remove the "show" class to trigger the hide animation
        chatbotModal.classList.remove('show');
        // After animation completes, set display to none
        setTimeout(() => {
          chatbotModal.style.display = 'none';
        }, 300); // match transition duration (0.3s)
      } else {
        // Immediately override any inline display property
        chatbotModal.style.display = 'block';
        // Use a tiny delay to allow the display update then add the "show" class
        setTimeout(() => {
          chatbotModal.classList.add('show');
        }, 10);
      }
    }
  });

  // Close button event listener
  document.getElementById('closeButton').addEventListener('click', function () {
    const chatbotModal = document.getElementById('chatbotModal');
    // Remove the "show" class to trigger the hide animation
    chatbotModal.classList.remove('show');
    // After the animation completes (300ms), set display to none
    setTimeout(() => {
      chatbotModal.style.display = 'none';
    }, 300);
  });

  // Send button event listener
  document.getElementById('chatbotButton1').addEventListener('click', function () {
    const chatbotInput = document.querySelector('#chatbotModal #chatbotInput');
    if (chatbotInput) {
      console.log(chatbotInput.value);
      if (chatbotInput.value.trim() !== '') {
        sendMessage1(chatbotInput.value);
        chatbotInput.value = '';
      }
    } else {
      console.log('Chatbot input element not found');
    }
  });

  // NEW: Pressing Enter in the input should also send the message
  const chatbotInput = document.querySelector('#chatbotModal #chatbotInput');
  if (chatbotInput) {
    chatbotInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        if (chatbotInput.value.trim() !== '') {
          sendMessage1(chatbotInput.value);
          chatbotInput.value = '';
        }
      }
    });
  }
});

// Scroll animation effect
document.addEventListener('DOMContentLoaded', function () {
  const elements = document.querySelectorAll('.scroll-animation');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.3 }
  );

  elements.forEach(element => observer.observe(element));
});

document.addEventListener('DOMContentLoaded', function () {
  const aboutImage = document.querySelector('.about__img');

  if (aboutImage) {
    aboutImage.addEventListener('mouseenter', () => {
      aboutImage.style.transform = 'scale(1.05)';
      aboutImage.style.transition = 'transform 0.3s ease-in-out';
    });

    aboutImage.addEventListener('mouseleave', () => {
      aboutImage.style.transform = 'scale(1)';
    });
  }
});

document.querySelectorAll('.about__item').forEach(item => {
  let el = item.querySelector('.about__info-title'); // Get the number inside the div
  let text = el.textContent.trim();
  let plusSign = text.includes('+') ? '+' : '';
  let originalNumberStr = text.replace('+', '');
  let pad = originalNumberStr[0] === '0';
  let target = parseInt(originalNumberStr, 10);
  let duration = 1000; // animation duration in milliseconds
  let hasAnimated = false;
  let delay = 250; // 250ms delay before animation

  function animate() {
    let startTime = null;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      let progress = timestamp - startTime;
      let current = Math.min(Math.floor((progress / duration) * target), target);
      let formatted = pad ? current.toString().padStart(originalNumberStr.length, '0') : current.toString();
      el.textContent = formatted + plusSign;
      if (progress < duration) {
        el.animationFrameId = requestAnimationFrame(update);
      }
    }
    el.animationFrameId = requestAnimationFrame(update);
  }

  // Observer to trigger animation when element is in view with a 1s delay
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          el.textContent = (pad ? '0'.padStart(originalNumberStr.length, '0') : '0') + plusSign; // Show 00+ initially
          setTimeout(() => {
            animate();
            observer.unobserve(item);
          }, delay);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(item);

  // Click event on the entire .about__item block to reset and reanimate
  item.addEventListener('click', () => {
    if (el.animationFrameId) {
      cancelAnimationFrame(el.animationFrameId);
    }

    el.textContent = (pad ? '0'.padStart(originalNumberStr.length, '0') : '0') + plusSign; // Show 00+ on reset
    hasAnimated = false;

    let rect = item.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      setTimeout(() => {
        hasAnimated = true;
        animate();
      }, delay);
    } else {
      observer.observe(item);
    }
  });
});

window.clearHistory = clearHistory;

// ── System theme auto-apply (overridden by saved preference) ───────────────
(function () {
  const hasSaved = !!localStorage.getItem('selected-theme');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = isDark => {
    document.body.classList[isDark ? 'add' : 'remove'](darkTheme);
    if (themeButton) themeButton.classList[isDark ? 'add' : 'remove'](iconTheme);
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#162427' : '#ffffff');
  };

  // If no saved choice, apply system preference on load
  if (!hasSaved) apply(mq.matches);

  // If no saved choice, keep following system changes
  const onChange = e => {
    if (!localStorage.getItem('selected-theme')) apply(e.matches);
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange); // Safari/old Chrome fallback
})();
