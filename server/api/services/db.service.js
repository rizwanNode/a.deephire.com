import l from '../../common/logger';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

let mongoClient;
const timestamp = () => new Date().toString();

export const init = async () => {
  const uri = `mongodb://${process.env.MONGO_NAME}:${
    process.env.MONGO_PASS
  }@mongo-db-production-shard-00-00-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-01-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-02-tjcvk.mongodb.net:27017/test?ssl=true&replicaSet=Mongo-DB-Production-shard-0&authSource=admin`;
  mongoClient = new MongoClient(uri, { useNewUrlParser: true });

  try {
    mongoClient = await MongoClient.connect(uri);
    return true;
  } catch (error) {
    l.error(error);
    return false;
  }
};

/* eslint-disable no-param-reassign */
export const byParam = async (search, col, id = false) => {
  const collection = mongoClient.db('content').collection(col);

  if (id) {
    if (!ObjectId.isValid(search)) {
      return Promise.resolve(400);
    }
    search = { _id: new ObjectId(search) };
  }

  return new Promise(resolve => {
    collection.find(search).toArray((err, result) => {
      if (err) throw err;
      resolve(result.reverse());
    });
  });
};

export const update = (search, update, col, multi = true) => {
  const collection = mongoClient.db('content').collection(col);
  return new Promise(resolve => {
    collection.update(search, update, { multi }).then(allResultData => {
      if (allResultData.result.nModified) resolve(200);
      else resolve(404);
    });
  });
};

export const put = async (search, col, data, id = false) => {
  const collection = mongoClient.db('content').collection(col);

  if (id) {
    l.info('here we are');
    if (!ObjectId.isValid(search)) {
      return Promise.resolve(400);
    }
    search = { _id: new ObjectId(search) };
  }

  return new Promise(resolve => {
    collection.updateOne(search, { $set: data }, { upsert: true }, (err, result) => {
      if (err) throw err;
      if (result) {
        resolve(200);
      } else resolve(400);
    });
  });
};

export const insert = async (data, col) => {
  const collection = mongoClient.db('content').collection(col);

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
  const collection = mongoClient.db('content').collection(col);

  return new Promise(resolve => {
    collection.updateOne({ email: data.email }, { $set: data }, { upsert: true }, (err, result) => {
      if (err) throw err;
      if (result.result.n) resolve(201);
      else resolve(400);
    });
  });
};

export const deleteObject = async (id, col) => {
  const collection = mongoClient.db('content').collection(col);

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
  const collection = mongoClient.db('content').collection(col);

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
  const collection = mongoClient.db('content').collection(col);

  data.timestamp = timestamp();
  const { responses } = data;
  delete data.responses;
  return new Promise(resolve => {
    collection.update(
      search,
      { $push: { responses }, $setOnInsert: data },
      { upsert: true },
      (err, result) => {
        if (err) throw err;
        if (result.result.n) resolve(201);
        else resolve(400);
      },
    );
  });
};

export const getInterviews = async (email, current, from, findArchived = false) =>
  new Promise(resolve => {
    const collection = mongoClient.db('content').collection(current);
    collection
      .aggregate([
        { $match: { email } },
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
        { $match: { 'interview.archived': { $exists: findArchived } } },
      ])
      .toArray((err, result) => {
        if (err) throw err;
        const interviews = result.map(r => r.interview);
        if (result) resolve(interviews);
      });
  });
