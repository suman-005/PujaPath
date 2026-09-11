import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './common/LanguageSelector';

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');
  const isAuthenticated = Boolean(token);
  const isAdmin = userRole === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setMobileMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#ffd54f' : '#ffffff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: isActive ? '700' : '500',
    borderBottom: isActive ? '2px solid #ffd54f' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease',
  });

  return (
    <header
      style={{
        backgroundColor: '#800000',
        borderBottom: '3px solid #b71c1c',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#fff',
          }}
        >
          <span style={{ fontSize: '24px' }} role="img" aria-label="Trishul">
            🔱
          </span>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', 'Tiro Bangla', serif",
                fontSize: '22px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                color: '#ffecb3',
                lineHeight: 1.1,
              }}
            >
              পূজাপথ <span style={{ fontSize: '16px', fontWeight: '400', color: '#fff' }}>PujaPath</span>
            </div>
            <div style={{ fontSize: '10px', color: '#ffcdd2', letterSpacing: '0.4px' }}>
              পূর্ব বর্ধমান দুর্গাপূজা নির্দেশিকা
            </div>
          </div>
        </Link>

        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <NavLink to="/" style={navLinkStyle}>
            {t('navigation.home', 'Home')}
          </NavLink>
          <NavLink to="/pujas" style={navLinkStyle}>
            {t('navigation.explorePuja', 'Explore Pujas')}
          </NavLink>
          <NavLink to="/map" style={navLinkStyle}>
            {t('navigation.map', 'Map')}
          </NavLink>
          <NavLink to="/emergency" style={navLinkStyle}>
            {t('navigation.emergency', 'Emergency')}
          </NavLink>
          <NavLink to="/assistant" style={navLinkStyle}>
            {t('navigation.assistant', 'AI Assistant')}
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" style={navLinkStyle}>
              {t('navigation.admin', 'Admin')}
            </NavLink>
          )}

          <div style={{ marginLeft: '6px' }}>
            <LanguageSelector />
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {t('navigation.logout', 'Logout')}
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: '#ffd54f',
                color: '#800000',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {t('navigation.login', 'Login')}
            </Link>
          )}
        </nav>

        <div className="mobile-nav-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <LanguageSelector />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            backgroundColor: '#6b0000',
            borderTop: '1px solid #b71c1c',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}
          >
            🏠 {t('navigation.home', 'Home')}
          </Link>
          <Link
            to="/pujas"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}
          >
            🪔 {t('navigation.explorePuja', 'Explore Pujas')}
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}
          >
            🗺️ {t('navigation.map', 'Map')}
          </Link>
          <Link
            to="/emergency"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}
          >
            🚨 {t('navigation.emergency', 'Emergency & Helplines')}
          </Link>
          <Link
            to="/assistant"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}
          >
            🤖 {t('navigation.assistant', 'AI Assistant')}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ffd54f', textDecoration: 'none', fontSize: '15px', fontWeight: '700' }}
            >
              ⚙️ {t('navigation.admin', 'Admin')}
            </Link>
          )}
          <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {t('navigation.logout', 'Logout')}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#ffd54f',
                  color: '#800000',
                  textDecoration: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '700',
                }}
              >
                {t('navigation.login', 'Login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
