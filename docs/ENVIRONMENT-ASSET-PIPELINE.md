# MYTHBEASTS CLASH — Environment Art & World-Building Pipeline

**Visual direction:** Huge cinematic lost-world environments; mythic dark fantasy; ancient monumental architecture; elemental spectacle  
**Gameplay camera:** Elevated isometric 3D  
**Target platform:** Android first

## 1. Environment philosophy

Battlegrounds are locations inside a vast mythological world, not interchangeable fighting rings. Every arena should imply a larger civilization, history, catastrophe and geography beyond the playable floor.

Balance three atmospheric pillars:
- **Dark and mysterious:** deep shadows, ancient danger, weather, ruin and scale.
- **Legendary and ancient:** monumental structures, sacred geometry, carved histories, relics and recognizable world cultures.
- **Elemental and spectacular:** localized fire, frost, storm, solar or primordial events that create memorable silhouettes and lighting.

The battlefield must remain readable. Spectacle belongs around and behind the combat space; it must never obscure fighters, attacks, telegraphs or touch-driven gameplay.

## 2. Environment composition layers

Build every battleground in depth layers:

1. **Combat plane:** clear, readable, collision-tested floor with strong material breakup and enough room for movement and dodging.
2. **Near perimeter:** broken pillars, low walls, braziers, debris and interactive-looking set dressing kept outside combat lanes.
3. **Midground landmarks:** arches, statues, bridges, shrines, cliffs, gates or monumental structures that establish location identity.
4. **Far background:** layered skyline, mountains, temples, colossal silhouettes, waterfalls, storms or celestial phenomena.
5. **Atmosphere:** restrained fog, dust, ash, snow, embers, drifting leaves or elemental motes, tuned for mobile performance.
6. **Lighting story:** one clear key-light direction, controlled fill, readable fighter separation and localized practical/emissive sources.

Use foreground framing sparingly; never allow decorative silhouettes to merge with a champion's head or weapon.

## 3. First environment — Ruined Sanctuary

The Ruined Sanctuary is the initial vertical-slice benchmark:
- Broad rectangular combat floor, not a circular ring.
- Individual worn flagstones with varied scale, bevel, damage and roughness.
- Monumental broken arch and fractured colonnade.
- Guardian effigies and toppled masonry that imply a once-great civilization.
- Braziers with warm localized firelight.
- Elemental crystal pylons and a subtle primordial seal.
- Distant monolith skyline and layered atmospheric depth.
- Warm firelight against cool moonlit stone.

Keep the center and movement lanes clear. Scenic detail should be concentrated toward the perimeter and background. Existing procedural geometry is a blockout/lighting/composition scaffold, not the final environment asset quality bar.

## 4. Future world identity briefs

### Frozen Dominion
A vast glacial citadel carved into a frozen mountain shelf. Layered ice cliffs, ancient gates, broken bridges, frozen waterfalls and wind-carved stone. Blue ambient light is balanced with warm points of life or ancient energy. Snow and ice effects stay localized and never wash out silhouettes.

### Ashen Throne
A volcanic fortress built around a dormant caldera. Basalt terraces, fractured obsidian, collapsed war monuments, distant lava falls and heat distortion. Orange light must be controlled against dark rock so fighters remain legible.

### Celestial Expanse
A monumental high-altitude sanctuary above cloud layers. Broken celestial architecture, suspended stone fragments, distant luminous structures and vast sky depth. Gold/white light is used as a focal accent, not a flat overexposed wash.

These are world identity briefs, not a claim that these levels are already implemented.

## 5. Modular environment asset workflow

1. Establish a top-down gameplay layout and camera composition before detailed modeling.
2. Block out floor dimensions, boundaries, combat lanes, landmarks and distant silhouettes.
3. Validate fighter scale, camera framing, movement, collision and attack readability.
4. Create modular architecture kits: floor tiles, wall segments, columns, capitals, arches, stairs, trims, broken variants and rubble.
5. Sculpt hero landmarks and unique relics separately from reusable modular pieces.
6. Build PBR materials with shared texture atlases/material sets where practical.
7. Add collision proxies independent of decorative meshes.
8. Place lights, fog and particles after composition is stable.
9. Create LODs and profile draw calls, shadows, overdraw and texture memory.
10. Review in the actual Android build at gameplay scale.

## 6. Scale, collision and performance

- Use consistent metric scale and real-world architectural logic.
- Keep decorative meshes out of gameplay collision unless intentionally interactive.
- Use simple collision proxies for walls, pillars and boundaries.
- Keep the combat floor unobstructed and ensure the camera never loses the fighters behind foreground geometry.
- Use instancing for repeated rubble, columns, crystals or vegetation where suitable.
- Bake or fake distant lighting where dynamic lights are too expensive.
- Limit shadow-casting lights and expensive transparent particle layers.
- Use fog and distant silhouettes to create scale more cheaply than dense geometry.
- Provide LODs for large structures and repeated props; profile on representative Android devices.

## 7. Environment acceptance gate

An environment is not production-ready until:
- Its world identity is clear from a single gameplay screenshot.
- Combat floor, boundaries and movement lanes are readable.
- Landmark scale and layered depth feel monumental.
- Materials have believable surface response and weathering.
- Lighting separates champions from the background.
- Effects support the atmosphere without obscuring combat.
- Collision and camera framing are validated.
- Android frame pacing, memory and lifecycle are tested.

No empty flat floor, debug grid, sparse low-poly set dressing or simple circular ring can pass as final presentation.


## 8. Runtime manifest and GLB contract

The canonical runtime manifest is `public/assets/environments/manifest.json`. It defines:
- Stable environment identity and schema version.
- Metric coordinate contract (`+Y` up, `+Z` forward).
- Rectangular gameplay dimensions consumed by player and boss movement bounds.
- Stable asset IDs, GLB paths, category, collision intent, required flag and LOD declarations.
- Honest delivery status for every production asset.

The runtime validates this manifest before creating the arena. Invalid schema, coordinate conventions, bounds, duplicate IDs/paths, malformed asset paths, missing required landmarks or invalid collision/LOD declarations stop startup with a visible error rather than silently creating an incorrectly scaled world.

### Asset delivery states

- `production-asset-pending`: expected asset is not delivered; runtime keeps the procedural blockout and does not request the missing GLB.
- `production-asset-ready`: runtime attempts to load the declared GLB and attaches it to the scene.
- A failed GLB load is recorded and reported; the procedural blockout remains available as the fallback.

Never mark an asset ready until its file exists at the declared path and passes visual, collision, LOD and Android performance review. The current Ruined Sanctuary remains `procedural-blockout`; all listed production GLBs are pending.

### GLB scene requirements

- GLB scene root uses the manifest coordinate contract and metric scale.
- Apply transforms and document pivots before export.
- Separate render geometry from collision proxies.
- Use metallic-roughness PBR materials and shared atlases where practical.
- Provide declared LOD levels with silhouette-preserving transitions.
- Avoid missing external texture references; deliver self-contained GLB files.
- Name the scene root after the stable manifest asset ID for runtime diagnostics.

### Runtime integration and validation

The manifest validator and GLB loader are covered by automated tests. Tests verify pending assets do not trigger network loads, ready assets attach to the scene, and failed asset loads are surfaced without preventing remaining assets from loading. The Android build must still be validated after every integration change; desktop browser success alone is not sufficient.
