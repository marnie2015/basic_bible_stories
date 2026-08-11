const DEFAULT_SELECTED_LESSON = 25;
const RECENTER_COOLDOWN = 220;
const SWIPE_THRESHOLD = 44;
const MAX_SWIPE_STEPS = 2;
const SWIPE_VERTICAL_TOLERANCE = 1.35;

const lessonTitles = [
  "Creation Begins",
  "Noah Builds the Ark",
  "God's Promise Rainbow",
  "Abraham Follows God",
  "Sarah's Joyful News",
  "Isaac Learns Trust",
  "Jacob's Ladder Dream",
  "Joseph's Colorful Coat",
  "Joseph Forgives",
  "Baby Moses Is Safe",
  "Moses and the Burning Bush",
  "The Red Sea Opens",
  "Manna in the Desert",
  "The Ten Commandments",
  "Joshua and Jericho",
  "Ruth Shows Kindness",
  "Samuel Listens",
  "David the Shepherd",
  "David and Goliath",
  "Solomon Asks for Wisdom",
  "Elijah Prays",
  "Naaman Is Healed",
  "Queen Esther Is Brave",
  "Daniel Prays",
  "Daniel in the Lions' Den",
  "Jonah Learns Mercy",
  "The Good Shepherd",
  "The Good Samaritan",
  "The Lost Sheep",
  "The Prodigal Son",
  "Jesus Welcomes Children",
  "Jesus Feeds Five Thousand",
  "Jesus Calms the Storm",
  "The Wise Builder",
  "The Mustard Seed",
  "The Sower",
  "The Thankful Leper",
  "Zacchaeus Climbs a Tree",
  "Mary and Martha",
  "The Little Children",
  "The Widow's Gift",
  "Palm Sunday",
  "The Last Supper",
  "The Empty Tomb",
  "Breakfast by the Sea",
  "Peter Is Forgiven",
  "The Road to Emmaus",
  "Pentecost Joy",
  "Paul's Bright Light",
  "Love One Another"
];

const cropPositions = [
  "8% 50%",
  "18% 48%",
  "28% 52%",
  "38% 50%",
  "48% 46%",
  "58% 54%",
  "68% 50%",
  "78% 48%",
  "88% 52%",
  "96% 50%"
];

const lessons = lessonTitles.map((title, index) => ({
  number: index + 1,
  title,
  cropPosition: cropPositions[index % cropPositions.length],
  coloredImageUrl: `images/colored/lesson-${(index % 10) + 1}-colored.png`,
  path: `?lesson=${index + 1}`
}));

class LessonCarousel {
  constructor(element, activeLessonNumber) {
    this.element = element;
    this.track = null;
    this.activeLessonNumber = activeLessonNumber;
    this.imageSet = element.dataset.carouselImageSet || "colored";
    this.recenterLocked = false;
    this.swipeStartX = null;
    this.swipeStartY = null;
    this.swipePointerId = null;
    this.isSwipeDragging = false;
    this.ignoreNextClick = false;
  }

  connect() {
    this.renderShell();
    this.renderCenteredCarousel(this.activeLessonNumber, false);
    this.element.addEventListener("click", this.activateClickedLesson);
    this.track.addEventListener("pointerdown", this.startSwipe);
    this.track.addEventListener("pointermove", this.moveSwipe);
    this.track.addEventListener("pointerup", this.finishSwipe);
    this.track.addEventListener("pointercancel", this.cancelSwipe);
    document.addEventListener("lesson-carousel:lesson-selected", this.activateSyncedLesson);
  }

  renderShell() {
    const heading = document.createElement("div");
    const eyebrow = document.createElement("p");
    const title = document.createElement(this.element.dataset.carouselHeadingLevel || "h2");
    const viewport = document.createElement("div");
    const track = document.createElement("div");

    heading.className = "lesson-carousel__heading";
    eyebrow.className = "lesson-carousel__eyebrow";
    eyebrow.textContent = this.element.dataset.carouselEyebrow;
    title.className = "lesson-carousel__title";
    title.id = this.element.dataset.carouselHeadingId;
    title.textContent = this.element.dataset.carouselTitle;
    viewport.className = "lesson-carousel__viewport";
    track.className = "lesson-carousel__track";
    track.setAttribute("aria-label", this.element.dataset.carouselLabel);
    track.dataset.lessonCarouselTrack = "true";

    heading.append(eyebrow, title);
    viewport.append(track);
    this.element.replaceChildren(heading, viewport);
    this.track = track;
  }

