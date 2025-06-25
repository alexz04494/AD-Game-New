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
    traceability: {
      name: "Traceability & QA Platform",
      price: 150000,
      active: false,
      description: "<p>Ensure full batch genealogy and instant QA reporting to meet audit demands and boost customer trust with this robust traceability system.</p><ul><li>Instant batch genealogy</li><li>Automated QA reporting</li><li>Simplifies compliance audits</li><li>Enhances product recall management</li></ul>"
    },
    retrofit: {
      name: "PLC/SCADA Retrofit",
      price: 220000,
      active: false,
      description: "<p>Upgrade your legacy control systems to reduce faults, improve uptime, and integrate with modern analytics for smarter plant operations.</p><ul><li>Reduces unplanned downtime</li><li>Improves control reliability</li><li>Enables integration with analytics</li><li>Future-proofs your automation</li></ul>"
    },
    digitalTwin: {
      name: "Digital Twin & Analytics",
      price: 200000,
      active: false,
      description: "<p>Leverage real-time simulation and analytics to predict issues before they occur, optimizing throughput and maintenance scheduling.</p><ul><li>Real-time operational insights</li><li>Predictive maintenance alerts</li><li>Optimizes throughput</li><li>Supports data-driven decisions</li></ul>"
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
const fireballSound = document.getElementById("fireball-sound");
const incidentMusic = document.getElementById("incident-music");
const taskListPage = document.getElementById('task-list-page');
const taskListCard = document.getElementById('task-list-card');
const moneyBarTasks = document.getElementById('money-bar-tasks');
const monthCounterTasks = document.getElementById('month-counter-tasks');

const taskCharacterImg = document.querySelector('#task-character-box img');
const taskCharacterName = document.querySelector('#task-character-section .character-name');

let incidentTriggered = false;
let incidentIndex = 0;

const catalogueTextBox = document.querySelector('#catalogue-text-box .text-content');
const catalogueDialogue = catalogueTextBox ? catalogueTextBox.textContent : '';
if (catalogueTextBox) catalogueTextBox.textContent = '';

const taskTextBox = document.querySelector('#task-text-box .text-content');
const taskDialogue = taskTextBox ? taskTextBox.textContent : '';
if (taskTextBox) taskTextBox.textContent = '';

const dialogue = [
  { name: 'Director', sprite: 'director.png', text: 'Alright, let\u2019s get started \u2014 we\u2019ve had another rough quarter, and I want to hear where the bottlenecks really are.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We've missed moisture targets again \u2014ten batches were flagged by QA just last week. It\u2019s not just specs, it\u2019s throughput too. We\u2019re constantly adjusting the dryer, but it never settles. It\u2019s costing us output." },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: "I know. We had to stop the line twice last month. Same issue every time \u2014 the system doesn\u2019t alert us until it\u2019s too late. We\u2019re reactive, not proactive. That downtime\u2019s killing our delivery windows." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "And let\u2019s not forget the customer complaints. We've had three traceability requests we couldn\u2019t fully satisfy. If this happens during an audit we're in trouble" },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Frankly, we\u2019re stretching that PLC system past its limits. Half of it still runs on patched code from ten years ago. SCADA\u2019s sluggish, diagnostics are vague \u2014 it\u2019s no surprise things slip through." },
  { name: 'HR Officer', sprite: 'hrlady.png', text: "We\u2019ve had three serious errors this month alone, and they all came from new hires. They\u2019re not unmotivated \u2014 they just weren\u2019t ready. We\u2019re putting them on the floor before they understand the process." },
  { name: 'Director', sprite: 'director.png', text: "Alright. We\u2019ve aired enough for one morning. Here's the plan \u2014 next week, an ANDRITZ representative is coming to present some solutions they believe can help us get back on track." },
  { name: 'Director', sprite: 'director.png', text: 'You, as General Manager, will have a budget of \u20ac500000. Choose carefully. The right decisions could turn this plant around.' }
];

const incidentDialogue = [
  { name: 'Director', sprite: 'director.avif', text: 'How could this have happened?' },
  { name: 'Operator', sprite: 'operator.webp', text: 'Sorry boss... I don\'t know how it happened' },
  { name: 'Director', sprite: 'director.avif', text: "We can't afford these kind of mistakes.. Maybe someone should’ve invested in proper training tools before this happened." }
];

function setIncidentSpeaker(entry) {
    const characterImg = document.querySelector('#task-character-box img');
    if (characterImg) {
        // Set the sprite source from the entry
        characterImg.src = `assets/sprites/${entry.sprite}`;
        
        // Add operator-specific class if it's the operator
        if (entry.name === 'Operator') {
            characterImg.classList.add('operator-sprite');
        } else {
            characterImg.classList.remove('operator-sprite');
        }
    }
    
    // Also update the character name
    const characterName = document.querySelector('#task-character-section .character-name');
    if (characterName) {
        characterName.textContent = entry.name;
    }
}

function nextIncidentDialogue() {
  // Clear autoplay timer if user manually proceeds
  if (incidentDialogueAutoplayTimer) {
    clearTimeout(incidentDialogueAutoplayTimer);
    incidentDialogueAutoplayTimer = null;
  }
  
  if (incidentIndex >= incidentDialogue.length) {
    taskListPage.removeEventListener('click', nextIncidentDialogue);
    return;
  }
  const entry = incidentDialogue[incidentIndex];
  
  // Ensure text is completely cleared before starting new text
  if (taskTextBox) {
    taskTextBox.textContent = '';
  }
  
  setIncidentSpeaker(entry);
  typeWriterTask(entry.text, 0);
  incidentIndex++;
}
let dialogueIndex = 0;
let isTyping = false;
let currentText = "";
let skipTyping = false;

// Autoplay timers
let mainDialogueAutoplayTimer = null;
let incidentDialogueAutoplayTimer = null;

const textBox = document.getElementById("text-box");
let continueIndicator = document.getElementById("continue-indicator");

mainGamePage.addEventListener('click', nextDialogue);

startPage.onclick = () => {
  startPage.style.display = "none";
  mainGamePage.style.display = "block";
  beepSound.currentTime = 0;
  beepSound.play();
  incidentMusic.volume = 0.2;
  incidentMusic.play();
  nextDialogue();
};

function typeWriter(text, i) {
  isTyping = true;
  continueIndicator.style.opacity = '0';
  
  // Clear any existing autoplay timer
  if (mainDialogueAutoplayTimer) {
    clearTimeout(mainDialogueAutoplayTimer);
    mainDialogueAutoplayTimer = null;
  }
  
  if (skipTyping) {
    textBox.firstChild.textContent = text;
    isTyping = false;
    skipTyping = false;
    continueIndicator.style.opacity = '1';
    // Start autoplay timer when typing is complete
    mainDialogueAutoplayTimer = setTimeout(() => {
      nextDialogue();
    }, 5000);
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
    // Start autoplay timer when typing is complete
    mainDialogueAutoplayTimer = setTimeout(() => {
      nextDialogue();
    }, 5000);
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

function typeWriterTask(text, i) {
  if (!taskTextBox) return;

  if (i === 0) {
    if (taskTypingTimeout) {
      clearTimeout(taskTypingTimeout);
    }
    // Clear any existing autoplay timer
    if (incidentDialogueAutoplayTimer) {
      clearTimeout(incidentDialogueAutoplayTimer);
      incidentDialogueAutoplayTimer = null;
    }
    taskTextBox.textContent = '';
  }

  if (i < text.length) {
    taskTextBox.textContent += text.charAt(i);
    // Play sound only occasionally to avoid conflicts
    if (i % 2 === 0) {
      typingSound.currentTime = 0;
      typingSound.play();
    }
    taskTypingTimeout = setTimeout(() => typeWriterTask(text, i + 1), 30);
  } else {
    taskTypingTimeout = null;
    // Start autoplay timer when typing is complete (only for incident dialogue)
    if (incidentIndex > 0 && incidentIndex <= incidentDialogue.length) {
      incidentDialogueAutoplayTimer = setTimeout(() => {
        nextIncidentDialogue();
      }, 5000);
    }
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

function nextDialogue() {
  // Clear autoplay timer if user manually proceeds
  if (mainDialogueAutoplayTimer) {
    clearTimeout(mainDialogueAutoplayTimer);
    mainDialogueAutoplayTimer = null;
  }
  
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
    mainThemeMusic.pause();
    catalogueMusic.volume = 0.1;
    catalogueMusic.play();
  }
}

function updateMoneyBars() {
  const moneyText = `€${state.money}`;
  moneyBar.textContent = moneyText;
  moneyBarTasks.textContent = moneyText;
}

function updateUI() {
  updateMoneyBars();
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
      mainThemeMusic.play();
      renderTaskListCard();
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

function renderTaskListCard() {
  updateMoneyBars();
  monthCounterTasks.textContent = "MONTH: 1/12";
  taskListCard.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'shop-card';

  const signet = document.createElement('img');
  signet.className = 'card-signet';
  signet.src = 'assets/icons/signet.png';
  signet.alt = 'ANDRITZ';
  card.appendChild(signet);

  const title = document.createElement('h3');
  title.textContent = 'Task List';
  card.appendChild(title);

  const list = document.createElement('div');
  list.className = 'task-list';

  const tasks = [
    'Review Production Report',
    'Sign Purchase Orders',
    'Approve Maintenance Log',
    'Confirm Shipping Schedule',
    'Approve Staff Timesheet'
  ];

  tasks.forEach((text, index) => {
    const label = document.createElement('label');
    label.className = 'task-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index + 1}`;

    const span = document.createElement('span');
    span.textContent = text;

    label.appendChild(checkbox);
    label.appendChild(span);
    list.appendChild(label);
  });

  card.appendChild(list);
  const finishBtn = document.createElement('button');
  finishBtn.className = 'finish-month-btn';
  finishBtn.textContent = 'Proceed';
  finishBtn.disabled = true; // Start as disabled
  card.appendChild(finishBtn);

  taskListCard.appendChild(card);
  typeWriterTask(taskDialogue, 0);

  const pencilSound = document.getElementById('pencil-check-sound');
  const allCheckboxes = list.querySelectorAll('input[type="checkbox"]');
  
  // Function to check if all tasks are completed
  function checkAllTasksCompleted() {
    const completedTasks = list.querySelectorAll('input[type="checkbox"]:checked').length;
    const totalTasks = allCheckboxes.length;
    
    if (completedTasks === totalTasks) {
      finishBtn.disabled = false;
      finishBtn.classList.add('enabled');
    } else {
      finishBtn.disabled = true;
      finishBtn.classList.remove('enabled');
    }
  }
  
  allCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        pencilSound.currentTime = 0;
        pencilSound.play();
        cb.disabled = true;
      }
      checkAllTasksCompleted();
    });
  });

  // Initial check
  checkAllTasksCompleted();

  finishBtn.addEventListener('click', () => {
    if (!state.upgrades.training.active && !incidentTriggered) {
      incidentTriggered = true;
      fireballSound.currentTime = 0;
      fireballSound.play();
      mainThemeMusic.pause();
      incidentMusic.volume = 0.2;
      incidentMusic.play();
      renderIncidentCard();
    }
  });
}

