import React from 'react';
import ReactDOM from 'react-dom'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: gon.formatted_address || '',
      lat: gon.lat || '',
      lng: gon.lng || '',
      country_code: gon.country_code || '',
      place_id: gon.place_id || '',
      formatted_address_invalid: gon.formatted_address_invalid,
    };
  }

  handleChange = address => {
    this.setState({ address });
  };

  getAddressCountry = (results) => {
    return results[0].address_components.find(({ types }) => types[0] === 'country');
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(async results => {
        const LatLng = await getLatLng(results[0])
        this.setState({
          address: results[0].formatted_address,
          lat: LatLng.lat,
          lng: LatLng.lng,
          country_code: this.getAddressCountry(results).short_name,
          place_id: results[0].place_id,
        })
        return getLatLng(results[0])
      })
      .catch(error => console.error('Error', error));
  };

  render() {
    const { place_id, country_code, address, lat, lng, formatted_address_invalid } = this.state

    return (
      <PlacesAutocomplete
        value={address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        debounce={700}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <div className={`autocomplete-input-container ${formatted_address_invalid ? 'field_with_errors' : '' }`} >
              <label>
                {I18n.t('events.address')}
              </label>
              <input
                {...getInputProps({
                  className: 'location-search-input',
                })}
              />
              {loading &&
                <div className="autocomplete-loader-container">
                  <i className="fa fa-spinner fa-1x avatar-loader text-color-main"/>
                </div>
              }
            </div>
            <input type="hidden" value={country_code} name="event[country_code]" />
            <input type="hidden" value={place_id} name="event[place_id]" />
            <input type="hidden" value={address} name="event[formatted_address]" />
            <input type="hidden" value={lat} name="event[lat]" />
            <input type="hidden" value={lng} name="event[lng]" />
            <div className="autocomplete-dropdown-container" >
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item-active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
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