import "@babylonjs/loaders";
import Game from "./game.js";
import { SoundManager } from "./soundmanager.js";

let gameInstance = null;

document.getElementById("startAdventureBtn").addEventListener("click", () => {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("colorOverlay").style.display = "flex";
});

document.getElementById("btnWhite").addEventListener("click", () => startChess("white"));
document.getElementById("btnBlack").addEventListener("click", () => startChess("black"));

async function startChess(playerColor) {
  document.getElementById("colorOverlay").style.display = "none";
  document.getElementById("renderCanvas").style.display = "block";
  document.getElementById("toggleViewBtn").style.display = "block";

  gameInstance = new Game("renderCanvas", playerColor);

  await SoundManager.init(gameInstance.scene);
}


document.getElementById("toggleViewBtn").addEventListener("click", () => {
  if (gameInstance) gameInstance.toggleTopDownView();
});

const settingsBtn      = document.getElementById("settingsBtn");
const settingsDropdown = document.getElementById("settingsDropdown");
const toggleMusic      = document.getElementById("toggleMusic");
const toggleSound      = document.getElementById("toggleSound");

toggleMusic.addEventListener("change", e => {
  SoundManager.setMusicEnabled(e.target.checked);
});
toggleSound.addEventListener("change", e => {
  SoundManager.setSoundEnabled(e.target.checked);
});

settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    settingsDropdown.classList.toggle("show");
  });
  document.addEventListener("click", (e) => {
    if (!settingsContainer.contains(e.target)) {
      settingsDropdown.classList.remove("show");
    }
  });