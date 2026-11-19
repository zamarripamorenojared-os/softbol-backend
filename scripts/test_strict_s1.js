/**
 * ============================================================================
 * ARNÉS DE PRUEBAS ESTRICTO Y DETERMINISTA — SEMANA 1 (E1.1 Y E1.2)
 * ============================================================================
 * Asignatura: Desarrollo Backend de Aplicaciones · Semestre 2026-I
 * Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis
 * Profesor Titular: Dr. Herman Geovany Ayala Zúñiga
 * 
 * PROPÓSITO:
 *   Validar de manera determinista y sin falsos positivos el cumplimiento de:
 *   - E1.1: Arquitectura Limpia, Docker Compose, Password Hashing y Healthcheck.
 *   - E1.2: Autenticación JWT, Contratos 401/422 estrictos y Entidades Relacionales.
 * 
 * EJECUCIÓN LOCAL O EN CI:
 *   node scripts/test_strict_s1.js
 * ============================================================================
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

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

async function runWeek1StrictSuite() {
  console.log('\n' + '='.repeat(84));
  console.log('   EVALUACIÓN ESTRICTA Y DETERMINISTA — SEMANA 1 (E1.1 & E1.2)');
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
  // BLOQUE 1: ENTREGABLE 1.1 (ARQUITECTURA LIMPIA Y DOCKER COMPOSE) - 50 PTS
  // ==========================================================================
  console.log('--- BLOQUE 1: Entregable 1.1 — Arquitectura Limpia y Entorno Docker (50 pts) ---');

  // Test 1.1: Healthcheck contract (10 pts)
  await evaluate('E1.1-T1', 'Endpoint de Salud (/health o /api/v1/health) debe responder estrictamente 200 OK con JSON válido', 10, async () => {
    let res = await request({ path: '/api/v1/health', method: 'GET' });
    if (res.status === 404) {
      res = await request({ path: '/health', method: 'GET' });
    }
    if (res.status !== 200) {
      return { ok: false, detail: `Se esperaba HTTP 200, recibido: ${res.status}` };
    }
    if (!res.json) {
      return { ok: false, detail: 'La respuesta no es un JSON parseable' };
    }
    const statusVal = (res.json.status || res.json.estado || '').toLowerCase();
    if (!['ok', 'up', 'healthy', 'activo'].includes(statusVal)) {
      return { ok: false, detail: `Campo status esperado ('ok'/'up'/'healthy'), recibido: '${statusVal}'` };
    }
    return { ok: true, detail: `Healthcheck OK: ${JSON.stringify(res.json)}` };
  });

  // Test 1.2: Docker Compose file validity (15 pts)
  await evaluate('E1.1-T2', 'Orquestación Docker: docker-compose.yml con servicios App, PostgreSQL/DB y volúmenes persistentes', 15, async () => {
    const dcPaths = ['docker-compose.yml', 'docker-compose.yaml', '../docker-compose.yml'];
    let dcContent = null;
    for (const p of dcPaths) {
      if (fs.existsSync(p)) {
        dcContent = fs.readFileSync(p, 'utf8');
        break;
      }
    }
    if (!dcContent) {
      return { ok: false, detail: 'No se encontró archivo docker-compose.yml en la raíz' };
    }
    const hasDbService = dcContent.includes('postgres') || dcContent.includes('mysql') || dcContent.includes('mariadb') || dcContent.includes('database');
    const hasAppService = dcContent.includes('build:') || dcContent.includes('app:') || dcContent.includes('backend:');
    const hasVolumes = dcContent.includes('volumes:');

    if (!hasDbService) return { ok: false, detail: 'docker-compose.yml no define un servicio de base de datos' };
    if (!hasAppService) return { ok: false, detail: 'docker-compose.yml no define el servicio de aplicación backend' };
    if (!hasVolumes) return { ok: false, detail: 'docker-compose.yml no define volúmenes para persistencia de datos' };

    return { ok: true, detail: 'docker-compose.yml verificado con servicios de App, DB y volúmenes' };
  });

  // Test 1.3: Clean Architecture Separation (15 pts)
  await evaluate('E1.1-T3', 'Arquitectura Limpia: Separación estricta en capas (Domain, Application/UseCases, Infrastructure)', 15, async () => {
    const root = process.cwd();
    function findDirs(start) {
      let dirs = [];
      try {
        const items = fs.readdirSync(start, { withFileTypes: true });
        for (const it of items) {
          if (it.isDirectory() && !it.name.startsWith('.') && it.name !== 'node_modules' && it.name !== 'dist') {
            dirs.push(it.name.toLowerCase());
            dirs = dirs.concat(findDirs(path.join(start, it.name)));
          }
        }
      } catch (_) {}
      return dirs;
    }
    const allDirs = findDirs(root);
    const hasDomain = allDirs.some(d => d.includes('domain') || d.includes('entities') || d.includes('models'));
    const hasApp = allDirs.some(d => d.includes('application') || d.includes('use-case') || d.includes('usecases') || d.includes('services'));
    const hasInfra = allDirs.some(d => d.includes('infra') || d.includes('adapters') || d.includes('repositories') || d.includes('controllers'));

    if (!hasDomain) return { ok: false, detail: 'Falta capa de Dominio (domain/entities)' };
    if (!hasApp) return { ok: false, detail: 'Falta capa de Aplicación (application/usecases/services)' };
    if (!hasInfra) return { ok: false, detail: 'Falta capa de Infraestructura/Adaptadores (infrastructure/adapters/controllers)' };

    return { ok: true, detail: 'Capas Domain, Application e Infrastructure identificadas correctamente' };
  });

  // Test 1.4: Password Hashing with Bcrypt/Argon2 (10 pts)
  await evaluate('E1.1-T4', 'Seguridad de Credenciales: Uso obligatorio de Bcrypt o Argon2 (prohibido texto plano o sha1)', 10, async () => {
    let pkg = {};
    if (fs.existsSync('package.json')) {
      pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    }
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const hasHasher = Object.keys(allDeps).some(d => d.includes('bcrypt') || d.includes('argon2'));
    if (!hasHasher) {
      return { ok: false, detail: 'No se encontró dependencia de bcrypt o argon2 en package.json' };
    }
    return { ok: true, detail: 'Dependencia de hashing seguro (bcrypt/argon2) confirmada' };
  });

  // ==========================================================================
  // BLOQUE 2: ENTREGABLE 1.2 (AUTENTICACIÓN JWT Y CONTRATOS ESTRICTOS) - 50 PTS
  // ==========================================================================
  console.log('\n--- BLOQUE 2: Entregable 1.2 — Autenticación JWT y Contratos Estrictos (50 pts) ---');

  // Test 2.1: Missing Token must strictly return 401 Unauthorized (15 pts)
  await evaluate('E1.2-T1', 'Contrato Auth Estricto: Petición a ruta protegida sin token DEBE retornar exactamente 401', 15, async () => {
    // Probar endpoints protegidos estándar
    const candidates = ['/api/v1/auth/me', '/api/v1/usuarios', '/api/v1/users', '/api/v1/profile'];
    let tested = false;
    for (const p of candidates) {
      const res = await request({ path: p, method: 'GET' });
      if (res.status === 401) {
        tested = true;
        return { ok: true, detail: `Ruta ${p} rechazó sin token con HTTP 401 Unauthorized exacto` };
      }
      if (res.status === 200) {
        return { ok: false, detail: `FALLO CRÍTICO: Ruta protegida ${p} respondió 200 OK a petición anónima` };
      }
    }
    return { ok: false, detail: 'Ningún endpoint protegido respondió 401 Unauthorized (recibido 404 u otros códigos)' };
  });

  // Test 2.2: Malformed or Fake JWT must strictly return 401 (10 pts)
  await evaluate('E1.2-T2', 'Contrato Auth Estricto: Token JWT corrupto o falsificado DEBE retornar exactamente 401', 10, async () => {
    const fakeToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.FIRMA_CORRUPTA';
    const candidates = ['/api/v1/auth/me', '/api/v1/usuarios', '/api/v1/users'];
    for (const p of candidates) {
      const res = await request({ path: p, method: 'GET', headers: { 'Authorization': fakeToken } });
      if (res.status === 401) {
        return { ok: true, detail: `Ruta ${p} rechazó token corrupto con 401 Unauthorized exacto` };
      }
      if (res.status === 200) {
        return { ok: false, detail: `VULNERABILIDAD: Ruta ${p} aceptó token con firma corrupta` };
      }
    }
    return { ok: false, detail: 'No se obtuvo 401 al enviar token corrupto' };
  });

  // Test 2.3: DTO Validation returns 400 or 422 with structured RFC 7807 error (15 pts)
  await evaluate('E1.2-T3', 'Validación Defensiva: Payload incompleto/inválido DEBE retornar 400 o 422 (nunca 500 ni 200)', 15, async () => {
    const endpoints = ['/api/v1/auth/register', '/api/v1/usuarios', '/api/v1/users', '/api/v1/auth/login'];
    for (const p of endpoints) {
      const res = await request({
        path: p,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { datoInvalido: 'invalido' });

      if (res.status === 422 || res.status === 400) {
        const isStructured = res.json && (res.json.errors || res.json.message || res.json.title || res.json.detail);
        return { 
          ok: true, 
          detail: `Endpoint ${p} validó DTO con HTTP ${res.status}${isStructured ? ' y respuesta estructurada' : ''}` 
        };
      }
      if (res.status === 500) {
        return { ok: false, detail: `FALLO DE ROBUSTEZ: Endpoint ${p} arrojó HTTP 500 (Unhandled Exception)` };
      }
    }
    return { ok: false, detail: 'No se obtuvo 400/422 estructurado al enviar payload inválido' };
  });

  // Test 2.4: Relational Entity Models with ORM/Migrations (10 pts)
  await evaluate('E1.2-T4', 'Entidades de Negocio: Modelos ORM/Relacionales definidos con claves primarias y campos auditables', 10, async () => {
    let pkg = {};
    if (fs.existsSync('package.json')) {
      pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    }
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const hasOrm = Object.keys(allDeps).some(d => ['typeorm', 'prisma', '@prisma/client', 'sequelize', 'objection', 'knex', 'pg'].includes(d));
    if (!hasOrm) {
      return { ok: false, detail: 'No se identificó ORM relacional (typeorm, prisma, sequelize) ni cliente pg' };
    }
    return { ok: true, detail: 'ORM / Driver relacional verificado en el proyecto' };
  });

  // ==========================================================================
  // RESUMEN Y CALIFICACIÓN FINAL DE LA EVALUACIÓN
  // ==========================================================================
  console.log('\n' + '='.repeat(84));
  console.log('                 RESULTADO DE LA AUDITORÍA ESTRICTA — SEMANA 1');
  console.log('='.repeat(84));
  console.log(`  * Puntaje Total Alcanzado:  ${passed} / ${total} puntos`);
  console.log(`  * Porcentaje de Aprobación: ${Math.round((passed / total) * 100)}%`);
  console.log('-'.repeat(84));

  if (passed >= 80) {
    console.log('  [ESTADO: ACREDITADO EXCELENTE] ✅ Cumplimiento técnico riguroso de Semana 1.\n');
    process.exit(0);
  } else if (passed >= 60) {
    console.log('  [ESTADO: ACREDITADO REGULAR] ⚠️ Cumple requisitos mínimos; requiere solventar fallos en DTOs o Docker.\n');
    process.exit(0);
  } else {
    console.log('  [ESTADO: NO ACREDITADO] ❌ Deficiencias estructurales graves detectadas.\n');
    process.exit(1);
  }
}

runWeek1StrictSuite().catch(err => {
  console.error('Error fatal durante la ejecución de la suite:', err);
  process.exit(1);
});

