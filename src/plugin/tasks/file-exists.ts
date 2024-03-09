import { existsSync } from 'fs';

import { defineTask } from '../lib/utils';

export default defineTask((path: string) => existsSync(path));
