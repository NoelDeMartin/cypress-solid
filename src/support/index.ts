import { installChaiPlugin } from '@noeldemartin/solid-utils';

import addCommands from './commands';

export * from './commands';
export * from '../shared';

export function setupSolidSupport(): void {
    addCommands();
    installChaiPlugin();
}
