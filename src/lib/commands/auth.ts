import { escapeRegexText } from '@noeldemartin/utils';

import { config, serverUrl, webId } from '../../shared';

export function solidAuthorize(): void {
    cy.origin(serverUrl(), { args: { accountWebId: webId() } }, ({ accountWebId }) => {
        cy.contains(accountWebId);

        // TODO wait for JS to be ready instead (at the moment, clicking the button too early doesn't work)
        cy.wait(200);

        cy.contains('button', 'Authorize').click();
        cy.url().should('match', new RegExp(`^${escapeRegexText(Cypress.config('baseUrl') ?? '')}`));
    });
}

export function solidLogin(): void {
    cy.origin(
        serverUrl(),
        { args: { accountWebId: webId(), pluginConfig: config() } },
        ({ accountWebId, pluginConfig }) => {
            cy.get('#email').type(pluginConfig.email);
            cy.get('#password').type(pluginConfig.password);
            cy.contains('button', 'Log in').click();
            cy.contains(accountWebId);

            // TODO wait for JS to be ready instead (at the moment, clicking the button too early doesn't work)
            cy.wait(200);

            cy.contains('button', 'Authorize').click();
            cy.url().should('match', new RegExp(`^${escapeRegexText(Cypress.config('baseUrl') ?? '')}`));
        },
    );
}
