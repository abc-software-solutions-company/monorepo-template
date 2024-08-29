import { FC, SVGAttributes } from 'react';

const Logo: FC<SVGAttributes<Record<string, unknown>>> = ({ width = 44, className, fill = '#22c55e' }) => {
  return (
    <svg fill="none" viewBox="0 0 225 225" width={width} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M167.079 222.592C162.606 197.897 153.063 161.734 129.095 135.21C118.434 123.415 105.774 113.856 94.1411 103.121C82.5085 92.3871 71.63 80.0339 66.0829 64.8521C66.0829 64.8521 68.0529 91.8617 98.7591 119.503C125.817 143.86 145.541 177.025 149.613 224.813C135.005 225.587 119.587 223.944 107.655 220.137C18.555 191.701 4.30508 98.3565 59.8121 0C63.4171 18.8506 80.4114 32.0914 97.812 39.5623C115.218 47.0332 134.215 50.6435 150.747 59.9327C178.445 75.4959 196.343 106.614 198.6 138.7C200.768 169.528 188.55 200.835 167.079 222.592Z"
        fill={fill}
      />
    </svg>
  );
};

export default Logo;
