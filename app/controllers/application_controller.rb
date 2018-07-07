class ApplicationController < ActionController::Base
  before_action :set_locale
  before_action :set_env
  before_action :configure_permitted_parameters, if: :devise_controller?

  def set_locale
    logger.debug "* Accept-Language: #{request.env['HTTP_ACCEPT_LANGUAGE']}"
    browser_locale = extract_locale_from_accept_language_header
    I18n.locale = browser_locale.in?(['ru', 'en']) ? browser_locale : 'en'
    logger.debug "* Locale set to '#{I18n.locale}'"
  end

  private

  def extract_locale_from_accept_language_header
    request.env['HTTP_ACCEPT_LANGUAGE'].try(:scan, /^[a-z]{2}/).try(:first) || 'EN'
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :gender, :country])
  end

  def render_404
    raise ActionController::RoutingError.new('Not Found')
  end

  def set_env
    gon.push(
      vk_app_id: ENV['VK_APP_ID'],
      vk_redirect_uri: ENV['VK_REDIRECT_URI'],
    )
  end

end
