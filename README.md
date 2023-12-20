# Cypress Solid ![CI](https://github.com/NoelDeMartin/cypress-solid/actions/workflows/ci.yml/badge.svg)

Cypress Plugin to test applications using the [Solid Protocol](https://solidproject.org/).

## Installation

Install the package using npm:

```sh
npm install cypress-solid --save-dev
```

Once it is installed, you'll need to call it in your support file. For example, in `cypress/support/e2e.ts`:

```ts
import 'cypress-solid/support';
```

You'll also need to set up the node events in the configuration. For example, in `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress';
import { setupSolidNodeEvents } from 'cypress-solid/config';

export default defineConfig({
    e2e: {
        setupNodeEvents: setupSolidNodeEvents,
    },
});
```

### Solid Server

This plugin assumes that you have an instance of the [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer) running (with version 7.0.0 or newer).

To install it, you can run the following command:

```sh
npm install @solid/community-server@^7 --save-dev
```

The server must be running whilst Cypress tests your application, so you may want to use something like the `start-server-and-test` and `concurrently` packages to launch both your application and the server. For example, you can configure the following scripts in your `package.json`:

```json
"scripts": {
    "cy:dev": "concurrently --kill-others \"npm run test:serve-app\" \"npm run test:serve-pod\" \"npm run cy:open\"",
    "cy:open": "cypress open --e2e --browser chromium",
    "cy:run": "cypress run",
    "cy:test": "start-server-and-test test:serve-app http-get://localhost:5001 test:serve-pod http-get://localhost:3000 cy:run",
    "test:serve-app": "vite --port 5001",
    "test:serve-pod": "community-solid-server -p 3000 -l warn"
}
```

With these, you should be able to run your Cypress tests with `npm run cy:test`, or open the Cypress UI for local development with `npm run cy:dev`.

In this example, the application is served using [Vite](https://vitejs.dev/), but you should be able to use the same approach for any other tools. You can learn more about this in the official Cypress documentation: [Boot your server](https://docs.cypress.io/guides/continuous-integration/introduction#Boot-your-server).

The default configuration assumes that the server is running on `http://localhost:3000`, but you can customize this behaviour changing the [`serverUrl` config option](#configuration).

## Basic Usage

In tests where you want to interact with the Solid server, you should call `cy.solidReset()` before starting. It is important to [do it before, and not after](https://docs.cypress.io/guides/references/best-practices#Using-after-Or-afterEach-Hooks), given that if the test fails or is closed unexpectedly, the clean up won't be executed.

This command will prepare the account in the server, and you can complete the log in form during the authentication process using the `cy.solidLogin()` command.

Finally, there are some helper functions you can use in order to get dynamic data at runtime, such as `webId()`. This is ideal to avoid hard-coding values that depend on the configuration.

Here's a full example illustrating the basic usage:

```ts
import { webId } from 'cypress-solid';

it('Logs in', () => {
    // Prepare the POD.
    cy.solidReset();

    // Open the application and trigger the log in process.
    cy.visit('/');
    cy.get('[aria-label="Login url"]').type(webId()).type('{enter}');

    // Log in to the POD.
    cy.solidLogin();

    // Continue with your test...
});
```

For a complete example with more advanced functionality, you can check out the [Cypress Solid Sandbox](https://github.com/NoelDeMartin/cypress-solid-sandbox/blob/main/cypress/e2e/sandbox.cy.ts) sample application.

## Configuration

In order to customize the plugin's behaviour, you can pass some configuration options to the `setupSolidNodeEvents` method:

```ts
import { defineConfig } from 'cypress';
import { setupSolidNodeEvents } from 'cypress-solid/config';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            setupSolidNodeEvents(on, config, {
                serverUrl: 'http://localhost:1234',
                account: 'bob',
                // ...
            });

            // IMPORTANT Return the updated config object.
            return config;
        },
    },
});
```

Here's the complete list of available options:

<!-- prettier-ignore-start -->
| Option    | Default                   | Description |
| --------- | ------------------------- | ----------- |
| serverUrl | `'http://localhost:3000'` | Url where the Solid server is running. |
| account   | `'alice'`                 | Account name, this will be used to create a new account in the Solid server. For example, `http://localhost:3000/alice/`. |
| name      | `'Alice Cooper'`          | Display name, this will be declared as `foaf:name` in the user's profile. |
| email     | `'alice@example.com'`     | Account email, this can be used to log in. |
| password  | `'secret'`                | Account password, this can be used to log in. |
<!-- prettier-ignore-end -->

## Commands

### `cy.fixtureWithReplacements(filePath, replacements)`

Loads a fixture file with [replacements](#replacements-and-wildcards) applied.

#### Arguments

<!-- prettier-ignore-start -->
| Name         | Default | Description |
| ------------ | ------- | ----------- |
| filePath     | -       | Fixture file path, relative to your [fixtures folder](https://docs.cypress.io/guides/references/configuration#Folders--Files). |
| replacements | `{}`    | Object with replacements to apply on the fixture. [Learn more about replacements](#replacements-and-wildcards). |
<!-- prettier-ignore-end -->

#### Yields

The contents of the fixture with the [replacements](#replacements-and-wildcards) applied.

### `cy.solidCreateContainer(path, name?)`

Creates a container in the POD.

#### Arguments

<!-- prettier-ignore-start -->
| Name | Default       | Description |
| ---- | ------------- | ----------- |
| path | -             | Relative container path. For example, to create a container at `http://localhost:3000/alice/tasks/`, you would use `'/tasks/'`. |
| name | `'Container'` | Container name, declared as `rdfs:label` in the document's metadata. |
<!-- prettier-ignore-end -->

#### Yields

Nothing.

### `cy.solidCreateDocument(path, fixture, replacements?)`

Creates a document in the POD.

#### Arguments

<!-- prettier-ignore-start -->
| Name         | Default       | Description |
| ------------ | ------------- | ----------- |
| path         | -             | Relative document path. For example, to create a document at `http://localhost:3000/alice/tasks/1`, you would use `'/tasks/1'`. |
| fixture      | -             | Cypress fixture path with the contents of the document in Turtle format. For example, for a fixture at `cypress/fixtures/task.ttl` you would use `'task.ttl'`. |
| replacements | `{}`          | Object with replacements to apply on the fixture before creating the document. [Learn more about replacements](#replacements-and-wildcards). |
<!-- prettier-ignore-end -->

#### Yields

Nothing.

### `cy.solidDeleteDocument(path)`

Deletes a document in the POD.

#### Arguments

<!-- prettier-ignore-start -->
| Name         | Default       | Description |
| ------------ | ------------- | ----------- |
| path         | -             | Relative document path. For example, to delete the document at `http://localhost:3000/alice/tasks/1`, you would use `'/tasks/1'`. |
<!-- prettier-ignore-end -->

#### Yields

Nothing.

### `cy.solidLogin()`

Authenticates using the test account indicated in [the configuration](#configuration). This command should be called once the authentication process has been started and the application has been redirected to the identity provider.

#### Arguments

None.

#### Yields

Nothing.

### `cy.solidReadDocument(path)`

Reads a document in the POD.

#### Arguments

<!-- prettier-ignore-start -->
| Name         | Default       | Description |
| ------------ | ------------- | ----------- |
| path         | -             | Relative document path. For example, to read the document at `http://localhost:3000/alice/tasks/1`, you would use `'/tasks/1'`. |
<!-- prettier-ignore-end -->

#### Yields

The contents of the Solid document in Turtle format.

### `cy.solidRequest(input, init?)`

Makes an authenticated request to the Solid server.

#### Arguments

Takes the same arguments as Node's built-in [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

#### Yields

An object with the following fields:

<!-- prettier-ignore-start -->
| Name         | Type | Description |
| ------------ | ---- | ----------- |
| headers      | [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | Response headers. |
| status       | `number` | Response status code. |
| statusText   | `string` | Response status message. |
| body         | `string` | Response body. |
<!-- prettier-ignore-end -->

### `cy.solidReset()`

Creates the account in the server if it didn't exist, and resets the content in the POD to its initial state.

#### Arguments

None.

#### Yields

Nothing.

### `cy.solidUpdateDocument(path, fixture, replacements?)`

Updates a document in the POD.

#### Arguments

<!-- prettier-ignore-start -->
| Name         | Default       | Description |
| ------------ | ------------- | ----------- |
| path         | -             | Relative document path. For example, to update a document at `http://localhost:3000/alice/tasks/1`, you would use `'/tasks/1'`. |
| fixture      | -             | Cypress fixture path with the SPARQL updates to apply in the document. For example, for a fixture at `cypress/fixtures/update-task.sparql` you would use `'update-task.sparql'`. |
| replacements | `{}`          | Object with replacements to apply on the fixture before creating the document. [Learn more about replacements](#replacements-and-wildcards). |
<!-- prettier-ignore-end -->

#### Yields

Nothing.

## Helpers

You can also use some of these helper functions in your tests. These should be imported directly from `cypress-solid`, like this:

```ts
import { webId } from 'cypress-solid';

it('See tasks container url', () => {
    cy.contains(podUrl('/tasks/'));
});
```

### `config(key?)`

Get [configuration](#configuration) values.

#### Arguments

<!-- prettier-ignore-start -->
| Name | Default | Description |
| ---- | ------- | ----------- |
| key  | -       | Name of the config value to (`serverUrl`, `account`, etc.). If this argument is omitted, the whole configuration object will be returned. |
<!-- prettier-ignore-end -->

#### Returns

Value of the configuration option if `key` was provided, or the entire configuration object otherwise.

### `podUrl(path?)`

Resolve relative paths in the test account to get the full url.

#### Arguments

<!-- prettier-ignore-start -->
| Name | Default | Description |
| ---- | ------- | ----------- |
| path | `''`    | Relative path of the url to resolve. |
<!-- prettier-ignore-end -->

#### Returns

Url for the given path. For example, for the `'/tasks/'` path with the default configuration you would get `'http://localhost:3000/alice/tasks/'`.

### `serverUrl(path?)`

Resolve relative paths in the server to get the full url.

#### Arguments

<!-- prettier-ignore-start -->
| Name | Default | Description |
| ---- | ------- | ----------- |
| path | `''`    | Relative path of the url to resolve. |
<!-- prettier-ignore-end -->

#### Returns

Url for the given path. For example, for the `'/.account/'` path with the default configuration you would get `'http://localhost:3000/.account/'`.

### `webId()`

Get test account webId. You can use this to log in in your application without hard-coding any urls.

#### Arguments

None.

#### Returns

WebId for the test account. For example, with the default configuration you would get `'https://localhost:3000/alice/profile/card#me'`.

## Assertions

This plugin also adds the following [Chai Assertions](https://docs.cypress.io/guides/references/assertions#Chai). All of them can also use [wildcards](#replacements-and-wildcards).

### `sparql`

Use it to compare SPARQL strings. For example:

```ts
it('Compares SPARQL', () => {
    cy.intercept('PATCH', podUrl('/tasks/1')).as('updateTask');

    // Test your application...

    cy.get('@updateTask')
        .its('request.body')
        .should(
            'be.sparql',
            `
                DELETE DATA {
                    <#it> <https://schema.org/name> "Previous task name" .
                } ;
                INSERT DATA {
                    <#it> <https://schema.org/name> "New task name" .
                } .
            `
        );
});
```

### `turtle`

Use it to compare Turtle strings. For example:

```ts
it('Compares Turtle', () => {
    cy.intercept('PUT', podUrl('/tasks/*')).as('createTask');

    // Test your application...

    cy.get('@createTask')
        .its('request.body')
        .should(
            'be.turtle',
            `
                @prefix schema: <https://schema.org/> .

                <#it>
                    a schema:Action ;
                    schema:name "Learn to use cypress-solid" .
           `
        );
});
```

## Replacements and wildcards

There are some situations when seeding data or making assertions where it may be impossible to know some values before runtime. For example, seeding some data that depends on ids generated dynamically, or making assertions in a document using dates and timestamps.

For these scenarios, some of the methods in this plugin accept replacements and wildcards.

### Replacements

Replacements are placeholders in fixture files that can be replaced once they are loaded in your tests. They use the `{{placeholder}}` syntax.

For example, imagine that you have the following fixture to represent an update to a Movie document `fixtures/watch-movie.sparql`:

```sparql
INSERT DATA {
    @prefix schema: <https://schema.org/>.
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

    <#watch-action>
        a schema:WatchAction ;
        schema:object <#it> ;
        schema:startTime "{{date}}"^^xsd:dateTime .
}
```

This fixture has a `{{date}}` placeholder that can be replaced at runtime. For example, this can be used with the [solidUpdateDocument](#cysolidupdatedocumentpath-fixture-replacements) command:

```ts
it('Watch a movie', () => {
    const now = new Date();

    cy.solidCreateDocument('/movies/movie', 'movie.ttl');
    cy.solidUpdateDocument('/movies/movie', 'watch-movie.sparql', {
        date: now.toISOString(),
    });
});
```

### Wildcards

Similarly, asserting some data that has been creating at runtime may be challenging. Wildcards can be used to run regular expression matches in assertions. They use the `[[regex]]` syntax.

For example, imagine that you want to assert that a Movie document has been updated properly:

```ts
it('Watch a movie', () => {
    cy.intercept('PATCH', podUrl('/movies/*')).as('watchMovie');

    // Interact with your application to watch a Movie...

    cy.get('@watchMovie')
        .its('request.body')
        .should(
            'be.sparql',
            `
                INSERT DATA {
                    @prefix schema: <https://schema.org/>.
                    @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

                    <#[[.*]]>
                        a schema:WatchAction ;
                        schema:object <#it> ;
                        schema:startTime "[[.*]]"^^xsd:dateTime .
                } .
            `
        );
});
```

In this case, we're using two wildcards. One for the value of `schema:startTime`, which is a date generated at runtime; and one for the fragment of the `schema:WatchAction` resource id, which could be a string generated dynamically.
