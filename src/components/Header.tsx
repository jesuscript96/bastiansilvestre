import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-screen z-50 bg-transparent flex items-center justify-between px-6 md:px-12 h-20 md:h-24 print:hidden">
            <Link href="/" className="block">
                <span className="text-foreground text-lg font-light tracking-wide uppercase">Bastián Silvestre</span>
            </Link>

            <div className="hidden md:block">
                <ThemeToggle />
            </div>
        </header>
    );
}
