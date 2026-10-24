"use strict";

/*
  GEM MINER: RISE OF THE CRYSTAL KINGDOM

  Files:
    index.html
    style.css
    game.js
    assets/*.svg
*/

const $ = id => document.getElementById(id);

const SAVE_KEY = "gemMinerCrystalKingdom_v6";
const OLD_SAVE_KEY = "gemMinerCrystalKingdomCode_v5";

const HEROES = {
  aiden: {
    name:"Aiden",
    role:"Knight",
    emoji:"🛡️",
    sprite:"assets/knight.svg",
    hp:145,
    damage:12,
    tagline:"Loyal and sturdy. Always at the front."
  },

  seraphine: {
    name:"Seraphine",
    role:"Mage",
    emoji:"🧙‍♀️",
    sprite:"assets/mage.svg",
    hp:92,
    damage:17,
    tagline:"Crystal magic becomes firepower."
  },

  liria: {
    name:"Liria",
    role:"Archer",
    emoji:"🏹",
    sprite:"assets/archer.svg",
    hp:104,
    damage:15,
    tagline:"Quick shots from a distance."
  },

  celeste: {
    name:"Celeste",
    role:"Healer",
    emoji:"✨",
    sprite:"assets/hero-mage.svg",
    hp:112,
    damage:8,
    tagline:"Keeps the team in the fight."
  },

  ragnar: {
    name:"Ragnar",
    role:"Berserker",
    emoji:"🔥",
    sprite:"assets/knight.svg",
    hp:128,
    damage:24,
    tagline:"Big hits. Bigger smiles."
  },

  kael: {
    name:"Kael",
    role:"Rogue",
    emoji:"🗡️",
    sprite:"assets/hero-mage.svg",
    hp:98,
    damage:19,
    tagline:"Fast feet and precise strikes."
  },

  sage: {
    name:"Sage",
    role:"Druid",
    emoji:"🌿",
    sprite:"assets/archer.svg",
    hp:118,
    damage:13,
    tagline:"The forest answers the call."
  }
};

const REGIONS = [
  {
    name:"The Shattered Cavern",
    enemy:"Glimmer Slime",
    emoji:"🟣",
    type:"CRYSTAL CREATURE",
    hp:90,
    damage:8,
    gold:12,
    crystals:5,
    boss:"The Prism Warden",
    bossHp:490,
    bossDamage:16,
    desc:"An ancient sentinel sealed inside the cavern.",
    reward:"celeste"
  },

  {
    name:"Moonlit Grotto",
    enemy:"Grotto Stalker",
    emoji:"🐺",
    type:"ABYSSAL BEAST",
    hp:155,
    damage:12,
    gold:23,
    crystals:8,
    boss:"The Moonfang",
    bossHp:880,
    bossDamage:23,
    desc:"A moon-cursed hunter prowls the luminous pools.",
    reward:"ragnar"
  },

  {
    name:"The Ember Reliquary",
    enemy:"Cinder Wisp",
    emoji:"👻",
    type:"EMBER SPIRIT",
    hp:270,
    damage:17,
    gold:37,
    crystals:13,
    boss:"The Ashen Sovereign",
    bossHp:1550,
    bossDamage:33,
    desc:"A sovereign of flame guards the buried reliquary.",
    reward:"kael"
  },

  {
    name:"Skyglass Sanctum",
    enemy:"Skyglass Sentinel",
    emoji:"💠",
    type:"ANCIENT CONSTRUCT",
    hp:450,
    damage:24,
    gold:58,
    crystals:21,
    boss:"The Star-Eater",
    bossHp:2700,
    bossDamage:46,
    desc:"A star-born titan guards the final seal.",
    reward:"sage"
  }
];

const RECRUITS = [
  {id:"tessa",name:"Tessa",role:"Miner",emoji:"⛏️",cost:55,desc:"+0.8 gold per second"},
  {id:"borin",name:"Borin",role:"Miner",emoji:"🧔",cost:80,desc:"+1.3 gold per second"},
  {id:"luna",name:"Luna",role:"Gatherer",emoji:"🌱",cost:95,desc:"+20% mining crystals"},
  {id:"silas",name:"Silas",role:"Scholar",emoji:"📚",cost:125,desc:"+15% skill damage"},
  {id:"mira",name:"Mira",role:"Cook",emoji:"🍲",cost:115,desc:"+25% snack healing"},
  {id:"juno",name:"Juno",role:"Alchemist",emoji:"🧪",cost:150,desc:"+1 ore when mining"},
  {id:"darius",name:"Darius",role:"Crossbowman",emoji:"🏹",cost:190,desc:"+6 party attack damage"},
  {id:"elise",name:"Elise",role:"Spirit Guide",emoji:"🔮",cost:225,desc:"+20% healing power"},
  {id:"kellan",name:"Kellan",role:"Engineer",emoji:"⚙️",cost:270,desc:"+0.3 crystals per second"}
];

const SNACKS = [
  {id:"rations",name:"Trail Rations",icon:"🥖",cost:24,desc:"Heal your most injured living hero by 35 HP."},
  {id:"moonberries",name:"Moonberries",icon:"🫐",cost:40,desc:"Increase party damage by 25% for 20 seconds."},
  {id:"tea",name:"Miner's Tea",icon:"🍵",cost:32,desc:"Gain 4 ore."},
  {id:"cake",name:"Crystal Cake",icon:"🍰",cost:75,desc:"Heal living heroes by 24 HP."}
];

