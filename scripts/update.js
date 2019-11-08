// import l from '../server/common/logger';
const { ManagementClient } = require('auth0');

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

let db;

const auth0Managment = new ManagementClient({
  domain: 'deephire2.auth0.com',
  clientId: 'M437SEOw0zLaSbZJAKcxV15m5njDbScr',
  clientSecret: process.env.AUTH0_MANAGMENT_SECRET,
  scope:
    'read:users read:user_idp_tokens update:roles update:users_app_metadata update:users'
});
const init = async () => {
  const uri = `mongodb://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@mongo-db-production-shard-00-00-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-01-tjcvk.mongodb.net:27017,mongo-db-production-shard-00-02-tjcvk.mongodb.net:27017/test?ssl=true&replicaSet=Mongo-DB-Production-shard-0&authSource=admin`;

  try {
    const mongoClient = await MongoClient.connect(uri, {
      useNewUrlParser: true
    });
    if (process.env.TESTING) {
      const connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true
      });
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

// Is used to add or edit a field for an entire collection. The use case here that I used it to, was to add an "owner" field for all of the companies.
// const addFieldToCompanies = async () => {
//   const collection = db.collection('companies');
//   const companies = await collection.find({});
//   companies.forEach(company => {
//     collection.updateOne(
//       { _id: new ObjectId(company._id) },
//       { $set: { plan: 'basic-monthly-v1' } }
//     );
//   });
// };

// const updateInterviewIds = async () => {
//   const collection = db.collection('companies');
//   const companies = await collection.find({});
//   companies.forEach(async company => {
//     const { owner } = company;
//     const interviews = await db
//       .collection('interviews')
//       .find({ createdBy: owner });
//     interviews.forEach(interview => {
//       db.collection('interviews').updateOne(
//         { _id: new ObjectId(interview._id) },
//         { $set: { companyId: new ObjectId(company._id) } }
//       );
//     });
//   });
// };


// const updateShortListIds = async () => {
//   const collection = db.collection('companies');
//   const companies = await collection.find({});
//   companies.forEach(async company => {
//     const { owner } = company;
//     const interviews = await db
//       .collection('shortlists')
//       .find({ createdBy: owner });
//     interviews.forEach(interview => {
//       db.collection('shortlists').updateOne(
//         { _id: new ObjectId(interview._id) },
//         { $set: { companyId: new ObjectId(company._id) } }
//       );
//     });
//   });
// };
// const addRolesToUsers = async () => {
//   const collection = db.collection('companies');
//   const companies = await collection.find({});
//   companies.forEach(async company => {
//     const { owner } = company;

//     const user = await auth0Managment.getUsersByEmail(owner);
//     console.log(user[0])
//     const userId = user[0].user_id;
//     await auth0Managment.assignRolestoUser(
//       { id: userId },
//       { roles: ['rol_zxuE28amFmjlBcRH'] }
//     );
//   });
// };

// const updateUserMetaData = async () => {
//   const collection = db.collection('companies');
//   const companies = await collection.find({});
//   companies.forEach(async company => {
//     const { owner } = company;

//     const user = await auth0Managment.getUsersByEmail(owner);
//     console.log(user[0]);
//     const userId = user[0].user_id;
//     await auth0Managment.updateAppMetadata(
//       { id: userId },
//       { companyId: company._id }
//     );
//   });
// };

init().then(success => {
  if (success) {
    console.log('connected');
    // updateInterviewIds()
    // updateShortListIds()
    // addRolesToUsers()
    // updateUserMetaData();

  }
});
