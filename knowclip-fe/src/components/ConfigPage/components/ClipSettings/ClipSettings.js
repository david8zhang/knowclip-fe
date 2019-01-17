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
        <SettingSection title='Sort Clips By'>
          <CheckboxSelector
            setValue={(value) => console.log('Value!', value)}
            inputs={['Most Recent', 'Most Views']}
          />
        </SettingSection>
        <SettingSection title='Limit Number of Clips'>
          <CheckboxSelector
            setValue={(value) => console.log('Value!', value)}
            inputs={['0', '5', '10', '20', 'No Limit']}
          />
        </SettingSection>
        <SettingSection title='Custom Featured Clips'>
          <Button
            buttonText='Edit Featured Clips'
            onClick={() => console.log('Edited featured clips')}
          />
        </SettingSection>
        <SettingSection title='Hidden Clips'>
          <Button
            buttonText='Edit Hidden Clips'
            onClick={() => console.log('Edited hidden clips')}
          />
        </SettingSection>
      </div>
    )
  }
}

export default ClipSettings;