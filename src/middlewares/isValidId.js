import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(createError(400, `${contactId} is not a valid MongoDB ID`));
  }

  next();
};

export default isValidId;
