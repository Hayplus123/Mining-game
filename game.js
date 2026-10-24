
"use strict";

const SAVE_KEY = "gemMinerCrystalKingdom_v5";

const regions = [
  { name: "Shattered Cavern", level: 1, hp: 100, damage: 7, ore: 5, coins: 8, sprite: "assets/slime.svg", enemy: "Crystal Slime" },
  { name: "Moonlit Grotto", level: 2, hp: 230, damage: 13, ore: 12, coins: 18, sprite: "assets/wisp.svg", enemy: "Moon Wisp" },
  { name: "Ember Reliquary", level: 3, hp: 480, damage: 22, ore: 24, coins: 35, sprite: "assets/stalker.svg", enemy: "Ember Stalker" },
  { name: "Skyglass Sanctum", level: 4, hp: 900, damage: 36, ore: 45, coins: 70, sprite: "assets/boss.svg", enemy: "Skyglass Guardian" }
];

const heroes = [
  { id: "knight", name: "Alden the Knight", role: "Defender", icon: "🛡️", sprite: "assets/knight.svg", cost: 60, damage: 10, hp: 120, desc: "A sturdy frontline fighter." },
  { id: "mage", name: "Mira the Mage", role: "Mage", icon: "🔮", sprite: "assets/mage.svg", cost: 100, damage: 19, hp: 75, desc: "Deals powerful magic damage." },
  { id: "archer", name: "Lyn the Archer", role: "Ranger", icon: "🏹", sprite: "assets/archer.svg", cost: 140, damage: 16, hp: 85, desc: "Fast, accurate ranged attacks." },
  { id: "healer", name: "Seren the Healer", role: "Healer", icon: "💚", sprite: "assets/hero-mage.svg", cost: 180, damage: 8, hp: 100, desc: "Improves the party's survival." }
];

const skillData = [
  { id: "slash", name: "Radiant Slash", icon: "⚔️", key: "Q", cost: 0, cooldown: 8, desc: "Deal 2.5× team damage.", unlock: 1 },
  { id: "burst", name: "Arcane Burst", icon: "💥", key: "W", cost: 100, cooldown: 15, desc: "Deal 5× team damage.", unlock: 1 },
  { id: "aegis", name: "Aegis Guard", icon: "🛡️", key: "E", cost: 150, cooldown: 20, desc: "Heal the party and reduce incoming damage.", unlock: 1 },
  { id: "meteor", name: "Meteor Rain", icon: "☄️", key: "R", cost: 300, cooldown: 30, desc: "Deal 8× team damage.", unlock: 2 },
  { id: "frost", name: "Frost Nova", icon: "❄️", key: "T", cost: 450, cooldown: 25, desc: "Deal 3× damage and weaken the enemy.", unlock: 3 },
  { id: "phoenix", name: "Phoenix Blessing", icon: "🔥", key: "Y", cost: 650, cooldown: 45, desc: "Heal the party and unleash a powerful strike.", unlock: 4 }
];

const snackData = [
  { id: "ration", name: "Trail Rations", icon: "🍪", desc: "Restore 30% team health.", cost: 15 },
  { id: "berry", name: "Moonberries", icon: "🫐", desc: "Boost team damage by 50% for 30 seconds.", cost: 35 },
  { id: "tea", name: "Miner's Tea", icon: "🍵", desc: "Double mining rewards for 30 seconds.", cost: 30 },
  { id: "cake", name: "Crystal Cake", icon: "🍰", desc: "Restore 60% team health.", cost: 65 }
];

const upgradeData = [
  { id: "pickaxe", name: "Pickaxe", icon: "⛏️", desc: "More ore from each manual mine.", max: 10, base: 25 },
  { id: "damage", name: "Combat Training", icon: "⚔️", desc: "Increase all party damage.", max: 20, base: 40 },
  { id: "health", name: "Vitality Training", icon: "❤️", desc: "Increase maximum party health.", max: 15, base: 35 },
  { id: "speed", name: "Attack Speed", icon: "⚡", desc: "Party attacks more frequently.", max: 5, base: 80 },
  { id: "critical", name: "Critical Strikes", icon: "💥", desc: "Increase chance of bonus damage.", max: 10, base: 60 }
];

const minerBaseCost = 25;
const cartBaseCost = 100;

