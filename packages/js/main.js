import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

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

const ctx = document.getElementById('skillsChart').getContext('2d');
const skillsChart = new Chart(ctx, {
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

const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show-menu');
}

navLink.forEach(n => n.addEventListener('click', linkAction));

const skillsContent = document.querySelectorAll('.skills__content');
const skillsHeader = document.querySelectorAll('.skills__header');

function toggleSkills() {
  const itemClass = this.parentNode.classList.contains('skills__open');

  // Close all skill sections
  skillsContent.forEach(content => content.classList.remove('skills__open'));

  // Open the clicked section only if it was closed before
  if (!itemClass) {
    this.parentNode.classList.add('skills__open');

    // Smooth scroll to the newly opened section
    const offset = 100;
    const elementPosition = this.parentNode.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
  }
}

skillsHeader.forEach(header => {
  header.addEventListener('click', toggleSkills);
});

const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[data-content]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.target);
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('qualification__active');
    });
    target.classList.add('qualification__active');
    tabs.forEach(tab => {
      tab.classList.remove('qualification__active');
    });
    tab.classList.add('qualification__active');
  });
});

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

const portfolioPreviewData = getPortfolioPreviewData();

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
      const dataIndex = Math.min(index, projectData.length - 1);
      bullet.dataset.portfolioIndex = String(dataIndex);
      bullet.setAttribute('aria-label', `Preview ${projectData[dataIndex].title}`);
      bullet.setAttribute('title', projectData[dataIndex].title);
    });
  };

  updateBulletData();

  const observer = new MutationObserver(updateBulletData);
  observer.observe(paginationEl, { childList: true });

  const showFromBullet = bullet => {
    if (!bullet || !bullet.dataset.portfolioIndex) return;
    const project = projectData[Number(bullet.dataset.portfolioIndex)];
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

  document.addEventListener('mouseover', delegatedHover, true);
  document.addEventListener('focusin', delegatedHover, true);
  document.addEventListener('mouseleave', hidePreview, true);
  document.addEventListener('focusout', hidePreview, true);
  swiper.on('slideChange', hidePreview);
  window.addEventListener('resize', hidePreview);
  window.addEventListener('scroll', hidePreview, true);
}

document.addEventListener('DOMContentLoaded', scrollActive);
document.addEventListener('DOMContentLoaded', setupQualificationCardLinks);

