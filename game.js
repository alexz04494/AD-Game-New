// Simplified game logic for monthly scenarios

const state = {
  money: 200000,
  upgrades: {
    moisture: {
      name: "Metris Dryer ACE",
      price: 150000,
      owned: false,
      justPurchased: false,
      passive: 50000,
      description:
        "<p>Maintain pellet moisture with pinpoint accuracy, eliminating costly spec deviations and rework. ACE Moisture Control optimizes drying processes for consistent quality.</p>"
    },
    training: {
      name: "Metris Operator Training Suite",
      price: 200000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>A comprehensive training platform designed to upskill your operators, reducing errors and downtime while enhancing operational safety and efficiency.</p>"
    },
    retrofit: {
      name: "Plant automation upgrade",
      price: 225000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>Upgrade your legacy control systems to reduce faults, improve uptime, and integrate with modern analytics for smarter plant operations.</p>"
    },
    digitalTwin: {
      name: "Metris Asset management",
      price: 150000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>Leverage real-time simulation and analytics to predict issues before they occur, optimizing throughput and maintenance scheduling.</p>"
    },
    plantInsights: {
      name: "Metris Plant Insights with OEE",
      price: 120000,
      owned: false,
      justPurchased: false,
      passive: 0,
      description:
        "<p>Track Overall Equipment Effectiveness (OEE) with precision to identify bottlenecks, reduce downtime, and maximize asset utilization.</p>"
    }
  }
};

const totalMonths = 5;
let currentMonth = 1;

// DOM elements
const shopDiv = document.getElementById("shop");
const moneyBar = document.getElementById("money-bar");
const startPage = document.getElementById("start-page");
const mainGamePage = document.getElementById("main-game-page");
const uiDiv = document.getElementById("ui");
const catalogueBack = document.getElementById("catalogue-back");

const monthCounter = document.getElementById("month-counter");
const introScreen = document.getElementById("intro-screen");
const rulesPage = document.getElementById("rules-page");
const rulesNextBtn = document.getElementById("rules-next-btn");
const scenarioPage = document.getElementById("scenario-page");
const scenarioCard = document.getElementById("scenario-card");
const scenarioNextBtn = document.getElementById("scenario-next-btn");
const performanceReportPage = document.getElementById("performance-report-page");
const performanceReportCard = document.getElementById("performance-report-card");
const reportNextBtn = document.getElementById("report-next-btn");
const finalReportContainer = document.getElementById("performance-report-container");
const monthTransition = document.getElementById("month-transition");
const monthTransitionText = document.querySelector('#month-transition .transition-text');
const monthTransitionImages = document.querySelectorAll('#month-transition img');

// Audio elements
const beepSound = document.getElementById("beep-sound");
const typingSound = document.getElementById("typing-sound");
const catalogueMusic = document.getElementById("catalogue-music");
const mainThemeMusic = document.getElementById("main-theme-music");
const cashRegisterSound = document.getElementById("cash-register-sound");
const cancelSound = document.getElementById("cancel-sound");
const fireballSound = document.getElementById("fireball-sound");
const incidentMusic = document.getElementById("incident-music");
const endMusic = document.getElementById("end-music");

// Dialogue setup
const dialogue = [
  { name: 'Director', sprite: 'director.png', text: 'Alright, let\u2019s get started \u2014 we\u2019ve had another rough quarter, and I want to hear where the bottlenecks really are.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\'ve missed moisture targets again \u2014ten batches were flagged by QA just last week. It\u2019s not just specs, it\u2019s throughput too. We\u2019re constantly adjusting the dryer, but it never settles. It\u2019s costing us output." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "I know. We had to stop the line twice last month. Same issue every time \u2014 the system doesn\u2019t alert us until it\u2019s too late. We\u2019re reactive, not proactive. That downtime\u2019s killing our delivery windows." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Frankly, we\u2019re stretching that PLC system past its limits. Half of it still runs on patched code from ten years ago. SCADA\u2019s sluggish, diagnostics are vague \u2014 it\u2019s no surprise things slip through." },
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
    setTimeout(() => typeWriter(text, i), 5);
  } else {
    isTyping = false;
    continueIndicator.style.opacity = '1';
  }
}

startPage.onclick = () => {
  startPage.style.display = "none";
  introScreen.style.display = "flex";
  beepSound.currentTime = 0;
  beepSound.play();
  mainThemeMusic.volume = 0.2;
  mainThemeMusic.play();
  
  // After 4 seconds total (fade in + 2 seconds + fade out), cut directly to main game page
  setTimeout(() => {
    introScreen.style.display = 'none';
    mainGamePage.style.display = 'block';
    nextDialogue();
  }, 4000);
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
    rulesPage.style.display = 'flex';
    mainGamePage.removeEventListener('click', nextDialogue);
    // Keep main theme playing instead of switching to catalogue music
    mainThemeMusic.volume = 0.2;
    // Don't pause main theme, let it continue playing
  }
}

