import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DartsIcon } from "./DartsIcon";
import { useGame } from "@/contexts/GameContext";

interface HeaderProps {
  showNavigation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showNavigation = true }) => {
  const location = useLocation();
  const { gameState } = useGame();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Logo Section */}
        <Link to="/" className="logo-link">
          <div className="logo-icon-wrapper">
            <DartsIcon size={28} />
          </div>
          <div className="logo-text">
            <span className="logo-title">Dartrion</span>
            <span className="logo-subtitle">
              Профессиональный счетчик Дартс
            </span>
          </div>
        </Link>

        {/* Right Side Content */}
        <div className="header-right">
          {/* Game Stats */}
          {gameState.players.length > 0 && location.pathname === "/" && (
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{gameState.players.length}</span>
                <span className="stat-label">игроков</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{gameState.throws.length}</span>
                <span className="stat-label">бросков</span>
              </div>
              {gameState.isFinished && (
                <div className="stat-item winner-stat">
                  <span className="stat-icon">🏆</span>
                  <span className="stat-label">Игра завершена</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {showNavigation && (
            <>
              {/* Desktop Navigation */}
              <nav className="nav-capsule desktop-nav">
                <div className="nav-items">
                  <Link
                    to="/"
                    className={`nav-item ${
                      location.pathname === "/" ? "nav-item-active" : ""
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                    <span className="nav-label">Игра</span>
                  </Link>
                  <Link
                    to="/settings"
                    className={`nav-item ${
                      location.pathname === "/settings" ? "nav-item-active" : ""
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="m12 1 1.68 3.36L17 6.64l-1.32 2.36L17 11.36 13.68 13.64 12 17l-1.68-3.36L7 11.36l1.32-2.36L7 6.64l3.32-2.28L12 1z"></path>
                    </svg>
                    <span className="nav-label">Настройки</span>
                  </Link>
                  <div className="nav-item nav-stats">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    <span className="nav-label">Статистика</span>
                    <span className="stats-badge">TODO</span>
                  </div>
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-btn"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              </button>

              {/* Mobile Navigation */}
              {showMobileMenu && (
                <div
                  className="mobile-nav-overlay"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <nav
                    className="mobile-nav"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mobile-nav-header">
                      <h3>Навигация</h3>
                      <button
                        className="mobile-nav-close"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="mobile-nav-items">
                      <Link
                        to="/"
                        className={`mobile-nav-item ${
                          location.pathname === "/"
                            ? "mobile-nav-item-active"
                            : ""
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="6"></circle>
                          <circle cx="12" cy="12" r="2"></circle>
                        </svg>
                        <span>Игра</span>
                      </Link>
                      <Link
                        to="/settings"
                        className={`mobile-nav-item ${
                          location.pathname === "/settings"
                            ? "mobile-nav-item-active"
                            : ""
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="m12 1 1.68 3.36L17 6.64l-1.32 2.36L17 11.36 13.68 13.64 12 17l-1.68-3.36L7 11.36l1.32-2.36L7 6.64l3.32-2.28L12 1z"></path>
                        </svg>
                        <span>Настройки</span>
                      </Link>
                      <div className="mobile-nav-item mobile-nav-stats">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3v18h18"></path>
                          <path d="m19 9-5 5-4-4-3 3"></path>
                        </svg>
                        <span>Статистика</span>
                        <span className="mobile-stats-badge">TODO</span>
                      </div>
                    </div>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
