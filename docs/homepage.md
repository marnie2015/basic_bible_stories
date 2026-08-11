# Overview

The homepage introduces Basic Bible Stories with a warm cartoon Bible-age visual style for children and Sunday school teachers. It is implemented as extractable static HTML, CSS, and JavaScript under `public/homepage`, so it can run without Ruby on Rails.

| Area | Purpose |
| --- | --- |
| Banner | Establishes the child-friendly Bible story setting immediately. |
| Feature Artwork | Shows the lesson and feature artwork above the realistic image preview carousel as the visual focus, with the stamp overlayed on the lesson artwork. |
| Realistic Images Carousel | Shows the resource links beside a supporting carousel below the featured lesson and feature artwork. |
| Colored Images Carousel | Shows the full-color illustrated carousel below the realistic preview area. |
| Payment Package Images | Shows the whole-lesson payment package and purchase button after the feature artwork. |
| Resource Rail | Provides left-side links for table of content, copyright, and curriculum notes sample PDFs. |
| Footer | Provides a simple brand close for the page. |

# Requirements

- Display one horizontal banner image at the top of the homepage.
- Provide 50 selectable lesson entries.
- Reserve the top carousel for future realistic lesson images.
- Use `public/homepage/images/banner_header.png` as the homepage banner.
- Display `public/homepage/images/lessons.png` above the realistic carousel.
- Display `public/homepage/images/features.png` above the realistic carousel.
- Keep the artwork prominent by sizing both carousel areas smaller and consistently.
- Label the top carousel as "Realistic Image Previews" with a small heading.
- Label the lower carousel as "Colored Image Previews" with a small heading.
- Display the resource links on the left side of the realistic carousel.
- Keep the colored carousel centered below the realistic preview area.
- Display `public/homepage/images/300.png` as a centered payment package section for the whole lesson.
- Display `public/homepage/images/stamp.png` on the whitespace area of `public/homepage/images/lessons.png`.
- Display an "I Want to Avail These Lessons" purchase button.
- Use `public/homepage/images/colored` for the bottom colored carousel image cards.
- Show only 5 lesson images in each carousel viewport on desktop while rendering hidden side cards for smoother swiping.
- Use one shared background area for both carousel sections.
- Display carousel thumbnails in an upright portrait ratio that follows the colored image assets.
- Show a second matching carousel for full-color illustrated images below the realistic carousel.
- Keep the selected lesson centered and visually larger than the two images on each side.
- Keep both carousels the same compact size and preserve space around the enlarged active image.
- Dim inactive carousel cards so the active image is emphasized without being clipped.
- Highlight carousel lesson images on hover or focus without changing the active lesson.
- Make clicked lesson images become the active centered carousel display with a left or right sliding animation.
- Support left and right swipe or drag gestures on carousel tracks to move between lessons.
- Show left-side links for table of content, copyright, and curriculum notes.
- Open each left-side link in a modal with an embedded sample PDF viewer.
- Include a footer.

# Business Rules

- The selected lesson must be between 1 and 50.
- Invalid lesson selections fall back to lesson 25.
- The carousel wraps around lesson boundaries.
- A lesson image or lesson number click updates both carousels and the `lesson` query parameter.
- A normal click activates a carousel image; a horizontal drag captures the pointer only after drag intent is clear, then moves the 7-card track inside a clipped 5-card viewport.
- A short carousel swipe advances one lesson, while a longer drag can jump to the outer visible lesson on that side.
- Resource links open a PDF modal without leaving the homepage.
- Pressing Escape or the close button closes the PDF modal.

# Technical Design

- `public/homepage/index.html` contains static markup.
- `public/homepage/styles.css` contains all homepage styles.
- `public/homepage/app.js` builds both carousels, synchronizes lesson selection, updates the URL, and generates sample PDF blobs for the modal.
- `public/homepage/images/banner_header.png` stores the banner asset.
- `public/homepage/images/features.png` and `public/homepage/images/lessons.png` store artwork displayed above the realistic carousel.
- `public/homepage/images/300.png` stores the centered whole-lesson payment package artwork.
- `public/homepage/images/stamp.png` stores the stamp artwork overlayed on the lesson-includes image.
- The purchase button currently uses a placeholder `#` link until the final checkout URL is available.
- The realistic carousel currently reuses the colored lesson images because final realistic lesson images are not available yet.
- `public/homepage/images/colored` stores full-color carousel images using `lesson-<number>-colored.png` filenames.
- Carousel image frames use a `12 / 17` portrait ratio based on the current colored image dimensions.
- The current 10 colored images are cycled across all 50 lesson entries in the colored carousel.
- Rails root redirects to `/homepage/index.html`; the homepage itself does not use Rails helpers, ERB, controllers, or services.

# Flow

1. A visitor opens `/homepage/index.html` directly, or opens `/` in Rails and is redirected there.
2. `app.js` reads the `lesson` query parameter or defaults to lesson 25.
3. `app.js` builds the realistic and colored carousel sections from static arrays.
4. The selected lesson renders in the center with larger styling.
5. Hovering or focusing a lesson card only highlights it visually.
6. Clicking a lesson image or lesson number recenters both carousels and updates the URL.
7. Swiping left or right on a carousel track moves one or two lessons based on drag distance and updates both carousels.
8. Clicking a resource rail link opens a modal and loads a client-generated sample PDF blob in an iframe.

# API

## Endpoints

```http
GET /
GET /homepage/index.html
GET /homepage/index.html?lesson=1
```

The homepage response is static HTML. Resource PDF samples are generated in the browser.

# Testing

- Integration tests verify root redirect and static HTML/CSS/JS file serving.
- Manual testing should confirm responsive layout, hover highlight behavior, click-to-active carousel movement, full-color lower carousel images, modal PDF viewing, and static extraction.

# Future Improvements

- Replace placeholder PDF generation with final static PDF files when content is ready.
