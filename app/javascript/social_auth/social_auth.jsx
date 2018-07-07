import React, { PureComponent, Fragment } from 'react'
import ReactDOM from 'react-dom'

const vk_email_permission = 4194304

class AvatarEditor extends PureComponent {

  state = {
    isLoadingVk: false,
    isLoadingFb: false,
  }

  componentDidMount() {
    VK.init({
      apiId: gon.vk_app_id,
    });
  }

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
        this.setState({ isLoadingFb: false })
      }
    );
  }

  loginVK = () => {
    this.setState({ isLoadingVk: true })
    VK.Auth.login((response) => {
      console.log(response)
      if (response.session) {
        console.log('Welcome! Fetching your information....');
        const url = `https://oauth.vk.com/authorize?client_id=6623232&display=popup&redirect_uri=${gon.vk_redirect_uri}&scope=email&response_type=code&v=5.80`
        location.replace(url)
      }
      else {
        console.log('User cancelled login or did not fully authorize.');
        this.setState({ isLoadingVk: false })
      }
    }, vk_email_permission)
  }

  login = () => {
    this.setState({ isLoadingFb: true })
    FB.login((response) => {
      console.log(response)
      if (response.authResponse) {
        console.log('Welcome! Fetching your information.... ');
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
    const { isLoadingFb, isLoadingVk } = this.state
    return (
      <div className="content-center fd-c">
        <button
          onClick={this.login}
          className="btn btn-facebook"
        >
          <i className="fa fa-facebook fa-1x mr-0-5" />
          {I18n.t("common.login_with_facebook")}
          { isLoadingFb &&
            <i className="fa fa-spinner fa-1x loader ml-0-5" />
          }
        </button>
        <button
          onClick={this.loginVK}
          className="btn btn-vk mt-1"
        >
          <i className="fa fa-vk fa-1x mr-0-5" />
          {I18n.t("common.login_with_vk")}
          { isLoadingVk &&
            <i className="fa fa-spinner loader ml-0-5" />
          }
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