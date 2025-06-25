const state = {
  money: 500000,
  upgrades: {
    moisture: {
      name: "ACE Moisture Control",
      price: 180000,
      active: false,
      description: "<p>Maintain pellet moisture with pinpoint accuracy, eliminating costly spec deviations and rework. ACE Moisture Control optimizes drying processes for consistent quality.</p><ul><li>Reduces moisture variability</li><li>Minimizes fines and rework</li><li>Improves product shelf life</li><li>Enhances buyer confidence</li></ul>"
    },
    training: {
      name: "Operator Training Suite",
      price: 140000,
      active: false,
      description: "<p>A comprehensive training platform designed to upskill your operators, reducing errors and downtime while enhancing operational safety and efficiency.</p><ul><li>Standardizes best practices</li><li>Improves operator confidence</li><li>Reduces human error & downtime</li><li>Supports continuous learning</li></ul>"
    },
    retrofit: {
      name: "Plant Solutions",
      price: 220000,
      active: false,
      description: "<p>Upgrade your legacy control systems to reduce faults, improve uptime, and integrate with modern analytics for smarter plant operations.</p><ul><li>PLC/SCADA retrofit</li><li>Full batch traceability</li><li>Reduces unplanned downtime</li><li>Future-proofs your automation</li></ul>"
    },
    plantInsights: {
      name: "Plant Insights with OEE",
      price: 175000,
      active: false,
      description: "<p>Track Overall Equipment Effectiveness (OEE) with precision to identify bottlenecks, reduce downtime, and maximize asset utilization.</p><ul><li>Monitors production efficiency</li><li>Identifies downtime causes</li><li>Supports continuous improvement</li><li>Drives better asset management</li></ul>"
    },
    finish: {
      name: "",
      price: 0,
      active: false,
      description: ""
    }
  }
};

let currentShopItem = 0;
const shopItems = Object.keys(state.upgrades);

const shopDiv = document.getElementById("shop");
const moneyBar = document.getElementById("money-bar");
const startPage = document.getElementById("start-page");
const uiDiv = document.getElementById("ui");
const mainGamePage = document.getElementById("main-game-page");
const startSound = document.getElementById("start-sound");
const cancelSound = document.getElementById("cancel-sound");
const beepSound = document.getElementById("beep-sound");
const simulationPage = document.getElementById("simulation-page");
const dryerResult = document.getElementById("dryer-result");
const continueBtn = document.getElementById("continueBtn");
const eventsPage = document.getElementById("events");
const typingSound = document.getElementById("typing-sound");
const pageTurnSound = document.getElementById("page-turn-sound");
const cashRegisterSound = document.getElementById("cash-register-sound");
const catalogueMusic = document.getElementById("catalogue-music");
const mainThemeMusic = document.getElementById("main-theme-music");
const incidentMusic = document.getElementById("incident-music");
const retroCoinSound = document.getElementById("retro-coin-sound");
const taskListPage = document.getElementById('task-list-page');
const pointsCounter = document.getElementById('points-counter');
const scenarioCounter = document.getElementById('scenario-counter');
const nextScenarioPrompt = document.getElementById('next-scenario-prompt');
let points = 0;
let currentScenario = 1;
const scenarioOptionsDiv = document.getElementById('scenario-options');
const optionDeploy = document.getElementById('option-deploy');
const optionManual = document.getElementById('option-manual');
const optionMaintenance = document.getElementById('option-maintenance');
const optionNothing = document.getElementById('option-nothing');

const catalogueTextBox = document.querySelector('#catalogue-text-box .text-content');
const catalogueDialogue = catalogueTextBox ? catalogueTextBox.textContent : '';
if (catalogueTextBox) catalogueTextBox.textContent = '';

const taskTextBox = document.querySelector('#task-text-box .text-content');
if (taskTextBox) taskTextBox.textContent = '';

const taskCharacterName = document.querySelector('#task-character-section .character-name');
const taskCharacterBox = document.getElementById('task-character-box');

let taskDialogue = [
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\u2019ve got a problem. Moisture levels in the pellets are reading nearly 2% above spec. We\u2019ve already had one buyer flag the last shipment, and others are threatening to reject deliveries." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "This isn\u2019t just about customer complaints \u2014 we could face penalties. And if word gets out, it\u2019ll hurt our reputation with the rest of the supply chain." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "Right. We need a response now. What do you want to do, general manager?" }
];
let taskDialogueIndex = 0;
let taskCurrentText = '';
let taskSkipTyping = false;

