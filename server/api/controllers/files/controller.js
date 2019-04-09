import FilesService from '../../services/files.service';

export class Controller {
  postFiles(req, res) {
    FilesService.postFiles(req.params.key, req.files).then(r => res.json(r));
  }
}
export default new Controller();
