class Api::CitiesController < ApplicationController
  def index
    cities = CS.states(country_code).keys.flat_map { |state| CS.cities(state, country_code) }.uniq
    render json: { cities: cities }
  end

  private

  def country_code
    params[:country_code]
  end
end
