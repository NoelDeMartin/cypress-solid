import { isObject, toString } from '@noeldemartin/utils';
import type { ClosureArgs } from '@noeldemartin/utils';

import { config } from '../shared';

export function solidTask<TArgs extends ClosureArgs, TResult = unknown>(
    name: string,
    ...args: TArgs
): Cypress.Chainable<TResult> {
    Cypress.log({ name });

    return cy.task(name, { config: config(), args }, { log: false }).then((result) => {
        if (isObject(result) && 'error' in result) {
            throw new Error(toString(result.error));
        }

        return result;
    }) as unknown as Cypress.Chainable<TResult>;
}

export function fileExists(path: string): Cypress.Chainable<boolean> {
    return solidTask('__fileExists__', path);
}
