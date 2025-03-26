import { installChaiSolidAssertions } from '@noeldemartin/solid-utils/chai';

import addCommands from './commands';

export * from './commands';
export * from '../shared';

export function setupSolidSupport(): void {
    addCommands();
    installChaiSolidAssertions();
}
