import "./style.css";
import { Arena } from "./game/arena.js";
import { TouchControls } from "./game/controls.js";
import { CombatSystem } from "./game/combat.js";
import { loadRiggedCharacter } from "./game/characters.js";

const errorPanel = document.querySelector("#startup-error");
try {
  const arena = new Arena(document.querySelector("#world"));
  const combat = new CombatSystem(arena);
  // Load authored GLB assets when present; retain the clearly marked greybox fallback otherwise.
  loadRiggedCharacter(arena.player, "/assets/characters/vyrak/vyrak.glb", { scale: 1 }).catch(error => {
    console.info("Vyrak rigged asset not installed yet; using prototype proxy.", error.message);
  });
  loadRiggedCharacter(arena.rival, "/assets/characters/atrox/atrox-nefas.glb", { scale: 1 }).catch(error => {
    console.info("Atrox rigged asset not installed yet; using prototype proxy.", error.message);
  });
  document.querySelector("#restart-battle").addEventListener("click", () => window.location.reload());
  const controls = new TouchControls({
    pad: document.querySelector("#move-pad"),
    knob: document.querySelector("#move-knob"),
    actions: document.querySelector(".action-zone"),
    onMove: (x, y) => arena.setMoveInput(x, y),
    onAction: (action) => combat.perform(action)
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