// Dialogue sequences triggered after selecting a scenario option
const deployAceDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Dryer ACE is online. You can see it stabilizing in real-time." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "Moisture\u2019s back within 0.5% of the target \u2014 and output is up. That\u2019s the best variability we\u2019ve had in weeks." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Confirmed. QA readings are clean across the board. No returns, no fines." },
  { name: 'Director', sprite: 'director.png', text: "Good decision. Also, energy use per ton is down by about 6%. That\u2019ll show up nicely in next month\u2019s numbers." }
];

const manualTuningDialogue = [
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\u2019ve started manual adjustments, but it\u2019s all over the place. The dryer doesn\u2019t respond consistently." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "8% of the product is off-spec. We\u2019re reacting too slowly \u2014 the operators can\u2019t keep up with the variability." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "That\u2019ll cost us. We\u2019re looking at fines or full batch rejections if this keeps up." }
];

const maintenanceDialogue = [
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "We\u2019ve got a technician en route, but parts of the system are too old to give us decent diagnostics. We\u2019re flying blind until we can isolate the issue." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "In the meantime, we\u2019re stuck running the line at half speed just to stay under moisture limits. That\u2019s not sustainable." },
  { name: 'Director', sprite: 'director.png', text: "We\u2019ll lose time and money on this. This isn\u2019t a fix \u2014 it\u2019s damage control." }
];

const doNothingDialogue = [
  { name: 'Production Manager', sprite: 'production manager.png', text: "Moisture levels continue drifting. We\u2019ve had three batches go out off-spec \u2014 and one\u2019s already come back." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Customer flagged the feed as noncompliant. We\u2019re now in breach of contract for that delivery." },
  { name: 'Director', sprite: 'directorclown.png', text: "I'm disappointed, General manager. Why did I hire you? You make me look like a clown." }
];

// ---------- Scenario 2 Dialogue ----------
const scenario2Intro = [
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "Mill 3 just went down — dead stop. No warnings, no alarms. We\u2019ve got a 500-ton order due in 36 hours, and we\u2019re already behind." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "It jammed mid-run. Could be a drive fault, maybe a bearing. I can\u2019t say for sure. But we\u2019re not grinding anything until it\u2019s cleared." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "We can\u2019t afford a long delay on this. What\u2019s the plan?" },
];

const scenario2DeployDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Pulling OEE diagnostics now... got it. Sensor flagged inconsistent load data before the stop — looks like a motor issue tied to the pre-cleaner cycle." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "That saved us a lot of time. We\u2019re already halfway through the fix." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\u2019ll be back on target. We just bought back a big chunk of our lead time." },
  { name: 'Director', sprite: 'director.png', text: "Nice recovery. System says we cut downtime by 40% compared to standard response." },
];

const scenario2ManualDialogue = [
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "They\u2019re checking the belts and drives now. It\u2019s slow going — access panels are tight on that line." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Took a while, but they found the fault — coupler alignment was off." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "The fix will take four hours. We\u2019re behind, but we can still hit the window if everything else holds." },
];

const scenario2TechDialogue = [
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "I called a tech from the vendor. He\u2019ll be here in an hour." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "They know the hardware, but they\u2019re expensive and usually take their time running full diagnostics." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "They found the issue, but we lost a lot of time and money already.." },
];

const scenario2NothingDialogue = [
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "We held off hoping it\u2019d reset or give us something in the logs. Nothing." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "Mill sat idle for ten hours before we even isolated the fault." },
  { name: 'Director', sprite: 'directorclown.png', text: "This delay puts the order at risk. Customer\u2019s going to feel it. What are you doing, general manager?" },
];

let scenarioDialogue = [];
let scenarioDialogueIndex = 0;

