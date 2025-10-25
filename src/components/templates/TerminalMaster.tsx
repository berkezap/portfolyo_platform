'use client';

import React, { useState, useEffect } from 'react';
import type { TemplateProps } from '@/types/templates';

export default function TerminalMaster({ 
  data, 
  darkMode: initialDarkMode = true 
}: TemplateProps) {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [typingText, setTypingText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const welcomeText = `Welcome to ${data.USER_NAME}'s portfolio terminal...`;
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Typing animation effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < welcomeText.length) {
        setTypingText(welcomeText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [welcomeText]);

  // Cursor blinking effect
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursor);
  }, []);

  // Theme colors
  const colors = {
    background: darkMode ? '#0c0c0c' : '#f8f8f8',
    terminalBg: darkMode ? 'rgba(12, 12, 12, 0.95)' : 'rgba(248, 248, 248, 0.95)',
    primary: darkMode ? '#00ff41' : '#006600',
    secondary: darkMode ? '#00dd36' : '#004400', 
    accent: darkMode ? '#ffaa00' : '#cc8800',
    muted: darkMode ? '#008822' : '#666666',
    border: darkMode ? 'rgba(0, 255, 65, 0.2)' : 'rgba(0, 102, 0, 0.2)',
    red: '#ff5f56',
    yellow: '#ffbd2e', 
    green: '#27c93f'
  };
  return (
    <div style={{ 
      background: colors.background, 
      color: colors.primary, 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      fontFamily: '"SF Mono", Monaco, "Courier New", monospace',
      position: 'relative'
    }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '4px',
          background: colors.terminalBg,
          border: `1px solid ${colors.border}`,
          color: colors.primary,
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000,
          fontFamily: 'monospace'
        }}
      >
        {darkMode ? '☀' : '🌙'}
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto', background: colors.terminalBg, borderRadius: '8px', padding: '24px', marginTop: '40px', marginLeft: '16px', marginRight: '16px' }}>
        {/* Terminal Header */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: colors.red }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: colors.yellow }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: colors.green }}></span>
          </div>
          <div style={{ color: colors.secondary }}>
            {typingText}
            {showCursor && <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>}
          </div>
          <div style={{ color: colors.secondary, marginTop: '8px' }}>{data.USER_NAME}@portfolio:~$</div>
        </div>

        {/* Terminal Content */}
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {/* About */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: colors.accent, marginBottom: '8px' }}>
              <span style={{ color: colors.secondary }}>visitor@portfolio</span>
              <span style={{ color: colors.muted }}> ~ </span>
              <span style={{ color: colors.primary }}>$</span> cat about.txt
            </div>
            <div style={{ marginLeft: '16px', color: colors.secondary }}>
              <div style={{ border: `1px solid ${colors.primary}`, padding: '16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>{data.USER_NAME}</div>
                <div>{data.USER_TITLE}</div>
              </div>
              <div><span style={{ color: colors.accent }}>BIO:</span> {data.USER_BIO}</div>
              {data.USER_MISSION_STATEMENT && (
                <div><span style={{ color: colors.accent }}>MISSION:</span> {data.USER_MISSION_STATEMENT}</div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: colors.accent, marginBottom: '8px' }}>
              <span style={{ color: colors.secondary }}>visitor@portfolio</span>
              <span style={{ color: colors.muted }}> ~ </span>
              <span style={{ color: colors.primary }}>$</span> ./github-stats.sh
            </div>
            <div style={{ marginLeft: '16px', display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ color: colors.muted }}>[REPOS]</div>
                <div style={{ fontSize: '24px' }}>{data.TOTAL_REPOS}</div>
              </div>
              <div>
                <div style={{ color: colors.muted }}>[STARS]</div>
                <div style={{ fontSize: '24px' }}>{data.TOTAL_STARS}</div>
              </div>
              {data.YEARS_EXPERIENCE && (
                <div>
                  <div style={{ color: colors.muted }}>[EXPERIENCE]</div>
                  <div style={{ fontSize: '24px' }}>{data.YEARS_EXPERIENCE}y</div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: colors.accent, marginBottom: '8px' }}>
              <span style={{ color: colors.secondary }}>visitor@portfolio</span>
              <span style={{ color: colors.muted }}> ~ </span>
              <span style={{ color: colors.primary }}>$</span> ls -la projects/
            </div>
            <div style={{ marginLeft: '16px' }}>
              {data.projects.map((project) => (
                <div key={project.PROJECT_NAME} style={{ marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: colors.muted }}>drwxr-xr-x </span>
                    <span style={{ color: colors.muted }}>{data.USER_NAME} </span>
                    <span style={{ color: colors.accent }}>{project.PROJECT_STARS}★ </span>
                    <a 
                      href={project.PROJECT_URL} 
                      style={{ color: colors.primary, textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.PROJECT_NAME}/
                    </a>
                  </div>
                  <div style={{ color: colors.secondary, fontSize: '12px', marginLeft: '24px' }}>
                    // {project.PROJECT_DESCRIPTION}
                  </div>
                  <div style={{ color: colors.muted, fontSize: '12px', marginLeft: '24px' }}>
                    [{project.PROJECT_LANGUAGE}] {project.PROJECT_FORKS} forks
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ color: colors.accent, marginBottom: '8px' }}>
              <span style={{ color: colors.secondary }}>visitor@portfolio</span>
              <span style={{ color: colors.muted }}> ~ </span>
              <span style={{ color: colors.primary }}>$</span> cat links.json
            </div>
            <div style={{ marginLeft: '16px' }}>
              {'{'}<br />
              {data.GITHUB_URL && (
                <>
                  {'  '}&quot;github&quot;: &quot;<a href={data.GITHUB_URL} style={{ color: colors.primary, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{data.GITHUB_URL}</a>&quot;,<br />
                </>
              )}
              {data.LINKEDIN_URL && data.LINKEDIN_URL !== '#' && (
                <>
                  {'  '}&quot;linkedin&quot;: &quot;<a href={data.LINKEDIN_URL} style={{ color: colors.primary, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{data.LINKEDIN_URL}</a>&quot;,<br />
                </>
              )}
              {data.USER_EMAIL && (
                <>
                  {'  '}&quot;email&quot;: &quot;<a href={`mailto:${data.USER_EMAIL}`} style={{ color: colors.primary, textDecoration: 'none' }}>{data.USER_EMAIL}</a>&quot;,<br />
                </>
              )}
              {data.CV_URL && (
                <>
                  {'  '}&quot;resume&quot;: &quot;<a href={data.CV_URL} style={{ color: colors.primary, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">Download CV</a>&quot;<br />
                </>
              )}
              {'}'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '16px', borderTop: `1px solid ${colors.border}`, textAlign: 'center', color: colors.muted }}>
          <span>© {new Date().getFullYear()} {data.USER_NAME}</span>
          <span style={{ margin: '0 8px' }}>|</span>
          <span>Powered by <a href="https://portfolyo.tech" style={{ color: colors.primary, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">Portfolyo</a></span>
          {/* Footer comment */}
        </div>
      </div>
    </div>
  );
}

