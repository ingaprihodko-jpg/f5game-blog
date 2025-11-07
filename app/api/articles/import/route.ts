import { NextResponse } from 'next/server';

// ID вашей Google таблицы
const SPREADSHEET_ID = '129bffe_1ePvtcNRXgG9U6JqgJKYzGwokz0ONVMAS8iI';

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
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=articles`
    );
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные из таблицы');
    }
    
    const csvData = await response.text();
    const rows = csvData.split('\n').slice(1); // Пропускаем заголовок
    
    const articles: Article[] = [];
    
    for (const row of rows) {
      if (!row.trim()) continue;
      
      // Парсим CSV строку
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
          id: columns[0] || `article-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          title: columns[1] || 'Без названия',
          subtitle: columns[2] || '',
          content: columns[3] || '',
          published: columns[4]?.toLowerCase() === 'true',
          created_at: columns[5] || new Date().toISOString().split('T')[0]
        };
        
        // Проверяем что статья имеет минимально необходимые данные
        if (article.title && article.title !== 'Без названия') {
          articles.push(article);
        }
      }
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
}

export async function POST() {
  try {
    // Получаем данные из Google Sheets
    const sheetsData = await getDataFromGoogleSheets();
    
    if (sheetsData.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Не удалось получить данные из таблицы или таблица пуста' 
      });
    }
    
    // Получаем текущие статьи
    const currentArticles = getAllArticles();
    
    // Объединяем статьи, избегая дубликатов по ID
    const existingIds = new Set(currentArticles.map(article => article.id));
    const newArticles = sheetsData.filter(article => !existingIds.has(article.id));
    
    if (newArticles.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Нет новых статей для импорта',
        imported: 0,
        total: currentArticles.length
      });
    }
    
    const updatedArticles = [...currentArticles, ...newArticles];
    
    // Сохраняем обновленные статьи
    const success = saveArticles(updatedArticles);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Импортировано ${newArticles.length} новых статей из Google Sheets`,
        imported: newArticles.length,
        total: updatedArticles.length,
        newArticles: newArticles.map(a => ({ id: a.id, title: a.title }))
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
      { error: 'Ошибка при импорте статей: ' + error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const articles = await getDataFromGoogleSheets();
    return NextResponse.json({ 
      success: true,
      message: 'Данные из Google Sheets',
      articles: articles,
      total: articles.length
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Не удалось подключиться к Google Sheets'
    });
  }
}
