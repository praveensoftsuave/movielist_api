
export const sendErrorResponse = function (res, message) {
  return res.status(400).send({
    success: false,
    message: message
  });
};

export const sendUnauthorized = function (res, message) {
  return res.status(401).send({
    success: false,
    message: message
  });
};

export const sendForbidden = function (res) {
  return res.status(403).send({
    success: false,
    message: 'You do not have rights to access this resource.'
  });
};

export const sendNotFound = function (res) {
  return res.status(404).send({
    success: false,
    message: 'Resource not found.'
  });
};

