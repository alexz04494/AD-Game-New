// Simplified game logic for quarterly scenarios

const state = {
  money: 350000,
  upgrades: {
    moisture: {
      name: "Dryer ACE",
      price: 150000,
      owned: false,
      justPurchased: false,
      passive: 50000,
      description:
        "<p>Maintain pellet moisture with pinpoint accuracy, eliminating costly spec deviations and rework. ACE Moisture Control optimizes drying processes for consistent quality.</p>"
    },
    training: {
      name: "Operator Training Suite",
      price: 200000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>A comprehensive training platform designed to upskill your operators, reducing errors and downtime while enhancing operational safety and efficiency.</p>"
    },
    retrofit: {
      name: "Plant Solutions",
      price: 225000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>Upgrade your legacy control systems to reduce faults, improve uptime, and integrate with modern analytics for smarter plant operations.</p>"
    },
    digitalTwin: {
      name: "Digital Twin & Predictive",
      price: 150000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>Leverage real-time simulation and analytics to predict issues before they occur, optimizing throughput and maintenance scheduling.</p>"
    },
    plantInsights: {
      name: "Plant Insights with OEE",
      price: 120000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>Track Overall Equipment Effectiveness (OEE) with precision to identify bottlenecks, reduce downtime, and maximize asset utilization.</p>"
    }
  }
};

const totalQuarters = 4;
let currentQuarter = 1;

// DOM elements
const shopDiv = document.getElementById("shop");
const moneyBar = document.getElementById("money-bar");
const startPage = document.getElementById("start-page");
const mainGamePage = document.getElementById("main-game-page");
const uiDiv = document.getElementById("ui");
const catalogueBack = document.getElementById("catalogue-back");

const quarterCounter = document.getElementById("quarter-counter");
const scenarioPage = document.getElementById("scenario-page");
const scenarioCard = document.getElementById("scenario-card");
const scenarioNextBtn = document.getElementById("scenario-next-btn");
const performanceReportPage = document.getElementById("performance-report-page");
const performanceReportCard = document.getElementById("performance-report-card");
const reportNextBtn = document.getElementById("report-next-btn");

// Audio elements
const beepSound = document.getElementById("beep-sound");
const typingSound = document.getElementById("typing-sound");
const catalogueMusic = document.getElementById("catalogue-music");
const mainThemeMusic = document.getElementById("main-theme-music");
const cashRegisterSound = document.getElementById("cash-register-sound");
const cancelSound = document.getElementById("cancel-sound");

