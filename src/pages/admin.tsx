import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import questionService from '../services/QuestionService';
import { Question } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminPage: NextPage = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [answerContent, setAnswerContent] = useState('');
    const [reformulatedContent, setReformulatedContent] = useState('');
    const [publish, setPublish] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch only pending questions or have filters
        // For now, let's fetch all and filter client-side or just show all
        setQuestions(questionService.getAllQuestions());
    }, []);

    const handleSelectQuestion = (q: Question) => {
        setSelectedQuestion(q);
        setAnswerContent(q.answer?.content || '');
        setReformulatedContent(q.reformulatedContent || q.content);
        setPublish(q.isPublic);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuestion) return;

        questionService.answerQuestion(
            selectedQuestion.id,
            answerContent,
            "Admin", // Hardcoded for now
            reformulatedContent,
            publish
        );

        // Refresh list
        setQuestions([...questionService.getAllQuestions()]);
        setSelectedQuestion(null);
        setAnswerContent('');
        setReformulatedContent('');
    };

    return (
        <Layout>
            <Head>
                <title>Admin - Gestion des Questions | Centrale Méditerranée</title>
            </Head>
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Administration des Questions</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* List of Questions */}
                    <div className="md:col-span-1 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Questions ({questions.length})</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {questions.map(q => (
                                <div
                                    key={q.id}
                                    onClick={() => handleSelectQuestion(q)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedQuestion?.id === q.id
                                            ? 'bg-blue-50 border-blue-500'
                                            : 'bg-white border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${q.isAnswered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {q.isAnswered ? 'Répondu' : 'En attente'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true, locale: fr })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{q.content}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {q.isAnonymous ? 'Anonyme' : `${q.author.firstName} ${q.author.lastName}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="md:col-span-2">
                        {selectedQuestion ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold mb-6">Traiter la question</h2>

                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Question originale</h3>
                                    <p className="text-gray-900">{selectedQuestion.content}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Par {selectedQuestion.isAnonymous ? 'Anonyme' : `${selectedQuestion.author.firstName} ${selectedQuestion.author.lastName}`} ({selectedQuestion.author.status})
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reformulation (pour publication)
                                        </label>
                                        <Input
                                            value={reformulatedContent}
                                            onChange={(e) => setReformulatedContent(e.target.value)}
                                            placeholder="Reformulez la question si nécessaire..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Réponse
                                        </label>
                                        <Textarea
                                            value={answerContent}
                                            onChange={(e) => setAnswerContent(e.target.value)}
                                            placeholder="Votre réponse..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="publish"
                                            checked={publish}
                                            onChange={(e) => setPublish(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="publish" className="text-sm text-gray-700">
                                            Publier dans "Retour Admin" (visible par tous)
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setSelectedQuestion(null)}
                                        >
                                            Annuler
                                        </Button>
                                        <Button type="submit">
                                            Enregistrer la réponse
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">Sélectionnez une question à gauche pour la traiter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default AdminPage;
