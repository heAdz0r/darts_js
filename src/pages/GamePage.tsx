import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { DartBoard } from '@/components/DartBoard';
import { PlayerPanel } from '@/components/PlayerPanel';

export const GamePage: React.FC = () => {
  const { gameState, makeThrow, nextPlayer, undoLastThrow } = useGame();
  
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const canThrow = currentPlayer && currentPlayer.dartsThrown < 3 && !gameState.isFinished;

  const handleThrow = (sector: number, multiplier: 'single' | 'double' | 'triple', points: number) => {
    makeThrow(sector, multiplier, points);
  };

  const handleNextPlayer = () => {
    nextPlayer();
  };

  if (gameState.players.length === 0) {
    return (
      <div className="game-page">
        <div className="empty-game">
          <h2>🎯 Добро пожаловать в Darts Game!</h2>
          <p>Для начала игры добавьте игроков в настройках</p>
          <a href="/settings" className="btn btn-dart">
            Перейти к настройкам
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-container">
        
        {/* Панель с информацией о текущем игроке */}
        <div className="current-player-section">
          {currentPlayer && (
            <div className="current-player-info">
              <h2>Текущий игрок: {currentPlayer.name}</h2>
              <div className="player-stats">
                <span className="score">Счет: {currentPlayer.score}</span>
                <span className="darts">Дротиков: {currentPlayer.dartsThrown}/3</span>
              </div>
            </div>
          )}
          
          {gameState.isFinished && (
            <div className="winner-announcement">
              <h2>🏆 Победитель: {gameState.players.find(p => p.id === gameState.winner)?.name}!</h2>
            </div>
          )}
        </div>

        {/* Основная игровая область */}
        <div className="game-board">
          <div className="dartboard-section">
            <DartBoard 
              onThrow={handleThrow} 
              disabled={!canThrow} 
            />
            
            {/* Кнопки управления */}
            <div className="game-controls">
              {gameState.throws.length > 0 && !gameState.isFinished && (
                <button 
                  className="btn btn-remove"
                  onClick={undoLastThrow}
                  title="Отменить последний бросок"
                >
                  ↶ Отменить
                </button>
              )}
              
              {currentPlayer && currentPlayer.dartsThrown === 3 && !gameState.isFinished && (
                <button 
                  className="btn btn-dart"
                  onClick={handleNextPlayer}
                >
                  Следующий игрок
                </button>
              )}
              
              {gameState.isFinished && (
                <button 
                  className="btn btn-dart"
                  onClick={() => window.location.reload()}
                >
                  Новая игра
                </button>
              )}
            </div>
          </div>

          {/* Панель игроков */}
          <div className="players-section">
            <PlayerPanel />
          </div>
        </div>

        {/* История последних бросков */}
        <div className="throws-history">
          <h3>Последние броски</h3>
          <div className="throws-list">
            {gameState.throws.slice(-6).reverse().map((throwData) => {
              const player = gameState.players.find(p => p.id === throwData.playerId);
              return (
                <div key={throwData.id} className="throw-item">
                  <span className="player-name">{player?.name}</span>
                  <span className="throw-details">
                    {throwData.sector === 25 
                      ? `Bull ${throwData.points}` 
                      : `${throwData.multiplier.charAt(0).toUpperCase()}${throwData.sector} (${throwData.points})`
                    }
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};