function freshGame() {
  return {
    coins: 100,
    gems: 0,
    ore: 0,
    region: 0,
    enemyHP: 100,
    enemyMaxHP: 100,
    enemyName: "Crystal Slime",
    enemySprite: "assets/slime.svg",
    boss: false,
    bossesDefeated: 0,
    enemiesDefeated: 0,
    totalMined: 0,
    miners: 0,
    carts: 0,
    miningLevel: 0,
    upgrades: { pickaxe: 1, damage: 0, health: 0, speed: 0, critical: 0 },
    party: ["player"],
    recruited: [],
    heroHP: { player: 100 },
    snacks: { ration: 2, berry: 0, tea: 0, cake: 0 },
    unlockedSkills: ["slash", "burst", "aegis"],
    cooldowns: {},
    activeBuffs: {},
    questsClaimed: [],
    skillsUnlockedByCost: [],
    lastTick: Date.now(),
    lastLog: [],
    nextExplore: Date.now() + randomExploreDelay(),
    nextAttack: Date.now() + 6000,
    nextEnemyAttack: Date.now() + 5000,
    nextMinerTick: Date.now() + 1000,
    shieldUntil: 0,
    enemyWeakenedUntil: 0
  };
}

let game = freshGame();
let logs = [];
let toastTimer = null;
let saveTimer = null;

const $ = id => document.getElementById(id);
const now = () => Date.now();
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomExploreDelay = () => random(10000, 20000);

function formatNumber(value) {
  return Math.floor(value).toLocaleString();
}

function addLog(message) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  logs.unshift({ time, message });
  logs = logs.slice(0, 60);
  game.lastLog = logs;
  renderLog();
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function saveGame(showMessage = false) {
  try {
    game.lastTick = now();
    game.lastLog = logs.slice(0, 60);
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    if (showMessage) showToast("Game saved successfully!");
  } catch (error) {
    showToast("Could not save. Check your browser storage settings.");
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const defaults = freshGame();
    game = { ...defaults, ...parsed };
    game.upgrades = { ...defaults.upgrades, ...(parsed.upgrades || {}) };
    game.snacks = { ...defaults.snacks, ...(parsed.snacks || {}) };
    game.heroHP = { ...defaults.heroHP, ...(parsed.heroHP || {}) };
    game.cooldowns = { ...(parsed.cooldowns || {}) };
    game.activeBuffs = { ...(parsed.activeBuffs || {}) };
    logs = Array.isArray(parsed.lastLog) ? parsed.lastLog : [];
    if (!Array.isArray(game.party) || !game.party.includes("player")) game.party = ["player"];
    if (!Array.isArray(game.recruited)) game.recruited = [];
    if (!Array.isArray(game.unlockedSkills)) game.unlockedSkills = ["slash"];
    if (game.region < 0 || game.region >= regions.length) game.region = 0;
    if (!Number.isFinite(game.enemyHP) || game.enemyHP <= 0) spawnEnemy(false);
  } catch (error) {
    game = freshGame();
    logs = [];
  }
}

function partyMembers() {
  return game.party.map(id => {
    if (id === "player") return { id, name: "Crystal Adventurer", damage: 12, hp: 100, sprite: "assets/hero-mage.svg", role: "Adventurer" };
    return heroes.find(hero => hero.id === id);
  }).filter(Boolean);
}

function baseMaxHP() {
  return partyMembers().reduce((sum, hero) => sum + hero.hp, 0) * (1 + game.upgrades.health * 0.15);
}

function currentMaxHP() {
  return Math.floor(baseMaxHP());
}

function ensureHeroHP() {
  partyMembers().forEach(hero => {
    if (typeof game.heroHP[hero.id] !== "number") game.heroHP[hero.id] = hero.hp;
    game.heroHP[hero.id] = Math.min(game.heroHP[hero.id], Math.floor(hero.hp * (1 + game.upgrades.health * 0.15)));
  });
}

function currentTeamHP() {
  ensureHeroHP();
  return partyMembers().reduce((sum, hero) => sum + Math.max(0, game.heroHP[hero.id]), 0);
}

function teamDamage() {
  let total = partyMembers().reduce((sum, hero) => sum + hero.damage, 0);
  total *= 1 + game.upgrades.damage * 0.15;
  if (game.activeBuffs.damageUntil > now()) total *= 1.5;
  return Math.floor(total);
}

function attackInterval() {
  return Math.max(3500, 6000 - game.upgrades.speed * 500);
}

function upgradeCost(upgrade) {
  const level = game.upgrades[upgrade.id];
  return Math.floor(upgrade.base * Math.pow(1.55, level));
}

