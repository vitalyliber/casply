class EventsController < ApplicationController
  include EventsHelper
  before_action :set_event, only: [:show, :edit, :update, :destroy]

  # GET /events
  # GET /events.json
  def index
    @events =
      Event
        .with_eager_loaded_image
        .where("date >= ?", DateTime.now)
        .try {|el| params[:country] ? el.where(country: params[:country]) : el}
        .order(date: :asc)
        .page(params[:page])
    gon.push({
      countries: countries,
      country_input: params[:country]
    })
  end

  # GET /events/1
  # GET /events/1.json
  def show
    desc = @event.desc.truncate(160)

    set_meta_tags description: desc,
      og: {
        title: "Cosplay event - #{@event.title}",
        type: 'website',
        description: desc,
        image: @event.image.attached? ? @event.image.variant(resize: "1024", interlace: "plane").processed.service_url : nil
      }
  end

  # GET /events/new
  def new
    @event = Event.new
    gon.push({
      countries: countries,
      current_country: geoip.try(:country_name),
      current_country_code: geoip.try(:country_code2)
    })
  end

  # GET /events/1/edit
  def edit
    gon_data
  end

  # POST /events
  # POST /events.json
  def create
    @event = Event.new(event_params)
    @event.user = current_user

    respond_to do |format|
      if @event.save
        format.html { redirect_to @event }
        format.json { render :show, status: :created, location: @event }
      else
        format.html {
          gon_data
          render :new
        }
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /events/1
  # PATCH/PUT /events/1.json
  def update
    return redirect_to root_path unless user_event?
    respond_to do |format|
      if @event.update(event_params)
        format.html { redirect_to @event }
        format.json { render :show, status: :ok, location: @event }
      else
        format.html do
          gon_data
          render :edit
        end
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1
  # DELETE /events/1.json
  def destroy
    return redirect_to root_path unless user_event?
    @event.destroy
    respond_to do |format|
      format.html { redirect_to events_url, notice: t('events.was_destroyed') }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_event
    @event = Event.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def event_params
    params.require(:event).permit(
      :title, :country, :city, :date, :link, :desc, :image, 'date(1i)', 'date(2i)', 'date(3i)'
    )
  end

  def user_event?
    current_user == @event.user
  end

  def gon_data
    gon.push({
      countries: countries,
      current_country: @event.country,
      current_country_code: country_code_by_name(@event.country),
      current_city: @event.city
    })
  end
end