function renderIncidentCard() {
  updateMoneyBars();
  taskListCard.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'shop-card';

  const signet = document.createElement('img');
  signet.className = 'card-signet';
  signet.src = 'assets/icons/signet.png';
  signet.alt = 'ANDRITZ';
  card.appendChild(signet);

  const title = document.createElement('h3');
  title.className = 'incident-title';
  title.textContent = 'Incident Report';
  card.appendChild(title);

  const desc = document.createElement('div');
  desc.className = 'incident-description';
  desc.textContent = 'An operator deviated from standard procedure during a routine task, resulting in production delays and material waste. Root cause analysis indicates inadequate familiarity with updated protocols.';
  card.appendChild(desc);

  taskListCard.appendChild(card);

  incidentIndex = 0;
  nextIncidentDialogue();
  taskListPage.addEventListener('click', nextIncidentDialogue);
}

continueBtn.onclick = () => {
  simulationPage.style.display = "none";
  eventsPage.style.display = "block";

  let loss = 0;
  if (!state.upgrades.moisture.active) loss += 50000;
  if (!state.upgrades.traceability.active) loss += 30000;
  if (!state.upgrades.training.active) loss += 20000;

  state.money -= loss;

  const result = document.getElementById("resultText");
  result.textContent = loss > 0
    ? `You lost €${loss} due to missing upgrades. Remaining: €${state.money}`
    : `Well done! All systems optimized. Remaining: €${state.money}`;
};

updateUI();
