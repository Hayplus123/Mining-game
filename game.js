
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const SAVE_KEY = "gemMinerCrystalKingdom_v2";

  const regions = [
    {
      name: "The Shattered Cavern",
      enemy: "Glimmer Slime",
      type: "CRYSTAL CREATURE",
      hp: 90, damage: 7, gold: 12, crystals: 4,
      sprite: "assets/slime.svg",
      boss: "The Prism Warden",
      bossHp: 520, bossDamage: 16,
      desc: "An ancient sentinel sealed inside the cavern."
    },
    {
      name: "Moonlit Grotto",
      enemy: "Grotto Stalker",
      type: "ABYSSAL BEAST",
      hp: 175, damage: 12, gold: 23, crystals: 8,
      sprite: "assets/stalker.svg",
      boss: "The Moonfang",
      bossHp: 980, bossDamage: 24,
      desc: "A moon-cursed hunter prowls the luminous pools."
    },
    {
      name: "The Ember Reliquary",
      enemy: "Cinder Wisp",
      type: "EMBER SPIRIT",
      hp: 300, damage: 18, gold: 38, crystals: 14,
      sprite: "assets/wisp.svg",
      boss: "The Ashen Sovereign",
      bossHp: 1750, bossDamage: 34,
      desc: "A sovereign of flame guards the buried reliquary."
    },
    {
      name: "Skyglass Sanctum",
      enemy: "Skyglass Sentinel",
      type: "ANCIENT CONSTRUCT",
      hp: 510, damage: 26, gold: 60, crystals: 22,
      sprite: "assets/boss.svg",
      boss: "The Star-Eater",
      bossHp: 3200, bossDamage: 48,
      desc: "A star-born titan stirs beyond the final seal."
    }
  ];

  const defaults = {
    gold: 75,
    crystals: 35,
    ore: 0,
    pickaxe: 1,
    speedLevel: 0,
    healer: false,
    region: 0,
    defeated: 0,
    bossDefeated: [],
    partyHp: 100,
    enemy: null,
    bossMode: false,
    cooldowns: { slash: 0, burst: 0, guard: 0 },
    partyDamage: 18
  };

  function loadGame() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return {
        ...defaults,
        ...saved,
        cooldowns: { ...defaults.cooldowns, ...(saved.cooldowns || {}) },
        bossDefeated: saved.bossDefeated || []
      };
    } catch {
      return { ...defaults, cooldowns: { ...defaults.cooldowns }, bossDefeated: [] };
    }
  }

  let game = loadGame();
  let logs = [];
  let partyClock = 0;
  let enemyClock = 0;
  let lastTick = performance.now();
  let saveClock = 0;
  let exploreTimer = null;
  let toastTimer = null;

  const currentRegion = () =>
    regions[Math.min(game.region, regions.length - 1)];

  const partyInterval = () =>
    Math.max(3.5, 6 - game.speedLevel * 0.5);

  const enemyInterval = () =>
    Math.max(2.1, 5 - game.region * 0.65 - (game.bossMode ? 0.5 : 0));

  const pickaxeCost = () =>
    Math.floor(25 * Math.pow(1.8, game.pickaxe - 1));

  const speedCost = () =>
    Math.floor(40 * Math.pow(1.9, game.speedLevel));

  const format = n => Math.floor(n).toLocaleString();

  function saveGame() {
    try {
      game.lastLog = logs.slice(0, 12);
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    } catch (error) {
      console.warn("Could not save the game.", error);
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function addLog(message) {
    logs.unshift({
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      message
    });
    logs = logs.slice(0, 12);
    renderLog();
  }

  function renderLog() {
    $("logList").innerHTML = logs.map(entry =>
      `<p><time>${entry.time || "NOW"}</time> ${escapeHTML(entry.message || "")}</p>`
    ).join("");
  }

  function showToast(message) {
    const element = $("toast");
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("show"), 2200);
  }

  function floatingText(text, side = "enemy", healing = false) {
    const element = document.createElement("span");
    element.className = "damage";
    element.textContent = text;
    element.style.left = (side === "enemy" ? 67 : 22) + Math.random() * 9 + "%";
    element.style.top = (side === "enemy" ? 35 : 48) + Math.random() * 14 + "%";

    if (healing) element.style.color = "#a4edc0";

    $("scene").appendChild(element);
    setTimeout(() => element.remove(), 950);
  }

  // The exploration delay is intentionally hidden from the interface.
  function scheduleExploration() {
    clearTimeout(exploreTimer);

    if (game.enemy) return;

    exploreTimer = setTimeout(() => {
      if (!game.enemy) {
        explore();
      } else {
        scheduleExploration();
      }
    }, 10000 + Math.random() * 10000);
  }

  function spawnEnemy(boss = false) {
    if (game.enemy) return;

    const region = currentRegion();
    const multiplier = Math.pow(1.8, game.region);
    game.bossMode = boss;

    if (boss) {
      const hp = Math.floor(region.bossHp * multiplier);

      game.enemy = {
        name: region.boss,
        type: "REGION GUARDIAN",
        hp,
        maxHp: hp,
        damage: Math.floor(region.bossDamage * multiplier),
        gold: Math.floor(100 * multiplier),
        crystals: Math.floor(40 * multiplier),
        sprite: "assets/boss.svg",
        boss: true
      };

      addLog(`${region.boss} emerges from the ancient seal.`);
    } else {
      const hp = Math.floor(
        region.hp * multiplier * (0.85 + Math.random() * 0.35)
      );

      game.enemy = {
        name: region.enemy,
        type: region.type,
        hp,
        maxHp: hp,
        damage: Math.floor(region.damage * multiplier),
        gold: Math.floor(region.gold * multiplier),
        crystals: Math.floor(region.crystals * multiplier),
        sprite: region.sprite,
        boss: false
      };

      addLog(`${region.enemy} appears in the cavern!`);
    }

    partyClock = 0;
    enemyClock = 0;
    render();
    saveGame();
  }

  function explore() {
    if (game.enemy) return;

    clearTimeout(exploreTimer);

    if (Math.random() < 0.68) {
      spawnEnemy(false);
      showToast("Your party discovered an enemy!");
      return;
    }

    const crystals = 3 + Math.floor(Math.random() * 7 + game.region * 2);
    const ore = 1 + Math.floor(Math.random() * 3);

    game.crystals += crystals;
    game.ore += ore;
    game.gold += Math.floor(crystals * 0.7);

    addLog(`Exploration found ${crystals} crystals and ${ore} ore.`);
    showToast(`Found ${crystals} crystals and ${ore} ore.`);
    render();
    saveGame();
    scheduleExploration();
  }

  function animatePartyAttack() {
    const party = $("party");
    party.classList.remove("attacking");
    void party.offsetWidth;
    party.classList.add("attacking");
  }

  function animateEnemyHit() {
    const enemy = $("enemyVisual");
    enemy.classList.remove("hit");
    void enemy.offsetWidth;
    enemy.classList.add("hit");
  }

  function defeatEnemy() {
    const enemy = game.enemy;
    if (!enemy) return;

    game.gold += enemy.gold;
    game.crystals += enemy.crystals;
    game.ore += enemy.boss ? 8 : 1 + Math.floor(Math.random() * 3);
    game.defeated++;

    if (enemy.boss) {
      if (!game.bossDefeated.includes(game.region)) {
        game.bossDefeated.push(game.region);
      }

      addLog(`Guardian defeated! +${enemy.gold} gold, +${enemy.crystals} crystals.`);
      showToast("Guardian defeated! A new path opens.");

      if (game.region < regions.length - 1) {
        game.region++;
        addLog(`Unlocked region: ${currentRegion().name}.`);
      }
    } else {
      addLog(`${enemy.name} defeated. +${enemy.gold} gold, +${enemy.crystals} crystals.`);
      showToast(`Victory! +${enemy.gold} gold · +${enemy.crystals} crystals`);
    }

    game.enemy = null;
    game.bossMode = false;
    game.partyHp = Math.min(100, game.partyHp + 15);
    partyClock = 0;
    enemyClock = 0;

    render();
    saveGame();
    scheduleExploration();
  }

  function partyAttack() {
    if (!game.enemy) return;

    const damage = Math.floor(
      (game.partyDamage + game.pickaxe * 2 + (game.healer ? 4 : 0)) *
      (0.85 + Math.random() * 0.4)
    );

    game.enemy.hp -= damage;
    animatePartyAttack();
    floatingText("-" + damage);

    if (game.enemy.hp <= 0) {
      defeatEnemy();
    }

    render();
  }

  function enemyAttack() {
    if (!game.enemy) return;

    const damage = Math.max(
      1,
      Math.floor(game.enemy.damage * (0.8 + Math.random() * 0.4))
    );

    game.partyHp -= damage;
    floatingText("-" + damage, "party");
    addLog(`${game.enemy.name} strikes for ${damage} damage.`);
    animateEnemyHit();

    if (game.partyHp <= 0) {
      game.partyHp = 100;
      game.gold = Math.max(0, game.gold - Math.floor(game.gold * 0.08));
      game.enemy = null;
      game.bossMode = false;
      partyClock = 0;
      enemyClock = 0;

      addLog("The party retreats to recover. Some gold was lost.");
      showToast("Your party retreated to recover.");
      scheduleExploration();
    }

    render();
    saveGame();
  }

  function mineCrystals() {
    const amount = game.pickaxe * 2 +
      Math.floor(Math.random() * game.pickaxe + 1);

    game.crystals += amount;
    game.ore += 1 + Math.floor(game.pickaxe / 3);
    game.gold += Math.floor(amount / 2);

    addLog(`Mining yielded ${amount} crystals.`);
    floatingText("+" + amount, "party", true);
    showToast(`Mined ${amount} crystals.`);
    render();
    saveGame();
  }

  function useSkill(skill) {
    if (game.cooldowns[skill] > 0) {
      showToast(`Skill recharging: ${Math.ceil(game.cooldowns[skill])}s`);
      return;
    }

    if (skill !== "guard" && !game.enemy) {
      showToast("No enemy to target yet.");
      return;
    }

    if (skill === "slash") {
      const damage = 40 + game.pickaxe * 5 + game.region * 12;
      game.enemy.hp -= damage;
      game.cooldowns.slash = 8;
      floatingText("SLASH -" + damage);
      animateEnemyHit();
      addLog(`Radiant Slash deals ${damage} damage.`);

      if (game.enemy.hp <= 0) defeatEnemy();
    }

    if (skill === "burst") {
      const damage = 65 + game.region * 18;
      game.enemy.hp -= damage;
      game.cooldowns.burst = 14;
      floatingText("ARCANE -" + damage);
      animateEnemyHit();
      addLog(`Arcane Burst detonates for ${damage} damage.`);

      if (game.enemy.hp <= 0) defeatEnemy();
    }

    if (skill === "guard") {
      const healing = game.healer ? 38 : 25;
      game.partyHp = Math.min(100, game.partyHp + healing);
      game.cooldowns.guard = 18;
      floatingText("+" + healing, "party", true);
      addLog(`Aegis Guard restores ${healing} party vitality.`);
    }

    render();
    saveGame();
  }

  function retreat() {
    if (!game.enemy) return;

    addLog(`The party retreated from ${game.enemy.name}.`);
    game.enemy = null;
    game.bossMode = false;
    partyClock = 0;
    enemyClock = 0;

    render();
    saveGame();
    scheduleExploration();
    showToast("Retreated. Exploration will resume soon.");
  }

  function render() {
    const region = currentRegion();

    $("gold").textContent = format(game.gold);
    $("crystals").textContent = format(game.crystals);
    $("ore").textContent = format(game.ore);

    $("regionName").textContent = region.name;
    $("regionNumber").textContent =
      "REGION " + String(game.region + 1).padStart(2, "0");

    $("partyPower").textContent =
      `PARTY POWER · ${game.partyDamage + game.pickaxe * 2 + (game.healer ? 4 : 0)}`;

    $("partyAttackLabel").textContent =
      `Attack interval: ${partyInterval().toFixed(1)}s`;

    $("pickaxeLevel").textContent = `Level ${game.pickaxe} / 10`;
    $("pickaxeCost").textContent =
      game.pickaxe >= 10 ? "MAX" : format(pickaxeCost()) + " C";
    $("pickaxeUpgrade").disabled =
      game.pickaxe >= 10 || game.crystals < pickaxeCost();

    $("speedLevel").textContent =
      `Level ${game.speedLevel} / 5 · ${partyInterval().toFixed(1)}s`;
    $("speedCost").textContent =
      game.speedLevel >= 5 ? "MAX" : format(speedCost()) + " C";
    $("speedUpgrade").disabled =
      game.speedLevel >= 5 || game.crystals < speedCost();

    $("healerStatus").textContent =
      game.healer ? "Recruited · team support" : "Not recruited";
    $("healerUpgrade").disabled = game.healer || game.crystals < 80;
    $("healerUpgrade").innerHTML =
      game.healer ? "Recruited" : 'Recruit <small>80 C</small>';

    $("defeated").textContent = format(game.defeated);
    $("threat").textContent = ["Low", "Moderate", "High", "Extreme"][game.region];
    $("guardianName").textContent = region.boss;
    $("guardianDesc").textContent = region.desc;
    $("bossPhase").textContent =
      game.bossDefeated.includes(game.region) ? "DEFEATED" :
      game.bossMode ? "ENGAGED" : "DORMANT";

    $("bossBtn").textContent =
      game.bossDefeated.includes(game.region) ? "Guardian defeated" :
      game.bossMode ? "Guardian engaged" : "Challenge guardian";
    $("bossBtn").disabled =
      game.bossDefeated.includes(game.region) || !!game.enemy;

    $("hpText").textContent = `HP ${Math.floor(game.partyHp)} / 100`;
    $("hpBar").style.width = Math.max(0, game.partyHp) + "%";
    $("enemyVisual").classList.toggle("hidden", !game.enemy);
    $("retreatBtn").disabled = !game.enemy;
    $("exploreBtn").disabled = !!game.enemy;

    if (game.enemy) {
      $("battleTitle").textContent = game.enemy.name;
      $("enemyName").textContent = game.enemy.name;
      $("enemyType").textContent =
        game.bossMode ? "REGION GUARDIAN · BOSS" : game.enemy.type;
      $("enemyHealthText").textContent =
        `${format(game.enemy.hp)} / ${format(game.enemy.maxHp)}`;
      $("enemyHealthBar").style.width =
        Math.max(0, game.enemy.hp / game.enemy.maxHp * 100) + "%";
      $("enemySprite").src = game.enemy.sprite;
      $("status").textContent = "● IN COMBAT";
      $("caption").textContent =
        game.bossMode ? "A guardian's ancient power surges…" : "An enemy blocks your path!";
      $("hint").textContent =
        `Enemy attacks every ${enemyInterval().toFixed(1)} seconds. Your party fights automatically.`;
    } else {
      $("battleTitle").textContent = "The Crystal Road";
      $("enemyName").textContent = "No enemy nearby";
      $("enemyType").textContent = "Awaiting discovery";
      $("enemyHealthText").textContent = "—";
      $("enemyHealthBar").style.width = "0";
      $("status").textContent = "● EXPLORING";
      $("caption").textContent = "Your party is searching the tunnels…";
      $("hint").textContent =
        "Exploration happens automatically after a hidden 10–20 second interval.";
    }

    for (const [key, seconds] of Object.entries(game.cooldowns)) {
      const element = $("cd-" + key);
      element.textContent = seconds > 0 ? Math.ceil(seconds) + "s" : "READY";
      element.classList.toggle("cooling", seconds > 0);
    }

    renderLog();
  }

  $("exploreBtn").onclick = explore;
  $("mineBtn").onclick = mineCrystals;
  $("retreatBtn").onclick = retreat;

  $("bossBtn").onclick = () => {
    if (game.enemy) {
      showToast("Defeat or retreat from the current enemy first.");
      return;
    }
    if (!game.bossDefeated.includes(game.region)) {
      spawnEnemy(true);
    }
  };

  $("pickaxeUpgrade").onclick = () => {
    const cost = pickaxeCost();
    if (game.pickaxe >= 10 || game.crystals < cost) return;

    game.crystals -= cost;
    game.pickaxe++;
    addLog(`Pickaxe upgraded to level ${game.pickaxe}.`);
    showToast("Pickaxe upgraded!");
    render();
    saveGame();
  };

  $("speedUpgrade").onclick = () => {
    const cost = speedCost();
    if (game.speedLevel >= 5 || game.crystals < cost) return;

    game.crystals -= cost;
    game.speedLevel++;
    partyClock = 0;
    addLog(`Party tempo improved: ${partyInterval().toFixed(1)} seconds between attacks.`);
    render();
    saveGame();
  };

  $("healerUpgrade").onclick = () => {
    if (game.healer || game.crystals < 80) return;

    game.crystals -= 80;
    game.healer = true;
    game.partyHp = Math.min(100, game.partyHp + 25);
    addLog("Seren the healer joined your party.");
    showToast("A healer joined your party!");
    render();
    saveGame();
  };

  document.querySelectorAll("[data-skill]").forEach(button => {
    button.onclick = () => useSkill(button.dataset.skill);
  });

  $("clearLog").onclick = () => {
    logs = [];
    renderLog();
    saveGame();
  };

  $("resetBtn").onclick = () => {
    if (confirm("Reset all Gem Miner progress on this device? This cannot be undone.")) {
      localStorage.removeItem(SAVE_KEY);
      location.reload();
    }
  };

  document.addEventListener("keydown", event => {
    if (event.repeat || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    const shortcuts = {
      q: () => useSkill("slash"),
      w: () => useSkill("burst"),
      e: () => useSkill("guard")
    };
    shortcuts[event.key.toLowerCase()]?.();
  });

  // One game loop handles both combat clocks and skill cooldowns.
  setInterval(() => {
    const now = performance.now();
    const dt = Math.min(0.5, (now - lastTick) / 1000);
    lastTick = now;

    for (const key in game.cooldowns) {
      game.cooldowns[key] = Math.max(0, game.cooldowns[key] - dt);
    }

    if (game.enemy) {
      partyClock += dt;
      enemyClock += dt;

      if (partyClock >= partyInterval()) {
        partyClock = 0;
        partyAttack();
      }

      if (game.enemy && enemyClock >= enemyInterval()) {
        enemyClock = 0;
        enemyAttack();
      }
    }

    saveClock += dt;
    if (saveClock >= 5) {
      saveClock = 0;
      saveGame();
    }

    for (const key in game.cooldowns) {
      const element = $("cd-" + key);
      element.textContent =
        game.cooldowns[key] > 0 ? Math.ceil(game.cooldowns[key]) + "s" : "READY";
      element.classList.toggle("cooling", game.cooldowns[key] > 0);
    }
  }, 200);

  if (game.enemy && !game.enemy.maxHp) {
    game.enemy.maxHp = game.enemy.hp;
  }

  addLog("The crystal road awaits. Your party is ready.");
  render();
  saveGame();

  if (!game.enemy) scheduleExploration();
})();
