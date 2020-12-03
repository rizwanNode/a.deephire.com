import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';

// https://webhook.site/a1d488ad-490a-4f78-9601-332e5731cef7
import { findOne } from '../api/services/db.service';

const headers = { 'Content-Type': 'application/json' };
const testUrl = 'https://webhook.site/a1d488ad-490a-4f78-9601-332e5731cef7';

const appleOneUrl = 'http://import.axtest.com/deephire/getlive.ashx';


export const roomEndedEvent = async (liveId, recording) => {
  // temporary to make sure we don't send them the preflight requests
  if (!ObjectId.isValid(liveId)) {
    return;
  }
  const search = { _id: liveId };
  const { companyId } = await findOne(search, 'live');


  const data = { liveId, recording, statusCallBackEvent: 'room-ended' };

  fetch(testUrl, { method: 'POST', headers, body: JSON.stringify(data) });


  if (companyId.toString() === '5f7f25460d77330001bc9b91' || companyId.toString() === '5e95d7d3aed1120001480d69') {
    await fetch(testUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...data, webhook: appleOneUrl }),
    });

    fetch(appleOneUrl, { method: 'POST', headers, body: JSON.stringify(data) });
  }
};

export const compositionAvailableEvent = async compositionSid => {
  const search = { compositionSid };
  const { _id, companyId } = await findOne(search, 'live');

  if (_id) {
    const data = {
      liveId: _id,
      statusCallBackEvent: 'composition-available',
    };
    await fetch(testUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (companyId.toString() === '5f7f25460d77330001bc9b91' || companyId.toString() === '5e95d7d3aed1120001480d69') {
      await fetch(testUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...data, webhook: appleOneUrl }),
      });


      return fetch(appleOneUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  }
  return null;
};

export const recordingsDeletedEvent = async liveId => {
  const data = {
    liveId,
    statusCallBackEvent: 'recordings-deleted',
  };
  fetch(testUrl, { method: 'POST', headers, body: JSON.stringify(data) });

  const search = { _id: liveId };
  const { companyId } = await findOne(search, 'live');

  if (companyId.toString() === '5f7f25460d77330001bc9b91' || companyId.toString() === '5e95d7d3aed1120001480d69') {
    await fetch(testUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...data, webhook: appleOneUrl }),
    });

    fetch(appleOneUrl, { method: 'POST', headers, body: JSON.stringify(data) });
  }
};
