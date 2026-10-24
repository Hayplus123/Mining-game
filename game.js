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
    }
  };

  // ==========================================
  // CAVES AND ENEMIES
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
    }
  ];

  // ==========================================
  // RECRUITABLE HELPERS
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
      desc: "+25 maximum mana and faster mana regeneration"
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
    }
  ];

  // Mana required to use each skill.
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

    // Shared mana pool.
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
      astralTea: 1
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
  // LOAD AND MIGRATE SAVE
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

    // Old versions may not have stored mana yet.
    if (!Number.isFinite(Number(stored.mana))) {
      state.mana = 100;
    }

    state.mana = Math.max(
      0,
      Math.min(125, Number(state.mana) || 0)
    );

    // Restore previously earned heroes.
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
      Math.min(
        regions.length - 1,
        Number(state.region) || 0
      )
    );

    state.heroes.forEach((id) => {
      if (!HEROES[id]) return;

      if (!Number.isFinite(Number(state.heroHp[id]))) {
        state.heroHp[id] = HEROES[id].maxHp;
      }

      state.heroHp[id] = Math.max(
        0,
        Math.min(
          HEROES[id].maxHp,
          Number(state.heroHp[id])
        )
      );
    });

    return state;
  }

  let s = loadGame();
  let logs = Array.isArray(s.lastLog)
    ? s.lastLog
    : [];

  // ==========================================
  // TIMERS
  // ==========================================

  let partyClock = 0;
  let enemyClock = 0;
  let supportClock = 0;
  let lastTick = performance.now();
  let renderClock = 0;
  let exploreTimer = 0;
  let toastTimer = 0;

  // Great Sage voice queue.
  const speechQueue = [];
  let speechBusy = false;
  let sageEnabled = true;
  let currentUtterance = null;

  // ==========================================
  // GENERAL HELPERS
  // ==========================================

  const fmt = (n) =>
    Math.max(
      0,
      Math.floor(Number(n) || 0)
    ).toLocaleString();

  const region = () =>
    regions[s.region] || regions[regions.length - 1];

  const bossDone = () =>
    s.bossDefeated.includes(s.region);

  const livingHeroes = () =>
    s.heroes.filter((id) => (s.heroHp[id] || 0) > 0);

  const isRecovering = () =>
    s.healingUntil > Date.now();

  const battleLocked = () =>
    s.needsHospital || isRecovering();

  const maxMana = () =>
    100 + (s.recruits.includes("iris") ? 25 : 0);

  const manaRate = () => {
    let rate = 1;

    // Iris improves mana regeneration.
    if (s.recruits.includes("iris")) {
      rate += 0.75;
    }

    // Astral Tea temporarily multiplies regeneration.
    if (s.manaBuffUntil > Date.now()) {
      rate *= 3;
    }

    return rate;
  };

  const pInterval = () =>
    Math.max(3.5, 6 - s.speedLevel * 0.5);

  const eInterval = () =>
    Math.max(
      2.2,
      5 - s.region * 0.6 - (s.bossMode ? 0.45 : 0)
    ) *
    (s.frostUntil > Date.now() ? 1.4 : 1);

  const pickCost = () =>
    Math.floor(35 * Math.pow(1.8, s.pickaxe - 1));

  const speedCost = () =>
    Math.floor(40 * Math.pow(1.9, s.speedLevel));

  const damageCost = () =>
    Math.floor(60 * Math.pow(1.8, s.damageLevel));

  const critCost = () =>
    Math.floor(50 * Math.pow(1.85, s.critLevel));

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
  // GREAT SAGE TEXT-TO-SPEECH
  // ==========================================

  function updateSageStatus(text) {
    const status = $("sageStatus");
    if (status) status.textContent = text;
  }

  function updateSageMessage(text) {
    const message = $("sageMessage");
    if (message) message.textContent = text;
  }

  function pulseSageWord() {
    const orb = $("sageOrb");
    if (!orb) return;

    orb.classList.remove("word-pulse");

    // Restart the small pulse for each detected spoken word.
    void orb.offsetWidth;

    orb.classList.add("word-pulse");
  }

  function processSpeechQueue() {
    if (!sageEnabled || speechBusy || !speechQueue.length) {
      return;
    }

    if (!("speechSynthesis" in window) ||
        !("SpeechSynthesisUtterance" in window)) {
      updateSageStatus("VOICE UNAVAILABLE");
      return;
    }

    const message = speechQueue.shift();

    speechBusy = true;

    const orb = $("sageOrb");

    if (orb) {
      orb.classList.add("is-speaking");
      orb.classList.remove("is-muted");
    }

    updateSageStatus("ANALYSING");
    updateSageMessage(message);

    const utterance = new SpeechSynthesisUtterance(message);

    // A calm, precise, neutral synthesized voice.
    // This does not copy a specific actor's voice.
    utterance.lang = "en-US";
    utterance.rate = 0.93;
    utterance.pitch = 0.86;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const preferredVoice = voices.find((voice) =>
      /^en(-|_)(US|GB)/i.test(voice.lang) &&
      /natural|enhanced|neural/i.test(voice.name)
    );

    const englishVoice = preferredVoice ||
      voices.find((voice) =>
        /^en(-|_)/i.test(voice.lang)
      );

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    currentUtterance = utterance;

    utterance.onstart = () => {
      updateSageStatus("SPEAKING");
    };

    utterance.onboundary = (event) => {
      if (event.name === "word" || event.charIndex >= 0) {
        pulseSageWord();
      }
    };

    utterance.onend = () => {
      speechBusy = false;
      currentUtterance = null;

      const currentOrb = $("sageOrb");

      if (currentOrb) {
        currentOrb.classList.remove(
          "is-speaking",
          "word-pulse"
        );
      }

      updateSageStatus(
        sageEnabled ? "VOICE ON" : "VOICE MUTED"
      );

      // Speak the next queued message only after
      // the current utterance has finished.
      window.setTimeout(processSpeechQueue, 180);
    };

    utterance.onerror = () => {
      speechBusy = false;
      currentUtterance = null;

      const currentOrb = $("sageOrb");

      if (currentOrb) {
        currentOrb.classList.remove(
          "is-speaking",
          "word-pulse"
        );
      }

      updateSageStatus(
        sageEnabled ? "VOICE ON" : "VOICE MUTED"
      );

      window.setTimeout(processSpeechQueue, 300);
    };

    window.speechSynthesis.speak(utterance);
  }

  function announce(message) {
    // Update the visible Sage message immediately.
    updateSageMessage(message);

    // Add it to a single-file queue.
    speechQueue.push(message);

    processSpeechQueue();
  }

  function toggleSage() {
    if (!("speechSynthesis" in window)) {
      toast("This browser does not support speech synthesis.");
      updateSageStatus("VOICE UNAVAILABLE");
      return;
    }

    sageEnabled = !sageEnabled;

    const orb = $("sageOrb");

    if (!sageEnabled) {
      window.speechSynthesis.cancel();

      speechBusy = false;
      currentUtterance = null;

      if (orb) {
        orb.classList.remove(
          "is-speaking",
          "word-pulse"
        );
        orb.classList.add("is-muted");
      }

      updateSageStatus("VOICE MUTED");
      toast("Great Sage voice muted.");
      return;
    }

    if (orb) {
      orb.classList.remove("is-muted");
    }

    updateSageStatus("VOICE ON");
    toast("Great Sage voice activated.");

    if (speechQueue.length === 0) {
      announce("Great Sage online. Awaiting your command.");
    } else {
      processSpeechQueue();
    }
  }

  // ==========================================
  // LOG AND POPUP MESSAGES
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
    }
  }

  function canStartBattle() {
    if (battleLocked()) {
      toast(
        s.needsHospital
          ? "Pay the hospital fee before battles can resume."
          : "The party is recovering; battles are paused."
      );
      return false;
    }

    if (!livingHeroes().length) {
      toast("Your party needs treatment before continuing.");
      return false;
    }

    return true;
  }

  // ==========================================
  // AUTOMATIC EXPLORATION
  // ==========================================

  function scheduleExplore(
    delay = 10000 + Math.random() * 10000
  ) {
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

      log(`${r.boss} emerges from the ancient seal.`);
      toast(`${r.boss} challenges your party!`);
    } else {
      const hp = Math.floor(
        r.hp * scale * (0.85 + Math.random() * 0.3)
      );

      s.enemy = {
        name: r.enemy,
        type: r.type,
        hp,
        maxHp: hp,
        damage: Math.floor(
          r.damage * (1 + s.region * 0.25)
        ),
        gold: Math.floor(
          r.gold * (1 + s.region * 0.35)
        ),
        crystals: Math.floor(
          r.crystals * (1 + s.region * 0.35)
        ),
        sprite: r.sprite,
        boss: false
      };

      log(`${r.enemy} appears in the cavern!`);
      toast("An enemy blocks the path!");
    }

    partyClock = 0;
    enemyClock = 0;

    render();
    save();
  }

  function explore() {
    if (s.enemy || !canStartBattle()) return;

    clearTimeout(exploreTimer);

    if (Math.random() < 0.68) {
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
      s.ore += ore;
      s.gold += Math.floor(crystals * 0.7);

      log(
        `Exploration found ${crystals} crystals and ${ore} ore.`
      );

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
      Math.floor(
        (s.pickaxe * 3 + Math.random() * s.pickaxe) * bonus
      )
    );

    const oreAmount =
      1 +
      Math.floor(s.pickaxe / 3) +
      (s.recruits.includes("juno") ? 1 : 0);

    s.crystals += amount;
    s.ore += oreAmount;
    s.gold += Math.max(1, Math.floor(amount / 2));

    log(`Mining yielded ${amount} crystals and ${oreAmount} ore.`);

    showDamage("+" + amount, "party", true);
    toast(`Mined ${amount} crystals.`);

    render();
    save();
  }

  // ==========================================
  // PARTY COMBAT
  // ==========================================

  function partyAttack() {
    if (!s.enemy || battleLocked()) return;

    const active = livingHeroes();

    if (!active.length) {
      partyWiped();
      return;
    }

    for (const id of active) {
      if (!s.enemy) break;

      const h = HEROES[id];

      let amount =
        h.damage +
        (s.pickaxe - 1) * 2 +
        s.damageLevel * 4 +
        (s.recruits.includes("darius") ? 6 : 0);

      if (s.partyBuffUntil > Date.now()) {
        amount *= 1.25;
      }

      if (s.recruits.includes("silas")) {
        amount *= 1.15;
      }

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

      enemyHitEffect();

      if (s.enemy.hp <= 0) {
        defeatEnemy();
        break;
      }
    }

    render();
    save();
  }

  function enemyAttack() {
    if (!s.enemy || battleLocked()) return;

    const targetOrder = [
      "aiden",
      "ragnar",
      "kael_rogue",
      "seraphine",
      "liria",
      "celeste",
      "sage"
    ];

    const targetId = targetOrder.find(
      (id) =>
        s.heroes.includes(id) &&
        (s.heroHp[id] || 0) > 0
    );

    if (!targetId) {
      partyWiped();
      return;
    }

    const target = HEROES[targetId];

    let amount = Math.max(
      1,
      Math.floor(
        s.enemy.damage * (0.82 + Math.random() * 0.36)
      )
    );

    if (s.guardCharges > 0) {
      amount = Math.ceil(amount * 0.45);
      s.guardCharges -= 1;

      log("Aegis Guard absorbed part of the incoming hit.");
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

    // Notify Great Sage when a hero falls.
    if (s.heroHp[targetId] === 0) {
      announce(`Notice: ${target.name} is down.`);
      toast(`${target.name} has fallen, but the party keeps fighting!`);
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
      50 + s.region * 80 + Math.floor(s.defeated / 10) * 20
    );

    clearTimeout(exploreTimer);

    log(
      `Every hero has fallen against ${fallenEnemy}. ` +
      `The hospital requires ${s.hospitalFee} gold.`
    );

    toast("Party wiped! Pay the hospital fee to recover.");

    render();
    save();
  }

  // ==========================================
  // ENEMY DEFEATED / NEW HERO RECRUITED
  // ==========================================

  function defeatEnemy() {
    const e = s.enemy;
    if (!e) return;

    s.gold += e.gold;
    s.crystals += e.crystals;
    s.ore += e.boss
      ? 8
      : 1 + Math.floor(Math.random() * 3);

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

        // The voice queue ensures messages play one at a time.
        announce(
          `Notice: ${newHero.name} has joined your team.`
        );

        // Celeste unlocks the two healer-related skills.
        if (rewardId === "celeste") {
          announce("New skill unlocked: Healing Wave.");
          announce("New skill unlocked: Phoenix Blessing.");
        }

        toast(`NEW HERO JOINED: ${newHero.name}!`);
      } else {
        toast("Guardian defeated! Cave cleared.");
      }

      if (clearedRegion < regions.length - 1) {
        s.region = clearedRegion + 1;

        log(
          `Unlocked cave ${s.region + 1}: ${region().name}.`
        );
      } else {
        log(
          "The Crystal Kingdom's final guardian has fallen. All caves cleared!"
        );
      }
    } else {
      log(
        `${e.name} defeated. +${e.gold} gold and +${e.crystals} crystals.`
      );

      toast(
        `Victory! +${e.gold} gold · +${e.crystals} crystals`
      );
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
  }

  // ==========================================
  // SKILLS AND MANA COSTS
  // ==========================================

  function skill(key) {
    if (battleLocked()) {
      return toast(
        s.needsHospital
          ? "Pay the hospital fee first."
          : "Battles are paused during recovery."
      );
    }

    if (!(key in SKILL_MANA_COST)) return;

    if (s.cooldowns[key] > 0) {
      return toast(
        `Skill recharging: ${Math.ceil(s.cooldowns[key])}s`
      );
    }

    if (!livingHeroes().length) {
      return toast("Your party has fallen. Visit the hospital.");
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
      return toast(
        "Clear the first cave to unlock healer support."
      );
    }

    if (key === "phoenix") {
      const fallen = s.heroes.find(
        (id) => (s.heroHp[id] || 0) <= 0
      );

      if (!fallen) {
        return toast("There is no fallen hero to revive.");
      }
    }

    const manaCost = SKILL_MANA_COST[key];

    if (s.mana < manaCost) {
      return toast(
        `Not enough mana. ${manaCost} mana is required.`
      );
    }

    // Pay the mana cost only after validity checks pass.
    s.mana -= manaCost;

    const skillBonus = s.recruits.includes("silas")
      ? 1.15
      : 1;

    if (key === "slash") {
      const amount = Math.floor(
        (45 + s.pickaxe * 5 + s.region * 12) *
        skillBonus
      );

      s.enemy.hp -= amount;
      s.cooldowns.slash = 8;

      showDamage("RADIANT -" + amount, "enemy");
      enemyHitEffect();

      log(
        `Radiant Slash deals ${amount} damage and uses ${manaCost} mana.`
      );
    } else if (key === "burst") {
      const amount = Math.floor(
        (72 + s.region * 20) * skillBonus
      );

      s.enemy.hp -= amount;
      s.cooldowns.burst = 14;

      showDamage("ARCANE -" + amount, "enemy");
      enemyHitEffect();

      log(
        `Arcane Burst deals ${amount} damage and uses ${manaCost} mana.`
      );
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

      log(
        `Aegis Guard healed the living party and will soften the next hit. Mana used: ${manaCost}.`
      );
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

      log(
        `Healing Wave restores up to ${amount} HP to each living ally. Mana used: ${manaCost}.`
      );
    } else if (key === "meteor") {
      const amount = Math.floor(
        (105 + s.region * 28) * skillBonus
      );

      s.enemy.hp -= amount;
      s.cooldowns.meteor = 22;

      showDamage("METEOR -" + amount, "enemy");
      enemyHitEffect();

      log(
        `Meteor Rain deals ${amount} damage. Mana used: ${manaCost}.`
      );
    } else if (key === "frost") {
      const amount = Math.floor(
        (22 + s.region * 6) * skillBonus
      );

      s.enemy.hp -= amount;
      s.frostUntil = Date.now() + 8000;
      s.cooldowns.frost = 17;

      showDamage("FROST -" + amount, "enemy");
      enemyHitEffect();

      log(
        `Frost Nova deals ${amount} damage and slows the enemy. Mana used: ${manaCost}.`
      );
    } else if (key === "phoenix") {
      const fallen = s.heroes.find(
        (id) => (s.heroHp[id] || 0) <= 0
      );

      if (!fallen) {
        // Safety check in case the party changed.
        s.mana = Math.min(maxMana(), s.mana + manaCost);
        return toast("There is no fallen hero to revive.");
      }

      s.heroHp[fallen] = Math.ceil(
        HEROES[fallen].maxHp * 0.4
      );

      s.cooldowns.phoenix = 45;

      showDamage("REVIVE", "party", true);

      log(
        `${HEROES[fallen].name} returns with 40% HP! Mana used: ${manaCost}.`
      );
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

      log(
        `Party attack interval is now ${pInterval().toFixed(1)} seconds.`
      );

      toast("Party tempo improved!");
    } else if (kind === "damage") {
      const cost = damageCost();

      if (s.damageLevel >= 10 || s.gold < cost) {
        return toast("Not enough gold for that upgrade.");
      }

      s.gold -= cost;
      s.damageLevel += 1;

      log(
        `Party damage increased to upgrade level ${s.damageLevel}.`
      );

      toast("Party hits harder!");
    } else if (kind === "crit") {
      const cost = critCost();

      if (s.critLevel >= 8 || s.crystals < cost) {
        return toast("Not enough crystals for that upgrade.");
      }

      s.crystals -= cost;
      s.critLevel += 1;

      log(
        `Critical strike chance increased to ${s.critLevel * 5}%.`
      );

      toast("Critical strikes improved!");
    }

    render();
    save();
  }

  // ==========================================
  // RECRUIT HELPERS
  // ==========================================

  function hireRecruit(id) {
    const recruit = RECRUITS.find(
      (entry) => entry.id === id
    );

    if (!recruit || s.recruits.includes(id)) return;

    if (s.gold < recruit.cost) {
      return toast(
        `You need ${recruit.cost} gold to recruit ${recruit.name}.`
      );
    }

    s.gold -= recruit.cost;
    s.recruits.push(id);

    if (id === "iris") {
      // Iris increases max mana to 125.
      // Restore 25 mana on recruitment.
      s.mana = Math.min(maxMana(), s.mana + 25);

      log(
        "Iris joined your expedition. Maximum mana and regeneration increased."
      );

      toast(
        "Iris recruited! Maximum mana is now 125."
      );
    } else {
      log(
        `${recruit.name} joined your kingdom as a ${recruit.role.toLowerCase()}.`
      );

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
      return toast(
        "Snacks can be used once the party has finished recovering."
      );
    }

    if (!livingHeroes().length) {
      return toast(
        "Your party needs hospital treatment first."
      );
    }

    if ((s.snacks[id] || 0) <= 0) {
      return toast(
        "You are out of that snack. Buy more in the supply stall."
      );
    }

    // Avoid consuming a snack that cannot do anything.
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
        const targetId = living[0];

        const amount = Math.floor(
          35 * (s.recruits.includes("mira_cook") ? 1.25 : 1)
        );

        s.heroHp[targetId] = Math.min(
          HEROES[targetId].maxHp,
          s.heroHp[targetId] + amount
        );

        showDamage("+" + amount, "party", true);

        log(
          `Trail Rations restored ${amount} HP to ${HEROES[targetId].name}.`
        );
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

      livingHeroes().forEach((heroId) => {
        s.heroHp[heroId] = Math.min(
          HEROES[heroId].maxHp,
          s.heroHp[heroId] + amount
        );
      });

      showDamage("TEAM +" + amount, "party", true);

      log(
        `Crystal Cake restored up to ${amount} HP to each living hero.`
      );
    } else if (snack.effect === "mana") {
      const before = s.mana;

      s.mana = Math.min(
        maxMana(),
        s.mana + 35
      );

      const restored = Math.floor(s.mana - before);

      // Re-arm the low-mana warning once mana is back
      // above the threshold.
      if (s.mana / maxMana() > 0.3) {
        s.manaWarning = false;
      }

      showDamage("MANA +" + restored, "party", true);

      log(
        `Etherberries restored ${restored} mana.`
      );

      toast(`Restored ${restored} mana.`);
    } else if (snack.effect === "manaBuff") {
      s.manaBuffUntil = Date.now() + 30000;

      log(
        "Astral Tea tripled mana regeneration for 30 seconds."
      );

      toast("Mana regeneration boosted for 30 seconds!");
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
      return toast(
        `You need ${snack.cost} gold to buy ${snack.name}.`
      );
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
      return toast(
        `You need ${s.hospitalFee} gold to pay the healing fee.`
      );
    }

    s.gold -= s.hospitalFee;
    s.needsHospital = false;
    s.healingUntil = Date.now() + 60000;

    supportClock = 0;

    log(
      `Paid ${s.hospitalFee} gold. Treatment has started; battles are paused for one minute.`
    );

    toast(
      "Hospital fee paid. The party will heal for 1 minute."
    );

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

    log(
      "Treatment complete. The entire party has recovered to full HP."
    );

    toast("Your party is back on its feet!");

    render();
    save();
    scheduleExplore();
  }

  // ==========================================
  // RESET SAVE
  // ==========================================

  function resetGame() {
    if (
      !confirm(
        "Reset all Gem Miner progress on this device? This cannot be undone."
      )
    ) {
      return;
    }

    clearTimeout(exploreTimer);

    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(OLD_SAVE_KEY);

    s = clone(defaults);
    logs = [];

    partyClock = 0;
    enemyClock = 0;
    supportClock = 0;

    log("A fresh expedition begins. Good luck, miner!");

    announce("Notice: A new adventure has begun.");

    render();
    save();
    scheduleExplore();
  }

  // ==========================================
  // RENDER PARTY
  // ==========================================

  function renderParty() {
    const party = $("battleParty");
    const cards = $("companions");

    party.innerHTML = s.heroes.map((id) => {
      const h = HEROES[id];
      const hp = s.heroHp[id] || 0;
      const down = hp <= 0;

      return `
        <img
          class="battle-hero ${down ? "fallen" : ""}"
          src="${h.portrait}"
          alt="${esc(h.name)}"
          title="${esc(h.name)} · ${Math.floor(hp)}/${h.maxHp} HP"
        >
      `;
    }).join("");

    cards.innerHTML = s.heroes.map((id) => {
      const h = HEROES[id];
      const hp = s.heroHp[id] || 0;
      const down = hp <= 0;
      const pct = Math.max(0, hp / h.maxHp * 100);

      return `
        <article class="${down ? "is-fallen" : ""}">
          <div class="portrait">
            <img
              src="${h.portrait}"
              alt="${esc(h.name)}"
              loading="lazy"
            >
          </div>

          <div class="companion-info">
            <b>${esc(h.name)}</b>
            <small>${esc(h.role)}</small>

            <div class="minibar">
              <i style="width:${pct}%"></i>
            </div>

            <small>
              ${down ? "DOWN" : `HP ${Math.floor(hp)} / ${h.maxHp}`}
            </small>
          </div>
        </article>
      `;
    }).join("");

    $("partyPower").textContent =
      `PARTY POWER · ${fmt(totalPartyDamage())}`;

    $("partyAttackLabel").textContent =
      `Attack interval: ${pInterval().toFixed(1)}s`;
  }

  // ==========================================
  // REWARD DISPLAY
  // ==========================================

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

    const h = HEROES[rewardId];
    const already = s.heroes.includes(rewardId);

    next.innerHTML = `
      <div class="reward-kicker">
        ${already ? "NEXT CAVE REWARD" : "BOSS REWARD · NEW HERO"}
      </div>

      <div class="reward-row">
        <img
          src="${h.portrait}"
          alt="${esc(h.name)}"
          loading="lazy"
        >

        <div>
          <b>${esc(h.name)}</b>
          <small>${esc(h.role)}</small>
          <small>${esc(h.tagline)}</small>
        </div>
      </div>

      <small class="reward-note">
        Defeat this cave's guardian to recruit ${esc(h.name)} automatically.
      </small>
    `;
  }

  // ==========================================
  // RENDER SNACKS
  // ==========================================

  function renderSnacks() {
    $("snackGrid").innerHTML = SNACKS.map((snack) => {
      const count = s.snacks[snack.id] || 0;

      const noManaNeeded =
        snack.effect === "mana" &&
        s.mana >= maxMana();

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
              ${count <= 0 || battleLocked() || noManaNeeded ? "disabled" : ""}
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

  // ==========================================
  // RENDER RECRUITS
  // ==========================================

  function renderRecruits() {
    $("recruitCount").textContent =
      `${s.recruits.length} hired`;

    $("recruitGrid").innerHTML = RECRUITS.map((recruit) => {
      const hired = s.recruits.includes(recruit.id);

      return `
        <article class="recruit-card ${hired ? "hired" : ""}">
          <img
            src="${recruit.portrait}"
            alt="${esc(recruit.name)}"
            loading="lazy"
          >

          <div class="recruit-copy">
            <b>${esc(recruit.name)}</b>
            <small>${esc(recruit.role)}</small>
            <p>${esc(recruit.desc)}</p>
          </div>

          <button
            data-action="hire"
            data-value="${recruit.id}"
            ${hired || s.gold < recruit.cost ? "disabled" : ""}
          >
            ${hired ? "Hired" : `Hire · ${recruit.cost} G`}
          </button>
        </article>
      `;
    }).join("");
  }

  // ==========================================
  // RENDER HOSPITAL
  // ==========================================

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
      ? "The healers are tending to your party. No battles can start until the one-minute rest is complete; mining and recruiting remain available."
      : "No retreat. The party fought until every hero fell. Pay the hospital fee to start a full one-minute recovery.";

    $("hospitalFee").textContent =
      `${fmt(s.hospitalFee)} gold`;

    if (timer) {
      const seconds = Math.max(
        0,
        Math.ceil((s.healingUntil - Date.now()) / 1000)
      );

      $("hospitalTimer").textContent =
        `Recovery ends in ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

      $("payHealBtn").textContent =
        "Healing in progress…";

      $("payHealBtn").disabled = true;
    } else {
      $("hospitalTimer").textContent =
        s.gold < s.hospitalFee
          ? `You need ${fmt(s.hospitalFee - s.gold)} more gold.`
          : "Ready when you are";

      $("payHealBtn").textContent =
        `Pay ${fmt(s.hospitalFee)} G & start healing`;

      $("payHealBtn").disabled =
        s.gold < s.hospitalFee;
    }
  }

  // ==========================================
  // MAIN RENDER FUNCTION
  // ==========================================

  function render() {
    $("gold").textContent = fmt(s.gold);
    $("crystals").textContent = fmt(s.crystals);
    $("ore").textContent = fmt(s.ore);

    // Update the mana resource shown in the top bar.
    $("mana").textContent =
      `${Math.floor(s.mana)} / ${maxMana()}`;

    $("regionName").textContent = region().name;

    $("regionNumber").textContent =
      `CAVE ${String(s.region + 1).padStart(2, "0")}`;

    $("defeated").textContent = fmt(s.defeated);

    $("threat").textContent =
      ["Low", "Moderate", "High", "Extreme"][s.region] ||
      "Mythic";

    $("guardianName").textContent = region().boss;
    $("guardianDesc").textContent = region().desc;

    $("bossPhase").textContent = bossDone()
      ? "DEFEATED"
      : s.bossMode
        ? "ENGAGED"
        : "DORMANT";

    $("bossBtn").textContent = bossDone()
      ? "Guardian defeated"
      : s.bossMode
        ? "Guardian engaged"
        : "Challenge guardian";

    $("bossBtn").disabled =
      bossDone() ||
      !!s.enemy ||
      battleLocked() ||
      !livingHeroes().length;

    $("exploreBtn").disabled =
      !!s.enemy ||
      battleLocked() ||
      !livingHeroes().length;

    $("mineBtn").disabled = false;

    $("enemyVisual").classList.toggle(
      "hidden",
      !s.enemy
    );

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

      $("status").textContent =
        battleLocked()
          ? "● RECOVERING"
          : "● IN COMBAT";

      $("hint").textContent =
        "No retreat is possible. The front-line hero takes hits first, and everyone keeps fighting until all heroes are down.";
    } else {
      $("battleTitle").textContent = "The Crystal Road";
      $("enemyName").textContent = "No enemy nearby";
      $("enemyType").textContent = "Awaiting discovery";
      $("enemyHealthText").textContent = "—";
      $("enemyHealthBar").style.width = "0";

      $("status").textContent =
        battleLocked()
          ? "● RECOVERING"
          : "● EXPLORING";

      $("caption").textContent = battleLocked()
        ? "The hospital doors are closed to monsters…"
        : "Your party is searching the tunnels…";

      $("hint").textContent = battleLocked()
        ? "Battles are halted until treatment is complete. Mining is still open so you can earn resources."
        : "Exploration happens automatically after a hidden random 10–20 second interval. There is no retreat button.";
    }

    // Upgrade displays.
    $("pickaxeLevel").textContent =
      `Level ${s.pickaxe} / 10`;

    $("pickaxeCost").textContent =
      s.pickaxe >= 10 ? "MAX" : `${fmt(pickCost())} C`;

    $("pickaxeUpgrade").disabled =
      s.pickaxe >= 10 || s.crystals < pickCost();

    $("speedLevel").textContent =
      `Level ${s.speedLevel} / 5 · ${pInterval().toFixed(1)}s`;

    $("speedCost").textContent =
      s.speedLevel >= 5 ? "MAX" : `${fmt(speedCost())} C`;

    $("speedUpgrade").disabled =
      s.speedLevel >= 5 || s.crystals < speedCost();

    $("damageLevel").textContent =
      `Level ${s.damageLevel} / 10`;

    $("damageCost").textContent =
      s.damageLevel >= 10 ? "MAX" : `${fmt(damageCost())} G`;

    $("damageUpgrade").disabled =
      s.damageLevel >= 10 || s.gold < damageCost();

    $("critLevel").textContent =
      `Level ${s.critLevel} / 8 · ${s.critLevel * 5}%`;

    $("critCost").textContent =
      s.critLevel >= 8 ? "MAX" : `${fmt(critCost())} C`;

    $("critUpgrade").disabled =
      s.critLevel >= 8 || s.crystals < critCost();

    // Skill cooldown labels and mana checks.
    const skillKeys = [
      "slash",
      "burst",
      "guard",
      "heal",
      "meteor",
      "frost",
      "phoenix"
    ];

    for (const key of skillKeys) {
      const button = document.querySelector(
        `[data-skill="${key}"]`
      );

      const label = $("cd-" + key);
      const cost = SKILL_MANA_COST[key];

      const healerRequired =
        ["heal", "phoenix"].includes(key) &&
        !s.heroes.includes("celeste") &&
        !s.heroes.includes("sage");

      const targetRequired =
        ["slash", "burst", "meteor", "frost"].includes(key);

      const noMana = s.mana < cost;

      if (label) {
        if (healerRequired) {
          label.textContent = "LOCKED";
        } else if (s.cooldowns[key] > 0) {
          label.textContent =
            `${Math.ceil(s.cooldowns[key])}s`;
        } else if (noMana) {
          label.textContent = `NEED ${cost} M`;
        } else {
          label.textContent = `READY · ${cost} M`;
        }

        label.classList.toggle(
          "cooling",
          s.cooldowns[key] > 0 || noMana
        );
      }

      if (button) {
        button.disabled =
          battleLocked() ||
          !livingHeroes().length ||
          healerRequired ||
          (targetRequired && !s.enemy) ||
          s.cooldowns[key] > 0 ||
          noMana;
      }
    }

    // Show mana regeneration state in the Sage display.
    if (!speechBusy) {
      if (!sageEnabled) {
        updateSageStatus("VOICE MUTED");
      } else if (s.manaBuffUntil > Date.now()) {
        updateSageStatus("MANA BOOST ACTIVE");
      } else {
        updateSageStatus("VOICE ON");
      }
    }

    const orb = $("sageOrb");

    if (orb) {
      orb.classList.toggle("is-muted", !sageEnabled);
    }

    renderParty();
    renderRewards();
    renderSnacks();
    renderRecruits();
    renderHospital();
    renderLog();
  }

  // ==========================================
  // BUTTON HANDLER
  // ==========================================

  document.addEventListener("click", (event) => {
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
        toast(
          "Defeat the current enemy before challenging the guardian."
        );
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

  // ==========================================
  // KEYBOARD SKILL SHORTCUTS
  // ==========================================

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

    // Finish the one-minute hospital recovery.
    if (s.healingUntil && now >= s.healingUntil) {
      finishHealing();
    }

    // Passive income from helpers.
    const goldRate =
      (s.recruits.includes("tessa") ? 0.8 : 0) +
      (s.recruits.includes("borin") ? 1.3 : 0);

    const crystalRate =
      s.recruits.includes("kellan") ? 0.3 : 0;

    s.gold += goldRate * dt;
    s.crystals += crystalRate * dt;

    // ========================================
    // PASSIVE MANA REGENERATION
    // Runs even when no enemy is present.
    // ========================================

    s.mana = Math.min(
      maxMana(),
      s.mana + manaRate() * dt
    );

    // Low-mana warning: trigger below 20%.
    // Rearm the warning once mana rises above 30%.
    const manaRatio = s.mana / maxMana();

    if (manaRatio < 0.2 && !s.manaWarning) {
      s.manaWarning = true;

      announce(
        "Notice: Your mana is running low."
      );

      log("Great Sage warns that mana is running low.");
    } else if (manaRatio > 0.3) {
      s.manaWarning = false;
    }

    // Battle cooldowns and combat timers pause
    // during hospital treatment.
    if (!battleLocked()) {
      Object.keys(s.cooldowns).forEach((key) => {
        s.cooldowns[key] = Math.max(
          0,
          s.cooldowns[key] - dt
        );
      });

      // Combat timers only run while an enemy exists.
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

      // ======================================
      // CELESTE'S PASSIVE HEALING
      // Works inside AND outside combat.
      // ======================================

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

              showDamage(
                "+" + actualHealing,
                "party",
                true
              );

              healedAnyone = true;
            }
          }

          if (healedAnyone) {
            log(
              `Celeste's healing aura restores up to ${amount} HP to every living party member.`
            );
          }
        }
      } else {
        // Restart the healer timer if Celeste is down.
        supportClock = 0;
      }
    }

    // Refresh the display four times per second.
    renderClock += dt;

    if (renderClock >= 0.25) {
      renderClock = 0;
      render();
    }

    // Save periodically.
    if (
      Math.floor(now / 5000) !==
      Math.floor((now - dt * 1000) / 5000)
    ) {
      save();
    }
  }

  // Repair old enemy saves missing max HP.
  if (s.enemy && !s.enemy.maxHp) {
    s.enemy.maxHp = s.enemy.hp;
  }

  // ==========================================
  // START THE GAME
  // ==========================================

  if (!logs.length) {
    log("The crystal road awaits. Your party is ready.");
  }

  render();
  save();

  if (!s.enemy && !battleLocked()) {
    scheduleExplore();
  }

  // The speech system can use the browser's
  // available voice list once it has loaded.
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      // Voices are loaded by the browser.
    };
  }

  window.gemMinerReady = true;

  window.setInterval(tick, 200);
})();