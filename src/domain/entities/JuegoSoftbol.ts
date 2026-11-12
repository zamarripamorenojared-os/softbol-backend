export class JuegoSoftbol {
  constructor(
    public readonly id: string,
    public torneoId: string,
    public equipoLocalId: string,
    public equipoVisitanteId: string,
    public fechaJuego: Date,
    public campo: string = 'Campo Principal UAS',
    public estado: string = 'Programado'
  ) {}
}
