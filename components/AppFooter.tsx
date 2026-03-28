export function AppFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Soul Flowers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Магазин свіжих квітів з доставкою по Україні. Створюємо красу з любов'ю.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Категорії</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products/category/troiandy" className="hover:text-pink-400 transition-colors">Троянди</a></li>
              <li><a href="/products/category/tiulpany" className="hover:text-pink-400 transition-colors">Тюльпани</a></li>
              <li><a href="/products/category/bukety" className="hover:text-pink-400 transition-colors">Букети</a></li>
              <li><a href="/products/category/roslyny" className="hover:text-pink-400 transition-colors">Рослини</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Київ, Україна</li>
              <li>info@soulflowers.com.ua</li>
              <li>+380 (99) 123-45-67</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Soul Flowers. Всі права захищено.</p>
        </div>
      </div>
    </footer>
  );
}
