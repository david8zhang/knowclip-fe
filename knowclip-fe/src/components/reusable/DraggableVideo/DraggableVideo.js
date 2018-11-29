import React, { Component } from 'react'
import GridLayout from 'react-grid-layout'
import './draggable-video.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

class DraggableVideo extends Component {
  render() {
    return (
      <GridLayout
        className='draggableVideoWrapperLayout'
        isDraggable={false}
        isResizable={true}
        cols={12}
        width='100%'
      >
        <div
          key='1'
          className='draggableVideoWrapper'
        >
          { this.props.children }
        </div>
      </GridLayout>
    )
  }
}

export default DraggableVideo
