export class TorneoSoftbol {
  constructor(
    public readonly id: string,
    public nombre: string,
    public temporada: string,
    public fechaInicio?: Date,
    public fechaFin?: Date,
    public estado: string = 'Activo'
  ) {}
}

export class CategoriaSoftbol {
  constructor(
    public readonly id: string,
    public nombre: string,
    public genero: string = 'Libre',
    public limiteEdad: number = 0
  ) {}
}

export class EquipoSoftbol {
  constructor(
    public readonly id: string,
    public nombre: string,
    public torneoId: string,
    public abreviatura?: string,
    public categoriaId?: string,
    public logoUrl?: string
  ) {}
}

export class RosterJugador {
  constructor(
    public readonly id: string,
    public nombre: string,
    public equipoId: string,
    public numeroDorsal: number = 0,
    public posicion: string = 'Outfielder'
  ) {}
}

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

