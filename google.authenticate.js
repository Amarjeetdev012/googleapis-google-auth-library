import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';
import { resolve } from 'path';
import { rejects } from 'assert';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_url = process.env.REDIRECT_URL;

function getAuthenticatedClient() {
  return new Promise((resolve, rejects) => {
    const oAuth2Client = new OAuth2Client(
      client_id,
      client_secret,
      redirect_url
    );
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
    });
  });
}
