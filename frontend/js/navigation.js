/**
 * GOVNEXA — Navigation & Shell Initialization
 * Handles sidebar, collapsing, mobile nav, breadcrumbs, search
 */

'use strict';

const Navigation = (() => {

  let shellInjected = false;

  /** Nav configs per role */
  const NAV_CONFIG = {
    officer: [
      { group: 'Main', items: [
        { label: 'Dashboard',      href: '/officer/dashboard.html',     icon: 'grid' },
        { label: 'Tenders',        href: '/officer/tenders.html',        icon: 'file-text' },
        { label: 'Bidders',        href: '/officer/bidders.html',        icon: 'users' },
      ]},
      { group: 'Compliance', items: [
        { label: 'Verification',   href: '/officer/verification.html',   icon: 'shield' },
        { label: 'Discrepancies',  href: '/officer/discrepancies.html',  icon: 'alert-triangle', badge: 3 },
        { label: 'Comparison',     href: '/officer/comparison.html',     icon: 'columns' },
      ]},
      { group: 'Insights', items: [
        { label: 'Reports',        href: '/officer/reports.html',        icon: 'bar-chart-2' },
        { label: 'Audit Trail',    href: '/officer/audit.html',          icon: 'clock' },
      ]},
    ],
    bidder: [
      { group: 'Main', items: [
        { label: 'Dashboard',      href: '/bidder/dashboard.html',       icon: 'grid' },
        { label: 'Browse Tenders', href: '/bidder/tenders.html',         icon: 'search' },
        { label: 'My Bids',        href: '/bidder/submission.html',      icon: 'send' },
      ]},
      { group: 'Documents', items: [
        { label: 'Documents',      href: '/bidder/documents.html',       icon: 'folder' },
        { label: 'Compliance',     href: '/bidder/compliance.html',      icon: 'check-circle' },
      ]},
      { group: 'Account', items: [
        { label: 'Profile',        href: '/bidder/profile.html',         icon: 'user' },
      ]},
    ],
    admin: [
      { group: 'Main', items: [
        { label: 'Dashboard',      href: '/admin/dashboard.html',        icon: 'grid' },
        { label: 'Users',          href: '/admin/users.html',            icon: 'users' },
      ]},
      { group: 'Configuration', items: [
        { label: 'Rules',          href: '/admin/rules.html',            icon: 'sliders' },
        { label: 'Connectors',     href: '/admin/connectors.html',       icon: 'link' },
      ]},
      { group: 'Monitoring', items: [
        { label: 'Audit Logs',     href: '/admin/audit-logs.html',       icon: 'activity' },
      ]},
    ],
  };

  /** SVG icons inline set */
  const ICONS = {
    'grid':           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    'file-text':      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    'users':          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'shield':         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'columns':        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/></svg>',
    'bar-chart-2':    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    'clock':          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'search':         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    'send':           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    'folder':         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    'check-circle':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'user':           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'sliders':        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    'link':           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    'activity':       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'bell':           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    'help-circle':    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'settings':       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    'log-out':        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    'menu':           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    'chevron-right':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"/></svg>',
    'x':              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };

  function icon(name, cls = '') {
    const svg = ICONS[name] || ICONS['search'];
    return svg.replace('<svg ', `<svg class="${cls}" stroke-width="1.75" `);
  }

  /** Build and inject the app shell into <body> */
  function injectShell(role, pageTitle, breadcrumbs = []) {
    if (shellInjected) return;
    shellInjected = true;

    const user = Auth.getUser() || { name: 'User', role };
    const navGroups = NAV_CONFIG[role] || [];
    const currentPath = window.location.pathname;
    const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';

    // Build sidebar nav HTML
    const navHTML = navGroups.map(group => `
      <div class="nav-group">
        <div class="nav-group-label">${group.group}</div>
        ${group.items.map(item => {
          const isActive = currentPath.endsWith(item.href.replace(/^\//, '').split('/').pop());
          return `
            <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}">
              <span class="nav-icon">${icon(item.icon)}</span>
              <span class="nav-label">${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </a>`;
        }).join('')}
      </div>
    `).join('');

    // Breadcrumb HTML
    const bcHTML = breadcrumbs.map((bc, i) =>
      i < breadcrumbs.length - 1
        ? `<span class="breadcrumb-item"><a href="${bc.href || '#'}">${bc.label}</a></span><span class="breadcrumb-sep">${icon('chevron-right')}</span>`
        : `<span class="breadcrumb-item current">${bc.label}</span>`
    ).join('');

    const shellHTML = `
      <div class="app-shell">
        <!-- SIDEBAR -->
        <aside class="sidebar ${collapsed ? 'collapsed' : ''}" id="sidebar">
          <div class="sidebar-brand">
            <div class="sidebar-logo">T</div>
            <div class="sidebar-brand-text">
              <div class="brand-name">TENDERLENZZ</div>
              <div class="brand-tagline">Procurement Intelligence</div>
            </div>
          </div>
          <nav class="sidebar-nav" aria-label="Main navigation">${navHTML}</nav>
          <div class="sidebar-footer">
            <div class="sidebar-user" id="sidebar-user-btn">
              <div class="user-avatar" data-user-avatar>${Utils.initials(user.name)}</div>
              <div class="user-info">
                <div class="user-name" data-user-name>${user.name}</div>
                <div class="user-role" data-user-role>${Auth.formatRole(user.role)}</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- TOP HEADER -->
        <header class="top-header ${collapsed ? 'sidebar-collapsed' : ''}" id="top-header" role="banner">
          <button class="header-btn mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu">
            ${icon('menu')}
          </button>
          <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Collapse sidebar">
            ${icon('menu')}
          </button>
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="javascript:void(0)" class="breadcrumb-item">TENDERLENZZ</a>
            <span class="breadcrumb-sep">${icon('chevron-right')}</span>
            ${bcHTML}
          </nav>

          <!-- GLOBAL SEARCH -->
          <div class="search-container" id="global-search-container">
            <span class="search-icon">${icon('search')}</span>
            <input type="search" class="search-input" id="global-search"
              placeholder="Search tenders, bidders, documents…"
              aria-label="Global search" autocomplete="off">
            <span class="search-shortcut">/</span>
            <div class="search-results-dropdown" id="search-dropdown" role="listbox"></div>
          </div>

          <div class="header-actions">
            <button class="header-btn" id="help-btn" aria-label="Help" data-tooltip="Help">
              ${icon('help-circle')}
            </button>
            <button class="header-btn header-btn-notif" id="notif-btn" aria-label="Notifications">
              ${icon('bell')}
              <span class="notification-dot ping" id="notif-dot"></span>
            </button>
            <div class="header-divider" aria-hidden="true"></div>
            <div class="header-profile" id="header-profile-btn" role="button" tabindex="0" aria-label="Profile menu">
              <div class="header-profile-info">
                <div class="header-profile-name" data-user-name>${user.name}</div>
                <div class="header-role-badge" data-user-role>${Auth.formatRole(user.role)}</div>
              </div>
              <div class="user-avatar header-btn-profile" data-user-avatar>${Utils.initials(user.name)}</div>
            </div>
          </div>
        </header>

        <!-- MOBILE OVERLAY -->
        <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>

        <!-- MAIN CONTENT (existing page content will be moved here) -->
        <main class="main-content ${collapsed ? 'sidebar-collapsed' : ''}" id="main-content" role="main">
          <div id="page-root"></div>
        </main>
      </div>

      <!-- NOTIFICATION DRAWER -->
      <div class="notification-drawer" id="notif-drawer" role="dialog" aria-label="Notifications" aria-hidden="true">
        <div class="notification-drawer-header">
          <span class="notification-drawer-title">Notifications</span>
          <button class="notification-drawer-close" id="notif-close" aria-label="Close notifications">
            ${icon('x')}
          </button>
        </div>
        <div class="notification-list" id="notif-list"></div>
      </div>

      <!-- DRAWER OVERLAY -->
      <div class="drawer-overlay" id="drawer-overlay"></div>

      <!-- TOAST CONTAINER -->
      <div class="toast-container" id="toast-container" aria-live="polite" aria-atomic="true"></div>

      <!-- PROFILE POPUP MENU -->
      <div class="dropdown-menu profile-popup-menu" id="profile-dropdown" style="position:fixed; top:65px; right:16px; z-index:999; min-width:280px; background:var(--bg-surface); border:1px solid var(--border-strong); border-radius:var(--radius-xl); box-shadow:var(--shadow-xl); padding:var(--space-3); animation: fadeIn 0.2s ease;">
        <div style="display:flex; align-items:center; gap:var(--space-3); padding:var(--space-3); background:var(--bg-elevated); border-radius:var(--radius-lg); margin-bottom:var(--space-2);">
          <div class="user-avatar" style="width:40px; height:40px; font-size:var(--text-base); font-weight:var(--fw-bold); background:var(--accent-cyan); color:var(--text-inverse); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ${Utils.initials(user.name)}
          </div>
          <div style="overflow:hidden; flex:1;">
            <div style="font-weight:var(--fw-bold); font-size:var(--text-sm); color:var(--text-primary); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${user.name}</div>
            <div style="font-size:11px; color:var(--text-muted); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${user.email || 'officer@govnexa.in'}</div>
            <div style="display:inline-block; font-size:10px; font-weight:var(--fw-bold); color:var(--accent-cyan); text-transform:uppercase; margin-top:2px; background:var(--accent-cyan-dim); padding:1px 6px; border-radius:4px;">${Auth.formatRole(user.role)}</div>
          </div>
        </div>

        <div style="font-size:11px; color:var(--text-secondary); padding:var(--space-2) var(--space-3); border-bottom:1px solid var(--border-subtle); margin-bottom:var(--space-2);">
          <span style="color:var(--text-muted)">Organization:</span><br>
          <strong style="color:var(--text-primary)">${user.org || 'TENDERLENZZ Public Procurement'}</strong>
        </div>

        <div class="dropdown-item" id="menu-view-profile" style="border-radius:var(--radius-md); padding:var(--space-2) var(--space-3); display:flex; align-items:center; gap:var(--space-3); cursor:pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Account & Profile</span>
        </div>

        <div class="dropdown-item" id="menu-switch-role" style="border-radius:var(--radius-md); padding:var(--space-2) var(--space-3); display:flex; align-items:center; gap:var(--space-3); cursor:pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
          <span>Switch Portal Role</span>
        </div>

        <div class="dropdown-divider" style="margin:var(--space-2) 0;"></div>

        <div class="dropdown-item danger" id="logout-btn" style="border-radius:var(--radius-md); padding:var(--space-2) var(--space-3); display:flex; align-items:center; gap:var(--space-3); cursor:pointer; color:var(--accent-coral);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <strong style="font-weight:var(--fw-semibold);">Sign Out of TENDERLENZZ</strong>
        </div>
      </div>
    `;

    // Inject all shell elements to body
    const existing = document.body.innerHTML;
    document.body.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = shellHTML;
    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
    const pageRoot = document.getElementById('page-root');
    if (pageRoot) pageRoot.innerHTML = existing;

    _bindShellEvents();
    Auth.populateUserUI();
    Notifications.init();
  }

  function _bindShellEvents() {
    const sidebar     = document.getElementById('sidebar');
    const topHeader   = document.getElementById('top-header');
    const mainContent = document.getElementById('main-content');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileBtn   = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const notifBtn    = document.getElementById('notif-btn');
    const notifClose  = document.getElementById('notif-close');
    const notifDrawer = document.getElementById('notif-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const profileBtn  = document.getElementById('header-profile-btn');
    const sidebarUserBtn = document.getElementById('sidebar-user-btn');
    const profileDrop = document.getElementById('profile-dropdown');
    const logoutBtn   = document.getElementById('logout-btn');
    const switchRoleBtn = document.getElementById('menu-switch-role');
    const viewProfileBtn = document.getElementById('menu-view-profile');
    const searchInput = document.getElementById('global-search');
    const searchDrop  = document.getElementById('search-dropdown');

    // ── Sidebar collapse toggle ───────────────────────────
    sidebarToggle?.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('collapsed');
      topHeader?.classList.toggle('sidebar-collapsed', collapsed);
      mainContent?.classList.toggle('sidebar-collapsed', collapsed);
      localStorage.setItem('sidebar_collapsed', collapsed);
    });

    // ── Mobile sidebar ────────────────────────────────────
    mobileBtn?.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      mobileOverlay.classList.add('visible');
    });
    mobileOverlay?.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      mobileOverlay.classList.remove('visible');
    });

    // ── Notification drawer ───────────────────────────────
    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDrawer.classList.add('open');
      notifDrawer.setAttribute('aria-hidden', 'false');
      drawerOverlay.classList.add('visible');
    });
    notifClose?.addEventListener('click', closeNotifDrawer);
    drawerOverlay?.addEventListener('click', closeNotifDrawer);

    function closeNotifDrawer() {
      notifDrawer.classList.remove('open');
      notifDrawer.setAttribute('aria-hidden', 'true');
      drawerOverlay.classList.remove('visible');
    }

    // ── Profile dropdown ──────────────────────────────────
    function toggleProfileMenu(e) {
      e.stopPropagation();
      const isOpen = profileDrop?.classList.contains('open');
      if (isOpen) {
        profileDrop?.classList.remove('open');
      } else {
        profileDrop?.classList.add('open');
      }
    }

    profileBtn?.addEventListener('click', toggleProfileMenu);
    sidebarUserBtn?.addEventListener('click', toggleProfileMenu);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#profile-dropdown') && !e.target.closest('#header-profile-btn') && !e.target.closest('#sidebar-user-btn')) {
        profileDrop?.classList.remove('open');
      }
    });

    profileBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') toggleProfileMenu(e);
    });

    // ── Menu Action: View Profile ──────────────────────────
    viewProfileBtn?.addEventListener('click', () => {
      profileDrop?.classList.remove('open');
      const role = localStorage.getItem('govnexa_role');
      if (role === 'bidder') {
        window.location.href = '../bidder/profile.html';
      } else {
        Toast.info('User Account', `${Auth.getUser()?.name} (${Auth.getUser()?.email}) · Active Session`);
      }
    });

    // ── Menu Action: Switch Role ───────────────────────────
    switchRoleBtn?.addEventListener('click', () => {
      profileDrop?.classList.remove('open');
      localStorage.removeItem('govnexa_token');
      localStorage.removeItem('govnexa_user');
      localStorage.removeItem('govnexa_role');
      window.location.href = '../login.html';
    });

    // ── Logout ────────────────────────────────────────────
    logoutBtn?.addEventListener('click', () => {
      profileDrop?.classList.remove('open');
      Auth.logout();
    });

    // ── Global search ─────────────────────────────────────
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput?.focus();
      }
      if (e.key === 'Escape') searchDrop?.classList.remove('visible');
    });

    searchInput?.addEventListener('input', Utils.debounce((e) => {
      const q = e.target.value.trim();
      if (q.length < 2) { searchDrop.classList.remove('visible'); return; }
      renderSearchResults(q);
    }, 250));

    searchInput?.addEventListener('focus', (e) => {
      if (e.target.value.trim().length >= 2) searchDrop?.classList.add('visible');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#global-search-container')) searchDrop?.classList.remove('visible');
    });
  }

  /** Demo search results */
  function renderSearchResults(q) {
    const dropdown = document.getElementById('search-dropdown');
    if (!dropdown) return;
    q = q.toLowerCase();

    const results = [
      { group: 'Tenders',   icon: 'file-text', label: 'T-2026-001 — Supply of IT Equipment',    href: '/officer/tenders.html' },
      { group: 'Tenders',   icon: 'file-text', label: 'T-2026-002 — Network Infrastructure Upgrade', href: '/officer/tenders.html' },
      { group: 'Bidders',   icon: 'users',     label: 'ABC Technologies Pvt Ltd',                href: '/officer/compliance.html' },
      { group: 'Bidders',   icon: 'users',     label: 'Global Infra Solutions',                  href: '/officer/bidders.html' },
      { group: 'Documents', icon: 'folder',    label: 'ABC_GST_Certificate.pdf',                 href: '/officer/evidence.html' },
      { group: 'Requirements', icon: 'check-circle', label: 'OEM Authorization',                 href: '/officer/requirements.html' },
    ].filter(r => r.label.toLowerCase().includes(q));

    if (!results.length) {
      dropdown.innerHTML = `<div style="padding:var(--space-5);text-align:center;color:var(--text-muted);font-size:var(--text-sm)">No results found</div>`;
      dropdown.classList.add('visible');
      return;
    }

    const groups = {};
    results.forEach(r => { (groups[r.group] = groups[r.group] || []).push(r); });

    dropdown.innerHTML = Object.entries(groups).map(([group, items]) => `
      <div class="search-result-group-label">${group}</div>
      ${items.map(item => `
        <a href="${item.href}" class="search-result-item">
          <div class="search-result-icon">${icon(item.icon)}</div>
          <span>${Utils.escHtml(item.label)}</span>
        </a>`).join('')}
    `).join('');
    dropdown.classList.add('visible');
  }

  return { injectShell, icon, NAV_CONFIG };
})();

window.Navigation = Navigation;
