'use server';

import { NextRequest } from 'next/server';
import { env } from 'process';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import jwt, { JwtHeader } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { meResponseSchema } from './schemas';

const client = jwksClient({
  jwksUri: `${env.FUTUREPASS_PASS_IDP_URL}/.well-known/jwks.json`,
});

async function getSigningKey(header: JwtHeader) {
  const key = await client.getSigningKey(header.kid);
  return key.getPublicKey();
}

export async function verifyIdToken(token: string) {
  const header = await fetchJwk();
  const signingKey = await getSigningKey(header.keys[0]);

  return new Promise((resolve, reject) => {
    return jwt.verify(
      token,
      signingKey,
      { algorithms: [header.keys[0].alg] },
      (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      }
    );
  });
}

export async function getBearerToken(request: NextRequest) {
  const authorizationHeader = request.headers.get('authorization');
  if (authorizationHeader) {
    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
  }
  return null;
}

export async function verifyUser(cookieStore: ReadonlyRequestCookies) {
  const cookieName = encodeURIComponent(
    `${env.AUTH_COOKIE_NAME}:${env.FUTUREPASS_PASS_IDP_URL}:${env.NEXT_PUBLIC_CLIENT_ID}`
  );
  const cookie = cookieStore.get(cookieName);

  if (!cookie) {
    return null;
  }

  const parsed = JSON.parse(cookie.value);
  const res = await fetch(`${parsed.profile.iss}/me`, {
    headers: { authorization: `Bearer ${parsed.access_token}` },
  });

  if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
  const json = await res.json();
  const user = await meResponseSchema.parseAsync(json, {
    async: true,
  });

  return user;
}

export async function verifyUserFail(cookieStore: ReadonlyRequestCookies) {
  const cookieName = encodeURIComponent(
    `${env.AUTH_COOKIE_NAME}:${env.FUTUREPASS_PASS_IDP_URL}:${env.NEXT_PUBLIC_CLIENT_ID}`
  );
  const cookie = cookieStore.get(cookieName);

  if (!cookie) {
    return null;
  }

  const parsed = JSON.parse(cookie.value);
  const res = await fetch(`${parsed.profile.iss}/me`, {
    headers: {
      authorization: `Bearer 6677CGU9F5dpvbkw3-utQcavAseX3Yvt7F5DT-E4IdH`,
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
  const json = await res.json();
  const user = await meResponseSchema.parseAsync(json, {
    async: true,
  });

  return user;
}

export async function verifyUserByAccessToken(token: string) {
  const res = await fetch(`${env.FUTUREPASS_PASS_IDP_URL}/me`, {
    headers: { authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
  const json = await res.json();
  const user = await meResponseSchema.parseAsync(json, {
    async: true,
  });
  return user;
}

export async function fetchJwk() {
  try {
    const res = await fetch(
      `${env.FUTUREPASS_PASS_IDP_URL}/.well-known/jwks.json`
    );
    const jwk = await res.json();
    return jwk;
  } catch (err) {
    console.error(
      {
        error: err,
      },
      'Error fetching JWK'
    );
    return null;
  }
}
