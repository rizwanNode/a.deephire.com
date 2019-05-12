import InterviewsService from '../../services/interviews.service';

export const all = (req, res) => {
  InterviewsService.all(res.locals.email).then(r => {
    if (r === 400 || r === 404) res.status(r).end();
    else if (r) res.json(r);
    else res.status(500).end();
  });
};

export const archives = (req, res) => {
  InterviewsService.archives(res.locals.email).then(r => res.json(r));
};

export const insert = (req, res) => {
  InterviewsService.insert(req.body, res.locals.email).then(r => res.status(r).end());
};

export const byParam = (req, res) => {
  InterviewsService.byParam(req.params.id).then(r => {
    if (r === 400 || r === 404) res.status(r).end();
    else if (r) res.json(r);
    else res.status(500).end();
  });
};

export const deleteData = (req, res) => {
  InterviewsService.delete(req.params.id).then(r => {
    res.status(r).end();
  });
};

export const archive = (req, res) => {
  InterviewsService.archive(req.body).then(r => res.status(r).end());
};

export const unarchive = (req, res) => {
  InterviewsService.unarchive(req.body).then(r => res.status(r).end());
};
