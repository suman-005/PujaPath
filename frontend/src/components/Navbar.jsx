import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authStorage } from '../services/api';
import { LanguageSelector } from './common/LanguageSelector';

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = authStorage.getUser();

  const handleLogout = () => {
    authStorage.clear();
    navigate('/');
  };

  return (
    <header
      style={{
        backgroundColor: '#8b0000',
        color: '#ffffff',
        borderBottom: '3px solid #ffcc00',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '24px' }}>🪔</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.1' }}>
                PUJAPATH
              </div>
              <div style={{ fontSize: '11px', color: '#ffecb3', fontWeight: '500' }}>
                {t('navigation.brandSubtitle')}
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
          className="desktop-nav"
        >
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            {t('navigation.home')}
          </Link>
          <Link to="/pujas" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            {t('navigation.explorePuja')}
          </Link>
          <Link to="/map" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            {t('navigation.map')}
          </Link>
          <Link to="/emergency" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            {t('navigation.emergency')}
          </Link>
          <Link to="/assistant" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            {t('navigation.assistant')}
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ color: '#ffeb3b', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
              {t('navigation.admin')}
            </Link>
          )}

          {/* Language Selector */}
          <LanguageSelector />

          {/* User Auth controls */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {t('navigation.logout')}
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: '#ffcc00',
                color: '#8b0000',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {t('navigation.login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;