# Ruined Sanctuary — Production Asset Breakdown

**Role:** First environment vertical-slice benchmark  
**Current state:** Procedural composition/blockout exists; all authored assets below remain pending.  
**Camera:** Elevated isometric, Android-first  
**Battlefield:** Rectangular 20.8 m × 16.6 m gameplay bounds

## 1. Composition lock

The environment must read as a forgotten sacred complex built around a sealed primordial site. It is not a symmetrical tournament arena and must not resemble a circular ring.

- Keep the central combat region and primary dodge lanes visually quiet.
- Use the broken arch as the dominant landmark, offset from the centerline so the scene feels discovered rather than staged.
- Place fractured columns in staggered groups; avoid a repetitive colonnade wall.
- Guardian effigies frame the far side and establish scale.
- Push monolith silhouettes into atmospheric distance to imply a much larger lost world.
- Use braziers as warm practical accents against cool moonlit stone.
- The primordial seal is a secondary focal point, visible without competing with fighters.
- Crystal pylons are optional accent props; they must not clutter movement lanes.

## 2. Asset inventory and production priority

| Priority | Asset | Purpose | Collision |
|---|---|---|---|
| P0 | Combat floor + flagstone kit | Gameplay surface and readable boundaries | Walkable |
| P0 | Broken arch hero landmark | Primary identity and scale | None |
| P0 | Colonnade kit | Layered midground architecture | Simple proxy |
| P0 | Guardian effigies | Iconic silhouette and world history | None |
| P1 | Toppled masonry kit | Ruin storytelling and perimeter breakup | Simple proxy |
| P1 | Braziers | Warm practical lighting and focal accents | None |
| P1 | Primordial seal | Storytelling and subtle emissive detail | None |
| P2 | Crystal pylons | Elemental accent and composition variation | None |
| P2 | Distant monolith skyline | Far-depth scale at low cost | None |

P0 assets establish a recognizable location. P1 assets enrich the scene. P2 assets are added only after combat readability and mobile frame pacing are stable.

## 3. Modular kit specifications

### Combat floor and flagstones
- Metric modular tiles with consistent edge snapping and controlled bevel variation.
- Use several damage states: intact, chipped, fractured, displaced.
- Avoid obvious repeating patterns; rotate and vary scale only within physically plausible ranges.
- Keep floor roughness and value contrast restrained so UI, fighters and telegraphs remain dominant.
- Collision is a clean walkable plane; decorative cracks and small debris do not create movement snags.

### Broken arch
- One hero asset with a clear asymmetrical break and readable negative space.
- Large masonry blocks, layered carved trim and restrained relic motifs.
- Silhouette must remain legible against the far background from the gameplay camera.
- No tiny ornamental detail that disappears at phone scale.

### Colonnade
- Modular intact, cracked, shortened and collapsed column variants.
- Reusable capitals and bases; shared materials and trim sheets.
- Keep columns outside the validated combat bounds and avoid camera occlusion.

### Guardian effigies
- Two or more related but non-identical monumental guardians.
- Their silhouettes should communicate the ancient civilization without resembling playable champions.
- Weathering, chipped stone, erosion and restrained inlaid relic details.
- Use simplified collision or none; decorative detail must not become a gameplay obstacle.

### Toppled masonry
- Reusable rubble clusters with varied silhouettes and footprint sizes.
- Build authored clusters rather than scattering dozens of independent high-poly stones.
- Keep debris outside primary movement lanes; collision proxy only for substantial pieces.

### Braziers and primordial seal
- Brazier geometry should be readable as an ancient crafted object, with a separate low-cost flame effect.
- Practical light radius is localized; do not flood the floor with orange.
- Seal geometry stays close to the ground and uses low-intensity emission, subtle pulse and clear stone/material separation.

### Background monoliths
- Use a small number of large silhouettes, not a dense high-poly skyline.
- LOD2 or baked/impostor treatment is acceptable at distance.
- Atmospheric perspective should do more work than geometry density.

## 4. Material and lighting language

- Main stone: cool grey-blue limestone with roughness variation, edge wear, mineral staining and restrained moss/dust.
- Older carved stone: darker value, deeper cavities and selective polished wear on handled surfaces.
- Metal relic details: tarnished bronze/iron, low-gloss and sparse.
- Brazier light: warm amber/orange with localized falloff.
- Primordial seal: faint cool or muted gold energy; avoid saturated neon.
- Ambient fill remains cool enough to separate warm practical sources.
- One dominant key-light direction; avoid multiple competing shadow directions.

## 5. Performance contract

Starting targets; profile and revise on representative Android hardware.

- Shared materials and texture atlases for modular stone kits.
- 2K maximum texture maps for hero landmarks; 1K or smaller for repeated props and distant assets.
- Keep transparent materials and layered particles rare.
- Use instancing for repeated modular pieces where it reduces draw calls.
- Use LOD0/1/2 on large architecture and distant landmarks.
- Use baked lighting or vertex color for distant set dressing where appropriate.
- Decorative meshes and collision proxies remain separate.
- Track draw calls, visible triangles, texture memory, shadow cost and frame pacing.
- Do not add dynamic shadow casting to every brazier or prop.

## 6. Acceptance captures

Every environment review submission must include:
1. Gameplay-camera screenshot at normal phone viewport.
2. Same camera with champions and telegraphs visible.
3. Top-down layout with combat bounds and collision proxies.
4. Lighting-only capture showing key/fill/practical balance.
5. Material close-ups for stone, metal and seal surfaces.
6. LOD and wireframe captures for hero assets.
7. Android performance capture from the target device/build.

## 7. Rejection criteria

Reject if the scene reads as a generic circular arena, combat lanes are cluttered, landmarks merge with champion silhouettes, the center is visually noisy, collision catches movement, lighting washes out the fighters, repeated kits reveal obvious tiling, or performance regresses without a measured reason.

**Approval rule:** the Ruined Sanctuary passes only when it reads as a monumental lost-world location in gameplay—not merely as a beautiful isolated render.
