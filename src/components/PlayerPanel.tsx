import React, { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";

export const PlayerPanel: React.FC = () => {
  const { gameState, lastThrow, updatePlayerName } = useGame();
  const [animatingScore, setAnimatingScore] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Эффект для анимации счета при новом броске
  useEffect(() => {
    if (lastThrow) {
      setAnimatingScore(lastThrow.playerId);
      const timer = setTimeout(() => {
        setAnimatingScore(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastThrow]);

  const handleEditName = (playerId: string, currentName: string) => {
    setEditingPlayer(playerId);
    setEditName(currentName);
  };

  const handleSaveName = (playerId: string) => {
    if (editName.trim() && editName.trim() !== "") {
      updatePlayerName(playerId, editName.trim());
    }
    setEditingPlayer(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditName("");
  };

  return (
    <div className="player-panel">
      <h3>Игроки</h3>
      <div className="player-list">
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className={`player-card ${
              player.isCurrentPlayer
                ? "current-player player-change-animation"
                : ""
            }`}
          >
            <div className="player-info">
              <div className="player-name-section">
                {editingPlayer === player.id ? (
                  <div className="name-edit-form">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName(player.id);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="name-edit-input"
                      maxLength={20}
                      autoFocus
                    />
                    <div className="name-edit-buttons">
                      <button
                        onClick={() => handleSaveName(player.id)}
                        className="btn-save"
                        title="Сохранить"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-cancel"
                        title="Отменить"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <h4
                    className="player-name editable-name"
                    onClick={() => handleEditName(player.id, player.name)}
                    title="Кликните для редактирования"
                  >
                    {player.name}
                    {player.isCurrentPlayer && (
                      <span className="current-indicator">▶</span>
                    )}
                    <span className="edit-hint">✏️</span>
                  </h4>
                )}
              </div>
              <div className="player-score">
                <span
                  className={`score-number ${
                    animatingScore === player.id ? "score-update-animation" : ""
                  }`}
                >
                  {player.score}
                </span>
                <span className="score-label">очков</span>
              </div>
              <div className="player-darts">
                <span className="darts-count">{player.dartsThrown}/3</span>
                <span className="darts-label">дротиков</span>
              </div>
            </div>

            {/* Индикатор положения игрока */}
            <div className="player-position">#{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
