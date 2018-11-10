import React, { Component } from 'react'
import './hover-trigger.css'

class HoverTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: this.props.showing
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      showing: nextProps.showing
    })
  }

  render() {
    return (
      <div
        onMouseEnter={() => this.setState({ showing: true })}
        onMouseLeave={() => this.setState({ showing: false })}
        style={{ height: '150px' }}
      >
        {
          this.state.showing &&
          <div className='hoverTriggerContent'>
           { this.props.children }
          </div>
        }
      </div>
    )
  }
}

export default HoverTrigger
