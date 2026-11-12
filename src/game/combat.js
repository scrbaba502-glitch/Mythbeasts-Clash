export class CombatSystem {
  constructor(arena) {
    this.arena = arena;
    this.cooldowns = { attack: 0, dodge: 0, skill: 0 };
    this.invulnerableUntil = 0;
    this.dodgeUntil = 0;
    this.skillLabel = document.querySelector("#skill-cooldown");
    this.playerBar = document.querySelector("#player-health");
    this.rivalBar = document.querySelector("#rival-health");
    this.message = document.querySelector("#battle-message");
    this.phase = document.querySelector("#phase-label");
    this.ended = false;
    this.pendingAttack = null;
    this.pendingSkill = null;
    this.bossAttackAt = 2.6;
    this.telegraphAt = 0;
    this.perform = this.perform.bind(this);
  }

  announce(text) { this.message.textContent = text; }

  perform(action) {
    if (this.ended) return;
    const now = this.arena.time;
    if (action === "camera") {
      this.arena.cameraMode = (this.arena.cameraMode + 1) % 3;
      this.announce(["BATTLEFIELD VIEW", "CHAMPION VIEW", "RIVAL VIEW"][this.arena.cameraMode]);
      return;
    }
    if (now < this.cooldowns[action]) return;
    if (action === "attack") {
      this.cooldowns.attack = now + .58;
      this.arena.triggerAttack();
      this.pendingAttack = { activeAt: now + .13, recoverAt: now + .36, resolved: false };
      this.announce("VYRAK COMMITS — FOLLOW THROUGH");
    }
    if (action === "dodge") {
      this.cooldowns.dodge = now + .92;
      this.invulnerableUntil = now + .66;
      this.dodgeUntil = now + .25;
      this.arena.triggerDodge();
      this.announce("PHASE DODGE — REPOSITION");
    }
    if (action === "skill") {
      this.cooldowns.skill = now + 5;
      this.arena.player.animator?.play("skill");
      this.pendingSkill = { resolveAt: now + .32 };
      this.announce("EMBER BURST — RELEASE");
    }
  }

  damageRival(amount) {
    this.arena.rivalHealth = Math.max(0, this.arena.rivalHealth - amount);
    this.rivalBar.style.width = this.arena.rivalHealth + "%";
    this.arena.rival.glowMat.emissiveIntensity = 3.2;
    this.arena.triggerRivalHit();
    this.announce("STRIKE CONFIRMED");
    if (this.arena.rivalHealth === 0) this.finish(true);
    else if (this.arena.rivalHealth <= 50) {
      if (this.phase.textContent !== "ATROX · ABYSS UNBOUND") {
        this.phase.textContent = "ATROX · ABYSS UNBOUND";
        this.bossAttackAt = Math.min(this.bossAttackAt, this.arena.time + .8);
        this.announce("THE ABYSS AWAKENS — SECOND PHASE");
      }
    }
  }

  update(dt, now) {
    if (this.ended) return;
    this.skillLabel.textContent = this.cooldowns.skill > now ? (this.cooldowns.skill - now).toFixed(1) + "s" : "READY";
    if (this.pendingAttack && !this.pendingAttack.resolved && now >= this.pendingAttack.activeAt) {
      this.pendingAttack.resolved = true;
      const distance = this.arena.player.root.position.distanceTo(this.arena.rival.root.position);
      const facing = this.arena.isPlayerFacingRival ? this.arena.isPlayerFacingRival(.35) : true;
      if (distance < 3.7 && facing) this.damageRival(9);
      else this.announce(distance >= 3.7 ? "OUT OF REACH — CLOSE THE DISTANCE" : "WRONG DIRECTION — TURN TOWARD ATROX");
    }
    if (this.pendingAttack && now >= this.pendingAttack.recoverAt) this.pendingAttack = null;
    if (this.pendingSkill && now >= this.pendingSkill.resolveAt) {
      this.pendingSkill = null;
      const distance = this.arena.player.root.position.distanceTo(this.arena.rival.root.position);
      if (distance < 7.2) this.damageRival(22);
      else this.announce("EMBER BURST — TARGET OUT OF RANGE");
    }
    this.arena.rival.glowMat.emissiveIntensity += (1.7 - this.arena.rival.glowMat.emissiveIntensity) * Math.min(1, dt * 8);
    if (now >= this.bossAttackAt) {
      this.bossAttackAt = now + (this.arena.rivalHealth <= 50 ? 1.9 : 2.6);
      this.telegraphAt = now + .62;
      this.arena.triggerRivalAttack();
      this.announce("ATROX WINDS UP — DODGE");
    }
    if (this.telegraphAt && now >= this.telegraphAt) {
      this.telegraphAt = 0;
      this.arena.triggerRivalStrike();
      const distance = this.arena.player.root.position.distanceTo(this.arena.rival.root.position);
      if (distance < 4.4 && now > this.invulnerableUntil) {
        this.arena.playerHealth = Math.max(0, this.arena.playerHealth - (this.arena.rivalHealth <= 50 ? 18 : 12));
        this.arena.triggerPlayerHit();
        this.playerBar.style.width = this.arena.playerHealth + "%";
        this.announce("ATROX CONNECTS — FIND YOUR OPENING");
        if (this.arena.playerHealth === 0) this.finish(false);
      } else if (distance < 4.4) this.announce("PERFECT DODGE");
    }
  }

  finish(won) {
    this.ended = true;
    if (won) {
      this.arena.player.animator?.play("victory");
      this.arena.rival.animator?.play("defeat");
    } else {
      this.arena.player.animator?.play("defeat");
      this.arena.rival.animator?.play("victory");
    }
    this.arena.combatActive = false;
    this.arena.setMoveInput(0, 0);
    this.announce(won ? "THE FIRST SEAL IS BROKEN" : "THE TITAN PREVAILS");
    this.phase.textContent = won ? "VICTORY" : "DEFEAT";
    document.querySelector("#result-title").textContent = won ? "VICTORY" : "DEFEAT";
    document.querySelector("#result-copy").textContent = won ? "The first seal is broken. Atrox has been driven back." : "Atrox has overwhelmed the champion. Regroup and fight again.";
    document.querySelector("#result-overlay").hidden = false;
  }
}