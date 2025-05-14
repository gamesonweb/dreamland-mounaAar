import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { Color3 } from "@babylonjs/core/Maths/math.color";

let highlightLayer = null;

export function highlightPiece(scene, mesh) {
  if (!highlightLayer) {
    highlightLayer = new HighlightLayer("highlight", scene);
  }

  highlightLayer.removeAllMeshes();

  const color = mesh.metadata?.couleur === "blanc"
    ? Color3.White()
    : Color3.Red();

  highlightLayer.addMesh(mesh, color);
}
