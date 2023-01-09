// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    GetNextRequirementButtonConfiguration,
    GetNextRequirementConfigurationProps,
    getNextRequirementConfigurationForAssessment,
    getNextRequirementConfigurationForQuickAssess,
} from 'DetailsView/components/requirement-view-next-requirement-configuration';

export type RequirementViewComponentConfiguration = {
    getNextRequirementButtonConfiguration: GetNextRequirementButtonConfiguration;
};

export type GetRequirementViewComponentConfigurationProps = GetNextRequirementConfigurationProps;

export type GetRequirementViewComponentConfiguration = () => RequirementViewComponentConfiguration;

export const getRequirementViewComponentConfigurationForAssessment = () => {
    return {
        getNextRequirementButtonConfiguration: getNextRequirementConfigurationForAssessment,
    };
};

export const getRequirementViewComponentConfigurationForQuickAssess = () => {
    return {
        getNextRequirementButtonConfiguration: getNextRequirementConfigurationForQuickAssess,
    };
};
