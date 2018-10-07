import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe } from 'react-photoswipe';

class Gallery extends PureComponent {
  state = {
    photos: gon.photos,
    canRemove: gon.canRemove,
    lightboxIsOpen: false,
    isImageRemoving: false,
    currentImage: 0,
  }

  openLightbox = (currentPhotoId) => {
    this.setState({
      lightboxIsOpen: true,
      currentImage: currentPhotoId,
    })
  }

  render() {
    const {
      photos,
      currentImage,
      lightboxIsOpen,
    } = this.state

    return(
      <div className="images-container mt-2">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="image-container"
          >
            <img
              onClick={() => this.openLightbox(index)}
               src={photo.lq_src}
            />
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