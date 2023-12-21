import debug from 'debug';
import type { Debugger } from 'debug';
import type { Closure, ClosureArgs } from '@noeldemartin/utils';

import type { CypressSolidConfig } from '../../shared';

let logger: Debugger | null = null;

export function log(...messages: [string, ...unknown[]]): void {
    logger ??= debug('cypress:solid');

    logger(...messages);
}

export function defineTask<TArgs extends ClosureArgs>(
    task: Closure<TArgs, unknown>,
): Closure<[{ config: CypressSolidConfig; args: TArgs }], Promise<unknown>> {
    return async ({ config, args }) => {
        if (!globalThis.cypressSolidConfig) {
            globalThis.cypressSolidConfig = config;
        }

        const result = await task(...args);

        return result ?? null;
    };
}
