// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button, mergeClasses } from '@fluentui/react-components';
import { InspectActionMessageCreator } from 'common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from 'common/message-creators/scoping-action-message-creator';
import styles from 'common/styles/button.scss';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../../../actions/details-view-action-message-creator';
import { GenericPanel } from '../../generic-panel';
import { ScopingContainer } from './scoping-container';

export type ScopingPanelDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface ScopingPanelProps {
    deps: ScopingPanelDeps;
    isOpen: boolean;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    featureFlagData: FeatureFlagStoreData;
    scopingSelectorsData: ScopingStoreData;
}

export class ScopingPanel extends React.Component<ScopingPanelProps> {
    public render(): JSX.Element {
        return (
            <GenericPanel
                headerText="Scoping"
                isOpen={this.props.isOpen}
                className="scoping-panel"
                onDismiss={this.props.deps.detailsViewActionMessageCreator.closeScopingPanel}
                closeButtonAriaLabel="Close scoping feature panel"
                hasCloseButton={true}
            >
                <ScopingContainer
                    deps={this.props.deps}
                    featureFlagData={this.props.featureFlagData}
                    scopingSelectorsData={this.props.scopingSelectorsData}
                    scopingActionMessageCreator={this.props.scopingActionMessageCreator}
                    inspectActionMessageCreator={this.props.inspectActionMessageCreator}
                />
                <div className={styles.buttonsComponent}>
                    <div className={styles.buttonCol}>
                        <Button
                            appearance="primary"
                            className={mergeClasses(styles.primaryButton, 'closing-scoping-panel')}
                            onClick={
                                this.props.deps.detailsViewActionMessageCreator.closeScopingPanel
                            }
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </GenericPanel>
        );
    }
}
