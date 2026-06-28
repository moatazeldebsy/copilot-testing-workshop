import React from 'react';
import './VerifyBlock.css';

interface VerifyBlockProps {
  children: React.ReactNode;
}

const VerifyBlock: React.FC<VerifyBlockProps> = ({ children }) => (
  <div className="verify-block">
    <div className="verify-block-header">
      <span className="verify-block-icon">✅</span>
      <span className="verify-block-label">Expected Output</span>
    </div>
    <div className="verify-block-body">{children}</div>
  </div>
);

export default VerifyBlock;
