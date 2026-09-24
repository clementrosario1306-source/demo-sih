/**
 * GOVNEXA — Notification System
 */

'use strict';

const Notifications = (() => {

  const DEMO_NOTIFICATIONS = [
    {
      id: 'n1', unread: true, type: 'alert',
      icon: 'alert-triangle', iconBg: 'var(--accent-coral-dim)', iconColor: 'var(--accent-coral)',
      title: 'OEM Authorization Missing',
      desc: 'ABC Technologies Pvt Ltd — OEM authorization could not be verified. Manual review required.',
      time: '10:27 AM', severity: 'critical'
    },
    {
      id: 'n2', unread: true, type: 'warning',
      icon: 'alert-triangle', iconBg: 'var(--accent-amber-dim)', iconColor: 'var(--accent-amber)',
      title: 'Clarification Requested',
      desc: 'Global Infra Solutions has responded to the OEM clarification request.',
      time: '10:15 AM', severity: 'medium'
    },
    {
      id: 'n3', unread: true, type: 'info',
      icon: 'shield', iconBg: 'var(--accent-cyan-dim)', iconColor: 'var(--accent-cyan)',
      title: 'Verification Completed',
      desc: 'Verification Run #3 for T-2026-001 completed. 4 bidders processed.',
      time: '10:05 AM', severity: 'info'
    },
    {
      id: 'n4', unread: false, type: 'warning',
      icon: 'clock', iconBg: 'var(--accent-amber-dim)', iconColor: 'var(--accent-amber)',
      title: 'Tender Deadline Approaching',
      desc: 'T-2026-001 closes in 2 days, 14 hours. Ensure all bids are reviewed.',
      time: 'Yesterday', severity: 'medium'
    },
    {
      id: 'n5', unread: false, type: 'success',
      icon: 'check-circle', iconBg: 'var(--accent-mint-dim)', iconColor: 'var(--accent-mint)',
      title: 'Document Verified',
      desc: 'GST Certificate for Sunrise Industries verified successfully.',
      time: 'Yesterday', severity: 'low'
    },
    {
      id: 'n6', unread: false, type: 'info',
      icon: 'users', iconBg: 'var(--accent-violet-dim)', iconColor: 'var(--accent-violet)',
      title: 'New Bid Submitted',
      desc: 'National Traders submitted a bid for T-2026-001.',
      time: '2 days ago', severity: 'info'
    },
  ];

  const ICON_SVG = {
    'alert-triangle': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    'shield':         `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    'clock':          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    'check-circle':   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    'users':          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  };

  function init() {
    const list = document.getElementById('notif-list');
    const dot  = document.getElementById('notif-dot');
    if (!list) return;

    const unread = DEMO_NOTIFICATIONS.filter(n => n.unread).length;
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';

    list.innerHTML = DEMO_NOTIFICATIONS.map(n => `
      <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
        <div class="notification-icon-wrap" style="background:${n.iconBg};color:${n.iconColor}">
          ${ICON_SVG[n.icon] || ''}
        </div>
        <div class="notification-body">
          <div class="notification-title">${Utils.escHtml(n.title)}</div>
          <div class="notification-desc">${Utils.escHtml(n.desc)}</div>
          <div class="notification-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="notification-dot-unread" aria-label="Unread"></div>' : ''}
      </div>
    `).join('') + `
      <div style="padding:var(--space-4);text-align:center">
        <button class="btn btn-ghost btn-sm">Mark all as read</button>
      </div>
    `;

    list.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        item.querySelector('.notification-dot-unread')?.remove();
        const remaining = list.querySelectorAll('.notification-item.unread').length;
        if (dot) dot.style.display = remaining > 0 ? 'block' : 'none';
      });
    });
  }

  return { init };
})();

window.Notifications = Notifications;
