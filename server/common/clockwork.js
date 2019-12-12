import { byId, insert, byParam } from '../api/services/db.service';

const btoa = require('btoa');
const fetch = require('node-fetch');

const url = 'https://testfirma.qa.clkwkdev.com/api/v2';

const getId = async data => {
  const { candidateEmail, companyId } = data;

  const companyData = await byId(companyId, 'companies', true);
  if (companyData.clockworkIntegration) {
    const { apiKey, apiSecret } = companyData.clockworkIntegration;
    const token = `Token ${btoa(`${apiKey}:${apiSecret}`)}`;
    const response = await fetch(`${url}/people?q=${candidateEmail}`, {
      headers: {
        Authorization: token
      }
    });
    const jsonData = await response.json();

    if (jsonData.people.length > 0) {
      // sorts in decending order
      const sortedPeople = jsonData.people.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      const id = sortedPeople[0].id;
      return { id, token };
    }
  }
  return null;
};

const createOrUpdateNote = async (idAndToken, data, victory = false) => {
  const { id, token } = idAndToken;
  const { userName, interviewName, candidateUrl } = data;

  if (victory) {
    const clockworkNote = await byParam(idAndToken, 'clockwork');
    const clockworkNoteId = clockworkNote[0].personNote.id;
    const response = await fetch(
      `${url}/people/${id}/notes/${clockworkNoteId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          note: {
            content: `${userName} completed their video interview. <a target=”_blank href="${candidateUrl}">View their interview</a>`
          }
        })
      }
    );
    return response;
  }
  const response = await fetch(`${url}/people/${id}/notes`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      note: {
        content: `${userName} started the video interview ${interviewName}`
      }
    })
  });
  return response;
};

const clockworkIntegration = async (data, victory) => {
  const idAndToken = await getId(data);
  const otherData = await createOrUpdateNote(idAndToken, data, victory);
  const jsonData = await otherData.json();
  insert({ ...idAndToken, ...jsonData }, 'clockwork');
  return jsonData;
};

export default clockworkIntegration;
