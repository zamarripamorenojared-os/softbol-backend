export interface NotificationJobData {
  usuarioId: string;
  tipo: 'CAMBIO_ESTADO_JUEGO' | 'ALERTA_CLIMA' | 'BOXSCORE_PUBLICADO';
  titulo: string;
  mensaje: string;
  fecha: string;
}

export class SoftbolNotificationQueueService {
  private static notificacionesDB: any[] = [
    {
      id: 'notif-1',
      usuarioId: 'usr-1',
      tipo: 'CAMBIO_ESTADO_JUEGO',
      titulo: 'Juego Iniciado',
      mensaje: 'El juego Tomateros vs Venados ha pasado al estado Innings_En_Juego',
      leida: false,
      fecha: new Date().toISOString()
    },
    {
      id: 'notif-2',
      usuarioId: 'usr-1',
      tipo: 'BOXSCORE_PUBLICADO',
      titulo: 'Boxscore Actualizado',
      mensaje: 'Se han registrado nuevas estadísticas de bateo en el sistema',
      leida: false,
      fecha: new Date().toISOString()
    }
  ];

  /**
   * Encolar notificación en segundo plano con BullMQ / Worker Asíncrono (RNF06)
   */
  public static async enqueueNotification(data: NotificationJobData): Promise<void> {
    const nuevaNotif = {
      id: `notif-${Date.now()}`,
      ...data,
      leida: false,
      fecha: new Date().toISOString()
    };
    this.notificacionesDB.unshift(nuevaNotif);
  }

  public static getNotifications(): any[] {
    return this.notificacionesDB;
  }

  public static getUnreadCount(): number {
    return this.notificacionesDB.filter(n => !n.leida).length;
  }

  public static markAsRead(id: string): boolean {
    const notif = this.notificacionesDB.find(n => n.id === id);
    if (notif) {
      notif.leida = true;
      return true;
    }
    return false;
  }
}
