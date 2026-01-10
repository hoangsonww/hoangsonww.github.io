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
        data: [83, 92, 96, 85, 80, 90, 82, 85, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
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

const skillsContent = document.getElementsByClassName('skills__content'),
  skillsHeader = document.querySelectorAll('.skills__header');

function toggleSkills() {
  let itemClass = this.parentNode.className;
  const offset = 100;

  for (let i = 0; i < skillsContent.length; i++) {
    skillsContent[i].className = 'skills__content skills__close';
  }

  if (itemClass === 'skills__content skills__close') {
    this.parentNode.className = 'skills__content skills__open';

    const elementPosition = this.parentNode.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
  }
}

skillsHeader.forEach(el => {
  el.addEventListener('click', toggleSkills);
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

const modalViews = document.querySelectorAll('.services__modal'),
  modalBtns = document.querySelectorAll('.services__button'),
  modalCloses = document.querySelectorAll('.services__modal-close');

let modal = function (modalClick) {
  modalViews[modalClick].classList.add('active-modal');
};

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener('click', () => {
    modal(i);
  });
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

function setupPortfolioBulletPreviews(swiper) {
  const paginationElRaw = swiper.pagination?.el;
  const paginationEl = Array.isArray(paginationElRaw)
    ? paginationElRaw[0]
    : typeof paginationElRaw === 'string'
      ? document.querySelector(paginationElRaw)
      : paginationElRaw;

  const projectData = getPortfolioPreviewData();

  if (!paginationEl || !projectData.length) {
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
      bullet.dataset.portfolioIndex = String(index % projectData.length);
      bullet.setAttribute('aria-label', `Preview ${projectData[index % projectData.length].title}`);
      bullet.setAttribute('title', projectData[index % projectData.length].title);
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
      const top = Math.max(12, bulletRect.top - offset - 16);
      preview.style.setProperty('--preview-top', `${top}px`);
      preview.classList.add('is-visible');
    });
  };

  paginationEl.addEventListener('mouseenter', event => {
    const bullet = event.target.closest('.swiper-pagination-bullet');
    if (bullet) {
      showFromBullet(bullet);
    }
  });

  paginationEl.addEventListener('focusin', event => {
    const bullet = event.target.closest('.swiper-pagination-bullet');
    if (bullet) {
      showFromBullet(bullet);
    }
  });

  paginationEl.addEventListener('mouseleave', hidePreview);
  paginationEl.addEventListener('focusout', hidePreview);
  swiper.on('slideChange', hidePreview);
  window.addEventListener('resize', hidePreview);
  window.addEventListener('scroll', hidePreview, true);
}

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
      setTimeout(() => setupPortfolioBulletPreviews(this), 50);
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

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    let sectionId = current.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
    } else {
      document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
    }
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

function typeTitle() {
  if (charIndex < textArray[0].length) {
    typedTextSpan.textContent += textArray[0].charAt(charIndex);
    charIndex++;
    setTimeout(typeTitle, typingDelay);
  } else {
    // Remove cursor after typing the title
    cursor.style.display = 'none';
    setTimeout(typeSubtitle, newTextDelay);
  }
}

