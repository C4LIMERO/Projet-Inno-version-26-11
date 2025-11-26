import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-border';
import ideaService, { NewIdea } from '../services/IdeaService';
import questionService from '../services/QuestionService';
import { User, UserStatus, ParticipationType } from '../types';

const getCategories = () => {
    const existingTags = ideaService.getAllTags();
    if (!existingTags.includes('Autre')) {
        return [...existingTags, 'Autre'];
    }
    return existingTags;
};

type SubmissionType = 'Idea' | 'Question' | null;

const NewSubmissionPage: NextPage = () => {
    const router = useRouter();
    const [submissionType, setSubmissionType] = useState<SubmissionType>(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (router.isReady) {
            const { type } = router.query;
            if (type === 'idea') {
                setSubmissionType('Idea');
            } else if (type === 'question') {
                setSubmissionType('Question');
            }
        }
    }, [router.isReady, router.query]);

    // Unified form state
    const [formState, setFormState] = useState({
        title: '',
        description: '', // Used for Idea description or Question content
        firstName: '',
        lastName: '',
        status: 'Student' as UserStatus,
        tags: [] as string[],
        newCategory: '',
        isAnonymous: false,
        participationType: 'Proposer' as ParticipationType
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormState(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFormState(prev => {
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            } else {
                return { ...prev, tags: [...prev.tags, tag] };
            }
        });
    };

    const handleAddCustomTag = () => {
        if (formState.newCategory.trim() && !formState.tags.includes(formState.newCategory.trim())) {
            setFormState(prev => ({
                ...prev,
                tags: [...prev.tags, prev.newCategory.trim()],
                newCategory: ''
            }));
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (submissionType === 'Idea') {
            if (currentStep === 1) {
                if (!formState.title.trim()) newErrors.title = "Le titre est requis";
                if (!formState.description.trim()) newErrors.description = "La description est requise";
            }
            if (currentStep === 2) {
                if (formState.tags.length === 0) newErrors.tags = "Sélectionnez au moins une catégorie";
            }
            if (currentStep === 3) {
                if (!formState.firstName.trim()) newErrors.firstName = "Le prénom est requis";
                if (!formState.lastName.trim()) newErrors.lastName = "Le nom est requis";
            }
        } else if (submissionType === 'Question') {
            if (!formState.description.trim()) newErrors.description = "Votre question est requise";
            if (!formState.firstName.trim()) newErrors.firstName = "Le prénom est requis";
            if (!formState.lastName.trim()) newErrors.lastName = "Le nom est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (submissionType === 'Idea' && step > 1) {
            setStep(prev => prev - 1);
        } else {
            setSubmissionType(null);
            setStep(1);
            setErrors({});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateStep(step)) {
            setIsSubmitting(true);

            try {
                const author: User = {
                    id: 'user-' + Math.random().toString(36).substr(2, 9),
                    firstName: formState.firstName,
                    lastName: formState.lastName,
                    status: formState.status
                };

                if (submissionType === 'Idea') {
                    const newIdea: NewIdea = {
                        title: formState.title,
                        description: formState.description,
                        author: author,
                        isAnonymous: formState.isAnonymous,
                        tags: formState.tags,
                        participationType: formState.participationType
                    };
                    ideaService.addIdea(newIdea);
                    setTimeout(() => router.push('/explore'), 1500);
                } else {
                    questionService.addQuestion(formState.description, author, formState.isAnonymous);
                    setTimeout(() => router.push('/explore'), 1500);
                }

            } catch (error) {
                console.error("Erreur lors de l'enregistrement:", error);
                setErrors(prev => ({
                    ...prev,
                    submission: "Une erreur est survenue. Veuillez réessayer."
                }));
                setIsSubmitting(false);
            }
        }
    };

    const renderSelectionStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-4">Que souhaitez-vous faire ?</h2>
                <p className="text-gray-600">Choisissez le type de contribution que vous souhaitez apporter.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <button
                    onClick={() => setSubmissionType('Idea')}
                    className="group p-8 border-2 border-gray-200 rounded-xl hover:border-brand-primary hover:bg-blue-50 transition-all text-left"
                >
                    <div className="w-12 h-12 bg-blue-100 text-brand-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Proposer une idée</h3>
                    <p className="text-gray-600">Partagez une initiative innovante pour l'école et trouvez des contributeurs.</p>
                </button>

                <button
                    onClick={() => setSubmissionType('Question')}
                    className="group p-8 border-2 border-gray-200 rounded-xl hover:border-brand-primary hover:bg-blue-50 transition-all text-left"
                >
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Poser une question</h3>
                    <p className="text-gray-600">Interrogez l'administration sur un sujet spécifique ou une préoccupation.</p>
                </button>
            </div>
        </motion.div>
    );

    const renderIdeaProgressBar = () => (
        <div className="w-full max-w-md mx-auto mb-10">
            <div className="flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                            <span className="text-xs mt-1">{s === 1 ? 'Idée' : s === 2 ? 'Catégories' : 'Auteur'}</span>
                        </div>
                        {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const renderIdeaStepOne = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Détails de l'idée</h2>
                <p className="text-gray-600">Décrivez votre projet pour convaincre la communauté.</p>
            </div>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input id="title" name="title" value={formState.title} onChange={handleChange} placeholder="Un titre accrocheur" className={`mt-1 ${errors.title ? 'border-red-500' : ''}`} />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formState.description} onChange={handleChange} placeholder="Expliquez votre idée en détail..." className={`mt-1 min-h-[200px] ${errors.description ? 'border-red-500' : ''}`} />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>
                <div>
                    <Label className="mb-2 block">Votre rôle</Label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label className={`flex items-center space-x-3 cursor-pointer border p-4 rounded-lg hover:bg-gray-50 w-full transition-colors ${formState.participationType === 'Proposer' ? 'border-brand-primary bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="participationType" value="Proposer" checked={formState.participationType === 'Proposer'} onChange={handleChange} className="text-brand-primary focus:ring-brand-primary" />
                            <div>
                                <span className="font-medium block">Je propose l'idée</span>
                                <span className="text-sm text-gray-500">Je cherche quelqu'un pour la réaliser</span>
                            </div>
                        </label>
                        <label className={`flex items-center space-x-3 cursor-pointer border p-4 rounded-lg hover:bg-gray-50 w-full transition-colors ${formState.participationType === 'Actor' ? 'border-brand-primary bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="participationType" value="Actor" checked={formState.participationType === 'Actor'} onChange={handleChange} className="text-brand-primary focus:ring-brand-primary" />
                            <div>
                                <span className="font-medium block">Je veux la réaliser</span>
                                <span className="text-sm text-gray-500">Je serai actif sur le projet</span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="flex justify-between pt-4">
                    <Button onClick={handleBack} variant="outline">Retour</Button>
                    <Button onClick={handleNext} className="px-8">Suivant</Button>
                </div>
            </div>
        </motion.div>
    );

    const renderIdeaStepTwo = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Catégories</h2>
                <p className="text-gray-600">Aidez les autres à trouver votre idée.</p>
            </div>
            <div className="space-y-6">
                <div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {getCategories().map(category => (
                            <button key={category} type="button" onClick={() => handleTagToggle(category)} className={`px-4 py-2 text-sm rounded-md transition-colors ${formState.tags.includes(category) ? 'bg-blue-100 text-brand-primary border-2 border-brand-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                    {errors.tags && <p className="mt-2 text-sm text-red-500">{errors.tags}</p>}
                </div>
                <div>
                    <Label htmlFor="newCategory">Autre catégorie</Label>
                    <div className="flex mt-1">
                        <Input id="newCategory" name="newCategory" value={formState.newCategory} onChange={handleChange} placeholder="Ex: Réalité Virtuelle" className="rounded-r-none" />
                        <Button onClick={handleAddCustomTag} className="rounded-l-none" variant="secondary">Ajouter</Button>
                    </div>
                </div>
                <div className="flex justify-between pt-4">
                    <Button onClick={handleBack} variant="outline">Retour</Button>
                    <Button onClick={handleNext}>Suivant</Button>
                </div>
            </div>
        </motion.div>
    );

    const renderAuthorStep = (isQuestion = false) => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Vos informations</h2>
                <p className="text-gray-600">Nécessaire pour la modération (même si anonyme).</p>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" name="firstName" value={formState.firstName} onChange={handleChange} className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`} />
                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" name="lastName" value={formState.lastName} onChange={handleChange} className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`} />
                        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="status">Statut</Label>
                    <select id="status" name="status" value={formState.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        <option value="Student">Étudiant</option>
                        <option value="Staff">Personnel Administratif</option>
                        <option value="Teacher">Enseignant</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                    <Checkbox id="isAnonymous" checked={formState.isAnonymous} onCheckedChange={(checked) => handleCheckboxChange('isAnonymous', checked as boolean)} />
                    <Label htmlFor="isAnonymous" className="cursor-pointer font-normal">
                        Publier en <span className="font-bold">anonyme</span>
                        <span className="block text-xs text-gray-500 mt-1">Votre nom sera visible uniquement par l'administration.</span>
                    </Label>
                </div>

                {errors.submission && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">{errors.submission}</div>}

                <div className="flex justify-between pt-4">
                    <Button onClick={handleBack} variant="outline">Retour</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand-primary hover:bg-blue-800">
                        {isSubmitting ? 'Envoi en cours...' : (isQuestion ? 'Poser ma question' : 'Soumettre mon idée')}
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    const renderQuestionForm = () => (
        <div className="space-y-6">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Votre Question</h2>
                <p className="text-gray-600">Posez votre question clairement à l'administration.</p>
            </div>

            <div>
                <Label htmlFor="description">Question</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    placeholder="Quelle est votre question ?"
                    className={`mt-1 min-h-[150px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {renderAuthorStep(true)}
        </div>
    );

    return (
        <Layout>
            <Head>
                <title>Nouvelle Contribution | Centrale Méditerranée</title>
            </Head>
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4"><AnimatedGradientText>Nouvelle Contribution</AnimatedGradientText></h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            {!submissionType && (
                                <motion.div key="selection" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                    {renderSelectionStep()}
                                </motion.div>
                            )}

                            {submissionType === 'Idea' && (
                                <motion.div key="idea-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {renderIdeaProgressBar()}
                                    {step === 1 && renderIdeaStepOne()}
                                    {step === 2 && renderIdeaStepTwo()}
                                    {step === 3 && renderAuthorStep(false)}
                                </motion.div>
                            )}

                            {submissionType === 'Question' && (
                                <motion.div key="question-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {renderQuestionForm()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default NewSubmissionPage;