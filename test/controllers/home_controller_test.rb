require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "redirects root to the static homepage" do
    get root_path

    assert_redirected_to "/homepage/index.html"
  end

  test "serves the static homepage" do
    get "/homepage/index.html"

    assert_response :success
    assert_includes response.body, "styles.css"
    assert_includes response.body, "app.js"
    assert_includes response.body, "images/banner_header.png"
    assert_includes response.body, "images/features.png"
    assert_includes response.body, "images/lessons.png"
    assert_includes response.body, "carousel-showcase__row--realistic"
    assert_includes response.body, "carousel-showcase__row--colored"
    assert_includes response.body, "images/300.png"
    assert_includes response.body, "images/stamp.png"
    assert_includes response.body, "payment-package-section"
    assert_includes response.body, "I Want to Avail These Lessons"
    assert_includes response.body, "carousel-showcase"
    assert_includes response.body, "carousel-showcase__feature-artwork"
    assert_includes response.body, "carousel-showcase__feature-stamp"
    assert_includes response.body, "carousel-showcase__carousel-with-links"
    assert_includes response.body, "Realistic Image Previews"
    assert_includes response.body, "Colored Image Previews"
    assert_includes response.body, "data-lesson-carousel"
    assert_includes response.body, 'data-carousel-image-set="colored"'
    assert_includes response.body, "data-resource-modal-trigger"
  end

  test "serves the static carousel javascript" do
    get "/homepage/app.js"

    assert_response :success
    assert_includes response.body, "coloredImageUrl"
    assert_includes response.body, "lesson-card__number"
    assert_includes response.body, "[data-lesson-carousel-card]"
    assert_includes response.body, "SWIPE_THRESHOLD"
    assert_includes response.body, "MAX_SWIPE_STEPS"
    assert_includes response.body, "pointerdown"
    assert_includes response.body, "pointermove"
    assert_includes response.body, "setPointerCapture"
    assert_includes response.body, "captureSwipePointer"
    assert_includes response.body, "this.isSwipeDragging = true"
    assert_includes response.body, "--carousel-drag-offset"
    assert_includes response.body, "swipeLessonOffset"
    assert_includes response.body, "cardStepWidth"
    assert_includes response.body, "[-3, -2, -1, 0, 1, 2, 3]"
    assert_includes response.body, "activateAdjacentLesson"
    assert_includes response.body, "return lesson.coloredImageUrl"
    assert_includes response.body, "new LessonCarousel"
    assert_not_includes response.body, "lesson-carousel__selector"
    assert_not_includes response.body, "lesson-dot"
  end

  test "serves the static homepage stylesheet" do
    get "/homepage/styles.css"

    assert_response :success
    assert_includes response.body, "aspect-ratio: 12 / 17"
    assert_includes response.body, ".payment-package-section"
    assert_includes response.body, ".carousel-showcase__feature-stamp"
    assert_includes response.body, ".payment-package-section__button"
    assert_includes response.body, ".carousel-showcase__row--colored"
    assert_includes response.body, ".lesson-carousel__viewport"
    assert_includes response.body, "--carousel-base-offset"
    assert_includes response.body, "padding: 38px 0 14px"
    assert_includes response.body, ".lesson-card:not(.lesson-card--selected)"
    assert_includes response.body, "grayscale(0.78)"
    assert_includes response.body, "grid-template-columns: minmax(0, 1fr)"
    assert_includes response.body, "max-width: 760px"
    assert_includes response.body, "--carousel-gap: clamp(20px, 2.5vw, 34px)"
    assert_includes response.body, "touch-action: pan-y"
    assert_includes response.body, "cursor: grab"
    assert_includes response.body, "grid-template-columns: 176px minmax(0, 760px) 176px"
    assert_includes response.body, "grid-template-columns: minmax(0, 760px)"
    assert_includes response.body, ".carousel-showcase__feature-image"
    assert_includes response.body, ".lesson-carousel--colored"
    assert_includes response.body, ".resource-modal"
  end
end
