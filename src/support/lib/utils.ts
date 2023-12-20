import { toString } from '@noeldemartin/utils';

export type Replacements = Record<string, unknown>;

export function applyReplacements(text: string, replacements: Replacements): string {
    return Object.entries(replacements).reduce(
        (renderedText, [name, value]) => renderedText.replaceAll(`{{${name}}}`, toString(value)),
        text,
    );
}
