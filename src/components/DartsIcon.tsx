import React from "react";

interface DartsIconProps {
  size?: number;
  className?: string;
}

export const DartsIcon: React.FC<DartsIconProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Определяем сектора для повторного использования */}
        <path id="sector" d="M 0 0 L 85 0 A 85 85 0 0 1 82.06 22.03 L 0 0 Z" />
      </defs>
      <g id="dartboard" transform="rotate(-9)">
        {/* Фоновый круг */}
        <circle cx="0" cy="0" r="100" fill="#000" />
        {/* Сектора (основные цвета - бежевый и черный) */}
        <g fill="#F0D8B6">
          <use href="#sector" transform="rotate(18)" />
          <use href="#sector" transform="rotate(54)" />
          <use href="#sector" transform="rotate(90)" />
          <use href="#sector" transform="rotate(126)" />
          <use href="#sector" transform="rotate(162)" />
          <use href="#sector" transform="rotate(198)" />
          <use href="#sector" transform="rotate(234)" />
          <use href="#sector" transform="rotate(270)" />
          <use href="#sector" transform="rotate(306)" />
          <use href="#sector" transform="rotate(342)" />
        </g>
        <g fill="#000000">
          <use href="#sector" transform="rotate(0)" />
          <use href="#sector" transform="rotate(36)" />
          <use href="#sector" transform="rotate(72)" />
          <use href="#sector" transform="rotate(108)" />
          <use href="#sector" transform="rotate(144)" />
          <use href="#sector" transform="rotate(180)" />
          <use href="#sector" transform="rotate(216)" />
          <use href="#sector" transform="rotate(252)" />
          <use href="#sector" transform="rotate(288)" />
          <use href="#sector" transform="rotate(324)" />
        </g>
        {/* Кольца удвоения и утроения (зеленый и красный) */}
        <g>
          <circle
            cx="0"
            cy="0"
            r="95"
            fill="none"
            stroke="#008000"
            strokeWidth="10"
          />
          <circle
            cx="0"
            cy="0"
            r="55"
            fill="none"
            stroke="#D92D20"
            strokeWidth="10"
          />
        </g>
        {/* Центральные круги (зеленый и красный) */}
        <circle cx="0" cy="0" r="16" fill="#008000" />
        <circle cx="0" cy="0" r="8" fill="#D92D20" />
      </g>
    </svg>
  );
};
