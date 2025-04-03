import React from 'react';

const PlaceholderSvg3: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <rect x="10" y="10" width="180" height="130" rx="10" ry="10" fill="#fef3c7" />
    <polygon points="100,35 125,75 100,115 75,75" fill="#facc15" />
    <circle cx="100" cy="75" r="15" fill="#eab308" />
    <text x="100" y="135" textAnchor="middle" fontSize="12" fill="#64748b">Placeholder SVG 3</text>
  </svg>
);

export default PlaceholderSvg3;