import React, { useRef, useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-docker';
import './CodeBlock.css';

interface CodeBlockProps {
  children: string;
  language?: string;
  maxPreviewLines?: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language = 'typescript',
  maxPreviewLines = 18,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const trimmedCode = children.trim();
  const lines = trimmedCode.split('\n');
  const isTruncated = lines.length > maxPreviewLines;
  const renderedCode =
    isTruncated && !expanded
      ? `${lines.slice(0, maxPreviewLines).join('\n')}\n...`
      : trimmedCode;

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [renderedCode, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trimmedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = trimmedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="codeblock-wrapper">
      <div className="codeblock-header">
        <span className="codeblock-lang">{language}</span>
        <button
          className={`codeblock-copy ${copied ? 'codeblock-copy--copied' : ''}`}
          onClick={handleCopy}
          type="button"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {isTruncated && (
        <div className="codeblock-toolbar">
          <button
            className="codeblock-expand"
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : `Show full snippet (${lines.length} lines)`}
          </button>
        </div>
      )}
      <pre className="codeblock-pre">
        <code ref={codeRef} className={`language-${language}`}>
          {renderedCode}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
