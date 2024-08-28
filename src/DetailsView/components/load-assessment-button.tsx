// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { NamedFC } from 'common/react/named-fc';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { useCommandButtonStyle } from 'DetailsView/components/command-button-styles';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import * as React from 'react';

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
    isNarrowMode?: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
}

export const loadAssessmentButtonAutomationId = 'load-assessment-button';

export const LoadAssessmentButton = NamedFC<LoadAssessmentButtonProps>(
    'LoadAssessmentButton',
    props => {
        const loadButtonStyles = useCommandButtonStyle();
        return (
            <InsightsCommandButton
                data-automation-id={loadAssessmentButtonAutomationId}
                insightsCommandButtonIconProps={{
                    icon: <FluentUIV9Icon iconName="FolderOpenRegular" />,
                }}
                onClick={props.handleLoadAssessmentButtonClick}
                className={loadButtonStyles.assessmentButton}
                ref={props.buttonRef}
                {...props}
            >
                Load assessment
            </InsightsCommandButton>
        );
    },
);
