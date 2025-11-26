import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const { id, title, description, author, createdAt, tags, isAnonymous, contributors } = idea;

  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: fr })
    : 'Date inconnue';

  const truncatedDescription = description.length > 90
    ? `${description.substring(0, 90)}...`
    : description;

  const authorName = isAnonymous ? 'Anonyme' : `${author.firstName} ${author.lastName}`;
  // Only show status if not anonymous and status exists
  const authorStatus = !isAnonymous && author.status ? `(${author.status})` : '';

  return (
    <Link
      href={`/idea/${id}`}
      className="group flex flex-col bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition-colors duration-200 h-full overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-2">
        <div className="bg-blue-100 text-brand-primary rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      <div className="p-5 flex-grow">
        <div className="mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-brand-primary">
            Idée
          </span>
        </div>
        <h3 className="text-base font-medium text-gray-800 group-hover:text-brand-primary transition-colors mb-3 break-words pr-8">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 break-words line-clamp-3">{truncatedDescription}</p>

        {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-2xs font-normal text-gray-500 border border-gray-200 px-2 py-0.5 rounded-md"
                title={tag}
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-2xs font-normal text-gray-500 border border-gray-200 px-2 py-0.5 rounded-md">
                + {tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
        <div>
          <p className="text-2xs text-gray-500">Par : <span className="font-medium text-gray-600">{authorName}</span> <span className="text-gray-400">{authorStatus}</span></p>
          <p className="text-2xs text-gray-400">{formattedDate}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium mr-1">{contributors.length}</span> contributeur{contributors.length !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
};

export default IdeaCard;