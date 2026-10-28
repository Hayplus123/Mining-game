(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = "gemMinerCrystalKingdom_v3";
  const OLD_SAVE_KEY = "gemMinerCrystalKingdom_v2";
  let resettingGame = false;
  let sageHealthCheckClock = 0;
  let hospitalPromptShown = false;

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
    tessa_hero: {
      name: "Tessa",
      role: "Miner Vanguard · Front line",
      portrait: "assets/tessa.webp",
      maxHp: 132,
      damage: 16,
      tagline: "A stubborn delver who keeps moving when the tunnels turn dangerous."
    },
    borin_hero: {
      name: "Borin",
      role: "Stoneguard · Front line",
      portrait: "assets/borin.webp",
      maxHp: 154,
      damage: 15,
      tagline: "A steadfast guardian who can hold the line against heavy enemies."
    },
    iris_hero: {
      name: "Iris",
      role: "Mystic · Arcane DPS",
      portrait: "assets/hero-mage.svg",
      maxHp: 108,
      damage: 21,
      tagline: "Shapes the strange magic discovered in the deeper caves."
    },
    darius_hero: {
      name: "Darius",
      role: "Crossbowman · Ranged DPS",
      portrait: "assets/darius.webp",
      maxHp: 120,
      damage: 22,
      tagline: "A precise crossbow shot can turn a dangerous fight around."
    },
    elise_hero: {
      name: "Elise",
      role: "Spirit Guide · Support",
      portrait: "assets/elise.webp",
      maxHp: 124,
      damage: 12,
      tagline: "A calm guide who channels restorative spirit energy."
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
    "tessa_hero",
    "borin_hero",
    "darius_hero",
    "seraphine",
    "liria",
    "celeste",
    "iris_hero",
    "sage",
    "elise_hero",
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
      rewardHero: "tessa_hero"
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
      rewardHero: "borin_hero"
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
      rewardHero: "iris_hero"
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
      rewardHero: "darius_hero"
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
    rewardHero: "elise_hero"
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

    state.autoPilotUnlocked = Boolean(state.autoPilotUnlocked) || state.region >= 6;
    state.raphaelEvolved = Boolean(state.raphaelEvolved);
    state.resistUnlocked = Boolean(state.resistUnlocked) || state.region >= 5 || state.bossDefeated.includes(4);

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

    if (state.needsHospital) {
      state.enemy = null;
      state.bossMode = false;
    }

    state.enemy = state.enemy && typeof state.enemy === "object"
      ? state.enemy
      : null;

    state.discoveredGuardians = Array.isArray(state.discoveredGuardians)
      ? state.discoveredGuardians
      : [];

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
      src: "assets/exploring.wav",
      label: "Exploration theme"
    },
    fighting: {
      src: "assets/fighting.wav",
      label: "Battle theme"
    },
    intense: {
      src: "assets/intense.wav",
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
    if (key === "analist") return isAnalistUnlocked();
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
      !["resist", "barrier"].includes(key) &&
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
    if (resettingGame) return;
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
    const text = normalizeVoiceText(transcript);
    if (!text) return;
    if (Date.now() < ignoreRecognitionUntil) return;

    const wakePattern = assistantWakePattern();
    const wakeMatch = wakePattern.exec(text);

    if (!commandModeActive) {
      if (!wakeMatch) return;
      const remainder = text.slice(wakeMatch.index + wakeMatch[0].length)
        .replace(/^[,.:;!? -]+/, "").trim();
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

        const hp = Math.max(0, Math.min(hero.maxHp, Number(s.heroHp[id]) || 0));
        const percentage = hero.maxHp ? hp / hero.maxHp * 100 : 0;
        const fallen = hp <= 0;

        return `
          <article class="${fallen ? "is-fallen" : ""}">
            <div class="portrait">
              <img src="${esc(hero.portrait)}" alt="${esc(hero.name)}" loading="lazy">
            </div>
            <div class="companion-info">
              <b>${esc(hero.name)}</b>
              <small>${esc(hero.role)}</small>
              <small>${fmt(hp)} / ${fmt(hero.maxHp)} HP</small>
              <div class="minibar"><i style="width:${percentage}%"></i></div>
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
    if (power) power.textContent = `POWER ${fmt(totalPartyDamage())}`;

    const attackLabel = $("partyAttackLabel");
    if (attackLabel) attackLabel.textContent = `Attack interval: ${pInterval().toFixed(1)}s`;

    const fieldParty = $("battleParty");
    if (!fieldParty) return;

    fieldParty.classList.add("party");
    const validIds = s.heroes.filter((id) => HEROES[id]);
    const livingOrder = validIds.filter((id) => (Number(s.heroHp[id]) || 0) > 0);
    const fallenOrder = validIds.filter((id) => (Number(s.heroHp[id]) || 0) <= 0).reverse();
    const displayOrder = [...livingOrder, ...fallenOrder];
    const frontRank = new Map(livingOrder.map((id, index) => [id, Math.min(index + 1, 8)]));

    const battleHTML = displayOrder.map((id) => {
      const hero = HEROES[id];
      const fallen = (Number(s.heroHp[id]) || 0) <= 0;
      const rank = frontRank.get(id) || 8;
      return `
        <div class="battle-hero front-rank-${rank} ${fallen ? "fallen" : ""}"
             data-hero-id="${esc(id)}"
             title="${esc(hero.name)} · ${fmt(s.heroHp[id] || 0)} / ${fmt(hero.maxHp)} HP">
          <img src="${esc(hero.portrait)}" alt="${esc(hero.name)}">
        </div>
      `;
    }).join("");

    if (fieldParty.dataset.renderCache !== battleHTML) {
      fieldParty.innerHTML = battleHTML;
      fieldParty.dataset.renderCache = battleHTML;
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
    if (typeof renderSageActions === "function") renderSageActions();
    if (typeof updateAutopilotStatusIndicators === "function") updateAutopilotStatusIndicators();
    updateMusicScene();
  }

  // ==========================================
  // ENEMY GENERATION
  // ==========================================

  let bossSpecialClock = 0;
  let antiMagicClock = 0;

  function createEnemyForRegion(index, boss = false) {
    const cave = regions[index] || regions[regions.length - 1];
    const scale = 1 + index * 0.25;
    const hp = boss
      ? cave.bossHp
      : Math.floor(cave.hp * (0.9 + Math.random() * 0.35));
    const damage = boss ? cave.bossDamage : cave.damage;

    return {
      name: boss ? cave.boss : cave.enemy,
      type: boss ? "CAVE GUARDIAN" : cave.type,
      hp,
      maxHp: hp,
      damage,
      gold: boss ? cave.gold * 8 : cave.gold,
      crystals: boss ? cave.crystals * 6 : cave.crystals,
      sprite: boss ? "assets/boss.svg" : cave.sprite,
      boss,
      regionIndex: index,
      specialName: index === 8 && boss ? "CROWNFALL RUPTURE" : "",
      areaAttackClock: 0,
      specialClock: 0,
      bossElapsed: 0,
      specialAttackClock: 0,
      uniqueAttack: boss && index === 8 ? "antiMagicBarrier" : null,
      antiMagicBarrierTriggered: false,
      antiMagicBarrierActive: false,
      antiMagicUntil: 0,
      barrierElapsed: 0,
      barrierActivatedAt: 0,
      barrierBlocked: false,
      resistUsed: false,
      resistPrepared: false,
      restrictedSkills: [],
      nextAntiMagicAt: Date.now() + 10000,
      scale,
      isCrownfallRupture: false
    };
  }

  function spawnEnemy(boss = false) {
    if (battleLocked() || isGameplayPaused() || !livingHeroes().length) return;
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
      playImportantSound();
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
      isGameplayPaused() || battleLocked() || s.enemy ||
      !livingHeroes().length || s.bossDefeated.includes(s.region)
    ) return;

    const delay = immediate ? 50 : Math.max(1200, 4500 - s.region * 220);
    exploreTimer = setTimeout(() => {
      if (isGameplayPaused() || battleLocked() || s.enemy || !livingHeroes().length) return;
      explore();
    }, delay);
  }

  function exploreNow() {
    if (battleLocked()) {
      toast(s.needsHospital ? "Pay the hospital fee first." : "The party is still recovering.");
      return;
    }
    if (!livingHeroes().length) return toast("Your party has fallen. Visit the hospital.");
    if (s.enemy) return toast("An enemy is already present.");
    clearTimeout(exploreTimer);
    explore();
  }

  // ==========================================
  // MINING
  // ==========================================

  function mine() {
  if (battleLocked()) return toast("Mining is unavailable during recovery.");
  const crystalBonus = s.recruits.includes("luna") ? 1.2 : 1;
  const partyBonus = partyUpgradeMultiplier();
  const amount = Math.max(1, Math.floor((4 + s.pickaxe * 2) * crystalBonus * partyBonus));
  const oreAmount = Math.floor((1 + Math.floor(s.pickaxe / 3) + (s.recruits.includes("juno") ? 1 : 0)) * partyBonus);
  const goldAmount = Math.max(1, Math.floor((2 + Math.floor(s.speedLevel / 2)) * partyBonus));
  s.crystals += amount;
  addCaveCrystalProgress(amount);
  s.ore += oreAmount;
  s.gold += goldAmount;
  log(`Mining yielded ${amount} crystals, ${oreAmount} ore, and ${goldAmount} gold.`);
  showDamage(`+${amount} ◆`, "party", true);
  toast(`Mined ${amount} crystals · +${oreAmount} ore · +${goldAmount} gold`);
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
    if (!living.length) return partyWiped();

    const barrierActive = s.partyBarrierUntil > Date.now();
    if (barrierActive && areaAttack) {
      log("Barrier completely blocked the area attack.");
      showDamage("AREA BLOCKED", "party");
      playSkillAnimation("barrier-block");
      render();
      save();
      return;
    }

    let damage = Math.max(0, Math.floor(amount));
    if (barrierActive && !areaAttack) {
      damage = Math.floor(damage * 0.25);
      log("Barrier reduced the incoming normal attack by 75%.");
    }
    if (Number(s.resistUntil) > Date.now()) damage = Math.floor(damage * 0.5);

    if (!areaAttack && s.guardCharges > 0) {
      s.guardCharges--;
      log("Aegis Guard blocked a normal attack.");
      showDamage("BLOCKED", "party");
      render();
      save();
      return;
    }

    if (areaAttack) {
      for (const id of living) {
        s.heroHp[id] = Math.max(0, (s.heroHp[id] || 0) - damage);
        showDamage(`-${damage}`, "party");
        if (s.heroHp[id] <= 0) playHeroFallenAnimation(id);
      }
      log(`An area attack hits the party for ${damage} damage each.`);
    } else {
      const targetId = living[Math.floor(Math.random() * living.length)];
      s.heroHp[targetId] = Math.max(0, (s.heroHp[targetId] || 0) - damage);
      showDamage(`-${damage}`, "party");
      log(`${s.enemy ? s.enemy.name : "The enemy"} hits ${HEROES[targetId].name} for ${damage} damage${s.heroHp[targetId] <= 0 ? " — hero down!" : "."}`);
      if (s.heroHp[targetId] <= 0) {
        playHeroFallenAnimation(targetId);
        if (livingHeroes().length) showPhoenixPrompt(targetId);
      }
    }

    if (!livingHeroes().length) partyWiped();
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
    playSkillAnimation("crownfall");

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
    const enemy = s.enemy;
    if (!enemy || !enemy.boss || enemy.regionIndex !== 8) return;

    enemy.uniqueAttack = "antiMagicBarrier";
    enemy.restrictedSkills = Array.isArray(enemy.restrictedSkills) ? enemy.restrictedSkills : [];

    if (!enemy.antiMagicBarrierTriggered && (Number(enemy.bossElapsed) || 0) >= getBarrierDelaySeconds()) {
      activateAntiMagicBarrier();
    }
  }

  function enemyAttack() {
    if (!s.enemy || battleLocked() || isGameplayPaused()) return;
    const enemy = s.enemy;

    if (enemy.boss && enemy.regionIndex === 7 && (Number(enemy.specialAttackClock) || 0) >= 12) {
      enemy.specialAttackClock = 0;
      enemyAreaAttack();
      return;
    }

    if (enemy.boss && enemy.regionIndex === 8 && bossSpecialClock >= 14) {
      bossSpecialClock = 0;
      crownfallRupture();
      return;
    }

    const amount = Math.max(1, Math.floor(enemy.damage * (0.82 + Math.random() * 0.36)));
    applyPartyDamage(amount, false);
    render();
    save();
  }

  // ==========================================
  // AUTOMATIC BATTLE UPDATE
  // ==========================================

  function partyAttack() {
  if (!s.enemy || battleLocked() || isGameplayPaused()) return;
  // Attack in the same order as the visible party formation: first recruited, first to the enemy.
  const active = livingHeroes();
  if (!active.length) return partyWiped();

  for (const id of active) {
    if (!s.enemy) break;
    const hero = HEROES[id];
    animateHeroAttack(id);

    let amount = hero.damage + (s.pickaxe - 1) * 2 + s.damageLevel * 4 +
      (s.recruits.includes("darius") ? 6 : 0);
    if (s.partyBuffUntil > Date.now()) amount *= 1.25;
    if (s.recruits.includes("silas")) amount *= 1.15;
    amount *= partyUpgradeMultiplier();

    const criticalChance = Math.min(0.5, s.critLevel * 0.05 + (id === "kael_rogue" ? 0.15 : 0));
    const critical = Math.random() < criticalChance;
    amount = Math.max(1, Math.floor(amount * (critical ? 1.8 : 1) * (0.88 + Math.random() * 0.24)));

    s.enemy.hp = Math.max(0, s.enemy.hp - amount);
    showDamage(`${critical ? "CRIT " : ""}-${amount}`, "enemy");
    if (critical) playSkillAnimation("critical");
    enemyHitEffect();

    if (s.enemy.hp <= 0) {
      defeatEnemy();
      return;
    }
  }

  renderEnemy();
  save();
}


  function updateCombat(delta) {
    if (!s.enemy || battleLocked() || isGameplayPaused()) return;

    if (s.enemy.boss) {
      s.enemy.bossElapsed = (Number(s.enemy.bossElapsed) || 0) + delta;
      s.enemy.specialAttackClock = (Number(s.enemy.specialAttackClock) || 0) + delta;
    }
    if (s.enemy.antiMagicBarrierActive) {
      s.enemy.barrierElapsed = (Number(s.enemy.barrierElapsed) || 0) + delta;
    }

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
    if (isGameplayPaused()) return;
    if (key === "analist") {
      if (!isAnalistUnlocked()) return toast("That ability is not available yet.");
      if (pendingAnalistApproval) return answerAnalistPrompt(true);
      return startAnalistAnalysis();
    }
    if (key === "resist") return castResist();
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

    const antiMagicBlocked = isSkillSealed(key);

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
    playSkillAnimation(key);

    const partyBonus = partyUpgradeMultiplier();

    const recruitBonus = s.recruits.includes("silas")
      ? 1.15
      : 1;

    const skillMultiplier =
      partyBonus *
            s.bossMode = false;
      partyClock = 0;
      enemyClock = 0;
      supportClock = 0;
    }

    render();
    save();

    // Raphael evolves after Kingdom Autopilot unlocks.
    if (unlocks.some((item) => item.title === "Kingdom Autopilot") && !s.raphaelEvolved) {
      setTimeout(triggerRaphaelEvolution, 1200);
    }

    if (unlocks.length) {
      queueUnlockReveal(unlocks);
    }

    scheduleExplore();
  }

  // ==========================================
  // PASSIVE RESOURCE AND HERO SUPPORT EFFECTS
  // ==========================================

  function updatePassiveResources(delta) {
    if (battleLocked() || isGameplayPaused()) return;

    const income =
      (s.recruits.includes("tessa") ? 0.8 : 0) +
      (s.recruits.includes("borin") ? 1.3 : 0);

    if (income > 0) {
      s.gold += income * delta;
    }

    if (s.recruits.includes("kellan")) {
      s.crystals += 0.3 * delta;
    }

    const previousMana = s.mana;
    s.mana = Math.min(
      maxMana(),
      s.mana + manaRate() * delta
    );

    if (previousMana < maxMana() && s.mana >= maxMana()) {
      s.manaWarning = false;
    }

    if (s.mana < 10 && !s.manaWarning) {
      s.manaWarning = true;
      toast("LOW MANA");
    } else if (s.mana >= 10) {
      s.manaWarning = false;
    }

    if (s.partyBuffUntil && s.partyBuffUntil <= Date.now()) {
      s.partyBuffUntil = 0;
      log("Moonberry damage boost has worn off.");
    }

    if (s.manaBuffUntil && s.manaBuffUntil <= Date.now()) {
      s.manaBuffUntil = 0;
      log("Astral Tea's mana boost has worn off.");
    }

    if (s.frostUntil && s.frostUntil <= Date.now()) {
      s.frostUntil = 0;
      log("Frost Bind has worn off.");
    }
  }

  function updateCelesteHealing(delta) {
    if (!s.heroes.includes("celeste") || battleLocked() || isGameplayPaused()) return;

    supportClock += delta;
    if (supportClock < 5) return;
    supportClock = 0;

    let healed = 0;
    for (const id of livingHeroes()) {
      const maxHp = HEROES[id].maxHp;
      if ((s.heroHp[id] || 0) >= maxHp) continue;
      const amount = Math.max(1, Math.floor(3 * partyUpgradeMultiplier()));
      const before = s.heroHp[id];
      s.heroHp[id] = Math.min(maxHp, before + amount);
      healed += s.heroHp[id] - before;
    }

    if (healed > 0) {
      showDamage(`+${healed} HP`, "party", true);
    }
  }

  function elowenPassiveReadyForFallenAlly() {
    if (!s.heroes.includes("elowen")) return false;
    if ((s.heroHp.elowen || 0) <= 0) return false;

    return s.heroes.some((id) =>
      id !== "elowen" && (s.heroHp[id] || 0) <= 0
    );
  }

  function updateElowenRevival() {
    if (!s.heroes.includes("elowen")) return;
    if (battleLocked() || isGameplayPaused()) return;

    const now = Date.now();
    const elowenHP = Number(s.heroHp.elowen) || 0;

    if (elowenHP <= 0) {
      if (!s.elowenSelfReviveAt) {
        s.elowenSelfReviveAt = now + 60000;
        save();
      } else if (now >= s.elowenSelfReviveAt) {
        s.heroHp.elowen = Math.max(
          1,
          Math.floor(HEROES.elowen.maxHp * 0.4)
        );
        s.elowenSelfReviveAt = 0;
        s.elowenNextReviveAt = now + 30000;
        log("Elowen revived herself through spirit magic.");
        playHeroReviveAnimation("elowen");
        announce("My spirit ally, Elowen, has returned.");
        render();
        save();
      }
      return;
    }

    if (!s.elowenNextReviveAt) {
      s.elowenNextReviveAt = now + 30000;
      save();
      return;
    }

    if (now < s.elowenNextReviveAt) return;

    const fallen = s.heroes.find((id) =>
      id !== "elowen" && (s.heroHp[id] || 0) <= 0
    );

    if (!fallen) {
      s.elowenNextReviveAt = now + 30000;
      return;
    }

    s.heroHp[fallen] = Math.max(
      1,
      Math.floor(HEROES[fallen].maxHp * 0.4)
    );

    s.elowenNextReviveAt = now + 30000;

    log(`${HEROES[fallen].name} was revived by Elowen.`);
    announce(`Elowen has revived ${HEROES[fallen].name}.`);
    playHeroReviveAnimation(fallen);
    render();
    save();
  }

  // ==========================================
  // SNACKS
  // ==========================================

  function buySnack(id) {
    const snack = SNACKS.find((item) => item.id === id);
    if (!snack) return;

    if (battleLocked()) {
      return toast("Snacks cannot be purchased during recovery.");
    }

    if (s.gold < snack.cost) {
      return toast(`Not enough gold. Need ${fmt(snack.cost)}.`);
    }

    s.gold -= snack.cost;
    s.snacks[id] = (s.snacks[id] || 0) + 1;

    log(`Purchased ${snack.name}.`);
    toast(`${snack.name} purchased.`);
    render();
    save();
  }

  function useSnack(id) {
    const snack = SNACKS.find((item) => item.id === id);
    if (!snack) return;

    if (battleLocked()) {
      return toast("Snacks cannot be used during recovery.");
    }

    if (!(s.snacks[id] > 0)) {
      return toast(`You have no ${snack.name} remaining.`);
    }

    if (!livingHeroes().length) {
      return toast("Your party has fallen. Visit the hospital.");
    }

    if (id === "revive" && !livingHeroes().length) {
      return toast("At least one hero must remain standing to use a Revive Snack.");
    }

    let used = false;
    const partyBonus = partyUpgradeMultiplier();
    const cookBonus = s.recruits.includes("mira_cook") ? 1.25 : 1;

    switch (snack.effect) {
      case "healOne": {
        const injured = livingHeroes()
          .filter((heroId) => s.heroHp[heroId] < HEROES[heroId].maxHp)
          .sort((a, b) =>
            s.heroHp[a] / HEROES[a].maxHp -
            s.heroHp[b] / HEROES[b].maxHp
          );

        if (!injured.length) {
          return toast("No hero needs healing right now.");
        }

        const target = injured[0];
        const healing = Math.floor(35 * partyBonus * cookBonus);

        s.heroHp[target] = Math.min(
          HEROES[target].maxHp,
          s.heroHp[target] + healing
        );

        showDamage(`+${healing}`, "party", true);
        used = true;
        break;
      }

      case "healAll": {
        let amountHealed = 0;

        for (const heroId of livingHeroes()) {
          const hero = HEROES[heroId];
          const before = s.heroHp[heroId];
          s.heroHp[heroId] = Math.min(
            hero.maxHp,
            before + Math.floor(24 * partyBonus * cookBonus)
          );
          amountHealed += s.heroHp[heroId] - before;
        }

        if (!amountHealed) return toast("Your party is already fully healed.");
        showDamage(`+${amountHealed} HP`, "party", true);
        used = true;
        break;
      }

      case "buff":
        s.partyBuffUntil = Date.now() + 20000;
        used = true;
        break;

      case "ore":
        s.ore += Math.floor(4 * partyBonus);
        used = true;
        break;

      case "mana":
        s.mana = Math.min(maxMana(), s.mana + 35);
        used = true;
        break;

      case "manaBuff":
        s.manaBuffUntil = Date.now() + 30000;
        used = true;
        break;

      case "revive": {
        const fallen = s.heroes.find((heroId) => (s.heroHp[heroId] || 0) <= 0);
        if (!fallen) return toast("No fallen hero needs revival.");

        if (elowenPassiveReadyForFallenAlly()) {
          return toast("Elowen's revival is ready. Save the Revive Snack for later.");
        }

        s.heroHp[fallen] = Math.floor(HEROES[fallen].maxHp * 0.4);
        playHeroReviveAnimation(fallen);
        used = true;
        break;
      }
    }

    if (!used) return;

    s.snacks[id]--;
    log(`Used ${snack.name}.`);
    toast(`${snack.name} used.`);
    render();
    save();
  }

  function renderSnacks() {
    const container = $("snackList");
    if (!container) return;

    container.innerHTML = SNACKS.map((snack) => {
      const count = s.snacks[snack.id] || 0;

      return `
        <article class="snack-card">
          <div class="snack-icon">${snack.icon}</div>
          <div class="snack-info">
            <b>${esc(snack.name)}</b>
            <small>${esc(snack.desc)}</small>
            <small>Owned: ${fmt(count)} · ${fmt(snack.cost)} gold</small>
          </div>
          <div class="snack-actions">
            <button data-action="buySnack" data-id="${snack.id}" ${battleLocked() || s.gold < snack.cost ? "disabled" : ""}>Buy</button>
            <button data-action="useSnack" data-id="${snack.id}" ${battleLocked() || count <= 0 || !livingHeroes().length ? "disabled" : ""}>Use</button>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================
  // RECRUITS
  // ==========================================

  function buyRecruit(id) {
    const recruit = RECRUITS.find((item) => item.id === id);
    if (!recruit) return;

    if (battleLocked()) {
      return toast("Recruitment is paused during recovery.");
    }

    if (s.recruits.includes(id)) {
      return toast(`${recruit.name} has already joined your kingdom staff.`);
    }

    if (s.gold < recruit.cost) {
      return toast(`Not enough gold. Need ${fmt(recruit.cost)}.`);
    }

    s.gold -= recruit.cost;
    s.recruits.push(id);

    log(`${recruit.name} joined the kingdom staff.`);
    toast(`${recruit.name} recruited.`);
    render();
    save();
  }

  function renderRecruits() {
    const container = $("recruitList");
    if (!container) return;

    container.innerHTML = RECRUITS.map((recruit) => {
      const hired = s.recruits.includes(recruit.id);

      return `
        <article class="recruit-card">
          <div class="recruit-info">
            <b>${esc(recruit.name)}</b>
            <small>${esc(recruit.role)}</small>
            <small>${esc(recruit.desc)}</small>
          </div>
          <button
            data-action="buyRecruit"
            data-id="${recruit.id}"
            ${hired || battleLocked() || s.gold < recruit.cost ? "disabled" : ""}
          >${hired ? "Recruited" : `Hire · ${fmt(recruit.cost)} G`}</button>
        </article>
      `;
    }).join("");
  }

  // ==========================================
  // UPGRADES
  // ==========================================

  function upgrade(kind) {
    const configs = {
      pickaxe: {
        level: "pickaxe",
        cost: pickCost,
        max: 10,
        label: "Pickaxe"
      },
      speed: {
        level: "speedLevel",
        cost: speedCost,
        max: 5,
        label: "Attack Speed"
      },
      damage: {
        level: "damageLevel",
        cost: damageCost,
        max: 10,
        label: "Damage"
      },
      crit: {
        level: "critLevel",
        cost: critCost,
        max: 5,
        label: "Critical Strike"
      },
      mana: {
        level: "manaLevel",
        cost: manaUpgradeCost,
        max: 5,
        label: "Maximum Mana"
      }
    };

    const config = configs[kind];
    if (!config) return;

    if (battleLocked()) {
      return toast("Upgrades are paused during recovery.");
    }

    if (s[config.level] >= config.max) {
      return toast(`${config.label} is already at maximum level.`);
    }

    const price = config.cost();

    if (s.gold < price) {
      return toast(`Not enough gold. Need ${fmt(price)}.`);
    }

    s.gold -= price;
    const previousMaxMana = maxMana();
    s[config.level]++;

    if (kind === "mana") {
      s.mana = Math.min(maxMana(), s.mana + maxMana() - previousMaxMana);
    }

    log(`${config.label} upgraded to level ${s[config.level]}.`);
    toast(`${config.label} upgraded.`);
    render();
    save();
  }

  function renderUpgrades() {
    const map = [
      ["pickaxe", "Pickaxe", s.pickaxe, 10, pickCost()],
      ["speed", "Attack Speed", s.speedLevel, 5, speedCost()],
      ["damage", "Party Damage", s.damageLevel, 10, damageCost()],
      ["crit", "Critical Strike", s.critLevel, 5, critCost()],
      ["mana", "Maximum Mana", s.manaLevel, 5, manaUpgradeCost()]
    ];

    for (const [id, label, level, max, cost] of map) {
      const levelEl = $(`${id}Level`);
      const costEl = $(`${id}Cost`);
      const button = $(`${id}Upgrade`);

      if (levelEl) levelEl.textContent = `Level ${level} / ${max}`;
      if (costEl) costEl.textContent = level >= max ? "MAX" : `${fmt(cost)} G`;
      if (button) {
        button.disabled =
          battleLocked() ||
          level >= max ||
          s.gold < cost;
      }
    }
  }

      enemyClock = 0;
    supportClock = 0;
    bossSpecialClock = 0;
    antiMagicClock = 0;
    if (s.needsHospital) return;

    livingHeroes().forEach((id) => {
      s.heroHp[id] = Math.min(HEROES[id].maxHp, (s.heroHp[id] || 0) + Math.floor(7 * partyUpgradeMultiplier()));
    });

    render();
    save();
    if (unlocks.length) unlocks.forEach(queueUnlockReveal);
    else scheduleExplore();
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
  const snack = SNACKS.find((entry) => entry.id === id);
  if (!snack) return;
  if (battleLocked()) return toast("Snacks can be used after hospital treatment.");
  if (!livingHeroes().length) return toast("Your party needs hospital treatment first.");
  if ((Number(s.snacks[id]) || 0) <= 0) return toast("You are out of that snack. Buy more.");
  if (snack.effect === "mana" && s.mana >= maxMana()) return toast("Your mana is already full.");
  if (snack.effect === "revive" && !s.heroes.some((heroId) => (s.heroHp[heroId] || 0) <= 0)) {
    return toast("No hero needs reviving right now.");
  }

  s.snacks[id]--;
  const partyBonus = partyUpgradeMultiplier();
  const snackHealingBonus = partyBonus * (s.recruits.includes("mira_cook") ? 1.25 : 1);
  let revivedHero = null;

  if (snack.effect === "healOne") {
    const target = livingHeroes().slice().sort((a, b) =>
      (s.heroHp[a] / HEROES[a].maxHp) - (s.heroHp[b] / HEROES[b].maxHp)
    )[0];
    if (target) {
      const amount = Math.floor(35 * snackHealingBonus);
      const before = s.heroHp[target] || 0;
      s.heroHp[target] = Math.min(HEROES[target].maxHp, before + amount);
      showDamage(`+${s.heroHp[target] - before}`, "party", true);
      log(`Trail Rations restored HP to ${HEROES[target].name}.`);
      playSkillAnimation("heal");
    }
  } else if (snack.effect === "buff") {
    const duration = 20000 * partyBonus;
    s.partyBuffUntil = Math.max(Date.now(), s.partyBuffUntil || 0) + duration;
    log(`Moonberries boosted party damage for ${fmt(duration / 1000)} seconds.`);
  } else if (snack.effect === "ore") {
    const amount = Math.ceil(4 * partyBonus);
    s.ore += amount;
    showDamage(`+${amount} ORE`, "party", true);
    log(`Miner's Tea refreshed the crew. +${amount} ore.`);
  } else if (snack.effect === "healAll") {
    let healed = 0;
    livingHeroes().forEach((heroId) => {
      const before = s.heroHp[heroId] || 0;
      const amount = Math.floor(24 * snackHealingBonus);
      s.heroHp[heroId] = Math.min(HEROES[heroId].maxHp, before + amount);
      healed += s.heroHp[heroId] - before;
    });
    showDamage(`TEAM +${healed}`, "party", true);
    log(`Crystal Cake healed the party by up to ${Math.floor(24 * snackHealingBonus)} HP per hero.`);
    playSkillAnimation("heal");
  } else if (snack.effect === "mana") {
    const before = s.mana;
    const amount = Math.floor(35 * partyBonus);
    s.mana = Math.min(maxMana(), s.mana + amount);
    log(`Etherberries restored ${Math.floor(s.mana - before)} mana.`);
  } else if (snack.effect === "manaBuff") {
    const duration = 30000 * partyBonus;
    s.manaBuffUntil = Math.max(Date.now(), s.manaBuffUntil || 0) + duration;
    log(`Astral Tea tripled mana regeneration for ${fmt(duration / 1000)} seconds.`);
  } else if (snack.effect === "revive") {
    revivedHero = s.heroes.find((heroId) => (s.heroHp[heroId] || 0) <= 0);
    if (!revivedHero) {
      s.snacks[id]++;
      return toast("No hero needs reviving right now.");
    }
    s.heroHp[revivedHero] = Math.max(1, Math.ceil(HEROES[revivedHero].maxHp * 0.4 * snackHealingBonus));
    log(`${HEROES[revivedHero].name} was revived with a Revive Snack.`);
    playHeroReviveAnimation(revivedHero);
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
  if (battleLocked()) return toast("Upgrades are unavailable during recovery.");
  if (s.pickaxe >= 10) return toast("Your pickaxe is already at maximum level.");
  const cost = pickCost();
  if (s.crystals < cost) return toast(`Not enough crystals. Need ${fmt(cost)} crystals.`);
  s.crystals -= cost;
  s.pickaxe++;
  log(`Pickaxe upgraded to level ${s.pickaxe}.`);
  toast(`PICKAXE LEVEL ${s.pickaxe}`);
  render();
  save();
}

  function upgradeSpeed() {
  if (battleLocked()) return toast("Upgrades are unavailable during recovery.");
  if (s.speedLevel >= 5) return toast("Party tempo is already at maximum.");
  const cost = speedCost();
  if (s.crystals < cost) return toast(`Not enough crystals. Need ${fmt(cost)} crystals.`);
  s.crystals -= cost;
  s.speedLevel++;
  partyClock = 0;
  log(`Party attack interval is now ${pInterval().toFixed(1)} seconds.`);
  toast("Party tempo improved!");
  render();
  save();
}

  function upgradeDamage() {
  if (battleLocked()) return toast("Upgrades are unavailable during recovery.");
  if (s.damageLevel >= 10) return toast("Party damage is already at maximum.");
  const cost = damageCost();
  if (s.gold < cost) return toast(`Not enough gold. Need ${fmt(cost)} gold.`);
  s.gold -= cost;
  s.damageLevel++;
  log(`Party damage increased to level ${s.damageLevel}.`);
  toast("Party hits harder!");
  render();
  save();
}

  function upgradeCrit() {
  if (battleLocked()) return toast("Upgrades are unavailable during recovery.");
  if (s.critLevel >= 8) return toast("Critical chance is already at maximum.");
  const cost = critCost();
  if (s.crystals < cost) return toast(`Not enough crystals. Need ${fmt(cost)} crystals.`);
  s.crystals -= cost;
  s.critLevel++;
  log(`Critical strike chance increased to ${s.critLevel * 5}%.`);
  toast("Critical strikes improved!");
  render();
  save();
}

  function renderUpgrades() {
  const rows = [
    { id: "pickaxe", level: s.pickaxe, max: 10, cost: pickCost(), currency: "crystals" },
    { id: "speed", level: s.speedLevel, max: 5, cost: speedCost(), currency: "crystals" },
    { id: "damage", level: s.damageLevel, max: 10, cost: damageCost(), currency: "gold" },
    { id: "crit", level: s.critLevel, max: 8, cost: critCost(), currency: "crystals" }
  ];

  for (const item of rows) {
    const levelElement = $(item.id + "Level");
    const costElement = $(item.id + "Cost");
    const button = $(item.id + "Upgrade");
    const funds = item.currency === "crystals" ? s.crystals : s.gold;
    const currencyLabel = item.currency === "crystals" ? "C" : "G";

    if (levelElement) {
      levelElement.textContent = item.id === "speed"
        ? `Level ${item.level} / ${item.max} · ${pInterval().toFixed(1)}s`
        : item.id === "crit"
          ? `Level ${item.level} / ${item.max} · ${item.level * 5}%`
          : `Level ${item.level} / ${item.max}`;
    }
    if (costElement) costElement.textContent = item.level >= item.max ? "MAX" : `${fmt(item.cost)} ${currencyLabel}`;
    if (button) button.disabled = battleLocked() || item.level >= item.max || funds < item.cost;
  }

  const manaLevelElement = $("manaLevel");
  const manaCostElement = $("manaUpgradeCost");
  const manaButton = $("manaUpgrade");
  if (manaLevelElement) manaLevelElement.textContent = `Level ${s.manaLevel} / 5 · ${fmt(maxMana())} max mana`;
  if (manaCostElement) manaCostElement.textContent = s.manaLevel >= 5 ? "MAX" : `${fmt(manaUpgradeCost())} G`;
  if (manaButton) manaButton.disabled = battleLocked() || s.manaLevel >= 5 || s.gold < manaUpgradeCost();
}

  // ==========================================
  // PARTY DAMAGE: BARRIER AND RESIST
  // ==========================================



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
      s.mana + manaRate() * delta * partyBonus
    );
  }

  // ==========================================
  // ELOWEN: REVIVAL PASSIVE
  // ==========================================

  function updateElowenRevival() {
  if (!s.heroes.includes("elowen") || !HEROES.elowen || s.needsHospital || isRecovering()) return;
  const now = Date.now();
  const elowenFallen = (s.heroHp.elowen || 0) <= 0;

  if (elowenFallen) {
    if (!s.elowenSelfReviveAt) {
      s.elowenSelfReviveAt = now + 60000;
      log("Elowen will attempt to revive herself after one minute.");
    }
    if (now >= s.elowenSelfReviveAt) {
      s.heroHp.elowen = Math.max(1, Math.floor(HEROES.elowen.maxHp * 0.35));
      s.elowenSelfReviveAt = 0;
      log("Elowen has revived herself!");
      toast("ELOWEN RETURNS!");
      render();
      save();
      setTimeout(() => playHeroReviveAnimation("elowen"), 0);
      announce("Elowen has returned to the party.");
    }
    return;
  }

  s.elowenSelfReviveAt = 0;
  const fallen = s.heroes.filter((id) => id !== "elowen" && (s.heroHp[id] || 0) <= 0);
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
  s.heroHp[target] = Math.max(1, Math.floor(HEROES[target].maxHp * 0.4));
  s.elowenNextReviveAt = now + 30000;
  log(`${HEROES[target].name} was revived by Elowen.`);
  toast(`${HEROES[target].name} REVIVED BY ELOWEN`);
  render();
  save();
  setTimeout(() => playHeroReviveAnimation(target), 0);
  announce(`${HEROES[target].name} has been revived.`);
}

  // ==========================================
  // AUTOPILOT CONTROLS
  // ==========================================

  function activateBattleAutopilot() {
    if (battleLocked()) return toast("Autopilot cannot start during recovery.");
    if (!livingHeroes().length) return toast("Your party has fallen.");
    startBattleAutopilot();
    render();
    save();
  }

  function activateKingdomAutopilot() {
    if (battleLocked()) return toast("Autopilot cannot start during recovery.");
    if (!livingHeroes().length) return toast("Your party has fallen.");
    startKingdomAutopilot();
    render();
    save();
  }

  function stopAutopilot() {
    stopAllAutopilots();
    render();
    save();
  }

  // ==========================================
  // AUTOPILOT DECISIONS
  // ==========================================

  function autopilotStep(delta) {
    if (!autopilotActive() || battleLocked() || isGameplayPaused()) return;
    const now = Date.now();
    if (kingdomAutoPilot) runKingdomAutopilot(now, delta);
    battlePilotClock += delta;
    if (battlePilotClock >= 0.9) {
      battlePilotClock = 0;
      runBattleAutopilot(now);
    }
  }

  // ==========================================
  // MAIN GAME TICK
  // ==========================================

  function gameTick() {
    const now = performance.now();
    const delta = Math.max(0, Math.min(1, (now - lastTick) / 1000));
    lastTick = now;
    if (isGameplayPaused()) return;

    if (!s.needsHospital && s.healingUntil > 0 && Date.now() >= s.healingUntil) {
      completeRecovery();
    }

    Object.keys(s.cooldowns).forEach((key) => {
      s.cooldowns[key] = Math.max(0, (Number(s.cooldowns[key]) || 0) - delta);
    });

    if (!s.needsHospital && !isRecovering()) {
      updatePassiveResources(delta);
      updateElowenRevival();

      const celesteAlive = s.heroes.includes("celeste") && livingHeroes().includes("celeste");
      if (celesteAlive) {
        supportClock += delta;
        if (supportClock >= 10) {
          supportClock -= 10;
          const amount = Math.floor((7 + (s.recruits.includes("elise") ? 4 : 0)) * partyUpgradeMultiplier());
          let healedAnyone = false;
          for (const id of livingHeroes()) {
            const before = s.heroHp[id] || 0;
            const after = Math.min(HEROES[id].maxHp, before + amount);
            if (after > before) {
              s.heroHp[id] = after;
              showDamage(`+${after - before}`, "party", true);
              healedAnyone = true;
            }
          }
          if (healedAnyone) {
            log(`Celeste's healing aura restores up to ${amount} HP to every living hero.`);
            playSkillAnimation("heal");
          }
        }
      } else {
        supportClock = 0;
      }

      if (s.enemy) updateCombat(delta);
      else {
        partyClock = 0;
        enemyClock = 0;
      }
      autopilotStep(delta);

      sageHealthCheckClock += delta;
      if (sageHealthCheckClock >= 1) {
        sageHealthCheckClock = 0;
        checkPartyHealthWarning();
      }
    } else if (s.needsHospital && !hospitalPromptShown) {
            hospitalPromptShown = true;
      showHospitalPrompt();
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
      $("scene") ||
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
    const confirmed = window.confirm("Reset Crystal Kingdom? All saved game progress, recruited heroes, and upgrades will be erased. Music and voice preferences will remain.");
    if (!confirmed) return;

    resettingGame = true;
    for (const timer of [exploreTimer, toastTimer, commandIdleTimer, recognitionRestartTimer, unlockRevealTimer, analistRevealTimer, resistRevealTimer]) {
      clearTimeout(timer);
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (recognition) {
      try { recognition.stop(); } catch (error) { /* already stopped */ }
    }
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(OLD_SAVE_KEY);
      const remove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /gem.?miner|crystal.?kingdom/i.test(key) && !/music|volume|voice|sage/i.test(key)) remove.push(key);
      }
      remove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      resettingGame = false;
      console.error("Reset failed:", error);
      toast("Could not clear the saved game. Check browser storage permissions.");
      return;
    }
    window.location.reload();
  }

  // ==========================================
  // CONNECT BUTTONS
  // ==========================================

  function dispatchAction(action, id, value) {
    switch (action) {
      case "toggleMusic": toggleMusic(); break;
      case "mine":
      case "mineNow": mine(); break;
      case "explore":
      case "exploreNow": exploreNow(); break;
      case "challengeGuardian":
      case "boss": challengeGuardian(); break;
      case "upgrade": upgrade(value); break;
      case "upgradePickaxe": upgradePickaxe(); break;
      case "upgradeSpeed": upgradeSpeed(); break;
      case "upgradeDamage": upgradeDamage(); break;
      case "upgradeCrit": upgradeCrit(); break;
      case "upgradeMaxMana":
      case "upgradeMana": upgradeMaxMana(); break;
      case "payHospitalFee":
      case "payHeal": payHeal(); break;
      case "activateBattleAutopilot":
      case "battleAutopilot": activateBattleAutopilot(); break;
      case "activateKingdomAutopilot":
      case "kingdomAutopilot": activateKingdomAutopilot(); break;
      case "stopAutopilot": stopAutopilot(); break;
      case "toggleSage":
      case "sageToggle": toggleSage(); break;
      case "toggleVoice": setVoiceEnabled(!sageEnabled); break;
      case "talkToSage":
      case "sageCommand":
        if (commandModeActive) leaveCommandMode();
        else enterCommandMode();
        break;
      case "buySnack": buySnack(id || value); break;
      case "useSnack": useSnack(id || value); break;
      case "buyRecruit": buyRecruit(id || value); break;
      case "clearLog":
        logs = [];
        s.lastLog = [];
        renderLog();
        save();
        toast("Adventure log cleared.");
        break;
      case "resetGame":
      case "reset":
      case "reset-save":
      case "resetSave":
      case "resetProgress": resetGame(); break;
      default: return false;
    }
    return true;
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(
        "button, [data-action], [data-skill]"
      );

      if (!button) return;

      if (button.matches("[data-sage-action]")) {
        event.preventDefault();
        handleSageAction(button);
        return;
      }

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
          button.dataset.id,
          button.dataset.value
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
        resetGame: "resetGame",
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

  // ==========================================
  // RESTORED MECHANICS FROM THE FULLER GAME
  // ==========================================

  function explore() {
    if (isGameplayPaused() || battleLocked() || s.enemy || !livingHeroes().length) return;
    clearTimeout(exploreTimer);

    // Every exploration attempt independently has a one-in-ten encounter chance.
    if (Math.random() < 0.10) {
      spawnEnemy(false);
      return;
    }

    const crystalBonus = s.recruits.includes("luna") ? 1.2 : 1;
    const partyBonus = partyUpgradeMultiplier();
    const crystalsFound = Math.floor((3 + Math.random() * 7 + s.region * 2) * crystalBonus * partyBonus);
    const oreFound = Math.floor((1 + Math.floor(Math.random() * 3) + (s.recruits.includes("juno") ? 1 : 0)) * partyBonus);
    const goldFound = Math.max(1, Math.floor(crystalsFound * 0.7));

    s.crystals += crystalsFound;
    addCaveCrystalProgress(crystalsFound);
    s.ore += oreFound;
    s.gold += goldFound;

    log(`Exploration found ${crystalsFound} crystals, ${oreFound} ore, and ${goldFound} gold.`);
    toast(`Found ${crystalsFound} crystals, ${oreFound} ore, and ${goldFound} gold.`);
    showDamage(`+${crystalsFound} ◆`, "party", true);
    render();
    save();
    scheduleExplore();
  }

  function enemyAreaAttack() {
    const enemy = s.enemy;
    if (!enemy || !enemy.boss || enemy.regionIndex !== 7 || battleLocked()) return;

    playSkillAnimation("cataclysm");
    const scene = $("scene");
    if (scene) {
      scene.classList.remove("cataclysm-flash");
      void scene.offsetWidth;
      scene.classList.add("cataclysm-flash");
      setTimeout(() => scene.classList.remove("cataclysm-flash"), 1200);
    }

    if (s.partyBarrierUntil > Date.now()) {
      log("Barrier completely blocked the Null Sanctum guardian's area attack.");
      showDamage("AREA BLOCKED", "party");
      playSkillAnimation("barrier-block");
      render();
      save();
      return;
    }

    const guarded = s.guardCharges > 0;
    for (const id of livingHeroes()) {
      let amount = Math.floor(HEROES[id].maxHp * (0.15 + Math.random() * 0.08) + enemy.damage * 0.25);
      if (guarded) amount = Math.ceil(amount * 0.45);
      s.heroHp[id] = Math.max(0, (s.heroHp[id] || 0) - amount);
      showDamage(`PULSE -${amount}`, "party");
      if (s.heroHp[id] <= 0) playHeroFallenAnimation(id);
    }
    if (guarded) s.guardCharges = 0;

    log(`${enemy.name} unleashed Cataclysmic Pulse against the entire party${guarded ? "; Guard softened the impact" : ""}.`);
    announce("Warning: Cataclysmic Pulse is striking the entire party!");
    playImportantSound();
    if (!livingHeroes().length) partyWiped();
    render();
    save();
  }

  function canUseSkill(key) {
    if (key === "analist") {
      return isAnalistUnlocked() && Boolean(s.enemy) && !battleLocked() && !isGameplayPaused();
    }
    if (!(key in SKILL_MANA_COST) || !isSkillUnlocked(key)) return false;
    if (battleLocked() || isGameplayPaused() || !livingHeroes().length) return false;
    if ((s.cooldowns[key] || 0) > 0 || s.mana < SKILL_MANA_COST[key]) return false;
    if (key === "resist") {
      return Boolean(s.enemy && s.enemy.uniqueAttack === "antiMagicBarrier" && !s.enemy.resistUsed &&
        (!isAntiMagicBarrierActive() || (Number(s.enemy.barrierElapsed) || 0) < 5));
    }
    if (key !== "barrier" && isSkillSealed(key) && s.partyBarrierUntil <= Date.now()) return false;
    if (isAntiMagicBarrierActive() && !["resist", "barrier"].includes(key) && s.partyBarrierUntil <= Date.now()) return false;
    if (["slash", "burst", "meteor", "frost"].includes(key) && !s.enemy) return false;
    if (["heal", "phoenix"].includes(key) && !s.heroes.some((id) => ["celeste", "sage"].includes(id))) return false;
    if (key === "phoenix" && !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)) return false;
    return true;
  }

  function playSkillAnimation(key) {
    const scene = $("scene");
    if (!scene) return;

    const effects = {
      slash: ["RADIANT SLASH", "✦"],
      crownfall: ["CROWNFALL RUPTURE", "♛"],
      cataclysm: ["CATACLYSMIC PULSE", "◈"],
      "anti-magic": ["ANTI-MAGIC BARRIER", "⊘"],
      burst: ["ARCANE BURST", "✧"],
      critical: ["CRITICAL HIT", "✹"],
      guard: ["AEGIS GUARD", "⬡"],
      heal: ["HEALING WAVE", "✚"],
      meteor: ["METEOR RAIN", "☄"],
      frost: ["FROST NOVA", "❄"],
      phoenix: ["PHOENIX BLESSING", "♨"],
      barrier: ["BARRIER", "⬡"],
      "barrier-block": ["AREA BLOCKED", "⬡"],
      partyUpgrade: ["CRYSTAL ASCENDANCE", "✦"]
    };
    const info = effects[key];
    if (!info) return;

    scene.classList.remove("skill-scene-flash", `skill-scene-${key}`);
    void scene.offsetWidth;
    scene.classList.add("skill-scene-flash", `skill-scene-${key}`);

    const effect = document.createElement("div");
    effect.className = `skill-vfx skill-vfx-${key}`;
    effect.setAttribute("aria-hidden", "true");
    effect.innerHTML = `<span class="skill-vfx-symbol">${info[1]}</span><b>${info[0]}</b>`;
    scene.appendChild(effect);
    setTimeout(() => effect.remove(), key === "meteor" ? 1500 : 1100);
    setTimeout(() => scene.classList.remove("skill-scene-flash", `skill-scene-${key}`), 1200);

    if (key === "heal") {
      document.querySelectorAll("#battleParty .battle-hero:not(.fallen)").forEach((hero) => {
        hero.classList.remove("hero-heal-glow");
        void hero.offsetWidth;
        hero.classList.add("hero-heal-glow");
        setTimeout(() => hero.classList.remove("hero-heal-glow"), 1100);
      });
    }
    if (key === "guard") {
      const party = $("battleParty");
      if (party) {
        party.classList.add("party-guard-glow");
        setTimeout(() => party.classList.remove("party-guard-glow"), 1000);
      }
    }
    if (key === "barrier") {
      const party = $("battleParty");
      if (party) {
        party.classList.add("party-barrier-glow");
        setTimeout(() => party.classList.remove("party-barrier-glow"), 5200);
      }
    }
  }

  function playHeroReviveAnimation(heroId) {
  // Run after the current render so the newly rebuilt hero element keeps the glow class.
  setTimeout(() => {
    const hero = document.querySelector(`#battleParty [data-hero-id="${heroId}"]`);
    if (!hero) return;
    hero.classList.remove("fallen", "hero-revive-glow");
    void hero.offsetWidth;
    hero.classList.add("hero-revive-glow");
    setTimeout(() => hero.classList.remove("hero-revive-glow"), 1500);
  }, 0);
}

