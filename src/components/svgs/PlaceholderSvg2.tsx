import React from 'react';

const PlaceholderSvg2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <rect x="10" y="10" width="180" height="130" rx="10" ry="10" fill="#dcfce7" />
    <rect x="60" y="45" width="80" height="60" rx="5" fill="#4ade80" />
    <line x1="60" y1="75" x2="140" y2="75" stroke="#16a34a" strokeWidth="4" />
    <text x="100" y="135" textAnchor="middle" fontSize="12" fill="#64748b">Placeholder SVG 2</text>
  </svg>
);

export default PlaceholderSvg2;