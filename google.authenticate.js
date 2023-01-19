import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';
import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URL;

export async function main() {
  const oAuth2Client = await getAuthenticatedClient();
  console.log('oAuth2Client', oAuth2Client);
  const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
  const res = await oAuth2Client.request({ url });
  console.log('response data', res.data);
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );
  console.log('tokenInfo', tokenInfo);
}

function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      prompt: 'consent',
    });
    console.log('authorizeUrl', authorizeUrl);
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/google/callback') > -1) {
            console.log('req.url', req.url);
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const r = await oAuth2Client.getToken(code);
            console.log('r=======>>>>>>>>>>>>>>>>', r.tokens);
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

main().catch(console.error);