function updateMoneyBar() {
  moneyBar.textContent = `€${state.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function updateShop() {
  monthCounter.style.display = "none";
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
    startMonth();
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
    title: 'Incident - Moisture Surge in dryer',
    text: 'Unexpected monsoon rains have raised humidity in the intake air, throwing off the plant\'s dryers. Tuned for dry-season conditions, they now struggle to maintain moisture targets. Operators can\'t keep up manually, and even a 1% deviation risks compliance issues, customer rejections, and costly rework.',
    apply: () => {
      const wins = [];
      const neutrals = [];
      const losses = [];

      if (state.upgrades.moisture.owned) {
        state.money += 60000;
        wins.push('Dryer ACE: +60k');
        neutrals.push('120k loss avoided due to Dryer ACE');
      } else {
        state.money -= 120000;
        losses.push('Without Dryer ACE you lost 120k.');
      }

      if (state.upgrades.training.owned) {
        state.money += 20000;
        wins.push('Operator Training Suite: +20k');
      }


      if (state.upgrades.plantInsights.owned) {
        state.money += 10000;
        wins.push('Plant Insights with OEE: +10k');
      }

  return { wins, neutrals, losses };
    }
  },
  {
    title: 'Incident - Subtle anomalies in line 2',
    text:
      "Subtle anomalies have begun to surface in Line 2, the plant\u2019s highest-volume extruder. Over the past few days, minor fluctuations in energy consumption and vibration levels have been recorded\u2014just enough to raise concern, but still within what\u2019s often dismissed as operational variance.",
    
    apply: () => {
      const wins = [];
      const neutrals = [];
      const losses = [];

      if (state.upgrades.moisture.owned) {
        state.money += 30000;
        wins.push('Dryer ACE: +30k');
      }

      if (state.upgrades.training.owned) {
        state.money += 10000;
        wins.push('Operator Training Suite: +10k');
      }

      if (state.upgrades.digitalTwin.owned) {
        state.money += 20000;
        wins.push('Asset management: +20k');
      }

      if (state.upgrades.plantInsights.owned) {
        state.money += 50000;
        wins.push('Plant Insights with OEE: +50k');
        neutrals.push('120k loss avoided due to Plant Insights');
      } else {
        state.money -= 120000;
        losses.push('Without Plant Insights you lost 120k.');
      }

      return { wins, neutrals, losses };
    }
  },
  {
    title: 'Incident - Major client orders spike',
    text:
      'A major customer places a rush order, requiring the mill to increase throughput by 15%. This sudden spike is a chance to generate extra revenue, but only plants equipped with the right digital tools can respond quickly enough.',
    apply: () => {
      const wins = [];
      const neutrals = [];
      const losses = [];

      if (state.upgrades.moisture.owned) {
        state.money += 50000;
        wins.push('Dryer ACE: +50k');
      }
      if (state.upgrades.retrofit.owned) {
        state.money += 80000;
        wins.push('Plant automation upgrade: +80k');
      }
      if (state.upgrades.training.owned) {
        state.money += 10000;
        wins.push('Operator Training Suite: +10k');
      }
      if (state.upgrades.digitalTwin.owned) {
        state.money += 10000;
        wins.push('Asset management: +10k');
      }
      if (state.upgrades.plantInsights.owned) {
        state.money += 10000;
        wins.push('Plant Insights with OEE: +10k');
      }
      return { wins, neutrals, losses };
    }
  },
  {
    title: 'Incident - Training crisis',
    text:
      'Midway through the quarter, your most experienced extruder operator resigns unexpectedly. The new hire is unfamiliar with the complex settings, and downtime increases.',
    apply: () => {
      const wins = [];
      const neutrals = [];
      const losses = [];

      if (state.upgrades.moisture.owned) {
        state.money += 30000;
        wins.push('Dryer ACE: +30k');
      }

      if (state.upgrades.training.owned) {
        state.money += 100000;
        wins.push('Operator Training Suite: +100k');
      }

      if (state.upgrades.retrofit.owned) {
        state.money += 10000;
        wins.push('Plant automation upgrade: +10k');
      }

      if (state.upgrades.digitalTwin.owned) {
        state.money += 10000;
        wins.push('Asset management: +10k');
      }

      if (state.upgrades.plantInsights.owned) {
        state.money += 10000;
        wins.push('Plant Insights with OEE: +10k');
      }

      return { wins, neutrals, losses };
    }
  },
  {
    title: 'Incident - PLC Failure - Plant Shutdown',
    text:
      'A central PLC fails unexpectedly. No automation or control functions respond. Without system-level backup, the plant halts, resulting in lost production and contract delays.',
    apply: () => {
      const wins = [];
      const neutrals = [];
      const losses = [];

      if (state.upgrades.moisture.owned) {
        state.money += 50000;
        wins.push('Dryer ACE: +50k');
      }

      if (state.upgrades.training.owned) {
        state.money += 10000;
        wins.push('Operator Training Suite: +10k');
      }

      if (state.upgrades.digitalTwin.owned) {
        state.money += 10000;
        wins.push('Asset management: +10k');
      }

      if (state.upgrades.plantInsights.owned) {
        state.money += 10000;
        wins.push('Plant Insights with OEE: +10k');
      }

      if (state.upgrades.retrofit.owned) {
        state.money += 100000;
        wins.push('Plant automation upgrade: +100k');
        neutrals.push('100k loss avoided due to Plant automation upgrade');
      } else {
        state.money -= 100000;
        losses.push('Without Plant automation upgrade you lost 100k.');
      }


      return { wins, neutrals, losses };
    }
  }
];

function showMonthTransition(callback) {
  if (!monthTransition) {
    callback();
    return;
  }
  monthTransition.style.display = 'flex';
  monthTransitionText.style.opacity = 1;

  // Simple 3-second black screen with text animation
  setTimeout(() => {
    monthTransition.style.display = 'none';
    if (callback) callback();
  }, 3000);
}

function startMonth() {
  Object.values(state.upgrades).forEach(u => {
    if (u.justPurchased) {
      u.justPurchased = false;
    }
  });
  applyPassiveIncome();
  monthCounter.textContent = `Month ${currentMonth}/${totalMonths}`;
  monthCounter.style.display = 'block';
  uiDiv.style.display = 'none';
  moneyBar.style.display = 'block';
  catalogueMusic.pause();
  mainThemeMusic.volume = 0.2;
  mainThemeMusic.play();
  showMonthTransition(showScenario);
}

function showScenario() {
  scenarioPage.style.display = 'flex';
  scenarioCard.innerHTML = '';
  
  // Add month-specific class for background
  scenarioPage.className = `month-${currentMonth}`;
  
  mainThemeMusic.pause();
  incidentMusic.currentTime = 0;
  incidentMusic.play();
  fireballSound.volume = 0.05;
  fireballSound.currentTime = 0;
  fireballSound.play();

  const scenario = scenarios[currentMonth - 1];
  
  // Check if this is an incident and add CSS classes accordingly
  const isIncident = scenario.title && scenario.title.includes('Incident');
  if (isIncident) {
    scenarioPage.classList.add('incident-scenario');
    scenarioCard.classList.add('incident-card');
  } else {
    scenarioPage.classList.remove('incident-scenario');
    scenarioCard.classList.remove('incident-card');
  }

  // Add title if it exists
  if (scenario.title) {
    const title = document.createElement('h2');
    title.textContent = scenario.title;
    title.style.cssText = 'color: #0075be; font-family: "Press Start 2P", cursive; font-size: 1rem; margin-bottom: 30px; text-align: center; line-height: 1.4;';
    scenarioCard.appendChild(title);
  }

  const p = document.createElement('p');
  p.textContent = scenario.text;
  // Use larger font size for incidents, normal size for regular scenarios
  const fontSize = isIncident ? '1.3rem' : '1.1rem';
  p.style.cssText = `line-height: 1.6; margin-bottom: 20px; font-size: ${fontSize}; margin-top: 20px;`;
  scenarioCard.appendChild(p);

  // Add optional extra header and description
  if (scenario.extraHeader) {
    const extraHeader = document.createElement('h3');
    extraHeader.textContent = scenario.extraHeader;
    extraHeader.style.cssText =
      'color: #00aa00; font-family: "Press Start 2P", cursive; font-size: 1rem; margin-bottom: 10px; text-align: center; line-height: 1.4;';
    scenarioCard.appendChild(extraHeader);
  }

  if (scenario.extraText) {
    const extraP = document.createElement('p');
    extraP.textContent = scenario.extraText;
    extraP.className = 'incident-description';
    scenarioCard.appendChild(extraP);
  }
  // Don't apply scenario effects yet - that happens in the performance report
}

function showPerformanceReport() {
  scenarioPage.style.display = 'none';
  performanceReportPage.style.display = 'flex';

  // Switch music back to the main theme
  incidentMusic.pause();
  mainThemeMusic.currentTime = 0;
  mainThemeMusic.volume = 0.2;
  mainThemeMusic.play();

  performanceReportCard.innerHTML = '';
  
  // Add "Performance Report" title
  const title = document.createElement('h2');
  title.textContent = 'PERFORMANCE REPORT';
  title.style.cssText = 'color: #0075be; font-family: "Press Start 2P", cursive; font-size: 1.2rem; margin-bottom: 20px; text-align: center; line-height: 1.4;';
  performanceReportCard.appendChild(title);
  
  // Apply scenario effects and show results
  const scenario = scenarios[currentMonth - 1];
  const result = scenario.apply();

  // Global monthly bonus
  state.money += 100000;
  result.wins.push('Cash flow from production: +100k');

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

  // Update next button label depending on month
  if (currentMonth === totalMonths) {
    reportNextBtn.textContent = 'Finalize';
  } else {
    reportNextBtn.textContent = 'Continue';
  }
}

function showFinalReport() {
  mainThemeMusic.pause();
  catalogueMusic.pause();
  incidentMusic.pause();
  endMusic.volume = 0.2;
  endMusic.play();

  uiDiv.style.display = 'none';
  performanceReportPage.style.display = 'none';

  finalReportContainer.innerHTML = '';
  finalReportContainer.style.display = 'flex';
  document.body.classList.add('end-year-scene');

  const card = document.createElement('div');
  card.className = 'shop-card catalogue-card final-report-card';

  const title = document.createElement('h2');
  title.textContent = 'Final Report';
  title.style.cssText = 'color: #0075be; font-family: "Press Start 2P", cursive; font-size: 1.2rem; margin-bottom: 20px; text-align: center; line-height: 1.4;';
  card.appendChild(title);

  const moneyLine = document.createElement('div');
  moneyLine.className = 'performance-report-line';
  moneyLine.textContent = `Final balance: €${state.money.toLocaleString()}`;
  card.appendChild(moneyLine);

  const percent = Math.max(0, Math.min(100, Math.round((state.money / 900000) * 100)));
  const percentLine = document.createElement('div');
  percentLine.className = 'performance-report-line';
  percentLine.textContent = `Score: ${percent}%`;
  card.appendChild(percentLine);

  let badge = '';
  let badgeClass = '';
  let badgeIcon = '';
  if (state.money < 300000) {
    badge = 'Dismissed';
    badgeClass = 'badge-dismissed';
    badgeIcon = 'assets/icons/firedbadge.png';
  } else if (state.money <= 650000) {
    badge = 'Mindful Manager';
    badgeClass = 'badge-success';
    badgeIcon = 'assets/icons/okbadge.png';
  } else {
    badge = 'Certified Operational Leader';
    badgeClass = 'badge-success';
    badgeIcon = 'assets/icons/bestbadge.png';
  }

  const badgeLine = document.createElement('div');
  badgeLine.className = 'performance-report-line';
  badgeLine.innerHTML = `Badge: <span class="${badgeClass}">${badge}</span>`;
  card.appendChild(badgeLine);

  const icon = document.createElement('img');
  icon.src = badgeIcon;
  icon.alt = badge;
  icon.className = 'performance-badge-icon';
  if (badge === 'Certified Operational Leader') {
    icon.classList.add('best-badge-icon');
  } else if (badge === 'Dismissed') {
    icon.classList.add('dismissed-badge-icon');
  }
  card.appendChild(icon);

  finalReportContainer.appendChild(card);
}

// Rules page next button - go to shop
rulesNextBtn.onclick = () => {
  rulesPage.style.display = 'none';
  uiDiv.style.display = 'block';
  moneyBar.style.display = 'block';
  // Switch from main theme to catalogue music when entering shop
  mainThemeMusic.pause();
  catalogueMusic.volume = 0.1;
  catalogueMusic.play();
  updateShop();
};

// Scenario page next button - go to performance report
scenarioNextBtn.onclick = () => {
  showPerformanceReport();
};

// Performance report next button - continue or finalize
reportNextBtn.onclick = () => {
  performanceReportPage.style.display = 'none';
  if (currentMonth === totalMonths) {
    showFinalReport();
    monthCounter.style.display = 'none';
  } else {
    currentMonth++;
    mainThemeMusic.pause();
    incidentMusic.pause();
    catalogueMusic.volume = 0.1;
    catalogueMusic.play();
    uiDiv.style.display = 'block';
    updateShop();
  }
};

updateMoneyBar();
