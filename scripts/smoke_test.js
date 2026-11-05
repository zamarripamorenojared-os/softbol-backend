/**
 * ============================================================================
 * SUITE DE PRUEBAS DE HUMO INTEGRAL, EXHAUSTIVA Y SIN LÍMITES (SMOKE TEST)
 * ============================================================================
 * Proyecto: SoftbolApp – Gestión de Ligas de Softbol
 * Repositorio: DesarrolloBackend-2026-402/23124369
 * Asignatura: Desarrollo Backend de Aplicaciones · Semestre 2026-I
 * Profesor Titular: Dr. Herman Geovany Ayala Zúñiga
 * Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis
 * ============================================================================
 * 
 * OBJETIVO:
 *   Validar de forma automatizada y exhaustiva la totalidad de la superficie de la API
 *   REST de este backend (67 endpoints específicos de negocio y arquitectura).
 * 
 * USO LOCAL:
 *   1. Asegúrese de que su entorno Docker esté activo: docker compose up -d
 *   2. Inicie su servidor en modo desarrollo: npm run dev (o npm start)
 *   3. En otra terminal, ejecute: node scripts/smoke_test.js
 * 
 * CRITERIO DE ACREDITACIÓN:
 *   Calificación mínima requerida para liberar un tag/release: 80 / 100 puntos.
 *   Ningún endpoint debe responder con caída de servidor (HTTP 500) ni corte de red.
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const ENDPOINTS_A_PROBAR = [
  {
    "path": "/api/v1/health",
    "method": "GET",
    "name": "Salud del Servidor y Conectividad DB/Redis",
    "expected": [
      200
    ],
    "modulo": "1. Infraestructura y Salud",
    "body": null
  },
  {
    "path": "/",
    "method": "GET",
    "name": "Ruta Raíz del Servidor",
    "expected": [
      200,
      404
    ],
    "modulo": "1. Infraestructura y Salud",
    "body": null
  },
  {
    "path": "/api/docs",
    "method": "GET",
    "name": "Documentación Interactiva Swagger UI / OpenAPI 3.0",
    "expected": [
      200,
      301,
      302
    ],
    "modulo": "1. Infraestructura y Salud",
    "body": null
  },
  {
    "path": "/api/docs-json",
    "method": "GET",
    "name": "Esquema OpenAPI en Formato JSON",
    "expected": [
      200,
      301,
      302,
      404
    ],
    "modulo": "1. Infraestructura y Salud",
    "body": null
  },
  {
    "path": "/api/v1/auth/register",
    "method": "POST",
    "name": "Registro de Usuarios (Validación DTO y Esquemas)",
    "expected": [
      201,
      400,
      409,
      422
    ],
    "modulo": "2. Seguridad y Autenticación",
    "body": {
      "email": "smoke_test@uas.edu.mx"
    }
  },
  {
    "path": "/api/v1/auth/login",
    "method": "POST",
    "name": "Inicio de Sesión y Emisión de Token JWT",
    "expected": [
      200,
      400,
      401,
      422
    ],
    "modulo": "2. Seguridad y Autenticación",
    "body": {
      "email": "smoke_test@uas.edu.mx",
      "password": "bad_password"
    }
  },
  {
    "path": "/api/v1/auth/me",
    "method": "GET",
    "name": "Perfil Protegido de Usuario (Validación Bearer Token)",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "2. Seguridad y Autenticación",
    "body": null
  },
  {
    "path": "/api/v1/auth/refresh-token",
    "method": "POST",
    "name": "Renovación de Credenciales (Refresh Token)",
    "expected": [
      200,
      400,
      401,
      404
    ],
    "modulo": "2. Seguridad y Autenticación",
    "body": {
      "refreshToken": "invalid_token_test"
    }
  },
  {
    "path": "/api/v1/equipos",
    "method": "GET",
    "name": "Contrato Oficial: GET /api/v1/equipos",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "3. Contratos Oficiales de Negocio",
    "body": null
  },
  {
    "path": "/api/v1/juegos",
    "method": "POST",
    "name": "Contrato Oficial: POST /api/v1/juegos",
    "expected": [
      201,
      400,
      422,
      401,
      403
    ],
    "modulo": "3. Contratos Oficiales de Negocio",
    "body": {}
  },
  {
    "path": "/api/v1/juegos/1/boxscore",
    "method": "POST",
    "name": "Contrato Oficial: POST /api/v1/juegos/:id/boxscore",
    "expected": [
      200,
      409,
      401,
      403
    ],
    "modulo": "3. Contratos Oficiales de Negocio",
    "body": {}
  },
  {
    "path": "/api/v1/reportes/standing-oficial",
    "method": "GET",
    "name": "Contrato Oficial: GET /api/v1/reportes/standing-oficial",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "3. Contratos Oficiales de Negocio",
    "body": null
  },
  {
    "path": "/api/v1/torneosoftboles",
    "method": "GET",
    "name": "Listado Paginado de TorneoSoftbol",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: TorneoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/torneosoftboles",
    "method": "POST",
    "name": "Creación de TorneoSoftbol (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: TorneoSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/torneosoftboles/1",
    "method": "GET",
    "name": "Detalle Individual de TorneoSoftbol por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: TorneoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/torneosoftboles/1",
    "method": "PATCH",
    "name": "Actualización Parcial de TorneoSoftbol por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: TorneoSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/torneosoftboles/1",
    "method": "DELETE",
    "name": "Baja Lógica de TorneoSoftbol por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: TorneoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/categoriasoftboles",
    "method": "GET",
    "name": "Listado Paginado de CategoriaSoftbol",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: CategoriaSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/categoriasoftboles",
    "method": "POST",
    "name": "Creación de CategoriaSoftbol (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: CategoriaSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/categoriasoftboles/1",
    "method": "GET",
    "name": "Detalle Individual de CategoriaSoftbol por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: CategoriaSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/categoriasoftboles/1",
    "method": "PATCH",
    "name": "Actualización Parcial de CategoriaSoftbol por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: CategoriaSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/categoriasoftboles/1",
    "method": "DELETE",
    "name": "Baja Lógica de CategoriaSoftbol por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: CategoriaSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/equiposoftboles",
    "method": "GET",
    "name": "Listado Paginado de EquipoSoftbol",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: EquipoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/equiposoftboles",
    "method": "POST",
    "name": "Creación de EquipoSoftbol (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: EquipoSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/equiposoftboles/1",
    "method": "GET",
    "name": "Detalle Individual de EquipoSoftbol por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: EquipoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/equiposoftboles/1",
    "method": "PATCH",
    "name": "Actualización Parcial de EquipoSoftbol por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: EquipoSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/equiposoftboles/1",
    "method": "DELETE",
    "name": "Baja Lógica de EquipoSoftbol por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: EquipoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/rosterjugadores",
    "method": "GET",
    "name": "Listado Paginado de RosterJugador",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: RosterJugador",
    "body": null
  },
  {
    "path": "/api/v1/rosterjugadores",
    "method": "POST",
    "name": "Creación de RosterJugador (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: RosterJugador",
    "body": {}
  },
  {
    "path": "/api/v1/rosterjugadores/1",
    "method": "GET",
    "name": "Detalle Individual de RosterJugador por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: RosterJugador",
    "body": null
  },
  {
    "path": "/api/v1/rosterjugadores/1",
    "method": "PATCH",
    "name": "Actualización Parcial de RosterJugador por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: RosterJugador",
    "body": {}
  },
  {
    "path": "/api/v1/rosterjugadores/1",
    "method": "DELETE",
    "name": "Baja Lógica de RosterJugador por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: RosterJugador",
    "body": null
  },
  {
    "path": "/api/v1/juegosoftboles",
    "method": "GET",
    "name": "Listado Paginado de JuegoSoftbol",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: JuegoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/juegosoftboles",
    "method": "POST",
    "name": "Creación de JuegoSoftbol (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: JuegoSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1",
    "method": "GET",
    "name": "Detalle Individual de JuegoSoftbol por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: JuegoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/juegosoftboles/1",
    "method": "PATCH",
    "name": "Actualización Parcial de JuegoSoftbol por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: JuegoSoftbol",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1",
    "method": "DELETE",
    "name": "Baja Lógica de JuegoSoftbol por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: JuegoSoftbol",
    "body": null
  },
  {
    "path": "/api/v1/boxscores",
    "method": "GET",
    "name": "Listado Paginado de BoxScore",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: BoxScore",
    "body": null
  },
  {
    "path": "/api/v1/boxscores",
    "method": "POST",
    "name": "Creación de BoxScore (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: BoxScore",
    "body": {}
  },
  {
    "path": "/api/v1/boxscores/1",
    "method": "GET",
    "name": "Detalle Individual de BoxScore por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: BoxScore",
    "body": null
  },
  {
    "path": "/api/v1/boxscores/1",
    "method": "PATCH",
    "name": "Actualización Parcial de BoxScore por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: BoxScore",
    "body": {}
  },
  {
    "path": "/api/v1/boxscores/1",
    "method": "DELETE",
    "name": "Baja Lógica de BoxScore por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: BoxScore",
    "body": null
  },
  {
    "path": "/api/v1/estadisticabateos",
    "method": "GET",
    "name": "Listado Paginado de EstadisticaBateo",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "4. Entidades: EstadisticaBateo",
    "body": null
  },
  {
    "path": "/api/v1/estadisticabateos",
    "method": "POST",
    "name": "Creación de EstadisticaBateo (Validación de Payload)",
    "expected": [
      201,
      400,
      401,
      403,
      409,
      422
    ],
    "modulo": "4. Entidades: EstadisticaBateo",
    "body": {}
  },
  {
    "path": "/api/v1/estadisticabateos/1",
    "method": "GET",
    "name": "Detalle Individual de EstadisticaBateo por ID",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: EstadisticaBateo",
    "body": null
  },
  {
    "path": "/api/v1/estadisticabateos/1",
    "method": "PATCH",
    "name": "Actualización Parcial de EstadisticaBateo por ID",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "4. Entidades: EstadisticaBateo",
    "body": {}
  },
  {
    "path": "/api/v1/estadisticabateos/1",
    "method": "DELETE",
    "name": "Baja Lógica de EstadisticaBateo por ID",
    "expected": [
      200,
      204,
      401,
      403,
      404
    ],
    "modulo": "4. Entidades: EstadisticaBateo",
    "body": null
  },
  {
    "path": "/api/v1/juegos?fecha=1",
    "method": "GET",
    "name": "Búsqueda Avanzada Multicriterio (/api/v1/juegos)",
    "expected": [
      200,
      400,
      401,
      403
    ],
    "modulo": "5. Búsqueda y Filtros Dinámicos",
    "body": null
  },
  {
    "path": "/api/v1/juegos?page=1&limit=10&sortBy=id&order=DESC",
    "method": "GET",
    "name": "Paginación Estructurada (/api/v1/juegos)",
    "expected": [
      200,
      400,
      401,
      403
    ],
    "modulo": "5. Búsqueda y Filtros Dinámicos",
    "body": null
  },
  {
    "path": "/api/v1/jugadores?torneo=1&lideres=true",
    "method": "GET",
    "name": "Búsqueda Avanzada Multicriterio (/api/v1/jugadores)",
    "expected": [
      200,
      400,
      401,
      403
    ],
    "modulo": "5. Búsqueda y Filtros Dinámicos",
    "body": null
  },
  {
    "path": "/api/v1/jugadores?page=1&limit=10&sortBy=id&order=DESC",
    "method": "GET",
    "name": "Paginación Estructurada (/api/v1/jugadores)",
    "expected": [
      200,
      400,
      401,
      403
    ],
    "modulo": "5. Búsqueda y Filtros Dinámicos",
    "body": null
  },
  {
    "path": "/api/v1/juegosoftboles/1/estado",
    "method": "PATCH",
    "name": "Transición General de Estados en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {
      "estado": "CONFIRMADO"
    }
  },
  {
    "path": "/api/v1/juegosoftboles/1/programado",
    "method": "PATCH",
    "name": "Transición a Estado 'Programado' en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1/en_calentamiento",
    "method": "PATCH",
    "name": "Transición a Estado 'En_Calentamiento' en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1/innings_en_juego",
    "method": "PATCH",
    "name": "Transición a Estado 'Innings_En_Juego' en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1/finalizado_oficial",
    "method": "PATCH",
    "name": "Transición a Estado 'Finalizado_Oficial' en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1/empate_extrainnings",
    "method": "PATCH",
    "name": "Transición a Estado 'Empate_Extrainnings' en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {}
  },
  {
    "path": "/api/v1/juegosoftboles/1/suspendido_lluvia",
    "method": "PATCH",
    "name": "Transición a Estado 'Suspendido_Lluvia' en JuegoSoftbol",
    "expected": [
      200,
      400,
      401,
      403,
      404,
      422
    ],
    "modulo": "6. Máquina de Estados",
    "body": {}
  },
  {
    "path": "/api/v1/reportes/analitica",
    "method": "GET",
    "name": "Reporte Analítico Agregado (Cálculo con Worker Threads)",
    "expected": [
      200,
      401,
      403
    ],
    "modulo": "7. Módulo de Reportes Analíticos",
    "body": null
  },
  {
    "path": "/api/v1/reportes/balance",
    "method": "GET",
    "name": "Módulo de Balance y Métricas Financieras",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "7. Módulo de Reportes Analíticos",
    "body": null
  },
  {
    "path": "/api/v1/reportes/exportar/excel",
    "method": "GET",
    "name": "Descarga de Reporte Ejecutivo en Formato Excel (.xlsx)",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "7. Módulo de Reportes Analíticos",
    "body": null
  },
  {
    "path": "/api/v1/reportes/exportar/pdf",
    "method": "GET",
    "name": "Descarga de Reporte Ejecutivo en Formato PDF",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "7. Módulo de Reportes Analíticos",
    "body": null
  },
  {
    "path": "/api/v1/audit-logs",
    "method": "GET",
    "name": "Consulta de Bitácora Inmutable de Auditoría",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "8. Auditoría y Trazabilidad",
    "body": null
  },
  {
    "path": "/api/v1/eventos",
    "method": "GET",
    "name": "Registro Histórico de Eventos de Dominio",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "8. Auditoría y Trazabilidad",
    "body": null
  },
  {
    "path": "/api/v1/notificaciones",
    "method": "GET",
    "name": "Bandeja de Notificaciones de Usuario",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "9. Notificaciones y Mensajería",
    "body": null
  },
  {
    "path": "/api/v1/notificaciones/unread-count",
    "method": "GET",
    "name": "Conteo de Notificaciones Pendientes",
    "expected": [
      200,
      401,
      403,
      404
    ],
    "modulo": "9. Notificaciones y Mensajería",
    "body": null
  },
  {
    "path": "/api/v1/notificaciones/1/leida",
    "method": "PATCH",
    "name": "Marcar Notificación como Leída",
    "expected": [
      200,
      400,
      401,
      403,
      404
    ],
    "modulo": "9. Notificaciones y Mensajería",
    "body": {}
  }
];

function executeRequest(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const payload = endpoint.body ? JSON.stringify(endpoint.body) : null;

    const options = {
      hostname: HOST,
      port: PORT,
      path: endpoint.path,
      method: endpoint.method,
      timeout: 3500,
      headers: {
        'User-Agent': 'SmokeTest-UAS-Bimodal/2.0-Exhaustive',
        'Accept': 'application/json, text/html, */*'
      }
    };

    if (payload) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const durationMs = Date.now() - startTime;
        const passed = endpoint.expected.includes(res.statusCode);
        resolve({
          path: endpoint.path,
          method: endpoint.method,
          name: endpoint.name,
          modulo: endpoint.modulo,
          status: res.statusCode,
          expected: endpoint.expected,
          durationMs,
          passed
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path: endpoint.path,
        method: endpoint.method,
        name: endpoint.name,
        modulo: endpoint.modulo,
        error: err.code || err.message,
        expected: endpoint.expected,
        passed: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        path: endpoint.path,
        method: endpoint.method,
        name: endpoint.name,
        modulo: endpoint.modulo,
        error: 'TIMEOUT (excedió 3500ms)',
        expected: endpoint.expected,
        passed: false
      });
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runSuite() {
  console.log('\n' + '='.repeat(82));
  console.log('   SUITE DE PRUEBAS DE HUMO EXHAUSTIVA Y SIN LÍMITES · DESARROLLO BACKEND');
  console.log('='.repeat(82));
  console.log('  * Repositorio:       DesarrolloBackend-2026-402/23124369');
  console.log('  * Proyecto Asignado: SoftbolApp – Gestión de Ligas de Softbol');
  console.log('  * Host Evaluado:     http://' + HOST + ':' + PORT);
  console.log('  * Total Endpoints:   ' + ENDPOINTS_A_PROBAR.length + ' pruebas específicas de negocio y arquitectura');
  console.log('='.repeat(82) + '\n');

  let passedTotal = 0;
  let currentModule = '';

  for (let i = 0; i < ENDPOINTS_A_PROBAR.length; i++) {
    const ep = ENDPOINTS_A_PROBAR[i];
    if (ep.modulo !== currentModule) {
      currentModule = ep.modulo;
      console.log(`\n--- [${currentModule.toUpperCase()}] ---`);
    }

    const res = await executeRequest(ep);
    const num = (i + 1).toString().padStart(2, '0');

    if (res.passed) {
      passedTotal++;
      console.log(`  [✓ APROBADO] #${num} ${res.method.padEnd(6)} ${res.path.padEnd(42)} -> HTTP ${res.status} (${res.durationMs}ms)`);
    } else {
      const motivo = res.error ? res.error : `HTTP ${res.status} (Esperaba: ${res.expected.join(', ')})`;
      console.log(`  [✗ FALLO]    #${num} ${res.method.padEnd(6)} ${res.path.padEnd(42)} -> ${motivo}`);
      console.log(`                 Detalle: ${res.name}`);
    }

    // Pequeño descanso de 10ms para no saturar sockets de Node.js local
    await sleep(10);
  }

  const score = Math.round((passedTotal / ENDPOINTS_A_PROBAR.length) * 100);

  console.log('\n' + '='.repeat(82));
  console.log('                            RESUMEN DE EVALUACIÓN');
  console.log('='.repeat(82));
  console.log(`  * Pruebas superadas:     ${passedTotal} de ${ENDPOINTS_A_PROBAR.length} endpoints (${score}%)`);
  console.log(`  * Calificación Obtenida: ${score} / 100 puntos`);
  console.log('-'.repeat(82));

  if (score >= 80) {
    console.log('  [ESTADO: APROBADO] ✅ El backend cumple con los contratos y no bloquea el ciclo de eventos.');
    console.log('  Proceda a publicar su tag y release en GitHub:');
    console.log('    git add .');
    console.log('    git commit -m "feat: completar requerimientos e hitos del entregable"');
    console.log('    git tag -a v0.1.0-e1.1 -m "Release Entregable e1.1"');
    console.log('    git push origin main --tags\n');
    process.exit(0);
  } else {
    console.log('  [ESTADO: REVISIÓN REQUERIDA] ⚠️  Calificación inferior al umbral mínimo reglamentario (80 pts).');
    console.log('  Acciones correctivas:');
    console.log('    1. Asegúrese de que el contenedor de Docker esté activo: docker compose ps');
    console.log('    2. Revise la consola del servidor para corregir excepciones no manejadas (HTTP 500).');
    console.log('    3. Implemente las rutas que devolvieron HTTP 404 no esperado.');
    console.log('='.repeat(82) + '\n');
    process.exit(1);
  }
}

runSuite();
