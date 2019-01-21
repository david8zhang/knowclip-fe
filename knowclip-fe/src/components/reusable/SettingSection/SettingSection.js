import React from 'react'
import { HelpIcon } from '../HelpIcon';
import './setting-section.css';

export const SettingSection = ({ title, children, helpText }) => {
  return (
    <div className='sectionWrapper'>
      <div className='titleSection'>
        <p>{title}</p>
      </div>
      <div className='optionSection'>
        { children }
        <HelpIcon helpText={helpText} />
      </div>
    </div>
  )
}