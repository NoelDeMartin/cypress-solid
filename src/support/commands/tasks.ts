import type { ClosureArgs, GetClosureArgs } from '@noeldemartin/utils';

import { config } from '../../shared';
import type { SolidRequestResponse } from '../../shared';

function solidTask<TArgs extends ClosureArgs, TResult = unknown>(
    name: string,
    ...args: TArgs
): Cypress.Chainable<TResult> {
    Cypress.log({ name });

    return cy.task<TResult>(name, { config: config(), args }, { log: false });
}

export function solidRequest(...args: GetClosureArgs<typeof fetch>): Cypress.Chainable<SolidRequestResponse> {
    return solidTask('solidRequest', ...args);
}

export function solidReset(): void {
    solidTask('solidReset');
}