const dialogue = [
  { name: 'Director', sprite: 'director.png', text: 'Alright, let\u2019s get started \u2014 we\u2019ve had another rough quarter, and I want to hear where the bottlenecks really are.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We've missed moisture targets again \u2014ten batches were flagged by QA just last week. It\u2019s not just specs, it\u2019s throughput too. We\u2019re constantly adjusting the dryer, but it never settles. It\u2019s costing us output." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "I know. We had to stop the line twice last month. Same issue every time \u2014 the system doesn\u2019t alert us until it\u2019s too late. We\u2019re reactive, not proactive. That downtime\u2019s killing our delivery windows." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "And let\u2019s not forget the customer complaints. We've had three traceability requests we couldn\u2019t fully satisfy. If this happens during an audit we're in trouble" },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Frankly, we\u2019re stretching that PLC system past its limits. Half of it still runs on patched code from ten years ago. SCADA\u2019s sluggish, diagnostics are vague \u2014 it\u2019s no surprise things slip through." },
  { name: 'HR Officer', sprite: 'hrlady.png', text: "We\u2019ve had three serious errors this month alone, and they all came from new hires. They\u2019re not unmotivated \u2014 they just weren\u2019t ready. We\u2019re putting them on the floor before they understand the process." },
  { name: 'Director', sprite: 'director.png', text: "Alright. We\u2019ve aired enough for one morning. Here's the plan \u2014 next week, an ANDRITZ representative is coming to present some solutions they believe can help us get back on track." },
  { name: 'Director', sprite: 'director.png', text: 'General manager, I let the decision be up to you. Bring the plant back on its feet!' }
];

let dialogueIndex = 0;
let isTyping = false;
let currentText = "";
let skipTyping = false;

const textBox = document.getElementById("text-box");
let continueIndicator = document.getElementById("continue-indicator");

mainGamePage.addEventListener('click', nextDialogue);

startPage.onclick = () => {
  startPage.style.display = "none";
  mainGamePage.style.display = "block";
  beepSound.currentTime = 0;
  beepSound.play();
  
  // Start incident music for the first dialogue
  incidentMusic.volume = 0.2;
  incidentMusic.play();
  
  nextDialogue();
};

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

function typeWriterCatalogue(text, i) {
  if (!catalogueTextBox) return;
  if (i < text.length) {
    catalogueTextBox.textContent += text.charAt(i);
    typingSound.play();
    setTimeout(() => typeWriterCatalogue(text, i + 1), 30);
  }
}

let taskTypingTimeout = null;

function typeWriterTask(text, i, callback) {
  if (!taskTextBox) return;

  if (i === 0) {
    if (taskTypingTimeout) {
      clearTimeout(taskTypingTimeout);
    }
    taskTextBox.textContent = '';
  }

  if (taskSkipTyping) {
    taskTextBox.textContent = text;
    taskSkipTyping = false;
    taskTypingTimeout = null;
    if (callback) callback();
    return;
  }

  if (i < text.length) {
    taskTextBox.textContent += text.charAt(i);
    // Play sound only occasionally to avoid conflicts
    if (i % 2 === 0) {
      typingSound.currentTime = 0;
      typingSound.play();
    }
    taskTypingTimeout = setTimeout(() => typeWriterTask(text, i + 1, callback), 30);
  } else {
    taskTypingTimeout = null;
    if (taskDialogueIndex >= taskDialogue.length && !scenarioOptionsDiv.dataset.selected) {
      showScenarioOptions();
    }
    if (callback) callback();
  }
}

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

function setTaskSpeaker(entry) {
  if (taskCharacterName) {
    taskCharacterName.textContent = entry.name;
  }
  if (taskCharacterBox) {
    taskCharacterBox.innerHTML = '';
    if (entry.sprite) {
      const img = document.createElement('img');
      img.src = `assets/sprites/${entry.sprite}`;
      img.alt = entry.name;
      taskCharacterBox.appendChild(img);
    }
  }
}

function nextTaskDialogue() {
  if (taskTypingTimeout) {
    taskSkipTyping = true;
    return;
  }
  if (taskDialogueIndex < taskDialogue.length) {
    const entry = taskDialogue[taskDialogueIndex];
    setTaskSpeaker(entry);
    taskCurrentText = entry.text;
    typeWriterTask(taskCurrentText, 0);
    taskDialogueIndex++;
  } else {
    showScenarioOptions();
  }
}

