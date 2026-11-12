import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const RIVAL_HIT_TINT = new THREE.Color(0x6a1530);
const PLAYER_HIT_TINT = new THREE.Color(0x28516a);

function makeFighter({ color, glow, scale = 1, x = 0, z = 0, boss = false }) {
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  root.scale.setScalar(scale);
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: .48, metalness: .28 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xc7a76a, metalness: .78, roughness: .28 });
  const glowMat = new THREE.MeshStandardMaterial({ color: glow, emissive: glow, emissiveIntensity: 1.8, roughness: .24 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x171c2b, roughness: .72 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.43, .9, 5, 10), bodyMat);
  body.position.y = 1.45;
  body.castShadow = true;
  root.add(body);
  const chest = new THREE.Mesh(new THREE.OctahedronGeometry(.53, 0), trimMat);
  chest.scale.set(1, .72, .38);
  chest.position.set(0, 1.55, .35);
  chest.castShadow = true;
  root.add(chest);
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(.16), glowMat);
  core.position.set(0, 1.58, .57);
  root.add(core);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.34, 16, 12), bodyMat);
  head.scale.set(.9, 1.18, .9);
  head.position.y = 2.35;
  head.castShadow = true;
  root.add(head);
  const helm = new THREE.Mesh(new THREE.ConeGeometry(.28, .55, 5), trimMat);
  helm.position.set(0, 2.72, -.02);
  helm.rotation.z = Math.PI;
  root.add(helm);
  const limbs = { arms: [], legs: [] };
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * .52, 1.92, 0);
    root.add(shoulder);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.14, .58, 4, 8), bodyMat);
    arm.position.y = -.35;
    arm.rotation.z = side * -.2;
    arm.castShadow = true;
    shoulder.add(arm);
    const bracer = new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .32, 8), trimMat);
    bracer.position.y = -.67;
    shoulder.add(bracer);
    limbs.arms.push(shoulder);

    const hip = new THREE.Group();
    hip.position.set(side * .23, .82, 0);
    root.add(hip);
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.17, .48, 4, 8), darkMat);
    leg.position.y = -.28;
    leg.castShadow = true;
    hip.add(leg);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(.32, .18, .48), trimMat);
    boot.position.set(0, -.58, .12);
    hip.add(boot);
    limbs.legs.push(hip);
  }
  const weapon = new THREE.Group();
  weapon.position.set(.72, 1.45, .08);
  const haft = new THREE.Mesh(new THREE.CylinderGeometry(.045, .065, 1.5, 8), trimMat);
  weapon.add(haft);
  const blade = new THREE.Mesh(new THREE.ConeGeometry(.22, .72, 5), glowMat);
  blade.position.y = .98;
  blade.rotation.z = Math.PI;
  weapon.add(blade);
  root.add(weapon);
  if (boss) {
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(.13, .72, 6), trimMat);
      horn.position.set(side * .25, 2.55, -.03);
      horn.rotation.z = -side * .38;
      root.add(horn);
    }
  }
  return { root, limbs, weapon, body, bodyMat, glowMat, scale, animator: null, assetLoaded: false };
}

