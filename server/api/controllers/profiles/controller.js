import { updateAppMetadata } from '../../services/profiles.service';

export class Controller {
  getProfile(req, res) {
    res.json(res.locals.userProfile);
  }
  async putProfile(req, res) {
    const r = await updateAppMetadata(req.params.id, req.body, res.locals.companyId);
    if (r) return res.json(r);
    return res.status(500).end();
  }
}
export default new Controller();
