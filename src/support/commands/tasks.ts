import type { ClosureArgs } from '@noeldemartin/utils';

import { config } from '../../shared';

function solidTask<TArgs extends ClosureArgs, TResult = unknown>(
    name: string,
    ...args: TArgs
): Cypress.Chainable<TResult> {
    Cypress.log({ name });

    return cy.task<TResult>(name, { config: config(), args }, { log: false });
}

export function solidReset(): void {
    solidTask('solidReset');
}