  activateClickedLesson = (event) => {
    if (this.ignoreNextClick) {
      event.preventDefault();
      this.ignoreNextClick = false;
      return;
    }

    const activator = event.target.closest("[data-lesson-carousel-card]");
    if (!activator) return;

    event.preventDefault();
    const lessonNumber = Number(activator.dataset.lessonNumber);

    if (this.activateLesson(lessonNumber)) {
      this.updateUrl(lessonNumber);
      this.broadcastLessonSelection(lessonNumber);
    }
  };

  startSwipe = (event) => {
    if (!event.isPrimary) return;

    this.swipeStartX = event.clientX;
    this.swipeStartY = event.clientY;
    this.swipePointerId = event.pointerId;
  };

  moveSwipe = (event) => {
    if (this.swipePointerId !== event.pointerId) return;

    const swipeDistanceX = event.clientX - this.swipeStartX;
    const swipeDistanceY = event.clientY - this.swipeStartY;

    if (!this.isPotentialHorizontalSwipe(swipeDistanceX, swipeDistanceY)) return;

    event.preventDefault();
    this.captureSwipePointer(event.pointerId);
    this.track.style.setProperty("--carousel-drag-offset", `${this.limitedDragOffset(swipeDistanceX)}px`);
  };

  finishSwipe = (event) => {
    if (this.swipePointerId !== event.pointerId) return;

    const swipeDistanceX = event.clientX - this.swipeStartX;
    const swipeDistanceY = event.clientY - this.swipeStartY;

    this.cancelSwipe();
    if (!this.isHorizontalSwipe(swipeDistanceX, swipeDistanceY)) return;

    this.ignoreNextClick = true;
    event.preventDefault();
    this.activateAdjacentLesson(this.swipeLessonOffset(swipeDistanceX));
  };

  cancelSwipe = () => {
    if (this.swipePointerId !== null && this.track.hasPointerCapture(this.swipePointerId)) {
      this.track.releasePointerCapture(this.swipePointerId);
    }

    this.swipeStartX = null;
    this.swipeStartY = null;
    this.swipePointerId = null;
    this.isSwipeDragging = false;
    this.track.classList.remove("lesson-carousel__track--dragging");
    this.track.style.removeProperty("--carousel-drag-offset");
  };

  captureSwipePointer(pointerId) {
    if (this.isSwipeDragging) return;

    this.isSwipeDragging = true;
    this.track.setPointerCapture(pointerId);
    this.track.classList.add("lesson-carousel__track--dragging");
  }

