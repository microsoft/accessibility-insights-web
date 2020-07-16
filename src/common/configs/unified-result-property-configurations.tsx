// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClassNameCardRow } from 'common/components/cards/class-name-card-row';
import { ContentDescriptionCardRow } from 'common/components/cards/content-description-card-row';
import { HowToCheckWebCardRow } from 'common/components/cards/how-to-check-card-row';
import { TextCardRow } from 'common/components/cards/text-card-row';
import { HowToFixAndroidCardRow } from '../components/cards/how-to-fix-android-card-row';
import { HowToFixWebCardRow } from '../components/cards/how-to-fix-card-row';
import { PathCardRow } from '../components/cards/path-card-row';
import { SnippetCardRow } from '../components/cards/snippet-card-row';
import { FixInstructionProcessor } from '../components/fix-instruction-processor';
import { ReactFCWithDisplayName } from '../react/named-fc';

export type PropertyType =
    | 'css-selector'
    | 'how-to-fix-web'
    | 'how-to-check-web'
    | 'snippet'
    | 'className'
    | 'contentDescription'
    | 'text'
    | 'howToFixFormat';
export const AllPropertyTypes: PropertyType[] = [
    'css-selector',
    'how-to-fix-web',
    'how-to-check-web',
    'snippet',
    'className',
    'contentDescription',
    'text',
    'howToFixFormat',
];

export interface CardRowDeps {
    fixInstructionProcessor: FixInstructionProcessor;
}

export interface CardRowProps {
    deps: CardRowDeps;
    index: number;
    propertyData: any;
}

export interface PropertyConfiguration {
    cardRow: ReactFCWithDisplayName<CardRowProps>;
}

export const howToFixConfiguration: PropertyConfiguration = {
    cardRow: HowToFixWebCardRow,
};

export const howToCheckConfiguration: PropertyConfiguration = {
    cardRow: HowToCheckWebCardRow,
};

export const howToFixAndroidConfiguration: PropertyConfiguration = {
    cardRow: HowToFixAndroidCardRow,
};

export const cssSelectorConfiguration: PropertyConfiguration = {
    cardRow: PathCardRow,
};

export const snippetConfiguration: PropertyConfiguration = {
    cardRow: SnippetCardRow,
};

export const classNameConfiguration: PropertyConfiguration = {
    cardRow: ClassNameCardRow,
};

export const contentDescriptionConfiguration: PropertyConfiguration = {
    cardRow: ContentDescriptionCardRow,
};

export const textConfiguration: PropertyConfiguration = {
    cardRow: TextCardRow,
};

export type PropertyIdToConfigurationMap = {
    [key in PropertyType]: PropertyConfiguration;
};
const propertyIdToConfigurationMap: PropertyIdToConfigurationMap = {
    'css-selector': cssSelectorConfiguration,
    'how-to-fix-web': howToFixConfiguration,
    'how-to-check-web': howToCheckConfiguration,
    howToFixFormat: howToFixAndroidConfiguration,
    snippet: snippetConfiguration,
    className: classNameConfiguration,
    contentDescription: contentDescriptionConfiguration,
    text: textConfiguration,
};

export function getPropertyConfiguration(id: string): Readonly<PropertyConfiguration> {
    return propertyIdToConfigurationMap[id];
}
