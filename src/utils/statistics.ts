import * as yaml from "js-yaml";
import { GameState, GameStatistics } from "@/types";

export class StatisticsManager {
  private static readonly STATS_FILE = "game-stats.yaml";

  static async saveGameStatistics(gameState: GameState): Promise<void> {
    try {
      const stats = this.generateStatistics(gameState);
      const existingStats = await this.loadStatistics();

      const updatedStats = [...existingStats, stats];
      const yamlContent = yaml.dump(updatedStats, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
      });

      // Save to localStorage for web app
      localStorage.setItem(this.STATS_FILE, yamlContent);

      // Also try to save as downloadable file
      this.downloadStatsFile(yamlContent);
    } catch (error) {
      console.error("Failed to save game statistics:", error);
    }
  }

  static async loadStatistics(): Promise<GameStatistics[]> {
    try {
      const yamlContent = localStorage.getItem(this.STATS_FILE);
      if (!yamlContent) return [];

      const stats = yaml.load(yamlContent) as GameStatistics[];
      return Array.isArray(stats) ? stats : [];
    } catch (error) {
      console.error("Failed to load game statistics:", error);
      return [];
    }
  }

  private static generateStatistics(gameState: GameState): GameStatistics {
    const playerStats = gameState.players.map((player, index) => {
      const playerThrows = gameState.throws.filter(
        (t) => t.playerId === player.id
      );
      const totalThrows = playerThrows.length;
      const totalPoints = playerThrows.reduce((sum, t) => sum + t.points, 0);
      const averageScore = totalThrows > 0 ? totalPoints / totalThrows : 0;

      // Find best turn (3 consecutive throws)
      let bestTurn = 0;
      for (let i = 0; i <= playerThrows.length - 3; i += 3) {
        const turnPoints = playerThrows
          .slice(i, i + 3)
          .reduce((sum, t) => sum + t.points, 0);
        bestTurn = Math.max(bestTurn, turnPoints);
      }

      return {
        id: player.id,
        name: player.name,
        finalScore: player.score,
        totalThrows,
        averageScore: Math.round(averageScore * 100) / 100,
        bestTurn,
        finishPosition: gameState.winner === player.id ? 1 : index + 1,
      };
    });

    return {
      gameId: gameState.id,
      startTime: new Date(),
      endTime: gameState.isFinished ? new Date() : undefined,
      players: playerStats,
      totalTurns: gameState.totalTurns,
      gameType: gameState.gameType,
      winner: gameState.winner,
      gameSettings: {
        startingScore: gameState.startingScore,
        doubleOut: gameState.doubleOut,
      },
    };
  }

  private static downloadStatsFile(yamlContent: string): void {
    try {
      const blob = new Blob([yamlContent], { type: "text/yaml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `darts-stats-${
        new Date().toISOString().split("T")[0]
      }.yaml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download stats file:", error);
    }
  }

  static async getPlayerStatistics(playerId: string): Promise<any> {
    const allStats = await this.loadStatistics();
    const playerGames = allStats.filter((game) =>
      game.players.some((p) => p.id === playerId)
    );

    if (playerGames.length === 0) return null;

    const playerData = playerGames.map(
      (game) => game.players.find((p) => p.id === playerId)!
    );

    return {
      totalGames: playerGames.length,
      wins: playerData.filter((p) => p.finishPosition === 1).length,
      averageScore:
        playerData.reduce((sum, p) => sum + p.averageScore, 0) /
        playerData.length,
      bestTurn: Math.max(...playerData.map((p) => p.bestTurn)),
      totalThrows: playerData.reduce((sum, p) => sum + p.totalThrows, 0),
    };
  }
}
