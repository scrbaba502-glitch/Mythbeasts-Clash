import "./style.css";
import { Arena } from "./game/arena.js";
import { TouchControls } from "./game/controls.js";
import { CombatSystem } from "./game/combat.js";
import { loadRiggedCharacter } from "./game/characters.js";
import { loadEnvironmentManifest } from "./game/environment.js";
import { loadEnvironmentAssets } from "./game/environment-assets.js";

const errorPanel = document.querySelector("#startup-error");

async function loadChampionFromManifest(fighter, championId) {
  const response = await fetch("/assets/characters/manifest.json");
  if (!response.ok) throw new Error(`Character manifest unavailable (${response.status})`);
  const manifest = await response.json();
  const entry = manifest.characters?.[championId];
  if (!entry?.model || !Array.isArray(entry.requiredClips)) {
    throw new Error(`Character manifest entry is incomplete: ${championId}`);
  }
  return loadRiggedCharacter(fighter, entry.model, {
    scale: manifest.scale ?? 1,
    requiredClips: entry.requiredClips
  });
}

async function boot() {
  try {
    // Validate the world contract before constructing the scene or enabling combat.
    const environment = await loadEnvironmentManifest();
    const arena = new Arena(document.querySelector("#world"), { gameplayBounds: environment });
    const environmentAssets = await loadEnvironmentAssets(arena.scene, environment, {
      onAssetError: (asset, error) => console.warn(`Environment asset failed: ${asset.id}`, error)
    });
    if (environmentAssets.pending.length) {
      console.info("Environment art pending; procedural sanctuary blockout remains active.", environmentAssets.pending);
    }
    if (environmentAssets.failed.length) {
      console.warn("Some production environment assets could not be loaded.", environmentAssets.failed);
    }
    const combat = new CombatSystem(arena);

    // The character manifest remains the single source of truth for model paths and required clips.
    loadChampionFromManifest(arena.player, "vyrak").catch(error => {
      console.info("Vyrak production asset not installed or incomplete; using prototype proxy.", error.message);
    });
    loadChampionFromManifest(arena.rival, "atrox").catch(error => {
      console.info("Atrox production asset not installed or incomplete; using prototype proxy.", error.message);
    });

    document.querySelector("#restart-battle").addEventListener("click", () => window.location.reload());
    const controls = new TouchControls({
      pad: document.querySelector("#move-pad"),
      knob: document.querySelector("#move-knob"),
      actions: document.querySelector(".action-zone"),
      onMove: (x, y) => arena.setMoveInput(x, y),
      onAction: action => combat.perform(action)
    });
    arena.onFrame((dt, time) => combat.update(dt, time));
    document.querySelector("#start-battle").addEventListener("click", () => {
      document.querySelector("#title-screen").classList.add("dismissed");
      arena.start();
    }, { once: true });
    window.addEventListener("pagehide", () => {
      controls.destroy();
      arena.destroy();
    }, { once: true });
  } catch (error) {
    console.error(error);
    errorPanel.hidden = false;
    errorPanel.textContent = "THE ARENA COULD NOT INITIALIZE\n" + (error?.message || String(error));
  }
}

boot();
