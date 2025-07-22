export interface Player {
  id: string;
  name: string;
  score: number;
  isCurrentPlayer: boolean;
  dartsThrown: number; // количество использованных дротиков в текущем ходу
}

export interface DartThrow {
  id: string;
  playerId: string;
  sector: number; // 0-20, 25 для Bull
  multiplier: "single" | "double" | "triple"; // модификатор очков
  points: number; // итоговые очки за бросок
  timestamp: Date;
}

export interface Turn {
  id: string;
  playerId: string;
  playerName: string;
  throws: DartThrow[];
  totalPoints: number;
  turnNumber: number;
  timestamp: Date;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  throws: DartThrow[];
  turns: Turn[]; // история ходов
  gameType: "standard501" | "cricket"; // тип игры
  isFinished: boolean;
  winner?: string; // ID победителя
  startingScore: number; // стартовый счет (обычно 501)
  doubleOut: boolean; // требуется ли завершение дублем
  totalTurns: number; // общий счетчик ходов
}

export interface GameStatistics {
  gameId: string;
  startTime: Date;
  endTime?: Date;
  players: {
    id: string;
    name: string;
    finalScore: number;
    totalThrows: number;
    averageScore: number;
    bestTurn: number;
    finishPosition: number;
  }[];
  totalTurns: number;
  gameType: "standard501" | "cricket";
  winner?: string;
  gameSettings: {
    startingScore: number;
    doubleOut: boolean;
  };
}

export interface DartBoard {
  sectors: DartSector[];
}

export interface DartSector {
  sector: number; // номер сектора (1-20, 25 для Bull)
  type: "single" | "double" | "triple" | "bull" | "outer-bull";
  points: number; // базовые очки
  coordinates: {
    // для SVG координат кликабельных зон
    path?: string;
    cx?: number;
    cy?: number;
    r?: number;
  };
}

export interface GameSettings {
  playersCount: number;
  startingScore: number;
  doubleOut: boolean; // требуется ли завершение дублем
  gameType: "standard501" | "cricket";
}

// Константы для дартса
export const DART_SECTORS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20,
]; // расположение секторов по часовой стрелке

export const BULL_POINTS = {
  OUTER: 25, // внешний Bull
  INNER: 50, // внутренний Bull (двойной Bull)
};

export const MAX_DARTS_PER_TURN = 3;
