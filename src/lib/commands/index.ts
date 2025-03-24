import * as assertionsCommands from './assertions';
import * as authCommands from './auth';
import * as crudCommands from './crud';
import * as fixturesCommands from './fixtures';
import * as tasksCommands from './tasks';

export const solidCommands = {
    ...assertionsCommands,
    ...authCommands,
    ...crudCommands,
    ...fixturesCommands,
    ...tasksCommands,
};

/**
 * @deprecated use solidCommands instead.
 */
export const commands = solidCommands;

export interface SolidOptions {
    solid?: {
        serverUrl?: string;
    };
}
export type CustomSolidCommands = typeof solidCommands;

/**
 * @deprecated use CustomSolidCommands instead.
 */
export type CustomCommands = CustomSolidCommands;

export default function(): void {
    for (const [name, implementation] of Object.entries(solidCommands)) {
        Cypress.Commands.add(
            name as unknown as keyof Cypress.Chainable,
            implementation as Cypress.CommandFn<keyof Cypress.ChainableMethods>,
        );
    }
}

declare global {
    namespace Cypress {
        interface Chainable extends CustomSolidCommands {}
    }
}
