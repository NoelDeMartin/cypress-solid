import fileExists from './tasks/file-exists';
import request from './tasks/request';
import reset from './tasks/reset';
import type { CypressSolidConfig } from '../shared';

export function setupSolidNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions,
    solidConfig: Partial<CypressSolidConfig> = {},
): Cypress.PluginConfigOptions {
    on('task', { __fileExists__: fileExists, __solidRequest__: request, __solidReset__: reset });

    config['__solid__'] = {
        serverUrl: 'http://localhost:3000',
        account: 'alice',
        name: 'Alice Cooper',
        email: 'alice@example.com',
        password: 'secret',
        ...solidConfig,
    };

    return config;
}
