/* eslint-disable no-param-reassign */
import fetch from 'node-fetch';

let BhRestToken;

const getDateString = () => {
  const currentdate = new Date();
  const datetime = `${currentdate.getDate()}/${
    currentdate.getMonth() + 1}/${
    currentdate.getFullYear()} @ ${
    currentdate.getHours()}:${
    currentdate.getMinutes()}:${
    currentdate.getSeconds()}`;
  return datetime;
};

const getAuthCode = async () => {
  const clientId = process.env.FRONTLINE_CLIENT_ID;
  const username = process.env.FRONTLINE_USERNAME;
  const password = process.env.FRONTLINE_PASSWORD;

  const url = `https://auth.bullhornstaffing.com/oauth/authorize?client_id=${clientId}&response_type=code&action=Login&username=${username}&password=${password}`;

  const resp = await fetch(url, { redirect: 'manual' });
  const location = resp.headers.get('Location');

  const authCode = getParameterByName('code', location);
  return authCode;
};

const getAccessToken = async () => {
  const authCode = await getAuthCode();
  const clientId = process.env.FRONTLINE_CLIENT_ID;
  const secret = process.env.FRONTLINE_SECRET;
  const url = `https://auth.bullhornstaffing.com/oauth/token?grant_type=authorization_code&code=${authCode}&client_id=${clientId}&client_secret=${secret}`;
  const resp = await fetch(url, { method: 'POST' });
  const data = await resp.json();
  const { access_token: accessToken } = data;
  return accessToken;
}
  ;


const getRestToken = async () => {
  const accessToken = await getAccessToken();
  const url = `https://rest.bullhornstaffing.com/rest-services/login?version=*&access_token=${accessToken}`;
  const resp = await fetch(url, { method: 'POST' });
  const data = await resp.json();
  return data.BhRestToken;
}
  ;


function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// const createCandidate = async (email, userName) => {
//   const url = 'https://rest40.bullhornstaffing.com/rest-services/q06u9/entity/Candidate';
//   const firstName = userName.split(' ').slice(0, -1).join(' ');
//   const lastName = userName.split(' ').slice(-1).join(' ');
//   const data = { email, firstName, lastName };

//   await fetch(url, { method: 'PUT', body: JSON.stringify(data), headers: { BhRestToken } });
// };


const findCandidateData = async (email, userName) => {
  const url = `https://rest40.bullhornstaffing.com/rest-services/q06u9/search/Candidate?query=email:${email}&fields=customTextBlock3,id`;
  const resp = await fetch(url, { headers: { BhRestToken } });
  if (resp.status === 401) {
    BhRestToken = await getRestToken();
    const candidateData = await findCandidateData(email, userName);
    return candidateData;
  }
  if (resp.ok) {
    const data = await resp.json();
    const candidateData = data.data[0];
    if (!candidateData) {
      // await createCandidate(email, userName);
      // const candidateData = await findCandidateData(email, userName);
      // return candidateData;
    }
    return candidateData;
  }
};


const updateCandidateStatus = async (eventData, event) => {
  const frontlineCompanyId = '5daa287c2927361376e9fce9';
  const { candidateEmail, completeInterviewData, candidateUrl, userName } = eventData;
  const { companyData } = completeInterviewData || {};
  const { _id } = companyData || {};

  // IMPORTANT this does not work with ===
  // eslint-disable-next-line eqeqeq
  if (_id == frontlineCompanyId) {
    const candidateData = await findCandidateData(candidateEmail, userName);
    const { id: candidateId, customTextBlock3 } = candidateData;

    const singularEvent = `<div>${event} ${getDateString()}</div>`;

    const eventHistory = customTextBlock3 ? singularEvent + customTextBlock3 : singularEvent;
    const url = `https://rest40.bullhornstaffing.com/rest-services/q06u9/entity/Candidate/${candidateId}`;
    let data = { customTextBlock3: eventHistory, customText17: event };
    if (candidateUrl) {
      data = { ...data, customText18: candidateUrl };
    }
    const resp = await fetch(url, { method: 'POST', headers: { BhRestToken }, body: JSON.stringify(data) });
    return resp.json();
  }
  return 'Not frontline';
};


export default updateCandidateStatus
;
