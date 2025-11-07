import React from 'react';
import ArticleLayout from '../../components/ArticleLayout';
import Link from 'next/link';

// Импортируем данные из JSON файла
import articles from '../../../data/articles.json';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Находим статью по ID
  const article = articles.find(article => article.id === id);

  // Если статья не найдена
  if (!article) {
    return (
      <div className="article-container">
        <div className="content-block">
          <h2>Статья не найдена</h2>
          <p>Запрошенная статья не существует.</p>
          <Link href="/" className="home-link">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  // Получаем все статьи для навигации
  const allArticles = articles;
  const currentIndex = allArticles.findIndex(a => a.id === id);
  const nextArticle = allArticles[currentIndex + 1];
  const prevArticle = allArticles[currentIndex - 1];

  // Функция для преобразования текста в HTML
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('- ')) {
        return (
          <div key={index} className="feature-grid">
            {paragraph.split('\n').filter(line => line.startsWith('- ')).map((item, i) => (
              <div key={i} className="feature-item">
                {item.replace('- ', '')}
              </div>
            ))}
          </div>
        );
      }
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <p key={index} className="article-bold">{paragraph.replace(/\*\*/g, '')}</p>;
      }
      if (paragraph.startsWith('*') && paragraph.endsWith('*') && !paragraph.startsWith('* ')) {
        return <p key={index} className="article-italic">{paragraph.replace(/\*/g, '')}</p>;
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  return (
    <ArticleLayout title={article.title} subtitle={article.subtitle}>
      <div className="content-block">
        {formatContent(article.content)}
        
        {/* Навигация между статьями */}
        <div className="navigation-links">
          {prevArticle ? (
            <Link href={`/articles/${prevArticle.id}`} className="nav-link">
              ← {prevArticle.title}
            </Link>
          ) : (
            <div></div>
          )}
          
          <Link href="/" className="home-link">
            Все статьи
          </Link>
          
          {nextArticle ? (
            <Link href={`/articles/${nextArticle.id}`} className="nav-link">
              {nextArticle.title} →
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </ArticleLayout>
  );
}