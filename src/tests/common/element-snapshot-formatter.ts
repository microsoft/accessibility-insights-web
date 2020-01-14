// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';
import { Page } from '../end-to-end/common/page-controllers/page';

export async function formatPageElementForSnapshot(page: Page, selector: string): Promise<Node> {
    const outerHtml = await page.getOuterHTMLOfSelector(selector);
    return formatHtmlForSnapshot(outerHtml);
}

export async function formatChildElementForSnapshot(rootElement: ElementHandle<Element>, childSelector: string): Promise<Node> {
    const childOuterHtml = await rootElement.$eval(childSelector, el => el.outerHTML);
    return formatHtmlForSnapshot(childOuterHtml);
}

export function formatHtmlForSnapshot(htmlString: string): Node {
    htmlString = normalizeCssModuleClassNames(htmlString);
    htmlString = normalizeOfficeFabricGeneratedClassNames(htmlString);
    htmlString = normalizeExtensionUrls(htmlString);
    htmlString = htmlString.trim();

    const template = document.createElement('template');
    template.innerHTML = htmlString;

    Array.from(template.content.querySelectorAll('.insights-highlight-box')).forEach(normalizeEnvironmentSensitivePositionStyles);

    return template.content.cloneNode(true);
}

// office fabric generates a random class & id name which changes every time.
// We remove the random number before snapshot comparison to avoid flakiness
export function normalizeOfficeFabricGeneratedClassNames(htmlString: string): string {
    return htmlString.replace(/(class|id)="([\w\s-]+[\d]+|Panel\d+-\w+)"/g, (subString, args) => {
        return subString.replace(/[\d]+/g, '000');
    });
}

export const CSS_MODULE_HASH_REPLACEMENT = '{{CSS_MODULE_HASH}}';
// Our webpack config adds generated suffixes of form "--abc12" to the end of class names defined in
// CSS. This normalizes them to avoid causing E2Es to fail for unrelated style changes.
export function normalizeCssModuleClassNames(htmlString: string): string {
    return htmlString.replace(/(class="[^"]+--)[A-Za-z0-9+\/=-]{5}(")/g, `$1${CSS_MODULE_HASH_REPLACEMENT}$2`);
}

// in some cases (eg, stylesheet links), HTML can contain absolute chrome-extension://{generated-id} paths
// which differ between builds of the extension. This normalizes those.
function normalizeExtensionUrls(htmlString: string): string {
    return htmlString.replace(/chrome-extension:\/\/\w+\//g, '{{EXTENSION_URL_BASE}}/');
}

// Certain injected target page elements are rendered at absolute positions on the page based on elements from
// the target page. We strip these from snapshots because the exact positions are very environment-sensitive
// (for example, they change based on how the operating system's font engine performs sub-pixel anti-aliasing
// during font hinting); individual tests of the elements in question special-case tests of these positions
// separately to allow some tolerance for this sort of environmental variance.
function normalizeEnvironmentSensitivePositionStyles(absolutelyPositionedElement: Element): void {
    const originalInlineStyle = absolutelyPositionedElement.getAttribute('style');
    const sanitizedInlineStyle = originalInlineStyle.replace(
        /((top|left|min-width|min-height):\s*)([\-0-9.]+)(px)/g,
        '$1{{ENVIRONMENT_SENSITIVE_POSITION}}$4',
    );
    absolutelyPositionedElement.setAttribute('style', sanitizedInlineStyle);
}
