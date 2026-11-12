# Character Asset Review Template

Use this checklist for every champion, boss, replacement model or major character-art revision. A submission is not production-ready merely because the GLB imports successfully.

## Submission metadata

- Character:
- Version / artist:
- GLB file:
- Date:
- Target build / branch:
- Intended role and combat archetype:
- Known limitations:

## 1. Visual identity

- [ ] Silhouette is distinctive from every other roster character.
- [ ] Anatomy matches the creature/species brief; no generic humanoid substitutions.
- [ ] Head, hands/paws, feet, tail, wings, horns and other identity features are readable at gameplay camera.
- [ ] Armor and equipment support anatomy rather than concealing it.
- [ ] Materials read as tactile PBR surfaces, not plastic.
- [ ] Palette and elemental effects follow the art direction.
- [ ] Character remains readable against all current environment palettes.

Evidence: gameplay-camera screenshot, front/side/back views, neutral turntable, close-ups.

## 2. Rig and deformation

- [ ] Skeleton hierarchy and naming are documented.
- [ ] Forward/up axes and metric scale match the project contract.
- [ ] Root and pivot placement are documented.
- [ ] Shoulder, hip, elbow, knee, wrist/ankle and spine deformations are clean.
- [ ] Hands/paws, jaw, tail, wings and secondary appendages deform correctly.
- [ ] No visible mesh collapse, severe clipping or unexpected scale changes.
- [ ] Skin weights are reviewed in extreme poses.

Evidence: rig view, deformation stress poses, root/pivot capture.

## 3. Animation coverage and quality

- [ ] Idle has breathing and subtle character-specific life.
- [ ] Walk/run/sprint have grounded contacts and appropriate weight.
- [ ] Direction changes and stop/start transitions are clean.
- [ ] Light attack chain contains distinct readable attacks.
- [ ] Heavy attack / signature skill / ultimate have clear anticipation, active and recovery phases.
- [ ] Dodge and hit reactions preserve weight and directional intent.
- [ ] Stagger, victory and defeat states are complete.
- [ ] Loop flags, clip names, frame rate and root-motion policy are documented.
- [ ] No foot skating, robotic snapping or repeated generic motion.
- [ ] Animation events align with gameplay hit timing.

Evidence: animation contact sheet, full-speed gameplay capture, slowed review capture.

## 4. Isometric gameplay readability

- [ ] Identity silhouette remains clear at target phone viewport.
- [ ] Attack direction and hitboxes are visually understandable.
- [ ] Character does not disappear into the floor/background.
- [ ] VFX do not obscure enemy telegraphs or contact points.
- [ ] Weapon/appendage poses remain readable during combo transitions.
- [ ] Camera framing does not crop essential identity features during core moves.

Evidence: standard gameplay camera, busy combat frame, small-screen capture.

## 5. Technical and mobile performance

- [ ] GLB opens without missing dependencies or console errors.
- [ ] Textures are within agreed resolution and memory budgets.
- [ ] Materials are shared/instanced where appropriate.
- [ ] Mesh complexity and bone count are recorded.
- [ ] LODs preserve identity and do not pop distractingly.
- [ ] Transparent materials and particle counts are controlled.
- [ ] Model loads and disposes safely.
- [ ] Android frame pacing, memory and load time are measured on a representative device.

Record: triangle counts, material slots, texture memory, bone count, GLB size, load time, frame-time impact.

## 6. Decision

- [ ] **Approve** — all critical gates pass; integrate into the production branch.
- [ ] **Revise** — clear actionable changes are listed below.
- [ ] **Reject** — fundamental identity, quality or technical requirements are not met.

### Findings and required changes

1.
2.
3.

### Final reviewer notes

Do not mark an asset approved based on a beauty render alone. Approval requires gameplay-camera evidence, animation review and a measured mobile performance check.
