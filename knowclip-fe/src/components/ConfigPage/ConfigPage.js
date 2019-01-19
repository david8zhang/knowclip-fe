import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

/** Reusable components */
import { Button, Banner } from '../reusable';

/** Configuration Sections */
import { ClipSettings } from './components/ClipSettings';
import { LayoutSettings } from './components/LayoutSettings';

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
            limit: 'No Limit',
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
      configApi.getConfig(userId).then((config) => {
        if (config) {
          this.setState({
            limit: config.limit,
            sortBy: config.sortBy,
            resizing: config.resizing,
            dragging: config.dragging
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

    saveConfig() {
      const { limit, sortBy, resizing, dragging, userId } = this.state
      const newConfig = {
        limit,
        sortBy,
        resizing,
        dragging
      }
      this.setState({ finishedLoading: false })
      configApi.updateOrCreateConfig({ config: newConfig, broadcasterId: userId })
        .then(() => {
          console.log('Successfully updated configuration!');
          this.setState({
            finishedLoading: true,
            successBanner: 'Successfully updated configuration!'
          })
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

    render() {
        const setConfig = (key, value) => this.setState({ [key]: value });
        if (this.state.finishedLoading && this.Authentication.isModerator()) {
            return(
                <div style={{ height: '100%' }}>
                  { this.renderAlertBanner() }
                  <div className="Config">
                    <ClipSettings
                      defaultValues={{
                        sortBy: this.state.sortBy,
                        limit: this.state.limit
                      }}
                      setConfig={setConfig}
                    />
                    <LayoutSettings
                      defaultValues={{
                        dragging: this.state.dragging,
                        resizing: this.state.resizing
                      }}
                      setConfig={setConfig}
                    />
                    <Button
                      style={{ marginTop: '30px' }}
                      buttonText='Save Settings'
                      onClick={() => this.saveConfig()}
                    />
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