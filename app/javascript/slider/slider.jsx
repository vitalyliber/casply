// Run this example by adding <%= javascript_pack_tag 'Gallery_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Gallery React</div> at the bottom
// of the page.

import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Popup from './popup'

class Gallery extends PureComponent {
  state = {
    photos: gon.photos,
    canRemove: gon.canRemove,
    modalContent: null,
    removeButtonHover: false,
    isImageRemoving: false,
  }

  setModalContent = (photo) => {
    this.setState({ modalContent: photo })
  }

  setRemoveButtonHover = () => {
    const { removeButtonHover } = this.state
    this.setState({ removeButtonHover: !removeButtonHover })
  }

  removeImage = () => {
    const { modalContent: { id: currentPhotoId }, photos } = this.state;
    const token = document.querySelector("meta[name=csrf-token]").content || ''

    this.setState({ isImageRemoving: true })
    fetch(`/costumes/${gon.costumeId}/photos/${currentPhotoId}`, {
      method: 'delete',
      credentials: "same-origin",
      headers: {
        'X-CSRF-Token': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.status < 400) {
          const newPhotos = photos.filter(({ id }) => id !== currentPhotoId)
          this.setState({
            modalContent: null,
            photos: newPhotos,
          })
        }
        this.setState({
          modalContent: null,
          isImageRemoving: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          modalContent: null,
          isImageRemoving: false
        })
      })
  }

  render() {
    const { photos, modalContent, removeButtonHover, canRemove, isImageRemoving } = this.state
    const removeButtonStyles = removeButtonHover ?
      { ...styles.removeButton, ...styles.redColor } :
      styles.removeButton

    return(
      <div className="images-container mt-2">
        {photos.map(photo => (
          <div key={photo.id} className="image-container">
            <img onClick={() => this.setModalContent(photo)} src={photo.small} />
          </div>
        ))}
        <Popup
          isOpen={modalContent}
          onClose={() => this.setState({ modalContent: null })}
        >
          { (!isImageRemoving && modalContent && modalContent.big) ? (
            <div style={styles.imageContainer}>
              <img
                src={modalContent.big}
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: 'auto',
                }}
              />
              <div
                onClick={() => {
                  const curIndex = photos.map(({ id }) => id).indexOf(modalContent.id)
                  const nextPhoto = photos[curIndex - 1] ? photos[curIndex - 1] : photos[photos.length - 1]
                  this.setState({ modalContent: nextPhoto })
                }}
                style={styles.leftSlideButton}
              >
                <i className="fa fa-angle-left fa-3x" />
              </div>
              <div
                onClick={() => {
                  const curIndex = photos.map(({ id }) => id).indexOf(modalContent.id)
                  const nextPhoto = photos[curIndex + 1] ? photos[curIndex + 1] : photos[0]
                  this.setState({ modalContent: nextPhoto })
                }}
                style={styles.rightSlideButton}
              >
                <i className="fa fa-angle-right fa-3x" />
              </div>
              {(canRemove && photos.length > 1) &&
                <div
                  onClick={this.removeImage}
                  style={removeButtonStyles}
                  onMouseEnter={this.setRemoveButtonHover}
                  onMouseLeave={this.setRemoveButtonHover}
                >
                  <i className="fa fa-trash fa-1x" />
                </div>
              }

            </div>
          ) : (
            <i style={styles.loader} className="fa fa-spinner fa-3x" />
          )
          }
        </Popup>
      </div>
    )
  }
}

Gallery.defaultProps = {
  name: 'David'
}

Gallery.propTypes = {
  name: PropTypes.string
}

document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById('costume-images');
  if (reactNode) {
    ReactDOM.render(
      <Gallery name="React"/>,
      reactNode,
    )
  }
})

document.addEventListener('turbolinks:before-cache', () => {
  const reactNode = document.getElementById('costume-images');
  if (reactNode) {
    ReactDOM.unmountComponentAtNode(reactNode)
    // static preloader for time when turbolinks going to show component
    let newNode = document.createElement('div');
    newNode.className = 'images-container mt-2';
    let imageNode = document.createElement('div')
    imageNode.className = 'image-container'
    newNode.innerHTML += imageNode.outerHTML + imageNode.outerHTML
    reactNode.appendChild(newNode);
  }
})

const styles = {
  imageContainer: {
    position: 'relative',
  },
  leftSlideButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '15px',
    color: '#ffffff61',
    cursor: 'pointer',
  },
  rightSlideButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '48%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '15px',
    color: '#ffffff61',
    cursor: 'pointer',
  },
  removeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: '#ffffff61',
    padding: '10px',
  },
  redColor: {
    color: 'red',
    cursor: 'pointer',
  },
  loader: {
    color: 'white',
    justifyContent: 'center',
    display: 'flex',
    animation: 'spin 2s linear infinite',
  }
}