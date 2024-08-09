// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { useCommandButtonStyle } from 'DetailsView/components/command-button-styles';

import * as React from 'react';

export interface SaveAssessmentButtonDeps {
    getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator;
    userConfigMessageCreator: UserConfigMessageCreator;
}
export interface SaveAssessmentButtonProps {
    download: string;
    href: string;
    deps: SaveAssessmentButtonDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    handleSaveAssesmentButtonClick: (event: React.MouseEvent<any>) => void;
}

export const SaveAssessmentButton = NamedFC<SaveAssessmentButtonProps>(
    'SaveAssessmentButton',
    props => {
        const saveAssessmentStyles = useCommandButtonStyle();

        return (
            <>
                <InsightsCommandButton
                    as="a"
                    className={saveAssessmentStyles?.assessmentButton}
                    download={props.download}
                    href={props.href}
                    onClick={props.handleSaveAssesmentButtonClick}
                    insightsCommandButtonIconProps={{
                        icon: <FluentUIV9Icon iconName="SaveRegular" />,
                    }}
                    {...props}
                >
                    Save assessment
                </InsightsCommandButton>
            </>
        );
    },
);
