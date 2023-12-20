import * as authCommands from './auth';
import * as crudCommands from './crud';
import * as fixturesCommands from './fixtures';
import * as tasksCommands from './tasks';

export const commands = {
    ...authCommands,
    ...crudCommands,
    ...fixturesCommands,
    ...tasksCommands,
};

export interface SolidOptions {
    solid?: {
        serverUrl?: string;
    };
}
export type CustomCommands = typeof commands;

export default function(): void {
    for (const [name, implementation] of Object.entries(commands)) {
        Cypress.Commands.add(
            name as unknown as keyof Cypress.Chainable,
            implementation as Cypress.CommandFn<keyof Cypress.ChainableMethods>,
        );
    }
}

declare global {
    namespace Cypress {
        interface Chainable extends CustomCommands {}
    }
}
