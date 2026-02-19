import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { LayoutProvider } from '@/context/LayoutContext';
import { getCategories, getBodyOfWorks, Category, BodyOfWork } from '@/lib/airtable';

export const metadata: Metadata = {
  title: 'Bastian Silvestre',
  description: 'Minimalist Artist Portfolio',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/iconmain.jpeg',
    shortcut: '/iconmain.jpeg',
    apple: '/iconmain.jpeg',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Category[] = [];
  let bodyOfWorks: BodyOfWork[] = [];

  try {
    categories = await getCategories();
    bodyOfWorks = await getBodyOfWorks();
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
    // Continue with empty menu to avoid crashing if airtable not configured
  }

  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-hidden h-screen flex flex-col md:flex-row">
        <LayoutProvider>
          <Header />

          <Sidebar categories={categories} bodyOfWorks={bodyOfWorks} />

          <main className="flex-1 overflow-y-auto h-full relative md:px-12 w-full pt-0 md:pt-12 scroll-smooth">
            <div className="max-w-7xl mx-auto min-h-screen">
              {children}
            </div>
          </main>
        </LayoutProvider>
      </body>
    </html>
  );
}
