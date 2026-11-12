export class CategoriaSoftbol {
  constructor(
    public readonly id: string,
    public nombre: string,
    public genero: string = 'Libre',
    public limiteEdad: number = 0
  ) {}
}
