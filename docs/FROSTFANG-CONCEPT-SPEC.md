# Frostfang — The Pale Hunt

**Role:** Playable champion concept specification  
**Archetype:** Mobile predator / pursuit specialist  
**Element:** Ice  
**Visual direction:** Beastborn realism, mythic dark fantasy, organic anatomy  
**Status:** Production concept specification; no final model or rig is currently integrated.

## 1. Identity and silhouette

Frostfang is a lupine ice predator built for acceleration, pursuit and decisive pounces. The silhouette must read immediately at the elevated isometric gameplay camera: low forward head, powerful hindquarters, long digitigrade legs, dense shoulder ruff and distinctive forearm blades/claws. Avoid a humanoid torso, upright human stance or generic werewolf proportions.

The body should feel like a real predatory animal adapted to mythic combat. Keep the spine flexible, shoulders mobile, hips strong and tail active as a counterbalance. The head remains unmistakably lupine, with a long muzzle, expressive brow, alert ears and a readable jawline.

## 2. Anatomy and proportions

- Four-limbed locomotion as the default movement language; combat may briefly rise or brace without becoming a permanently upright humanoid.
- Deep chest and strong scapular region for pounce power.
- Large haunches and digitigrade rear legs for explosive acceleration.
- Forelimbs are long and muscular, with articulated wrists and oversized ice-hardened claws.
- Dense pale fur around neck, shoulders, spine and tail; shorter fur on limbs and face to preserve anatomy.
- Long, muscular tail with controlled secondary motion.
- Paws must have clear toe separation and believable contact poses.

## 3. Surface, materials and palette

Primary fur: layered pale grey, winter white and muted blue-grey, with darker graphite accents around the muzzle, paws and dorsal ridge. Ice growth is localized to claw edges, forearm blades and a few naturally exposed ridges; do not encase the creature in crystal armor.

Use strand- or card-based fur only where the mobile budget supports it. A groomed sculpt with optimized fur cards is acceptable. Materials must remain tactile and non-plastic: varied roughness, subtle clumping, believable skin/nose response and restrained frost accumulation. Avoid saturated cyan emissive coverage.

## 4. Armor and weapon language

Frostfang's armor is minimal and functional: weathered leather/metal bindings, a small number of bone or glacial plates, and protective elements that do not hide shoulder, hip or knee articulation. The forearm ice blades are biological/elemental extensions, not oversized detachable gauntlets. Their silhouette must remain distinct from the natural claws.

## 5. Animation and combat personality

Movement is a low hunting gait with shoulder roll, spine flexion, hind-leg compression and tail counterbalance. Acceleration should visibly load the rear legs before the body surges forward. Stops require weight transfer and paw placement rather than sliding.

Required animation coverage:
- Idle: alert breathing, ear tracking, subtle paw adjustments and tail movement.
- Locomotion: walk, run, sprint and directional turns with grounded foot contacts.
- Combat: three distinct claw strikes, bite or shoulder check, pounce, landing recovery.
- Dodge: low lateral bound or rolling evasive step; preserve direction and momentum.
- Hit reactions: head/shoulder recoil, stagger and grounded recovery.
- Signature skill: glacial pounce that leaves a brief, readable frost trail.
- Ultimate: a focused predator burst with a clear anticipation pose, fast traversal and a decisive impact.
- Victory/defeat: characterful animal behavior, never human posing.

Every attack needs anticipation, active impact and recovery. Root motion or in-place animation must be selected deliberately and validated against gameplay movement. Avoid foot skating, frozen tails, repeated identical claw swipes and instant pose snapping.

## 6. Isometric readability

At phone scale, the head direction, forearm blades, hindquarter silhouette and pounce anticipation must remain legible. Keep VFX low and trailing behind the body so they do not obscure paw placement or enemy telegraphs. Use value separation between pale fur and cool stone environments.

## 7. GLB delivery contract

- Deliver a clean, named, humanoid-free skeletal hierarchy with consistent forward/up axes matching the project contract.
- Apply transforms; use metric scale; place origin at a documented root/pivot.
- Separate body, eyes, claws/blades and optional armor meshes logically.
- Provide PBR metallic-roughness materials and optimized texture sets.
- Include LOD0/LOD1/LOD2 where justified; preserve silhouette at LOD1.
- Supply animation clips with stable names: idle, walk, run, sprint, attack1, attack2, attack3, pounce, dodge, hit, stagger, skill, ultimate, victory, defeat.
- Document root-motion behavior, clip frame rates, loop flags and contact events.
- No external missing texture dependencies; GLB must be self-contained.

## 8. Review gates

Reject if Frostfang reads as an upright humanoid wolf, has weak hindquarters, rigid spine/tail, plastic fur, excessive crystal armor, unreadable claws, floating foot contacts, repeated robotic attacks or VFX that hide gameplay. Approve only after silhouette review at gameplay camera, neutral turntable, anatomy close-ups, animation contact sheets and Android performance validation.
