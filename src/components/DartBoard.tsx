import React, { useState, useRef } from "react";
import "./DartBoard.css";

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
  const sectors = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
  ];

  const [hoveredSector, setHoveredSector] = useState<{
    sector: number;
    multiplier: "single" | "double" | "triple" | "bull";
  } | null>(null);

  const [lastThrowPosition, setLastThrowPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // --- ИСПРАВЛЕННАЯ ФУНКЦИЯ ---
  // Используем встроенный метод SVG для точного преобразования координат
  const getSvgCoordinates = (event: React.MouseEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;

    // Создаем точку SVG
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    // Получаем матрицу трансформации экрана (CTM)
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;

    // Преобразуем точку из координат экрана в координаты SVG, используя инвертированную матрицу
    const transformedPoint = point.matrixTransform(ctm.inverse());

    return { x: transformedPoint.x, y: transformedPoint.y };
  };

  const handleThrow = (
    sector: number,
    multiplier: "single" | "double" | "triple",
    points: number,
    event: React.MouseEvent<SVGElement>
  ) => {
    if (disabled) return;

    onThrow(sector, multiplier, points);
    setLastThrowPosition(getSvgCoordinates(event));
  };

  const generateSectorPath = (
    sectorIndex: number,
    ring: "single-outer" | "triple" | "single-inner" | "double"
  ) => {
    const centerX = 350;
    const centerY = 350;

    const radiuses = {
      bullInner: 15,
      bullOuter: 35,
      singleInner: 105,
      tripleInner: 138,
      tripleOuter: 154,
      singleOuter: 262,
      doubleInner: 262,
      doubleOuter: 287,
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
      default:
        innerRadius = radiuses.bullOuter;
        outerRadius = radiuses.tripleInner;
        break;
    }

    const sectorAngle = 18;
    const startAngle = sectorIndex * sectorAngle - 9 - 90;
    const endAngle = startAngle + sectorAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(startRad);
    const y2 = centerY + outerRadius * Math.sin(startRad);
    const x3 = centerX + outerRadius * Math.cos(endRad);
    const y3 = centerY + outerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(endRad);
    const y4 = centerY + innerRadius * Math.sin(endRad);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  const getSectorColor = (
    sectorIndex: number,
    ring: string,
    isHovered: boolean
  ) => {
    if (isHovered) return "#fbbf24";
    const isEven = sectorIndex % 2 === 0;
    return ring.includes("triple") || ring.includes("double")
      ? isEven
        ? "#dc2626"
        : "#16a34a"
      : isEven
      ? "#fef7cd"
      : "#1f2937";
  };

  const getNumberPosition = (sectorIndex: number) => {
    const angle = sectorIndex * 18 - 90;
    const angleRad = (angle * Math.PI) / 180;
    const radius = 320;
    return {
      x: 350 + radius * Math.cos(angleRad),
      y: 350 + radius * Math.sin(angleRad),
    };
  };

  return (
    <div className={`dart-board-wrapper ${disabled ? "disabled" : ""}`}>
      <div className="dart-board-svg">
        <svg ref={svgRef} width="700" height="700" viewBox="0 0 700 700">
          <circle
            cx="350"
            cy="350"
            r="290"
            fill="#2d3748"
            stroke="#ffffff"
            strokeWidth="4"
          />

          {["double", "single-outer", "triple", "single-inner"].map((ring) =>
            sectors.map((sector, index) => {
              const multiplier = ring.includes("double")
                ? "double"
                : ring.includes("triple")
                ? "triple"
                : "single";
              const isHovered =
                hoveredSector?.sector === sector &&
                hoveredSector?.multiplier === multiplier;
              return (
                <path
                  key={`${ring}-${sector}`}
                  d={generateSectorPath(index, ring as any)}
                  fill={getSectorColor(index, ring, isHovered)}
                  stroke="#ffffff"
                  strokeWidth="1"
                  className="sector-clickable"
                  onClick={(e) =>
                    handleThrow(
                      sector,
                      multiplier,
                      sector *
                        (multiplier === "double"
                          ? 2
                          : multiplier === "triple"
                          ? 3
                          : 1),
                      e
                    )
                  }
                  onMouseEnter={() => setHoveredSector({ sector, multiplier })}
                  onMouseLeave={() => setHoveredSector(null)}
                />
              );
            })
          )}

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
                fontSize={isHovered ? "28" : "24"}
                fontWeight="bold"
                className="sector-number"
                style={{
                  pointerEvents: "none",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                  transition: "font-size 0.15s ease-out",
                }}
              >
                {sector}
              </text>
            );
          })}

          <circle
            cx="350"
            cy="350"
            r="35"
            fill={
              hoveredSector?.sector === 25 &&
              hoveredSector?.multiplier === "single"
                ? "#fbbf24"
                : "#dc2626"
            }
            stroke="#ffffff"
            strokeWidth="2"
            className="sector-clickable"
            onClick={(e) => handleThrow(25, "single", 25, e)}
            onMouseEnter={() =>
              setHoveredSector({ sector: 25, multiplier: "single" })
            }
            onMouseLeave={() => setHoveredSector(null)}
          />
          <circle
            cx="350"
            cy="350"
            r="15"
            fill={
              hoveredSector?.sector === 25 &&
              hoveredSector?.multiplier === "double"
                ? "#fbbf24"
                : "#16a34a"
            }
            stroke="#ffffff"
            strokeWidth="2"
            className="sector-clickable"
            onClick={(e) => handleThrow(25, "double", 50, e)}
            onMouseEnter={() =>
              setHoveredSector({ sector: 25, multiplier: "double" })
            }
            onMouseLeave={() => setHoveredSector(null)}
          />

          {lastThrowPosition && (
            <g className="dart-marker">
              <circle
                cx={lastThrowPosition.x}
                cy={lastThrowPosition.y}
                r="10"
                fill="yellow"
                stroke="black"
                strokeWidth="2"
              />
              <circle
                cx={lastThrowPosition.x}
                cy={lastThrowPosition.y}
                r="2"
                fill="black"
              />
            </g>
          )}
        </svg>
      </div>

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
          <div className="sector-indicator-placeholder">Наведите на сектор</div>
        )}
      </div>
    </div>
  );
};