function minerCost() {
  return Math.floor(minerBaseCost * Math.pow(1.5, game.miners));
}

function cartCost() {
  return Math.floor(cartBaseCost * Math.pow(1.7, game.carts));
}

function miningUpgradeCost() {
  return Math.floor(50 * Math.pow(1.65, game.miningLevel));
}

function minerRate() {
  return game.miners * (1 + game.carts * 0.5) * (1 + game.miningLevel * 0.25);
}

function manualMineAmount() {
  return Math.floor(5 + game.upgrades.pickaxe * 4 + game.miningLevel * 2);
}

function spawnEnemy(isBoss = false) {
  const region = regions[game.region];
  game.boss = isBoss;
  game.enemyName = isBoss ? region.name + " Boss" : region.enemy;
  game.enemySprite = isBoss ? "assets/boss.svg" : region.sprite;
  game.enemyMaxHP = isBoss ? Math.floor(region.hp * 6) : region.hp;
  game.enemyHP = game.enemyMaxHP;
  game.nextAttack = now() + attackInterval();
  game.nextEnemyAttack = now() + enemyAttackInterval();
  game.enemyWeakenedUntil = 0;
  render();
}

function enemyAttackInterval() {
  const region = regions[game.region];
  return Math.max(1800, 5000 - (region.level - 1) * 650 - (game.boss ? 700 : 0));
}

function mine() {
  const amount = manualMineAmount();
  const multiplier = game.activeBuffs.miningUntil > now() ? 2 : 1;
  const actual = amount * multiplier;
  game.ore += actual;
  game.totalMined += actual;
  if (Math.random() < 0.18) {
    const bonus = random(1, 3);
    game.gems += bonus;
    addLog(`A rare crystal vein yielded ${bonus} gems!`);
  }
  addLog(`You mined ${actual} ore.`);
  render();
  saveGame();
}

function hireMiner() {
  const cost = minerCost();
  if (game.coins < cost) return showToast("Not enough coins to hire a miner.");
  game.coins -= cost;
  game.miners++;
  addLog("A new miner joined your mining crew.");
  render();
  saveGame();
}

function buyCart() {
  const cost = cartCost();
  if (game.coins < cost) return showToast("Not enough coins for a mine cart.");
  game.coins -= cost;
  game.carts++;
  addLog("Your mine cart increased mining productivity.");
  render();
  saveGame();
}

function upgradeMining() {
  const cost = miningUpgradeCost();
  if (game.coins < cost) return showToast("Not enough coins to improve the mine.");
  game.coins -= cost;
  game.miningLevel++;
  addLog(`Mining facility upgraded to level ${game.miningLevel}.`);
  render();
  saveGame();
}

function buyUpgrade(id) {
  const upgrade = upgradeData.find(item => item.id === id);
  if (!upgrade) return;
  const level = game.upgrades[id];
  if (level >= upgrade.max) return showToast("This upgrade has reached its maximum level.");
  const cost = upgradeCost(upgrade);
  if (game.coins < cost) return showToast("Not enough coins for this upgrade.");
  game.coins -= cost;
  game.upgrades[id]++;
  addLog(`${upgrade.name} upgraded to level ${game.upgrades[id]}.`);
  render();
  saveGame();
}

function recruit(id) {
  const hero = heroes.find(item => item.id === id);
  if (!hero || game.recruited.includes(id)) return;
  if (game.coins < hero.cost) return showToast("Not enough coins to recruit this hero.");
  game.coins -= hero.cost;
  game.recruited.push(id);
  game.party.push(id);
  game.heroHP[id] = hero.hp;
  addLog(`${hero.name} joined your party!`);
  render();
  saveGame();
}

function buySnack(id) {
  const snack = snackData.find(item => item.id === id);
  if (!snack) return;
  if (game.coins < snack.cost) return showToast("Not enough coins for that snack.");
  game.coins -= snack.cost;
  game.snacks[id] = (game.snacks[id] || 0) + 1;
  addLog(`Bought ${snack.name}.`);
  render();
  saveGame();
}

