const state = {
  money: 365000,
  upgrades: {
    moisture: {
      name: "ACE Moisture Control",
      price: 120000,
      active: false,
      description: "<p>Maintain pellet moisture with pinpoint accuracy, eliminating costly spec deviations and rework. ACE Moisture Control optimizes drying processes for consistent quality.</p><ul><li>Reduces moisture variability</li><li>Minimizes fines and rework</li><li>Improves product shelf life</li><li>Enhances buyer confidence</li></ul>"
    },
    training: {
      name: "Operator Training Suite",
      price: 120000,
      active: false,
      description: "<p>A comprehensive training platform designed to upskill your operators, reducing errors and downtime while enhancing operational safety and efficiency.</p><ul><li>Standardizes best practices</li><li>Improves operator confidence</li><li>Reduces human error & downtime</li><li>Supports continuous learning</li></ul>"
    },
    retrofit: {
      name: "Plant Solutions",
      price: 150000,
      active: false,
      description: "<p>Upgrade your legacy control systems to reduce faults, improve uptime, and integrate with modern analytics for smarter plant operations.</p><ul><li>PLC/SCADA retrofit</li><li>Full batch traceability</li><li>Reduces unplanned downtime</li><li>Future-proofs your automation</li></ul>"
    },
    digitalTwin: {
      name: "Digital Twin & Predictive",
      price: 150000,
      active: false,
      description: "<p>Leverage real-time simulation and analytics to predict issues before they occur, optimizing throughput and maintenance scheduling.</p><ul><li>Real-time operational insights</li><li>Predictive maintenance alerts</li><li>Optimizes throughput</li><li>Supports data-driven decisions</li></ul>"
    },
    plantInsights: {
      name: "Plant Insights with OEE",
      price: 95000,
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
const endMusic = document.getElementById("end-music");
const taskListPage = document.getElementById('task-list-page');
const pointsCounter = document.getElementById('points-counter');
const scenarioCounter = document.getElementById('scenario-counter');
const nextScenarioPrompt = document.getElementById('next-scenario-prompt');
let points = 0;
let currentScenario = 1;
let endOfYear = false;
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
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "We\u2019re getting erratic readings from the dryers. The ambient air\u2019s loaded with moisture \u2014 likely due to the rain. Baseline tuning isn\u2019t holding anymore." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "It\u2019s mid-monsoon. Intake air is way wetter than expected. The dryers can\u2019t stabilize, and operators are falling behind adjusting it manually." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Moisture levels are bouncing around \u2014 we\u2019re dangerously close to being out of spec on multiple batches." },
  { name: 'Director', sprite: 'director.png', text: "We need a solution now. If this continues, we\u2019ll have to dump product or take penalties." }
];
let taskDialogueIndex = 0;
let taskCurrentText = '';
let taskSkipTyping = false;

// Dialogue sequences triggered after selecting a scenario option
const deployAceDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Dryer ACE just compensated \u00b10.4% moisture in 15 seconds. Humidity spike caught and corrected." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "QA trending stays green\u2014no off-spec risk despite the monsoon levels." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "Good. Keep production at full rate; no reruns today, even with this air." },
  { name: 'Director', sprite: 'director.png', text: "Energy profile looks smoother, too. ACE is earning its keep." }
];

const manualTuningDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Humidity spike detected. Dryers are drifting hard with the ambient swings." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "Manual adjustment in progress\u2014but it's slow. We'll need rework." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "8% of pellets already outside spec. We\u2019ll need rework if this keeps up." },
  { name: 'Director of Operations', sprite: 'director.png', text: "Call maintenance and log the fine; we can\u2019t ship this under current conditions." }
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

// ---------- Scenario 3 Dialogue ----------
const scenario3Intro = [
  { name: 'Regulatory Auditor', sprite: 'auditor.png', text: "We\u2019re conducting a spot check on batch lot #8462. I\u2019ll need full traceability data\u2014inputs, processing timestamps, output routing. Live, if possible." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Understood. I\u2019ll start pulling the lot genealogy now\u2026 just a moment." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Heads up\u2014system\u2019s under load. If the PLC chokes again, we could lose connection mid-query." },
  { name: 'Director of Operations', sprite: 'director.png', text: "Let\u2019s not give them a reason to question our process. Handle it fast\u2014keep production running." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "If this delays output, we\u2019ll miss the afternoon load. Let\u2019s not make this a bigger mess than it already is." },
];

const scenario3DigitalDialogue = [
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Audit request received. Pulling lot genealogy now\u2026 one click." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Upgraded PLC stayed online; data is streaming clean\u2014no gaps." },
  { name: 'Regulatory Auditor', sprite: 'auditor.png', text: "Trace complete. All checkpoints match. Compliance clear." },
  { name: 'Director of Operations', sprite: 'director.png', text: "Perfect\u2014zero downtime and the audit\u2019s passed. That keeps us on the preferred list." },
];