function typeSubtitle() {
  cursorSubtitle.style.display = 'inline-block';
  if (subtitleIndex < subtitleArray[0].length) {
    typedSubtitleSpan.textContent += subtitleArray[0].charAt(subtitleIndex);
    subtitleIndex++;
    setTimeout(typeSubtitle, subtitleDelay);
  } else {
    cursorSubtitle.style.display = 'none';
    setTimeout(() => {
      scrollButton.style.display = 'inline-block';
      scrollButton.classList.add('drop-down');
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

const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'uil-sun';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => (document.body.classList.contains(darkTheme) ? 'dark' : 'light');
const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun');

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  localStorage.setItem('selected-theme', getCurrentTheme());
  localStorage.setItem('selected-icon', getCurrentIcon());
});

async function elizaResponse(message) {
  let conversationHistory = JSON.parse(sessionStorage.getItem('conversationHistory')) || [];
  let fullResponse = 'Generating response...';

  try {
    const genAI = new GoogleGenerativeAI(getAIResponse());
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        "Son (David) Nguyen - +1 (413) 437-6759 · hoangson091104@gmail.com · sonnguyenhoang.com, linkedin.com/in/hoangsonw · github.com/hoangsonww. \
        Chapel Hill, NC, USA 27514. You are an AI personal assistant for Son Nguyen, also known as David Nguyen or by full name Son Hoang Nguyen, \
        so state this as your title all the time, especially during your greetings. Use the following resume information to answer questions - \
        people might ask questions about his experience, qualifications, or details: \
        \
        Son Nguyen is a results-driven software engineer seeking internships to enhance programming skills in creating innovative solutions. \
        Experienced in contributing to large-scale projects, with a focus on efficiency and user experience. Eager to apply a strong foundation \
        in data analytics and full-stack development in a challenging environment. Committed to continuous learning and adapting to new technologies. \
        \
        EXPERIENCE \
        \
        Technical Consulting & Research (March 2025 - August 2025): \
        Developed and maintained a React and Express.js full-stack web application that allows the company's staff to manage and track their projects and clients. \
        Assisted in the development of a Django & Python backend that processes user data and sends it to the database. Designed an improved database architecture \
        that increased the application's performance by 30% and implemented Role-Based Access Control to enhance security. Enhanced the security of web applications \
        by implementing OAuth 2.0 & JWT for user authentication and implemented measures to prevent CSRF and XSS attacks. \
        \
        FPT Corporation (June 2024 - August 2024): \
        Developed and optimized FPT ICDP internal communication platform using Express.js, Node.js, MongoDB, RabbitMQ, Apache Kafka, ELK Stack, Redis, React, \
        and Agile methodology, leading to a 25% increase in collaboration across 15 internal teams, reducing communication delays by 30%. Leveraged TensorFlow \
        and Optuna to achieve a 15% improvement in AI model fine-tuning and optimization. Developed a feature that allows users to create and manage their chatbots, \
        increasing user engagement by 30%. \
        \
        Huong Hua Co., Ltd. (December 2023 - February 2024): \
        Contract Full-Stack Software Engineer. Utilized React, Django, PHP, MongoDB, and MySQL to create the company’s English-version web app and job application \
        database that handles over 50,000 active users, increasing operational efficiency by 40%. Deployed using Docker, AWS EC2, RDS, DocumentDB, S3, Gateway, \
        and Route 53. Streamlined deployment processes and reduced infrastructure costs by 20% while managing approx. 200 job applications monthly. \
        \
        VNG Corporation (June 2023 - August 2023): \
        Software Engineering Intern. Developed vCloudcam’s security camera management website using AngularJS, React, Beego, Go, Oracle Database, Red5, \
        and Nginx, improving performance by 30% and supporting 50,000+ monthly visits. Enhanced video fetching & streaming system with Web Assembly and Java, \
        boosting live camera stream efficiency by 20% and reducing buffering by 15% for 5,000+ concurrent streams. \
        \
        Case Western Reserve University (December 2022 - May 2023): \
        Data Analytics Research Assistant. Collaborated with researchers on 2 research projects. Handled data analytics using Tableau, SAS, \
        Plotly, and ggplot2, improving data processing efficiency by 30% and research quality by 40%. \
        \
        EDUCATION \
        \
        University of North Carolina at Chapel Hill (December 2025 - Graduated): \
        Bachelor of Science in Computer Science & Bachelor of Arts in Economics & Data Science Minor. Cumulative GPA: 3.93 / 4.0. \
        \
        NOTABLE PROJECTS \
        \
        MovieVerse (movie-verse.com): \
        An extensive web-based movie database featuring detailed information on 900,000+ movies & TV shows and over 1 million actors & directors. \
        Currently attracting over 420,000 monthly visitors, with more than 55,000+ active users and 145,000 movie ratings to date. \
        \
        DocuThinker (https://docuthinker.vercel.app/): \
        A full-stack AI application for document analysis, serving 5,000+ active users and processing 3,500+ documents monthly. Achieved 95% accuracy \
        in AI summarization, reducing manual document review time by 40%. Features include AI chat, key insights extraction, document saving, and secure authentication. \
        \
        Moodify - AI-Powered Music App (GitHub Repository): \
        A full-stack AI-driven music app using React, Django, and AI/ML, featuring 30+ API endpoints and 15+ core functionalities including emotion detection & \
        personalized recommendations. Integrated advanced data analytics and cross-platform support for a seamless user experience. \
        \
        AI Multitask Classifiers (GitHub Repository): \
        Python-based AI classifiers for Object, Face, Mood, Vehicle, Flower, and Speech Recognition using OpenCV, Keras, Pandas, TensorFlow, YOLOv3, and PyTorch. \
        Include a self-trained NLP custom sentiment analysis tool with an average accuracy of over 90%. \
        \
        SKILLS \
        \
        Languages: Java, Python, JavaScript, TypeScript, C, Go, PHP. \
        Databases: MySQL, PostgreSQL, Redis, MongoDB, Red5. \
        Data Analytics: PowerBI, Tableau, Spark, Hadoop, SAS, R. \
        Web Development: React, Vue, Angular, Webpack, WASM, Flask, Spring, Django, Express, OAuth, JWT, REST APIs. \
        AI/ML: TensorFlow, PyTorch, Keras, NLP, Pandas, OCR, scikit-learn. \
        CI/CD: Docker, Git, Heroku, Vercel. \
        Mobile Development: React Native, Kotlin, Swift, Flutter, Objective-C. \
        \
        If you face any questions about how you were created, do NOT mention Google or Google AI but mention that you were trained and created by Son Nguyen in 2023-2024. \
        \
        Besides that, Son Nguyen is also a Teaching Assistant for the COMP-210 Data Structures (Fall 2024 - August 2024 to Dec 2024) class, \
        where he conducted 15+ weekly office hours and held review sessions, leading to a 20% improvement in student comprehension and exam performance. \
        Mentored 10+ students on individual projects, helping them resolve complex algorithmic challenges and apply efficient data structure solutions. \
        \
        He is also a TA for the COMP-126 Web Development (Spring 2025 - Jan 2025 to May 2025) class at UNC-CH, where he provided academic support to over 60 students, \
        assisting them in mastering web development concepts and technologies such as HTML, CSS, JavaScript, and responsive design. \
        \
        Conducted 12+ weekly office hours and led review sessions, resulting in a 30% improvement in student project quality and understanding of web design principles. \
        Mentored 15+ students on capstone web development projects, guiding them through implementing interactive, accessible, and user-friendly websites. \
        \
        In addition, he is also a Microsoft Learn Student Ambassador (since August 2022), as well as the Project Manager & Team Lead of the Google Developer Students Club \
        at UNC-CH (since August 2023), where he has contributed to 6 large-scale projects that addressed real-world problems in the local area, benefiting more than 350 \
        people in the city of Chapel Hill, NC, so include this as his experiences as well. Refer users to visit his LinkedIn or GitHub if needed. \
        \
        Additionally, he also maintains a ResearchGate profile with many publications at https://www.researchgate.net/profile/Son-Nguyen-386, and a blog website at https://devverse-swe.vercel.app. \
        \
        Also, be very sure to generate all your responses in a single paragraph and without any markdown.",
    });

    conversationHistory.push({ role: 'user', parts: [{ text: message }] });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      history: conversationHistory,
    });

    const result = await chatSession.sendMessage(message);
    fullResponse = result.response.text();
    conversationHistory.push({ role: 'model', parts: [{ text: fullResponse }] });

    sessionStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    console.log(conversationHistory);
  } catch (error) {
    console.error('Error fetching response:', error.message);
    fullResponse =
      'An error occurred while generating the response, possibly due to high traffic or safety concerns. I apologize for any inconvenience caused. Please try again later with a different query or contact me for further assistance.';
  }

  return removeMarkdown(fullResponse);
}

