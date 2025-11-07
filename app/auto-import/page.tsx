'use client';
import React, { useState, useEffect } from 'react';

export default function AutoImportPage() {
  const [status, setStatus] = useState('Готов к работе');
  const [lastImport, setLastImport] = useState<string | null>(null);
  const [isAutoImport, setIsAutoImport] = useState(false);

  // Функция для импорта статей
  const importArticles = async () => {
    setStatus('Импорт...');
    
    try {
      const response = await fetch('/api/articles/import', {
        method: 'POST',
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus(`✅ Успешно импортировано ${result.imported} статей`);
        setLastImport(new Date().toLocaleString('ru-RU'));
      } else {
        setStatus(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Ошибка при импорте');
    }
  };

  // Автоматический импорт каждые 5 минут
  useEffect(() => {
    if (!isAutoImport) return;

    const interval = setInterval(() => {
      importArticles();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [isAutoImport]);

  return (
    <div className="article-container">
      <div className="article-header">
        <div className="tag">АВТОМАТИЗАЦИЯ</div>
        <h1>АВТОМАТИЧЕСКИЙ ИМПОРТ</h1>
        <p className="subtitle">Статьи из Google Sheets</p>
      </div>

      <div className="content-block">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            background: '#E6F7FF',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #20BAEF',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#20BAEF', marginBottom: '10px' }}>Статус системы</h3>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#390084' }}>
              {status}
            </p>
            {lastImport && (
              <p style={{ color: '#732BC1', fontSize: '14px' }}>
                Последний импорт: {lastImport}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={importArticles}
              style={{
                background: '#2AA817',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              📥 Запустить импорт сейчас
            </button>

            <button 
              onClick={() => setIsAutoImport(!isAutoImport)}
              style={{
                background: isAutoImport ? '#ED1E79' : '#732BC1',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              {isAutoImport ? '⏹️ Остановить автоимпорт' : '🔄 Включить автоимпорт'}
            </button>
          </div>

          {isAutoImport && (
            <div style={{
              background: '#FFF9E6',
              border: '2px solid #F7E432',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <p style={{ color: '#333', margin: 0 }}>
                ⚡ <strong>Автоимпорт включен</strong> - система будет автоматически проверять новые статьи каждые 5 минут
              </p>
            </div>
          )}
        </div>

        <div className="feature-grid">
          <div className="feature-item">
            <h4>📊 Google Sheets</h4>
            <p>Данные берутся из таблиц Google</p>
          </div>
          <div className="feature-item">
            <h4>⚡ Автоматизация</h4>
            <p>Статьи обновляются автоматически</p>
          </div>
          <div className="feature-item">
            <h4>🎨 Оформление</h4>
            <p>Автоматическое применение стилей</p>
          </div>
          <div className="feature-item">
            <h4>📱 Готово</h4>
            <p>Система работает без вмешательства</p>
          </div>
        </div>
      </div>
    </div>
  );
}