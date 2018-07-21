// Run this example by adding <%= javascript_pack_tag 'Gallery_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Gallery React</div> at the bottom
// of the page.

import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe } from 'react-photoswipe';

import Uploader from './uploader'

class Gallery extends PureComponent {
  state = {
    photos: gon.photos,
    canRemove: gon.canRemove,
    lightboxIsOpen: false,
    isImageRemoving: false,
    currentImage: 0,
    limit_photos: gon.limit_photos,
  }

  openLightbox = (currentPhotoId) => {
    this.setState({
      lightboxIsOpen: true,
      currentImage: currentPhotoId,
    })
  }

  setRemoveButtonHover = () => {
    const { removeButtonHover } = this.state
    this.setState({ removeButtonHover: !removeButtonHover })
  }

  removeImage = (currentPhotoId) => {
    const { photos } = this.state;
    const token = document.querySelector("meta[name=csrf-token]").content || ''

    this.setState({
      isImageRemoving: true,
      imageRemovingId: currentPhotoId,
    })
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
            photos: newPhotos,
          })
        }
        this.setState({
          isImageRemoving: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          isImageRemoving: false
        })
      })
  }

  render() {
    const {
      photos,
      canRemove,
      isImageRemoving,
      currentImage,
      lightboxIsOpen,
      imageRemovingId,
      limit_photos,
    } = this.state

    return(
      <div className="images-container mt-2">
        { (canRemove && photos.length < limit_photos ) &&
          <Uploader />
        }
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="image-container"
          >
            <img
              onClick={() => this.openLightbox(index)}
               src={photo.src}
            />
            {(canRemove) &&
            <div
              onClick={() => this.removeImage(photo.id)}
              className="trash"
            >
              {isImageRemoving && imageRemovingId === photo.id ? (
                <i style={styles.loader} className="fa fa-spinner fa-1x" />
              ) : (
                <i className="fa fa-trash fa-1x" />
              )}
            </div>
            }
          </div>
        ))}
        <PhotoSwipe
          isOpen={lightboxIsOpen}
          items={photos}
          options={{ index: currentImage, history: false }}
          onClose={()=> this.setState({ lightboxIsOpen: false })}
        />
      </div>
    )
  }

  handleClickImage = () => {
    const { currentImage, photos } = this.state;
    if (currentImage === photos.length - 1) return;
    this.gotoNext();
  }

  gotoNext = () => {
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage + 1,
    })
  }

  gotoPrevious = () => {
    const { currentImage } = this.state;
    this.setState({
      currentImage: currentImage - 1,
    })
  }
}

Gallery.defaultProps = {
  photos: []
}

Gallery.propTypes = {
  photos: PropTypes.array
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
    const clone = reactNode.cloneNode(true);
    ReactDOM.unmountComponentAtNode(reactNode)
    // static preloader for time when turbolinks going to show component
    reactNode.replaceWith(clone);
  }
})

const styles = {
  loader: {
    color: 'white',
    justifyContent: 'center',
    display: 'flex',
    animation: 'spin 2s linear infinite',
  }
}