import { fail } from '@noeldemartin/utils';

export interface CypressSolidConfig {
    serverUrl: string;
    account: string;
    name: string;
    email: string;
    password: string;
}

export interface CypressSolidResponse {
    headers: Headers;
    status: number;
    statusText: string;
    body: string;
}

export function config(): CypressSolidConfig;
export function config<TKey extends keyof CypressSolidConfig>(key: TKey): CypressSolidConfig[TKey];
export function config<TKey extends keyof CypressSolidConfig>(
    key?: TKey,
): CypressSolidConfig[TKey] | CypressSolidConfig {
    const values =
        globalThis.cypressSolidConfig ??
        Cypress.config('__solid__') ??
        fail<CypressSolidConfig>('cypress-solid config not available yet');

    return key ? values[key] : values;
}

export function serverUrl(path: string = ''): string {
    return config('serverUrl') + path;
}

export function podUrl(path: string = ''): string {
    return serverUrl(`/${config('account')}${path}`);
}

export function webId(): string {
    return podUrl('/profile/card#me');
}
