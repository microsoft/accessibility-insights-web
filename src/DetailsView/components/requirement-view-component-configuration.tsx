// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    RequirementContextSectionFactory,
    getRequirementContextSectionForAssessment,
    getRequirementContextSectionForQuickAssess,
} from 'DetailsView/components/requirement-view-context-section-factory';
import {
    GetNextRequirementButtonConfiguration,
    GetNextRequirementConfigurationProps,
    getNextRequirementConfigurationForAssessment,
    getNextRequirementConfigurationForQuickAssess,
} from 'DetailsView/components/requirement-view-next-requirement-configuration';
import {
    RequirementViewTitleFactory,
    getRequirementViewTitleForAssessment,
    getRequirementViewTitleForQuickAssess,
} from 'DetailsView/components/requirement-view-title-factory';

export type RequirementViewComponentConfiguration = {
    getNextRequirementButtonConfiguration: GetNextRequirementButtonConfiguration;
    getRequirementViewTitle: RequirementViewTitleFactory;
    getRequirementContextSection: RequirementContextSectionFactory;
};

export type GetRequirementViewComponentConfigurationProps = GetNextRequirementConfigurationProps;

export type GetRequirementViewComponentConfiguration = () => RequirementViewComponentConfiguration;

export const getRequirementViewComponentConfigurationForAssessment = () => {
    return {
        getNextRequirementButtonConfiguration: getNextRequirementConfigurationForAssessment,
        getRequirementViewTitle: getRequirementViewTitleForAssessment,
        getRequirementContextSection: getRequirementContextSectionForAssessment,
    };
};

export const getRequirementViewComponentConfigurationForQuickAssess = () => {
    return {
        getNextRequirementButtonConfiguration: getNextRequirementConfigurationForQuickAssess,
        getRequirementViewTitle: getRequirementViewTitleForQuickAssess,
        getRequirementContextSection: getRequirementContextSectionForQuickAssess,
    };
};

export const getRequirementViewComponentCongfigurationForFastPass = () => null;
