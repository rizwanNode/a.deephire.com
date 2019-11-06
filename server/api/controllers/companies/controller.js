import CompaniesService from '../../services/companies.service';

export class Controller {
  // all(req, res) {
  //   CompaniesService.byParam(res.locals.email).then(r => {
  //     if (r) res.json(r);
  //     else res.status(404).end();
  //   });
  // }
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
  byId(req, res) {
    CompaniesService.byId(req.params.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
