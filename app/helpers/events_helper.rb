module EventsHelper
  def countries
    @countries ||= CS.countries.map {|country| { name: country[1], code: country[0] } }
  end

  def country_code_by_name(name)
    countries
        .find {|country| country[:name] == name}
        .try {|el| el[:code]}
  end

  def geoip
    @geoip ||= GeoIPInstance.try(:country, request.remote_ip)
  end
end