const INITIAL_HEROES = ["aiden","seraphine","liria"];

const DEFAULTS = {
  gold:75,
  crystals:35,
  ore:0,

  pickaxe:1,
  speed:0,
  damageLevel:0,
  crit:0,

  region:0,
  defeated:0,
  bosses:[],

  heroes:INITIAL_HEROES.slice(),
  heroHp:{
    aiden:145,
    seraphine:92,
    liria:104
  },

  recruits:[],

  snacks:{
    rations:2,
    moonberries:1,
    tea:1,
    cake:0
  },

  cooldowns:{
    slash:0,
    burst:0,
    guard:0,
    heal:0,
    meteor:0,
    frost:0,
    phoenix:0
  },

  buffUntil:0,
  frostUntil:0,
  guardCharges:0,
  healClock:0,

  enemy:null,
  needsHospital:false,
  hospitalFee:0,
  healingUntil:0
};

const clone = value => JSON.parse(JSON.stringify(value));

const fmt = value =>
  Math.max(0,Math.floor(Number(value)||0)).toLocaleString();

function loadGame() {
  let saved = {};

  try {
    saved = JSON.parse(
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem(OLD_SAVE_KEY) ||
      localStorage.getItem("gemMinerCrystalKingdom_v4") ||
      "{}"
    ) || {};
  } catch (error) {
    console.warn("Could not read the old save:",error);
  }

  const game = {
    ...clone(DEFAULTS),
    ...saved
  };

  game.heroHp = {
    ...DEFAULTS.heroHp,
    ...(saved.heroHp||{})
  };

  game.snacks = {
    ...DEFAULTS.snacks,
    ...(saved.snacks||{})
  };

  game.cooldowns = {
    ...DEFAULTS.cooldowns,
    ...(saved.cooldowns||{})
  };

  game.heroes = Array.isArray(saved.heroes)
    ? saved.heroes.filter(id => HEROES[id])
    : INITIAL_HEROES.slice();

  if (!game.heroes.length) {
    game.heroes = INITIAL_HEROES.slice();
  }

  game.recruits = Array.isArray(saved.recruits)
    ? saved.recruits.filter(id => RECRUITS.some(r=>r.id===id))
    : [];

  game.bosses = Array.isArray(saved.bosses)
    ? saved.bosses.filter(Number.isInteger)
    : [];

  game.region = Math.max(
    0,
    Math.min(REGIONS.length-1,Number(game.region)||0)
  );

  game.gold = Math.max(0,Number(game.gold)||0);
  game.crystals = Math.max(0,Number(game.crystals)||0);
  game.ore = Math.max(0,Number(game.ore)||0);

  // A saved boss victory grants the associated hero.
  game.bosses.forEach(index => {
    const heroId = REGIONS[index]?.reward;

    if (heroId && !game.heroes.includes(heroId)) {
      game.heroes.push(heroId);
      game.heroHp[heroId] = HEROES[heroId].hp;
    }
  });

  game.heroes.forEach(id => {
    if (!Number.isFinite(Number(game.heroHp[id]))) {
      game.heroHp[id] = HEROES[id].hp;
    }

    game.heroHp[id] = Math.max(
      0,
      Math.min(HEROES[id].hp,Number(game.heroHp[id]))
    );
  });

  return game;
}

let state = loadGame();
let logs = [];

let partyClock = 0;
let enemyClock = 0;
let lastTick = performance.now();
let lastSave = Date.now();

let explorationTimer = null;
let toastTimer = null;

const region = () => REGIONS[state.region];

const alive = () =>
  state.heroes.filter(id => (state.heroHp[id]||0)>0);

const recovering = () =>
  state.healingUntil > Date.now();

const locked = () =>
  state.needsHospital || recovering();

const isBossDone = () =>
  state.bosses.includes(state.region);

const attackInterval = () =>
  Math.max(3.5,6-state.speed*.5);

const pickaxeCost = () =>
  Math.floor(35*Math.pow(1.8,state.pickaxe-1));

const speedCost = () =>
  Math.floor(40*Math.pow(1.9,state.speed));

const damageCost = () =>
  Math.floor(60*Math.pow(1.8,state.damageLevel));

const critCost = () =>
  Math.floor(50*Math.pow(1.85,state.crit));

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    lastSave = Date.now();
  } catch (error) {
    console.warn("Saving failed:",error);
  }
}

function toast(message) {
  const element = $("toast");
  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  },2400);
}

function addLog(message) {
  logs.unshift({
    time:new Date().toLocaleTimeString([],{
      hour:"2-digit",
      minute:"2-digit"
    }),
    message
  });

  logs = logs.slice(0,15);
  renderLog();
}

function renderLog() {
  $("logList").innerHTML = logs.map(item =>
    `<p><small>${item.time}</small> ${item.message}</p>`
  ).join("");
}

function showEffect(message,healing=false) {
  const element = document.createElement("span");

  element.className = "damage";
  element.textContent = message;
  element.style.left = (30+Math.random()*35)+"%";
  element.style.top = "42%";

  if (healing) element.style.color = "#9de8bb";

  $("scene").appendChild(element);

  setTimeout(() => element.remove(),900);
}

/* ---------- EXPLORATION ---------- */

