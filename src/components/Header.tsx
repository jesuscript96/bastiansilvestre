import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-screen z-50 bg-black flex items-center px-6 md:px-12 h-20 md:h-24">
            {/* Logo Text */}
            <Link href="/" className="block">
                <span className="text-white text-lg font-light tracking-wide uppercase">Bastian Silvestre</span>
            </Link>
        </header>
    );
}
