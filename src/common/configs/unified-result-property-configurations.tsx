// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';
import { HowToFixWebCardRow } from '../components/cards/how-to-fix-card-row';
import { PathCardRow } from '../components/cards/path-card-row';
import { SnippetCardRow } from '../components/cards/snippet-card-row';
import { ReactFCWithDisplayName } from '../react/named-fc';

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

export interface PropertyConfiguration {
    cardRow: ReactFCWithDisplayName<CardRowProps>;
    displayName: string;
}

export const howToFixConfiguration: PropertyConfiguration = {
    cardRow: HowToFixWebCardRow,
    displayName: 'How to fix',
};

export const cssSelectorConfiguration: PropertyConfiguration = {
    cardRow: PathCardRow,
    displayName: 'Path',
};

export const snippetConfiguration: PropertyConfiguration = {
    cardRow: SnippetCardRow,
    displayName: 'Snippet',
};

type PropertyIdToConfigurationMap = {
    [key in PropertyType]: PropertyConfiguration;
};
const propertyIdToConfigurationMap: PropertyIdToConfigurationMap = {
    'css-selector': cssSelectorConfiguration,
    'how-to-fix-web': howToFixConfiguration,
    snippet: snippetConfiguration,
};

export function getPropertyConfiguration(id: string): Readonly<PropertyConfiguration> {
    return propertyIdToConfigurationMap[id];
}
