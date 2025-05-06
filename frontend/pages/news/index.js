import Head from 'next/head';
import { useRouter } from 'next/router';
import NewsFeed from '../../components/news/NewsFeed';
import Sidebar from '../../components/layout/Sidebar';

export default function NewsPage() {
  const router = useRouter();
  const { category, region, topic } = router.query;
  
  // Determine page title based on filters
  let pageTitle = 'News';
  if (category) {
    pageTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} News`;
  } else if (region) {
    pageTitle = `News from ${region.charAt(0).toUpperCase() + region.slice(1)}`;
  } else if (topic) {
    pageTitle = `${topic} News`;
  }

  return (
    <>
      <Head>
        <title>{pageTitle} - News Room</title>
        <meta name="description" content={`Latest ${pageTitle.toLowerCase()} from News Room`} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden mb-6">
          <Sidebar />
        </div>
        
        <NewsFeed />
      </div>
    </>
  );
}

