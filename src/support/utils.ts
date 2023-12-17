import type { SolidCypressConfig } from '../shared';

export function setConfig(config: Partial<SolidCypressConfig>): void {
    if (!globalThis.top) {
        throw new Error('Can\'t set cypress-solid config');
    }

    globalThis.top.cypressSolidConfig = {
        serverUrl: 'http://localhost:3000',
        account: 'alice',
        name: 'Alice Cooper',
        email: 'alice@example.com',
        password: 'secret',
        ...config,
    };
}
