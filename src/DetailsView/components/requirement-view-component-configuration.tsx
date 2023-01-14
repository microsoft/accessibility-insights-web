// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    GetNextRequirementButtonConfiguration,
    getNextRequirementConfigurationForAssessment,
    getNextRequirementConfigurationForQuickAssess,
    GetNextRequirementConfigurationProps,
} from 'DetailsView/components/requirement-view-next-requirement-configuration';

export type RequirementViewComponentConfiguration = {
    getNextRequirementButton: GetNextRequirementButtonConfiguration;
};

export type GetRequirementViewComponentConfigurationProps = GetNextRequirementConfigurationProps;

export type GetRequirementViewComponentConfiguration = () => RequirementViewComponentConfiguration;

export const getRequirementViewComponentConfigurationForAssessment = () => {
    return {
        getNextRequirementButton: getNextRequirementConfigurationForAssessment,
    };
};

export const getRequirementViewComponentConfigurationForQuickAssess = () => {
    return {
        getNextRequirementButton: getNextRequirementConfigurationForQuickAssess,
    };
};
