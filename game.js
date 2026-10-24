
"use strict";

/* GEM MINER: RISE OF THE CRYSTAL KINGDOM
   All game logic lives in this file.
   Buttons use delegated event handling so they keep working
   after the interface is refreshed.
*/

const $ = id => document.getElementById(id);
const SAVE_KEY = "gemMinerCrystalKingdomCode_v5";
const OLD_SAVE_KEY = "gemMinerCrystalKingdom_v3";

const HEROES = {
  aiden: {
    name:"Aiden", role:"Knight", emoji:"🛡️",
    sprite:"assets/knight.svg", hp:145, damage:12,
    tagline:"Loyal and sturdy. Always at the front."
  },
  seraphine: {
    name:"Seraphine", role:"Mage", emoji:"🧙‍♀️",
    sprite:"assets/mage.svg", hp:92, damage:17,
    tagline:"Crystal magic becomes firepower."
  },
  liria: {
    name:"Liria", role:"Archer", emoji:"🏹",
    sprite:"assets/archer.svg", hp:104, damage:15,
    tagline:"Quick shots from a distance."
  },
  celeste: {
    name:"Celeste", role:"Healer", emoji:"✨",
    sprite:"assets/hero-mage.svg", hp:112, damage:8,
    tagline:"Keeps the team in the fight."
  },
  ragnar: {
    name:"Ragnar", role:"Berserker", emoji:"🔥",
    sprite:"assets/knight.svg", hp:128, damage:24,
    tagline:"Big hits. Bigger smiles."
  },
  kael: {
    name:"Kael", role:"Rogue", emoji:"🗡️",
    sprite:"assets/hero-mage.svg", hp:98, damage:19,
    tagline:"Fast feet and precise strikes."
  },
  sage: {
    name:"Sage", role:"Druid", emoji:"🌿",
    sprite:"assets/archer.svg", hp:118, damage:13,
    tagline:"The forest answers the call."
  }
};

const REGIONS = [
  {
    name:"The Shattered Cavern",
    enemy:"Glimmer Slime", emoji:"🟣",
    type:"CRYSTAL CREATURE",
    hp:90, damage:8, gold:12, crystals:5,
    boss:"The Prism Warden", bossHp:490, bossDamage:16,
    desc:"An ancient sentinel sealed inside the cavern.",
    reward:"celeste"
  },
  {
    name:"Moonlit Grotto",
    enemy:"Grotto Stalker", emoji:"🐺",
    type:"ABYSSAL BEAST",
    hp:155, damage:12, gold:23, crystals:8,
    boss:"The Moonfang", bossHp:880, bossDamage:23,
    desc:"A moon-cursed hunter prowls the luminous pools.",
    reward:"ragnar"
  },
  {
    name:"The Ember Reliquary",
    enemy:"Cinder Wisp", emoji:"👻",
    type:"EMBER SPIRIT",
    hp:270, damage:17, gold:37, crystals:13,
    boss:"The Ashen Sovereign", bossHp:1550, bossDamage:33,
    desc:"A sovereign of flame guards the buried reliquary.",
    reward:"kael"
  },
  {
    name:"Skyglass Sanctum",
    enemy:"Skyglass Sentinel", emoji:"💠",
    type:"ANCIENT CONSTRUCT",
    hp:450, damage:24, gold:58, crystals:21,
    boss:"The Star-Eater", bossHp:2700, bossDamage:46,
    desc:"A star-born titan guards the final seal.",
    reward:"sage"
  }
];

const RECRUITS = [
  {id:"tessa", name:"Tessa", role:"Miner", emoji:"⛏️", cost:55, desc:"+0.8 gold per second"},
  {id:"borin", name:"Borin", role:"Miner", emoji:"🧔", cost:80, desc:"+1.3 gold per second"},
  {id:"luna", name:"Luna", role:"Gatherer", emoji:"🌱", cost:95, desc:"+20% mining crystals"},
  {id:"silas", name:"Silas", role:"Scholar", emoji:"📚", cost:125, desc:"+15% skill damage"},
  {id:"mira", name:"Mira", role:"Cook", emoji:"🍲", cost:115, desc:"+25% snack healing"},
  {id:"juno", name:"Juno", role:"Alchemist", emoji:"🧪", cost:150, desc:"+1 ore when mining"},
  {id:"darius", name:"Darius", role:"Crossbowman", emoji:"🏹", cost:190, desc:"+6 party attack damage"},
  {id:"elise", name:"Elise", role:"Spirit Guide", emoji:"🔮", cost:225, desc:"+20% healing power"},
  {id:"kellan", name:"Kellan", role:"Engineer", emoji:"⚙️", cost:270, desc:"+0.3 crystals per second"}
];

