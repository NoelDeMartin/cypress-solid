import { isObject, toString } from '@noeldemartin/utils';
import type { ClosureArgs, GetClosureArgs } from '@noeldemartin/utils';

import { config } from '../../shared';
import type { CypressSolidResponse } from '../../shared';

function solidTask<TArgs extends ClosureArgs, TResult = unknown>(
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

export function solidRequest(...args: GetClosureArgs<typeof fetch>): Cypress.Chainable<CypressSolidResponse> {
    return solidTask('__solidRequest__', ...args);
}

export function solidReset(): void {
    solidTask('__solidReset__');
}
