import React from 'react'
import './video-list.css'

export const VideoList = ({ videos, onClick }) => {
  return (
    <div className='videoList'>
      {
        videos.map((v) => {
          return (
              <div
                className='videoWrapper'
                onClick={() => onClick(v)}
              >
                <p className='videoTitle'>
                  {v.title}
                </p>
                <div style={{ width: '100%', height: '100%' }}>
                  <img
                    src={v.thumbnail_url}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
          )
        })
      }
    </div>
  )
}

