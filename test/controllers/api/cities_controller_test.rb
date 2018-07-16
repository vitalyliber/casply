require 'test_helper'

class Api::CitiesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_cities_index_url
    assert_response :success
  end

end
