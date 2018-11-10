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

const seedData = [{
  "id": "MushyElegantJamOSkomodo",
  "url": "https://clips.twitch.tv/MushyElegantJamOSkomodo",
  "embed_url": "https://clips.twitch.tv/embed?clip=MushyElegantJamOSkomodo",
  "broadcaster_id": "39298218",
  "broadcaster_name": "dakotaz",
  "creator_id": "101384663",
  "creator_name": "Alltheselights",
  "video_id": "",
  "game_id": "33214",
  "language": "en",
  "title": "Don't challenge bob the builder",
  "view_count": 167469,
  "created_at": "2018-01-02T12:16:18Z",
  "thumbnail_url": "https://clips-media-assets2.twitch.tv/170422327-preview-480x272.jpg"
},
{
  "id": "NastyAstutePrariedogSMOrc",
  "url": "https://clips.twitch.tv/NastyAstutePrariedogSMOrc",
  "embed_url": "https://clips.twitch.tv/embed?clip=NastyAstutePrariedogSMOrc",
  "broadcaster_id": "39298218",
  "broadcaster_name": "dakotaz",
  "creator_id": "155489089",
  "creator_name": "Sejr",
  "video_id": "",
  "game_id": "33214",
  "language": "en",
  "title": "DK's Family Friendly Stream ;)",
  "view_count": 94179,
  "created_at": "2018-05-08T07:59:53Z",
  "thumbnail_url": "https://clips-media-assets2.twitch.tv/236917222-preview-480x272.jpg"
},
{
  "id": "TransparentLaconicKleePanicBasket",
  "url": "https://clips.twitch.tv/TransparentLaconicKleePanicBasket",
  "embed_url": "https://clips.twitch.tv/embed?clip=TransparentLaconicKleePanicBasket",
  "broadcaster_id": "39298218",
  "broadcaster_name": "dakotaz",
  "creator_id": "28194986",
  "creator_name": "MantuxTV",
  "video_id": "",
  "game_id": "33214",
  "language": "en",
  "title": "Failed win",
  "view_count": 91542,
  "created_at": "2017-11-06T12:46:07Z",
  "thumbnail_url": "https://clips-media-assets2.twitch.tv/147922292-preview-480x272.jpg"
},
{
  "id": "PlacidMildPepperJonCarnage",
  "url": "https://clips.twitch.tv/PlacidMildPepperJonCarnage",
  "embed_url": "https://clips.twitch.tv/embed?clip=PlacidMildPepperJonCarnage",
  "broadcaster_id": "39298218",
  "broadcaster_name": "dakotaz",
  "creator_id": "197756292",
  "creator_name": "Hawki72",
  "video_id": "",
  "game_id": "33214",
  "language": "en",
  "title": "HAHAHAHAHAHA",
  "view_count": 67243,
  "created_at": "2018-04-02T10:19:50Z",
  "thumbnail_url": "https://clips-media-assets2.twitch.tv/218206067-preview-480x272.jpg"
},
{
  "id": "KitschyClearCodUWot",
  "url": "https://clips.twitch.tv/KitschyClearCodUWot",
  "embed_url": "https://clips.twitch.tv/embed?clip=KitschyClearCodUWot",
  "broadcaster_id": "39298218",
  "broadcaster_name": "dakotaz",
  "creator_id": "23648822",
  "creator_name": "eRaInferno",
  "video_id": "",
  "game_id": "33214",
  "language": "en",
  "title": "DK finds the worst player ever",
  "view_count": 59313,
  "created_at": "2018-04-10T14:37:26Z",
  "thumbnail_url": "https://clips-media-assets2.twitch.tv/222676874-preview-480x272.jpg"
}]

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
          if (Object.keys(clips).length === 0) {
            clips = seedData
          }
          this.setState({ clips })
          console.log('Clips', clips);
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
          <iframe
            frameBorder="0"
            height='100%'
            width='100%'
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

  renderMockStream() {
    return (
      <div style={{ 
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: '0',
        left: '0',
        zIndex: 0
      }}>
        <iframe
          src="https://player.twitch.tv/?channel=broadcasterroyale"
          height="100%"
          width="100%"
          allowFullScreen
        >
        </iframe>
      </div>
    )
  }

  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      return (
        <div className="App">
          { this.renderMockStream() }
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