function playHeroFallenAnimation(heroId) {
    const hero = document.querySelector(`#battleParty [data-hero-id="${heroId}"]`);
    if (!hero) return;
    hero.classList.add("fallen");
  }

function checkPartyHealthWarning() {
    const active = livingHeroes();
    if (!active.length || battleLocked()) {
      lowHealthWarning = false;
      return;
    }
    const ratios = active.map((id) => (s.heroHp[id] || 0) / HEROES[id].maxHp);
    const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
    const low = ratios.some((ratio) => ratio <= 0.35) || average <= 0.45;
    if (low && !lowHealthWarning) {
      lowHealthWarning = true;
      showLowHealthPrompt();
    }
    if (ratios.every((ratio) => ratio >= 0.65)) {
      lowHealthWarning = false;
      if (currentPrompt && currentPrompt.type === "lowHealth") {
        currentPrompt = null;
        refreshSagePanel();
      }
    }
  }

function spawn(boss = false) {
    if (boss) return challengeGuardian();
    return spawnEnemy(false);
  }

function upgrade(kind) {
    if (kind === "pickaxe") return upgradePickaxe();
    if (kind === "speed") return upgradeSpeed();
    if (kind === "damage") return upgradeDamage();
    if (kind === "crit") return upgradeCrit();
    if (kind === "mana" || kind === "max mana" || kind === "maximum mana") return upgradeMaxMana();
    return false;
  }

