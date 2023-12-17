import { installChaiPlugin } from '@noeldemartin/solid-utils';

import addCommands from './commands';
import { setConfig } from './utils';
import type { SolidCypressConfig } from '../shared';

export * from './commands';
export * from '../shared';

export function installSolid(config: Partial<SolidCypressConfig> = {}): void {
    setConfig(config);
    addCommands();
    installChaiPlugin();
}
