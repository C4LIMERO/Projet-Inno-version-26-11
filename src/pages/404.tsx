import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const NotFoundPage: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>Page non trouvée | Idea Box</title>
                <meta name="description" content="Page non trouvée" />
            </Head>
            
            <section className="pt-32 pb-20 bg-brand-light min-h-[80vh] flex items-center">
                <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative mb-8 inline-block">
                            <div className="text-9xl font-bold text-brand-primary opacity-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                404
                            </div>
                            <svg className="w-40 h-40 mx-auto text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                            Oups ! Cette page est introuvable
                        </h1>
                        
                        <p className="text-lg text-brand-secondary mb-8 max-w-md mx-auto">
                            La page que vous cherchez n'existe pas ou a été déplacée. 
                            Mais ne vous inquiétez pas, l'aventure continue !
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button 
                                className="bg-brand-primary hover:bg-blue-800 text-white rounded-full"
                                asChild
                            >
                                <Link href="/">
                                    Retour à l'accueil
                                </Link>
                            </Button>
                            <Button 
                                variant="outline"
                                className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-full"
                                asChild
                            >
                                <Link href="/explore">
                                    Explorer les idées
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="mt-20">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-brand-secondary"
                            >
                                <p className="text-xl font-light italic mb-2">Une idée ?</p>
                                <p className="text-sm">
                                    Peut-être que vous avez trouvé une idée pour améliorer notre site !{' '}
                                    <Link href="/new" className="text-brand-primary hover:underline">
                                        Partagez-la avec nous
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default NotFoundPage; 