const SNACKS = [
  {id:"rations", name:"Trail Rations", icon:"🥖", cost:24, desc:"Heal your most injured living hero by 35 HP."},
  {id:"moonberries", name:"Moonberries", icon:"🫐", cost:40, desc:"Increase party damage by 25% for 20 seconds."},
  {id:"tea", name:"Miner's Tea", icon:"🍵", cost:32, desc:"Gain 4 ore."},
  {id:"cake", name:"Crystal Cake", icon:"🍰", cost:75, desc:"Heal living heroes by 24 HP."}
];

const INITIAL_HEROES = ["aiden","seraphine","liria"];
const INITIAL_HP = {
  aiden:145,
  seraphine:92,
  liria:104
};

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
  heroHp:{...INITIAL_HP},
  recruits:[],
  snacks:{rations:2,moonberries:1,tea:1,cake:0},
  cooldowns:{
    slash:0,burst:0,guard:0,heal:0,
    meteor:0,frost:0,phoenix:0
  },
  buffUntil:0,
  frostUntil:0,
  guardCharges:0,
  enemy:null,
  needsHospital:false,
  hospitalFee:0,
  healingUntil:0,
  healClock:0
};

const clone = value => JSON.parse(JSON.stringify(value));
const fmt = n => Math.max(0,Math.floor(Number(n)||0)).toLocaleString();
const region = () => REGIONS[state.region];
const alive = () => state.heroes.filter(id => (state.heroHp[id]||0)>0);
const isBossDone = () => state.bosses.includes(state.region);
const recovering = () => state.healingUntil > Date.now();
const locked = () => state.needsHospital || recovering();

function loadGame() {
  let saved = {};

  try {
    saved = JSON.parse(
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem(OLD_SAVE_KEY) ||
      "{}"
    ) || {};
  } catch (error) {
    console.warn("Could not load old save:",error);
  }

  const result = {...clone(DEFAULTS),...saved};

  result.region = Math.max(
    0,
    Math.min(REGIONS.length-1,Number(result.region)||0)
  );

  result.heroHp = {...INITIAL_HP,...(saved.heroHp||{})};
  result.snacks = {...DEFAULTS.snacks,...(saved.snacks||{})};
  result.cooldowns = {...DEFAULTS.cooldowns,...(saved.cooldowns||{})};

  result.heroes = Array.isArray(saved.heroes)
    ? saved.heroes.filter(id => HEROES[id])
    : INITIAL_HEROES.slice();

  if (!result.heroes.length) {
    result.heroes = INITIAL_HEROES.slice();
  }

  result.recruits = Array.isArray(saved.recruits)
    ? saved.recruits.filter(id => RECRUITS.some(r=>r.id===id))
    : [];

  result.bosses = Array.isArray(saved.bosses)
    ? saved.bosses
    : [];

  // Ensure that saved boss victories grant their corresponding heroes.
  result.bosses.forEach(index => {
    const heroId = REGIONS[index]?.reward;
    if (heroId && !result.heroes.includes(heroId)) {
      result.heroes.push(heroId);
      result.heroHp[heroId] = HEROES[heroId].hp;
    }
  });

  result.heroes.forEach(id => {
    if (!Number.isFinite(Number(result.heroHp[id]))) {
      result.heroHp[id] = HEROES[id].hp;
    }

    result.heroHp[id] = Math.max(
      0,
      Math.min(HEROES[id].hp,Number(result.heroHp[id]))
    );
  });

  return result;
}

let state = loadGame();
let logs = [];
let partyClock = 0;
let enemyClock = 0;
let lastTick = performance.now();
let explorationTimer = null;
let toastTimer = null;
let lastSave = Date.now();