function useSnack(id) {
  if (!game.snacks[id]) return showToast("You don't have that snack.");
  game.snacks[id]--;
  const max = currentMaxHP();

  if (id === "ration" || id === "cake") {
    const ratio = id === "ration" ? 0.3 : 0.6;
    let heal = Math.floor(max * ratio);
    partyMembers().forEach(hero => {
      const cap = Math.floor(hero.hp * (1 + game.upgrades.health * 0.15));
      const missing = cap - game.heroHP[hero.id];
      const part = Math.min(missing, Math.ceil(heal * hero.hp / max));
      game.heroHP[hero.id] += part;
    });
    showToast(`${snackData.find(item => item.id === id).name} restored party health.`);
  } else if (id === "berry") {
    game.activeBuffs.damageUntil = now() + 30000;
    showToast("Moonberry boost: +50% damage for 30 seconds!");
  } else if (id === "tea") {
    game.activeBuffs.miningUntil = now() + 30000;
    showToast("Miner's Tea: double mining rewards for 30 seconds!");
  }

  addLog(`Used ${snackData.find(item => item.id === id).name}.`);
  render();
  saveGame();
}

function unlockSkill(id) {
  const skill = skillData.find(item => item.id === id);
  if (!skill || game.unlockedSkills.includes(id)) return;
  if (game.region + 1 < skill.unlock) return showToast("Advance further to unlock this skill.");
  if (game.coins < skill.cost) return showToast("Not enough coins to unlock this skill.");
  game.coins -= skill.cost;
  game.unlockedSkills.push(id);
  addLog(`Unlocked skill: ${skill.name}.`);
  render();
  saveGame();
}

function skillRemaining(id) {
  return Math.max(0, Math.ceil(((game.cooldowns[id] || 0) - now()) / 1000));
}

function useSkill(id) {
  const skill = skillData.find(item => item.id === id);
  if (!skill || !game.unlockedSkills.includes(id)) return;
  if (skillRemaining(id) > 0) return showToast(`${skill.name} is on cooldown.`);
  game.cooldowns[id] = now() + skill.cooldown * 1000;

  const damage = teamDamage();
  if (id === "slash") damageEnemy(Math.floor(damage * 2.5), skill.name);
  if (id === "burst") damageEnemy(Math.floor(damage * 5), skill.name);
  if (id === "meteor") damageEnemy(Math.floor(damage * 8), skill.name);
  if (id === "frost") {
    damageEnemy(Math.floor(damage * 3), skill.name);
    game.enemyWeakenedUntil = now() + 10000;
    addLog("Frost Nova weakened the enemy's attacks for 10 seconds.");
  }
  if (id === "aegis") {
    healParty(0.3);
    game.shieldUntil = now() + 10000;
    addLog("Aegis Guard restored health and reduced incoming damage for 10 seconds.");
  }
  if (id === "phoenix") {
    healParty(0.5);
    damageEnemy(Math.floor(damage * 6), skill.name);
  }
  render();
  saveGame();
}

function healParty(ratio) {
  partyMembers().forEach(hero => {
    const cap = Math.floor(hero.hp * (1 + game.upgrades.health * 0.15));
    game.heroHP[hero.id] = Math.min(cap, game.heroHP[hero.id] + Math.ceil(cap * ratio));
  });
}

function damageEnemy(amount, source = "Your party") {
  if (game.enemyHP <= 0) return;
  const criticalChance = game.upgrades.critical * 0.04;
  let damage = amount;
  if (Math.random() < criticalChance) {
    damage *= 2;
    addLog("Critical hit! Double damage!");
  }
  game.enemyHP = Math.max(0, game.enemyHP - damage);
  addLog(`${source} dealt ${formatNumber(damage)} damage.`);
  if (game.enemyHP <= 0) defeatEnemy();
}

function partyAttack() {
  if (game.enemyHP <= 0) return;
  damageEnemy(teamDamage(), "Your party");
  render();
}

function enemyAttack() {
  if (game.enemyHP <= 0) return;
  const region = regions[game.region];
  let damage = region.damage * (game.boss ? 2 : 1);
  if (game.enemyWeakenedUntil > now()) damage = Math.floor(damage * 0.5);
  if (game.shieldUntil > now()) damage = Math.floor(damage * 0.5);

  const members = partyMembers();
  let remainingDamage = damage;
  for (let i = 0; i < members.length && remainingDamage > 0; i++) {
    const hero = members[i];
    const hp = game.heroHP[hero.id] || 0;
    const taken = Math.min(hp, remainingDamage);
    game.heroHP[hero.id] = hp - taken;
    remainingDamage -= taken;
  }

  addLog(`${game.enemyName} attacked your party for ${damage} damage.`);
  if (currentTeamHP() <= 0) {
    addLog("Your party has been overwhelmed. Retreat, recover, and return!");
    healParty(0.25);
    game.enemyHP = game.enemyMaxHP;
  }
  render();
}

