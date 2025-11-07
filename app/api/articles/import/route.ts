import { NextResponse } from 'next/server';

// ID вашей Google таблицы
const SPREADSHEET_ID = '129bffe_1ePvtcNRXgG9U6JqgJKYzGwokz0ONVMAS8iI';
const SHEET_NAME = 'articles';

// Путь к файлу с статьями
const articlesPath = require('path').join(process.cwd(), 'data', 'articles.json');

// Тип для статьи
interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  published: boolean;
  created_at: string;
}

// Функции для работы с статьями
function getAllArticles(): Article[] {
  try {
    const fs = require('fs');
    const articlesData = fs.readFileSync(articlesPath, 'utf8');
    return JSON.parse(articlesData);
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

function saveArticles(articles: Article[]): boolean {
  try {
    const fs = require('fs');
    fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving articles:', error);
    return false;
  }
}

// Функция для получения данных из Google Sheets
async function getDataFromGoogleSheets(): Promise<Article[]> {
  try {
    // Используем публичный URL Google Sheets (CSV формат)
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`
    );
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные из таблицы');
    }
    
    const csvData = await response.text();
    const rows = csvData.split('\n').slice(1); // Пропускаем заголовок
    
    const articles: Article[] = [];
    
    for (const row of rows) {
      if (!row.trim()) continue;
      
      // Парсим CSV строку (учитываем что текст может содержать запятые)
      const columns: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          columns.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      columns.push(current.trim().replace(/^"|"$/g, ''));
      
      if (columns.length >= 6) {
        const article: Article = {
          id: columns[0] || Math.random().toString(36).substring(7),
          title: columns[1] || 'Без названия',
          subtitle: columns[2] || '',
          content: columns[3] || '',
          published: columns[4]?.toLowerCase() === 'true',
          created_at: columns[5] || new Date().toISOString().split('T')[0]
        };
        
        // Проверяем что статья имеет минимально необходимые данные
        if (article.id && article.title) {
          articles.push(article);
        }
      }
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    // Возвращаем тестовые данные если не удалось подключиться
    return getMockDataFromSheets();
  }
}

// Резервные тестовые данные
function getMockDataFromSheets() {
  return [
    {
      id: 'demo-from-sheets',
      title: 'ДЕМО СТАТЬЯ ИЗ GOOGLE SHEETS',
      subtitle: 'Если таблица не настроена, показываем это',
      content: `Эта статья показывает как будет работать система с Google Sheets.\n\n## Чтобы настроить:\n\n1. Создайте Google таблицу\n2. Установите правильные заголовки\n3. Откройте доступ по ссылке\n4. Обновите ID таблицы в коде\n\n**Система готова к работе!**`,
      published: true,
      created_at: new Date().toISOString().split('T')[0]
    }
  ];
}

export async function POST() {
  try {
    // Получаем данные из Google Sheets
    const sheetsData = await getDataFromGoogleSheets();
    
    // Получаем текущие статьи
    const currentArticles = getAllArticles();
    
    // Объединяем статьи, избегая дубликатов по ID
    const existingIds = new Set(currentArticles.map(article => article.id));
    const newArticles = sheetsData.filter(article => !existingIds.has(article.id));
    
    const updatedArticles = [...newArticles]; // Используем только данные из таблицы
    
    // Сохраняем обновленные статьи
    const success = saveArticles(updatedArticles);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Импортировано ${newArticles.length} новых статей из Google Sheets`,
        imported: newArticles.length,
        total: updatedArticles.length,
        source: 'Google Sheets'
      });
    } else {
      return NextResponse.json(
        { error: 'Ошибка при сохранении статей' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error importing articles:', error);
    return NextResponse.json(
      { error: 'Ошибка при импорте статей' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Используйте POST запрос для импорта статей из Google Sheets',
    instructions: 'Создайте Google таблицу с колонками: id, title, subtitle, content, published, created_at'
  });
}