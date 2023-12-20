import type { GetClosureArgs } from '@noeldemartin/utils';

import { authenticate } from '../lib/auth';
import { defineTask, log } from '../lib/utils';
import type { CypressSolidResponse } from '../../shared';

export default defineTask(async (...args: GetClosureArgs<typeof fetch>) => {
    log(`${args[1]?.['method'] ?? 'GET'} ${args[0]}...`);

    const authenticatedFetch = await authenticate();
    const response = await authenticatedFetch(...args);

    log(`Response: ${response.status}`);

    const solidResponse: CypressSolidResponse = {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        body: await response.text(),
    };

    return solidResponse;
});
