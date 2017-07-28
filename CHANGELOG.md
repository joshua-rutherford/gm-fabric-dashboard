# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2017-07-28
### Added
- Added preliminary docker-compose infrastructure for developing against Envoy and a timeseries database
- Added breadcrumbs and a new bar at the top of the main view
- Added summary and instance links (currently mocked out) at the top of the new sidebar

### Changed
- Replaced horizontal nav with vertical sidebar style nav
- Nav cards now place metrics and sparklines in a drawer that can be collapsed or opened
- Nav cards now can render icons from UIKit 3
- Moved settings to an icon at the new bar at the top of the main view
- Restored active nav highlighting regression introduced by React Router v4 update
- Updated README with new information about use of Docker during development

### Test Coverage: 3.7% ([0.2.0 Coverage Report])

## [0.1.1] - 2017-07-21
### Added
- Added Prettier with default settings, refactored all source JS code, and set a pre-commit hook for Prettier and stylelint
- Add text to README about a workaround if Jest fails test unexpectedly

### Changed
- Updated the CircleCI config to follow version 2 standards
- Changed from `jest-junit-reporter` to `jest-junit` an alternate junior formatter for Jest test results
- Changed the production build process and tooling to fix issues with deep React Router routes interfering with JS bundle loading
- Updated `react-scripts` to 1.0.10
- Resolved outstanding ESLINT errors

### Removed
- Removed static React components built for Grey Matter Fabric golang microservices
- Removed ESLint rules that are now handled by Prettier

### Test Coverage: 4% ([0.1.1 Coverage Report])

## [0.1.0] - 2017-07-18
### Added
- Generated app using Create React App, adding Redux, React-Redux, React-Router, Jumpstate, UIKit 3, Recharts, Sparklines, less, stylelint
- Added scraper to ingest metrics from a Finagle metrics.json file complete with user configurable period.
- Created various utility functions to manipulate timeseries data.
- Created a system for generating dashboards from state persisted as JSON
- Created a general purpose grid system that allows resize-able drag-and-dropable chart
- Created a handful of generate purpose charts
- Created hand-crafted charts and dashboards for summary metrics, routes, and stack traces
- Created a general-purpose Explorer that displays a line chart for any arbitrary metric
- Wrote several unit tests
- Created a CircleCI CI pipeline with JUNIT reporting and Istanbul code coverage reporting
- Created BASH deployment scripts that allow for nesting in a deep route
- Wrote a README explaining how to use the dashboard

### Test Coverage: 2%

[Unreleased]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.2.0...v0.1.1
[0.2.0 Coverage Report]: https://309-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.1.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.1.1...v0.1.0
[0.1.1 Coverage Report]: https://258-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.1.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/5a0e78...v0.1.0
