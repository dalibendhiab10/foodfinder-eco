import React from 'react';

const PlaceholderSvg1: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 150"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="10" y="10" width="180" height="130" rx="10" ry="10" fill="#e0f2fe" />
    <circle cx="100" cy="75" r="40" fill="#38bdf8" />
    <path d="M70 75 L100 105 L130 75 Z" fill="#0ea5e9" />
    <text x="100" y="135" textAnchor="middle" fontSize="12" fill="#64748b">Placeholder SVG 1</text>
  </svg>
);

export default PlaceholderSvg1;