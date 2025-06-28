class DettagliGrafo {
  idNodo: string;
  peso: number;
  sequenza?: number;

  constructor(idNodo: string, peso: number, sequenza?: number) {
    this.idNodo = idNodo;
    this.peso = peso;
    this.sequenza = sequenza;
  }
}

export default DettagliGrafo;
