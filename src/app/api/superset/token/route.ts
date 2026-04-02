import { NextResponse } from 'next/server';

const SUPERSET_URL = process.env.SUPERSET_URL || 'http://localhost:8088';
const USERNAME = process.env.SUPERSET_ADMIN_USER || 'admin';
const PASSWORD = process.env.SUPERSET_ADMIN_PASSWORD || 'admin';
const DASHBOARD_ID = process.env.SUPERSET_DASHBOARD_ID || '9c396d1f-0fed-4979-a26e-bfc89030c1a2';

export async function GET() {
  try {
    console.log(`[Superset] Connecting to ${SUPERSET_URL} as ${USERNAME}`);

    // 1. Authenticate to get access token
    const loginResponse = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
        provider: 'db',
        refresh: true,
      }),
    });

    if (!loginResponse.ok) {
      const errorBody = await loginResponse.text();
      console.error(`[Superset] Login failed: ${loginResponse.status} - ${errorBody}`);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData.access_token;

    // IMPORTANT: Capture the session cookie to pass it along
    const sessionCookie = loginResponse.headers.get('set-cookie') || '';

    if (!accessToken) {
      console.error('[Superset] No access token in response');
      return NextResponse.json({ error: 'Missing access token' }, { status: 500 });
    }

    // 1.5 Fetch CSRF Token
    const csrfResponse = await fetch(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': sessionCookie,
      },
    });
    
    let csrfToken = '';
    // Capture any updated cookies 
    const csrfCookie = csrfResponse.headers.get('set-cookie') || sessionCookie;

    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      csrfToken = csrfData.result;
    }

    // 2. Fetch Guest Token for the dashboard
    const guestTokenResponse = await fetch(`${SUPERSET_URL}/api/v1/security/guest_token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-CSRFToken': csrfToken,
        'Cookie': csrfCookie,
      },
      body: JSON.stringify({
        user: {
          username: USERNAME,
          first_name: 'Superset',
          last_name: 'Admin',
        },
        resources: [
          {
            type: 'dashboard',
            id: DASHBOARD_ID,
          },
        ],
        rls: [],
      }),
    });

    if (!guestTokenResponse.ok) {
      const guestError = await guestTokenResponse.text();
      console.error(`[Superset] Guest token failed: ${guestTokenResponse.status} - ${guestError}`);
      return NextResponse.json({ error: `Guest token request failed: ${guestError}` }, { status: 500 });
    }

    const guestTokenData = await guestTokenResponse.json();
    
    if (!guestTokenData.token) {
      console.error('[Superset] Guest token missing from response');
      return NextResponse.json({ error: 'Empty guest token' }, { status: 500 });
    }

    return NextResponse.json({ token: guestTokenData.token });
  } catch (error) {
    console.error('[Superset] Unexpected Token Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
