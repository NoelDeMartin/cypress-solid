import type { CypressSolidConfig } from './index';

/* eslint-disable no-var */

declare global {
    declare var cypressSolidConfig: CypressSolidConfig | undefined;

    declare namespace Cypress {
        interface Cypress {
            config(key: '__solid__'): CypressSolidConfig | undefined;
        }

        interface PluginConfigOptions {
            __solid__?: CypressSolidConfig;
        }
    }
}
