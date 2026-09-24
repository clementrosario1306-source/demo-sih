/**
 * GOVNEXA — Utility Functions
 * Shared helpers used across all modules
 */

'use strict';

const Utils = (() => {

  /** Format date to display string */
  function formatDate(dateStr, opts = {}) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const defaults = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-IN', { ...defaults, ...opts });
  }

  /** Format datetime */
  function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  /** Format time only */
  function formatTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  /** Relative time */
  function timeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  /** Format file size */
  function formatFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Debounce */
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /** Throttle */
  function throttle(fn, limit = 200) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  }

  /** Deep clone */
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /** Get URL param */
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  /** Set URL param without reload */
  function setParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    history.replaceState({}, '', url);
  }

  /** Generate initials from name */
  function initials(name) {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  /** Sanitize HTML to prevent XSS */
  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** Countdown timer string */
  function countdown(targetDate) {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, status: 'overdue' };
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const status  = days < 1 ? 'critical' : days < 3 ? 'warning' : 'normal';
    return { days, hours, minutes, status };
  }

  /** Score to color class */
  function scoreToColor(score) {
    if (score >= 80) return 'mint';
    if (score >= 60) return 'amber';
    return 'coral';
  }

  /** Risk to badge class */
  function riskToBadge(risk) {
    const map = {
      'low': 'badge-risk-low',
      'medium': 'badge-risk-medium',
      'high': 'badge-risk-high',
      'critical': 'badge-risk-critical'
    };
    return map[(risk || '').toLowerCase()] || 'badge-missing';
  }

  /** Status to badge class */
  function statusToBadge(status) {
    const map = {
      'verified': 'badge-verified',
      'review_required': 'badge-review',
      'review required': 'badge-review',
      'non_compliant': 'badge-noncompliant',
      'non-compliant': 'badge-noncompliant',
      'noncompliant': 'badge-noncompliant',
      'missing': 'badge-missing',
      'processing': 'badge-processing',
      'pending': 'badge-pending',
      'active': 'badge-active',
      'draft': 'badge-draft',
      'closed': 'badge-closed',
      'awarded': 'badge-awarded',
      'cancelled': 'badge-cancelled',
      'under_review': 'badge-review',
      'under review': 'badge-review',
    };
    return map[(status || '').toLowerCase()] || 'badge-missing';
  }

  /** Status to display string */
  function statusLabel(status) {
    const map = {
      'verified': '✓ Verified',
      'review_required': '⚠ Review Required',
      'review required': '⚠ Review Required',
      'non_compliant': '✕ Non-Compliant',
      'non-compliant': '✕ Non-Compliant',
      'missing': '— Missing',
      'processing': '● Processing',
      'pending': '○ Pending',
      'active': 'Active',
      'draft': 'Draft',
      'closed': 'Closed',
      'awarded': 'Awarded',
      'cancelled': 'Cancelled',
      'under_review': '⚠ Under Review',
      'under review': '⚠ Under Review',
    };
    return map[(status || '').toLowerCase()] || status;
  }

  /** Animate counting number */
  function animateCount(el, target, duration = 800) {
    const start = 0;
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  /** Delay */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /** Random between */
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Truncate string */
  function truncate(str, max = 40) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '…' : str;
  }

  /** Download file directly in browser */
  function downloadFile(filename, content, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  return {
    formatDate, formatDateTime, formatTime, timeAgo, formatFileSize,
    debounce, throttle, clone, getParam, setParam, initials, escHtml,
    countdown, scoreToColor, riskToBadge, statusToBadge, statusLabel,
    animateCount, delay, rand, truncate, downloadFile
  };
})();

window.Utils = Utils;
