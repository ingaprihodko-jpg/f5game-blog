import { NextResponse } from 'next/server';
import { saveArticles } from '../../../../lib/articles';

export async function POST(request: Request) {
  try {
    const newArticles = await request.json();
    
    // Проверяем валидность данных
    if (!Array.isArray(newArticles)) {
      return NextResponse.json(
        { error: 'Данные должны быть массивом статей' },
        { status: 400 }
      );
    }

    // Проверяем структуру статей
    const validArticles = newArticles.map(article => ({
      id: article.id || Math.random().toString(36).substring(7),
      title: article.title || 'Без названия',
      subtitle: article.subtitle || '',
      content: article.content || '',
      published: Boolean(article.published),
      created_at: article.created_at || new Date().toISOString().split('T')[0]
    }));

    // Сохраняем статьи
    const success = saveArticles(validArticles);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Обновлено ${validArticles.length} статей`,
        articles: validArticles
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

// GET endpoint для получения текущих статей
export async function GET() {
  try {
    const { getAllArticles } = await import('../../../../lib/articles');
    const articles = getAllArticles();
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json([], { status: 200 });
  }
}