export interface CertificateInput {
  memberName: string;
  eventTitle: string;
  registrationId: string;
  eventDate?: string;
  department?: string;
}

export function downloadEventCertificate(data: CertificateInput): void {
  const issued = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>CSI Certificate — ${data.registrationId}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: Georgia, 'Times New Roman', serif;
      background: linear-gradient(135deg, #0a0618, #1a0a3a);
      color: #e4f1ff;
    }
    .cert {
      width: min(720px, 92vw); padding: 3rem 2.5rem; text-align: center;
      border: 2px solid #9400ff; border-radius: 12px;
      background: rgba(8, 6, 22, 0.95);
      box-shadow: 0 0 60px rgba(148, 0, 255, 0.25);
    }
    .eyebrow { font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; color: #aed2ff; }
    h1 { font-size: 28px; margin: 1rem 0 0.5rem; color: #fff; }
    .name { font-size: 22px; margin: 1.5rem 0; color: #c77dff; font-weight: bold; }
    .event { font-size: 18px; margin: 0.5rem 0; }
    .meta { font-size: 12px; margin-top: 2rem; color: rgba(174,210,255,0.7); line-height: 1.6; }
    .id { font-family: monospace; color: #c4b5fd; }
  </style>
</head>
<body>
  <div class="cert">
    <p class="eyebrow">Computer Society of India · VIT Chennai</p>
    <h1>Certificate of Participation</h1>
    <p>This certifies that</p>
    <p class="name">${escapeHtml(data.memberName)}</p>
    <p>participated in</p>
    <p class="event"><strong>${escapeHtml(data.eventTitle)}</strong></p>
    ${data.eventDate ? `<p class="meta">${escapeHtml(data.eventDate)}</p>` : ''}
    <p class="meta">Issued on ${issued}<br/>
    Verification ID: <span class="id">${escapeHtml(data.registrationId)}</span></p>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CSI-Certificate-${data.registrationId}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
