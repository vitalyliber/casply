class UsersController < ApplicationController
  def social_auth
    uri = "https://graph.facebook.com/v2.11/#{fb_user_id}?fields=name,email,picture.height(961)&access_token=#{access_token}"
    response = Excon.get(uri)
    if response.status == 200
      body = JSON.parse(response.body)
      name, picture = body.values_at 'name', 'picture'
      email = email_or_fake(body['email'], fb_user_id, 'facebook')
      user = User.find_by(email: email)
      if user.blank?
        user = User.create(
            name: name,
            email: email,
            password: SecureRandom.hex,
            gender: :other,
            country: country_code,
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

  def social_auth_vk
    if vk_code
      uri = "https://oauth.vk.com/access_token?client_id=#{ENV['VK_APP_ID']}&client_secret=#{ENV['VK_CLIENT_SECRET']}&redirect_uri=#{ENV['VK_REDIRECT_URI']}&code=#{vk_code}"
      response = Excon.get(uri)
      if response.status == 200
        body = JSON.parse(response.body)
        email = email_or_fake(body['email'], body['user_id'], 'vk')
        user = User.find_by(email: email)
        if user.blank?
          info_uri = "https://api.vk.com/method/users.get?fields=sex,first_name,last_name,photo_max_orig&v=5.8&access_token=#{body['access_token']}"
          info_response = Excon.get(info_uri)
          if info_response.status == 200
            info = JSON.parse(info_response.body).dig('response', 0)
            user = User.create(
              name: "#{info['first_name']} #{info['last_name']}",
              email: email,
              password: SecureRandom.hex,
              gender: vk_gender(info['sex']),
              country: country_code,
              confirmed_at: DateTime.now,
            )
            info
                .try { |el| el['photo_max_orig'] }
                .try do |url|
                  if user.present?
                    user.photo.attach(io: open(url), filename: 'photo.jpeg')
                  end
                end
          end
        end
      end
    end
    if user.present? && sign_in(user)
      redirect_to root_path
    else
      flash[:alert] = t('common.error')
      redirect_to root_path
    end
  end

  private

  def fb_user_id
    params[:user][:id]
  end

  def access_token
    params[:accessToken]
  end

  def vk_code
    params[:code]
  end

  def country_code
    code = GeoIPInstance.try(:country, request.remote_ip).try(:country_code2)
    code.present? && code != '--' ? code : 'KY'
  end

  def email_or_fake(email, user_id, provider)
    if email
      email
    else
      "#{user_id}@#{provider}.casply.com"
    end
  end

  def vk_gender(sex)
    if sex == '1'
      :female
    elsif sex == '2'
      :male
    else
      :other
    end
  end
end