function scheduleExploration() {
  clearTimeout(explorationTimer);

  if (state.enemy || locked() || !alive().length) {
    return;
  }

  // A hidden random interval of 10–20 seconds.
  explorationTimer = setTimeout(() => {
    if (!state.enemy && !locked() && alive().length) {
      explore();
    } else {
      scheduleExploration();
    }
  },10000+Math.random()*10000);
}

function canBattle() {
  if (state.needsHospital) {
    toast("Pay the hospital fee before battles resume.");
    return false;
  }

  if (recovering()) {
    toast("Your heroes are in treatment. Battles are paused.");
    return false;
  }

  if (!alive().length) {
    partyWiped();
    return false;
  }

  return true;
}

function explore() {
  if (state.enemy) {
    toast("Defeat the current enemy first.");
    return;
  }

  if (!canBattle()) return;

  clearTimeout(explorationTimer);

  if (Math.random()<.68) {
    spawnEnemy(false);
    return;
  }

  const multiplier = state.recruits.includes("luna") ? 1.2 : 1;

  const crystals = Math.floor(
    (3+Math.random()*7+state.region*2)*multiplier
  );

  const ore = 1+Math.floor(Math.random()*3)
    +(state.recruits.includes("juno")?1:0);

  state.crystals += crystals;
  state.ore += ore;
  state.gold += Math.floor(crystals*.7);

  addLog(`Exploration found ${crystals} crystals and ${ore} ore.`);
  toast(`Found ${crystals} crystals and ${ore} ore!`);

  render();
  saveGame();
  scheduleExploration();
}

/* ---------- MINING ---------- */

function mineCrystals() {
  const multiplier = state.recruits.includes("luna") ? 1.2 : 1;

  const amount = Math.max(
    1,
    Math.floor(
      (state.pickaxe*3+Math.random()*state.pickaxe)*multiplier
    )
  );

  const ore = 1+Math.floor(state.pickaxe/3)
    +(state.recruits.includes("juno")?1:0);

  state.crystals += amount;
  state.ore += ore;
  state.gold += Math.max(1,Math.floor(amount/2));

  addLog(`Mining yielded ${amount} crystals and ${ore} ore.`);
  showEffect("+"+amount,true);
  toast(`Mined ${amount} crystals.`);

  render();
  saveGame();
}

/* ---------- ENEMIES AND COMBAT ---------- */

function spawnEnemy(boss=false) {
  if (state.enemy || !canBattle()) return;

  clearTimeout(explorationTimer);

  const r = region();
  const scale = Math.pow(1.65,state.region);

  if (boss) {
    state.enemy = {
      name:r.boss,
      type:"REGION GUARDIAN",
      emoji:"👹",
      hp:r.bossHp,
      maxHp:r.bossHp,
      damage:r.bossDamage,
      gold:90+state.region*45,
      crystals:35+state.region*20,
      boss:true
    };

    addLog(`${r.boss} emerges from the ancient seal.`);
    toast(`${r.boss} challenges your party!`);
  } else {
    const hp = Math.floor(
      r.hp*scale*(.85+Math.random()*.3)
    );

    state.enemy = {
      name:r.enemy,
      type:r.type,
      emoji:r.emoji,
      hp,
      maxHp:hp,
      damage:Math.floor(r.damage*(1+state.region*.25)),
      gold:Math.floor(r.gold*(1+state.region*.35)),
      crystals:Math.floor(r.crystals*(1+state.region*.35)),
      boss:false
    };

    addLog(`${r.enemy} appears in the cavern!`);
    toast("An enemy blocks the path!");
  }

  partyClock = 0;
  enemyClock = 0;

  render();
  saveGame();
}

function partyAttack() {
  if (!state.enemy || locked()) return;

  const activeHeroes = alive();

  if (!activeHeroes.length) {
    partyWiped();
    return;
  }

  for (const id of activeHeroes) {
    if (!state.enemy) break;

    const hero = HEROES[id];

    let damage = hero.damage
      +(state.pickaxe-1)*2
      +state.damageLevel*4;

    if (state.recruits.includes("darius")) damage += 6;
    if (state.buffUntil>Date.now()) damage *= 1.25;
    if (state.recruits.includes("silas")) damage *= 1.15;

    const chance = Math.min(
      .5,
      state.crit*.05+(id==="kael"?.15:0)
    );

    const critical = Math.random()<chance;

    damage = Math.max(
      1,
      Math.floor(
        damage*(critical?1.8:1)*(.88+Math.random()*.24)
      )
    );

    state.enemy.hp -= damage;

    showEffect((critical?"CRIT ":"-")+damage);

    if (state.enemy.hp<=0) {
      defeatEnemy();
      return;
    }
  }
}

function enemyAttack() {
  if (!state.enemy || locked()) return;

  // Enemies target the front line first.
  // They switch to the next living hero if one falls.
  const order = [
    "aiden","ragnar","kael",
    "seraphine","liria","celeste","sage"
  ];

  const targetId = order.find(id =>
    state.heroes.includes(id) &&
    (state.heroHp[id]||0)>0
  );

  if (!targetId) {
    partyWiped();
    return;
  }

  let damage = Math.max(
    1,
    Math.floor(state.enemy.damage*(.82+Math.random()*.36))
  );

  if (state.guardCharges>0) {
    damage = Math.ceil(damage*.45);
    state.guardCharges--;
  }

  state.heroHp[targetId] = Math.max(
    0,
    state.heroHp[targetId]-damage
  );

  showEffect("-"+damage);

  addLog(
    `${state.enemy.name} hits ${HEROES[targetId].name} for ${damage} damage`+
    (state.heroHp[targetId]===0?" — hero down!":".")
  );

  if (state.heroHp[targetId]===0) {
    toast(`${HEROES[targetId].name} has fallen. The others keep fighting!`);
  }

  if (!alive().length) {
    partyWiped();
  }

  render();
  saveGame();
}