const scenario3ManualDialogue = [
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Paper logs are missing two batches\u2026 audit\u2019s on hold while we hunt them down." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Legacy PLC just crashed during the export; whole line is idle." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\u2019ll recall the last three days of product to be safe. That\u2019s the only way to cover the gap." },
  { name: 'Director of Operations', sprite: 'director.png', text: "Costly hit\u2014production lost, and the client\u2019s already questioning our reliability." },
];

const scenario3RetestDialogue = [
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "We\u2019ll recheck the entire batch manually\u2014retest all retained samples against the product spec. It\u2019ll take time, and I\u2019ll need every QA hand on it." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "That\u2019s going to delay outbound inspections and tie up half the floor. But it\u2019s better than failing the audit outright." },
  { name: 'Director of Operations', sprite: 'director.png', text: "Do what you need to. We can\u2019t afford missing data in front of the client." },
];

const scenario3NothingDialogue = [
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "We\u2019ve halted the outbound lot until we can verify it fully. No trace, no movement." },
  { name: 'Regulatory Auditor', sprite: 'auditor.png', text: "That\u2019s the right call from a compliance standpoint." },
  { name: 'Director of Operations', sprite: 'director.png', text: "Client\u2019s not happy. There\u2019s talk of pulling future orders. We might lose the account over this." },
];

// ---------- Scenario 4 Dialogue ----------
const scenario4Intro = [
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: 'Packaging just flagged a vitamin premix off-ratio. Night-shift rookie entered the wrong set-point in batching.' },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: 'Confirmed. Formula deviation started two hours ago.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'Our new operators are unprepared. We need some way to avoid this in the future' },
  { name: 'Director', sprite: 'director.png', text: 'Options?' },
];

const scenario4OTSDialogue = [
  { name: 'New operator', sprite: 'operator.png', text: 'Sim drill covered this. Correcting set-point now.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'Good catch\u2014no scrap generated.' },
  { name: 'Director', sprite: 'director.png', text: 'OTS pays for itself every shift.' },
];

const scenario4SupervisorDialogue = [
  { name: 'Production Manager', sprite: 'production manager.png', text: 'Supervisor\u2019s on the way. Walking the operator through the checklist.' },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: 'Line\u2019s idle for two hours while they reset and purge.' },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: 'One batch lost, but we stopped the bleed.' },
  { name: 'Director', sprite: 'director.png', text: 'Better than a full scrap, but these delays add up.' },
];

const scenario4FigureOutDialogue = [
  { name: 'New operator', sprite: 'operator.png', text: 'I\u2019m not sure what value to enter\u2026' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'Stop the line; we need to coach on the spot.' },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: 'Two batches already off-formula.' },
  { name: 'Director', sprite: 'director.png', text: 'Training backlog is costing us throughput.' },
];

const scenario4KeepRunningDialogue = [
  { name: 'Production Manager', sprite: 'production manager.png', text: 'We\u2019ll monitor live and let him adjust on the fly.' },
  { name: 'New operator', sprite: 'operator.png', text: 'I\u2026 think it\u2019s fixed?' },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: 'Values are still drifting\u2014three more batches scrap.' },
  { name: 'Director', sprite: 'director.png', text: 'This trial-and-error approach is unacceptable.' },
];

// ---------- Scenario 5 Dialogue ----------
const scenario5Intro = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: 'PLC-7 just dropped out\u2014batching and conveyor logic are unresponsive. We\u2019re mid-cycle on two product lines.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'That\u2019s one of the legacy units. We knew it was on borrowed time.' },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: 'No alarms, no diagnostics\u2014comms just went dark.' },
  { name: 'Director', sprite: 'director.png', text: 'Get it back up. We can\u2019t afford to fall behind right now.' },
];

const scenario5TwinDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: 'Vibration threshold on PLC-7 hits 0.9 g\u2014planned failure in 8 hrs.' },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: 'We swapped the unit out during the night shift. No interruption.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'No shipment delays. Excellent foresight.' },
];

