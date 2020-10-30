import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';

// https://webhook.site/b2e9cfaf-046d-4d6a-992f-9754c7c810cc
import { findOne } from '../api/services/db.service';

const headers = { 'Content-Type': 'application/json' };
const appleOneUrl = 'https://webhook.site/b2e9cfaf-046d-4d6a-992f-9754c7c810cc';

export const roomEndedEvent = (liveId, recording) => {
  // temporary to make sure we don't send them the preflight requests
  if (!ObjectId.isValid(liveId)) {
    return;
  }
  const data = { liveId, recording, statusCallBackEvent: 'room-ended' };
  fetch(appleOneUrl, { method: 'POST', headers, body: JSON.stringify(data) });
};

export const compositionAvailableEvent = async compositionSid => {
  const search = { compositionSid };
  const { _id } = await findOne(search, 'live');
  const data = {
    liveId: _id,
    statusCallBackEvent: 'composition-available',
  };
  fetch(appleOneUrl, { method: 'POST', headers, body: JSON.stringify(data) });
};


export const recordingsDeletedEvent = liveId => {
  const data = {
    liveId,
    statusCallBackEvent: 'recordings-deleted',
  };
  fetch(appleOneUrl, { method: 'POST', headers, body: JSON.stringify(data) });
};
