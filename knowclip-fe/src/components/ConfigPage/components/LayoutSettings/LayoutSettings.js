import React, { Component } from 'react';
import Toggle from 'react-toggle';
import { SettingSection } from '../../../reusable';
import './layout-settings.css';

class LayoutSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='layoutSettingWrapper'>
        <p className='sectionTitle'>
          Layout Settings
        </p>
        <SettingSection title='Enable / Disable Player Dragging'>
          <Toggle
            defaultChecked={this.props.defaultValues['dragging']}
            onChange={(e) => { this.props.setConfig('dragging', e.target.checked) }}
          />
        </SettingSection>
        <SettingSection title='Enable / Disable Player Resizing'>
          <Toggle
            defaultChecked={this.props.defaultValues['resizing']}
            onChange={(e) => { this.props.setConfig('resizing', e.target.checked) }}
          />
        </SettingSection>
      </div>
    )
  }
}

export default LayoutSettings;