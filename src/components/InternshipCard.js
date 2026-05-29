'use client';

import { useState } from 'react';
import styles from './InternshipCard.module.css';

const AVATAR_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#6366f1', // indigo
];

export default function InternshipCard({ internship }) {
  const [imageError, setImageError] = useState(false);

  const {
    title,
    company_name,
    company_logo,
    location_names = [],
    work_from_home,
    start_date,
    duration,
    stipend,
    posted_on,
    application_deadline,
    is_ppo,
    ppo_label_value,
    part_time,
    office_days,
    posted_by_label,
    posted_by_label_type,
    labels = []
  } = internship;

  // Generate a consistent color based on company name
  const getAvatarColor = (val) => {
    if (!val) return AVATAR_COLORS[0];
    const name = String(val);
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  };

  const getInitials = (val) => {
    if (!val) return 'IS';
    const name = String(val);
    const cleanName = name.replace(/\(.*\)/g, '').trim(); // Remove brackets like (Gurgaon, India)
    if (!cleanName) return 'IS';
    const words = cleanName.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words[0][0] && words[1][0]) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  // Logo URL construction
  const logoUrl = company_logo && !imageError
    ? `https://internshala.com/uploads/logo/uploads/company/logo/${company_logo}`
    : null;

  // Format location list
  let locationText = '';
  if (work_from_home) {
    locationText = 'Work From Home';
  } else if (Array.isArray(location_names) && location_names.length > 0) {
    locationText = location_names.filter(Boolean).join(', ');
  } else if (location_names && typeof location_names === 'string') {
    locationText = location_names;
  } else {
    locationText = 'Remote / WFH';
  }

  // Safe label extraction to avoid rendering raw objects
  const allLabels = [];
  if (Array.isArray(labels)) {
    labels.forEach(lblObj => {
      if (lblObj && typeof lblObj === 'object') {
        if (Array.isArray(lblObj.label_value)) {
          lblObj.label_value.forEach(val => {
            if (val !== 'Internship' && !allLabels.includes(val)) allLabels.push(val);
          });
        }
      } else if (typeof lblObj === 'string' && lblObj !== 'Internship' && !allLabels.includes(lblObj)) {
        allLabels.push(lblObj);
      }
    });
  }
  // Format posted by label classes
  const isTodayOrRecent = posted_by_label_type === 'success' || 
    (posted_by_label && typeof posted_by_label === 'string' && 
      (posted_by_label.toLowerCase().includes('today') || posted_by_label.toLowerCase().includes('1-day') || posted_by_label.toLowerCase().includes('1 day')));

  return (
    <div className={`${styles.card} fade-in`}>
      {posted_by_label && (
        <div className={`${styles.postedBadge} ${isTodayOrRecent ? styles.success : ''}`}>
          {posted_by_label}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h4 className={styles.jobTitle}>{title}</h4>
          <div className={styles.companyName}>{company_name}</div>
        </div>
        <div className={styles.logoArea}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${company_name} Logo`}
              className={styles.logoImg}
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className={styles.avatarFallback} 
              style={{ backgroundColor: getAvatarColor(company_name) }}
            >
              {getInitials(company_name)}
            </div>
          )}
        </div>
      </div>

      <div className={styles.locationContainer}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.locationIcon}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>{locationText}</span>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.detailIcon}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Start Date
          </span>
          <span className={styles.detailValue}>{start_date}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.detailIcon}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Duration
          </span>
          <span className={styles.detailValue}>{duration}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.detailIcon}>
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <line x1="12" y1="4" x2="12" y2="20"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
            Stipend
          </span>
          <span className={styles.detailValue}>{stipend?.salary || 'Unpaid'}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.detailIcon}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Apply By
          </span>
          <span className={styles.detailValue}>{application_deadline}</span>
        </div>
      </div>

      <div className={styles.badgesContainer}>
        {work_from_home && (
          <span className="badge badge-neutral">Work From Home</span>
        )}
        {part_time && (
          <span className="badge badge-neutral">Part-time</span>
        )}
        {is_ppo && (
          <span className="badge badge-success">{ppo_label_value || 'Job Offer (PPO)'}</span>
        )}
        {office_days && (
          <span className="badge badge-info">{office_days}</span>
        )}
        {allLabels.map((lbl, idx) => (
          <span key={idx} className="badge badge-neutral">{lbl}</span>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.postedDate}>
          Posted: {posted_on}
        </div>
        <div className={styles.actions}>
          <span className={styles.detailsLink}>View details</span>
          <button className={styles.applyBtn}>Apply now</button>
        </div>
      </div>
    </div>
  );
}
