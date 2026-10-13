import React from 'react';
import './VerifyBlock.css';

interface VerifyBlockProps {
  children: React.ReactNode;
}

// Wraps the expected terminal output (a fenced code block in MDX).
const VerifyBlock: React.FC<VerifyBlockProps> = ({ children }) => (
  <div className="verify-block">
    <div className="verify-block-header">
      <svg className="verify-block-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
      </svg>
      <span className="verify-block-label">Expected output</span>
    </div>
    <div className="verify-block-body">{children}</div>
  </div>
);

export default VerifyBlock;
