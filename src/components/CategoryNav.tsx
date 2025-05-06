import Link from 'next/link';

interface CategoryNavProps {
  categories: string[];
  activeCategory?: string;
}

const CategoryNav = ({ categories, activeCategory }: CategoryNavProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/news"
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            !activeCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category}
            href={`/news?category=${category}`}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

