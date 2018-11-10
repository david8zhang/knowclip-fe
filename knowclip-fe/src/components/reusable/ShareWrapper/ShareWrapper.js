import React, { Component } from 'react'
import './share-wrapper.css'

class ShareWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingShare: false
    }
  }
  renderShareForm() {
    return (
      <div>
        <p>
          { this.props.shareableLink }
        </p>
      </div>
    )
  }
  renderShareUI() {
    if (!this.state.showingShare) {
      return <div />
    }
    return (
      <div className='shareOverlay'>
        {
          <div>
            <p
              onClick={() => {
                this.props.showShareable()
              }}
            >
              Get Shareable Link
            </p>
          </div>
        }
      </div>
    )
  }
  render() {
    return (
      <div
        className='shareWrapper'
        onMouseEnter={() => this.setState({ showingShare: true })}
        onMouseLeave={() => this.setState({ showingShare: false })}
      >
        { this.props.children }
        {
          this.state.showingShare &&
          this.renderShareUI()
        }
      </div>
    )
  }
}

export default ShareWrapper
