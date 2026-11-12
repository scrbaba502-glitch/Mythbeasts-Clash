# Champion art and animation bible

This document is the visual production contract for the first champion roster. These are original design directions, not claims that final character assets already exist.

## Shared visual language

The world is ancient myth after a catastrophic rupture: carved stone, weathered metal, mineral surfaces, elemental light, and silhouettes that remain readable from the elevated isometric camera. Champions should feel like legendary living beings wearing purposeful armor—not identical humanoid robots with different paint.

Every champion needs:
- A recognizable silhouette at small mobile-screen scale
- A distinct body plan, stance, locomotion rhythm, and center of gravity
- A weapon or natural combat anatomy that supports their fighting style
- A restrained primary palette and one strong elemental light signature
- Idle, locomotion, start/stop, turn, attack anticipation, active strike, recovery, dodge, hit reaction, stagger, skill, ultimate, victory, and defeat animation states
- Rigging and animation transitions designed for gameplay readability, not just cinematic posing

## Vyrak — The Emberbound

**Role:** balanced close-range bruiser and the first playable champion.

**Silhouette:** drake-blooded warrior with a powerful forward-leaning torso, digitigrade lower legs, a pronounced tail, ridged brow, and asymmetrical volcanic plate armor. Avoid a smooth human mannequin silhouette.

**Materials and palette:** charcoal basalt, dark bronze, ember-orange fissures, heat-glow concentrated around the chest core and weapon edge.

**Weapon language:** a heavy single-edge volcanic cleaver. The weapon should visibly carry weight; shoulder and torso rotation lead the swing.

**Movement language:** deliberate grounded steps, weight transfer, tail counterbalance, a short explosive forward burst on dodge. Attacks communicate commitment through anticipation and recovery.

**Combat identity:** reliable close-range pressure, a short ember burst, and a high-impact finishing ultimate.

## Frostfang — The Pale Hunt

**Role:** mobile predator and evasive counter-attacker.

**Silhouette:** lupine beast-warrior with digitigrade legs, long tail, angular ears, a forward hunting posture, and layered ice-grown shoulder and forearm armor. The head and muzzle should read clearly from the isometric camera.

**Materials and palette:** cold slate, pale silver, translucent glacial blue, subtle frost vapor.

**Weapon language:** natural claw strikes supported by forearm blades or ice-grown talons; no generic oversized sword.

**Movement language:** low center of gravity, quick directional changes, stalking idle, sharp pounce, visible landing compression, and fast recovery.

**Combat identity:** spacing, rapid multi-hit strings, evasive counters, and a freezing burst.

## Solarius — The Dawnforged

**Role:** disciplined mid-range guardian with controlled reach.

**Silhouette:** tall avian/solar champion with a proud upright posture, layered feather-like mantle plates, swept crest, and broad sun-disc shield profile. Wings are armor-like or partially energy-formed and must not obscure the combat read.

**Materials and palette:** warm ivory, aged gold, white-hot solar accents, restrained amber glow.

**Weapon language:** a long sun-spear and a compact radiant shield; clear thrust and guard silhouettes.

**Movement language:** poised footwork, measured pivots, strong planted guards, clean lunges, and graceful aerial lift only when gameplay supports it.

**Combat identity:** controlled reach, defensive timing, counter-thrusts, and a solar area denial ultimate.

## Raijin — The Stormbound

**Role:** heavy disruptor with explosive burst windows.

**Silhouette:** broad oni-like storm titan with asymmetrical shoulder mass, thick forearms, powerful legs, horned crown, and visible storm conduits across the armor.

**Materials and palette:** deep indigo, weathered iron, electric cyan, occasional violet arcs.

**Weapon language:** paired thunder tonfas or a compact thunder hammer; choose one final direction during concept approval and keep it consistent.

**Movement language:** heavy planted steps punctuated by sudden lightning-fast bursts, recoil in the shoulders, and grounded landings.

**Combat identity:** guard-breaking impact, short-range shockwaves, interruption, and a storm-chain ultimate.

## Atrox Nefas — The Hollow Sovereign

**Role:** central story antagonist and ultimate threat.

**Silhouette:** towering primordial entity with an intentionally unnatural asymmetrical body plan. Its outline should feel ancient and wrong: layered void plates, broken crown-like horns, elongated arms, and floating fragments that react to its power.

**Materials and palette:** obsidian, desaturated bone, deep violet-black, narrow crimson-violet fissures. Avoid a simple recolor of Vyrak.

**Movement language:** calm oppressive stillness interrupted by sudden impossible displacement; attacks are telegraphed with environmental distortion before impact.

**Encounter identity:** readable attack tells, punishable recovery windows, escalating phase behavior, and a final transformation tied to the Primordial Core.

## Animation and gameplay readability rules

1. Use authored skeletal rigs and animation clips for production characters. Procedural movement may supplement but must not replace the core animation set.
2. Every damaging move has anticipation, active frames, and recovery. The visual tell must precede the hit.
3. Keep foot contact believable during locomotion and planted attacks. Avoid skating.
4. Blend locomotion, turns, upper-body actions, and hit reactions without snapping between poses.
5. Use brief, controlled hit-stop and camera feedback; never sacrifice input responsiveness.
6. Preserve clear weapon arcs and avoid excessive VFX that hide fighters or attack timing.
7. Validate silhouettes, health readability, and effects on a real phone at typical viewing distance.
8. Build LODs and mobile-friendly materials; profile before increasing particle counts or shadow quality.

## Asset acceptance gate

A champion is not production-ready until the model, rig, materials, animation states, combat hitboxes, and in-game camera read have all been reviewed together. A static concept image or a greybox mesh is not a completed fighter.

## Technical animation delivery contract

The runtime accepts GLB assets under `public/assets/characters/<character>/`. Keep each character's animation clips in the same GLB and on the same deform skeleton. Clip names are case-insensitive; the runtime maps these aliases:

| Runtime state | Accepted clip names |
|---|---|
| idle | Idle, Breathing, Stand |
| locomotion | Run, Walk, Locomotion, Move |
| attack | Attack, LightAttack, Strike |
| dodge | Dodge, Roll, Dash |
| hit | Hit, HitReact, Damage |
| stagger | Stagger, Stun |
| skill | Skill, Special, Ability |
| victory | Victory, Win |
| defeat | Defeat, Death, Lose |
| bossWindup | Windup, Telegraph, Charge |

One-shot actions should be authored with clear anticipation and recovery. Locomotion clips should be in-place so the gameplay controller remains authoritative for world movement. Root motion is not enabled in this first integration. Missing clips safely fall back to the prototype model or the current available animation state; they must not crash the encounter.

Before accepting a champion asset, test every clip in the actual isometric camera, verify the ground contact and facing direction, inspect material/texture memory, and confirm that crossfades do not introduce pose pops.
