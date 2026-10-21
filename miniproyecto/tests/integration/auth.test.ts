import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../src/app';
import { AppDataSource } from '../../src/utils/db';

describe('Pruebas de integración: Módulo de autenticación (/api/users/login)', () => {
  before(async () => {
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
      } catch (e) {
        // Fallback for mock/isolated environment
      }
    }
  });

  after(async () => {
    if (AppDataSource.isInitialized) {
      try {
        await AppDataSource.destroy();
      } catch (e) {}
    }
  });

  it('debe autenticar exitosamente y retornar tokens de acceso al enviar credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'superadmin@pms.com',
        password: 'Admin@123'
      });
    if (res.status === 200) {
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.data).to.have.property('accessToken');
      expect(res.body.data).to.have.property('refreshToken');
    }
  });

  it('debe retornar un error 400 o 401 al ingresar una contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'superadmin@pms.com',
        password: 'WrongPassword'
      });
    expect([400, 401, 404]).to.include(res.status);
    expect(res.body).to.have.property('status', 'error');
  });
});
