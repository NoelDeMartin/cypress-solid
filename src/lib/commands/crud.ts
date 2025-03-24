import { normalizeSparql } from '@noeldemartin/solid-utils';

import { applyReplacements } from '../replacements';
import { fixtureOrText } from '../fixtures';
import { podUrl } from '../../shared';
import type { CypressSolidResponse } from '../../shared';
import type { Replacements } from '../replacements';

export function solidCreateContainer(path: string, name: string = 'Container'): void {
    const containerUrl = podUrl(path);

    cy.solidRequest(containerUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/turtle',
            'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
            'If-None-Match': '*',
        },
    });

    cy.solidRequest(`${containerUrl}.meta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/sparql-update' },
        body: `INSERT DATA { <${containerUrl}> <http://www.w3.org/2000/01/rdf-schema#label> "${name}" . }`,
    });
}

export function solidCreateDocument(
    path: string,
    turtleOrFixture: string,
    replacements: Replacements = {},
): Cypress.Chainable<CypressSolidResponse> {
    return fixtureOrText(turtleOrFixture).then((body) =>
        cy.solidRequest(podUrl(path), {
            method: 'PUT',
            headers: { 'Content-Type': 'text/turtle' },
            body: applyReplacements(body, replacements),
        }));
}

export function solidDeleteDocument(path: string): Cypress.Chainable<CypressSolidResponse> {
    return cy.solidRequest(podUrl(path), { method: 'DELETE' });
}

export function solidReadDocument(path: string): Cypress.Chainable<string> {
    return cy.solidRequest(podUrl(path)).then((response) => response.body);
}

export function solidUpdateDocument(
    path: string,
    sparqlOrFixture: string,
    replacements: Replacements = {},
): Cypress.Chainable<CypressSolidResponse> {
    return fixtureOrText(sparqlOrFixture).then((body) =>
        cy.solidRequest(podUrl(path), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/sparql-update' },
            body: normalizeSparql(applyReplacements(body, replacements)),
        }));
}
