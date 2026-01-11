import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-border';
import ideaService from '../services/IdeaService';
import questionService from '../services/QuestionService';
import { Idea, Question } from '../types';
import IdeaCard from '../components/IdeaCard';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ArchivesPage: NextPage = () => {
    const [realizedIdeas, setRealizedIdeas] = useState<Idea[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
    const [activeTab, setActiveTab] = useState<'ideas' | 'questions'>('ideas');

    useEffect(() => {
        // Mocking realized ideas for demonstration
        const allIdeas = ideaService.getAllIdeas();
        setRealizedIdeas(allIdeas.slice(0, 3));

        setAnsweredQuestions(questionService.getAnsweredQuestions());
    }, []);

    return (
        <Layout>
            <Head>
                <title>Réussites & Réponses | Centrale Méditerranée</title>
            </Head>
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">
                            <AnimatedGradientText>Réussites & Réponses</AnimatedGradientText>
                        </h1>
                        <p className="text-lg text-gray-600">
                            Retrouvez l'historique des projets concrétisés et des questions répondues.
                        </p>
                    </div>

                    <div className="flex justify-center mb-10">
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => setActiveTab('ideas')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'ideas' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Ils l'ont fait !
                            </button>
                            <button
                                onClick={() => setActiveTab('questions')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'questions' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                L'Admin vous répond
                            </button>
                        </div>
                    </div>

                    {activeTab === 'ideas' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {realizedIdeas.map(idea => (
                                <div key={idea.id} className="h-full">
                                    <IdeaCard idea={idea} />
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            {answeredQuestions.map(q => (
                                <div
                                    key={q.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{q.reformulatedContent || q.content}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>Question posée le {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true, locale: fr })}</span>
                                        </div>
                                    </div>
                                    {q.answer && (
                                        <div className="p-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mr-4">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900 mb-1">Réponse de l'administration</h4>
                                                    <p className="text-gray-700 text-sm">{q.answer.content}</p>
                                                    <p className="text-gray-400 text-xs mt-2">
                                                        Répondu par {q.answer.answeredBy} • {formatDistanceToNow(new Date(q.answer.answeredAt), { addSuffix: true, locale: fr })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default ArchivesPage;
