class ApplicationController < ActionController::Base
  before_action :set_locale
  before_action :set_env
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_raven_context

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

  # Error reporting
  def set_raven_context
    unless Rails.env.development?
      user_id = current_user.id if user_signed_in?
      Raven.user_context(id: user_id)
      Raven.extra_context(params: params.to_unsafe_h, url: request.url)
    end
  end

end
