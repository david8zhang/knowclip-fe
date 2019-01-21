import React from 'react';
import { Colors } from '../../../constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import './clip.css';

export const Clip = ({ clip, icon, onClick }) => {
  const getVideoFile = (url) => `${url.slice(0, url.indexOf('-preview'))}.mp4`;
  return (
    <div className='clipWrapper'>
      <FontAwesomeIcon
        onClick={onClick}
        icon={icon === 'close' ? faTimes : faPlus}
        style={{
          color: icon === 'close' ? Colors.red : Colors.green,
          fontSize: '15px',
          marginBottom: '10px',
          cursor: 'pointer',
          float: 'right'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <p className='clipTitle'>
            {clip.title}
          </p>
          <p className='clipCreator'>
            { clip.creator_name }
          </p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <p className='clipCreator'>
            { clip.view_count } Views
          </p>
        </div>
      </div>
      <video
        key={getVideoFile(clip.thumbnail_url)}
        width='220px'
        controls
      >
        <source src={getVideoFile(clip.thumbnail_url)} type='video/mp4' />
      </video>
    </div>
  )
}