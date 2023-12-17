import type { SolidCypressConfig } from './index';

/* eslint-disable no-var */

declare global {
    declare var cypressSolidConfig: SolidCypressConfig | undefined;
    declare var top:
        | {
              cypressSolidConfig?: SolidCypressConfig;
          }
        | undefined;
}
