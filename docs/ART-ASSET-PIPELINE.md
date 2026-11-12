# Champion Art Asset Pipeline

This repository consumes authored champion assets as glTF 2.0 binary files (`.glb`). The runtime loader is already wired into the arena; the visible greybox fighters remain a fallback until a validated GLB is placed at the manifest path.

## 1. Source scene and scale

- Author in Blender using metric units.
- Character forward is local +Z; up is +Y.
- Put the character origin at the midpoint between the feet on the ground plane.
- Apply object transforms before export. Keep a consistent scale across all champions.
- Use one deform skeleton per character. Avoid multiple competing armatures.
- Keep locomotion clips in-place; gameplay code owns world translation and facing.

## 2. Skeleton contract

Use a readable humanoid-plus-creature hierarchy. Minimum deform bones:
- `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`, `head`
- `upper_arm.L`, `forearm.L`, `hand.L` and right-side equivalents
- `thigh.L`, `shin.L`, `foot.L` and right-side equivalents

Creature-specific bones may include tail segments, horns, jaw, wings, shoulder plates, and weapon attachments. Keep attachment bones separate from deform bones where practical.

## 3. Required clips

Clip names are mapped case-insensitively by `src/game/animation.js`. Required states and aliases are listed in `public/assets/characters/manifest.json`.

Animation quality gates:
- Idle must have subtle secondary motion without foot sliding.
- Locomotion must loop cleanly and remain in-place.
- Attack must show anticipation, readable contact, and recovery.
- Dodge must shift the silhouette and communicate invulnerability timing.
- Hit and stagger must have distinct severity.
- Skill must clearly communicate its area/effect timing.
- Victory and defeat must hold a deliberate final pose.
- Boss windup must be readable from the isometric camera at phone scale.

All clips in a single GLB must target the same skeleton and rest pose.

## 4. Materials and mobile budget

- Use glTF metallic-roughness PBR materials.
- Prefer packed ORM textures where supported by the export pipeline.
- Start with 2K maximum texture dimensions per champion; use 1K for secondary maps when possible.
- Target 25k–45k triangles per champion before LODs.
- Avoid excessive transparent materials, tiny geometry details, and costly real-time materials.
- Keep material slots economical; the runtime uses emissive materials for hit feedback.

## 5. Export and integration

1. Export the character as glTF 2.0 binary (.glb), including meshes, armature, materials, and all named clips.
2. Place Vyrak at `public/assets/characters/vyrak/vyrak.glb`.
3. Place Atrox at `public/assets/characters/atrox/atrox-nefas.glb`.
4. Update the manifest if scale or clip names differ.
5. Open the game and verify no GLB load errors; if the file is absent, the proxy fallback is expected.
6. Test the actual model from the production isometric camera, not only Blender's perspective viewport.

## 6. Acceptance checklist

- [ ] Silhouette and anatomy read clearly at mobile screen size.
- [ ] Feet contact the ground; origin is at ground center.
- [ ] Forward axis is +Z and facing matches gameplay.
- [ ] No missing textures, broken normals, or bind-pose offsets.
- [ ] Every clip plays on the same skeleton with no pose pops.
- [ ] Crossfades do not snap between poses.
- [ ] Locomotion is in-place and does not fight arena movement.
- [ ] Weapon attachments remain aligned during attack and dodge.
- [ ] Hit flash remains visible but does not wash out the art.
- [ ] Performance and memory use are acceptable on target Android hardware.

A file existing at the manifest path is not sufficient for acceptance. The asset must pass the complete checklist and be tested in an Android build.