// Dialogue setup
const dialogue = [
  { name: 'Director', sprite: 'director.png', text: 'Alright, let\u2019s get started \u2014 we\u2019ve had another rough quarter, and I want to hear where the bottlenecks really are.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\'ve missed moisture targets again \u2014ten batches were flagged by QA just last week. It\u2019s not just specs, it\u2019s throughput too. We\u2019re constantly adjusting the dryer, but it never settles. It\u2019s costing us output." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "I know. We had to stop the line twice last month. Same issue every time \u2014 the system doesn\u2019t alert us until it\u2019s too late. We\u2019re reactive, not proactive. That downtime\u2019s killing our delivery windows." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "And let\u2019s not forget the customer complaints. We've had three traceability requests we couldn\u2019t fully satisfy. If this happens during an audit we're in trouble" },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Frankly, we\u2019re stretching that PLC system past its limits. Half of it still runs on patched code from ten years ago. SCADA\u2019s sluggish, diagnostics are vague \u2014 it\u2019s no surprise things slip through." },
  { name: 'HR Officer', sprite: 'hrlady.png', text: "We\u2019ve had three serious errors this month alone, and they all came from new hires. They\u2019re not unmotivated \u2014 they just weren\u2019t ready." },
  { name: 'Director', sprite: 'director.png', text: "Alright. We\u2019ve aired enough for one morning. Here's the plan \u2014 next week, an ANDRITZ representative is coming to present some solutions they believe can help us get back on track." },
  { name: 'Director', sprite: 'director.png', text: 'General manager, I let the decision be up to you. Bring the plant back on its feet!' }
];
let dialogueIndex = 0;
let isTyping = false;
let currentText = "";
let skipTyping = false;

const textBox = document.getElementById("text-box");
let continueIndicator = document.getElementById("continue-indicator");

const mainCharacterName = document.querySelector('#character-section .character-name');
const mainCharacterImg = document.querySelector('#character-box img');

function setMainSpeaker(entry) {
  if (mainCharacterName) {
    mainCharacterName.textContent = entry.name;
  }
  if (mainCharacterImg) {
    if (entry.sprite) {
      mainCharacterImg.src = `assets/sprites/${entry.sprite}`;
      mainCharacterImg.style.display = '';
    } else {
      mainCharacterImg.src = '';
      mainCharacterImg.style.display = 'none';
    }
  }
}

function typeWriter(text, i) {
  isTyping = true;
  continueIndicator.style.opacity = '0';

  if (skipTyping) {
    textBox.firstChild.textContent = text;
    isTyping = false;
    skipTyping = false;
    continueIndicator.style.opacity = '1';
    return;
  }
  if (i < text.length) {
    textBox.firstChild.textContent += text.charAt(i);
    typingSound.play();
    i++;
    setTimeout(() => typeWriter(text, i), 30);
  } else {
    isTyping = false;
    continueIndicator.style.opacity = '1';
  }
}

startPage.onclick = () => {
  startPage.style.display = "none";
  mainGamePage.style.display = "block";
  beepSound.currentTime = 0;
  beepSound.play();
  mainThemeMusic.volume = 0.2;
  mainThemeMusic.play();
  nextDialogue();
};

mainGamePage.addEventListener('click', nextDialogue);

function nextDialogue() {
  if (isTyping) {
    skipTyping = true;
    return;
  }
  if (dialogueIndex < dialogue.length) {
    continueIndicator.style.opacity = '0';
    textBox.innerHTML = '<div class="text-content"></div><div class="continue-indicator" id="continue-indicator"></div>';
    continueIndicator = document.getElementById('continue-indicator');
    const entry = dialogue[dialogueIndex];
    setMainSpeaker(entry);
    currentText = entry.text;
    typeWriter(currentText, 0);
    dialogueIndex++;
  } else {
    mainGamePage.style.display = 'none';
    uiDiv.style.display = 'block';
    moneyBar.style.display = 'block';
    mainGamePage.removeEventListener('click', nextDialogue);
    mainThemeMusic.pause();
    catalogueMusic.volume = 0.1;
    catalogueMusic.play();
    updateShop();
  }
}

function updateMoneyBar() {
  moneyBar.textContent = `€${state.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function updateShop() {
  updateMoneyBar();
  shopDiv.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'catalogue-container';
  Object.keys(state.upgrades).forEach(key => {
    const item = state.upgrades[key];
    const card = document.createElement('div');
    card.className = 'shop-card catalogue-card';

    const signet = document.createElement('img');
    signet.className = 'card-signet';
    signet.src = 'assets/icons/signet.png';
    signet.alt = 'ANDRITZ';
    card.appendChild(signet);

    const title = document.createElement('h3');
    title.textContent = item.name;
    card.appendChild(title);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `€${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    card.appendChild(price);

    const description = document.createElement('div');
    description.className = 'description';
    description.innerHTML = item.description;
    card.appendChild(description);

    const btn = document.createElement('button');
    if (item.justPurchased) {
      btn.className = 'cancel-btn';
      btn.textContent = 'CANCEL';
      btn.onclick = () => {
        cancelSound.currentTime = 0;
        cancelSound.play();
        item.owned = false;
        item.justPurchased = false;
        state.money += item.price;
        updateShop();
      };
    } else if (item.owned) {
      btn.textContent = 'Already purchased';
      btn.disabled = true;
    } else {
      btn.className = 'buy-btn';
      btn.textContent = 'BUY';
      btn.disabled = state.money < item.price;
      btn.onclick = () => {
        cashRegisterSound.currentTime = 0;
        cashRegisterSound.play();
        item.owned = true;
        item.justPurchased = true;
        state.money -= item.price;
        updateShop();
      };
    }
    card.appendChild(btn);

    container.appendChild(card);
  });
  shopDiv.appendChild(container);

  const contBtn = document.createElement('button');
  contBtn.className = 'catalogue-continue-btn';
  contBtn.textContent = 'Continue';
  contBtn.onclick = () => {
    startQuarter();
  };
  shopDiv.appendChild(contBtn);
}

function applyPassiveIncome() {
  Object.values(state.upgrades).forEach(u => {
    if (u.owned && u.passive) {
      state.money += u.passive;
    }
  });
}

const scenarios = [
  {
    title: 'SCENARIO 1 - MOISTURE SURGE IN DRYER',
    text: 'It\'s mid-monsoon, and unexpected rains have increased the ambient moisture levels in the intake air. The plant\'s dryers—tuned for stable dry-season baselines—are suddenly unable to maintain their moisture targets. As the air\'s humidity swings, so does the product moisture. Operators struggle to catch up manually, resulting in inconsistent output.\n\nThe stakes are high: even a 1% deviation in moisture leads to regulatory non-compliance, customer rejections, and the need to reprocess or discard product.',
    apply: () => {
      const wins = [];
      const neutrals = [];
      const losses = [];

      if (state.upgrades.moisture.owned) {
        state.money += 50000;
        wins.push('Dryer ACE: +50k');
        neutrals.push('200k loss avoided due to Dryer ACE');
      } else {
        state.money -= 200000;
        losses.push('Without Dryer ACE you lost 200k.');
      }

      if (state.upgrades.training.owned) {
        state.money += 20000;
        wins.push('Operator Training Suite: +20k');
      }

      if (state.upgrades.digitalTwin.owned) {
        state.money += 25000;
        wins.push('Digital Twin & Predictive: +25k');
      }

      if (state.upgrades.plantInsights.owned) {
        state.money += 10000;
        wins.push('Plant Insights with OEE: +10k');
      }

      return { wins, neutrals, losses };
    }
  },
  { text: 'Scenario 2 coming soon.', apply: () => 'No effect this quarter.' },
  { text: 'Scenario 3 coming soon.', apply: () => 'No effect this quarter.' },
  { text: 'Scenario 4 coming soon.', apply: () => 'No effect this quarter.' }
];

