
export class Controller {
  getProfile(req, res) {
    res.json(res.locals.userProfile);
  }
}
export default new Controller();
