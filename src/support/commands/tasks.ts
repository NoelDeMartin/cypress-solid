import type { GetClosureArgs } from '@noeldemartin/utils';

import { solidTask } from '../lib/tasks';
import type { CypressSolidResponse } from '../../shared';

export function solidRequest(...args: GetClosureArgs<typeof fetch>): Cypress.Chainable<CypressSolidResponse> {
    return solidTask('__solidRequest__', ...args);
}

export function solidReset(): void {
    solidTask('__solidReset__');
}
