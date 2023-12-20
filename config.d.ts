/// <reference types="cypress" />

import type { CypressSolidConfig } from './src/shared';

declare module 'cypress-solid/config' {
    export function setupSolidNodeEvents(
        on: PluginEvents,
        config: PluginConfigOptions,
        pluginConfig?: Partial<CypressSolidConfig>
    ): PluginConfigOptions;
}
