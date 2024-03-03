# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

-   `cy.solidAuthorize()` command.
-   Javascript evaluation in replacement templates, with `now()`, `date('2024-03-03')`, and `uuid()` helpers.

## [v0.1.3](https://github.com/NoelDeMartin/cypress-solid/releases/tag/v0.1.3) - 2024-01-13

### Fixed

-   Support types.

## [v0.1.2](https://github.com/NoelDeMartin/cypress-solid/releases/tag/v0.1.2) - 2023-12-22

### Changed

-   Type declarations for `cypress-solid/config` have been changed to avoid referencing source files.

## [v0.1.1](https://github.com/NoelDeMartin/cypress-solid/releases/tag/v0.1.1) - 2023-12-22

### Added

-   Improved error messages.

### Deprecated

-   `CustomCommands` and `commands` exports have been renamed to `CustomSolidCommands` and `solidCommands`, to avoid conflicts with other plugins.

### Fixed

-   Type declarations for `cypress-solid/config`.

## [v0.1.0](https://github.com/NoelDeMartin/cypress-solid/releases/tag/v0.1.0) - 2023-12-22

### Added

-   Everything!
