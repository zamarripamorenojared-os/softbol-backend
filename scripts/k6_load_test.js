/**
 * ============================================================================
 * SUITE DE PRUEBAS DE CARGA MASIVA, ESTRÉS Y RENDIMIENTO CON k6 (ENTREGABLE 5.2)
 * ============================================================================
 * Proyecto: SoftbolApp – Gestión de Ligas de Softbol
 * Repositorio: DesarrolloBackend-2026-402/23124369
 * Evaluación Bimodal Institucional · Universidad Autónoma de Sinaloa
 * Profesor Titular: Dr. Herman Geovany Ayala Zúñiga
 * ============================================================================
 * 
 * EJECUCIÓN:
 *   k6 run scripts/k6_load_test.js
 *   k6 run --out json=reports/k6_summary.json scripts/k6_load_test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 20 },  // 1. Calentamiento (Ramp-up a 20 VUs)
    { duration: '30s', target: 100 }, // 2. Carga sostenida (100 VUs concurrentes)
    { duration: '10s', target: 250 }, // 3. Pico de estrés súbito (Spike Test a 250 VUs)
    { duration: '15s', target: 0 },   // 4. Enfriamiento (Ramp-down)
  ],
  thresholds: {
    // RNF: 95% de las peticiones deben resolverse en menos de 200 ms
    http_req_duration: ['p(95)<200'],
    // RNF: Tasa de error menor al 1% bajo carga
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({
      email: 'admin@softbol.uas.edu.mx',
      password: 'PasswordSeguro123!'
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  let token = '';
  if (loginRes.status === 200) {
    const body = loginRes.json();
    token = body.token || (body.data && body.data.token) || '';
  }

  // Si no responde token o se corre aislado, proveemos payload de autenticación Bearer
  if (!token) {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.k6mock';
  }

  return { token };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data && data.token ? data.token : 'test-token'}`
  };

  // 1. Consulta Health / Disponibilidad
  const resHealth = http.get(`${BASE_URL}/api/v1/health`, { headers });
  check(resHealth, {
    'Health Check responde 200': (r) => r.status === 200,
    'Health Check latencia < 50ms': (r) => r.timings.duration < 50,
  });

  // 2. Consulta de Catálogo con Caché Redis (Lectura Intensiva)
  const resCatalogo = http.get(`${BASE_URL}/api/v1/torneosoftboles?page=1&limit=20`, { headers });
  check(resCatalogo, {
    'Catálogo TorneoSoftbol responde 200': (r) => r.status === 200,
    'Catálogo TorneoSoftbol latencia < 150ms': (r) => r.timings.duration < 150,
  });

  // 3. Búsqueda Avanzada con Filtros (Validación de Índices B-Tree)
  const resBusqueda = http.get(`${BASE_URL}/api/v1/torneosoftboles?busqueda=test&estado=activo&limit=10`, { headers });
  check(resBusqueda, {
    'Búsqueda TorneoSoftbol responde código válido 200': (r) => r.status === 200,
  });

  // Pausa realista entre acciones de usuario
  sleep(1);
}
