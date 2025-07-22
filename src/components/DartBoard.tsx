import React, { useState } from "react";

interface DartBoardProps {
  onThrow: (
    sector: number,
    multiplier: "single" | "double" | "triple",
    points: number
  ) => void;
  disabled?: boolean;
}

export const DartBoard: React.FC<DartBoardProps> = ({
  onThrow,
  disabled = false,
}) => {
  // Точные сектора в порядке по часовой стрелке от 12 часов (стандартная дартс-доска)
  const sectors = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
  ];
  const [hoveredSector, setHoveredSector] = useState<{
    sector: number;
    multiplier: "single" | "double" | "triple" | "bull";
  } | null>(null);

  const handleSectorClick = (
    sector: number,
    multiplier: "single" | "double" | "triple"
  ) => {
    if (disabled) return;

    let points = sector;
    if (multiplier === "double") points = sector * 2;
    if (multiplier === "triple") points = sector * 3;

    onThrow(sector, multiplier, points);
  };

  const handleBullClick = (isInner: boolean) => {
    if (disabled) return;

    const points = isInner ? 50 : 25;
    const sector = 25;
    const multiplier = isInner ? "double" : "single";

    onThrow(sector, multiplier, points);
  };

  // Генерация SVG путей для секторов с правильными пропорциями по образцу референса
  const generateSectorPath = (
    sectorIndex: number,
    ring: "single-outer" | "triple" | "single-inner" | "double"
  ) => {
    const centerX = 240;
    const centerY = 240;

    // Увеличенные радиусы для большего размера доски
    const radiuses = {
      bullInner: 10, // Inner bull (зеленый центр)
      bullOuter: 25, // Outer bull (красный круг)
      singleInner: 75, // Внутренняя граница одинарной зоны
      tripleInner: 98, // Внутренняя граница тройной зоны
      tripleOuter: 110, // Внешняя граница тройной зоны
      singleOuter: 188, // Внешняя граница одинарной зоны
      doubleInner: 188, // Внутренняя граница двойной зоны
      doubleOuter: 205, // Внешняя граница двойной зоны
    };

    let innerRadius: number, outerRadius: number;

    switch (ring) {
      case "double":
        innerRadius = radiuses.doubleInner;
        outerRadius = radiuses.doubleOuter;
        break;
      case "single-outer":
        innerRadius = radiuses.tripleOuter;
        outerRadius = radiuses.doubleInner;
        break;
      case "triple":
        innerRadius = radiuses.tripleInner;
        outerRadius = radiuses.tripleOuter;
        break;
      case "single-inner":
        innerRadius = radiuses.bullOuter; // Начинаем от внешнего bull
        outerRadius = radiuses.tripleInner;
        break;
    }

    // Угол каждого сектора: 360° / 20 = 18°
    const sectorAngle = 18;
    const startAngle = sectorIndex * sectorAngle - 9 - 90; // -90 для сдвига к 12 часам
    const endAngle = startAngle + sectorAngle;

    // Преобразуем углы в радианы
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Вычисляем координаты точек
    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(startRad);
    const y2 = centerY + outerRadius * Math.sin(startRad);
    const x3 = centerX + outerRadius * Math.cos(endRad);
    const y3 = centerY + outerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(endRad);
    const y4 = centerY + innerRadius * Math.sin(endRad);

    // Создаем SVG path
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  // Функция для получения цвета сектора строго по референсу (кремовый/черный для одинарных, красный/зеленый для двойных/тройных)
  const getSectorColor = (
    sectorIndex: number,
    ring: "single-outer" | "triple" | "single-inner" | "double",
    isHovered: boolean = false
  ) => {
    if (isHovered) return "#fbbf24"; // золотой при hover

    const isEven = sectorIndex % 2 === 0;

    if (ring === "triple" || ring === "double") {
      return isEven ? "#dc2626" : "#16a34a"; // темно-красный или темно-зеленый
    } else {
      return isEven ? "#fef7cd" : "#1f2937"; // светло-кремовый или темно-серый
    }
  };

  // Функция для получения позиции номеров с корректным радиусом
  const getNumberPosition = (sectorIndex: number) => {
    const sectorAngle = 18;
    const angle = sectorIndex * sectorAngle - 90; // -90 для сдвига к 12 часам
    const angleRad = (angle * Math.PI) / 180;
    const radius = 230; // Радиус для размещения номеров за пределами ореола

    return {
      x: 240 + radius * Math.cos(angleRad),
      y: 240 + radius * Math.sin(angleRad),
    };
  };

  return (
    <div className={`dart-board-container ${disabled ? "disabled" : ""}`}>
      <div className="dart-board-svg">
        <svg width="480" height="480" viewBox="0 0 480 480">
          {/* Внешний фон доски */}
          <circle
            cx="240"
            cy="240"
            r="210"
            fill="#2d3748"
            stroke="#ffffff"
            strokeWidth="4"
          />

          {/* Двойные зоны (внешнее кольцо) */}
          {sectors.map((sector, index) => {
            const isHovered =
              hoveredSector?.sector === sector &&
              hoveredSector?.multiplier === "double";
            return (
              <path
                key={`double-${sector}`}
                d={generateSectorPath(index, "double")}
                fill={getSectorColor(index, "double", isHovered)}
                stroke="#ffffff"
                strokeWidth="1"
                className="sector-clickable"
                onClick={() => handleSectorClick(sector, "double")}
                onMouseEnter={() =>
                  setHoveredSector({ sector, multiplier: "double" })
                }
                onMouseLeave={() => setHoveredSector(null)}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              />
            );
          })}

          {/* Внешние одинарные зоны */}
          {sectors.map((sector, index) => {
            const isHovered =
              hoveredSector?.sector === sector &&
              hoveredSector?.multiplier === "single";
            return (
              <path
                key={`single-outer-${sector}`}
                d={generateSectorPath(index, "single-outer")}
                fill={getSectorColor(index, "single-outer", isHovered)}
                stroke="#ffffff"
                strokeWidth="1"
                className="sector-clickable"
                onClick={() => handleSectorClick(sector, "single")}
                onMouseEnter={() =>
                  setHoveredSector({ sector, multiplier: "single" })
                }
                onMouseLeave={() => setHoveredSector(null)}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              />
            );
          })}

          {/* Тройные зоны */}
          {sectors.map((sector, index) => {
            const isHovered =
              hoveredSector?.sector === sector &&
              hoveredSector?.multiplier === "triple";
            return (
              <path
                key={`triple-${sector}`}
                d={generateSectorPath(index, "triple")}
                fill={getSectorColor(index, "triple", isHovered)}
                stroke="#ffffff"
                strokeWidth="1"
                className="sector-clickable"
                onClick={() => handleSectorClick(sector, "triple")}
                onMouseEnter={() =>
                  setHoveredSector({ sector, multiplier: "triple" })
                }
                onMouseLeave={() => setHoveredSector(null)}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              />
            );
          })}

          {/* Внутренние одинарные зоны */}
          {sectors.map((sector, index) => {
            const isHovered =
              hoveredSector?.sector === sector &&
              hoveredSector?.multiplier === "single";
            return (
              <path
                key={`single-inner-${sector}`}
                d={generateSectorPath(index, "single-inner")}
                fill={getSectorColor(index, "single-inner", isHovered)}
                stroke="#ffffff"
                strokeWidth="1"
                className="sector-clickable"
                onClick={() => handleSectorClick(sector, "single")}
                onMouseEnter={() =>
                  setHoveredSector({ sector, multiplier: "single" })
                }
                onMouseLeave={() => setHoveredSector(null)}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              />
            );
          })}

          {/* Номера секторов - размещаем дальше от края */}
          {sectors.map((sector, index) => {
            const pos = getNumberPosition(index);
            const isHovered = hoveredSector?.sector === sector;
            return (
              <text
                key={`number-${sector}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="16"
                fontWeight="bold"
                className={`sector-number ${isHovered ? "hovered" : ""}`}
                style={{
                  pointerEvents: "none",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                  transition: "all 0.15s ease",
                  transform: isHovered ? "scale(1.2)" : "scale(1)",
                }}
              >
                {sector}
              </text>
            );
          })}

          {/* Внешний Bull (25 очков) - красный по референсу */}
          <circle
            cx="240"
            cy="240"
            r="25"
            fill={
              hoveredSector?.sector === 25 &&
              hoveredSector?.multiplier === "single"
                ? "#fbbf24"
                : "#dc2626"
            }
            stroke="#ffffff"
            strokeWidth="2"
            className="sector-clickable"
            onClick={() => handleBullClick(false)}
            onMouseEnter={() =>
              setHoveredSector({ sector: 25, multiplier: "single" })
            }
            onMouseLeave={() => setHoveredSector(null)}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              filter:
                hoveredSector?.sector === 25 &&
                hoveredSector?.multiplier === "single"
                  ? "brightness(1.1)"
                  : "none",
            }}
          />

          {/* Внутренний Bull (50 очков) - зеленый по референсу */}
          <circle
            cx="240"
            cy="240"
            r="10"
            fill={
              hoveredSector?.sector === 25 &&
              hoveredSector?.multiplier === "double"
                ? "#fbbf24"
                : "#16a34a"
            }
            stroke="#ffffff"
            strokeWidth="2"
            className="sector-clickable"
            onClick={() => handleBullClick(true)}
            onMouseEnter={() =>
              setHoveredSector({ sector: 25, multiplier: "double" })
            }
            onMouseLeave={() => setHoveredSector(null)}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              filter:
                hoveredSector?.sector === 25 &&
                hoveredSector?.multiplier === "double"
                  ? "brightness(1.1)"
                  : "none",
            }}
          />

          {/* Разделительные кольца между зонами с обновленными координатами */}
          <circle
            cx="240"
            cy="240"
            r="75"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx="240"
            cy="240"
            r="98"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx="240"
            cy="240"
            r="110"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx="240"
            cy="240"
            r="188"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx="240"
            cy="240"
            r="205"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ pointerEvents: "none" }}
          />

          {/* Разделительные линии для секторов с корректными радиусами */}
          {sectors.map((sector, index) => {
            const angle = index * 18 - 90; // -90 для сдвига к 12 часам
            const angleRad = (angle * Math.PI) / 180;
            return (
              <line
                key={`line-${sector}`}
                x1={240 + 25 * Math.cos(angleRad)}
                y1={240 + 25 * Math.sin(angleRad)}
                x2={240 + 210 * Math.cos(angleRad)}
                y2={240 + 210 * Math.sin(angleRad)}
                stroke="#ffffff"
                strokeWidth="1.5"
                style={{ pointerEvents: "none" }}
              />
            );
          })}
        </svg>

        {/* Индикатор текущего выбранного сектора - абсолютно позиционирован */}
        <div className="sector-indicator-container">
          {hoveredSector && !disabled ? (
            <div className="sector-indicator">
              {hoveredSector.multiplier === "triple"
                ? "T"
                : hoveredSector.multiplier === "double"
                ? "D"
                : ""}
              {hoveredSector.sector === 25
                ? hoveredSector.multiplier === "double"
                  ? "Bull (50)"
                  : "Bull (25)"
                : hoveredSector.sector}
              {hoveredSector.sector !== 25 &&
                ` (${
                  hoveredSector.multiplier === "triple"
                    ? hoveredSector.sector * 3
                    : hoveredSector.multiplier === "double"
                    ? hoveredSector.sector * 2
                    : hoveredSector.sector
                })`}
            </div>
          ) : (
            <div className="sector-indicator-placeholder">
              Наведите на сектор
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
