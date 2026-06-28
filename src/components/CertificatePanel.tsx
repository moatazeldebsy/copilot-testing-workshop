import React, { useEffect, useMemo, useState } from 'react';
import { useProgressContext } from '../context/ProgressContext';
import './CertificatePanel.css';

const CERTIFICATE_THRESHOLD = 80;
const NAME_STORAGE_KEY = 'workshop-certificate-name';
const WORKSHOP_TITLE = 'GenAI in Testing Workshop';
const INSTRUCTOR_NAME = 'Moataz Eldebsy';

function formatIssuedDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = context.measureText(testLine).width;

    if (width > maxWidth && line) {
      context.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    context.fillText(line, x, y);
  }
}

function drawMetaRow(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
) {
  context.textAlign = 'left';
  context.fillStyle = '#111827';
  context.font = '700 17px "Helvetica Neue"';
  context.fillText(label, x, y);

  context.fillStyle = '#4b5563';
  context.font = '500 21px "Helvetica Neue"';
  context.fillText(value, x + 150, y);
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

const CertificatePanel: React.FC = () => {
  const { unifiedPct } = useProgressContext();
  const [participantName, setParticipantName] = useState('');
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const savedName = window.localStorage.getItem(NAME_STORAGE_KEY);

    if (savedName) {
      setParticipantName(savedName);
    }
  }, []);

  const trimmedName = participantName.trim();
  const isEligible = unifiedPct >= CERTIFICATE_THRESHOLD;
  const progressRemaining = Math.max(CERTIFICATE_THRESHOLD - unifiedPct, 0);
  const previewName = trimmedName || 'Your Name Here';

  const certificateStatus = useMemo(() => {
    if (isEligible && trimmedName) {
      return 'Certificate ready to download';
    }

    if (isEligible) {
      return 'Add your name to generate the certificate';
    }

    return `${progressRemaining}% more progress needed to unlock the certificate`;
  }, [isEligible, progressRemaining, trimmedName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value;
    setParticipantName(nextName);
    window.localStorage.setItem(NAME_STORAGE_KEY, nextName);
  };

  const handleDownload = async () => {
    if (!trimmedName || !isEligible) {
      return;
    }

    setDownloadError(null);

    const issuedAt = new Date();
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;

    const context = canvas.getContext('2d');

    if (!context) {
      setDownloadError('Certificate generation is not supported in this browser.');
      return;
    }

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fbf7ff');
    gradient.addColorStop(0.5, '#fffdfa');
    gradient.addColorStop(1, '#eef6ff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(124, 58, 237, 0.08)';
    context.beginPath();
    context.arc(230, 160, 170, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = 'rgba(234, 179, 8, 0.08)';
    context.beginPath();
    context.arc(1340, 180, 145, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = 'rgba(14, 165, 233, 0.08)';
    context.beginPath();
    context.arc(1380, 730, 200, 0, Math.PI * 2);
    context.fill();

    drawRoundedRect(context, 54, 54, canvas.width - 108, canvas.height - 108, 30);
    context.fillStyle = 'rgba(255, 255, 255, 0.86)';
    context.fill();

    drawRoundedRect(context, 54, 54, canvas.width - 108, canvas.height - 108, 30);
    context.strokeStyle = '#7c3aed';
    context.lineWidth = 3;
    context.stroke();

    drawRoundedRect(context, 88, 88, canvas.width - 176, canvas.height - 176, 20);
    context.strokeStyle = 'rgba(124, 58, 237, 0.22)';
    context.lineWidth = 1.5;
    context.stroke();

    context.fillStyle = '#7c3aed';
    context.font = '700 20px "Trebuchet MS"';
    context.letterSpacing = '6px';
    context.textAlign = 'center';
    context.fillText('CERTIFICATE OF ATTENDANCE', canvas.width / 2, 150);

    context.fillStyle = '#9a3412';
    context.font = '600 24px Georgia';
    context.fillText('GenAI in Testing Workshop', canvas.width / 2, 205);

    context.fillStyle = '#111827';
    context.font = '400 30px Georgia';
    context.fillText('Presented to', canvas.width / 2, 285);

    context.fillStyle = '#111827';
    context.font = '700 72px Georgia';
    context.fillText(trimmedName, canvas.width / 2, 385);

    context.strokeStyle = 'rgba(154, 52, 18, 0.28)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(360, 415);
    context.lineTo(1240, 415);
    context.stroke();

    context.fillStyle = '#374151';
    context.font = '400 27px Georgia';
    context.textAlign = 'center';
    wrapText(
      context,
      `has attended ${WORKSHOP_TITLE} and is recognized for participating in this learning experience.`,
      canvas.width / 2,
      495,
      1060,
      40,
    );

    drawRoundedRect(context, 360, 600, 880, 120, 18);
    context.fillStyle = 'rgba(124, 58, 237, 0.06)';
    context.fill();
    context.strokeStyle = 'rgba(124, 58, 237, 0.14)';
    context.lineWidth = 1.5;
    context.stroke();

    drawMetaRow(
      context,
      'ISSUED',
      formatIssuedDate(issuedAt),
      410,
      650,
    );

    context.strokeStyle = 'rgba(124, 58, 237, 0.12)';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(845, 625);
    context.lineTo(845, 700);
    context.stroke();

    context.textAlign = 'left';
    context.fillStyle = '#111827';
    context.font = 'italic 18px "Times New Roman"';
    context.fillText(INSTRUCTOR_NAME, 900, 648);
    context.fillStyle = '#6b7280';
    context.font = '700 13px "Helvetica Neue"';
    context.fillText('INSTRUCTOR', 900, 680);

    const downloadUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'participant'}-certificate.png`;
    link.click();
  };

  return (
    <section className="certificate-panel" aria-labelledby="certificate-panel-title">
      <div className="certificate-panel__content">
        <div className="certificate-panel__copy">
          <p className="certificate-panel__eyebrow">Completion Reward</p>
          <h3 id="certificate-panel-title" className="certificate-panel__title">
            Generate a polished certificate of attendance
          </h3>
          <p className="certificate-panel__description">
            Unlock a downloadable certificate once you reach {CERTIFICATE_THRESHOLD}% overall progress. The design is generated locally in your browser and includes only the attendee name, workshop title, and issue date.
          </p>
          <div className="certificate-panel__status-row">
            <span className={`certificate-panel__badge ${isEligible ? 'certificate-panel__badge--ready' : ''}`}>
              {unifiedPct}% complete
            </span>
            <span className="certificate-panel__status">{certificateStatus}</span>
          </div>
          <label className="certificate-panel__label" htmlFor="certificate-name">
            Participant name
          </label>
          <input
            id="certificate-name"
            className="certificate-panel__input"
            type="text"
            value={participantName}
            onChange={handleNameChange}
            placeholder="Add the name you want on the certificate"
          />
          <div className="certificate-panel__actions">
            <button
              type="button"
              className="certificate-panel__button"
              disabled={!isEligible || !trimmedName}
              onClick={handleDownload}
            >
              Download Certificate
            </button>
            {!isEligible && (
              <span className="certificate-panel__hint">
                Keep going to unlock it.
              </span>
            )}
          </div>
          {downloadError && <p className="certificate-panel__error">{downloadError}</p>}
        </div>

        <div className="certificate-preview" aria-hidden="true">
          <div className="certificate-preview__frame">
            <div className="certificate-preview__inner">
              <p className="certificate-preview__eyebrow">Certificate of Attendance</p>
              <p className="certificate-preview__series">{WORKSHOP_TITLE}</p>
              <p className="certificate-preview__presented">Presented to</p>
              <h4 className="certificate-preview__name">{previewName}</h4>
              <p className="certificate-preview__body">
                for attending the {WORKSHOP_TITLE} and participating in the workshop experience.
              </p>
              <div className="certificate-preview__signature">
                <span className="certificate-preview__signature-name">{INSTRUCTOR_NAME}</span>
                <span className="certificate-preview__signature-label">Instructor</span>
              </div>
              <p className="certificate-preview__issued">
                Issued {formatIssuedDate(new Date())}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificatePanel;