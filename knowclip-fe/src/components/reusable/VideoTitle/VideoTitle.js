import React from 'react';
import './video-title.css';

export const VideoTitle = ({ title, subtitle, views }) => (
  <div className='videoTitleWrapper'>
    <div className='videoInfo'>
      <p className='videoTitle'>{title}</p>
      <p className='videoSubtitle'>{subtitle}</p>
    </div>
    <div className='videoViews'>
      <p className='views'>{views} Views</p>
    </div>
  </div>
)