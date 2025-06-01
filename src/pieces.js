import { SceneLoader, Vector3 } from "@babylonjs/core";

const initialPlacementMap = {
  "roi-blanc": ["e1"],
  "reine-blanc": ["d1"],
  "tour-blanc": ["a1", "h1"],
  "fou-blanc": ["c1", "f1"],
  "cavalier-blanc": ["b1", "g1"],
  "pion-blanc": ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  "roi-noir": ["e8"],
  "reine-noir": ["d8"],
  "tour-noir": ["a8", "h8"],
  "fou-noir": ["c8", "f8"],
  "cavalier-noir": ["b8", "g8"],
  "pion-noir": ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]
};
const elevatedPieces = new Set([
  "roi-blanc", "reine-blanc", "fou-blanc",
  "roi-noir", "reine-noir", "fou-noir"
]);

export function loadPieces(scene, casePositions, shadowGen) {
  SceneLoader.ImportMesh("", "./public/assets/models/", "./pieces.glb", scene, meshes => {
    meshes.forEach(m => {
      m.isVisible = false;
      m.isPickable = false;
    });

    Object.entries(initialPlacementMap).forEach(([meshName, squares]) => {
      const proto = meshes.find(m => m.name === meshName);
      if (!proto) {
        console.warn(`Prototype manquant : ${meshName}`);
        return;
      }
      const bb = proto.getBoundingInfo().boundingBox;
      const halfHeight = elevatedPieces.has(meshName) ? bb.extendSizeWorld.y : 0;

      squares.forEach(square => {
        const key = square;
        const center = casePositions[key];
        if (!center) {
          console.warn(`Pas de position pour ${square}`);
          return;
        }
        const clone = proto.clone(`${meshName}-${square}`);
        clone.isVisible = true;
        clone.isPickable = true;
        clone.position = new Vector3(
          center.x +2,
          center.y + halfHeight,
          center.z +0.5
        );
        console.log(`Pièce ${clone.name} placée à ${square} (x:${center.x}, y:${center.y}, z:${center.z})`);
        shadowGen.addShadowCaster(clone, true);
      });
    });
  });
}