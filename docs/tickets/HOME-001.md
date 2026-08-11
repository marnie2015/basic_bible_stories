# Ticket Summary

Create the public homepage for Basic Bible Stories.

# Background

The app needs a welcoming first screen for a Sunday school Bible stories experience. The design should feel warm, Bible-age inspired, and cartoon-friendly for children.

# Acceptance Criteria

- [x] A single horizontal banner image appears at the top.
- [x] A lesson carousel supports 50 selectable images.
- [x] The carousel shows 5 images on desktop.
- [x] The selected carousel image is centered and larger than the side images.
- [x] Lesson content and selected lesson title appear below the carousel.
- [x] A footer appears at the bottom.
- [x] Homepage documentation is created.

# Technical Notes

- Use a thin Rails controller.
- Keep homepage content construction in a service object.
- Use local assets for the banner image.

# Dependencies

- Rails asset pipeline.

# Risks

- The carousel uses one generated image asset with different crop positions instead of 50 unique illustration files.

# Out of Scope

- Admin editing for lesson content.
- Database-backed lessons.
- JavaScript carousel animation.
