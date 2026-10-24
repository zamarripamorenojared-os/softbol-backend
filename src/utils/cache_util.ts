import * as redis from 'redis';

export class CacheUtil {
  private static client: any = null;

  constructor() {
    if (!CacheUtil.client) {
      CacheUtil.client = redis.createClient();
      CacheUtil.client.on('error', (err: any) => console.error('Error de Cliente Redis:', err));
      CacheUtil.client.on('connect', () => console.log('Conectado exitosamente a Redis Server'));
      CacheUtil.client.connect().catch((err: any) => {
        console.error(`Error al conectar cliente Redis: ${err}`);
      });
    }
  }

  /**
   * Recupera una entidad almacenada en caché mediante RedisJSON o fallback JSON string
   */
  public static async get(cacheName: string, key: string): Promise<any | null> {
    try {
      if (!CacheUtil.client || !CacheUtil.client.isOpen) return null;
      if (CacheUtil.client.json) {
        const data = await CacheUtil.client.json.get(`${cacheName}:${key}`);
        return data;
      } else {
        const data = await CacheUtil.client.get(`${cacheName}:${key}`);
        return data ? JSON.parse(data) : null;
      }
    } catch (err) {
      console.error(`Error al obtener clave ${cacheName}:${key} de caché: ${err}`);
      return null;
    }
  }

  /**
   * Almacena una entidad en caché utilizando el namespace especificado
   */
  public static async set(cacheName: string, key: string, value: any): Promise<void> {
    try {
      if (!CacheUtil.client || !CacheUtil.client.isOpen) return;
      if (CacheUtil.client.json) {
        await CacheUtil.client.json.set(`${cacheName}:${key}`, '.', value);
      } else {
        await CacheUtil.client.set(`${cacheName}:${key}`, JSON.stringify(value));
      }
    } catch (err) {
      console.error(`Error al guardar clave ${cacheName}:${key} en caché: ${err}`);
    }
  }

  /**
   * Elimina una clave de la caché (Invalidación)
   */
  public static async remove(cacheName: string, key: string): Promise<void> {
    try {
      if (!CacheUtil.client || !CacheUtil.client.isOpen) return;
      await CacheUtil.client.del(`${cacheName}:${key}`);
    } catch (err) {
      console.error(`Error al eliminar clave ${cacheName}:${key} de caché: ${err}`);
    }
  }
}
