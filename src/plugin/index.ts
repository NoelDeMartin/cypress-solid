import solidRequest from './tasks/request';
import solidReset from './tasks/reset';

export default function(on: Cypress.PluginEvents): void {
    on('task', { solidRequest, solidReset });
}
