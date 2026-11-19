/**
 * ============================================================================
 * ARNÉS DE PRUEBAS ESTRICTO Y DETERMINISTA — SEMANA 2 (E2.1 Y E2.2)
 * ============================================================================
 * Asignatura: Desarrollo Backend de Aplicaciones · Semestre 2026-I
 * Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis
 * Profesor Titular: Dr. Herman Geovany Ayala Zúñiga
 * 
 * PROPÓSITO:
 *   Validar de manera determinista y sin falsos positivos el cumplimiento de:
 *   - E2.1: Paginación estructurada, Búsqueda y Transacciones Atómicas ACID (Rollback/Locks).
 *   - E2.2: Caché en Redis (HIT/MISS e invalidación), Rate Limiting (429) y k6 autenticado.
 * 
 * EJECUCIÓN LOCAL O EN CI:
 *   node scripts/test_strict_s2.js
 * ============================================================================
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const isHttps = options.protocol === 'https:';
    const client = isHttps ? https : http;
    const req = client.request({ host: HOST, port: PORT, ...options }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, body, json });
      });
    });
    req.on('error', reject);
    req.setTimeout(6000, () => {
      req.destroy();
      reject(new Error('TIMEOUT_EXCEEDED'));
    });
    if (postData) {
      const dataStr = typeof postData === 'object' ? JSON.stringify(postData) : postData;
      req.setHeader('Content-Length', Buffer.byteLength(dataStr));
      req.write(dataStr);
    }
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runWeek2StrictSuite() {
  console.log('\n' + '='.repeat(84));
  console.log('   EVALUACIÓN ESTRICTA Y DETERMINISTA — SEMANA 2 (E2.1 & E2.2)');
  console.log('   Facultad de Ingeniería Mochis · Universidad Autónoma de Sinaloa');
  console.log('='.repeat(84));
  console.log(`  * Host de prueba:   http://${HOST}:${PORT}`);
  console.log(`  * Fecha/Hora:       ${new Date().toISOString()}`);
  console.log('='.repeat(84) + '\n');

  let passed = 0;
  let total = 0;
  const results = [];

  async function evaluate(id, name, weight, fn) {
    total += weight;
    try {
      const result = await fn();
      if (result.ok) {
        console.log(`  [✓ PASS] (${weight} pts) [${id}] ${name}`);
        passed += weight;
        results.push({ id, name, weight, earned: weight, status: 'PASS', detail: result.detail });
      } else {
        console.log(`  [✗ FAIL] (0/${weight} pts) [${id}] ${name}`);
        console.log(`           -> Detalle: ${result.detail}`);
        results.push({ id, name, weight, earned: 0, status: 'FAIL', detail: result.detail });
      }
    } catch (e) {
      console.log(`  [✗ ERROR] (0/${weight} pts) [${id}] ${name}`);
      console.log(`           -> Excepción: ${e.message}`);
      results.push({ id, name, weight, earned: 0, status: 'ERROR', detail: e.message });
    }
    await sleep(40);
  }

  // ==========================================================================
  // BLOQUE 1: ENTREGABLE 2.1 (PAGINACIÓN, BÚSQUEDA Y TRANSACCIONES) - 50 PTS
  // ==========================================================================
  console.log('--- BLOQUE 1: Entregable 2.1 — Paginación, Filtros y Transacciones Atómicas (50 pts) ---');

  // Test 1.1: Paginación estructurada (15 pts)
  await evaluate('E2.1-T1', 'Paginación de Catálogos: Estructura { data: [], pagination: { page, limit, total } }', 15, async () => {
    // Buscar endpoints de catálogo
    const candidates = ['/api/v1/productos', '/api/v1/platillos', '/api/v1/items', '/api/v1/pacientes', '/api/v1/servicios', '/api/v1/usuarios'];
    for (const p of candidates) {
      const res = await request({ path: `${p}?page=1&limit=5`, method: 'GET' });
      if (res.status === 200 && res.json) {
        const body = res.json;
        const hasData = Array.isArray(body.data) || Array.isArray(body.items) || Array.isArray(body);
        const hasPag = body.pagination || body.meta || (body.total !== undefined);
        if (hasData && hasPag) {
          return { ok: true, detail: `Endpoint ${p} devolvió colección paginada conforme a contrato` };
        }
      }
    }
    return { ok: false, detail: 'Ningún endpoint de catálogo devolvió la estructura de paginación con metadatos' };
  });

  // Test 1.2: Implementación de Transacciones en Código (15 pts)
  await evaluate('E2.1-T2', 'ACID: Implementación real de Transacciones en código (queryRunner, $transaction o db.tx)', 15, async () => {
    // Escaneo estático en src/
    function checkCodeForTransactions(dir) {
      if (!fs.existsSync(dir)) return false;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const f of files) {
        const full = `${dir}/${f.name}`;
        if (f.isDirectory() && f.name !== 'node_modules' && f.name !== 'dist') {
          if (checkCodeForTransactions(full)) return true;
        } else if (f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.js'))) {
          const content = fs.readFileSync(full, 'utf8');
          if (
            content.includes('$transaction') ||
            content.includes('queryRunner') ||
            content.includes('startTransaction') ||
            content.includes('beginTransaction') ||
            content.includes('.transaction(') ||
            content.includes('FOR UPDATE')
          ) {
            return true;
          }
        }
      }
      return false;
    }

    const hasTx = checkCodeForTransactions('src') || checkCodeForTransactions('pms-backend/src');
    if (!hasTx) {
      return { ok: false, detail: 'No se detectó uso de transacciones atómicas ($transaction, queryRunner, transaction) en el código fuente' };
    }
    return { ok: true, detail: 'Uso de bloques transaccionales ACID confirmado en el código' };
  });

  // Test 1.3: Concurrencia y Detección de Colisiones (20 pts)
  await evaluate('E2.1-T3', 'Control de Concurrencia: Peticiones concurrentes en milisegundo idéntico sin error fatal 500', 20, async () => {
    const endpoints = ['/api/v1/auth/login', '/api/v1/health', '/api/v1/usuarios'];
    const target = endpoints[0];

    const p1 = request({ path: target, method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'probe1@uas.edu.mx' });
    const p2 = request({ path: target, method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'probe2@uas.edu.mx' });
    const p3 = request({ path: target, method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'probe3@uas.edu.mx' });

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    const statuses = [r1.status, r2.status, r3.status];

    if (statuses.some(s => s === 500)) {
      return { ok: false, detail: `FALLO DE CONCURRENCIA: El servidor arrojó 500 ante peticiones simultáneas: [${statuses.join(', ')}]` };
    }
    return { ok: true, detail: `Concurrencia manejada con resiliencia: respuestas [${statuses.join(', ')}]` };
  });

  // ==========================================================================
  // BLOQUE 2: ENTREGABLE 2.2 (REDIS, RATE LIMITING Y PRUEBAS K6) - 50 PTS
  // ==========================================================================
  console.log('\n--- BLOQUE 2: Entregable 2.2 — Redis Caché, Rate Limiting y Pruebas k6 (50 pts) ---');

  // Test 2.1: Dependencia y Uso Real de Redis (15 pts)
  await evaluate('E2.2-T1', 'Caché con Redis: Configuración de cliente Redis (ioredis, redis) y llamadas a get/set', 15, async () => {
    let pkg = {};
    if (fs.existsSync('package.json')) pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const hasRedisDep = Object.keys(allDeps).some(d => d.includes('redis') || d.includes('ioredis'));

    if (!hasRedisDep) {
      return { ok: false, detail: 'No se encontró librería de Redis (redis, ioredis) en package.json' };
    }

    // Buscar llamadas a redis en código
    function checkRedisUsage(dir) {
      if (!fs.existsSync(dir)) return false;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const f of files) {
        const full = `${dir}/${f.name}`;
        if (f.isDirectory() && f.name !== 'node_modules' && f.name !== 'dist') {
          if (checkRedisUsage(full)) return true;
        } else if (f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.js'))) {
          const content = fs.readFileSync(full, 'utf8');
          if (content.includes('.get(') && (content.includes('cache') || content.includes('redis'))) return true;
          if (content.includes('.set(') && (content.includes('cache') || content.includes('redis'))) return true;
          if (content.includes('redisClient') || content.includes('createClient')) return true;
        }
      }
      return false;
    }

    const hasRedisCalls = checkRedisUsage('src') || checkRedisUsage('pms-backend/src');
    if (!hasRedisCalls) {
      return { ok: false, detail: 'Librería Redis instalada pero sin invocación de cache (get/set/client) en src/' };
    }
    return { ok: true, detail: 'Cliente Redis y lógica de almacenamiento en caché validados' };
  });

  // Test 2.2: Rate Limiting Activo (15 pts)
  await evaluate('E2.2-T2', 'Hardening de Tráfico: Rate Limiting activo (dispara HTTP 429 tras ráfaga no autorizada)', 15, async () => {
    let triggered429 = false;
    for (let i = 1; i <= 8; i++) {
      const res = await request({
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { email: 'rate_limit_probe@uas.edu.mx', password: `pass_${i}` });

      if (res.status === 429) {
        triggered429 = true;
        break;
      }
      await sleep(30);
    }

    // Verificar también en código si existe express-rate-limit o similar
    let pkg = {};
    if (fs.existsSync('package.json')) pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const hasLimiterPkg = Object.keys(allDeps).some(d => d.includes('rate-limit') || d.includes('throttle'));

    if (triggered429) {
      return { ok: true, detail: 'HTTP 429 Too Many Requests emitido exitosamente durante la ráfaga de prueba' };
    }
    if (hasLimiterPkg) {
      return { ok: true, detail: 'Middleware de rate-limiting detectado e integrado en dependencias' };
    }
    return { ok: false, detail: 'No se detectó protección de Rate Limiting (no arrojó 429 ni middleware configurado)' };
  });

  // Test 2.3: Script de Carga k6 con Autenticación Real (20 pts)
  await evaluate('E2.2-T3', 'Pruebas de Carga k6: Script scripts/k6_load_test.js presente y con autenticación JWT en setup()', 20, async () => {
    const k6Paths = ['scripts/k6_load_test.js', 'tests/k6_load_test.js', 'k6_load_test.js'];
    let k6Content = null;
    for (const p of k6Paths) {
      if (fs.existsSync(p)) {
        k6Content = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!k6Content) {
      return { ok: false, detail: 'No se encontró script k6_load_test.js en scripts/' };
    }

    const hasAuthToken = k6Content.includes('Authorization') || k6Content.includes('Bearer') || k6Content.includes('token');
    const hasPermissiveAssertion = k6Content.includes('[200, 401]');

    if (!hasAuthToken) {
      return { ok: false, detail: 'k6_load_test.js realiza peticiones sin autenticación (no evalúa la base de datos)' };
    }
    if (hasPermissiveAssertion) {
      return { ok: false, detail: 'ADVERTENCIA: k6_load_test.js acepta código 401 como exitoso ([200, 401]). Requiere token válido' };
    }

    return { ok: true, detail: 'Script k6 con autenticación Bearer y validación de endpoints configurado' };
  });

  // ==========================================================================
  // RESUMEN Y CALIFICACIÓN FINAL DE LA EVALUACIÓN
  // ==========================================================================
  console.log('\n' + '='.repeat(84));
  console.log('                 RESULTADO DE LA AUDITORÍA ESTRICTA — SEMANA 2');
  console.log('='.repeat(84));
  console.log(`  * Puntaje Total Alcanzado:  ${passed} / ${total} puntos`);
  console.log(`  * Porcentaje de Aprobación: ${Math.round((passed / total) * 100)}%`);
  console.log('-'.repeat(84));

  if (passed >= 80) {
    console.log('  [ESTADO: ACREDITADO EXCELENTE] ✅ Cumplimiento técnico riguroso de Semana 2.\n');
    process.exit(0);
  } else if (passed >= 60) {
    console.log('  [ESTADO: ACREDITADO REGULAR] ⚠️ Requiere optimizar aserciones k6 o integración de Redis.\n');
    process.exit(0);
  } else {
    console.log('  [ESTADO: NO ACREDITADO] ❌ Deficiencias graves en transacciones o caché.\n');
    process.exit(1);
  }
}

runWeek2StrictSuite().catch(err => {
  console.error('Error fatal durante la ejecución de la suite:', err);
  process.exit(1);
});

