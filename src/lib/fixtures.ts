import { fileExists } from './tasks';

export function fixtureOrText(pathOrText: string): Cypress.Chainable<string> {
    return fileExists(`${Cypress.config('fixturesFolder')}/${pathOrText}`).then((exists) =>
        exists ? cy.fixture(pathOrText) : pathOrText) as unknown as Cypress.Chainable<string>;
}
