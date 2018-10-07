import React, { PureComponent, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Autocomplete from 'react-autocomplete'

class EventsSearch extends PureComponent {

  getCountryCodeByName = name => (
    gon.countries.find(el => el.name === name)['code']
  )

  getCountryNameByCode = code => {
    if (code) {
      return gon.countries.find(el => el.code === code)['name']
    }
    else {
      return ''
    }
  }

  state = {
    country_input: this.getCountryNameByCode(gon.country_input),
    countries: gon.countries,
  }

  render() {
    const {
      country_input,
      countries,
    } = this.state;
    return (
      <div className="mb-1">
        <Autocomplete
          inputProps={{
            name: "event[country]",
            placeholder: I18n.t('events.country'),
            onKeyPress: (e) => {
              if (e.key === 'Enter') {
                location.replace('/events')
              }
            }
          }}
          getItemValue={(item) => item.name}
          items={countries}
          renderItem={(item, isHighlighted) =>
            <div
              key={item.code}
              style={{ background: isHighlighted ? 'lightgray' : 'white' }}
              className="autocomplete-item"
            >
              {item.name}
            </div>
          }
          wrapperStyle={{}}
          renderInput={(props) => <input {...props} type="text" className="text-field" />}
          value={country_input}
          onChange={this.onChange}
          onSelect={this.onSelect }
          shouldItemRender={this.matchStateToTermCity}
        />
      </div>
    )
  }

  onChange = (e) => {
    this.setState({
      current_city: undefined,
      country_input: e.target.value,
    })
  }

  onSelect = (value) => {
    console.log(value)
    const country_code = this.getCountryCodeByName(value)
    this.setState({
      country_input: value,
    })
    console.log(country_code)
    location.replace(`/events?country=${country_code}`)
  }

  matchStateToTermCity = (state, value) => {
    return (
      state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
  }
}

const tagName = 'events-search';
document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById(tagName);
  if (reactNode) {
    ReactDOM.render(
      <EventsSearch name="React"/>,
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