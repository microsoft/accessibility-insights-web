// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar, MessageBarType } from '@fluentui/react';
import { DisplayableStrings } from 'common/constants/displayable-strings';
import { NamedFC } from 'common/react/named-fc';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import * as React from 'react';

export const InjectionFailedWarningContainerAutomationId = 'injection-failed-warning-container';

export type InjectionFailedWarningProps = {
    visualizationStoreData: VisualizationStoreData;
};

export const InjectionFailedWarning = NamedFC<InjectionFailedWarningProps>(
    'injection-failed-warning',
    props => {
        if (!props.visualizationStoreData.injectionFailed) {
            return null;
        } else {
            return (
                <MessageBar key="injection-failed" messageBarType={MessageBarType.warning}>
                    <div data-automation-id={InjectionFailedWarningContainerAutomationId}>
                        {DisplayableStrings.injectionFailed}
                    </div>
                </MessageBar>
            );
        }
    },
);
