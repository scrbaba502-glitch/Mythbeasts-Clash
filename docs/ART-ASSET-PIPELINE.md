# MYTHBEASTS CLASH — Production Character Asset Pipeline

**Status:** Production pipeline contract  
**Art direction:** Realistic beastborn anatomy; mythic dark fantasy; cinematic elemental accents  
**Runtime:** Three.js / glTF 2.0 binary (.glb) / Android-first

This document defines how original character assets move from concept to a validated in-game champion. The runtime GLB loader and proxy fallback are integration infrastructure; they do not mean production art has been delivered.

## 1. Pipeline stages and ownership

1. **Design brief:** approved role, silhouette, species anatomy, weapon, palette, signature and gameplay needs.
2. **Concept exploration:** front, side and three-quarter views; expression sheet; silhouette at gameplay scale; key materials and color script.
3. **Blockout:** proportion and pose validation using simple forms. No detail pass until silhouette and camera read are approved.
4. **High-resolution sculpt:** organic anatomy, facial planes, scales/fur/feathers, armor forms, weapon and story wear.
5. **Retopology and UVs:** deformation-friendly topology, economical material separation, clean UV islands and consistent texel density.
6. **Rigging and skinning:** body rig, creature-specific bones, deformation tests and weapon/secondary-motion attachments.
7. **Animation:** authored gameplay clips, timing review against combat data, transitions and final pose validation.
8. **Look development:** PBR materials, texture bake, emissive masks and lighting validation.
9. **Optimization:** LODs, texture budgets, mesh/material consolidation and performance profiling.
10. **Export and integration:** GLB export, manifest update, runtime validation and Android device test.
11. **Acceptance:** visual, animation, combat, memory and device gates signed off before the asset replaces its proxy.

Do not skip from a concept image directly to a production-ready claim.

## 2. Source scene and coordinate contract

Use Blender and metric units.
- Up axis: +Y.
- Character forward: local +Z.
- Origin: ground-plane midpoint between the feet.
- Apply object transforms before export; keep scale consistent across champions.
- One primary deform armature per champion. Avoid competing skeletons.
- Locomotion clips are in-place; gameplay code owns world translation and facing. Root motion is not enabled in the current runtime.
- Keep weapon props and attachment sockets named and oriented consistently.
- Export GLB with meshes, armature, materials, textures and named animation clips.

## 3. Anatomy, topology and rig

The base hierarchy should support a humanoid-plus-creature body while preserving the champion's actual species anatomy.

Minimum deform chain:
- root, pelvis, spine_01, spine_02, chest, neck, head
- upper_arm.L, forearm.L, hand.L and right-side equivalents
- thigh.L, shin.L, foot.L and right-side equivalents

Add only when required by the design:
- tail_01...tail_N, jaw, ears, horns, wing roots and wing joints
- digitigrade hock/ankle structure, extra toes/claws
- feather/fur/crest control bones
- armor or cloth attachment bones, weapon sockets and FX sockets

Rigging gates:
- Preserve shoulder, hip, elbow, knee, wrist, ankle and jaw deformation.
- Avoid candy-wrapper twisting and collapsing joints.
- Validate extreme combat poses, crouch, pounce, dodge, weapon reach and hit reactions.
- Keep secondary motion layered and controllable; it must not destabilize hit timing.
- Maintain a consistent rest pose across all clips for that character.

## 4. Animation clip contract

Clip aliases are case-insensitive and mapped by the runtime controller. Use clear canonical names whenever possible.

| Runtime state | Preferred clip name | Accepted aliases |
|---|---|---|
| idle | Idle | Breathing, Stand |
| locomotion | Run | Walk, Locomotion, Move |
| attack 1 | Attack | LightAttack, Strike |
| attack 2 | Attack2 | Combo2, HeavyAttack |
| attack 3 | Attack3 | Combo3, Finisher |
| dodge | Dodge | Roll, Dash |
| hit | Hit | HitReact, Damage |
| stagger | Stagger | Stun |
| skill | Skill | Special, Ability |
| victory | Victory | Win |
| defeat | Defeat | Death, Lose |
| boss windup | Windup | Telegraph, Charge |

