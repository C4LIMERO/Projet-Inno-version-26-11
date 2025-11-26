import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProgressStep {
  name: string;
  date: string; // ISO string format
}

interface ProgressTimelineProps {
  steps: ProgressStep[];
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return <p className="text-sm text-gray-500 italic">Aucun avancement à afficher pour le moment.</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {steps.map((step, index) => (
          <li key={index}>
            <div className="relative pb-6">
              {index !== steps.length - 1 ? (
                <span className="absolute top-3 left-3 -ml-px h-full w-px bg-gray-300" aria-hidden="true"></span>
              ) : null}
              <div className="relative flex space-x-3 items-start">
                <div>
                  {/* Minimalist dot indicator */}
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-500"></div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-700">{step.name}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(step.date), 'd MMM yyyy \'à\' HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTimeline; 