import React from 'react';

export default function ArticleLayout({ title, subtitle, children }) {
  return (
    <div className="article-container">
      <div className="article-header">
        <div className="tag">СТАТЬЯ</div>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      
      <div className="article-content">
        {children}
      </div>
    </div>
  );
}