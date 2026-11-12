# Development roadmap

## Milestone 0 — repository foundation
- [x] Independent repository and feature branch
- [x] Product direction and technical constraints
- [x] Vite / Three.js / Capacitor skeleton
- [x] Isometric battlefield and touch-input foundation
- [x] Android debug APK workflow definition
- [ ] CI build verified and APK artifact inspected
- [ ] Android device playtest

## Milestone 1 — first vertical slice
- Replace temporary geometric fighter proxies with original rigged champion assets
- Integrate authored idle, locomotion, turn, attack, dodge, hit-react, stagger, and defeat animations
- [x] Add crossfading skeletal animation-state controller and named clip mapping
- [x] Add attack anticipation / active / recovery timing and directional hit confirmation
- [x] Add adaptive boss approach, spacing, orbit, and engagement-range telegraphs
- [x] Add visible ground danger markers and phase-two Abyss Slam attack pattern with matched windup/impact timing
- [x] Add player action commitment windows, hit stun with movement suppression, and late-asset teardown protection\n- [x] Add a three-stage light-attack combo chain with escalating damage, distinct timing, and animation-clip fallbacks
- [x] Let dodge interrupt an active attack/skill commitment while preserving locks on other action pairs
- [x] Ensure encounter completion clears active boss telegraph indicators
- [x] Preserve authored victory and defeat final poses after terminal animation clips
- [x] Reorder CI so fast static checks run before Android SDK provisioning
- [x] Document Blender/glTF character asset, rig, animation, export, and acceptance pipeline
- Refine thumb controls using device testing and multi-touch edge cases
- Improve battlefield art direction, collision, camera framing, and performance budgets
- Implement complete first encounter with reliable restart and win/loss state

## Milestone 2 — champion identity
- Vyrak, Frostfang, Solarius, Raijin
- Distinct move sets, weapon silhouettes, elemental VFX, signature skills, ultimates
- Champion select and progression foundation

## Milestone 3 — game modes
- Story Mode: Primordial Core and Atrox Nefas
- Classic versus AI
- Online 1v1 only after authoritative networking, matchmaking, abuse prevention, and connection recovery are designed and tested

## Release gates
- No placeholder assets presented as finished characters
- No false claims about online functionality
- Android performance, controls, lifecycle, audio, and memory tested on real devices
- Debug builds are not production-signed releases
