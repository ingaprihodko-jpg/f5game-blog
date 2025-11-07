import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const newArticles = await request.json();
    
    if (!Array.isArray(newArticles)) {
      return NextResponse.json(
        { error: 'Данные должны быть массивом статей' },
        { status: 400 }
      );
    }

    const validArticles = newArticles.map(article => ({
      id: article.id || Math.random().toString(36).substring(7),
      title: article.title || 'Без названия',
      subtitle: article.subtitle || '',
      content: article.content || '',
      published: Boolean(article.published),
      created_at: article.created_at || new Date().toISOString().split('T')[0]
    }));

    const success = saveArticles(validArticles);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Обновлено ${validArticles.length} статей`,
        articles: validArticles,
        imported: validArticles.length
      });
    } else {
      return NextResponse.json(
        { error: 'Ошибка при сохранении статей' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error updating articles:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статей' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const articles = getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json([], { status: 200 });
  }
}
