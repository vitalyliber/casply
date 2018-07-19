import React, { PureComponent, Fragment } from 'react'
import Dropzone from 'react-dropzone'


export default class Uploader extends PureComponent {

  state = {
    photos: [],
    isUploading: false,
  }

  onDrop = (photos) => {
    this.upload(photos)
  }

  render() {
    const { isUploading } = this.state;

    return (
      <Dropzone
        onDrop={this.onDrop}
        className="image-container content-center"
        accept="image/jpeg"
      >
        {isUploading ? (
          <i className="fa fa-spinner fa-3x avatar-loader text-color-main" />
        ) : (
          <div className="text-center">
            <i className="fa fa-image fa-4x text-color-main mb-1" />
            <p className="text-color-main">
              {I18n.t('costumes.add_photos')}
            </p>
          </div>
        )}
      </Dropzone>
    )
  }

  upload = (photos) => {
    this.setState({ isUploading: true })
    const token = document.querySelector("meta[name=csrf-token]").content || ''
    const endpoint = window.location.href
    let data = new FormData()

    photos.forEach((photo) => {
      data.append('costume[photos][]', photo)
    });
    data.append('need_json_response', 'true')

    fetch(endpoint, {
      method: 'PATCH',
      credentials: "same-origin",
      headers: {
        'X-CSRF-Token': token,
  },
      body: data
    }).then(
      response => response.statusText
    ).then(
      success => {
        console.log('success', success)
        Turbolinks.visit(location.toString());
      }
    ).catch(
      error => {
        console.log('error', error)
        Turbolinks.visit(location.toString());
      }
    );
  };
}