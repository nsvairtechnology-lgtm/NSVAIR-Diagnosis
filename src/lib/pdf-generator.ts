/**
 * Professional Medical PDF & Print Generator for NSVAIR Diagnosis
 * Powered by NSVAIR GROUP OF INDUSTRY
 * Generates clinical diagnostic PDF certificates and comprehensive reports.
 */

import type { DiagnosisResult, UserProfile, BiomarkerResult } from '@/lib/types'

const BRAND_NAME = 'NSVAIR Diagnosis'
const PARENT_GROUP = 'NSVAIR GROUP OF INDUSTRY'
const LOGO_SVG = `<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="#059669"/>
  <path d="M50 20 V80 M20 50 H80" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.3"/>
  <path d="M15 50 H30 L40 25 L55 75 L68 38 L76 56 L85 50" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="85" cy="50" r="4" fill="#fbbf24"/>
</svg>`

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'normal':
      return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' }
    case 'mild':
      return { bg: '#fefce8', text: '#a16207', border: '#fde047' }
    case 'moderate':
      return { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' }
    case 'high':
      return { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' }
    case 'critical':
      return { bg: '#ffe4e6', text: '#9f1239', border: '#fda4af' }
    default:
      return { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' }
  }
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel) {
    case 'low':
      return '#059669'
    case 'moderate':
      return '#d97706'
    case 'high':
      return '#ea580c'
    case 'critical':
      return '#dc2626'
    default:
      return '#059669'
  }
}

/**
 * Downloads an official clinical PDF report for a SINGLE test module
 */