export class Arena {
  constructor(host) {
    this.host = host;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#090e1c");
    this.scene.fog = new THREE.Fog("#090e1c", 24, 54);
    this.camera = new THREE.OrthographicCamera(-12, 12, 12, -12, .1, 100);
    this.camera.position.set(13, 17, 14);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.HemisphereLight(0x9bb7e8, 0x1a1222, 1.55));
    const key = new THREE.DirectionalLight(0xffd8a0, 3.1);
    key.position.set(-7, 13, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -18; key.shadow.camera.right = 18;
    key.shadow.camera.top = 18; key.shadow.camera.bottom = -18;
    this.scene.add(key);
    const rim = new THREE.PointLight(0x6d62ff, 36, 28);
    rim.position.set(7, 7, -8);
    this.scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(28, 23),
      new THREE.MeshStandardMaterial({ color: 0x202941, roughness: .88, metalness: .08 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -.06;
    this.scene.add(floor);
    const grid = new THREE.GridHelper(28, 28, 0x47577c, 0x303c59);
    grid.position.y = -.045;
    this.scene.add(grid);
    this.addRuins();
    this.bossTelegraph = new THREE.Mesh(
      new THREE.CircleGeometry(1, 48),
      new THREE.MeshBasicMaterial({ color: 0xff355e, transparent: true, opacity: .18, depthWrite: false, side: THREE.DoubleSide })
    );
    this.bossTelegraph.rotation.x = -Math.PI / 2;
    this.bossTelegraph.position.y = .018;
    this.bossTelegraph.visible = false;
    this.scene.add(this.bossTelegraph);
    this.bossTelegraphEdge = new THREE.Mesh(
      new THREE.RingGeometry(.965, 1, 48),
      new THREE.MeshBasicMaterial({ color: 0xff6b84, transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false })
    );
    this.bossTelegraphEdge.rotation.x = -Math.PI / 2;
    this.bossTelegraphEdge.position.y = .025;
    this.bossTelegraphEdge.visible = false;
    this.scene.add(this.bossTelegraphEdge);

    this.player = makeFighter({ color: 0x496f9d, glow: 0x69d7ff, x: -3.2, z: 1.3 });
    this.rival = makeFighter({ color: 0x48243e, glow: 0xff4b76, x: 3.1, z: -1.2, scale: 1.18, boss: true });
    this.rival.root.rotation.y = Math.PI;
    this.scene.add(this.player.root, this.rival.root);
    this.playerHealth = 100;
    this.rivalHealth = 100;
    this.rivalPhase = 1;
    this.move = { x: 0, y: 0 };
    this.playerVelocity = new THREE.Vector3();
    this.dodgeVector = new THREE.Vector3();
    this.dodgeUntil = 0;
    this.attackUntil = 0;
    this.rivalAttackUntil = 0;
    this.rivalHitUntil = 0;
    this.playerHitUntil = 0;
    this.frames = [];
    this.time = 0;
    this.cameraMode = 0;
    this.lastFrame = 0;
    this.resize = () => this.onResize();
    window.addEventListener("resize", this.resize);
    this.onResize();
  }

  addRuins() {
    const stone = new THREE.MeshStandardMaterial({ color: 0x171f35, roughness: .82, metalness: .22 });
    const gold = new THREE.MeshStandardMaterial({ color: 0x8c7046, metalness: .7, roughness: .4 });
    // Broken temple fragments frame a rectangular battlefield; no arena ring.
    const fragments = [
      [-11, 1.1, -8, .8, 2.2, .8], [10.8, 1.4, -8.5, .9, 2.8, .9],
      [-10.5, .8, 8.3, .9, 1.6, .9], [11, 1.8, 8, .8, 3.6, .8],
      [-7.5, .5, -9.7, 2.4, 1, .7], [7.8, .65, 9.6, 2.8, 1.3, .8],
      [0, .45, -10.2, 3.8, .9, .7], [-1.5, .55, 10.1, 3.1, 1.1, .8]
    ];
    for (const [x,y,z,w,h,d] of fragments) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), stone);
      block.position.set(x,y,z); block.rotation.y = (x + z) * .035;
      block.castShadow = true; block.receiveShadow = true;
      this.scene.add(block);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w * .78, .12, d * 1.2), gold);
      cap.position.set(x,y + h/2 + .06,z);
      this.scene.add(cap);
    }
    const sigil = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 6),
      new THREE.MeshBasicMaterial({ color: 0x566ca0, transparent: true, opacity: .12, side: THREE.DoubleSide })
    );
    sigil.rotation.x = -Math.PI / 2;
    sigil.position.y = .006;
    this.scene.add(sigil);
  }

  onResize() {
    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    const aspect = width / height;
    const halfHeight = aspect < .8 ? 13.5 : 10.5;
    this.camera.left = -halfHeight * aspect;
    this.camera.right = halfHeight * aspect;
    this.camera.top = halfHeight;
    this.camera.bottom = -halfHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  setMoveInput(x, y) { this.move.x = x; this.move.y = y; }
  isPlayerFacingRival(minDot = .35) {
    const toward = this.rival.root.position.clone().sub(this.player.root.position).setY(0);
    if (toward.lengthSq() < .0001) return true;
    toward.normalize();
    const forward = new THREE.Vector3(
      Math.sin(this.player.root.rotation.y), 0, Math.cos(this.player.root.rotation.y)
    );
    return forward.dot(toward) >= minDot;
  }
  triggerDodge() {
    this.player.animator?.play("dodge");
    const sx = this.move.x, sy = this.move.y;
    const dx = sx * .72 + sy * .69, dz = sx * -.69 + sy * .72;
    if (Math.hypot(dx, dz) > .12) this.dodgeVector.set(dx, 0, dz).normalize();
    else this.dodgeVector.copy(this.player.root.position).sub(this.rival.root.position).setY(0).normalize();
    this.dodgeUntil = this.time + .24;
  }
  triggerAttack() { this.attackUntil = this.time + .36; this.player.animator?.play("attack"); }
  triggerRivalAttack() { this.rivalAttackUntil = this.time + .56; this.rival.animator?.play("bossWindup") || this.rival.animator?.play("attack"); }
  triggerRivalStrike() { this.rival.animator?.play("attack"); }
  setBossTelegraph(active, radius = 4.4) {
    this.bossTelegraph.visible = Boolean(active);
    this.bossTelegraphEdge.visible = Boolean(active);
    this.bossTelegraph.scale.setScalar(radius);
    this.bossTelegraphEdge.scale.setScalar(radius);
  }
  triggerRivalHit() { this.rivalHitUntil = this.time + .22; this.rival.animator?.play("hit"); }
  triggerPlayerHit() { this.playerHitUntil = this.time + .2; this.player.animator?.play("hit"); }
  onFrame(callback) { this.frames.push(callback); }

  update(dt) {
    this.time += dt;
    const inputLength = Math.hypot(this.move.x, this.move.y);
    const divisor = Math.max(1, inputLength);
    const sx = this.move.x / divisor;
    const sy = this.move.y / divisor;
    // Convert screen-space thumb direction into the isometric ground plane.
    const dx = sx * .72 + sy * .69;
    const dz = sx * -.69 + sy * .72;
    const p = this.player.root.position;
    const targetVelocity = this.combatActive !== false
      ? new THREE.Vector3(dx * 4.2, 0, dz * 4.2)
      : new THREE.Vector3();
    const response = 1 - Math.exp(-dt * (inputLength > .12 ? 12 : 17));
    this.playerVelocity.lerp(targetVelocity, response);
    p.x = clamp(p.x + this.playerVelocity.x * dt, -10.4, 10.4);
    p.z = clamp(p.z + this.playerVelocity.z * dt, -8.3, 8.3);
    if (this.time < this.dodgeUntil) {
      p.x = clamp(p.x + this.dodgeVector.x * dt * 8.2, -10.4, 10.4);
      p.z = clamp(p.z + this.dodgeVector.z * dt * 8.2, -8.3, 8.3);
    }
    const attacking = this.time < this.attackUntil;
    const attackProgress = attacking ? 1 - (this.attackUntil - this.time) / .36 : 0;
    const swing = attacking ? -Math.sin(attackProgress * Math.PI) * 1.25 : 0;
    this.player.weapon.rotation.z += (swing - this.player.weapon.rotation.z) * Math.min(1, dt * 20);
    const speed = Math.hypot(this.playerVelocity.x, this.playerVelocity.z);
    const moving = speed > .2;
    const dist = p.distanceTo(this.rival.root.position);
    if (this.bossTelegraph.visible) {
      this.bossTelegraph.position.x = this.rival.root.position.x;
      this.bossTelegraph.position.z = this.rival.root.position.z;
      this.bossTelegraphEdge.position.x = this.rival.root.position.x;
      this.bossTelegraphEdge.position.z = this.rival.root.position.z;
    }
    this.player.animator?.setLocomotion(moving);
    this.player.animator?.update(dt);
    if (moving) this.player.root.rotation.y = Math.atan2(this.playerVelocity.x, this.playerVelocity.z);
    else if (this.combatActive !== false && this.time >= this.attackUntil) {
      const toward = this.rival.root.position.clone().sub(p).setY(0);
      if (toward.lengthSq() > .01) this.player.root.rotation.y = Math.atan2(toward.x, toward.z);
    }
    let rivalMoving = false;
    if (this.time >= this.rivalAttackUntil) {
      const toward = p.clone().sub(this.rival.root.position).setY(0);
      const distance = toward.length();
      if (distance > .001) {
        toward.normalize();
        const facingYaw = Math.atan2(toward.x, toward.z);
        this.rival.root.rotation.y = facingYaw;
        if (distance > 4.1) {
          this.rival.root.position.addScaledVector(toward, dt * (distance > 6.5 ? 1.45 : .92) * (this.rivalPhase === 2 ? 1.32 : 1));
          rivalMoving = true;
        } else if (distance < 2.9) {
          this.rival.root.position.addScaledVector(toward, -dt * .58 * (this.rivalPhase === 2 ? 1.2 : 1));
          rivalMoving = true;
        } else if (distance > 3.25 && Math.sin(this.time * .72) > -.45) {
          const orbit = new THREE.Vector3(-toward.z, 0, toward.x);
          this.rival.root.position.addScaledVector(orbit, dt * .34 * (this.rivalPhase === 2 ? 1.3 : 1) * (Math.sin(this.time * .5) >= 0 ? 1 : -1));
          rivalMoving = true;
        }
      }
    }
    this.rival.animator?.setLocomotion(rivalMoving);
    this.rival.animator?.update(dt);
    const rivalWindup = this.time < this.rivalAttackUntil;
    const rivalAttackProgress = rivalWindup ? 1 - (this.rivalAttackUntil - this.time) / .56 : 0;
    this.rival.limbs.arms[0].rotation.x += ((rivalWindup ? -.95 * Math.sin(rivalAttackProgress * Math.PI) : 0) - this.rival.limbs.arms[0].rotation.x) * Math.min(1, dt * 18);
    this.rival.root.rotation.z += ((this.time < this.rivalHitUntil ? .12 : 0) - this.rival.root.rotation.z) * Math.min(1, dt * 18);
    this.player.root.rotation.z += ((this.time < this.playerHitUntil ? -.1 : 0) - this.player.root.rotation.z) * Math.min(1, dt * 18);
    const applyHitFlash = (fighter, active, tint, intensity, fallbackHex) => {
      if (fighter.assetMaterials?.length) {
        for (const entry of fighter.assetMaterials) {
          entry.material.emissive.copy(active ? tint : entry.baseEmissive);
          entry.material.emissiveIntensity = active ? intensity : entry.baseIntensity;
        }
      } else {
        fighter.bodyMat.emissive.setHex(active ? fallbackHex : 0x000000);
        fighter.bodyMat.emissiveIntensity = active ? intensity : 0;
      }
    };
    applyHitFlash(this.rival, this.time < this.rivalHitUntil, RIVAL_HIT_TINT, 1.2, 0x6a1530);
    applyHitFlash(this.player, this.time < this.playerHitUntil, PLAYER_HIT_TINT, .8, 0x28516a);
    this.player.root.position.y = Math.sin(this.time * (moving ? 11 : 2.3)) * (moving ? .035 : .018);
    this.rival.root.position.y = Math.sin(this.time * 1.8 + .8) * .035;
    this.player.limbs.legs.forEach((leg, i) => {
      leg.rotation.x = Math.sin(this.time * (8 + speed * 1.5) + i * Math.PI) * Math.min(.48, speed * .105);
    });
    this.player.limbs.arms.forEach((arm, i) => {
      arm.rotation.x = Math.sin(this.time * (8 + speed * 1.5) + i * Math.PI) * Math.min(.2, speed * .045);
    });
    const focus = this.cameraMode === 1 ? p.clone() :
      this.cameraMode === 2 ? this.rival.root.position.clone() :
      p.clone().lerp(this.rival.root.position, .5);
    const desired = focus.clone().add(new THREE.Vector3(13, 17, 14));
    this.camera.position.lerp(desired, .045);
    this.camera.lookAt(focus.clone().add(new THREE.Vector3(0, .8, 0)));
    for (const callback of this.frames) callback(dt, this.time);
  }

  start() {
    this.running = true;
    const tick = (now) => {
      if (!this.running) return;
      const dt = Math.min((now - (this.lastFrame || now)) / 1000, .04);
      this.lastFrame = now;
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  destroy() {
    this.running = false;
    this.player.disposed = true;
    this.rival.disposed = true;
    this.setBossTelegraph(false);
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    this.renderer.dispose();
    this.scene.traverse(node => {
      if (!node.isMesh) return;
      node.geometry?.dispose();
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) material?.dispose();
    });
    this.host.replaceChildren();
  }
}