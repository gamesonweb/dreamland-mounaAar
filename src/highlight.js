let hlPiece = null, hlSquare = null;

function highlightPiece(scene, mesh) {
  if (!hlPiece) hlPiece = new BABYLON.HighlightLayer("hlPiece", scene);
  hlPiece.removeAllMeshes();
  if (mesh) {
    hlPiece.addMesh(mesh, mesh.name.includes("blanc") ? BABYLON.Color3.White() : BABYLON.Color3.Magenta());
  }
}

function highlightSquares(scene, meshes) {
  if (!hlSquare) hlSquare = new BABYLON.HighlightLayer("hlSquare", scene);
  hlSquare.removeAllMeshes();
  if (meshes && meshes.length > 0) {
    meshes.forEach(m => hlSquare.addMesh(m, BABYLON.Color3.Yellow()));
  }
}