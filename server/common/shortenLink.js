import fetch from 'node-fetch';

export default async function shortenLink(longLink, title = null) {
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
}
