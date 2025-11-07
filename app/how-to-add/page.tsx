'use client';

export default function HowToAddPage() {
  return (
    <div className="article-container">
      <div className="article-header">
        <div className="tag">ИНСТРУКЦИЯ</div>
        <h1>КАК ДОБАВИТЬ СТАТЬЮ</h1>
        <p className="subtitle">Через Google Sheets</p>
      </div>

      <div className="content-block">
        <h2>📝 ШАГИ ДОБАВЛЕНИЯ СТАТЬИ</h2>
        
        <div className="feature-grid">
          <div className="feature-item">
            <h4>1. Откройте Google таблицу</h4>
            <p><a href="https://docs.google.com/spreadsheets/d/129bffe_1ePvtcNRXgG9U6JqgJKYzGwokz0ONVMAS8iI/edit" target="_blank" style={{color: 'white', textDecoration: 'underline'}}>Нажмите чтобы открыть таблицу</a></p>
          </div>
          <div className="feature-item">
            <h4>2. Добавьте новую строку</h4>
            <p>Заполните все колонки по образцу ниже</p>
          </div>
          <div className="feature-item">
            <h4>3. Запустите импорт</h4>
            <p>Нажмите кнопку импорта на сайте</p>
          </div>
          <div className="feature-item">
            <h4>4. Готово!</h4>
            <p>Статья автоматически появится на сайте</p>
          </div>
        </div>

        <div style={{ background: '#FFE6F7', padding: '25px', borderRadius: '12px', margin: '20px 0' }}>
          <h3 style={{ color: '#ED1E79' }}>📋 ФОРМАТ ДАННЫХ В ТАБЛИЦЕ:</h3>
          <div style={{ overflowX: 'auto', marginTop: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#390084', color: 'white' }}>
                  <th style={{ padding: '12px', border: '2px solid #732BC1', textAlign: 'left' }}>id</th>
                  <th style={{ padding: '12px', border: '2px solid #732BC1', textAlign: 'left' }}>title</th>
                  <th style={{ padding: '12px', border: '2px solid #732BC1', textAlign: 'left' }}>subtitle</th>
                  <th style={{ padding: '12px', border: '2px solid #732BC1', textAlign: 'left' }}>content</th>
                  <th style={{ padding: '12px', border: '2px solid #732BC1', textAlign: 'left' }}>published</th>
                  <th style={{ padding: '12px', border: '2px solid #732BC1', textAlign: 'left' }}>created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', border: '2px solid #20BAEF', background: '#E6F7FF', fontFamily: 'monospace' }}>my-article</td>
                  <td style={{ padding: '12px', border: '2px solid #20BAEF', background: '#E6F7FF' }}>Заголовок статьи</td>
                  <td style={{ padding: '12px', border: '2px solid #20BAEF', background: '#E6F7FF' }}>Краткое описание</td>
                  <td style={{ padding: '12px', border: '2px solid #20BAEF', background: '#E6F7FF', fontFamily: 'monospace', fontSize: '12px' }}>Текст статьи... Можно использовать **жирный** и *курсив*</td>
                  <td style={{ padding: '12px', border: '2px solid #20BAEF', background: '#E6F7FF', fontFamily: 'monospace' }}>TRUE</td>
                  <td style={{ padding: '12px', border: '2px solid #20BAEF', background: '#E6F7FF', fontFamily: 'monospace' }}>2024-01-20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: '#E8F5E9', padding: '20px', borderRadius: '8px', border: '2px solid #2AA817', margin: '20px 0' }}>
          <h4 style={{ color: '#2AA817', margin: '0 0 10px 0' }}>💡 ПРИМЕР ЗАПОЛНЕНИЯ:</h4>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', background: 'white', padding: '15px', borderRadius: '6px' }}>
            id: test-article<br/>
            title: Моя первая статья<br/>
            subtitle: Тестирование системы<br/>
            content: Это моя статья!**Жирный текст***Курсив*<br/>
            published: TRUE<br/>
            created_at: 2024-01-20
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.open('https://docs.google.com/spreadsheets/d/129bffe_1ePvtcNRXgG9U6JqgJKYzGwokz0ONVMAS8iI/edit', '_blank')}
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
              📊 Открыть Google таблицу
            </button>

            <button 
              onClick={() => window.location.href = '/auto-import'}
              style={{
                background: '#732BC1',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              🔄 Запустить импорт
            </button>

            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: '#20BAEF',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              👁️ Посмотреть блог
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}