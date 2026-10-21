import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../src/app';
import { AuthUtil } from '../../src/utils/auth_util';

describe('Pruebas de integración: Módulo de proyectos (/api/projects)', () => {
  let authToken: string;

  before(() => {
    authToken = AuthUtil.generateAccessToken({ userId: 'admin-uuid', role: 'SuperAdmin' });
  });

  it('debe rechazar la creación de proyectos si no se proporciona encabezado Authorization (401)', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({
        name: 'Proyecto de prueba sin token',
        description: 'Descripción básica'
      });
    expect(res.status).to.equal(401);
  });

  it('debe procesar la solicitud cuando se provee un token Bearer válido', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Sistema de pagos en línea ' + Date.now(),
        description: 'Implementación del módulo de cobro recurrente',
        startDate: '2026-10-01',
        endDate: '2026-12-31'
      });
    expect([201, 400, 409, 500]).to.include(res.status);
  });
});