function hireRecruit(id) {
    return buyRecruit(id);
  }

function payHeal() {
    hospitalPromptShown = false;
    return payHospitalFee();
  }

function finishHealing() {
    return completeRecovery();
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

function animateHeroAttack(id) {
    const party = $("battleParty");
    const hero = party && party.querySelector(`[data-hero-id="${id}"]`);
    if (!hero || hero.classList.contains("fallen")) return;

    const usesBow = ["liria", "darius_hero"].includes(id);
    const usesSword = ["aiden", "ragnar", "kael_rogue", "tessa_hero", "borin_hero"].includes(id);
    const uniqueHeroAttack = { tessa_hero: "attack-miner", borin_hero: "attack-stoneguard", iris_hero: "attack-mystic", elise_hero: "attack-support", elowen: "attack-spirit" }[id];
    const animationClass = uniqueHeroAttack || (usesBow ? "attack-bow" : usesSword ? "attack-sword" : ["celeste", "sage"].includes(id) ? "attack-support" : "attack-cast");

    hero.classList.remove("attack-bow", "attack-sword", "attack-cast", "attack-support", "attack-spirit", "attack-miner", "attack-stoneguard", "attack-mystic");
    void hero.offsetWidth;
    hero.classList.add(animationClass);
    setTimeout(() => hero.classList.remove(animationClass), 500);

    if (usesBow) launchArrow(hero);
    if (usesSword) launchSwordSlash();
    if (id === "iris_hero") launchMagicBolt(hero);
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

function queueSageReply(message) {
    if (message) announce(message);
  }

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

    enemy.restrictedSkills = availableCombatSkills().filter((key) => !["resist", "barrier", "analist"].includes(key));
    enemy.antiMagicBarrierActive = true;
    playSkillAnimation("anti-magic");
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
      { kind: "skill", key: "barrier", label: "Barrier", patterns: [/\bbarrier\b/gi, /\bprotect (?:the )?party\b/gi] },
      { kind: "skill", key: "analist", label: "Analist", patterns: [/\banalist\b/gi, /\banalyst\b/gi, /\banalyze\b/gi, /\banalyse\b/gi] },
      { kind: "utility", key: "mine", label: "mining", patterns: [/\bmine\s+(?:some\s+)?crystals?\b/gi, /\bmine\b/gi] },
      { kind: "utility", key: "explore", label: "exploration", patterns: [/\bexplore\b/gi, /\bexploration\b/gi] },
      { kind: "utility", key: "status", label: "status report", patterns: [/\bstatus report\b/gi, /\bcheck status\b/gi, /\bstatus\b/gi] },
      { kind: "utility", key: "hospital", label: "hospital treatment", patterns: [/\bpay (?:the )?hospital(?: fee)?\b/gi, /\bpay (?:the )?healing fee\b/gi] },
      { kind: "upgrade", key: "pickaxe", label: "pickaxe", patterns: [/\bupgrade (?:my |the )?pickaxe\b/gi, /\bpickaxe upgrade\b/gi, /\bimprove (?:my |the )?pickaxe\b/gi] },
      { kind: "upgrade", key: "speed", label: "attack speed", patterns: [/\bupgrade (?:the )?(?:attack )?speed\b/gi, /\battack speed upgrade\b/gi] },
      { kind: "upgrade", key: "damage", label: "party damage", patterns: [/\bupgrade (?:the )?(?:party )?damage\b/gi, /\bdamage upgrade\b/gi] },
      { kind: "upgrade", key: "mana", label: "maximum mana", patterns: [/\bupgrade (?:my |the )?(?:maximum|max) mana\b/gi, /\bmax(?:imum)? mana upgrade\b/gi, /\bincrease (?:my )?mana capacity\b/gi] },
      { kind: "upgrade", key: "crit", label: "critical strikes", patterns: [/\bupgrade (?:the )?crit(?:ical)?(?: strikes?| chance)?\b/gi, /\bcritical strikes? upgrade\b/gi, /\bcritical strike chance\b/gi] },
      { kind: "snack", action: "use", key: "rations", label: "Trail Rations", patterns: [/\buse (?:the )?(?:trail rations|rations)\b/gi, /\beat (?:the )?(?:trail rations|rations)\b/gi] },
      { kind: "snack", action: "use", key: "moonberries", label: "Moonberries", patterns: [/\buse (?:the )?moonberries\b/gi, /\beat (?:the )?moonberries\b/gi] },
      { kind: "snack", action: "use", key: "tea", label: "Miner's Tea", patterns: [/\buse (?:the )?miner(?:\s+s)?\s+tea\b/gi, /\bdrink (?:the )?miner(?:\s+s)?\s+tea\b/gi] },
      { kind: "snack", action: "use", key: "cake", label: "Crystal Cake", patterns: [/\buse (?:the )?crystal cake\b/gi, /\beat (?:the )?crystal cake\b/gi] },
      { kind: "snack", action: "use", key: "etherberry", label: "Etherberries", patterns: [/\buse (?:the )?etherberries\b/gi, /\beat (?:the )?etherberries\b/gi] },
      { kind: "snack", action: "use", key: "astralTea", label: "Astral Tea", patterns: [/\buse (?:the )?astral tea\b/gi, /\bdrink (?:the )?astral tea\b/gi] },
      { kind: "snack", action: "use", key: "revive", label: "Revive Snack", patterns: [/\buse (?:the )?revive snack\b/gi] },
      { kind: "snack", action: "buy", key: "rations", label: "Trail Rations", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the)\s+)?(?:trail rations|rations)\b/gi] },
      { kind: "snack", action: "buy", key: "moonberries", label: "Moonberries", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the )\s+)?moonberries\b/gi] },
      { kind: "snack", action: "buy", key: "tea", label: "Miner's Tea", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the )\s+)?miner(?:\s+s)?\s+tea\b/gi] },
      { kind: "snack", action: "buy", key: "cake", label: "Crystal Cake", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the )\s+)?crystal cake\b/gi] },
      { kind: "snack", action: "buy", key: "etherberry", label: "Etherberries", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the )\s+)?etherberries\b/gi] },
      { kind: "snack", action: "buy", key: "astralTea", label: "Astral Tea", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the )\s+)?astral tea\b/gi] },
      { kind: "snack", action: "buy", key: "revive", label: "Revive Snack", patterns: [/\b(?:buy|purchase|get)\s+(?:(?:some|the )\s+)?revive snack\b/gi] },
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

