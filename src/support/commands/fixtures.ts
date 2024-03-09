import { applyReplacements } from '../lib/replacements';
import type { Replacements } from '../lib/replacements';

export function fixtureWithReplacements(path: string, replacements: Replacements): Cypress.Chainable<string> {
    return cy.fixture(path).then((contents) => applyReplacements(contents, replacements));
}
