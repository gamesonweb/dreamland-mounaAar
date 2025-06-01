import { ActionManager, ExecuteCodeAction } from "@babylonjs/core";
import { MovmentManager } from "./movment.js";


export function registerBoardClicks(scene, casePositions) {
  Object.entries(casePositions).forEach(([caseName, position]) => {
    const square = scene.getMeshByName(caseName);
    if (!square) return;
    square.isPickable = true;
    square.actionManager = new ActionManager(scene);
    square.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnPickTrigger,
        () => MovmentManager.movePieceTo(position)
      )
    );
  });
}