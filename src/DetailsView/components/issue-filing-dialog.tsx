// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep, isEqual } from 'lodash';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { EnvironmentInfoProvider } from '../../common/environment-info-provider';
import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueFilingServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import {
    IssueFilingSettingsContainer,
    IssueFilingSettingsContainerDeps,
    OnPropertyUpdateCallback,
    OnSelectedServiceChange,
} from '../../issue-filing/components/issue-filing-settings-container';
import { IssueFilingServiceProvider } from '../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../issue-filing/types/issue-filing-service';
import { ActionAndCancelButtonsComponent } from './action-and-cancel-buttons-component';

export interface IssueFilingDialogProps {
    deps: IssueFilingDialogDeps;
    isOpen: boolean;
    selectedIssueFilingService: IssueFilingService;
    selectedIssueData: CreateIssueDetailsTextData;
    fileIssueTelemetryCallback: (ev: React.SyntheticEvent) => void;
    issueFilingServicePropertiesMap: IssueFilingServicePropertiesMap;
    onClose: (ev: React.SyntheticEvent) => void;
}

export type IssueFilingDialogDeps = {
    environmentInfoProvider: EnvironmentInfoProvider;
    userConfigMessageCreator: UserConfigMessageCreator;
    issueFilingServiceProvider: IssueFilingServiceProvider;
} & IssueFilingSettingsContainerDeps;

const titleLabel = 'Specify issue filing location';

export interface IssueFilingDialogState {
    selectedIssueFilingService: IssueFilingService;
    issueFilingServicePropertiesMap: IssueFilingServicePropertiesMap;
}

export class IssueFilingDialog extends React.Component<IssueFilingDialogProps, IssueFilingDialogState> {
    constructor(props: IssueFilingDialogProps) {
        super(props);
        this.state = this.getState(props);
    }

    private getState(props: IssueFilingDialogProps): IssueFilingDialogState {
        return {
            issueFilingServicePropertiesMap: cloneDeep(props.issueFilingServicePropertiesMap),
            selectedIssueFilingService: props.selectedIssueFilingService,
        };
    }

    public render(): JSX.Element {
        const { selectedIssueData, onClose, isOpen, deps } = this.props;
        const { selectedIssueFilingService } = this.state;
        const selectedIssueFilingServiceData = this.state.selectedIssueFilingService.getSettingsFromStoreData(
            this.state.issueFilingServicePropertiesMap,
        );
        const environmentInfo = deps.environmentInfoProvider.getEnvironmentInfo();
        const isSettingsValid = selectedIssueFilingService.isSettingsValid(selectedIssueFilingServiceData);
        const href = isSettingsValid
            ? selectedIssueFilingService.issueFilingUrlProvider(selectedIssueFilingServiceData, selectedIssueData, environmentInfo)
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
                <IssueFilingSettingsContainer
                    deps={deps}
                    selectedIssueFilingService={selectedIssueFilingService}
                    selectedIssueFilingServiceData={selectedIssueFilingServiceData}
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
        const newData = this.state.selectedIssueFilingService.getSettingsFromStoreData(this.state.issueFilingServicePropertiesMap);
        const service = this.state.selectedIssueFilingService.key;
        this.props.deps.userConfigMessageCreator.saveIssueFilingSettings(service, newData);
        this.props.fileIssueTelemetryCallback(ev);
        this.props.onClose(ev);
    };

    private onSelectedServiceChange: OnSelectedServiceChange = service => {
        this.setState(() => ({
            selectedIssueFilingService: this.props.deps.issueFilingServiceProvider.forKey(service),
        }));
    };

    private onPropertyUpdateCallback: OnPropertyUpdateCallback = (service, propertyName, propertyValue) => {
        const selectedServiceData =
            this.state.selectedIssueFilingService.getSettingsFromStoreData(this.state.issueFilingServicePropertiesMap) || {};
        selectedServiceData[propertyName] = propertyValue;
        const newIssueFilingServicePropertiesMap = {
            ...this.state.issueFilingServicePropertiesMap,
            [service]: selectedServiceData,
        };
        this.setState(() => ({
            issueFilingServicePropertiesMap: newIssueFilingServicePropertiesMap,
        }));
    };

    public componentDidUpdate(prevProps: Readonly<IssueFilingDialogProps>): void {
        if (this.props.isOpen && isEqual(prevProps, this.props) === false) {
            this.setState(() => this.getState(this.props));
        }
    }
}
