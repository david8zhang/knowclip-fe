import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './tooltip.css';

export class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: props.showing
    };
  }
  render() {
    return (
      <div className="tooltip">
        { this.props.children }
        {
          this.state.showing &&
          <span className="tooltiptext">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              { this.props.text }
              <div onClick={() => this.setState({ showing: false })}>
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ margin: '0px 5px 0px 10px' }}
                />
              </div>
            </div>
          </span>
        }
      </div>
    )
  }
}