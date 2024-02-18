import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import "./Card.css"

interface CardProps {
  packagee: Package;
  icon: IconDefinition;
  onClick: () => void;
  selected: boolean;
}

const Card: React.FC<CardProps> = ({ packagee, icon, onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      className={`card ${selected ? 'selected' : ''} `}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <FontAwesomeIcon icon={icon} style={{ marginRight: '10px', fontWeight: 'thin' }} />
      <div>
        <b>{packagee.name}</b>
        <h6 style={{ margin: '0' }}>{packagee.headline}</h6>
      </div>
    </div>
  );
}

export default Card;

interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  license: string;
  created_at: string;
  headline: string;
  dependencies: string;
  imports: string;
  authors: string;
}
