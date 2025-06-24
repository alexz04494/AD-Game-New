const state = {
  money: 500000,
  upgrades: {
    moisture: {
      name: "ACE Moisture Control",
      price: 180000,
      active: false,
      description: "Advanced moisture control technology ensuring consistent pellet quality."
    },
    training: {
      name: "Operator Training Suite",
      price: 140000,
      active: false,
      description: "Comprehensive digital training tools that minimize human error."
    },
    traceability: {
      name: "Traceability & QA",
      price: 150000,
      active: false,
      description: "End-to-end traceability and quality assurance solution."
    },
    retrofit: {
      name: "PLC/SCADA Retrofit",
      price: 220000,
      active: false,
      description: "Modernized control systems with upgraded PLC/SCADA."
    },
    digitalTwin: {
      name: "Digital Twin & Predictive",
      price: 200000,
      active: false,
      description: "Predictive digital twin analytics for optimized operations."
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
  "Welcome aboard, General Manager. The plant's performance is in your hands now — and so is a discretionary budget of €500000.",
  "Over the next year, you'll have multiple chances to invest in upgrades and digital solutions. Each choice you make will shape the factory's future.",
  "Spend wisely. Your goal is simple: finish the 12-month run with as much money earned as possible. Good luck!"
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
const continueIndicator = document.getElementById("continue-indicator");

mainGamePage.addEventListener('click', nextDialogue);

startPage.onclick = () => {
  startPage.style.display = "none";
  mainGamePage.style.display = "block";
  beepSound.currentTime = 0;
  beepSound.play();
  mainThemeMusic.volume = 0.2;
  mainThemeMusic.play();
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
    currentText = dialogue[dialogueIndex];
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
    description.textContent = item.description;
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
  }

  const arrow = document.createElement("img");
  arrow.className = "nav-arrow";
  arrow.src = "assets/icons/1-next_back_arrow_game_application_mobile_up_down_left_right-256.webp";
  arrow.alt = "Next";
  arrow.onclick = () => {
    pageTurnSound.currentTime = 0;
    pageTurnSound.play();
    currentShopItem = (currentShopItem + 1) % shopItems.length;
    updateUI();
  };
  card.appendChild(arrow);

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
