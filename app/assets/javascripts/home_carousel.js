class LessonCarousel {
  RECENTER_COOLDOWN = 340;

  constructor(element) {
    this.element = element;
    this.track = element.querySelector("[data-lesson-carousel-track]");
    this.lessonTitle = document.querySelector("[data-lesson-title]");
    this.carouselData = this.parseCarouselData();
    this.lessons = this.carouselData.lessons;
    this.activeLessonNumber = this.carouselData.activeLessonNumber;
    this.recenterLocked = false;
  }

  connect() {
    if (!this.track || this.lessons.length === 0) return;

    this.element.addEventListener("click", this.activateClickedLesson);
  }

  parseCarouselData() {
    const dataElement = this.element.querySelector("[data-lesson-carousel-data]");
    if (!dataElement) return { lessons: [], activeLessonNumber: null };

    return JSON.parse(dataElement.dataset.lessonCarouselData || dataElement.textContent);
  }

  activateClickedLesson = (event) => {
    const activator = event.target.closest("[data-lesson-carousel-card], [data-lesson-carousel-selector]");
    if (!activator) return;

    event.preventDefault();
    const lessonNumber = Number(activator.dataset.lessonNumber);

    if (this.activateLesson(lessonNumber)) {
      this.updateUrl(lessonNumber);
    }
  };

  activateLesson(lessonNumber) {
    if (this.recenterLocked) return false;
    if (lessonNumber === this.activeLessonNumber) return false;

    this.renderCenteredCarousel(lessonNumber);

    return true;
  }

  renderCenteredCarousel(lessonNumber) {
    const directionClass = this.directionClass(lessonNumber);

    this.lockRecentering();
    this.activeLessonNumber = lessonNumber;
    this.track.classList.remove("lesson-carousel__track--slide-left", "lesson-carousel__track--slide-right");
    this.track.replaceChildren(...this.visibleLessons().map((lesson) => this.buildLessonCard(lesson)));
    void this.track.offsetWidth;
    this.track.classList.add(directionClass);
    this.updateLessonTitle();
    this.updateSelectors();
  }

  lockRecentering() {
    this.recenterLocked = true;

    window.setTimeout(() => {
      this.recenterLocked = false;
    }, this.RECENTER_COOLDOWN);
  }

  visibleLessons() {
    return [-2, -1, 0, 1, 2].map((offset) => this.lessonAt(this.activeLessonNumber + offset));
  }

  lessonAt(lessonNumber) {
    const wrappedLessonNumber = ((lessonNumber - 1 + this.lessons.length) % this.lessons.length) + 1;

    return this.lessons[wrappedLessonNumber - 1];
  }

  buildLessonCard(lesson) {
    const card = document.createElement("a");
    const selected = lesson.number === this.activeLessonNumber;

    card.href = lesson.path;
    card.className = selected ? "lesson-card lesson-card--selected" : "lesson-card";
    card.dataset.lessonCarouselCard = "true";
    card.dataset.lessonNumber = lesson.number;
    card.setAttribute("aria-label", `Make lesson ${lesson.number} active: ${lesson.title}`);
    if (selected) card.setAttribute("aria-current", "true");

    card.append(
      this.buildImageFrame(lesson),
      this.buildTextElement("lesson-card__number", `Lesson ${lesson.number}`),
      this.buildTextElement("lesson-card__title", lesson.title)
    );

    return card;
  }

  buildImageFrame(lesson) {
    const imageFrame = document.createElement("span");
    const image = document.createElement("img");

    imageFrame.className = "lesson-card__image-frame";
    image.src = lesson.imageUrl;
    image.alt = "";
    image.className = "lesson-card__image";
    image.style.objectPosition = lesson.cropPosition;
    imageFrame.append(image);

    return imageFrame;
  }

  buildTextElement(className, text) {
    const element = document.createElement("span");

    element.className = className;
    element.textContent = text;

    return element;
  }

  updateLessonTitle() {
    if (!this.lessonTitle) return;

    this.lessonTitle.textContent = this.lessonAt(this.activeLessonNumber).title;
  }

  updateSelectors() {
    this.element.querySelectorAll("[data-lesson-carousel-selector]").forEach((selector) => {
      const selected = Number(selector.dataset.lessonNumber) === this.activeLessonNumber;

      selector.classList.toggle("lesson-dot--selected", selected);
      if (selected) {
        selector.setAttribute("aria-current", "true");
      } else {
        selector.removeAttribute("aria-current");
      }
    });
  }

  updateUrl(lessonNumber) {
    const url = new URL(window.location.href);

    url.searchParams.set("lesson", lessonNumber);
    window.history.replaceState({}, "", url);
  }

  directionClass(lessonNumber) {
    return this.lessonDistance(lessonNumber, this.activeLessonNumber) > 0
      ? "lesson-carousel__track--slide-right"
      : "lesson-carousel__track--slide-left";
  }

  lessonDistance(nextLessonNumber, currentLessonNumber) {
    const forwardDistance = (nextLessonNumber - currentLessonNumber + this.lessons.length) % this.lessons.length;
    const backwardDistance = (currentLessonNumber - nextLessonNumber + this.lessons.length) % this.lessons.length;

    return forwardDistance <= backwardDistance ? forwardDistance : -backwardDistance;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-lesson-carousel]").forEach((carousel) => {
    new LessonCarousel(carousel).connect();
  });

  document.querySelectorAll("[data-resource-modal]").forEach((modal) => {
    new ResourceModal(modal).connect();
  });
});

class ResourceModal {
  constructor(element) {
    this.element = element;
    this.title = element.querySelector("[data-resource-modal-title]");
    this.viewer = element.querySelector("[data-resource-modal-viewer]");
    this.closeButtons = element.querySelectorAll("[data-resource-modal-close]");
  }

  connect() {
    document.querySelectorAll("[data-resource-modal-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => this.open(trigger));
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener("click", this.close);
    });

    document.addEventListener("keydown", this.closeOnEscape);
  }

  open(trigger) {
    this.title.textContent = trigger.dataset.resourceTitle;
    this.viewer.src = trigger.dataset.resourceUrl;
    this.element.hidden = false;
    document.body.classList.add("resource-modal-open");
    this.element.querySelector("[data-resource-modal-close]").focus();
  }

  close = () => {
    this.element.hidden = true;
    this.viewer.removeAttribute("src");
    document.body.classList.remove("resource-modal-open");
  };

  closeOnEscape = (event) => {
    if (event.key !== "Escape") return;
    if (this.element.hidden) return;

    this.close();
  };
}
