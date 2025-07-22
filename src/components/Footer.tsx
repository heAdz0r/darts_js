import React, { useState } from "react";

export const Footer: React.FC = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* Left Side - Copyright */}
            <div className="footer-left">
              <span className="footer-text">
                © 2025 Dartrion. Профессиональная система счета дартс.
              </span>
            </div>

            {/* Center - Links */}
            <div className="footer-center">
              <button
                onClick={() => setShowRules(true)}
                className="footer-link footer-rules-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: "6px" }}
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Правила игры
              </button>
            </div>

            {/* Right Side - Version & Status */}
            <div className="footer-right">
              <div className="footer-status">
                <span className="status-indicator online"></span>
                <span className="footer-text">Онлайн</span>
              </div>
              <span className="footer-badge">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Rules Modal */}
      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div
            className="modal-content rules-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header rules-header">
              <div className="rules-title-section">
                <div className="rules-icon">🎯</div>
                <div>
                  <h2>Правила игры в дартс</h2>
                  <p className="rules-subtitle">
                    Изучите основы для успешной игры
                  </p>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowRules(false)}
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

            <div className="modal-body rules-body">
              <div className="rules-grid">
                <div className="rules-card">
                  <div className="rules-card-header">
                    <div className="rules-card-icon">🎮</div>
                    <h3>Основные правила</h3>
                  </div>
                  <ul className="rules-list">
                    <li>
                      Каждый игрок начинает с 501 очка (или другого выбранного
                      количества)
                    </li>
                    <li>
                      Цель игры - первым довести свой счет до точно 0 очков
                    </li>
                    <li>У каждого игрока есть 3 дротика за ход</li>
                    <li>
                      Очки за попадание вычитаются из текущего счета игрока
                    </li>
                  </ul>
                </div>

                <div className="rules-card">
                  <div className="rules-card-header">
                    <div className="rules-card-icon">🎯</div>
                    <h3>Зоны доски</h3>
                  </div>
                  <ul className="rules-list">
                    <li>
                      <strong>Одинарная зона:</strong> Базовые очки сектора
                      (1-20)
                    </li>
                    <li>
                      <strong>Двойная зона:</strong> Внешнее кольцо, удваивает
                      очки сектора
                    </li>
                    <li>
                      <strong>Тройная зона:</strong> Внутреннее кольцо,
                      утраивает очки сектора
                    </li>
                    <li>
                      <strong>Внешний Bull:</strong> 25 очков
                    </li>
                    <li>
                      <strong>Внутренний Bull:</strong> 50 очков (считается как
                      двойной)
                    </li>
                  </ul>
                </div>

                <div className="rules-card">
                  <div className="rules-card-header">
                    <div className="rules-card-icon">🏁</div>
                    <h3>Завершение игры</h3>
                  </div>
                  <ul className="rules-list">
                    <li>
                      <strong>Double Out:</strong> Если включено, игра должна
                      завершиться попаданием в двойную зону
                    </li>
                    <li>
                      Нельзя уйти в отрицательные очки - такой бросок не
                      засчитывается
                    </li>
                    <li>
                      При нарушении правил ход переходит к следующему игроку
                    </li>
                    <li>Победитель - первый игрок, доведший счет до точно 0</li>
                  </ul>
                </div>

                <div className="rules-card">
                  <div className="rules-card-header">
                    <div className="rules-card-icon">🎲</div>
                    <h3>Управление</h3>
                  </div>
                  <ul className="rules-list">
                    <li>
                      Кликайте по доске, чтобы указать место попадания дротика
                    </li>
                    <li>
                      Используйте кнопку "Отменить" для отмены последнего броска
                    </li>
                    <li>Кнопка "Следующий игрок" появляется после 3 бросков</li>
                    <li>Настройте игроков и правила в разделе "Настройки"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer rules-footer">
              <div className="rules-footer-info">
                <span>
                  💡 Совет: Начните с режима без Double Out для изучения основ
                </span>
              </div>
              <button
                className="btn btn-dart rules-close-btn"
                onClick={() => setShowRules(false)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: "8px" }}
                >
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Понятно!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
