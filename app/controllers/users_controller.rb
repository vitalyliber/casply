class UsersController < ApplicationController
  def social_auth
    uri = "https://graph.facebook.com/v2.11/#{user_id}?fields=name,email,picture.height(961)&access_token=#{access_token}"
    response = Excon.get(uri)
    if response.status == 200
      body = JSON.parse(response.body)
      name, email, picture = body.values_at 'name', 'email', 'picture'
      user = User.find_by(email: email)
      if user.blank?
        country_code = GeoIPInstance.try(:country, request.remote_ip).try(:country_code2)
        user = User.create(
            name: name,
            email: email,
            password: SecureRandom.hex,
            gender: :other,
            country: country_code.present? && country_code != '--' ? country_code : 'KY',
            confirmed_at: DateTime.now,
        )
        picture
            .try { |el| el['data']['url'] }
            .try do |url|
              user.photo.attach(io: open(url), filename: 'photo.jpeg')
            end
      end

    end
    if sign_in(user)
      render json: {}
    else
      render json: { msg: t('common.error') }, status: 400
    end

  end

  private

  def user_id
    params[:user][:id]
  end

  def access_token
    params[:accessToken]
  end
end
