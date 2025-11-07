import React from 'react';
import Link from 'next/link';

// Импортируем данные из JSON файла
import articles from '../data/articles.json';

export default function Home() {
  // Фильтруем только опубликованные статьи
  const publishedArticles = articles.filter(article => article.published);

  return (
    <div className="article-container">
      <div className="article-header">
        <div className="tag">БЛОГ</div>
        <h1>АВТОМАТИЧЕСКИЙ БЛОГ</h1>
        <p className="subtitle">Статьи автоматически публикуются из JSON файла</p>
      </div>

      <div className="content-block">
        <h2>ПОСЛЕДНИЕ СТАТЬИ</h2>
        
        {publishedArticles.length === 0 ? (
          <div className="future-section">
            <p>Пока нет опубликованных статей. Добавьте их в файл данных!</p>
          </div>
        ) : (
          <div className="feature-grid">
            {publishedArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="feature-item" style={{ cursor: 'pointer' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{article.title}</h3>
                  <p style={{ margin: '0 0 8px 0', opacity: 0.9 }}>{article.subtitle}</p>
                  <small style={{ opacity: 0.7 }}>
                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                  </small>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '30px', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link href="/how-to-add" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#20BAEF',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              📝 Как добавить статью
            </div>
          </Link>

          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#732BC1',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              ⚙️ Админка
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
