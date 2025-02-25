import { jsonldEquals } from '@noeldemartin/solid-utils';
import type { EqualityResult, JsonLD } from '@noeldemartin/solid-utils';

export function compareJsonLD(expected: JsonLD, actual: JsonLD): Cypress.Chainable<EqualityResult> {
    return Cypress.Promise.cast(jsonldEquals(expected, actual)) as unknown as Cypress.Chainable<EqualityResult>;
}

export function assertJsonLD(expected: string | JsonLD, actual: string | JsonLD | null): void {
    const expectedJsonLD = typeof expected === 'string' ? JSON.parse(expected) : expected;
    const actualJsonLD = typeof actual === 'string' ? JSON.parse(actual) : actual;

    cy.compareJsonLD(expectedJsonLD, actualJsonLD).should('be.equalityResult');
}
