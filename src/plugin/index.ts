import solidReset from './tasks/reset';

export default function(on: Cypress.PluginEvents): void {
    on('task', { solidReset });
}
