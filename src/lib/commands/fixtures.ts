import { applyReplacements } from '../replacements';
import type { Replacements } from '../replacements';

export function fixtureWithReplacements(path: string, replacements: Replacements): Cypress.Chainable<string> {
    return cy.fixture(path).then((contents) => applyReplacements(contents, replacements));
}
