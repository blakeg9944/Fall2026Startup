// Accounts are handled by the service. These functions call its auth endpoints with fetch.
// The service keeps the login in an httpOnly cookie, so the browser sends it automatically and this code never sees the token.

// Each returns { userName } on success or { error } with a message to show the user
export function login(email, password) {
  return sendCredentials('/api/auth/login', email, password);
}

export function createAccount(email, password) {
  return sendCredentials('/api/auth/create', email, password);
}

// Asks the service who the cookie belongs to, so a page refresh keeps the user logged in.
// Returns the user name, or '' if nobody is logged in or the service can't be reached.
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/me');
    return response.ok ? (await response.json()).userName : '';
  } catch {
    return '';
  }
}

export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'DELETE' });
  } catch {
    // Nothing more to do. The frontend still forgets the user, and the cookie expires with the session.
  }
}

async function sendCredentials(url, email, password) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json();
    return response.ok ? { userName: body.userName } : { error: body.msg };
  } catch {
    return { error: 'Could not reach the server. Please try again.' };
  }
}
