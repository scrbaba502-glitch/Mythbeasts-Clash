# Vyrak — The Emberbound
## Production character concept specification

**Project:** MYTHBEASTS CLASH  
**Art direction:** Mythic Dark Fantasy + Beastborn Realism + Lost Worlds + Elemental Cinematic  
**Asset status:** Concept specification only; no production model is represented as complete.

## 1. Core read
Vyrak is a draconic beastborn bruiser: an ancient volcanic predator whose body looks evolved for surviving crushing impacts and eruptive heat. He must read as a living animal first, an intelligent mythic champion second, and an armored warrior third. Avoid a human torso with a dragon head, ornamental humanoid proportions, toy-like plates, or a generic bipedal lizard.

**Visual hook:** a low-slung, massively shouldered basalt dragon-beast with ember light trapped in deep fractures beneath volcanic armor.

## 2. Silhouette and proportions
- Broad shoulder and rib cage mass; waist narrows modestly, then transitions into a powerful counterbalancing tail.
- Digitigrade hind legs with deep hocks, heavy thighs, visible tendon paths, and broad clawed feet.
- Forelimbs are shorter but exceptionally powerful, with thick wrists and hooked claws that can brace against the ground.
- Neck is compact and heavily muscled; skull projects forward with a strong jaw and ridged brow.
- Tail is long and muscular at its base, tapering into a blunt armored counterweight—not a thin decorative whip.
- Head silhouette uses a distinctive backward-swept crown of uneven horn structures, with a clear jawline and readable eye sockets.
- Maintain negative-space separation between head, shoulders, weapon, and tail in the isometric gameplay camera.

**Proportion guardrail:** the head must not become oversized or cute; legs must not become human calves; hands must not become five-fingered human hands.

## 3. Anatomy and surface language
- Primary hide: dark charcoal and deep umber scales, varied in size and flow with anatomy rather than a uniform tiled pattern.
- Major armor scutes: naturally grown basalt-like plates over shoulders, spine, forearms, shins, and tail ridge. Their edges are chipped and asymmetrical.
- Under-structure: believable folds and softer, darker skin at joints, throat, inner elbows, hips, and jaw hinge.
- Ember fissures: sparse branching seams between selected scutes, concentrated around sternum, neck, forearms, and weapon-side shoulder. They glow from within; they are not neon painted stripes.
- Surface breakup: fine scratches, old impact scars, soot, mineral deposits, roughness variation, and subtle heat discoloration.
- Eyes: molten amber core with restrained warm emission, readable at phone scale without becoming oversized lamps.
- Claws and teeth: keratin/obsidian appearance with worn tips, not polished plastic.

## 4. Armor and weapon
Armor is selectively integrated with anatomy. It should look forged, repaired, and ritual-bound—not like a complete human knight suit.
- One dominant volcanic plate on the weapon-side shoulder, counterbalanced by smaller plates opposite.
- Layered basalt/forged-metal forearm bracing leaves wrist flexion and claw silhouette readable.
- Minimal chest and waist bindings; do not hide rib cage or abdominal motion.
- Weapon: heavy volcanic cleaver with a broad asymmetrical edge, dark forged-metal body, worn cutting bevel, and restrained ember channel.
- Claw-compatible handle and grip pose; verify no weapon clipping through wrist, forearm, tail, or ground.
- Weapon scale should feel heavy while preserving head and shoulder silhouette from the gameplay camera.

## 5. Palette and materials
| Region | Palette | Material response |
|---|---|---|
| Hide | charcoal, basalt, deep umber | rough, layered, non-metallic |
| Scutes | cooled volcanic black, iron-grey | chipped edges, varied roughness |
| Fissures | ember orange, restrained molten gold | low-area emissive accents |
| Horns/claws | dark keratin, obsidian | satin-to-matte, worn tips |
| Weapon | forged iron, soot-dark steel | metallic edge, rough body |
| Bindings | ash-brown leather, dark bronze | worn, low-gloss |

Avoid broad saturated orange coverage. Emissive detail is an accent and must not flatten anatomy or destroy dark-value separation.

## 6. Movement and performance
Vyrak's weight must be felt in every action. His center of mass stays low, with shoulders and hips driving movement. Avoid a human walk cycle mapped onto a reptile.
- **Idle:** slow rib-cage breathing, subtle jaw/throat movement, tail counterbalance, small claw adjustments, occasional ember pulse.
- **Locomotion:** hindquarters drive the stride; forelimbs absorb and stabilize; shoulders roll with mass; tail counter-swings. Foot plants must feel weighted.
- **Attack 1:** compact cleaver cut with shoulder/torso preload, decisive contact, and recoverable follow-through.
- **Attack 2:** heavier reverse cut; pelvis and tail counter-rotate to sell torque.
- **Attack 3:** committed finishing cleave with a grounded step and strongest silhouette change; no weightless spin.
- **Dodge:** short explosive beast lunge or shoulder-led evasive burst, not a human somersault.
- **Skill:** draw heat inward through chest and weapon arm, then release a controlled volcanic shockwave. Preserve anticipation and readable impact radius.
- **Hit reaction:** localized torso compression and head/shoulder recoil; preserve foot contact where possible.
- **Victory:** powerful grounded roar or weapon plant with controlled ember flare.
- **Defeat:** weight collapses through knees/forelimbs; head and weapon settle with believable inertia.

Clips must be authored in-place, share consistent root/facing conventions, and avoid foot sliding. The weapon requires a dedicated attachment socket and verified grip alignment.

## 7. Isometric camera acceptance
Review every sculpt, texture, rig, and animation from the actual gameplay camera and phone-sized captures.
- Head, shoulders, weapon edge, feet, and tail remain separable at gameplay scale.
- Ember fissures read as accents, not replacements for the body silhouette.
- Cleaver attacks must not disappear behind the torso.
- Tail motion must not obscure feet or opponent telegraphs.
- Maintain readable contrast against cool sanctuary stone and warm braziers.
- Test at the smallest target phone resolution, with gameplay VFX enabled and disabled.

## 8. Model and delivery contract
- One clean GLB with one deform skeleton and named animation clips.
- Coordinate convention: meters, +Y up, +Z forward, root at ground, scale 1.
- Required clips: Idle, Locomotion, Attack, Attack2, Attack3, Dodge, Hit, Skill, Victory, Defeat.
- PBR metallic-roughness materials; pack textures only when it improves mobile memory and draw-call behavior.
- First-pass texture set within the project's 2K maximum guidance; author lower LOD texture variants where profiling requires.
- Initial target 25k–45k triangles before LOD, then profile on representative Android hardware.
- Include thumbnail, front/side/back orthographic views, three-quarter hero view, wireframe, UV/material breakdown, rig screenshot, and animation contact sheet.
- Provide source scene and texture files alongside runtime GLB.

## 9. Review gates
Reject if anatomy reads as a humanoid wearing a dragon costume; gameplay silhouette is weak; joints deform like rubber; armor floats; feet slide; grip breaks; tail clips; emissive effects wash out detail; required clips are missing or use incompatible conventions; materials look plastic; or Android performance fails after LOD/texture profiling.

**Approval rule:** a beautiful hero render is not sufficient. Vyrak is accepted only when model, materials, rig, required clips, combat readability, and Android performance pass together.
