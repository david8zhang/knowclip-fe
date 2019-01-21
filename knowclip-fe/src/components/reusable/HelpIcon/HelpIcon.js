import React from 'react';
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export const HelpIcon = ({ helpText }) => {
  const id = `${Date.now()}`;
  return (
    <div style={{ display: 'inline' }}>
      <a data-tip={id} data-for={id}>
        <FontAwesomeIcon
          style={{ fontSize: '15px', color: '#555', marginLeft: '10px', cursor: 'pointer' }}
          icon={faQuestionCircle}
        />
      </a>
      <ReactTooltip
        id={id}
        type='info'
        place='right'
      >
        <p style={{ fontFamily: 'Avenir', fontSize: '10px', fontWeight: 'unset' }}>
          { helpText }
        </p>
      </ReactTooltip>
    </div>
  )
}
