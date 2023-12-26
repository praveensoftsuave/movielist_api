import jwt from 'jsonwebtoken';
import {sendErrorResponse, sendUnauthorized, sendNotFound} from '../helpers/response.js';
import db from '../database/dbConnection.js';
import { userDataValidator } from '../validators/validator.js';

const privateKey = "37LvDSm4XvjYOh9Y";
const tokenExpireInSeconds = 86400; // 24 hours

export const authenticate = async function(req, res) {
  try {
    await userDataValidator.validateAsync(req.body);

    let usersRef = db.collection('users');

    const userData = await usersRef.where('email', '==', req.body.email).get();

    if (userData.empty) {
      sendNotFound(res, 'No user found.');
    } else if (userData) {
      userData.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        const user = doc.data();
        user['id'] = doc.id;
        if (user.password === req.body.password) {
          const token = jwt.sign(user, privateKey, {
              expiresIn: tokenExpireInSeconds
          });

          res.json({
            success: true,
            message: 'Token created.',
            token: token
          });
        } else {
          sendErrorResponse(res, 'Woops! Wrong password.');
        }
      });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
}

export const verifyToken = async function(req, res, next) {
  let usersRef = db.collection('users');
  const headersToken = req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '');
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || headersToken;

  if (token) {
    jwt.verify(token, privateKey, async function(err, decoded) {
      if (err) {
        sendUnauthorized(res, 'Failed to authenticate token.');
      } else {
        const userRecord = decoded.id && await usersRef.doc(decoded.id).get();
        if (userRecord) {
          req.currentUser = userRecord.data();
          next();
        } else {
          sendUnauthorized(res, 'Failed to authenticate token.');
        }
      }
    });
  } else {
    sendUnauthorized(res, 'No token provided.');
  }
};
