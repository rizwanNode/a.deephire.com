import { ObjectId } from 'mongodb';
import { update } from '../api/services/db.service';

// eslint-disable-next-line import/prefer-default-export
export const archiveValidator = (data, shouldArchive, col) => {
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
  const updateData = shouldArchive
    ? { $set: { archives: new Date().toString() } }
    : { $unset: { archives: '' } };

  return update(search, updateData, col);
};

