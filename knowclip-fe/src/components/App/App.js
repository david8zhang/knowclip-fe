import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Authentication from '../../util/Authentication/Authentication'
import firebase from 'firebase';

/** Components */
import { VideoList, HoverTrigger, SideWindow, ShareWrapper } from '../reusable';

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
      clips: [],
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

  connectWebsocket() {
    const anomalyRef = firebase.database().ref('anomalies');
    anomalyRef.on('value', (res) => {
      let data = res.val();
      if (!data) {
        data = {}
      }
      if (Object.keys(this.state.data).length !== 0 && (Object.keys(data).length !== Object.keys(this.state.data).length)) {
        this.setState({
          alertMessage: "We've noticed a lull in the activity. Wanna see a highlight?"
        })
      }
      this.setState({ data });
    })
  }

  componentDidMount() {
    this.connectWebsocket();
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        api.getClips(auth).then((res) => {
          let clips = res.data.data
          console.log('Clips', clips)
          this.setState({ clips })
        })
        this.Authentication.setToken(auth.token, auth.userId)
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
        <VideoList
          videos={this.state.clips}
          onClick={(v) => {
            this.setState({
              selectedHighlight: v.embed_url,
              showing: false
            })
          }}
        />
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

