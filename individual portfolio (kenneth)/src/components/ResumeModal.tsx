import React from 'react';
import { X, Download, FileText } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal-dialog resume-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close resume">
          <X size={22} />
        </button>

        <div className="modal-scroll-body" style={{ padding: '2rem' }}>
          <div className="modal-header" style={{ marginBottom: '1.5rem' }}>
            <span className="mono eyebrow-badge">CURRICULUM VITAE // VERIFIED PROFILE</span>
            <h2>Kenneth Cyrus Bianzon</h2>
            <p className="mono modal-category">Fullstack Developer &amp; Creative Technologist</p>
          </div>

          <div className="resume-display-wrapper">
            <img
              src="/resumes/kenneth.png"
              alt="Kenneth Cyrus Bianzon Resume"
              className="resume-preview-img"
              onError={(e) => {
                // If png fails, show fallback note
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <span className="mono" style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
              Fullstack Architect · React, Three.js, Node.js, Firebase
            </span>

            <a
              href="/resumes/kenneth.pdf"
              download="Kenneth_Cyrus_Bianzon_Resume.pdf"
              className="btn-launch-star"
            >
              <Download size={16} /> Download Full PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
