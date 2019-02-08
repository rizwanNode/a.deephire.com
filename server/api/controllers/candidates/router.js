import * as express from 'express';

import controller from './controller';
import { checkJwt } from '../../../common/auth';

export default express
  .Router()
  .get('/:userId/', controller.byParam)
  .put('/:userId', checkJwt, controller.put);

