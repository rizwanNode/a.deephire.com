import CompaniesService from '../../services/companies.service';

export class Controller {
  all(req, res) {
    CompaniesService.byParam(res.locals.email).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }
  insert(req, res) {
    // add auth for this endpoint, requires sending login from app
    CompaniesService.insert(req.body).then(id => {
      res.header('Access-Control-Expose-Headers', 'Location');
      return res
        .status(201)
        .location(`/v1/companies/${id}`)
        .end();
    });
  }
  byParam(req, res) {
    CompaniesService.byParam(req.params.email).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }
}
export default new Controller();