function defeatEnemy() {
  const region = regions[game.region];
  const coins = region.coins * (game.boss ? 8 : 1);
  const ore = region.ore * (game.boss ? 5 : 1);
  const gems = game.boss ? random(5, 12) : (Math.random() < 0.15 ? 1 : 0);

  game.coins += coins;
  game.ore += ore;
  game.gems += gems;
  game.enemiesDefeated++;

  if (game.boss) {
    game.bossesDefeated++;
    addLog(`BOSS DEFEATED! Earned ${coins} coins, ${ore} ore, and ${gems} gems.`);
    if (game.region < regions.length - 1) {
      game.region++;
      addLog(`New region unlocked: ${regions[game.region].name}!`);
    } else {
      addLog("The Crystal Kingdom's final guardian has fallen!");
    }
  } else {
    addLog(`${game.enemyName} defeated! +${coins} coins and +${ore} ore.`);
  }

  healParty(0.1);
  spawnEnemy(false);
  render();
  saveGame();
}

function challengeBoss() {
  if (game.boss) return showToast("A boss is already in battle!");
  spawnEnemy(true);
  addLog(`Boss encounter started: ${game.enemyName}!`);
  showToast("Boss battle started!");
}

function retreat() {
  if (game.boss) {
    showToast("You retreated from the boss battle.");
    addLog("You retreated from the boss battle.");
  } else {
    showToast("You left the current encounter.");
    addLog("You retreated to regroup.");
  }
  spawnEnemy(false);
}

function travelToRegion(index) {
  if (index < 0 || index >= regions.length) return;
  if (index > game.region) return showToast("Defeat the current region's boss first.");
  game.region = index;
  addLog(`Travelled to ${regions[index].name}.`);
  spawnEnemy(false);
  render();
  saveGame();
}

function explore() {
  const region = regions[game.region];
  const roll = Math.random();
  if (roll < 0.4) {
    const coins = random(10, 30) * region.level;
    game.coins += coins;
    addLog(`Exploration found a hidden pouch containing ${coins} coins!`);
  } else if (roll < 0.72) {
    const gems = random(1, 3);
    game.gems += gems;
    addLog(`Exploration discovered ${gems} rare gems!`);
  } else if (roll < 0.9) {
    const ore = random(10, 25) * region.level;
    game.ore += ore;
    game.totalMined += ore;
    addLog(`Your party discovered a rich vein worth ${ore} ore.`);
  } else {
    const snack = snackData[random(0, snackData.length - 1)];
    game.snacks[snack.id] = (game.snacks[snack.id] || 0) + 1;
    addLog(`Exploration found a snack: ${snack.name}!`);
  }
  showToast("Your party returned from exploration with supplies!");
  game.nextExplore = now() + randomExploreDelay();
  render();
  saveGame();
}

function tick() {
  const time = now();

  if (time >= game.nextAttack) {
    game.nextAttack = time + attackInterval();
    partyAttack();
  }
  if (time >= game.nextEnemyAttack) {
    game.nextEnemyAttack = time + enemyAttackInterval();
    enemyAttack();
  }
  if (time >= game.nextMinerTick) {
    const elapsedSeconds = Math.max(1, Math.floor((time - game.nextMinerTick) / 1000) + 1);
    const earned = minerRate() * elapsedSeconds / 60;
    if (earned > 0) {
      game.ore += earned;
      game.totalMined += earned;
    }
    game.nextMinerTick = time + 1000;
  }
  if (time >= game.nextExplore) explore();

  render();
  if (time - game.lastTick > 5000) saveGame();
}

function questProgress(id) {
  switch (id) {
    case "mine": return game.totalMined;
    case "enemy": return game.enemiesDefeated;
    case "miner": return game.miners;
    case "recruit": return game.recruited.length;
    case "boss": return game.bossesDefeated;
    default: return 0;
  }
}

const quests = [
  { id: "mine", title: "A Miner’s Beginning", desc: "Mine 50 ore.", goal: 50, reward: 40, type: "ore" },
  { id: "enemy", title: "First Victory", desc: "Defeat 5 enemies.", goal: 5, reward: 50, type: "enemy" },
  { id: "miner", title: "Build the Crew", desc: "Hire 3 miners.", goal: 3, reward: 80, type: "miner" },
  { id: "recruit", title: "A Growing Fellowship", desc: "Recruit 2 companions.", goal: 2, reward: 100, type: "recruit" },
  { id: "boss", title: "Guardian Slayer", desc: "Defeat 1 boss.", goal: 1, reward: 150, type: "boss" }
];

