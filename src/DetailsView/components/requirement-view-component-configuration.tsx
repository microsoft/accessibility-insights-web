// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    getRequirementContextSectionForAssessment,
    getRequirementContextSectionForQuickAssess,
    RequirementContextSectionFactory,
} from 'DetailsView/components/requirement-view-context-section-factory';
import {
    GetNextRequirementButtonConfiguration,
    getNextRequirementConfigurationForAssessment,
    getNextRequirementConfigurationForQuickAssess,
    GetNextRequirementConfigurationProps,
} from 'DetailsView/components/requirement-view-next-requirement-configuration';
import {
    getRequirementViewTitleForAssessment,
    getRequirementViewTitleForQuickAssess,
    RequirementViewTitleFactory,
} from 'DetailsView/components/requirement-view-title-factory';

export type RequirementViewComponentConfiguration = {
    getNextRequirementButton: GetNextRequirementButtonConfiguration;
    getRequirementViewTitle: RequirementViewTitleFactory;
    getRequirementContextSection: RequirementContextSectionFactory;
};

export type GetRequirementViewComponentConfigurationProps = GetNextRequirementConfigurationProps;

export type GetRequirementViewComponentConfiguration =
    () => RequirementViewComponentConfiguration | null;

export const getRequirementViewComponentConfigurationForAssessment = () => {
    return {
        getNextRequirementButton: getNextRequirementConfigurationForAssessment,
        getRequirementViewTitle: getRequirementViewTitleForAssessment,
        getRequirementContextSection: getRequirementContextSectionForAssessment,
    };
};
export const getRequirementViewComponentConfigurationForQuickAssess = () => {
    return {
        getNextRequirementButton: getNextRequirementConfigurationForQuickAssess,
        getRequirementViewTitle: getRequirementViewTitleForQuickAssess,
        getRequirementContextSection: getRequirementContextSectionForQuickAssess,
    };
};

export const getRequirementViewComponentConfigurationForFastPass = () => null;
