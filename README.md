# MYTHBEASTS CLASH
### A² Presents · Android-first 3D mythological action fighter

MYTHBEASTS CLASH is an original mobile-first 3D combat game built around distinct mythic champions, readable tactical combat, responsive touch controls, and a cinematic isometric battlefield.

## Product direction

- **Camera:** elevated isometric 3D. The battlefield, spacing, positioning, and approach angles remain readable.
- **Combat:** responsive movement, directional attacks, combos, dodge windows, telegraphed enemy attacks, hit reactions, champion skills, and ultimates.
- **Controls:** left-thumb movement surface and a right-thumb combat cluster, designed for simultaneous multi-touch. No circular control ring around the arena.
- **Champions:** Vyrak, Frostfang, Solarius, and Raijin, each with distinct silhouette, movement language, weapon identity, elemental effects, and signature abilities.
- **Modes:** Story Mode and Classic Mode (1v1 online and versus AI; online functionality is a later milestone and must not be represented as working until implemented and tested).
- **Story:** the Primordial Core conflict and Atrox Nefas as the ultimate threat.
- **Platform:** Android-first, with browser development/testing support.

## Quality bar

Do not ship placeholder mannequin fighters as final character art. Character assets should use intentional silhouettes, proper topology, rigged skeletal animation, authored animation states, and impact-aware transitions. If production-ready models are not yet available, use clearly labelled temporary greybox assets rather than presenting primitives as finished characters.

The first playable milestone should prove the camera, battlefield scale, touch ergonomics, movement, combat timing, and one complete encounter before expanding the roster or story.

## Technical foundation

- Vite + vanilla ES modules
- Three.js rendering
- Capacitor Android packaging
- GitHub Actions debug APK build (unsigned; no production signing secrets)

## Development rules

1. Keep all work in this repository; do not modify the Sheep Arena repository as part of this project.
2. Develop on feature branches and use draft pull requests into `main`. Never merge without explicit approval.
3. Keep commits focused and validate syntax/build/workflows before claiming success.
4. No paid APIs, hidden telemetry, secrets, credentials, or production signing keys in source control.
5. No external data collection or permissions beyond what the game explicitly needs.
6. Clearly distinguish implemented, simulated, placeholder, and untested features.
7. Optimize for real Android hardware; desktop browser success is not proof of device performance.

## Current status

Repository bootstrap. The next milestone is the independent isometric game foundation and a repeatable Android debug build. No playable release is claimed by this README.
