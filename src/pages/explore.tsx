import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import IdeaCard from '../components/IdeaCard';
import QuestionCard from '../components/QuestionCard';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ideaService, { SortOption } from '../services/IdeaService';
import questionService from '../services/QuestionService';
import { Idea, Question } from '../types';

type SortCriteria = SortOption;
type FilterType = 'all' | 'ideas' | 'questions';
type Contribution = { type: 'idea', data: Idea } | { type: 'question', data: Question };

const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } }
};

const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const ExplorePage: NextPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortCriteria>("date");
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [displayCount, setDisplayCount] = useState(9);

    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);

    useEffect(() => {
        const ideas = ideaService.getAllIdeas().map(i => ({ type: 'idea' as const, data: i }));
        // For explore page, we might want to show all questions or just answered ones? 
        // The prompt says "lister à la fois les Idées et les Questions". 
        // Usually "Explore" implies public content. 
        // Let's assume we show all questions for now, or maybe just answered ones if that was the previous logic.
        // But users might want to see unanswered questions too to see what's being asked.
        // Let's fetch all questions if possible, but the service might only expose answered ones easily?
        // Checking QuestionService... it has getAnsweredQuestions. Let's stick to that for "Explore" to avoid noise, 
        // or maybe all? The prompt says "lister à la fois les Idées et les Questions".
        // Let's use getAnsweredQuestions for now as it's safer for "content consumption".
        // Wait, if I want to see my question pending, I go to /questions.
        // Let's stick to answered questions for the "Explore" feed to keep it high quality.
        // Fetch all questions to ensure newly submitted ones are visible
        const questions = questionService.getAllQuestions().map(q => ({ type: 'question' as const, data: q }));

        setContributions([...ideas, ...questions]);
    }, []);

    useEffect(() => {
        let result = [...contributions];

        // Filter by Type
        if (filterType === 'ideas') {
            result = result.filter(c => c.type === 'idea');
        } else if (filterType === 'questions') {
            result = result.filter(c => c.type === 'question');
        }

        // Filter by Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(c => {
                if (c.type === 'idea') {
                    return c.data.title.toLowerCase().includes(lowerTerm) || c.data.description.toLowerCase().includes(lowerTerm);
                } else {
                    return c.data.content.toLowerCase().includes(lowerTerm) || (c.data.answer?.content.toLowerCase().includes(lowerTerm) ?? false);
                }
            });
        }

        // Filter by Category (Ideas only)
        if (selectedCategory) {
            result = result.filter(c => c.type === 'idea' && c.data.tags.includes(selectedCategory));
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.data.createdAt).getTime();
            const dateB = new Date(b.data.createdAt).getTime();

            if (sortBy === 'date') {
                return dateB - dateA; // Newest first
            } else if (sortBy === 'date_asc') {
                return dateA - dateB; // Oldest first
            }
            return 0;
        });

        // Reverse if "Oldest" (implied if we had that option, but currently we only have 'date' which is usually newest first. 
        // The prompt asked for "Plus récentes" | "Plus anciennes".
        // My current SortOption is just 'date' (newest) or 'title'.
        // I should probably add a direction or just assume 'date' is newest.
        // Let's stick to the existing logic for now, or add a toggle. 
        // The existing `IdeaService` logic for 'date' is newest first.

        setFilteredContributions(result);
    }, [contributions, searchTerm, selectedCategory, sortBy, filterType]);

    const allCategories = ideaService.getAllTags();
    const displayedContributions = filteredContributions.slice(0, displayCount);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setDisplayCount(9);
    };

    const loadMore = () => {
        setDisplayCount(prev => prev + 9);
    };

    return (
        <Layout>
            <Head>
                <title>Explorer | Centrale Méditerranée</title>
            </Head>

            <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <motion.div
                        className="mb-10 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-light tracking-tight mb-4 text-gray-900">
                            Explorer <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-blue-600">les contributions</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                            Découvrez les idées et les questions de la communauté.
                        </p>
                    </motion.div>

                    <motion.div
                        className="mb-12 max-w-3xl mx-auto"
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                    >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-3 w-full bg-white shadow-sm rounded-full border-0 focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <motion.div
                            className="w-full md:w-64 flex-shrink-0 space-y-6"
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                        >
                            {/* Type Filter */}
                            <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Type</h3>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className={`text-left py-2 px-3 rounded-xl transition ${filterType === 'all' ? 'bg-blue-50 text-brand-primary font-medium' : 'hover:bg-gray-50'}`}
                                    >
                                        Tout voir
                                    </button>
                                    <button
                                        onClick={() => setFilterType('ideas')}
                                        className={`text-left py-2 px-3 rounded-xl transition ${filterType === 'ideas' ? 'bg-blue-50 text-brand-primary font-medium' : 'hover:bg-gray-50'}`}
                                    >
                                        Idées uniquement
                                    </button>
                                    <button
                                        onClick={() => setFilterType('questions')}
                                        className={`text-left py-2 px-3 rounded-xl transition ${filterType === 'questions' ? 'bg-blue-50 text-brand-primary font-medium' : 'hover:bg-gray-50'}`}
                                    >
                                        Questions uniquement
                                    </button>
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Trier par</h3>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={() => setSortBy("date")}
                                        className={`flex items-center py-2 px-3 rounded-xl transition ${sortBy === "date" ? "bg-blue-50 text-brand-primary" : "hover:bg-gray-50"}`}
                                    >
                                        Date : Plus récent
                                    </button>
                                    <button
                                        onClick={() => setSortBy("date_asc" as any)}
                                        className={`flex items-center py-2 px-3 rounded-xl transition ${sortBy === "date_asc" ? "bg-blue-50 text-brand-primary" : "hover:bg-gray-50"}`}
                                    >
                                        Date : Plus ancien
                                    </button>
                                </div>
                            </div>

                            {/* Categories (Only if Ideas are shown) */}
                            {filterType !== 'questions' && (
                                <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Thèmes (Idées)</h3>
                                    <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto pr-2">
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className={`text-left py-2 px-3 rounded-xl transition ${selectedCategory === null ? "bg-blue-50 text-brand-primary font-medium" : "hover:bg-gray-50"}`}
                                        >
                                            Tous les thèmes
                                        </button>
                                        {allCategories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`text-left py-2 px-3 rounded-xl transition ${selectedCategory === category ? "bg-blue-50 text-brand-primary font-medium" : "hover:bg-gray-50"}`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <div className="flex-grow">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-medium text-gray-900">
                                    Résultats ({filteredContributions.length})
                                </h2>
                            </div>

                            {displayedContributions.length > 0 ? (
                                <>
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        {displayedContributions.map((item) => (
                                            <motion.div
                                                key={`${item.type}-${item.data.id}`}
                                                variants={fadeIn}
                                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                                className="h-full"
                                            >
                                                {item.type === 'idea' ? (
                                                    <IdeaCard idea={item.data} />
                                                ) : (
                                                    <QuestionCard question={item.data} />
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {displayCount < filteredContributions.length && (
                                        <div className="text-center mt-12">
                                            <Button
                                                onClick={loadMore}
                                                className="px-8 py-3 rounded-full border border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                                            >
                                                Voir plus
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-gray-500 mb-6">Aucun résultat trouvé.</p>
                                    <Button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory(null);
                                            setFilterType('all');
                                        }}
                                        className="px-6 py-2 rounded-full bg-brand-primary text-white"
                                    >
                                        Réinitialiser
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default ExplorePage;