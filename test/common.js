const token =
'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9ESkVORGMxUVVGRU5FSXhNMEpDTVVJMU1EUkVRVEJGUkVRMU9UWkdOVUV4TVRWRlFrSkRRUSJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmRlZXBoaXJlLmNvbS8iLCJzdWIiOiJhdXRoMHw1Y2QwNzlmNmQ3MTlmZTBmNWI5MGQxNmMiLCJhdWQiOlsiaHR0cDovL2EuZGVlcGhpcmUuY29tIiwiaHR0cHM6Ly9kZWVwaGlyZTIuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU2NTcxOTcxMiwiZXhwIjoxNTY1ODA2MTEyLCJhenAiOiJqaHpHRlpIVHY4ZWhwR3NrVkt4WnJfalhPQXZLZzdEVSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.J_TdGt0l2xYHmmA0qdRqFB06Wx3NnSAsPX9KY4kA_IKU47p-VIYYBD_nP9BJrP1sXcZziJH3JgK1g8oPLh4afu7Zpg-KEYYfCfhL2z0Evldao70iHvR9xqtPdel2xAIKNZMKLg8zHi8m0tQAtLGCyIZrD7p5F9nDO_YUJTwvxklCXBnrqOKY0R9oip36LvynSrq6g8iK-NudfR7lm_TLjFJhFQEPdojdzSaXHFmj0-HJPsI71akvHG4kFHazo5EQ0M-aCy_L7p2yMbOtmWDi59giL0j_Mc1t7uWUAFE-KIQlYxSmBkwU70ck8U3Hjn7ZEg_2YdbBD9SAZvkBxUfzbw';
export const dbConnected = async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
  if (process.env.CONNECTED) return true;
  return dbConnected();
};

const id1 = '5cd403861c9d440000eb7541';
const id2 = '5cd403861c9d440000eb7542';
const id3 = '5cd403861c9d440000eb7543';
const id4 = '5cd403861c9d440000eb7544';
const id5 = '5cd403861c9d440000eb7545';
const id6 = '5cd403861c9d440000eb7546';
const id7 = '5cd403861c9d440000eb7547';
const id8 = '5cd403861c9d440000eb7548';
const id9 = '5cd403861c9d440000eb7549';
const id10 = '5cd403861c9d440000eb7550';
const id11 = '5cd403861c9d440000eb7551';

const unusedId = '5cd403861c9d440000eb7549';

export { id1, id2, id3, id4, id5, id6, id7, id8, id9, id10, id11, token, unusedId };
