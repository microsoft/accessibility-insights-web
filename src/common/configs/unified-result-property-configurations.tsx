// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClassNameCardRow } from 'common/components/cards/class-name-card-row';
import { ContentDescriptionCardRow } from 'common/components/cards/content-description-card-row';
import { RichResolutionCardRow } from 'common/components/cards/rich-resolution-card-row';
import { TextCardRow } from 'common/components/cards/text-card-row';
import { UrlsCardRow } from 'common/components/cards/urls-card-row';
import { RecommendColor } from 'common/components/recommend-color';
import { LinkComponentType } from 'common/types/link-component-type';
import { HowToFixWebCardRow } from '../components/cards/how-to-fix-card-row';
import { PathCardRow } from '../components/cards/path-card-row';
import { SnippetCardRow } from '../components/cards/snippet-card-row';
import { FixInstructionProcessor } from '../components/fix-instruction-processor';
import { ReactFCWithDisplayName } from '../react/named-fc';

export type PropertyType =
    | 'css-selector'
    | 'how-to-fix-web'
    | 'richResolution'
    | 'snippet'
    | 'className'
    | 'contentDescription'
    | 'text';
export const AllPropertyTypes: PropertyType[] = [
    'css-selector',
    'how-to-fix-web',
    'richResolution',
    'snippet',
    'className',
    'contentDescription',
    'text',
];

export interface CardRowDeps {
    fixInstructionProcessor: FixInstructionProcessor;
    recommendColor: RecommendColor;
    LinkComponent: LinkComponentType;
}

export interface CardRowProps {
    deps: CardRowDeps;
    index: number;
    propertyData: any;
}

export interface PropertyConfiguration {
    cardRow: ReactFCWithDisplayName<CardRowProps>;
}

export const howToFixWebConfiguration: PropertyConfiguration = {
    cardRow: HowToFixWebCardRow,
};

export const richResolutionConfiguration: PropertyConfiguration = {
    cardRow: RichResolutionCardRow,
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

export const urlsConfiguration: PropertyConfiguration = {
    cardRow: UrlsCardRow,
};

export type PropertyIdToConfigurationMap = {
    [key in PropertyType]: PropertyConfiguration;
};
const propertyIdToConfigurationMap: PropertyIdToConfigurationMap = {
    'css-selector': cssSelectorConfiguration,
    'how-to-fix-web': howToFixWebConfiguration,
    richResolution: richResolutionConfiguration,
    snippet: snippetConfiguration,
    className: classNameConfiguration,
    contentDescription: contentDescriptionConfiguration,
    text: textConfiguration,
    urls: urlsConfiguration,
};

export function getPropertyConfiguration(id: string): Readonly<PropertyConfiguration> {
    return propertyIdToConfigurationMap[id];
}