function defeatEnemy() {
  if (!state.enemy) return;

  const enemy = state.enemy;

  state.gold += enemy.gold;
  state.crystals += enemy.crystals;
  state.ore += enemy.boss ? 8 : 1+Math.floor(Math.random()*3);
  state.defeated++;

  if (enemy.boss) {
    const clearedRegion = state.region;

    if (!state.bosses.includes(clearedRegion)) {
      state.bosses.push(clearedRegion);
    }

    const heroId = REGIONS[clearedRegion].reward;

    if (heroId && !state.heroes.includes(heroId)) {
      state.heroes.push(heroId);
      state.heroHp[heroId] = HEROES[heroId].hp;

      addLog(`${HEROES[heroId].name} joins the party after the cave clear!`);
      toast(`NEW HERO JOINED: ${HEROES[heroId].name}!`);
    } else {
      toast("Guardian defeated! Cave cleared.");
    }

    if (clearedRegion<REGIONS.length-1) {
      state.region = clearedRegion+1;
      addLog(`Unlocked cave ${state.region+1}: ${region().name}.`);
    } else {
      toast("The final guardian has fallen!");
      addLog("All cave guardians defeated! The Crystal Kingdom is yours.");
    }

    addLog(
      `Guardian defeated! +${enemy.gold} gold, `+
      `+${enemy.crystals} crystals, +8 ore.`
    );
  } else {
    addLog(
      `${enemy.name} defeated. +${enemy.gold} gold and `+
      `+${enemy.crystals} crystals.`
    );

    toast(`Victory! +${enemy.gold} gold.`);
  }

  state.enemy = null;
  partyClock = 0;
  enemyClock = 0;

  // A small post-victory recovery.
  alive().forEach(id => {
    state.heroHp[id] = Math.min(
      HEROES[id].hp,
      state.heroHp[id]+7
    );
  });

  render();
  saveGame();
  scheduleExploration();
}

/* ---------- HOSPITAL ---------- */

function partyWiped() {
  if (state.needsHospital || recovering()) return;

  const enemyName = state.enemy?.name || "the enemy";

  // The battle ends only after all party members are down.
  state.enemy = null;
  state.needsHospital = true;

  state.hospitalFee = Math.floor(
    50+state.region*80+Math.floor(state.defeated/10)*20
  );

  state.healingUntil = 0;
  partyClock = 0;
  enemyClock = 0;

  clearTimeout(explorationTimer);

  addLog(
    `Every hero has fallen against ${enemyName}. `+
    `Hospital bill: ${state.hospitalFee} gold.`
  );

  toast("Party wiped! Time for the hospital.");

  render();
  saveGame();
}

function payHospitalFee() {
  if (!state.needsHospital || recovering()) return;

  if (state.gold<state.hospitalFee) {
    toast(`You need ${state.hospitalFee-state.gold} more gold.`);
    return;
  }

  state.gold -= state.hospitalFee;
  state.needsHospital = false;
  state.healingUntil = Date.now()+60000;

  addLog(
    `Paid ${state.hospitalFee} gold. `+
    "Hospital treatment begins for one minute."
  );

  toast("Bill paid! Your heroes are resting.");

  render();
  saveGame();
}

function finishHealing() {
  state.heroes.forEach(id => {
    state.heroHp[id] = HEROES[id].hp;
  });

  state.healingUntil = 0;
  state.needsHospital = false;
  state.hospitalFee = 0;
  state.guardCharges = 0;
  state.healClock = 0;

  addLog("Treatment complete. The whole party is back to full HP.");
  toast("Your party is ready to fight again!");

  render();
  saveGame();
  scheduleExploration();
}

function renderHospital() {
  const panel = $("hospitalPanel");
  const inTreatment = recovering();
  const visible = state.needsHospital || inTreatment;

  panel.classList.toggle("hidden",!visible);

  if (!visible) return;

  $("hospitalTitle").textContent = inTreatment
    ? "Your heroes are recovering"
    : "The whole party has fallen";

  $("hospitalStatus").textContent = inTreatment
    ? "TREATMENT IN PROGRESS"
    : "TREATMENT NEEDED";

  $("hospitalCopy").textContent = inTreatment
    ? "Battles are paused while your team recovers. You can still mine and hire recruits."
    : "No retreat. Your party fought until everyone fell. Pay the bill to begin a full one-minute recovery.";

  $("hospitalFee").textContent = fmt(state.hospitalFee)+" gold";

  if (inTreatment) {
    const seconds = Math.max(
      0,
      Math.ceil((state.healingUntil-Date.now())/1000)
    );

    const minutes = Math.floor(seconds/60);
    const remainder = seconds%60;

    $("hospitalTimer").textContent =
      `Time remaining: ${String(minutes).padStart(2,"0")}:`+
      String(remainder).padStart(2,"0");

    $("payHealBtn").textContent = "Healing in progress…";
    $("payHealBtn").disabled = true;
  } else {
    $("hospitalTimer").textContent = state.gold<state.hospitalFee
      ? `You need ${fmt(state.hospitalFee-state.gold)} more gold.`
      : "Ready when you are";

    $("payHealBtn").textContent =
      `Pay ${fmt(state.hospitalFee)} G & begin healing`;

    $("payHealBtn").disabled = state.gold<state.hospitalFee;
  }
}

