// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    GetNextRequirementButtonConfiguration,
    GetNextRequirementConfigurationProps,
    getNextRequirementConfigurationForAssessment,
    getNextRequirementConfigurationForQuickAssess,
} from 'DetailsView/components/requirement-view-next-requirement-configuration';
import {
    ShouldShowRequirementContextBox,
    shouldShowRequirementContextBoxForAssessment,
    shouldShowRequirementContextBoxForQuickAssess,
} from 'DetailsView/components/requirement-view-should-show-context-box';
import {
    ShouldShowInfoButton,
    shouldShowInfoButtonForAssessment,
    shouldShowInfoButtonForQuickAssess,
} from 'DetailsView/components/requirement-view-should-show-info-button';

export type RequirementViewComponentConfiguration = {
    getNextRequirementButtonConfiguration: GetNextRequirementButtonConfiguration;
    shouldShowInfoButton: ShouldShowInfoButton;
    shouldShowRequirementContextBox: ShouldShowRequirementContextBox;
};

export type GetRequirementViewComponentConfigurationProps = GetNextRequirementConfigurationProps;

export type GetRequirementViewComponentConfiguration = () => RequirementViewComponentConfiguration;

export const getRequirementViewComponentConfigurationForAssessment = () => {
    return {
        getNextRequirementButtonConfiguration: getNextRequirementConfigurationForAssessment,
        shouldShowInfoButton: shouldShowInfoButtonForAssessment,
        shouldShowRequirementContextBox: shouldShowRequirementContextBoxForAssessment,
    };
};

export const getRequirementViewComponentConfigurationForQuickAssess = () => {
    return {
        getNextRequirementButtonConfiguration: getNextRequirementConfigurationForQuickAssess,
        shouldShowInfoButton: shouldShowInfoButtonForQuickAssess,
        shouldShowRequirementContextBox: shouldShowRequirementContextBoxForQuickAssess,
    };
};

export const getRequirementViewComponentCongfigurationForFastPass = () => null;
