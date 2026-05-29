'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleNavClick = (portalName) => {
    setIsOpen(false);
    if (portalName === 'Internships') {
      addToast("You are already browsing the Internships portal!", "success");
      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast(`The ${portalName} portal is a mock route for this search clone.`, "info");
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setIsOpen(false);
    // Reset forms
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    
    // Simple Validation
    if (!email.trim() || !password.trim()) {
      addToast("Please fill in all fields.", "error");
      return;
    }
    if (authMode === 'register' && !fullName.trim()) {
      addToast("Please enter your name.", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (!email.includes('@')) {
      addToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAuthOpen(false);
      if (authMode === 'login') {
        addToast("Successfully logged in!", "success");
      } else {
        addToast("Account created successfully! Welcome.", "success");
      }
    }, 1500);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={`${styles.navContainer} container`}>
          <a href="#" className={styles.logo} onClick={() => handleNavClick('Internships')}>
            <span className={styles.logoText}>intern</span>
            <span className={styles.logoSub}>shala</span>
            <span className={styles.logoDot}>•</span>
          </a>

          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Navigation Menu">
            <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ opacity: isOpen ? 0 : 1 }}></span>
            <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
          </button>

          <ul className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}>
            <li className={styles.navItem} onClick={() => handleNavClick('Internships')}>Internships</li>
            <li className={styles.navItem} onClick={() => handleNavClick('Jobs')}>Jobs</li>
            <li className={styles.navItem} onClick={() => handleNavClick('Courses')}>Courses</li>
            <li className={styles.navItem} onClick={() => handleNavClick('Mentorships')}>Mentorships</li>
            
            <li className={styles.navActionsMobile}>
              <button className={styles.loginBtn} onClick={() => openAuth('login')}>Login</button>
              <button className={styles.registerBtn} onClick={() => openAuth('register')}>Register</button>
            </li>
          </ul>

          <div className={styles.navActions}>
            <button className={styles.loginBtn} onClick={() => openAuth('login')}>Login</button>
            <button className={styles.registerBtn} onClick={() => openAuth('register')}>Register</button>
          </div>
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsAuthOpen(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsAuthOpen(false)} aria-label="Close modal">×</button>
            
            <h3 className={styles.modalTitle}>
              {authMode === 'login' ? 'Login' : 'Register'}
            </h3>

            <div className={styles.modalTabs}>
              <button 
                type="button"
                className={`${styles.modalTab} ${authMode === 'login' ? styles.activeTab : ''}`}
                onClick={() => openAuth('login')}
              >
                Login
              </button>
              <button 
                type="button"
                className={`${styles.modalTab} ${authMode === 'register' ? styles.activeTab : ''}`}
                onClick={() => openAuth('register')}
              >
                Candidate Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input 
                    type="text" 
                    className={styles.modalInput}
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input 
                  type="email" 
                  className={styles.modalInput}
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password</label>
                <input 
                  type="password" 
                  className={styles.modalInput}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting && <div className={styles.spinner} />}
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            <div className={styles.switchPrompt}>
              {authMode === 'login' ? (
                <>
                  New to Internshala?{' '}
                  <span className={styles.switchLink} onClick={() => openAuth('register')}>
                    Register here
                  </span>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <span className={styles.switchLink} onClick={() => openAuth('login')}>
                    Login here
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications System */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <div key={toast.id} className={`${styles.toast} ${toast.type === 'success' ? styles.success : toast.type === 'error' ? styles.error : ''}`}>
            {toast.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`${styles.toastIcon} ${styles.successIcon}`} style={{ color: 'var(--success)' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : toast.type === 'error' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.toastIcon} style={{ color: '#ef4444' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.toastIcon} style={{ color: 'var(--primary-color)' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
