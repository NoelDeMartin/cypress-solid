import { fail } from '@noeldemartin/utils';

export interface SolidCypressConfig {
    serverUrl: string;
    account: string;
    name: string;
    email: string;
    password: string;
}

export interface SolidRequestResponse {
    headers: Headers;
    status: number;
    statusText: string;
    body: string;
}

export function config(): SolidCypressConfig;
export function config<TKey extends keyof SolidCypressConfig>(key: TKey): SolidCypressConfig[TKey];
export function config<TKey extends keyof SolidCypressConfig>(
    key?: TKey,
): SolidCypressConfig[TKey] | SolidCypressConfig {
    const values =
        globalThis.top?.cypressSolidConfig ??
        globalThis.cypressSolidConfig ??
        fail<SolidCypressConfig>('cypress-solid config not available yet');

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
