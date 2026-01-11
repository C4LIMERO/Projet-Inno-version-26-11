import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-border';
import questionService from '../services/QuestionService';
import { Question, User, UserStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useRouter } from 'next/router';

import { useAuth } from '../contexts/AuthContext';

const QuestionsPage: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'ask'>('list');

    // Form state
    const [formState, setFormState] = useState({
        content: '',
        firstName: '',
        lastName: '',
        status: 'Student' as UserStatus,
        isAnonymous: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        setQuestions(questionService.getAnsweredQuestions());
    }, [activeTab]); // Refresh when switching tabs

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormState(prev => ({ ...prev, isAnonymous: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const author: User = {
            id: user?.email || 'user-' + Math.random().toString(36).substr(2, 9),
            firstName: formState.firstName,
            lastName: formState.lastName,
            status: formState.status
        };

        questionService.addQuestion(formState.content, author, formState.isAnonymous);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            // Redirect to explore page
            router.push('/explore');
        }, 1000);
    };

    const handleLogin = () => {
        const serviceUrl = encodeURIComponent(window.location.origin + '/auth/callback');
        window.location.href = `https://cas.centrale-med.fr/login?service=${serviceUrl}`;
    };

    return (
        <Layout>
            <Head>
                <title>Questions à l'administration | Centrale Méditerranée</title>
            </Head>
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">
                            <AnimatedGradientText>Questions à l'administration</AnimatedGradientText>
                        </h1>
                        <p className="text-lg text-gray-600">
                            Posez vos questions ou consultez les réponses officielles.
                        </p>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Questions répondues
                            </button>
                            <button
                                onClick={() => setActiveTab('ask')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'ask' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Poser une question
                            </button>
                        </div>
                    </div>

                    {activeTab === 'list' ? (
                        <div className="space-y-6">
                            {questions.length > 0 ? (
                                questions.map(q => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-gray-100">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">{q.content}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span>Par {q.isAnonymous ? 'Anonyme' : `${q.author.firstName} ${q.author.lastName}`}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true, locale: fr })}</span>
                                            </div>
                                        </div>
                                        {q.answer && (
                                            <div className="p-6 bg-primary-50">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-primary-900 mb-1">Réponse officielle ({q.answer.answeredBy})</h4>
                                                        <p className="text-primary-800 text-sm">{q.answer.content}</p>
                                                        <p className="text-primary-600 text-xs mt-2">
                                                            {formatDistanceToNow(new Date(q.answer.answeredAt), { addSuffix: true, locale: fr })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500">Aucune question répondue pour le moment.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl shadow-md p-8"
                        >
                            {!isAuthenticated ? (
                                <div className="text-center py-8">
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">Connexion requise</h3>
                                    <p className="text-gray-600 mb-6">Vous devez être connecté pour poser une question.</p>
                                    <Button onClick={handleLogin} className="bg-brand-primary text-white">
                                        Se connecter
                                    </Button>
                                </div>
                            ) : submitSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">Question envoyée !</h3>
                                    <p className="text-gray-600">Votre question a été transmise à l'administration. Elle apparaîtra ici une fois répondue.</p>
                                    <Button onClick={() => setSubmitSuccess(false)} className="mt-6">Poser une autre question</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="content">Votre question</Label>
                                        <Textarea
                                            id="content"
                                            name="content"
                                            value={formState.content}
                                            onChange={handleChange}
                                            required
                                            placeholder="Posez votre question clairement..."
                                            className="mt-1 min-h-[120px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">Prénom</Label>
                                            <Input id="firstName" name="firstName" value={formState.firstName} onChange={handleChange} required className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Nom</Label>
                                            <Input id="lastName" name="lastName" value={formState.lastName} onChange={handleChange} required className="mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Statut</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formState.status}
                                            onChange={handleChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        >
                                            <option value="Student">Étudiant</option>
                                            <option value="Staff">Personnel Administratif</option>
                                            <option value="Teacher">Enseignant</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isAnonymous"
                                            checked={formState.isAnonymous}
                                            onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                                        />
                                        <Label htmlFor="isAnonymous" className="cursor-pointer">Poser anonymement</Label>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Envoi...' : 'Envoyer ma question'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default QuestionsPage;
