import { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, Player, DartThrow, GameSettings, Turn } from "@/types";
import { StatisticsManager } from "@/utils/statistics";

interface GameContextType {
  gameState: GameState;
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerName: (playerId: string, newName: string) => void;
  startGame: (settings: GameSettings) => void;
  makeThrow: (
    sector: number,
    multiplier: "single" | "double" | "triple",
    points: number
  ) => void;
  nextPlayer: () => void;
  resetGame: () => void;
  undoLastThrow: () => void; // добавление функции отмены
  lastThrow: DartThrow | null; // добавление для анимаций
}

type GameAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; playerId: string }
  | { type: "UPDATE_PLAYER_NAME"; playerId: string; newName: string }
  | { type: "START_GAME"; settings: GameSettings }
  | {
      type: "MAKE_THROW";
      sector: number;
      multiplier: "single" | "double" | "triple";
      points: number;
    }
  | { type: "NEXT_PLAYER" }
  | { type: "RESET_GAME" }
  | { type: "UNDO_LAST_THROW" }; // добавление действия отмены

// Предустановленные игроки
const defaultPlayers: Player[] = [
  {
    id: crypto.randomUUID(),
    name: "Игрок 1",
    score: 501,
    isCurrentPlayer: true,
    dartsThrown: 0,
  },
  {
    id: crypto.randomUUID(),
    name: "Игрок 2",
    score: 501,
    isCurrentPlayer: false,
    dartsThrown: 0,
  },
  {
    id: crypto.randomUUID(),
    name: "Игрок 3",
    score: 501,
    isCurrentPlayer: false,
    dartsThrown: 0,
  },
];

