// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';
import { IssueFilingUrlStringUtils } from '../../issue-filing/common/issue-filing-url-string-utils';
import { MarkupFormatter } from '../../issue-filing/common/markup/markup-formatter';
import { HowToFixWebCardRow } from '../components/cards/how-to-fix-card-row';
import { PathCardRow } from '../components/cards/path-card-row';
import { SnippetCardRow } from '../components/cards/snippet-card-row';
import { ReactFCWithDisplayName } from '../react/named-fc';
import { DeepPartial } from '../types/deep-partial';

export type PropertyType = 'css-selector' | 'how-to-fix-web' | 'snippet';
export const AllPropertyTypes: PropertyType[] = ['css-selector', 'how-to-fix-web', 'snippet'];

export interface CardRowDeps {
    fixInstructionProcessor: FixInstructionProcessor;
}

export interface CardRowProps {
    deps: CardRowDeps;
    index: number;
    propertyData: any;
}

export type GetIssueFilingDetailsSection = (
    propertyKey: string,
    propertyValue: string,
    markup: MarkupFormatter,
    getSection: (header: string, content: string) => string[],
) => string[];

export type GetIssueFilingTitleText = (value: any) => string;

export interface IssueFilingText {
    getIssueFilingDetailsSection: GetIssueFilingDetailsSection;
    getIssueFilingTitleText: GetIssueFilingTitleText;
}

export interface PropertyConfiguration {
    cardRow: ReactFCWithDisplayName<CardRowProps>;
    issueFilingText: IssueFilingText;
}

export const howToFixConfiguration: Partial<PropertyConfiguration> = {
    cardRow: HowToFixWebCardRow,
};

export const cssSelectorConfiguration: PropertyConfiguration = {
    cardRow: PathCardRow,
    issueFilingText: {
        getIssueFilingDetailsSection: (key, value, markup, getSection) => {
            return getSection('Element Path', value);
        },
        getIssueFilingTitleText: (selector: string) => {
            return IssueFilingUrlStringUtils.getSelectorLastPart(selector);
        },
    },
};

export const snippetConfiguration: DeepPartial<PropertyConfiguration> = {
    cardRow: SnippetCardRow,
    issueFilingText: {
        getIssueFilingDetailsSection: (key, value, markup, getSection) => {
            return getSection('Snippet', value);
        },
    },
};

type PropertyIdToConfigurationMap = {
    [key in PropertyType]: DeepPartial<PropertyConfiguration>;
};

const propertyIdToConfigurationMap: PropertyIdToConfigurationMap = {
    'css-selector': cssSelectorConfiguration,
    'how-to-fix-web': howToFixConfiguration,
    snippet: snippetConfiguration,
};

export function getPropertyConfiguration(id: string): Readonly<PropertyConfiguration> {
    return propertyIdToConfigurationMap[id];
}
