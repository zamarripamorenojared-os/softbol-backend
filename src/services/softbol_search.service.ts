import { Request, Response, NextFunction } from 'express';
import { CacheUtil } from '../utils/cache_util';

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Estructura de datos en memoria para SoftbolApp (con fallback dinámico y soporte de filtros)
const MOCK_JUEGOS = [
  { id: '1', torneo_id: '1', local: 'Tomateros Softbol', visitante: 'Venados Softbol', fecha_juego: '2026-11-12T19:00:00Z', campo: 'Campo 1 UAS', estado: 'Programado' },
  { id: '2', torneo_id: '1', local: 'Águilas UAS', visitante: 'Cañeros Softbol', fecha_juego: '2026-11-12T21:00:00Z', campo: 'Campo 2 UAS', estado: 'Programado' },
  { id: '3', torneo_id: '2', local: 'Yaquis Softbol', visitante: 'Mayos Softbol', fecha_juego: '2026-11-13T18:00:00Z', campo: 'Campo 1 UAS', estado: 'Programado' },
  { id: '4', torneo_id: '1', local: 'Naranjeros Softbol', visitante: 'Charros Softbol', fecha_juego: '2026-11-14T19:00:00Z', campo: 'Estadio Central', estado: 'Programado' },
  { id: '5', torneo_id: '2', local: 'Sultanes Softbol', visitante: 'Algodoneros Softbol', fecha_juego: '2026-11-15T16:00:00Z', campo: 'Campo 3 UAS', estado: 'Programado' }
];

const MOCK_JUGADORES = [
  { id: '1', nombre: 'Jared Zamarripa', equipo_id: '1', torneo_id: '1', posicion: 'Shortstop', avg: 0.450, hr: 8, rbi: 24, lider: true },
  { id: '2', nombre: 'Carlos Mendoza', equipo_id: '1', torneo_id: '1', posicion: 'Pitcher', avg: 0.380, hr: 4, rbi: 18, lider: true },
  { id: '3', nombre: 'Luis Fernando Soto', equipo_id: '2', torneo_id: '1', posicion: 'Catcher', avg: 0.410, hr: 6, rbi: 21, lider: true },
  { id: '4', nombre: 'Martín Beltrán', equipo_id: '2', torneo_id: '2', posicion: 'First Base', avg: 0.310, hr: 2, rbi: 10, lider: false },
  { id: '5', nombre: 'David López', equipo_id: '3', torneo_id: '2', posicion: 'Center Field', avg: 0.295, hr: 1, rbi: 8, lider: false }
];

export class SoftbolSearchService {
  /**
   * Búsqueda avanzada y paginación para Juegos con Caché Redis (TTL 60s)
   */
  public static async searchJuegos(query: any): Promise<PaginatedResult<any>> {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.max(1, parseInt(query.limit as string) || 10);
    const sortBy = (query.sortBy as string) || 'id';
    const order = (query.order as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const fecha = query.fecha;

    const cacheKey = `juegos:p${page}_l${limit}_${sortBy}_${order}_f${fecha || 'all'}`;
    const cached = await CacheUtil.get('SoftbolCache', cacheKey);
    if (cached) {
      return cached;
    }

    let items = [...MOCK_JUEGOS];
    if (fecha) {
      items = items.filter(j => j.id === fecha || j.fecha_juego.includes(fecha.toString()));
    }

    // Ordenamiento dinámico
    items.sort((a: any, b: any) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      return order === 'DESC' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedItems = items.slice((page - 1) * limit, page * limit);

    const result: PaginatedResult<any> = {
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    // Guardar en caché LRU
    await CacheUtil.set('SoftbolCache', cacheKey, result);
    return result;
  }

  /**
   * Búsqueda avanzada y paginación para Jugadores (lideres, torneo) con Caché Redis
   */
  public static async searchJugadores(query: any): Promise<PaginatedResult<any>> {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.max(1, parseInt(query.limit as string) || 10);
    const sortBy = (query.sortBy as string) || 'id';
    const order = (query.order as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const torneo = query.torneo;
    const lideres = query.lideres === 'true' || query.lideres === true;

    const cacheKey = `jugadores:p${page}_l${limit}_${sortBy}_${order}_t${torneo || 'all'}_l${lideres}`;
    const cached = await CacheUtil.get('SoftbolCache', cacheKey);
    if (cached) {
      return cached;
    }

    let items = [...MOCK_JUGADORES];
    if (torneo) {
      items = items.filter(j => j.torneo_id === torneo.toString());
    }
    if (lideres) {
      items = items.filter(j => j.lider === true);
    }

    // Ordenamiento dinámico
    items.sort((a: any, b: any) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      return order === 'DESC' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedItems = items.slice((page - 1) * limit, page * limit);

    const result: PaginatedResult<any> = {
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    await CacheUtil.set('SoftbolCache', cacheKey, result);
    return result;
  }
}