  isHorizontalSwipe(swipeDistanceX, swipeDistanceY) {
    return Math.abs(swipeDistanceX) >= SWIPE_THRESHOLD &&
      Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) * SWIPE_VERTICAL_TOLERANCE;
  }

  isPotentialHorizontalSwipe(swipeDistanceX, swipeDistanceY) {
    return Math.abs(swipeDistanceX) > 8 &&
      Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) * SWIPE_VERTICAL_TOLERANCE;
  }

  limitedDragOffset(swipeDistanceX) {
    const dragLimit = this.cardStepWidth() * MAX_SWIPE_STEPS;

    return Math.max(-dragLimit, Math.min(dragLimit, swipeDistanceX));
  }

  swipeLessonOffset(swipeDistanceX) {
    const direction = swipeDistanceX < 0 ? 1 : -1;
    const draggedSteps = Math.round(Math.abs(swipeDistanceX) / this.cardStepWidth());
    const stepCount = Math.max(1, Math.min(MAX_SWIPE_STEPS, draggedSteps));

    return direction * stepCount;
  }

  cardStepWidth() {
    const firstCard = this.track.querySelector(".lesson-card");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const columnGap = Number.parseFloat(window.getComputedStyle(this.track).columnGap);
    const gap = Number.isNaN(columnGap) ? 0 : columnGap;

    return Math.max(SWIPE_THRESHOLD, cardWidth + gap);
  }

  activateAdjacentLesson(offset) {
    const lessonNumber = this.lessonAt(this.activeLessonNumber + offset).number;

    if (this.activateLesson(lessonNumber)) {
      this.updateUrl(lessonNumber);
      this.broadcastLessonSelection(lessonNumber);
    }
  }

  activateSyncedLesson = (event) => {
    this.activateLesson(event.detail.lessonNumber);
  };

  activateLesson(lessonNumber) {
    if (this.recenterLocked) return false;
    if (lessonNumber === this.activeLessonNumber) return false;

    this.renderCenteredCarousel(lessonNumber, true);

    return true;
  }

  renderCenteredCarousel(lessonNumber, animate) {
    const directionClass = this.directionClass(lessonNumber);

    if (animate) this.lockRecentering();
    this.activeLessonNumber = lessonNumber;
    this.track.classList.remove("lesson-carousel__track--slide-left", "lesson-carousel__track--slide-right");
    this.track.replaceChildren(...this.visibleLessons().map((lesson) => this.buildLessonCard(lesson)));
    if (animate) {
      void this.track.offsetWidth;
      this.track.classList.add(directionClass);
    }
  }

  lockRecentering() {
    this.recenterLocked = true;
    window.setTimeout(() => {
      this.recenterLocked = false;
    }, RECENTER_COOLDOWN);
  }

  visibleLessons() {
    return [-3, -2, -1, 0, 1, 2, 3].map((offset) => this.lessonAt(this.activeLessonNumber + offset));
  }

  lessonAt(lessonNumber) {
    const wrappedLessonNumber = ((lessonNumber - 1 + lessons.length) % lessons.length) + 1;

    return lessons[wrappedLessonNumber - 1];
  }

  buildLessonCard(lesson) {
    const card = document.createElement("article");
    const selector = document.createElement("button");
    const selected = lesson.number === this.activeLessonNumber;

    card.className = selected ? "lesson-card lesson-card--selected" : "lesson-card";
    selector.type = "button";
    selector.className = "lesson-card__select";
    selector.dataset.lessonCarouselCard = "true";
    selector.dataset.lessonNumber = lesson.number;
    selector.setAttribute("aria-label", `Make lesson ${lesson.number} active: ${lesson.title}`);
    if (selected) selector.setAttribute("aria-current", "true");

    selector.append(
      this.buildImageFrame(lesson),
      this.buildTextElement("lesson-card__number", `Lesson ${lesson.number}`)
    );

    card.append(selector);

    return card;
  }

  buildImageFrame(lesson) {
    const imageFrame = document.createElement("span");
    const image = document.createElement("img");

    imageFrame.className = "lesson-card__image-frame";
    image.src = this.imageUrlForLesson(lesson);
    image.alt = "";
    image.className = "lesson-card__image";
    image.draggable = false;
    image.style.objectPosition = lesson.cropPosition;
    imageFrame.append(image);

    return imageFrame;
  }

  imageUrlForLesson(lesson) {
    return lesson.coloredImageUrl;
  }

  buildTextElement(className, text) {
    const element = document.createElement("span");

    element.className = className;
    element.textContent = text;

    return element;
  }

  updateUrl(lessonNumber) {
    const url = new URL(window.location.href);

    url.searchParams.set("lesson", lessonNumber);
    window.history.replaceState({}, "", url);
  }

  broadcastLessonSelection(lessonNumber) {
    document.dispatchEvent(
      new CustomEvent("lesson-carousel:lesson-selected", {
        detail: { lessonNumber }
      })
    );
  }

  directionClass(lessonNumber) {
    return this.lessonDistance(lessonNumber, this.activeLessonNumber) > 0
      ? "lesson-carousel__track--slide-right"
      : "lesson-carousel__track--slide-left";
  }

  lessonDistance(nextLessonNumber, currentLessonNumber) {
    const forwardDistance = (nextLessonNumber - currentLessonNumber + lessons.length) % lessons.length;
    const backwardDistance = (currentLessonNumber - nextLessonNumber + lessons.length) % lessons.length;

    return forwardDistance <= backwardDistance ? forwardDistance : -backwardDistance;
  }
}

