require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "shows the homepage with default lesson content" do
    get root_path

    assert_response :success
    assert_select "script[src*=?]", "home_carousel"
    assert_select "[data-lesson-carousel-data]", 1
    assert_select "[data-resource-modal-trigger]", 3
    assert_select "[data-resource-modal]", 1
    assert_select "img.storybook-banner__image[alt=?]", "Cartoon Sunday school Bible-times village with children listening to a teacher"
    assert_select ".lesson-card", 5
    assert_select ".lesson-dot", 50
    assert_select "h2", "Daniel in the Lions' Den"
    assert_select "footer", text: /Basic Bible Stories/
  end

  test "shows selected lesson in the center of the carousel" do
    get root_path(lesson: 1)

    assert_response :success
    assert_select ".lesson-card--selected .lesson-card__title", "Creation Begins"
    assert_select "h2", "Creation Begins"
  end

  test "falls back to default lesson when selected lesson is invalid" do
    get root_path(lesson: 99)

    assert_response :success
    assert_select ".lesson-card--selected .lesson-card__title", "Daniel in the Lions' Den"
  end

  test "shows a sample resource pdf" do
    get resource_document_path("table-of-content", format: :pdf)

    assert_response :success
    assert_equal "application/pdf", response.media_type
    assert_includes response.body, "%PDF-1.4"
  end

  test "returns not found for unknown resource pdf" do
    get resource_document_path("missing", format: :pdf)

    assert_response :not_found
  end
end
