const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9ESkVORGMxUVVGRU5FSXhNMEpDTVVJMU1EUkVRVEJGUkVRMU9UWkdOVUV4TVRWRlFrSkRRUSJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmRlZXBoaXJlLmNvbS8iLCJzdWIiOiJhdXRoMHw1Y2NmMjBiZjI2MmI2YTBlMDQ3YzgxNzEiLCJhdWQiOlsiaHR0cDovL2EuZGVlcGhpcmUuY29tIiwiaHR0cHM6Ly9kZWVwaGlyZTIuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU3Mjk4NjgwNywiZXhwIjoxNTczMDczMjA3LCJhenAiOiJqaHpHRlpIVHY4ZWhwR3NrVkt4WnJfalhPQXZLZzdEVSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJwZXJtaXNzaW9ucyI6W119.dRINgq1f-42klLhaFt6aKgFdcdb29mG9z0PrnfPO_Q-OhQY-Y68x5uB5P1VyXpFmEVZftMQGjRDzXU8raECWa-MC2qQeARQgjLXfMjD4VsQbipB9FdZjAQGF09V4GNv1iq16E6y2QX4OKN5_oCKZWhaTMbe3gXpDXSsyE0mwqL6MXMHnXaLPCAUIbtnpk2FXNqrv652T18UnoB9iq8voaVu7zx3WTjJVeLi7VdyfQj7zdn3eH3BYPLoD2kTPCxY8Gagl5xuRrjmwdZn2v378atNfd7cPfy9KQAs5Frs9DBxF7bLkOO3DWnwjqwhrsmJQbNG56d0hMZ3GoNGAGriTJA';
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
