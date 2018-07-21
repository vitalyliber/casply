require 'test_helper'

class EventsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @event = events(:one)
  end

  test "should get index" do
    skip
    get events_url
    assert_response :success
  end

  test "should get new" do
    skip
    get new_event_url
    assert_response :success
  end

  test "should create event" do
    skip
    assert_difference('Event.count') do
      post events_url, params: { event: {  } }
    end

    assert_redirected_to event_url(Event.last)
  end

  test "should show event" do
    skip
    get event_url(@event)
    assert_response :success
  end

  test "should get edit" do
    skip
    get edit_event_url(@event)
    assert_response :success
  end

  test "should update event" do
    skip
    patch event_url(@event), params: { event: {  } }
    assert_redirected_to event_url(@event)
  end

  test "should destroy event" do
    skip
    assert_difference('Event.count', -1) do
      delete event_url(@event)
    end

    assert_redirected_to events_url
  end
end
