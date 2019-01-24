import React from 'react';
import './video-title.css';

export const VideoTitle = ({ title, subtitle, views }) => {
  let numViews = parseInt(views, 10);
  let truncViews = views;
  if (numViews > 1000) {
    truncViews = `${parseFloat((numViews / 1000).toFixed(1))}K`
  }
  if (numViews > 1000000) {
    truncViews = `${parseFloat((numViews / 1000000).toFixed(1))}M`
  }
  return (
    <div className='videoTitleWrapper'>
      <div className='videoInfo'>
        <p className='videoTitle'>{title}</p>
        <p className='videoSubtitle'>{subtitle}</p>
      </div>
      <div className='videoViews'>
        <p className='views'>{truncViews} Views</p>
      </div>
    </div>
  )
}