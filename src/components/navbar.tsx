'use client'; // Si tu es dans /app, sinon à ignorer

import { FaMusic } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();
    const currentPath = router.pathname;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur border-b border-neutral-800 text-neutral-100 px-6 py-4 flex justify-between items-center shadow-md">

            {/* Logo à gauche */}
            <span className="text-2xl font-playfair text-amber-400 flex items-center gap-2">
                <FaMusic /> Swing Archives
            </span>

            {/* Onglets Lindy Hop / Jazz centrés */}
            <div className="flex bg-neutral-900 border border-neutral-700 rounded-full p-1 text-sm font-playfair shadow-inner">
            
                {/* <Link
                    href="/"
                    className={`px-4 py-1 rounded-full text-amber-300 relative 
                        transition-transform duration-300 ease-in-out
                        hover:scale-105 focus:scale-105
                        will-change-transform ${currentPath === '/' ? 'bg-amber-400 text-neutral-900 font-playfair' : ''
                        }`}
                >
                    Lindy Hop
                </Link> */}
                  <Link
                    href="/"
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-amber-300 relative 
                        transition-transform duration-300 ease-in-out
                        hover:scale-105 focus:scale-105
                        will-change-transform
                        ${currentPath === '/' ? 'scale-105 bg-amber-400 text-neutral-900 font-playfair' : ''}`}
                    style={{ transformOrigin: 'center' }}
                    >
                    Lindy Hop
                </Link>
                
                {/* <Link
                    href="/jazz"
                    className={`
                        px-4 py-1 rounded-full text-amber-300 relative 
                        transition-transform duration-300 ease-in-out
                        hover:scale-105 focus:scale-105
                        will-change-transform
                        ${currentPath === '/jazz' ? 'scale-105 bg-amber-400 text-neutral-900 font-playfair' : ''}
                    `}
                    style={{ transformOrigin: 'center' }}
                >
                Jazz
                </Link> */}
                <Link
                    href="/jazz"
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-amber-300 relative 
                        transition-transform duration-300 ease-in-out
                        hover:scale-105 focus:scale-105
                        will-change-transform
                        ${currentPath === '/jazz' ? 'scale-105 bg-amber-400 text-neutral-900 font-playfair' : ''}`}
                    style={{ transformOrigin: 'center' }}
                    >
                    Jazz
                </Link>



            </div>

        </nav>
    );
}