function startQuarter() {
  Object.values(state.upgrades).forEach(u => {
    if (u.justPurchased) {
      u.justPurchased = false;
    }
  });
  applyPassiveIncome();
  quarterCounter.textContent = `Quarter ${currentQuarter}/${totalQuarters}`;
  quarterCounter.style.display = 'block';
  uiDiv.style.display = 'none';
  moneyBar.style.display = 'block';
  scenarioPage.style.display = 'flex';
  scenarioCard.innerHTML = '';
  
  const scenario = scenarios[currentQuarter - 1];
  
  // Add title if it exists
  if (scenario.title) {
    const title = document.createElement('h2');
    title.textContent = scenario.title;
    title.style.cssText = 'color: #0075be; font-family: "Press Start 2P", cursive; font-size: 1rem; margin-bottom: 20px; text-align: center; line-height: 1.4;';
    scenarioCard.appendChild(title);
  }
  
  const p = document.createElement('p');
  p.textContent = scenario.text;
  p.style.cssText = 'line-height: 1.6; margin-bottom: 20px; font-size: 1.1rem;';
  scenarioCard.appendChild(p);
  // Don't apply scenario effects yet - that happens in the performance report
}

function showPerformanceReport() {
  scenarioPage.style.display = 'none';
  performanceReportPage.style.display = 'flex';

  performanceReportCard.innerHTML = '';
  
  // Add "Performance Report" title
  const title = document.createElement('h2');
  title.textContent = 'PERFORMANCE REPORT';
  title.style.cssText = 'color: #0075be; font-family: "Press Start 2P", cursive; font-size: 1.2rem; margin-bottom: 20px; text-align: center; line-height: 1.4;';
  performanceReportCard.appendChild(title);
  
  // Apply scenario effects and show results
  const scenario = scenarios[currentQuarter - 1];
  const result = scenario.apply();

  const winsHeader = document.createElement('h3');
  winsHeader.textContent = 'WINS';
  winsHeader.className = 'report-section-header win';
  performanceReportCard.appendChild(winsHeader);

  const winList = document.createElement('ul');
  winList.className = 'performance-report-list';
  if (result.wins.length === 0 && result.neutrals.length === 0) {
    const li = document.createElement('li');
    li.className = 'performance-report-line';
    li.textContent = 'No wins this month.';
    winList.appendChild(li);
  } else {
    result.wins.forEach(msg => {
      const li = document.createElement('li');
      li.className = 'performance-report-line positive-score';
      li.textContent = msg;
      winList.appendChild(li);
    });
    result.neutrals.forEach(msg => {
      const li = document.createElement('li');
      li.className = 'performance-report-line';
      li.textContent = msg;
      winList.appendChild(li);
    });
  }
  performanceReportCard.appendChild(winList);

  const lossHeader = document.createElement('h3');
  lossHeader.textContent = 'LOSSES';
  lossHeader.className = 'report-section-header loss';
  performanceReportCard.appendChild(lossHeader);

  const lossList = document.createElement('ul');
  lossList.className = 'performance-report-list';
  if (result.losses.length === 0) {
    const li = document.createElement('li');
    li.className = 'performance-report-line';
    li.textContent = 'No losses this month.';
    lossList.appendChild(li);
  } else {
    result.losses.forEach(msg => {
      const li = document.createElement('li');
      li.className = 'performance-report-line negative-score';
      li.textContent = msg;
      lossList.appendChild(li);
    });
  }
  performanceReportCard.appendChild(lossList);

  updateMoneyBar();
}

// Scenario page next button - go to performance report
scenarioNextBtn.onclick = () => {
  showPerformanceReport();
};

// Performance report next button - go to catalogue
reportNextBtn.onclick = () => {
  performanceReportPage.style.display = 'none';
  currentQuarter++;
  if (currentQuarter > totalQuarters) {
    quarterCounter.style.display = 'none';
    catalogueMusic.pause();
    mainThemeMusic.pause();
  } else {
    uiDiv.style.display = 'block';
    updateShop();
  }
};

updateMoneyBar();
