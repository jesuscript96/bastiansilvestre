import PortfolioGenerator from '@/components/PortfolioGenerator';
import { getWorks } from '@/lib/supabase';

export const metadata = {
  title: 'Portfolio PDF - Bastian Silvestre',
  robots: { index: false, follow: false },
};

export default async function PortfolioPage() {
  const works = await getWorks();

  return (
    <PortfolioGenerator initialWorks={works} />
  );
}
