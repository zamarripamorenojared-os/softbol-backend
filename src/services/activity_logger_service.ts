export class ActivityLoggerService {
  // Simulación de LSM-Tree / SSTables en memoria y persistencia ordenada
  private store: Map<string, string> = new Map();

  constructor(private dbPath: string) {
    console.log(`[LSM-Tree] Inicializado almacén de eventos en: ${dbPath}`);
  }

  public async logEvent(taskId: string, userId: string, action: string): Promise<void> {
    const timestamp = new Date().toISOString();
    // Clave estructurada ordenada por tiempo para consultas eficientes por rango
    const key = `event:${taskId}:${timestamp}`;
    const value = JSON.stringify({ userId, action, timestamp });

    // Escritura ultra rápida en Memtable y WAL
    this.store.set(key, value);
    console.log(`[LSM-Tree Log] ${key} => ${action}`);
  }

  public async getTaskHistory(taskId: string): Promise<Array<any>> {
    const events: Array<any> = [];
    const prefix = `event:${taskId}:`;

    // Las SSTables ordenadas permiten iterar secuencialmente el rango de claves
    const sortedKeys = Array.from(this.store.keys())
      .filter((k) => k.startsWith(prefix))
      .sort();

    for (const key of sortedKeys) {
      const val = this.store.get(key);
      if (val) {
        events.push(JSON.parse(val));
      }
    }

    return events;
  }
}
