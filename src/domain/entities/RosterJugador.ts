export class RosterJugador {
  constructor(
    public readonly id: string,
    public nombre: string,
    public equipoId: string,
    public numeroDorsal: number = 0,
    public posicion: string = 'Outfielder'
  ) {}
}
