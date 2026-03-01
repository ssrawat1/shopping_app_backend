import { ObjectId } from 'mongodb';

export default function validateItemId(req, res, next, id) {
  if (!ObjectId.isValid(id)) {
     return res.status(401).json({ success: false, error: "ID is not valid" })
  }
  next();
}
