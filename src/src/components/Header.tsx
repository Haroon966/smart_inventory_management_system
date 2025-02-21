import React from 'react';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export function Header({ setCurrentPage, currentPage }: HeaderProps) {
  const pages = ['dashboard', 'inventory', 'transactions', 'reports', 'settings'];

  return (
    <header className="bg-dark text-white mb-4">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <span className="navbar-brand">Inventory System</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {pages.map((page) => (
                <li key={page} className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

