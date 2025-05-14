import {
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  Vector3
} from "@babylonjs/core";
import { MovmentManager } from "./movment.js";

const initialPlacementMap = {
  "roi-blanc":      ["E1"],
  "reine-blanc":    ["D1"],
  "tour-blanc":     ["A1","H1"],
  "fou-blanc":      ["C1","F1"],
  "cavalier-blanc": ["B1","G1"],
  "pion-blanc":     ["A2","B2","C2","D2","E2","F2","G2","H2"],
  "roi-noir":       ["E8"],
  "reine-noir":     ["D8"],
  "tour-noir":      ["A8","H8"],
  "fou-noir":       ["C8","F8"],
  "cavalier-noir":  ["B8","G8"],
  "pion-noir":      ["A7","B7","C7","D7","E7","F7","G7","H7"]
};

const elevatedPieces = new Set([
  "roi-blanc","roi-noir",
  "reine-blanc","reine-noir",
  "fou-blanc","fou-noir"
]);


export function loadPieces(scene, casePositions, shadowGen) {
  SceneLoader.ImportMesh(
    "",
    "assets/models/",
    "pieces.glb",
    scene,
    (meshes) => {
      meshes.forEach(m => {
        m.isVisible  = false;
        m.isPickable = false;
      });

      Object.entries(initialPlacementMap).forEach(([meshName, cases]) => {
        const proto = meshes.find(m => m.name === meshName);
        if (!proto) {
          console.warn(`Prototype manquant : ${meshName}`);
          return;
        }

        const bb = proto.getBoundingInfo().boundingBox;
        const halfHeight = elevatedPieces.has(meshName)
          ? bb.extendSizeWorld.y
          : 0;

        cases.forEach(caseName => {
          const center = casePositions[caseName];
          if (!center) {
            console.warn(`Pas de position pour ${caseName}`);
            return;
          }

          const clone = proto.clone(`${meshName}-${caseName}`);
          clone.isVisible  = true;
          clone.isPickable = true;
          clone.position = new Vector3(
            center.x,
            center.y + halfHeight,
            center.z
          );

          clone.actionManager = new ActionManager(scene);
          clone.actionManager.registerAction(
            new ExecuteCodeAction(
              ActionManager.OnPickTrigger,
              () => MovmentManager.selectPiece(clone)
            )
          );

          shadowGen.addShadowCaster(clone, true);
        });
      });
    }
  );
}