function showScenarioOptions() {
  if (!scenarioOptionsDiv) return;
  scenarioOptionsDiv.style.display = 'flex';
  taskListPage.removeEventListener('click', nextTaskDialogue);

  optionDeploy.disabled = false;
  if (currentScenario === 1 && !state.upgrades.moisture.active) {
    optionDeploy.disabled = true;
  } else if (currentScenario === 2 && !state.upgrades.plantInsights.active) {
    optionDeploy.disabled = true;
  }

  const select = (pointsChange, dialogueArray) => {
    if (scenarioOptionsDiv.dataset.selected) return;
    scenarioOptionsDiv.dataset.selected = 'true';

    // Play retro coin sound when option is selected
    retroCoinSound.currentTime = 0;
    retroCoinSound.play();

    updatePoints(pointsChange);
    [optionDeploy, optionManual, optionMaintenance, optionNothing].forEach(btn => btn.disabled = true);

    scenarioOptionsDiv.style.display = 'none';
    scenarioDialogue = dialogueArray;
    scenarioDialogueIndex = 0;
    taskListPage.addEventListener('click', nextScenarioDialogue);
    nextScenarioDialogue();
  };

  if (currentScenario === 1) {
    optionDeploy.textContent = 'Deploy Dryer ACE';
    optionManual.textContent = 'Do manual tuning';
    optionMaintenance.textContent = 'Call maintenance';
    optionNothing.textContent = 'Do nothing';

    optionDeploy.onclick = () => select(25, deployAceDialogue);
    optionManual.onclick = () => select(-15, manualTuningDialogue);
    optionMaintenance.onclick = () => select(-10, maintenanceDialogue);
    optionNothing.onclick = () => select(-20, doNothingDialogue);
  } else if (currentScenario === 2) {
    optionDeploy.textContent = 'Deploy Plant Insights + OEE System';
    optionManual.textContent = 'Send Operators to Do Manual Checks';
    optionMaintenance.textContent = 'Call External Technician';
    optionNothing.textContent = 'Do Nothing';

    optionDeploy.onclick = () => select(20, scenario2DeployDialogue);
    optionManual.onclick = () => select(-5, scenario2ManualDialogue);
    optionMaintenance.onclick = () => select(-10, scenario2TechDialogue);
    optionNothing.onclick = () => select(-15, scenario2NothingDialogue);
  }
}

function nextScenarioDialogue() {
  if (taskTypingTimeout) {
    taskSkipTyping = true;
    return;
  }
  if (scenarioDialogueIndex < scenarioDialogue.length) {
    const entry = scenarioDialogue[scenarioDialogueIndex];
    setTaskSpeaker(entry);
    taskCurrentText = entry.text;
    const isLast = scenarioDialogueIndex === scenarioDialogue.length - 1;
    typeWriterTask(taskCurrentText, 0, () => {
      if (isLast) {
        nextScenarioPrompt.style.display = 'block';
      }
    });
    scenarioDialogueIndex++;
  } else {
    taskListPage.removeEventListener('click', nextScenarioDialogue);
    if (currentScenario === 1) {
      taskListPage.addEventListener('click', handleNextScenarioClick);
    }
  }
}

function handleNextScenarioClick() {
  taskListPage.removeEventListener('click', handleNextScenarioClick);
  nextScenarioPrompt.style.display = 'none';
  startScenarioTwo();
}

function startScenarioTwo() {
  currentScenario = 2;
  scenarioCounter.textContent = `SCENARIO ${currentScenario}`;
  scenarioOptionsDiv.dataset.selected = '';
  taskDialogue = scenario2Intro;
  taskDialogueIndex = 0;
  scenarioDialogueIndex = 0;
  taskListPage.style.backgroundImage = "url('assets/backgrounds/hammermillscene.png')";
  taskListPage.addEventListener('click', nextTaskDialogue);
  nextTaskDialogue();
}

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
    mainGamePage.style.display = "none";
    uiDiv.style.display = "block";
    mainGamePage.removeEventListener('click', nextDialogue);
    typeWriterCatalogue(catalogueDialogue, 0);
    incidentMusic.pause();
    catalogueMusic.volume = 0.1;
    catalogueMusic.play();
  }
}

function updateMoneyBar() {
  const moneyText = `€${state.money}`;
  moneyBar.textContent = moneyText;
}

