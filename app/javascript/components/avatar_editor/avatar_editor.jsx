import React, { PureComponent, Fragment } from 'react'
import ReactDOM from 'react-dom'
import FileReaderInput from 'react-file-reader-input';
import ReactAvatarEditor from 'react-avatar-editor'

class AvatarEditor extends PureComponent {
  state = {
    image: null,
    allowZoomOut: false,
    scale: 1,
    endpoint: gon.endpoint,
    isUploading: false,
  }

  dataURLToBlob = (dataURL) => {
    const BASE64_MARKER = ';base64,';

    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }

  upload = () => {
    this.setState({ isUploading: true })
    const image = this.editor.getImageScaledToCanvas().toDataURL()
    const token = document.querySelector("meta[name=csrf-token]").content || ''
    const { endpoint } = this.state;
    let data = new FormData()
    data.append('user[photo]', this.dataURLToBlob(image))
    data.append('from_react', 'true')

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
        location.reload()
      }
    ).catch(
      error => {
        console.log('error', error)
        location.reload()
      }
    );
  };

  cancel = () => {
    document.getElementById('static-avatar').style.display = '';
    this.setState({
      image: null,
      scale: 1,
    })
  }

  setEditorRef = editor => {
    if (editor) this.editor = editor
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  handleNewImage = (e, results) => {
    document.getElementById('static-avatar').style.display = 'none';
    const [_e, file] = results[0];
    this.setState({ image: file })
  }

  render() {
    const { image, scale, isUploading } = this.state;
    return (
      <Fragment>
        {image &&
          <div className="content-center mt-1" >
            <ReactAvatarEditor
              ref={this.setEditorRef}
              style={{ width: '250px', height: '250px' }}
              width={250}
              height={250}
              image={image}
              borderRadius={150}
              scale={parseFloat(scale)}
            />
            { isUploading &&
              <i className="fa fa-spinner fa-3x avatar-loader" />
            }
          </div>
        }
        <br/>

        { !image &&
          <div className="content-center">
            <FileReaderInput
              as="binary"
              id="my-file-input"
              onChange={this.handleNewImage}
            >
              <button className="btn btn-main btn-m" >
                {I18n.t("cosplayers.change_a_photo")}
              </button>
            </FileReaderInput>
          </div>
        }

        {image &&
          <Fragment>
            <div className="text-center">
              <input
                name="scale"
                type="range"
                onChange={this.handleScale}
                min={this.state.allowZoomOut ? '0.1' : '1'}
                max="2"
                step="0.01"
                defaultValue="1"
              />
              <br/>
              <button
                className="btn btn-active btn-m mt-0-5 mb-1"
                onClick={this.upload}
              >
                {I18n.t("cosplayers.upload_a_photo")}
              </button>
              <button
                className="btn btn-main btn-m mt-0-5 mb-1 ml-0-5"
                onClick={this.cancel}
              >
                {I18n.t("common.cancel")}
              </button>
            </div>

          </Fragment>
        }
      </Fragment>
    )
  }
}

document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById('avatar-editor');
  if (reactNode) {
    ReactDOM.render(
      <AvatarEditor name="React"/>,
      reactNode,
    )
  }
})

document.addEventListener('turbolinks:before-cache', () => {
  const reactNode = document.getElementById('avatar-editor');
  if (reactNode) {
    const clone = reactNode.cloneNode(true);
    ReactDOM.unmountComponentAtNode(reactNode)
    // static preloader for time when turbolinks going to show component
    reactNode.replaceWith(clone);
  }
})