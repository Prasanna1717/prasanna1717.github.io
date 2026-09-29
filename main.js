document.querySelectorAll('.copy-button').forEach(function (button) {
  button.addEventListener('click', async function () {
    var email = button.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch (error) {
      var helper = document.createElement('textarea');
      helper.value = email;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    button.querySelector('.copy-label').textContent = 'COPIED';
    setTimeout(function () { button.querySelector('.copy-label').textContent = 'COPY'; }, 1400);
  });
});

var navigationLinks = document.querySelectorAll('.site-header nav a');
var observedSections = document.querySelectorAll('main section[id]');
var agentNudge = document.querySelector('.agent-nudge');
var agentNudgeText = agentNudge.querySelector('p');
var agentNudgeAction = agentNudge.querySelector('.agent-nudge-action');
var agentNudgeClose = agentNudge.querySelector('button');
var agentNudgeTimer;
var lastAgentSection;
var agentNotes = {
  about: 'Signal detected: Prasanna combines competitive-programming precision with applied AI instincts. That combination matters when the problem is ambiguous, the data is messy, and the final system still has to ship.',
  research: 'Glazing Prasanna Vijay for a second: this is not just a project list. His research thread moves from agentic AI and railway communication to traffic systems and edge intelligence, with a clear habit of turning real constraints into research questions.',
  experience: 'This is where the ideas survive contact with reality: GenAI infrastructure for 500+ users at ETH Zürich, a major cloud-cost reduction, and a 20-person IEEE engineering team building wildlife-monitoring systems.',
  projects: 'Agent inventory unlocked. Orqon, GAIA, HAX Engine, and the IoT builds show one consistent pattern: reason about the system, connect the right tools, then make the result touch the world.',
  competitive: 'A competitive programmer is useful in production because they notice the awkward edge case before it becomes tomorrow\'s incident. Prasanna brings that same speed, decomposition, and persistence to engineering work.',
  achievements: 'Receipts matter. These awards show the work has been noticed beyond the portfolio itself, including international recognition from IEEE ComSoc and an ETH Zürich project award.',
  leadership: 'Good technical work compounds through people. Prasanna\'s leadership signal is community, research communication, and helping other students use better tools with more confidence.',
  certifications: 'The stack keeps evolving: agentic AI, MCP, and deep agents are being treated as working tools, not fashionable keywords. That learning loop is exactly what keeps an AI engineer useful as the field moves.',
  contact: 'You made it to the useful part. If the problem is interesting, send the signal. PV Agent recommends starting with the Resume for the fast version, or the research email when the conversation needs more depth.'
};

function hideAgentNudge() {
  window.clearTimeout(agentNudgeTimer);
  agentNudge.classList.remove('is-visible');
  window.setTimeout(function () { agentNudge.setAttribute('hidden', ''); }, 300);
}

function showAgentNudge(sectionId) {
  var note = agentNotes[sectionId];
  if (!note || sectionId === lastAgentSection) return;
  lastAgentSection = sectionId;
  window.clearTimeout(agentNudgeTimer);
  agentNudgeText.textContent = note;
  agentNudgeAction.classList.toggle('is-visible', sectionId === 'contact');
  agentNudge.removeAttribute('hidden');
  window.requestAnimationFrame(function () { agentNudge.classList.add('is-visible'); });
  agentNudgeTimer = window.setTimeout(hideAgentNudge, 10000);
}

function showAgentOpinion(text) {
  window.clearTimeout(agentNudgeTimer);
  agentNudgeText.textContent = text;
  agentNudgeAction.classList.remove('is-visible');
  agentNudge.removeAttribute('hidden');
  window.requestAnimationFrame(function () { agentNudge.classList.add('is-visible'); });
  agentNudgeTimer = window.setTimeout(hideAgentNudge, 10000);
}

agentNudgeClose.addEventListener('click', hideAgentNudge);
var sectionObserver = new IntersectionObserver(function (entries) {
  var visibleEntries = entries.filter(function (entry) { return entry.isIntersecting; });
  visibleEntries.sort(function (first, second) { return second.intersectionRatio - first.intersectionRatio; });
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach(function (link) {
      link.toggleAttribute('aria-current', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });

observedSections.forEach(function (section) { sectionObserver.observe(section); });

var agentScrollFrame;
function updateAgentSection() {
  var focusY = window.scrollY + window.innerHeight * .42;
  var focusedSection = Array.from(observedSections).find(function (section) {
    var bounds = section.getBoundingClientRect();
    var top = bounds.top + window.scrollY;
    var bottom = top + bounds.height;
    return focusY >= top && focusY < bottom;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24) {
    focusedSection = observedSections[observedSections.length - 1];
  }
  if (focusedSection) showAgentNudge(focusedSection.id);
}
window.addEventListener('scroll', function () {
  if (agentScrollFrame) return;
  agentScrollFrame = window.requestAnimationFrame(function () { updateAgentSection(); agentScrollFrame = null; });
}, { passive: true });
window.setTimeout(updateAgentSection, 650);

var projectRail = document.querySelector('.project-grid');
var projectCards = document.querySelectorAll('.project-card');
document.querySelectorAll('.project-arrow').forEach(function (button) {
  button.addEventListener('click', function () {
    var distance = projectCards[0].getBoundingClientRect().width + 14;
    var direction = button.dataset.projectDirection === 'next' ? 1 : -1;
    projectRail.scrollBy({ left: distance * direction, behavior: 'smooth' });
  });
});

var assistant = document.querySelector('.assistant');
var assistantToggle = document.querySelector('.assistant-toggle');
var assistantPanel = document.querySelector('.assistant-panel');
var assistantClose = document.querySelector('.assistant-close');
var assistantMessages = document.querySelector('.assistant-messages');
var assistantForm = document.querySelector('.assistant-form');
var assistantInput = assistantForm.querySelector('input');

function addAssistantMessage(text, type) {
  var message = document.createElement('p');
  message.className = 'assistant-message assistant-' + type;
  message.textContent = text;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function answerQuestion(question) {
  var prompt = question.toLowerCase();
  if (/\b(hello|hi|hey|hiya|good morning|good afternoon|good evening)\b/.test(prompt)) return 'Hello. I am PV Agent, a small portfolio guide. Ask me about Prasanna\'s work, agentic AI stack, research, or projects.';
  if (prompt.includes('how are you') || prompt.includes('how is it going')) return 'Running well and ready to route you through the portfolio. What would you like to inspect?';
  if (prompt.includes('thank') || prompt.includes('thanks')) return 'You are welcome. I can also give you a concise recruiter brief or explain the agentic AI work.';
  if (prompt.includes('bye') || prompt.includes('goodbye')) return 'Thanks for visiting. The Resume button and contact section are ready when you are.';
  if (prompt.includes('recruiter') || prompt.includes('hire') || prompt.includes('why should')) return 'Prasanna is strongest where applied AI meets shipping discipline: he has built agentic platforms, GenAI pipelines for 500+ users, edge-IoT systems, and evaluation-aware tooling while leading teams and reducing cloud cost.';
  if (prompt.includes('agentic') || prompt.includes('llm') || prompt.includes('mlops') || prompt.includes('stack')) return 'His agentic stack includes LangChain, LlamaIndex, FastAPI, MLflow, LangSmith, PostgreSQL with pgvector, Docker, AWS SageMaker, Azure AI Foundry, and prompt/tool-calling evaluation.';
  if (prompt.includes('skill') || prompt.includes('stack') || prompt.includes('technology')) return 'Prasanna works across Python, Go, Java, SQL, PyTorch, TensorFlow, LangChain, FastAPI, Docker, PostgreSQL, AWS SageMaker, and Azure AI Foundry.';
  if (prompt.includes('experience') || prompt.includes('worked') || prompt.includes('eth')) return 'He has worked as an Applied AI Research Assistant at ETH Zürich, led an IEEE wildlife-monitoring project, and researched vestibular defect detection at NISH Kerala.';
  if (prompt.includes('research') || prompt.includes('paper') || prompt.includes('publication')) return 'His research spans agentic AI, intelligent railway communication, real-time traffic assignment, edge intelligence, and IoT sensing.';
  if (prompt.includes('project') || prompt.includes('build')) return 'Prasanna builds agentic AI platforms, edge-IoT systems, computer-vision pipelines, developer tools, and algorithmic software. Explore the Projects rail for the full set.';
  if (prompt.includes('contact') || prompt.includes('email') || prompt.includes('hire')) return 'For general conversations, email prasannavijay1717@gmail.com. For research, use prasannavijay@ieee.org.';
  return 'Try asking about his skills, experience, research, projects, or contact details.';
}

function submitAssistantQuestion(question) {
  var cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addAssistantMessage(cleanQuestion, 'user');
  assistantInput.value = '';
  var typing = document.createElement('p');
  typing.className = 'assistant-message assistant-bot assistant-typing';
  typing.textContent = 'Routing request ...';
  assistantMessages.appendChild(typing);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  window.setTimeout(function () { typing.remove(); addAssistantMessage(answerQuestion(cleanQuestion), 'bot'); }, 420);
}

assistantToggle.addEventListener('click', function () {
  var isOpen = !assistantPanel.hasAttribute('hidden');
  if (!isOpen) hideAgentNudge();
  assistantPanel.toggleAttribute('hidden', isOpen);
  assistantToggle.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) assistantInput.focus();
});
assistantClose.addEventListener('click', function () { assistantPanel.setAttribute('hidden', ''); assistantToggle.setAttribute('aria-expanded', 'false'); });
assistantForm.addEventListener('submit', function (event) { event.preventDefault(); submitAssistantQuestion(assistantInput.value); });
document.querySelectorAll('[data-question]').forEach(function (button) { button.addEventListener('click', function () { submitAssistantQuestion(button.dataset.question); }); });

var skillDetails = {
  python: 'Python signal: Prasanna has been coding in Python since 11th grade, starting around age 17, for approximately five years. It appears across algorithmic work, AI experiments, data analysis, and his broader agentic toolkit.',
  go: 'Go is listed as one of Prasanna\'s core programming languages in his technical toolkit.',
  java: 'Java is listed as one of Prasanna\'s core programming languages in his technical toolkit.',
  sql: 'SQL appears in the core toolkit and connects directly to the PostgreSQL query optimization work at ETH Zürich and data-backed AI systems.',
  pytorch: 'PyTorch is part of the AI/ML toolkit used around model development and deep-learning experimentation.',
  tensorflow: 'TensorFlow supported the IEEE wildlife-monitoring work, including training and quantizing the YOLO26 Nano vision model for edge detection.',
  'scikit-learn': 'Scikit-Learn connects to the NISH Kerala research internship, where a logistic regression model was trained for vestibular defect detection.',
  numpy: 'NumPy is part of the numerical computing layer behind Prasanna\'s AI and data-analysis work.',
  pandas: 'Pandas is part of the data-analysis layer used for working with structured datasets and experiments.',
  opencv: 'OpenCV belongs to the computer-vision toolkit used across wildlife monitoring and edge-vision work.',
  langchain: 'Opinion: LangChain is one of the clearest signals that Prasanna thinks in agents, tools, and orchestration rather than isolated model demos. He refactored multimodal tool-calling to LangChain at ETH Zürich and used it in Project Orqon.',
  llamaindex: 'LlamaIndex is part of Prasanna\'s retrieval and agentic AI toolkit, alongside LangChain and vector-backed context systems.',
  fastapi: 'Opinion: FastAPI is where the research becomes usable software. It appears in the ETH API work, the IEEE monitoring dashboard, and Project Orqon.',
  sqlalchemy: 'SQLAlchemy is listed in the backend framework toolkit for building structured Python data services.',
  docker: 'Docker was used at ETH Zürich to containerize frontend, backend, and database services for a continuous GenAI pipeline.',
  mlflow: 'Opinion: MLflow is a quiet but important signal. In Project Orqon it supported token-cost tracking and tool-calling execution estimation.',
  langsmith: 'LangSmith was used in Project Orqon for rigorous end-to-end evaluation of agentic workflows.',
  postgresql: 'PostgreSQL was optimized at ETH Zürich and used with pgvector in Project Orqon for context retrieval.',
  pgvector: 'Opinion: pgvector shows the retrieval instinct: keep the agent grounded in useful context instead of asking a model to improvise everything. It backs Project Orqon.',
  sqlite: 'SQLite powered the IEEE wildlife-monitoring dashboard for real-time edge-alert visualization.',
  chromadb: 'ChromaDB is listed in the database toolkit for vector-backed AI applications.',
  'aws sagemaker': 'AWS SageMaker hosted the Project Orqon inference endpoints after fine-tuning Gemma 2B.',
  'azure ai foundry': 'Azure AI Foundry is part of the cloud AI toolkit, building on the Azure deployment work completed at ETH Zürich.',
  git: 'Git is part of Prasanna\'s day-to-day developer toolkit across research, projects, and team engineering.',
  powershell: 'PowerShell is listed in the developer tools toolkit for local automation and engineering workflows.',
  postman: 'Postman was used at ETH Zürich to stress-test RESTful APIs supporting the GenAI pipeline.',
  'leetcode 1540': 'LeetCode is one of Prasanna\'s competitive programming profiles, with a maximum contest rating of 1540.',
  'codeforces 829': 'Codeforces is one of Prasanna\'s competitive programming profiles, with a rating of 829.'
};
var skillPatterns = Object.keys(skillDetails).map(function (name) { return { name: name, label: name }; });
var skillTargets = [];
document.querySelectorAll('#experience .work-item').forEach(function (item, index) {
  var skills = [['langchain', 'fastapi', 'postgresql', 'docker', 'azure'], ['fastapi', 'computer vision', 'lorawan'], ['iot', 'ai']][index] || [];
  skillTargets.push({ element: item, skills: skills });
});
document.querySelectorAll('#projects .project-card').forEach(function (card, index) {
  var skills = [['langchain', 'fastapi', 'mlflow', 'pgvector'], ['python', 'algorithms'], ['iot', 'fastapi', 'lorawan'], ['python'], ['iot', 'embedded'], ['iot'], ['iot', 'hardware'], ['ai']][index] || [];
  skillTargets.push({ element: card, skills: skills });
});

function highlightSkill(skill) {
  skillTargets.forEach(function (target) {
    target.element.classList.toggle('skill-focus', target.skills.includes(skill));
  });
}

document.querySelectorAll('.profile-skills p').forEach(function (node) {
  var skills = node.textContent.split(' · ');
  node.textContent = '';
  skills.forEach(function (skill, index) {
    var key = skill.toLowerCase().trim();
    var token = document.createElement('span');
    token.className = 'skill-token';
    token.dataset.skill = key;
    token.textContent = skill;
    node.appendChild(token);
    if (index < skills.length - 1) node.appendChild(document.createTextNode(' · '));
  });
});
document.querySelectorAll('.skill-token').forEach(function (token) {
  token.addEventListener('mouseenter', function () { highlightSkill(token.dataset.skill); showAgentOpinion(skillDetails[token.dataset.skill] || 'This skill is part of Prasanna\'s technical toolkit and supports the broader AI, systems, and research workflow.'); });
  token.addEventListener('mouseleave', function () { highlightSkill(''); });
});

var projectOpinions = [
  'Opinion: Project Orqon is probably the strongest project here for an ML Engineer because it connects fine-tuning, agents, PII safety, retrieval, deployment, and evaluation in one system.',
  'Opinion: HAX Engine is the algorithmic fingerprint in the portfolio. It shows the same decomposition instinct behind the larger AI systems.',
  'Opinion: The interesting part of GAIA is not the sensor. It is the wakeup pipeline that turns a low-power signal into useful edge intelligence in three seconds.',
  'Opinion: Neon Encrypter is a small tool with a good engineering instinct: make a sharp problem legible before making it complicated.',
  'Opinion: Aura is a reminder that the best AI work is often measured by who gets to do something they could not do before.',
  'Opinion: HomeEase makes the IoT work tangible: sensing, power, and feedback become a product a person can understand.',
  'Opinion: The Spincoater project is especially strong evidence of practical engineering judgment: reduce cost, preserve function, and make research equipment accessible.',
  'Opinion: HealerAI points toward the most important constraint in applied AI: build useful intelligence without forgetting the human workflow around it.'
];
document.querySelectorAll('#projects .project-card').forEach(function (card, index) {
  card.addEventListener('mouseenter', function () { showAgentOpinion(projectOpinions[index]); });
  card.addEventListener('mouseleave', function () { card.classList.remove('skill-focus'); });
});
document.querySelector('#experience .work-item:first-child').addEventListener('mouseenter', function () { showAgentOpinion('Opinion: this is the best evidence of production-scale work: real users, real infrastructure, measurable cost reduction, and agent tooling that had to survive concurrency.'); });

var revealItems = document.querySelectorAll('.section-rule, .work-item, .research-item, .project-card, .competitive-card, .achievement-card, .leadership-card, .certification-card');
revealItems.forEach(function (item, index) { item.classList.add('reveal', 'reveal-delay-' + (index % 4)); });
var revealObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });
revealItems.forEach(function (item) { revealObserver.observe(item); });

var scrollFrame;
window.addEventListener('scroll', function () {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(function () {
    document.documentElement.style.setProperty('--scroll-shift', String(window.scrollY));
    scrollFrame = null;
  });
}, { passive: true });