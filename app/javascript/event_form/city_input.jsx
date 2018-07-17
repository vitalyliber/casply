import React, { PureComponent, Fragment } from 'react'
import Autocomplete from 'react-autocomplete'


export default class CityInput extends PureComponent {

  state = {
    selected: '',
    input: '',
    cities: [],
    isGettingCities: true,
  }

  render() {
    const { input } = this.state;
    const { cities, current_city } = this.props;

    return (
      <div className="mt-1">
        <label>
          {I18n.t('events.city')}
        </label>
        <Autocomplete
          inputProps={{name: "event[city]"}}
          getItemValue={(item) => item}
          items={cities}
          renderItem={(item, isHighlighted) =>
            <div
              key={item}
              style={{ background: isHighlighted ? 'lightgray' : 'white' }}
              className="autocomplete-item"
            >
              {item}
            </div>
          }
          wrapperStyle={{}}
          renderInput={(props) => <input {...props} type="text" className="text-field" />}
          value={current_city || input}
          onChange={this.onChange}
          onSelect={this.onSelect }
          shouldItemRender={this.matchStateToTerm}
        />
      </div>
    )
  }

  onSelect = (value) => {
    this.setState({
      selected: value,
      input: value,
    })
  }

  onChange = (e) => {
    const { current_city } = this.props
    if (current_city) {
      this.props.onChange({ current_city: undefined })
    }
    this.setState({
      selected: undefined,
      input: e.target.value,
    })
  }

  matchStateToTerm = (state, value) => {
    return (
      state.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
  }
}