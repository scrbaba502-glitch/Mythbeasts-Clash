# Production Art Acceptance Gate

## Why this gate exists

The first Android playtest exposed a gap between the approved visual direction and the content actually shipped: the runtime displayed primitive procedural fighter proxies and a procedural environment blockout. Those are useful engineering scaffolds, but they are not acceptable as the visual delivery of MYTHBEASTS CLASH.

This gate makes that distinction explicit and testable. A successful code build is not an art-complete milestone.

## Non-negotiable release rule

- Prototype geometry must remain labelled and treated as temporary.
- No character or environment manifest entry may be marked `production-asset-ready` until its real GLB exists at the declared path and passes the binary glTF 2.0 header/length check.
- Required animation clips must pass the existing character runtime validation.
- Missing, corrupt, or incomplete production assets must fail validation rather than being silently represented as approved art.
- A green Android CI run proves the app compiles and tests pass; it does not prove the game is visually production-ready.

## Character acceptance

### Vyrak — The Emberbound
- Clearly draconic beastborn anatomy; not a generic humanoid wearing a helmet.
- Basalt scale breakup, expressive reptilian head, strong jaw, muscular torso and digitigrade/credible beast legs.
- Long counterbalancing tail with believable deformation and ground-aware movement.
- Volcanic cleaver with readable silhouette and authored grip.
- PBR material response; ember fissures are restrained emissive accents, not a substitute for surface detail.
- One coherent rig with named Idle, Locomotion, Attack, Attack2, Attack3, Dodge, Hit, Skill, Victory and Defeat clips.

### Atrox Nefas — The Hollow Sovereign
- Asymmetrical primordial silhouette; not a recolour of Vyrak.
- Broken crown horns, obsidian/bone plate language, unnerving anatomy and restrained void fissures.
- BossWindup, Attack, Hit and Stagger must communicate readable telegraphs and impact.
- Phase-two presentation must have a distinct authored visual state.

## Environment acceptance: Ruined Sanctuary

- Rectangular, playable battlefield; never a circular ring.
- Monumental broken arch, layered colonnade, guardian effigies and toppled masonry.
- Believable worn stone, authored modular flagstones, braziers, crystal pylons, primordial seal and distant monolith skyline.
- Layered depth and atmospheric scale, with warm firelight balanced against cool stone.
- Keep the central combat lanes visually clear at phone-sized isometric framing.
- Separate collision proxies from render meshes; decorative assets must not obstruct combat readability.

## Mobile performance and technical review

- GLB 2.0, agreed +Y up / +Z forward / meter scale / root-at-ground contract.
- PBR metallic-roughness materials and initially 2K maximum champion textures.
- Character target 25k–45k triangles before LOD; profile on representative Android hardware.
- Check texture memory, draw calls, shadow cost, animation CPU and thermal behaviour.
- Validate silhouettes and combat readability at the actual portrait/landscape viewport used by the game.
- Inspect every imported model in-engine; do not approve from a DCC screenshot alone.

## Review evidence required before calling the game art-ready

1. GLB files and manifest status.
2. In-engine screenshots of each champion from gameplay camera distance.
3. Animation turntable or clips showing idle, locomotion, attack, dodge and hit.
4. Full Ruined Sanctuary gameplay-camera screenshot.
5. Android device capture and performance notes.
6. Completed `CHARACTER-ASSET-REVIEW-TEMPLATE.md` for each champion.

Until these exist, describe the build as an engineering prototype with placeholder art. Never market or present it as the finished visual target.