function claimQuest(id) {
  const quest = quests.find(item => item.id === id);
  if (!quest || game.questsClaimed.includes(id)) return;
  if (questProgress(quest.type) < quest.goal) return showToast("Quest objective not completed yet.");
  game.questsClaimed.push(id);
  game.coins += quest.reward;
  addLog(`Quest completed: ${quest.title}. +${quest.reward} coins.`);
  render();
  saveGame();
}

function renderLog() {
  const log = $("log");
  if (!log) return;
  log.innerHTML = "";
  if (!logs.length) {
    log.innerHTML = '<div class="log-entry">Your adventure begins here...</div>';
    return;
  }
  logs.slice(0, 35).forEach(entry => {
    const div = document.createElement("div");
    div.className = "log-entry";
    const time = document.createElement("time");
    time.textContent = entry.time || "";
    const span = document.createElement("span");
    span.textContent = entry.message || "";
    div.append(time, span);
    log.appendChild(div);
  });
}

function renderParty() {
  const container = $("partyList");
  container.innerHTML = "";
  partyMembers().forEach(hero => {
    const hp = Math.max(0, game.heroHP[hero.id] || 0);
    const max = Math.floor(hero.hp * (1 + game.upgrades.health * 0.15));
    const card = document.createElement("div");
    card.className = "party-card";
    const img = document.createElement("img");
    img.src = hero.sprite;
    img.alt = hero.name;
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = hero.name;
    const role = document.createElement("p");
    role.textContent = hero.role;
    const track = document.createElement("div");
    track.className = "health-track";
    track.style.marginTop = "6px";
    track.style.height = "6px";
    const fill = document.createElement("div");
    fill.className = "health-fill party-fill";
    fill.style.width = `${max ? hp / max * 100 : 0}%`;
    track.appendChild(fill);
    copy.append(name, role, track);
    const stat = document.createElement("span");
    stat.className = "mini-stat";
    stat.textContent = `${hp}/${max} HP`;
    card.append(img, copy, stat);
    container.appendChild(card);
  });
}

function renderSkills() {
  const battle = $("battleSkills");
  const library = $("skillLibrary");
  battle.innerHTML = "";
  library.innerHTML = "";

  skillData.forEach(skill => {
    const unlocked = game.unlockedSkills.includes(skill.id);
    const remaining = skillRemaining(skill.id);
    const card = document.createElement("div");
    card.className = "skill-card";
    const icon = document.createElement("div");
    icon.className = "skill-icon";
    icon.textContent = skill.icon;
    const title = document.createElement("strong");
    title.textContent = `${skill.name} [${skill.key}]`;
    const desc = document.createElement("p");
    desc.textContent = skill.desc;
    const cooldown = document.createElement("div");
    cooldown.className = "cooldown";
    cooldown.textContent = unlocked ? (remaining ? `Ready in ${remaining}s` : "Ready to use") : `Unlock · ${skill.cost} coins`;

    const button = document.createElement("button");
    button.className = "button " + (unlocked ? "primary" : "secondary");
    button.textContent = unlocked ? (remaining ? `${remaining}s` : "Use Skill") : "Unlock";
    button.disabled = unlocked ? remaining > 0 : (game.coins < skill.cost || game.region + 1 < skill.unlock);
    button.addEventListener("click", () => unlocked ? useSkill(skill.id) : unlockSkill(skill.id));

    card.append(icon, title, desc, cooldown, button);
    library.appendChild(card);

    if (unlocked && ["slash", "burst", "aegis", "meteor"].includes(skill.id)) {
      const battleCard = document.createElement("div");
      battleCard.className = "skill-card";
      const bIcon = document.createElement("div");
      bIcon.className = "skill-icon";
      bIcon.textContent = skill.icon;
      const bTitle = document.createElement("strong");
      bTitle.textContent = `${skill.name} [${skill.key}]`;
      const bCooldown = document.createElement("div");
      bCooldown.className = "cooldown";
      bCooldown.textContent = remaining ? `Cooldown: ${remaining}s` : "Ready!";
      const bButton = document.createElement("button");
      bButton.className = "button primary";
      bButton.textContent = remaining ? `${remaining}s` : "Cast";
      bButton.disabled = remaining > 0;
      bButton.addEventListener("click", () => useSkill(skill.id));
      battleCard.append(bIcon, bTitle, bCooldown, bButton);
      battle.appendChild(battleCard);
    }
  });
}

