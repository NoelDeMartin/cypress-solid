import { jsonldEquals } from '@noeldemartin/solid-utils/testing';
import type { JsonLD } from '@noeldemartin/solid-utils';
import type { EqualityResult } from '@noeldemartin/solid-utils/testing';

export function compareJsonLD(expected: JsonLD, actual: JsonLD): Cypress.Chainable<EqualityResult> {
    return Cypress.Promise.cast(jsonldEquals(expected, actual)) as unknown as Cypress.Chainable<EqualityResult>;
}

export function assertJsonLD(expected: string | JsonLD, actual: string | JsonLD | null): void {
    const expectedJsonLD = typeof expected === 'string' ? JSON.parse(expected) : expected;
    const actualJsonLD = typeof actual === 'string' ? JSON.parse(actual) : actual;

    cy.compareJsonLD(expectedJsonLD, actualJsonLD).should('be.equalityResult');
}
