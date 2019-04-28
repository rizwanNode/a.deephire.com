import { ObjectId } from 'mongodb';
import { update } from '../api/services/db.service';

export const archiveValidator = (data, archived, col) => {
  let objectIds = [];
  try {
    objectIds = data.map(id => {
      if (ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      throw new Error('Invalid ObjectId');
    });
  } catch (err) {
    return Promise.resolve(400);
  }

  const search = { _id: { $in: objectIds } };
  const updateData = { $set: { archived } };

  return update(search, updateData, col);
};