function updatePoints(amount) {
  points += amount;
  
  // Determine the color class based on points value
  let colorClass = '';
  if (points > 0) {
    colorClass = 'points-positive';
  } else if (points < 0) {
    colorClass = 'points-negative';
  } else {
    colorClass = 'points-zero';
  }
  
  // Update the points counter with colored number
  pointsCounter.innerHTML = `POINTS: <span class="${colorClass}">${points}</span>`;
}

function updateUI() {
  updateMoneyBar();
  shopDiv.innerHTML = "";

  const itemKey = shopItems[currentShopItem];
  const item = state.upgrades[itemKey];
  const card = document.createElement("div");
  card.className = "shop-card";

  const signet = document.createElement("img");
  signet.className = "card-signet";
  signet.src = "assets/icons/signet.png";
  signet.alt = "ANDRITZ";
  card.appendChild(signet);

  if (item.name) {
    const title = document.createElement("h3");
    title.textContent = item.name;
    card.appendChild(title);

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = `€${item.price}`;
    card.appendChild(price);

    const description = document.createElement("div");
    description.className = "description";
    description.innerHTML = item.description;
    card.appendChild(description);

    const btn = document.createElement("button");
    btn.className = item.active ? "cancel-btn" : "buy-btn";
    btn.textContent = item.active ? `CANCEL (+€${item.price})` : `BUY`;
    btn.disabled = !item.active && state.money < item.price;
    btn.onclick = () => {
      if (item.active) {
        cancelSound.currentTime = 0;
        cancelSound.play();
      } else {
        cashRegisterSound.currentTime = 0;
        cashRegisterSound.play();
      }
      item.active = !item.active;
      state.money += item.active ? -item.price : item.price;
      updateUI();
    };
    card.appendChild(btn);
  } else {
    signet.className = 'card-signet-large';
    card.classList.add('finish-card');
    const btn = document.createElement("button");
    btn.className = "finish-selection-btn";
    btn.textContent = "Finish Selection";
    btn.onclick = () => {
      uiDiv.style.display = 'none';
      taskListPage.style.display = 'block';
      catalogueMusic.pause();
      incidentMusic.volume = 0.2;
      incidentMusic.play();
      updateMoneyBar();
      taskDialogueIndex = 0;
      scenarioCounter.textContent = `SCENARIO ${currentScenario}`;
      scenarioCounter.style.display = 'block';
      nextScenarioPrompt.style.display = 'none';
      nextTaskDialogue();
    };
    card.appendChild(btn);
  }  const arrow = document.createElement("img");
  arrow.className = "nav-arrow";
  arrow.src = "assets/icons/undo.svg";
  arrow.alt = "Next";
  arrow.onclick = () => {
    pageTurnSound.currentTime = 0;
    pageTurnSound.play();
    currentShopItem = (currentShopItem + 1) % shopItems.length;
    updateUI();
  };
  card.appendChild(arrow);

  // Add previous button for pages 2 onwards
  if (currentShopItem > 0) {
    const prevArrow = document.createElement("img");
    prevArrow.className = "nav-arrow-prev";
    prevArrow.src = "assets/icons/undo.svg";
    prevArrow.alt = "Previous";
    prevArrow.onclick = () => {
      pageTurnSound.currentTime = 0;
      pageTurnSound.play();
      currentShopItem = (currentShopItem - 1 + shopItems.length) % shopItems.length;
      updateUI();
    };
    card.appendChild(prevArrow);
  }

  const counter = document.createElement("div");
  counter.className = "item-counter";
  counter.textContent = `${currentShopItem + 1}/${shopItems.length}`;
  card.appendChild(counter);

  shopDiv.appendChild(card);
}


continueBtn.onclick = () => {
  simulationPage.style.display = "none";
  eventsPage.style.display = "block";

  let loss = 0;
  if (!state.upgrades.moisture.active) loss += 50000;
  if (!state.upgrades.training.active) loss += 20000;

  state.money -= loss;

  const result = document.getElementById("resultText");
  result.textContent = loss > 0
    ? `You lost €${loss} due to missing upgrades. Remaining: €${state.money}`
    : `Well done! All systems optimized. Remaining: €${state.money}`;
};

updateUI();
updatePoints(0);

taskListPage.addEventListener('click', nextTaskDialogue);
