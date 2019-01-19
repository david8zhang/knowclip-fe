import React, { Component } from 'react';
import './checkbox-selector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';

class CheckboxSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionSelected: props.defaultValue
    }
  }
  renderInputs() {
    if (this.props.inputs) {
      return this.props.inputs.map((value) => {
        return (
          <div
            className='checkboxInput'
            key={value}
          >
            <FontAwesomeIcon
              icon={this.state.optionSelected === value ? faDotCircle : faCircle}
              style={{
                color: this.state.optionSelected === value ? 'dodgerblue' : '#eee',
                fontSize: '15px',
                marginRight: '5px',
                cursor: 'pointer'
              }}
              onClick={() => {
                this.props.setValue(value)
                this.setState({ optionSelected: value })
              }}
            />
            {value}
          </div>
        )
      })
    }
  }
  render() {
    return (
      <div className='checkboxWrapper'>
        { this.renderInputs() }
      </div>
    )
  }
}

export default CheckboxSelector;
