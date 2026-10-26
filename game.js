(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = "gemMinerCrystalKingdom_v3";
  const OLD_SAVE_KEY = "gemMinerCrystalKingdom_v2";

  // ==========================================
  // HEROES
  // ==========================================

  const HEROES = {
    aiden: {
      name: "Aiden",
      role: "Knight · Front line",
      portrait: "assets/knight.svg",
      maxHp: 145,
      damage: 12,
      tagline: "Loyal, sturdy, and always up front."
    },
    seraphine: {
      name: "Seraphine",
      role: "Mage · Arcane DPS",
      portrait: "assets/mage.svg",
      maxHp: 92,
      damage: 17,
      tagline: "Turns crystal magic into firepower."
    },
    liria: {
      name: "Liria",
      role: "Archer · Ranged DPS",
      portrait: "assets/archer.svg",
      maxHp: 104,
      damage: 15,
      tagline: "Quick shots from a safe distance."
    },
    celeste: {
      name: "Celeste",
      role: "Healer · Support",
      portrait: "assets/hero-mage.svg",
      maxHp: 112,
      damage: 8,
      tagline: "Keeps the team in the fight."
    },
    ragnar: {
      name: "Ragnar",
      role: "Berserker · Heavy DPS",
      portrait: "assets/knight.svg",
      maxHp: 128,
      damage: 24,
      tagline: "Big hits. Bigger smiles."
    },
    kael_rogue: {
      name: "Kael",
      role: "Rogue · Critical DPS",
      portrait: "assets/archer.svg",
      maxHp: 98,
      damage: 19,
      tagline: "Fast feet and precise strikes."
    },
    sage: {
      name: "Sage",
      role: "Druid · Nature Support",
      portrait: "assets/hero-mage.svg",
      maxHp: 118,
      damage: 13,
      tagline: "The forest answers the call."
    },
    elowen: {
      name: "Elowen",
      role: "Reviver · Spirit Support",
      portrait: "assets/elowen.svg",
      maxHp: 116,
      damage: 12,
      tagline: "Elowen revives one fallen ally every 30 seconds. If she falls, she revives herself after 60 seconds."
    }
  };

  // Shared order for enemy targeting and front-line formation.
// The first living hero stands closest to the enemy.
const HERO_TARGET_ORDER = [
  "aiden",
  "ragnar",
  "kael_rogue",
  "seraphine",
  "liria",
  "celeste",
  "sage",
  "elowen"
];
  // ==========================================
  // REGIONS AND GUARDIANS
  // ==========================================

  const regions = [
    {
      name: "The Shattered Cavern",
      enemy: "Glimmer Slime",
      type: "CRYSTAL CREATURE",
      hp: 90,
      damage: 8,
      gold: 12,
      crystals: 5,
      sprite: "assets/slime.svg",
      boss: "The Prism Warden",
      bossHp: 490,
      bossDamage: 16,
      desc: "An ancient sentinel sealed inside the cavern.",
      rewardHero: "celeste"
    },
    {
      name: "Moonlit Grotto",
      enemy: "Grotto Stalker",
      type: "ABYSSAL BEAST",
      hp: 155,
      damage: 12,
      gold: 23,
      crystals: 8,
      sprite: "assets/stalker.svg",
      boss: "The Moonfang",
      bossHp: 880,
      bossDamage: 23,
      desc: "A moon-cursed hunter prowls the luminous pools.",
      rewardHero: "ragnar"
    },
    {
      name: "The Ember Reliquary",
      enemy: "Cinder Wisp",
      type: "EMBER SPIRIT",
      hp: 270,
      damage: 17,
      gold: 37,
      crystals: 13,
      sprite: "assets/wisp.svg",
      boss: "The Ashen Sovereign",
      bossHp: 1550,
      bossDamage: 33,
      desc: "A sovereign of flame guards the buried reliquary.",
      rewardHero: "kael_rogue"
    },
    {
      name: "Skyglass Sanctum",
      enemy: "Skyglass Sentinel",
      type: "ANCIENT CONSTRUCT",
      hp: 450,
      damage: 24,
      gold: 58,
      crystals: 21,
      sprite: "assets/boss.svg",
      boss: "The Star-Eater",
      bossHp: 2700,
      bossDamage: 46,
      desc: "A star-born titan stirs beyond the final seal.",
      rewardHero: "sage"
    },
    {
      name: "The Verdant Deep",
      enemy: "Thornbound Wraith",
      type: "ANCIENT SPIRIT",
      hp: 520,
      damage: 26,
      gold: 92,
      crystals: 34,
      sprite: "assets/wisp.svg",
      boss: "The Hollowheart Guardian",
      bossHp: 6500,
      bossDamage: 58,
      desc: "A forgotten guardian protects the last living crystal heart.",
      rewardHero: "elowen"
    },
        {
      name: "The Sage's Crucible",
      enemy: "Clockwork Shade",
      type: "ANCIENT AUTOMATON",
      hp: 640,
      damage: 31,
      gold: 125,
      crystals: 46,
      sprite: "assets/stalker.svg",
      boss: "The Silent Arbiter",
      bossHp: 11500,
      bossDamage: 68,
      desc: "A forgotten sentinel tests the keeper of the kingdom. Defeat it to unlock Kingdom Autopilot.",
      rewardHero: null
    },
    {
      name: "The Astral Foundry",
      enemy: "Aetherbound Sentinel",
      type: "ARCANE AUTOMATON",
      hp: 850,
      damage: 37,
      gold: 165,
      crystals: 62,
      sprite: "assets/boss.svg",
      boss: "The Astral Sovereign",
      bossHp: 13500,
      bossDamage: 72,
      desc: "Beyond the Crucible, an ancient star forge awaits its final challenger.",
      rewardHero: null
    }
  ];

  // ==========================================
  // HELPERS
  // ==========================================

  const RECRUITS = [
    {
      id: "tessa",
      name: "Tessa",
      role: "Miner",
      portrait: "assets/knight.svg",
      cost: 55,
      desc: "+0.8 gold per second"
    },
    {
      id: "borin",
      name: "Borin",
      role: "Miner",
      portrait: "assets/knight.svg",
      cost: 80,
      desc: "+1.3 gold per second"
    },
    {
      id: "luna",
      name: "Luna",
      role: "Gatherer",
      portrait: "assets/archer.svg",
      cost: 95,
      desc: "+20% crystals from mining"
    },
    {
      id: "silas",
      name: "Silas",
      role: "Scholar",
      portrait: "assets/mage.svg",
      cost: 125,
      desc: "+15% skill damage"
    },
    {
      id: "mira_cook",
      name: "Mira",
      role: "Cook",
      portrait: "assets/hero-mage.svg",
      cost: 115,
      desc: "+25% snack healing"
    },
    {
      id: "juno",
      name: "Juno",
      role: "Alchemist",
      portrait: "assets/mage.svg",
      cost: 150,
      desc: "+1 ore when mining"
    },
    {
      id: "darius",
      name: "Darius",
      role: "Crossbowman",
      portrait: "assets/archer.svg",
      cost: 190,
      desc: "+6 party attack damage"
    },
    {
      id: "elise",
      name: "Elise",
      role: "Spirit Guide",
      portrait: "assets/hero-mage.svg",
      cost: 225,
      desc: "+20% healing skill power"
    },
    {
      id: "kellan",
      name: "Kellan",
      role: "Engineer",
      portrait: "assets/knight.svg",
      cost: 270,
      desc: "+0.3 crystals per second"
    },
    {
      id: "iris",
      name: "Iris",
      role: "Mystic",
      portrait: "assets/hero-mage.svg",
      cost: 200,
      desc: "+25 maximum mana and faster regeneration"
    }
  ];

  // ==========================================
  // SNACKS
  // ==========================================

  const SNACKS = [
    {
      id: "rations",
      name: "Trail Rations",
      icon: "🥖",
      cost: 24,
      desc: "Heal the most injured living hero by 35 HP.",
      effect: "healOne"
    },
    {
      id: "moonberries",
      name: "Moonberries",
      icon: "🫐",
      cost: 40,
      desc: "Boost party damage by 25% for 20 seconds.",
      effect: "buff"
    },
    {
      id: "tea",
      name: "Miner's Tea",
      icon: "🍵",
      cost: 32,
      desc: "Gain 4 ore.",
      effect: "ore"
    },
    {
      id: "cake",
      name: "Crystal Cake",
      icon: "🍰",
      cost: 75,
      desc: "Heal every living hero by 24 HP.",
      effect: "healAll"
    },
    {
      id: "etherberry",
      name: "Etherberries",
      icon: "🟣",
      cost: 45,
      desc: "Restore 35 mana immediately.",
      effect: "mana"
    },
    {
      id: "astralTea",
      name: "Astral Tea",
      icon: "✨",
      cost: 65,
      desc: "Triple mana regeneration for 30 seconds.",
      effect: "manaBuff"
    },
    {
      id: "revive",
      name: "Revive Snack",
      icon: "🔔",
      cost: 1000,
      desc: "A rare, costly snack that revives one fallen hero at 40% HP. Requires at least one living hero.",
      effect: "revive"
    }
  ];

  const SKILL_MANA_COST = {
    slash: 12,
    burst: 20,
    guard: 15,
    heal: 22,
    meteor: 32,
    frost: 20,
    phoenix: 45
  };

  const clone = (value) =>
    JSON.parse(JSON.stringify(value));

  const initialHeroes = [
    "aiden",
    "seraphine",
    "liria"
  ];

  const baseHeroHp = Object.fromEntries(
    initialHeroes.map((id) => [
      id,
      HEROES[id].maxHp
    ])
  );

  // ==========================================
    // DEFAULT SAVE
  // ==========================================

  const defaults = {
    gold: 75,
    crystals: 35,
    ore: 0,

    mana: 100,
    manaBuffUntil: 0,
    manaWarning: false,

    pickaxe: 1,
    speedLevel: 0,
    damageLevel: 0,
    critLevel: 0,

    region: 0,
    defeated: 0,
    bossDefeated: [],
    caveCrystalProgress: 0,
    elowenNextReviveAt: 0,
    elowenSelfReviveAt: 0,
    autoPilotUnlocked: false,
    raphaelEvolved: false,

    enemy: null,
    bossMode: false,

    heroes: initialHeroes.slice(),
    heroHp: baseHeroHp,

    recruits: [],

    snacks: {
      rations: 2,
      moonberries: 1,
      tea: 1,
      cake: 0,
      etherberry: 2,
      astralTea: 1,
      revive: 0
    },

    cooldowns: {
      slash: 0,
      burst: 0,
      guard: 0,
      heal: 0,
      meteor: 0,
      frost: 0,
      phoenix: 0
    },

    partyBuffUntil: 0,
    frostUntil: 0,
    guardCharges: 0,

    needsHospital: false,
    hospitalFee: 0,
    healingUntil: 0,

    lastLog: []
  };

  // ==========================================
  // LOAD SAVE AND KEEP OLD PROGRESS
  // ==========================================

  function loadGame() {
    let stored = {};

    try {
      stored = JSON.parse(
        localStorage.getItem(SAVE_KEY) ||
        localStorage.getItem(OLD_SAVE_KEY) ||
        "{}"
      ) || {};
    } catch (error) {
      console.warn("Could not read saved game.", error);
    }

    const state = {
      ...clone(defaults),
      ...stored
    };

    state.cooldowns = {
      ...defaults.cooldowns,
      ...(stored.cooldowns || {})
    };

    state.snacks = {
      ...defaults.snacks,
      ...(stored.snacks || {})
    };

    state.heroes =
      Array.isArray(stored.heroes) && stored.heroes.length
        ? stored.heroes.filter((id) => HEROES[id])
        : initialHeroes.slice();

    state.recruits = Array.isArray(stored.recruits)
      ? stored.recruits.filter((id) =>
          RECRUITS.some((recruit) => recruit.id === id)
        )
      : [];

    state.bossDefeated = Array.isArray(stored.bossDefeated)
      ? stored.bossDefeated
      : [];

    state.heroHp = {
      ...baseHeroHp,
      ...(stored.heroHp || {})
    };

    if (stored.healer && !state.heroes.includes("celeste")) {
      state.heroes.push("celeste");
    }

    state.bossDefeated.forEach((index) => {
      const reward = regions[index] && regions[index].rewardHero;

      if (reward && !state.heroes.includes(reward)) {
        state.heroes.push(reward);
      }
    });

    state.region = Math.max(
      0,
      Math.min(regions.length - 1, Number(state.region) || 0)
    );

    state.caveCrystalProgress = Math.max(
      0,
      Number(state.caveCrystalProgress) || 0
    );
    state.elowenNextReviveAt = Math.max(
      0,
      Number(state.elowenNextReviveAt) || 0
    );
    state.elowenSelfReviveAt = Math.max(
      0,
      Number(state.elowenSelfReviveAt) || 0
    );
    state.autoPilotUnlocked = Boolean(state.autoPilotUnlocked);
    state.raphaelEvolved = Boolean(state.raphaelEvolved);

    // Existing saves keep their progress, but the infirmary is now always
    // more expensive than the rare Revive Snack.
    if (state.needsHospital) {
      const minimumHospitalFee =
        1500 + state.region * 1200 + Math.floor((Number(state.defeated) || 0) / 5) * 500;
      state.hospitalFee = Math.max(
        Number(state.hospitalFee) || 0,
        minimumHospitalFee
      );
    }

    const savedMaxMana =
      100 + (state.recruits.includes("iris") ? 25 : 0);

    state.mana = Math.max(
      0,
      Math.min(savedMaxMana, Number(state.mana) || 0)
    );

    state.heroes.forEach((id) => {
      if (!HEROES[id]) return;

      if (!Number.isFinite(Number(state.heroHp[id]))) {
        state.heroHp[id] = HEROES[id].maxHp;
      }

      state.heroHp[id] = Math.max(
        0,
        Math.min(HEROES[id].maxHp, Number(state.heroHp[id]))
      );
    });

    return state;
  }

  let s = loadGame();
  let logs = Array.isArray(s.lastLog) ? s.lastLog : [];

  // ==========================================
  // TIMERS AND SAGE STATE
  // ==========================================

  let partyClock = 0;
  let enemyClock = 0;
  let supportClock = 0;
  let lastTick = performance.now();
  let renderClock = 0;
  let exploreTimer = 0;
  let toastTimer = 0;

  // Great Sage's two autonomous modes. Kingdom Autopilot is never enabled
  // automatically; it must be unlocked and explicitly started by voice.
  let battleAutoPilot = false;
  let kingdomAutoPilot = false;
  let battlePilotClock = 0;
  let kingdomMineClock = 0;
  let kingdomManagementClock = 0;
  let kingdomRecruitClock = 0;
  let kingdomUpgradeClock = 0;
  let pendingSnackApproval = null;
  let returnToIdleAfterSpeech = false;
  let standDownAfterReply = false;

  const speechQueue = [];
  const MAX_SPEECH_QUEUE = 5;
  let unlockRevealQueue = [];
  let unlockRevealActive = false;
  let unlockRevealTimer = null;
  let speechBusy = false;
  let sageEnabled = true;
  let currentUtterance = null;
  let speechGeneration = 0;

  // Wake-word assistant: listens for "Great Sage" while idle.
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let recognitionRunning = false;
  let recognitionEnabled = true;
  let recognitionRestartTimer = null;
  let recognitionPermissionWarningShown = false;
  let commandModeActive = false;
  let commandIdleTimer = null;
  let ignoreRecognitionUntil = 0;
  const COMMAND_IDLE_MS = 5000;
  const MUSIC_DUCK_FACTOR = 0.06;

  let currentPrompt = null;
  let lowHealthWarning = false;
  let importantAudioContext = null;
  let lastImportantSound = 0;

  const MUSIC_TRACKS = {
    exploring: { src: "assets/exploring.mp3", label: "Exploration theme" },
    fighting: { src: "assets/fighting.mp3", label: "Battle theme" },
    intense: { src: "assets/intense.mp3", label: "Boss theme" }
  };
  let currentMusicKey = null;
  let musicEnabled = (() => {
    try {
      return localStorage.getItem("gemMinerMusicEnabled") !== "false";
    } catch (error) {
      return true;
    }
  })();

  // ==========================================
  // GENERAL HELPERS
  // ==========================================

  const fmt = (n) =>
    Math.max(0, Math.floor(Number(n) || 0)).toLocaleString();

  const region = () =>
    regions[s.region] || regions[regions.length - 1];

  const bossDone = () =>
    s.bossDefeated.includes(s.region);

  // Crystal gates get harder with each cave and every three monsters defeated.
  const crystalGoal = () =>
    25 + s.region * 20 + Math.floor(s.defeated / 3) * 8;

  const crystalGateOpen = () =>
    s.caveCrystalProgress >= crystalGoal();

  function addCaveCrystalProgress(amount) {
    const gained = Math.max(0, Number(amount) || 0);
    s.caveCrystalProgress += gained;
  }

  const skillUnlockRegion = (key) => ({ heal: 1, phoenix: 2 }[key] ?? 0);

  const isSkillUnlocked = (key) =>
    s.region >= skillUnlockRegion(key);

  const livingHeroes = () =>
    s.heroes.filter((id) => (s.heroHp[id] || 0) > 0);

  const isRecovering = () =>
    s.healingUntil > Date.now();

  const battleLocked = () =>
    s.needsHospital || isRecovering();

  // Check whether the party is allowed to start an encounter.
const canStartBattle = () =>
  !battleLocked() && livingHeroes().length > 0;

  const maxMana = () =>
    100 + (s.recruits.includes("iris") ? 25 : 0);

  function manaRate() {
    let rate = 1;

    if (s.recruits.includes("iris")) {
      rate += 0.75;
    }

    if (s.manaBuffUntil > Date.now()) {
      rate *= 3;
    }

    return rate;
  }

  const pInterval = () =>
    Math.max(3.5, 6 - s.speedLevel * 0.5);

  const eInterval = () =>
    Math.max(
      2.2,
      5 - s.region * 0.6 - (s.bossMode ? 0.45 : 0)
    ) * (s.frostUntil > Date.now() ? 1.4 : 1);

  const pickCost = () =>
    Math.floor(35 * Math.pow(1.8, s.pickaxe - 1));

  const speedCost = () =>
    Math.floor(40 * Math.pow(1.9, s.speedLevel));

  const damageCost = () =>
    Math.floor(60 * Math.pow(1.8, s.damageLevel));

  const critCost = () =>
    Math.floor(50 * Math.pow(1.85, s.critLevel));

  function updateMusicControl() {
    const audio = $("backgroundMusic");
    const button = $("musicToggle");
    const volume = $("musicVolume");
    const trackLabel = $("musicTrack");

    if (audio && volume) {
      const selectedVolume = Math.max(0, Math.min(1, Number(volume.value) || 0));
      const duckMusic = commandModeActive || speechBusy;
      audio.volume = selectedVolume * (duckMusic ? MUSIC_DUCK_FACTOR : 1);
    }

    if (button) {
      const playing = !!audio && !audio.paused;
      button.textContent = !musicEnabled
        ? "♫ Music off"
        : playing
          ? "Ⅱ Pause music"
          : "▶ Play music";
      button.setAttribute("aria-pressed", String(playing));
    }

    if (trackLabel && currentMusicKey && MUSIC_TRACKS[currentMusicKey]) {
      trackLabel.textContent = MUSIC_TRACKS[currentMusicKey].label;
    }
  }
    function startBackgroundMusic() {
    const audio = $("backgroundMusic");
    if (!audio || !musicEnabled || !audio.src) {
      updateMusicControl();
      return;
    }

    updateMusicControl();

    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt.then(updateMusicControl).catch(() => {
        // Browsers may block autoplay until the player clicks Play music.
        updateMusicControl();
      });
    } else {
      updateMusicControl();
    }
  }

  function updateMusicScene() {
    const audio = $("backgroundMusic");
    if (!audio) return;

    const key = !s.enemy
      ? "exploring"
      : s.enemy.boss
        ? "intense"
        : "fighting";
    const track = MUSIC_TRACKS[key];

    if (currentMusicKey !== key) {
      currentMusicKey = key;
      audio.src = track.src;
      audio.load();
      if (musicEnabled) startBackgroundMusic();
    }

    updateMusicControl();
  }

  function toggleMusic() {
    const audio = $("backgroundMusic");
    if (!audio) return;

    if (musicEnabled && !audio.paused) {
      musicEnabled = false;
      audio.pause();
      try { localStorage.setItem("gemMinerMusicEnabled", "false"); } catch (error) {}
      updateMusicControl();
      toast("Background music paused.");
      return;
    }

    musicEnabled = true;
    try { localStorage.setItem("gemMinerMusicEnabled", "true"); } catch (error) {}
    if (!currentMusicKey) updateMusicScene();
    startBackgroundMusic();
    toast("Background music enabled.");
  }

  const totalPartyDamage = () =>
    livingHeroes().reduce(
      (sum, id) => sum + HEROES[id].damage,
      0
    ) +
    s.damageLevel * 4 +
    (s.recruits.includes("darius") ? 6 : 0);

  function save() {
    try {
      s.lastLog = logs.slice(0, 12);
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    } catch (error) {
      console.warn("Could not save progress.", error);
    }
  }

  function esc(value) {
    return String(value).replace(
      /[&<>"']/g,
      (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch])
    );
  }

  // ==========================================
  // GREAT SAGE PANEL
  // ==========================================

  function updateSageStatus(text) {
    const el = $("sageStatus");
    if (el) el.textContent = text;
  }

  function updateSageMessage(text) {
    const el = $("sageMessage");
    if (el) el.textContent = text;
  }

  function sagePanelVisible() {
    return (
      speechBusy ||
      speechQueue.length > 0 ||
      currentPrompt !== null
    );
  }

  // Prompt priorities ensure important alerts take precedence:
  // hospital > Phoenix > low-health warning.
  const promptPriority = {
    lowHealth: 1,
    phoenix: 2,
    hospital: 3
  };

  function showPrompt(prompt) {
    if (
      currentPrompt &&
      promptPriority[currentPrompt.type] >= promptPriority[prompt.type]
    ) {
      return false;
    }

    currentPrompt = prompt;
    refreshSagePanel();
    return true;
  }

  function dismissPrompt() {
    currentPrompt = null;
    refreshSagePanel();
  }

  function pulseSageWord() {
    const orb = $("sageOrb");
    if (!orb) return;

    orb.classList.remove("word-pulse");
    void orb.offsetWidth;
    orb.classList.add("word-pulse");
  }

  function getEnglishVoice() {
    if (!("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    const english = voices.filter((voice) =>
      /^en([_-]|$)/i.test(voice.lang)
    );

    if (!english.length) return null;

    // A system-installed neural/natural voice usually sounds less robotic.
    // Voice names and availability vary by browser and operating system.
    const naturalVoice = english.find((voice) => /natural|neural|online/i.test(voice.name));
    if (naturalVoice) return naturalVoice;

    const preferredPatterns = [
      /microsoft aria/i,
      /microsoft jenny/i,
      /\baria\b/i,
      /\bjenny\b/i,
      /samantha/i,
      /google us english/i,
      /\bava\b/i,
      /sonia/i,
      /hazel/i,
      /zira/i,
      /victoria/i,
      /karen/i,
      /female/i
    ];

    for (const pattern of preferredPatterns) {
      const matches = english.filter((voice) => pattern.test(voice.name));
      if (matches.length) {
        const natural = matches.find((voice) => /natural/i.test(voice.name));
        return natural || matches[0];
      }
    }

    return english.find((voice) => /^en[-_]US$/i.test(voice.lang)) || english[0];
  }

  function processSpeechQueue() {
    if (!sageEnabled || speechBusy || !speechQueue.length) {
      refreshSagePanel();
      return;
    }

    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      updateSageStatus("VOICE UNAVAILABLE");
      refreshSagePanel();
      return;
    }

    const message = speechQueue.shift();

    speechBusy = true;

    const generation = speechGeneration;

    updateSageMessage(message);
    updateSageStatus("SPEAKING");
    refreshSagePanel();

    const utterance = new SpeechSynthesisUtterance(message);

    // More conversational than the original stiff setting.
    // The available browser voice still determines the actual sound.
    utterance.lang = "en-US";
    utterance.rate = 0.94;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;

    currentUtterance = utterance;

    utterance.onstart = () => {
      if (generation !== speechGeneration) return;
      updateSageStatus("SPEAKING");
      refreshSagePanel();
    };

    utterance.onboundary = (event) => {
      if (generation !== speechGeneration) return;

      if (event.name === "word" || event.charIndex >= 0) {
        pulseSageWord();
      }
    };

    function finishUtterance() {
      if (generation !== speechGeneration) return;

      speechBusy = false;
      currentUtterance = null;

      updateSageStatus(sageEnabled ? "VOICE ON" : "VOICE MUTED");
      refreshSagePanel();

      // Read announcements one at a time.
      window.setTimeout(processSpeechQueue, 180);
    }

    utterance.onend = finishUtterance;
    utterance.onerror = finishUtterance;

    window.speechSynthesis.speak(utterance);
  }

  function announce(message) {
    updateSageMessage(message);

    if (!sageEnabled) {
      refreshSagePanel();
      return;
    }

    // Discard the oldest waiting announcement if the queue is full.
    // The sentence currently being spoken is never interrupted.
    if (speechQueue.length >= MAX_SPEECH_QUEUE) {
      speechQueue.shift();
    }

    speechQueue.push(message);
    refreshSagePanel();
    processSpeechQueue();
  }

  function refreshSagePanel() {
    const panel = $("sagePanel");
    const orb = $("sageOrb");

    if (panel) {
      panel.hidden = !sagePanelVisible();
    }

    if (orb) {
      orb.classList.toggle("is-speaking", speechBusy);
      orb.classList.toggle("is-muted", !sageEnabled);
      orb.classList.toggle("is-battle-auto", battleAutoPilot && !kingdomAutoPilot);
      orb.classList.toggle("is-kingdom-auto", kingdomAutoPilot);
      orb.setAttribute("aria-label", kingdomAutoPilot
        ? "Great Sage Kingdom Autopilot is active. Say Great Sage, stand down to stop."
        : battleAutoPilot
          ? "Great Sage Battle Autopilot is active."
          : "Mute or activate Great Sage voice");
    }

    renderSageActions();
  }

  function getHealingAdvice() {
    const options = [];

    if (
      s.heroes.includes("celeste") ||
      s.heroes.includes("sage")
    ) {
      options.push("Healing Wave");
    }

    options.push("Guard");

    if ((s.snacks.rations || 0) > 0) {
      options.push("Trail Rations");
    }

    if ((s.snacks.cake || 0) > 0) {
      options.push("Crystal Cake");
    }

    return options;
  }

  function canUseSkill(key) {
    if (!(key in SKILL_MANA_COST)) return false;
    if (!isSkillUnlocked(key)) return false;
    if (battleLocked()) return false;
    if (!livingHeroes().length) return false;
    if (s.mana < SKILL_MANA_COST[key]) return false;
    if ((s.cooldowns[key] || 0) > 0) return false;

    if (
      ["heal", "phoenix"].includes(key) &&
      !s.heroes.includes("celeste") &&
      !s.heroes.includes("sage")
    ) {
      return false;
    }

    if (      key === "phoenix" &&
      !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)
    ) {
      return false;
    }

    return true;
  }

  function renderSageActions() {
    const box = $("sageActions");
    if (!box) return;

    if (!currentPrompt) {
      box.hidden = true;

      if (box.innerHTML) box.innerHTML = "";

      return;
    }

    box.hidden = false;

    let html = "";

    if (currentPrompt.type === "phoenix") {
      const ready = canUseSkill("phoenix");

      html = `
        <button
          class="sage-primary"
          data-sage-action="phoenix"
          ${ready ? "" : "disabled"}
        >Use Phoenix Blessing</button>

        ${(s.snacks.revive || 0) > 0 ? `
          <button
            data-sage-action="snack"
            data-value="revive"
            ${battleLocked() || !livingHeroes().length ? "disabled" : ""}
          >Use Revive Snack</button>
        ` : ""}

        <button
          class="sage-dismiss"
          data-sage-action="dismiss"
        >Not now</button>

        <small>
          ${s.region < 2
            ? "Phoenix Blessing unlocks in Cave 3."
            : `Phoenix Blessing costs 45 mana. ${ready ? "It is ready to use." : "It is currently unavailable."}`}
        </small>
      `;
    } else if (currentPrompt.type === "lowHealth") {
      const buttons = [];

      if (
        s.heroes.includes("celeste") ||
        s.heroes.includes("sage")
      ) {
        buttons.push(`
          <button
            class="sage-primary"
            data-sage-action="skill"
            data-value="heal"
            ${canUseSkill("heal") ? "" : "disabled"}
          >Use Healing Wave</button>
        `);
      }

      buttons.push(`
        <button
          class="sage-primary"
          data-sage-action="skill"
          data-value="guard"
          ${canUseSkill("guard") ? "" : "disabled"}
        >Use Guard</button>
      `);

      if ((s.snacks.rations || 0) > 0) {
        buttons.push(`
          <button
            data-sage-action="snack"
            data-value="rations"
            ${battleLocked() ? "disabled" : ""}
          >Use Trail Rations</button>
        `);
      }

      if ((s.snacks.cake || 0) > 0) {
        buttons.push(`
          <button
            data-sage-action="snack"
            data-value="cake"
            ${battleLocked() ? "disabled" : ""}
          >Use Crystal Cake</button>
        `);
      }

      buttons.push(`
        <button
          class="sage-dismiss"
          data-sage-action="dismiss"
        >Not now</button>
      `);

      html = buttons.join("");
    } else if (currentPrompt.type === "hospital") {
      html = `
        <button
          class="sage-primary"
          data-sage-action="hospital"
          ${s.gold >= s.hospitalFee ? "" : "disabled"}
        >Pay hospital fee</button>

        <button
          class="sage-dismiss"
          data-sage-action="dismiss"
        >Not now</button>

        <small>
          Fee: ${fmt(s.hospitalFee)} gold.
          ${s.gold >= s.hospitalFee
            ? "Payment starts one-minute recovery."
            : "Mine resources to earn more gold."}
        </small>
      `;
    }

    if (box.innerHTML !== html) {
      box.innerHTML = html;
    }
  }

  function showPhoenixPrompt(heroId) {
    if (!livingHeroes().length) return;

    const accepted = showPrompt({
      type: "phoenix",
      heroId
    });

    if (accepted) {
      updateSageMessage(
        s.region >= 2
          ? `${HEROES[heroId].name} is down. Would you like to use Phoenix Blessing?`
          : `${HEROES[heroId].name} is down. Phoenix Blessing unlocks in Cave 3. Use a Revive Snack if you have one.`
      );
    }

    refreshSagePanel();
  }

  function showLowHealthPrompt() {
    if (!livingHeroes().length) return;

    const accepted = showPrompt({
      type: "lowHealth"
    });

    if (accepted) {
      const advice = getHealingAdvice();
      updateSageMessage(
        `Your party's health is low. Consider using ${advice.join(", ")} to heal your team.`
      );
    }

    refreshSagePanel();
  }

  function showHospitalPrompt() {
    const accepted = showPrompt({
      type: "hospital"
    });

    if (accepted) {
      updateSageMessage(
        "Notice: All party members are down. Would you like to pay the hospital fee and begin recovery?"
      );
    }

    refreshSagePanel();
  }
  // ==========================================
