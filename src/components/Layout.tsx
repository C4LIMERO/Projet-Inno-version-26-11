import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

// Composant pour une particule explosive
const ExplosionParticle = ({ angle, distance, color, delay, duration }: { angle: number, distance: number, color: string, delay: number, duration: number }) => {
    return (
        <motion.div
            className="absolute w-3 h-3 rounded-full z-50"
            style={{ backgroundColor: color }}
            initial={{ scale: 0 }}
            animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0]
            }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }}
        />
    );
};

// Composant bouton explosif
const ExplosiveButton = ({ children, href }: { children: React.ReactNode, href: string }) => {
    const [exploded, setExploded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<React.ReactNode[]>([]);
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Générer 30 particules avec des angles aléatoires
        const particleElements = [];
        const colors = ['#FF5252', '#FF7B25', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'];

        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2; // Angle aléatoire complet (360 degrés)
            const distance = 100 + Math.random() * 150; // Distance aléatoire entre 100 et 250px
            const delay = Math.random() * 0.2; // Délai aléatoire entre 0 et 0.2s
            const duration = 0.5 + Math.random() * 0.7; // Durée aléatoire entre 0.5 et 1.2s
            const color = colors[Math.floor(Math.random() * colors.length)]; // Couleur aléatoire

            particleElements.push(
                <ExplosionParticle
                    key={i}
                    angle={angle}
                    distance={distance}
                    color={color}
                    delay={delay}
                    duration={duration}
                />
            );
        }

        setParticles(particleElements);
        setExploded(true);

        // Faire disparaître le bouton
        setTimeout(() => {
            setIsVisible(false);
        }, 100);

        // Rediriger après l'animation
        setTimeout(() => {
            router.push(href);
        }, 800);
    };

    return (
        <div className="relative" ref={buttonRef}>
            {/* Les particules d'explosion */}
            {exploded && particles}

            {/* Le bouton */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={exploded ? { scale: 0, opacity: 0 } : { scale: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClick}
                        className="cursor-pointer"
                    >
                        <Button
                            className="bg-brand-primary text-white hover:bg-blue-800 rounded-full px-6"
                        >
                            {children}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Fermer le menu utilisateur lorsqu'on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fonction pour rediriger vers le CAS de Centrale Méditerranée
    const handleLoginClick = () => {
        // L'URL de service est l'URL vers laquelle le CAS redirigera après authentification
        const serviceUrl = encodeURIComponent(window.location.origin + '/auth/callback');
        window.location.href = `https://cas.centrale-med.fr/login?service=${serviceUrl}`;
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fermer le menu mobile lors des changements de route
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [router.pathname]);

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Explorer', path: '/explore' },
        { name: 'Retour Admin', path: '/archives' }, // Note: Path might need to change later if we create a new page, but for now renaming the label.
        { name: 'À propos', path: '/about' },
    ];

    return (
        <div className="min-h-screen bg-brand-light">
            <header className={cn(
                "fixed w-full z-50 transition-all duration-300",
                scrolled ? "py-3" : "py-5",
                scrolled ? "glass-effect shadow-sm" : "bg-transparent"
            )}>
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <motion.div
                                className="relative z-10 flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-2xl font-bold">
                                    <span className="text-brand-primary">Idea</span>
                                    <span className="text-brand-secondary">Box</span>
                                </span>
                            </motion.div>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => {
                                const isActive = router.pathname === link.path;
                                return (
                                    <Link
                                        href={link.path}
                                        key={link.name}
                                        className={cn(
                                            "relative py-2 text-sm font-medium tracking-wide transition-colors",
                                            isActive
                                                ? "text-brand-primary"
                                                : "text-brand-secondary hover:text-brand-primary"
                                        )}
                                    >
                                        {link.name}
                                        {isActive && mounted && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                                                layoutId="navIndicator"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex space-x-3">
                                {isAuthenticated ? (
                                    <div className="relative" ref={userMenuRef}>
                                        <Button
                                            className="bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-full px-6 flex items-center"
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        >
                                            <span className="mr-2">{user?.name?.split(' ')[0] || 'Utilisateur'}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>

                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                                                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                                    <div className="font-medium">{user?.name}</div>
                                                    <div className="text-gray-500 truncate">{user?.email}</div>
                                                </div>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={handleLogout}
                                                >
                                                    Se déconnecter
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        className="bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-full px-6"
                                        onClick={handleLoginClick}
                                    >
                                        Se connecter
                                    </Button>
                                )}
                                <Link href="/new">
                                    <Button className="bg-brand-primary text-white hover:bg-blue-800 rounded-full px-6">
                                        Nouvelle Contribution
                                    </Button>
                                </Link>
                            </div>

                            <button
                                className="md:hidden text-brand-primary"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                            >
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {mobileMenuOpen ? (
                                            <motion.div
                                                key="close"
                                                initial={{ opacity: 0, rotate: -90 }}
                                                animate={{ opacity: 1, rotate: 0 }}
                                                exit={{ opacity: 0, rotate: 90 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu"
                                                initial={{ opacity: 0, rotate: 90 }}
                                                animate={{ opacity: 1, rotate: 0 }}
                                                exit={{ opacity: 0, rotate: -90 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu mobile */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="md:hidden glass-effect border-t border-gray-200"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-6 py-6 space-y-3">
                                {isAuthenticated && (
                                    <div className="mb-4 pb-4 border-b border-gray-200">
                                        <div className="font-medium text-brand-primary">{user?.name}</div>
                                        <div className="text-sm text-gray-500">{user?.email}</div>
                                    </div>
                                )}

                                {navLinks.map((link, index) => {
                                    const isActive = router.pathname === link.path;
                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={cn(
                                                    "block py-2 text-base font-medium",
                                                    isActive
                                                        ? "text-brand-primary"
                                                        : "text-brand-secondary"
                                                )}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.1 }}
                                    className="pt-2"
                                >
                                    {isAuthenticated ? (
                                        <Button
                                            className="w-full mb-2 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full"
                                            onClick={handleLogout}
                                        >
                                            Se déconnecter
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full mb-2 bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-full"
                                            onClick={handleLoginClick}
                                        >
                                            Se connecter
                                        </Button>
                                    )}

                                    <Link href="/new">
                                        <Button className="w-full bg-brand-primary text-white hover:bg-blue-800 rounded-full">
                                            Nouvelle Contribution
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="pt-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={router.pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        <div className="md:col-span-2">
                            <Link href="/" className="inline-block mb-4">
                                <span className="text-2xl font-bold">
                                    <span className="text-brand-primary">Idea</span>
                                    <span className="text-brand-secondary">Box</span>
                                </span>
                            </Link>
                            <p className="text-gray-600 max-w-md">
                                Plateforme d'innovation collaborative pour partager et développer vos idées avec une communauté d'innovateurs passionnés.
                            </p>
                            <div className="flex space-x-4 mt-6">
                                <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors" aria-label="Twitter">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors" aria-label="GitHub">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors" aria-label="LinkedIn">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
                            <ul className="space-y-2">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.path}
                                            className="text-gray-600 hover:text-brand-primary"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/new"
                                        className="text-gray-600 hover:text-brand-primary"
                                    >
                                        Nouvelle Contribution
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Ressources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-brand-primary">Documentation</a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-brand-primary">FAQ</a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-brand-primary">Communauté</a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-brand-primary">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 mb-4 md:mb-0">
                            © {new Date().getFullYear()} IdeaBox. Tous droits réservés.
                        </p>
                        <div className="flex space-x-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-brand-primary">Confidentialité</a>
                            <a href="#" className="hover:text-brand-primary">Conditions d'utilisation</a>
                            <a href="#" className="hover:text-brand-primary">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;


