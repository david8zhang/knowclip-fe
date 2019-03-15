import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../../constants/colors';
import './video-list.css'

export default class VideoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showVideoInfo: false
    }
  }

  processVideoConfig() {
    const featuredVideos = []
    const regularVideos = [];
    let filteredVideos = this.props.videos;
    if (this.props.hiddenIds) {
      filteredVideos = this.props.videos.filter((c) => {
        return this.props.hiddenIds.indexOf(c.id) === -1
      })
    }
    filteredVideos.forEach((v) => {
      if (this.props.featuredIds && this.props.featuredIds.indexOf(v.id) !== -1) {
        featuredVideos.push(v);
      } else {
        regularVideos.push(v);
      }
    })
    regularVideos.sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return bTime - aTime
    })
    if (this.props.sortBy === 'Most Views') {
      regularVideos.sort((a, b) => b.view_count - a.view_count);
    }
    return { featuredVideos, regularVideos }
  }

  render() {
    const { featuredVideos, regularVideos } = this.processVideoConfig();
    return (
      <div className='videoList'>
        {
          featuredVideos.map((v) => {
            const url = v.thumbnail_url;
            const highlightUrl = `${url.slice(0, url.indexOf('-preview'))}.mp4`;
            const { title, creator_name, view_count, id } = v;
            const payload = {
              title,
              highlightUrl,
              creator_name,
              view_count,
              clip_id: id
            }
            return (
              <Video
                isFeatured
                key={highlightUrl}
                video={v}
                onClick={() => this.props.onClick(payload)}
              />
            )
          })
        }
        {
          regularVideos.map((v) => {
            const url = v.thumbnail_url;
            const highlightUrl = `${url.slice(0, url.indexOf('-preview'))}.mp4`;
            const { title, creator_name, view_count, id } = v;
            const payload = {
              title,
              highlightUrl,
              creator_name,
              view_count,
              clip_id: id
            }
            return (
              <Video
                key={highlightUrl}
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
              {
                this.props.isFeatured &&
                <FontAwesomeIcon
                  icon={faStar}
                  style={{
                    color: Colors.blue,
                    fontSize: '12px',
                    marginRight: '5px'
                  }}
                />
              }
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

