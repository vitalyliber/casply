import React from 'react';
import ReactDOM from 'react-dom'
import FabFan from '../fab-fan'
import Overlay from '../overlay'


class FloatButton extends React.Component {
  state = {
    open: false,
    fabOpts: [
      {
        name: I18n.t("cosplayers.plus_costume"),
        onClick: () => Turbolinks.visit('/costumes/new'),
        background: '#C14890',
        icon: <i className="fa fa-camera fa-1x" />,
      },
      {
        name: I18n.t("events.plus_event"),
        onClick: () => Turbolinks.visit('/events/new'),
        background: '#3c8bbb',
        icon: <i className="fa fa-calendar fa-1x" />,
      },
    ]
  }

  toggleActionBar = () => {
    this.setState(state => {
      return {
        open: !state.open
      }
    })
  }

  render () {
    const {open, fabOpts} = this.state

    return (
      <div>
        <Overlay
          open={open}
          onClick={this.toggleActionBar}
        />

        <div className='container'>
          <FabFan
            open={open}
            options={fabOpts}
            onClick={this.toggleActionBar}
            actionContainerStyle={{
              width: '140px',
              position: 'relative',
              right: '5px',
              bottom: '15px'
            }}
          />
        </div>
      </div>
    )
  }
}

const tagName = 'float-button';
document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById(tagName);
  if (reactNode) {
    ReactDOM.render(
      <FloatButton name="React"/>,
      reactNode,
    )
  }
})

document.addEventListener('turbolinks:before-cache', () => {
  const reactNode = document.getElementById(tagName);
  if (reactNode) {
    const clone = reactNode.cloneNode(true);
    ReactDOM.unmountComponentAtNode(reactNode)
    // static preloader for time when turbolinks going to show component
    reactNode.replaceWith(clone);
  }
})