const initialState: GameState = {
  id: crypto.randomUUID(),
  players: defaultPlayers,
  currentPlayerIndex: 0,
  throws: [],
  turns: [],
  gameType: "standard501",
  isFinished: false,
  startingScore: 501,
  doubleOut: true, // по умолчанию включен double out
  totalTurns: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Функция проверки правил завершения игры
function checkFinishRules(
  newScore: number,
  multiplier: "single" | "double" | "triple",
  state: GameState
): boolean {
  // Нельзя уйти в минус в любом случае
  if (newScore < 0) return false;

  // Если включен Double Out
  if (state.doubleOut) {
    // Если остается 1 очко, нельзя завершить (невозможно double на 1)
    if (newScore === 1) return false;

    // Если счет становится 0, должен быть double для завершения
    if (newScore === 0 && multiplier !== "double") return false;
  }

  return true;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: action.name,
        score: state.startingScore,
        isCurrentPlayer: state.players.length === 0,
        dartsThrown: 0,
      };
      return {
        ...state,
        players: [...state.players, newPlayer],
      };

    case "REMOVE_PLAYER":
      const filteredPlayers = state.players.filter(
        (p) => p.id !== action.playerId
      );
      return {
        ...state,
        players: filteredPlayers,
        currentPlayerIndex: Math.min(
          state.currentPlayerIndex,
          filteredPlayers.length - 1
        ),
      };

    case "UPDATE_PLAYER_NAME":
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.playerId
            ? { ...player, name: action.newName }
            : player
        ),
      };

    case "START_GAME":
      return {
        ...state,
        gameType: action.settings.gameType,
        startingScore: action.settings.startingScore,
        doubleOut: action.settings.doubleOut, // обновление настройки doubleOut
        players: state.players.map((player, index) => ({
          ...player,
          score: action.settings.startingScore,
          isCurrentPlayer: index === 0,
          dartsThrown: 0,
        })),
        currentPlayerIndex: 0,
        throws: [],
        turns: [],
        isFinished: false,
        totalTurns: 0,
      };

    case "MAKE_THROW":
      if (state.isFinished) return state;

      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer || currentPlayer.dartsThrown >= 3) return state;

      const newThrow: DartThrow = {
        id: crypto.randomUUID(),
        playerId: currentPlayer.id,
        sector: action.sector,
        multiplier: action.multiplier,
        points: action.points,
        timestamp: new Date(),
      };

      const updatedPlayers = state.players.map((player) => {
        if (player.id === currentPlayer.id) {
          let newScore = player.score - action.points;

          // Проверяем правила дартс для завершения игры
          const canFinish = checkFinishRules(
            newScore,
            action.multiplier,
            state
          );

          if (!canFinish) {
            // Если нарушены правила завершения, сбрасываем бросок
            return {
              ...player,
              dartsThrown: player.dartsThrown + 1,
              // Счет не изменяется при нарушении правил
            };
          }

          // Применяем изменения счета
          newScore = Math.max(0, newScore);

          return {
            ...player,
            score: newScore,
            dartsThrown: player.dartsThrown + 1,
          };
        }
        return player;
      });

      // Проверка на победу
      const currentPlayerUpdated = updatedPlayers[state.currentPlayerIndex];
      const isValidWin =
        currentPlayerUpdated.score === 0 &&
        checkFinishRules(0, action.multiplier, state);

      const newState = {
        ...state,
        players: updatedPlayers,
        throws: [...state.throws, newThrow],
        isFinished: isValidWin,
        winner: isValidWin ? currentPlayerUpdated.id : state.winner,
      };

      // Save statistics when game finishes
      if (isValidWin) {
        StatisticsManager.saveGameStatistics(newState).catch(console.error);
      }

      return newState;

    case "NEXT_PLAYER":
      const currentPlayerState = state.players[state.currentPlayerIndex];

      // Переход к следующему игроку только если текущий игрок использовал все дротики
      if (currentPlayerState.dartsThrown < 3 && !state.isFinished) return state;

      // Create turn record
      const currentPlayerThrows = state.throws
        .filter((t) => t.playerId === currentPlayerState.id)
        .slice(-currentPlayerState.dartsThrown);

      const newTurn: Turn = {
        id: crypto.randomUUID(),
        playerId: currentPlayerState.id,
        playerName: currentPlayerState.name,
        throws: currentPlayerThrows,
        totalPoints: currentPlayerThrows.reduce((sum, t) => sum + t.points, 0),
        turnNumber: state.totalTurns + 1,
        timestamp: new Date(),
      };

      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;

      return {
        ...state,
        currentPlayerIndex: nextIndex,
        totalTurns: state.totalTurns + 1,
        turns: [...state.turns, newTurn],
        players: state.players.map((player, index) => ({
          ...player,
          isCurrentPlayer: index === nextIndex,
          dartsThrown: index === nextIndex ? 0 : player.dartsThrown, // Сброс дротиков только для нового игрока
        })),
      };

    case "RESET_GAME":
      return {
        ...initialState,
        id: crypto.randomUUID(),
        players: state.players.map((player) => ({
          ...player,
          score: state.startingScore,
          isCurrentPlayer: false,
          dartsThrown: 0,
        })),
        turns: [],
        totalTurns: 0,
      };

    case "UNDO_LAST_THROW":
      if (state.throws.length === 0) return state; // нет бросков для отмены

      const lastThrowToUndo = state.throws[state.throws.length - 1];
      const playerToUpdate = state.players.find(
        (p) => p.id === lastThrowToUndo.playerId
      );

      if (!playerToUpdate) return state;

      const updatedPlayersUndo = state.players.map((player) => {
        if (player.id === lastThrowToUndo.playerId) {
          return {
            ...player,
            score: player.score + lastThrowToUndo.points, // возвращаем очки
            dartsThrown: Math.max(0, player.dartsThrown - 1), // уменьшаем количество дротиков
          };
        }
        return player;
      });

      return {
        ...state,
        players: updatedPlayersUndo,
        throws: state.throws.slice(0, -1), // удаляем последний бросок
        isFinished: false, // сбрасываем состояние завершения игры
        winner: undefined, // сбрасываем победителя
      };

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const lastThrow = gameState.throws[gameState.throws.length - 1] || null; // добавление для анимаций

  const addPlayer = (name: string) => {
    dispatch({ type: "ADD_PLAYER", name });
  };

  const removePlayer = (playerId: string) => {
    dispatch({ type: "REMOVE_PLAYER", playerId });
  };

  const updatePlayerName = (playerId: string, newName: string) => {
    dispatch({ type: "UPDATE_PLAYER_NAME", playerId, newName });
  };

  const startGame = (settings: GameSettings) => {
    dispatch({ type: "START_GAME", settings });
  };

  const makeThrow = (
    sector: number,
    multiplier: "single" | "double" | "triple",
    points: number
  ) => {
    dispatch({ type: "MAKE_THROW", sector, multiplier, points });
  };

  const nextPlayer = () => {
    dispatch({ type: "NEXT_PLAYER" });
  };

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const undoLastThrow = () => {
    dispatch({ type: "UNDO_LAST_THROW" });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        addPlayer,
        removePlayer,
        updatePlayerName,
        startGame,
        makeThrow,
        nextPlayer,
        resetGame,
        undoLastThrow, // добавление функции отмены
        lastThrow, // добавление для анимаций
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
