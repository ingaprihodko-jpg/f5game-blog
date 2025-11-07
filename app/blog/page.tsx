import Link from 'next/link'

// Временные данные для теста
const mockArticles = [
  {
    id: '1',
    title: 'Первая автоматическая статья',
    description: 'Это тестовая статья, созданная через автоматизацию',
    date: '2024-11-07',
    slug: 'first-article'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Хедер */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              📚 Мой Блог
            </h1>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                Главная
              </Link>
              <Link href="/blog" className="text-purple-600 font-semibold">
                Статьи
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Список статей */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Все Статьи
        </h1>
        
        <div className="space-y-6">
          {mockArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {article.description}
              </p>
              <div className="text-sm text-gray-400">
                Опубликовано: {article.date}
              </div>
            </Link>
          ))}
        </div>

        {/* Сообщение когда нет статей */}
        {mockArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Статьи пока не добавлены
            </h2>
            <p className="text-gray-500">
              Как только ты добавишь текст в Google Таблицу, здесь появятся статьи!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}