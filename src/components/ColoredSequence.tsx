
import React from 'react';
import { getBaseClass } from '@/utils/dnaUtils';

interface ColoredSequenceProps {
  sequence: string;
  className?: string;
}

const ColoredSequence: React.FC<ColoredSequenceProps> = ({ sequence, className = '' }) => {
  return (
    <div className={`dna-sequence ${className}`}>
      {sequence.split('').map((base, index) => (
        <span key={index} className={getBaseClass(base)}>
          {base}
        </span>
      ))}
    </div>
  );
};

export default ColoredSequence;
