import Router from "express-promise-router";

import {authenticate} from '../controller/auth.controller.js';

const router = new Router();

router.route('/login')
  .post(authenticate);

export default router;