/* ---------- SKILLS ---------- */

function castSkill(key) {
  if (locked()) {
    toast(state.needsHospital
      ? "Pay the hospital fee first."
      : "Battles are paused during treatment.");
    return;
  }

  if (!alive().length) {
    toast("Your party has fallen.");
    return;
  }

  if (state.cooldowns[key]>0) {
    toast(`Skill recharging: ${Math.ceil(state.cooldowns[key])} seconds.`);
    return;
  }

  const attackSkills = ["slash","burst","meteor","frost"];

  if (attackSkills.includes(key) && !state.enemy) {
    toast("There is no enemy to target.");
    return;
  }

  if (
    ["heal","phoenix"].includes(key) &&
    !state.heroes.includes("celeste")
  ) {
    toast("Clear the first cave to unlock Celeste.");
    return;
  }

  const skillBonus = state.recruits.includes("silas") ? 1.15 : 1;

  if (key==="slash") {
    const damage = Math.floor(
      (45+state.pickaxe*5+state.region*12)*skillBonus
    );

    state.enemy.hp -= damage;
    state.cooldowns.slash = 8;

    showEffect("SLASH -"+damage);
    addLog(`Radiant Slash deals ${damage} damage.`);
  }

  if (key==="burst") {
    const damage = Math.floor(
      (72+state.region*20)*skillBonus
    );

    state.enemy.hp -= damage;
    state.cooldowns.burst = 14;

    showEffect("ARCANE -"+damage);
    addLog(`Arcane Burst deals ${damage} damage.`);
  }

  if (key==="guard") {
    alive().forEach(id => {
      state.heroHp[id] = Math.min(
        HEROES[id].hp,
        state.heroHp[id]+12
      );
    });

    state.guardCharges = 1;
    state.cooldowns.guard = 18;

    showEffect("AEGIS +12",true);
    addLog("Aegis Guard heals your heroes and softens the next hit.");
  }

  if (key==="heal") {
    const amount = Math.floor(
      28*(state.recruits.includes("elise")?1.2:1)
    );

    alive().forEach(id => {
      state.heroHp[id] = Math.min(
        HEROES[id].hp,
        state.heroHp[id]+amount
      );
    });

    state.cooldowns.heal = 14;

    showEffect("HEAL +"+amount,true);
    addLog(`Healing Wave restores up to ${amount} HP to living heroes.`);
  }

  if (key==="meteor") {
    const damage = Math.floor(
      (105+state.region*28)*skillBonus
    );

    state.enemy.hp -= damage;
    state.cooldowns.meteor = 22;

    showEffect("METEOR -"+damage);
    addLog(`Meteor Rain deals ${damage} damage.`);
  }

  if (key==="frost") {
    const damage = Math.floor(
      (22+state.region*6)*skillBonus
    );

    state.enemy.hp -= damage;
    state.frostUntil = Date.now()+8000;
    state.cooldowns.frost = 17;

    showEffect("FROST -"+damage);
    addLog(`Frost Nova deals ${damage} damage and slows the enemy.`);
  }

  if (key==="phoenix") {
    const fallen = state.heroes.find(id =>
      (state.heroHp[id]||0)<=0
    );

    if (!fallen) {
      toast("No fallen hero needs reviving.");
      return;
    }

    state.heroHp[fallen] = Math.ceil(HEROES[fallen].hp*.4);
    state.cooldowns.phoenix = 45;

    showEffect("REVIVED",true);
    addLog(`${HEROES[fallen].name} returns with 40% HP!`);
  }

  if (state.enemy && state.enemy.hp<=0) {
    defeatEnemy();
  }

  render();
  saveGame();
}

/* ---------- UPGRADES ---------- */

function upgrade(kind) {
  if (kind==="pickaxe") {
    const cost = pickaxeCost();

    if (state.pickaxe>=10 || state.crystals<cost) {
      toast("Not enough crystals for that upgrade.");
      return;
    }

    state.crystals -= cost;
    state.pickaxe++;

    addLog(`Pickaxe upgraded to level ${state.pickaxe}.`);
  } else if (kind==="speed") {
    const cost = speedCost();

    if (state.speed>=5 || state.crystals<cost) {
      toast("Not enough crystals for that upgrade.");
      return;
    }

    state.crystals -= cost;
    state.speed++;
    partyClock = 0;

    addLog(`Party attack interval is now ${attackInterval().toFixed(1)} seconds.`);
  } else if (kind==="damage") {
    const cost = damageCost();

    if (state.damageLevel>=10 || state.gold<cost) {
      toast("Not enough gold for that upgrade.");
      return;
    }

    state.gold -= cost;
    state.damageLevel++;

    addLog(`Party damage upgraded to level ${state.damageLevel}.`);
  } else if (kind==="crit") {
    const cost = critCost();

    if (state.crit>=8 || state.crystals<cost) {
      toast("Not enough crystals for that upgrade.");
      return;
    }

    state.crystals -= cost;
    state.crit++;

    addLog(`Critical strike chance increased to ${state.crit*5}%.`);
  }

  toast("Upgrade purchased!");

  render();
  saveGame();
}

