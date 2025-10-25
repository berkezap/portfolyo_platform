'use client';

import React from 'react';
import type { TemplateProps } from '@/types/templates';

export default function GitHubNative({ data }: TemplateProps) {
  // Safety checks
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ 
      background: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '32px 16px'
      }}>
      {/* Header */}
      <header style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #d0d7de' }}>
        {data.USER_AVATAR && (
          <img 
            src={data.USER_AVATAR} 
            alt={data.USER_NAME || 'User'} 
            style={{ width: '96px', height: '96px', borderRadius: '50%', marginBottom: '16px' }}
          />
        )}
        <h1 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '8px' }}>{data.USER_NAME || 'User'}</h1>
        <p style={{ fontSize: '20px', color: '#656d76', marginBottom: '8px' }}>{data.USER_TITLE || 'Developer'}</p>
        <p style={{ fontSize: '16px', marginBottom: '24px' }}>{data.USER_BIO || 'No bio available'}</p>
        
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div>
            <strong>{data.TOTAL_REPOS}</strong> repositories
          </div>
          <div>
            <strong>{data.TOTAL_STARS}</strong> stars earned
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {data.GITHUB_URL && (
            <a href={data.GITHUB_URL} style={{ color: '#0969da', textDecoration: 'none' }}>
              GitHub
            </a>
          )}
          {data.LINKEDIN_URL && data.LINKEDIN_URL !== '#' && (
            <a href={data.LINKEDIN_URL} style={{ color: '#0969da', textDecoration: 'none' }}>
              LinkedIn
            </a>
          )}
          {data.USER_EMAIL && (
            <a href={`mailto:${data.USER_EMAIL}`} style={{ color: '#0969da', textDecoration: 'none' }}>
              Email
            </a>
          )}
          {data.CV_URL && (
            <a href={data.CV_URL} style={{ color: '#0969da', textDecoration: 'none' }}>
              Download CV
            </a>
          )}
        </div>
      </header>

      {/* Projects */}
      <section>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Pinned Repositories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {data.projects.map((project) => (
            <article 
              key={project.PROJECT_NAME}
              style={{ 
                border: '1px solid #d0d7de', 
                borderRadius: '6px', 
                padding: '16px',
                backgroundColor: '#ffffff'
              }}
            >
              <h3 style={{ marginBottom: '8px' }}>
                <a 
                  href={project.PROJECT_URL} 
                  style={{ color: '#0969da', textDecoration: 'none', fontSize: '16px', fontWeight: '600' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.PROJECT_NAME}
                </a>
              </h3>
              <p style={{ color: '#656d76', fontSize: '14px', marginBottom: '12px' }}>
                {project.PROJECT_DESCRIPTION}
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#656d76' }}>
                <span>{project.PROJECT_LANGUAGE}</span>
                <span>⭐ {project.PROJECT_STARS}</span>
                <span>🔀 {project.PROJECT_FORKS}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #d0d7de', textAlign: 'center', color: '#656d76' }}>
        <p>© {new Date().getFullYear()} {data.USER_NAME}. Built with Portfolyo</p>
      </footer>
      </div>
    </div>
  );
}