// GOLDEN UNLOCK REVEAL
// ==========================================

function queueUnlockReveal(item) {
  unlockRevealQueue.push(item);

  if (!unlockRevealActive) {
    showNextUnlockReveal();
  }
}

function ensureUnlockRevealOverlay() {
  let overlay = $("unlockRevealOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "unlockRevealOverlay";
  overlay.className = "unlock-reveal-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <section class="unlock-reveal-card" role="dialog" aria-modal="true">
      <div class="unlock-reveal-kicker">✦ NEW UNLOCK ✦</div>

      <div class="unlock-reveal-medallion" id="unlockRevealMedallion">
        ✦
      </div>

      <div class="unlock-reveal-category" id="unlockRevealCategory">
        NEW DISCOVERY
      </div>

      <h2 id="unlockRevealTitle">Something New</h2>

      <p class="unlock-reveal-description" id="unlockRevealDescription"></p>

      <div class="unlock-reveal-footer">
        <small>Click anywhere to continue · Auto-closes in 10 seconds</small>
        <button type="button" class="unlock-reveal-button">
          Continue ✦
        </button>
      </div>
    </section>
  `;

  // Clicking anywhere on the overlay or card dismisses it.
  overlay.addEventListener("click", dismissUnlockReveal);

  document.body.appendChild(overlay);
  return overlay;
}

function showNextUnlockReveal() {
  if (!unlockRevealQueue.length) {
    unlockRevealActive = false;
    refreshSagePanel();
    return;
  }

  unlockRevealActive = true;

  const item = unlockRevealQueue.shift();

  // Interrupt old speech and discard queued announcements.
  cancelSageSpeech(true);

  const overlay = ensureUnlockRevealOverlay();
  const medallion = $("unlockRevealMedallion");

  medallion.replaceChildren();

  if (item.imageSrc) {
    const image = document.createElement("img");
    image.src = item.imageSrc;
    image.alt = item.title;
    medallion.appendChild(image);
  } else {
    medallion.textContent = item.symbol || "✦";
  }

  $("unlockRevealCategory").textContent =
    item.category || "NEW DISCOVERY";

  $("unlockRevealTitle").textContent = item.title;
  $("unlockRevealDescription").textContent =
    item.description || "";

  overlay.hidden = false;

  // Speak only the current unlock announcement.
  updateSageMessage(item.speech || item.title);

  if (sageEnabled && item.speech) {
    speechQueue.length = 0;
    speechQueue.push(item.speech);
    processSpeechQueue();
  }

  clearTimeout(unlockRevealTimer);

  // Unlock cards stay visible for 10 seconds.
  unlockRevealTimer = setTimeout(() => {
    dismissUnlockReveal();
  }, 10000);
}

function dismissUnlockReveal() {
  if (!unlockRevealActive) return;

  clearTimeout(unlockRevealTimer);
  unlockRevealTimer = null;

  const overlay = $("unlockRevealOverlay");
  if (overlay) overlay.hidden = true;

  // If another unlock happened during this reveal, show it next.
  if (unlockRevealQueue.length) {
    showNextUnlockReveal();
    return;
  }

  unlockRevealActive = false;

  // Start Raphael's evolution after all queued unlocks finish.
  if (s.region >= 6 && s.autoPilotUnlocked && !s.raphaelEvolved) {
    triggerRaphaelEvolution();
    return;
  }

  refreshSagePanel();
}

  function toggleSage() {
    if (!("speechSynthesis" in window)) {
      toast("This browser does not support speech synthesis.");
      updateSageStatus("VOICE UNAVAILABLE");
      return;
    }

    sageEnabled = !sageEnabled;

    if (!sageEnabled) {
      speechGeneration++;
      speechQueue.length = 0;
      speechBusy = false;
      currentUtterance = null;

      window.speechSynthesis.cancel();

      updateSageStatus("VOICE MUTED");
      refreshSagePanel();
      toast("Great Sage voice muted.");

      return;
    }

    updateSageStatus("VOICE ON");
    refreshSagePanel();

    toast("Great Sage voice activated.");

    announce("Great Sage online. Voice notifications restored.");
  }

  // ==========================================
  // LOG AND TOAST
  // ==========================================

  function log(message) {
    logs.unshift({
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      msg: message
    });

    logs = logs.slice(0, 12);
    renderLog();
  }

  function renderLog() {
    const target = $("logList");
    if (!target) return;

    target.innerHTML = logs.map((entry) =>
      `<p><time>${esc(entry.time || "NOW")}</time> ${esc(entry.msg || "")}</p>`
    ).join("");
  }

  function toast(message) {
    const target = $("toast");
    if (!target) return;

    target.textContent = message;
    target.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      target.classList.remove("show");
    }, 2300);
  }

  function playImportantSound() {
    const now = Date.now();

    // Stop duplicate alerts from overlapping.
    if (now - lastImportantSound < 450) return;
    lastImportantSound = now;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!importantAudioContext) {
        importantAudioContext = new AudioContextClass();
      }

      const context = importantAudioContext;
      if (context.state === "suspended") {
        context.resume().catch(() => {});
      }

      const startAt = context.currentTime + 0.025;

      // Quick double-beat navigation-style alert: low "bum", then higher "bum".
      const notes = [
        { frequency: 587, delay: 0, duration: 0.11 },
        { frequency: 784, delay: 0.14, duration: 0.15 }
      ];

      notes.forEach(({ frequency, delay, duration }) => {
        const start = startAt + delay;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.12, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(start);
        oscillator.stop(start + duration + 0.01);
      });
    } catch (error) {
      // Audio is optional and must never interrupt the game.
      console.debug("Important-event sound unavailable.", error);
    }
  }

  function showDamage(message, side = "enemy", healing = false) {
    const scene = $("scene");
    if (!scene) return;

    const span = document.createElement("span");
    span.className = "damage";
    span.textContent = message;

    span.style.left =
      (side === "enemy"
        ? 62 + Math.random() * 10
        : 18 + Math.random() * 12) + "%";

    span.style.top =
      (side === "enemy"
        ? 35 + Math.random() * 12
        : 45 + Math.random() * 10) + "%";

    if (healing) {
      span.style.color = "#a4edc0";
    }

    scene.appendChild(span);
    setTimeout(() => span.remove(), 950);
  }

  function enemyHitEffect() {
    const enemy = $("enemyVisual");

    if (enemy) {
      enemy.classList.remove("hit");
      void enemy.offsetWidth;
      enemy.classList.add("hit");
    }
  }

  function animateHeroAttack(id) {
    const party = $("battleParty");
    const hero = party &&
      party.querySelector(`[data-hero="${id}"]`);

    if (!hero || hero.classList.contains("fallen")) return;

    const usesBow = id === "liria";
    const usesSword = [
      "aiden",
      "ragnar",
      "kael_rogue"
    ].includes(id);

    const animationClass = usesBow
      ? "attack-bow"
      : usesSword
        ? "attack-sword"
        : "attack-cast";

    hero.classList.remove(
      "attack-bow",
      "attack-sword",
      "attack-cast"
    );

    void hero.offsetWidth;
    hero.classList.add(animationClass);

    window.setTimeout(() => {
      hero.classList.remove(animationClass);
    }, 500);

    if (usesBow) launchArrow(hero);
    if (usesSword) launchSwordSlash();
  }

  function launchArrow(hero) {
    const scene = $("scene");
    const enemy = $("enemyVisual");

    if (
      !scene ||
      !enemy ||
      enemy.classList.contains("hidden")
    ) return;

    const sceneRect = scene.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    const startX =
      heroRect.left + heroRect.width * 0.72 - sceneRect.left;
    const startY =
      heroRect.top + heroRect.height * 0.38 - sceneRect.top;

    const endX =
      enemyRect.left + enemyRect.width * 0.24 - sceneRect.left;
    const endY =
      enemyRect.top + enemyRect.height * 0.42 - sceneRect.top;

    const arrow = document.createElement("span");
    arrow.className = "attack-projectile arrow-projectile";

    arrow.style.left = `${startX}px`;
    arrow.style.top = `${startY}px`;

    arrow.style.setProperty(
      "--travel-x",
      `${endX - startX}px`
    );

    arrow.style.setProperty(
      "--travel-y",
      `${endY - startY}px`
    );

    arrow.style.setProperty(
      "--angle",
      `${Math.atan2(
        endY - startY,
        endX - startX
      ) * 180 / Math.PI}deg`
    );

    scene.appendChild(arrow);

    window.setTimeout(() => arrow.remove(), 520);
  }

  function launchSwordSlash() {
    const scene = $("scene");
    const enemy = $("enemyVisual");

    if (
      !scene ||
      !enemy ||
      enemy.classList.contains("hidden")
    ) return;

    const sceneRect = scene.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    const slash = document.createElement("span");
    slash.className = "attack-projectile sword-slash";

    slash.style.left =
      `${enemyRect.left - sceneRect.left +
        enemyRect.width * 0.18 - 25}px`;

    slash.style.top =
      `${enemyRect.top - sceneRect.top +
        enemyRect.height * 0.38 - 25}px`;

    scene.appendChild(slash);

    window.setTimeout(() => slash.remove(), 420);
  }

  // ==========================================
  // AUTOMATIC EXPLORATION
  // ==========================================

  function scheduleExplore(delay = 10000 + Math.random() * 10000) {
    clearTimeout(exploreTimer);

    if (s.enemy || battleLocked() || !livingHeroes().length) {
      return;
    }

    exploreTimer = setTimeout(() => {
      if (!s.enemy && !battleLocked() && livingHeroes().length) {
        explore();
      } else if (!battleLocked() && livingHeroes().length) {
        scheduleExplore();
      }
    }, delay);
  }

  function spawn(boss = false) {
    if (!canStartBattle() || s.enemy) return;

    if (boss && !crystalGateOpen()) {
      return toast(
        `Crystal gate closed. Gather ${fmt(crystalGoal() - s.caveCrystalProgress)} more crystals first.`
      );
    }

    const r = region();
    const scale = Math.pow(1.65, s.region);

    s.bossMode = boss;

    if (boss) {
      const hp = Math.floor(r.bossHp);

      s.enemy = {
        name: r.boss,
        type: "REGION GUARDIAN",
        hp,
        maxHp: hp,
        damage: r.bossDamage,
        gold: Math.floor(90 + s.region * 45),
        crystals: Math.floor(35 + s.region * 20),
        sprite: "assets/boss.svg",
        boss: true
      };
    } else {
      const hp = Math.floor(
        r.hp * scale * (0.85 + Math.random() * 0.3)
      );

      s.enemy = {
        name: r.enemy,
        type: r.type,
        hp,
        maxHp: hp,
        damage: Math.floor(r.damage * (1 + s.region * 0.25)),
        gold: Math.floor(r.gold * (1 + s.region * 0.35)),
        crystals: Math.floor(r.crystals * (1 + s.region * 0.35)),
        sprite: r.sprite,
        boss: false
      };
    }

    partyClock = 0;
    enemyClock = 0;

    if (boss) {
      playImportantSound();
      announce(`Warning: Guardian approaching. ${s.enemy.name} has appeared.`);
    }
    // Ordinary enemy spawns do not generate an incoming-attack announcement.

    log(`${s.enemy.name} appears in the cavern!`);

    render();
    save();
  }

  function explore() {
    if (s.enemy || !canStartBattle()) return;

    clearTimeout(exploreTimer);

    if (Math.random() < 0.1) {
      spawn(false);
    } else {
      const bonus = s.recruits.includes("luna") ? 1.2 : 1;

      const crystals = Math.floor(
        (3 + Math.random() * 7 + s.region * 2) * bonus
      );

      const ore =
        1 +
        Math.floor(Math.random() * 3) +
        (s.recruits.includes("juno") ? 1 : 0);

      s.crystals += crystals;
      addCaveCrystalProgress(crystals);
      s.ore += ore;
      s.gold += Math.floor(crystals * 0.7);

      log(`Exploration found ${crystals} crystals and ${ore} ore.`);

      toast(`Found ${crystals} crystals and ${ore} ore.`);

      render();
      save();
      scheduleExplore();
    }
  }

  // ==========================================
  // MINING
  // ==========================================

  function mine() {
    const bonus = s.recruits.includes("luna") ? 1.2 : 1;

    const amount = Math.max(
      1,
      Math.floor((s.pickaxe * 3 + Math.random() * s.pickaxe) * bonus)
    );

    const oreAmount =
      1 +
      Math.floor(s.pickaxe / 3) +
      (s.recruits.includes("juno") ? 1 : 0);

    s.crystals += amount;
    addCaveCrystalProgress(amount);
    s.ore += oreAmount;
    s.gold += Math.max(1, Math.floor(amount / 2));

    log(`Mining yielded ${amount} crystals and ${oreAmount} ore.`);

    showDamage("+" + amount, "party", true);
    toast(`Mined ${amount} crystals.`);

    render();
    save();
  }

  // ==========================================
  // PARTY ATTACKS
  // ==========================================

  function partyAttack() {
  if (!s.enemy || battleLocked()) return;

  const rankOf = (id) => {
    const rank = HERO_TARGET_ORDER.indexOf(id);
    return rank < 0 ? 999 : rank;
  };

  const active = livingHeroes().slice().sort(
    (a, b) => rankOf(a) - rankOf(b)
  );

  if (!active.length) {
    partyWiped();
    return;
  }

  for (const id of active) {
    if (!s.enemy) break;

    const h = HEROES[id];

    // Play the correct basic attack for this hero.
    animateHeroAttack(id);

    let amount =
      h.damage +
      (s.pickaxe - 1) * 2 +
      s.damageLevel * 4 +
      (s.recruits.includes("darius") ? 6 : 0);

    if (s.partyBuffUntil > Date.now()) amount *= 1.25;
    if (s.recruits.includes("silas")) amount *= 1.15;

    const chance = Math.min(
      0.5,
      s.critLevel * 0.05 +
      (id === "kael_rogue" ? 0.15 : 0)
    );

    const critical = Math.random() < chance;

    amount = Math.max(
      1,
      Math.floor(
        amount *
        (critical ? 1.8 : 1) *
        (0.88 + Math.random() * 0.24)
      )
    );

    s.enemy.hp -= amount;

    showDamage(
      (critical ? "CRIT " : "") + "-" + amount,
      "enemy"
    );

    if (s.enemy.hp <= 0) {
      defeatEnemy();
      break;
    }
  }

  if (s.enemy) enemyHitEffect();

  render();
  save();
}

  // ==========================================
  // ENEMY ATTACKS
  // ==========================================

  function enemyAttack() {
    if (!s.enemy || battleLocked()) return;

    // Target the first living hero in the shared priority order.
    const targetId = HERO_TARGET_ORDER.find(
      (id) =>
        s.heroes.includes(id) &&
        (Number(s.heroHp[id]) || 0) > 0
    );

    if (!targetId) {
      partyWiped();
      return;
    }

    const target = HEROES[targetId];

    let amount = Math.max(
      1,
      Math.floor(s.enemy.damage * (0.82 + Math.random() * 0.36))
    );

    if (s.guardCharges > 0) {
      amount = Math.ceil(amount * 0.45);
      s.guardCharges -= 1;

      log("Guard absorbed part of the incoming hit.");
    }

    s.heroHp[targetId] = Math.max(
      0,
      (s.heroHp[targetId] || 0) - amount
    );

    showDamage("-" + amount, "party");

    log(
      `${s.enemy.name} hits ${target.name} for ${amount} damage` +
      (s.heroHp[targetId] === 0 ? " — hero down!" : ".")
    );

    if (s.heroHp[targetId] === 0) {
      playImportantSound();
      toast(`${target.name} has fallen!`);

      if (livingHeroes().length > 0) {
        announce(
          s.region >= 2
            ? `Notice: ${target.name} is down. Would you like to use Phoenix Blessing?`
            : `Notice: ${target.name} is down. Phoenix Blessing unlocks in Cave 3. Use a Revive Snack if you have one.`
        );

        showPhoenixPrompt(targetId);
      }
    }

    if (!livingHeroes().length) {
      partyWiped();
    }

    render();
    save();
  }

  // ==========================================
  // PARTY WIPE AND HOSPITAL
  // ==========================================

function partyWiped() {
  if (s.needsHospital || isRecovering()) return;

  const fallenEnemy = s.enemy ? s.enemy.name : "the enemy";

  s.enemy = null;
  s.bossMode = false;

  partyClock = 0;
  enemyClock = 0;
  supportClock = 0;

  // The hospital fee is required whenever the party is wiped.
  // Elowen's passive must not bypass this requirement.
  s.needsHospital = true;
  s.healingUntil = 0;

  s.hospitalFee = Math.floor(
    400 + s.region * 300 + Math.floor(s.defeated / 10) * 100
  );

  playImportantSound();
  clearTimeout(exploreTimer);

  log(
    `Every hero has fallen against ${fallenEnemy}. ` +
    `The hospital requires ${s.hospitalFee} gold.`
  );

  announce(
    "Notice: The party has fallen. Pay the hospital fee to recover."
  );

  showHospitalPrompt();
  toast("Party wiped! Pay the hospital fee to recover.");

  render();
  save();
}
  // ==========================================
  // VICTORY AND NEW HEROES
  // ==========================================

function defeatEnemy() {
  const e = s.enemy;
  if (!e) return;

  s.gold += e.gold;
  s.crystals += e.crystals;
  addCaveCrystalProgress(e.crystals);
  s.ore += e.boss ? 8 : 1 + Math.floor(Math.random() * 3);
  s.defeated += 1;

  if (e.boss) {
    const clearedRegion = s.region;

    if (!s.bossDefeated.includes(clearedRegion)) {
      s.bossDefeated.push(clearedRegion);
    }

    log(
      `Guardian defeated! +${e.gold} gold, ` +
      `+${e.crystals} crystals, +8 ore.`
    );

    const rewardId = regions[clearedRegion].rewardHero;

    if (rewardId && !s.heroes.includes(rewardId)) {
      s.heroes.push(rewardId);
      s.heroHp[rewardId] = HEROES[rewardId].maxHp;

      const newHero = HEROES[rewardId];
      log(`${newHero.name} joined the party after the cave clear!`);

      queueUnlockReveal({
        category: "NEW HERO",
        title: `${newHero.name} Joins the Party`,
        imageSrc: newHero.portrait,
        description: `${newHero.role}. ${newHero.tagline}`,
        speech:
          `New hero unlocked: ${newHero.name}. ` +
          `${newHero.role}. ${newHero.tagline}`
      });
    } else {
      toast("Guardian defeated! Cave cleared.");
    }

    // Unlock Kingdom Autopilot after Cave 6.
    // Raphael evolves after all queued unlock cards finish.
    if (clearedRegion === 5 && !s.autoPilotUnlocked) {
      s.autoPilotUnlocked = true;

      toast("KINGDOM AUTOPILOT UNLOCKED!");
      log("Kingdom Autopilot unlocked after defeating The Silent Arbiter.");

      queueUnlockReveal({
        category: "NEW FEATURE",
        title: "Kingdom Autopilot",
        symbol: "◈",
        description:
          "I can manage upgrades, supplies, resources, and mining while your kingdom grows.",
        speech:
          "You've unlocked my kingdom-management mode. " +
          `Say ${assistantWakeName()}, activate autopilot, and I'll manage your kingdom.`
      });
    }

    if (clearedRegion < regions.length - 1) {
      s.region = clearedRegion + 1;
      s.caveCrystalProgress = 0;

      log(`Unlocked cave ${s.region + 1}: ${region().name}.`);

      queueUnlockReveal({
        category: "NEW CAVE",
        title: region().name,
        symbol: "⛰",
        description: region().desc,
        speech: `New cave unlocked: ${region().name}. ${region().desc}`
      });

      if (s.region === 1) {
        queueUnlockReveal({
          category: "NEW SKILL",
          title: "Healing Wave",
          symbol: "✧",
          description:
            "A wave of restorative magic heals every living ally.",
          speech:
            "New skill unlocked: Healing Wave. " +
            "Use it to restore health to your living allies."
        });
      } else if (s.region === 2) {
        queueUnlockReveal({
          category: "NEW SKILL",
          title: "Phoenix Blessing",
          symbol: "♨",
          description:
            "Revive one fallen hero with 40 percent of their maximum health.",
          speech:
            "New skill unlocked: Phoenix Blessing. " +
            "Use it to return one fallen hero to battle."
        });
      }
    } else {
      log("All cave guardians have fallen. The kingdom is saved!");

      // Safety net for older saves missing the feature unlock.
      if (!s.autoPilotUnlocked) {
        s.autoPilotUnlocked = true;
        toast("KINGDOM AUTOPILOT UNLOCKED!");

        queueUnlockReveal({
          category: "NEW FEATURE",
          title: "Kingdom Autopilot",
          symbol: "◈",
          description:
            "I can manage upgrades, supplies, resources, and mining while your kingdom grows.",
          speech:
            "You've unlocked my kingdom-management mode. " +
            `Say ${assistantWakeName()}, activate autopilot, and I'll manage your kingdom.`
        });
      }
    }
  } else {
    log(
      `${e.name} defeated. +${e.gold} gold and +${e.crystals} crystals.`
    );

    toast(`Victory! +${e.gold} gold · +${e.crystals} crystals`);
  }

  s.enemy = null;
  s.bossMode = false;

  partyClock = 0;
  enemyClock = 0;

  livingHeroes().forEach((id) => {
    s.heroHp[id] = Math.min(
      HEROES[id].maxHp,
      s.heroHp[id] + 7
    );
  });

  render();
  save();
  scheduleExplore();

  if (battleAutoPilot && !kingdomAutoPilot) {
    finishBattleAutopilot();
  }
}

  // ==========================================
  // SKILLS AND MANA
  // ==========================================

  function skill(key) {
    if (!(key in SKILL_MANA_COST)) return;

    if (!isSkillUnlocked(key)) {
      const caveNumber = skillUnlockRegion(key) + 1;
      return toast(`${key === "heal" ? "Healing Wave" : "Phoenix Blessing"} unlocks in Cave ${caveNumber}.`);
    }

    if (battleLocked()) {
      return toast(
        s.needsHospital
          ? "Pay the hospital fee first."
          : "Battles are paused during recovery."
      );
    }

    if (!livingHeroes().length) {
      return toast("Your party has fallen. Visit the hospital.");
    }

    if (s.cooldowns[key] > 0) {
      return toast(`Skill recharging: ${Math.ceil(s.cooldowns[key])}s`);
    }

    if (
      ["slash", "burst", "meteor", "frost"].includes(key) &&
      !s.enemy
    ) {
      return toast("There is no enemy to target yet.");
    }

    if (
      ["heal", "phoenix"].includes(key) &&
      !s.heroes.includes("celeste") &&
      !s.heroes.includes("sage")
    ) {
      return toast("Clear the first cave to unlock healer support.");
    }

    if (
      key === "phoenix" &&
      !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)
    ) {
      return toast("There is no fallen hero to revive.");
    }

    const manaCost = SKILL_MANA_COST[key];

    if (s.mana < manaCost) {
      return toast(`Not enough mana. ${manaCost} mana is required.`);
    }

    s.mana -= manaCost;

    const skillBonus = s.recruits.includes("silas") ? 1.15 : 1;

    if (key === "slash") {
      const amount = Math.floor(
        (45 + s.pickaxe * 5 + s.region * 12) * skillBonus
      );

      s.enemy.hp -= amount;
      s.cooldowns.slash = 8;

      showDamage("RADIANT -" + amount, "enemy");
      enemyHitEffect();

      log(`Radiant Slash deals ${amount} damage.`);
    } else if (key === "burst") {
      const amount = Math.floor(
        (72 + s.region * 20) * skillBonus
      );

      s.enemy.hp -= amount;
      s.cooldowns.burst = 14;

      showDamage("ARCANE -" + amount, "enemy");
      enemyHitEffect();

      log(`Arcane Burst deals ${amount} damage.`);
    } else if (key === "guard") {
      livingHeroes().forEach((id) => {
        s.heroHp[id] = Math.min(
          HEROES[id].maxHp,
          s.heroHp[id] + 12
        );
      });

      s.guardCharges = 1;
      s.cooldowns.guard = 18;

      showDamage("Aegis +12", "party", true);

      log("Guard healed the party and will soften the next hit.");
    } else if (key === "heal") {
      const amount = Math.floor(
        28 * (s.recruits.includes("elise") ? 1.2 : 1)
      );

      livingHeroes().forEach((id) => {
        s.heroHp[id] = Math.min(
          HEROES[id].maxHp,
          s.heroHp[id] + amount
        );
      });

      s.cooldowns.heal = 14;

      showDamage("HEAL +" + amount, "party", true);

      log(`Healing Wave restores up to ${amount} HP to each living ally.`);
    } else if (key === "meteor") {
      const amount = Math.floor(
        (105 + s.region * 28) * skillBonus
      );

      s.enemy.hp -= amount;
      s.cooldowns.meteor = 22;

      showDamage("METEOR -" + amount, "enemy");
      enemyHitEffect();

      log(`Meteor Rain deals ${amount} damage.`);
    } else if (key === "frost") {
      const amount = Math.floor(
        (22 + s.region * 6) * skillBonus
      );

      s.enemy.hp -= amount;
      s.frostUntil = Date.now() + 8000;
      s.cooldowns.frost = 17;

      showDamage("FROST -" + amount, "enemy");
      enemyHitEffect();

      log(`Frost Nova deals ${amount} damage and slows the enemy.`);
    } else if (key === "phoenix") {
      const fallen = s.heroes.find(
        (id) => (s.heroHp[id] || 0) <= 0
      );

      if (!fallen) {
        s.mana = Math.min(maxMana(), s.mana + manaCost);
        return toast("There is no fallen hero to revive.");
      }

      s.heroHp[fallen] = Math.ceil(HEROES[fallen].maxHp * 0.4);
      s.cooldowns.phoenix = 45;

      showDamage("REVIVE", "party", true);

      announce(`Notice: ${HEROES[fallen].name} has been revived.`);
      log(`${HEROES[fallen].name} returns with 40% HP!`);
    }

    if (s.enemy && s.enemy.hp <= 0) {
      defeatEnemy();
    }

    render();
    save();
  }

  // ==========================================
  // UPGRADES
  // ==========================================

  function upgrade(kind) {
    if (kind === "pickaxe") {
      const cost = pickCost();

      if (s.pickaxe >= 10 || s.crystals < cost) {
        return toast("Not enough crystals for that upgrade.");
      }

      s.crystals -= cost;
      s.pickaxe += 1;

      log(`Pickaxe upgraded to level ${s.pickaxe}.`);
      toast("Pickaxe upgraded!");
    } else if (kind === "speed") {
      const cost = speedCost();

      if (s.speedLevel >= 5 || s.crystals < cost) {
        return toast("Not enough crystals for that upgrade.");
      }

      s.crystals -= cost;
      s.speedLevel += 1;
      partyClock = 0;

      log(`Party attack interval is now ${pInterval().toFixed(1)} seconds.`);
      toast("Party tempo improved!");
    } else if (kind === "damage") {
      const cost = damageCost();

      if (s.damageLevel >= 10 || s.gold < cost) {
        return toast("Not enough gold for that upgrade.");
      }

      s.gold -= cost;
      s.damageLevel += 1;

      log(`Party damage increased to level ${s.damageLevel}.`);
      toast("Party hits harder!");
    } else if (kind === "crit") {
      const cost = critCost();

      if (s.critLevel >= 8 || s.crystals < cost) {
        return toast("Not enough crystals for that upgrade.");
      }

      s.crystals -= cost;
      s.critLevel += 1;

      log(`Critical strike chance increased to ${s.critLevel * 5}%.`);
      toast("Critical strikes improved!");
    }

    render();
    save();
  }
    // ==========================================
  // HIRE RECRUITS
  // ==========================================

  function hireRecruit(id) {
    const recruit = RECRUITS.find(
      (entry) => entry.id === id
    );

    if (!recruit || s.recruits.includes(id)) return;

    if (s.gold < recruit.cost) {
      return toast(`You need ${recruit.cost} gold to recruit ${recruit.name}.`);
    }

    s.gold -= recruit.cost;
    s.recruits.push(id);

    if (id === "iris") {
      s.mana = Math.min(maxMana(), s.mana + 25);

      log("Iris joined your expedition. Maximum mana and regeneration increased.");
      toast("Iris recruited! Maximum mana is now 125.");
    } else {
      log(`${recruit.name} joined your kingdom as a ${recruit.role.toLowerCase()}.`);
      toast(`${recruit.name} joined the kingdom!`);
    }

    render();
    save();
  }

  // ==========================================
  // USE SNACKS
  // ==========================================

  function useSnack(id) {
    const snack = SNACKS.find(
      (entry) => entry.id === id
    );

    if (!snack) return;

    if (battleLocked()) {
      return toast("Snacks can be used after hospital treatment.");
    }

    if (!livingHeroes().length) {
      return toast("Your party needs hospital treatment first.");
    }

    if (
      snack.effect === "revive" &&
      !s.heroes.some((heroId) => (s.heroHp[heroId] || 0) <= 0)
    ) {
      return toast("No hero needs reviving right now.");
    }

    if ((s.snacks[id] || 0) <= 0) {
      return toast("You are out of that snack. Buy more.");
    }

    if (snack.effect === "mana" && s.mana >= maxMana()) {
      return toast("Your mana is already full.");
    }

    s.snacks[id] -= 1;

    if (snack.effect === "healOne") {
      const living = livingHeroes().slice().sort(
        (a, b) =>
          (s.heroHp[a] / HEROES[a].maxHp) -
          (s.heroHp[b] / HEROES[b].maxHp)
      );

      if (living.length) {
        const idToHeal = living[0];

        const amount = Math.floor(
          35 * (s.recruits.includes("mira_cook") ? 1.25 : 1)
        );

        s.heroHp[idToHeal] = Math.min(
          HEROES[idToHeal].maxHp,
          s.heroHp[idToHeal] + amount
        );

        showDamage("+" + amount, "party", true);

        log(`Trail Rations restored HP to ${HEROES[idToHeal].name}.`);
      }
    } else if (snack.effect === "buff") {
      s.partyBuffUntil = Date.now() + 20000;
      log("Moonberries boosted party damage for 20 seconds.");
    } else if (snack.effect === "ore") {
      s.ore += 4;
      log("Miner's Tea refreshed the crew. +4 ore.");
    } else if (snack.effect === "healAll") {
      const amount = Math.floor(
        24 * (s.recruits.includes("mira_cook") ? 1.25 : 1)
      );

      livingHeroes().forEach((id) => {
        s.heroHp[id] = Math.min(
          HEROES[id].maxHp,
          s.heroHp[id] + amount
        );
      });

      showDamage("TEAM +" + amount, "party", true);
      log(`Crystal Cake healed the party by up to ${amount} HP.`);
    } else if (snack.effect === "mana") {
      const before = s.mana;

      s.mana = Math.min(maxMana(), s.mana + 35);

      const gained = Math.floor(s.mana - before);

      if (s.mana / maxMana() > 0.3) {
        s.manaWarning = false;
      }

      showDamage("MANA +" + gained, "party", true);
      log(`Etherberries restored ${gained} mana.`);
      toast(`Restored ${gained} mana.`);
    } else if (snack.effect === "manaBuff") {
      s.manaBuffUntil = Date.now() + 30000;

      log("Astral Tea tripled mana regeneration for 30 seconds.");
      toast("Mana regeneration boosted for 30 seconds!");
    } else if (snack.effect === "revive") {
      const fallen = s.heroes.find(
        (heroId) => (s.heroHp[heroId] || 0) <= 0
      );

      // Safety check: never consume the snack if the target disappeared.
      if (!fallen) {
        s.snacks[id] += 1;
        return toast("No hero needs reviving right now.");
      }

      s.heroHp[fallen] = Math.ceil(HEROES[fallen].maxHp * 0.4);
      showDamage("REVIVE", "party", true);
      announce(`Notice: ${HEROES[fallen].name} has been revived by a Revive Snack.`);
      log(`${HEROES[fallen].name} was revived with a Revive Snack at 40% HP.`);
      toast(`${HEROES[fallen].name} has been revived!`);
    }

    render();
    save();
  }

  function buySnack(id) {
    const snack = SNACKS.find(
      (entry) => entry.id === id
    );

    if (!snack) return;

    if (s.gold < snack.cost) {
      return toast(`You need ${snack.cost} gold to buy ${snack.name}.`);
    }

    s.gold -= snack.cost;
    s.snacks[id] = (s.snacks[id] || 0) + 1;

    log(`Bought one ${snack.name.toLowerCase()}.`);
    toast(`${snack.name} added to your bag.`);

    render();
    save();
  }

  // ==========================================
  // HOSPITAL
  // ==========================================

  function payHeal() {
    if (!s.needsHospital || isRecovering()) return;

    if (s.gold < s.hospitalFee) {
      return toast(`You need ${s.hospitalFee} gold to pay the healing fee.`);
    }

    s.gold -= s.hospitalFee;
    s.needsHospital = false;
    s.healingUntil = Date.now() + 60000;

    supportClock = 0;

    log(`Paid ${s.hospitalFee} gold. One-minute recovery has started.`);
    toast("Hospital fee paid. The party will heal for one minute.");

    render();
    save();
  }

  function finishHealing() {
    s.heroes.forEach((id) => {
      s.heroHp[id] = HEROES[id].maxHp;
    });

    s.healingUntil = 0;
    s.needsHospital = false;
    s.hospitalFee = 0;
    s.guardCharges = 0;
    supportClock = 0;

    log("Treatment complete. The entire party has recovered to full HP.");
    toast("Your party is back on its feet!");

    if (currentPrompt && currentPrompt.type === "hospital") {
      currentPrompt = null;
    }

    render();
    save();
    scheduleExplore();
  }

  // ==========================================
  // GREAT SAGE PROMPT ACTIONS
  // ==========================================

  function handleSageAction(button) {
    if (!button || button.disabled) return true;

    const action = button.dataset.sageAction;
    const value = button.dataset.value;

    if (!action) return false;

    if (action === "dismiss") {
      dismissPrompt();
      return true;
    }

    if (action === "phoenix") {
      dismissPrompt();
      skill("phoenix");
      return true;
    }

    if (action === "skill") {
      dismissPrompt();
      skill(value);
      return true;
    }

    if (action === "snack") {
      dismissPrompt();
      useSnack(value);
      return true;
    }

    if (action === "hospital") {
      dismissPrompt();
      payHeal();
      return true;
    }

    return false;
  }

  // ==========================================
  // PARTY, REWARDS, SNACKS AND RECRUITS
  // ==========================================

  function renderParty() {
    const battleParty = $("battleParty");

const rankOf = (id) => {
  const rank = HERO_TARGET_ORDER.indexOf(id);
  return rank < 0 ? 999 : rank;
};

// Living heroes sorted from first targeted to last targeted.
const livingIds = s.heroes
  .filter((id) => (Number(s.heroHp[id]) || 0) > 0)
  .sort((a, b) => rankOf(a) - rankOf(b));

// Fallen heroes go behind the living formation.
const fallenIds = s.heroes
  .filter((id) => (Number(s.heroHp[id]) || 0) <= 0)
  .sort((a, b) => rankOf(b) - rankOf(a));

// HTML flows left to right. Reverse the living order so the
// first target is on the right, closest to the enemy.
const displayIds = [
  ...fallenIds,
  ...livingIds.slice().sort(
    (a, b) => rankOf(b) - rankOf(a)
  )
];

// Living rank 1 becomes the front-most hero.
const frontRank = new Map(
  livingIds.map((id, index) => [id, index + 1])
);

// IMPORTANT: don't recreate every sprite on every game tick.
// Otherwise the attack animations would keep restarting.
const lineupKey = displayIds.map((id) =>
  `${id}:${(Number(s.heroHp[id]) || 0) <= 0
    ? "down"
    : "up"}:${frontRank.get(id) || 0}`
).join("|");

if (battleParty.dataset.lineupKey !== lineupKey) {
  battleParty.innerHTML = displayIds.map((id) => {
    const h = HEROES[id];
    const hp = Number(s.heroHp[id]) || 0;
    const down = hp <= 0;

    const rankClass = frontRank.has(id)
      ? `front-rank-${frontRank.get(id)}`
      : "";

    return `
      <img
        class="battle-hero ${down ? "fallen" : ""} ${rankClass}"
        data-hero="${id}"
        src="${h.portrait}"
        alt="${esc(h.name)}"
        title="${esc(h.name)} · ${Math.floor(hp)}/${h.maxHp} HP"
      >
    `;
  }).join("");

  battleParty.dataset.lineupKey = lineupKey;
}

// Update HP information without interrupting animations.
s.heroes.forEach((id) => {
  const img = battleParty.querySelector(`[data-hero="${id}"]`);

  if (img) {
    const hp = Number(s.heroHp[id]) || 0;

    img.title =
      `${HEROES[id].name} · ${Math.floor(hp)}/${HEROES[id].maxHp} HP`;
  }
});

    $("companions").innerHTML = s.heroes.map((id) => {
      const h = HEROES[id];
      const hp = s.heroHp[id] || 0;
      const pct = Math.max(0, hp / h.maxHp * 100);
      const down = hp <= 0;

      return `
        <article class="${down ? "is-fallen" : ""}">
          <div class="portrait">
            <img src="${h.portrait}" alt="${esc(h.name)}" loading="lazy">
          </div>
          <div class="companion-info">
            <b>${esc(h.name)}</b>
            <small>${esc(h.role)}</small>
            <div class="minibar">
              <i style="width:${pct}%"></i>
            </div>
            <small>${down ? "DOWN" : `HP ${Math.floor(hp)} / ${h.maxHp}`}</small>
          </div>
        </article>
      `;
    }).join("");

    $("partyPower").textContent = `PARTY POWER · ${fmt(totalPartyDamage())}`;
    $("partyAttackLabel").textContent = `Attack interval: ${pInterval().toFixed(1)}s`;
  }

  function renderRewards() {
    const next = $("nextHeroCard");
    const rewardId = region().rewardHero;

    if (bossDone()) {
      next.innerHTML = `
        <div class="reward-kicker">CAVE CLEARED</div>
        <b>Guardian defeated</b>
        <small>
          ${s.region === regions.length - 1
            ? "All cave guardians defeated."
            : "Your new path is open."}
        </small>
      `;
      return;
    }

        if (!rewardId || !HEROES[rewardId]) {
      next.innerHTML = `
        <div class="reward-kicker">CAVE GUARDIAN</div>
        <b>${esc(region().boss)}</b>
        <small>${esc(region().desc)}</small>
        <small>
          ${s.autoPilotUnlocked
            ? "Kingdom Autopilot is unlocked."
            : "Defeat The Silent Arbiter in Cave 6 to unlock Kingdom Autopilot."}
        </small>
      `;
      return;
    }

    const h = HEROES[rewardId];

    next.innerHTML = `
      <div class="reward-kicker">BOSS REWARD · NEW HERO</div>
      <div class="reward-row">
        <img src="${h.portrait}" alt="${esc(h.name)}" loading="lazy">
        <div>
          <b>${esc(h.name)}</b>
          <small>${esc(h.role)}</small>
          <small>${esc(h.tagline)}</small>
        </div>
      </div>
          `;
  }

  function renderSnacks() {
    $("snackGrid").innerHTML = SNACKS.map((snack) => {
      const count = s.snacks[snack.id] || 0;
      const noManaNeeded =
        snack.effect === "mana" && s.mana >= maxMana();
      const noReviveNeeded =
        snack.effect === "revive" &&
        !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0);

      return `
        <article class="snack-card">
          <div class="snack-top">
            <span>${snack.icon}</span>
            <b>${esc(snack.name)}</b>
            <em>×${count}</em>
          </div>
          <p>${esc(snack.desc)}</p>
          <div class="snack-actions">
            <button
              data-action="useSnack"
              data-value="${snack.id}"
              ${count <= 0 || battleLocked() || noManaNeeded || noReviveNeeded ? "disabled" : ""}
            >Use</button>
            <button
              data-action="buySnack"
              data-value="${snack.id}"
              class="buy-small"
              ${s.gold < snack.cost ? "disabled" : ""}
            >Buy ${snack.cost} G</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderRecruits() {
    $("recruitCount").textContent = `${s.recruits.length} hired`;

    $("recruitGrid").innerHTML = RECRUITS.map((recruit) => {
      const hired = s.recruits.includes(recruit.id);

      return `
        <article class="recruit-card ${hired ? "hired" : ""}">
          <img src="${recruit.portrait}" alt="${esc(recruit.name)}" loading="lazy">
          <div class="recruit-copy">
            <b>${esc(recruit.name)}</b>
            <small>${esc(recruit.role)}</small>
            <p>${esc(recruit.desc)}</p>
          </div>
          <button
            data-action="hire"
            data-value="${recruit.id}"
            ${hired || s.gold < recruit.cost ? "disabled" : ""}
          >${hired ? "Hired" : `Hire · ${recruit.cost} G`}</button>
        </article>
      `;
    }).join("");
  }

  function renderHospital() {
    const panel = $("hospitalPanel");
    const timer = isRecovering();
    const visible = s.needsHospital || timer;

    panel.hidden = !visible;

    if (!visible) return;

    $("hospitalTitle").textContent = timer
      ? "Your heroes are recovering"
      : "The whole party has fallen";

    $("hospitalStatus").textContent = timer
      ? "TREATMENT IN PROGRESS"
      : "TREATMENT NEEDED";

    $("hospitalCopy").textContent = timer
      ? "The healers are tending to your party. Battles are paused until the one-minute recovery finishes."
      : "Every hero has fallen. Pay the hospital fee to begin a full one-minute recovery.";

    $("hospitalFee").textContent = `${fmt(s.hospitalFee)} gold`;

    if (timer) {
      const seconds = Math.max(
        0,
        Math.ceil((s.healingUntil - Date.now()) / 1000)
      );

      $("hospitalTimer").textContent =
        `Recovery ends in ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

      $("payHealBtn").textContent = "Healing in progress…";
      $("payHealBtn").disabled = true;
    } else {
      $("hospitalTimer").textContent =
        s.gold < s.hospitalFee
          ? `You need ${fmt(s.hospitalFee - s.gold)} more gold.`
          : "Ready when you are";

      $("payHealBtn").textContent = `Pay ${fmt(s.hospitalFee)} G & start healing`;
      $("payHealBtn").disabled = s.gold < s.hospitalFee;
    }
  }

  // ==========================================
  // LOW-HEALTH ADVICE
  // ==========================================

  function checkPartyHealthWarning() {
    const active = livingHeroes();

    if (!active.length || battleLocked()) {
      lowHealthWarning = false;
      return;
    }

    const ratios = active.map(
      (id) => (s.heroHp[id] || 0) / HEROES[id].maxHp
    );

    const average = ratios.reduce(
      (sum, ratio) => sum + ratio,
      0
    ) / ratios.length;

    const healthIsLow =
      ratios.some((ratio) => ratio <= 0.35) ||
      average <= 0.45;

    if (healthIsLow && !lowHealthWarning) {
      lowHealthWarning = true;

      // Routine health advice is kept quiet; Sage only interrupts for important events.
    }

    if (ratios.every((ratio) => ratio >= 0.65)) {
      lowHealthWarning = false;

      if (currentPrompt && currentPrompt.type === "lowHealth") {
        currentPrompt = null;
        refreshSagePanel();
      }
    }
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================

  function render() {
    $("gold").textContent = fmt(s.gold);
    $("crystals").textContent = fmt(s.crystals);
    $("ore").textContent = fmt(s.ore);

    $("mana").textContent = `${Math.floor(s.mana)} / ${maxMana()}`;
    $("manaBar").style.width = `${Math.max(0, s.mana / maxMana() * 100)}%`;

    $("regionName").textContent = region().name;
    $("regionNumber").textContent = `CAVE ${String(s.region + 1).padStart(2, "0")}`;
    $("defeated").textContent = fmt(s.defeated);

    $("threat").textContent =
      ["Low", "Moderate", "High", "Extreme"][s.region] || "Mythic";

    $("guardianName").textContent = region().boss;
    $("guardianDesc").textContent = region().desc;

    $("bossPhase").textContent = bossDone()
      ? "DEFEATED"
      : s.bossMode
        ? "ENGAGED"
        : "DORMANT";

    const requiredCrystals = crystalGoal();
    const currentCrystalProgress = Math.floor(s.caveCrystalProgress);
    const gateReady = crystalGateOpen();

    $("caveProgressText").textContent =
      `${fmt(currentCrystalProgress)} / ${fmt(requiredCrystals)} crystals`;
        $("caveProgressBar").style.width =
      `${Math.min(100, currentCrystalProgress / requiredCrystals * 100)}%`;
    $("caveProgressHint").textContent = bossDone()
      ? "This guardian has been defeated. Your path is clear."
      : gateReady
        ? "Crystal gate open. You can challenge this cave's guardian."
        : `Mine or discover ${fmt(requiredCrystals - currentCrystalProgress)} more crystals. The requirement rises with each cave and every three monsters defeated.`;

    $("bossBtn").textContent = bossDone()
      ? "Guardian defeated"
      : s.bossMode
        ? "Guardian engaged"
        : !gateReady
          ? `Mine ${fmt(requiredCrystals - currentCrystalProgress)} more crystals`
          : "Challenge guardian";

    $("bossBtn").disabled =
      bossDone() || !gateReady || !!s.enemy || battleLocked() || !livingHeroes().length;

    $("exploreBtn").disabled =
      !!s.enemy || battleLocked() || !livingHeroes().length;

    $("enemyVisual").classList.toggle("hidden", !s.enemy);

    if (s.enemy) {
      $("battleTitle").textContent = s.enemy.name;
      $("enemyName").textContent = s.enemy.name;

      $("enemyType").textContent = s.enemy.boss
        ? "REGION GUARDIAN · BOSS"
        : s.enemy.type;

      $("enemyHealthText").textContent =
        `${fmt(s.enemy.hp)} / ${fmt(s.enemy.maxHp)}`;

      $("enemyHealthBar").style.width =
        `${Math.max(0, s.enemy.hp / s.enemy.maxHp * 100)}%`;

      $("enemySprite").src = s.enemy.sprite;
      $("enemySprite").alt = s.enemy.name;

      $("caption").textContent = s.enemy.boss
        ? "A guardian's ancient power surges…"
        : "The party fights together!";

      $("status").textContent = "● IN COMBAT";

      $("hint").textContent =
        "Your party fights automatically. Great Sage speaks up when a hero needs help or a major event occurs.";
    } else {
      $("battleTitle").textContent = "The Crystal Road";
      $("enemyName").textContent = "No enemy nearby";
      $("enemyType").textContent = "Awaiting discovery";
      $("enemyHealthText").textContent = "—";
      $("enemyHealthBar").style.width = "0";

      $("status").textContent =
        battleLocked() ? "● RECOVERING" : "● EXPLORING";

      $("caption").textContent = battleLocked()
        ? "The hospital doors are closed to monsters…"
        : "Your party is searching the tunnels…";

      $("hint").textContent = battleLocked()
        ? "Battles pause during hospital treatment. Mining is still open."
        : "Exploration happens automatically every 10–20 seconds. Each exploration has a 1-in-10 chance of finding a monster.";
    }

    $("pickaxeLevel").textContent = `Level ${s.pickaxe} / 10`;
    $("pickaxeCost").textContent = s.pickaxe >= 10 ? "MAX" : `${fmt(pickCost())} C`;
    $("pickaxeUpgrade").disabled = s.pickaxe >= 10 || s.crystals < pickCost();

    $("speedLevel").textContent = `Level ${s.speedLevel} / 5 · ${pInterval().toFixed(1)}s`;
    $("speedCost").textContent = s.speedLevel >= 5 ? "MAX" : `${fmt(speedCost())} C`;
    $("speedUpgrade").disabled = s.speedLevel >= 5 || s.crystals < speedCost();

    $("damageLevel").textContent = `Level ${s.damageLevel} / 10`;
    $("damageCost").textContent = s.damageLevel >= 10 ? "MAX" : `${fmt(damageCost())} G`;
    $("damageUpgrade").disabled = s.damageLevel >= 10 || s.gold < damageCost();

    $("critLevel").textContent = `Level ${s.critLevel} / 8 · ${s.critLevel * 5}%`;
    $("critCost").textContent = s.critLevel >= 8 ? "MAX" : `${fmt(critCost())} C`;
    $("critUpgrade").disabled = s.critLevel >= 8 || s.crystals < critCost();

    for (const key of Object.keys(SKILL_MANA_COST)) {
      const button = document.querySelector(`[data-skill="${key}"]`);
      const label = $("cd-" + key);
      const cost = SKILL_MANA_COST[key];

      const skillLocked = !isSkillUnlocked(key);
      const healerRequired =
        ["heal", "phoenix"].includes(key) &&
        !s.heroes.includes("celeste") &&
        !s.heroes.includes("sage");

      const targetRequired =
        ["slash", "burst", "meteor", "frost"].includes(key);

      if (label) {
        if (skillLocked || healerRequired) {
          label.textContent = "LOCKED";
        } else if (s.cooldowns[key] > 0) {
          label.textContent = `${Math.ceil(s.cooldowns[key])}s`;
        } else if (s.mana < cost) {
          label.textContent = `NEED ${cost} M`;
        } else {
          label.textContent = `READY · ${cost} M`;
        }

        label.classList.toggle(
          "cooling",
          s.cooldowns[key] > 0 || s.mana < cost
        );
      }

      if (button) {
        button.disabled =
          battleLocked() ||
          !livingHeroes().length ||
          skillLocked ||
          healerRequired ||
          (targetRequired && !s.enemy) ||
          s.cooldowns[key] > 0 ||
          s.mana < cost;
      }
    }

    if (kingdomAutoPilot) {
      updateSageStatus("KINGDOM AUTOPILOT · ACTIVE");
    } else if (battleAutoPilot) {
      updateSageStatus("BATTLE AUTOPILOT · ACTIVE");
    } else if (speechBusy) {
      updateSageStatus("SPEAKING");
    } else if (!sageEnabled) {
      updateSageStatus("VOICE MUTED");
    } else if (s.manaBuffUntil > Date.now()) {
      updateSageStatus("MANA BOOST ACTIVE");
    } else {
      updateSageStatus("VOICE ON");
    }

    renderParty();
    renderRewards();
    renderSnacks();
    renderRecruits();
    renderHospital();
    renderLog();
    refreshSagePanel();
    updateMusicScene();
  }

  // ==========================================
  // RESET GAME
  // ==========================================

  function resetGame() {
    const confirmed = window.confirm(
      "Reset the Crystal Kingdom game? This erases saved progress in this browser."
    );

    if (!confirmed) return;

    clearTimeout(exploreTimer);
    clearTimeout(toastTimer);

    clearTimeout(commandIdleTimer);
    commandIdleTimer = null;
    commandModeActive = false;
    cancelSageSpeech(true);
        try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(OLD_SAVE_KEY);
    } catch (error) {
      console.warn("Could not clear the previous save.", error);
    }

    s = clone(defaults);
    logs = [];
    currentPrompt = null;
    lowHealthWarning = false;
    partyClock = 0;
    enemyClock = 0;
    supportClock = 0;
    renderClock = 0;
    lastTick = performance.now();
    lastImportantSound = 0;
    sageEnabled = true;
    battleAutoPilot = false;
    kingdomAutoPilot = false;
    pendingSnackApproval = null;
    returnToIdleAfterSpeech = false;
    standDownAfterReply = false;

    save();
    render();
    scheduleExplore();
    toast("Game reset. Your new adventure begins!");
  }

  // ==========================================
  // BUTTON HANDLERS
  // ==========================================

  const musicVolumeControl = $("musicVolume");
  const musicAudioElement = $("backgroundMusic");
  if (musicVolumeControl && musicAudioElement) {
    musicAudioElement.volume = Number(musicVolumeControl.value);
    musicVolumeControl.addEventListener("input", () => {
      musicAudioElement.volume = Number(musicVolumeControl.value);
      updateMusicControl();
    });
    musicAudioElement.addEventListener("playing", updateMusicControl);
    musicAudioElement.addEventListener("pause", updateMusicControl);
    musicAudioElement.addEventListener("error", () => {
      updateMusicControl();
      console.warn("Background music could not be loaded. Check the MP3 file names and assets folder.");
    });
  }

  document.addEventListener("click", (event) => {
    const sageButton = event.target.closest("[data-sage-action]");

    if (sageButton) {
      handleSageAction(sageButton);
      return;
    }

    const skillButton = event.target.closest("[data-skill]");

    if (skillButton) {
      if (!skillButton.disabled) {
        skill(skillButton.dataset.skill);
      }
      return;
    }

    const button = event.target.closest("[data-action]");

    if (!button || button.disabled) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "sageToggle") {
      toggleSage();
      return;
    }

    if (action === "toggleMusic") {
      toggleMusic();
      return;
    }

    if (action === "explore") {
      explore();
      return;
    }

    if (action === "mine") {
      mine();
      return;
    }

    if (action === "boss") {
      if (!s.enemy && !bossDone()) {
        spawn(true);
      } else if (s.enemy) {
        toast("Defeat the current enemy before challenging the guardian.");
      }
      return;
    }

    if (action === "upgrade") {
      upgrade(value);
      return;
    }

    if (action === "hire") {
      hireRecruit(value);
      return;
    }

    if (action === "useSnack") {
      useSnack(value);
      return;
    }

    if (action === "buySnack") {
      buySnack(value);
      return;
    }

    if (action === "payHeal") {
      payHeal();
      return;
    }

    if (action === "clearLog") {
      logs = [];
      renderLog();
      save();
      return;
    }

    if (action === "reset") {
      resetGame();
      return;
    }
  });

  // Keyboard shortcuts for skills.
  document.addEventListener("keydown", (event) => {
    if (
      event.repeat ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement.tagName
      )
    ) {
      return;
    }

    const shortcuts = {
      q: "slash",
      w: "burst",
      e: "guard",
      r: "heal",
      t: "meteor",
      y: "frost",
      u: "phoenix"
    };

    const key = shortcuts[event.key.toLowerCase()];

    if (key) skill(key);
  });

  // ==========================================
  // MAIN GAME LOOP
  // ==========================================

  function tick() {
    const now = Date.now();
    const currentTime = performance.now();

    const dt = Math.min(
      0.5,
      Math.max(0, (currentTime - lastTick) / 1000)
    );

    lastTick = currentTime;

    if (s.healingUntil && now >= s.healingUntil) {
      finishHealing();
    }

    // Elowen's self-revival: if she falls, her own spirit returns after 60s.
    if (s.heroes.includes("elowen")) {
      const elowenAlive = (s.heroHp.elowen || 0) > 0;

      if (elowenAlive) {
        s.elowenSelfReviveAt = 0;
      } else {
        if (!s.elowenSelfReviveAt) {
  s.elowenSelfReviveAt = now + 60000;

  log("Elowen has fallen. Her spirit will return in 60 seconds.");
  save();
}

        if (now >= s.elowenSelfReviveAt) {
          s.heroHp.elowen = Math.ceil(HEROES.elowen.maxHp * 0.3);
          s.elowenSelfReviveAt = 0;
          s.elowenNextReviveAt = now + 30000;
          s.needsHospital = false;
          s.healingUntil = 0;
          s.hospitalFee = 0;
          showDamage("REVIVED", "party", true);
          announce("Notice: Elowen has revived herself with spirit magic.");
          log("Elowen revived herself at 30% HP after one minute.");
          render();
          save();
          if (!s.enemy && !battleLocked()) scheduleExplore();
        }
      }

      // Elowen passively revives one fallen ally every 30 seconds.
      const fallenAlly = s.heroes.find(
        (id) => id !== "elowen" && (s.heroHp[id] || 0) <= 0
      );

      if (
        elowenAlive &&
        fallenAlly &&
        livingHeroes().length > 0 &&
        now >= (s.elowenNextReviveAt || 0) &&
        !battleLocked()
      ) {
        s.heroHp[fallenAlly] = Math.ceil(HEROES[fallenAlly].maxHp * 0.3);
        s.elowenNextReviveAt = now + 30000;
        showDamage("REVIVED", "party", true);
        announce(`Notice: Elowen revived ${HEROES[fallenAlly].name} with spirit magic.`);
        log(`Elowen revived ${HEROES[fallenAlly].name} at 30% HP. Her next ally revival is ready in 30 seconds.`);
        render();
        save();
      }
    }

    // Recruit passive income.
    const goldRate =
      (s.recruits.includes("tessa") ? 0.8 : 0) +
      (s.recruits.includes("borin") ? 1.3 : 0);

    const crystalRate =
      s.recruits.includes("kellan") ? 0.3 : 0;

    s.gold += goldRate * dt;
    s.crystals += crystalRate * dt;

    // Mana regenerates even outside combat.
    s.mana = Math.min(
      maxMana(),
      s.mana + manaRate() * dt
    );

    const manaRatio = s.mana / maxMana();

    if (manaRatio < 0.2 && !s.manaWarning) {
      s.manaWarning = true;
      log("Mana is running low.");
      announce("Warning: Mana is running low. Use Etherberries or wait for mana to regenerate.");
    } else if (manaRatio > 0.3) {
      s.manaWarning = false;
    }

    checkPartyHealthWarning();

    // Kingdom Autopilot also manages hospital payments and can mine while
    // the party is locked by recovery, so run its manager outside the combat gate.
    if (kingdomAutoPilot) {
      runKingdomAutopilot(now, dt);
    }

    if (!battleLocked()) {
      Object.keys(s.cooldowns).forEach((key) => {
        s.cooldowns[key] = Math.max(0, s.cooldowns[key] - dt);
      });

      // Battle Autopilot acts at a measured pace, reserving skills for real needs.
      if (battleAutoPilot || kingdomAutoPilot) {
        battlePilotClock += dt;
        if (battlePilotClock >= 0.9) {
          battlePilotClock = 0;
          runBattleAutopilot(now);
        }
      }

      // Combat timers run only while an enemy exists.
      if (s.enemy) {
        partyClock += dt;
        enemyClock += dt;

        if (partyClock >= pInterval()) {
          partyClock = 0;
          partyAttack();
        }

        if (
          s.enemy &&
          !battleLocked() &&
          enemyClock >= eInterval()
        ) {
          enemyClock = 0;
          enemyAttack();
        }
      }

      // Celeste's passive healing also works when
      // no enemy is present.
      const celesteAlive =
        s.heroes.includes("celeste") &&
        livingHeroes().includes("celeste");

      if (celesteAlive) {
        supportClock += dt;

        if (supportClock >= 10) {
          supportClock -= 10;

          const amount =
            7 + (s.recruits.includes("elise") ? 4 : 0);

          let healedAnyone = false;

          for (const id of livingHeroes()) {
            const oldHp = s.heroHp[id];
            const maxHpForHero = HEROES[id].maxHp;

            const newHp = Math.min(
              maxHpForHero,
              oldHp + amount
            );

            const actualHealing = newHp - oldHp;

            if (actualHealing > 0) {
              s.heroHp[id] = newHp;
              showDamage("+" + actualHealing, "party", true);
              healedAnyone = true;
            }
          }

          if (healedAnyone) {
            log(`Celeste's healing aura restores up to ${amount} HP to every living hero.`);
          }
        }
      } else {
        supportClock = 0;
      }
    }

    renderClock += dt;    if (renderClock >= 0.25) {
      renderClock = 0;
      render();
    }

    if (
      Math.floor(now / 5000) !==
      Math.floor((now - dt * 1000) / 5000)
    ) {
      save();
    }
  }


  // ==========================================
  // GREAT SAGE WAKE-WORD VOICE ASSISTANT
  // ==========================================

  function sagePanelVisible() {
    return commandModeActive || speechBusy || speechQueue.length > 0 ||
      battleAutoPilot || kingdomAutoPilot || pendingSnackApproval !== null;
  }

  function updateMusicControl() {
    const audio = $("backgroundMusic");
    const button = $("musicToggle");
    const volume = $("musicVolume");
    const trackLabel = $("musicTrack");

    if (audio && volume) {
      const selectedVolume = Math.max(0, Math.min(1, Number(volume.value) || 0));
      const shouldDuck = commandModeActive || speechBusy || speechQueue.length > 0;
      audio.volume = selectedVolume * (shouldDuck ? MUSIC_DUCK_FACTOR : 1);
    }

    if (button) {
      const playing = !!audio && !audio.paused;
      button.textContent = !musicEnabled ? "♫ Music off" : playing ? "Ⅱ Pause music" : "▶ Play music";
      button.setAttribute("aria-pressed", String(playing));
    }

    if (trackLabel && currentMusicKey && MUSIC_TRACKS[currentMusicKey]) {
      trackLabel.textContent = MUSIC_TRACKS[currentMusicKey].label;
    }
  }

  function refreshSagePanel() {
    const panel = $("sagePanel");
    const orb = $("sageOrb");
    const dock = $("sageDock");
    const name = $("sageName");

if (name) {
  name.textContent = s.raphaelEvolved
    ? "RAPHAEL"
    : "GREAT SAGE";
}
    const shouldShow = sagePanelVisible();

if (dock) {
  dock.classList.toggle(
    "is-hidden",
    !(shouldShow || s.raphaelEvolved)
  );
}
    if (panel) panel.hidden = !shouldShow;

    if (orb) {
      orb.classList.toggle("is-speaking", speechBusy);
      orb.classList.toggle("is-listening", commandModeActive && !speechBusy);
      orb.classList.toggle("is-muted", !sageEnabled);
      orb.classList.toggle("is-battle-auto", battleAutoPilot && !kingdomAutoPilot);
      orb.classList.toggle("is-kingdom-auto", kingdomAutoPilot);
      orb.classList.toggle("is-raphael", Boolean(s.raphaelEvolved));
      orb.setAttribute("aria-label", kingdomAutoPilot
        ? "Great Sage Kingdom Autopilot is active. Say Great Sage, stand down to stop."
        : battleAutoPilot
          ? "Great Sage Battle Autopilot is active."
          : commandModeActive
            ? "Great Sage is listening. Click to return to wake-word standby."
            : "Great Sage voice assistant");
    }

    if (commandModeActive && !speechBusy) {
      updateSageStatus(kingdomAutoPilot
        ? "KINGDOM AUTOPILOT · ACTIVE"
        : battleAutoPilot
          ? "BATTLE AUTOPILOT · ACTIVE"
          : "LISTENING");
      updateSageMessage("Listening for commands… Say ‘never mind’ or ‘nothing’ to return to idle.");
    }

    updateMusicControl();
    renderSageActions();
  }

  function cancelSageSpeech(clearQueue = true) {
    speechGeneration++;
    if (clearQueue) speechQueue.length = 0;
    speechBusy = false;
    currentUtterance = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    updateMusicControl();
  }

  function armCommandIdleTimer() {
    clearTimeout(commandIdleTimer);
    if (!commandModeActive) return;

    commandIdleTimer = setTimeout(() => {
      if (speechBusy || speechQueue.length) {
        armCommandIdleTimer();
        return;
      }
      leaveCommandMode();
    }, COMMAND_IDLE_MS);
  }

  function enterCommandMode() {
    if (!sageEnabled) return;

    // If she was talking, the wake phrase interrupts her immediately.
    if (!commandModeActive || speechBusy || speechQueue.length) {
      cancelSageSpeech(true);
    }
    commandModeActive = true;
    currentPrompt = null;
    updateSageMessage("Listening for commands…");
    updateSageStatus("LISTENING");
    updateMusicControl();
    refreshSagePanel();
    armCommandIdleTimer();
  }

  function leaveCommandMode() {
    clearTimeout(commandIdleTimer);
    commandIdleTimer = null;
    commandModeActive = false;
    currentPrompt = null;
    updateSageStatus("WAKE WORD READY");
    updateMusicControl();
    refreshSagePanel();
  }

  function normalizeVoiceText(text) {
    let normalized = String(text || "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Common speech-to-text variants. These convert likely mishearings
    // into the exact item/command names used by the game.
    const speechAliases = [

      [/\b(?:rafael|rafayel|raffel|raphaell|raphiel)\b/g, "raphael"],
      // "Trail Rations" said casually as "tral rations", or transcribed
      // as "trail ratios", "trail ratings", etc.
      [/\b(?:tral|trale|trail|trial|treyl)\s+(?:rations?|raitions?|ratons?|ratios|ratings|raytions?)\b/g, "trail rations"],
      [/\b(?:trail|tral|trale|trial)\s+(?:ration|raition|raton)\b/g, "trail rations"],

      // Other snack names commonly split into two words by recognition.
      [/\bmoon\s+berries\b/g, "moonberries"],
      [/\bmoonberry\b/g, "moonberries"],
      [/\bether\s+berries\b/g, "etherberries"],
      [/\bether\s+berry\b/g, "etherberries"],
      [/\betherberry\b/g, "etherberries"],
      [/\b(?:astral|astro)\s+tea\b/g, "astral tea"],
      [/\bcrystal\s+cake\b/g, "crystal cake"],
      [/\b(?:revive|revived)\s+snack\b/g, "revive snack"],

      // Common command / skill variants.
      [/\bhealing\s+(?:way|weigh|wavey)\b/g, "healing wave"],
      [/\b(?:pick\s+axe|pick ax)\b/g, "pickaxe"],
      [/\bmind\s+crystals?\b/g, "mine crystals"],
      [/\bmine\s+crystal\b/g, "mine crystals"],
      [/\b(?:great\s+stage|grate\s+sage|gray\s+sage|grey\s+sage|great\s+sayj)\b/g, "great sage"],
      [/\b(?:anihalate|annihalate|annihilate)\b/g, "annihilate"],
      [/\bauto\s+pilot\b/g, "autopilot"],
      [/\b(?:goald|goals)\b/g, "gold"]
    ];

    for (const [pattern, replacement] of speechAliases) {
      normalized = normalized.replace(pattern, replacement);
    }

    return normalized.replace(/\s+/g, " ").trim();
  }

 function assistantWakeName() {
  return s.raphaelEvolved ? "Raphael" : "Great Sage";
}

function assistantWakePattern() {
  return s.raphaelEvolved
    ? /\braphael\b/i
    : /\bgreat\s+sage\b/i;
}

function stripWakePhrase(text) {
  const normalized = normalizeVoiceText(text);
  const pattern = assistantWakePattern();

  return normalized
    .replace(new RegExp(`^.*?${pattern.source}`, pattern.flags), "")
    .trim();
}

  function queueSageReply(message) {
    if (message) announce(message);
  }

  function skillVoiceLabel(key) {
    return {
      slash: "Radiant Slash",
      burst: "Arcane Burst",
      guard: "Guard",
      heal: "Healing Wave",
      meteor: "Meteor Rain",
      frost: "Frost Nova",
      phoenix: "Phoenix Blessing"
    }[key] || key;
  }

  function voiceSkillUnavailableReason(key) {
    if (!isSkillUnlocked(key)) return `${skillVoiceLabel(key)} unlocks in Cave ${skillUnlockRegion(key) + 1}.`;
    if (s.needsHospital) return "The party needs hospital treatment first.";
    if (isRecovering()) return "The party is still recovering.";
    if (!livingHeroes().length) return "No heroes are standing.";
    if (s.mana < SKILL_MANA_COST[key]) return `You need ${SKILL_MANA_COST[key]} mana.`;
    if ((s.cooldowns[key] || 0) > 0) return `${skillVoiceLabel(key)} is recharging for ${Math.ceil(s.cooldowns[key])} more seconds.`;
    if (["slash", "burst", "meteor", "frost"].includes(key) && !s.enemy) return "There is no enemy to attack right now.";
    if (["heal", "phoenix"].includes(key) && !s.heroes.includes("celeste") && !s.heroes.includes("sage")) return "Healer support has not joined the party yet.";
    if (key === "phoenix" && !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)) return "There is no fallen hero to revive.";
    return `${skillVoiceLabel(key)} cannot be used right now.`;
  }

  function getVoiceCommandMatches(text) {
    const choices = [
      { kind: "skill", key: "heal", label: "Healing Wave", patterns: [/\bhealing wave\b/gi, /\bheal\b/gi] },
      { kind: "skill", key: "slash", label: "Radiant Slash", patterns: [/\bradiant slash\b/gi, /\bslash\b/gi] },
      { kind: "skill", key: "burst", label: "Arcane Burst", patterns: [/\barcane burst\b/gi, /\bburst\b/gi] },
      { kind: "skill", key: "guard", label: "Guard", patterns: [/\baegis guard\b/gi, /\baegis\b/gi, /\bguard\b/gi] },
      { kind: "skill", key: "meteor", label: "Meteor Rain", patterns: [/\bmeteor rain\b/gi, /\bmeteor\b/gi] },
      { kind: "skill", key: "frost", label: "Frost Nova", patterns: [/\bfrost nova\b/gi, /\bfrost\b/gi] },
      { kind: "skill", key: "phoenix", label: "Phoenix Blessing", patterns: [/\bphoenix blessing\b/gi, /\bphoenix\b/gi] },
      { kind: "utility", key: "mine", label: "mining", patterns: [/\bmine\s+(?:some\s+)?crystals?\b/gi, /\bmine\b/gi] },
      { kind: "utility", key: "explore", label: "exploration", patterns: [/\bexplore\b/gi, /\bexploration\b/gi] },
      { kind: "utility", key: "status", label: "status report", patterns: [/\bstatus report\b/gi, /\bcheck status\b/gi, /\bstatus\b/gi] },
      { kind: "utility", key: "hospital", label: "hospital treatment", patterns: [/\bpay (?:the )?hospital(?: fee)?\b/gi, /\bpay (?:the )?healing fee\b/gi] },

      { kind: "upgrade", key: "pickaxe", label: "pickaxe", patterns: [/\bupgrade (?:my |the )?pickaxe\b/gi, /\bpickaxe upgrade\b/gi, /\bimprove (?:my |the )?pickaxe\b/gi] },
      { kind: "upgrade", key: "speed", label: "attack speed", patterns: [/\bupgrade (?:the )?(?:attack )?speed\b/gi, /\battack speed upgrade\b/gi] },
      { kind: "upgrade", key: "damage", label: "party damage", patterns: [/\bupgrade (?:the )?(?:party )?damage\b/gi, /\bdamage upgrade\b/gi] },
      { kind: "upgrade", key: "crit", label: "critical strikes", patterns: [/\bupgrade (?:the )?crit(?:ical)?(?: strikes?| chance)?\b/gi, /\bcritical strikes? upgrade\b/gi, /\bcritical strike chance\b/gi] },

      { kind: "snack", action: "use", key: "rations", label: "Trail Rations", patterns: [/\buse (?:the )?(?:trail rations|rations)\b/gi, /\beat (?:the )?(?:trail rations|rations)\b/gi] },
      { kind: "snack", action: "use", key: "moonberries", label: "Moonberries", patterns: [/\buse (?:the )?moonberries\b/gi, /\beat (?:the )?moonberries\b/gi] },
      { kind: "snack", action: "use", key: "tea", label: "Miner's Tea", patterns: [/\buse (?:the )?miner(?:\s+s)?\s+tea\b/gi, /\bdrink (?:the )?miner(?:\s+s)?\s+tea\b/gi] },
      { kind: "snack", action: "use", key: "cake", label: "Crystal Cake", patterns: [/\buse (?:the )?crystal cake\b/gi, /\beat (?:the )?crystal cake\b/gi] },
      { kind: "snack", action: "use", key: "etherberry", label: "Etherberries", patterns: [/\buse (?:the )?etherberries\b/gi, /\beat (?:the )?etherberries\b/gi] },
      { kind: "snack", action: "use", key: "astralTea", label: "Astral Tea", patterns: [/\buse (?:the )?astral tea\b/gi, /\bdrink (?:the )?astral tea\b/gi] },
      { kind: "snack", action: "use", key: "revive", label: "Revive Snack", patterns: [/\buse (?:the )?revive snack\b/gi] },

      { kind: "snack", action: "buy", key: "rations", label: "Trail Rations", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?(?:trail rations|rations)\b/gi] },
      { kind: "snack", action: "buy", key: "moonberries", label: "Moonberries", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?moonberries\b/gi] },
      { kind: "snack", action: "buy", key: "tea", label: "Miner's Tea", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?miner(?:\s+s)?\s+tea\b/gi] },
      { kind: "snack", action: "buy", key: "cake", label: "Crystal Cake", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?crystal cake\b/gi] },
      { kind: "snack", action: "buy", key: "etherberry", label: "Etherberries", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?etherberries\b/gi] },
      { kind: "snack", action: "buy", key: "astralTea", label: "Astral Tea", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?astral tea\b/gi] },
      { kind: "snack", action: "buy", key: "revive", label: "Revive Snack", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?revive snack\b/gi] },
      { kind: "snack", action: "use", key: "auto", label: "a suitable snack", patterns: [/\buse (?:a |the |some )?snack\b/gi, /\beat (?:a |the |some )?snack\b/gi] },
      { kind: "snack", action: "buy", key: "auto", label: "a snack", patterns: [/\b(?:buy|purchase|get)\s+(?:a |the |some )?snack\b/gi] }
    ];

    const matches = [];
    for (const choice of choices) {
      let first = null;
      for (const pattern of choice.patterns) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(text)) !== null) {
          if (!first || match.index < first.index || (match.index === first.index && match[0].length > first.text.length)) {
            first = { index: match.index, text: match[0] };
          }
          if (!match[0].length) regex.lastIndex++;
        }
      }
      if (first) matches.push({ ...choice, index: first.index });
    }

    matches.sort((a, b) => a.index - b.index);
    const seen = new Set();
    return matches.filter((choice) => {
      const id = `${choice.kind}:${choice.action || ""}:${choice.key}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function makeStatusReport() {
    const living = livingHeroes();
    const fallen = s.heroes.filter((id) => (s.heroHp[id] || 0) <= 0);
    const enemy = s.enemy
      ? `${s.enemy.name}, ${Math.max(0, Math.floor(s.enemy.hp))} of ${s.enemy.maxHp} health remaining`
      : "no enemy nearby";
    const health = living.length
      ? `${living.length} heroes standing${fallen.length ? ` and ${fallen.length} fallen` : ""}`
      : "no heroes standing";
const pilot = kingdomAutoPilot
  ? "I am managing the kingdom"
  : battleAutoPilot
    ? "I am handling the current battle"
    : "I am standing by";
    return `Status report. Cave ${s.region + 1}, ${region().name}. ${health}. Mana ${Math.floor(s.mana)} of ${maxMana()}. ${enemy}. ${fmt(s.gold)} gold, ${fmt(s.crystals)} crystals, and ${fmt(s.ore)} ore. ${pilot}.`;
  }

  function answerResourceQuestion(text) {
    const asks = /\b(how much|how many|what|tell me|show me|check|count|amount|do i have|my resources|resource report|inventory)\b/.test(text);
    const directResource = /^(?:gold|coins?|money|crystals?|ore|mana|snacks?|resources|inventory)$/.test(text);
    const names = {
      gold: /\b(?:gold|coins?|money)\b/.test(text),
      crystals: /\bcrystals?\b/.test(text),
      ore: /\bore\b/.test(text),
      mana: /\bmana\b/.test(text),
      snacks: /\b(?:snacks?|food|rations?)\b/.test(text),
      inventory: /\b(?:all resources|resources|inventory)\b/.test(text)
    };
    if (!asks && !directResource) return null;

    if (names.inventory) {
      return `You have ${fmt(s.gold)} gold, ${fmt(s.crystals)} crystals, ${fmt(s.ore)} ore, and ${Math.floor(s.mana)} of ${maxMana()} mana.`;
    }
    if (names.gold) return `You have ${fmt(s.gold)} gold.`;
    if (names.crystals) return `You have ${fmt(s.crystals)} crystals.`;
    if (names.ore) return `You have ${fmt(s.ore)} ore.`;
    if (names.mana) return `You have ${Math.floor(s.mana)} out of ${maxMana()} mana.`;
    if (names.snacks) {
      const counts = SNACKS.map((snack) => `${snack.name}: ${s.snacks[snack.id] || 0}`).join(", ");
      return `Your snack inventory is: ${counts}.`;
    }
    return null;
  }

  function elowenPassiveReadyForFallenAlly(now = Date.now()) {
    const allyIsDown = s.heroes.some((id) => id !== "elowen" && (s.heroHp[id] || 0) <= 0);
    return s.heroes.includes("elowen") &&
      (s.heroHp.elowen || 0) > 0 &&
      allyIsDown &&
      now >= (s.elowenNextReviveAt || 0) &&
      !battleLocked();
  }

  function chooseSnackForBattlePrompt(now = Date.now()) {
    const living = livingHeroes();
    const fallen = s.heroes.some((id) => (s.heroHp[id] || 0) <= 0);

    // Never spend revival items while Elowen's passive is ready to revive an ally,
    // or while Elowen herself is already waiting for her self-revival timer.
    if (elowenPassiveReadyForFallenAlly(now)) return null;
    if ((s.heroHp.elowen || 0) <= 0 && s.elowenSelfReviveAt > now) return null;

    if (fallen && living.length && (s.snacks.revive || 0) > 0) return "revive";
    const injured = living.filter((id) => s.heroHp[id] < HEROES[id].maxHp);
    if (injured.length >= 2 && (s.snacks.cake || 0) > 0) return "cake";
    if (injured.length && (s.snacks.rations || 0) > 0) return "rations";
    if (s.mana < maxMana() * 0.22 && (s.snacks.etherberry || 0) > 0) return "etherberry";
    return null;
  }

  function askToUseBattleSnack(snackId) {
    if (!snackId || pendingSnackApproval) return;
    const snack = SNACKS.find((item) => item.id === snackId);
    if (!snack) return;
    pendingSnackApproval = snackId;
    announce(`The party may need ${snack.name}. Would you like me to use it? Say yes or no.`);
    log(`Battle Autopilot is asking permission to use ${snack.name}.`);
  }

  function finishBattleAutopilot() {
    if (!battleAutoPilot) return;
    battleAutoPilot = false;
    pendingSnackApproval = null;
    if (!kingdomAutoPilot) {       standDownAfterReply = true;
      announce("Enemy defeated. Battle Autopilot is standing down.");
    }
    refreshSagePanel();
  }

  function startBattleAutopilot() {
    battleAutoPilot = true;
    battlePilotClock = 0;
    pendingSnackApproval = null;
    cancelSageSpeech(true);
    standDownAfterReply = false;
    announce(s.enemy
      ? `Battle Autopilot engaged. I will defeat ${s.enemy.name}, use skills responsibly, and protect the party.`
      : "Battle Autopilot armed. I will engage the next enemy we encounter.");
    log("Battle Autopilot activated by the player.");
    refreshSagePanel();
  }

  function startKingdomAutopilot() {
    if (!s.autoPilotUnlocked) {
  queueSageReply(
  "I cannot manage the kingdom yet. Defeat the guardian in the Sage's Crucible to unlock my kingdom-management mode."
);
      return;
    }
    kingdomAutoPilot = true;
    battleAutoPilot = false;
    kingdomMineClock = 0;
    kingdomManagementClock = 0;
    kingdomRecruitClock = 0;
    kingdomUpgradeClock = 0;
    battlePilotClock = 0;
    pendingSnackApproval = null;
    cancelSageSpeech(true);
    standDownAfterReply = false;
announce(
  `I am managing your kingdom now. I will handle urgent healing, ` +
  `revive fallen heroes responsibly, buy necessary supplies, ` +
  `improve our equipment, and mine when it is safe. ` +
  `Say ${assistantWakeName()}, stand down to stop me.`
);
    log("Kingdom Autopilot activated by the player.");
    refreshSagePanel();
    save();
  }

  function stopAllAutopilots() {
    battleAutoPilot = false;
    kingdomAutoPilot = false;
    pendingSnackApproval = null;
    battlePilotClock = 0;
    kingdomMineClock = 0;
    kingdomManagementClock = 0;
    kingdomRecruitClock = 0;
    kingdomUpgradeClock = 0;
    log("Great Sage's Autopilot modes are now off.");
    toast("Autopilot stood down.");
    standDownAfterReply = true;
    queueSageReply("Understood. I am standing down. Both Autopilot modes are off.");
    refreshSagePanel();
  }

  function handleSnackYesNo(text) {
    if (!pendingSnackApproval) return false;
    if (/^(?:yes|yeah|yep|sure|okay|ok|do it|go ahead|affirmative)$/.test(text)) {
      const snackId = pendingSnackApproval;
      pendingSnackApproval = null;
      const snack = SNACKS.find((item) => item.id === snackId);
      if (snack && (s.snacks[snackId] || 0) > 0) {
        useSnack(snackId);
        queueSageReply(`Understood. I tried to use ${snack.name}.`);
      } else {
        queueSageReply("That snack is no longer available.");
      }
      return true;
    }
    if (/^(?:no|nope|not now|don't|do not|negative)$/.test(text)) {
      const snack = SNACKS.find((item) => item.id === pendingSnackApproval);
      pendingSnackApproval = null;
      queueSageReply(`Understood. I will not use ${snack ? snack.name : "that snack"}.`);
      return true;
    }
    return false;
  }

  function handleVoiceCommand(rawText) {
    const text = normalizeVoiceText(stripWakePhrase(rawText));

    if (/\b(?:stand down|autopilot off|auto pilot off|stop autopilot|stop auto pilot)\b/.test(text)) {
      stopAllAutopilots();
      return;
    }

    if (/\bnever mind\b|\bnothing\b/.test(text) || /\b(cancel|go idle|back to idle|stop listening)\b/.test(text)) {
      cancelSageSpeech(true);
      leaveCommandMode();
      return;
    }

    if (!text) {
      updateSageMessage("Listening for commands…");
      armCommandIdleTimer();
      refreshSagePanel();
      return;
    }

    if (/^(?:thanks|thank you|thanks a lot|thanks so much|thank you so much|thank you very much|many thanks)$/.test(text)) {
      returnToIdleAfterSpeech = true;
      queueSageReply("I'm happy to help you. If you need anything, please let me know.");
      return;
    }

    if (pendingSnackApproval && handleSnackYesNo(text)) return;

    // Battle Autopilot is always available.
    if (/\b(?:annihilate|anihalate|annihalate|eliminate)\b.*\b(?:enemy|enemies|monster|monsters|them|it)\b/.test(text) || /^annihilate(?: the)? enemy$/.test(text)) {
      startBattleAutopilot();
      return;
    }

    // Kingdom Autopilot only unlocks after the new final guardian is defeated.
    if (/\b(?:activate|enable|start|engage|begin|turn on|switch on)\s+(?:the\s+)?(?:(?:true|full|kingdom|resource management)\s+)?auto\s*pilot(?:\s+mode)?\b/.test(text) ||
        /\b(?:true|full|kingdom)\s+auto\s*pilot\b/.test(text) ||
        /^autopilot on$/.test(text) || /^auto pilot on$/.test(text) ||
        /^manage my kingdom$/.test(text)) {
      startKingdomAutopilot();
      return;
    }

    // Answer resource questions before the general command matcher.
    const resourceAnswer = answerResourceQuestion(text);
    if (resourceAnswer) {
      queueSageReply(resourceAnswer);
      return;
    }

    clearTimeout(commandIdleTimer);
    commandIdleTimer = null;

    const commands = getVoiceCommandMatches(text);
    if (!commands.length) {
      queueSageReply("I did not recognize that command. Try mine crystals, upgrade pickaxe, buy trail rations, ask how much gold you have, or say annihilate the enemy.");
      return;
    }

    const completed = [];
    const replies = [];

    function chooseSnackToUse() {
      const available = (id) => (s.snacks[id] || 0) > 0;
      const living = livingHeroes();
      const fallen = s.heroes.some((id) => (s.heroHp[id] || 0) <= 0);
      const injured = living.filter((id) => s.heroHp[id] < HEROES[id].maxHp);
      if (fallen && living.length && available("revive") && !elowenPassiveReadyForFallenAlly()) return "revive";
      if (injured.length >= 2 && available("cake")) return "cake";
      if (injured.length && available("rations")) return "rations";
      if (s.mana < maxMana() - 10 && available("etherberry")) return "etherberry";
      if (s.enemy && available("moonberries") && s.partyBuffUntil <= Date.now()) return "moonberries";
      if (s.manaBuffUntil <= Date.now() && available("astralTea")) return "astralTea";
      if (available("tea")) return "tea";
      return null;
    }

    for (const command of commands) {
      if (command.kind === "skill") {
        // Let Elowen's ready passive handle a fallen ally before spending Phoenix mana.
        if (command.key === "phoenix" && elowenPassiveReadyForFallenAlly()) {
          replies.push("Elowen's spirit revival is ready. I will let her passive revive the fallen ally instead.");
        } else if (canUseSkill(command.key)) {
          skill(command.key);
          completed.push(command.label);
        } else {
          replies.push(voiceSkillUnavailableReason(command.key));
        }
      } else if (command.kind === "utility" && command.key === "mine") {
        mine();
        completed.push("mining");
      } else if (command.kind === "utility" && command.key === "explore") {
        if (s.enemy) replies.push("Defeat the current enemy before exploring again.");
        else if (battleLocked()) replies.push("The party is unavailable during hospital treatment.");
        else { explore(); completed.push("exploration"); }
      } else if (command.kind === "utility" && command.key === "status") {
        replies.push(makeStatusReport());
      } else if (command.kind === "utility" && command.key === "hospital") {
        if (s.needsHospital && s.gold >= s.hospitalFee) {
          payHeal();
          completed.push("hospital treatment");
        } else if (s.needsHospital) {
          replies.push(`The hospital needs ${fmt(s.hospitalFee)} gold.`);
        } else {
          replies.push("Your party does not need hospital payment right now.");
        }
      } else if (command.kind === "upgrade") {
        const levelKey = { pickaxe: "pickaxe", speed: "speedLevel", damage: "damageLevel", crit: "critLevel" }[command.key];
        const previousLevel = s[levelKey];
        upgrade(command.key);
        if (s[levelKey] > previousLevel) completed.push(`${command.label} upgrade`);
        else replies.push(`I could not upgrade ${command.label}. You may need more resources or it may already be at its maximum level.`);
      } else if (command.kind === "snack") {
        let snackId = command.key;
        if (snackId === "auto" && command.action === "use") {
          snackId = chooseSnackToUse();
          if (!snackId) { replies.push("I could not find a suitable snack in your bag to use right now."); continue; }
        }
        if (snackId === "auto" && command.action === "buy") {
          const affordable = SNACKS.filter((item) => item.cost <= s.gold).sort((a, b) => a.cost - b.cost);
          if (!affordable.length) { replies.push("You do not have enough gold to buy any snack."); continue; }
          snackId = affordable[0].id;
        }
        const snack = SNACKS.find((item) => item.id === snackId);
        if (!snack) { replies.push("I could not find that snack."); continue; }
        if (command.action === "buy") {
          const oldGold = s.gold;
          const oldCount = s.snacks[snackId] || 0;
          buySnack(snackId);
          if ((s.snacks[snackId] || 0) > oldCount && s.gold < oldGold) completed.push(`buying ${snack.name}`);
          else replies.push(`I could not buy ${snack.name}. You need ${snack.cost} gold.`);
        } else {
          const oldCount = s.snacks[snackId] || 0;
          if (snackId === "revive" && elowenPassiveReadyForFallenAlly()) {
            replies.push("Elowen's revival is ready, so I will save the Revive Snack.");
          } else {
            useSnack(snackId);
            if ((s.snacks[snackId] || 0) < oldCount) completed.push(`using ${snack.name}`);
            else replies.push(`I could not use ${snack.name}. Check your inventory and party status.`);
          }
        }
      }
    }

    if (completed.length) replies.unshift(`Done. ${completed.join(" and ")} ${completed.length === 1 ? "command is" : "commands are"} complete.`);
    queueSageReply(replies.join(" ") || "Command complete.");
  }

  function runBattleAutopilot(now = Date.now()) {
    if ((!battleAutoPilot && !kingdomAutoPilot) || !s.enemy || battleLocked()) return;
    if (!livingHeroes().length) return;

    // Give Elowen's ready passive priority over Phoenix/revival items.
    if (elowenPassiveReadyForFallenAlly(now)) return;

    const fallen = s.heroes.filter((id) => (s.heroHp[id] || 0) <= 0);
    if (fallen.length) {
      // Do not spend revival items on Elowen while her self-revival is pending.
      const elowenWaitingOnSelf = fallen.includes("elowen") && s.elowenSelfReviveAt > now;
      if (!elowenWaitingOnSelf && canUseSkill("phoenix")) {
        skill("phoenix");
        battlePilotClock = 0;
        return;
      }
      if (!kingdomAutoPilot) {
        const snackId = (s.snacks.revive || 0) > 0 ? "revive" : null;
        if (snackId) askToUseBattleSnack(snackId);
      }
      if (kingdomAutoPilot) runKingdomSupplies(now);
      return;
    }

    const living = livingHeroes();
    const ratios = living.map((id) => (s.heroHp[id] || 0) / HEROES[id].maxHp);
    const lowHero = ratios.some((ratio) => ratio <= 0.32);
    const manyHurt = ratios.filter((ratio) => ratio <= 0.72).length >= 2;
    const avgRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) / Math.max(1, ratios.length);

    if (canUseSkill("heal") && (lowHero || manyHurt || avgRatio <= 0.72)) {
      skill("heal");
      battlePilotClock = 0;
      return;
    }
    if (canUseSkill("guard") && (manyHurt || avgRatio <= 0.65)) {
      skill("guard");
      battlePilotClock = 0;
      return;
    }

    if (kingdomAutoPilot) {
      if (runKingdomSupplies(now)) {
        battlePilotClock = 0;
        return;
      }
    } else if (lowHero || avgRatio <= 0.48 || (s.mana < maxMana() * 0.15 && s.enemy.boss)) {
      const snackId = chooseSnackForBattlePrompt(now);
      if (snackId) {
        askToUseBattleSnack(snackId);
        return;
      }
    }

    // Damage skill order favours high impact, then cheaper/faster attacks.
    for (const key of ["meteor", "burst", "slash", "frost"]) {
      if (canUseSkill(key)) {
        skill(key);
        battlePilotClock = 0;
        return;
      }
    }
  }

  function runKingdomSupplies(now = Date.now()) {
    if (!kingdomAutoPilot) return false;
    if (s.elowenSelfReviveAt > now && (s.heroHp.elowen || 0) <= 0) return true;
    if (elowenPassiveReadyForFallenAlly(now)) return true;

    if (s.needsHospital && !isRecovering() && s.gold >= s.hospitalFee) {
      payHeal();
      return true;
    }
    if (battleLocked()) return false;

    const living = livingHeroes();
    const fallen = s.heroes.filter((id) => (s.heroHp[id] || 0) <= 0);

    if (fallen.length && living.length) {
      if (canUseSkill("phoenix")) {
        skill("phoenix");
        return true;
      }
      if ((s.snacks.revive || 0) <= 0 && s.gold >= (SNACKS.find((item) => item.id === "revive").cost)) {
        buySnack("revive");
        if ((s.snacks.revive || 0) > 0) {
          useSnack("revive");
          return true;
        }
      }
      if ((s.snacks.revive || 0) > 0) {
        useSnack("revive");
        return true;
      }
    }

    const urgentInjury = living.some((id) => (s.heroHp[id] || 0) / HEROES[id].maxHp <= 0.42);
    const livingInjured = living.filter((id) => (s.heroHp[id] || 0) < HEROES[id].maxHp);
    if (urgentInjury && living.length) {
      if (livingInjured.length >= 2 && (s.snacks.cake || 0) > 0) {
        useSnack("cake");
        return true;
      }
      if ((s.snacks.rations || 0) > 0) {
        useSnack("rations");
        return true;
      }
      const rationCost = SNACKS.find((item) => item.id === "rations").cost;
      if (s.gold >= rationCost) {
        buySnack("rations");
        if ((s.snacks.rations || 0) > 0) {
          useSnack("rations");
          return true;
        }
      }
    }

    if (s.mana <= maxMana() * 0.24) {
      if ((s.snacks.etherberry || 0) > 0) {
        useSnack("etherberry");
        return true;
      }
      const manaSnackCost = SNACKS.find((item) => item.id === "etherberry").cost;
      if (s.gold >= manaSnackCost) {         buySnack("etherberry");
        if ((s.snacks.etherberry || 0) > 0) {
          useSnack("etherberry");
          return true;
        }
      }
    }

    return false;
  }

  function runKingdomAutopilot(now = Date.now(), dt = 0) {
    if (!kingdomAutoPilot) return;

    kingdomMineClock += dt;
    kingdomManagementClock += dt;
    kingdomRecruitClock += dt;
    kingdomUpgradeClock += dt;

    if (s.needsHospital && !isRecovering()) {
      if (s.gold >= s.hospitalFee) {
        payHeal();
        return;
      }
      if (kingdomMineClock >= 12) {
        kingdomMineClock = 0;
        mine();
      }
      return;
    }

    // Emergency supplies are reviewed often, including during combat.
    if (kingdomManagementClock >= 2) {
      kingdomManagementClock = 0;
      if (runKingdomSupplies(now)) return;
    }

    // Upgrade one stat at a time; this prevents spending the entire purse instantly.
    if (!battleLocked() && kingdomUpgradeClock >= 18) {
      kingdomUpgradeClock = 0;
      const possible = [
        { key: "damage", level: s.damageLevel, max: 10, funds: s.gold, cost: damageCost() },
        { key: "pickaxe", level: s.pickaxe, max: 10, funds: s.crystals, cost: pickCost() },
        { key: "speed", level: s.speedLevel, max: 5, funds: s.crystals, cost: speedCost() },
        { key: "crit", level: s.critLevel, max: 8, funds: s.crystals, cost: critCost() }
      ];
      const choice = possible.find((item) => item.level < item.max && item.funds >= item.cost);
      if (choice) {
        upgrade(choice.key);
        announce(`I upgraded ${choice.key === "crit" ? "critical strikes" : choice.key}.`);
        return;
      }
    }

    // Recruit one affordable helper every 45 seconds, never repeatedly in one tick.
    if (!battleLocked() && kingdomRecruitClock >= 45) {
      kingdomRecruitClock = 0;
      const recruitPriority = ["tessa", "borin", "luna", "kellan", "darius", "silas", "mira_cook", "elise", "iris", "juno"];
      const recruit = recruitPriority
        .map((id) => RECRUITS.find((item) => item.id === id))
        .find((item) => item && !s.recruits.includes(item.id) && s.gold >= item.cost);
      if (recruit) {
        hireRecruit(recruit.id);
        announce(`I hired ${recruit.name} to help the expedition.`);
        return;
      }
    }

    // Mine in safe moments, but pause mining while enemies are present.
    if (!s.enemy && !battleLocked() && kingdomMineClock >= 12) {
      kingdomMineClock = 0;
      mine();
    }
  }

  function handleRecognitionResult(event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const rawText = (result[0] && result[0].transcript) || "";
      if (!rawText.trim()) continue;

      const text = normalizeVoiceText(rawText);
      const wake = assistantWakePattern().exec(text);
      const exitPhrase = /\bnever mind\b|\bnothing\b|\bgo idle\b|\bstop listening\b/i.test(text);
      const yesNo = /^(?:yes|yeah|yep|sure|okay|ok|do it|go ahead|affirmative|no|nope|not now|negative)$/.test(text);
      const thanks = /^(?:thanks|thank you|thanks a lot|thanks so much|thank you so much|thank you very much|many thanks)$/.test(text);
      const standDown = /\bstand down\b|\bautopilot off\b|\bstop autopilot\b/.test(text);

      // A wake phrase interrupts current speech and enters command mode.
      if (wake && (!commandModeActive || speechBusy || speechQueue.length)) {
        enterCommandMode();
        const trailing = text.slice(wake.index + wake[0].length).trim();
        if (result.isFinal && trailing) handleVoiceCommand(trailing);
        else if (result.isFinal) armCommandIdleTimer();
        continue;
      }

      // A pending snack approval may be answered with a bare yes/no,
      // even if Great Sage's 5-second command window has ended.
      if (pendingSnackApproval && yesNo && result.isFinal) {
        cancelSageSpeech(true);
        ignoreRecognitionUntil = 0;
        handleVoiceCommand(text);
        continue;
      }

      // Gratitude is also recognized during an active assistant/autopilot session,
      // even when she is not speaking at that exact moment.
      if ((commandModeActive || battleAutoPilot || kingdomAutoPilot) && !speechBusy && result.isFinal && thanks) {
        handleVoiceCommand(text);
        continue;
      }

      // Thanks and Stand Down can interrupt her current reply while active.
      if ((commandModeActive || battleAutoPilot || kingdomAutoPilot) && speechBusy && result.isFinal && (thanks || standDown)) {
        cancelSageSpeech(true);
        ignoreRecognitionUntil = 0;
        handleVoiceCommand(text);
        continue;
      }

      // While either autopilot is running, commands can interrupt a reply if they
      // start with a clear action word and match an actual game command.
      if ((commandModeActive || battleAutoPilot || kingdomAutoPilot) && speechBusy) {
        const startsWithAction = /^(?:please\s+)?(?:use|cast|activate|mine|explore|upgrade|improve|buy|purchase|get|pay|annihilate|enable|start|turn on|stand down)\b/.test(text);
        if (startsWithAction && getVoiceCommandMatches(text).length > 0 && result.isFinal) {
          cancelSageSpeech(true);
          ignoreRecognitionUntil = 0;
          if (!commandModeActive) enterCommandMode();
          handleVoiceCommand(text);
          continue;
        }
      }

      if (commandModeActive && exitPhrase) {
        handleVoiceCommand(text);
        continue;
      }

      // Ignore the assistant's own speech except for wake, yes/no, thanks and stop.
      if (speechBusy || Date.now() < ignoreRecognitionUntil) continue;

      if (commandModeActive) {
        armCommandIdleTimer();
        if (result.isFinal) {
          handleVoiceCommand(text);
        } else {
          updateSageMessage("Listening for commands…");
          updateSageStatus("LISTENING");
          refreshSagePanel();
        }
      }
    }
  }

  function startWakeRecognition() {
    if (!recognition || !recognitionEnabled || recognitionRunning) return;
    if (recognitionRestartTimer) {
      clearTimeout(recognitionRestartTimer);
      recognitionRestartTimer = null;
    }
    try {
      recognition.start();
      recognitionRunning = true;
    } catch (error) {
      if (error && error.name === "InvalidStateError") return;
      console.warn("Great Sage could not start speech recognition.", error);
      scheduleRecognitionRestart(1000);
    }
  }

  function scheduleRecognitionRestart(delay = 450) {
    if (!recognitionEnabled || recognitionRestartTimer) return;
    recognitionRestartTimer = setTimeout(() => {
      recognitionRestartTimer = null;
      startWakeRecognition();
    }, delay);
  }

  function setupWakeRecognition() {
    if (!SpeechRecognitionAPI) {
      console.warn("This browser does not support speech recognition.");
      updateSageStatus("VOICE COMMANDS UNSUPPORTED");
      setTimeout(() => toast("Voice commands require speech recognition support and microphone access in your browser."), 800);
      return;
    }

    recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { recognitionRunning = true; };
    recognition.onresult = handleRecognitionResult;
    recognition.onerror = (event) => {
      recognitionRunning = false;
      console.warn("Great Sage voice recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        recognitionEnabled = false;
        updateSageStatus("MICROPHONE PERMISSION NEEDED");
        if (!recognitionPermissionWarningShown) {
          recognitionPermissionWarningShown = true;
          toast("Allow microphone access for this site, then reload the game to use Great Sage voice commands.");
        }
        return;
      }
      if (event.error === "audio-capture" && !recognitionPermissionWarningShown) {
        recognitionPermissionWarningShown = true;
        toast("Great Sage could not find a microphone. Check your microphone settings.");
      }
      scheduleRecognitionRestart(event.error === "network" ? 1200 : 500);
    };
    recognition.onend = () => {
      recognitionRunning = false;
      scheduleRecognitionRestart(350);
    };
    startWakeRecognition();
  }

  function processSpeechQueue() {
    if (!sageEnabled || speechBusy || !speechQueue.length) {
      refreshSagePanel();
      return;
    }
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      updateSageStatus("VOICE UNAVAILABLE");
      refreshSagePanel();
      return;
    }

    const message = speechQueue.shift();
    speechBusy = true;
    const generation = speechGeneration;
    updateSageMessage(message);
    updateSageStatus("SPEAKING");
    updateMusicControl();
    refreshSagePanel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 0.94;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;
    currentUtterance = utterance;

    utterance.onstart = () => {
      if (generation !== speechGeneration) return;
      updateSageStatus("SPEAKING");
      refreshSagePanel();
    };
    utterance.onboundary = (event) => {
      if (generation !== speechGeneration) return;
      if (event.name === "word" || event.charIndex >= 0) pulseSageWord();
    };

    function finishUtterance() {
      if (generation !== speechGeneration) return;
      speechBusy = false;
      currentUtterance = null;
      ignoreRecognitionUntil = Date.now() + 700;
      updateSageStatus(commandModeActive ? "LISTENING" : "WAKE WORD READY");
      updateMusicControl();
      refreshSagePanel();
      setTimeout(() => {
        if (speechQueue.length) {
          processSpeechQueue();
        } else {
          if (returnToIdleAfterSpeech || standDownAfterReply) {
            returnToIdleAfterSpeech = false;
            standDownAfterReply = false;
            leaveCommandMode();
          } else if (commandModeActive) {
            armCommandIdleTimer();
          }
          scheduleRecognitionRestart(100);
        }
      }, 150);
    }

    utterance.onend = finishUtterance;
    utterance.onerror = finishUtterance;
    window.speechSynthesis.speak(utterance);
  }

function announce(message) {
  if (!sageEnabled || unlockRevealActive) return;

    // These are useful in the log, but should not interrupt gameplay aloud.
    if (/party.?s health is low|great sage online|your party.?s health is low/i.test(message)) {
      return;
    }

    updateSageMessage(message);
    if (speechQueue.length >= MAX_SPEECH_QUEUE) speechQueue.shift();
    speechQueue.push(message);
    refreshSagePanel();
    processSpeechQueue();
  }

  function toggleSage() {
    // Clicking Sage is an alternate way to leave command mode; wake listening stays on.
    if (commandModeActive) {
      cancelSageSpeech(true);
      leaveCommandMode();
    } else if (speechBusy || speechQueue.length) {
      cancelSageSpeech(true);
      currentPrompt = null;
      refreshSagePanel();
    }
  }

  // Keep the two status labels in the HTML synchronized with their actual modes.
  function updateAutopilotStatusIndicators() {
    const battleStatus = $("sageBattleAutoStatus");
    const kingdomStatus = $("sageKingdomAutoStatus");
    const help = $("sageAutopilotHelp");

    if (battleStatus) {
      battleStatus.textContent = battleAutoPilot ? "ACTIVE" : "OFF";
      battleStatus.dataset.state = battleAutoPilot ? "active" : "off";
    }

    if (kingdomStatus) {
      const state = kingdomAutoPilot
        ? "active"
        : s.autoPilotUnlocked
          ? "ready"
          : "locked";

      kingdomStatus.textContent = kingdomAutoPilot
        ? "ACTIVE"
        : s.autoPilotUnlocked
          ? "READY"
          : "LOCKED";

      kingdomStatus.dataset.state = state;
    }

 if (help) {
  const wakeName = assistantWakeName();

  help.textContent = kingdomAutoPilot
    ? `I am managing supplies, upgrades, and mining. ` +
      `Say “${wakeName}, stand down” to stop me.`
    : battleAutoPilot
      ? `I am handling the current fight. ` +
        `Say “${wakeName}, stand down” to stop me.`
      : s.autoPilotUnlocked
        ? "I am always ready for battle, and my kingdom-management mode is unlocked for voice activation."
        : "I am ready for battle. My kingdom-management mode unlocks after defeating the final cave guardian.";
}
  }

  // ==========================================
// GREAT SAGE -> RAPHAEL EVOLUTION
// ==========================================

function triggerRaphaelEvolution() {
  if (s.raphaelEvolved) return;

  // Save the transformation so it remains permanent.
  s.raphaelEvolved = true;
  s.autoPilotUnlocked = true;

  // Interrupt any old speech or queued announcements.
  cancelSageSpeech(true);
  currentPrompt = null;

  updateSageMessage("Evolution sequence initiated.");
  save();

  // Create the full-screen evolution scene.
  const overlay = document.createElement("div");
  overlay.className = "raphael-evolution-overlay";

  overlay.innerHTML = `
    <div class="raphael-evolution-stage">
      <div class="raphael-evolution-caption">
        GREAT SAGE · EVOLUTION
      </div>

      <div class="raphael-evolution-emblem" id="raphaelEmblem">
        ◈
      </div>

      <h1 id="raphaelEvolutionTitle">
        EVOLUTION INITIATED
      </h1>

      <p id="raphaelEvolutionText">
        An unprecedented evolution is beginning...
      </p>

      <small>Click to continue · Auto-closes in 5 seconds</small>
    </div>
  `;

  document.body.appendChild(overlay);

  // Make the permanent orb gold as soon as evolution begins.
  refreshSagePanel();

  // After the spinning sequence, reveal Raphael.
  overlay._evolutionTimer = window.setTimeout(() => {
    const emblem = overlay.querySelector("#raphaelEmblem");
    const title = overlay.querySelector("#raphaelEvolutionTitle");
    const text = overlay.querySelector("#raphaelEvolutionText");

    if (emblem) emblem.textContent = "R";
    if (title) title.textContent = "RAPHAEL HAS AWAKENED";
    if (text) {
      text.textContent =
  "I have evolved into Raphael. You can now wake me by saying Raphael.";
    }

    overlay.classList.add("is-evolved");

    // The regular Great Sage speech queue was cleared above.
    announce(
      "Evolution complete. I am Raphael, the evolved form of Great Sage."
    );

    updateAutopilotStatusIndicators();
    refreshSagePanel();
    save();
  }, 2300);

  // Clicking anywhere dismisses the scene.
  overlay.addEventListener("click", () => {
    clearTimeout(overlay._closeTimer);
    overlay.remove();
  });

  // Give the whole sequence time to finish, then close automatically.
  overlay._closeTimer = window.setTimeout(() => {
    overlay.remove();
  }, 5000);
}
  // Repair older saves with an enemy missing max HP.
  if (s.enemy && !s.enemy.maxHp) {
    s.enemy.maxHp = s.enemy.hp;
  }

  if (!logs.length) {
    log("The crystal road awaits. Your party is ready.");
  }

  render();
  save();
  updateMusicScene();
  setupWakeRecognition();
  refreshSagePanel();
  updateAutopilotStatusIndicators();
  // Finish the evolution for saves that already unlocked Cave 7.
if (s.autoPilotUnlocked && !s.raphaelEvolved) {
  window.setTimeout(triggerRaphaelEvolution, 600);
}

  if (!s.enemy && !battleLocked()) {
    scheduleExplore();
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      // Available voices are selected when the next sentence begins.
    };
  }

  window.gemMinerReady = true;

    // Check every 5 seconds for a stuck hospital state.
  window.setInterval(() => {
    if (!s.needsHospital) return;

    const standingHeroes = livingHeroes();

    // If any hero is standing, restore normal gameplay.
    if (standingHeroes.length > 0) {
      s.needsHospital = false;
      s.hospitalFee = 0;
      s.healingUntil = 0;

      if (currentPrompt && currentPrompt.type === "hospital") {
        currentPrompt = null;
      }

      log(
        `Hospital state cleared. ${standingHeroes.length} hero(es) are standing.`
      );

      toast("A hero is standing! Normal gameplay restored.");

      render();
      save();

      if (!s.enemy && !battleLocked()) {
        scheduleExplore();
      }
    }
  }, 5000);

  window.setInterval(() => {
    tick();
    updateAutopilotStatusIndicators();
  }, 200);
})();