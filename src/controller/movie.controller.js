import {sendNotFound, sendErrorResponse} from '../helpers/response.js';
import db from '../database/dbConnection.js';
import { movieDataValidator } from '../validators/validator.js';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';


export const getAllMovies = async function(req, res) {
    let moviesRef = db.collection('movies');
    const pageSize = 8;
    
    if (req.query.lastItem) {
      console.log(req.query.lastItem)
      moviesRef = db.collection('movies')
      .orderBy('movieId', 'desc')
      .startAfter(Number(req.query.lastItem))
      .limit(pageSize);
    } else if (req.query.firstItem) {
      moviesRef = db.collection('movies')
      .orderBy('movieId', 'desc')
      .endBefore(Number(req.query.firstItem))
      .limit(pageSize);
    } else {
      moviesRef = db.collection('movies')
      .orderBy('movieId', 'desc')
      .limit(pageSize);
    }

    const moviesData = await moviesRef.get();
    const movies = [];
    if (moviesData.empty) {
      sendNotFound(res, 'No data found.');
    } else if (moviesData) {
      const existingCount = await db.collection('movies').count().get();
      moviesData.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        const movie = doc.data();
        movie['id'] = doc.id;
        movies.push(movie);
      });
      res.json({
        success: true,
        message: 'Movies fetched successfully!.',
        totalCount: existingCount.data().count,
        data: movies
      });
    }
}

export const addMovie = async function(req, res) {
  try {
    await movieDataValidator.validateAsync(req.body);
    // const time = new Timestamp();
    
    const moviesRef = db.collection('movies');
    const existingCount = await moviesRef.count().get();

    req.body['createdAt'] = Timestamp.now();
    req.body['movieId'] = existingCount.data().count;
    const movie = await moviesRef.add(req.body);
    res.json({
      success: true,
      message: 'Movie added successfully!.',
      data: movie
    }); //change all success format to  res.status(200).send({ message: "Upload Success", data: {url} });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
}

export const updateMovie = async function(req, res) {
  try {
    if (!req.params.id) {
      return sendErrorResponse(res, 'Movie id is required.');
    }

    await movieDataValidator.validateAsync(req.body);
    let moviesRef = db.collection('movies');

    const movie = await moviesRef.doc(req.params.id).update(req.body);

    res.json({
      success: true,
      message: 'Movie edited successfully!.',
      data: movie
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
}

export const deleteMoviebyId = async function(req, res) {
  try {
    if (!req.params.id) {
      return sendErrorResponse(res, 'Movie id is required.');
    }

    let moviesRef = db.collection('movies');

    const movie = await moviesRef.doc(req.params.id).delete();

    res.json({
      success: true,
      message: 'Movie deleted successfully!.',
      data: movie
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
}

export const getMoviebyId = async function(req, res) {
  try {
    if (!req.params.id) {
      return sendErrorResponse(res, 'Movie id is required.');
    }

    const moviesRef = db.collection('movies');

    const movie = await moviesRef.doc(req.params.id).get();

    if (movie.empty) {
      sendNotFound(res, 'No data found.');
    } else {
      res.json({
        success: true,
        message: 'Movie fetched successfully!.',
        data: movie.data()
      });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
}
