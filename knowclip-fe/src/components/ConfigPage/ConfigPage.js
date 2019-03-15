import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

/** Reusable components */
import Modal from 'react-modal';
import { Button, Banner } from '../reusable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/** Configuration Sections */
import { ClipSettings } from './components/ClipSettings';
import { LayoutSettings } from './components/LayoutSettings';
import { ClipPicker } from './components/ClipPicker';

/** APIs */
import * as configApi from '../../api/configHandler';

import './Config.css'

export default class ConfigPage extends React.Component{
    constructor(props){
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state={
            finishedLoading:false,
            theme:'light',
            resizing: true,
            dragging: true,
            clipLimit: 'No Limit',
            sortBy: 'Most Recent'
        }
    }

    contextUpdate(context, delta){
        if (delta.includes('theme')) {
            this.setState(()=>{
                return {
                  theme:context.theme
                }
            })
        }
    }

    componentDidMount(){
        // do config page setup as needed here
        if(this.twitch){
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                this.setState({ auth });
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
    
                    this.fetchConfig(auth.channelId);
                }
            })
    
            this.twitch.onContext((context,delta)=>{
                this.contextUpdate(context,delta)
            })
        }
    }

    fetchConfig(userId) {
      configApi.getConfig(userId, this.state.auth.token).then((config) => {
        if (config) {
          this.setState({
            clipLimit: config.clipLimit,
            sortBy: config.sortBy,
            resizing: config.resizing,
            dragging: config.dragging,
            defaultFeaturedClips: config.featuredClips,
            defaultHiddenClips: config.hiddenClips
          })
        }
        this.setState({
          finishedLoading:true,
          userId: userId
        })
      }).catch((err) => {
        Promise.reject(err);
      })
    }

    saveFeaturedClips(featuredClips) {
      const featuredClipIds = featuredClips.map((c) => c.id);
      this.setState({ finishedLoading: false });
      configApi.updateFeaturedClips({
        featuredClips: featuredClipIds,
        broadcasterId: this.state.userId,
        token: this.state.auth.token
      })
        .then(() => {
          this.setState({
            finishedLoading: true,
            successBanner: 'Successfully updated featured clips',
            showFeatured: false,
            defaultFeaturedClips: featuredClipIds
          })
          setTimeout(() => {
            this.setState({ successBanner: null })
          }, 2000)
        })
        .catch((err) => {
          console.error(err);
          Promise.reject(err);
          this.setState({
            finishedLoading: true,
            errorBanner: 'An error occured',
            showFeatured: false
          })
          setTimeout(() => {
            this.setState({ errorBanner: null })
          }, 2000)
        })
    }

    saveHiddenClips(hiddenClips) {
      const hiddenClipIds = hiddenClips.map((c) => c.id);
      this.setState({ finishedLoading: false });
      configApi.updateHiddenClips({
        hiddenClips: hiddenClipIds,
        broadcasterId: this.state.userId,
        token: this.state.auth.token
      })
        .then(() => {
          this.setState({
            finishedLoading: true,
            successBanner: 'Successfully updated hidden clips',
            showHidden: false,
            defaultHiddenClips: hiddenClipIds
          })
          setTimeout(() => {
            this.setState({ successBanner: null })
          }, 2000)
        })
        .catch((err) => {
          console.error(err);
          Promise.reject(err);
          this.setState({
            finishedLoading: true,
            errorBanner: 'An error occured',
            showHidden: false
          })
          setTimeout(() => {
            this.setState({ errorBanner: null })
          }, 2000)
        })
    }

    saveConfig() {
      const { clipLimit, sortBy, resizing, dragging, userId } = this.state
      const newConfig = {
        clipLimit,
        sortBy,
        resizing,
        dragging
      }
      this.setState({ finishedLoading: false })
      configApi.updateOrCreateConfig({
        config: newConfig,
        broadcasterId: userId,
        token: this.state.auth.token
      })
        .then(() => {
          console.log('Successfully updated configuration!');
          this.setState({
            finishedLoading: true,
            successBanner: 'Successfully updated configuration!'
          })
          setTimeout(() => {
            this.setState({ successBanner: null })
          }, 2000)
        })
        .catch((err) => {
          console.error('Error!', err);
          Promise.reject(err);
        })
    }

    renderAlertBanner() {
      if (this.state.successBanner) {
        return (
          <Banner
            type='success'
            text={this.state.successBanner}
            onClose={() => this.setState({ successBanner: null })}
          />
        )
      } else if (this.state.errorBanner) {
        return (
          <Banner
            type='error'
            text={this.state.errorBanner}
            onClose={() => this.setState({ errorBanner: null })}
          />
        )
      }
    }

    renderFeaturedClips() {
      return (
        <Modal
          style={{
            content: {
              backgroundColor: this.state.theme === 'dark' ? 'black' : 'white'
            }
          }}
          isOpen={this.state.showFeatured}
        >
          <FontAwesomeIcon
            style={{
              color: '#aaa',
              fontSize: '18px',
              cursor: 'pointer'
            }}
            icon={faTimes}
            onClick={() => this.setState({ showFeatured: false })}
          />
          <ClipPicker
            theme={this.state.theme}
            title='Featured Clips'
            helpText='Choose clips you want to feature. These will appear at the top!'
            defaultChosen={this.state.defaultFeaturedClips}
            hidden={this.state.defaultHiddenClips}
            channelId={this.state.userId}
            saveSettings={(featuredClips) => {
              this.saveFeaturedClips(featuredClips);
            }}
          />
        </Modal>
      )
    }

    renderHiddenClips() {
      return (
        <Modal
          style={{
            content: {
              backgroundColor: this.state.theme === 'dark' ? 'black' : 'white'
            }
          }}
          isOpen={this.state.showHidden}
        >
          <FontAwesomeIcon
            style={{
              color: '#aaa',
              fontSize: '18px',
              cursor: 'pointer'
            }}
            icon={faTimes}
            onClick={() => this.setState({ showHidden: false })}
          />
          <ClipPicker
            theme={this.state.theme}
            title='Hidden Clips'
            helpText='Choose clips you want to hide from your viewers (offensive, duplicates, etc.)'
            defaultChosen={this.state.defaultHiddenClips}
            hidden={this.state.defaultFeaturedClips}
            channelId={this.state.userId}
            saveSettings={(hiddenClips) => {
              this.saveHiddenClips(hiddenClips);
            }}
          />
        </Modal>
      )
    }

    render() {
        const setConfig = (key, value) => this.setState({ [key]: value });
        if (this.state.finishedLoading && this.Authentication.isModerator()) {
            return(
                <div style={{ height: '100%' }}>
                  { this.renderAlertBanner() }
                  { this.renderFeaturedClips() }
                  { this.renderHiddenClips() }
                  <div className={`Config ${this.state.theme === 'dark' ? 'Config-dark': "Config-light"}`}>
                    <ClipSettings
                      defaultValues={{
                        sortBy: this.state.sortBy,
                        clipLimit: this.state.clipLimit
                      }}
                      onFeatured={() => this.setState({ showFeatured: true })}
                      onHidden={() => this.setState({ showHidden: true })}
                      setConfig={setConfig}
                    />
                    <LayoutSettings
                      defaultValues={{
                        dragging: this.state.dragging,
                        resizing: this.state.resizing
                      }}
                      setConfig={setConfig}
                    />
                    <div
                      style={{
                        marginTop: '30px',
                        display: 'flex',
                        flexDirection: 'row-reverse'
                      }}
                    >
                      <Button
                        buttonText='Save Settings'
                        onClick={() => this.saveConfig()}
                      />
                    </div>
                  </div>
                </div>

            )
        }
        else{
            return(
                <div className="Config">
                    <div className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>
                        Loading...
                    </div>
                </div>
            )
        }
    }
} 