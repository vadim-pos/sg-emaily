// Catching webhooks from sendgrid in dev mode
const localtunnel = require('localtunnel');
const subdomain = 'emailywebhookhelperxxxxxiewjfi';

localtunnel(5000, { subdomain: subdomain }, (err, tunnel) => console.log(`
  --------------------------------------------------------------------------------
  LocalTunnel is running': ${tunnel.url}
  --------------------------------------------------------------------------------
`));