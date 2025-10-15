'use client';

import React from 'react';
import type { TemplateProps } from '@/types/templates';

export default function TerminalMaster({ data }: TemplateProps) {
  return (
    <div style={{ 
      background: '#0c0c0c', 
      color: '#00ff41', 
      minHeight: '100vh', 
      padding: '40px 16px',
      fontFamily: '"SF Mono", Monaco, "Courier New", monospace'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'rgba(12, 12, 12, 0.95)', borderRadius: '8px', padding: '24px' }}>
        {/* Terminal Header */}
        <div style={{ borderBottom: '1px solid rgba(0, 255, 65, 0.2)', paddingBottom: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></span>
          </div>
          <div style={{ color: '#00dd36' }}>{data.USER_NAME}@portfolio:~$</div>
        </div>

        {/* Terminal Content */}
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {/* About */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: '#ffaa00', marginBottom: '8px' }}>
              <span style={{ color: '#00dd36' }}>visitor@portfolio</span>
              <span style={{ color: '#008822' }}> ~ </span>
              <span style={{ color: '#00ff41' }}>$</span> cat about.txt
            </div>
            <div style={{ marginLeft: '16px', color: '#00dd36' }}>
              <div style={{ border: '1px solid #00ff41', padding: '16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>{data.USER_NAME}</div>
                <div>{data.USER_TITLE}</div>
              </div>
              <div><span style={{ color: '#ffaa00' }}>BIO:</span> {data.USER_BIO}</div>
              {data.USER_MISSION_STATEMENT && (
                <div><span style={{ color: '#ffaa00' }}>MISSION:</span> {data.USER_MISSION_STATEMENT}</div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: '#ffaa00', marginBottom: '8px' }}>
              <span style={{ color: '#00dd36' }}>visitor@portfolio</span>
              <span style={{ color: '#008822' }}> ~ </span>
              <span style={{ color: '#00ff41' }}>$</span> ./github-stats.sh
            </div>
            <div style={{ marginLeft: '16px', display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ color: '#008822' }}>[REPOS]</div>
                <div style={{ fontSize: '24px' }}>{data.TOTAL_REPOS}</div>
              </div>
              <div>
                <div style={{ color: '#008822' }}>[STARS]</div>
                <div style={{ fontSize: '24px' }}>{data.TOTAL_STARS}</div>
              </div>
              {data.YEARS_EXPERIENCE && (
                <div>
                  <div style={{ color: '#008822' }}>[EXPERIENCE]</div>
                  <div style={{ fontSize: '24px' }}>{data.YEARS_EXPERIENCE}y</div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ color: '#ffaa00', marginBottom: '8px' }}>
              <span style={{ color: '#00dd36' }}>visitor@portfolio</span>
              <span style={{ color: '#008822' }}> ~ </span>
              <span style={{ color: '#00ff41' }}>$</span> ls -la projects/
            </div>
            <div style={{ marginLeft: '16px' }}>
              {data.projects.map((project) => (
                <div key={project.PROJECT_NAME} style={{ marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: '#008822' }}>drwxr-xr-x </span>
                    <span style={{ color: '#008822' }}>{data.USER_NAME} </span>
                    <span style={{ color: '#ffaa00' }}>{project.PROJECT_STARS}★ </span>
                    <a 
                      href={project.PROJECT_URL} 
                      style={{ color: '#00ff41', textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.PROJECT_NAME}/
                    </a>
                  </div>
                  <div style={{ color: '#00dd36', fontSize: '12px', marginLeft: '24px' }}>
                    // {project.PROJECT_DESCRIPTION}
                  </div>
                  <div style={{ color: '#008822', fontSize: '12px', marginLeft: '24px' }}>
                    [{project.PROJECT_LANGUAGE}] {project.PROJECT_FORKS} forks
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ color: '#ffaa00', marginBottom: '8px' }}>
              <span style={{ color: '#00dd36' }}>visitor@portfolio</span>
              <span style={{ color: '#008822' }}> ~ </span>
              <span style={{ color: '#00ff41' }}>$</span> cat links.json
            </div>
            <div style={{ marginLeft: '16px' }}>
              {'{'}<br />
              {data.GITHUB_URL && (
                <>
                  {'  '}"github": "<a href={data.GITHUB_URL} style={{ color: '#00ff41', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{data.GITHUB_URL}</a>",<br />
                </>
              )}
              {data.LINKEDIN_URL && data.LINKEDIN_URL !== '#' && (
                <>
                  {'  '}"linkedin": "<a href={data.LINKEDIN_URL} style={{ color: '#00ff41', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{data.LINKEDIN_URL}</a>",<br />
                </>
              )}
              {data.USER_EMAIL && (
                <>
                  {'  '}"email": "<a href={`mailto:${data.USER_EMAIL}`} style={{ color: '#00ff41', textDecoration: 'none' }}>{data.USER_EMAIL}</a>",<br />
                </>
              )}
              {data.CV_URL && (
                <>
                  {'  '}"resume": "<a href={data.CV_URL} style={{ color: '#00ff41', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">Download CV</a>"<br />
                </>
              )}
              {'}'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '16px', borderTop: '1px solid rgba(0, 255, 65, 0.2)', textAlign: 'center', color: '#008822' }}>
          <span>© {new Date().getFullYear()} {data.USER_NAME}</span>
          <span style={{ margin: '0 8px' }}>|</span>
          <span>Powered by <a href="https://portfolyo.dev" style={{ color: '#00ff41', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">Portfolyo</a></span>
        </div>
      </div>
    </div>
  );
}

