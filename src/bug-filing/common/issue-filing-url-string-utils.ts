// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { endsWith } from 'lodash';

import { EnvironmentInfo } from '../../common/environment-info-provider';
import { title } from '../../content/strings/application';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export class IssueFilingUrlStringUtils {
    public static footer(environmentInfo: EnvironmentInfo): string {
        return (
            `This accessibility issue was found using ${title} ` +
            `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
            'a tool that helps find and fix accessibility issues. Get more information & download ' +
            'this tool at http://aka.ms/AccessibilityInsights.'
        );
    }

    public static collapseConsecutiveSpaces(input: string): string {
        return input.replace(/\s+/g, ' ');
    }

    public static markdownEscapeBlock(input: string): string {
        return input
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n');
    }

    public static getSelectorLastPart(selector: string): string {
        let selectorLastPart = selector;
        if (selector.lastIndexOf(' > ') > 0) {
            selectorLastPart = selector.substr(selector.lastIndexOf(' > ') + 3);
        }
        return selectorLastPart;
    }

    public static standardizeTags(data: CreateIssueDetailsTextData): string[] {
        return data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase());
    }

    public static appendSuffixToUrl(url: string, suffix: string): string {
        if (endsWith(url, suffix) || endsWith(url, `${suffix}/`)) {
            return url;
        }

        return `${url}/${suffix}/`;
    }
}
