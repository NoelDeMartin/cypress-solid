import type { Closure, ClosureArgs } from '@noeldemartin/utils';

import type { CypressSolidConfig } from '../../shared';

export function log(...messages: [string, ...unknown[]]): void {
    const [firstMessage, ...otherMessages] = messages;

    // eslint-disable-next-line no-console
    console.log(`[Solid]: ${firstMessage}`, ...otherMessages);
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