const scenario5VendorDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: 'Confirmed crash\u2014unknown fault. No restart response from control rack.' },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: 'Calling the vendor now. We\u2019ll need a courier and maybe remote login.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'Entire line\u2019s down during peak run.' },
  { name: 'Director', sprite: 'director.png', text: 'This will delay operations by about five hours\u2026 let sales know.' },
];

const scenario5RebootDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: 'We\u2019re flashing backup firmware. Takes about 45 minutes to boot each segment.' },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: 'Wiring\u2019s still intact, but we\u2019ve got to patch the logic loop manually.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'We lost about three hours, but we\u2019re crawling back online.' },
];

const scenario5NothingDialogue = [
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: 'PLC\u2019s still down. No comms. No backup image.' },
  { name: 'Maintenance Lead', sprite: 'maintenancelead.webp', text: 'We\u2019ve got nothing left to try without a replacement. We\'re stuck.' },
  { name: 'Production Manager', sprite: 'production manager.png', text: 'Twelve hours of idle time. We\u2019ll be paying for that all week.' },
];

const endYearDialogue = [
  { name: 'Director', sprite: 'director.png', text: "That\u2019s the year. Numbers are in, and so are the outcomes. Let\u2019s take a look at where we landed." },
  { name: 'Production Manager', sprite: 'production manager.png', text: "We\u2019ve seen ups and downs. Some improvements, some setbacks." },
  { name: 'Quality Manager', sprite: 'qualitymanager.png', text: "Customer reports, compliance notes, internal rework logs\u2014they\u2019re all factored in." },
  { name: 'Automation Engineer', sprite: 'automationengineer.png', text: "Same on the system side. Every decision had ripple effects, good or bad." },
  { name: 'Director', sprite: 'director.png', text: "Alright. Let\u2019s review the results." }
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
  
  // Start main theme music for the first dialogue
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
    if (taskDialogueIndex >= taskDialogue.length && !scenarioOptionsDiv.dataset.selected && !endOfYear) {
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
    if (!endOfYear) {
      showScenarioOptions();
    }
  }
}

function showScenarioOptions() {
  if (!scenarioOptionsDiv) return;
  scenarioOptionsDiv.style.display = 'flex';
  taskListPage.removeEventListener('click', nextTaskDialogue);

  optionDeploy.disabled = false;
  optionManual.disabled = false;
  optionMaintenance.disabled = false;
  optionNothing.disabled = false;
  optionMaintenance.style.display = '';
  optionNothing.style.display = '';

  if (currentScenario === 1 && !state.upgrades.moisture.active) {
    optionDeploy.disabled = true;
  } else if (currentScenario === 2 && !state.upgrades.plantInsights.active) {
    optionDeploy.disabled = true;
  } else if (currentScenario === 3 && !state.upgrades.retrofit.active) {
    optionDeploy.disabled = true;
  } else if (currentScenario === 4 && !state.upgrades.training.active) {
    optionDeploy.disabled = true;
  } else if (currentScenario === 5 && !state.upgrades.digitalTwin.active) {
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
    optionManual.onclick = () => select(-10, manualTuningDialogue);
    optionMaintenance.onclick = () => select(-15, maintenanceDialogue);
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
  } else if (currentScenario === 3) {
    optionDeploy.textContent = 'Access Digital Traceability Platform';
    optionManual.textContent = 'Rely on manual records';
    optionMaintenance.textContent = 'Retest and verify manually';
    optionNothing.textContent = 'Do nothing';
    optionMaintenance.style.display = '';
    optionNothing.style.display = '';

    optionDeploy.onclick = () => select(30, scenario3DigitalDialogue);
    optionManual.onclick = () => select(-8, scenario3ManualDialogue);
    optionMaintenance.onclick = () => select(-12, scenario3RetestDialogue);
    optionNothing.onclick = () => select(-15, scenario3NothingDialogue);
  } else if (currentScenario === 4) {
    optionDeploy.textContent = 'Run OTS Simulation Drill';
    optionManual.textContent = 'Call Shift Supervisor for On-Floor Help';
    optionMaintenance.textContent = 'Let Operator Figure It Out';
    optionNothing.textContent = 'Keep Running and Learn on the Job';

    optionDeploy.onclick = () => select(20, scenario4OTSDialogue);
    optionManual.onclick = () => select(-10, scenario4SupervisorDialogue);
    optionMaintenance.onclick = () => select(-12, scenario4FigureOutDialogue);
    optionNothing.onclick = () => select(-18, scenario4KeepRunningDialogue);
  } else if (currentScenario === 5) {
    optionDeploy.textContent = 'Use Digital Twin for Predictive Alert';
    optionManual.textContent = 'Call Vendor Support for Emergency Swap';
    optionMaintenance.textContent = 'Attempt Reboot and Patch In-House';
    optionNothing.textContent = 'Do Nothing and Wait for Failure Resolution';

    optionDeploy.onclick = () => select(30, scenario5TwinDialogue);
    optionManual.onclick = () => select(-15, scenario5VendorDialogue);
    optionMaintenance.onclick = () => select(-10, scenario5RebootDialogue);
    optionNothing.onclick = () => select(-25, scenario5NothingDialogue);
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
        if (currentScenario === 5) {
          nextScenarioPrompt.textContent = 'Double click to finalize year';
        } else {
          nextScenarioPrompt.textContent = 'Double click to proceed to next scenario';
        }
        nextScenarioPrompt.style.display = 'block';
      }
    });
    scenarioDialogueIndex++;
  } else {
    taskListPage.removeEventListener('click', nextScenarioDialogue);
    if (currentScenario === 1 || currentScenario === 2 || currentScenario === 3 || currentScenario === 4) {
      // Add a small delay to prevent the same click from triggering the next scenario
      setTimeout(() => {
        taskListPage.addEventListener('click', handleNextScenarioClick);
      }, 100);
    } else if (currentScenario === 5) {
      setTimeout(() => {
        taskListPage.addEventListener('click', handleEndYearClick);
      }, 100);
    }
  }
}

