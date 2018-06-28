import React, { PureComponent, Fragment } from 'react'
import ReactDOM from 'react-dom'

class AvatarEditor extends PureComponent {

  responseFacebook = (response) => {
    const token = document.querySelector("meta[name=csrf-token]").content || ''
    fetch('/users/social_auth', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'X-CSRF-Token': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }).then( async response => {
      if (response.status >= 400) {
        const json = await response.json()
        alert(I18n.t("common.error"))
        return Promise.reject(new Error(json.msg))
      }
      location.replace('/')
    }).catch(
      error => {
        alert(I18n.t("common.error"))
        console.log('error', error)
      }
    );
  }

  login = () => {
    FB.login((response) => {
      console.log(response)
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        const { accessToken } = response.authResponse
        FB.api('/me', { fields: 'name,email,picture' }, (response) => {
          response.accessToken = accessToken;
          this.responseFacebook(response);
          console.log('Good to see you, ' + response.name + '.');
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: 'public_profile,email',
      return_scopes: true,
    });
  }

  render() {
    return (
      <div className="content-center">

        <button
          onClick={this.login}
          className="btn btn-facebook"
        >
          <i className="fa fa-facebook fa-1x mr-0-5" />
          {I18n.t("common.login_with_facebook")}
        </button>
      </div>
    )
  }
}

const tagName = 'social-auth';
document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById(tagName);
  if (reactNode) {
    ReactDOM.render(
      <AvatarEditor name="React"/>,
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