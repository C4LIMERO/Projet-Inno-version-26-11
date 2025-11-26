import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IdeaNetworkBackground } from '@/components/ui/idea-network-background';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-border';
import ideaService from '../services/IdeaService';
import { Idea } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import IdeaCard from '../components/IdeaCard';

const Home: NextPage = () => {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const translateY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

    const [mounted, setMounted] = useState(false);
    const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);

    useEffect(() => {
        setMounted(true);
        // Récupérer les idées les plus récentes
        const sortedIdeas = ideaService.getSortedIdeas('date');
        setRecentIdeas(sortedIdeas.slice(0, 6));
    }, []);

    return (
        <Layout>
            <Head>
                <title>Idea Box | Partagez vos idées innovantes</title>
                <meta name="description" content="Partagez et découvrez des idées innovantes sur Idea Box" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-white to-brand-light min-h-[85vh] flex items-center">
                {mounted &&
                    <IdeaNetworkBackground
                        nodeCount={30}
                        connectionMaxDistance={200}
                        nodeMaxSpeed={0.2}
                        interactive={true}
                        primaryColor="#000f9f"
                        secondaryColor="#4d5f80"
                        className="opacity-20"
                        container="hero-section"
                    />
                }

                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        style={{ opacity, y: translateY, scale }}
                    >
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Chaque grande innovation commence par une{' '}
                            <AnimatedGradientText className="font-semibold">
                                idée
                            </AnimatedGradientText>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-brand-secondary mb-10 font-light max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Vous avez une idée pour l'école ou une question pour l'administration ? Pas de soucis !
                            Cliquez simplement ci-dessous sur le type de contribution que vous souhaitez effectuer.
                            C'est simple, rapide et constructif.
                        </motion.p>

                        <motion.div
                            className="flex flex-col items-center gap-6 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <Button
                                    className="bg-brand-primary hover:bg-blue-800 text-white font-medium rounded-full px-8 py-6 text-lg min-w-[240px]"
                                    asChild
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="shadow-brand"
                                    >
                                        <Link href="/new?type=idea">
                                            💡 Proposer une Idée
                                        </Link>
                                    </motion.div>
                                </Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-8 py-6 text-lg min-w-[240px]"
                                    asChild
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="shadow-brand"
                                    >
                                        <Link href="/new?type=question">
                                            ❓ Poser une Question
                                        </Link>
                                    </motion.div>
                                </Button>
                            </div>

                            <Button
                                className="bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium rounded-full px-12 py-6 text-lg w-full sm:w-auto max-w-md"
                                asChild
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link href="/explore">
                                        🌍 Explorer toutes les contributions
                                    </Link>
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="bg-brand-primary text-white py-16">
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-light mb-6">Notre Mission</h2>
                        <p className="text-xl text-blue-100 leading-relaxed font-light">
                            Cet espace permet de centraliser les initiatives, de rapprocher les campus de Nice et Marseille, et de faciliter le dialogue entre étudiants, enseignants et administration.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section id="recent-ideas" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-medium mb-4">Contributions récentes</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Découvrez les dernières propositions de notre communauté
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentIdeas.map((idea, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full"
                            >
                                <IdeaCard idea={idea} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button asChild className="px-8">
                            <Link href="/explore">
                                Voir toutes les contributions
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;