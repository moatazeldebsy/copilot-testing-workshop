import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchIndex, SearchEntry } from '../data/searchIndex';
import './Search.css';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matched = searchIndex.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.keywords.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q)
    );
    setResults(matched);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target instanceof Node ? e.target : null)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <button
        className="search-trigger"
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        type="button"
        aria-label="Open workshop search"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="search-icon">🔍</span>
        <span className="search-placeholder">Search…</span>
        <kbd className="search-kbd">⌘K</kbd>
      </button>
      {open && (
        <div
          className="search-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          aria-describedby={dialogDescriptionId}
        >
          <div className="search-modal-header">
            <h2 id={dialogTitleId} className="search-modal-title">Search workshop content</h2>
            <button
              className="search-close"
              type="button"
              onClick={() => {
                setOpen(false);
                setQuery('');
              }}
              aria-label="Close search"
            >
              Close
            </button>
          </div>
          <p id={dialogDescriptionId} className="search-modal-description">
            Search by page title, keywords, or tutorial description.
          </p>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query.trim() && (
            <p className="search-status" aria-live="polite">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? '' : 's'} found`
                : 'No results found'}
            </p>
          )}
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    className="search-result-link"
                    onClick={() => { setOpen(false); setQuery(''); }}
                  >
                    <span className="search-result-title">{r.title}</span>
                    <span className="search-result-desc">{r.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {query.trim() && results.length === 0 && (
            <div className="search-empty">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
