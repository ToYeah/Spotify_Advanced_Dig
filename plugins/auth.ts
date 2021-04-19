import axios from "axios";

const url = new URL('https://accounts.spotify.com/authorize');
const scopes: string[] = ['user-read-private','user-read-email']
const redirect_uri: string = 'http://localhost:3000/api/auth/auth_redirect'

url.searchParams.set('response_type', 'code');
url.searchParams.set('scope', scopes.join(' '));
url.searchParams.set('redirect_uri', redirect_uri);
url.searchParams.set('client_id', process.env.CLIENT_ID || '');
url.searchParams.set('state', 'state');

export const authRequestUri: string = url.href;
