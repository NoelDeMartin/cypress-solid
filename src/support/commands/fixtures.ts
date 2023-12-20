import { applyReplacements } from '../lib/utils';
import type { Replacements } from '../lib/utils';

export function fixtureWithReplacements(filePath: string, replacements: Replacements): Cypress.Chainable<string> {
    return cy.fixture(filePath).then((contents) => applyReplacements(contents, replacements));
}
