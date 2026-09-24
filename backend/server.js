/**
 * GOVNEXA — Unified Backend Server (API & Static File Server)
 * Built with native Node.js (Zero external dependencies needed)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 8000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// In-memory Database Store initialized with realistic GOVNEXA demo data
const DB = {
  users: [
    { id: 'USR-001', email: 'officer@govnexa.in', password: 'officer123', role: 'officer', name: 'Arjun Mehta', org: 'Dept. of Public Procurement' },
    { id: 'USR-002', email: 'bidder@govnexa.in', password: 'bidder123', role: 'bidder', name: 'Priya Nair', org: 'ABC Technologies Pvt Ltd' },
    { id: 'USR-003', email: 'admin@govnexa.in', password: 'admin123', role: 'admin', name: 'Sanjay Verma', org: 'TENDERLENZZ System Admin' }
  ],
  tenders: [
    { id: 'T-2026-001', title: 'Supply of IT Equipment', dept: 'Dept. of Public Procurement', created: '2026-09-01', deadline: '2026-09-24', bidders: 5, status: 'active', value: '₹4.2 Cr', description: 'Procurement of enterprise laptops, workstations, and network switches.' },
    { id: 'T-2026-002', title: 'Network Infrastructure Upgrade', dept: 'Ministry of Electronics', created: '2026-09-05', deadline: '2026-09-30', bidders: 3, status: 'active', value: '₹8.7 Cr', description: 'Upgrading core routers, firewalls, and campus-wide optical fiber backbones.' },
    { id: 'T-2026-003', title: 'Smart City Sensors Deployment', dept: 'Urban Development', created: '2026-08-20', deadline: '2026-09-15', bidders: 7, status: 'under_review', value: '₹12.1 Cr', description: 'IoT environmental monitoring and automated traffic signal sensors.' },
    { id: 'T-2026-004', title: 'Cloud Storage Services', dept: 'NIC', created: '2026-08-10', deadline: '2026-09-10', bidders: 9, status: 'closed', value: '₹2.8 Cr', description: 'High-availability secure multi-zone cloud storage tier.' },
    { id: 'T-2026-005', title: 'Cybersecurity Audit Services', dept: 'CERT-In', created: '2026-07-15', deadline: '2026-08-15', bidders: 4, status: 'awarded', value: '₹1.5 Cr', description: 'Comprehensive vulnerability assessment and penetration testing.' },
    { id: 'T-2026-006', title: 'ERP System Implementation', dept: 'Dept. of Finance', created: '2026-09-10', deadline: '2026-10-10', bidders: 0, status: 'draft', value: '₹15.0 Cr', description: 'Integrated financial planning, payroll, and asset management solution.' }
  ],
  bids: [
    {
      id: 'BID-001',
      bidderName: 'ABC Technologies Pvt Ltd',
      bidderEmail: 'bidder@govnexa.in',
      tenderId: 'T-2026-001',
      tenderTitle: 'Supply of IT Equipment',
      submittedAt: '2026-09-22T10:25:00',
      status: 'under_review',
      score: 78,
      risk: 'medium',
      financialQuote: '₹3,95,00,000',
      msme: true,
      startup: false,
      nsic: true,
      compliance: {
        'GST Certificate': { status: 'verified', score: 15, mandatory: true, notes: 'Active 27AABCT3518Q1ZS verified via GSTN API.' },
        'Udyam/MSME Certificate': { status: 'verified', score: 10, mandatory: false, notes: 'Valid UDYAM-MH-01-0023412 verified.' },
        'PAN Card': { status: 'verified', score: 10, mandatory: true, notes: 'Matched with MCA records.' },
        'Income Tax Return': { status: 'review_required', score: 6, mandatory: true, notes: 'AY 2025-26 uploaded, AY 2024-25 pending confirmation.' },
        'OEM Authorization': { status: 'non_compliant', score: 0, mandatory: true, notes: 'Validity expired on 2026-08-31.' },
        'EPFO': { status: 'verified', score: 5, mandatory: true, notes: 'Challan verified with EPFO portal.' },
        'ESIC': { status: 'verified', score: 5, mandatory: true, notes: 'Monthly return verified.' },
        'Local Content Declaration': { status: 'review_required', score: 3, mandatory: true, notes: 'Self-declaration format version 2.1 mismatch.' },
        'BIS Certificate': { status: 'verified', score: 10, mandatory: false, notes: 'Valid until 2028.' },
        'Startup Certificate': { status: 'verified', score: 5, mandatory: false, notes: 'DPIIT recognized.' },
        'NSIC Certificate': { status: 'verified', score: 5, mandatory: false, notes: 'Valid.' },
        'Company Incorporation/MCA': { status: 'verified', score: 5, mandatory: true, notes: 'CIN matched with MCA21 registry.' },
        'Blacklisting Declaration': { status: 'verified', score: 5, mandatory: true, notes: 'Affidavit notarized.' },
        'Financial/Turnover Certificate': { status: 'verified', score: 5, mandatory: true, notes: 'CA certified turnover of ₹18.5 Cr.' }
      }
    },
    {
      id: 'BID-002',
      bidderName: 'Global Infra Solutions',
      bidderEmail: 'contact@globalinfra.com',
      tenderId: 'T-2026-001',
      tenderTitle: 'Supply of IT Equipment',
      submittedAt: '2026-09-22T09:10:00',
      status: 'verified',
      score: 91,
      risk: 'low',
      financialQuote: '₹4,10,00,000',
      msme: false,
      startup: false,
      nsic: false
    }
  ],
  rules: [
    { id: 'RULE-01', name: 'Mandatory GST Validation', active: true, category: 'Eligibility', severity: 'Critical', weight: 15 },
    { id: 'RULE-02', name: 'OEM Authorization Verification', active: true, category: 'Technical', severity: 'High', weight: 20 },
    { id: 'RULE-03', name: '3-Year Minimum Turnover Rule', active: true, category: 'Financial', severity: 'High', weight: 15 },
    { id: 'RULE-04', name: 'MSME Exemption Verification', active: true, category: 'Preference', severity: 'Medium', weight: 10 }
  ],
  connectors: [
    { name: 'GSTN Gateway', status: 'connected', latency: '42ms', lastSync: '2026-09-23T18:30:00' },
    { name: 'MCA21 Registry', status: 'connected', latency: '88ms', lastSync: '2026-09-23T18:15:00' },
    { name: 'EPFO Verification API', status: 'connected', latency: '110ms', lastSync: '2026-09-23T18:00:00' },
    { name: 'DigiLocker Govt Vault', status: 'connected', latency: '65ms', lastSync: '2026-09-23T18:20:00' }
  ],
  auditLogs: [
    { id: 'LOG-1001', timestamp: '2026-09-23T18:45:10', user: 'officer@govnexa.in', action: 'EVALUATION_TRIGGERED', details: 'Automated compliance evaluation triggered for BID-001' },
    { id: 'LOG-1002', timestamp: '2026-09-23T18:40:22', user: 'bidder@govnexa.in', action: 'DOC_UPLOAD', details: 'Uploaded revised GST Certificate (v2)' },
    { id: 'LOG-1003', timestamp: '2026-09-23T17:15:00', user: 'admin@govnexa.in', action: 'RULE_UPDATED', details: 'Updated weight for RULE-02 to 20%' }
  ]
};

// Helper: Read JSON request body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Helper: JSON response sender
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper: Static file server
function serveStaticFile(req, res, pathname) {
  let safePath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(FRONTEND_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA or return 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

// Request Handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Handle API Endpoints
  if (pathname.startsWith('/api/')) {
    const apiPath = pathname.replace('/api', '');

    try {
      // 1. Auth routes
      if (apiPath === '/auth/login' && method === 'POST') {
        const body = await parseRequestBody(req);
        const user = DB.users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase() && u.password === body.password);
        if (user) {
          const token = 'jwt-token-' + crypto.randomBytes(16).toString('hex');
          return sendJSON(res, 200, {
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, org: user.org }
          });
        }
        return sendJSON(res, 401, { message: 'Invalid credentials. Use officer@govnexa.in / officer123' });
      }

      if (apiPath === '/auth/me' && method === 'GET') {
        return sendJSON(res, 200, DB.users[0]);
      }

      if (apiPath === '/auth/logout' && method === 'POST') {
        return sendJSON(res, 200, { message: 'Logged out successfully' });
      }

      // 2. Tenders routes
      if (apiPath === '/tenders' || apiPath.startsWith('/tenders?')) {
        if (method === 'GET') return sendJSON(res, 200, DB.tenders);
        if (method === 'POST') {
          const body = await parseRequestBody(req);
          const newTender = {
            id: `T-2026-${String(DB.tenders.length + 1).padStart(3, '0')}`,
            created: new Date().toISOString().split('T')[0],
            bidders: 0,
            status: 'active',
            ...body
          };
          DB.tenders.push(newTender);
          return sendJSON(res, 201, newTender);
        }
      }

      if (apiPath.startsWith('/tenders/')) {
        const parts = apiPath.split('/');
        const tenderId = parts[2];
        const tender = DB.tenders.find(t => t.id === tenderId);

        if (parts.length === 3) {
          if (method === 'GET') {
            return tender ? sendJSON(res, 200, tender) : sendJSON(res, 404, { message: 'Tender not found' });
          }
          if (method === 'PUT') {
            const body = await parseRequestBody(req);
            Object.assign(tender, body);
            return sendJSON(res, 200, tender);
          }
        }

        if (parts[3] === 'publish' && method === 'POST') {
          if (tender) tender.status = 'active';
          return sendJSON(res, 200, { message: 'Tender published successfully', tender });
        }

        if (parts[3] === 'bids' && method === 'GET') {
          const bids = DB.bids.filter(b => b.tenderId === tenderId);
          return sendJSON(res, 200, bids);
        }
      }

      // 3. Bids & Compliance routes
      if (apiPath === '/bids' && method === 'GET') {
        return sendJSON(res, 200, DB.bids);
      }

      if (apiPath.startsWith('/bids/')) {
        const parts = apiPath.split('/');
        const bidId = parts[2];
        const bid = DB.bids.find(b => b.id === bidId) || DB.bids[0];

        if (parts.length === 3 && method === 'GET') {
          return sendJSON(res, 200, bid);
        }

        if (parts[3] === 'compliance') {
          return sendJSON(res, 200, bid.compliance || {});
        }

        if (parts[3] === 'score') {
          return sendJSON(res, 200, { score: bid.score || 85, breakdown: { eligibility: 40, technical: 30, financial: 15 } });
        }

        if (parts[3] === 'risk') {
          return sendJSON(res, 200, { risk: bid.risk || 'low', flags: ['OEM authorization certificate nearing expiration'] });
        }

        if (parts[3] === 'verify') {
          return sendJSON(res, 200, { status: 'completed', score: bid.score, evaluatedAt: new Date().toISOString() });
        }
      }

      // 4. Admin routes
      if (apiPath.startsWith('/admin/users')) {
        return sendJSON(res, 200, DB.users);
      }

      if (apiPath.startsWith('/admin/rules')) {
        return sendJSON(res, 200, DB.rules);
      }

      if (apiPath.startsWith('/admin/connectors')) {
        return sendJSON(res, 200, DB.connectors);
      }

      if (apiPath.startsWith('/admin/audit') || apiPath.startsWith('/audit')) {
        return sendJSON(res, 200, DB.auditLogs);
      }

      // 5. Bidder profile
      if (apiPath.startsWith('/bidder/profile')) {
        return sendJSON(res, 200, {
          companyName: 'ABC Technologies Pvt Ltd',
          gstin: '27AABCT3518Q1ZS',
          pan: 'AABCT3518Q',
          udyam: 'UDYAM-MH-01-0023412',
          turnover: '₹18.5 Cr',
          verified: true
        });
      }

      // Default fallback for any unspecified API endpoint
      return sendJSON(res, 200, { success: true, message: `Endpoint ${apiPath} handled`, timestamp: new Date().toISOString() });

    } catch (apiErr) {
      return sendJSON(res, 500, { error: apiErr.message });
    }
  }

  // Static frontend delivery
  serveStaticFile(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` TENDERLENZZ Full-Stack Server Running`);
  console.log(` Frontend & API: http://localhost:${PORT}`);
  console.log(` API Base:       http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});
