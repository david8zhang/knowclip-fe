import React from 'react'
import Authentication from '../../util/Authentication/Authentication'
import firebase from 'firebase';

/** Components */
import { VideoList, HoverTrigger, SideWindow } from '../reusable';

import * as api from '../../api';
import * as utils from '../../util/ClipProcessing'

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
      data: {}
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
      let clips = utils.sortClips(res.data.data, state.clipsToShow)
      this.setState({ clips })
    })
  }
  
  componentWillUpdate(nextProps, nextState) {
    if (nextState.numClips && nextState.clipsToShow && nextState.auth && !nextState.clips) {
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
        console.log('config', config)
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

  renderSelectedVideo() {
    if (!this.state.selectedHighlight) {
      return <div />
    }
    return (
      <SideWindow
        style={{ display: 'flex', flexDirection: 'column' }}
        onClose={() => this.setState({ selectedHighlight: null })}
      >
        <div style={{ flex: 4 }}>
          <embed
            height='100%'
            width='100%'
            type='video/mp4'
            src={this.state.selectedHighlight}
          />
        </div>
        <div className='thumbsSection'>
          <i
            onClick={() => {
              if (this.state.thumbState === 'up') {
                this.setState({ thumbState: null })
              } else {
                this.setState({ thumbState: 'up' })
              }
            }}
            className='fas fa-thumbs-up'
            style={{
              cursor: 'pointer',
              margin: 10,
              color: this.state.thumbState === 'up' ? 'green' : '#ddd'
            }}
          />
          <i
            onClick={() => {
              if (this.state.thumbState === 'down') {
                this.setState({ thumbState: null })
              } else {
                this.setState({ thumbState: 'down' })
              }
            }}
            className='fas fa-thumbs-down'
            style={{
              cursor: 'pointer',
              margin: 10,
              color: this.state.thumbState === 'down' ? 'red' : '#ddd'
            }}
          />
        </div>
      </SideWindow>
    )
  }

  renderHighlightsBar() {
    if (this.state.selectedHighlight) {
      return <div />
    }
    return (
      <HoverTrigger
        showing={this.state.showing}
      >
        <h3 style={{ color: 'white', margin: '5px' }}>
          Recent Highlights
        </h3>
        {
          this.state.clips &&
          <VideoList
            videos={this.state.clips}
            onClick={(v) => {
              this.setState({
                selectedHighlight: v.embed_url,
                showing: false
              })
            }}
          />
        }
      </HoverTrigger>
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

  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      return (
        <div className="App">
          <div style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 500 }}>
            { this.renderAlert() }
            { this.renderSelectedVideo() }
            { this.renderHighlightsBar() }
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