function handleNextScenarioClick() {
  taskListPage.removeEventListener('click', handleNextScenarioClick);
  nextScenarioPrompt.style.display = 'none';
  if (currentScenario === 1) {
    startScenarioTwo();
  } else if (currentScenario === 2) {
    startScenarioThree();
  } else if (currentScenario === 3) {
    startScenarioFour();
  } else if (currentScenario === 4) {
    startScenarioFive();
  }
}

function handleEndYearClick() {
  taskListPage.removeEventListener('click', handleEndYearClick);
  nextScenarioPrompt.style.display = 'none';
  startEndYearScene();
}

function startEndYearScene() {
  endOfYear = true;
  scenarioCounter.style.display = 'none';
  scenarioOptionsDiv.dataset.selected = '';
  taskDialogue = endYearDialogue;
  taskDialogueIndex = 0;
  scenarioDialogueIndex = 0;
  taskListPage.style.backgroundImage = "url('assets/backgrounds/endofyearreport.png')";
  mainThemeMusic.pause();
  endMusic.volume = 0.2;
  endMusic.play();
  taskListPage.addEventListener('click', nextTaskDialogue);
  nextTaskDialogue();
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

function startScenarioThree() {
  currentScenario = 3;
  scenarioCounter.textContent = `SCENARIO ${currentScenario}`;
  scenarioOptionsDiv.dataset.selected = '';
  taskDialogue = scenario3Intro;
  taskDialogueIndex = 0;
  scenarioDialogueIndex = 0;
  taskListPage.style.backgroundImage = "url('assets/backgrounds/auditbg.png')";
  taskListPage.addEventListener('click', nextTaskDialogue);
  nextTaskDialogue();
}

function startScenarioFour() {
  currentScenario = 4;
  scenarioCounter.textContent = `SCENARIO ${currentScenario}`;
  scenarioOptionsDiv.dataset.selected = '';
  taskDialogue = scenario4Intro;
  taskDialogueIndex = 0;
  scenarioDialogueIndex = 0;
  taskListPage.style.backgroundImage = "url('assets/backgrounds/nightshift.png')";
  taskListPage.addEventListener('click', nextTaskDialogue);
  nextTaskDialogue();
}

function startScenarioFive() {
  currentScenario = 5;
  scenarioCounter.textContent = `SCENARIO ${currentScenario}`;
  scenarioOptionsDiv.dataset.selected = '';
  taskDialogue = scenario5Intro;
  taskDialogueIndex = 0;
  scenarioDialogueIndex = 0;
  taskListPage.style.backgroundImage = "url('assets/backgrounds/plcdown.png')";
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
    mainThemeMusic.pause();
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
      mainThemeMusic.volume = 0.2;
      mainThemeMusic.play();
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
