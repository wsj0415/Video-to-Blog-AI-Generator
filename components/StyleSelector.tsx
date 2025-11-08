
import React from 'react';
import { BlogStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: BlogStyle;
  onStyleChange: (style: BlogStyle) => void;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, disabled }) => {
  return (
    <div className="w-full">
      <label htmlFor="blog-style" className="block mb-2 text-sm font-medium text-gray-300">
        Writing Style
      </label>
      <select
        id="blog-style"
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value as BlogStyle)}
        disabled={disabled}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {Object.values(BlogStyle).map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
    </div>
  );
};
   