import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { GameSettings } from "@/types";

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, addPlayer, removePlayer, updatePlayerName, startGame } =
    useGame();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [settings, setSettings] = useState<GameSettings>({
    playersCount: 3,
    startingScore: 501,
    doubleOut: true, // предустановка Double Out
    gameType: "standard501",
  });

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim() && gameState.players.length < 8) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName("");
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    removePlayer(playerId);
  };

  const handleStartGame = () => {
    if (gameState.players.length >= 2) {
      startGame(settings);
      // Используем React Router для навигации
      navigate("/");
    }
  };

  const handleEditPlayerName = (playerId: string, currentName: string) => {
    setEditingPlayerId(playerId);
    setEditPlayerName(currentName);
  };

  const handleSavePlayerName = () => {
    if (editingPlayerId && editPlayerName.trim()) {
      updatePlayerName(editingPlayerId, editPlayerName.trim());
    }
    setEditingPlayerId(null);
    setEditPlayerName("");
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditPlayerName("");
  };

  const canStartGame = gameState.players.length >= 2;

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>⚙️ Настройки игры</h1>

        {/* Секция управления игроками */}
        <section className="players-section">
          <h2>Игроки ({gameState.players.length}/8)</h2>

          {/* Форма добавления игрока */}
          <form onSubmit={handleAddPlayer} className="add-player-form">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Имя игрока"
              maxLength={20}
              disabled={gameState.players.length >= 8}
            />
            <button
              type="submit"
              className="btn btn-dart"
              disabled={!newPlayerName.trim() || gameState.players.length >= 8}
            >
              Добавить
            </button>
          </form>

          {/* Список игроков */}
          <div className="players-list">
            {gameState.players.map((player, index) => (
              <div key={player.id} className="player-item-enhanced">
                <div className="player-avatar">
                  <span className="player-number">#{index + 1}</span>
                </div>

                <div className="player-info-section">
                  {editingPlayerId === player.id ? (
                    <div className="player-name-edit">
                      <input
                        type="text"
                        value={editPlayerName}
                        onChange={(e) => setEditPlayerName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSavePlayerName();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="player-name-input"
                        maxLength={20}
                        autoFocus
                        placeholder="Имя игрока"
                      />
                      <div className="edit-actions">
                        <button
                          onClick={handleSavePlayerName}
                          className="btn-action btn-save-action"
                          title="Сохранить"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="20,6 9,17 4,12"></polyline>
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-action btn-cancel-action"
                          title="Отменить"
                        >
                          <svg
                            width="16"
                            height="16"
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
                    </div>
                  ) : (
                    <div className="player-name-display">
                      <span
                        className="player-name-text"
                        onClick={() =>
                          handleEditPlayerName(player.id, player.name)
                        }
                        title="Кликните для редактирования"
                      >
                        {player.name}
                      </span>
                      <button
                        onClick={() =>
                          handleEditPlayerName(player.id, player.name)
                        }
                        className="btn-edit-name"
                        title="Редактировать имя"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="player-meta">
                    <span className="player-status">Готов к игре</span>
                  </div>
                </div>

                <div className="player-actions">
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="btn-action btn-remove-player"
                    disabled={gameState.players.length <= 1}
                    title="Удалить игрока"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {gameState.players.length === 0 && (
            <div className="empty-players">
              <p>Добавьте как минимум 2 игроков для начала игры</p>
            </div>
          )}
        </section>

        {/* Секция настроек игры */}
        <section className="game-settings-section">
          <h2>Настройки игры</h2>

          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="startingScore">Начальный счет:</label>
              <select
                id="startingScore"
                value={settings.startingScore}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    startingScore: parseInt(e.target.value),
                  })
                }
              >
                <option value={301}>301</option>
                <option value={501}>501</option>
                <option value={701}>701</option>
                <option value={1001}>1001</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="gameType">Тип игры:</label>
              <select
                id="gameType"
                value={settings.gameType}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gameType: e.target.value as "standard501" | "cricket",
                  })
                }
              >
                <option value="standard501">Стандарт 501</option>
                <option value="cricket" disabled>
                  Cricket (скоро)
                </option>
              </select>
            </div>

            <div className="setting-item checkbox-item">
              <input
                type="checkbox"
                id="doubleOut"
                checked={settings.doubleOut}
                onChange={(e) =>
                  setSettings({ ...settings, doubleOut: e.target.checked })
                }
              />
              <label htmlFor="doubleOut">Double Out (завершение дублем)</label>
            </div>
          </div>
        </section>

        {/* Кнопки управления */}
        <div className="settings-actions">
          <button
            onClick={handleStartGame}
            className={`btn btn-dart start-game-btn ${
              canStartGame ? "" : "disabled"
            }`}
            disabled={!canStartGame}
          >
            {canStartGame ? "🎯 Начать игру" : "Добавьте минимум 2 игроков"}
          </button>
        </div>

        {/* Информационная секция */}
        <section className="info-section">
          <h3>ℹ️ Правила игры</h3>
          <ul>
            <li>
              Каждый игрок начинает с выбранным количеством очков (по умолчанию
              501)
            </li>
            <li>Цель - первым довести свой счет до 0</li>
            <li>У каждого игрока есть 3 дротика за ход</li>
            <li>Очки вычитаются из текущего счета игрока</li>
            <li>
              Double Out: если включено, игра должна завершиться попаданием в
              двойную зону
            </li>
            <li>Кликайте по доске чтобы указать куда попал дротик</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
