import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons'
import './video-title.css';

const truncateStat = (stat) => {
  if (stat > 1000) {
    return `${parseFloat((stat / 1000).toFixed(1))}K`
  }
  if (stat > 1000000) {
    return `${parseFloat((stat / 1000000).toFixed(1))}M`
  }
  return stat;
}

export const VideoTitle = ({ title, subtitle, views, likes, onLike, isLiked, isLoggedIn }) => {
  let truncViews = truncateStat(parseInt(views, 10));
  let truncLikes = truncateStat(parseInt(likes, 10));
  return (
    <div className='videoTitleWrapper'>
      <div className='videoInfo'>
        <p className='videoTitle'>{title}</p>
        <p className='videoSubtitle'>{subtitle}</p>
      </div>
      <div className='statsWrapper'>
        <div className='stats'>
          <p className='statsText'>
            {truncLikes}
          </p>
          <FontAwesomeIcon
            onClick={() => {
              if (isLoggedIn) {
                onLike(isLiked)
              }
            }}
            icon={faHeart}
            style={{
              cursor: isLoggedIn ? 'pointer' : 'default',
              flex: 1,
              color: isLiked ? 'red' : 'white'
            }}
          />
        </div>
      </div>
      <div className='statsWrapper'>
        <div className='stats'>
          <p className='statsText'>
            {truncViews}
          </p>
          <FontAwesomeIcon
            icon={faEye}
            style={{ flex: 1, color: 'white' }}
          />
        </div>
      </div>
    </div>
  )
}