const state = {
  money: 250000,
  upgrades: {
    dryer: { name: "Dryer ACE", price: 100000, active: false },
    vibe: { name: "Vibe System", price: 75000, active: false },
    ots: { name: "Operator Training Sim", price: 50000, active: false }
  }
};

const shopDiv = document.getElementById("shop");
const moneyDiv = document.getElementById("money");
const proceedBtn = document.getElementById("proceedBtn");
const startPage = document.getElementById("start-page");
const uiDiv = document.getElementById("ui");
const startSound = document.getElementById("start-sound");
const cancelSound = document.getElementById("cancel-sound");
const beepSound = document.getElementById("beep-sound");
const simulationPage = document.getElementById("simulation-page");
const dryerResult = document.getElementById("dryer-result");
const continueBtn = document.getElementById("continueBtn");
const eventsPage = document.getElementById("events");
const typingSound = document.getElementById("typing-sound");

// Typewriter effect
const typewriterText = "You have been entrusted with using this year's budget to buy solutions to help the factory profit. You should use it carefully or you might lose it.";
const typewriterElement = document.getElementById("typewriter-text");
let currentIndex = 0;

function typeWriter() {
  if (currentIndex < typewriterText.length) {
    // Play typing sound for each character (but not on spaces)
    if (typewriterText[currentIndex] !== ' ') {
      typingSound.currentTime = 0; // Reset sound to beginning
      typingSound.play().catch(e => console.log('Audio play failed:', e));    }
    
    typewriterElement.innerHTML = typewriterText.substring(0, currentIndex + 1) + '<span class="cursor">|</span>';
    currentIndex++;
    setTimeout(typeWriter, 50); // Adjust speed here (50ms between characters)
  } else {
    // Show the continue arrow after typing is complete
    setTimeout(() => {
      document.getElementById("continue-arrow").style.display = "block";
    }, 1000);
  }
}

// Start the typewriter effect when the page loads
window.addEventListener('load', () => {
  setTimeout(typeWriter, 500); // Small delay before starting
});

const startBtn = document.getElementById("startBtn");

startBtn.onclick = () => {
  startPage.style.display = "none";
  uiDiv.style.display = "block";
  startSound.play();
};

function updateUI() {
  moneyDiv.textContent = `Money: €${state.money}`;
  shopDiv.innerHTML = "";

  for (const key in state.upgrades) {
    const item = state.upgrades[key];
    const btn = document.createElement("button");

    btn.textContent = item.active
      ? `Cancel ${item.name} (+€${item.price})`
      : `Buy ${item.name} (€${item.price})`;

    btn.disabled = !item.active && state.money < item.price;

    btn.onclick = () => {
      if (item.active) {
        cancelSound.play();
      } else {
        beepSound.play();
      }
      item.active = !item.active;
      state.money += item.active ? -item.price : item.price;
      updateUI();
    };

    shopDiv.appendChild(btn);
  }
}

proceedBtn.onclick = () => {
  uiDiv.style.display = "none";
  simulationPage.style.display = "block";

  if (state.upgrades.dryer.active) {
    dryerResult.textContent = "Dryer Ace has greatly reduced variability. 50k has been saved in costs!";
  } else {
    dryerResult.textContent = "The PID could not handle it. 50k lost.";
  }
};

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
