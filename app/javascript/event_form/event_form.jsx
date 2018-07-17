import React, { PureComponent, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Autocomplete from 'react-autocomplete'

import CityInput from './city_input'


class EventForm extends PureComponent {

  state = {
    country_selected: gon.current_country_code,
    country_input: gon.current_country,
    countries: gon.countries,
    isGettingCities: false,
    cities: [],
    current_city: gon.current_city
  }

  componentDidMount() {
    const { country_selected } = this.state
    if (country_selected) {
      this.getCities(country_selected)
    }
  }

  render() {
    const {
      country_input,
      country_selected,
      countries,
      cities,
      isGettingCities,
      current_city,
    } = this.state;
    return (
      <div className="mt-1">
        <label>
          {I18n.t('events.country')}
        </label>
        <Autocomplete
          inputProps={{ name: "event[country]" }}
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
        { (country_selected && !isGettingCities && cities.length > 0) &&
          <CityInput
            cities={cities}
            current_city={current_city}
            onChange={(object) => this.setState(object)}
          />
        }
        { isGettingCities &&
          <div className="content-center mt-0-5">
            <i className="fa fa-spinner fa-2x avatar-loader mt-1" />
          </div>
        }
      </div>
    )
  }

  onChange = (e) => {
    this.setState({
      current_city: undefined,
      country_selected: undefined,
      country_input: e.target.value,
    })
  }

  onSelect = (value) => {
    const { countries } = this.state;
    const country = countries.find((country) => {
      return value.toLowerCase().indexOf(country.name.toLowerCase()) !== -1
    })
    this.setState({
      current_city: undefined,
      country_selected: country.code,
      country_input: value,
    })
    this.getCities(country.code)
  }

  matchStateToTermCity = (state, value) => {
    return (
      state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
  }

  getCities = (country_code) => {
    const token = document.querySelector("meta[name=csrf-token]").content || ''

    this.setState({
      cities: [],
      isGettingCities: true,
    })

    return fetch(`/api/cities?country_code=${country_code}`, {
      method: 'get',
      credentials: "same-origin",
      headers: {
        'X-CSRF-Token': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then( async response => {
        if (response.status <= 400) {
          const json = await response.json()
          this.setState({
            cities: json.cities,
            isGettingCities: false,
          })
          return
        }
        this.setState({
          cities: [],
          isGettingCities: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          cities: [],
          isGettingCities: false,
        })
      })
  }
}

const tagName = 'event-form';
document.addEventListener('turbolinks:load', () => {
  const reactNode = document.getElementById(tagName);
  if (reactNode) {
    ReactDOM.render(
      <EventForm name="React"/>,
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