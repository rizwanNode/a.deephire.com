import CompaniesService from '../../services/companies.service';

export class Controller {
  all(req, res) {
    CompaniesService.byParam(res.locals.email).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }
  // update(req, res) {
  //   CompaniesService.update(req.body).then(r => res.status(r).end());
  // }
  byParam(req, res) {
    CompaniesService.byParam(req.params.email).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }
}
export default new Controller();