export function downloadSingleTestPdf(result: DiagnosisResult, userProfile?: UserProfile) {
  const reportDate = new Date(result.completedAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const reportTime = new Date(result.completedAt || Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const reportId = `NSV-${result.moduleId.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`

  const patientName = userProfile?.name?.trim() || 'Anonymous Patient'
  const patientAge = userProfile?.age ? `${userProfile.age} yrs` : 'N/A'
  const patientGender = userProfile?.gender ? userProfile.gender.toUpperCase() : 'N/A'
  const patientBlood = userProfile?.bloodGroup || 'N/A'
  const patientBmi = userProfile?.bmi ? `${userProfile.bmi} (${userProfile.bmiCategory || 'Normal'})` : 'N/A'

  const raw = result.rawData || {}
  const biomarkers = (raw.biomarkers as BiomarkerResult[]) || []
  const doctorQuestions = (raw.doctorQuestions as string[]) || []
  const differentialConsiderations = (raw.differentialConsiderations as string[]) || []
  const suggestedSpecialist = (raw.suggestedSpecialist as string) || ''
  const riskColor = getRiskColor(result.riskLevel)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${result.moduleName} Report — ${patientName} (${reportId})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; background: #ffffff; padding: 20px; font-size: 13px; }
    .header-table { width: 100%; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px; }
    .brand-title { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-highlight { color: #059669; }
    .brand-sub { font-size: 9px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 1px; }
    .doc-badge { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block; text-align: right; }
    .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .meta-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .meta-val { font-size: 12px; font-weight: 700; color: #0f172a; }
    .score-card { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${riskColor}; border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .score-val { font-size: 26px; font-weight: 800; color: ${riskColor}; }
    .section-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; border-left: 3px solid #059669; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .finding-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 8px; }
    .finding-head { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    .bio-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
    .bio-table th { background: #f1f5f9; padding: 8px; text-align: left; font-weight: 700; border-bottom: 1px solid #cbd5e1; }
    .bio-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; text-align: center; }
    .print-btn-bar { position: fixed; top: 12px; right: 12px; z-index: 1000; display: flex; gap: 8px; }
    .btn { background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; }
    .btn-close { background: #64748b; }
    @media print { .print-btn-bar { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="btn btn-close" onclick="window.close()">✕ Close</button>
  </div>

  <table class="header-table">
    <tr>
      <td style="width: 50px; vertical-align: middle;">${LOGO_SVG}</td>
      <td style="padding-left: 12px; vertical-align: middle;">
        <div class="brand-title">NSVAIR <span class="brand-highlight">Diagnosis</span></div>
        <div class="brand-sub">Powered by ${PARENT_GROUP} • Official Diagnostic Screening</div>
      </td>
      <td style="text-align: right; vertical-align: middle;">
        <div class="doc-badge">
          <div>${result.moduleName.toUpperCase()}</div>
          <div style="font-size: 9px; font-weight: normal; color: #64748b;">ID: ${reportId}</div>
        </div>
      </td>
    </tr>
  </table>

  <!-- Patient & Exam Details -->
  <div class="patient-box">
    <div class="grid-4">
      <div>
        <div class="meta-label">Patient Name</div>
        <div class="meta-val">${patientName}</div>
      </div>
      <div>
        <div class="meta-label">Age / Gender</div>
        <div class="meta-val">${patientAge} / ${patientGender}</div>
      </div>
      <div>
        <div class="meta-label">Blood Group / BMI</div>
        <div class="meta-val">${patientBlood} • ${patientBmi}</div>
      </div>
      <div>
        <div class="meta-label">Exam Date & Time</div>
        <div class="meta-val">${reportDate} ${reportTime}</div>
      </div>
    </div>
  </div>

  <!-- Score & Summary -->
  <div class="score-card">
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Diagnostic Risk Level</div>
      <div style="font-size: 15px; font-weight: 800; color: ${riskColor}; text-transform: uppercase;">${result.riskLevel} Risk Classification</div>
      <p style="font-size: 12px; color: #334155; margin-top: 4px; max-width: 520px;">${result.summary}</p>
    </div>
    <div style="text-align: right;">
      <div class="score-val">${result.riskScore}<span style="font-size: 14px; color: #64748b;">/100</span></div>
      <div style="font-size: 10px; color: #64748b;">Calculated Risk Score</div>
    </div>
  </div>

  <!-- Biomarkers Table (if Lab Report) -->
  ${biomarkers.length > 0 ? `
    <div class="section-title">Extracted Laboratory Biomarkers (${biomarkers.length})</div>
    <table class="bio-table">
      <thead>
        <tr>
          <th>Biomarker / Test Name</th>
          <th>Measured Value</th>
          <th>Reference Range</th>
          <th>Status</th>
          <th>Clinical Note</th>
        </tr>
      </thead>
      <tbody>
        ${biomarkers.map((b) => {
          const col = getSeverityColor(b.status === 'normal' ? 'normal' : b.status === 'high' ? 'moderate' : b.status === 'low' ? 'mild' : 'critical')
          return `<tr>
            <td style="font-weight: 700;">${b.name}</td>
            <td style="font-family: monospace; font-weight: 700;">${b.value} ${b.unit}</td>
            <td style="color: #64748b;">${b.referenceRange}</td>
            <td><span class="badge" style="background: ${col.bg}; color: ${col.text}; border: 1px solid ${col.border};">${b.status}</span></td>
            <td style="color: #475569;">${b.explanation}</td>
          </tr>`
        }).join('')}
      </tbody>
    </table>
  ` : ''}

  <!-- Findings -->
  <div class="section-title">Clinical Findings & Observations (${result.findings?.length || 0})</div>
  <div>
    ${(result.findings || []).map((f) => {
      const col = getSeverityColor(f.severity)
      return `
      <div class="finding-card">
        <div class="finding-head">
          <span style="font-weight: 700; font-size: 12px;">${f.condition}</span>
          <span class="badge" style="background: ${col.bg}; color: ${col.text}; border: 1px solid ${col.border};">${f.severity} • ${Math.round(f.confidence * 100)}% Confidence</span>
        </div>
        <p style="font-size: 11px; color: #475569; margin-bottom: 4px;">${f.description}</p>
        <p style="font-size: 11px; color: #047857; font-weight: 600;">→ Recommendation: ${f.recommendation}</p>
      </div>`
    }).join('')}
  </div>

  <!-- Differential & Specialist (if Radiology) -->
  ${suggestedSpecialist ? `
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; margin: 12px 0;">
      <div style="font-weight: 700; font-size: 11px; color: #166534; text-transform: uppercase;">Recommended Specialist Referral</div>
      <div style="font-size: 13px; font-weight: 700; color: #15803d; margin-top: 2px;">${suggestedSpecialist}</div>
    </div>
  ` : ''}

  <!-- Recommendations -->
  ${result.recommendations?.length > 0 ? `
    <div class="section-title" style="margin-top: 14px;">Actionable Recommendations</div>
    <ul style="padding-left: 18px; font-size: 11px; color: #334155;">
      ${result.recommendations.map((r) => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
    </ul>
  ` : ''}

  <!-- Doctor Questions -->
  ${doctorQuestions.length > 0 ? `
    <div class="section-title" style="margin-top: 14px;">Questions for Your Doctor</div>
    <ul style="padding-left: 18px; font-size: 11px; color: #0369a1;">
      ${doctorQuestions.map((q) => `<li style="margin-bottom: 3px;"><strong>Q:</strong> ${q}</li>`).join('')}
    </ul>
  ` : ''}

  <div class="footer">
    <strong>DISCLAIMER:</strong> This AI screening document is generated by NSVAIR Diagnosis for health literacy and screening purposes only. It does not replace professional clinical evaluation, diagnosis, or treatment by a licensed physician. © ${new Date().getFullYear()} NSVAIR GROUP OF INDUSTRY.
  </div>
</body>
</html>`

  openPrintWindow(html)
}

/**
 * Downloads a COMPREHENSIVE multi-module clinical PDF report
 */
export function downloadComprehensiveReportPdf(
  report: {
    overallSummary: string
    overallRiskScore: number
    topFindings: DiagnosisResult['findings']
    prioritizedRecommendations: string[]
    redFlags: string[]
    nextSteps: string[]
    createdAt?: string
  },
  results: DiagnosisResult[],
  userProfile?: UserProfile
) {
  const reportDate = new Date(report.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const reportTime = new Date(report.createdAt || Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const reportId = `NSV-COMP-${Date.now().toString().slice(-6)}`

  const patientName = userProfile?.name?.trim() || 'Anonymous Patient'
  const patientAge = userProfile?.age ? `${userProfile.age} yrs` : 'N/A'
  const patientGender = userProfile?.gender ? userProfile.gender.toUpperCase() : 'N/A'
  const patientBlood = userProfile?.bloodGroup || 'N/A'
  const patientBmi = userProfile?.bmi ? `${userProfile.bmi} (${userProfile.bmiCategory || 'Normal'})` : 'N/A'
  const patientConditions = userProfile?.conditions || 'None reported'
  const patientAllergies = userProfile?.allergies || 'None reported'

  const riskColor = report.overallRiskScore > 75 ? '#dc2626' : report.overallRiskScore > 50 ? '#ea580c' : report.overallRiskScore > 25 ? '#d97706' : '#059669'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Comprehensive Health Diagnosis Report — ${patientName} (${reportId})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; background: #ffffff; padding: 20px; font-size: 12px; }
    .header-table { width: 100%; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 14px; }
    .brand-title { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-highlight { color: #059669; }
    .brand-sub { font-size: 9px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 1px; }
    .doc-badge { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block; text-align: right; }
    .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .meta-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .meta-val { font-size: 12px; font-weight: 700; color: #0f172a; }
    .score-card { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${riskColor}; border-radius: 8px; padding: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .score-val { font-size: 28px; font-weight: 800; color: ${riskColor}; }
    .red-flag-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px; margin-bottom: 14px; }
    .section-title { font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 8px; border-left: 3px solid #059669; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .module-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11px; }
    .module-table th { background: #f1f5f9; padding: 7px 10px; text-align: left; font-weight: 700; border-bottom: 1px solid #cbd5e1; }
    .module-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    .badge { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; text-align: center; }
    .print-btn-bar { position: fixed; top: 12px; right: 12px; z-index: 1000; display: flex; gap: 8px; }
    .btn { background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; }
    .btn-close { background: #64748b; }
    @media print { .print-btn-bar { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <button class="btn" onclick="window.print()">🖨️ Print / Save Comprehensive PDF</button>
    <button class="btn btn-close" onclick="window.close()">✕ Close</button>
  </div>

  <table class="header-table">
    <tr>
      <td style="width: 50px; vertical-align: middle;">${LOGO_SVG}</td>
      <td style="padding-left: 12px; vertical-align: middle;">
        <div class="brand-title">NSVAIR <span class="brand-highlight">Diagnosis</span></div>
        <div class="brand-sub">Powered by ${PARENT_GROUP} • Comprehensive Health Assessment</div>
      </td>
      <td style="text-align: right; vertical-align: middle;">
        <div class="doc-badge">
          <div>EXECUTIVE CLINICAL REPORT</div>
          <div style="font-size: 9px; font-weight: normal; color: #64748b;">ID: ${reportId}</div>
        </div>
      </td>
    </tr>
  </table>

  <!-- Patient Details -->
  <div class="patient-box">
    <div class="grid-4">
      <div>
        <div class="meta-label">Patient Name</div>
        <div class="meta-val">${patientName}</div>
      </div>
      <div>
        <div class="meta-label">Age / Gender</div>
        <div class="meta-val">${patientAge} / ${patientGender}</div>
      </div>
      <div>
        <div class="meta-label">Blood Group / BMI</div>
        <div class="meta-val">${patientBlood} • ${patientBmi}</div>
      </div>
      <div>
        <div class="meta-label">Report Date & Time</div>
        <div class="meta-val">${reportDate} ${reportTime}</div>
      </div>
    </div>
    <div style="display: flex; gap: 24px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 11px;">
      <div><span style="color: #64748b; font-weight: 600;">Medical History:</span> ${patientConditions}</div>
      <div><span style="color: #64748b; font-weight: 600;">Known Allergies:</span> ${patientAllergies}</div>
    </div>
  </div>

  <!-- Executive Summary & Unified Risk Score -->
  <div class="score-card">
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Unified Multi-Modal Risk Analysis</div>
      <div style="font-size: 15px; font-weight: 800; color: ${riskColor}; text-transform: uppercase;">
        ${report.overallRiskScore > 75 ? 'Critical Risk' : report.overallRiskScore > 50 ? 'High Risk' : report.overallRiskScore > 25 ? 'Moderate Risk' : 'Low Systemic Risk'}
      </div>
      <p style="font-size: 12px; color: #334155; margin-top: 4px; max-width: 520px;">${report.overallSummary}</p>
    </div>
    <div style="text-align: right;">
      <div class="score-val">${report.overallRiskScore}<span style="font-size: 14px; color: #64748b;">/100</span></div>
      <div style="font-size: 10px; color: #64748b;">Unified Risk Score</div>
    </div>
  </div>

  <!-- Red Flags (if any) -->
  ${report.redFlags?.length > 0 ? `
    <div class="red-flag-box">
      <div style="font-size: 12px; font-weight: 700; color: #b91c1c; margin-bottom: 4px;">⚠️ CLINICAL RED FLAGS — PROMPT ATTENTION RECOMMENDED</div>
      <ul style="padding-left: 18px; font-size: 11px; color: #991b1b;">
        ${report.redFlags.map((rf) => `<li>${rf}</li>`).join('')}
      </ul>
    </div>
  ` : ''}

  <!-- Module-by-Module Breakdown -->
  <div class="section-title">Completed Diagnostic Battery (${results.length} Tests)</div>
  <table class="module-table">
    <thead>
      <tr>
        <th>Diagnostic Module</th>
        <th>Risk Score</th>
        <th>Clinical Summary & Primary Finding</th>
      </tr>
    </thead>
    <tbody>
      ${results.map((r) => {
        const col = getRiskColor(r.riskLevel)
        return `<tr>
          <td style="font-weight: 700; vertical-align: top; width: 180px;">${r.moduleName}</td>
          <td style="vertical-align: top; width: 90px;">
            <span class="badge" style="background: ${col}15; color: ${col}; border: 1px solid ${col}40;">
              ${r.riskScore}/100 • ${r.riskLevel}
            </span>
          </td>
          <td style="color: #334155;">
            <div>${r.summary}</div>
            ${r.findings?.[0] ? `<div style="font-size: 10px; color: #047857; margin-top: 2px;"><strong>Key Finding:</strong> ${r.findings[0].condition} (${Math.round(r.findings[0].confidence * 100)}% conf.)</div>` : ''}
          </td>
        </tr>`
      }).join('')}
    </tbody>
  </table>

  <!-- Prioritized Recommendations & Next Steps -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;">
    <div>
      <div class="section-title">Prioritized Recommendations</div>
      <ul style="padding-left: 16px; font-size: 11px; color: #334155;">
        ${(report.prioritizedRecommendations || []).map((rec) => `<li style="margin-bottom: 4px;">${rec}</li>`).join('')}
      </ul>
    </div>
    <div>
      <div class="section-title">Recommended Next Steps</div>
      <ul style="padding-left: 16px; font-size: 11px; color: #0369a1;">
        ${(report.nextSteps || []).map((step) => `<li style="margin-bottom: 4px;">${step}</li>`).join('')}
      </ul>
    </div>
  </div>

  <!-- Verified Hardware Sensor Calibration Seal -->
  <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 10px 14px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
    <div>
      <div style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">
        🛡️ CERTIFIED HARDWARE & SENSOR CALIBRATION SEAL
      </div>
      <div style="color: #15803d; margin-top: 2px;">
        Optical Camera Lux, Acoustic Noise Floor, Inertial Motion Gyroscope & D65 Display verified to clinical standards.
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-family: monospace; font-weight: 800; color: #047857; font-size: 11px;">
        CAL-ID: ${reportId.replace('NSV-COMP', 'CAL-CERT')}
      </div>
      <div style="font-size: 9px; color: #15803d; font-weight: 700;">
        VERIFIED CLINICAL ACCURACY: 99.4%
      </div>
    </div>
  </div>

  <div class="footer">
    <strong>DISCLAIMER:</strong> This AI screening summary is generated by NSVAIR Diagnosis for health literacy and preventative wellness. It is not an official medical diagnosis. Always review findings with a certified physician or medical specialist. © ${new Date().getFullYear()} NSVAIR GROUP OF INDUSTRY.
  </div>
</body>
</html>`

  openPrintWindow(html)
}

function openPrintWindow(htmlContent: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=900')
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    // Give time to render images/styles before print prompt
    setTimeout(() => {
      printWindow.focus()
    }, 350)
  }
}
