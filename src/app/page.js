'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import InternshipCard from '../components/InternshipCard';
import styles from './page.module.css';
import mockDataFallback from '@/data/mockInternships.json';

const DEFAULT_FILTERS = {
  profiles: [],
  locations: [],
  wfh: false,
  partTime: false,
  duration: '',
  minStipend: 0
};

export default function Home() {
  // Parse the mock data directly on startup
  const initialInternships = useMemo(() => {
    const data = mockDataFallback;
    if (data && data.internships_meta && data.internship_ids) {
      return data.internship_ids.map(id => data.internships_meta[id]).filter(Boolean);
    } else if (data && data.internships_meta) {
      return Object.values(data.internships_meta).filter(Boolean);
    }
    return [];
  }, []);

  const [internships] = useState(initialInternships);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const loading = false;
  const error = null;
  const fetchData = () => {};

  // Compute unique profiles dynamically
  const allProfiles = useMemo(() => {
    return Array.from(new Set(
      internships.map(item => item.profile_name).filter(Boolean)
    )).sort();
  }, [internships]);

  // Compute unique locations dynamically
  const allLocations = useMemo(() => {
    const locSet = new Set(['Remote']);
    internships.forEach(item => {
      if (item.location_names && item.location_names.length > 0) {
        item.location_names.forEach(loc => {
          if (loc && typeof loc === 'string') locSet.add(loc);
        });
      }
    });
    return Array.from(locSet).sort();
  }, [internships]);

  // Helper to parse duration string to approximate months
  const parseDuration = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const str = String(val);
    const match = str.match(/\d+/);
    if (!match) return 0;
    const num = parseInt(match[0], 10);
    if (str.toLowerCase().includes('week')) {
      return Math.max(1, Math.round(num / 4));
    }
    return num;
  };

  // Perform filtering on the client side
  const filteredInternships = useMemo(() => {
    return internships.filter(item => {
      // 1. Text Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title ? item.title.toLowerCase().includes(query) : false;
        const matchesCompany = item.company_name ? item.company_name.toLowerCase().includes(query) : false;
        const matchesLoc = item.location_names && item.location_names.some(loc => loc && loc.toLowerCase().includes(query));
        const matchesProfileName = item.profile_name ? item.profile_name.toLowerCase().includes(query) : false;
        
        if (!matchesTitle && !matchesCompany && !matchesLoc && !matchesProfileName) {
          return false;
        }
      }

      // 2. Profiles Filter
      if (filters.profiles.length > 0) {
        if (!item.profile_name || !filters.profiles.includes(item.profile_name)) {
          return false;
        }
      }

      // 3. Locations Filter
      if (filters.locations.length > 0) {
        const match = filters.locations.some(loc => {
          if (loc.toLowerCase() === 'work from home' || loc.toLowerCase() === 'remote') {
            return item.work_from_home;
          }
          return item.location_names && item.location_names.includes(loc);
        });
        if (!match) return false;
      }

      // 4. Work from home checkbox
      if (filters.wfh && !item.work_from_home) {
        return false;
      }

      // 5. Part time checkbox
      if (filters.partTime && !item.part_time) {
        return false;
      }

      // 6. Duration filter (max months)
      if (filters.duration) {
        const limit = parseInt(filters.duration, 10);
        const itemDur = parseDuration(item.duration);
        if (itemDur > 0 && itemDur > limit) {
          return false;
        }
      }

      // 7. Stipend filter
      if (filters.minStipend > 0) {
        const stipendVal = item.stipend?.salaryValue1 || 0;
        if (stipendVal < filters.minStipend) {
          return false;
        }
      }

      return true;
    });
  }, [internships, filters, searchQuery]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const removeFilterTag = (type, value) => {
    setFilters(prev => {
      if (type === 'profiles') {
        return { ...prev, profiles: prev.profiles.filter(p => p !== value) };
      }
      if (type === 'locations') {
        return { ...prev, locations: prev.locations.filter(l => l !== value) };
      }
      if (type === 'wfh') {
        return { ...prev, wfh: false };
      }
      if (type === 'partTime') {
        return { ...prev, partTime: false };
      }
      if (type === 'duration') {
        return { ...prev, duration: '' };
      }
      if (type === 'minStipend') {
        return { ...prev, minStipend: 0 };
      }
      return prev;
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = filters.profiles.length + filters.locations.length;
    if (filters.wfh) count++;
    if (filters.partTime) count++;
    if (filters.duration) count++;
    if (filters.minStipend > 0) count++;
    return count;
  }, [filters]);

  return (
    <div className="main-wrapper">
      <Navbar />

      <main className="content-area container">
        {error ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorTitle}>Oops! Something went wrong</div>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={fetchData}>Try Again</button>
          </div>
        ) : (
          <div className={styles.mainContent}>
            {/* Search Header Area */}
            <div className={styles.searchHeaderCard}>
              <div className={styles.topRow}>
                <h2 className={styles.resultCount}>
                  {loading ? (
                    <span>Finding internships...</span>
                  ) : (
                    <>
                      <span className={styles.countNumber}>{filteredInternships.length}</span>{' '}
                      {filteredInternships.length === 1 ? 'internship' : 'total internships'}{' '}
                      {activeFilterCount > 0 || searchQuery.trim() ? 'matching your search' : 'available'}
                    </>
                  )}
                </h2>

                <div className={styles.searchBarWrapper}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by profile, company or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filter Tags */}
              {activeFilterCount > 0 && (
                <div className={styles.activeFiltersRow}>
                  <label>Active Filters:</label>
                  {filters.profiles.map(p => (
                    <span key={`p-${p}`} className="badge badge-info" style={{ gap: '4px' }}>
                      Profile: {p}
                      <button style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeFilterTag('profiles', p)}>×</button>
                    </span>
                  ))}
                  {filters.locations.map(l => (
                    <span key={`l-${l}`} className="badge badge-info" style={{ gap: '4px' }}>
                      Location: {l}
                      <button style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeFilterTag('locations', l)}>×</button>
                    </span>
                  ))}
                  {filters.wfh && (
                    <span className="badge badge-info" style={{ gap: '4px' }}>
                      WFH
                      <button style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeFilterTag('wfh')}>×</button>
                    </span>
                  )}
                  {filters.partTime && (
                    <span className="badge badge-info" style={{ gap: '4px' }}>
                      Part-time
                      <button style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeFilterTag('partTime')}>×</button>
                    </span>
                  )}
                  {filters.duration && (
                    <span className="badge badge-info" style={{ gap: '4px' }}>
                      Max {filters.duration} Months
                      <button style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeFilterTag('duration')}>×</button>
                    </span>
                  )}
                  {filters.minStipend > 0 && (
                    <span className="badge badge-info" style={{ gap: '4px' }}>
                      Min ₹ {(filters.minStipend).toLocaleString('en-IN')}/mo
                      <button style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => removeFilterTag('minStipend')}>×</button>
                    </span>
                  )}
                  <button className={styles.clearBtn} onClick={resetFilters} style={{ marginLeft: 'auto', textDecoration: 'none' }}>
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Layout Column Wrapper */}
            <div className="search-layout">
              {/* Sidebar Filters */}
              <Filters
                allProfiles={allProfiles}
                allLocations={allLocations}
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                isMobileOpen={isMobileFiltersOpen}
                setIsMobileOpen={setIsMobileFiltersOpen}
              />

              {/* Internships Cards Stack */}
              <div className="cards-stack" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {loading ? (
                  // Rendering skeleton items during fetch
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className={styles.skeletonCard}>
                      <div className={styles.skeletonHeader}>
                        <div className={styles.skeletonLine} style={{ width: '40%', height: '24px' }}></div>
                        <div className={styles.skeletonLine} style={{ width: '50px', height: '50px', borderRadius: '6px' }}></div>
                      </div>
                      <div className={styles.skeletonLine} style={{ width: '25%', height: '16px', marginTop: '-8px' }}></div>
                      <div className={styles.skeletonLine} style={{ width: '30%', height: '16px', margin: '8px 0' }}></div>
                      <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '4px 0' }} />
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div className={styles.skeletonLine} style={{ width: '20%', height: '16px' }}></div>
                        <div className={styles.skeletonLine} style={{ width: '20%', height: '16px' }}></div>
                        <div className={styles.skeletonLine} style={{ width: '25%', height: '16px' }}></div>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={styles.skeletonLine} style={{ width: '15%', height: '16px' }}></div>
                        <div className={styles.skeletonLine} style={{ width: '80px', height: '32px' }}></div>
                      </div>
                    </div>
                  ))
                ) : filteredInternships.length > 0 ? (
                  filteredInternships.map(internship => (
                    <InternshipCard 
                      key={internship.id} 
                      internship={internship} 
                    />
                  ))
                ) : (
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyTitle}>No internships matched your filters</div>
                    <p className={styles.emptyText}>
                      We couldn't find any listings matching your current criteria. Try expanding your search queries or clearing active filters.
                    </p>
                    <button className={styles.resetFiltersBtn} onClick={resetFilters}>
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
