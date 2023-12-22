/// <reference types="cypress" />

import type { CypressSolidConfig } from './src/shared';

declare module 'cypress-solid/config' {
    export function setupSolidNodeEvents(
        on: Cypress.PluginEvents,
        config: Cypress.PluginConfigOptions,
        solidConfig?: Partial<CypressSolidConfig>
    ): Cypress.PluginConfigOptions;
}
