# Summary

## What changed

- Added an extractable static homepage under `public/homepage`.
- Pointed Rails root to the static homepage.
- Added a generated raster banner image for the Sunday school visual theme.
- Added 50 lesson selections with 5 visible carousel cards and a centered highlighted lesson.
- Added carousel hover/focus highlight behavior and click-only movement that recenters the clicked lesson with left/right slide animation.
- Added swipe gestures for moving carousel lessons left and right.
- Added drag feedback and pointer capture so carousel swipes feel like a spinning wheel interaction.
- Rendered hidden side cards inside a clipped viewport to make swiping smoother.
- Added vertical viewport breathing room and dimmed inactive cards to prevent active-card clipping.
- Delayed pointer capture until horizontal drag intent is clear so click-to-active still works.
- Made carousel swipes distance-aware so longer drags can land on the far visible card instead of always moving a single lesson.
- Added a second synchronized colored-image carousel below the main lesson carousel.
- Wrapped both carousel sections in one shared background area.
- Moved Lessons artwork to the left of the realistic carousel and Features artwork to the right.
- Moved Lessons and Features artwork above the realistic carousel so the artwork is the primary visual focus.
- Rebalanced the realistic carousel row so the carousel is larger and the side artwork is slightly smaller.
- Removed the lesson-content section below the payment package.
- Matched colored carousel sizing to the realistic carousel and tightened carousel image spacing.
- Reduced both carousel sizes so the Lessons and Features artwork can display larger.
- Renamed the carousel headings to "Realistic Image Previews" and "Colored Image Previews" with smaller title styling.
- Moved resource links to the left side of the colored carousel.
- Moved resource links beside the realistic carousel.
- Added a centered whole-lesson payment package image below the feature artwork.
- Added the stamp artwork beside the payment package image.
- Moved the stamp artwork onto the whitespace area of the Lessons artwork.
- Added an "I Want to Avail These Lessons" purchase button.
- Increased carousel spacing so the enlarged active card has breathing room from non-active cards.
- Reserved the top carousel for realistic lesson images and pointed it to the banner placeholder until those images are available.
- Updated the lower carousel cards to use full-color static assets from `public/homepage/images/colored`.
- Added left-side resource links with modal PDF viewing for table of content, copyright, and curriculum notes samples generated in browser JavaScript.
- Added integration tests and homepage documentation.
- Removed unused `image_processing` dependency to avoid loading incompatible local `libvips` during Rails boot.

## Why

The application needs an inviting child-friendly homepage that presents Sunday school lessons with a warm Bible-age cartoon theme.

## Database Changes

None.

## Breaking Changes

None.

## Testing Performed

- `bin/rubocop`
- `bin/brakeman`
- `bin/rails test`
- `bundle exec rubocop`
- `bundle exec brakeman`
- `node --check public/homepage/app.js`

`bundle exec rspec` is not available because RSpec is not included in this bundle.

## Screenshots (if applicable)

Not captured.

## Deployment Notes

Ensure the `public/homepage` directory is included in the deployment artifact.

## Rollback Plan

Revert the static homepage directory, root redirect, tests, docs, and copied assets.
