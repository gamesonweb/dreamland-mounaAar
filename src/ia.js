import { getBestMove } from "./iaEngine.js"; 

export function playAI(scene, casePositions) {
  const mv = getBestMove();
  if (!mv) return;
  const { pieceName, to } = mv;
  const mesh = scene.getMeshByName(pieceName);
  const key  = to.toLowerCase();
  if (mesh && casePositions[key]) {
    mesh.position = casePositions[key].clone();
    mesh.name     = `${pieceName.split("-")[0]}-${pieceName.split("-")[1]}-${to}`;
  }
}