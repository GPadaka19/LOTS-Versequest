import React from 'react';

const colors = [
  { name: 'Base', key: 'base', hex: '#2C201B' },
  { name: 'Primary', key: 'primary', hex: '#F5F1E9' },
  { name: 'Secondary', key: 'secondary', hex: '#44362E' },
  { name: 'Accent', key: 'accent', hex: '#EAA91D' },
  { name: 'Extra Accent', key: 'extraAccent', hex: '#2B3322' },
  { name: 'Secondary Accent', key: 'secondaryAccent', hex: '#1B1310' },
];

const colorClasses: Record<string, string> = {
  base: 'bg-base',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  extraAccent: 'bg-extraAccent',
  secondaryAccent: 'bg-secondaryAccent',
};

const ColorGuide: React.FC = () => {
  return (
    <div className="bg-gray-500 min-h-screen flex flex-col items-center justify-center text-base py-12">
      <h1 className="text-3xl font-bold mb-8">Color Guide</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {colors.map((color) => (
          <div key={color.key} className="flex flex-col items-center">
            <div
              className={`w-32 h-32 rounded-lg shadow-lg border-4 border-secondary mb-4 ${colorClasses[color.key]}`}
            ></div>
            <span className="font-semibold text-lg capitalize">{color.name}</span>
            <span className="text-sm text-secondary">{color.hex}</span>
            <span className="text-xs text-accent mt-1">{colorClasses[color.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorGuide; 