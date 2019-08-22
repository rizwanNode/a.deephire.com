import l from '../../common/logger';
import { shortenLink } from '../../common/rebrandly';

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

let db;
const timestamp = () => new Date().toString();

export const init = async () => {
  const uri = `mongodb://${process.env.MONGO_NAME}:${
    process.env.MONGO_PASS
  }@mongo-db-production-shard-00-00-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-01-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-02-tjcvk.mongodb.net:27017/test?ssl=true&replicaSet=Mongo-DB-Production-shard-0&authSource=admin`;

  try {
    const mongoClient = await MongoClient.connect(uri, { useNewUrlParser: true });
    if (process.env.TESTING) {
      const connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
      db = await connection.db(global.__MONGO_DB_NAME__);
      process.env.CONNECTED = 'true';
    } else {
      db = await mongoClient.db('content');
    }

    return true;
  } catch (error) {
    l.error(error);
    return false;
  }
};

/* eslint-disable no-param-reassign */
export const byParam = async (search, col, id = false, findarchives = false) => {
  const collection = db.collection(col);
  if (id) {
    if (!ObjectId.isValid(search)) {
      return Promise.resolve(400);
    }
    search = { _id: new ObjectId(search) };
  } else {
    search = { ...search, archives: { $exists: findarchives } };
  }

  return new Promise(resolve => {
    collection.find(search).toArray((err, result) => {
      if (err) throw err;
      if (result.length === 0) resolve(404);
      resolve(result.reverse());
    });
  });
};

export const update = (search, update, col, multi = true) => {
  const collection = db.collection(col);
  return new Promise(resolve => {
    collection.update(search, update, { multi }).then(allResultData => {
      if (allResultData.result.nModified) resolve(200);
      else resolve(404);
    });
  });
};

export const put = async (search, col, data, id = false, upsert = true) => {
  const collection = db.collection(col);

  if (id) {
    if (!ObjectId.isValid(search)) {
      return Promise.resolve(400);
    }
    search = { _id: new ObjectId(search) };
  }

  return new Promise(resolve => {
    collection.updateOne(search, { $set: data }, { upsert }, (err, result) => {
      if (err) throw err;
      if (result) {
        const { matchedCount } = result;
        if (!matchedCount && !upsert) resolve(404);
        if (!matchedCount && upsert) resolve(201);
        else resolve(200);
      } else resolve(400);
    });
  });
};

export const insert = async (data, col) => {
  const collection = db.collection(col);

  data.timestamp = timestamp();
  return new Promise(resolve => {
    collection.insertOne(data, (err, result) => {
      if (err) throw err;
      if (result) {
        resolve({ ...data, _id: result.insertedId });
      }
    });
  });
};

export const updateByEmail = async (data, col) => {
  const collection = db.collection(col);

  return new Promise(resolve => {
    collection.updateOne({ email: data.email }, { $set: data }, { upsert: true }, (err, result) => {
      if (err) throw err;
      if (result.result.n) resolve(201);
      else resolve(400);
    });
  });
};

export const deleteObject = async (id, col) => {
  const collection = db.collection(col);

  if (!ObjectId.isValid(id)) {
    return Promise.resolve(400);
  }
  return new Promise(resolve => {
    const objectId = new ObjectId(id);
    collection.deleteOne({ _id: objectId }).then(result => {
      if (result.deletedCount) resolve(204);
      else resolve(404);
    });
  });
};

export const deleteSubDocument = async (search, id, col) => {
  const collection = db.collection(col);

  if (!ObjectId.isValid(id)) {
    return Promise.resolve(400);
  }
  const objectId = new ObjectId(id);

  return new Promise(resolve => {
    collection.update(search, { $pull: { files: { uid: objectId } } }).then(allResultData => {
      if (allResultData.result.nModified) resolve(200);
      else resolve(404);
    });
  });
};

export const createUpdateVideo = async (search, data, col) => {
  const collection = db.collection(col);

  data.timestamp = timestamp();
  const { responses } = data;
  delete data.responses;

  let flag = false;
  let newResponses;
  let result;
  const checkIfAnsweredBefore = await collection.findOne(search);
  if (checkIfAnsweredBefore && checkIfAnsweredBefore.responses) {
    newResponses = checkIfAnsweredBefore.responses.map(response => {
      if (response.question == responses.question) {
        flag = true;
        return responses;
      }
      return response;
    });
  }
  if (flag) {
    result = await collection.findOneAndUpdate(search, { $set: { responses: newResponses } });
  } else {
    result = await collection.findOneAndUpdate(
      search,
      { $push: { responses }, $setOnInsert: data },
      { upsert: true },
    );
  }
  if (result.value) return result.value._id;
  return result.lastErrorObject.upserted;
};

export const getInterviews = async (createdBy, current, from, findarchives = false) =>
  new Promise(resolve => {
    const collection = db.collection(current);
    collection
      .aggregate([
        { $match: { createdBy } },
        {
          $lookup: {
            from,
            localField: '_id',
            foreignField: 'interviewId',
            as: 'interview',
          },
        },
        { $unwind: { path: '$interview' } },
        { $project: { _id: false, interview: true } },
        {
          $sort: {
            'interview.timestamp': -1,
          },
        },
        { $match: { 'interview.archives': { $exists: findarchives } } },
      ])
      .toArray(async (err, result) => {
        const interviewsStuff = await collection.find({}).toArray();
        const videoColl = db.collection(from);
        const videosStuff = await videoColl.find({}).toArray();

        if (err) throw err;
        const interviews = result.map(r => r.interview);
        if (result) resolve(interviews);
      });
  });

export const editDocument = async (search, data, customEdit, col) => {
  const collection = db.collection(col);
  const test = await collection.find(search);
  const count = await test.count();
  if (count) {
    test.forEach(doc => {
      customEdit(collection, doc, data);
    });
    return 200;
  }

  return 404;
};

export const duplicate = async (search, col) => {
  const collection = db.collection(col);
  const documents = await collection.find(search).toArray();
  const copies = await Promise.all(documents.map(async document => {
    const objId = new ObjectId();
    document._id = objId;
    document.interviewName = `(Copy) ${document.interviewName}`;
    const longUrl = `https://interviews.deephire.com/?id=${objId.valueOf()}`;
    const shortUrl = await shortenLink(
      longUrl,
      'interview.deephire.com',
      `${document.createdBy}'s interview copy ${document.interviewName}`,
    );
    document.shortUrl = shortUrl;
    return document;
  }));
  const insert = await collection.insertMany(copies);
  if (insert.insertedCount > 0) return 200;
  return 500;
};