class ResourceModal {
  constructor(element) {
    this.element = element;
    this.title = element.querySelector("[data-resource-modal-title]");
    this.viewer = element.querySelector("[data-resource-modal-viewer]");
    this.closeButtons = element.querySelectorAll("[data-resource-modal-close]");
    this.currentPdfUrl = null;
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
    const documentData = resourceDocuments[trigger.dataset.resourceKey];

    this.title.textContent = documentData.title;
    this.currentPdfUrl = createPdfUrl(documentData);
    this.viewer.src = this.currentPdfUrl;
    this.element.hidden = false;
    document.body.classList.add("resource-modal-open");
    this.element.querySelector("[data-resource-modal-close]").focus();
  }

  close = () => {
    this.element.hidden = true;
    this.viewer.removeAttribute("src");
    document.body.classList.remove("resource-modal-open");
    if (this.currentPdfUrl) URL.revokeObjectURL(this.currentPdfUrl);
    this.currentPdfUrl = null;
  };

  closeOnEscape = (event) => {
    if (event.key !== "Escape") return;
    if (this.element.hidden) return;

    this.close();
  };
}

const resourceDocuments = {
  "table-of-content": {
    title: "Table of Contents",
    lines: [
      "Basic Bible Stories",
      "Sample Table of Contents",
      "1. Welcome and Opening Prayer",
      "2. Bible Story Reading",
      "3. Picture Talk and Questions",
      "4. Memory Truth",
      "5. Activity and Take-Home Practice"
    ]
  },
  copyright: {
    title: "Copyright",
    lines: [
      "Basic Bible Stories",
      "Sample Copyright Notice",
      "This placeholder PDF represents future copyright details.",
      "Teachers may preview lessons for classroom planning.",
      "Replace this sample with the final legal document before release."
    ]
  },
  "curriculum-notes": {
    title: "Curriculum Notes",
    lines: [
      "Basic Bible Stories",
      "Sample Curriculum Notes",
      "Use short story segments for younger children.",
      "Invite children to retell the lesson with picture prompts.",
      "Close with one simple practice for the week."
    ]
  }
};

function createPdfUrl(documentData) {
  const pdf = buildPdf(documentData.lines);
  const blob = new Blob([pdf], { type: "application/pdf" });

  return URL.createObjectURL(blob);
}

function buildPdf(lines) {
  const stream = lines.map((line, index) => {
    const fontSize = index === 0 ? 24 : 14;
    const yPosition = 720 - index * 34;

    return `/F1 ${fontSize} Tf 72 ${yPosition} Td (${escapePdfText(line)}) Tj`;
  }).join("\n");
  const content = `BT\n${stream}\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((object, index) => {
    const offset = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;

    return offset;
  });
  const xrefOffset = pdf.length;

  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

function escapePdfText(text) {
  return text.replace(/[\\()]/g, (character) => `\\${character}`);
}

function selectedLessonFromUrl() {
  const lessonNumber = Number(new URLSearchParams(window.location.search).get("lesson"));

  return lessonNumber >= 1 && lessonNumber <= lessons.length ? lessonNumber : DEFAULT_SELECTED_LESSON;
}

document.addEventListener("DOMContentLoaded", () => {
  const activeLessonNumber = selectedLessonFromUrl();

  document.querySelectorAll("[data-lesson-carousel]").forEach((carousel) => {
    new LessonCarousel(carousel, activeLessonNumber).connect();
  });

  document.querySelectorAll("[data-resource-modal]").forEach((modal) => {
    new ResourceModal(modal).connect();
  });
});
