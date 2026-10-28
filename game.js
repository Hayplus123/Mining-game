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
    },
  };

  // A save that has already reached Cave 8 keeps the permanent party upgrade.
  // The definitions are fresh on each page load, so this multiplier is applied once per load.
  const CK_PARTY_UPGRADE_MULTIPLIER = 1.2;
  let permanentHeroBoostApplied = false;

  function applyPermanentHeroBoost() {
    if (permanentHeroBoostApplied) return;
    permanentHeroBoostApplied = true;
    Object.values(HEROES).forEach((hero) => {
      hero.maxHp = Math.ceil(hero.maxHp * CK_PARTY_UPGRADE_MULTIPLIER);
    });
  }

  try {
    const earlySave = JSON.parse(
      localStorage.getItem(SAVE_KEY) || localStorage.getItem(OLD_SAVE_KEY) || "{}"
    ) || {};
    if (Boolean(earlySave.partyUpgradeApplied) || Number(earlySave.region) >= 7 ||
        (Array.isArray(earlySave.bossDefeated) && earlySave.bossDefeated.includes(6))) {
      applyPermanentHeroBoost();
    }
  } catch (error) { /* A fresh save will use the base hero statistics. */ }

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

  // The tenth cave stays at the end of the known list and is hidden by the atlas
  // until the player reaches it.
  regions.push({
    name: "The Veiled Heart",
    enemy: "Veil-Touched Shade",
    type: "VEIL ENTITY",
    hp: 1750,
    damage: 64,
    gold: 420,
    crystals: 150,
    sprite: "assets/wisp.svg",
    boss: "The Veiled Sovereign",
    bossHp: 52000,
    bossDamage: 122,
    desc: "A concealed chamber hums beyond the final known seal. Its true purpose remains uncertain.",
    rewardHero: null
  });

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
    resist: 30,
    barrier: 75
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
    manaLevel: 0,
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
    partyUpgradeApplied: false,
    barrierUnlocked: false,
    partyBarrierUntil: 0,
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
      resist: 0,
      barrier: 0
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
    state.partyUpgradeApplied = Boolean(state.partyUpgradeApplied);
    state.barrierUnlocked = Boolean(state.barrierUnlocked);
    state.manaLevel = Math.max(0, Math.min(5, Math.floor(Number(state.manaLevel) || 0)));
    state.partyBarrierUntil = Math.max(0, Number(state.partyBarrierUntil) || 0);
    state.snacks = { ...defaults.snacks, ...(stored.snacks || {}) };

    state.heroes =
      Array.isArray(stored.heroes) && stored.heroes.length
        ? stored.heroes.filter((id) => HEROES[id])
        : initialHeroes.slice();
    // Older saves may contain only heroes removed from this version.
    if (!state.heroes.length) state.heroes = initialHeroes.slice();

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

    // Backfill health for heroes newly granted by this update when an older save
    // already recorded a cleared cave but never had a reward hero for it.
    state.heroes.forEach((id) => {
      if (state.heroHp[id] === undefined || state.heroHp[id] === null) {
        state.heroHp[id] = HEROES[id].maxHp;
        
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

    state.partyUpgradeApplied =
      Boolean(state.partyUpgradeApplied) ||
      state.region >= 7 ||
      state.bossDefeated.includes(6);

    state.barrierUnlocked =
      Boolean(state.barrierUnlocked) ||
      state.region >= 9 ||
      state.bossDefeated.includes(8);

    state.partyBarrierUntil = Math.max(
      0,
      Number(state.partyBarrierUntil) || 0
    );

    state.manaLevel = Math.max(
      0,
      Math.min(5, Math.floor(Number(state.manaLevel) || 0))
    );

    state.needsHospital = Boolean(state.needsHospital);
    state.hospitalFee = Math.max(0, Number(state.hospitalFee) || 0);
    state.healingUntil = Math.max(0, Number(state.healingUntil) || 0);

    const savedMaxMana =
      100 +
      state.manaLevel * 25 +
      (state.recruits.includes("iris") ? 25 : 0);

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
    exploring: {
      src: "exploring.mp3",
      label: "Exploration theme"
    },
    fighting: {
      src: "fighting.mp3",
      label: "Battle theme"
    },
    intense: {
      src: "intense.mp3",
      label: "Boss theme"
    }
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

  const bossDone = () =>
    s.bossDefeated.includes(s.region);

  const crystalGoal = () =>
    25 + s.region * 20 + Math.floor(s.defeated / 3) * 8;

  const crystalGateOpen = () =>
    s.caveCrystalProgress >= crystalGoal();

  function addCaveCrystalProgress(amount) {
    s.caveCrystalProgress += Math.max(
      0,
      Number(amount) || 0
    );
  }

  const skillUnlockRegion = (key) => ({
    heal: 1,
    phoenix: 2,
    resist: 8,
    barrier: 9
  }[key] ?? 0);

  const isSkillUnlocked = (key) => {
    if (key === "resist") return Boolean(s.resistUnlocked);
    if (key === "barrier") return Boolean(s.barrierUnlocked);

    return s.region >= skillUnlockRegion(key);
  };

  const autopilotActive = () =>
    Boolean(battleAutoPilot || kingdomAutoPilot);

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

  const isGameplayPaused = () =>
    gameplayPauseReasons.size > 0;

  const partyUpgradeMultiplier = () =>
    s.partyUpgradeApplied ? 1.2 : 1;

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
        ].map((key) => [
          key,
          Number(s[key]) || 0
        ])
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
    const pausedFor = Math.max(
      0,
      Date.now() - pauseStartedAt
    );

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
      if (Number(snapshot[key]) > pauseStartedAt) {
        s[key] = Math.max(
          Number(s[key]) || 0,
          Number(snapshot[key]) || 0
        ) + pausedFor;
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

  const isRecovering = () =>
    s.healingUntil > Date.now();

  const battleLocked = () =>
    s.needsHospital || isRecovering();

  const canStartBattle = () =>
    !battleLocked() && livingHeroes().length > 0;

  const maxMana = () =>
    100 +
    s.manaLevel * 25 +
    (s.recruits.includes("iris") ? 25 : 0);

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
      const selectedVolume = Math.max(
        0,
        Math.min(1, Number(volume.value) || 0)
      );

      const duckMusic = commandModeActive || speechBusy;

      audio.volume =
        selectedVolume * (duckMusic ? MUSIC_DUCK_FACTOR : 1);
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
      playAttempt
        .then(updateMusicControl)
        .catch(() => updateMusicControl());
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
    ) * partyUpgradeMultiplier() +
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

    if (
      currentPrompt &&
      ["phoenix", "lowHealth"].includes(currentPrompt.type)
    ) {
      currentPrompt = null;
    }

    refreshSagePanel();
  }

  function showPrompt(prompt) {
    if (
      autopilotActive() &&
      ["phoenix", "lowHealth"].includes(prompt.type)
    ) {
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

    const english = voices.filter((voice) =>
      /^en([_-]|$)/i.test(voice.lang)
    );

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
      const matches = english.filter((voice) =>
        pattern.test(voice.name)
      );

      if (matches.length) {
        const natural = matches.find((voice) =>
          /natural/i.test(voice.name)
        );

        return natural || matches[0];
      }
    }

    return (
      english.find((voice) => /^en[-_]US$/i.test(voice.lang)) ||
      english[0]
    );
  }

  function cancelSageSpeech(clearQueue = true) {
    speechGeneration++;

    if (clearQueue) speechQueue.length = 0;

    speechBusy = false;
    currentUtterance = null;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

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

      if (event.name === "word" || event.charIndex >= 0) {
        pulseSageWord();
      }
    };

    function finishUtterance() {
      if (generation !== speechGeneration) return;

      speechBusy = false;
      currentUtterance = null;
      ignoreRecognitionUntil = Date.now() + 700;

      updateSageStatus(
        commandModeActive ? "LISTENING" : "WAKE WORD READY"
      );

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
  
  // ==========================================
  // GREAT SAGE: SPEECH AND VOICE RECOGNITION
  // ==========================================

  function announce(message) {
    if (!sageEnabled || unlockRevealActive) return;

    if (
      /party.?s health is low|great sage online|your party.?s health is low/i
        .test(message)
    ) {
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

  function toggleSage() {
    if (commandModeActive) {
      cancelSageSpeech(true);
      leaveCommandMode();
      return;
    }

    if (speechBusy || speechQueue.length) {
      cancelSageSpeech(true);
      currentPrompt = null;
      refreshSagePanel();
    }
  }

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
      help.textContent = kingdomAutoPilot
        ? "Kingdom Autopilot manages supplies, upgrades, and mining. Say Great Sage, stand down to stop."
        : battleAutoPilot
          ? "Battle Autopilot manages the current fight. Say Great Sage, stand down to stop."
          : s.autoPilotUnlocked
            ? "Battle Autopilot is available. Kingdom Autopilot is unlocked."
            : "Battle Autopilot is available. Kingdom Autopilot unlocks after the sixth cave guardian.";
    }
  }

  function armCommandIdleTimer() {
    clearTimeout(commandIdleTimer);

    if (!commandModeActive) return;

    commandIdleTimer = setTimeout(() => {
      if (speechBusy || speechQueue.length) return;
      leaveCommandMode();
    }, COMMAND_IDLE_MS);
  }

  function leaveCommandMode() {
    clearTimeout(commandIdleTimer);

    commandModeActive = false;
    returnToIdleAfterSpeech = false;

    updateSageStatus(
      sageEnabled ? "WAKE WORD READY" : "VOICE MUTED"
    );

    updateMusicControl();
    refreshSagePanel();
    scheduleRecognitionRestart(150);
  }

  function enterCommandMode() {
    if (!recognitionEnabled) {
      toast("Voice recognition is disabled.");
      return;
    }

    commandModeActive = true;

    updateSageStatus("LISTENING");
    updateSageMessage("I'm listening. What would you like me to do?");
    updateMusicControl();
    refreshSagePanel();

    armCommandIdleTimer();
  }

  function scheduleRecognitionRestart(delay = 600) {
    clearTimeout(recognitionRestartTimer);

    if (
      !recognitionEnabled ||
      !recognition ||
      recognitionRunning
    ) {
      return;
    }

    recognitionRestartTimer = setTimeout(() => {
      if (!recognitionEnabled || recognitionRunning) return;

      try {
        recognition.start();
      } catch (error) {
        // A browser may still be finishing the previous listening session.
      }
    }, delay);
  }

  function stopRecognition() {
    clearTimeout(recognitionRestartTimer);

    if (!recognition) return;

    try {
      recognition.stop();
    } catch (error) {
      // Recognition may already be stopped.
    }
  }

  function startRecognition() {
    if (!SpeechRecognitionAPI) {
      updateSageStatus("VOICE RECOGNITION UNAVAILABLE");
      return;
    }

    if (recognition) {
      scheduleRecognitionRestart(100);
      return;
    }

    recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-CA";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      recognitionRunning = true;

      if (!speechBusy && !commandModeActive) {
        updateSageStatus("WAKE WORD READY");
      }

      refreshSagePanel();
    };

    recognition.onend = () => {
      recognitionRunning = false;

      if (!speechBusy && !commandModeActive && sageEnabled) {
        updateSageStatus("WAKE WORD READY");
      }

      scheduleRecognitionRestart(700);
    };

    recognition.onerror = (event) => {
      recognitionRunning = false;

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        recognitionEnabled = false;
        updateSageStatus("MICROPHONE PERMISSION NEEDED");

        if (!recognitionPermissionWarningShown) {
          recognitionPermissionWarningShown = true;

          toast(
            "Allow microphone access in your browser to use voice commands."
          );
        }

        return;
      }

      if (event.error === "audio-capture") {
        updateSageStatus("NO MICROPHONE FOUND");
      }

      scheduleRecognitionRestart(1200);
    };

    recognition.onresult = (event) => {
      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (!result.isFinal) continue;

        const transcript = String(
          result[0]?.transcript || ""
        ).trim();

        if (!transcript) continue;

        if (Date.now() < ignoreRecognitionUntil) continue;

        handleVoiceTranscript(transcript);
      }
    };

    scheduleRecognitionRestart(250);
  }

  function handleVoiceTranscript(transcript) {
    const text = transcript.toLowerCase().trim();

    const wakePattern =
      /\b(great sage|hey sage|hello sage)\b/i;

    const wakeMatch = text.match(wakePattern);

    if (!commandModeActive) {
      if (!wakeMatch) return;

      const remainder = text
        .slice(wakeMatch.index + wakeMatch[0].length)
        .trim()
        .replace(/^[,.:;!? -]+/, "");

      enterCommandMode();

      if (remainder) {
        clearTimeout(commandIdleTimer);
        handleVoiceCommand(remainder);
      }

      return;
    }

    clearTimeout(commandIdleTimer);
    handleVoiceCommand(text);
  }

  function setVoiceEnabled(enabled) {
    sageEnabled = Boolean(enabled);

    if (!sageEnabled) {
      cancelSageSpeech(true);
      commandModeActive = false;
      clearTimeout(commandIdleTimer);
      updateSageStatus("VOICE MUTED");
    } else {
      updateSageStatus("WAKE WORD READY");
      startRecognition();
    }

    updateMusicControl();
    refreshSagePanel();
  }
  
  // ==========================================
  // GREAT SAGE: VOICE COMMAND ROUTER
  // ==========================================

  function handleVoiceCommand(rawCommand) {
    const command = String(rawCommand || "")
      .toLowerCase()
      .trim()
      .replace(/[.!?]+$/, "");

    if (!command) {
      announce("I didn't hear a command. Please try again.");
      armCommandIdleTimer();
      return;
    }

    if (
      /\b(never mind|cancel|stop listening|exit command mode)\b/i
        .test(command)
    ) {
      announce("Understood. I'll stand by.");
      returnToIdleAfterSpeech = true;
      armCommandIdleTimer();
      return;
    }

    if (
      /\b(stand down|stop autopilot|disable autopilot|stop managing)\b/i
        .test(command)
    ) {
      stopAutopilot();
      announce("Autopilot has been stopped.");
      armCommandIdleTimer();
      return;
    }

    if (
      /\b(activate|start|enable)\b/i.test(command) &&
      /\bkingdom autopilot\b/i.test(command)
    ) {
      activateKingdomAutopilot();
      armCommandIdleTimer();
      return;
    }

    if (
      /\b(activate|start|enable)\b/i.test(command) &&
      /\b(battle autopilot|battle auto pilot)\b/i.test(command)
    ) {
      activateBattleAutopilot();
      armCommandIdleTimer();
      return;
    }

    if (/\b(what cave|which cave|current cave|where am i)\b/i.test(command)) {
      announce(
        s.region < 9
          ? `You are exploring Cave ${s.region + 1}.`
          : s.region === 9
            ? "You have reached the tenth cave."
            : "You are exploring an undiscovered cavern."
      );

      armCommandIdleTimer();
      return;
    }

    if (/\b(show|check|tell me about)\b.*\b(party|heroes|health)\b/i.test(command)) {
      const summary = livingHeroes()
        .map((id) =>
          `${HEROES[id].name}: ${fmt(s.heroHp[id])} health`
        )
        .join(". ");

      announce(
        summary || "No heroes are currently standing."
      );

      armCommandIdleTimer();
      return;
    }

    if (/\b(mine|start mining|gather ore)\b/i.test(command)) {
      mine();
      announce("Mining complete.");
      armCommandIdleTimer();
      return;
    }

    if (/\b(explore|find an enemy|continue exploring)\b/i.test(command)) {
      if (s.enemy) {
        announce(`${s.enemy.name} is already here.`);
      } else {
        scheduleExplore(true);
        announce("I'll look for the next enemy.");
      }

      armCommandIdleTimer();
      return;
    }

    if (/\b(barrier|protect the party|protect us)\b/i.test(command)) {
      skill("barrier");
      armCommandIdleTimer();
      return;
    }

    if (/\b(healing wave|heal the party|heal everyone)\b/i.test(command)) {
      skill("heal");
      armCommandIdleTimer();
      return;
    }

    if (/\b(phoenix blessing|revive|revive an ally)\b/i.test(command)) {
      skill("phoenix");
      armCommandIdleTimer();
      return;
    }

    if (/\b(radiant slash|slash)\b/i.test(command)) {
      skill("slash");
      armCommandIdleTimer();
      return;
    }

    if (/\b(arcane burst|burst)\b/i.test(command)) {
      skill("burst");
      armCommandIdleTimer();
      return;
    }

    if (/\b(meteor|meteor strike)\b/i.test(command)) {
      skill("meteor");
      armCommandIdleTimer();
      return;
    }

    if (/\b(frost|frost bind)\b/i.test(command)) {
      skill("frost");
      armCommandIdleTimer();
      return;
    }

    if (/\b(guard|defend|protect)\b/i.test(command)) {
      skill("guard");
      armCommandIdleTimer();
      return;
    }

    if (/\b(resist|anti magic resistance)\b/i.test(command)) {
      skill("resist");
      armCommandIdleTimer();
      return;
    }

    if (/\b(play music|turn music on|enable music)\b/i.test(command)) {
      if (!musicEnabled) toggleMusic();
      armCommandIdleTimer();
      return;
    }

    if (/\b(pause music|stop music|turn music off)\b/i.test(command)) {
      if (musicEnabled) toggleMusic();
      armCommandIdleTimer();
      return;
    }

    if (/\b(status|how are we doing|kingdom status)\b/i.test(command)) {
      announce(
        `Your kingdom has ${fmt(s.gold)} gold, ` +
        `${fmt(s.crystals)} crystals, and ${fmt(s.ore)} ore. ` +
        `Your mana is ${fmt(s.mana)} out of ${fmt(maxMana())}.`
      );

      armCommandIdleTimer();
      return;
    }

    announce(
      "I didn't recognise that command. Try a skill name, mine, explore, or kingdom status."
    );

    armCommandIdleTimer();
  }

  // ==========================================
  // TOASTS, LOGGING, AND DAMAGE EFFECTS
  // ==========================================

  function toast(message) {
    const el = $("toast");

    if (el) {
      el.textContent = String(message);
      el.classList.add("visible");

      clearTimeout(toastTimer);

      toastTimer = setTimeout(() => {
        el.classList.remove("visible");
      }, 2800);
    } else {
      console.info("[Crystal Kingdom]", message);
    }
  }

  function log(message) {
    logs.unshift({
      time: Date.now(),
      message: String(message)
    });

    logs = logs.slice(0, 12);

    renderLog();
    save();
  }

  function showDamage(text, target = "enemy") {
    const parent =
      target === "party"
        ? $("partyStage") || $("battleStage")
        : $("enemyStage") || $("battleStage");

    if (!parent) return;

    const damage = document.createElement("span");

    damage.className =
      target === "party"
        ? "damage-number party-damage"
        : "damage-number enemy-damage";

    damage.textContent = String(text);
    damage.setAttribute("aria-hidden", "true");

    parent.appendChild(damage);

    setTimeout(() => damage.remove(), 1200);
  }


  function enemyHitEffect() {
    const enemy =
      document.querySelector(".enemy") ||
      $("enemyVisual") ||
      $("enemyStage");

    if (!enemy) return;

    enemy.classList.remove("hit");

    // Force a reflow so the animation can play again.
    void enemy.offsetWidth;

    enemy.classList.add("hit");

    setTimeout(() => {
      enemy.classList.remove("hit");
    }, 350);
  }

  
  function triggerPartyAttackAnimations() {
    const party =
      $("battleParty") ||
      document.querySelector(".party");

    if (!party) return;

    party.classList.remove("attacking");

    void party.offsetWidth;

    party.classList.add("attacking");

    const members = party.querySelectorAll(".battle-hero");

    members.forEach((member) => {
      const id = member.dataset.heroId;
      const hero = HEROES[id];

      if (!hero || (s.heroHp[id] || 0) <= 0) return;

      const role = hero.role.toLowerCase();

      const attackClass =
        /archer|ranger|rogue/.test(role)
          ? "attack-bow"
          : /mage|druid|healer|reviver|support/.test(role)
            ? "attack-cast"
            : "attack-sword";

      member.classList.remove(
        "attack-bow",
        "attack-sword",
        "attack-cast"
      );

      void member.offsetWidth;

      member.classList.add(attackClass);

      setTimeout(() => {
        member.classList.remove(attackClass);
      }, 400);
    });

    setTimeout(() => {
      party.classList.remove("attacking");
    }, 400);
  }

  function playImportantSound() {
    const now = Date.now();

    if (now - lastImportantSound < 350) return;
    lastImportantSound = now;

    try {
      if (!importantAudioContext) {
        importantAudioContext = new (
          window.AudioContext ||
          window.webkitAudioContext
        )();
      }

      const ctx = importantAudioContext;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(480, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        170,
        ctx.currentTime + 0.22
      );

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.24
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.25);
    } catch (error) {
      // Sound effects are optional; gameplay should continue without them.
    }
  }


  function refreshSagePanel() {
    updateAutopilotStatusIndicators();

    const panel = $("sagePanel");
    const orb = $("sageOrb");
    const message = $("sageMessage");

    if (panel) {
      panel.classList.toggle("sage-speaking", speechBusy);
      panel.classList.toggle("sage-listening", commandModeActive);
      panel.classList.toggle(
        "sage-hidden",
        !sagePanelVisible()
      );
    }

    if (orb) {
      orb.classList.toggle("is-speaking", speechBusy);

      orb.classList.toggle(
        "is-listening",
        commandModeActive && !speechBusy
      );

      orb.classList.toggle("is-muted", !sageEnabled);
    }

    if (message && currentPrompt && !speechBusy) {
      message.textContent =
        currentPrompt.message || message.textContent;
    }

    const commandButton = $("sageCommandButton");

    if (commandButton) {
      commandButton.textContent = commandModeActive
        ? "Listening…"
        : "Talk to Great Sage";
    }

    const voiceButton = $("sageVoiceToggle");

    if (voiceButton) {
      voiceButton.textContent = sageEnabled
        ? "Mute voice"
        : "Enable voice";

      voiceButton.setAttribute(
        "aria-pressed",
        String(sageEnabled)
      );
    }
  }
  
  // ==========================================
  // CAVE ATLAS: KEEP FUTURE CAVES SECRET
  // ==========================================

  function guardianDiscovered(index) {
    return (
      index === 0 ||
      s.bossDefeated.includes(index) ||
      (
        Array.isArray(s.discoveredGuardians) &&
        s.discoveredGuardians.includes(index)
      )
    );
  }

  function renderCaveAtlas() {
    const atlas = $("caveAtlas");
    const count = $("caveAtlasCount");

    if (!atlas) return;

    const clearedCount = s.bossDefeated.length;

    if (count) {
      count.textContent = `${clearedCount} CLEARED`;
    }

    atlas.innerHTML = regions.map((cave, index) => {
      const cleared = s.bossDefeated.includes(index);
      const current = index === s.region;
      const locked = index > s.region;

      const state = cleared
        ? "cleared"
        : current
          ? "current"
          : "locked";

      const name = locked
        ? "Unknown Passage"
        : cave.name;

      const status = cleared
        ? "✓ CLEARED"
        : current
          ? "● CURRENT"
          : "🔒 SEALED";

      const hasGuardianBeenSeen =
        !locked && guardianDiscovered(index);

      const guardian = locked
        ? "Unknown"
        : hasGuardianBeenSeen
          ? cave.boss
          : "Unidentified guardian";

      const description = locked
        ? "The path ahead remains concealed."
        : cleared
          ? "This guardian has been defeated. The passage is secure."
          : current
            ? "Something waits deeper inside. Its identity remains uncertain."
            : "An unexplored passage.";

      const rewardKnown =
        !locked &&
        hasGuardianBeenSeen &&
        Boolean(cave.rewardHero);

      const rewardText = locked
        ? "Not yet discovered"
        : !hasGuardianBeenSeen
          ? "Unknown reward"
          : cave.rewardHero
            ? HEROES[cave.rewardHero].name
            : "Unrevealed treasure";

      return `
        <article class="cave-atlas-card" data-state="${state}">
          <div class="cave-atlas-card-top">
            <span class="cave-atlas-number">
              CAVE ${String(index + 1).padStart(2, "0")}
            </span>
            <span class="cave-atlas-status">${status}</span>
          </div>

          <h3>${esc(name)}</h3>
          <p class="cave-atlas-desc">${esc(description)}</p>

          <div class="cave-atlas-detail">
            <span>GUARDIAN</span>
            <strong>${esc(guardian)}</strong>
          </div>

          <div class="cave-atlas-reward ${locked || !rewardKnown ? "mysterious" : ""}">
            <span class="cave-atlas-reward-icon">
              ${locked || !rewardKnown ? "?" : "✦"}
            </span>
            <div>
              <small>DISCOVERY</small>
              <strong>${esc(rewardText)}</strong>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================
  // RESOURCE AND PARTY DISPLAY
  // ==========================================

  function renderResources() {
    const values = {
      gold: s.gold,
      crystals: s.crystals,
      ore: s.ore
    };

    for (const [id, value] of Object.entries(values)) {
      const el = $(id);
      if (el) el.textContent = fmt(value);
    }

    const mana = $("mana");

    if (mana) {
      mana.textContent = `${fmt(s.mana)} / ${fmt(maxMana())}`;
    }

    const bar = $("manaBar");

    if (bar) {
      bar.style.width =
        `${Math.max(0, Math.min(100, s.mana / maxMana() * 100))}%`;
    }
  }


  function renderParty() {
    const container = $("companions");

    if (container) {
      const cardHTML = s.heroes.map((id) => {
        const hero = HEROES[id];

        if (!hero) return "";

        const hp = Math.max(
          0,
          Math.min(
            hero.maxHp,
            Number(s.heroHp[id]) || 0
          )
        );

        const percentage = hero.maxHp
          ? hp / hero.maxHp * 100
          : 0;

        const fallen = hp <= 0;

        return `
          <article class="${fallen ? "is-fallen" : ""}">
            <div class="portrait">
              <img src="${esc(hero.portrait)}"
                   alt="${esc(hero.name)}"
                   loading="lazy">
            </div>
            <div class="companion-info">
              <b>${esc(hero.name)}</b>
              <small>${esc(hero.role)}</small>
              <small>${fmt(hp)} / ${fmt(hero.maxHp)} HP</small>
              <div class="minibar">
                <i style="width:${percentage}%"></i>
              </div>
              <small>${fallen ? "FALLEN" : "READY FOR BATTLE"}</small>
            </div>
          </article>
        `;
      }).join("");

      if (container.dataset.renderCache !== cardHTML) {
        container.innerHTML = cardHTML;
        container.dataset.renderCache = cardHTML;
      }
    }

    const power = $("partyPower");

    if (power) {
      power.textContent =
        `POWER ${fmt(totalPartyDamage())}`;
    }

    const attackLabel = $("partyAttackLabel");

    if (attackLabel) {
      attackLabel.textContent =
        `Attack interval: ${pInterval().toFixed(1)}s`;
    }

    const fieldParty = $("battleParty");

    if (fieldParty) {
      fieldParty.classList.add("party");

      const battleHTML = s.heroes.map((id, index) => {
        const hero = HEROES[id];

        if (!hero) return "";

        const fallen = (s.heroHp[id] || 0) <= 0;
        const rank = Math.min(index + 1, 8);

        return `
          <div class="battle-hero front-rank-${rank} ${fallen ? "fallen" : ""}"
               data-hero-id="${esc(id)}"
               title="${esc(hero.name)}">
            <img src="${esc(hero.portrait)}"
                 alt="${esc(hero.name)}">
          </div>
        `;
      }).join("");

      if (fieldParty.dataset.renderCache !== battleHTML) {
        fieldParty.innerHTML = battleHTML;
        fieldParty.dataset.renderCache = battleHTML;
      }
    }
  }
  // ==========================================
  // ENEMY AND GUARDIAN DISPLAY
  // ==========================================

  function renderEnemy() {
    const visual = $("enemyVisual");
    const sprite = $("enemySprite");

    if (!s.enemy) {
      if (visual) visual.classList.add("hidden");

      if ($("enemyName")) $("enemyName").textContent = "No enemy nearby";
      if ($("enemyType")) $("enemyType").textContent = "Awaiting discovery";
      if ($("enemyHealthText")) $("enemyHealthText").textContent = "—";
      if ($("enemyHealthBar")) $("enemyHealthBar").style.width = "0%";
      if ($("caption")) $("caption").textContent = "Your party is searching the tunnels…";

      return;
    }

    const enemy = s.enemy;

    if (visual) visual.classList.remove("hidden");

    if (sprite) {
      sprite.src = enemy.sprite || "assets/slime.svg";
      sprite.alt = enemy.name;
    }

    if ($("enemyName")) {
      $("enemyName").textContent = enemy.name;
    }

    if ($("enemyType")) {
      $("enemyType").textContent = enemy.type || "UNKNOWN ENTITY";
    }

    if ($("enemyHealthText")) {
      $("enemyHealthText").textContent =
        `${fmt(enemy.hp)} / ${fmt(enemy.maxHp)} HP`;
    }

    if ($("enemyHealthBar")) {
      $("enemyHealthBar").style.width =
        `${Math.max(0, Math.min(100, enemy.hp / enemy.maxHp * 100))}%`;
    }

    if ($("caption")) {
      $("caption").textContent = enemy.boss
        ? "A guardian blocks the passage!"
        : "An enemy approaches!";
    }
  }

  function renderGuardian() {
    const cave = region();

    const seen = guardianDiscovered(s.region);
    const defeated = s.bossDefeated.includes(s.region);

    if ($("regionName")) {
      $("regionName").textContent = cave.name;
    }

    if ($("regionNumber")) {
      $("regionNumber").textContent =
        `CAVE ${String(s.region + 1).padStart(2, "0")}`;
    }

    if ($("battleTitle")) {
      $("battleTitle").textContent = s.enemy
        ? s.enemy.boss
          ? "Guardian Challenge"
          : "Enemy Encounter"
        : "The Crystal Road";
    }

    if ($("status")) {
      $("status").textContent = battleLocked()
        ? "● RECOVERY"
        : s.enemy
          ? s.enemy.boss
            ? "● GUARDIAN BATTLE"
            : "● COMBAT"
          : "● EXPLORING";
    }

    if ($("guardianName")) {
      $("guardianName").textContent = defeated
        ? cave.boss
        : seen
          ? cave.boss
          : "Unidentified Guardian";
    }

    if ($("guardianDesc")) {
      $("guardianDesc").textContent = defeated
        ? "This guardian has been defeated."
        : seen
          ? cave.desc
          : "Its identity remains hidden until you challenge it.";
    }

    if ($("bossPhase")) {
      $("bossPhase").textContent = defeated
        ? "DEFEATED"
        : s.enemy && s.enemy.boss
          ? s.enemy.specialName || "IN BATTLE"
          : seen
            ? "AWAITING CHALLENGE"
            : "UNKNOWN";
    }

    if ($("threat")) {
      $("threat").textContent =
        ["Low", "Moderate", "High", "Severe", "Extreme"][Math.min(4, s.region >> 1)];
    }

    if ($("defeated")) {
      $("defeated").textContent = fmt(s.defeated);
    }

    const challenge = $("bossBtn");

    if (challenge) {
      challenge.disabled =
        battleLocked() ||
        Boolean(s.enemy) ||
        defeated ||
        !crystalGateOpen();

      challenge.textContent = defeated
        ? "Guardian defeated"
        : s.enemy
          ? "Battle in progress"
          : crystalGateOpen()
            ? "Challenge guardian"
            : "Gather crystals first";
    }

    renderCaveProgress();
  }

  function renderCaveProgress() {
    const goal = crystalGoal();

    if ($("caveProgressText")) {
      $("caveProgressText").textContent =
        `${fmt(s.caveCrystalProgress)} / ${fmt(goal)} crystals`;
    }

    if ($("caveProgressBar")) {
      $("caveProgressBar").style.width =
        `${Math.min(100, s.caveCrystalProgress / goal * 100)}%`;
    }

    if ($("caveProgressHint")) {
      $("caveProgressHint").textContent =
        crystalGateOpen()
          ? "The seal is weakening. You may challenge the guardian."
          : "Gather crystals by mining and defeating enemies to open the gate.";
    }
  }

  function renderRewards() {
    const card = $("nextHeroCard");

    if (!card) return;

    const heroId = region().rewardHero;
    const cleared = s.bossDefeated.includes(s.region);
    const seen = guardianDiscovered(s.region);

    if (!seen && !cleared) {
      card.innerHTML = `
        <div class="reward-kicker">SEALED DISCOVERY</div>
        <p class="reward-note">
          The guardian's reward is unknown. Challenge it to discover what awaits.
        </p>
      `;
      return;
    }

    if (heroId && !cleared) {
      const hero = HEROES[heroId];

      card.innerHTML = `
        <div class="reward-kicker">POSSIBLE ALLY</div>
        <div class="reward-row">
          <img src="${esc(hero.portrait)}" alt="${esc(hero.name)}">
          <div>
            <b>${esc(hero.name)}</b>
            <small>${esc(hero.role)}</small>
          </div>
        </div>
        <small class="reward-note">
          Defeat the guardian to recruit this hero.
        </small>
      `;
      return;
    }

    card.innerHTML = `
      <div class="reward-kicker">DISCOVERY</div>
      <p class="reward-note">
        ${cleared
          ? "The guardian has been defeated. Explore the next passage."
          : "The reward will be revealed after the challenge."}
      </p>
    `;
  }

  // ==========================================
  // BARRIER VISUAL
  // ==========================================

  function renderBarrierVisual() {
    const visual = $("partyBarrierVisual");
    if (!visual) return;

    const remaining = Math.max(
      0,
      (s.partyBarrierUntil - Date.now()) / 1000
    );

    const active = remaining > 0;

    visual.hidden = !active;
    visual.setAttribute("aria-hidden", String(!active));

    visual.classList.toggle(
      "barrier-over-anti-magic",
      active && isAntiMagicBarrierActive()
    );

    const timer = $("partyBarrierTimer");

    if (timer) {
      timer.textContent = `${remaining.toFixed(1)}s`;
    }
  }

  // ==========================================
  // HOSPITAL AND ADVENTURE LOG
  // ==========================================

  function renderHospital() {
    const panel = $("hospitalPanel");
    if (!panel) return;

    panel.hidden = !s.needsHospital && !isRecovering();

    const fee = $("hospitalFee");
    const status = $("hospitalStatus");
    const copy = $("hospitalCopy");
    const timer = $("hospitalTimer");
    const pay = $("payHealBtn");

    if (fee) {
      fee.textContent = `${fmt(s.hospitalFee)} gold`;
    }

    if (status) {
      status.textContent = s.needsHospital
        ? "TREATMENT NEEDED"
        : "RECOVERING";
    }

    if (copy) {
      copy.textContent = s.needsHospital
        ? "The whole party has fallen. Pay the fee to begin recovery."
        : "The healers are restoring the party. Battles remain paused during recovery.";
    }

    if (timer) {
      timer.textContent = s.needsHospital
        ? "Waiting for payment"
        : `${Math.max(0, Math.ceil((s.healingUntil - Date.now()) / 1000))}s remaining`;
    }

    if (pay) {
      pay.disabled =
        !s.needsHospital ||
        s.gold < s.hospitalFee;
    }
  }

  function renderLog() {
    const container = $("logList");

    if (!container) return;

    container.innerHTML = logs.map((entry) => {
      const message =
        typeof entry === "string"
          ? entry
          : entry.message;

      return `<p>${esc(message)}</p>`;
    }).join("");
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================

  function render() {
    renderResources();
    renderParty();
    renderEnemy();
    renderGuardian();
    renderCaveAtlas();
    renderRewards();
    renderHospital();
    renderLog();
    renderBarrierVisual();

    if (typeof renderSnacks === "function") renderSnacks();
    if (typeof renderRecruits === "function") renderRecruits();
    if (typeof renderUpgrades === "function") renderUpgrades();
    if (typeof renderSkills === "function") renderSkills();

    refreshSagePanel();
    updateMusicScene();
  }
  
  // ==========================================
  // ENEMY GENERATION
  // ==========================================

  let bossSpecialClock = 0;
  let antiMagicClock = 0;

  function createEnemyForRegion(index, boss = false) {
    const cave = regions[index];

    const scale = 1 + index * 0.25;

    const hp = boss
      ? cave.bossHp
      : Math.floor(cave.hp * (0.9 + Math.random() * 0.35));

    const damage = boss
      ? cave.bossDamage
      : cave.damage;

    return {
      name: boss ? cave.boss : cave.enemy,
      type: boss
        ? "CAVE GUARDIAN"
        : cave.type,
      hp,
      maxHp: hp,
      damage,
      gold: boss
        ? cave.gold * 8
        : cave.gold,
      crystals: boss
        ? cave.crystals * 6
        : cave.crystals,
      sprite: boss
        ? "assets/boss.svg"
        : cave.sprite,
      boss,
      regionIndex: index,
      specialName: "",
      areaAttackClock: 0,
      specialClock: 0,
      nextAntiMagicAt: Date.now() + 10000,
      antiMagicUntil: 0,
      antiMagicBarrierActive: false,
      restrictedSkills: [],
      scale,
      isCrownfallRupture: false
    };
  }

  function spawnEnemy(boss = false) {
    if (battleLocked() || !livingHeroes().length) return;
    if (s.enemy) return;

    const index = s.region;

    if (boss && s.bossDefeated.includes(index)) {
      toast("This guardian has already been defeated.");
      return;
    }

    s.enemy = createEnemyForRegion(index, boss);
    s.bossMode = boss;

    partyClock = 0;
    enemyClock = 0;
    supportClock = 0;
    bossSpecialClock = 0;
    antiMagicClock = 0;

    if (boss) {
      s.discoveredGuardians = Array.isArray(s.discoveredGuardians)
        ? s.discoveredGuardians
        : [];

      if (!s.discoveredGuardians.includes(index)) {
        s.discoveredGuardians.push(index);
      }

      log(`Guardian discovered: ${s.enemy.name}.`);
      announce(`Guardian challenge started: ${s.enemy.name}.`);

      if (index === 8) {
        s.enemy.specialName = "CROWNFALL RUPTURE";
        log("A dangerous pressure gathers around the Crown Devourer.");
      }
    } else {
      log(`${s.enemy.name} has appeared.`);
    }

    updateMusicScene();
    render();
    save();
  }

  function scheduleExplore(immediate = false) {
    clearTimeout(exploreTimer);

    if (
      battleLocked() ||
      s.enemy ||
      !livingHeroes().length ||
      s.bossDefeated.includes(s.region)
    ) {
      return;
    }

    const delay = immediate
      ? 50
      : Math.max(1200, 4500 - s.region * 220);

    exploreTimer = setTimeout(() => {
      if (battleLocked() || s.enemy || !livingHeroes().length) return;
      spawnEnemy(false);
    }, delay);
  }

  function exploreNow() {
    if (battleLocked()) {
      toast(s.needsHospital
        ? "Pay the hospital fee first."
        : "The party is still recovering.");
      return;
    }

    if (!livingHeroes().length) {
      toast("Your party has fallen. Visit the hospital.");
      return;
    }

    if (s.enemy) {
      toast("An enemy is already present.");
      return;
    }

    clearTimeout(exploreTimer);
    spawnEnemy(false);
  }

  // ==========================================
  // MINING
  // ==========================================

  function mine() {
    if (battleLocked()) {
      toast("Mining is unavailable during recovery.");
      return;
    }

    const base = 4 + s.pickaxe * 2;
    const crystalBonus = s.recruits.includes("luna") ? 1.2 : 1;
    const amount = Math.max(
      1,
      Math.floor(base * crystalBonus * partyUpgradeMultiplier())
    );

    s.crystals += amount;
    s.ore +=
      1 +
      (s.recruits.includes("juno") ? 1 : 0);

    s.gold +=
      2 +
      Math.floor(s.speedLevel / 2);

    addCaveCrystalProgress(amount);

    log(`Mining complete: +${amount} crystals.`);
    toast(`+${amount} crystals · +${1 + (s.recruits.includes("juno") ? 1 : 0)} ore`);

    render();
    save();
  }

  // ==========================================
  // GUARDIAN CHALLENGE
  // ==========================================

  function challengeGuardian() {
    if (battleLocked()) {
      toast(s.needsHospital
        ? "Pay the hospital fee before entering battle."
        : "The party is still recovering.");
      return;
    }

    if (s.enemy) {
      toast("Defeat the current enemy first.");
      return;
    }

    if (!livingHeroes().length) {
      toast("No heroes are available to challenge the guardian.");
      return;
    }

    if (s.bossDefeated.includes(s.region)) {
      toast("This guardian has already been defeated.");
      return;
    }

    if (!crystalGateOpen()) {
      toast("Gather more crystals to open the guardian's gate.");
      return;
    }

    spawnEnemy(true);
  }

  // ==========================================
  // DAMAGE TO THE PARTY
  // ==========================================

  function applyPartyDamage(amount, areaAttack = false) {
    const living = livingHeroes();

    if (!living.length) return;

    const barrierActive =
      s.partyBarrierUntil > Date.now();

    if (barrierActive && areaAttack) {
      log("Barrier completely absorbed the area attack.");
      showDamage("AREA BLOCKED", "party");
      return;
    }

    let damage = Math.max(0, Math.floor(amount));

    if (barrierActive && !areaAttack) {
      damage = Math.floor(damage * 0.25);
      log("Barrier reduced the incoming hit by 75%.");
    }

    if (s.guardCharges > 0 && !areaAttack) {
      s.guardCharges--;
      log("Aegis Guard blocked the incoming attack.");
      showDamage("BLOCKED", "party");
      return;
    }

    const targetId = living[
      Math.floor(Math.random() * living.length)
    ];

    if (areaAttack) {
      living.forEach((id) => {
        s.heroHp[id] = Math.max(
          0,
          (s.heroHp[id] || 0) - damage
        );

        showDamage(`-${damage}`, "party");
      });
    } else {
      s.heroHp[targetId] = Math.max(
        0,
        (s.heroHp[targetId] || 0) - damage
      );

      showDamage(`-${damage}`, "party");

      log(
        `${s.enemy ? s.enemy.name : "The enemy"} hits ` +
        `${HEROES[targetId].name} for ${damage} damage.`
      );
    }

    if (livingHeroes().length === 0) {
      partyWiped();
    }

    render();
    save();
  }

  // ==========================================
  // CAVE 9 SPECIAL ATTACK
  // ==========================================

  function crownfallRupture() {
    if (!s.enemy || !s.enemy.boss || s.enemy.regionIndex !== 8) {
      return;
    }

    s.enemy.isCrownfallRupture = true;

    const damage = Math.floor(
      s.enemy.damage * 1.75 +
      s.region * 3
    );

    log("THE CROWN DEVOURER UNLEASHES CROWNFALL RUPTURE!");

    announce(
      "Warning! Crownfall Rupture is striking the entire party!"
    );

    toast("CROWNFALL RUPTURE!");

    applyPartyDamage(damage, true);

    if (s.enemy) {
      s.enemy.isCrownfallRupture = false;
    }

    render();
    save();
  }

  // ==========================================
  // ENEMY ATTACKS AND ANTI-MAGIC BARRIER
  // ==========================================

  function updateAntiMagicBarrier() {
    if (!s.enemy || !s.enemy.boss || s.enemy.regionIndex !== 8) {
      if (s.enemy) {
        s.enemy.antiMagicBarrierActive = false;
        s.enemy.restrictedSkills = [];
      }

      return;
    }

    const now = Date.now();

    if (
      s.enemy.antiMagicBarrierActive &&
      now >= s.enemy.antiMagicUntil
    ) {
      s.enemy.antiMagicBarrierActive = false;
      s.enemy.restrictedSkills = [];

      s.enemy.nextAntiMagicAt = now + 12000;

      log("The Crown Devourer's Anti-Magic Barrier has faded.");
      toast("ANTI-MAGIC BARRIER DISMISSED");
    }

    if (
      !s.enemy.antiMagicBarrierActive &&
      now >= s.enemy.nextAntiMagicAt
    ) {
      s.enemy.antiMagicBarrierActive = true;
      s.enemy.antiMagicUntil = now + 6500;

      s.enemy.restrictedSkills = [
        "burst",
        "meteor",
        "frost",
        "heal",
        "phoenix"
      ];

      log("The Crown Devourer raises its Anti-Magic Barrier!");
      toast("ANTI-MAGIC BARRIER ACTIVE");
    }
  }

  function enemyAttack() {
    if (!s.enemy || battleLocked()) return;

    const enemy = s.enemy;

    if (
      enemy.boss &&
      enemy.regionIndex === 8 &&
      bossSpecialClock >= 14
    ) {
      bossSpecialClock = 0;
      crownfallRupture();
      return;
    }

    const damage = enemy.damage;

    // Normal attacks are single-target and can be reduced by Barrier.
    applyPartyDamage(damage, false);

    render();
    save();
  }

  // ==========================================
  // AUTOMATIC BATTLE UPDATE
  // ==========================================

  function partyAttack() {
    if (!s.enemy || battleLocked()) return;

    const enemy = s.enemy;
    const living = livingHeroes();

    if (!living.length) {
      partyWiped();
      return;
    }

        triggerPartyAttackAnimations();

    let damage = 0;

    living.forEach((id) => {
      const hero = HEROES[id];

      damage += hero.damage;

      if (
        s.critLevel > 0 &&
        Math.random() < s.critLevel * 0.05
      ) {
        damage += hero.damage;
      }
    });

    damage +=
      s.damageLevel * 4 +
      (s.recruits.includes("darius") ? 6 : 0);

    damage *= partyUpgradeMultiplier();

    if (s.recruits.includes("silas")) {
      damage *= 1.15;
    }

    if (s.partyBuffUntil > Date.now()) {
      damage *= 1.25;
    }

    damage = Math.max(1, Math.floor(damage));

    enemy.hp = Math.max(0, enemy.hp - damage);

    
    // Trigger the attack animation and display the damage.
    showDamage(`-${damage}`, "enemy");
    enemyHitEffect();

    // Finish the enemy when its health reaches zero.
    if (enemy.hp <= 0) {
      defeatEnemy();
      return;
    }

    renderEnemy();
    save();
  }

  function showDamage(text, target = "enemy") {
    const parent =
      target === "party"
        ? document.querySelector(".party") ||
          $("partyStage") ||
          $("battleStage")
        : document.querySelector(".enemy") ||
          $("enemyStage") ||
          $("battleStage");

    if (!parent) return;

    const damage = document.createElement("span");

    // The existing stylesheet animates elements with class "damage".
    damage.className = "damage";
    damage.textContent = String(text);
    damage.setAttribute("aria-hidden", "true");

    damage.style.left =
      `${25 + Math.random() * 40}%`;

    damage.style.top =
      `${20 + Math.random() * 35}%`;

    parent.appendChild(damage);

    setTimeout(() => damage.remove(), 1000);
  }

  function updateCombat(delta) {
    if (!s.enemy || battleLocked()) return;

    updateAntiMagicBarrier();

    if (s.enemy && s.enemy.boss && s.enemy.regionIndex === 8) {
      bossSpecialClock += delta;
    }

    partyClock += delta;
    enemyClock += delta;

    if (partyClock >= pInterval()) {
      partyClock = 0;
      partyAttack();
    }

    if (!s.enemy) return;

    if (enemyClock >= eInterval()) {
      enemyClock = 0;
      enemyAttack();
    }
  }
  
  // ==========================================
  // SKILLS AND MANA
  // ==========================================

  function skill(key) {
    if (!(key in SKILL_MANA_COST)) return;

    if (!isSkillUnlocked(key)) {
      if (key === "barrier") {
        return toast("The Barrier skill remains sealed.");
      }

      if (key === "resist") {
        return toast("Resist has not been unlocked.");
      }

      return toast(`${key} is not unlocked yet.`);
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

    const requiresEnemy = [
      "slash",
      "burst",
      "meteor",
      "frost"
    ].includes(key);

    if (requiresEnemy && !s.enemy) {
      return toast("There is no enemy to target.");
    }

    if (
      ["heal", "phoenix"].includes(key) &&
      !s.heroes.includes("celeste") &&
      !s.heroes.includes("sage")
    ) {
      return toast("You need a healer in your party to use this skill.");
    }

    const antiMagicBlocked =
      isAntiMagicBarrierActive() &&
      isSkillSealed(key);

    const partyBarrierActive =
      s.partyBarrierUntil > Date.now();

    if (antiMagicBlocked && !partyBarrierActive) {
      return toast(
        `${key.toUpperCase()} is sealed by the Anti-Magic Barrier!`
      );
    }

    // Only skills actually sealed by Anti-Magic are weakened
    // when the party's Barrier permits their use.
    const antiMagicEffectiveness =
      antiMagicBlocked && partyBarrierActive ? 0.5 : 1;

    const manaCost = SKILL_MANA_COST[key];

    if (s.mana < manaCost) {
      return toast(`Not enough mana. Need ${manaCost}.`);
    }

    s.mana -= manaCost;

    const partyBonus = partyUpgradeMultiplier();

    const recruitBonus = s.recruits.includes("silas")
      ? 1.15
      : 1;

    const skillMultiplier =
      partyBonus *
      recruitBonus *
      antiMagicEffectiveness;

    const healingBonus = s.recruits.includes("elise")
      ? 1.2
      : 1;

    const startCooldown = (seconds) => {
      s.cooldowns[key] = seconds;
    };

    const damageEnemy = (amount) => {
      if (!s.enemy) return;

      const damage = Math.max(
        1,
        Math.floor(amount * skillMultiplier)
      );

      s.enemy.hp = Math.max(0, s.enemy.hp - damage);

      showDamage(`-${damage}`, "enemy");
      enemyHitEffect();

      log(
        `${key.toUpperCase()} deals ${fmt(damage)} damage.`
      );

      if (s.enemy.hp <= 0) {
        defeatEnemy();
      }
    };

    // RADIANT SLASH
    if (key === "slash") {
      damageEnemy(
        45 +
        s.pickaxe * 5 +
        s.region * 12
      );

      startCooldown(8);
    }

    // ARCANE BURST
    else if (key === "burst") {
      damageEnemy(72 + s.region * 20);

      startCooldown(14);
    }

    // AEGIS GUARD
    else if (key === "guard") {
      s.guardCharges = 2;

      startCooldown(12);

      log("Aegis Guard is ready to block two normal attacks.");
      toast("AEGIS GUARD ACTIVATED");
    }

    // HEALING WAVE
    else if (key === "heal") {
      let totalHealing = 0;

      livingHeroes().forEach((id) => {
        const hero = HEROES[id];

        const amount = Math.floor(
          35 *
          partyBonus *
          healingBonus *
          antiMagicEffectiveness
        );

        const before = s.heroHp[id];

        s.heroHp[id] = Math.min(
          hero.maxHp,
          before + amount
        );

        totalHealing += s.heroHp[id] - before;
      });

      startCooldown(18);

      log(`Healing Wave restores ${fmt(totalHealing)} party HP.`);
      toast(`Healing Wave restored ${fmt(totalHealing)} HP.`);
    }

    // METEOR STRIKE
    else if (key === "meteor") {
      damageEnemy(130 + s.region * 32);

      startCooldown(25);
    }

    // FROST BIND
    else if (key === "frost") {
      damageEnemy(65 + s.region * 14);

      if (s.enemy) {
        const duration = Math.floor(
          8000 * antiMagicEffectiveness
        );

        s.frostUntil = Date.now() + duration;

        log(
          `Frost Bind slows the enemy for ${fmt(duration / 1000)} seconds.`
        );
      }

      startCooldown(18);
    }

    // PHOENIX BLESSING
    else if (key === "phoenix") {
      const fallen = s.heroes.filter(
        (id) => (s.heroHp[id] || 0) <= 0
      );

      if (!fallen.length) {
        s.mana += manaCost;
        s.mana = Math.min(maxMana(), s.mana);

        return toast("No fallen heroes need revival.");
      }

      const target = fallen[0];

      s.heroHp[target] = Math.max(
        1,
        Math.floor(
          HEROES[target].maxHp *
          0.6 *
          skillMultiplier
        )
      );

      startCooldown(40);

      log(`${HEROES[target].name} returns to battle!`);
      toast(`${HEROES[target].name} revived!`);
    }

    // RESIST
    else if (key === "resist") {
      s.resistUntil = Date.now() + 6000;

      startCooldown(25);

      log("Resist protects the party for six seconds.");
      toast("RESIST ACTIVATED");
    }

    // BARRIER
    else if (key === "barrier") {
      s.partyBarrierUntil = Date.now() + 5000;

      startCooldown(22);

      log(
        "Barrier forms around the party for five seconds!"
      );

      toast("BARRIER ACTIVATED · 5 SECONDS");
    }

    render();
    save();
  }

  // ==========================================
  // MAXIMUM MANA UPGRADE
  // ==========================================

  function manaUpgradeCost() {
    return Math.floor(
      120 * Math.pow(1.8, s.manaLevel)
    );
  }

  function upgradeMaxMana() {
    if (s.manaLevel >= 5) {
      return toast("Maximum mana upgrade level reached.");
    }

    const cost = manaUpgradeCost();

    if (s.gold < cost) {
      return toast(`Not enough gold. Need ${fmt(cost)} gold.`);
    }

    s.gold -= cost;
    s.manaLevel++;

    // Each upgrade adds 25 to the maximum and grants
    // the newly acquired mana capacity immediately.
    s.mana = Math.min(
      maxMana(),
      s.mana + 25
    );

    log(
      `Maximum mana upgraded to ${fmt(maxMana())}.`
    );

    toast(`MAX MANA INCREASED TO ${fmt(maxMana())}!`);

    render();
    save();
  }

  function renderSkills() {
    document.querySelectorAll("[data-skill]").forEach((button) => {
      const key = button.dataset.skill;
      const cost = SKILL_MANA_COST[key];

      if (cost === undefined) return;

      const locked = !isSkillUnlocked(key);

      const healerRequired =
        ["heal", "phoenix"].includes(key) &&
        !s.heroes.includes("celeste") &&
        !s.heroes.includes("sage");

      const antiMagicBlocked =
        isAntiMagicBarrierActive() &&
        isSkillSealed(key);

      const barrierActive =
        s.partyBarrierUntil > Date.now();

      const sealed =
        antiMagicBlocked && !barrierActive;

      const needsEnemy = [
        "slash",
        "burst",
        "meteor",
        "frost"
      ].includes(key) && !s.enemy;

      button.disabled =
        locked ||
        healerRequired ||
        sealed ||
        battleLocked() ||
        !livingHeroes().length ||
        needsEnemy ||
        s.cooldowns[key] > 0 ||
        s.mana < cost;

      const label = $("cd-" + key);

      if (label) {
        if (locked || healerRequired) {
          label.textContent = "LOCKED";
        } else if (sealed) {
          label.textContent = "SEALED";
        } else if (s.cooldowns[key] > 0) {
          label.textContent = `${Math.ceil(s.cooldowns[key])}s`;
        } else if (s.mana < cost) {
          label.textContent = `NEED ${cost} M`;
        } else if (antiMagicBlocked && barrierActive) {
          label.textContent = `50% EFFECT · ${cost} M`;
        } else {
          label.textContent = `READY · ${cost} M`;
        }
      }
    });

    const manaLevel = $("manaLevel");
    const manaCost = $("manaUpgradeCost");
    const manaButton = $("manaUpgrade");

    if (manaLevel) {
      manaLevel.textContent = `Level ${s.manaLevel} / 5`;
    }

    if (manaCost) {
      manaCost.textContent = s.manaLevel >= 5
        ? "MAX"
        : `${fmt(manaUpgradeCost())} G`;
    }

    if (manaButton) {
      manaButton.disabled =
        s.manaLevel >= 5 ||
        s.gold < manaUpgradeCost();
    }
  }
  
  // ==========================================
  // CAVE 8: PERMANENT PARTY UPGRADE
  // ==========================================

  function activatePartyUpgrade() {
    if (s.partyUpgradeApplied) return;

    s.partyUpgradeApplied = true;

    applyPermanentHeroBoost();

    s.heroes.forEach((id) => {
      if (!HEROES[id]) return;

      s.heroHp[id] = Math.min(
        HEROES[id].maxHp,
        Math.ceil(
          (Number(s.heroHp[id]) || 0) *
          CK_PARTY_UPGRADE_MULTIPLIER
        )
      );
    });

    log(
      "PARTY UPGRADE! Maximum health, damage, skill effects, snack effects, and mining rewards increased by 20%."
    );

    toast("PARTY UPGRADE UNLOCKED · ALL STATS +20%");

    announce(
      "A permanent party upgrade is now active. Health, damage, skill effects, snack effects, and mining rewards are stronger."
    );

    render();
    save();
  }

  // ==========================================
  // HOSPITAL AND RECOVERY
  // ==========================================

  function partyWiped() {
    if (s.needsHospital || isRecovering()) return;

    const fallenEnemy = s.enemy
      ? s.enemy.name
      : "the enemy";

    s.enemy = null;
    s.bossMode = false;

    partyClock = 0;
    enemyClock = 0;
    supportClock = 0;

    s.needsHospital = true;
    s.healingUntil = 0;

    s.hospitalFee = Math.floor(
      400 +
      s.region * 300 +
      Math.floor(s.defeated / 10) * 100
    );

    clearTimeout(exploreTimer);

    log(
      `Every hero has fallen against ${fallenEnemy}. ` +
      `The hospital requires ${fmt(s.hospitalFee)} gold.`
    );

    announce(
      "The entire party has fallen. The hospital is ready to help. Battles are paused until treatment is complete."
    );

    toast("PARTY WIPED · HOSPITAL REQUIRED");

    render();
    save();
  }

  function payHospitalFee() {
    if (!s.needsHospital) {
      return toast("The hospital does not require payment.");
    }

    if (s.gold < s.hospitalFee) {
      return toast("You do not have enough gold for hospital treatment.");
    }

    s.gold -= s.hospitalFee;

    s.needsHospital = false;
    s.healingUntil = Date.now() + 60000;

    s.enemy = null;
    s.bossMode = false;

    log(
      `Hospital fee paid. The party will recover in 60 seconds.`
    );

    announce(
      "Hospital treatment has started. Your party will recover in one minute."
    );

    toast("TREATMENT STARTED · 60 SECONDS");

    render();
    save();
  }

  function completeRecovery() {
    if (s.needsHospital || !isRecovering()) return;

    if (s.healingUntil > Date.now()) return;

    s.healingUntil = 0;

    s.heroes.forEach((id) => {
      if (!HEROES[id]) return;

      s.heroHp[id] = HEROES[id].maxHp;
    });

    log("Hospital treatment complete. All party members are restored.");
    announce("Treatment is complete. The entire party is ready to return.");

    toast("PARTY FULLY RECOVERED");

    render();
    save();

    scheduleExplore();
  }

  // ==========================================
  // ENEMY DEFEAT AND REWARDS
  // ==========================================

  function defeatEnemy() {
    const enemy = s.enemy;

    if (!enemy) return;

    const goldReward = Math.floor(
      enemy.gold *
      partyUpgradeMultiplier()
    );

    const crystalReward = Math.floor(
      enemy.crystals *
      partyUpgradeMultiplier()
    );

    s.gold += goldReward;
    s.crystals += crystalReward;

    addCaveCrystalProgress(crystalReward);

    s.ore += enemy.boss
      ? 8
      : 1 + Math.floor(Math.random() * 3);

    s.defeated++;

    if (enemy.boss) {
      const clearedRegion = s.region;

      if (!s.bossDefeated.includes(clearedRegion)) {
        s.bossDefeated.push(clearedRegion);
      }

      log(
        `Guardian defeated! +${fmt(goldReward)} gold, ` +
        `+${fmt(crystalReward)} crystals, +${enemy.boss ? 8 : 0} ore.`
      );

      const rewardId = regions[clearedRegion].rewardHero;

      if (
        rewardId &&
        HEROES[rewardId] &&
        !s.heroes.includes(rewardId)
      ) {
        s.heroes.push(rewardId);

        s.heroHp[rewardId] = HEROES[rewardId].maxHp;

        const hero = HEROES[rewardId];

        log(`${hero.name} joined the party after the cave clear!`);

        toast(`NEW HERO JOINED: ${hero.name}!`);

        announce(
          `A new ally has joined your party: ${hero.name}.`
        );
      } else {
        toast("Guardian defeated! Cave cleared.");
      }

      // The fifth guardian can unlock Resist.
      if (clearedRegion === 4 && !s.resistUnlocked) {
        s.resistUnlocked = true;

        log("New skill unlocked: Resist.");
        announce("A new defensive skill has been unlocked: Resist.");
      }

      // Kingdom Autopilot unlocks when the sixth guardian falls.
      if (clearedRegion === 5 && !s.autoPilotUnlocked) {
        s.autoPilotUnlocked = true;

        log("Kingdom Autopilot unlocked.");
        announce("Kingdom Autopilot has been unlocked.");
        toast("KINGDOM AUTOPILOT UNLOCKED");
      }

      // Clearing the seventh guardian triggers the permanent
      // party upgrade while entering Cave 8.
      if (clearedRegion === 6) {
        activatePartyUpgrade();
      }

      if (clearedRegion < regions.length - 1) {
        s.region = clearedRegion + 1;

        s.caveCrystalProgress = 0;

        log(
          `A new passage has opened. Cave ${s.region + 1} is now accessible.`
        );

        // Do not reveal the new cave's name or guardian.
        announce(
          "The guardian has fallen. A previously sealed passage has opened. Its secrets remain undiscovered."
        );

        if (s.region === 9 && !s.barrierUnlocked) {
          s.barrierUnlocked = true;

          log(
            "A new skill has been unlocked: Barrier. It costs 75 mana and lasts five seconds."
          );

          announce(
            "A new defensive skill is available: Barrier. It costs 75 mana and lasts five seconds."
          );

          toast("NEW SKILL UNLOCKED: BARRIER");
        }
      } else {
        log("The final known guardian has fallen.");

        announce(
          "The final known guardian has fallen. The kingdom's deepest mystery remains."
        );
      }
    } else {
      log(
        `${enemy.name} defeated. +${fmt(goldReward)} gold and +${fmt(crystalReward)} crystals.`
      );

      toast(
        `Victory! +${fmt(goldReward)} gold · +${fmt(crystalReward)} crystals`
      );
    }

    s.enemy = null;
    s.bossMode = false;

    partyClock = 0;
    enemyClock = 0;
    supportClock = 0;
    bossSpecialClock = 0;
    antiMagicClock = 0;

    // Small recovery after a victory; fallen heroes stay down.
    livingHeroes().forEach((id) => {
      s.heroHp[id] = Math.min(
        HEROES[id].maxHp,
        (s.heroHp[id] || 0) + Math.floor(
          7 * partyUpgradeMultiplier()
        )
      );
    });

    render();
    save();

    scheduleExplore();
  }
  
  // ==========================================
  // SNACKS
  // ==========================================

  function renderSnacks() {
    const container =
      $("snackGrid") ||
      $("snacksList") ||
      $("snackList");

    if (!container) return;

    container.innerHTML = SNACKS.map((snack) => {
      const quantity = Math.max(
        0,
        Number(s.snacks[snack.id]) || 0
      );

      const canBuy = s.gold >= snack.cost;
      const canUse = quantity > 0 && !battleLocked();

      return `
        <article class="snack-card">
          <div class="snack-icon">${snack.icon}</div>
          <h3>${esc(snack.name)}</h3>
          <p>${esc(snack.desc)}</p>
          <small>Owned: ${quantity}</small>
          <div class="snack-buttons">
            <button data-action="buySnack"
                    data-id="${esc(snack.id)}"
                    ${canBuy ? "" : "disabled"}>
              Buy · ${fmt(snack.cost)} G
            </button>
            <button data-action="useSnack"
                    data-id="${esc(snack.id)}"
                    ${canUse ? "" : "disabled"}>
              Use
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function buySnack(id) {
    const snack = SNACKS.find((item) => item.id === id);

    if (!snack) return;

    if (battleLocked()) {
      return toast("Snack purchases are unavailable during recovery.");
    }

    if (s.gold < snack.cost) {
      return toast("Not enough gold for that snack.");
    }

    s.gold -= snack.cost;
    s.snacks[id] = (Number(s.snacks[id]) || 0) + 1;

    log(`Purchased ${snack.name}.`);
    toast(`${snack.name} purchased.`);

    render();
    save();
  }

  function useSnack(id) {
    const snack = SNACKS.find((item) => item.id === id);

    if (!snack) return;

    if (battleLocked()) {
      return toast("Snacks cannot be used during hospital recovery.");
    }

    if ((Number(s.snacks[id]) || 0) <= 0) {
      return toast("You don't have any of that snack.");
    }

    const living = livingHeroes();
    const partyBonus = partyUpgradeMultiplier();

    if (snack.effect === "revive" && !living.length) {
      return toast("At least one hero must be standing to use this snack.");
    }

    if (
      snack.effect !== "revive" &&
      snack.effect !== "ore" &&
      snack.effect !== "mana" &&
      snack.effect !== "manaBuff" &&
      !living.length
    ) {
      return toast("Your party needs hospital treatment.");
    }

    s.snacks[id]--;

    if (snack.effect === "healOne") {
      const target = living
        .slice()
        .sort((a, b) =>
          (s.heroHp[a] / HEROES[a].maxHp) -
          (s.heroHp[b] / HEROES[b].maxHp)
        )[0];

      if (target) {
        const healing = Math.floor(35 * partyBonus);

        s.heroHp[target] = Math.min(
          HEROES[target].maxHp,
          s.heroHp[target] + healing
        );

        log(
          `${HEROES[target].name} used Trail Rations.`
        );
      }
    }

    else if (snack.effect === "healAll") {
      living.forEach((id) => {
        const healing = Math.floor(24 * partyBonus);

        s.heroHp[id] = Math.min(
          HEROES[id].maxHp,
          s.heroHp[id] + healing
        );
      });

      log("Crystal Cake restored health to the party.");
    }

    else if (snack.effect === "buff") {
      // The Cave 8 upgrade increases snack effect duration.
      const duration = 20000 * partyBonus;

      s.partyBuffUntil = Math.max(
        Date.now(),
        s.partyBuffUntil || 0
      ) + duration;

      log(
        `Moonberries boost party damage for ${fmt(duration / 1000)} seconds.`
      );
    }

    else if (snack.effect === "ore") {
      s.ore += 4;
      log("Miner's Tea provided 4 ore.");
    }

    else if (snack.effect === "mana") {
      const amount = Math.floor(35 * partyBonus);

      s.mana = Math.min(
        maxMana(),
        s.mana + amount
      );

      log(`Etherberries restored ${fmt(amount)} mana.`);
    }

    else if (snack.effect === "manaBuff") {
      const duration = 30000 * partyBonus;

      s.manaBuffUntil = Math.max(
        Date.now(),
        s.manaBuffUntil || 0
      ) + duration;

      log(
        `Astral Tea boosted mana regeneration for ${fmt(duration / 1000)} seconds.`
      );
    }

    else if (snack.effect === "revive") {
      const fallen = s.heroes.filter(
        (heroId) => (s.heroHp[heroId] || 0) <= 0
      );

      if (!fallen.length) {
        s.snacks[id]++;
        return toast("No fallen heroes need reviving.");
      }

      const target = fallen[0];

      s.heroHp[target] = Math.max(
        1,
        Math.floor(HEROES[target].maxHp * 0.4)
      );

      log(`${HEROES[target].name} was revived by a Revive Snack.`);
      toast(`${HEROES[target].name} has returned!`);
    }

    toast(`${snack.name} used.`);

    render();
    save();
  }

  // ==========================================
  // RECRUITS
  // ==========================================

  function renderRecruits() {
    const container =
      $("recruitGrid") ||
      $("recruitsList") ||
      $("recruitList");

    if (!container) return;

    container.innerHTML = RECRUITS.map((recruit) => {
      const owned = s.recruits.includes(recruit.id);
      const canBuy = s.gold >= recruit.cost;

      return `
        <article class="recruit-card">
          <img src="${esc(recruit.portrait)}"
               alt="${esc(recruit.name)}"
               loading="lazy">
          <h3>${esc(recruit.name)}</h3>
          <small>${esc(recruit.role)}</small>
          <p>${esc(recruit.desc)}</p>

          <button data-action="buyRecruit"
                  data-id="${esc(recruit.id)}"
                  ${owned || !canBuy || battleLocked() ? "disabled" : ""}>
            ${owned ? "Hired" : `Hire · ${fmt(recruit.cost)} G`}
          </button>
        </article>
      `;
    }).join("");
  }

  function buyRecruit(id) {
    const recruit = RECRUITS.find(
      (item) => item.id === id
    );

    if (!recruit) return;

    if (battleLocked()) {
      return toast("Recruitment is unavailable during recovery.");
    }

    if (s.recruits.includes(id)) {
      return toast(`${recruit.name} is already working for you.`);
    }

    if (s.gold < recruit.cost) {
      return toast("Not enough gold to hire this recruit.");
    }

    s.gold -= recruit.cost;
    s.recruits.push(id);

    if (id === "iris") {
      s.mana = Math.min(
        maxMana(),
        s.mana + 25
      );
    }

    log(`${recruit.name} joined the kingdom workforce.`);
    toast(`${recruit.name} hired!`);

    render();
    save();
  }

  // ==========================================
  // UPGRADES
  // ==========================================

  function upgradePickaxe() {
    if (battleLocked()) {
      return toast("Upgrades are unavailable during recovery.");
    }

    if (s.pickaxe >= 10) {
      return toast("Your pickaxe is already at maximum level.");
    }

    const cost = pickCost();

    if (s.gold < cost) {
      return toast(`Not enough gold. Need ${fmt(cost)}.`);
    }

    s.gold -= cost;
    s.pickaxe++;

    log(`Pickaxe upgraded to level ${s.pickaxe}.`);
    toast(`PICKAXE LEVEL ${s.pickaxe}`);

    render();
    save();
  }

  function upgradeSpeed() {
    if (battleLocked()) {
      return toast("Upgrades are unavailable during recovery.");
    }

    if (s.speedLevel >= 5) {
      return toast("Mining speed is already at maximum.");
    }

    const cost = speedCost();

    if (s.gold < cost) {
      return toast(`Not enough gold. Need ${fmt(cost)}.`);
    }

    s.gold -= cost;
    s.speedLevel++;

    log(`Mining speed upgraded to level ${s.speedLevel}.`);

    render();
    save();
  }

  function upgradeDamage() {
    if (battleLocked()) {
      return toast("Upgrades are unavailable during recovery.");
    }

    if (s.damageLevel >= 10) {
      return toast("Party damage is already at maximum.");
    }

    const cost = damageCost();

    if (s.gold < cost) {
      return toast(`Not enough gold. Need ${fmt(cost)}.`);
    }

    s.gold -= cost;
    s.damageLevel++;

    log(`Party damage upgraded to level ${s.damageLevel}.`);

    render();
    save();
  }

  function upgradeCrit() {
    if (battleLocked()) {
      return toast("Upgrades are unavailable during recovery.");
    }

    if (s.critLevel >= 8) {
      return toast("Critical chance is already at maximum.");
    }

    const cost = critCost();

    if (s.gold < cost) {
      return toast(`Not enough gold. Need ${fmt(cost)}.`);
    }

    s.gold -= cost;
    s.critLevel++;

    log(
      `Critical chance upgraded to ${s.critLevel * 5}%.`
    );

    render();
    save();
  }

  function renderUpgrades() {
    const values = [
      ["pickaxe", s.pickaxe, 10, pickCost()],
      ["speed", s.speedLevel, 5, speedCost()],
      ["damage", s.damageLevel, 10, damageCost()],
      ["crit", s.critLevel, 8, critCost()]
    ];

    values.forEach(([id, level, max, cost]) => {
      const levelEl = $(`${id}Level`);
      const costEl = $(`${id}Cost`);
      const button = $(`${id}Upgrade`);

      if (levelEl) {
        levelEl.textContent = `Level ${level} / ${max}`;
      }

      if (costEl) {
        costEl.textContent = level >= max
          ? "MAX"
          : `${fmt(cost)} G`;
      }

      if (button) {
        button.disabled =
          battleLocked() ||
          level >= max ||
          s.gold < cost;
      }
    });

    const manaLevelEl = $("manaLevel");
    const manaCostEl = $("manaUpgradeCost");
    const manaButton = $("manaUpgrade");

    if (manaLevelEl) {
      manaLevelEl.textContent = `Level ${s.manaLevel} / 5`;
    }

    if (manaCostEl) {
      manaCostEl.textContent = s.manaLevel >= 5
        ? "MAX"
        : `${fmt(manaUpgradeCost())} G`;
    }

    if (manaButton) {
      manaButton.disabled =
        battleLocked() ||
        s.manaLevel >= 5 ||
        s.gold < manaUpgradeCost();
    }
  }
  
  // ==========================================
  // PARTY DAMAGE: BARRIER AND RESIST
  // ==========================================

  function applyPartyDamage(amount, areaAttack = false) {
    const living = livingHeroes();

    if (!living.length) {
      partyWiped();
      return;
    }

    const barrierActive =
      s.partyBarrierUntil > Date.now();

    if (barrierActive && areaAttack) {
      log("Barrier completely blocked the area attack.");
      showDamage("AREA BLOCKED", "party");
      render();
      return;
    }

    let damage = Math.max(0, Math.floor(amount));

    if (barrierActive) {
      damage = Math.floor(damage * 0.25);
    }

    if (
      s.resistUntil > Date.now() &&
      typeof s.resistUntil === "number"
    ) {
      damage = Math.floor(damage * 0.5);
    }

    // Aegis Guard only blocks normal, single-target attacks.
    if (!areaAttack && s.guardCharges > 0) {
      s.guardCharges--;

      log("Aegis Guard blocked a normal attack.");
      showDamage("BLOCKED", "party");

      render();
      save();
      return;
    }

    if (areaAttack) {
      living.forEach((id) => {
        s.heroHp[id] = Math.max(
          0,
          (s.heroHp[id] || 0) - damage
        );

        showDamage(`-${damage}`, "party");
      });

      log(`An area attack hits the party for ${damage} damage each.`);
    } else {
      const target = living[
        Math.floor(Math.random() * living.length)
      ];

      s.heroHp[target] = Math.max(
        0,
        (s.heroHp[target] || 0) - damage
      );

      showDamage(`-${damage}`, "party");

      log(
        `${s.enemy ? s.enemy.name : "The enemy"} hits ` +
        `${HEROES[target].name} for ${damage} damage.`
      );
    }

    if (!livingHeroes().length) {
      partyWiped();
    }

    render();
    save();
  }

  // ==========================================
  // PASSIVE INCOME AND MANA REGENERATION
  // ==========================================

  function updatePassiveResources(delta) {
    if (battleLocked()) return;

    let goldRate = 0;
    let crystalRate = 0;

    if (s.recruits.includes("tessa")) goldRate += 0.8;
    if (s.recruits.includes("borin")) goldRate += 1.3;
    if (s.recruits.includes("kellan")) crystalRate += 0.3;

    const partyBonus = partyUpgradeMultiplier();

    s.gold += goldRate * delta * partyBonus;
    s.crystals += crystalRate * delta * partyBonus;

    s.mana = Math.min(
      maxMana(),
      s.mana + manaRate() * delta
    );
  }

  // ==========================================
  // ELOWEN: REVIVAL PASSIVE
  // ==========================================

  function updateElowenRevival() {
    if (
      !s.heroes.includes("elowen") ||
      !HEROES.elowen ||
      s.needsHospital
    ) {
      return;
    }

    const now = Date.now();

    const elowenFallen =
      (s.heroHp.elowen || 0) <= 0;

    // If Elowen falls, schedule her own return after 60 seconds.
    if (elowenFallen) {
      if (!s.elowenSelfReviveAt) {
        s.elowenSelfReviveAt = now + 60000;

        log("Elowen will attempt to revive herself after one minute.");
      }

      if (now >= s.elowenSelfReviveAt) {
        s.heroHp.elowen = Math.max(
          1,
          Math.floor(HEROES.elowen.maxHp * 0.35)
        );

        s.elowenSelfReviveAt = 0;

        log("Elowen has revived herself!");
        toast("ELOWEN RETURNS!");

        announce("Elowen has returned to the party.");
        render();
        save();
      }

      return;
    }

    // Elowen is standing again.
    s.elowenSelfReviveAt = 0;

    const fallen = s.heroes.filter(
      (id) =>
        id !== "elowen" &&
        (s.heroHp[id] || 0) <= 0
    );

    if (!fallen.length) {
      s.elowenNextReviveAt = 0;
      return;
    }

    if (!s.elowenNextReviveAt) {
      s.elowenNextReviveAt = now + 30000;
      return;
    }

    if (now < s.elowenNextReviveAt) return;

    const target = fallen[0];

    s.heroHp[target] = Math.max(
      1,
      Math.floor(HEROES[target].maxHp * 0.4)
    );

    s.elowenNextReviveAt = now + 30000;

    log(`${HEROES[target].name} was revived by Elowen.`);
    toast(`${HEROES[target].name} REVIVED BY ELOWEN`);

    announce(`${HEROES[target].name} has been revived.`);

    render();
    save();
  }

  // ==========================================
  // AUTOPILOT CONTROLS
  // ==========================================

  function activateBattleAutopilot() {
    if (battleLocked()) {
      return toast("Autopilot cannot start during recovery.");
    }

    if (!livingHeroes().length) {
      return toast("Your party has fallen.");
    }

    battleAutoPilot = true;

    log("Battle Autopilot activated.");
    toast("BATTLE AUTOPILOT ACTIVE");

    render();
    save();
  }

  function activateKingdomAutopilot() {
    if (!s.autoPilotUnlocked) {
      return toast("Kingdom Autopilot is still locked.");
    }

    if (battleLocked()) {
      return toast("Autopilot cannot start during recovery.");
    }

    if (!livingHeroes().length) {
      return toast("Your party has fallen.");
    }

    kingdomAutoPilot = true;
    battleAutoPilot = true;

    log("Kingdom Autopilot activated.");
    toast("KINGDOM AUTOPILOT ACTIVE");

    announce(
      "Kingdom Autopilot is online. I'll manage exploration, mining, and affordable upgrades."
    );

    render();
    save();
  }

  function stopAutopilot() {
    battleAutoPilot = false;
    kingdomAutoPilot = false;

    battlePilotClock = 0;
    kingdomMineClock = 0;
    kingdomManagementClock = 0;
    kingdomRecruitClock = 0;
    kingdomUpgradeClock = 0;

    log("Autopilot stopped.");
    toast("AUTOPILOT OFF");

    render();
    save();
  }

  // ==========================================
  // AUTOPILOT DECISIONS
  // ==========================================

  function autopilotStep(delta) {
    if (!autopilotActive() || battleLocked()) return;

    battlePilotClock += delta;

    if (battlePilotClock < 1.25) return;

    battlePilotClock = 0;

    if (!livingHeroes().length) return;

    // Recover a damaged party when the healer is available.
    const living = livingHeroes();

    const hasInjuredHero = living.some(
      (id) =>
        s.heroHp[id] < HEROES[id].maxHp * 0.65
    );

    if (
      hasInjuredHero &&
      s.heroes.some((id) => id === "celeste" || id === "sage") &&
      s.cooldowns.heal <= 0 &&
      s.mana >= SKILL_MANA_COST.heal &&
      isSkillUnlocked("heal") &&
      !isSkillSealed("heal")
    ) {
      skill("heal");
      return;
    }

    if (!s.enemy) {
      if (kingdomAutoPilot) {
        kingdomMineClock += 1.25;

        if (kingdomMineClock >= 5) {
          kingdomMineClock = 0;

          const crystals = Math.floor(
            (4 + s.pickaxe * 2) *
            partyUpgradeMultiplier()
          );

          s.crystals += crystals;
          s.gold += Math.floor(3 * partyUpgradeMultiplier());
          s.ore += 1;

          addCaveCrystalProgress(crystals);

          log(`Autopilot mined ${crystals} crystals.`);
          render();
          save();
        }

        kingdomManagementClock += 1.25;

        if (kingdomManagementClock >= 8) {
          kingdomManagementClock = 0;

          // Choose a useful upgrade when it is affordable.
          if (
            s.damageLevel < 10 &&
            s.gold >= damageCost()
          ) {
            upgradeDamage();
            return;
          }

          if (
            s.pickaxe < 10 &&
            s.gold >= pickCost()
          ) {
            upgradePickaxe();
            return;
          }

          if (
            s.speedLevel < 5 &&
            s.gold >= speedCost()
          ) {
            upgradeSpeed();
            return;
          }
        }
      }

      scheduleExplore();
      return;
    }

    if (!s.enemy) return;

    // Use defensive Barrier during a dangerous boss fight.
    if (
      s.barrierUnlocked &&
      s.cooldowns.barrier <= 0 &&
      s.mana >= SKILL_MANA_COST.barrier &&
      s.enemy.boss &&
      s.enemy.regionIndex === 8 &&
      bossSpecialClock >= 9
    ) {
      skill("barrier");
      return;
    }

    // Prefer powerful attacks when the enemy's Anti-Magic
    // restriction does not block the skill.
    const offensiveSkills = [
      "meteor",
      "burst",
      "frost",
      "slash"
    ];

    for (const key of offensiveSkills) {
      if (
        isSkillUnlocked(key) &&
        s.cooldowns[key] <= 0 &&
        s.mana >= SKILL_MANA_COST[key] &&
        !isSkillSealed(key)
      ) {
        skill(key);
        return;
      }
    }
  }

  // ==========================================
  // MAIN GAME TICK
  // ==========================================

  function gameTick() {
    const now = performance.now();

    const delta = Math.max(
      0,
      Math.min(1, (now - lastTick) / 1000)
    );

    lastTick = now;

    if (isGameplayPaused()) return;

    if (
      !s.needsHospital &&
      s.healingUntil > 0 &&
      now >= 0 &&
      Date.now() >= s.healingUntil
    ) {
      completeRecovery();
    }

    // Cooldowns continue to tick outside active battles,
    // but nothing progresses during hospital recovery.
    Object.keys(s.cooldowns).forEach((key) => {
      s.cooldowns[key] = Math.max(
        0,
        (Number(s.cooldowns[key]) || 0) - delta
      );
    });

    if (!s.needsHospital && !isRecovering()) {
      updatePassiveResources(delta);
      updateElowenRevival();

      if (s.enemy) {
        updateCombat(delta);
      } else {
        partyClock = 0;
        enemyClock = 0;
      }

      autopilotStep(delta);
    }

    renderClock += delta;

    if (renderClock >= 0.5) {
      renderClock = 0;
      render();
      save();
    }
  }
  
  // ==========================================
  // DYNAMIC BARRIER SKILL BUTTON
  // ==========================================

  function ensureBarrierSkillButton() {
    let button = document.querySelector('[data-skill="barrier"]');

    if (button) {
      button.hidden = !s.barrierUnlocked;
      return button;
    }

    const firstSkill = document.querySelector("[data-skill]");
    const container =
      $("skillsGrid") ||
      $("skillGrid") ||
      $("skillButtons") ||
      $("skillsList") ||
      firstSkill?.parentElement;

    if (!container) return null;

    button = document.createElement("button");
    button.type = "button";
    button.id = "barrierSkillButton";
    button.className = "skill-button barrier-skill";
    button.dataset.skill = "barrier";
    button.hidden = !s.barrierUnlocked;

    button.innerHTML = `
      <span class="skillicon">◇</span>
      <span class="skill-name">Barrier</span>
      <small id="cd-barrier">LOCKED</small>
    `;

    container.appendChild(button);

    return button;
  }

  // Ensure the dynamically added Barrier skill appears in the skill list.
  const renderSkillsBase = renderSkills;

  renderSkills = function () {
    ensureBarrierSkillButton();
    renderSkillsBase();

    const barrierButton =
      document.querySelector('[data-skill="barrier"]');

    if (barrierButton) {
      barrierButton.hidden = !s.barrierUnlocked;
    }
  };

  // ==========================================
  // DYNAMIC MAX MANA UPGRADE CARD
  // ==========================================

  function ensureManaUpgradeCard() {
    if ($("manaUpgrade")) return;

    const existingUpgrade =
      $("pickaxeUpgrade") ||
      $("speedUpgrade") ||
      $("damageUpgrade");

    const container =
      $("upgradeGrid") ||
      $("upgradesGrid") ||
      $("upgrades") ||
      $("upgradePanel") ||
      document.querySelector(".upgrade-grid") ||
      document.querySelector(".upgrades-grid") ||
      existingUpgrade?.parentElement?.parentElement;

    if (!container) return;

    const card = document.createElement("article");

    card.className = "upgrade-card mana-upgrade-card";
    card.id = "manaUpgradeCard";

    card.innerHTML = `
      <div class="upgrade-icon">✧</div>
      <h3>Mana Capacity</h3>
      <p>Increase maximum mana by 25 per upgrade.</p>
      <small id="manaLevel">Level 0 / 5</small>
      <div id="manaUpgradeCost">120 G</div>
      <button type="button" id="manaUpgrade">
        Upgrade Mana
      </button>
    `;

    container.appendChild(card);
  }

  // ==========================================
  // CREATE THE PARTY BARRIER VISUAL
  // ==========================================

  function ensureBarrierVisual() {
    let visual = $("partyBarrierVisual");

    if (visual) return visual;

    const stage =
      $("partyStage") ||
      $("battleStage") ||
      $("enemyStage") ||
      $("battleArena");

    if (!stage) return null;

    // The CSS uses absolute positioning within the battle scene.
    if (getComputedStyle(stage).position === "static") {
      stage.style.position = "relative";
    }

    visual = document.createElement("div");
    visual.id = "partyBarrierVisual";
    visual.className = "party-barrier-visual";
    visual.hidden = true;
    visual.setAttribute("aria-hidden", "true");

    visual.innerHTML = `
      <span class="party-barrier-label">
        BARRIER · <span id="partyBarrierTimer">5.0s</span>
      </span>
    `;

    stage.appendChild(visual);

    return visual;
  }

  // ==========================================
  // RESET GAME
  // ==========================================

  
  function resetGame() {
    const confirmed = window.confirm(
      "Reset Crystal Kingdom? All saved game progress will be erased."
    );

    if (!confirmed) return;

    clearTimeout(exploreTimer);
    clearTimeout(toastTimer);
    clearTimeout(commandIdleTimer);
    clearTimeout(recognitionRestartTimer);
    clearTimeout(unlockRevealTimer);
    clearTimeout(analistRevealTimer);
    clearTimeout(resistRevealTimer);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {}
    }

    try {
      // Remove the current and previous known save keys.
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(OLD_SAVE_KEY);

      // Also clear older game-save keys, but preserve music
      // settings and other preferences.
      const keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (!key) continue;

        const isGameKey =
          /gem.?miner|crystal.?kingdom/i.test(key);

        const isPreference =
          /music|volume|voice|sage/i.test(key);

        if (isGameKey && !isPreference) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Could not clear saved progress:", error);
      toast("Could not reset the save. Check browser storage permissions.");
      return;
    }

    // Reload so old in-memory upgrades, timers, and stats
    // cannot survive the reset.
    window.location.reload();
  }
  // ==========================================
  // CONNECT BUTTONS
  // ==========================================

  function dispatchAction(action, id) {
    switch (action) {
      case "toggleMusic":
        toggleMusic();
        break;

      case "mine":
      case "mineNow":
        mine();
        break;

      case "explore":
      case "exploreNow":
        exploreNow();
        break;

      case "challengeGuardian":
      case "boss":
        challengeGuardian();
        break;

      case "upgradePickaxe":
        upgradePickaxe();
        break;

      case "upgradeSpeed":
        upgradeSpeed();
        break;

      case "upgradeDamage":
        upgradeDamage();
        break;

      case "upgradeCrit":
        upgradeCrit();
        break;

      case "upgradeMaxMana":
      case "upgradeMana":
        upgradeMaxMana();
        break;

      case "payHospitalFee":
      case "payHeal":
        payHospitalFee();
        break;

      case "activateBattleAutopilot":
      case "battleAutopilot":
        activateBattleAutopilot();
        break;

      case "activateKingdomAutopilot":
      case "kingdomAutopilot":
        activateKingdomAutopilot();
        break;

      case "stopAutopilot":
        stopAutopilot();
        break;

      case "toggleSage":
        toggleSage();
        break;

      case "toggleVoice":
        setVoiceEnabled(!sageEnabled);
        break;

      case "talkToSage":
      case "sageCommand":
        if (commandModeActive) {
          leaveCommandMode();
        } else {
          enterCommandMode();
        }
        break;

      case "buySnack":
        buySnack(id);
        break;

      case "useSnack":
        useSnack(id);
        break;

      case "buyRecruit":
        buyRecruit(id);
        break;

            case "resetGame":
      case "reset":
      case "reset-save":
      case "resetSave":
      case "resetProgress":
        resetGame();
        break;
      default:
        return false;
    }

    return true;
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(
        "button, [data-action], [data-skill]"
      );

      if (!button) return;

      // Keep an existing inline click handler from firing twice.
      // Inline handlers can call the public functions exposed below.
      if (button.hasAttribute("onclick")) return;

      if (button.dataset.skill) {
        event.preventDefault();
        skill(button.dataset.skill);
        return;
      }

      const action = button.dataset.action;

      if (action) {
        event.preventDefault();

        dispatchAction(
          action,
          button.dataset.id
        );

        return;
      }

      // Support common existing HTML button IDs.
      const idActions = {
        musicToggle: "toggleMusic",
        mineBtn: "mine",
        mineButton: "mine",
        exploreBtn: "explore",
        exploreButton: "explore",
        bossBtn: "challengeGuardian",
        guardianBtn: "challengeGuardian",
        pickaxeUpgrade: "upgradePickaxe",
        speedUpgrade: "upgradeSpeed",
        damageUpgrade: "upgradeDamage",
        critUpgrade: "upgradeCrit",
        manaUpgrade: "upgradeMaxMana",
        payHealBtn: "payHospitalFee",
        sageCommandButton: "talkToSage",
        sageVoiceToggle: "toggleVoice",
        sageBattleAutoButton: "activateBattleAutopilot",
        sageKingdomAutoButton: "activateKingdomAutopilot",
        resetButton: "resetGame",
        resetBtn: "resetGame",
        resetSave: "resetGame",
        resetSaveBtn: "resetGame",
        resetProgressBtn: "resetGame"
      };

      const mappedAction = idActions[button.id];

      if (mappedAction) {
        event.preventDefault();
        dispatchAction(mappedAction);
      }
    });

    const volume = $("musicVolume");

    if (volume) {
      volume.addEventListener("input", () => {
        updateMusicControl();
      });
    }

    const music = $("backgroundMusic");

    if (music) {
      music.addEventListener("play", updateMusicControl);
      music.addEventListener("pause", updateMusicControl);
      music.addEventListener("ended", () => {
        if (musicEnabled) startBackgroundMusic();
      });
    }

    document.addEventListener("visibilitychange", () => {
      lastTick = performance.now();

      if (!document.hidden) {
        render();
        updateMusicControl();
      }
    });

    window.addEventListener("beforeunload", save);
  }

  // ==========================================
  // MUSIC ELEMENT
  // ==========================================

  function ensureMusicElement() {
    let audio = $("backgroundMusic");

    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "backgroundMusic";
      audio.preload = "auto";

      document.body.appendChild(audio);
    }

    audio.loop = true;
    audio.preload = "auto";

    return audio;
  }

  // ==========================================
  // GLOBAL FUNCTIONS FOR EXISTING HTML
  // ==========================================

  // These are available to any existing inline onclick attributes.
  Object.assign(window, {
    mine,
    exploreNow,
    challengeGuardian,
    skill,
    upgradePickaxe,
    upgradeSpeed,
    upgradeDamage,
    upgradeCrit,
    upgradeMaxMana,
    payHospitalFee,
    buySnack,
    useSnack,
    buyRecruit,
    activateBattleAutopilot,
    activateKingdomAutopilot,
    stopAutopilot,
    toggleMusic,
    toggleSage,
    resetGame,
    setVoiceEnabled
  });

  // ==========================================
  // INITIALIZE CRYSTAL KINGDOM
  // ==========================================

  function initCrystalKingdom() {
    if (window.__crystalKingdomInitialized) return;

    window.__crystalKingdomInitialized = true;

    ensureMusicElement();
    ensureBarrierVisual();
    ensureBarrierSkillButton();
    ensureManaUpgradeCard();

    bindEvents();

    // Preserve the permanent Cave 8 upgrade.
    if (
      s.partyUpgradeApplied &&
      !permanentHeroBoostApplied
    ) {
      applyPermanentHeroBoost();
    }

    // Update the mana value if the maximum has increased.
    s.mana = Math.min(maxMana(), s.mana);

    render();
    updateMusicScene();
    updateMusicControl();

    // Browsers may block autoplay until the player interacts.
    // The Play Music button remains available if that happens.
    if (musicEnabled) {
      startBackgroundMusic();
    }

    // Start voice recognition where supported. Browsers that
    // require microphone permission will report the appropriate status
    if (SpeechRecognitionAPI && recognitionEnabled) {
      startRecognition();
    } else if (!SpeechRecognitionAPI) {
      updateSageStatus("VOICE RECOGNITION UNAVAILABLE");
    }

    lastTick = performance.now();

    window.setInterval(gameTick, 100);

    scheduleExplore();

    log("Crystal Kingdom ready. Your next destination remains a mystery.");
    save();

    console.info("Mining Crystal Kingdom initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initCrystalKingdom,
      { once: true }
    );
  } else {
    initCrystalKingdom();
  }

})();