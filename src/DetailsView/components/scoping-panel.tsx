// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { InspectActionMessageCreator } from '../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../common/message-creators/scoping-action-message-creator';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { ScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericPanel } from './generic-panel';
import { ScopingContainer } from './scoping-container';

export interface ScopingPanelProps {
    isOpen: boolean;
    actionMessageCreator: DetailsViewActionMessageCreator;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    featureFlagData: FeatureFlagStoreData;
    scopingSelectorsData: ScopingStoreData;
}

export class ScopingPanel extends React.Component<ScopingPanelProps> {
    public render(): JSX.Element {
        return (
            <GenericPanel
                title="Scoping"
                isOpen={this.props.isOpen}
                className="scoping-panel"
                onDismiss={this.props.actionMessageCreator.closeScopingPanel}
                closeButtonAriaLabel="Close scoping feature panel"
                hasCloseButton={true}
            >
                <ScopingContainer
                    featureFlagData={this.props.featureFlagData}
                    actionMessageCreator={this.props.actionMessageCreator}
                    scopingSelectorsData={this.props.scopingSelectorsData}
                    scopingActionMessageCreator={
                        this.props.scopingActionMessageCreator
                    }
                    inspectActionMessageCreator={
                        this.props.inspectActionMessageCreator
                    }
                />
                <DefaultButton
                    className="closing-scoping-panel"
                    primary={true}
                    text="OK"
                    onClick={this.props.actionMessageCreator.closeScopingPanel}
                />
            </GenericPanel>
        );
    }
}
