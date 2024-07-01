// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDataParser } from 'common/assessment-data-parser';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import * as React from 'react';
import { FolderOpenRegular } from '@fluentui/react-icons';
import { NamedFC } from 'common/react/named-fc';
import { CommandButtonStyle } from 'DetailsView/components/command-button-styles';

export type LoadAssessmentButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentDataParser: AssessmentDataParser;
    urlParser: UrlParser;
    loadAssessmentHelper: LoadAssessmentHelper;
};
export interface LoadAssessmentButtonProps {
    deps: LoadAssessmentButtonDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
    handleLoadAssessmentButtonClick: () => void;
}

export const loadAssessmentButtonAutomationId = 'load-assessment-button';

export const LoadAssessmentButton = NamedFC<LoadAssessmentButtonProps>('LoadAssessmentButton', props => {
    const loadButtonStyles = CommandButtonStyle();
    return (
        <InsightsCommandButton
            data-automation-id={loadAssessmentButtonAutomationId}
            // iconProps={{ iconName: 'FabricOpenFolderHorizontal' }}
            insightsCommandButtonIconProps={{ icon: <FolderOpenRegular /> }}
            onClick={props.handleLoadAssessmentButtonClick}
            className={loadButtonStyles.assessmentButton}
        >Load assessment</InsightsCommandButton>
    );
});
