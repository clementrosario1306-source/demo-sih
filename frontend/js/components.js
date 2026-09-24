/**
 * GOVNEXA — UI Component Renderers
 * Toast, Modal, Side Panel, Skeleton, Tabs
 */

'use strict';

/* ── TOAST ───────────────────────────────────────────────── */
const Toast = (() => {
  const ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  function show(type, title, desc = '', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
      <div>
        <div class="toast-title">${Utils.escHtml(title)}</div>
        ${desc ? `<div class="toast-desc">${Utils.escHtml(desc)}</div>` : ''}
      </div>
    `;
    container.appendChild(toast);

    const timer = setTimeout(() => remove(toast), duration);
    toast.addEventListener('click', () => { clearTimeout(timer); remove(toast); });
  }

  function remove(toast) {
    toast.classList.add('exiting');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 400);
  }

  return {
    success: (title, desc) => show('success', title, desc),
    error:   (title, desc) => show('error',   title, desc),
    warning: (title, desc) => show('warning', title, desc),
    info:    (title, desc) => show('info',    title, desc),
  };
})();

/* ── MODAL ───────────────────────────────────────────────── */
const Modal = (() => {

  let activeModal = null;

  function create({ id, title, body, footer, size = 'md', closable = true }) {
    // Remove existing modal with same id
    document.getElementById(id)?.remove();
    document.getElementById(id + '-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = id + '-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);

    const maxW = { sm: '400px', md: '560px', lg: '720px', xl: '900px' }[size] || '560px';
    overlay.innerHTML = `
      <div class="modal" id="${id}" style="max-width:${maxW}">
        <div class="modal-header">
          <h2 class="modal-title">${Utils.escHtml(title)}</h2>
          ${closable ? `<button class="modal-close" aria-label="Close dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>` : ''}
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    activeModal = overlay;

    if (closable) {
      overlay.querySelector('.modal-close')?.addEventListener('click', () => close(id));
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(id); });
    }

    document.addEventListener('keydown', _escListener);
    return overlay;
  }

  function _escListener(e) {
    if (e.key === 'Escape' && activeModal) close(activeModal.id.replace('-overlay',''));
  }

  function close(id) {
    const overlay = document.getElementById(id + '-overlay');
    if (!overlay) return;
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
    document.removeEventListener('keydown', _escListener);
    activeModal = null;
  }

  function confirm({ title, body, confirmText = 'Confirm', confirmClass = 'btn-primary', onConfirm }) {
    create({
      id: 'confirm-modal',
      title,
      body,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close('confirm-modal')">Cancel</button>
        <button class="btn ${confirmClass}" id="confirm-modal-ok">${Utils.escHtml(confirmText)}</button>
      `
    });
    document.getElementById('confirm-modal-ok')?.addEventListener('click', () => {
      close('confirm-modal');
      onConfirm?.();
    });
  }

  return { create, close, confirm };
})();

/* ── SIDE PANEL ──────────────────────────────────────────── */
const SidePanel = (() => {

  function open({ id, title, subtitle, body, footer, onClose }) {
    document.getElementById(id)?.remove();
    const drawerOverlay = document.getElementById('drawer-overlay');

    const panel = document.createElement('div');
    panel.className = 'side-panel';
    panel.id = id;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', title);
    panel.innerHTML = `
      <div class="side-panel-header">
        <div>
          <h2 style="font-size:var(--text-lg);font-weight:var(--fw-semibold);color:var(--text-primary)">${Utils.escHtml(title)}</h2>
          ${subtitle ? `<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:4px">${Utils.escHtml(subtitle)}</p>` : ''}
        </div>
        <button class="modal-close sp-close" aria-label="Close panel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="side-panel-content">${body}</div>
      ${footer ? `<div class="side-panel-footer">${footer}</div>` : ''}
    `;

    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('open'));
    drawerOverlay?.classList.add('visible');

    panel.querySelector('.sp-close')?.addEventListener('click', () => close(id, onClose));
    drawerOverlay?.addEventListener('click', () => close(id, onClose), { once: true });
  }

  function close(id, onClose) {
    const panel = document.getElementById(id);
    const drawerOverlay = document.getElementById('drawer-overlay');
    panel?.classList.remove('open');
    drawerOverlay?.classList.remove('visible');
    setTimeout(() => panel?.remove(), 400);
    onClose?.();
  }

  return { open, close };
})();

/* ── SKELETON ────────────────────────────────────────────── */
const Skeleton = (() => {

  function cardSkeleton() {
    return `
      <div class="card" style="gap:var(--space-4)">
        <div class="skeleton skeleton-title" style="width:40%;height:18px;margin-bottom:var(--space-3)"></div>
        <div class="skeleton skeleton-text" style="width:100%;height:12px"></div>
        <div class="skeleton skeleton-text" style="width:80%;height:12px"></div>
        <div class="skeleton skeleton-text" style="width:60%;height:12px"></div>
      </div>`;
  }

  function tableSkeleton(rows = 5, cols = 6) {
    const row = `<tr>${Array(cols).fill(`<td><div class="skeleton" style="height:14px;border-radius:4px"></div></td>`).join('')}</tr>`;
    return `<div class="table-container"><table class="data-table"><tbody>${Array(rows).fill(row).join('')}</tbody></table></div>`;
  }

  function kpiSkeleton(count = 4) {
    return `<div class="kpi-grid">${Array(count).fill(`
      <div class="kpi-card">
        <div class="skeleton" style="width:40px;height:40px;border-radius:10px;margin-bottom:var(--space-4)"></div>
        <div class="skeleton" style="width:60%;height:32px;margin-bottom:var(--space-2)"></div>
        <div class="skeleton" style="width:80%;height:12px"></div>
      </div>`).join('')}</div>`;
  }

  return { cardSkeleton, tableSkeleton, kpiSkeleton };
})();

/* ── TABS ────────────────────────────────────────────────── */
const Tabs = (() => {

  function init(containerEl) {
    const tabItems  = containerEl.querySelectorAll('.tab-item');
    const tabPanels = containerEl.querySelectorAll('.tab-panel');

    tabItems.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabItems.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tabPanels[i]?.classList.add('active');
      });
    });

    // Init first tab
    if (tabItems[0] && !containerEl.querySelector('.tab-item.active')) {
      tabItems[0].classList.add('active');
      tabPanels[0]?.classList.add('active');
    }
  }

  return { init };
})();

/* ── DROPDOWN ────────────────────────────────────────────── */
const Dropdown = (() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
    }
  });

  function init(triggerEl, menuEl) {
    triggerEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuEl.classList.toggle('open');
      document.querySelectorAll('.dropdown-menu.open').forEach(m => { if (m !== menuEl) m.classList.remove('open'); });
    });
  }

  return { init };
})();

window.Toast = Toast;
window.Modal = Modal;
window.SidePanel = SidePanel;
window.Skeleton = Skeleton;
window.Tabs = Tabs;
window.Dropdown = Dropdown;
