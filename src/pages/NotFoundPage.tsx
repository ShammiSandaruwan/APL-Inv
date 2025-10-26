// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gin">
      <h1 className="text-4xl font-bold text-mine-shaft">404 - Not Found</h1>
      <p className="mt-4 text-scorpion">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-8 px-4 py-2 text-white bg-salem rounded hover:bg-goblin">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
