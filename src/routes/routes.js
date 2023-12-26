import Router from "express-promise-router";
import auth from './auth.js';
import movies from './movies.js';
import { sendNotFound } from '../helpers/response.js';
import { verifyToken } from "../controller/auth.controller.js";
import fileController from "../controller/file.controller.js";

const router = new Router();

router.use('/', auth);

router.use('/movies', verifyToken, movies);
router.use("/file", verifyToken, fileController);
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});
router.use(function(req, res) {
  sendNotFound(res);
});

export default router;