function renderSnacks() {
  const container = $("snackList");
  container.innerHTML = "";
  snackData.forEach(snack => {
    const count = game.snacks[snack.id] || 0;
    const row = document.createElement("div");
    row.className = "item-card";
    const icon = document.createElement("div");
    icon.className = "item-icon";
    icon.textContent = snack.icon;
    const copy = document.createElement("div");
    copy.className = "item-copy";
    const name = document.createElement("strong");
    name.textContent = `${snack.name} × ${count}`;
    const desc = document.createElement("p");
    desc.textContent = snack.desc;
    copy.append(name, desc);
    const button = document.createElement("button");
    button.className = "button small " + (count ? "primary" : "secondary");
    button.textContent = "Use";
    button.disabled = count === 0;
    button.addEventListener("click", () => useSnack(snack.id));
    row.append(icon, copy, button);
    container.appendChild(row);
  });
}

function renderUpgrades() {
  const container = $("upgradeList");
  container.innerHTML = "";
  upgradeData.forEach(upgrade => {
    const level = game.upgrades[upgrade.id];
    const maxed = level >= upgrade.max;
    const cost = upgradeCost(upgrade);
    const row = document.createElement("div");
    row.className = "item-card";
    const icon = document.createElement("div");
    icon.className = "item-icon";
    icon.textContent = upgrade.icon;
    const copy = document.createElement("div");
    copy.className = "item-copy";
    const name = document.createElement("strong");
    name.textContent = upgrade.name;
    const desc = document.createElement("p");
    desc.textContent = upgrade.desc;
    const costText = document.createElement("div");
    costText.className = "cost";
    costText.textContent = maxed ? `MAX LEVEL · ${level}/${upgrade.max}` : `Level ${level}/${upgrade.max} · ${cost} coins`;
    copy.append(name, desc, costText);
    const button = document.createElement("button");
    button.className = "button small primary";
    button.textContent = maxed ? "MAX" : "Upgrade";
    button.disabled = maxed || game.coins < cost;
    button.addEventListener("click", () => buyUpgrade(upgrade.id));
    row.append(icon, copy, button);
    container.appendChild(row);
  });
}

function renderRecruits() {
  const container = $("recruitList");
  container.innerHTML = "";
  heroes.forEach(hero => {
    const owned = game.recruited.includes(hero.id);
    const card = document.createElement("div");
    card.className = "recruit-card";
    const img = document.createElement("img");
    img.src = hero.sprite;
    img.alt = hero.name;
    const title = document.createElement("strong");
    title.textContent = hero.name;
    const desc = document.createElement("p");
    desc.textContent = `${hero.role} · ${hero.damage} damage · ${hero.hp} HP. ${hero.desc}`;
    const button = document.createElement("button");
    button.className = "button " + (owned ? "secondary" : "primary");
    button.textContent = owned ? "Recruited ✓" : `Recruit · ${hero.cost} 🪙`;
    button.disabled = owned || game.coins < hero.cost;
    button.addEventListener("click", () => recruit(hero.id));
    card.append(img, title, desc, button);
    container.appendChild(card);
  });
}

function renderRegions() {
  const container = $("regionList");
  container.innerHTML = "";
  regions.forEach((region, index) => {
    const card = document.createElement("div");
    card.className = "region-card" + (index === game.region ? " active" : "");
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = region.name;
    const desc = document.createElement("small");
    desc.textContent = `Region ${region.level} · Enemy HP ${region.hp}`;
    copy.append(name, desc);
    const button = document.createElement("button");
    button.className = "button small secondary";
    button.textContent = index === game.region ? "Here" : index < game.region ? "Travel" : "Locked";
    button.disabled = index === game.region || index > game.region;
    button.addEventListener("click", () => travelToRegion(index));
    card.append(copy, button);
    container.appendChild(card);
  });
}

