// Accounts are kept in localStorage until the service handles authentication.
// Both functions will be replaced with calls to the login and create account endpoints.
// Passwords are stored as plain text here only because this is a mock. The real service will hash them.

const STORAGE_KEY = 'users';

// Returns { userName } on success or { error } with a message to show the user
export function login(email, password) {
  const users = getUsers();
  const key = normalize(email);
  if (!(key in users)) {
    return { error: 'No account found for that email. Use Create Account to make one.' };
  }
  if (users[key] !== password) {
    return { error: 'Incorrect password.' };
  }
  return { userName: displayName(key) };
}

export function createAccount(email, password) {
  const users = getUsers();
  const key = normalize(email);
  if (key in users) {
    return { error: 'An account with that email already exists. Try logging in.' };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...users, [key]: password }));
  return { userName: displayName(key) };
}

// The display name is the part of the email before the @, so celiac_sarah@example.com shows as celiac_sarah
function displayName(email) {
  return email.split('@')[0];
}

function normalize(email) {
  return email.trim().toLowerCase();
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}
