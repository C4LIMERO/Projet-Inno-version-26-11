import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-border';

const AboutPage: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>À Propos | Idea Box</title>
                <meta name="description" content="Découvrez l'histoire et les objectifs de la plateforme Idea Box de Centrale Méditerranée" />
            </Head>

            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="pt-32 pb-16 bg-brand-light">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                                Du physique au numérique : <br />
                                <AnimatedGradientText className="font-medium">une nouvelle ère pour vos idées</AnimatedGradientText>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-6 md:px-12">
                        <motion.div
                            className="space-y-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Une évolution nécessaire */}
                            <div>
                                <h2 className="text-2xl font-medium text-brand-primary mb-4">Une évolution nécessaire</h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Ce projet est né d'un constat simple : la boîte à idées physique de Centrale Méditerranée était peu connue et rarement utilisée.
                                    En collaboration avec Mr Jean-Marie ROSSI, nous avons développé cette version dématérialisée pour moderniser cet outil essentiel de démocratie participative.
                                </p>
                            </div>

                            {/* Nos Objectifs */}
                            <div>
                                <h2 className="text-2xl font-medium text-brand-primary mb-6">Nos Objectifs</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-primary font-bold mr-4">1</div>
                                        <div>
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">Accessibilité & Inclusion</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                Permettre à tous, y compris aux étudiants du campus de Nice, de participer activement à la vie de l'École.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-primary font-bold mr-4">2</div>
                                        <div>
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">Décloisonnement</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                Créer du lien entre les chercheurs, les élèves, l'administration et les anciens élèves.
                                                C'est de la collaboration de ces horizons variés que naîtront les projets les plus ambitieux.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-primary font-bold mr-4">3</div>
                                        <div>
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">Simplicité</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                Un accès facilité via vos identifiants CAS (intégration ENT/Moodle en cours).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comment ça marche */}
                            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                                <h2 className="text-2xl font-medium text-brand-primary mb-4">Comment ça marche ?</h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Au-delà du simple dépôt, cette plateforme vise la co-construction.
                                    Vous pouvez choisir de soumettre une idée anonymement pour l'administration,
                                    ou de proposer un projet collaboratif où élèves et personnels travaillent ensemble pour le concrétiser.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </Layout>
    );
};

export default AboutPage;