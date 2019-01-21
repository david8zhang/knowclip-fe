import React, { Component } from 'react'

/** Components */
import { Clip, Button, HelpIcon } from '../../../reusable';

import * as api from '../../../../api';
import './clip-picker.css';

class ClipPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenClips: []
    }
  }

  componentDidMount() {
    api.getClips({ channelId: this.props.channelId }).then((res) => {
      let clips = res.data.data
      if (this.props.defaultChosen) {
        this.setState({
          chosenClips: clips.filter((c) => this.props.defaultChosen.indexOf(c.id) !== -1)
        })
        clips = clips.filter((c) => this.props.defaultChosen.indexOf(c.id) === -1);
      }
      if (this.props.hidden) {
        clips = clips.filter((c) => this.props.hidden.indexOf(c.id) === -1)
      }
      this.setState({ clips })
    })
  }

  renderChosenClips() {
    let clips;
    if (this.state.chosenClips.length === 0) {
      clips = (
        <div className='placeholder'>
          <p>No clips added yet.</p>
        </div>
      )
    } else {
      clips = this.state.chosenClips.map((clip) => {
        return (
          <Clip
            clip={clip}
            icon='close'
            onClick={() => {
              const newAdded = this.state.chosenClips.filter((c) => c.id !== clip.id);
              const newClips = this.state.clips.concat(clip);
              this.setState({
                chosenClips: newAdded,
                clips: newClips
              })
            }}
          />
        )
      })
    }
    return (
      <div>
        { clips }
      </div>
    )
  }

  renderUnchosenClips() {
    if (!this.state.clips || this.state.clips.length === 0) {
      return (
        <div className='placeholder'>
          <p>No clips available to choose.</p>
        </div>
      )
    }
    const clips = this.state.clips.map((clip) => {
      return (
        <Clip
          key={clip.id}
          clip={clip}
          icon='add'
          onClick={() => {
            const newClips = this.state.clips.filter((c) => c.id !== clip.id);
            const newAdded = this.state.chosenClips.concat(clip);
            this.setState({
              chosenClips: newAdded,
              clips: newClips
            })
          }}
        />
      )
    })
    return (
      <div>
        { clips }
      </div>
    )
  }
  render() {
    return (
      <div className={`clipPickerWrapper ${this.props.theme === 'dark' ? 'pickerDark' : 'pickerLight'}`}>
        <p className='clipPickerTitle'>
          {this.props.title}
          <HelpIcon helpText={this.props.helpText} />
        </p>
        { this.renderChosenClips() }
        <p className='clipPickerTitle'>
          Your Clips
          <HelpIcon helpText='These are the clips you can choose from to add' />
        </p>
        { this.renderUnchosenClips() }
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '20px' }}>
          <Button
            buttonText='Save Settings'
            onClick={() => this.props.saveSettings(this.state.chosenClips)}
          />
        </div>
      </div>
    )
  }
}

export default ClipPicker;
