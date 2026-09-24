/**
 * GOVNEXA — Authentication & Session Management
 */

'use strict';

const Auth = (() => {

  const TOKEN_KEY   = 'govnexa_token';
  const USER_KEY    = 'govnexa_user';
  const ROLE_KEY    = 'govnexa_role';

  /** Demo credentials for frontend demo */
  const DEMO_USERS = {
    'officer@govnexa.in':  { password: 'officer123', role: 'officer',  name: 'Arjun Mehta',    org: 'Dept. of Public Procurement' },
    'bidder@govnexa.in':   { password: 'bidder123',  role: 'bidder',   name: 'Priya Nair',     org: 'ABC Technologies Pvt Ltd' },
    'admin@govnexa.in':    { password: 'admin123',   role: 'admin',    name: 'Sanjay Verma',   org: 'TENDERLENZZ System Admin' },
  };

  const ROLE_HOME = {
    officer: '/officer/dashboard.html',
    bidder:  '/bidder/dashboard.html',
    admin:   '/admin/dashboard.html',
  };

  function getToken()  { return localStorage.getItem(TOKEN_KEY); }
  function getUser()   { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }
  function getRole()   { return localStorage.getItem(ROLE_KEY); }
  function isLoggedIn(){ return !!getToken(); }

  function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_KEY, user.role);
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
  }

  /** Demo login — falls back when backend unavailable */
  async function login(email, password, role) {
    // Try real API first
    try {
      const data = await API.auth.login({ email, password, role });
      saveSession(data.token, data.user);
      return { success: true, user: data.user };
    } catch (err) {
      // Fallback to demo mode
      const demo = DEMO_USERS[email.toLowerCase()];
      if (demo && demo.password === password && demo.role === role) {
        const user = {
          id: `USR-${Date.now()}`,
          email,
          name: demo.name,
          role: demo.role,
          org:  demo.org,
          avatar: null,
        };
        saveSession('demo-token-' + Date.now(), user);
        return { success: true, user, demo: true };
      }
      return { success: false, message: 'Invalid credentials. Try officer@govnexa.in / officer123' };
    }
  }

  function logout() {
    clearSession();
    window.location.href = '/login.html';
  }

  /** Guard — redirect if not logged in or wrong role */
  function guard(requiredRole) {
    if (!isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    if (requiredRole && getRole() !== requiredRole) {
      window.location.href = ROLE_HOME[getRole()] || '/login.html';
      return false;
    }
    return true;
  }

  /** Redirect to role home */
  function goHome() {
    const role = getRole();
    window.location.href = ROLE_HOME[role] || '/login.html';
  }

  /** Populate header user info */
  function populateUserUI() {
    const user = getUser();
    if (!user) return;

    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name);
    document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = formatRole(user.role));
    document.querySelectorAll('[data-user-org]').forEach(el => el.textContent = user.org || '');
    document.querySelectorAll('[data-user-avatar]').forEach(el => el.textContent = Utils.initials(user.name));
    document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = user.email || '');
  }

  function formatRole(role) {
    const map = { officer: 'Procurement Officer', bidder: 'Bidder', admin: 'System Admin' };
    return map[role] || role;
  }

  return {
    getToken, getUser, getRole, isLoggedIn,
    login, logout, guard, goHome,
    saveSession, clearSession,
    populateUserUI, formatRole
  };
})();

window.Auth = Auth;
