import "./style.css";
import { Arena } from "./game/arena.js";
import { TouchControls } from "./game/controls.js";
import { CombatSystem } from "./game/combat.js";

const errorPanel = document.querySelector("#startup-error");
try {
  const arena = new Arena(document.querySelector("#world"));
  const combat = new CombatSystem(arena);
  document.querySelector("#restart-battle").addEventListener("click", () => window.location.reload());
  const controls = new TouchControls({
    pad: document.querySelector("#move-pad"),
    knob: document.querySelector("#move-knob"),
    actions: document.querySelector(".action-zone"),
    onMove: (x, y) => arena.setMoveInput(x, y),
    onAction: (action) => combat.perform(action)
  });
  arena.onFrame((dt, time) => combat.update(dt, time));
  arena.start();
  window.addEventListener("pagehide", () => {
    controls.destroy();
    arena.destroy();
  }, { once: true });
} catch (error) {
  console.error(error);
  errorPanel.hidden = false;
  errorPanel.textContent = "THE ARENA COULD NOT INITIALIZE\n" + (error?.message || String(error));
}