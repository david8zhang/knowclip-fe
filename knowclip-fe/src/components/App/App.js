import React from 'react'
import Authentication from '../../util/Authentication/Authentication'
import firebase from 'firebase';

/** Components */
import { VideoList, VideoTitle, Tooltip } from '../reusable';
import { push as Menu } from 'react-burger-menu'
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt, faArrowsAltH } from '@fortawesome/free-solid-svg-icons'


import * as api from '../../api';

import './App.css'

const config = {
  apiKey: "AIzaSyCSQjPTzOyNKW7GiV3fu7DwtyOfb1bqqRs",
  authDomain: "twitch-hackathon-55882.firebaseapp.com",
  databaseURL: "https://twitch-hackathon-55882.firebaseio.com",
  projectId: "twitch-hackathon-55882",
  storageBucket: "twitch-hackathon-55882.appspot.com",
  messagingSenderId: "84835985605"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.Authentication = new Authentication()

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      data: {},
      numClips: '10',
      clipsToShow: 'Most Recent',
      numDislikes: 0,
      numLikes: 0
    }
    this.index = 0;
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return { theme: context.theme }
      })
    }
  }

  visibilityChanged(isVisible) {
    this.setState(() => {
      return {
        isVisible
      }
    })
  }

  fetchClips(state) {
    api.getClips(state.auth, state.numClips).then((res) => {
      this.setState({ clips: res.data.data })
    })
  }
  
  componentWillUpdate(nextProps, nextState) {
    if (nextState.auth && !nextState.clips) {
      this.fetchClips(nextState)
    }
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.configuration.onChanged(() => {
        let config = this.twitch.configuration.broadcaster ? this.twitch.configuration.broadcaster.content : null
        try {
          config = JSON.parse(config)
        } catch (e) {
          console.error('Error', e)
        }
        if (config) {
          this.setState({
            numClips: config.numClips,
            clipsToShow: config.clipsToShow
          })
        }
      })

      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId)
        this.setState({ auth })
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => {
            return { finishedLoading: true }
          })
        }
      })

      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        // now that you've got a listener, do something with the result... 

        // do something...

      })

      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible)
      })

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta)
      })
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
    }
  }

  renderThumbsSection() {
    return (
      <div className='thumbsSection'>
        <div className='likesWrapper'>
          <i
            onClick={() => {
              if (this.state.thumbState === 'up') {
                this.setState({ thumbState: null })
              } else {
                this.setState({ thumbState: 'up' })
              }
            }}
            className='fas fa-thumbs-up thumbsUpIcon'
            style={{
              cursor: 'pointer',
              color: this.state.thumbState === 'up' ? '#2ecc71' : '#ddd'
            }}
          />
          <p style={{ color: this.state.thumbState === 'up' ? '#2ecc71' : '#ddd' }}>
            {this.state.numLikes}
          </p>
        </div>
        <div className='likesWrapper'>
          <i
            onClick={() => {
              if (this.state.thumbState === 'down') {
                this.setState({ thumbState: null })
              } else {
                this.setState({ thumbState: 'down' })
              }
            }}
            className='fas fa-thumbs-down thumbsDownIcon'
            style={{
              cursor: 'pointer',
              color: this.state.thumbState === 'down' ? 'red' : '#ddd'
            }}
          />
          <p style={{ color: this.state.thumbState === 'down' ? 'red' : '#ddd' }}>
            {this.state.numDislikes}
          </p>
        </div>
      </div>
    )
  }

  renderSelectedVideo() {
    if (!this.state.selectedHighlight) {
      return <div />
    }
    return (
      <ResizableBox
        className='sideWindow box'
        width={300}
        axis='both'
        minConstraints={[300, 300]}
        maxConstraints={[400, 400]}
      >
        <div style={{ display: 'flex' }}>
          <div className='handle' style={{ flex: 4, padding: '10px' }}>
            <Tooltip text='Click to drag window!'>
              <FontAwesomeIcon icon={faArrowsAlt} color='#333' />
            </Tooltip>
          </div>
          <div style={{ flex: 1, justifyContent: 'flex-end', padding: '5px 15px 0px 0px' }}>
            <p
              onClick={() => this.setState({ selectedHighlight: null })}
              className='closeIcon'
            >
              Close
            </p>
          </div>
        </div>
        <div style={{ padding: '0px 10px 10px 10px' }}>
          <VideoTitle
            title={this.state.selectedHighlight.title}
            subtitle={this.state.selectedHighlight.creator_name}
            views={this.state.selectedHighlight.view_count}
          />
          <video
            key={this.state.selectedHighlight.highlightUrl}
            height='80%'
            width='100%'
            controls
          >
            <source src={this.state.selectedHighlight.highlightUrl} type='video/mp4' />
          </video>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
            <Tooltip text='Click here to resize!'>
              <FontAwesomeIcon
                icon={faArrowsAltH}
                style={{ marginBottom: '-5px' }}
                color='#333'
              />
            </Tooltip>
          </div>
        </div>
      </ResizableBox>
    )
  }

  renderHighlightsBar() {
    return (
      <Menu
        right
        noOverlay
        outerContainerId='outerContainer'
        pageWrapId='clipTabWrapper'
        customBurgerIcon={false}
        isOpen={this.state.showing}
        onStateChange={(state) => {
          if (!state.isOpen) {
            this.setState({ showing: false })
          }
        }}
        width='226px'
      >
        <div className='sideBarWrapper'>
          <div className='header'>
            <h2>
              Recent Highlights
            </h2>
          </div>
          {
            this.state.clips &&
            <VideoList
              videos={this.state.clips}
              onClick={(selectedHighlight) => {
                this.twitch.rig.log('Selected Highlight', selectedHighlight);
                this.setState({ selectedHighlight });
              }}
            />
          }
        </div>
      </Menu>
    )
  }

  renderHighlightsTab() {
    return (
      <div
        className='clipTabWrapper'
        id='clipTabWrapper'
      >
        <div
          className={this.state.showing ? 'clipTabShowing' : 'clipTab'}
          onClick={() => this.setState({ showing: !this.state.showing })}
          style={{
            marginRight: this.state.showing ? '0px' : '-10px'
          }}
        >
          <p style={{ color: 'white' }}>
            {this.state.showing ? '>' : '<'}
          </p>
        </div>
      </div>
    )
  }

  renderAlert() {
    if (!this.state.alertMessage || this.state.selectedHighlight) {
      return <div />
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          display: 'flex'
        }}
      >
        <p style={{ textAlign: 'center', color: 'white' }}>
          { this.state.alertMessage }
        </p>
        <button
          style={{ marginLeft: '5px' }}
          onClick={() => {
            const { embed_url } = this.state.clips[this.index % this.state.clips.length]
            this.index += 1
            this.setState({
              showHighlightBar: true,
              alertMessage: null,
              selectedHighlight: embed_url
            })
          }}
        >
          Yes
        </button>
        <button
          style={{ marginLeft: '5px' }}
          onClick={() => {
            this.setState({ alertMessage: null })
          }}
        >
          No
        </button>
      </div>
    )
  }

  renderPlaceholderTiles() {
    const divs = [];
    for (let i = 0; i < 10; i++) {
      divs.push(
        <div
          key={`a${i}`}
          data-grid={{ x: 0, y: 0, w: 10, h: 10 }}
        />
      )
    }
    return divs;
  }

  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      return (
        <div className="App">
          <div
            id='outerContainer'
            style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 500 }}
          >
            { this.renderAlert() }
            <div style={{ display: 'flex', alignItems: 'row', height: '100%' }}>
              <div style={{ flex: 5, paddingTop: '100px', paddingBottom: '100px' }}>
                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                  <Draggable
                    bounds="parent"
                    defaultPosition={{ x:0, y: 0 }}
                    scale={1}
                    position={null}
                    handle='.handle'
                  >
                    <div style={{ width: '300px' }}>
                      { this.renderSelectedVideo() }
                    </div>
                  </Draggable>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                { this.renderHighlightsBar() }
                { this.renderHighlightsTab() }
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="App">
          <p>Loading...</p>
        </div>
      )
    }
  }
}

