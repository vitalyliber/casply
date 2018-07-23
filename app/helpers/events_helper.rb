module EventsHelper
  def countries
    @countries ||= CS.countries.map {|country| { name: country[1], code: country[0] } }
  end
end
