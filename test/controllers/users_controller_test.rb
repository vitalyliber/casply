require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get social_auth" do
    get users_social_auth_url
    assert_response :success
  end

end
