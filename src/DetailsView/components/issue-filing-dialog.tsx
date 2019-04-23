// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep, isEqual } from 'lodash';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { BugFilingServiceProvider } from '../../bug-filing/bug-filing-service-provider';
import {
    BugFilingSettingsContainer,
    BugFilingSettingsContainerDeps,
    OnPropertyUpdateCallback,
    OnSelectedServiceChange,
} from '../../bug-filing/components/bug-filing-settings-container';
import { BugFilingService } from '../../bug-filing/types/bug-filing-service';
import { EnvironmentInfoProvider } from '../../common/environment-info-provider';
import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { ActionAndCancelButtonsComponent } from './action-and-cancel-buttons-component';

export interface IssueFilingDialogProps {
    deps: IssueFilingDialogDeps;
    isOpen: boolean;
    selectedBugFilingService: BugFilingService;
    selectedBugData: CreateIssueDetailsTextData;
    bugFileTelemetryCallback: (ev: React.SyntheticEvent) => void;
    bugServicePropertiesMap: BugServicePropertiesMap;
    onClose: (ev: React.SyntheticEvent) => void;
}

export type IssueFilingDialogDeps = {
    environmentInfoProvider: EnvironmentInfoProvider;
    userConfigMessageCreator: UserConfigMessageCreator;
    bugFilingServiceProvider: BugFilingServiceProvider;
} & BugFilingSettingsContainerDeps;

const titleLabel = 'Specify issue filing location';

export interface IssueFilingDialogState {
    selectedBugFilingService: BugFilingService;
    bugServicePropertiesMap: BugServicePropertiesMap;
}

export class IssueFilingDialog extends React.Component<IssueFilingDialogProps, IssueFilingDialogState> {
    constructor(props: IssueFilingDialogProps) {
        super(props);
        this.state = this.getState(props);
    }

    private getState(props: IssueFilingDialogProps): IssueFilingDialogState {
        return {
            bugServicePropertiesMap: cloneDeep(props.bugServicePropertiesMap),
            selectedBugFilingService: props.selectedBugFilingService,
        };
    }

    public render(): JSX.Element {
        const { selectedBugData, onClose, isOpen, deps } = this.props;
        const { selectedBugFilingService } = this.state;
        const selectedBugFilingServiceData = this.state.selectedBugFilingService.getSettingsFromStoreData(
            this.state.bugServicePropertiesMap,
        );
        const environmentInfo = deps.environmentInfoProvider.getEnvironmentInfo();
        const isSettingsValid = selectedBugFilingService.isSettingsValid(selectedBugFilingServiceData);
        const href = isSettingsValid
            ? selectedBugFilingService.issueFilingUrlProvider(selectedBugFilingServiceData, selectedBugData, environmentInfo)
            : null;

        return (
            <Dialog
                className={'issue-filing-dialog'}
                hidden={!isOpen}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: titleLabel,
                    subText: 'This configuration can be changed again in settings.',
                    showCloseButton: false,
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'insights-dialog-main-override',
                }}
                onDismiss={onClose}
            >
                <BugFilingSettingsContainer
                    deps={deps}
                    selectedBugFilingService={selectedBugFilingService}
                    selectedBugFilingServiceData={selectedBugFilingServiceData}
                    onPropertyUpdateCallback={this.onPropertyUpdateCallback}
                    onSelectedServiceChange={this.onSelectedServiceChange}
                />
                <DialogFooter>
                    <ActionAndCancelButtonsComponent
                        isHidden={false}
                        primaryButtonDisabled={isSettingsValid === false}
                        primaryButtonOnClick={this.onPrimaryButtonClick}
                        cancelButtonOnClick={onClose}
                        primaryButtonHref={href}
                        primaryButtonText={'File issue'}
                    />
                </DialogFooter>
            </Dialog>
        );
    }

    private onPrimaryButtonClick = (ev: React.SyntheticEvent<Element, Event>) => {
        const newData = this.state.selectedBugFilingService.getSettingsFromStoreData(this.state.bugServicePropertiesMap);
        const service = this.state.selectedBugFilingService.key;
        this.props.deps.userConfigMessageCreator.saveIssueFilingSettings(service, newData);
        this.props.bugFileTelemetryCallback(ev);
        this.props.onClose(ev);
    };

    private onSelectedServiceChange: OnSelectedServiceChange = service => {
        this.setState(() => ({
            selectedBugFilingService: this.props.deps.bugFilingServiceProvider.forKey(service),
        }));
    };

    private onPropertyUpdateCallback: OnPropertyUpdateCallback = (service, propertyName, propertyValue) => {
        const selectedServiceData = this.state.selectedBugFilingService.getSettingsFromStoreData(this.state.bugServicePropertiesMap) || {};
        selectedServiceData[propertyName] = propertyValue;
        const newBugServicePropertiesMap = {
            ...this.state.bugServicePropertiesMap,
            [service]: selectedServiceData,
        };
        this.setState(() => ({
            bugServicePropertiesMap: newBugServicePropertiesMap,
        }));
    };

    public componentDidUpdate(prevProps: Readonly<IssueFilingDialogProps>): void {
        if (this.props.isOpen && isEqual(prevProps, this.props) === false) {
            this.setState(() => this.getState(this.props));
        }
    }
}
