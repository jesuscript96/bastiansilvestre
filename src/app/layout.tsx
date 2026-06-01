import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { LayoutProvider } from '@/context/LayoutContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { getCategories, getBodyOfWorks, Category, BodyOfWork } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Bastian Silvestre',
  description: 'Artist Portfolio',
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

const themeInitScript = `
(function(){
  try {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('bs-theme', 'light');
  } catch(e) {}
})();
`;

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
  }

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="bg-background text-foreground antialiased overflow-hidden h-screen flex flex-col md:flex-row print:block print:h-auto print:overflow-visible">
        <ThemeProvider>
          <LayoutProvider>
            <Header />
            <Sidebar categories={categories} bodyOfWorks={bodyOfWorks} />
            <main className="flex-1 overflow-y-auto h-full relative md:px-12 w-full pt-0 md:pt-12 scroll-smooth print:block print:h-auto print:overflow-visible print:px-0">
              <div className="max-w-7xl mx-auto min-h-screen print:h-auto print:min-h-0 print:max-w-none">
                {children}
              </div>
            </main>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
