import React from 'react';
import ReactDOM from 'react-dom'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dropzone from 'react-dropzone'
import axios from 'axios'

class CostumeForm extends React.Component {
  state = {
    isFetching: false,
  }

  render () {
    if (this.state.isFetching) {
      return (
        <div className="loader-container">
          <i className="fa fa-spinner fa-3x avatar-loader" />
        </div>
      )
    }

    return (
      <div className="costume-form">

        <div className="text-center mt-1">
          <h1>
            {gon.name ? I18n.t('costumes.edit') : I18n.t('costumes.new_costume')}
          </h1>
        </div>

        <Formik
          initialValues={{
            name: gon.name || '',
            desc: gon.desc || '',
            photos: gon.photos || [],
            photos_attachments_attributes: []
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().min(3, I18n.t('validations.min', { field: I18n.t('costumes.name'), min: 3 })).required(I18n.t('validations.required')),
            photos: Yup.array().required(I18n.t('validations.required')),
            desc: Yup.string(),
            photos_attachments_attributes: Yup.array(),
          })}
          onSubmit={this.onSubmit}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <input
                  id="name"
                  placeholder={I18n.t('costumes.name')}
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                />
                {errors.name &&
                touched.name && <div className="input-feedback">{errors.name}</div>}

                <textarea
                  id="desc"
                  placeholder={I18n.t('costumes.desc')}
                  type="text"
                  value={values.desc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.desc && touched.desc ? 'text-area error' : 'text-area'
                  }
                />
                {errors.desc &&
                touched.desc && <div className="input-feedback">{errors.desc}</div>}

                <Dropzone
                  onDrop={(photos) => {
                    const newPhotos = {target: {
                        value: [...values.photos, ...photos],
                          name: 'photos',
                    }}
                    handleChange(newPhotos)
                  }}
                  className="image-container content-center"
                  accept="image/jpeg"
                >
                  <div
                    className={
                      errors.photos && touched.photos ? 'dropzone-errors' : 'dropzone'
                    }
                  >
                    <i className="fa fa-image fa-1x text-color-main mb-1" />
                    <p className="text text-color-main">
                      Choose photos
                    </p>
                  </div>
                </Dropzone>

                {errors.photos &&
                touched.photos && <div className="input-feedback">{errors.photos}</div>}

                {values.photos.length > 0 &&
                  <div className="mb-1"/>
                }
                <div
                  className="previews"
                >
                  {values.photos.map((el, index) => {
                    return(
                      <div
                        className="preview-container"
                        key={el.preview}
                      >
                        <img
                          className="preview"
                          src={el.preview}
                        />
                        <div
                          className="delete"
                          onClick={() => {
                            if (gon.name) {
                              handleChange({target: {
                                value: [...values.photos_attachments_attributes, { id: el.id, _destroy: '1' }],
                                name: 'photos_attachments_attributes',
                              }})
                            }
                            const newPhotos = {target: {
                              value: values.photos.filter((el, i) => i !== index),
                              name: 'photos',
                            }}
                            handleChange(newPhotos)
                          }}
                        >
                          <i className="fa fa-times-circle fa-2x text-color-main" />
                        </div>
                      </div>
                    )
                  })}
                </div>


                <button
                  className="btn btn-main"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </form>
            );
          }}
        </Formik>

      </div>
    )
  }

  onSubmit = (formData) => {
    this.setState({ isFetching: true })
    const token = document.querySelector("meta[name=csrf-token]").content || ''
    let endpoint = '/costumes'
    if (gon.name) {
      endpoint = `/costumes/${gon.costume_id}`
    }
    let data = new FormData()

    if (gon.name) {
      formData.photos_attachments_attributes.forEach((photo, i) => {
        data.append(`costume[photos_attachments_attributes][${i}][id]`, photo.id)
        data.append(`costume[photos_attachments_attributes][${i}][_destroy]`, '1')
      });

      formData.photos.forEach((photo) => {
        if (!photo.id) {
          data.append('costume[photos][]', photo)
        }
      });
    } else {
      formData.photos.forEach((photo) => {
        data.append('costume[photos][]', photo)
      });
    }
    data.append('need_json_response', 'true')
    data.append('costume[name]', formData.name)
    data.append('costume[desc]', formData.desc)

    axios({
      url: endpoint,
      method: gon.name ? 'PUT' : 'POST',
      credentials: "same-origin",
      headers: {
        'X-CSRF-Token': token,
      },
      data,
    }).then(json => {
        console.log('success', json)
        if (gon.name) {
          Turbolinks.visit(endpoint);
        }
        else {
          Turbolinks.visit(`/costumes/${json.data.id}`);
        }
      }
    )
      .catch(error => {
        console.log(error)
        this.setState({ isFetching: false })
        alert('Something went wrong. Please, repeat again later')
      }
    );
  }
}

const tagName = 'costume-form';
document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById(tagName);
  if (reactNode) {
    ReactDOM.render(
      <CostumeForm name="React"/>,
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