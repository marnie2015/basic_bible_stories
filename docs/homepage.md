# Overview

The homepage introduces Basic Bible Stories with a warm cartoon Bible-age visual style for children and Sunday school teachers. It provides a single horizontal banner image, a focused five-item lesson carousel backed by 50 lesson selections, a lesson content section, and a footer.

| Area | Purpose |
| --- | --- |
| Banner | Establishes the child-friendly Bible story setting immediately. |
| Carousel | Lets teachers or children choose from 50 Sunday school lesson images while only showing 5 at a time. |
| Resource Rail | Provides left-side links for table of content, copyright, and curriculum notes PDFs. |
| Lesson Content | Shows the selected lesson title and practical teaching notes. |
| Footer | Provides a simple brand close for the page. |

# Requirements

- Display one horizontal banner image at the top of the homepage.
- Provide 50 selectable lesson image entries.
- Show only 5 lesson images in the carousel viewport on desktop.
- Keep the selected lesson centered and visually larger than the two images on each side.
- Highlight carousel lesson images on hover or focus without changing the active lesson.
- Make clicked lesson images become the active centered carousel display with a left or right sliding animation.
- Show left-side links for table of content, copyright, and curriculum notes.
- Open each left-side link in a modal with an embedded PDF viewer.
- Show Sunday school lesson content and the selected lesson title below the carousel.
- Include a footer.
- Use a warm brown, Bible-age, cartoon style suitable for children.

# Business Rules

- The selected lesson must be between 1 and 50.
- Invalid lesson selections fall back to lesson 25.
- The carousel wraps around lesson boundaries so lesson 1 can show lessons 49 and 50 on the left.
- A lesson image or numbered selector click updates the active lesson and the `lesson` query parameter.
- Resource links open a PDF modal without leaving the homepage.
- Pressing Escape or the close button closes the PDF modal.
- The homepage is public and does not require authentication.

# Technical Design

- `HomeController#show` renders the homepage.
- `HomePageContentService` owns static lesson data, selected lesson normalization, and visible carousel lesson calculation.
- `app/views/home/show.html.erb` renders the banner, carousel, lesson content, and footer.
- `app/assets/images/sunday-school-banner.png` stores the generated raster banner asset.
- `app/assets/stylesheets/application.css` contains the responsive homepage styling, carousel hover animation, active lesson glow, and reduced-motion fallback.
- `app/assets/javascripts/home_carousel.js` recenters the five-card carousel around the clicked lesson, updates the lesson title and URL, and keeps link navigation as a no-JavaScript fallback.
- `ResourceDocumentsController#show` serves inline sample PDF documents.
- `SampleResourcePdfService` generates simple placeholder PDFs for the modal viewer.
- No database changes, background jobs, or external APIs are required at runtime.

# Flow

1. A visitor opens `/`.
2. Rails routes the request to `HomeController#show`.
3. The controller calls `HomePageContentService` with the optional `lesson` parameter.
4. The service returns all 50 lesson selections, the selected lesson, and the 5 visible carousel lessons.
5. The view renders the selected lesson in the center with larger styling.
6. Hovering or focusing a lesson card only highlights it visually.
7. Clicking a lesson recenters the five-card carousel around that lesson with a left or right slide animation and updates the `lesson` query parameter.
8. Clicking a resource rail link opens a modal and loads the matching sample PDF in an iframe.

# API

## Endpoint

`GET /`

## Request Examples

```http
GET /
GET /?lesson=1
GET /resource-documents/table-of-content.pdf
```

## Response Examples

```http
200 OK
```

The homepage response is HTML. Resource document responses are inline PDFs.

# Testing

- Controller tests verify the banner, 5 visible carousel cards, 50 selectors, selected lesson content, and invalid lesson fallback.
- Controller tests verify resource modal hooks and sample PDF responses.
- Manual testing should confirm responsive layout at desktop and mobile widths, hover highlight behavior, and click-to-active carousel movement.

# Future Improvements

- None currently planned for this feature.