const pickaxeCost = () => Math.floor(35*Math.pow(1.8,state.pickaxe-1));
const speedCost = () => Math.floor(40*Math.pow(1.9,state.speed));
const damageCost = () => Math.floor(60*Math.pow(1.8,state.damageLevel));
const critCost = () => Math.floor(50*Math.pow(1.85,state.crit));
const attackInterval = () => Math.max(3.5,6-state.speed*.5);

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    lastSave = Date.now();
  } catch (error) {
    console.warn("Saving failed:",error);
    toast("Could not save. Check browser storage settings.");
  }
}

function toast(message) {
  const element = $("toast");
  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => element.classList.remove("show"),
    2400
  );
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

function canBattle() {
  if (state.needsHospital) {
    toast("Pay the hospital fee before battles resume.");
    return false;
  }

  if (recovering()) {
    toast("Your heroes are in treatment. Battles are paused.");
    return false;
  }

  if (alive().length===0) {
    partyWiped();
    return false;
  }

  return true;
}

/* ---------- EXPLORATION ---------- */

function scheduleExploration() {
  clearTimeout(explorationTimer);

  if (state.enemy || locked() || !alive().length) return;

  // A hidden random delay between 10 and 20 seconds.
  const delay = 10000 + Math.random()*10000;

  explorationTimer = setTimeout(() => {
    if (!state.enemy && !locked() && alive().length) {
      explore();
    } else {
      scheduleExploration();
    }
  },delay);
}

