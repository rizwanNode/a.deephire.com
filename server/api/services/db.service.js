const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const timestamp = () => new Date().toString();
class Database {
  constructor() {
    const uri = `mongodb://${process.env.MONGO_NAME}:${
      process.env.MONGO_PASS
    }@mongo-db-production-shard-00-00-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-01-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-02-tjcvk.mongodb.net:27017/test?ssl=true&replicaSet=Mongo-DB-Production-shard-0&authSource=admin`;
    this.client = new MongoClient(uri, { useNewUrlParser: true });
  }


  /* eslint-disable no-param-reassign */
  byParam(search, col, id = false) {
    if (id) {
      if (!ObjectId.isValid(search)) {
        return Promise.resolve(400);
      }
      search = { _id: new ObjectId(search) };
    }
    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;
        const collection = this.client.db('content').collection(col);
        collection.find(search).toArray((err, result) => {
          if (err) throw err;
          resolve(result.reverse());
        });
      });
    });
  }

  put(id, data, col) {
    if (!ObjectId.isValid(id)) {
      return Promise.resolve(400);
    }
    const search = { _id: new ObjectId(id) };

    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;

        const collection = this.client.db('content').collection(col);
        collection.updateOne(search, { $set: data }, { upsert: true }, (err, result) => {
          if (err) throw err;
          if (result) {
            console.log(result);
            resolve(200);
          } else resolve(400);
        });
      });
    });
  }

  insert(data, col) {
    data.timestamp = timestamp;
    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;
        const collection = this.client.db('content').collection(col);
        collection.insertOne(data, (err, result) => {
          if (err) throw err;
          if (result) {
            resolve({ ...data, _id: result.insertedId });
          }
        });
      });
    });
  }

  updateByEmail(data, col) {
    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;
        const collection = this.client.db('content').collection(col);
        collection.updateOne(
          { email: data.email },
          { $set: data },
          { upsert: true },
          (err, result) => {
            if (err) throw err;
            if (result.result.n) resolve(201);
            else resolve(400);
          },
        );
      });
    });
  }

  delete(id, col) {
    console.log(timestamp());

    if (!ObjectId.isValid(id)) {
      return Promise.resolve(400);
    }
    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;
        const collection = this.client.db('content').collection(col);
        const objectId = new ObjectId(id);
        collection.deleteOne({ _id: objectId }).then(result => {
          if (result.deletedCount) resolve(204);
          else resolve(404);
        });
      });
    });
  }

  createUpdateVideo(search, data, col) {
    data.timestamp = timestamp();
    const { responses } = data;
    delete data.responses;
    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;
        const collection = this.client.db('content').collection(col);
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
    });
  }

  async getInterviews(email, col) {
    return new Promise(resolve => {
      this.client.connect(err => {
        if (err) throw err;
        const collection = this.client.db('content').collection('interviews');
        collection
          .aggregate([
            { $match: { email } },
            {
              $lookup: {
                from: col,
                localField: '_id',
                foreignField: 'interviewId',
                as: 'interview',
              },
            },
            { $unwind: { path: '$interview' } },
            { $project: { _id: false, interview: true } },
          ])
          .toArray((err, result) => {
            if (err) throw err;
            const interviews = result.map(r => r.interview);
            if (result) resolve(interviews);
          });
      });
    });
  }
}
export default new Database();
