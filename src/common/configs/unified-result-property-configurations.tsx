// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { LabelledTableRow, LabelledTableRowProps } from '../../DetailsView/components/cards/css-selector-card-row';
import { HowToFixWebCardRow } from '../../DetailsView/components/cards/how-to-fix-web-card-row';
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';
import { ReactSFCWithDisplayName } from '../react/named-sfc';

export type PropertyType = 'css-selector' | 'how-to-fix-web' | 'snippet';

export interface CardRowDeps {
    fixInstructionProcessor: FixInstructionProcessor;
}

export interface CardRowProps {
    deps: CardRowDeps;
    index: number;
    propertyData: any;
}

export interface PropertyConfiguration {
    cardRow: ReactSFCWithDisplayName<CardRowProps>;
}

export const howToFixConfiguration: PropertyConfiguration = {
    cardRow: HowToFixWebCardRow,
};

export const cssSelectorConfiguration: PropertyConfiguration = {
    cardRow: LabelledTableRow('Path'),
};

export const snippetConfiguration: PropertyConfiguration = {
    cardRow: LabelledTableRow('Snippet'),
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