function explore() {
  if (state.enemy) {
    toast("Defeat the current enemy first.");
    return;
  }

  if (!canBattle()) return;

  clearTimeout(explorationTimer);

  // Sometimes the party finds resources instead of a monster.
  if (Math.random()<.68) {
    spawnEnemy(false);
  } else {
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
}

/* ---------- MINING ---------- */

function mineCrystals() {
  const multiplier = state.recruits.includes("luna") ? 1.2 : 1;
  const amount = Math.max(
    1,
    Math.floor((state.pickaxe*3+Math.random()*state.pickaxe)*multiplier)
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
    const hp = Math.floor(r.hp*scale*(.85+Math.random()*.3));

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

    const criticalChance = Math.min(
      .5,
      state.crit*.05+(id==="kael"?.15:0)
    );

    const critical = Math.random()<criticalChance;

    damage = Math.max(
      1,
      Math.floor(damage*(critical?1.8:1)*(.88+Math.random()*.24))
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

  // The front line takes damage first.
  // If a front-line hero falls, the remaining party continues.
  const order = [
    "aiden","ragnar","kael",
    "seraphine","liria","celeste","sage"
  ];

  const targetId = order.find(id =>
    state.heroes.includes(id) && (state.heroHp[id]||0)>0
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

    // The first victory in this cave grants its new hero.
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
      addLog("All cave guardians defeated! The Crystal Kingdom is yours.");
      toast("The final guardian has fallen!");
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

  // Small recovery after a victory, not a retreat.
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

  // Combat ends only when every hero is down.
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
    ? "Battles are paused while the healers treat your team. You can still mine and hire recruits."
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

  const attacks = ["slash","burst","meteor","frost"];

  if (attacks.includes(key) && !state.enemy) {
    toast("There is no enemy to target.");
    return;
  }

  if (
    ["heal","phoenix"].includes(key) &&
    !state.heroes.includes("celeste")
  ) {
    toast("Defeat the first cave guardian to unlock Celeste.");
    return;
  }

  const bonus = state.recruits.includes("silas") ? 1.15 : 1;

  if (key==="slash") {
    const damage = Math.floor((45+state.pickaxe*5+state.region*12)*bonus);
    state.enemy.hp -= damage;
    state.cooldowns.slash = 8;
    showEffect("SLASH -"+damage);
    addLog(`Radiant Slash deals ${damage} damage.`);
  }

  if (key==="burst") {
    const damage = Math.floor((72+state.region*20)*bonus);
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
    addLog("Aegis Guard healed the party and will soften the next hit.");
  }

  if (key==="heal") {
    const amount = Math.floor(28*(state.recruits.includes("elise")?1.2:1));

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
    const damage = Math.floor((105+state.region*28)*bonus);
    state.enemy.hp -= damage;
    state.cooldowns.meteor = 22;
    showEffect("METEOR -"+damage);
    addLog(`Meteor Rain deals ${damage} damage.`);
  }

  if (key==="frost") {
    const damage = Math.floor((22+state.region*6)*bonus);
    state.enemy.hp -= damage;
    state.frostUntil = Date.now()+8000;
    state.cooldowns.frost = 17;
    showEffect("FROST -"+damage);
    addLog(`Frost Nova deals ${damage} damage and slows the enemy.`);
  }

  if (key==="phoenix") {
    const fallen = state.heroes.find(id => (state.heroHp[id]||0)<=0);

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
      return toast("Not enough crystals for that upgrade.");
    }

    state.crystals -= cost;
    state.pickaxe++;

    addLog(`Pickaxe upgraded to level ${state.pickaxe}.`);
  }

  if (kind==="speed") {
    const cost = speedCost();

    if (state.speed>=5 || state.crystals<cost) {
      return toast("Not enough crystals for that upgrade.");
    }

    state.crystals -= cost;
    state.speed++;
    partyClock = 0;

    addLog(`Party attack interval is now ${attackInterval().toFixed(1)} seconds.`);
  }

  if (kind==="damage") {
    const cost = damageCost();

    if (state.damageLevel>=10 || state.gold<cost) {
      return toast("Not enough gold for that upgrade.");
    }

    state.gold -= cost;
    state.damageLevel++;

    addLog(`Party damage upgraded to level ${state.damageLevel}.`);
  }

  if (kind==="crit") {
    const cost = critCost();

    if (state.crit>=8 || state.crystals<cost) {
      return toast("Not enough crystals for that upgrade.");
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

    alive().forEach(hero => {
      state.heroHp[hero] = Math.min(
        HEROES[hero].hp,
        state.heroHp[hero]+healing
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

/* ---------- RENDERING ---------- */


const HERO_ART = {
  aiden: {
    skin:"#edbd99", hair:"#49302b", eyes:"#273f62",
    cloak:"#293c69", armor:"#6483ba", trim:"#f2d28a",
    bg1:"#514174", bg2:"#192b49", style:"knight"
  },
  seraphine: {
    skin:"#f2c9ad", hair:"#743c91", eyes:"#82e9ff",
    cloak:"#563e85", armor:"#7568bb", trim:"#c4a8ff",
    bg1:"#5f397b", bg2:"#182c50", style:"mage"
  },
  liria: {
    skin:"#dca987", hair:"#a95b39", eyes:"#a9f0cb",
    cloak:"#285d65", armor:"#468b85", trim:"#e7c887",
    bg1:"#285a66", bg2:"#182a45", style:"archer"
  },
  celeste: {
    skin:"#f3c9b6", hair:"#79bfdc", eyes:"#69e4e1",
    cloak:"#386b98", armor:"#e1f3fa", trim:"#f6d58d",
    bg1:"#356f99", bg2:"#202b51", style:"healer"
  },
  ragnar: {
    skin:"#d99d7b", hair:"#e65b36", eyes:"#ffc766",
    cloak:"#702c38", armor:"#8f3b43", trim:"#ffcb75",
    bg1:"#8a3d46", bg2:"#2c1b37", style:"berserker"
  },
  kael: {
    skin:"#d6a68d", hair:"#272b4c", eyes:"#c6a5ff",
    cloak:"#242943", armor:"#49466b", trim:"#c0b4e9",
    bg1:"#49406d", bg2:"#15182d", style:"rogue"
  },
  sage: {
    skin:"#e6b99a", hair:"#6d9e65", eyes:"#b6f28b",
    cloak:"#285942", armor:"#478364", trim:"#dfcf83",
    bg1:"#36785a", bg2:"#172c36", style:"druid"
  }
};

function heroPortraitSVG(id) {
  const p = HERO_ART[id];
  if (!p) return `<span>🧙</span>`;

  const uid = "portrait-" + id;

  const fringes = {
    aiden:`<path d="M29 39 Q25 21 39 20 L45 29 L51 20 L60 29 L69 23 Q78 31 70 43 L61 36 L51 41 L41 34 Z" fill="${p.hair}"/>`,
    seraphine:`<path d="M28 42 Q24 19 40 21 L47 30 L55 21 Q75 21 72 42 L61 37 L54 43 L43 35 L35 43 Z" fill="${p.hair}"/>`,
    liria:`<path d="M26 40 Q26 19 43 21 L50 29 L59 21 Q76 24 72 43 L60 35 L49 42 L39 34 Z" fill="${p.hair}"/>`,
    celeste:`<path d="M28 39 Q26 17 43 20 L49 29 L57 21 Q75 21 72 42 L62 36 L55 41 L43 34 L35 42 Z" fill="${p.hair}"/>`,
    ragnar:`<path d="M27 42 L22 24 L37 29 L37 12 L49 24 L58 10 L63 27 L78 18 L72 42 L62 34 L51 42 L39 35 Z" fill="${p.hair}"/>`,
    kael:`<path d="M26 43 Q20 19 42 19 L48 29 L59 19 Q77 23 72 44 L61 36 L53 42 L42 34 L34 43 Z" fill="${p.hair}"/>`,
    sage:`<path d="M28 41 Q24 20 42 21 L49 30 L57 20 Q75 22 72 42 L62 35 L52 42 L42 34 L35 42 Z" fill="${p.hair}"/>`
  };

  let accessory = "";

  if (p.style==="knight") {
    accessory = `
      <path d="M26 32 Q29 11 50 11 Q71 11 74 32 L68 40 L61 31 L50 36 L39 31 L31 40 Z"
        fill="#92abd1" stroke="#e7d6a1" stroke-width="2"/>
      <path d="M47 15 L50 27 L53 15" fill="#f7e5b4"/>
      <path d="M38 39 L43 42 M57 42 L62 39" stroke="#263953" stroke-width="2"/>`;
  }

  if (p.style==="mage") {
    accessory = `
      <path d="M22 30 L43 19 L47 2 L57 18 L78 28 L64 30 L62 36 L37 36 L34 29 Z"
        fill="#6e54a6" stroke="#d8b7ff" stroke-width="2"/>
      <path d="M49 10 L52 16 L59 17 L54 21 L55 28 L49 24 L44 28 L45 21 L40 17 L47 16 Z"
        fill="#9df5ff"/>`;
  }

  if (p.style==="archer") {
    accessory = `
      <path d="M27 42 Q11 20 36 12 L59 15 Q81 21 74 43 L64 34 L56 39 L45 32 L35 41 Z"
        fill="#24515e" stroke="#6bb4a5" stroke-width="2"/>
      <path d="M79 39 Q93 57 79 82" fill="none" stroke="#e5ca86" stroke-width="3"/>
      <path d="M76 39 L80 33 M76 82 L80 88" stroke="#e5ca86" stroke-width="2"/>`;
  }

  if (p.style==="healer") {
    accessory = `
      <ellipse cx="50" cy="22" rx="23" ry="7"
        fill="none" stroke="#f5e6a2" stroke-width="3"/>
      <path d="M50 8 L53 17 L62 20 L53 23 L50 32 L47 23 L38 20 L47 17 Z"
        fill="#fff1b2"/>
      <path d="M62 62 L72 73 L65 79 L56 69 Z" fill="#91e8e7"/>`;
  }

  if (p.style==="berserker") {
    accessory = `
      <path d="M29 30 L16 17 L34 21 L33 5 L47 20 L55 3 L61 22 L81 11 L73 31"
        fill="#ff944e" opacity=".9"/>
      <path d="M31 38 L20 29 L33 30 L42 35 M69 38 L80 29 L67 30 L58 35"
        fill="none" stroke="#f6c376" stroke-width="4"/>`;
  }

  if (p.style==="rogue") {
    accessory = `
      <path d="M23 45 Q19 15 50 11 Q82 17 77 45 L68 41 L62 30 L50 25 L38 30 L32 42 Z"
        fill="#242741" stroke="#877ab4" stroke-width="2"/>
      <path d="M28 46 L50 36 L72 46" fill="none" stroke="#a99bd9" stroke-width="2"/>
      <path d="M27 66 L17 84 M73 66 L83 84" stroke="#d8e0f8" stroke-width="3"/>`;
  }

  if (p.style==="druid") {
    accessory = `
      <path d="M32 27 Q20 11 12 18 Q18 34 36 35 Z" fill="#8cc477" stroke="#d4eaa0" stroke-width="1.5"/>
      <path d="M50 26 Q44 7 51 3 Q64 15 58 28 Z" fill="#acd982" stroke="#d4eaa0" stroke-width="1.5"/>
      <path d="M66 32 Q80 14 88 23 Q80 39 65 38 Z" fill="#6cad79" stroke="#d4eaa0" stroke-width="1.5"/>
      <path d="M47 28 L55 37 L65 28" fill="none" stroke="#d4eaa0" stroke-width="2"/>`;
  }

  return `
  <svg class="character-art" viewBox="0 0 100 120"
       xmlns="http://www.w3.org/2000/svg"
       role="img" aria-label="${p.style} hero portrait">
    <defs>
      <linearGradient id="${uid}-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.bg1}"/>
        <stop offset="1" stop-color="${p.bg2}"/>
      </linearGradient>
      <linearGradient id="${uid}-coat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.armor}"/>
        <stop offset="1" stop-color="${p.cloak}"/>
      </linearGradient>
    </defs>

    <rect width="100" height="120" rx="10" fill="url(#${uid}-bg)"/>
    <circle cx="50" cy="48" r="35" fill="${p.trim}" opacity=".10"/>
    <path d="M4 120 Q8 84 29 76 L43 73 L57 73 L72 77 Q92 85 96 120 Z"
      fill="${p.cloak}" stroke="${p.trim}" stroke-opacity=".7" stroke-width="1.5"/>
    <path d="M26 120 L34 83 L50 91 L66 83 L76 120 Z"
      fill="url(#${uid}-coat)"/>
    <path d="M41 76 L50 90 L59 76"
      fill="none" stroke="${p.trim}" stroke-width="3"/>

    <path d="M40 65 L40 79 Q50 88 60 79 L60 65 Z"
      fill="${p.skin}"/>

    <path d="M25 47 Q20 18 50 17 Q80 18 75 47
      L70 62 Q66 75 50 76 Q34 75 30 62 Z"
      fill="${p.hair}"/>

    <ellipse cx="50" cy="48" rx="20" ry="25" fill="${p.skin}"/>

    <path d="M30 42 Q27 22 44 22 Q57 14 70 29
      L70 42 L63 33 L54 37 L45 29 L37 42 Z"
      fill="${p.hair}"/>

    ${fringes[id] || ""}

    <path d="M37 49 Q41 46 45 49"
      fill="none" stroke="${p.hair}" stroke-width="2" stroke-linecap="round"/>
    <path d="M55 49 Q59 46 63 49"
      fill="none" stroke="${p.hair}" stroke-width="2" stroke-linecap="round"/>

    <ellipse cx="41" cy="53" rx="3.5" ry="4" fill="${p.eyes}"/>
    <ellipse cx="59" cy="53" rx="3.5" ry="4" fill="${p.eyes}"/>
    <circle cx="42" cy="52" r="1.2" fill="white"/>
    <circle cx="60" cy="52" r="1.2" fill="white"/>

    <path d="M45 64 Q50 67 55 64"
      fill="none" stroke="#a35e68" stroke-width="1.7" stroke-linecap="round"/>

    <path d="M17 103 L29 85 L42 97 L50 91 L59 97 L72 85 L84 103"
      fill="none" stroke="${p.trim}" stroke-opacity=".65" stroke-width="2"/>

    ${accessory}

    <path d="M8 10 L11 18 L19 21 L11 24 L8 32 L5 24 L0 21 L5 18 Z"
      fill="#ffffff" opacity=".55"/>
    <circle cx="87" cy="14" r="2" fill="${p.trim}"/>
    <circle cx="87" cy="23" r="1.4" fill="#ffffff" opacity=".8"/>
  </svg>`;
}

function avatar(id) {
  return `<div class="avatar">${heroPortraitSVG(id)}</div>`;
}

function renderParty() {
  $("battleParty").innerHTML = state.heroes.map(id => {
    const fallen = (state.heroHp[id]||0)<=0;

    return `<div class="hero-token ${fallen?"fallen":""}"
      title="${HEROES[id].name}">
      ${heroPortraitSVG(id)}
    </div>`;
  }).join("");

  $("companions").innerHTML = state.heroes.map(id => {
    const hero = HEROES[id];
    const hp = state.heroHp[id]||0;
    const percent = Math.max(0,hp/hero.hp*100);
    const fallen = hp<=0;

    return `<article class="companion ${fallen?"fallen":""}">
      ${avatar(id)}
      <div style="min-width:0;flex:1">
        <b>${hero.name}</b>
        <small>${hero.role}</small>
        <div class="minihealth"><i style="width:${percent}%"></i></div>
        <small>${fallen?"DOWN":`HP ${Math.floor(hp)} / ${hero.hp}`}</small>
      </div>
    </article>`;
  }).join("");

  const power = alive().reduce(
    (total,id)=>total+HEROES[id].damage,
    0
  )+state.damageLevel*4;

  $("partyPower").textContent = "PARTY POWER · "+fmt(power);
}


function renderRewards() {
  const r = region();

  if (isBossDone()) {
    $("nextHeroCard").innerHTML = `
      <div class="reward-title">CAVE CLEARED</div>
      <b>Guardian defeated!</b>
      <small>${state.region===REGIONS.length-1
        ?"Every guardian has fallen."
        :"Your route to the next cave is open."}</small>`;
    return;
  }

  const hero = HEROES[r.reward];

  $("nextHeroCard").innerHTML = `
    <div class="reward-title">BOSS REWARD · NEW HERO</div>
    <b>${hero.emoji} ${hero.name} · ${hero.role}</b>
    <small>${hero.tagline}</small>
    <small>Defeat this cave's guardian to recruit ${hero.name} automatically.</small>`;
}

function renderSnacks() {
  $("snackGrid").innerHTML = SNACKS.map(snack => {
    const count = state.snacks[snack.id]||0;

    return `<article class="snack">
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
    </article>`;
  }).join("");
}

function renderRecruits() {
  $("recruitCount").textContent = state.recruits.length+" hired";

  $("recruitGrid").innerHTML = RECRUITS.map(recruit => {
    const hired = state.recruits.includes(recruit.id);

    return `<article class="recruitcard">
      <div class="recruit-emoji">${recruit.emoji}</div>
      <b>${recruit.name}</b>
      <small>${recruit.role} · ${recruit.desc}</small>
      <button data-action="hire" data-value="${recruit.id}"
        ${hired||state.gold<recruit.cost?"disabled":""}>
        ${hired?"Hired":"Hire · "+recruit.cost+" G"}
      </button>
    </article>`;
  }).join("");
}

function renderSkills() {
  for (const key of Object.keys(state.cooldowns)) {
    const button = document.querySelector(`[data-skill="${key}"]`);
    const label = $("cd-"+key);

    const lockedHealer = ["heal","phoenix"].includes(key)
      && !state.heroes.includes("celeste");

    const needsEnemy = ["slash","burst","meteor","frost"].includes(key);

    button.disabled =
      locked() ||
      !alive().length ||
      lockedHealer ||
      (needsEnemy&&!state.enemy) ||
      state.cooldowns[key]>0;

    label.textContent = lockedHealer
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
  $("threat").textContent = ["Low","Moderate","High","Extreme"][state.region];
  $("guardianName").textContent = region().boss;
  $("guardianDesc").textContent = region().desc;
  $("bossPhase").textContent = isBossDone()?"DEFEATED":"DORMANT";

  $("bossBtn").textContent = isBossDone()
    ? "Guardian defeated"
    : "Challenge Guardian";

  const disabled = locked() || !alive().length;

  document.querySelector('[data-action="explore"]').disabled =
    !!state.enemy || disabled;

  $("bossBtn").disabled =
    isBossDone() || !!state.enemy || disabled;

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
    ? "MAX" : fmt(pickaxeCost())+" C";

  $('[data-value="pickaxe"][data-action="upgrade"]').disabled =
    state.pickaxe>=10 || state.crystals<pickaxeCost();

  $("speedLevel").textContent =
    `Level ${state.speed} / 5 · ${attackInterval().toFixed(1)}s`;

  $("speedCost").textContent = state.speed>=5
    ? "MAX" : fmt(speedCost())+" C";

  $('[data-value="speed"][data-action="upgrade"]').disabled =
    state.speed>=5 || state.crystals<speedCost();

  $("damageLevel").textContent = `Level ${state.damageLevel} / 10`;
  $("damageCost").textContent = state.damageLevel>=10
    ? "MAX" : fmt(damageCost())+" G";

  $('[data-value="damage"][data-action="upgrade"]').disabled =
    state.damageLevel>=10 || state.gold<damageCost();

  $("critLevel").textContent = `Level ${state.crit} / 8 · ${state.crit*5}%`;
  $("critCost").textContent = state.crit>=8
    ? "MAX" : fmt(critCost())+" C";

  $('[data-value="crit"][data-action="upgrade"]').disabled =
    state.crit>=8 || state.crystals<critCost();

  renderParty();
  renderRewards();
  renderSnacks();
  renderRecruits();
  renderSkills();
  renderHospital();
  renderLog();
}

/* ---------- BUTTON HANDLERS ---------- */

// IMPORTANT: this is the one listener for the entire game.
// It also handles buttons that are generated again during rendering.

document.addEventListener("click",event=>{
  const skillButton = event.target.closest("[data-skill]");

  if (skillButton) {
    if (!skillButton.disabled) {
      castSkill(skillButton.dataset.skill);
    }
    return;
  }

  const button = event.target.closest("[data-action]");

  if (!button || button.disabled) return;

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

// Keyboard shortcuts for skills.
document.addEventListener("keydown",event=>{
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

/* ---------- MAIN GAME LOOP ---------- */

function resetGame() {
  if (!confirm("Reset all Gem Miner progress? This cannot be undone.")) {
    return;
  }

  clearTimeout(explorationTimer);
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(OLD_SAVE_KEY);

  state = clone(DEFAULTS);
  logs = [];
  partyClock = 0;
  enemyClock = 0;

  addLog("A fresh expedition begins. Good luck, miner!");
  render();
  saveGame();
  scheduleExploration();
}

function gameTick() {
  const currentPerformance = performance.now();
  const dt = Math.min(
    .5,
    Math.max(0,(currentPerformance-lastTick)/1000)
  );

  lastTick = currentPerformance;
  const now = Date.now();

  // Hospital time continues even though combat is paused.
  if (state.healingUntil && now>=state.healingUntil) {
    finishHealing();
  }

  // Passive recruit income.
  if (state.recruits.includes("tessa")) state.gold += .8*dt;
  if (state.recruits.includes("borin")) state.gold += 1.3*dt;
  if (state.recruits.includes("kellan")) state.crystals += .3*dt;

  if (!locked()) {
    // Skills recharge in whole seconds.
    for (const key of Object.keys(state.cooldowns)) {
      state.cooldowns[key] = Math.max(0,state.cooldowns[key]-dt);
    }

    if (state.enemy) {
      partyClock += dt;
      enemyClock += dt;

      if (partyClock>=attackInterval()) {
        partyClock = 0;
        partyAttack();
      }

      const bossExtra = state.enemy && state.enemy.boss ? .45 : 0;
      const frostMultiplier = state.frostUntil>now ? 1.4 : 1;
      const enemyInterval = Math.max(
        2.2,
        5-state.region*.6-bossExtra
      )*frostMultiplier;

      if (state.enemy && !locked() && enemyClock>=enemyInterval) {
        enemyClock = 0;
        enemyAttack();
      }

      // Celeste's passive healing aura.
      if (
        state.heroes.includes("celeste") &&
        alive().includes("celeste")
      ) {
        state.healClock += dt;

        if (state.healClock>=10) {
          state.healClock = 0;

          const target = alive().sort(
            (a,b) =>
              state.heroHp[a]/HEROES[a].hp -
              state.heroHp[b]/HEROES[b].hp
          )[0];

          if (target) {
            const amount = 7+
              (state.recruits.includes("elise")?4:0);

            state.heroHp[target] = Math.min(
              HEROES[target].hp,
              state.heroHp[target]+amount
            );
          }
        }
      }
    }
  }

  // Refresh the interface so timers and resources stay visible.
  render();

  if (now-lastSave>=5000) saveGame();
}

// Start the game.
addLog("The crystal road awaits. Your party is ready.");
render();
saveGame();

if (!state.enemy && !locked()) {
  scheduleExploration();
}

window.setInterval(gameTick,200);