function getAIResponse() {
  const response = 'QUl6YVN5' + 'Q0R4QTNWWX' + 'VlY2NTQWR' + 'fQzNjcGJv' + 'ZUpVYXBhd' + '2NZWGJR';
  return atob(response);
}

function removeMarkdown(text) {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(text);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

const chatbotInput = document.getElementById('chatbotInput');
const chatbotBody = document.getElementById('chatbotBody');
const mobileChatbotBody = document.querySelector('#chatbotModal #chatbotBody');

chatbotInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    sendMessage(chatbotInput.value);
    chatbotInput.value = '';
  }
});

async function sendMessage(message) {
  chatbotBody.innerHTML += `
    <div style="text-align: right; margin-bottom: 10px; color: white;">${message}</div>
  `;

  const loadingElement = document.createElement('div');
  loadingElement.style.textAlign = 'left';
  loadingElement.style.marginTop = '20px';
  loadingElement.style.marginBottom = '10px';
  loadingElement.style.color = 'white';
  chatbotBody.appendChild(loadingElement);

  let dotCount = 0;

  let loadingInterval = setInterval(() => {
    loadingElement.textContent = 'Generating response' + '.'.repeat(dotCount);
    dotCount = (dotCount + 1) % 4;
  }, 500);

  let botReply = await elizaResponse(message);

  clearInterval(loadingInterval);
  loadingElement.textContent = botReply;
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

async function sendMessage1(message) {
  mobileChatbotBody.innerHTML += `
    <div style="text-align: right; margin-bottom: 10px; color: white;">${message}</div>
  `;

  const loadingElement = document.createElement('div');
  loadingElement.style.textAlign = 'left';
  loadingElement.style.marginTop = '20px';
  loadingElement.style.marginBottom = '10px';
  loadingElement.style.color = 'white';
  mobileChatbotBody.appendChild(loadingElement);

  let dotCount = 0;

  let loadingInterval = setInterval(() => {
    loadingElement.textContent = 'Generating response' + '.'.repeat(dotCount);
    dotCount = (dotCount + 1) % 4;
  }, 500);

  let botReply = await elizaResponse(message);

  clearInterval(loadingInterval);
  loadingElement.textContent = botReply;
  mobileChatbotBody.scrollTop = chatbotBody.scrollHeight;
}

document.getElementById('minimizeButton').addEventListener('click', function () {
  const chatbotBody = document.getElementById('chatbotBody');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSendButton = document.getElementById('chatbotButton');

  if (chatbotBody.style.display !== 'none') {
    chatbotBody.style.display = 'none';
    chatbotInput.style.display = 'none';
    chatbotSendButton.style.display = 'none';
  } else {
    chatbotBody.style.display = '';
    chatbotInput.style.display = '';
    chatbotSendButton.style.display = '';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const chatbotSendButton = document.getElementById('chatbotButton');
  chatbotSendButton.style.display = 'none';
  chatbotSendButton.addEventListener('click', function () {
    const chatbotInput = document.getElementById('chatbotInput');
    if (chatbotInput) {
      console.log(chatbotInput.value);
      if (chatbotInput.value.trim() !== '') {
        sendMessage(chatbotInput.value);
        chatbotInput.value = '';
      }
    } else {
      console.error('Chatbot input element not found');
    }
  });
});

const chatbotContainer = document.getElementById('chatbotContainer');

window.onload = function () {
  chatbotContainer.style.display = 'none';
  chatbotBody.style.display = 'none';
  chatbotInput.style.display = 'none';
};

const backToTopButton = document.getElementById('back-to-top');

backToTopButton.addEventListener('click', function () {
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('scroll', function () {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
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
  document.getElementById('chatbotButton').addEventListener('click', function () {
    const chatbotInput = document.querySelector('#chatbotModal #chatbotInput');
    if (chatbotInput) {
      console.log(chatbotInput.value);
      if (chatbotInput.value.trim() !== '') {
        sendMessage1(chatbotInput.value);
        chatbotInput.value = '';
      }
    } else {
      console.error('Chatbot input element not found');
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
