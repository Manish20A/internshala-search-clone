'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navContainer} container`}>
        <a href="#" className={styles.logo}>
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
          <li className={styles.navItem} onClick={() => setIsOpen(false)}>Internships</li>
          <li className={styles.navItem} onClick={() => setIsOpen(false)}>Jobs</li>
          <li className={styles.navItem} onClick={() => setIsOpen(false)}>Courses</li>
          <li className={styles.navItem} onClick={() => setIsOpen(false)}>Mentorships</li>
          
          <li className={styles.navActionsMobile}>
            <button className={styles.loginBtn}>Login</button>
            <button className={styles.registerBtn}>Register</button>
          </li>
        </ul>

        <div className={styles.navActions}>
          <button className={styles.loginBtn}>Login</button>
          <button className={styles.registerBtn}>Register</button>
        </div>
      </div>
    </nav>
  );
}
