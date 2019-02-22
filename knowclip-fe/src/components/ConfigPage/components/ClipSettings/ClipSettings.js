import React, { Component } from 'react';
import { SettingSection, Button, CheckboxSelector } from '../../../reusable';
import './clip-settings.css';

class ClipSettings extends Component {
  render() {
    return (
      <div className='clipSettingsWrapper'>
        <p className='sectionTitle'>
          Clips Settings
        </p>
        <SettingSection
          title='Sort Clips By'
          helpText='How your clips will be ordered'
        >
          <CheckboxSelector
            theme={this.props.theme}
            defaultValue={this.props.defaultValues['sortBy']}
            setValue={(sortBy) => this.props.setConfig('sortBy', sortBy)}
            inputs={['Most Recent', 'Most Views']}
          />
        </SettingSection>
        <SettingSection
          title='Limit Number of Clips'
          helpText='Max number of clips to show'
        >
          <CheckboxSelector
            theme={this.props.theme}
            defaultValue={this.props.defaultValues['clipLimit']}
            setValue={(limit) => this.props.setConfig('clipLimit', limit)}
            inputs={[5, 10, 20, 'No Limit']}
          />
        </SettingSection>
        <SettingSection
          title='Custom Featured Clips'
          helpText='Clips you want to push to the top'
        >
          <Button
            buttonText='Edit Featured Clips'
            onClick={() => this.props.onFeatured()}
          />
        </SettingSection>
        <SettingSection
          title='Hidden Clips'
          helpText='Clips you want to hide'
        >
          <Button
            buttonText='Edit Hidden Clips'
            onClick={() => this.props.onHidden()}
          />
        </SettingSection>
      </div>
    )
  }
}

export default ClipSettings;