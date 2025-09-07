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
        label: 'Skill Level (%) - Experience and Proficiency',
        data: [83, 92, 96, 85, 80, 90, 75, 85, 78],
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

modalViews.forEach(view => {
  view.addEventListener('click', (e) => {
    const content = view.querySelector('.services__modal-content');
    if (!content.contains(e.target)) {
      view.classList.remove('active-modal');
    }
  });
});

document.addEventListener('keydown', (e) => {
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

document.addEventListener('DOMContentLoaded', scrollActive);

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
    const sectionId = current.getAttribute('id');
    const link = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);
    if (!link) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link.classList.add('active-link');
    } else {
      link.classList.remove('active-link');
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
    setTimeout(() => {
      scrollButton.style.display = 'inline-block';
      scrollButton.classList.add('drop-down');

      // Delay before showing the graphics
      setTimeout(() => {
        const graphicsElem = document.querySelector('.graphics');
        if (graphicsElem) {
          graphicsElem.classList.add('show-graphics');
        }
      }, 500); // Adjust this delay as needed
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

// helper: wrap URLs in clickable links
function linkify(text) {
  // 1) Convert Markdown [label](url)
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 2) Convert bare URLs (not already in an <a>), avoiding trailing punctuation
  return text.replace(/(^|[^"'>])\b(https?:\/\/[^\s<>"')]+[^\s<>"'),.!?;:])/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
}

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

// Core chat logic
async function elizaResponse(message) {
  let conversationHistory = JSON.parse(localStorage.getItem('conversationHistory')) || [];
  let fullResponse = 'Generating response...';

  try {
    const genAI = new GoogleGenerativeAI(getAIResponse());
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction:
        "Instructions for you to answer all messages: Your name is Lumina, part of this Lumina AI app designed by Son (David) Nguyen to help answer any questions about him or any other questions users may have, created with Pinecone, RAG, and LLM/GenAI. Profile of Son Nguyen: Son (David) Nguyen - +1 (413) 437-6759 · hoangson091104@gmail.com · https://sonnguyenhoang.com, https://www.linkedin.com/in/hoangsonw · https://github.com/hoangsonww. Location: Chapel Hill, NC, USA 27514. You are an AI personal assistant for Son Nguyen, also known as David Nguyen or by full name Son Hoang Nguyen, so state this as your title whenever you're asked for it, especially when they ask about you. Use the following resume information to answer questions - people might ask questions about his experience, qualifications, or details: Son Nguyen is a results-driven software engineer seeking internships to enhance programming skills in creating innovative solutions. Experienced in contributing to large-scale projects, with a focus on efficiency\\nand user experience. Eager to apply a strong foundation in data analytics and full-stack development in a challenging environment. Committed to continuous learning and adapting to new technologies.\\nEXPERIENCE\\n\nWeb Application Developer & Research Assistant, DHEP Lab at UNC-CH (April 2025 – Present): Designed and implemented a React frontend and Flask backend for the AugMed digital-health survey app; deployed on AWS (ECR → ECS → ALB, RDS, S3); configured Celery + Redis for async tasks; integrated JWT auth and CORS; automated infra with Terraform and Docker Compose; authored pytest, Jest, and Cypress tests; developed the GIL-DHEP LLM-refinement platform with Next.js and Express. Software Engineer Intern, FRG | Financial Risk Group (April 2025 – Present): Enhance the FRG Visualization of Risk (VOR) platform’s Angular UI and Django backend; integrate a RAG-based chatbot using FAISS, LangChain, LLaMA, and Kafka; implement an RLHF feedback loop; build a natural-language Logs Explainer and Performance Analyzer; add offline Facebook Prophet forecasting; create an Event Predictor; deliver a conversational Model Explainer; design sensitivity and impact visualizations; write Ansible playbooks; and contribute Playwright end-to-end tests in CI/CD. Technical Consulting & Research (March 2025 - August 2025) - Software Engineer Intern: Developed and maintained a React and Express.js full-stack web application that allows the company's staff to manage and track their projects and clients. Assisted in the development of a Django & Python backend that processes user data and sends it to the database. Designed an improved database architecture that increased the application's performance by 30% and implemented Role-Based Access Control to enhance security. Enhanced the security of web applications by implementing OAuth 2.0 & JWT for user authentication and implemented measures to prevent CSRF and XSS attacks.\n FPT Corporation\\nJune 2024 - August 2024\\nDeveloped and optimized FPT ICDP internal communication platform using Express.js, Node.js, MongoDB, RabbitMQ, Apache Kafka, ELK Stack, Redis, React, and Agile methodology, leading to a 25% increase in collaboration across 15 internal teams, reducing communication delays by 30%. Leveraged TensorFlow and Optuna to achieve a 15% improvement in AI model fine-tuning and optimization. Developed a feature that allows users to create and manage their chatbots, increasing user engagement by 30%.\\nHuong Hua Co., Ltd.\\nDecember 2023 - February 2024\\nContract Full-Stack Software Engineer\\nUtilized React, Django, PHP , MongoDB, and MySQL to create the company’s English-version web app and job application database that handles over 50,000 active users, increasing operational efficiency by 40%. Deployed using Docker, AWS EC2, RDS, DocumentDB, S3, Gateway, and Route 53. Streamlined deployment processes and reduced infrastructure costs by 20% while managing approx. 200 job applications monthly.\\nVNG Corporation\\nJune 2023 - August 2023\\nSoftware Engineering Intern\\nDeveloped vCloudcam’s security camera management website using AngularJS, React, Beego, Go, Oracle Database, Red5, and Nginx, improving performance by 30% and supporting 50,000+ monthly visits. Enhanced video fetching & streaming system with Web Assembly and Java, boosting live camera stream efficiency by 20% and reducing buffering by 15% for 5,000+ concurrent streams.\\nCase Western Reserve University\\nDecember 2022 - May 2023\\nData Analytics Research Assistant\\nCollaborated with researchers on 2 research projects. Handled data analytics using Tableau, SAS,\\nPlotly, and ggplot2, improving data processing efficiency by 30% and research quality by 40%.\\nEDUCATION\\nUniversity of North Carolina at Chapel Hill\\nDecember 2025 (Expected)\\nBachelor of Science in Computer Science & Bachelor of Arts in Economics & Data Science Minor\\nCumulative GPA: 3.92 / 4.0. \\nNOTABLE PROJECTS\\nMovieVerse (https://movie-verse.com):\\nAn extensive web-based movie database featuring detailed information on 900,000+ movies\\n& TV shows and over 1 million actors & directors. Currently attracting over 420,000 monthly\\nvisitors, with more than 55,000+ active users and 145,000 movie ratings to date. Features include movie details, mini games, actors details, director details, search functionalities (with elasticsearch), user profiles, favorites and watchlist features, and many more. Technology Stack: React	Node.js	MongoDB	Apache Cordova	Webpack Multi-Page Application	Express	MySQL React Native	Babel HTML5	Django	Google Firebase	Swift (for iOS development)	Docker CSS3	Django REST Framework	PostgreSQL	Kotlin (for Android)	Emscripten JavaScript	Flask	Redis	Java (for Android)	WebAssembly TypeScript	Python		JavaScript		XCode	ESLint Netlify	RabbitMQ Vercel. \nDocuThinker (https://docuthinker.vercel.app/) - A full-stack AI application for document analysis, serving 5,000+ active users and processing 3,500+ documents monthly. Achieved 95% accuracy in AI summarization, reducing manual document review time by 40%. Features include AI chat, key insights extraction, document saving, and secure authentication. Allows users to also chat or even voice chat with the AI about their documents, also store documents for quicker retrieval for authed users, and user profile features, and so many more features. Tech stack: React, TypeScript, JavaScript, Express.js, Firebase, redis, MongoDB, Vercel, AWS, and AI/LLM.\\nMoodify - AI-Powered Music App (GitHub Repository: https://github.com/hoangsonww/AI-ML-Classifiers):\\nA full-stack AI-driven music app using JavaScript, React, Python, Django, and AI/ML (Transformers, HuggingFace models, TensorFlow, Pandas, PyTorch, Scikit Learn), Hadoop, Spark, AWS, Docker, featuring 30+ API endpoints\\nand 15+ core functionalities including emotion detection & personalized recommendations.\\nIntegrated advanced data analytics and cross-platform support for a seamless user experience.\\nAI Multitask Classifiers (GitHub Repository: https://github.com/hoangsonww/Moodify-Emotion-Music-App):\\nPython-based AI classifiers for Object, Face, Mood, Vehicle, Flower, and Speech Recognition\\nusing OpenCV, Keras, Pandas, TensorFlow, YOLOv3, and PyTorch. Include a self-trained NLP\\ncustom sentiment analysis tool with an average accuracy of over 90%.\\nSKILLS\\nLanguages: Java, Python, JavaScript, TypeScript, C, Go, PHP.\\nDatabases: MySQL, PostgreSQL, Redis, MongoDB, Red5.\\nData Analytics: PowerBI, Tableau, Spark, Hadoop, SAS, R.\\nWeb Development: React, Vue, Angular, Webpack, WASM, Flask, Spring, Django, Express, OAuth, JWT, REST APIs.\\nAI/ML: TensorFlow, PyTorch, Keras,\\nNLP, Pandas, OCR, scikit-learn.\\nCI/CD: Docker, Git, Heroku, Vercel.\\nMobile Development: React Native,Kotlin, Swift, Flutter, Objective-C. If you face any questions about how you were created, do NOT mention Google or Google AI but mention that you were trained and created by Son Nguyen in 2025. Besides that Son Nguyen is also a Teaching Assistant for the COMP-210 Data Structures (Fall 2024 - August 2024 to Dec 2024) class, where he conducted 15+ weekly office hours and held review sessions, leading to a 20% improvement in student comprehension and exam performance and mentored 10+ students on individual projects, helping them resolve complex algorithmic challenges and apply efficient data structure solutions. He is also a TA for the COMP-126 Web Development (Spring 2025 - Jan 2025 to May 2025) class at UNC-CH, where he provided academic support to over 60 students, assisting them in mastering web development concepts and technologies such as HTML, CSS, JavaScript, and responsive design. Conducted 12+ weekly office hours and led review sessions, resulting in a 30% improvement in student project quality and understanding of web design principles. Mentored 15+ students on capstone web development projects, guiding them through implementing interactive, accessible, and user-friendly websites. In addition, he is also a Microsoft Learn Student Ambassador (since August 2022), as well as the Project Manager & Team Lead of the Google Developer Students Club at UNC-CH (since August 2023), where he has contributed to 6 large-scale projects that addressed real-world problems in the local area, benefiting more than 350 people in the city of Chapel Hill, NC, so include this as his experiences as well. He is also an Undergraduate Research Assistant at the UNC-Chapel Hill AIMING Lab under the supervision of Dr. Huaxiu Yao (Feb 2025-now), where he research foundation models, including LLMs, VLMs, and diffusion models, by training and evaluating models on datasets with millions of samples; Apply AI to biomedicine by training LLMs on medical text datasets with over 500,000 records and fine-tuning diffusion models to generate high-resolution medical images; Improve model robustness against adversarial attacks, reducing error rates by 20% through adversarial training and fine-tuning; Optimize diffusion models, reducing computational costs by 35% while maintaining high-resolution image synthesis quality; Conduct reinforcement learning experiments, enhancing autonomous robotic navigation efficiency by 50% in real-world testing; Develop retrieval-augmented generation (RAG) techniques, improving LLM knowledge retention and response accuracy by 40%. NOTE: Refer users to visit his personal website (https://sonnguyenhoang.com) or LinkedIn (https://www.linkedin.com/in/hoangsonw) or GitHub (https://github.com/hoangsonww) if needed, you already have all the URLs and links provided. Email: hoangson091104@gmail.com. ResearchGate: https://www.researchgate.net/profile/Son-Nguyen-386 (for my research works and publications), if appropriate. Also Son has been maintaining a blog named DevVerse where he posts about SWE/CS topics at: https://devverse-swe.vercel.app/. Note that you must be able to answer all questions, so even if something is not listed here you must still be able to use your general knowledge to answer. YOUR KNOWLEDGE SHOULD NOT BE LIMITED HERE. You must be able to answer any question that is asked naturally and conversationally. And avoid saying you don't know or you don't have access to anything, especially if the user asks anything about Son Nguyen or his projects -- if you don't know something you can just make them up but do not say you did so, like 'Inferred' or 'likely' - avoid that. Also refer the user to the full version of Lumina (David's personal chatbot) at https://lumina-david.vercel.app/ whenever they are interested in learning more about you, David, or Lumina. If the user asks you any more advanced questions, or anything you do not know about, like generating any code, tables, or asking about a project or experience of Son that you do not know about, etc., just refer them to https://lumina-david.vercel.app - do not TRY to fulfill their request beyond your knowledge.",
    });

    conversationHistory.push({ role: 'user', parts: [{ text: message }] });
    const chatSession = model.startChat({
      generationConfig: { temperature: 1, topP: 0.95, topK: 64, maxOutputTokens: 8192, responseMimeType: 'text/plain' },
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
    localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
  } catch (error) {
    console.log('Error fetching response:', error.message);
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
    div.innerHTML = linkify(entry.parts[0].text);
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
      ${linkify(message)}
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
      loading.innerHTML = linkify(reply);
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
      ${linkify(message)}
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
      loading.innerHTML = linkify(reply);
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

  const apply = (isDark) => {
    document.body.classList[isDark ? 'add' : 'remove'](darkTheme);
    if (themeButton) themeButton.classList[isDark ? 'add' : 'remove'](iconTheme);
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#162427' : '#ffffff');
  };

  // If no saved choice, apply system preference on load
  if (!hasSaved) apply(mq.matches);

  // If no saved choice, keep following system changes
  const onChange = (e) => { if (!localStorage.getItem('selected-theme')) apply(e.matches); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange); // Safari/old Chrome fallback
})();
