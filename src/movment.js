export const MovmentManager = {
  selectedPiece: null,

  selectPiece(mesh) {
    this.selectedPiece = mesh;
  },

  movePieceTo(targetPosition) {
    if (!this.selectedPiece) return;
    this.selectedPiece.position.copyFrom(targetPosition);
    this.selectedPiece = null;
  }
};
