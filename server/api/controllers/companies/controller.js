import CompaniesService from '../../services/companies.service';

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

export class Controller {
  byCompanyId(req, res) {
    CompaniesService.byId(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  insert(req, res) {
    // add auth for this endpoint, requires sending login from app
    CompaniesService.insert(req.body).then(id => {
      res.header('Access-Control-Expose-Headers', 'Location')
        .status(201)
        .location(`/v1/companies/${id}`)
        .end();
    });
  }
  byId(req, res) {
    CompaniesService.byIdPublic(req.params.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  putLogo(req, res) {
    CompaniesService.putLogo(res.locals.companyId, req.files).then(r =>
      res.json(r)
    );
  }

  put(req, res) {
    CompaniesService.put(res.locals.companyId, req.body).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getInvites(req, res) {
    CompaniesService.getInvites(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getTeam(req, res) {
    CompaniesService.getTeam(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  sendInvites(req, res) {
    CompaniesService.sendInvites(res.locals.companyId, res.locals.userProfile, req.body).then(id => {
      res.header('Access-Control-Expose-Headers', 'Location')
        .status(201)
        .location(`/v1/companies/invites/${id}`)
        .end();
    });
  }

  getInviteById(req, res) {
    CompaniesService.getInviteById(req.params.inviteId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  resendInvite(req, res) {
    CompaniesService.resendInvite(res.locals.companyId, res.locals.userProfile, req.params.inviteId).then(id => {
      if (id === 400 || id === 404) return res.status(id).end();
      res.header('Access-Control-Expose-Headers', 'Location')
        .status(201)
        .location(`/v1/companies/invites/${id}`)
        .end();
    });
  }


  deleteInvite(req, res) {
    CompaniesService.deleteInvite(res.locals.companyId, req.params.inviteId).then(r => {
      res.status(r).end();
    });
  }

  deleteTeamMember(req, res) {
    CompaniesService.deleteTeamMember(res.locals.companyId, req.params.teamMemberId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }


  getProduct(req, res) {
    CompaniesService.getProduct(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getInvoices(req, res) {
    CompaniesService.getInvoices(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
  getSubscriptions(req, res) {
    CompaniesService.getSubscriptions(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getPaymentMethods(req, res) {
    CompaniesService.getPaymentMethods(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  async cardWallet(req, res) {
    const intent = await stripe.setupIntents.create();
    return res.json({ clientSecret: intent.client_secret });
  }

  async addPaymentMethod(req, res) {
    CompaniesService.addPaymentMethod(res.locals.companyId, req.params.paymentMethodId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
