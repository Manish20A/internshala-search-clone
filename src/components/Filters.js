'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Filters.module.css';

export default function Filters({
  allProfiles = [],
  allLocations = [],
  filters,
  setFilters,
  resetFilters,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [profileSearch, setProfileSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const profileRef = useRef(null);
  const locationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter list of profiles/locations for autocomplete
  const filteredProfiles = allProfiles.filter(profile => 
    typeof profile === 'string' &&
    profile.toLowerCase().includes(profileSearch.toLowerCase()) &&
    !filters.profiles.includes(profile)
  );

  const filteredLocations = allLocations.filter(loc => 
    typeof loc === 'string' &&
    loc.toLowerCase().includes(locationSearch.toLowerCase()) &&
    !filters.locations.includes(loc)
  );

  const addProfile = (profile) => {
    setFilters(prev => ({
      ...prev,
      profiles: [...prev.profiles, profile]
    }));
    setProfileSearch('');
    setShowProfileDropdown(false);
  };

  const removeProfile = (profile) => {
    setFilters(prev => ({
      ...prev,
      profiles: prev.profiles.filter(p => p !== profile)
    }));
  };

  const addLocation = (loc) => {
    setFilters(prev => ({
      ...prev,
      locations: [...prev.locations, loc]
    }));
    setLocationSearch('');
    setShowLocationDropdown(false);
  };

  const removeLocation = (loc) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l !== loc)
    }));
  };

  const handleWfhChange = (e) => {
    setFilters(prev => ({
      ...prev,
      wfh: e.target.checked
    }));
  };

  const handlePartTimeChange = (e) => {
    setFilters(prev => ({
      ...prev,
      partTime: e.target.checked
    }));
  };

  const handleDurationChange = (e) => {
    setFilters(prev => ({
      ...prev,
      duration: e.target.value
    }));
  };

  const handleStipendChange = (e) => {
    setFilters(prev => ({
      ...prev,
      minStipend: parseInt(e.target.value, 10)
    }));
  };

  const formatStipend = (val) => {
    if (val === 0) return 'Any';
    return `₹ ${(val).toLocaleString('en-IN')}`;
  };

  const clearAllFilters = () => {
    resetFilters();
    setProfileSearch('');
    setLocationSearch('');
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div 
        className={styles.mobileToggleContainer}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <span className={styles.mobileToggleText}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
          {(filters.profiles.length > 0 || filters.locations.length > 0 || filters.wfh || filters.partTime || filters.duration || filters.minStipend > 0) && (
            <span className="badge badge-info" style={{ marginLeft: '4px' }}>Active</span>
          )}
        </span>
        <button className={styles.mobileToggleBtn}>
          {isMobileOpen ? 'Close' : 'Modify'}
        </button>
      </div>

      {/* Main Filters Container */}
      <div className={`${styles.filtersCard} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters
          </h3>
          <button className={styles.clearBtn} onClick={clearAllFilters}>Clear all</button>
        </div>

        {/* PROFILE FILTER */}
        <div className={styles.filterGroup} ref={profileRef}>
          <label className={styles.filterLabel}>Profile</label>
          <div className={styles.autocompleteContainer}>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Web Development"
              value={profileSearch}
              onChange={(e) => {
                setProfileSearch(e.target.value);
                setShowProfileDropdown(true);
              }}
              onFocus={() => setShowProfileDropdown(true)}
            />
            {showProfileDropdown && profileSearch.trim() && (
              <ul className={styles.dropdown}>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map(profile => (
                    <li 
                      key={profile} 
                      className={styles.dropdownItem}
                      onClick={() => addProfile(profile)}
                    >
                      {profile}
                    </li>
                  ))
                ) : (
                  <li className={styles.dropdownNoResult}>No matching profiles</li>
                )}
              </ul>
            )}
          </div>
          {filters.profiles.length > 0 && (
            <div className={styles.tagContainer}>
              {filters.profiles.map(profile => (
                <span key={profile} className={styles.tag}>
                  {profile}
                  <button className={styles.tagRemove} onClick={() => removeProfile(profile)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* LOCATION FILTER */}
        <div className={styles.filterGroup} ref={locationRef}>
          <label className={styles.filterLabel}>Location</label>
          <div className={styles.autocompleteContainer}>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Delhi, Remote"
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
            />
            {showLocationDropdown && locationSearch.trim() && (
              <ul className={styles.dropdown}>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map(loc => (
                    <li 
                      key={loc} 
                      className={styles.dropdownItem}
                      onClick={() => addLocation(loc)}
                    >
                      {loc}
                    </li>
                  ))
                ) : (
                  <li className={styles.dropdownNoResult}>No matching locations</li>
                )}
              </ul>
            )}
          </div>
          {filters.locations.length > 0 && (
            <div className={styles.tagContainer}>
              {filters.locations.map(loc => (
                <span key={loc} className={styles.tag}>
                  {loc}
                  <button className={styles.tagRemove} onClick={() => removeLocation(loc)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* TYPE OF INTERNSHIP FILTER */}
        <div className={styles.filterGroup}>
          <div className={styles.wfhToggle}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={filters.wfh}
                onChange={handleWfhChange}
              />
              <span className="checkmark"></span>
              Work from home
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={filters.partTime}
                onChange={handlePartTimeChange}
              />
              <span className="checkmark"></span>
              Part-time
            </label>
          </div>
        </div>

        {/* DURATION FILTER */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Max Duration (Months)</label>
          <select 
            className={styles.selectInput}
            value={filters.duration}
            onChange={handleDurationChange}
          >
            <option value="">Choose duration</option>
            <option value="1">1 Month</option>
            <option value="2">2 Months</option>
            <option value="3">3 Months</option>
            <option value="4">4 Months</option>
            <option value="5">5 Months</option>
            <option value="6">6 Months or more</option>
          </select>
        </div>

        {/* MIN STIPEND FILTER */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Minimum Stipend (Monthly)</label>
          <div className={styles.rangeContainer}>
            <input
              type="range"
              min="0"
              max="50000"
              step="5000"
              value={filters.minStipend}
              onChange={handleStipendChange}
              className={styles.rangeSlider}
            />
            <div className={styles.rangeValue}>
              <span>Any</span>
              <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                {formatStipend(filters.minStipend)}
              </span>
              <span>₹ 50k</span>
            </div>
          </div>
        </div>

        {/* Apply Button (Visible only on mobile inside menu) */}
        {isMobileOpen && (
          <button 
            className={styles.applyFiltersBtn} 
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => setIsMobileOpen(false)}
          >
            Apply Filters
          </button>
        )}
      </div>
    </>
  );
}
