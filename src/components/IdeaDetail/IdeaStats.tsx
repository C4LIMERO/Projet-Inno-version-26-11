import { Idea } from '../../types';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';

interface IdeaStatsProps {
  idea: Idea;
}

const StatCard: React.FC<{ title: string; value: string | number; icon?: JSX.Element; className?: string }> = ({ title, value, icon, className }) => (
  <div className={`py-4 ${className || ''}`}>
    {icon && <div className="mb-1 text-gray-400">{icon}</div>}
    <dt className="text-xs font-normal text-gray-500 truncate">{title}</dt>
    <dd className="mt-0.5 text-xl font-medium text-gray-700">{value}</dd>
  </div>
);

const IdeaStats: React.FC<IdeaStatsProps> = ({ idea }) => {
  const createdDate = new Date(idea.createdAt);
  const daysSinceCreation = formatDistanceToNowStrict(createdDate, { locale: fr, addSuffix: false, unit: 'day' });
  const formattedCreationDate = format(createdDate, 'd MMM yyyy', { locale: fr });

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-x-8">
      <StatCard
        title="Contributeurs"
        value={idea.contributors.length}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        className="sm:border-r sm:border-gray-200 last:sm:border-r-0"
      />
      <StatCard
        title="Proposé le"
        value={formattedCreationDate}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        className="sm:border-r sm:border-gray-200 last:sm:border-r-0"
      />
      <StatCard
        title="En ligne (jrs)"
        value={daysSinceCreation.replace(/[^0-9]/g, '')}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        className="sm:border-r sm:border-gray-200 last:sm:border-r-0"
      />
      <StatCard
        title="Statut"
        value={idea.status}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        className="last:sm:border-r-0"
      />
    </div>
  );
};

export default IdeaStats;