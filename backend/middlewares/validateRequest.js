// Middleware to handle express-validator validation errors
import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //If any validation failed, do not continue.”
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validateRequest;
