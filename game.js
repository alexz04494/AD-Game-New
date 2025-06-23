const state = {
  money: 500000,
  upgrades: {
    dryer: { 
      name: "Dryer ACE", 
      price: 250000, 
      active: false,
      description: "Advanced control expert that reduces pellet moisture variability and improves product quality."
    },
    vibe: { 
      name: "Vibe System", 
      price: 150000, 
      active: false,
      description: "Vibration monitoring system that detects equipment issues before they cause downtime."
    },
    ots: { 
      name: "Operator Training Sim", 
      price: 150000, 
      active: false,
      description: "Digital twin based training system that facilitates operator training and reduces human error."    },
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
const taskListPage = document.getElementById('task-list-page');
const taskListCard = document.getElementById('task-list-card');

const catalogueTextBox = document.querySelector('#catalogue-text-box .text-content');
const catalogueDialogue = catalogueTextBox ? catalogueTextBox.textContent : '';
if (catalogueTextBox) catalogueTextBox.textContent = '';

const dialogue = [
  "Welcome aboard, General Manager. The plant's performance is in your hands now — and so is a discretionary budget of €500000.",
  "Over the next two years, you'll have multiple chances to invest in upgrades and digital solutions. Each choice you make will shape the factory's future.",
  "Spend wisely. Your goal is simple: finish the 24-month run with as much money earned as possible. Good luck!"
];
let dialogueIndex = 0;
let isTyping = false;
let currentText = "";
let skipTyping = false;

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

function nextDialogue() {
  if (isTyping) {
    // If currently typing, skip to the end of current text
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
    catalogueMusic.volume = 0.1; // Set volume 
    catalogueMusic.play();
  }
}

function updateUI() {
  moneyBar.textContent = `€${state.money}`;

  // Clear shop and create single card
  shopDiv.innerHTML = "";

  const itemKey = shopItems[currentShopItem];
  const item = state.upgrades[itemKey];
  // Create card container
  const card = document.createElement("div");
  card.className = "shop-card";

  // Add signet to top left corner
  const signet = document.createElement("img");
  signet.className = "card-signet";
  signet.src = "assets/icons/signet.png";
  signet.alt = "ANDRITZ";
  card.appendChild(signet);

  if (item.name) {
    // Add title
    const title = document.createElement("h3");
    title.textContent = item.name;
    card.appendChild(title);

    // Add price
    const price = document.createElement("div");
    price.className = "price";
    price.textContent = `€${item.price}`;
    card.appendChild(price);

    // Add description
    const description = document.createElement("div");
    description.className = "description";
    description.textContent = item.description;
    card.appendChild(description);

    // Add button
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
      updateUI();};

    card.appendChild(btn);
  } else {
    signet.className = 'card-signet-large';
    card.classList.add('finish-card');
    // Add finish button
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

  // Add navigation arrow (positioned absolutely)
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

  // Add item counter (positioned absolutely)
  const counter = document.createElement("div");
  counter.className = "item-counter";
  counter.textContent = `${currentShopItem + 1}/${shopItems.length}`;
  card.appendChild(counter);

  shopDiv.appendChild(card);
}

function renderTaskListCard() {
  taskListCard.innerHTML = ''; // Clear previous content
  const signet = document.createElement("img");
  signet.className = "card-signet-large";
  signet.src = "assets/icons/signet.png";
  signet.alt = "ANDRITZ";
  taskListCard.appendChild(signet);
}

continueBtn.onclick = () => {
  simulationPage.style.display = "none";
  eventsPage.style.display = "block";

  let loss = 0;
  if (!state.upgrades.dryer.active) loss += 50000;
  if (!state.upgrades.vibe.active) loss += 30000;
  if (!state.upgrades.ots.active) loss += 20000;

  state.money -= loss;

  const result = document.getElementById("resultText");
  result.textContent = loss > 0
    ? `You lost €${loss} due to missing upgrades. Remaining: €${state.money}`
    : `Well done! All systems optimized. Remaining: €${state.money}`;
};

updateUI();
