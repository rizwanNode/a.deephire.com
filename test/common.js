const token =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9ESkVORGMxUVVGRU5FSXhNMEpDTVVJMU1EUkVRVEJGUkVRMU9UWkdOVUV4TVRWRlFrSkRRUSJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmRlZXBoaXJlLmNvbS8iLCJzdWIiOiJhdXRoMHw1Y2NmMjBiZjI2MmI2YTBlMDQ3YzgxNzEiLCJhdWQiOlsiaHR0cDovL2EuZGVlcGhpcmUuY29tIiwiaHR0cHM6Ly9kZWVwaGlyZTIuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU2MTUxMzgzNiwiZXhwIjoxNTYxNjAwMjM2LCJhenAiOiJqaHpHRlpIVHY4ZWhwR3NrVkt4WnJfalhPQXZLZzdEVSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.onlvocgZhv-QNa465j-ROix4vOwtAiLfRPK2kdVhtn8P_dJXVrDXKPBzkkRgQSLZNmVfC-dogq8sjPhly5yu7MEHPfMVwqktPQ0IS9nxO5e36_zKYLU-5RI6z_1c2kURRP0xYjuORgcoZBYUAj9SeGUHb2a37HuRmsqSUWEiUg9B5Hwd-9wNCLKHRmKLDhN16PsHkYiKpI3-5Wnp1XiZ_ksu-JYzuUWQqBgvquW8J1H7Bh0enQykGGgMiZ2CuLfFsmRVP4RgFbKAdutCy2MoKSk7ukWk-BxOFpE7DemnidTdvEFNWiRaIOXHzp8-X6TKq_Tpfm0BNEjRttZDUrL2yg';
export const dbConnected = async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
  if (process.env.CONNECTED) return true;
  return dbConnected();
};

const id1 = '5cd403861c9d440000eb7541';
const id2 = '5cd403861c9d440000eb7542';
const id3 = '5cd403861c9d440000eb7543';
const unusedId = '5cd403861c9d440000eb7549';

export { id1, id2, id3, token, unusedId };
