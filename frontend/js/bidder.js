/**
 * GOVNEXA — Bidder Portal Support Module
 */

'use strict';

const BidderData = (() => {
  const DOCUMENTS_LIST = [
    { id: 'DOC-01', name: 'GST Registration Certificate', required: true, status: 'verified', category: 'Statutory', file: 'GST_Certificate_2026.pdf', size: '482 KB', updated: '2026-09-22 10:15', ocr: '27AABCU9603R1ZM (Active)' },
    { id: 'DOC-02', name: 'PAN Card Copy', required: true, status: 'verified', category: 'Statutory', file: 'Company_PAN.pdf', size: '310 KB', updated: '2026-09-22 10:14', ocr: 'AABCU9603R' },
    { id: 'DOC-03', name: 'Income Tax Return (ITR)', required: true, status: 'review_required', category: 'Financial', file: 'ITR_AY23_24.pdf', size: '1.2 MB', updated: '2026-09-22 10:20', ocr: 'AY 2023-24 Filed' },
    { id: 'DOC-04', name: 'OEM Authorization Form (MAF)', required: true, status: 'non_compliant', category: 'Technical', file: 'OEM_Letter.pdf', size: '320 KB', updated: '2026-09-22 10:22', ocr: 'Purchase Order #99102 (Invalid Type)' },
    { id: 'DOC-05', name: 'EPFO Registration & ECR Challan', required: true, status: 'verified', category: 'Labour', file: 'EPFO_Challan_Aug26.pdf', size: '640 KB', updated: '2026-09-22 10:16', ocr: 'Code: DLCPM0019283000' },
    { id: 'DOC-06', name: 'ESIC Registration Copy', required: true, status: 'verified', category: 'Labour', file: 'ESIC_Registration.pdf', size: '512 KB', updated: '2026-09-22 10:17', ocr: 'Code: 11000293810001001' },
    { id: 'DOC-07', name: 'Make in India Local Content Declaration', required: true, status: 'review_required', category: 'Policy', file: 'MII_Declaration.pdf', size: '450 KB', updated: '2026-09-22 10:24', ocr: '18.2% Local Content' },
    { id: 'DOC-08', name: 'CA Turnover Certificate (3 Years)', required: true, status: 'verified', category: 'Financial', file: 'CA_Turnover_Cert.pdf', size: '890 KB', updated: '2026-09-22 10:18', ocr: 'Avg Turnover ₹4.8 Cr (UDIN 260912A)' },
    { id: 'DOC-09', name: 'Company Incorporation / MCA COI', required: true, status: 'verified', category: 'Corporate', file: 'Certificate_of_Incorporation.pdf', size: '1.1 MB', updated: '2026-09-22 10:12', ocr: 'CIN: U72200DL2018PTC334567' },
    { id: 'DOC-10', name: 'Non-Blacklisting Notarized Affidavit', required: true, status: 'verified', category: 'Compliance', file: 'Non_Blacklisting_Affidavit.pdf', size: '780 KB', updated: '2026-09-22 10:19', ocr: 'Notarized Stamp Paper #AB9910' },
    { id: 'DOC-11', name: 'Udyam MSME Registration Certificate', required: false, status: 'verified', category: 'MSME', file: 'Udyam_Registration.pdf', size: '540 KB', updated: '2026-09-22 10:13', ocr: 'UDYAM-DL-01-0089123' },
    { id: 'DOC-12', name: 'ISO 9001:2015 Quality Certificate', required: false, status: 'verified', category: 'Technical', file: 'ISO9001_Quality.pdf', size: '620 KB', updated: '2026-09-22 10:21', ocr: 'Cert # ISO-DEL-89201' },
    { id: 'DOC-13', name: 'NSIC Single Point Registration', required: false, status: 'verified', category: 'MSME', file: 'NSIC_Certificate.pdf', size: '490 KB', updated: '2026-09-22 10:13', ocr: 'NSIC/GP/DEL/2024/091' },
    { id: 'DOC-14', name: 'Audited Balance Sheets (3 FYs)', required: true, status: 'verified', category: 'Financial', file: 'Audited_Balance_Sheets.pdf', size: '3.4 MB', updated: '2026-09-22 10:18', ocr: 'FY23-24, FY22-23, FY21-22' }
  ];

  return { DOCUMENTS_LIST };
})();

window.BidderData = BidderData;