/* ---------- RECRUITS ---------- */

function hireRecruit(id) {
  const recruit = RECRUITS.find(item => item.id===id);

  if (!recruit || state.recruits.includes(id)) return;

  if (state.gold<recruit.cost) {
    toast(`You need ${recruit.cost} gold for ${recruit.name}.`);
    return;
  }

  state.gold -= recruit.cost;
  state.recruits.push(id);

  addLog(`${recruit.name} joined the kingdom as a ${recruit.role}.`);
  toast(`${recruit.name} joined your kingdom!`);

  render();
  saveGame();
}

/* ---------- SNACKS ---------- */

function useSnack(id) {
  if (locked()) {
    toast("Snacks are unavailable during hospital treatment.");
    return;
  }

  if (!alive().length) {
    toast("Your party needs hospital treatment.");
    return;
  }

  if (!(state.snacks[id]>0)) {
    toast("You are out of that snack. Buy another one.");
    return;
  }

  state.snacks[id]--;

  if (id==="rations") {
    const injured = alive().sort(
      (a,b) =>
        state.heroHp[a]/HEROES[a].hp -
        state.heroHp[b]/HEROES[b].hp
    )[0];

    if (injured) {
      const healing = Math.floor(
        35*(state.recruits.includes("mira")?1.25:1)
      );

      state.heroHp[injured] = Math.min(
        HEROES[injured].hp,
        state.heroHp[injured]+healing
      );

      addLog(`${HEROES[injured].name} recovers ${healing} HP from Trail Rations.`);
    }
  }

  if (id==="moonberries") {
    state.buffUntil = Date.now()+20000;
    addLog("Moonberries boost party damage by 25% for 20 seconds.");
  }

  if (id==="tea") {
    state.ore += 4;
    addLog("Miner's Tea gives you 4 ore.");
  }

  if (id==="cake") {
    const healing = Math.floor(
      24*(state.recruits.includes("mira")?1.25:1)
    );

    alive().forEach(id => {
      state.heroHp[id] = Math.min(
        HEROES[id].hp,
        state.heroHp[id]+healing
      );
    });

    addLog(`Crystal Cake heals living heroes by up to ${healing} HP.`);
  }

  toast("Snack used!");
  render();
  saveGame();
}

function buySnack(id) {
  const snack = SNACKS.find(item => item.id===id);

  if (!snack) return;

  if (state.gold<snack.cost) {
    toast(`You need ${snack.cost} gold to buy ${snack.name}.`);
    return;
  }

  state.gold -= snack.cost;
  state.snacks[id] = (state.snacks[id]||0)+1;

  addLog(`Bought one ${snack.name}.`);
  toast(`${snack.name} added to your bag.`);

  render();
  saveGame();
}

/* ---------- HERO ASSETS AND RENDERING ---------- */

function avatar(id) {
  const hero = HEROES[id];

  return `
    <div class="avatar">
      <img
        class="hero-sprite"
        src="${hero.sprite}"
        alt="${hero.name}"
        onerror="this.style.display='none';this.nextElementSibling.hidden=false"
      >
      <span class="hero-fallback" hidden>${hero.emoji}</span>
    </div>
  `;
}

function renderParty() {
  $("battleParty").innerHTML = state.heroes.map(id => {
    const hero = HEROES[id];
    const fallen = (state.heroHp[id]||0)<=0;

    return `
      <div class="hero-token ${fallen?"fallen":""}" title="${hero.name}">
        <img
          class="hero-sprite"
          src="${hero.sprite}"
          alt="${hero.name}"
          onerror="this.style.display='none';this.nextElementSibling.hidden=false"
        >
        <span class="hero-fallback" hidden>${hero.emoji}</span>
      </div>
    `;
  }).join("");

  $("companions").innerHTML = state.heroes.map(id => {
    const hero = HEROES[id];
    const hp = state.heroHp[id]||0;
    const percent = Math.max(0,hp/hero.hp*100);
    const fallen = hp<=0;

    return `
      <article class="companion ${fallen?"fallen":""}">
        ${avatar(id)}
        <div class="hero-details">
          <b>${hero.name}</b>
          <small>${hero.role}</small>
          <div class="minihealth">
            <i style="width:${percent}%"></i>
          </div>
          <small>${fallen?"DOWN":`HP ${Math.floor(hp)} / ${hero.hp}`}</small>
        </div>
      </article>
    `;
  }).join("");

  const power = alive().reduce(
    (total,id)=>total+HEROES[id].damage,
    0
  )+state.damageLevel*4;

  $("partyPower").textContent = "PARTY POWER · "+fmt(power);
}

function renderRewards() {
  const current = region();

  if (isBossDone()) {
    $("nextHeroCard").innerHTML = `
      <div class="reward-title">CAVE CLEARED</div>
      <b>Guardian defeated!</b>
      <small>${state.region===REGIONS.length-1
        ?"Every guardian has fallen."
        :"Your route to the next cave is open."}</small>
    `;
    return;
  }

  const hero = HEROES[current.reward];

  $("nextHeroCard").innerHTML = `
    <div class="reward-title">BOSS REWARD · NEW HERO</div>
    <b>${hero.emoji} ${hero.name} · ${hero.role}</b>
    <small>${hero.tagline}</small>
    <small>Defeat this cave's guardian to recruit ${hero.name} automatically.</small>
  `;
}

