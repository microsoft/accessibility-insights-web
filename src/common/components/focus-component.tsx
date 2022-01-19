// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { WindowUtils } from 'common/window-utils';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import * as React from 'react';

export interface FocusComponentProps {
    windowUtils: WindowUtils;
    configuration: VisualizationConfiguration;
    visualizationStoreData: VisualizationStoreData;
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
}

export class FocusComponent extends React.Component<FocusComponentProps> {
    private static readonly focusEventName = 'focus';

    public componentDidMount(): void {
        this.props.windowUtils.addEventListener(
            this.props.windowUtils.getWindow(),
            FocusComponent.focusEventName,
            this.handleFocusEvent,
            false,
        );
    }

    public componentWillUnmount(): void {
        this.props.windowUtils.removeEventListener(
            this.props.windowUtils.getWindow(),
            FocusComponent.focusEventName,
            this.handleFocusEvent,
            false,
        );
    }

    private handleFocusEvent = () => {
        const tabbing = this.props.configuration.getStoreData(
            this.props.visualizationStoreData.tests,
        );
        if (tabbing.enabled) {
            this.props.tabStopRequirementActionMessageCreator.updateTabbingCompleted(true);
        }
    };

    public render(): JSX.Element {
        return null;
    }
}
