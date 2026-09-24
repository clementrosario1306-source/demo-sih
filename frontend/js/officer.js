/**
 * GOVNEXA — Demo Data Store
 * Shared across all pages for consistent demo experience
 */

'use strict';

const DemoData = (() => {

  const TENDERS = [
    { id: 'T-2026-001', title: 'Supply of IT Equipment', dept: 'Dept. of Public Procurement', created: '2026-09-01', deadline: '2026-09-24', bidders: 5, status: 'active', value: '₹4.2 Cr' },
    { id: 'T-2026-002', title: 'Network Infrastructure Upgrade', dept: 'Ministry of Electronics', created: '2026-09-05', deadline: '2026-09-30', bidders: 3, status: 'active', value: '₹8.7 Cr' },
    { id: 'T-2026-003', title: 'Smart City Sensors Deployment', dept: 'Urban Development', created: '2026-08-20', deadline: '2026-09-15', bidders: 7, status: 'under_review', value: '₹12.1 Cr' },
    { id: 'T-2026-004', title: 'Cloud Storage Services', dept: 'NIC', created: '2026-08-10', deadline: '2026-09-10', bidders: 9, status: 'closed', value: '₹2.8 Cr' },
    { id: 'T-2026-005', title: 'Cybersecurity Audit Services', dept: 'CERT-In', created: '2026-07-15', deadline: '2026-08-15', bidders: 4, status: 'awarded', value: '₹1.5 Cr' },
    { id: 'T-2026-006', title: 'ERP System Implementation', dept: 'Dept. of Finance', created: '2026-09-10', deadline: '2026-10-10', bidders: 0, status: 'draft', value: '₹15.0 Cr' },
  ];

  const BIDDERS = [
    {
      id: 'BID-001', name: 'ABC Technologies Pvt Ltd', tender: 'T-2026-001',
      submitted: '2026-09-22T10:25:00', docs: 14, docsComplete: 14,
      score: 78, risk: 'medium', status: 'under_review',
      msme: true, startup: false, nsic: true,
      compliance: {
        'GST Certificate':                  { status: 'verified',       score: 15, mandatory: true },
        'Udyam/MSME Certificate':           { status: 'verified',       score: 10, mandatory: false },
        'PAN Card':                         { status: 'verified',       score: 10, mandatory: true },
        'Income Tax Return':                { status: 'review_required',score: 6,  mandatory: true },
        'OEM Authorization':                { status: 'non_compliant',  score: 0,  mandatory: true },
        'EPFO':                             { status: 'verified',       score: 5,  mandatory: true },
        'ESIC':                             { status: 'verified',       score: 5,  mandatory: true },
        'Local Content Declaration':        { status: 'review_required',score: 3,  mandatory: true },
        'BIS Certificate':                  { status: 'verified',       score: 10, mandatory: false },
        'Startup Certificate':              { status: 'verified',       score: 5,  mandatory: false },
        'NSIC Certificate':                 { status: 'verified',       score: 5,  mandatory: false },
        'Company Incorporation/MCA':        { status: 'verified',       score: 5,  mandatory: true },
        'Blacklisting Declaration':         { status: 'verified',       score: 5,  mandatory: true },
        'Financial/Turnover Certificate':   { status: 'verified',       score: 5,  mandatory: true },
      }
    },
    {
      id: 'BID-002', name: 'Global Infra Solutions', tender: 'T-2026-001',
      submitted: '2026-09-22T09:10:00', docs: 14, docsComplete: 14,
      score: 91, risk: 'low', status: 'verified',
      msme: false, startup: false, nsic: false,
    },
    {
      id: 'BID-003', name: 'Sunrise Industries', tender: 'T-2026-001',
      submitted: '2026-09-22T11:30:00', docs: 12, docsComplete: 12,
      score: 64, risk: 'high', status: 'under_review',
      msme: true, startup: false, nsic: false,
    },
    {
      id: 'BID-004', name: 'Techno Build Ltd', tender: 'T-2026-001',
      submitted: '2026-09-22T08:45:00', docs: 14, docsComplete: 14,
      score: 82, risk: 'medium', status: 'under_review',
      msme: false, startup: false, nsic: true,
    },
    {
      id: 'BID-005', name: 'National Traders', tender: 'T-2026-001',
      submitted: '2026-09-22T12:00:00', docs: 11, docsComplete: 11,
      score: 55, risk: 'critical', status: 'under_review',
      msme: true, startup: false, nsic: false,
    },
  ];

  const REQUIREMENTS = [
    { id: 'REQ-01', name: 'GST Registration', category: 'Statutory',  mandatory: true,  threshold: 'ACTIVE',   evidence: 'GST Certificate',   method: 'GST Portal API',  status: 'active' },
    { id: 'REQ-02', name: 'MSME/Udyam',       category: 'MSME',       mandatory: false, threshold: 'VALID',    evidence: 'Udyam Certificate', method: 'Udyam Portal',    status: 'active' },
    { id: 'REQ-03', name: 'PAN Verification',  category: 'Statutory',  mandatory: true,  threshold: 'ACTIVE',   evidence: 'PAN Card',          method: 'PAN API',         status: 'active' },
    { id: 'REQ-04', name: 'Income Tax Filing', category: 'Financial',  mandatory: true,  threshold: 'AY 2024-25', evidence: 'ITR Copy',          method: 'Manual Check',    status: 'active' },
    { id: 'REQ-05', name: 'OEM Authorization', category: 'Technical',  mandatory: true,  threshold: 'VALID',    evidence: 'OEM Letter',        method: 'Manual Verify',   status: 'active' },
    { id: 'REQ-06', name: 'EPFO Compliance',   category: 'Labour',     mandatory: true,  threshold: 'ACTIVE',   evidence: 'EPFO Certificate',  method: 'EPFO API',        status: 'active' },
    { id: 'REQ-07', name: 'ESIC Compliance',   category: 'Labour',     mandatory: true,  threshold: 'ACTIVE',   evidence: 'ESIC Certificate',  method: 'ESIC API',        status: 'active' },
    { id: 'REQ-08', name: 'Local Content',     category: 'Policy',     mandatory: true,  threshold: '≥ 20%',    evidence: 'Declaration Form',  method: 'Rule Engine',     status: 'active' },
    { id: 'REQ-09', name: 'BIS Certification', category: 'Technical',  mandatory: false, threshold: 'VALID',    evidence: 'BIS Certificate',   method: 'BIS Portal',      status: 'active' },
    { id: 'REQ-10', name: 'Startup India',     category: 'Policy',     mandatory: false, threshold: 'ACTIVE',   evidence: 'DPIIT Certificate', method: 'DPIIT API',       status: 'active' },
    { id: 'REQ-11', name: 'NSIC Registration', category: 'MSME',       mandatory: false, threshold: 'VALID',    evidence: 'NSIC Certificate',  method: 'NSIC Portal',     status: 'active' },
    { id: 'REQ-12', name: 'MCA Incorporation', category: 'Corporate',  mandatory: true,  threshold: 'ACTIVE',   evidence: 'COI Document',      method: 'MCA21 API',       status: 'active' },
  ];

  const DISCREPANCIES = [
    {
      id: 'DISC-001', severity: 'critical', requirement: 'OEM Authorization', bidder: 'ABC Technologies Pvt Ltd',
      reason: 'No valid OEM authorization document found. Document uploaded appears to be a purchase order, not an authorization letter.',
      status: 'open', date: '2026-09-22T10:27:00', tender: 'T-2026-001'
    },
    {
      id: 'DISC-002', severity: 'high', requirement: 'GSTIN Entity Name Mismatch', bidder: 'ABC Technologies Pvt Ltd',
      reason: 'GST record shows "ABC Technology Private Limited" while bid submission uses "ABC Technologies Pvt Ltd". Potential name discrepancy.',
      status: 'open', date: '2026-09-22T10:26:00', tender: 'T-2026-001'
    },
    {
      id: 'DISC-003', severity: 'medium', requirement: 'Local Content Declaration', bidder: 'ABC Technologies Pvt Ltd',
      reason: 'Declared local content is 18% which is below the mandatory 20% threshold. Verification required.',
      status: 'pending_clarification', date: '2026-09-22T10:28:00', tender: 'T-2026-001'
    },
    {
      id: 'DISC-004', severity: 'medium', requirement: 'Address Variation', bidder: 'Sunrise Industries',
      reason: 'Registered address in GST certificate does not match address provided in tender submission.',
      status: 'open', date: '2026-09-22T11:30:00', tender: 'T-2026-001'
    },
    {
      id: 'DISC-005', severity: 'low', requirement: 'Income Tax Return', bidder: 'ABC Technologies Pvt Ltd',
      reason: 'ITR for AY 2024-25 not yet filed. Previous year ITR provided. Filing deadline may not have passed.',
      status: 'under_review', date: '2026-09-22T10:25:00', tender: 'T-2026-001'
    },
    {
      id: 'DISC-006', severity: 'high', requirement: 'OEM Authorization', bidder: 'Sunrise Industries',
      reason: 'OEM authorization expired 3 months ago. Valid authorization required.',
      status: 'open', date: '2026-09-22T11:32:00', tender: 'T-2026-001'
    },
  ];

  const AUDIT_EVENTS = [
    { time: '10:42', user: 'Arjun Mehta', role: 'officer', action: 'Reviewed compliance report', entity: 'ABC Technologies Pvt Ltd', status: 'info' },
    { time: '10:32', user: 'System',      role: 'system',  action: 'Verification Run #3 completed', entity: 'T-2026-001', status: 'success' },
    { time: '10:28', user: 'System',      role: 'system',  action: 'Discrepancy flagged — Local Content below threshold', entity: 'ABC Technologies', status: 'warning' },
    { time: '10:27', user: 'System',      role: 'system',  action: 'OEM Authorization missing — critical flag', entity: 'ABC Technologies', status: 'error' },
    { time: '10:26', user: 'System',      role: 'system',  action: 'Risk calculated — Medium Risk (Score: 78)', entity: 'ABC Technologies', status: 'warning' },
    { time: '10:25', user: 'Priya Nair',  role: 'bidder',  action: 'Bid submitted', entity: 'T-2026-001', status: 'info' },
    { time: '10:22', user: 'Priya Nair',  role: 'bidder',  action: 'Document replaced — OEM_Certificate_v3.pdf', entity: 'OEM Authorization', status: 'info' },
    { time: '10:15', user: 'System',      role: 'system',  action: 'GST Certificate verified — ACTIVE', entity: 'ABC Technologies', status: 'success' },
    { time: '10:10', user: 'System',      role: 'system',  action: 'Document OCR completed — 97% confidence', entity: 'GST_Certificate.pdf', status: 'success' },
    { time: '10:05', user: 'System',      role: 'system',  action: 'Tender PDF requirements extracted — 12 requirements', entity: 'T-2026-001', status: 'success' },
    { time: '10:02', user: 'Arjun Mehta', role: 'officer', action: 'Tender published', entity: 'T-2026-001', status: 'success' },
    { time: '09:50', user: 'Arjun Mehta', role: 'officer', action: 'Requirements approved', entity: 'T-2026-001', status: 'success' },
    { time: '09:40', user: 'System',      role: 'system',  action: 'Tender PDF uploaded and parsed', entity: 'T-2026-001', status: 'success' },
    { time: '09:35', user: 'Arjun Mehta', role: 'officer', action: 'Tender created', entity: 'T-2026-001', status: 'info' },
  ];

  const SCORE_BREAKDOWN = [
    { name: 'GST Certificate',         score: 15, max: 15, positive: true },
    { name: 'Udyam/MSME Certificate',  score: 10, max: 10, positive: true },
    { name: 'PAN Card',                score: 10, max: 10, positive: true },
    { name: 'Income Tax Return',       score: 6,  max: 10, positive: true },
    { name: 'EPFO',                    score: 5,  max: 5,  positive: true },
    { name: 'ESIC',                    score: 5,  max: 5,  positive: true },
    { name: 'BIS Certificate',         score: 10, max: 10, positive: true },
    { name: 'Startup Certificate',     score: 5,  max: 5,  positive: true },
    { name: 'NSIC Certificate',        score: 5,  max: 5,  positive: true },
    { name: 'MCA Incorporation',       score: 5,  max: 5,  positive: true },
    { name: 'Blacklisting Declaration',score: 5,  max: 5,  positive: true },
    { name: 'Turnover Certificate',    score: 5,  max: 5,  positive: true },
    { name: 'OEM Authorization',       score: -20, max: 20, positive: false },
    { name: 'Local Content Below 20%', score: -7,  max: 10, positive: false },
    { name: 'Entity Name Discrepancy', score: -5,  max: 5,  positive: false },
  ];

  function getTenders() {
    try {
      const stored = JSON.parse(localStorage.getItem('govnexa_custom_tenders') || '[]');
      return [...stored, ...TENDERS];
    } catch {
      return TENDERS;
    }
  }

  function addTender(newTender) {
    try {
      const stored = JSON.parse(localStorage.getItem('govnexa_custom_tenders') || '[]');
      stored.unshift(newTender);
      localStorage.setItem('govnexa_custom_tenders', JSON.stringify(stored));
    } catch (e) {
      console.error(e);
    }
  }

  return {
    get TENDERS() { return getTenders(); },
    getTenders,
    addTender,
    BIDDERS,
    REQUIREMENTS,
    DISCREPANCIES,
    AUDIT_EVENTS,
    SCORE_BREAKDOWN
  };
})();

window.DemoData = DemoData;