function renderSnacks() {
  $("snackGrid").innerHTML = SNACKS.map(snack => {
    const count = state.snacks[snack.id]||0;

    return `
      <article class="snack">
        <div class="snackicon">${snack.icon}</div>
        <b>${snack.name}</b>
        <small>In bag: ${count} · Cost: ${snack.cost} gold</small>
        <p>${snack.desc}</p>
        <div class="actions">
          <button data-action="useSnack" data-value="${snack.id}"
            ${!count||locked()?"disabled":""}>Use</button>
          <button data-action="buySnack" data-value="${snack.id}"
            ${state.gold<snack.cost?"disabled":""}>Buy</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderRecruits() {
  $("recruitCount").textContent = state.recruits.length+" hired";

  $("recruitGrid").innerHTML = RECRUITS.map(recruit => {
    const hired = state.recruits.includes(recruit.id);

    return `
      <article class="recruitcard">
        <div class="recruit-emoji">${recruit.emoji}</div>
        <b>${recruit.name}</b>
        <small>${recruit.role} · ${recruit.desc}</small>
        <button data-action="hire" data-value="${recruit.id}"
          ${hired||state.gold<recruit.cost?"disabled":""}>
          ${hired?"Hired":"Hire · "+recruit.cost+" G"}
        </button>
      </article>
    `;
  }).join("");
}

function renderSkills() {
  for (const key of Object.keys(state.cooldowns)) {
    const button = document.querySelector(`[data-skill="${key}"]`);
    const label = $("cd-"+key);

    const healerLocked =
      ["heal","phoenix"].includes(key) &&
      !state.heroes.includes("celeste");

    const needsEnemy =
      ["slash","burst","meteor","frost"].includes(key);

    button.disabled =
      locked() ||
      !alive().length ||
      healerLocked ||
      (needsEnemy&&!state.enemy) ||
      state.cooldowns[key]>0;

    label.textContent = healerLocked
      ? "LOCKED"
      : state.cooldowns[key]>0
        ? Math.ceil(state.cooldowns[key])+"s"
        : "READY";
  }
}

function render() {
  $("gold").textContent = fmt(state.gold);
  $("crystals").textContent = fmt(state.crystals);
  $("ore").textContent = fmt(state.ore);

  $("regionName").textContent = region().name;
  $("regionNumber").textContent =
    "CAVE "+String(state.region+1).padStart(2,"0");

  $("defeated").textContent = fmt(state.defeated);
  $("threat").textContent =
    ["Low","Moderate","High","Extreme"][state.region];

  $("guardianName").textContent = region().boss;
  $("guardianDesc").textContent = region().desc;
  $("bossPhase").textContent = isBossDone()?"DEFEATED":"DORMANT";

  $("bossBtn").textContent = isBossDone()
    ? "Guardian defeated"
    : "Challenge Guardian";

  const cannotFight = locked()||!alive().length;

  document.querySelector('[data-action="explore"]').disabled =
    !!state.enemy||cannotFight;

  $("bossBtn").disabled =
    isBossDone()||!!state.enemy||cannotFight;

  if (state.enemy) {
    $("battleTitle").textContent = state.enemy.name;
    $("enemyName").textContent = state.enemy.name;
    $("enemyType").textContent = state.enemy.type;

    $("enemyHealthText").textContent =
      fmt(state.enemy.hp)+" / "+fmt(state.enemy.maxHp);

    $("enemyHealthBar").style.width =
      Math.max(0,state.enemy.hp/state.enemy.maxHp*100)+"%";

    $("enemyVisual").textContent = state.enemy.emoji;
    $("enemyVisual").classList.remove("hidden");

    $("caption").textContent = state.enemy.boss
      ? "An ancient guardian's power surges…"
      : "The party fights together!";

    $("status").textContent = "IN COMBAT";
  } else {
    $("battleTitle").textContent = "The Crystal Road";
    $("enemyName").textContent = "No enemy nearby";
    $("enemyType").textContent = "Awaiting discovery";
    $("enemyHealthText").textContent = "—";
    $("enemyHealthBar").style.width = "0%";

    $("enemyVisual").classList.add("hidden");

    $("caption").textContent = locked()
      ? "The party is in the infirmary…"
      : "Your party is searching the tunnels…";

    $("status").textContent = locked()?"RECOVERING":"EXPLORING";
  }

  $("hint").textContent = locked()
    ? "Battles are paused during treatment. Mine resources to earn the healing fee."
    : "Exploration runs every 10–20 seconds. No retreat until every hero has fallen.";

  $("pickaxeLevel").textContent = `Level ${state.pickaxe} / 10`;
  $("pickaxeCost").textContent = state.pickaxe>=10
    ? "MAX"
    : fmt(pickaxeCost())+" C";

  $('[data-value="pickaxe"][data-action="upgrade"]').disabled =
    state.pickaxe>=10||state.crystals<pickaxeCost();

  $("speedLevel").textContent =
    `Level ${state.speed} / 5 · ${attackInterval().toFixed(1)}s`;

  $("speedCost").textContent = state.speed>=5
    ? "MAX"
    : fmt(speedCost())+" C";

  $('[data-value="speed"][data-action="upgrade"]').disabled =
    state.speed>=5||state.crystals<speedCost();

  $("damageLevel").textContent = `Level ${state.damageLevel} / 10`;
  $("damageCost").textContent = state.damageLevel>=10
    ? "MAX"
    : fmt(damageCost())+" G";

  $('[data-value="damage"][data-action="upgrade"]').disabled =
    state.damageLevel>=10||state.gold<damageCost();

  $("critLevel").textContent =
    `Level ${state.crit} / 8 · ${state.crit*5}%`;

  $("critCost").textContent = state.crit>=8
    ? "MAX"
    : fmt(critCost())+" C";

  $('[data-value="crit"][data-action="upgrade"]').disabled =
    state.crit>=8||state.crystals<critCost();

  renderParty();
  renderRewards();
  renderSnacks();
  renderRecruits();
  renderSkills();
  renderHospital();
  renderLog();
}

/* ---------- BUTTON HANDLING ---------- */

/*
  One delegated listener handles every game button, including
  buttons created again when the interface is rendered.
*/

document.addEventListener("click",event => {
  const skillButton = event.target.closest("[data-skill]");

  if (skillButton) {
    if (!skillButton.disabled) {
      castSkill(skillButton.dataset.skill);
    }
    return;
  }

  const button = event.target.closest("[data-action]");

  if (!button||button.disabled) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "explore":
      explore();
      break;

    case "mine":
      mineCrystals();
      break;

    case "boss":
      if (isBossDone()) {
        toast("This guardian has already been defeated.");
      } else if (state.enemy) {
        toast("Defeat your current enemy first.");
      } else {
        spawnEnemy(true);
      }
      break;

    case "payHeal":
      payHospitalFee();
      break;

    case "upgrade":
      upgrade(value);
      break;

    case "hire":
      hireRecruit(value);
      break;

    case "useSnack":
      useSnack(value);
      break;

    case "buySnack":
      buySnack(value);
      break;

    case "clearLog":
      logs = [];
      renderLog();
      break;

    case "reset":
      resetGame();
      break;
  }
});

// Keyboard shortcuts: Q W E R T Y U
document.addEventListener("keydown",event => {
  if (event.repeat) return;

  if (["INPUT","TEXTAREA","SELECT"].includes(
    document.activeElement.tagName
  )) return;

  const shortcuts = {
    q:"slash",
    w:"burst",
    e:"guard",
    r:"heal",
    t:"meteor",
    y:"frost",
    u:"phoenix"
  };

  const skill = shortcuts[event.key.toLowerCase()];

  if (skill) castSkill(skill);
});

/* ---------- GAME LOOP ---------- */

function gameTick() {
  const performanceNow = performance.now();

  const dt = Math.min(
    .5,
    Math.max(0,(performanceNow-lastTick)/1000)
  );

  lastTick = performanceNow;
  const now = Date.now();

  // Hospital timers keep running even though combat is paused.
  if (state.healingUntil&&now>=state.healingUntil) {
    finishHealing();
  }

  // Passive recruit income.
  if (state.recruits.includes("tessa")) state.gold += .8*dt;
  if (state.recruits.includes("borin")) state.gold += 1.3*dt;
  if (state.recruits.includes("kellan")) state.crystals += .3*dt;

  if (!locked()) {
    for (const key of Object.keys(state.cooldowns)) {
      state.cooldowns[key] = Math.max(
        0,
        state.cooldowns[key]-dt
      );
    }

    if (state.enemy) {
      partyClock += dt;
      enemyClock += dt;

      if (partyClock>=attackInterval()) {
        partyClock = 0;
        partyAttack();
      }

      const bossExtra =
        state.enemy&&state.enemy.boss ? .45 : 0;

      const frostMultiplier =
        state.frostUntil>now ? 1.4 : 1;

      const enemyInterval = Math.max(
        2.2,
        5-state.region*.6-bossExtra
      )*frostMultiplier;

      if (
        state.enemy&&
        !locked()&&
        enemyClock>=enemyInterval
      ) {
        enemyClock = 0;
        enemyAttack();
      }

      // Celeste's passive healing aura.
      if (
        state.heroes.includes("celeste")&&
        alive().includes("celeste")
      ) {
        state.healClock += dt;

        if (state.healClock>=10) {
          state.healClock = 0;

          const target = alive().sort(
            (a,b) =>
              state.heroHp[a]/HEROES[a].hp-
              state.heroHp[b]/HEROES[b].hp
          )[0];

          if (target) {
            const amount =
              7+(state.recruits.includes("elise")?4:0);

            state.heroHp[target] = Math.min(
              HEROES[target].hp,
              state.heroHp[target]+amount
            );
          }
        }
      }
    }
  }

  render();

  if (now-lastSave>=5000) {
    saveGame();
  }
}

function resetGame() {
  if (!confirm("Reset all Gem Miner progress? This cannot be undone.")) {
    return;
  }

  clearTimeout(explorationTimer);

  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(OLD_SAVE_KEY);
  localStorage.removeItem("gemMinerCrystalKingdom_v4");

  state = clone(DEFAULTS);
  logs = [];
  partyClock = 0;
  enemyClock = 0;

  addLog("A fresh expedition begins. Good luck, miner!");

  render();
  saveGame();
  scheduleExploration();
}

/* ---------- STARTUP ---------- */

addLog("The crystal road awaits. Your party is ready.");

render();
saveGame();

if (!state.enemy&&!locked()) {
  scheduleExploration();
}

window.setInterval(gameTick,200);