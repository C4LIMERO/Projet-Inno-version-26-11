import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-neutral-200 py-4 px-6 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-medium text-neutral-800">
          Idea<span className="text-primary-600">Box</span>
        </Link>
        
        <nav>
          <ul className="flex items-center space-x-8">
            <li>
              <Link 
                to="/" 
                className="text-neutral-700 hover:text-primary-600 transition-colors text-sm font-medium"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link 
                to="/ideas" 
                className="text-neutral-700 hover:text-primary-600 transition-colors text-sm font-medium"
              >
                Idées
              </Link>
            </li>
            <li>
              <Link 
                to="/submit" 
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Soumettre
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;