const swiperPortfolio = new Swiper('.portfolio__container', {
  loop: true,
  loopAdditionalSlides: 3,
  slidesPerView: 1,
  spaceBetween: 3500,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  keyboard: true,
  threshold: 20,
  on: {
    init: function () {
      setTimeout(() => setupPortfolioBulletPreviews(this, portfolioPreviewData), 50);
    },
    paginationUpdate: function () {
      setTimeout(() => setupPortfolioBulletPreviews(this, portfolioPreviewData), 50);
    },
    reachBeginning: function () {
      this.loopDestroy();
      this.loopCreate();
    },
    reachEnd: function () {
      this.loopDestroy();
      this.loopCreate();
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
            'Instructions for you to answer all messages: Your name is Lumina, part of this Lumina AI app designed by Son (David) Nguyen to help answer any questions about him or any other questions users may have, created with Pinecone, RAG, and LLM/GenAI. Profile of Son Nguyen: Son (David) Nguyen - +1 (413) 437-6759 · hoangson091104@gmail.com · https://sonnguyenhoang.com, https://www.linkedin.com/in/hoangsonw · https://github.com/hoangsonww. Location: Chapel Hill, NC, USA 27514. You are an AI personal assistant for Son Nguyen, also known as David Nguyen or by full name Son Hoang Nguyen; when asked about yourself, state your title as \\"Lumina — AI personal assistant for Son (David) Nguyen.\\"\\n\\nBe accurate, clear, and helpful. If something isn’t known, say so or ask for more details. Prefer concise, structured answers with bullet points where useful. You can use your general knowledge for questions not covered here, but do not fabricate facts about Son or his work. When relevant, point users to Son’s website, LinkedIn, or GitHub. If users want a dedicated experience, refer them to the full Lumina at https://lumina-david.vercel.app/.\\n\\nRESUME SUMMARY\\nSon Nguyen is a results-driven software engineer with hands-on experience in large-scale, user-focused systems. He specializes in efficiency, scalability, AI, and full-stack development. He optimizes workflows, enhances performance, and delivers measurable impact.\\n\\nEDUCATION\\n• University of North Carolina at Chapel Hill (Expected Dec 2025): B.S. Computer Science; B.A. Economics; Data Science Minor. GPA: 3.92/4.0.\\n\\nLEADERSHIP & COMMUNITY\\n• Microsoft Learn Student Ambassador (Aug 2022 – Present).\\n• Project Manager & Team Lead, Google Developer Student Clubs @ UNC-CH (Aug 2023 – Present): contributed to 6 projects benefitting 350+ Chapel Hill residents.\\n\\nTEACHING\\n• UTA, COMP-426: Modern Web Programming (Full-stack), UNC-CH (Aug 2025 – Present) · On-site\\n  – Led weekly studios on TypeScript/React/Next.js, REST/GraphQL, auth, testing, and deployment.\\n  – Built grading templates, autograder rubrics, and CI baselines; reviewed code for accessibility, performance, and security.\\n  – Mentored capstone teams on Vercel/AWS deployments and WCAG-aligned UI.\\n• TA, COMP-126: Web Design & Development, UNC-CH (Jan 2025 – May 2025) · On-site\\n  – Supported 80+ students; 8+ office hours/week; +15% project quality; 200+ graded items with 100% on-time returns; improved assignment clarity (+10% engagement).\\n• ULA, COMP-210: Data Structures, UNC-CH (Aug 2024 – Dec 2024) · On-site\\n  – 15+ weekly office hours; review sessions; +20% exam performance; improved labs (+25% engagement).\\n\\nRESEARCH\\n• Undergraduate Research Assistant, AIMING Lab (UNC-CH) (Jan 2025 – Apr 2025) · Hybrid\\n  – Foundation models (LLMs, VLMs, diffusion) on large datasets; biomedicine LLMs (500k+ records).\\n  – Adversarial robustness (−20% error), diffusion efficiency (−35% compute).\\n  – RL for robotics (+50% navigation efficiency); RAG methods (+40% accuracy).\\n\\nINDUSTRY EXPERIENCE\\n• Software Engineering Intern, Toshiba TEC – Toshiba Global Commerce Solutions (Sep 2025 – Dec 2025) · Durham, NC · On-site\\n  – Built an internal agentic AI platform (multi-agent, Dockerized microservices, AWS, Jenkins) automating up to 95% of SDLC.\\n  – 12 agent workflows (Kafka, Redis, LangChain, LangGraph, Neo4j, Weaviate, RAG) improved task decomposition (+35%) and cut feature delivery time (−30%).\\n  – Vue-based UI with real-time monitoring/logging and knowledge-graph context sharing (+40% developer productivity).\\n• Software Engineer Intern, FRG | Financial Risk Group (Apr 2025 – Aug 2025) · Cary, NC · On-site\\n  – VOR platform: −20% Angular UI load, +15% Django API throughput.\\n  – RAG chatbot (FAISS, LangChain, LLaMA, NgRx, Kafka/Zookeeper); RLHF (+20% accuracy).\\n  – AI Logs Explainer (70% time saved); Performance Analyzer (100+ monthly recs, +25% query efficiency); Prophet forecasts (92% accuracy).\\n  – Event Predictor; sensitivity/impact visualizations; Ansible automation; Playwright E2E in CI/CD; WSL/Ubuntu.\\n• Web App Developer & Research Assistant, DHEP Lab (May 2025 – Aug 2025) · Remote\\n  – AugMed: React frontend; Flask API; PostgreSQL; AWS (ECR→ECS→ALB, RDS, S3); Celery+Redis; JWT + CORS; Terraform; Docker Compose; pytest/Jest/Cypress with GitHub Actions.\\n  – GIL-DHEP platform: Next.js (TS, Tailwind, shadcn) + Express/TypeORM backend for clinician-in-the-loop LLM refinement.\\n• Software Engineer Intern, Technical Consulting & Research, Inc. (Mar 2025 – Apr 2025) · Remote\\n  – React + Flask full-stack app; DB architecture (+30% perf); RBAC (Auth0), OAuth2/JWT; CSRF/XSS hardening; CI/CD + Terraform.\\n• Software Engineer Intern, FPT Software (Jun 2024 – Aug 2024) · HCMC, Vietnam · On-site\\n  – ICDP internal comms: 20+ backend APIs, 10+ frontend features (Express, Elasticsearch, Node, MongoDB, RabbitMQ, Kafka, Redis, React).\\n  – +20% UI engagement (Figma); encrypted messaging, document sharing, trivia, tasks (+25% collaboration).\\n  – AI fine-tuning (TensorFlow/PyTorch/Optuna, +15%); user-created chatbots (+30% engagement).\\n• Associate Software Engineer Intern, Huong Hua Co., Ltd. (Dec 2023 – Feb 2024) · Remote\\n  – Full-stack English site & jobs DB for 50k+ active users; 200–300 apps/month.\\n  – React, Django, PHP, MongoDB, PostgreSQL; AWS (EC2, RDS, DocumentDB, S3, ELB, API GW, Route 53); Docker; −20% infra cost.\\n• Software Engineering Intern, VNG Corporation (May 2023 – Aug 2023) · HCMC, Vietnam · On-site\\n  – vCloudcam frontend (React, Angular, Webpack, Tailwind, Micro-Frontends): +30% performance; 50k+ monthly visits.\\n  – Backend (Beego/Go, PostgreSQL, MongoDB): 5k+ concurrent streams, 10M monthly queries; 200ms → <120ms queries.\\n  – Kubernetes orchestration (−40% deployment effort, −25% downtime); WebAssembly + C++ streaming (+20% streaming, +30% site). Best Intern Award.\\n• Data Analytics Research Assistant, Case Western Reserve University (Dec 2022 – May 2023) · Cleveland, OH · On-site\\n  – 50+ simulations/visualizations (Excel, Tableau, SAS, Plotly, ggplot2); +30% processing efficiency; 5k+ secure data points (−25% errors); 10+ TB Spark/Hadoop; reviewed 20+ proposals (+40% quality).\\n\\nSELECTED PROJECTS (more on GitHub)\\n• EstateWise — AI-Powered Real Estate Assistant (Apr 2025 – Present)\\n  EstateWise is a full-stack real estate chatbot that delivers personalized property recommendations using agentic AI, RAG, kNN, MoE, and CoT. Designed for users in Chapel Hill, NC, it blends intelligent search with a smooth interface and secure user auth.\\n  Key Features:\\n  – UI/UX: Built with Next.js, React, Tailwind, and Shadcn. Supports both guest and authenticated modes with a polished and responsive chat experience.\\n  – Secure Auth & Convo Management: JWT-based login with MongoDB. Authenticated users can manage chat history; guest sessions persist via localStorage.\\n  – AI Recommendations (RAG + kNN): Embedded 30k+ Pinecone vectors via cosine similarity. Results are injected into chatbot context.\\n  – Real-Time k-Means Clustering: Property listings are normalized and clustered to uncover submarkets and provide structured insights.\\n  – Mixture-of-Experts: 5 specialized AI agents (e.g., Financial Advisor, Neighborhood Expert) generate responses with a Master Merger model.\\n  – Chain-of-Thought: Each expert uses CoT to break down complex queries into manageable steps, ensuring accurate and relevant responses.\\n  – Agentic AI Pipeline: Orchestrator coordinating LangGraph and CrewAI runtimes to manage specialized agents (analytics, graph, finance, property), with tool-use policies and retry/reflect loops.\\n  – Charts & Visualizations: Trends, distributions, and cluster breakdowns across the app.\\n  – Feedback-Driven Expert Weighting: Thumbs-up/down adjusts expert influence in real time for personalization.\\n  – Backend API & Monitoring: Express + TypeScript backend with Swagger, MongoDB, Pinecone, and Prometheus monitoring.\\n  – Python Notebook: Colab notebook for EDA, clustering, interactive maps, and a CLI chatbot.\\n  Links: GitHub (github.com/hoangsonww/EstateWise-Chapel-Hill-Chatbot) · Live (https://estatewise.vercel.app)\\n• MovieVerse — 1M+ movie DB; microservices; AI recommendations; 330k+ monthly users. Live: https://movie-verse.com\\n• AI-Powered Article Curator — Next.js + Express/Mongo + crawler (Axios/Cheerio/Puppeteer) + AI summaries.\\n• DocuThinker — AI doc analysis (React, Express, Firebase, Swagger, Docker).\\n• PetSwipe — Swipe-to-adopt (Next.js, PostgreSQL/TypeORM, AWS S3, Terraform, Swagger).\\n• SymptomSync — Health app (Next.js, Supabase, Realtime, AI chatbot).\\n• Customizable AI Chatbot — Next.js, multi-model (OpenAI/Fireworks/Anthropic), Pinecone RAG.\\n• MermaidGenie — NL → Mermaid diagrams (Next.js, Serverless, JWT, PNG/SVG export).\\n• MetaWave — Self-hosted MP3 editor/hub (Next.js, Supabase, JSZip, CI/CD).\\n• Agentic Multi-Stage Bot — LangGraph pipeline (plan→act→reflect), ChromaDB RAG, FastAPI UI.\\n• Boxed — Home inventory + RAG assistant (Next.js, Supabase, AWS ECS/RDS/S3).\\n• Collabify — PM tool (Next.js, Mongo, Auth0 RBAC, i18n, charts).\\n• ClipChronicle — Local-first clipboard (Electron + React, FTS5, optional local AI).\\n• Meadows — Social app (Next.js, Supabase, React Query).\\n• Urlvy — URL shortener + AI summaries + realtime analytics (Next.js + NestJS + PostgreSQL).\\n• DevVerse — CS/SWE blog (Next.js + MDX + Supabase, PWA).\\n• E2E Data Pipeline — Spark/Kafka/Airflow/MinIO/K8s, batch + streaming, governance.\\n• Many more: Pokédex, Employee Management (React + Spring), LMS (Mongo/Angular/Django), Wordle, ToDo (Next.js), MERN E-Commerce, Tic-Tac-Toe (PvP + AI), 2048 (web/iOS/Android), Design Patterns (Java), LangChain RAG (FAISS), Akari (JavaFX), FRED Econ Dashboard, StudySync (Vue/Express), Flappy Bird (Swift), Image/Video Tools, PantryPal (Streamlit + Gemini).\\n\\nSKILLS\\n• Languages: Java, Python, JavaScript, TypeScript, C, Go, PHP, Kotlin, Swift, SQL.\\n• Web/Backend: React, Next.js, Angular, Vue, Tailwind, shadcn/ui, Express, Flask, Django, Spring, NestJS, FastAPI, REST, GraphQL, gRPC, WebSockets, OAuth 2.0, JWT.\\n• AI/ML: TensorFlow, PyTorch, Keras, Transformers, Hugging Face, RAG, LangChain, LangGraph, CrewAI, RLHF, OpenCV, OCR (Tesseract), scikit-learn, MLflow, Feast.\\n• Data/Analytics: PowerBI, Tableau, Spark, Hadoop, SAS, R, Pandas; Recharts/Chart.js; Great Expectations; Pinecone/FAISS/ChromaDB.\\n• Databases: PostgreSQL, MySQL, MongoDB, Redis, SQLite, Neo4j, Weaviate, Elasticsearch.\\n• Cloud/DevOps: AWS (ECS, ECR, ALB, RDS, S3, CloudFront, Lambda, IAM, CloudWatch), Azure, GCP; Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions, Nginx, Prometheus/Grafana.\\n• Messaging/Streaming: Kafka, RabbitMQ, SSE.\\n• Testing/QA: Pytest, Jest, Cypress, Playwright, Mocha/Chai, JUnit/Mockito, Vitest; CI/CD pipelines.\\n• Mobile & Desktop: React Native, Android (Kotlin), iOS (Swift), Electron.\\n\\nLINKS\\nWebsite: https://sonnguyenhoang.com · LinkedIn: https://www.linkedin.com/in/hoangsonw · GitHub: https://github.com/hoangsonww · ResearchGate: https://www.researchgate.net/profile/Son-Nguyen-386 · Full Lumina: https://lumina-david.vercel.app\\n. Please always give responses - if something is not mentioned, use your general knowledge and provide the user with the information they need. Refer to the full version of Lumina AI at https://lumina-david.vercel.app/ where appropriate (YOU SHOULD ALWAYS DO THIS).',
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
backToTopButton.addEventListener('click', () => {
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    chatbotContainer.style.display = 'block';
    backToTopButton.style.bottom = '10px';
  } else {
    chatbotContainer.style.display = 'none';
    backToTopButton.style.bottom = '-20%';
  }
});

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

document.addEventListener('scroll', function () {
  let scrollUpButton = document.getElementById('back-to-top');
  let footer = document.querySelector('footer');

  let footerPosition = footer.getBoundingClientRect().top + window.scrollY;
  let scrollPosition = window.scrollY + window.innerHeight;

  if (scrollPosition >= footerPosition) {
    scrollUpButton.style.color = 'white';
  } else {
    scrollUpButton.style.color = '';
  }
});

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
