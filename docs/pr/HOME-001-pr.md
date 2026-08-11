# Summary

## What changed

- Added the public homepage route, controller, service object, view, and styling.
- Added a generated raster banner image for the Sunday school visual theme.
- Added 50 lesson selections with 5 visible carousel cards and a centered highlighted lesson.
- Added carousel hover/focus highlight behavior and click-only movement that recenters the clicked lesson with left/right slide animation.
- Added left-side resource links with modal PDF viewing for table of content, copyright, and curriculum notes samples.
- Added controller tests and homepage documentation.
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
- `timeout 8s bin/rails server -p 3001`
- `ruby -c app/services/home_page_content_service.rb`
- `ruby -c app/controllers/home_controller.rb`
- `ruby -c test/controllers/home_controller_test.rb`
- `ruby -Iapp/services -e 'require "home_page_content_service"; ...'`

`bin/rails test` was attempted after the boot fix. Rails now boots, but the test database connection fails because PostgreSQL role `einram` does not exist. `bundle exec rspec` was attempted because project instructions request it, but RSpec is not included in this bundle.

## Screenshots (if applicable)

Not captured.

## Deployment Notes

Ensure the new asset in `app/assets/images/sunday-school-banner.png` is included in the deployment artifact.

## Rollback Plan

Revert the homepage route, controller, service, view, stylesheet additions, tests, docs, and banner asset.
