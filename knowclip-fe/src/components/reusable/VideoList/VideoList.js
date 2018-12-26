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
            const url = v.thumbnail_url;
            const highlightUrl = `${url.slice(0, url.indexOf('-preview'))}.mp4`;
            const { title, creator_name, view_count } = v;
            const payload = {
              title,
              highlightUrl,
              creator_name,
              view_count
            }
            return (
              <Video
                video={v}
                onClick={() => this.props.onClick(payload)}
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

