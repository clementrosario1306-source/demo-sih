/**
 * GOVNEXA — API Service Layer
 * All backend communication goes through this module.
 * Frontend NEVER makes compliance decisions.
 * Backend is the single source of truth.
 */

'use strict';

const API = (() => {

  const BASE_URL = '/api';

  /** Core fetch wrapper */
  async function request(method, endpoint, body = null, opts = {}) {
    const token = Auth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...opts.headers
    };

    const config = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {})
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      // Session expired
      if (response.status === 401) {
        Auth.logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(response.status, errorData.message || 'Request failed', errorData);
      }

      if (response.status === 204) return null;
      return await response.json();

    } catch (err) {
      if (err instanceof APIError) throw err;
      throw new APIError(0, 'Network error. Please check your connection.', {});
    }
  }

  function get(endpoint, opts)       { return request('GET',    endpoint, null,  opts); }
  function post(endpoint, body, opts){ return request('POST',   endpoint, body,  opts); }
  function put(endpoint, body, opts) { return request('PUT',    endpoint, body,  opts); }
  function patch(endpoint, body, opts){ return request('PATCH', endpoint, body,  opts); }
  function del(endpoint, opts)       { return request('DELETE', endpoint, null,  opts); }

  /** File upload */
  async function upload(endpoint, formData) {
    const token = Auth.getToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new APIError(response.status, err.message || 'Upload failed', err);
    }
    return response.json();
  }

  // ─── Auth ──────────────────────────────────────────────────
  const auth = {
    login:  (creds) => post('/auth/login', creds),
    logout: ()      => post('/auth/logout'),
    me:     ()      => get('/auth/me'),
    refresh:()      => post('/auth/refresh'),
  };

  // ─── Tenders ───────────────────────────────────────────────
  const tenders = {
    list:    (params) => get(`/tenders?${new URLSearchParams(params || {})}`),
    get:     (id)     => get(`/tenders/${id}`),
    create:  (data)   => post('/tenders', data),
    update:  (id, d)  => put(`/tenders/${id}`, d),
    delete:  (id)     => del(`/tenders/${id}`),
    publish: (id)     => post(`/tenders/${id}/publish`),
    uploadPDF: (id, f) => upload(`/tenders/${id}/document`, f),
    extractRequirements: (id) => post(`/tenders/${id}/extract`),
    getRequirements: (id)     => get(`/tenders/${id}/requirements`),
    updateRequirement: (tid, rid, d) => put(`/tenders/${tid}/requirements/${rid}`, d),
    addRequirement:    (tid, d)      => post(`/tenders/${tid}/requirements`, d),
    deleteRequirement: (tid, rid)    => del(`/tenders/${tid}/requirements/${rid}`),
  };

  // ─── Bids ──────────────────────────────────────────────────
  const bids = {
    list:    (tenderId, params) => get(`/tenders/${tenderId}/bids?${new URLSearchParams(params || {})}`),
    get:     (id)   => get(`/bids/${id}`),
    create:  (d)    => post('/bids', d),
    update:  (id,d) => put(`/bids/${id}`, d),
    submit:  (id)   => post(`/bids/${id}/submit`),
    saveDraft:(id)  => post(`/bids/${id}/draft`),
    precheck: (id)  => post(`/bids/${id}/precheck`),
  };

  // ─── Documents ─────────────────────────────────────────────
  const documents = {
    list:     (bidId)      => get(`/bids/${bidId}/documents`),
    get:      (bidId, docId) => get(`/bids/${bidId}/documents/${docId}`),
    upload:   (bidId, docType, formData) => upload(`/bids/${bidId}/documents/${docType}`, formData),
    replace:  (bidId, docId, formData)   => upload(`/bids/${bidId}/documents/${docId}/replace`, formData),
    delete:   (bidId, docId) => del(`/bids/${bidId}/documents/${docId}`),
    versions: (bidId, docId) => get(`/bids/${bidId}/documents/${docId}/versions`),
    extracted:(bidId, docId) => get(`/bids/${bidId}/documents/${docId}/extracted`),
  };

  // ─── Verification ──────────────────────────────────────────
  const verification = {
    run:     (bidId)      => post(`/bids/${bidId}/verify`),
    status:  (bidId)      => get(`/bids/${bidId}/verify/status`),
    history: (bidId)      => get(`/bids/${bidId}/verify/history`),
    getByRun:(bidId, runId)=> get(`/bids/${bidId}/verify/runs/${runId}`),
  };

  // ─── Compliance ────────────────────────────────────────────
  const compliance = {
    get:          (bidId)       => get(`/bids/${bidId}/compliance`),
    getRequirement:(bidId, reqId)=> get(`/bids/${bidId}/compliance/${reqId}`),
    score:        (bidId)       => get(`/bids/${bidId}/score`),
    risk:         (bidId)       => get(`/bids/${bidId}/risk`),
    evidence:     (bidId)       => get(`/bids/${bidId}/evidence`),
    evidenceItem: (bidId, reqId)=> get(`/bids/${bidId}/evidence/${reqId}`),
    discrepancies:(bidId)       => get(`/bids/${bidId}/discrepancies`),
    crossVerify:  (bidId, reqId)=> get(`/bids/${bidId}/cross-verify/${reqId}`),
  };

  // ─── Decision ──────────────────────────────────────────────
  const decisions = {
    get:    (bidId) => get(`/bids/${bidId}/decision`),
    submit: (bidId, d) => post(`/bids/${bidId}/decision`, d),
  };

  // ─── Clarification ─────────────────────────────────────────
  const clarifications = {
    list:    (bidId)       => get(`/bids/${bidId}/clarifications`),
    create:  (bidId, d)    => post(`/bids/${bidId}/clarifications`, d),
    respond: (bidId, clId, d) => post(`/bids/${bidId}/clarifications/${clId}/respond`, d),
    close:   (bidId, clId) => post(`/bids/${bidId}/clarifications/${clId}/close`),
  };

  // ─── Audit ─────────────────────────────────────────────────
  const audit = {
    bid:    (bidId, params)   => get(`/bids/${bidId}/audit?${new URLSearchParams(params || {})}`),
    tender: (tenderId, params) => get(`/tenders/${tenderId}/audit?${new URLSearchParams(params || {})}`),
    system: (params)           => get(`/audit?${new URLSearchParams(params || {})}`),
  };

  // ─── Reports ───────────────────────────────────────────────
  const reports = {
    generate:  (bidId, format) => post(`/bids/${bidId}/report`, { format }),
    download:  (reportId)      => `${BASE_URL}/reports/${reportId}/download`,
    list:      ()              => get('/reports'),
  };

  // ─── Admin ─────────────────────────────────────────────────
  const admin = {
    users: {
      list:   (p) => get(`/admin/users?${new URLSearchParams(p || {})}`),
      get:    (id) => get(`/admin/users/${id}`),
      create: (d)  => post('/admin/users', d),
      update: (id,d)=> put(`/admin/users/${id}`, d),
      delete: (id) => del(`/admin/users/${id}`),
    },
    rules: {
      list:       (p) => get(`/admin/rules?${new URLSearchParams(p || {})}`),
      get:        (id) => get(`/admin/rules/${id}`),
      create:     (d)  => post('/admin/rules', d),
      update:     (id,d)=> put(`/admin/rules/${id}`, d),
      toggle:     (id, active) => patch(`/admin/rules/${id}`, { active }),
      simulate:   (id, d)     => post(`/admin/rules/${id}/simulate`, d),
      history:    (id) => get(`/admin/rules/${id}/history`),
    },
    connectors: {
      list:   () => get('/admin/connectors'),
      get:    (name) => get(`/admin/connectors/${name}`),
      update: (name, d) => put(`/admin/connectors/${name}`, d),
      test:   (name)   => post(`/admin/connectors/${name}/test`),
    },
    auditLogs: (p) => get(`/admin/audit?${new URLSearchParams(p || {})}`),
  };

  // ─── Bidder ────────────────────────────────────────────────
  const bidder = {
    profile:    ()    => get('/bidder/profile'),
    updateProfile:(d) => put('/bidder/profile', d),
    myBids:     (p)   => get(`/bidder/bids?${new URLSearchParams(p || {})}`),
    availableTenders: (p) => get(`/tenders/available?${new URLSearchParams(p || {})}`),
  };

  return {
    request, get, post, put, patch, del, upload,
    auth, tenders, bids, documents, verification,
    compliance, decisions, clarifications, audit,
    reports, admin, bidder
  };

  class APIError extends Error {
    constructor(status, message, data) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }
})();

/** Custom API Error for structured error handling */
class APIError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

window.API = API;
window.APIError = APIError;
