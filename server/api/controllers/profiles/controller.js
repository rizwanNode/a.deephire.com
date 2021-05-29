import { updateAppMetadata } from '../../services/profiles.service';

export class Controller {
  getProfile(req, res) {
    res.json(res.locals.userProfile);
  }
  async putProfile(req, res) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const r = await updateAppMetadata(req.params.id, req.body, res.locals.companyId, accessToken);
    if (r) return res.json(r);
    return res.status(500).end();
  }
}
export default new Controller();
