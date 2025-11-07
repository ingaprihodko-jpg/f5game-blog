'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  published: boolean;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Загружаем статьи при загрузке страницы
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles/update');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const updateArticles = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/articles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articles),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка при обновлении статей');
    } finally {
      setLoading(false);
    }
  };

  const importFromSheets = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/articles/import', {
        method: 'POST',
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ ${result.message} (Всего статей: ${result.total})`);
        // Обновляем список статей
        fetchArticles();
      } else {
        setMessage(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка при импорте статей');
    } finally {
      setLoading(false);
    }
  };

  const addNewArticle = () => {
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: 'Новая статья',
      subtitle: 'Описание статьи',
      content: 'Содержание статьи...\n\n## Заголовок\n\n- Пункт 1\n- Пункт 2\n\n**Жирный текст**\n\n*Курсив*',
      published: true,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setArticles([...articles, newArticle]);
  };

  const updateArticle = (index: number, field: keyof Article, value: any) => {
    const updatedArticles = [...articles];
    updatedArticles[index] = { ...updatedArticles[index], [field]: value };
    setArticles(updatedArticles);
  };

  const deleteArticle = (index: number) => {
    const updatedArticles = articles.filter((_, i) => i !== index);
    setArticles(updatedArticles);
  };

  return (
    <div className="article-container">
      <div className="article-header">
        <div className="tag">АДМИНКА</div>
        <h1>УПРАВЛЕНИЕ СТАТЬЯМИ</h1>
        <p className="subtitle">Редактирование и публикация статей</p>
      </div>

      <div className="content-block">
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={addNewArticle}
            style={{
              background: '#2AA817',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            + Добавить статью
          </button>
          
          <button 
            onClick={updateArticles}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#732BC1',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Сохранение...' : '💾 Сохранить все статьи'}
          </button>

          <button 
            onClick={importFromSheets}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#FF9ADF',
              color: '#333',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Импорт...' : '📥 Импорт из Google Sheets'}
          </button>

          <button 
            onClick={() => router.push('/')}
            style={{
              background: '#20BAEF',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            👁️ Посмотреть блог
          </button>

          <button 
            onClick={() => router.push('/auto-import')}
            style={{
              background: '#F7E432',
              color: '#333',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ⚡ Автоимпорт
          </button>
        </div>

        {message && (
          <div style={{
            background: message.includes('✅') ? '#E8F5E9' : '#FFE6E6',
            color: message.includes('✅') ? '#2AA817' : '#ED1E79',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: `2px solid ${message.includes('✅') ? '#2AA817' : '#ED1E79'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {articles.map((article, index) => (
            <div key={article.id} style={{
              border: '2px solid #390084',
              borderRadius: '12px',
              padding: '20px',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#732BC1', margin: 0 }}>Статья #{index + 1}</h3>
                <button 
                  onClick={() => deleteArticle(index)}
                  style={{
                    background: '#ED1E79',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Удалить
                </button>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#390084' }}>
                    ID статьи:
                  </label>
                  <input
                    type="text"
                    value={article.id}
                    onChange={(e) => updateArticle(index, 'id', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #20BAEF',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#390084' }}>
                    Заголовок:
                  </label>
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) => updateArticle(index, 'title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #20BAEF',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#390084' }}>
                    Подзаголовок:
                  </label>
                  <input
                    type="text"
                    value={article.subtitle}
                    onChange={(e) => updateArticle(index, 'subtitle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #20BAEF',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#390084' }}>
                    Содержание (Markdown):
                  </label>
                  <textarea
                    value={article.content}
                    onChange={(e) => updateArticle(index, 'content', e.target.value)}
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #20BAEF',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <label style={{ fontWeight: '600', color: '#390084' }}>
                    <input
                      type="checkbox"
                      checked={article.published}
                      onChange={(e) => updateArticle(index, 'published', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Опубликовано
                  </label>

                  <span style={{ color: '#732BC1', fontSize: '14px' }}>
                    Дата: {article.created_at}
                  </span>

                  <button 
                    onClick={() => router.push(`/articles/${article.id}`)}
                    style={{
                      background: '#F7E432',
                      color: '#333',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: 'auto'
                    }}
                  >
                    👁️ Предпросмотр
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="future-section">
            <p>Пока нет статей. Добавьте первую статью!</p>
          </div>
        )}
      </div>
    </div>
  );
}