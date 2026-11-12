export class BoxScore {
  constructor(
    public readonly id: string,
    public juegoId: string,
    public carrerasLocal: number = 0,
    public carrerasVisitante: number = 0,
    public hitsLocal: number = 0,
    public hitsVisitante: number = 0,
    public erroresLocal: number = 0,
    public erroresVisitante: number = 0
  ) {}
}
