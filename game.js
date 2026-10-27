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
      desc: "A quiet sentinel waits inside a chamber of forgotten mechanisms.",
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
      desc: "Beyond the Crucible, an ancient star forge awaits its challenger.",
      rewardHero: null
    },
    {
      name: "The Null Sanctum",
      enemy: "Nullbound Wraith",
      type: "VOID ENTITY",
      hp: 1040,
      damage: 42,
      gold: 230,
      crystals: 85,
      sprite: "assets/wisp.svg",
      boss: "The Null Magistrate",
      bossHp: 24000,
      bossDamage: 88,
      desc: "A silent sovereign waits beyond a sealed passage.",
      rewardHero: null
    },
    {
      name: "The Shattered Crown",
      enemy: "Crownless Echo",
      type: "RIFT ENTITY",
      hp: 1350,
      damage: 52,
      gold: 300,
      crystals: 105,
      sprite: "assets/boss.svg",
      boss: "The Crown Devourer",
      bossHp: 33000,
      bossDamage: 106,
      desc: "A broken throne casts a long shadow across the final reaches.",
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
    phoenix: 45,
    resist: 30
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const initialHeroes = ["aiden", "seraphine", "liria"];

  const baseHeroHp = Object.fromEntries(
    initialHeroes.map((id) => [id, HEROES[id].maxHp])
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
    resistUnlocked: false,
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
      phoenix: 0,
      resist: 0
    },
    partyBuffUntil: 0,
    frostUntil: 0,
    guardCharges: 0,
    needsHospital: false,
    hospitalFee: 0,
    healingUntil: 0,
    lastLog: []
  };

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

    state.cooldowns = { ...defaults.cooldowns, ...(stored.cooldowns || {}) };
    state.resistUnlocked = Boolean(state.resistUnlocked);
    state.snacks = { ...defaults.snacks, ...(stored.snacks || {}) };

    state.heroes =
      Array.isArray(stored.heroes) && stored.heroes.length
        ? stored.heroes.filter((id) => HEROES[id])
        : initialHeroes.slice();

    state.recruits = Array.isArray(stored.recruits)
      ? stored.recruits.filter((id) => RECRUITS.some((recruit) => recruit.id === id))
      : [];

    state.bossDefeated = Array.isArray(stored.bossDefeated)
      ? stored.bossDefeated
      : [];

    state.heroHp = { ...baseHeroHp, ...(stored.heroHp || {}) };

    if (stored.healer && !state.heroes.includes("celeste")) {
      state.heroes.push("celeste");
    }

    state.bossDefeated.forEach((index) => {
      const reward = regions[index] && regions[index].rewardHero;
      if (reward && !state.heroes.includes(reward)) state.heroes.push(reward);
    });

    state.region = Math.max(
      0,
      Math.min(regions.length - 1, Number(state.region) || 0)
    );

    state.caveCrystalProgress = Math.max(0, Number(state.caveCrystalProgress) || 0);
    state.elowenNextReviveAt = Math.max(0, Number(state.elowenNextReviveAt) || 0);
    state.elowenSelfReviveAt = Math.max(0, Number(state.elowenSelfReviveAt) || 0);
    state.autoPilotUnlocked = Boolean(state.autoPilotUnlocked);
    state.raphaelEvolved = Boolean(state.raphaelEvolved);
    if (state.region >= 6) state.autoPilotUnlocked = true;
    // Players who already cleared Cave 8 before Resist existed should receive it.
    if (state.region >= 8 || state.bossDefeated.includes(7)) {
      state.resistUnlocked = true;
    }

    if (state.needsHospital) {
      const minimumHospitalFee =
        1500 + state.region * 1200 + Math.floor((Number(state.defeated) || 0) / 5) * 500;

      state.hospitalFee = Math.max(
        Number(state.hospitalFee) || 0,
        minimumHospitalFee
      );
    }

    const savedMaxMana = 100 + (state.recruits.includes("iris") ? 25 : 0);

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
  const gameplayPauseReasons = new Set();
  let gameplayPauseStartedAt = 0;
  let gameplayPauseTimerSnapshot = null;
  let pendingAnalistApproval = false;
  let analistOverlay = null;
  let analistRevealTimer = null;
  let resistOverlay = null;
  let resistRevealTimer = null;
  let speechBusy = false;
  let sageEnabled = true;
  let currentUtterance = null;
  let speechGeneration = 0;

  const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;

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

  const fmt = (n) =>
    Math.max(0, Math.floor(Number(n) || 0)).toLocaleString();

  const region = () =>
    regions[s.region] || regions[regions.length - 1];

  const bossDone = () => s.bossDefeated.includes(s.region);

  const crystalGoal = () =>
    25 + s.region * 20 + Math.floor(s.defeated / 3) * 8;

  const crystalGateOpen = () =>
    s.caveCrystalProgress >= crystalGoal();

  function addCaveCrystalProgress(amount) {
    s.caveCrystalProgress += Math.max(0, Number(amount) || 0);
  }

  const skillUnlockRegion = (key) => ({
    heal: 1,
    phoenix: 2,
    resist: 8
  }[key] ?? 0);

  const isSkillUnlocked = (key) =>
    key === "resist"
      ? Boolean(s.resistUnlocked)
      : s.region >= skillUnlockRegion(key);

  const autopilotActive = () => Boolean(battleAutoPilot || kingdomAutoPilot);

  const isAntiMagicBarrierActive = () =>
    Boolean(s.enemy && s.enemy.antiMagicBarrierActive);

  const isSkillSealed = (key) =>
    Boolean(
      s.enemy &&
      Array.isArray(s.enemy.restrictedSkills) &&
      s.enemy.restrictedSkills.includes(key)
    );

  const isAnalistUnlocked = () =>
    Boolean(s.raphaelEvolved && s.region >= 6);

  const isGameplayPaused = () => gameplayPauseReasons.size > 0;

  function pauseGameplay(reason) {
    if (gameplayPauseReasons.has(reason)) return;

    if (gameplayPauseReasons.size === 0) {
      gameplayPauseStartedAt = Date.now();
      gameplayPauseTimerSnapshot = Object.fromEntries(
        [
          "manaBuffUntil",
          "partyBuffUntil",
          "frostUntil",
          "healingUntil",
          "elowenSelfReviveAt",
          "elowenNextReviveAt"
        ].map((key) => [key, Number(s[key]) || 0])
      );
    }

    gameplayPauseReasons.add(reason);
    document.body.classList.add("gameplay-paused");
  }

  function resumeGameplay(reason) {
    if (!gameplayPauseReasons.has(reason)) return;

    gameplayPauseReasons.delete(reason);
    if (gameplayPauseReasons.size > 0) return;

    const pauseStartedAt = gameplayPauseStartedAt;
    const pausedFor = Math.max(0, Date.now() - pauseStartedAt);
    gameplayPauseStartedAt = 0;

    const snapshot = gameplayPauseTimerSnapshot || {};
    for (const key of [
      "manaBuffUntil",
      "partyBuffUntil",
      "frostUntil",
      "healingUntil",
      "elowenSelfReviveAt",
      "elowenNextReviveAt"
    ]) {
      // Only freeze timers that were genuinely still active at pause start.
      if (Number(snapshot[key]) > pauseStartedAt) {
        s[key] = Math.max(Number(s[key]) || 0, Number(snapshot[key]) || 0) + pausedFor;
      }
    }

    gameplayPauseTimerSnapshot = null;
    lastTick = performance.now();
    document.body.classList.remove("gameplay-paused");
    render();
    save();

    if (!s.enemy && !battleLocked() && livingHeroes().length) {
      scheduleExplore();
    }
  }

  function availableCombatSkills() {
    return Object.keys(SKILL_MANA_COST).filter((key) =>
      key !== "resist" &&
      isSkillUnlocked(key) &&
      !(
        ["heal", "phoenix"].includes(key) &&
        !s.heroes.includes("celeste") &&
        !s.heroes.includes("sage")
      )
    );
  }

  const livingHeroes = () =>
    s.heroes.filter((id) => (s.heroHp[id] || 0) > 0);

  const isRecovering = () => s.healingUntil > Date.now();

  const battleLocked = () => s.needsHospital || isRecovering();

  const canStartBattle = () =>
    !battleLocked() && livingHeroes().length > 0;

  const maxMana = () =>
    100 + (s.recruits.includes("iris") ? 25 : 0);

  function manaRate() {
    let rate = 1;

    if (s.recruits.includes("iris")) rate += 0.75;
    if (s.manaBuffUntil > Date.now()) rate *= 3;

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

      try {
        localStorage.setItem("gemMinerMusicEnabled", "false");
      } catch (error) {}

      updateMusicControl();
      toast("Background music paused.");
      return;
    }

    musicEnabled = true;

    try {
      localStorage.setItem("gemMinerMusicEnabled", "true");
    } catch (error) {}

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
  // RAPHAEL'S VOICE / PANEL
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
      commandModeActive ||
      speechBusy ||
      speechQueue.length > 0 ||
      battleAutoPilot ||
      kingdomAutoPilot ||
      pendingSnackApproval !== null ||
      pendingAnalistApproval ||
      currentPrompt !== null
    );
  }

  const promptPriority = {
    lowHealth: 1,
    phoenix: 2,
    analist: 4,
    hospital: 5
  };

  function clearAutopilotRecommendations() {
    pendingSnackApproval = null;

    if (currentPrompt && ["phoenix", "lowHealth"].includes(currentPrompt.type)) {
      currentPrompt = null;
    }

    refreshSagePanel();
  }

  function showPrompt(prompt) {
    if (autopilotActive() && ["phoenix", "lowHealth"].includes(prompt.type)) {
      return false;
    }

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
    const english = voices.filter((voice) => /^en([_-]|$)/i.test(voice.lang));

    if (!english.length) return null;

    const naturalVoice = english.find((voice) =>
      /natural|neural|online/i.test(voice.name)
    );

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

  function cancelSageSpeech(clearQueue = true) {
    speechGeneration++;

    if (clearQueue) speechQueue.length = 0;

    speechBusy = false;
    currentUtterance = null;

    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    updateMusicControl();
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
        } else if (returnToIdleAfterSpeech || standDownAfterReply) {
          returnToIdleAfterSpeech = false;
          standDownAfterReply = false;
          leaveCommandMode();
        } else if (commandModeActive) {
          armCommandIdleTimer();
        }

        scheduleRecognitionRestart(100);
      }, 150);
    }

    utterance.onend = finishUtterance;
    utterance.onerror = finishUtterance;
    window.speechSynthesis.speak(utterance);
  }

  function announce(message) {
    if (!sageEnabled || unlockRevealActive) return;

    if (/party.?s health is low|great sage online|your party.?s health is low/i.test(message)) {
      return;
    }

    updateSageMessage(message);

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
    const dock = $("sageDock");
    const shouldShow = sagePanelVisible();

    if (dock) {
      dock.classList.toggle("is-hidden", !(shouldShow || s.raphaelEvolved));
    }

    if (panel) {
      panel.hidden = !shouldShow;
      const heading = panel.querySelector(".sage-panel-head b");
      if (heading) heading.textContent = s.raphaelEvolved ? "RAPHAEL" : "GREAT SAGE";
    }

    if (orb) {
      const symbol = orb.querySelector(".sage-symbol");
      if (symbol) symbol.textContent = s.raphaelEvolved ? "R" : "◈";

      orb.classList.toggle("is-speaking", speechBusy);
      orb.classList.toggle("is-listening", commandModeActive && !speechBusy);
      orb.classList.toggle("is-muted", !sageEnabled);
      orb.classList.toggle("is-battle-auto", battleAutoPilot && !kingdomAutoPilot);
      orb.classList.toggle("is-kingdom-auto", kingdomAutoPilot);
      orb.classList.toggle("is-raphael", Boolean(s.raphaelEvolved));

      orb.setAttribute(
        "aria-label",
        kingdomAutoPilot
          ? "Raphael Kingdom Autopilot is active. Say Raphael, stand down to stop."
          : battleAutoPilot
            ? "Raphael Battle Autopilot is active."
            : commandModeActive
              ? "Raphael is listening. Say never mind to return to idle."
              : "Raphael voice assistant"
      );
    }

    if (commandModeActive && !speechBusy) {
      updateSageStatus(
        kingdomAutoPilot
          ? "KINGDOM AUTOPILOT · ACTIVE"
          : battleAutoPilot
            ? "BATTLE AUTOPILOT · ACTIVE"
            : "LISTENING"
      );

      updateSageMessage("Listening for commands… Say ‘never mind’ or ‘nothing’ to return to idle.");
    }

    updateMusicControl();
    renderSageActions();
  }

  function getHealingAdvice() {
    const options = [];

    if (
      isSkillUnlocked("heal") &&
      (s.heroes.includes("celeste") || s.heroes.includes("sage"))
    ) {
      options.push("Healing Wave");
    }

    options.push("Guard");

    if ((s.snacks.rations || 0) > 0) options.push("Trail Rations");
    if ((s.snacks.cake || 0) > 0) options.push("Crystal Cake");

    return options;
  }

  function canUseSkill(key) {
    if (!(key in SKILL_MANA_COST) || !isSkillUnlocked(key)) return false;

    if (key !== "resist" && isAntiMagicBarrierActive()) return false;
    if (key !== "resist" && isSkillSealed(key)) return false;

    if (key === "resist") {
      if (!s.enemy || s.enemy.resistUsed) return false;

      if (
        isAntiMagicBarrierActive() &&
        Number(s.enemy.barrierElapsed || 0) >= 5
      ) {
        return false;
      }
    }

    if (battleLocked() || !livingHeroes().length) return false;
    if (s.mana < SKILL_MANA_COST[key]) return false;
    if ((s.cooldowns[key] || 0) > 0) return false;

    if (
      ["heal", "phoenix"].includes(key) &&
      !s.heroes.includes("celeste") &&
      !s.heroes.includes("sage")
    ) {
      return false;
    }

    if (
      key === "phoenix" &&
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
        ${isSkillUnlocked("phoenix") ? `
          <button
            class="sage-primary"
            data-sage-action="phoenix"
            ${ready ? "" : "disabled"}
          >Use Phoenix Blessing</button>
        ` : ""}

        ${(s.snacks.revive || 0) > 0 ? `
          <button
            data-sage-action="snack"
            data-value="revive"
            ${battleLocked() || !livingHeroes().length ? "disabled" : ""}
          >Use Revive Snack</button>
        ` : ""}

        <button class="sage-dismiss" data-sage-action="dismiss">Not now</button>

        <small>
          ${isSkillUnlocked("phoenix")
            ? `The recovery ability costs 45 mana. ${ready ? "It is ready to use." : "It is currently unavailable."}`
            : "Let me check our available recovery options."}
        </small>
      `;
    } else if (currentPrompt.type === "analist") {
      html = `
        <button class="sage-primary" data-sage-action="analistYes">Analyze</button>
        <button class="sage-dismiss" data-sage-action="analistNo">Not now</button>
        <small>The enemy's effect may interfere with combat abilities.</small>
      `;
    } else if (currentPrompt.type === "lowHealth") {
      const buttons = [];

      if (
        isSkillUnlocked("heal") &&
        (s.heroes.includes("celeste") || s.heroes.includes("sage"))
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
        <button class="sage-dismiss" data-sage-action="dismiss">Not now</button>
      `);

      html = buttons.join("");
    } else if (currentPrompt.type === "hospital") {
      html = `
        <button
          class="sage-primary"
          data-sage-action="hospital"
          ${s.gold >= s.hospitalFee ? "" : "disabled"}
        >Pay hospital fee</button>

        <button class="sage-dismiss" data-sage-action="dismiss">Not now</button>

        <small>
          Fee: ${fmt(s.hospitalFee)} gold.
          ${s.gold >= s.hospitalFee
            ? "Payment starts one-minute recovery."
            : "Mine resources to earn more gold."}
        </small>
      `;
    }

    if (box.innerHTML !== html) box.innerHTML = html;
  }
    function showPhoenixPrompt(heroId) {
    if (!livingHeroes().length || autopilotActive() || isGameplayPaused()) return;

    const accepted = showPrompt({ type: "phoenix", heroId });

    if (accepted) {
      updateSageMessage(
        `${HEROES[heroId].name} is down. Would you like me to check the recovery options?`
      );
    }

    refreshSagePanel();
  }

  function showLowHealthPrompt() {
    if (!livingHeroes().length || autopilotActive() || isGameplayPaused()) return;

    const accepted = showPrompt({ type: "lowHealth" });

    if (accepted) {
      updateSageMessage(
        `Your party's health is low. Consider using ${getHealingAdvice().join(", ")} to heal your team.`
      );
    }

    refreshSagePanel();
  }

  function showHospitalPrompt() {
    const accepted = showPrompt({ type: "hospital" });

    if (accepted) {
      updateSageMessage(
        "Notice: All party members are down. Would you like to pay the hospital fee and begin recovery?"
      );
    }

    refreshSagePanel();
  }

  // ==========================================
  // CORE UI HELPERS RESTORED FROM THE WORKING GAME
  // ==========================================

  function toggleSage() {
    if (!("speechSynthesis" in window)) {
      toast("This browser does not support speech synthesis.");
      updateSageStatus("VOICE UNAVAILABLE");
      return;
    }

    sageEnabled = !sageEnabled;

    if (!sageEnabled) {
      cancelSageSpeech(true);
      updateSageStatus("VOICE MUTED");
      refreshSagePanel();
      toast(`${assistantWakeName()} voice muted.`);
      return;
    }

    updateSageStatus("VOICE ON");
    refreshSagePanel();
    toast(`${assistantWakeName()} voice activated.`);
    announce(`${assistantWakeName()} online. Voice notifications restored.`);
  }

  function log(message) {
    logs.unshift({
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      msg: String(message ?? "")
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

    target.textContent = String(message ?? "");
    target.classList.add("show");
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      target.classList.remove("show");
    }, 2300);
  }

  function playImportantSound() {
    const now = Date.now();
    if (now - lastImportantSound < 450) return;
    lastImportantSound = now;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!importantAudioContext) importantAudioContext = new AudioContextClass();
      const context = importantAudioContext;
      if (context.state === "suspended") context.resume().catch(() => {});

      const startAt = context.currentTime + 0.025;
      [
        { frequency: 587, delay: 0, duration: 0.11 },
        { frequency: 784, delay: 0.14, duration: 0.15 }
      ].forEach(({ frequency, delay, duration }) => {
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
      console.debug("Important-event sound unavailable.", error);
    }
  }

  function showDamage(message, side = "enemy", healing = false) {
    const scene = $("scene");
    if (!scene) return;

    const span = document.createElement("span");
    span.className = "damage";
    span.textContent = String(message ?? "");
    span.style.left = (side === "enemy" ? 62 + Math.random() * 10 : 18 + Math.random() * 12) + "%";
    span.style.top = (side === "enemy" ? 35 + Math.random() * 12 : 45 + Math.random() * 10) + "%";
    if (healing) span.style.color = "#a4edc0";
    scene.appendChild(span);
    setTimeout(() => span.remove(), 950);
  }

  function enemyHitEffect() {
    const enemy = $("enemyVisual");
    const party = $("battleParty");

    if (enemy) {
      enemy.classList.remove("hit");
      void enemy.offsetWidth;
      enemy.classList.add("hit");
    }

    if (party) {
      party.classList.remove("attacking");
      void party.offsetWidth;
      party.classList.add("attacking");
      setTimeout(() => party.classList.remove("attacking"), 420);
    }
  }

  function animateHeroAttack(id) {
    const party = $("battleParty");
    const hero = party && party.querySelector(`[data-hero="${id}"]`);
    if (!hero || hero.classList.contains("fallen")) return;

    const usesBow = id === "liria";
    const usesSword = ["aiden", "ragnar", "kael_rogue"].includes(id);
    const animationClass = usesBow ? "attack-bow" : usesSword ? "attack-sword" : "attack-cast";

    hero.classList.remove("attack-bow", "attack-sword", "attack-cast");
    void hero.offsetWidth;
    hero.classList.add(animationClass);
    setTimeout(() => hero.classList.remove(animationClass), 500);

    if (usesBow) launchArrow(hero);
    if (usesSword) launchSwordSlash();
  }

  function launchArrow(hero) {
    const scene = $("scene");
    const enemy = $("enemyVisual");
    if (!scene || !enemy || enemy.classList.contains("hidden")) return;

    const sceneRect = scene.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    const startX = heroRect.left + heroRect.width * 0.72 - sceneRect.left;
    const startY = heroRect.top + heroRect.height * 0.38 - sceneRect.top;
    const endX = enemyRect.left + enemyRect.width * 0.24 - sceneRect.left;
    const endY = enemyRect.top + enemyRect.height * 0.42 - sceneRect.top;

    const arrow = document.createElement("span");
    arrow.className = "attack-projectile arrow-projectile";
    arrow.style.left = `${startX}px`;
    arrow.style.top = `${startY}px`;
    arrow.style.setProperty("--travel-x", `${endX - startX}px`);
    arrow.style.setProperty("--travel-y", `${endY - startY}px`);
    arrow.style.setProperty("--angle", `${Math.atan2(endY - startY, endX - startX) * 180 / Math.PI}deg`);
    scene.appendChild(arrow);
    setTimeout(() => arrow.remove(), 520);
  }

  function launchSwordSlash() {
    const scene = $("scene");
    const enemy = $("enemyVisual");
    if (!scene || !enemy || enemy.classList.contains("hidden")) return;

    const sceneRect = scene.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    const slash = document.createElement("span");
    slash.className = "attack-projectile sword-slash";
    slash.style.left = `${enemyRect.left - sceneRect.left + enemyRect.width * 0.18 - 25}px`;
    slash.style.top = `${enemyRect.top - sceneRect.top + enemyRect.height * 0.38 - 25}px`;
    scene.appendChild(slash);
    setTimeout(() => slash.remove(), 420);
  }
    function scheduleExplore(delay = 10000 + Math.random() * 10000) {
    clearTimeout(exploreTimer);

    if (isGameplayPaused() || s.enemy || battleLocked() || !livingHeroes().length) return;

    exploreTimer = setTimeout(() => {
      if (isGameplayPaused()) return;
      if (!s.enemy && !battleLocked() && livingHeroes().length) {
        explore();
      } else if (!battleLocked() && livingHeroes().length && !s.enemy) {
        scheduleExplore();
      }
    }, delay);
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

  function queueSageReply(message) {
    if (message) announce(message);
  }

  // Keep the Autopilot indicators synchronized with real state, without revealing unlock conditions.
  function updateAutopilotStatusIndicators() {
    const battleStatus = $("sageBattleAutoStatus");
    const kingdomStatus = $("sageKingdomAutoStatus");
    const help = $("sageAutopilotHelp");

    if (battleStatus) {
      battleStatus.textContent = battleAutoPilot ? "ACTIVE" : "OFF";
      battleStatus.dataset.state = battleAutoPilot ? "active" : "off";
    }

    if (kingdomStatus) {
      const state = kingdomAutoPilot ? "active" : s.autoPilotUnlocked ? "ready" : "locked";
      kingdomStatus.textContent = kingdomAutoPilot ? "ACTIVE" : s.autoPilotUnlocked ? "READY" : "LOCKED";
      kingdomStatus.dataset.state = state;
    }

    if (help) {
      const wakeName = assistantWakeName();
      help.textContent = kingdomAutoPilot
        ? `I am managing supplies, upgrades, and mining. Say “${wakeName}, stand down” to stop me.`
        : battleAutoPilot
          ? `I am handling the current fight. Say “${wakeName}, stand down” to stop me.`
          : s.autoPilotUnlocked
            ? "I am ready for battle and available to help manage the kingdom."
            : "I am ready for battle. More capabilities may become available as we explore.";
    }
  }

  // ==========================================
  // UNLOCK REVEALS (PAUSE GAME)
  // ==========================================

  function queueUnlockReveal(item) {
    unlockRevealQueue.push(item);

    if (!unlockRevealActive) showNextUnlockReveal();
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
        <div class="unlock-reveal-medallion" id="unlockRevealMedallion">✦</div>
        <div class="unlock-reveal-category" id="unlockRevealCategory">NEW DISCOVERY</div>
        <h2 id="unlockRevealTitle">Something New</h2>
        <p class="unlock-reveal-description" id="unlockRevealDescription"></p>
        <div class="unlock-reveal-footer">
          <small>Click anywhere to continue · Auto-closes in 10 seconds</small>
          <button type="button" class="unlock-reveal-button">Continue ✦</button>
        </div>
      </section>
    `;

    overlay.addEventListener("click", dismissUnlockReveal);
    document.body.appendChild(overlay);
    return overlay;
  }

  function showNextUnlockReveal() {
    if (!unlockRevealQueue.length) {
      unlockRevealActive = false;
      resumeGameplay("unlock-reveal");

      if (s.region >= 6 && s.autoPilotUnlocked && !s.raphaelEvolved) {
        triggerRaphaelEvolution();
        return;
      }

      refreshSagePanel();
      return;
    }

    pauseGameplay("unlock-reveal");
    unlockRevealActive = true;

    const item = unlockRevealQueue.shift();
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

    $("unlockRevealCategory").textContent = item.category || "NEW DISCOVERY";
    $("unlockRevealTitle").textContent = item.title;
    $("unlockRevealDescription").textContent = item.description || "";
    overlay.hidden = false;

    updateSageMessage(item.speech || item.title);

    if (sageEnabled && item.speech) {
      speechQueue.length = 0;
      speechQueue.push(item.speech);
      processSpeechQueue();
    }

    clearTimeout(unlockRevealTimer);
    unlockRevealTimer = setTimeout(dismissUnlockReveal, 10000);
  }

  function dismissUnlockReveal() {
    if (!unlockRevealActive) return;

    clearTimeout(unlockRevealTimer);
    unlockRevealTimer = null;

    const overlay = $("unlockRevealOverlay");
    if (overlay) overlay.hidden = true;

    if (unlockRevealQueue.length) {
      showNextUnlockReveal();
      return;
    }

    unlockRevealActive = false;
    resumeGameplay("unlock-reveal");

    if (s.region >= 6 && s.autoPilotUnlocked && !s.raphaelEvolved) {
      triggerRaphaelEvolution();
      return;
    }

    refreshSagePanel();
  }

  // ==========================================
  // RAPHAEL'S ANALIST + RESIST
  // ==========================================

  function ensureDynamicAbilityButtons() {
    const grid = document.querySelector(".skill-grid");
    if (!grid) return;

    const addButton = (id, key, symbol, title, subtitle, label, extraClass = "") => {
      if ($(id)) return;

      const button = document.createElement("button");
      button.className = `skill ${extraClass}`.trim();
      button.id = id;
      button.dataset.skill = key;
      button.hidden = true;

      button.innerHTML = `
        <span class="skillicon gold">${symbol}</span>
        <span><b>${title}</b><small>${subtitle}</small></span>
        <strong id="cd-${key}">${label}</strong>
      `;

      grid.appendChild(button);
    };

    addButton("analistBtn", "analist", "◈", "Analist", "Study an unusual enemy ability", "READY", "analist-skill");
    addButton("resistBtn", "resist", "⬡", "Resist", "Protect your abilities", "LOCKED", "resist-skill");

    updateSkillShortcutHint();
  }

  function updateSkillShortcutHint() {
    const hint = $("skillShortcutHint");
    if (hint) {
      hint.textContent = s.resistUnlocked
        ? "Q · W · E · R · T · Y · U · I · O"
        : "Q · W · E · R · T · Y · U · I";
    }
  }

  function getBarrierDelaySeconds() {
    return s.region >= 8 ? 5 : 10;
  }
    function activateAntiMagicBarrier() {
    const enemy = s.enemy;

    if (
      !enemy ||
      enemy.uniqueAttack !== "antiMagicBarrier" ||
      enemy.antiMagicBarrierTriggered
    ) {
      return;
    }

    enemy.antiMagicBarrierTriggered = true;
    enemy.barrierElapsed = 0;
    enemy.barrierActivatedAt = Date.now();

    if (enemy.resistPrepared) {
      enemy.antiMagicBarrierActive = false;
      enemy.barrierBlocked = true;
      log(`${enemy.name}'s unknown magic was stopped by Resist.`);
      announce("Resist held. The enemy's magic could not take hold.");
      toast("Resist blocked the enemy's ability.");
      render();
      save();
      return;
    }

    enemy.antiMagicBarrierActive = true;
    cancelSageSpeech(true);

    if (isAnalistUnlocked()) {
      pendingAnalistApproval = true;
      currentPrompt = { type: "analist" };
      const message =
        "Notice: new threat: anti magic barrier. Would you like me to use analist?";
      updateSageMessage(message);
      announce(message);
    } else {
      pendingAnalistApproval = false;
      announce("Notice: an unfamiliar hostile effect is active. Combat skills are unavailable; snacks still work.");
    }

    playImportantSound();
    log(`${enemy.name} raised an Anti-Magic Barrier. Combat skills are sealed; snacks still work.`);
    render();
    save();
  }

  function answerAnalistPrompt(accepted) {
    pendingAnalistApproval = false;

    if (currentPrompt && currentPrompt.type === "analist") {
      currentPrompt = null;
    }

    refreshSagePanel();

    if (accepted) {
      startAnalistAnalysis();
    } else {
      announce("Understood. I will leave the enemy's ability unanalyzed.");
      render();
      save();
    }
  }

  function startAnalistAnalysis() {
    if (analistOverlay) return;

    if (!isAnalistUnlocked()) {
      return toast("That ability is not available yet.");
    }

    if (!s.enemy || !(s.enemy.boss || s.enemy.uniqueAttack)) {
      return toast("There is no unusual enemy ability to analyze yet.");
    }

    pendingAnalistApproval = false;

    if (currentPrompt && currentPrompt.type === "analist") {
      currentPrompt = null;
    }

    pauseGameplay("analist-analysis");
    cancelSageSpeech(true);

    const overlay = document.createElement("div");
    overlay.className = "analist-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlay.innerHTML = `
      <section class="analist-stage">
        <div class="analist-kicker">RAPHAEL · ANALIST</div>
        <div class="analist-emblem">◈</div>
        <h1 id="analistTitle">ANALYZING HOSTILE MAGIC</h1>
        <p id="analistCaption">Holding the battle state while I inspect the pattern…</p>
        <div class="analist-readout" id="analistReadout" hidden></div>
        <button class="resist-continue" id="analistContinue" hidden>Continue</button>
      </section>
    `;

    document.body.appendChild(overlay);
    analistOverlay = overlay;
    announce("Analist engaged. Examining the enemy's ability.");

    const continueButton = overlay.querySelector("#analistContinue");
    let reportReady = false;

    const finish = () => {
      if (!reportReady) return;

      clearTimeout(analistRevealTimer);
      analistRevealTimer = null;

      overlay.remove();
      analistOverlay = null;

      resumeGameplay("analist-analysis");
      render();
      save();
    };

    continueButton.addEventListener("click", finish);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish();
    });

    analistRevealTimer = setTimeout(() => {
      const title = overlay.querySelector("#analistTitle");
      const caption = overlay.querySelector("#analistCaption");
      const readout = overlay.querySelector("#analistReadout");

      title.textContent = "ANALYSIS COMPLETE";
      caption.textContent = "The hostile pattern is identified.";
      readout.hidden = false;

      readout.innerHTML =
        s.enemy && s.enemy.antiMagicBarrierTriggered
          ? `
            <strong>Observed effect</strong><br>
            Combat skills are sealed while the barrier holds.<br>
            <strong>Still effective</strong><br>
            Consumable snacks remain usable.<br>
            <strong>Timing</strong><br>
            There is a short opening to react after the effect begins.
            ${s.resistUnlocked
              ? "<br><strong>Countermeasure</strong><br>Resist can recover some skill access when used in time."
              : ""}
          `
          : `
            <strong>Current result</strong><br>
            No unfamiliar ability has been used yet. I will continue observing the enemy.
          `;

      continueButton.hidden = false;
      reportReady = true;

      announce("Analist complete. The barrier blocks combat skills, but snacks still work.");

      clearTimeout(analistRevealTimer);
      analistRevealTimer = setTimeout(finish, 6500);
    }, 1700);
  }
    function shuffleList(items) {
    const copy = items.slice();

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function castResist() {
    if (isGameplayPaused()) return;

    if (!isSkillUnlocked("resist")) {
      return toast("That ability is not available yet.");
    }

    if (battleLocked()) {
      return toast("The party cannot cast during recovery.");
    }

    if (!s.enemy) {
      return toast("Resist must be prepared during an encounter.");
    }

    if (s.enemy.uniqueAttack !== "antiMagicBarrier") {
      return toast("There is no hostile ability to resist in this encounter.");
    }

    if (s.enemy.resistUsed) {
      return toast("Resist has already been used in this encounter.");
    }

    if ((s.cooldowns.resist || 0) > 0) {
      return toast(`Resist is recharging for ${Math.ceil(s.cooldowns.resist)} more seconds.`);
    }

    if (s.mana < SKILL_MANA_COST.resist) {
      return toast(`Resist requires ${SKILL_MANA_COST.resist} mana.`);
    }

    const enemy = s.enemy;
    const barrierActive = Boolean(enemy.antiMagicBarrierActive);
    const elapsed = barrierActive
      ? Math.max(0, Number(enemy.barrierElapsed) || 0)
      : 0;

    if (pendingAnalistApproval) {
      pendingAnalistApproval = false;
      if (currentPrompt && currentPrompt.type === "analist") currentPrompt = null;
    }

    if (barrierActive && elapsed >= 5) {
      return toast("The five-second opening has closed. Resist is too late for this barrier.");
    }

    const allSkills = availableCombatSkills();
    let remainingSkills = allSkills.slice();

    if (barrierActive) {
      const fractionLeft = Math.max(0, 1 - elapsed / 5);

      // A cast inside the five-second window always preserves at least one
      // random skill; later casts preserve progressively fewer abilities.
      const allowedCount = Math.max(
        1,
        Math.min(
          allSkills.length,
          Math.floor(allSkills.length * fractionLeft + 0.0001)
        )
      );

      remainingSkills = shuffleList(allSkills).slice(0, allowedCount);

      enemy.antiMagicBarrierActive = false;
      enemy.restrictedSkills = allSkills.filter(
        (key) => !remainingSkills.includes(key)
      );
      enemy.resistPrepared = false;
    } else {
      // Prepare ahead of the attack. All skills stay available.
      enemy.resistPrepared = true;
      enemy.restrictedSkills = [];
    }

    enemy.resistUsed = true;
    s.mana -= SKILL_MANA_COST.resist;
    s.cooldowns.resist = 55;

    log(
      barrierActive
        ? `Resist activated ${elapsed.toFixed(1)} seconds after the barrier. ${remainingSkills.length} of ${allSkills.length} skills remain accessible.`
        : "Resist prepared before the enemy's ability. All skills are preserved."
    );

    showResistAnimation(
      remainingSkills,
      allSkills.length,
      barrierActive,
      elapsed
    );
  }

  function showResistAnimation(remainingSkills, totalSkills, lateCast, elapsed) {
    if (resistOverlay) return;

    pauseGameplay("resist-animation");
    cancelSageSpeech(true);

    const skillNames = {
      slash: "Radiant Slash",
      burst: "Arcane Burst",
      guard: "Guard",
      heal: "Healing Wave",
      meteor: "Meteor Rain",
      frost: "Frost Nova",
      phoenix: "Phoenix Blessing"
    };

    const overlay = document.createElement("div");
    overlay.className = "resist-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlay.innerHTML = `
      <section class="resist-stage">
        <div class="resist-kicker">RAPHAEL · DEFENSIVE ART</div>
        <div class="resist-shield" id="resistShield">⬡</div>
        <h1 id="resistTitle">RESISTING…</h1>
        <p id="resistCaption">Stabilizing the shield.</p>
        <div class="resist-readout" id="resistReadout" hidden></div>
        <div class="resist-buttons">
          <button class="resist-continue" id="resistContinue" hidden>Continue</button>
        </div>
      </section>
    `;

    document.body.appendChild(overlay);
    resistOverlay = overlay;
    announce("Resisting…");

    const closeButton = overlay.querySelector("#resistContinue");
    let resultReady = false;

    const finish = () => {
      if (!resultReady) return;

      clearTimeout(resistRevealTimer);
      resistRevealTimer = null;

      overlay.remove();
      resistOverlay = null;

      resumeGameplay("resist-animation");
      render();
      save();
    };

    closeButton.addEventListener("click", finish);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish();
    });

    const shield = overlay.querySelector("#resistShield");

    for (let i = 0; i < 12; i++) {
      const fragment = document.createElement("i");
      fragment.className = "resist-fragment";

      fragment.style.setProperty(
        "--fx",
        `${Math.cos(i * Math.PI / 6) * (90 + Math.random() * 75)}px`
      );

      fragment.style.setProperty(
        "--fy",
        `${Math.sin(i * Math.PI / 6) * (90 + Math.random() * 75)}px`
      );

      fragment.style.setProperty(
        "--fr",
        `${Math.floor(Math.random() * 360)}deg`
      );

      shield.appendChild(fragment);
    }

    resistRevealTimer = setTimeout(() => {
      shield.classList.add("burst");

      const readout = overlay.querySelector("#resistReadout");
      const caption = overlay.querySelector("#resistCaption");
      readout.hidden = false;

      if (!lateCast) {
        readout.innerHTML = `
          <strong>Abilities still accessible</strong><br>
          ${remainingSkills.length
            ? remainingSkills.map((key) => skillNames[key]).join(" · ")
            : "None"}<br><br>
          <strong>Result</strong><br>
          Resist was prepared before the enemy's ability. No skills were lost.
        `;

        caption.textContent = "The shield is ready ahead of the impact.";
      } else {
        readout.innerHTML = `
          <strong>Abilities still accessible</strong><br>
          ${remainingSkills.length
            ? remainingSkills.map((key) => skillNames[key]).join(" · ")
            : "None"}<br><br>
          <strong>Skills preserved</strong><br>
          ${remainingSkills.length} of ${totalSkills}. The enemy's effect drained the rest before Resist took hold.
        `;

        caption.textContent = `Reaction time: ${elapsed.toFixed(1)} seconds.`;
      }

      overlay.querySelector("#resistTitle").textContent = "SHIELD RELEASE";
      announce("Resisting… The shield is breaking through.");

      resistRevealTimer = setTimeout(() => {
        overlay.querySelector("#resistTitle").textContent = "RESIST SUCCESSFUL";
        overlay.querySelector("#resistCaption").textContent =
          lateCast
            ? "But this will greatly limit your abilities."
            : "All combat abilities have been preserved.";

        closeButton.hidden = false;
        resultReady = true;

        announce(
          lateCast
            ? "Resist successful. But this will greatly limit your abilities."
            : "Resist successful. The enemy's ability has been blocked, and no skills were lost."
        );

        resistRevealTimer = setTimeout(finish, 7000);
      }, 1250);
    }, 1200);
  }
    function enemyAreaAttack() {
    const enemy = s.enemy;

    if (!enemy || !enemy.boss || s.region !== 7 || battleLocked()) return;

    const scene = $("scene");

    if (scene) {
      scene.classList.remove("cataclysm-flash");
      void scene.offsetWidth;
      scene.classList.add("cataclysm-flash");
    }

    const guarded = s.guardCharges > 0;

    for (const id of livingHeroes()) {
      let amount = Math.floor(
        HEROES[id].maxHp * (0.15 + Math.random() * 0.08) +
        enemy.damage * 0.25
      );

      if (guarded) amount = Math.ceil(amount * 0.45);

      s.heroHp[id] = Math.max(0, s.heroHp[id] - amount);
      showDamage(`PULSE -${amount}`, "party");
    }

    if (guarded) s.guardCharges = 0;

    log(
      `${enemy.name} unleashed Cataclysmic Pulse against the entire party` +
      `${guarded ? "; Guard softened the impact" : ""}.`
    );

    announce("Warning: Cataclysmic Pulse is striking the entire party!");
    playImportantSound();

    if (!livingHeroes().length) partyWiped();

    render();
    save();
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
        boss: true,
        bossElapsed: 0,
        specialAttackClock: 0,
        uniqueAttack: s.region >= 7 ? "antiMagicBarrier" : null,
        antiMagicBarrierTriggered: false,
        antiMagicBarrierActive: false,
        barrierElapsed: 0,
        barrierActivatedAt: 0,
        resistUsed: false,
        resistPrepared: false,
        restrictedSkills: []
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
        boss: false,
        bossElapsed: 0,
        specialAttackClock: 0,
        uniqueAttack: s.region >= 7 ? "antiMagicBarrier" : null,
        antiMagicBarrierTriggered: false,
        antiMagicBarrierActive: false,
        barrierElapsed: 0,
        barrierActivatedAt: 0,
        resistUsed: false,
        resistPrepared: false,
        restrictedSkills: []
      };
    }

    partyClock = 0;
    enemyClock = 0;

    if (boss) {
      playImportantSound();
      announce(`Warning: Guardian approaching. ${s.enemy.name} has appeared.`);
    }

    log(`${s.enemy.name} appears in the cavern!`);
    render();
    save();
  }

  function explore() {
    if (isGameplayPaused() || s.enemy || !canStartBattle()) return;

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
    if (!s.enemy || battleLocked() || isGameplayPaused()) return;

    if (
      s.enemy.boss &&
      s.region === 7 &&
      Number(s.enemy.specialAttackClock || 0) >= 12
    ) {
      s.enemy.specialAttackClock = 0;
      enemyAreaAttack();
      return;
    }

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
          `${target.name} is down. I will check the available recovery options.`
        );
        showPhoenixPrompt(targetId);
      }
    }

    if (!livingHeroes().length) partyWiped();

    render();
    save();
  }

  function partyWiped() {
    if (s.needsHospital || isRecovering()) return;

    if (battleAutoPilot && !kingdomAutoPilot) {
      finishBattleAutopilot();
    }

    const fallenEnemy = s.enemy ? s.enemy.name : "the enemy";

    s.enemy = null;
    s.bossMode = false;
    partyClock = 0;
    enemyClock = 0;
    supportClock = 0;

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

    announce("Notice: The party has fallen. Pay the hospital fee to recover.");
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
          speech: `New hero unlocked: ${newHero.name}. ${newHero.role}. ${newHero.tagline}`
        });
      } else {
        toast("Guardian defeated! Cave cleared.");
      }

      // Kingdom Autopilot unlocks after the Cave 6 guardian.
      if (clearedRegion === 5 && !s.autoPilotUnlocked) {
        s.autoPilotUnlocked = true;
        toast("KINGDOM AUTOPILOT UNLOCKED!");
        log("Kingdom Autopilot unlocked.");

        queueUnlockReveal({
          category: "NEW FEATURE",
          title: "Kingdom Autopilot",
          symbol: "◈",
          description: "A new management mode is now available for your kingdom.",
          speech: `A new management mode is available. Say ${assistantWakeName()}, activate autopilot, to begin.`
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
            description: "A wave of restorative magic heals every living ally.",
            speech: "New skill unlocked: Healing Wave. Use it to restore health to your living allies."
          });
        } else if (s.region === 2) {
          queueUnlockReveal({
            category: "NEW SKILL",
            title: "Phoenix Blessing",
            symbol: "♨",
            description: "Revive one fallen hero with 40 percent of their maximum health.",
            speech: "New skill unlocked: Phoenix Blessing. Use it to return one fallen hero to battle."
          });
        } else if (clearedRegion === 7) {
          s.resistUnlocked = true;

          queueUnlockReveal({
            category: "NEW SKILL",
            title: "Resist",
            symbol: "⬡",
            description: "A defensive art that can preserve access to abilities when hostile magic takes hold.",
            speech: "New skill unlocked: Resist. It can help preserve some abilities when hostile magic takes hold."
          });
        }
      } else {
        log("All cave guardians have fallen. The kingdom is saved!");

        if (!s.autoPilotUnlocked) {
          s.autoPilotUnlocked = true;
          toast("KINGDOM AUTOPILOT UNLOCKED!");

          queueUnlockReveal({
            category: "NEW FEATURE",
            title: "Kingdom Autopilot",
            symbol: "◈",
            description: "A new management mode is now available for your kingdom.",
            speech: `A new management mode is available. Say ${assistantWakeName()}, activate autopilot, to begin.`
          });
        }
      }
    } else {
      log(`${e.name} defeated. +${e.gold} gold and +${e.crystals} crystals.`);
      toast(`Victory! +${e.gold} gold · +${e.crystals} crystals`);
    }

    s.enemy = null;
    s.bossMode = false;
    partyClock = 0;
    enemyClock = 0;

    livingHeroes().forEach((id) => {
      s.heroHp[id] = Math.min(HEROES[id].maxHp, s.heroHp[id] + 7);
    });

    render();
    save();
    scheduleExplore();

    if (battleAutoPilot && !kingdomAutoPilot) {
      finishBattleAutopilot();
    }
  }
    // ==========================================
  // SKILLS
  // ==========================================

  function skill(key) {
    if (isGameplayPaused()) return;

    if (key === "analist") {
      if (!isAnalistUnlocked()) return toast("That ability is not available yet.");
      if (pendingAnalistApproval) return answerAnalistPrompt(true);
      return startAnalistAnalysis();
    }

    if (key === "resist") return castResist();
    if (!(key in SKILL_MANA_COST)) return;

    if (isAntiMagicBarrierActive()) {
      const message = "I am not able to use any skills due to the enemy's ability.";
      announce(message);
      return toast(message);
    }

    if (isSkillSealed(key)) {
      return toast("That skill was lost when Resist took hold.");
    }

    if (!isSkillUnlocked(key)) {
      return toast("That ability is not available yet.");
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
      const amount = Math.floor((45 + s.pickaxe * 5 + s.region * 12) * skillBonus);
      s.enemy.hp -= amount;
      s.cooldowns.slash = 8;
      showDamage("RADIANT -" + amount, "enemy");
      enemyHitEffect();
      log(`Radiant Slash deals ${amount} damage.`);
    } else if (key === "burst") {
      const amount = Math.floor((72 + s.region * 20) * skillBonus);
      s.enemy.hp -= amount;
      s.cooldowns.burst = 14;
      showDamage("ARCANE -" + amount, "enemy");
      enemyHitEffect();
      log(`Arcane Burst deals ${amount} damage.`);
    } else if (key === "guard") {
      livingHeroes().forEach((id) => {
        s.heroHp[id] = Math.min(HEROES[id].maxHp, s.heroHp[id] + 12);
      });

      s.guardCharges = 1;
      s.cooldowns.guard = 18;
      showDamage("Aegis +12", "party", true);
      log("Guard healed the party and will soften the next hit.");
    } else if (key === "heal") {
      const amount = Math.floor(28 * (s.recruits.includes("elise") ? 1.2 : 1));

      livingHeroes().forEach((id) => {
        s.heroHp[id] = Math.min(HEROES[id].maxHp, s.heroHp[id] + amount);
      });

      s.cooldowns.heal = 14;
      showDamage("HEAL +" + amount, "party", true);
      log(`Healing Wave restores up to ${amount} HP to each living ally.`);
    } else if (key === "meteor") {
      const amount = Math.floor((105 + s.region * 28) * skillBonus);
      s.enemy.hp -= amount;
      s.cooldowns.meteor = 22;
      showDamage("METEOR -" + amount, "enemy");
      enemyHitEffect();
      log(`Meteor Rain deals ${amount} damage.`);
    } else if (key === "frost") {
      const amount = Math.floor((22 + s.region * 6) * skillBonus);
      s.enemy.hp -= amount;
      s.frostUntil = Date.now() + 8000;
      s.cooldowns.frost = 17;
      showDamage("FROST -" + amount, "enemy");
      enemyHitEffect();
      log(`Frost Nova deals ${amount} damage and slows the enemy.`);
    } else if (key === "phoenix") {
      const fallen = s.heroes.find((id) => (s.heroHp[id] || 0) <= 0);

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

    if (s.enemy && s.enemy.hp <= 0) defeatEnemy();

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

  function hireRecruit(id) {
    const recruit = RECRUITS.find((entry) => entry.id === id);

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
  // SNACKS
  // ==========================================

  function useSnack(id) {
    const snack = SNACKS.find((entry) => entry.id === id);
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
        s.heroHp[id] = Math.min(HEROES[id].maxHp, s.heroHp[id] + amount);
      });

      showDamage("TEAM +" + amount, "party", true);
      log(`Crystal Cake healed the party by up to ${amount} HP.`);
    } else if (snack.effect === "mana") {
      const before = s.mana;
      s.mana = Math.min(maxMana(), s.mana + 35);
      const gained = Math.floor(s.mana - before);

      if (s.mana / maxMana() > 0.3) s.manaWarning = false;

      showDamage("MANA +" + gained, "party", true);
      log(`Etherberries restored ${gained} mana.`);
      toast(`Restored ${gained} mana.`);
    } else if (snack.effect === "manaBuff") {
      s.manaBuffUntil = Date.now() + 30000;
      log("Astral Tea tripled mana regeneration for 30 seconds.");
      toast("Mana regeneration boosted for 30 seconds!");
    } else if (snack.effect === "revive") {
      const fallen = s.heroes.find((heroId) => (s.heroHp[heroId] || 0) <= 0);

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
    const snack = SNACKS.find((entry) => entry.id === id);
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
  // SAGE PROMPT ACTIONS
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

    if (action === "analistYes") {
      answerAnalistPrompt(true);
      return true;
    }

    if (action === "analistNo") {
      answerAnalistPrompt(false);
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
  // PARTY AND REWARDS
  // ==========================================

  function renderParty() {
    const battleParty = $("battleParty");

    const rankOf = (id) => {
      const rank = HERO_TARGET_ORDER.indexOf(id);
      return rank < 0 ? 999 : rank;
    };

    const livingIds = s.heroes
      .filter((id) => (Number(s.heroHp[id]) || 0) > 0)
      .sort((a, b) => rankOf(a) - rankOf(b));

    const fallenIds = s.heroes
      .filter((id) => (Number(s.heroHp[id]) || 0) <= 0)
      .sort((a, b) => rankOf(b) - rankOf(a));

    const displayIds = [
      ...fallenIds,
      ...livingIds.slice().sort((a, b) => rankOf(b) - rankOf(a))
    ];

    const frontRank = new Map(
      livingIds.map((id, index) => [id, index + 1])
    );

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

    s.heroes.forEach((id) => {
      const img = battleParty.querySelector(`[data-hero="${id}"]`);

      if (img) {
        const hp = Number(s.heroHp[id]) || 0;
        img.title = `${HEROES[id].name} · ${Math.floor(hp)}/${HEROES[id].maxHp} HP`;
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
            <div class="minibar"><i style="width:${pct}%"></i></div>
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
            ? "A new management path is available."
            : "Something remains to be discovered."}
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
      const noManaNeeded = snack.effect === "mana" && s.mana >= maxMana();
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

    const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
    const healthIsLow =
      ratios.some((ratio) => ratio <= 0.35) ||
      average <= 0.45;

    if (healthIsLow && !lowHealthWarning) {
      lowHealthWarning = true;
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

      $("caption").textContent = isAntiMagicBarrierActive()
        ? "An unknown force is suppressing combat skills. Snacks remain usable."
        : s.enemy.boss
          ? "A guardian's ancient power surges…"
          : "The party fights together!";

      $("enemyVisual").classList.toggle("barrier-active", isAntiMagicBarrierActive());
      $("status").textContent = "● IN COMBAT";
      $("hint").textContent =
        "Your party fights automatically. Raphael speaks up when a hero needs help or a major event occurs.";
    } else {
      $("battleTitle").textContent = "The Crystal Road";
      $("enemyName").textContent = "No enemy nearby";
      $("enemyType").textContent = "Awaiting discovery";
      $("enemyHealthText").textContent = "—";
      $("enemyHealthBar").style.width = "0";
      $("status").textContent = battleLocked() ? "● RECOVERING" : "● EXPLORING";

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

      const targetRequired = ["slash", "burst", "meteor", "frost"].includes(key);

      if (button) button.hidden = skillLocked;

      if (label) {
        if (skillLocked || healerRequired) {
          label.textContent = "LOCKED";
        } else if (isAntiMagicBarrierActive() && key !== "resist") {
          label.textContent = "SEALED";
        } else if (isSkillSealed(key)) {
          label.textContent = "LOST";
        } else if (s.cooldowns[key] > 0) {
          label.textContent = `${Math.ceil(s.cooldowns[key])}s`;
        } else if (s.mana < cost) {
          label.textContent = `NEED ${cost} M`;
        } else {
          label.textContent = `READY · ${cost} M`;
        }

        label.classList.toggle("cooling", s.cooldowns[key] > 0 || s.mana < cost);
      }

      if (button) {
        button.disabled =
          isGameplayPaused() ||
          battleLocked() ||
          !livingHeroes().length ||
          skillLocked ||
          healerRequired ||
          (targetRequired && !s.enemy) ||
          (isAntiMagicBarrierActive() && key !== "resist") ||
          isSkillSealed(key) ||
          (
            key === "resist" &&
            (
              !s.enemy ||
              s.enemy.resistUsed ||
              (isAntiMagicBarrierActive() && (Number(s.enemy.barrierElapsed) || 0) >= 5)
            )
          ) ||
          s.cooldowns[key] > 0 ||
          s.mana < cost;
      }
    }

    const analistButton = $("analistBtn");

    if (analistButton) {
      analistButton.hidden = !isAnalistUnlocked();
      analistButton.disabled =
        isGameplayPaused() || !s.enemy || !(s.enemy.boss || s.enemy.uniqueAttack);

      const label = $("cd-analist");
      if (label) label.textContent = pendingAnalistApproval ? "AVAILABLE" : "ANALYZE";
    }

    updateSkillShortcutHint();

    const resistButton = $("resistBtn");

    if (resistButton) {
      resistButton.hidden = !isSkillUnlocked("resist");
      resistButton.disabled =
        isGameplayPaused() ||
        !s.enemy ||
        s.enemy.resistUsed ||
        (
          isAntiMagicBarrierActive() &&
          (Number(s.enemy.barrierElapsed) || 0) >= 5
        ) ||
        battleLocked() ||
        s.mana < SKILL_MANA_COST.resist ||
        (s.cooldowns.resist || 0) > 0;

      const resistLabel = $("cd-resist");

      if (resistLabel) {
        resistLabel.textContent =
          s.enemy && s.enemy.resistUsed
            ? "USED"
            : isAntiMagicBarrierActive() &&
              (Number(s.enemy.barrierElapsed) || 0) >= 5
              ? "TOO LATE"
              : s.cooldowns.resist > 0
                ? `${Math.ceil(s.cooldowns.resist)}s`
                : s.mana < SKILL_MANA_COST.resist
                  ? `NEED ${SKILL_MANA_COST.resist} M`
                  : "READY";
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
    window._analistUnlockQueued = false;
    currentPrompt = null;
    pendingAnalistApproval = false;
    gameplayPauseReasons.clear();
    gameplayPauseStartedAt = 0;
    gameplayPauseTimerSnapshot = null;
    document.body.classList.remove("gameplay-paused");
    clearTimeout(analistRevealTimer);
    clearTimeout(resistRevealTimer);

    if (analistOverlay) analistOverlay.remove();
    if (resistOverlay) resistOverlay.remove();

    analistOverlay = null;
    resistOverlay = null;
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
    if (
      isGameplayPaused() &&
      !event.target.closest(
        ".unlock-reveal-overlay,.raphael-evolution-overlay,.analist-overlay,.resist-overlay"
      )
    ) {
      return;
    }

    const sageButton = event.target.closest("[data-sage-action]");

    if (sageButton) {
      handleSageAction(sageButton);
      return;
    }

    const skillButton = event.target.closest("[data-skill]");

    if (skillButton) {
      if (!skillButton.disabled) skill(skillButton.dataset.skill);
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "sageToggle") return toggleSage();
    if (action === "toggleMusic") return toggleMusic();
    if (action === "explore") return explore();
    if (action === "mine") return mine();

    if (action === "boss") {
      if (!s.enemy && !bossDone()) {
        spawn(true);
      } else if (s.enemy) {
        toast("Defeat the current enemy before challenging the guardian.");
      }
      return;
    }

    if (action === "upgrade") return upgrade(value);
    if (action === "hire") return hireRecruit(value);
    if (action === "useSnack") return useSnack(value);
    if (action === "buySnack") return buySnack(value);
    if (action === "payHeal") return payHeal();

    if (action === "clearLog") {
      logs = [];
      renderLog();
      save();
      return;
    }

    if (action === "reset") return resetGame();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.repeat ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    ) {
      return;
    }

    if (isGameplayPaused()) return;

    const shortcuts = {
      q: "slash",
      w: "burst",
      e: "guard",
      r: "heal",
      t: "meteor",
      y: "frost",
      u: "phoenix",
      i: "analist",
      o: "resist"
    };

    const key = shortcuts[event.key.toLowerCase()];
    if (key) skill(key);
  });
    // ==========================================
  // MAIN GAME LOOP
  // ==========================================

  function tick() {
    if (isGameplayPaused()) {
      lastTick = performance.now();
      return;
    }

    const now = Date.now();
    const currentTime = performance.now();

    const dt = Math.min(
      0.5,
      Math.max(0, (currentTime - lastTick) / 1000)
    );

    lastTick = currentTime;

    if (s.healingUntil && now >= s.healingUntil) finishHealing();

    // Elowen's self-revival.
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

    const goldRate =
      (s.recruits.includes("tessa") ? 0.8 : 0) +
      (s.recruits.includes("borin") ? 1.3 : 0);

    const crystalRate = s.recruits.includes("kellan") ? 0.3 : 0;
    s.gold += goldRate * dt;
    s.crystals += crystalRate * dt;
    s.mana = Math.min(maxMana(), s.mana + manaRate() * dt);

    const manaRatio = s.mana / maxMana();

    if (manaRatio < 0.2 && !s.manaWarning) {
      s.manaWarning = true;
      log("Mana is running low.");
      announce("Warning: Mana is running low. Use Etherberries or wait for mana to regenerate.");
    } else if (manaRatio > 0.3) {
      s.manaWarning = false;
    }

    checkPartyHealthWarning();

    if (kingdomAutoPilot) runKingdomAutopilot(now, dt);

    if (!battleLocked()) {
      Object.keys(s.cooldowns).forEach((key) => {
        s.cooldowns[key] = Math.max(0, s.cooldowns[key] - dt);
      });

      if (battleAutoPilot || kingdomAutoPilot) {
        battlePilotClock += dt;

        if (battlePilotClock >= 0.9) {
          battlePilotClock = 0;
          runBattleAutopilot(now);
        }
      }

      if (s.enemy) {
        partyClock += dt;
        enemyClock += dt;
        s.enemy.bossElapsed = (Number(s.enemy.bossElapsed) || 0) + dt;
        s.enemy.specialAttackClock = (Number(s.enemy.specialAttackClock) || 0) + dt;

        if (s.enemy.antiMagicBarrierActive) {
          s.enemy.barrierElapsed = (Number(s.enemy.barrierElapsed) || 0) + dt;
        }

        if (
          s.enemy.uniqueAttack === "antiMagicBarrier" &&
          !s.enemy.antiMagicBarrierTriggered &&
          s.enemy.bossElapsed >= getBarrierDelaySeconds()
        ) {
          activateAntiMagicBarrier();
        }

        if (partyClock >= pInterval()) {
          partyClock = 0;
          partyAttack();
        }

        if (s.enemy && !battleLocked() && enemyClock >= eInterval()) {
          enemyClock = 0;
          enemyAttack();
        }
      }

      const celesteAlive =
        s.heroes.includes("celeste") &&
        livingHeroes().includes("celeste");

      if (celesteAlive) {
        supportClock += dt;

        if (supportClock >= 10) {
          supportClock -= 10;
          const amount = 7 + (s.recruits.includes("elise") ? 4 : 0);
          let healedAnyone = false;

          for (const id of livingHeroes()) {
            const oldHp = s.heroHp[id];
            const newHp = Math.min(HEROES[id].maxHp, oldHp + amount);
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

    renderClock += dt;

    if (renderClock >= 0.25) {
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
  // VOICE ASSISTANT
  // ==========================================

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

  function normalizeVoiceText(text) {
    let normalized = String(text || "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const speechAliases = [
      [/\b(?:rafael|rafayel|raffel|raphaell|raphiel)\b/g, "raphael"],
      [/\b(?:tral|trale|trail|trial|treyl)\s+(?:rations?|raitions?|ratons?|ratios|ratings|raytions?)\b/g, "trail rations"],
      [/\b(?:trail|tral|trale|trial)\s+(?:ration|raition|raton)\b/g, "trail rations"],
      [/\bmoon\s+berries\b/g, "moonberries"],
      [/\bmoonberry\b/g, "moonberries"],
      [/\bether\s+berries\b/g, "etherberries"],
      [/\bether\s+berry\b/g, "etherberries"],
      [/\betherberry\b/g, "etherberries"],
      [/\b(?:astral|astro)\s+tea\b/g, "astral tea"],
      [/\bcrystal\s+cake\b/g, "crystal cake"],
      [/\b(?:revive|revived)\s+snack\b/g, "revive snack"],
      [/\bhealing\s+(?:way|weigh|wavey)\b/g, "healing wave"],
      [/\b(?:anilist|analyst|analyse|analyze)\b/g, "analist"],
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

  function skillVoiceLabel(key) {
    return {
      slash: "Radiant Slash",
      burst: "Arcane Burst",
      guard: "Guard",
      heal: "Healing Wave",
      meteor: "Meteor Rain",
      frost: "Frost Nova",
      phoenix: "Phoenix Blessing",
      resist: "Resist",
      analist: "Analist"
    }[key] || key;
  }

  function voiceSkillUnavailableReason(key) {
    if (isAntiMagicBarrierActive() && key !== "resist") {
      return "I am not able to use any skills due to the enemy's ability.";
    }

    if (isSkillSealed(key)) {
      return `${skillVoiceLabel(key)} is no longer accessible for this battle.`;
    }

    if (!isSkillUnlocked(key)) return "That ability is not available yet.";
    if (s.needsHospital) return "The party needs hospital treatment first.";
    if (isRecovering()) return "The party is still recovering.";
    if (!livingHeroes().length) return "No heroes are standing.";
    if (s.mana < SKILL_MANA_COST[key]) return `You need ${SKILL_MANA_COST[key]} mana.`;
    if ((s.cooldowns[key] || 0) > 0) return `${skillVoiceLabel(key)} is recharging for ${Math.ceil(s.cooldowns[key])} more seconds.`;

    if (["slash", "burst", "meteor", "frost"].includes(key) && !s.enemy) {
      return "There is no enemy to attack right now.";
    }

    if (
      ["heal", "phoenix"].includes(key) &&
      !s.heroes.includes("celeste") &&
      !s.heroes.includes("sage")
    ) {
      return "Healer support has not joined the party yet.";
    }

    if (key === "phoenix" && !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)) {
      return "There is no fallen hero to revive.";
    }

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
      { kind: "skill", key: "resist", label: "Resist", patterns: [/\bresist\b/gi, /\bresisting\b/gi] },
      { kind: "skill", key: "analist", label: "Analist", patterns: [/\banalist\b/gi, /\banalyst\b/gi, /\banalyze\b/gi, /\banalyse\b/gi] },
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
          if (
            !first ||
            match.index < first.index ||
            (match.index === first.index && match[0].length > first.text.length)
          ) {
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
    const allyIsDown = s.heroes.some(
      (id) => id !== "elowen" && (s.heroHp[id] || 0) <= 0
    );

    return s.heroes.includes("elowen") &&
      (s.heroHp.elowen || 0) > 0 &&
      allyIsDown &&
      now >= (s.elowenNextReviveAt || 0) &&
      !battleLocked();
  }

  function chooseSnackForBattlePrompt(now = Date.now()) {
    const living = livingHeroes();
    const fallen = s.heroes.some((id) => (s.heroHp[id] || 0) <= 0);

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
    if (!snackId) return;

    if (autopilotActive()) {
      pendingSnackApproval = null;
      if ((s.snacks[snackId] || 0) > 0) useSnack(snackId);
      return;
    }

    if (pendingSnackApproval) return;

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

    if (!kingdomAutoPilot) {
      standDownAfterReply = true;
      announce("Enemy defeated. Battle Autopilot is standing down.");
    }

    refreshSagePanel();
  }

  function startBattleAutopilot() {
    battleAutoPilot = true;
    battlePilotClock = 0;
    clearAutopilotRecommendations();
    pendingSnackApproval = null;
    cancelSageSpeech(true);
    standDownAfterReply = false;

    announce(
      s.enemy
        ? `Battle Autopilot engaged. I will defeat ${s.enemy.name}, use skills responsibly, and protect the party.`
        : "Battle Autopilot armed. I will engage the next enemy we encounter."
    );

    log("Battle Autopilot activated by the player.");
    refreshSagePanel();
  }

  function startKingdomAutopilot() {
    if (!s.autoPilotUnlocked) {
      queueSageReply("My kingdom-management protocols are not ready yet. We will discover more as we go.");
      return;
    }

    kingdomAutoPilot = true;
    battleAutoPilot = false;
    clearAutopilotRecommendations();
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

    log("Raphael's Autopilot modes are now off.");
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

    if (isGameplayPaused()) return;

    if (pendingAnalistApproval && /^(?:yes|yeah|yep|sure|okay|ok|do it|go ahead|affirmative)$/.test(text)) {
      answerAnalistPrompt(true);
      return;
    }

    if (pendingAnalistApproval && /^(?:no|nope|not now|negative)$/.test(text)) {
      answerAnalistPrompt(false);
      return;
    }

    if (/\b(?:use|cast|activate)\s+analist\b/.test(text)) {
      if (pendingAnalistApproval) answerAnalistPrompt(true);
      else skill("analist");
      return;
    }

    if (/\b(?:use|cast)\s+resist\b/.test(text)) {
      skill("resist");
      return;
    }

    if (/\b(?:stand down|autopilot off|auto pilot off|stop autopilot|stop auto pilot)\b/.test(text)) {
      stopAllAutopilots();
      return;
    }

    if (
      /\bnever mind\b|\bnothing\b/.test(text) ||
      /\b(cancel|go idle|back to idle|stop listening)\b/.test(text)
    ) {
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

    if (
      /\b(?:annihilate|anihalate|annihalate|eliminate)\b.*\b(?:enemy|enemies|monster|monsters|them|it)\b/.test(text) ||
      /^annihilate(?: the)? enemy$/.test(text)
    ) {
      startBattleAutopilot();
      return;
    }

    if (
      /\b(?:activate|enable|start|engage|begin|turn on|switch on)\s+(?:the\s+)?(?:(?:true|full|kingdom|resource management)\s+)?auto\s*pilot(?:\s+mode)?\b/.test(text) ||
      /\b(?:true|full|kingdom)\s+auto\s*pilot\b/.test(text) ||
      /^autopilot on$/.test(text) ||
      /^auto pilot on$/.test(text) ||
      /^manage my kingdom$/.test(text)
    ) {
      startKingdomAutopilot();
      return;
    }
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

      if (fallen && living.length && available("revive") && !elowenPassiveReadyForFallenAlly()) {
        return "revive";
      }

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
        if (s.enemy) {
          replies.push("Defeat the current enemy before exploring again.");
        } else if (battleLocked()) {
          replies.push("The party is unavailable during hospital treatment.");
        } else {
          explore();
          completed.push("exploration");
        }
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
        const levelKey = {
          pickaxe: "pickaxe",
          speed: "speedLevel",
          damage: "damageLevel",
          crit: "critLevel"
        }[command.key];

        const previousLevel = s[levelKey];
        upgrade(command.key);

        if (s[levelKey] > previousLevel) {
          completed.push(`${command.label} upgrade`);
        } else {
          replies.push(`I could not upgrade ${command.label}. You may need more resources or it may already be at its maximum level.`);
        }
      } else if (command.kind === "snack") {
        let snackId = command.key;

        if (snackId === "auto" && command.action === "use") {
          snackId = chooseSnackToUse();

          if (!snackId) {
            replies.push("I could not find a suitable snack in your bag to use right now.");
            continue;
          }
        }

        if (snackId === "auto" && command.action === "buy") {
          const affordable = SNACKS
            .filter((item) => item.cost <= s.gold)
            .sort((a, b) => a.cost - b.cost);

          if (!affordable.length) {
            replies.push("You do not have enough gold to buy any snack.");
            continue;
          }

          snackId = affordable[0].id;
        }

        const snack = SNACKS.find((item) => item.id === snackId);

        if (!snack) {
          replies.push("I could not find that snack.");
          continue;
        }

        if (command.action === "buy") {
          const oldGold = s.gold;
          const oldCount = s.snacks[snackId] || 0;
          buySnack(snackId);

          if ((s.snacks[snackId] || 0) > oldCount && s.gold < oldGold) {
            completed.push(`buying ${snack.name}`);
          } else {
            replies.push(`I could not buy ${snack.name}. You need ${snack.cost} gold.`);
          }
        } else {
          const oldCount = s.snacks[snackId] || 0;

          if (snackId === "revive" && elowenPassiveReadyForFallenAlly()) {
            replies.push("Elowen's revival is ready, so I will save the Revive Snack.");
          } else {
            useSnack(snackId);

            if ((s.snacks[snackId] || 0) < oldCount) {
              completed.push(`using ${snack.name}`);
            } else {
              replies.push(`I could not use ${snack.name}. Check your inventory and party status.`);
            }
          }
        }
      }
    }

    if (completed.length) {
      replies.unshift(
        `Done. ${completed.join(" and ")} ${completed.length === 1 ? "command is" : "commands are"} complete.`
      );
    }

    queueSageReply(replies.join(" ") || "Command complete.");
  }

  function runBattleAutopilot(now = Date.now()) {
    if ((!battleAutoPilot && !kingdomAutoPilot) || !s.enemy || battleLocked() || isGameplayPaused()) return;
    if (!livingHeroes().length) return;

    if (
      isSkillUnlocked("resist") &&
      s.enemy.uniqueAttack === "antiMagicBarrier" &&
      !s.enemy.antiMagicBarrierTriggered &&
      !s.enemy.resistUsed &&
      (Number(s.enemy.bossElapsed) || 0) >= Math.max(0, getBarrierDelaySeconds() - 1.2) &&
      canUseSkill("resist")
    ) {
      skill("resist");
      battlePilotClock = 0;
      return;
    }

    if (isAntiMagicBarrierActive()) {
      if (isSkillUnlocked("resist") && canUseSkill("resist")) {
        skill("resist");
      } else if (!s.enemy.lastBarrierVoiceAt || now - s.enemy.lastBarrierVoiceAt >= 9000) {
        s.enemy.lastBarrierVoiceAt = now;
        announce("I am not able to use any skills due to the enemy's ability.");
      }

      return;
    }

    if (elowenPassiveReadyForFallenAlly(now)) return;

    const fallen = s.heroes.filter((id) => (s.heroHp[id] || 0) <= 0);

    if (fallen.length) {
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

      if (
        (s.snacks.revive || 0) <= 0 &&
        s.gold >= SNACKS.find((item) => item.id === "revive").cost
      ) {
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

      if (s.gold >= manaSnackCost) {
        buySnack("etherberry");

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

    if (kingdomManagementClock >= 2) {
      kingdomManagementClock = 0;
      if (runKingdomSupplies(now)) return;
    }

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

    if (!battleLocked() && kingdomRecruitClock >= 45) {
      kingdomRecruitClock = 0;

      const recruitPriority = [
        "tessa", "borin", "luna", "kellan", "darius",
        "silas", "mira_cook", "elise", "iris", "juno"
      ];

      const recruit = recruitPriority
        .map((id) => RECRUITS.find((item) => item.id === id))
        .find((item) => item && !s.recruits.includes(item.id) && s.gold >= item.cost);

      if (recruit) {
        hireRecruit(recruit.id);
        announce(`I hired ${recruit.name} to help the expedition.`);
        return;
      }
    }

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

      if (wake && (!commandModeActive || speechBusy || speechQueue.length)) {
        enterCommandMode();
        const trailing = text.slice(wake.index + wake[0].length).trim();

        if (result.isFinal && trailing) {
          handleVoiceCommand(trailing);
        } else if (result.isFinal) {
          armCommandIdleTimer();
        }

        continue;
      }

      if (pendingAnalistApproval && yesNo && result.isFinal) {
        cancelSageSpeech(true);
        ignoreRecognitionUntil = 0;
        handleVoiceCommand(text);
        continue;
      }

      if (pendingSnackApproval && yesNo && result.isFinal) {
        cancelSageSpeech(true);
        ignoreRecognitionUntil = 0;
        handleVoiceCommand(text);
        continue;
      }

      if ((commandModeActive || battleAutoPilot || kingdomAutoPilot) && !speechBusy && result.isFinal && thanks) {
        handleVoiceCommand(text);
        continue;
      }

      if ((commandModeActive || battleAutoPilot || kingdomAutoPilot) && speechBusy && result.isFinal && (thanks || standDown)) {
        cancelSageSpeech(true);
        ignoreRecognitionUntil = 0;
        handleVoiceCommand(text);
        continue;
      }

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

      console.warn("Raphael could not start speech recognition.", error);
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

    recognition.onstart = () => {
      recognitionRunning = true;
    };

    recognition.onresult = handleRecognitionResult;

    recognition.onerror = (event) => {
      recognitionRunning = false;
      console.warn("Raphael voice recognition error:", event.error);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        recognitionEnabled = false;
        updateSageStatus("MICROPHONE PERMISSION NEEDED");

        if (!recognitionPermissionWarningShown) {
          recognitionPermissionWarningShown = true;
          toast("Allow microphone access for this site, then reload the game to use Raphael voice commands.");
        }

        return;
      }

      if (event.error === "audio-capture" && !recognitionPermissionWarningShown) {
        recognitionPermissionWarningShown = true;
        toast("Raphael could not find a microphone. Check your microphone settings.");
      }

      scheduleRecognitionRestart(event.error === "network" ? 1200 : 500);
    };

    recognition.onend = () => {
      recognitionRunning = false;
      scheduleRecognitionRestart(350);
    };

    startWakeRecognition();
  }
    function enterCommandMode() {
    if (!sageEnabled) return;

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

  // ==========================================
  // RAPHAEL EVOLUTION
  // ==========================================

  function triggerRaphaelEvolution() {
    if (s.raphaelEvolved) return;

    pauseGameplay("raphael-evolution");
    s.raphaelEvolved = true;
    s.autoPilotUnlocked = true;
    cancelSageSpeech(true);
    currentPrompt = null;
    updateSageMessage("Evolution sequence initiated.");
    save();

    const overlay = document.createElement("div");
    overlay.className = "raphael-evolution-overlay";
    overlay.innerHTML = `
      <div class="raphael-evolution-stage">
        <div class="raphael-evolution-caption">GREAT SAGE · EVOLUTION</div>
        <div class="raphael-evolution-emblem" id="raphaelEmblem">◈</div>
        <h1 id="raphaelEvolutionTitle">EVOLUTION INITIATED</h1>
        <p id="raphaelEvolutionText">An unprecedented evolution is beginning...</p>
        <small>Click to continue when the reveal is complete</small>
      </div>
    `;

    document.body.appendChild(overlay);
    refreshSagePanel();

    let ready = false;

    const closeEvolution = () => {
      if (!ready) return;

      clearTimeout(overlay._evolutionTimer);
      clearTimeout(overlay._closeTimer);
      overlay.remove();
      resumeGameplay("raphael-evolution");
      updateAutopilotStatusIndicators();
      refreshSagePanel();
      save();

      if (!window._analistUnlockQueued) {
        window._analistUnlockQueued = true;

        queueUnlockReveal({
          category: "NEW ABILITY",
          title: "Analist",
          symbol: "◈",
          description: "A new analysis mode for examining unusual enemy abilities.",
          speech: "A new function is online: Analist. I can study unusual enemy abilities."
        });
      }
    };

    overlay.addEventListener("click", closeEvolution);

    overlay._evolutionTimer = window.setTimeout(() => {
      const emblem = overlay.querySelector("#raphaelEmblem");
      const title = overlay.querySelector("#raphaelEvolutionTitle");
      const text = overlay.querySelector("#raphaelEvolutionText");

      if (emblem) emblem.textContent = "R";
      if (title) title.textContent = "RAPHAEL HAS AWAKENED";
      if (text) text.textContent = "I have evolved into Raphael. You can now wake me by saying Raphael.";

      overlay.classList.add("is-evolved");
      ready = true;

      announce("Evolution complete. I am Raphael, the evolved form of Great Sage.");
      updateAutopilotStatusIndicators();
      refreshSagePanel();
      save();
    }, 2300);

    overlay._closeTimer = window.setTimeout(() => {
      ready = true;
      closeEvolution();
    }, 6500);
  }

  // ==========================================
  // STARTUP AND SAVE REPAIR
  // ==========================================

  if (s.enemy && !s.enemy.maxHp) {
    s.enemy.maxHp = s.enemy.hp;
  }

  if (s.enemy) {
    s.enemy.uniqueAttack =
      s.enemy.uniqueAttack || (s.region >= 7 ? "antiMagicBarrier" : null);
    s.enemy.antiMagicBarrierTriggered = Boolean(s.enemy.antiMagicBarrierTriggered);
    s.enemy.antiMagicBarrierActive = Boolean(s.enemy.antiMagicBarrierActive);
    s.enemy.barrierElapsed = Number(s.enemy.barrierElapsed) || 0;
    s.enemy.bossElapsed = Number(s.enemy.bossElapsed) || 0;
    s.enemy.specialAttackClock = Number(s.enemy.specialAttackClock) || 0;
    s.enemy.resistUsed = Boolean(s.enemy.resistUsed);
    s.enemy.resistPrepared = Boolean(s.enemy.resistPrepared);
    s.enemy.restrictedSkills = Array.isArray(s.enemy.restrictedSkills)
      ? s.enemy.restrictedSkills
      : [];
  }

  if (!logs.length) {
    log("The crystal road awaits. Your party is ready.");
  }

  ensureDynamicAbilityButtons();
  render();
  save();
  updateMusicScene();
  setupWakeRecognition();
  refreshSagePanel();
  updateAutopilotStatusIndicators();

  if (s.autoPilotUnlocked && !s.raphaelEvolved) {
    window.setTimeout(triggerRaphaelEvolution, 600);
  }

  if (!s.enemy && !battleLocked()) {
    scheduleExplore();
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }

  window.gemMinerReady = true;

  window.setInterval(() => {
    if (isGameplayPaused() || !s.needsHospital) return;

    const standingHeroes = livingHeroes();

    if (standingHeroes.length > 0) {
      s.needsHospital = false;
      s.hospitalFee = 0;
      s.healingUntil = 0;

      if (currentPrompt && currentPrompt.type === "hospital") {
        currentPrompt = null;
      }

      log(`Hospital state cleared. ${standingHeroes.length} hero(es) are standing.`);
      toast("A hero is standing! Normal gameplay restored.");
      render();
      save();

      if (!s.enemy && !battleLocked()) scheduleExplore();
    }
  }, 5000);

  window.setInterval(() => {
    tick();
    updateAutopilotStatusIndicators();
  }, 200);
})();