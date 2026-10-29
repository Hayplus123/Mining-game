(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = "gemMinerCrystalKingdom_v3";
  const OLD_SAVE_KEY = "gemMinerCrystalKingdom_v2";
  let resettingGame = false;

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
      name: "Tessa", role: "Miner Vanguard · Front line",
      portrait: "assets/knight.svg", maxHp: 132, damage: 16,
      tagline: "A determined delver who holds the front line."
    },
    borin_hero: {
      name: "Borin", role: "Stoneguard · Front line",
      portrait: "assets/knight.svg", maxHp: 154, damage: 15,
      tagline: "A steadfast guardian who can withstand heavy attacks."
    },
    iris_hero: {
      name: "Iris", role: "Mystic · Arcane DPS",
      portrait: "assets/hero-mage.svg", maxHp: 108, damage: 21,
      tagline: "Channels the strange magic of the deeper caves."
    },
    darius_hero: {
      name: "Darius", role: "Crossbowman · Ranged DPS",
      portrait: "assets/archer.svg", maxHp: 120, damage: 22,
      tagline: "A precise crossbow shot can turn a fight around."
    },
    elise_hero: {
      name: "Elise", role: "Spirit Guide · Support",
      portrait: "assets/hero-mage.svg", maxHp: 124, damage: 12,
      tagline: "Channels restorative spirit energy to protect the team."
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
    "aiden", "seraphine", "liria", "celeste", "ragnar", "kael_rogue",
    "sage", "elowen", "tessa_hero", "borin_hero", "iris_hero",
    "darius_hero", "elise_hero"
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
      if (reward && HEROES[reward] && !state.heroes.includes(reward)) state.heroes.push(reward);
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

    state.autoPilotUnlocked = Boolean(state.autoPilotUnlocked) || state.region >= 6 || state.bossDefeated.includes(5);
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
      key !== "barrier" &&
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

    const enabling = !sageEnabled;
    setVoiceEnabled(enabling);

    if (!enabling) {
      currentPrompt = null;
      toast(`${assistantWakeName()} voice muted.`);
      refreshSagePanel();
      return;
    }

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
    const text = normalizeVoiceText(transcript);
    if (!text || Date.now() < ignoreRecognitionUntil) return;
    if (speechBusy && text === normalizeVoiceText(currentUtterance && currentUtterance.text)) return;
    const wakePattern = assistantWakePattern();
    const wakeMatch = wakePattern.exec(text);
    if (!commandModeActive) {
      if (!wakeMatch) return;
      const remainder = stripWakePhrase(text.slice(wakeMatch.index));
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
  function handleVoiceCommand(rawText) {
    const text = normalizeVoiceText(stripWakePhrase(rawText));
    if (isGameplayPaused()) return;

    if (pendingAnalistApproval && /^(?:yes|yeah|yep|sure|okay|ok|do it|go ahead|affirmative)$/.test(text)) { answerAnalistPrompt(true); return; }
    if (pendingAnalistApproval && /^(?:no|nope|not now|negative)$/.test(text)) { answerAnalistPrompt(false); return; }
    if (/\b(?:use|cast|activate)\s+analist\b/.test(text)) { if (pendingAnalistApproval) answerAnalistPrompt(true); else skill("analist"); return; }
    if (/\b(?:use|cast)\s+resist\b/.test(text)) { skill("resist"); return; }
    if (/\b(?:stand down|autopilot off|auto pilot off|stop autopilot|stop auto pilot|stop managing)\b/.test(text)) { stopAllAutopilots(); return; }
    if (/\b(?:never mind|nothing|cancel|go idle|back to idle|stop listening)\b/.test(text)) { cancelSageSpeech(true); leaveCommandMode(); return; }
    if (!text) { updateSageMessage("Listening for commands…"); armCommandIdleTimer(); refreshSagePanel(); return; }
    if (/^(?:thanks|thank you|thanks a lot|thank you so much|many thanks)$/.test(text)) { returnToIdleAfterSpeech = true; queueSageReply("I'm happy to help. Let me know whenever you need something else."); return; }
    if (pendingSnackApproval && handleSnackYesNo(text)) return;
    if (/\b(?:annihilate|eliminate)\b.*\b(?:enemy|enemies|monster|monsters|them|it)\b/.test(text) || /^annihilate(?: the)? enemy$/.test(text)) { startBattleAutopilot(); return; }
    if (/\b(?:activate|enable|start|engage|begin|turn on|switch on)\s+(?:the\s+)?(?:(?:true|full|kingdom|resource management)\s+)?auto\s*pilot(?:\s+mode)?\b/.test(text) || /\b(?:true|full|kingdom)\s+auto\s*pilot\b/.test(text) || /^autopilot on$/.test(text) || /^manage my kingdom$/.test(text)) { startKingdomAutopilot(); return; }
    if (/\b(?:battle|combat)\s+auto\s*pilot\b/.test(text) || /^autopilot battle$/.test(text)) { startBattleAutopilot(); return; }

    if (/\b(?:what cave|which cave|current cave|where am i)\b/.test(text)) {
      queueSageReply(`You are exploring Cave ${s.region + 1}. ${region().name}.`); return;
    }
    if (/\b(?:show|check|tell me about)\b.*\b(?:party|heroes|health)\b/.test(text)) {
      const parts = s.heroes.map((id) => `${HEROES[id].name}: ${fmt(s.heroHp[id] || 0)} / ${fmt(HEROES[id].maxHp)} health`);
      queueSageReply(parts.join(". ") || "No heroes are currently in the party."); return;
    }

    const resourceAnswer = answerResourceQuestion(text);
    if (resourceAnswer) { queueSageReply(resourceAnswer); return; }

    clearTimeout(commandIdleTimer);
    commandIdleTimer = null;
    const commands = getVoiceCommandMatches(text);
    if (!commands.length) {
      queueSageReply("I didn't recognize that command. Try mine crystals, explore, Barrier, ask for a status report, or say how much gold you have.");
      return;
    }

    const completed = [];
    const replies = [];


    for (const command of commands) {
      if (command.kind === "skill") {
        if (command.key === "phoenix" && elowenPassiveReadyForFallenAlly()) {
          replies.push("Elowen's spirit revival is ready. I will let her passive revive the fallen ally instead.");
        } else if (canUseSkill(command.key)) {
          skill(command.key); completed.push(command.label || skillVoiceLabel(command.key));
        } else {
          replies.push(voiceSkillUnavailableReason(command.key));
        }
      } else if (command.kind === "utility" && command.key === "mine") {
        mine(); completed.push("mining");
      } else if (command.kind === "utility" && command.key === "explore") {
        if (s.enemy) replies.push("Defeat the current enemy before exploring again.");
        else if (battleLocked()) replies.push("The party is unavailable during hospital treatment.");
        else { explore(); completed.push("exploration"); }
      } else if (command.kind === "utility" && command.key === "status") {
        replies.push(makeStatusReport());
      } else if (command.kind === "utility" && command.key === "hospital") {
        if (s.needsHospital && s.gold >= s.hospitalFee) { payHeal(); completed.push("hospital treatment"); }
        else if (s.needsHospital) replies.push(`The hospital needs ${fmt(s.hospitalFee)} gold.`);
        else replies.push("Your party does not need hospital payment right now.");
      } else if (command.kind === "upgrade") {
        const levelKey = { pickaxe: "pickaxe", speed: "speedLevel", damage: "damageLevel", crit: "critLevel", mana: "manaLevel" }[command.key];
        const previousLevel = levelKey ? s[levelKey] : undefined;
        upgrade(command.key);
        if (levelKey && s[levelKey] > previousLevel) completed.push(`${command.label || command.key} upgrade`);
        else replies.push(`I could not upgrade ${command.label || command.key}. You may need more resources or it may already be at its maximum level.`);
      } else if (command.kind === "snack") {
        let snackId = command.key;
        if (snackId === "auto" && command.action === "use") snackId = chooseSnackToUse();
        if (snackId === "auto" && command.action === "buy") {
          const affordable = SNACKS.filter((item) => item.cost <= s.gold).sort((a,b) => a.cost-b.cost);
          snackId = affordable.length ? affordable[0].id : null;
        }
        if (!snackId) { replies.push("I could not find an appropriate snack."); continue; }
        const snack = SNACKS.find((item) => item.id === snackId);
        if (!snack) { replies.push("I could not find that snack."); continue; }
        if (command.action === "buy") {
          const oldGold = s.gold; const oldCount = s.snacks[snackId] || 0; buySnack(snackId);
          if ((s.snacks[snackId] || 0) > oldCount && s.gold < oldGold) completed.push(`buying ${snack.name}`);
          else replies.push(`I could not buy ${snack.name}. You need ${snack.cost} gold.`);
        } else {
          const oldCount = s.snacks[snackId] || 0;
          if (snackId === "revive" && elowenPassiveReadyForFallenAlly()) replies.push("Elowen's revival is ready, so I will save the Revive Snack.");
          else {
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
    const dock = $("sageDock");
    const shouldShow = sagePanelVisible();
    if (dock) dock.classList.toggle("is-hidden", !(shouldShow || s.raphaelEvolved));
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

    const sageName = $("sageName");
    if (sageName) sageName.textContent = s.raphaelEvolved ? "RAPHAEL" : "GREAT SAGE";
    const orbSymbol = orb && orb.querySelector(".sage-symbol");
    if (orbSymbol) orbSymbol.textContent = s.raphaelEvolved ? "R" : "◈";
    if (orb) orb.classList.toggle("is-raphael", Boolean(s.raphaelEvolved));
    if (typeof renderSageActions === "function") renderSageActions();
    const commandButton = $("sageCommandButton");

    if (commandButton) {
      commandButton.textContent = commandModeActive
        ? "Listening…"
        : `Talk to ${assistantWakeName()}`;
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
    if (count) count.textContent = `${s.bossDefeated.length} CLEARED`;
    atlas.innerHTML = regions.map((cave, index) => {
      const cleared = s.bossDefeated.includes(index);
      const current = index === s.region;
      const locked = index > s.region;
      const seen = !locked && (index === 0 || cleared || (Array.isArray(s.discoveredGuardians) && s.discoveredGuardians.includes(index)));
      const caveName = locked ? "Unknown Passage" : cave.name;
      const guardianName = locked || !seen ? "Unidentified Guardian" : cave.boss;
      const description = locked ? "The path ahead remains concealed." : !seen ? "Something waits deeper inside. Its identity remains undiscovered." : cave.desc;
      const hero = !locked && seen && cave.rewardHero ? HEROES[cave.rewardHero] : null;
      const status = cleared ? "✓ CLEARED" : current ? "● CURRENT" : "🔒 SEALED";
      const reward = locked || !seen ? "Unknown reward" : hero ? hero.name : "Unrevealed reward";
      return `<article class="cave-atlas-card" data-state="${cleared ? "cleared" : current ? "current" : "locked"}"><div class="cave-atlas-card-top"><span class="cave-atlas-number">CAVE ${String(index + 1).padStart(2, "0")}</span><span class="cave-atlas-status">${status}</span></div><h3>${esc(caveName)}</h3><p class="cave-atlas-desc">${esc(description)}</p><div class="cave-atlas-detail"><span>GUARDIAN</span><strong>${esc(guardianName)}</strong></div><div class="cave-atlas-reward ${hero ? "" : "mysterious"}"><span class="cave-atlas-reward-icon">${hero ? "✦" : "?"}</span><div><small>DISCOVERY</small><strong>${esc(reward)}</strong></div></div></article>`;
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
            <div class="portrait"><img src="${esc(hero.portrait)}" alt="${esc(hero.name)}" loading="lazy"></div>
            <div class="companion-info"><b>${esc(hero.name)}</b><small>${esc(hero.role)}</small><small>${fmt(hp)} / ${fmt(hero.maxHp)} HP</small><div class="minibar"><i style="width:${percentage}%"></i></div><small>${fallen ? "FALLEN" : "READY FOR BATTLE"}</small></div>
          </article>`;
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
    // The enemy occupies the right side of the scene, so the first living party member must render on the right.
    fieldParty.style.flexDirection = "row-reverse";
    const roster = s.heroes.filter((id) => HEROES[id]);
    const living = roster.filter((id) => (Number(s.heroHp[id]) || 0) > 0);
    const fallen = roster.filter((id) => (Number(s.heroHp[id]) || 0) <= 0).reverse();
    const displayOrder = [...living, ...fallen];
    const battleHTML = displayOrder.map((id) => {
      const hero = HEROES[id];
      const hp = Number(s.heroHp[id]) || 0;
      const isFallen = hp <= 0;
      const rank = Math.max(1, living.indexOf(id) + 1);
      const rankClass = isFallen ? "front-rank-fallen" : `front-rank-${Math.min(rank, 8)}`;
      return `<div class="battle-hero ${rankClass} ${isFallen ? "fallen" : ""}" data-hero-id="${esc(id)}" data-hero="${esc(id)}" title="${esc(hero.name)} · ${fmt(hp)} / ${fmt(hero.maxHp)} HP"><img src="${esc(hero.portrait)}" alt="${esc(hero.name)}"></div>`;
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
    updateMusicScene();
  }
  
  function explore() {
    if (battleLocked() || isGameplayPaused() || s.enemy || !livingHeroes().length || s.bossDefeated.includes(s.region)) return;
    clearTimeout(exploreTimer);

    if (Math.random() < 0.10) {
      spawnEnemy(false);
      return;
    }

    const crystalBonus = s.recruits.includes("luna") ? 1.2 : 1;
    const partyBonus = partyUpgradeMultiplier();
    const crystalsFound = Math.max(1, Math.floor((3 + Math.random() * 7 + s.region * 2) * crystalBonus * partyBonus));
    const oreFound = Math.max(1, Math.floor((1 + Math.floor(Math.random() * 3) + (s.recruits.includes("juno") ? 1 : 0)) * partyBonus));
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
      specialAttackClock: 0,
      bossElapsed: 0,
      uniqueAttack: boss && index === 8 ? "antiMagicBarrier" : null,
      antiMagicBarrierTriggered: false,
      nextAntiMagicAt: Date.now() + (boss && index === 8 ? 5000 : 10000),
      antiMagicUntil: 0,
      antiMagicBarrierActive: false,
      barrierElapsed: 0,
      barrierActivatedAt: 0,
      barrierBlocked: false,
      resistUsed: false,
      resistPrepared: false,
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
    if (battleLocked() || isGameplayPaused() || s.enemy || !livingHeroes().length || s.bossDefeated.includes(s.region)) return;
    const delay = immediate ? 50 : Math.max(1200, 4500 - s.region * 220);
    exploreTimer = setTimeout(() => {
      if (battleLocked() || isGameplayPaused() || s.enemy || !livingHeroes().length) return;
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
  function enemyAreaAttack() {
    const enemy = s.enemy;
    if (!enemy || !enemy.boss || enemy.regionIndex !== 7 || battleLocked()) return;
    const living = livingHeroes();
    if (!living.length) { partyWiped(); return; }

    const scene = $("scene");
    if (scene) {
      scene.classList.remove("cataclysm-flash");
      void scene.offsetWidth;
      scene.classList.add("cataclysm-flash");
    }

    if (s.partyBarrierUntil > Date.now()) {
      log("Barrier completely blocked Cataclysmic Pulse.");
      toast("AREA ATTACK BLOCKED BY BARRIER");
      playSkillAnimation("barrier-block");
      showDamage("AREA BLOCKED", "party");
      render(); save();
      return;
    }

    const guarded = s.guardCharges > 0;
    for (const id of living) {
      let amount = Math.floor(
        HEROES[id].maxHp * (0.15 + Math.random() * 0.08) + enemy.damage * 0.25
      );
      if (guarded) amount = Math.ceil(amount * 0.45);
      const before = Number(s.heroHp[id]) || 0;
      s.heroHp[id] = Math.max(0, before - amount);
      showDamage(`PULSE -${amount}`, "party");
      if (before > 0 && s.heroHp[id] <= 0) playHeroFallenAnimation(id);
    }
    if (guarded) s.guardCharges = 0;

    log(`${enemy.name} unleashed Cataclysmic Pulse against the entire party${guarded ? "; Guard softened the impact" : ""}.`);
    announce("Warning: Cataclysmic Pulse is striking the entire party!");
    playImportantSound();
    if (!livingHeroes().length) partyWiped();
    render(); save();
  }

  // ==========================================
  // ENEMY ATTACKS AND ANTI-MAGIC BARRIER
  // ==========================================
  function updateAntiMagicBarrier() {
    const enemy = s.enemy;
    if (!enemy || !enemy.boss || enemy.regionIndex !== 8 || enemy.uniqueAttack !== "antiMagicBarrier") return;
    const now = Date.now();
    enemy.restrictedSkills = Array.isArray(enemy.restrictedSkills) ? enemy.restrictedSkills : [];
    enemy.bossElapsed = Number(enemy.bossElapsed) || 0;
    enemy.barrierElapsed = Number(enemy.barrierElapsed) || 0;

    if (enemy.antiMagicBarrierActive) {
      if (enemy.barrierElapsed >= 6.5) {
        enemy.antiMagicBarrierActive = false;
        enemy.restrictedSkills = [];
        enemy.barrierElapsed = 0;
        enemy.antiMagicBarrierTriggered = false;
        enemy.antiMagicUntil = 0;
        enemy.nextAntiMagicAt = now + 12000;
        log("The Crown Devourer's Anti-Magic Barrier has faded.");
        toast("ANTI-MAGIC BARRIER DISMISSED");
      }
      return;
    }

    if (now < (enemy.nextAntiMagicAt || 0) || enemy.bossElapsed < getBarrierDelaySeconds()) return;

    if (enemy.resistPrepared) {
      enemy.resistPrepared = false;
      enemy.barrierBlocked = true;
      enemy.antiMagicBarrierTriggered = false;
      enemy.nextAntiMagicAt = now + 12000;
      log("Resist blocked the Crown Devourer's Anti-Magic Barrier before it formed.");
      announce("Resist held. The enemy's magic could not take hold.");
      toast("RESIST BLOCKED ANTI-MAGIC");
      render(); save();
      return;
    }

    if (!enemy.antiMagicBarrierTriggered) activateAntiMagicBarrier();
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
    const living = livingHeroes();
    if (!living.length) { partyWiped(); return; }
    for (const id of living) {
      if (!s.enemy) break;
      const hero = HEROES[id]; if (!hero) continue;
      animateHeroAttack(id);
      let amount = hero.damage + s.damageLevel * 4 + (s.recruits.includes("darius") ? 6 : 0);
      if (s.critLevel > 0 && Math.random() < Math.min(0.5, s.critLevel * 0.05)) amount *= 2;
      if (s.partyBuffUntil > Date.now()) amount *= 1.25;
      if (s.recruits.includes("silas")) amount *= 1.15;
      amount *= partyUpgradeMultiplier();
      amount = Math.max(1, Math.floor(amount));
      s.enemy.hp = Math.max(0, s.enemy.hp - amount);
      showDamage(`-${amount}`, "enemy"); enemyHitEffect();
      if (s.enemy.hp <= 0) { defeatEnemy(); return; }
    }
    renderEnemy(); save();
  }
  function showDamage(text, target = "enemy", positive = false) {
    const parent = target === "party"
      ? document.querySelector("#battleParty") || document.querySelector(".party") || $("scene")
      : document.querySelector("#enemyVisual") || document.querySelector(".enemy") || $("scene");
    if (!parent) return;
    const damage = document.createElement("span");
    damage.className = `damage ${target === "party" ? "party-damage" : "enemy-damage"} ${positive ? "positive" : ""}`;
    damage.textContent = String(text);
    damage.setAttribute("aria-hidden", "true");
    damage.style.left = `${25 + Math.random() * 40}%`;
    damage.style.top = `${20 + Math.random() * 35}%`;
    parent.appendChild(damage);
    setTimeout(() => damage.remove(), 1100);
  }
  function updateCombat(delta) {
    if (!s.enemy || battleLocked() || isGameplayPaused()) return;
    const enemy = s.enemy;
    if (enemy.boss) {
      enemy.bossElapsed = (Number(enemy.bossElapsed) || 0) + delta;
      enemy.specialAttackClock = (Number(enemy.specialAttackClock) || 0) + delta;
    }
    if (enemy.antiMagicBarrierActive) {
      enemy.barrierElapsed = (Number(enemy.barrierElapsed) || 0) + delta;
    }
    updateAntiMagicBarrier();
    if (!s.enemy) return;
    if (s.enemy.boss && s.enemy.regionIndex === 8) bossSpecialClock += delta;
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
      if (!isAnalistUnlocked()) return toast("Analist is not available yet. Evolve Great Sage first.");
      if (pendingAnalistApproval) return answerAnalistPrompt(true);
      return startAnalistAnalysis();
    }
    if (key === "resist") return castResist();
    if (!(key in SKILL_MANA_COST)) return;
    if (!isSkillUnlocked(key)) return toast(`${key === "barrier" ? "Barrier" : key} is not unlocked yet.`);
    if (battleLocked()) return toast(s.needsHospital ? "Pay the hospital fee first." : "Battles are paused during recovery.");
    if (!livingHeroes().length) return toast("Your party has fallen. Visit the hospital.");
    if ((s.cooldowns[key] || 0) > 0) return toast(`Skill recharging: ${Math.ceil(s.cooldowns[key])}s`);
    const requiresEnemy = ["slash", "burst", "meteor", "frost"].includes(key);
    if (requiresEnemy && !s.enemy) return toast("There is no enemy to target.");
    if (["heal", "phoenix"].includes(key) && !s.heroes.includes("celeste") && !s.heroes.includes("sage")) return toast("You need a healer in your party to use this skill.");
    if (key === "phoenix" && !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)) return toast("There is no fallen hero to revive.");

    const antiMagicBlocked = isAntiMagicBarrierActive() && isSkillSealed(key);
    const partyBarrierActive = s.partyBarrierUntil > Date.now();
    if (antiMagicBlocked && !partyBarrierActive) return toast(`${key.toUpperCase()} is sealed by the Anti-Magic Barrier! Use Barrier to force it through at 50% effect.`);
    const antiMagicEffectiveness = antiMagicBlocked && partyBarrierActive ? 0.5 : 1;
    const manaCost = SKILL_MANA_COST[key];
    if (s.mana < manaCost) return toast(`Not enough mana. Need ${manaCost}.`);
    s.mana -= manaCost;
    playSkillAnimation(key);

    const partyBonus = partyUpgradeMultiplier();
    const recruitBonus = s.recruits.includes("silas") ? 1.15 : 1;
    const skillMultiplier = partyBonus * recruitBonus * antiMagicEffectiveness;
    const healingBonus = (s.recruits.includes("elise") ? 1.2 : 1) * partyBonus;
    const startCooldown = (seconds) => { s.cooldowns[key] = seconds; };
    const damageEnemy = (base) => {
      if (!s.enemy) return;
      const damage = Math.max(1, Math.floor(base * skillMultiplier));
      s.enemy.hp = Math.max(0, s.enemy.hp - damage);
      showDamage(`-${damage}`, "enemy"); enemyHitEffect();
      log(`${key.toUpperCase()} deals ${fmt(damage)} damage${antiMagicEffectiveness < 1 ? " at 50% effectiveness through Barrier" : ""}.`);
      if (s.enemy.hp <= 0) defeatEnemy();
    };
    if (key === "slash") { damageEnemy(45 + s.pickaxe * 5 + s.region * 12); startCooldown(8); }
    else if (key === "burst") { damageEnemy(72 + s.region * 20); startCooldown(14); }
    else if (key === "guard") {
      const healAmount = Math.floor(12 * partyBonus * antiMagicEffectiveness);
      livingHeroes().forEach((id) => { s.heroHp[id] = Math.min(HEROES[id].maxHp, (s.heroHp[id] || 0) + healAmount); });
      s.guardCharges = antiMagicEffectiveness < 1 ? 1 : (s.partyUpgradeApplied ? 3 : 2);
      startCooldown(12); showDamage(`AEGIS +${healAmount}`, "party", true);
      log(`Aegis Guard prepared ${s.guardCharges} guard charge(s).`);
    } else if (key === "heal") {
      let totalHealing = 0;
      livingHeroes().forEach((id) => {
        const amount = Math.floor(35 * healingBonus * antiMagicEffectiveness);
        const before = Number(s.heroHp[id]) || 0;
        s.heroHp[id] = Math.min(HEROES[id].maxHp, before + amount);
        totalHealing += s.heroHp[id] - before;
      });
      startCooldown(18); showDamage(`HEAL +${totalHealing}`, "party", true);
      log(`Healing Wave restores ${fmt(totalHealing)} HP${antiMagicEffectiveness < 1 ? " at 50% effectiveness through Barrier" : ""}.`);
    } else if (key === "meteor") { damageEnemy(130 + s.region * 32); startCooldown(25); }
    else if (key === "frost") {
      damageEnemy(65 + s.region * 14);
      if (s.enemy) { const duration = Math.floor(8000 * antiMagicEffectiveness); s.frostUntil = Date.now() + duration; log(`Frost Nova slows the enemy for ${fmt(duration / 1000)} seconds.`); }
      startCooldown(18);
    } else if (key === "phoenix") {
      const fallen = s.heroes.find((id) => (s.heroHp[id] || 0) <= 0);
      if (!fallen) { s.mana = Math.min(maxMana(), s.mana + manaCost); return toast("There is no fallen hero to revive."); }
      s.heroHp[fallen] = Math.max(1, Math.min(HEROES[fallen].maxHp, Math.floor(HEROES[fallen].maxHp * 0.6 * skillMultiplier)));
      startCooldown(40); playHeroReviveAnimation(fallen); showDamage("REVIVE", "party", true);
      announce(`${HEROES[fallen].name} has been revived.`); log(`${HEROES[fallen].name} returns with ${Math.floor(60 * partyBonus * antiMagicEffectiveness)}% revival health.`);
    } else if (key === "barrier") {
      // Exactly 5 seconds; area attacks are completely blocked and normal hits are reduced 75%.
      s.partyBarrierUntil = Date.now() + 5000; startCooldown(22); showDamage("BARRIER", "party", true);
      log("Barrier protects the entire party for five seconds, fully blocking area attacks and reducing normal attacks by 75%."); toast("BARRIER ACTIVE · 5 SECONDS");
    }
    render(); save();
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

    const analistButton = $("analistBtn");
    if (analistButton) {
      analistButton.hidden = !isAnalistUnlocked();
      analistButton.disabled = isGameplayPaused() || !s.enemy;
    }
    const resistButton = $("resistBtn");
    if (resistButton) {
      resistButton.hidden = !s.resistUnlocked;
      resistButton.disabled = isGameplayPaused() || battleLocked() || !s.enemy || s.mana < SKILL_MANA_COST.resist || (s.cooldowns.resist || 0) > 0;
      const resistLabel = $("cd-resist");
      if (resistLabel) resistLabel.textContent = s.enemy && s.enemy.resistUsed ? "USED" : (s.cooldowns.resist || 0) > 0 ? `${Math.ceil(s.cooldowns.resist)}s` : s.mana < SKILL_MANA_COST.resist ? `NEED ${SKILL_MANA_COST.resist} M` : "READY";
    }

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
    playSkillAnimation("partyUpgrade");

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
    showHospitalPrompt();

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
    // This may be called only after the 60-second timer has expired.
    if (s.needsHospital || !s.healingUntil) return;
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

        announce(`A new ally has joined your party: ${hero.name}.`);
        queueUnlockReveal({ category: "NEW HERO", title: `${hero.name} joins the party`, imageSrc: hero.portrait, description: `${hero.role}. ${hero.tagline}`, speech: `New hero unlocked: ${hero.name}. ${hero.role}. ${hero.tagline}` });
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
        setTimeout(triggerRaphaelEvolution, 1200);
      }

      // Clearing the seventh guardian triggers the permanent
      // party upgrade while entering Cave 8.
      if (clearedRegion === 6) {
        activatePartyUpgrade();
        queueUnlockReveal({ category: "PERMANENT UPGRADE", title: "Crystal Ascendance", symbol: "✦", description: "Party health, damage, skill effects, snack effects, and resource yields are permanently increased by 20%.", speech: "Permanent party upgrade unlocked. Health, damage, skill effects, snacks, and resource gains have improved by 20 percent." });
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

          queueUnlockReveal({ category: "NEW SKILL", title: "Barrier", symbol: "⬡", description: "Costs 75 mana. Protects the party for five seconds, fully blocks area attacks, and reduces normal damage by 75%. It allows skills sealed by Anti-Magic through at 50% effect.", speech: "New skill unlocked: Barrier. It costs 75 mana, lasts five seconds, fully blocks area attacks, reduces normal damage by 75 percent, and lets Anti-Magic-sealed skills through at half effect." });
          log("Barrier unlocked on entering Cave 10.");
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
    if (!living.length) { partyWiped(); return; }
    const barrierActive = s.partyBarrierUntil > Date.now();
    if (barrierActive && areaAttack) {
      log("Barrier completely blocked the area attack.");
      showDamage("AREA BLOCKED", "party");
      playSkillAnimation("barrier-block");
      render();
      save();
      return;
    }
    let damage = Math.max(0, Math.floor(Number(amount) || 0));
    if (barrierActive && !areaAttack) {
      damage = Math.floor(damage * 0.25);
      log("Barrier reduced a normal attack by 75%.");
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
        const before = Number(s.heroHp[id]) || 0;
        s.heroHp[id] = Math.max(0, before - damage);
        showDamage(`-${damage}`, "party");
        if (before > 0 && s.heroHp[id] <= 0) playHeroFallenAnimation(id);
      }
      log(`An area attack hits the party for ${damage} damage each.`);
    } else {
      // First still-standing hero in recruitment order is always in front.
      const targetId = living[0];
      const before = Number(s.heroHp[targetId]) || 0;
      s.heroHp[targetId] = Math.max(0, before - damage);
      showDamage(`-${damage}`, "party");
      log(`${s.enemy ? s.enemy.name : "The enemy"} hits ${HEROES[targetId].name} for ${damage} damage${s.heroHp[targetId] <= 0 ? " — hero down!" : "."}`);
      if (before > 0 && s.heroHp[targetId] <= 0) {
        playHeroFallenAnimation(targetId);
        if (livingHeroes().length) showPhoenixPrompt(targetId);
      }
    }
    if (!livingHeroes().length) partyWiped();
    render();
    save();
  }

  // ==========================================
  // PASSIVE INCOME AND MANA REGENERATION
  // ==========================================
  function updatePassiveResources(delta) {
    if (battleLocked() || isGameplayPaused()) return;
    const multiplier = partyUpgradeMultiplier();
    if (s.recruits.includes("tessa")) s.gold += 0.8 * delta * multiplier;
    if (s.recruits.includes("borin")) s.gold += 1.3 * delta * multiplier;
    if (s.recruits.includes("kellan")) s.crystals += 0.3 * delta * multiplier;
    s.mana = Math.min(maxMana(), s.mana + manaRate() * delta * multiplier);
    if (s.partyBuffUntil && s.partyBuffUntil <= Date.now()) { s.partyBuffUntil = 0; log("Moonberry damage boost has worn off."); }
    if (s.manaBuffUntil && s.manaBuffUntil <= Date.now()) { s.manaBuffUntil = 0; log("Astral Tea's mana boost has worn off."); }
    if (s.frostUntil && s.frostUntil <= Date.now()) { s.frostUntil = 0; log("Frost Bind has worn off."); }
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
        setTimeout(() => playHeroReviveAnimation("elowen"), 0);

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
    setTimeout(() => playHeroReviveAnimation(target), 0);

    announce(`${HEROES[target].name} has been revived.`);

    render();
    save();
  }

  // ==========================================
  // AUTOPILOT CONTROLS
  // ==========================================
  function activateBattleAutopilot() {
    if (battleLocked()) return toast("Autopilot cannot start during recovery.");
    if (!livingHeroes().length) return toast("Your party has fallen.");
    startBattleAutopilot(); render(); save();
  }
  function activateKingdomAutopilot() {
    if (!s.autoPilotUnlocked) return toast("Kingdom Autopilot is still locked.");
    if (battleLocked()) return toast("Autopilot cannot start during recovery.");
    if (!livingHeroes().length) return toast("Your party has fallen.");
    startKingdomAutopilot(); render(); save();
  }
  function stopAutopilot() {
    stopAllAutopilots(); render(); save();
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
      checkPartyHealthWarning();

      const celesteAlive = s.heroes.includes("celeste") && livingHeroes().includes("celeste");
      if (celesteAlive) {
        supportClock += delta;
        if (supportClock >= 10) {
          supportClock -= 10;
          const amount = Math.floor((7 + (s.recruits.includes("elise") ? 4 : 0)) * partyUpgradeMultiplier());
          let healedAnyone = false;
          for (const id of livingHeroes()) {
            const before = Number(s.heroHp[id]) || 0;
            const after = Math.min(HEROES[id].maxHp, before + amount);
            if (after > before) { s.heroHp[id] = after; showDamage(`+${after - before}`, "party", true); healedAnyone = true; }
          }
          if (healedAnyone) { log(`Celeste's healing aura restores up to ${amount} HP to every living hero.`); playSkillAnimation("heal"); }
        }
      } else {
        supportClock = 0;
      }


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
    resettingGame = true;

    clearTimeout(exploreTimer);
    clearTimeout(toastTimer);
    clearTimeout(commandIdleTimer);
    clearTimeout(recognitionRestartTimer);
    clearTimeout(unlockRevealTimer);
    clearTimeout(analistRevealTimer);
    clearTimeout(resistRevealTimer);
    clearTimeout(exploreTimer);
    clearTimeout(toastTimer);
    clearTimeout(commandIdleTimer);
    clearTimeout(recognitionRestartTimer);
    clearTimeout(unlockRevealTimer);
    clearTimeout(analistRevealTimer);

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
      resettingGame = false;
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
  // RESTORED HERO / SKILL ANIMATIONS
  // ==========================================
  function animateHeroAttack(id) {
    const party = $("battleParty");
    const hero = party && party.querySelector(`[data-hero-id="${id}"]`);
    if (!hero || hero.classList.contains("fallen")) return;
    const bow = ["liria", "darius_hero"].includes(id);
    const sword = ["aiden", "ragnar", "kael_rogue", "tessa_hero", "borin_hero"].includes(id);
    const custom = {
      tessa_hero: "attack-miner", borin_hero: "attack-stoneguard",
      iris_hero: "attack-mystic", elise_hero: "attack-spirit",
      elowen: "attack-spirit", celeste: "attack-support", sage: "attack-spirit"
    }[id];
    const cls = custom || (bow ? "attack-bow" : sword ? "attack-sword" : "attack-cast");
    hero.classList.remove("attack-bow", "attack-sword", "attack-cast", "attack-support", "attack-spirit", "attack-miner", "attack-stoneguard", "attack-mystic");
    void hero.offsetWidth;
    hero.classList.add(cls);
    setTimeout(() => hero.classList.remove(cls), 560);
    if (bow) launchArrow(hero);
    if (sword) launchSwordSlash();
    if (id === "iris_hero") launchMagicBolt(hero);
  }
  function launchArrow(hero) {
    const scene = $("scene"), enemy = $("enemyVisual");
    if (!scene || !hero || !enemy || enemy.classList.contains("hidden")) return;
    const a = scene.getBoundingClientRect(), h = hero.getBoundingClientRect(), e = enemy.getBoundingClientRect();
    const sx = h.left + h.width * .72 - a.left, sy = h.top + h.height * .38 - a.top;
    const ex = e.left + e.width * .24 - a.left, ey = e.top + e.height * .42 - a.top;
    const el = document.createElement("span");
    el.className = "attack-projectile arrow-projectile";
    el.style.left = `${sx}px`; el.style.top = `${sy}px`;
    el.style.setProperty("--travel-x", `${ex - sx}px`);
    el.style.setProperty("--travel-y", `${ey - sy}px`);
    el.style.setProperty("--angle", `${Math.atan2(ey - sy, ex - sx) * 180 / Math.PI}deg`);
    scene.appendChild(el); setTimeout(() => el.remove(), 540);
  }
  function launchSwordSlash() {
    const scene = $("scene"), enemy = $("enemyVisual");
    if (!scene || !enemy || enemy.classList.contains("hidden")) return;
    const a = scene.getBoundingClientRect(), e = enemy.getBoundingClientRect();
    const el = document.createElement("span"); el.className = "attack-projectile sword-slash";
    el.style.left = `${e.left - a.left + e.width * .18 - 25}px`;
    el.style.top = `${e.top - a.top + e.height * .38 - 25}px`;
    scene.appendChild(el); setTimeout(() => el.remove(), 440);
  }
  function launchMagicBolt(hero) {
    const scene = $("scene"), enemy = $("enemyVisual");
    if (!scene || !hero || !enemy || enemy.classList.contains("hidden")) return;
    const a = scene.getBoundingClientRect(), h = hero.getBoundingClientRect(), e = enemy.getBoundingClientRect();
    const sx = h.left + h.width * .72 - a.left, sy = h.top + h.height * .38 - a.top;
    const ex = e.left + e.width * .24 - a.left, ey = e.top + e.height * .42 - a.top;
    const el = document.createElement("span"); el.className = "attack-projectile magic-bolt";
    el.style.left = `${sx}px`; el.style.top = `${sy}px`;
    el.style.setProperty("--travel-x", `${ex - sx}px`);
    el.style.setProperty("--travel-y", `${ey - sy}px`);
    scene.appendChild(el); setTimeout(() => el.remove(), 480);
  }
  function playHeroFallenAnimation(id) {
    const hero = document.querySelector(`#battleParty [data-hero-id="${id}"]`);
    if (hero) hero.classList.add("fallen");
  }
  function playHeroReviveAnimation(id) {
    setTimeout(() => {
      const hero = document.querySelector(`#battleParty [data-hero-id="${id}"]`);
      if (!hero) return;
      hero.classList.remove("fallen", "hero-revive-glow");
      void hero.offsetWidth; hero.classList.add("hero-revive-glow");
      setTimeout(() => hero.classList.remove("hero-revive-glow"), 1500);
    }, 0);
  }
  function playSkillAnimation(key) {
    const scene = $("scene"); if (!scene) return;
    const effects = {
      slash: ["RADIANT SLASH", "✦"], burst: ["ARCANE BURST", "✧"],
      guard: ["AEGIS GUARD", "⬡"], heal: ["HEALING WAVE", "✚"],
      meteor: ["METEOR RAIN", "☄"], frost: ["FROST NOVA", "❄"],
      phoenix: ["PHOENIX BLESSING", "♨"], resist: ["RESIST", "⬡"],
      barrier: ["BARRIER", "⬡"], "barrier-block": ["AREA BLOCKED", "⬡"],
      "anti-magic": ["ANTI-MAGIC BARRIER", "⊘"],
      crownfall: ["CROWNFALL RUPTURE", "♛"], critical: ["CRITICAL HIT", "✹"],
      partyUpgrade: ["CRYSTAL ASCENDANCE", "✦"]
    };
    const info = effects[key]; if (!info) return;
    scene.classList.remove("skill-scene-flash", `skill-scene-${key}`);
    void scene.offsetWidth; scene.classList.add("skill-scene-flash", `skill-scene-${key}`);
    const effect = document.createElement("div");
    effect.className = `skill-vfx skill-vfx-${key}`;
    effect.setAttribute("aria-hidden", "true");
    effect.innerHTML = `<span class="skill-vfx-symbol">${info[1]}</span><b>${info[0]}</b>`;
    scene.appendChild(effect); setTimeout(() => effect.remove(), key === "meteor" ? 1500 : 1150);
    setTimeout(() => scene.classList.remove("skill-scene-flash", `skill-scene-${key}`), 1250);
    if (key === "heal" || key === "phoenix") {
      document.querySelectorAll("#battleParty .battle-hero:not(.fallen)").forEach((hero) => {
        hero.classList.remove("hero-heal-glow"); void hero.offsetWidth; hero.classList.add("hero-heal-glow");
        setTimeout(() => hero.classList.remove("hero-heal-glow"), 1150);
      });
    }
    if (key === "guard") {
      const party = $("battleParty"); if (party) { party.classList.add("party-guard-glow"); setTimeout(() => party.classList.remove("party-guard-glow"), 1050); }
    }
    if (key === "barrier") {
      const party = $("battleParty"); if (party) { party.classList.add("party-barrier-glow"); setTimeout(() => party.classList.remove("party-barrier-glow"), 5200); }
    }
  }

  function enemyHitEffect() {
    const enemy = $("enemyVisual"); if (!enemy) return;
    enemy.classList.remove("hit"); void enemy.offsetWidth; enemy.classList.add("hit");
    setTimeout(() => enemy.classList.remove("hit"), 380);
  }

  function triggerPartyAttackAnimations() {
    // The per-hero animations run in partyAttack; this is kept for older callers.
    const party = $("battleParty");
    if (party) { party.classList.remove("attacking"); void party.offsetWidth; party.classList.add("attacking"); setTimeout(() => party.classList.remove("attacking"), 380); }
  }

function assistantWakeName() {
    return s.raphaelEvolved ? "Raphael" : "Great Sage";
  }
  function assistantWakePattern() {
    return s.raphaelEvolved
      ? /\b(?:hey\s+)?(?:raphael|rafael|rafayel|raphaell|raphiel)\b/i
      : /\b(?:hey\s+)?(?:great\s+sage|sage)\b/i;
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
    if (!isSkillUnlocked(key)) return "That ability is not available yet.";
    if (battleLocked()) return s.needsHospital ? "The party needs hospital treatment first." : "The party is still recovering.";
    if (!livingHeroes().length) return "No heroes are standing.";
    const partyBarrierActive = s.partyBarrierUntil > Date.now();
    if (isAntiMagicBarrierActive() && isSkillSealed(key) && !partyBarrierActive) return "The enemy has sealed that ability. Use Barrier to force it through at 50 percent effectiveness.";
    if (s.mana < SKILL_MANA_COST[key]) return `You need ${SKILL_MANA_COST[key]} mana.`;
    if ((s.cooldowns[key] || 0) > 0) return `${skillVoiceLabel(key)} is recharging for ${Math.ceil(s.cooldowns[key])} more seconds.`;
    if (["slash", "burst", "meteor", "frost"].includes(key) && !s.enemy) return "There is no enemy to attack right now.";
    if (["heal", "phoenix"].includes(key) && !s.heroes.some((id) => ["celeste", "sage"].includes(id))) return "Healer support has not joined the party yet.";
    if (key === "phoenix" && !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)) return "There is no fallen hero to revive.";
    if (key === "resist" && (!s.enemy || s.enemy.uniqueAttack !== "antiMagicBarrier")) return "Resist can only counter the special barrier ability.";
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
      { kind: "upgrade", key: "mana", label: "maximum mana", patterns: [/\bupgrade (?:my |the )?(?:maximum|max) mana\b/gi, /\bmana upgrade\b/gi, /\bincrease (?:my )?mana capacity\b/gi] },
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
    if (key === "analist") return isAnalistUnlocked() && Boolean(s.enemy) && !battleLocked() && !isGameplayPaused();
    if (!(key in SKILL_MANA_COST) || !isSkillUnlocked(key)) return false;
    if (battleLocked() || isGameplayPaused() || !livingHeroes().length) return false;
    if (s.mana < SKILL_MANA_COST[key] || (s.cooldowns[key] || 0) > 0) return false;
    const barrierActive = s.partyBarrierUntil > Date.now();
    const sealedByAntiMagic = isAntiMagicBarrierActive() && isSkillSealed(key);
    if (sealedByAntiMagic && !barrierActive) return false;
    if (key === "resist") {
      if (!s.enemy || s.enemy.uniqueAttack !== "antiMagicBarrier" || s.enemy.resistUsed) return false;
      if (isAntiMagicBarrierActive() && Number(s.enemy.barrierElapsed || 0) >= 5) return false;
    }
    if (["slash", "burst", "meteor", "frost"].includes(key) && !s.enemy) return false;
    if (["heal", "phoenix"].includes(key) && !s.heroes.some((id) => ["celeste", "sage"].includes(id))) return false;
    if (key === "phoenix" && !s.heroes.some((id) => (s.heroHp[id] || 0) <= 0)) return false;
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
    if (!enemy || enemy.uniqueAttack !== "antiMagicBarrier" || enemy.antiMagicBarrierTriggered) return;

    enemy.antiMagicBarrierTriggered = true;
    enemy.barrierElapsed = 0;
    enemy.barrierActivatedAt = Date.now();

    if (enemy.resistPrepared) {
      enemy.antiMagicBarrierActive = false;
      enemy.resistPrepared = false;
      enemy.barrierBlocked = true;
      enemy.nextAntiMagicAt = Date.now() + 12000;
      enemy.antiMagicBarrierTriggered = false;
      log(`${enemy.name}'s magic was stopped by Resist.`);
      announce("Resist held. The enemy's magic could not take hold.");
      toast("RESIST BLOCKED ANTI-MAGIC");
      render();
      save();
      return;
    }

    enemy.antiMagicBarrierActive = true;
    enemy.antiMagicUntil = Date.now() + 6500;
    enemy.nextAntiMagicAt = enemy.antiMagicUntil;
    enemy.restrictedSkills = availableCombatSkills().filter((key) => !["resist", "barrier", "analist"].includes(key));

    playSkillAnimation("anti-magic");
    cancelSageSpeech(true);

    if (isAnalistUnlocked()) {
      pendingAnalistApproval = true;
      currentPrompt = { type: "analist" };
      updateSageMessage("Notice: a hostile Anti-Magic Barrier is active. Would you like me to use Analist?");
      announce("Notice: a hostile Anti-Magic Barrier is active. Would you like me to use Analist?");
    } else {
      pendingAnalistApproval = false;
      announce("Notice: an unfamiliar hostile effect is active. Combat skills are sealed; snacks still work.");
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

    if (isAntiMagicBarrierActive() && s.partyBarrierUntil <= now) {
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

  document.addEventListener("keydown", (event) => {
    if (event.repeat || !event.key || ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if (isGameplayPaused()) return;
    const shortcuts = { q: "slash", w: "burst", e: "guard", r: "heal", t: "meteor", y: "frost", u: "phoenix", i: "analist", o: "resist", p: "barrier" };
    const key = shortcuts[event.key.toLowerCase()];
    if (key) skill(key);
  });

function payHeal() { return payHospitalFee(); }

  function upgrade(kind) {
    if (kind === "pickaxe") return upgradePickaxe();
    if (kind === "speed") return upgradeSpeed();
    if (kind === "damage") return upgradeDamage();
    if (kind === "crit") return upgradeCrit();
    if (kind === "mana" || kind === "max mana" || kind === "maximum mana") return upgradeMaxMana();
    return false;
  }

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

    if (s.autoPilotUnlocked && !s.raphaelEvolved) setTimeout(triggerRaphaelEvolution, 600);
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