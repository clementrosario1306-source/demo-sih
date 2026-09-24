/**
 * GOVNEXA — Admin Support Module
 */

'use strict';

const AdminData = (() => {
  const USERS = [
    { id: 'USR-001', name: 'Dr. Vikram Sethi', email: 'vikram.sethi@gov.in', role: 'admin', dept: 'NIC / Central Admin', status: 'active', lastLogin: 'Today, 10:45 AM' },
    { id: 'USR-002', name: 'Arjun Mehta', email: 'arjun.mehta@procure.gov.in', role: 'officer', dept: 'Dept. of Public Procurement', status: 'active', lastLogin: 'Today, 10:42 AM' },
    { id: 'USR-003', name: 'Priya Nair', email: 'priya.nair@abctech.in', role: 'bidder', dept: 'ABC Technologies Pvt Ltd', status: 'active', lastLogin: 'Today, 10:25 AM' },
    { id: 'USR-004', name: 'Rajesh Kumar', email: 'rajesh.k@infra.com', role: 'bidder', dept: 'Global Infra Solutions', status: 'active', lastLogin: 'Yesterday, 16:30 PM' },
    { id: 'USR-005', name: 'Sunita Sharma', email: 'sunita.s@procure.gov.in', role: 'officer', dept: 'Ministry of Electronics', status: 'active', lastLogin: 'Sep 21, 11:20 AM' },
  ];

  const CONNECTORS = [
    { id: 'CONN-01', name: 'GSTN Taxpayer Search API', authority: 'Goods & Services Tax Network', status: 'healthy', uptime: '99.98%', latency: '124 ms', endpoint: 'https://api.gstn.gov.in/v2/taxpayer', lastSync: '2 mins ago' },
    { id: 'CONN-02', name: 'MCA21 Company Master API', authority: 'Ministry of Corporate Affairs', status: 'healthy', uptime: '99.85%', latency: '210 ms', endpoint: 'https://mca21.gov.in/api/v1/company', lastSync: '5 mins ago' },
    { id: 'CONN-03', name: 'EPFO Employer Return Gateway', authority: 'Employees Provident Fund Org', status: 'healthy', uptime: '99.40%', latency: '340 ms', endpoint: 'https://unifiedportal.epfindia.gov.in/api', lastSync: '10 mins ago' },
    { id: 'CONN-04', name: 'ESIC Insured Code Validator', authority: 'Employees State Insurance Corp', status: 'healthy', uptime: '99.70%', latency: '180 ms', endpoint: 'https://esic.gov.in/api/v2/verify', lastSync: '8 mins ago' },
    { id: 'CONN-05', name: 'Udyam MSME Registry Gateway', authority: 'Ministry of MSME', status: 'healthy', uptime: '99.90%', latency: '145 ms', endpoint: 'https://udyamregistration.gov.in/api', lastSync: '1 min ago' },
    { id: 'CONN-06', name: 'DPIIT Startup India API', authority: 'DPIIT / Startup India', status: 'healthy', uptime: '99.95%', latency: '95 ms', endpoint: 'https://api.startupindia.gov.in/v1', lastSync: '4 mins ago' },
  ];

  const SYSTEM_RULES = [
    { id: 'RULE-01', name: 'Mandatory Active GSTIN Gate', category: 'Statutory', condition: 'status == "ACTIVE" && filing_3b == "REGULAR"', weight: 15, hardGate: true },
    { id: 'RULE-02', name: 'Make in India Class II Minimum Threshold', category: 'Policy', condition: 'local_content_pct >= 20.0', weight: 10, hardGate: true },
    { id: 'RULE-03', name: 'OEM Manufacturer Authorization Enforcement', category: 'Technical', condition: 'doc_type == "MAF" && warranty_years >= 3', weight: 20, hardGate: true },
    { id: 'RULE-04', name: 'MSME EMD Exemption Verification', category: 'MSME', condition: 'udyam_active == true && category in ["Micro", "Small"]', weight: 10, hardGate: false },
    { id: 'RULE-05', name: 'Corporate Debarment CVC Blacklist Check', category: 'Integrity', condition: 'cvc_blacklisted == false && geM_debarred == false', weight: 10, hardGate: true },
  ];

  return { USERS, CONNECTORS, SYSTEM_RULES };
})();

window.AdminData = AdminData;
