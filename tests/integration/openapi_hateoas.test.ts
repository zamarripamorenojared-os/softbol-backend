import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import { AuthUtil } from '../../src/utils/auth_util';

describe('Suite de Pruebas de Integración: OpenAPI 3.0, HATEOAS y Deprecación RFC 8594', () => {
  let authToken: string;

  before(() => {
    // Generar token JWT con la clave secreta y utilería estándar del sistema
    authToken = AuthUtil.generateAccessToken({
      userId: 'usr-101',
      username: 'admin',
      role: 'SuperAdmin'
    });
  });

  describe('1. Verificación de OpenAPI 3.0 y Swagger UI', () => {
    it('(a) Debe responder HTTP 200 o 301 en la ruta interactiva /api/docs', async () => {
      const res = await request(app).get('/api/docs/');
      expect(res.status).to.be.oneOf([200, 301, 302]);
    });

    it('(b) Debe servir la especificación canónica en /api/docs.json con OpenAPI 3.0.3', async () => {
      const res = await request(app).get('/api/docs.json');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('openapi', '3.0.3');
      expect(res.body.info).to.have.property('title');
      expect(res.body.components.schemas).to.have.property('Room');
      expect(res.body.components.schemas).to.have.property('Booking');
      expect(res.body.components.schemas).to.have.property('ErrorResponse');
    });
  });

  describe('2. Controles de Hipermedios HATEOAS (Richardson Nivel 3)', () => {
    it('(a) Debe contener enlace canónico _links.self en consultas de colección y elementos', async () => {
      const res = await request(app).get('/api/v1/rooms');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_links');
      expect(res.body._links).to.have.property('self');
      expect(res.body._links).to.have.property('first');
      expect(res.body.data[0]).to.have.property('_links');
      expect(res.body.data[0]._links).to.have.property('self');
    });

    it('(b) Habitación AVAILABLE debe contener affordance dinámico book (POST /bookings)', async () => {
      const res = await request(app).get('/api/v1/rooms/a1b2c3d4-0001-4000-8000-000000000001');
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('AVAILABLE');
      expect(res.body._links).to.have.property('book');
      expect(res.body._links.book.method).to.equal('POST');
    });

    it('(c) Habitación OCCUPIED debe contener affordance checkout y NO permitir book', async () => {
      const res = await request(app).get('/api/v1/rooms/a1b2c3d4-0002-4000-8000-000000000002');
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('OCCUPIED');
      expect(res.body._links).to.have.property('checkout');
      expect(res.body._links).to.not.have.property('book');
    });

    it('(d) Reserva CONFIRMED debe contener affordances cancel y process_payment', async () => {
      const res = await request(app)
        .get('/api/v1/bookings/b8c3d2e1-1111-4000-8000-000000000001')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('CONFIRMED');
      expect(res.body._links).to.have.property('cancel');
      expect(res.body._links).to.have.property('process_payment');
    });

    it('(e) Al cancelar reserva (DELETE), los affordances de acción desaparecen dinámicamente', async () => {
      const res = await request(app)
        .delete('/api/v1/bookings/b8c3d2e1-1111-4000-8000-000000000001')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('CANCELLED');
      expect(res.body._links).to.not.have.property('cancel');
      expect(res.body._links).to.not.have.property('process_payment');
    });
  });

  describe('3. Versionado de APIs y Cabeceras de Obsolescencia (RFC 8594)', () => {
    it('(a) Rutas v1 deben inyectar cabeceras Deprecation y Sunset', async () => {
      const res = await request(app).get('/api/v1/rooms');
      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property('deprecation', '@1761868800');
      expect(res.headers).to.have.property('sunset', 'Sat, 31 Oct 2026 23:59:59 GMT');
      expect(res.headers).to.have.property('link');
    });

    it('(b) Versión evolucionada v2 (/api/v2/rooms) debe retornar desglose de moneda e impuestos', async () => {
      const res = await request(app).get('/api/v2/rooms');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('pricing');
      expect(res.body[0].pricing).to.have.property('currency', 'MXN');
      expect(res.body[0].pricing).to.have.property('tax_rate', 0.16);
      expect(res.body[0].pricing).to.have.property('total_price');
    });
  });
});
