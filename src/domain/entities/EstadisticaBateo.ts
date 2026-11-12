export class EstadisticaBateo {
  constructor(
    public readonly id: string,
    public juegoId: string,
    public jugadorId: string,
    public turnosAlBate: number = 0,
    public hits: number = 0,
    public carrerasAnotadas: number = 0,
    public carrerasImpulsadas: number = 0,
    public homeruns: number = 0
  ) {}
}
