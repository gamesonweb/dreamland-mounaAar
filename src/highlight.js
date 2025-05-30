import { HighlightLayer, Color3 } from "@babylonjs/core";

let hlPiece = null, hlSquare = null;

export function highlightPiece(scene, mesh) {
  if (!hlPiece) hlPiece = new HighlightLayer("hlPiece", scene);
  hlPiece.removeAllMeshes();
  if (mesh) {
    hlPiece.addMesh(mesh, mesh.name.includes("blanc") ? Color3.White() : Color3.Magenta());
  }
}

export function highlightSquares(scene, meshes) {
  if (!hlSquare) hlSquare = new HighlightLayer("hlSquare", scene);
  hlSquare.removeAllMeshes();
  if (meshes && meshes.length > 0) {
    meshes.forEach(m => hlSquare.addMesh(m, Color3.Yellow()));
  }
}