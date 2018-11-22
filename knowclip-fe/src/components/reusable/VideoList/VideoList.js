import React from 'react'
import './video-list.css'

export default class VideoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showVideoInfo: false
    }
  }
  render() {
    return (
      <div className='videoList'>
        {
          this.props.videos.map((v) => {
            return (
              <Video
                video={v}
                onClick={() => this.props.onClick(v)}
              />
            )
          })
        }
      </div>
    )
  }
}

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div
        className='videoWrapper'
        onClick={this.props.onClick}
        onMouseEnter={() => this.setState({ showVideoInfo: true })}
        onMouseLeave={() => this.setState({ showVideoInfo: false })}
      >
        {
          this.state.showVideoInfo &&
          <div className='videoOverlay'>
            <p className='title'>
              { this.props.video.title }
            </p>
            <p className='creator'>
              { this.props.video.creator_name }
            </p>
          </div>
        }
        <div style={{ width: '100%', height: '100%' }}>
          <img
            src={this.props.video.thumbnail_url}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    )
  }
}