function renderQuests() {
  const container = $("questList");
  container.innerHTML = "";
  quests.forEach(quest => {
    const claimed = game.questsClaimed.includes(quest.id);
    const progress = Math.min(quest.goal, questProgress(quest.type));
    const complete = progress >= quest.goal;
    const card = document.createElement("div");
    card.className = "quest-card";
    const title = document.createElement("strong");
    title.textContent = `${claimed ? "✅ " : complete ? "🌟 " : "📜 "}${quest.title}`;
    const desc = document.createElement("p");
    desc.textContent = `${quest.desc} Progress: ${progress}/${quest.goal}. Reward: ${quest.reward} coins.`;
    card.append(title, desc);
    if (!claimed) {
      const button = document.createElement("button");
      button.className = "button small " + (complete ? "primary" : "secondary");
      button.textContent = complete ? "Claim Reward" : "In Progress";
      button.disabled = !complete;
      button.style.marginTop = "10px";
      button.addEventListener("click", () => claimQuest(quest.id));
      card.appendChild(button);
    }
    container.appendChild(card);
  });
}

function render() {
  $("coins").textContent = formatNumber(game.coins);
  $("gems").textContent = formatNumber(game.gems);
  $("ore").textContent = formatNumber(game.ore);

  $("regionName").textContent = regions[game.region].name;
  $("regionNumber").textContent = `REGION ${game.region + 1}`;
  $("enemySprite").src = game.enemySprite;
  $("enemyName").textContent = game.enemyName;
  $("enemyTitle").textContent = game.enemyName;
  $("enemyHPText").textContent = `${formatNumber(game.enemyHP)} / ${formatNumber(game.enemyMaxHP)} HP`;
  $("enemyHPBar").style.width = `${Math.max(0, game.enemyHP / game.enemyMaxHP * 100)}%`;
  $("enemyType").textContent = game.boss ? "BOSS ENCOUNTER" : "Common enemy";
  $("enemyStatus").textContent = game.enemyHP <= 0 ? "Defeated" : "In combat";

  $("teamDamage").textContent = formatNumber(teamDamage());
  $("teamHP").textContent = `${formatNumber(currentTeamHP())} / ${formatNumber(currentMaxHP())}`;
  $("attackSpeed").textContent = `${(attackInterval() / 1000).toFixed(1)}s`;

  $("minerCount").textContent = game.miners;
  $("oreRate").textContent = minerRate().toFixed(1);
  $("minerCost").textContent = formatNumber(minerCost());
  $("cartCost").textContent = formatNumber(cartCost());
  $("mineUpgradeCost").textContent = formatNumber(miningUpgradeCost());

  $("hireMinerBtn").disabled = game.coins < minerCost();
  $("hireCartBtn").disabled = game.coins < cartCost();
  $("mineUpgradeBtn").disabled = game.coins < miningUpgradeCost();
  $("buySnackBtn").disabled = game.coins < snackData[0].cost;

  renderParty();
  renderSkills();
  renderSnacks();
  renderUpgrades();
  renderRecruits();
  renderRegions();
  renderQuests();
  renderLog();
}

$("mineBtn").addEventListener("click", mine);
$("bossBtn").addEventListener("click", challengeBoss);
$("retreatBtn").addEventListener("click", retreat);
$("hireMinerBtn").addEventListener("click", hireMiner);
$("hireCartBtn").addEventListener("click", buyCart);
$("mineUpgradeBtn").addEventListener("click", upgradeMining);
$("buySnackBtn").addEventListener("click", () => buySnack("ration"));
$("saveBtn").addEventListener("click", () => saveGame(true));
$("clearLogBtn").addEventListener("click", () => {
  logs = [];
  game.lastLog = [];
  renderLog();
  saveGame();
});
$("resetBtn").addEventListener("click", () => {
  if (!confirm("Reset all progress? This cannot be undone.")) return;
  localStorage.removeItem(SAVE_KEY);
  game = freshGame();
  logs = [];
  spawnEnemy(false);
  addLog("A new adventure begins in the Shattered Cavern.");
  render();
  saveGame();
});

document.addEventListener("keydown", event => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const key = event.key.toLowerCase();
  const skill = skillData.find(item => item.key.toLowerCase() === key);
  if (skill && game.unlockedSkills.includes(skill.id)) useSkill(skill.id);
});

loadGame();
ensureHeroHP();
if (!game.enemyName || !game.enemySprite) spawnEnemy(false);
addLog("Welcome back, adventurer! Your expedition awaits.");
render();

setInterval(tick, 250);
saveTimer = setInterval(() => saveGame(), 10000);

window.addEventListener("beforeunload", () => saveGame());
