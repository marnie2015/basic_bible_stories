class HomeController < ApplicationController
  def show
    @home_page_content = HomePageContentService.new(
      selected_lesson_number: params[:lesson]
    ).call
  end
end
