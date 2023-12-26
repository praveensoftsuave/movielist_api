import Router from "express-promise-router";
import { getAllMovies, addMovie, updateMovie, getMoviebyId, deleteMoviebyId } from "../controller/movie.controller.js";

const router = new Router();

router.post('/add', addMovie);

router.post('/edit/:id', updateMovie);

router.get('/:id', getMoviebyId);

router.delete('/:id', deleteMoviebyId);

router.get('/', getAllMovies);

export default router;
