import { existsSync } from 'node:fs';

import { defineTask } from '../lib/utils';

export default defineTask((path: string) => existsSync(path));
