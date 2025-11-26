import React from 'react';
import Link from 'next/link';
import { Question } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QuestionCardProps {
    question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const { id, content, author, createdAt, isAnonymous, isAnswered, answer } = question;

    const formattedDate = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: fr })
        : 'Date inconnue';

    const authorName = isAnonymous ? 'Anonyme' : `${author.firstName} ${author.lastName}`;
    const authorStatus = !isAnonymous && author.status ? `(${author.status})` : '';

    return (
        <div className="group flex flex-col bg-white border border-purple-200 rounded-lg hover:border-purple-300 transition-colors duration-200 h-full overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2">
                <div className="bg-purple-100 text-purple-600 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>

            <div className="p-5 flex-grow">
                <div className="mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isAnswered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {isAnswered ? 'Répondu' : 'En attente'}
                    </span>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-3 break-words line-clamp-4">{content}</h3>

                {isAnswered && answer && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium text-gray-900">Réponse:</span> {answer.content}
                    </div>
                )}
            </div>

            <div className="px-4 py-3 bg-purple-50 border-t border-purple-100 flex justify-between items-center">
                <div>
                    <p className="text-2xs text-gray-500">Par : <span className="font-medium text-gray-600">{authorName}</span> <span className="text-gray-400">{authorStatus}</span></p>
                    <p className="text-2xs text-gray-400">{formattedDate}</p>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
