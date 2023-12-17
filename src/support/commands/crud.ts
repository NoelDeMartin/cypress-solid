import { normalizeSparql } from '@noeldemartin/solid-utils';

import { podUrl } from '../../shared';

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

export function solidCreateDocument(path: string, fixture: string, replacements: Record<string, string> = {}): void {
    cy.fixture(fixture).then((body) =>
        cy.solidRequest(podUrl(path), {
            method: 'PUT',
            headers: { 'Content-Type': 'text/turtle' },
            body: Object.entries(replacements).reduce(
                (renderedBody, [name, value]) => renderedBody.replaceAll(`{{${name}}}`, value),
                body,
            ),
        }));
}

export function solidDeleteDocument(path: string): void {
    cy.solidRequest(podUrl(path), { method: 'DELETE' });
}

export function solidReadDocument(path: string): Cypress.Chainable<string> {
    return cy.solidRequest(podUrl(path)).then((response) => response.body);
}

export function solidUpdateDocument(path: string, fixture: string, replacements: Record<string, string> = {}): void {
    cy.fixture(fixture).then((body) =>
        cy.solidRequest(podUrl(path), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/sparql-update' },
            body: normalizeSparql(
                Object.entries(replacements).reduce(
                    (renderedBody, [name, value]) => renderedBody.replaceAll(`{{${name}}}`, value),
                    body,
                ),
            ),
        }));
}