Required animation quality:
- Idle: subtle breath, balance and species-specific secondary motion.
- Locomotion: clean in-place loop with grounded footfalls.
- Attack: readable anticipation, contact pose and recovery.
- Combo clips: visually distinct links, compatible transitions and escalating weight.
- Dodge: clear directional silhouette change and landing recovery.
- Hit/stagger: distinct severities with no loss of ground contact.
- Skill/ultimate: readable preparation, active window and recovery.
- Victory/defeat: intentional held terminal pose.
- Boss windup: legible at normal gameplay scale.

All clips in a single GLB must target the same skeleton and compatible rest pose. Test the exact runtime aliases before delivery.

## 5. PBR material and texture contract

Use glTF metallic-roughness workflow.
- Base color, normal, metallic-roughness and ambient occlusion maps as needed.
- Pack occlusion, roughness and metallic channels where practical and supported.
- Use emissive maps only for deliberate elemental sources.
- Prefer texture atlases/material consolidation where it does not damage material quality.
- Keep transparent materials rare; avoid expensive layered transparency.
- Avoid unnecessary 4K textures on mobile.

Initial budget targets (profile and revise against actual Android devices):
- Hero champion LOD0: approximately 25k–45k triangles.
- LOD1: approximately 12k–20k triangles.
- LOD2: approximately 4k–8k triangles.
- Hero texture sets: up to 2K where justified; secondary maps generally 1K–2K.
- Keep material slots economical; do not create a new material for every small armor piece.
- Use mesh/texture compression only after confirming compatibility with the current Three.js loader and build pipeline.

These are starting budgets, not permission to spend the maximum on every asset. Measure GPU time, draw calls, texture memory and frame stability on representative Android hardware.

## 6. Folder and file naming

Character delivery:
`public/assets/characters/<character-id>/<character-id>.glb`

Current integration paths:
- Vyrak: `public/assets/characters/vyrak/vyrak.glb`
- Atrox: `public/assets/characters/atrox/atrox-nefas.glb`

Recommended source/delivery structure outside runtime assets:
- `art-source/characters/<character-id>/concept/`
- `art-source/characters/<character-id>/blend/`
- `art-source/characters/<character-id>/textures/`
- `art-source/characters/<character-id>/exports/`
- `art-source/characters/<character-id>/review/`

Use lowercase stable IDs and descriptive filenames. Do not commit large working Blender files or unoptimized source textures into runtime folders. Keep approved source files and delivery exports clearly separated.

## 7. Manifest and integration

The runtime manifest is `public/assets/characters/manifest.json`. Update it when an asset is added or when scale, facing, clip names or attachment conventions differ.

Integration checklist:
1. Validate the GLB structurally and confirm all external resources are embedded or resolved.
2. Confirm expected manifest path and stable character ID.
3. Load in the game; check console/runtime logs for missing files, invalid clips or material errors.
4. Verify +Z facing, ground origin, scale, weapon socket and hitbox alignment.
5. Test every clip and crossfade in the real isometric camera.
6. Confirm proxy fallback still works if an asset is missing or late-loaded.
7. Check disposal/lifecycle behavior when changing scenes or restarting.
8. Build Android and profile memory, draw calls and frame pacing on device.

A file existing at the manifest path is not sufficient for acceptance.

## 8. Final acceptance checklist

- [ ] Approved design brief, silhouette and turnaround
- [ ] Detailed organic anatomy and species-specific proportions
- [ ] Clean topology and deformation-friendly edge flow
- [ ] Correct origin, scale, +Z facing and applied transforms
- [ ] Stable rig, skin weights and creature-specific controls
- [ ] All required clips present, named and tested on one skeleton
- [ ] No foot sliding, pose pops, broken attachments or bind-pose offsets
- [ ] PBR maps correct; no missing textures or broken normals
- [ ] LODs and mobile budgets reviewed
- [ ] Isometric readability and VFX timing approved
- [ ] Android build/device performance and memory accepted

Only after all checks pass should the asset replace its prototype proxy in the production roster.
