'use client';

import React, { useState, useEffect } from 'react';
import type { TemplateProps } from '@/types/templates';

export default function BentoGridPro({ data }: TemplateProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const colors = theme === 'light'
    ? { 
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        text: '#1d1d1f', 
        secondary: '#4a5568', 
        card: 'rgba(255, 255, 255, 0.85)', 
        border: 'rgba(255, 255, 255, 0.5)',
        shadow: '0 8px 32px 0 rgba(102, 126, 234, 0.15)'
      }
    : { 
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        text: '#f5f5f7', 
        secondary: '#98989d', 
        card: 'rgba(255, 255, 255, 0.05)', 
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      };

  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: '100vh', width: '100%', margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', transition: 'all 0.3s', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', boxSizing: 'border-box' }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: colors.card,
          border: `1px solid ${colors.border}`,
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', boxSizing: 'border-box' }}>
        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Hero Card */}
          <div style={{ background: colors.card, borderRadius: '20px', padding: '32px', border: `1px solid ${colors.border}`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: colors.shadow, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = colors.shadow; }}>
            <img src={data.USER_AVATAR} alt={data.USER_NAME} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px' }} />
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{data.USER_NAME}</h1>
            <p style={{ color: colors.secondary, marginBottom: '8px' }}>{data.USER_TITLE}</p>
            <p style={{ color: colors.secondary }}>{data.USER_BIO}</p>
          </div>

          {/* Stats Card */}
          <div style={{ background: colors.card, borderRadius: '20px', padding: '32px', border: `1px solid ${colors.border}`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: colors.shadow, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = colors.shadow; }}>
            <h2 style={{ marginBottom: '16px' }}>GitHub Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.TOTAL_REPOS}</div>
                <div style={{ color: colors.secondary }}>Repositories</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.TOTAL_STARS}</div>
                <div style={{ color: colors.secondary }}>Stars Earned</div>
              </div>
              {data.YEARS_EXPERIENCE && (
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.YEARS_EXPERIENCE}</div>
                  <div style={{ color: colors.secondary }}>Years of Code</div>
                </div>
              )}
            </div>
          </div>

          {/* Links Card */}
          <div style={{ background: colors.card, borderRadius: '20px', padding: '32px', border: `1px solid ${colors.border}`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: colors.shadow, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = colors.shadow; }}>
            <h2 style={{ marginBottom: '16px' }}>Connect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.GITHUB_URL && (
                <a href={data.GITHUB_URL} style={{ color: colors.text, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                  GitHub →
                </a>
              )}
              {data.LINKEDIN_URL && data.LINKEDIN_URL !== '#' && (
                <a href={data.LINKEDIN_URL} style={{ color: colors.text, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                  LinkedIn →
                </a>
              )}
              {data.USER_EMAIL && (
                <a href={`mailto:${data.USER_EMAIL}`} style={{ color: colors.text, textDecoration: 'none' }}>
                  Email →
                </a>
              )}
              {data.CV_URL && (
                <a href={data.CV_URL} style={{ color: colors.text, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                  Download CV →
                </a>
              )}
            </div>
          </div>

          {/* Project Cards */}
          {data.projects.map((project) => (
            <div
              key={project.PROJECT_NAME}
              style={{ background: colors.card, borderRadius: '20px', padding: '24px', border: `1px solid ${colors.border}`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: colors.shadow, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = colors.shadow; }}
            >
              <h3 style={{ marginBottom: '8px' }}>{project.PROJECT_NAME}</h3>
              <p style={{ color: colors.secondary, fontSize: '14px', marginBottom: '12px' }}>
                {project.PROJECT_DESCRIPTION}
              </p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: colors.secondary, marginBottom: '12px' }}>
                <span>{project.PROJECT_LANGUAGE}</span>
                <span>⭐ {project.PROJECT_STARS}</span>
                <span>🔀 {project.PROJECT_FORKS}</span>
              </div>
              <a
                href={project.PROJECT_URL}
                style={{ color: '#007aff', textDecoration: 'none' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project →
              </a>
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '64px', textAlign: 'center', color: colors.secondary }}>
          <p>© {new Date().getFullYear()} {data.USER_NAME}. Designed with Portfolyo</p>
        </footer>
      </div>
    </div>
  );
}

