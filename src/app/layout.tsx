import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { LayoutProvider } from '@/context/LayoutContext';
import { getCategories, getSeries, Category, Series } from '@/lib/airtable';

export const metadata: Metadata = {
  title: 'Bastian Silvestre',
  description: 'Minimalist Artist Portfolio',
};

export const revalidate = 3600; // Revalidate every hour (ISR for layout data)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Category[] = [];
  let series: Series[] = [];

  try {
    categories = await getCategories();
    series = await getSeries();
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
    // Continue with empty menu to avoid crashing if airtable not configured
  }

  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-hidden h-screen flex flex-col md:flex-row pt-20 md:pt-24">
        <LayoutProvider>
          <Header />

          <Sidebar categories={categories} series={series} />

          <main className="flex-1 overflow-y-auto h-full relative px-4 md:px-12 w-full pt-10">
            <div className="max-w-7xl mx-auto min-h-screen">
              {children}
            </div>
          </main>
        </LayoutProvider>
      </body>
    </html>
  );
}
