// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from '../end-to-end/common/page-controllers/page';

export async function formatPageElementForSnapshot(page: Page, selector: string): Promise<Node> {
    const outerHtml = await page.getOuterHTMLOfSelector(selector, { state: 'attached' });
    return formatHtmlForSnapshot(outerHtml);
}

export function formatHtmlForSnapshot(htmlString: string): Node {
    htmlString = normalizeClassName(htmlString);
    htmlString = normalizeId(htmlString);
    htmlString = normalizeExtensionUrls(htmlString);
    htmlString = htmlString.trim();

    const template = document.createElement('template');
    template.innerHTML = htmlString;

    Array.from(template.content.querySelectorAll('.insights-highlight-box')).forEach(
        normalizeEnvironmentSensitivePositionStyles,
    );

    return template.content.cloneNode(true);
}

export function normalizeId(htmlString: string): string {
    // matches a string like: id="*" or for="*"
    // we process only the string value on the right side
    const idAttributeMatcher = /(id|for)="([^".]+)"/g;

    return htmlString.replace(idAttributeMatcher, (_wholeMatch, attrName, idMatch: string) => {
        const officeFabricIdMatcher = /^([a-zA-Z-_]+)(\d+)(-{0,1}\w+)?$/;

        const idValue = idMatch.replace(officeFabricIdMatcher, `$1000$3`);

        return `${attrName}="${idValue}"`;
    });
}

export function normalizeClassName(htmlString: string): string {
    // matches a string like: class="*"
    // we process only the string value on the right side
    const classAttributeMatcher = /class="([^".]+)"/g;
    return htmlString.replace(classAttributeMatcher, (_, classNamesMatch: string) => {
        let classNames = classNamesMatch.split(' ');

        classNames = classNames.map(className => {
            let result = normalizeCssModuleClassName(className);
            result = normalizeOfficeFabricClassName(result);
            result = normalizeV9ClassName(result);
            return result;
        });

        return `class="${classNames.join(' ')}"`;
    });
}

// office fabric generates a "random" class & id name which changes every time.
// We remove the "random" number before snapshot comparison to avoid flakiness
export function normalizeOfficeFabricClassName(className: string): string {
    const officeFabricClassNameMatcher = /^([a-zA-Z-_]+)(\d+)(-{0,1}\w+)?$/;
    return className.replace(officeFabricClassNameMatcher, '$1000$3');
}

export const CSS_MODULE_HASH_REPLACEMENT = '{{CSS_MODULE_HASH}}';

export const V9_CLASS_NAME_REPLACEMENT = '{{V9_CLASS_NAME}}';

// Our compiler config adds generated suffixes of form "_1xye54t" to the end of class names defined in
// CSS. This normalizes them to avoid causing E2Es to fail for unrelated style changes.
export function normalizeV9ClassName(className: string): string {
    const v9ClassNameMatcher = /^___[0-9a-zA-Z]+_[0-9a-zA-Z]+$/;
 
    return className.replace(v9ClassNameMatcher, `${V9_CLASS_NAME_REPLACEMENT}`);
}

// Our compiler config adds generated suffixes of form "--abc12" to the end of class names defined in
// CSS. This normalizes them to avoid causing E2Es to fail for unrelated style changes.
export function normalizeCssModuleClassName(className: string): string {
    // eslint-disable-next-line no-useless-escape
    const cssModuleClassNameMatcher = /^([\w-]+--)[A-Za-z0-9+\/=\-_]{5}$/;

    return className.replace(cssModuleClassNameMatcher, `$1${CSS_MODULE_HASH_REPLACEMENT}`);
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
    if (originalInlineStyle != null) {
        const sanitizedInlineStyle = originalInlineStyle.replace(
            // eslint-disable-next-line no-useless-escape
            /((top|left|min-width|min-height):\s*)([\-0-9.]+)(px)/g,
            '$1{{ENVIRONMENT_SENSITIVE_POSITION}}$4',
        );
        absolutelyPositionedElement.setAttribute('style', sanitizedInlineStyle);
    }
}
