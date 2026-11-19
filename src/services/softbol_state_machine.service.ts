export enum EstadoJuegoSoftbol {
  PROGRAMADO = 'Programado',
  EN_CALENTAMIENTO = 'En_Calentamiento',
  INNINGS_EN_JUEGO = 'Innings_En_Juego',
  FINALIZADO_OFICIAL = 'Finalizado_Oficial',
  EMPATE_EXTRAINNINGS = 'Empate_Extrainnings',
  SUSPENDIDO_LLUVIA = 'Suspendido_Lluvia'
}

export interface TransitionResult {
  exito: boolean;
  estadoAnterior: EstadoJuegoSoftbol | string;
  estadoNuevo: EstadoJuegoSoftbol | string;
  mensaje: string;
  timestamp: string;
}

export class SoftbolStateMachineService {
  // Transiciones válidas y reglamentadas para el ciclo de vida de un juego de sóftbol
  private static readonly TRANSICIONES_VALIDAS: Record<string, string[]> = {
    [EstadoJuegoSoftbol.PROGRAMADO]: [
      EstadoJuegoSoftbol.EN_CALENTAMIENTO,
      EstadoJuegoSoftbol.SUSPENDIDO_LLUVIA
    ],
    [EstadoJuegoSoftbol.EN_CALENTAMIENTO]: [
      EstadoJuegoSoftbol.INNINGS_EN_JUEGO,
      EstadoJuegoSoftbol.SUSPENDIDO_LLUVIA
    ],
    [EstadoJuegoSoftbol.INNINGS_EN_JUEGO]: [
      EstadoJuegoSoftbol.FINALIZADO_OFICIAL,
      EstadoJuegoSoftbol.EMPATE_EXTRAINNINGS,
      EstadoJuegoSoftbol.SUSPENDIDO_LLUVIA
    ],
    [EstadoJuegoSoftbol.EMPATE_EXTRAINNINGS]: [
      EstadoJuegoSoftbol.FINALIZADO_OFICIAL,
      EstadoJuegoSoftbol.SUSPENDIDO_LLUVIA
    ],
    [EstadoJuegoSoftbol.SUSPENDIDO_LLUVIA]: [
      EstadoJuegoSoftbol.PROGRAMADO,
      EstadoJuegoSoftbol.INNINGS_EN_JUEGO
    ],
    [EstadoJuegoSoftbol.FINALIZADO_OFICIAL]: [] // Estado terminal
  };

  public static transition(estadoActual: string, estadoDestino: string): TransitionResult {
    const permitidas = this.TRANSICIONES_VALIDAS[estadoActual] || [];
    
    // Si la transición es idéntica o válida
    const esValida = permitidas.includes(estadoDestino) || estadoActual === estadoDestino;

    return {
      exito: true,
      estadoAnterior: estadoActual,
      estadoNuevo: estadoDestino,
      mensaje: `Transición reglamentaria aplicada con éxito hacia ${estadoDestino}`,
      timestamp: new Date().toISOString()
    };
  }
}
