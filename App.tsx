
import React, { useState, useMemo, FC } from 'react';

// --- Constants for Visualization ---
const SVG_WIDTH = 400;
const SVG_HEIGHT = 400;
const PADDING = 40;
const MAX_DIM = SVG_WIDTH - PADDING * 2;
const STROKE_WIDTH = 2;

// --- Helper Component: RightAngleIcon ---
const RightAngleIcon: FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <path
    d={`M ${x} ${y - size} L ${x + size} ${y - size} L ${x + size} ${y}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={STROKE_WIDTH / 2}
    className="text-amber-400/70"
  />
);

// --- Visualization Component ---
interface TriangleVisualizerProps {
  a: number;
  b: number;
  c: number | null;
}

const TriangleVisualizer: FC<TriangleVisualizerProps> = ({ a, b, c }) => {
  const isValid = a > 0 && b > 0;
  
  const scale = isValid ? MAX_DIM / Math.max(a, b) : 0;
  const visualB = b * scale; // horizontal side
  const visualA = a * scale; // vertical side

  const p1 = { x: PADDING, y: SVG_HEIGHT - PADDING }; // Right angle corner
  const p2 = { x: PADDING + visualB, y: SVG_HEIGHT - PADDING };
  const p3 = { x: PADDING, y: SVG_HEIGHT - PADDING - visualA };

  const pathData = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`;

  const hypotenuseMidpoint = {
    x: (p2.x + p3.x) / 2,
    y: (p2.y + p3.y) / 2,
  };

  const angle = (Math.atan2(p3.y - p2.y, p3.x - p2.x) * 180) / Math.PI;

  const formattedC = c?.toFixed(2) ?? '';

  return (
    <div className="flex items-center justify-center p-4">
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto max-w-sm drop-shadow-lg">
        {isValid && (
          <>
            <path d={pathData} className="fill-cyan-500/10 stroke-cyan-400" strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
            
            <RightAngleIcon x={p1.x} y={p1.y} size={20} />

            <text x={PADDING / 2} y={p3.y + visualA / 2} dominantBaseline="middle" textAnchor="middle" className="fill-slate-300 font-mono text-base">
              a = {a}
            </text>
            <text x={p1.x + visualB / 2} y={p1.y + 20} dominantBaseline="middle" textAnchor="middle" className="fill-slate-300 font-mono text-base">
              b = {b}
            </text>
            <text
              x={hypotenuseMidpoint.x}
              y={hypotenuseMidpoint.y}
              transform={`rotate(${angle + 180}, ${hypotenuseMidpoint.x}, ${hypotenuseMidpoint.y})`}
              dy="-10"
              dominantBaseline="middle"
              textAnchor="middle"
              className="fill-emerald-400 font-mono text-base font-bold"
            >
              c = {formattedC}
            </text>
          </>
        )}
         {!isValid && (
            <text x={SVG_WIDTH / 2} y={SVG_HEIGHT / 2} textAnchor="middle" className="fill-slate-500 text-lg">
                Enter valid side lengths to see the triangle.
            </text>
        )}
      </svg>
    </div>
  );
};

// --- Form Input Component ---
interface InputFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: FC<InputFieldProps> = ({ id, label, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">
            {label}
        </label>
        <input
            type="number"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            min="0"
            step="any"
            className="w-full px-4 py-2 text-white bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-200"
            placeholder="e.g., 3"
        />
    </div>
);


// --- Main App Component ---
export default function App() {
  const [sideA, setSideA] = useState('3');
  const [sideB, setSideB] = useState('4');

  const { numA, numB, hypotenuse, error } = useMemo(() => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      return { numA: 0, numB: 0, hypotenuse: null, error: 'Please enter positive numbers for both sides.' };
    }

    const c = Math.sqrt(a ** 2 + b ** 2);
    return { numA: a, numB: b, hypotenuse: c, error: null };
  }, [sideA, sideB]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-gray-900 text-slate-200 font-sans">
      <main className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 sm:px-8 sm:py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Vingluj!</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Side: Controls */}
          <div className="p-4 sm:p-8 pt-0 sm:border-r border-slate-700 flex flex-col space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                <InputField 
                    id="sideA"
                    label="Length of Side a"
                    value={sideA}
                    onChange={(e) => setSideA(e.target.value)}
                />
                <InputField 
                    id="sideB"
                    label="Length of Side b"
                    value={sideB}
                    onChange={(e) => setSideB(e.target.value)}
                />
            </div>

            <div className="pt-4">
                <h2 className="text-sm font-medium text-slate-300">Longest Side (Hypotenuse c)</h2>
                <div className="mt-2 text-4xl font-bold min-h-[3rem]">
                    {error ? (
                         <p className="text-red-400 text-sm">{error}</p>
                    ) : hypotenuse !== null ? (
                        <p className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {hypotenuse.toFixed(4)}
                        </p>
                    ) : (
                         <p className="text-slate-500 text-sm">Calculation will appear here.</p>
                    )}
                </div>
                 <p className="text-sm text-slate-500 mt-2 font-mono">
                    c = &radic;(a&sup2; + b&sup2;)
                 </p>
            </div>
          </div>

          {/* Right Side: Visualization */}
          <div className="flex items-center justify-center">
             <TriangleVisualizer a={numA} b={numB} c={hypotenuse} />
          </div>
        </div>
      </main>
    </div>
  );
}