function launchMagicBolt(hero) {
    const scene = $("scene");
    const enemy = $("enemyVisual");
    if (!scene || !hero || !enemy || enemy.classList.contains("hidden")) return;
    const sceneRect = scene.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    const startX = heroRect.left + heroRect.width * 0.72 - sceneRect.left;
    const startY = heroRect.top + heroRect.height * 0.38 - sceneRect.top;
    const endX = enemyRect.left + enemyRect.width * 0.24 - sceneRect.left;
    const endY = enemyRect.top + enemyRect.height * 0.42 - sceneRect.top;
    const bolt = document.createElement("span");
    bolt.className = "attack-projectile magic-bolt";
    bolt.style.left = startX + "px";
    bolt.style.top = startY + "px";
    bolt.style.setProperty("--travel-x", (endX - startX) + "px");
    bolt.style.setProperty("--travel-y", (endY - startY) + "px");
    scene.appendChild(bolt);
    setTimeout(() => bolt.remove(), 460);
  }


function initCrystalKingdom() {
    if (window.__crystalKingdomInitialized) return;

    window.__crystalKingdomInitialized = true;

    ensureMusicElement();
    ensureBarrierVisual();
    ensureBarrierSkillButton();
    ensureManaUpgradeCard();
    ensureDynamicAbilityButtons();

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
    // require microphone permission will report the appropriate status.
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

    if (s.autoPilotUnlocked && !s.raphaelEvolved) {
      window.setTimeout(triggerRaphaelEvolution, 600);
    }

    window.gemMinerReady = true;
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