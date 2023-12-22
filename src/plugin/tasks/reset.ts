import { requireEngine, setEngine } from 'soukai';
import { SolidContainer, SolidEngine, bootSolidModels } from 'soukai-solid';

import { authenticate, resetAuthentication } from '../lib/auth';
import { config, podUrl, serverUrl } from '../../shared';
import { defineTask, log } from '../lib/utils';

function defaultPodDocuments(): string[] {
    return [podUrl('/'), podUrl('/profile/'), podUrl('/profile/card'), podUrl('/README')];
}

async function deleteContainer(container: SolidContainer): Promise<void> {
    await Promise.all(
        (container.resourceUrls as string[]).map(async (url) => {
            if (url.endsWith('/')) {
                const childContainer = await SolidContainer.findOrFail(url);

                await deleteContainer(childContainer);

                return;
            }

            await deleteDocument(url);
        }),
    );

    await deleteDocument(container.url);
}

async function deleteDocument(url: string): Promise<void> {
    if (defaultPodDocuments().includes(url)) {
        return;
    }

    log(`Delete '${url}'`);

    const authenticatedFetch = requireEngine<SolidEngine>().getFetch();

    await authenticatedFetch(url, { method: 'DELETE' });
}

async function replaceDocument(url: string, body: string): Promise<void> {
    const authenticatedFetch = requireEngine<SolidEngine>().getFetch();

    await authenticatedFetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/turtle' },
        body,
    });
}

async function resetPod(retry: boolean = true): Promise<void> {
    const authenticatedFetch = await authenticate();

    bootSolidModels();
    setEngine(new SolidEngine(authenticatedFetch));

    try {
        await deleteContainer(await SolidContainer.findOrFail(podUrl('/')));
        await replaceDocument(
            podUrl('/profile/card'),
            `
                @prefix foaf: <http://xmlns.com/foaf/0.1/>.
                @prefix solid: <http://www.w3.org/ns/solid/terms#>.

                <> a foaf:PersonalProfileDocument;
                    foaf:maker <#me>;
                    foaf:primaryTopic <#me>.
                <#me> a foaf:Person;
                    foaf:name "${config('name')}";
                    solid:oidcIssuer <${serverUrl('/')}>.
            `,
        );
    } catch (error) {
        if (!retry) {
            throw error;
        }

        resetAuthentication();

        await resetPod(false);
    }
}

export default defineTask(async () => {
    try {
        log(`Resetting POD at ${serverUrl()}...`);

        await resetPod();

        log('POD reset complete.');
    } catch (error) {
        const anyError = error as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        const errorCode = anyError.code ?? anyError.cause?.code;

        if (errorCode === 'ECONNREFUSED') {
            return { error: `Could not connect to ${serverUrl()}, are you sure the Solid server is running?` };
        }

        throw error;
    }
});
