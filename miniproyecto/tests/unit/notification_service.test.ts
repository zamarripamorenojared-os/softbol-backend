import sinon from 'sinon';
import { expect } from 'chai';
import { EmailUtil } from '../../src/utils/email_util';
import { NotificationService } from '../../src/services/notification_service';

describe('Pruebas aisladas con stubs: NotificationService', () => {
  let sendEmailStub: sinon.SinonStub;

  beforeEach(() => {
    sendEmailStub = sinon.stub(EmailUtil, 'sendHtmlEmail').resolves(true);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('debe invocar el utilitario de correo con la dirección y asunto correctos sin enviar un email real', async () => {
    const result = await NotificationService.notifyTaskAssigned(
      'dev@pms.com',
      'Implementación de API REST'
    );
    expect(result).to.equal(true);
    expect(sendEmailStub.calledOnce).to.be.true;
    expect(sendEmailStub.firstCall.args[0]).to.equal('dev@pms.com');
  });
});
