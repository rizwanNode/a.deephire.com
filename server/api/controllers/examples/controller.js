import ExamplesService from '../../services/examples.service';

export class Controller {
  all(req, res) {
    ExamplesService.all().then(r => res.json(r));
  }

  byParam(req, res) {
    ExamplesService.byId(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  insert(req, res) {
    ExamplesService.insert(req.body.name).then(r =>
      res
        .status(201)
        .location(`<%= apiRoot %>/examples/${r.id}`)
        .json(r),
    );
  }
}
export default new Controller();
