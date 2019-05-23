import fetch from 'node-fetch';
import { byParam } from '../api/services/db.service';

export const shortenLink = async (longLink, title = null) => {
  const body = {
    destination: longLink,
    domain: { fullName: 'link.deephire.com' },
    title,
  };

  const resp = await fetch('https://api.rebrandly.com/v1/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.REBRANDLY_API_KEY,
      workspace: process.env.REBRANDLY_WORKSPACE_ID,
    },
    body: JSON.stringify(body),
  }).catch(err => console.error(err));
  const json = await resp.json().catch(err => console.error(err));
  return json.shortUrl;
};

export const fetchLinksByEmail = email => {
  const search = { createdBy: email };
  return byParam(search, 'shortlists');
};

const fetchShortLists = slashtag =>
  // console.log(`fetchShortlist function ran ${slashtag}`);
  fetch(
    `https://api.rebrandly.com/v1/links?domain.fullName=link.deephire.com&slashtag=${slashtag}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.REBRANDLY_API_KEY,
        workspace: process.env.REBRANDLY_WORKSPACE_ID,
      },
    },
  )
    .then(response => response.json())
    .then(data => {
      if (data[0]) return data[0].id;
      return null;
    });

export const deleteLinksById = id => {
  if (id) {
    fetch(`https://api.rebrandly.com/v1/links/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.REBRANDLY_API_KEY,
        workspace: process.env.REBRANDLY_WORKSPACE_ID,
      },
    })
      .then(response => response.json())
      .then(data => data);
  }
};

export const deleteLinksBySlashtags = shortlists => {
  const urls = shortlists.map(r => r.shortUrl || r.short_url);
  const chop = urls.map(r => {
    if (r) return r.slice(18);
    // use below if there is http:// at the begining
    // if (r) return r.slice(25);
    return null;
  });
  const ids = chop.map(r => fetchShortLists(r).then(r => r));
  Promise.all(ids).then(ids => ids.forEach(r => deleteLinksById(r)));
};
