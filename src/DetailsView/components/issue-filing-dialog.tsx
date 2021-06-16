// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import * as styles from 'DetailsView/components/common-dialog-styles.scss';
import * as issueFilingDialogStyles from 'DetailsView/components/issue-filing-dialog.scss';
import { cloneDeep, isEqual } from 'lodash';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react';
import * as React from 'react';
import { IssueFilingActionMessageCreator } from '../../common/message-creators/issue-filing-action-message-creator';
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
    issueFilingServicePropertiesMap: IssueFilingServicePropertiesMap;
    onClose: (ev?: React.SyntheticEvent) => void;
}

export type IssueFilingDialogDeps = {
    toolData: ToolData;
    userConfigMessageCreator: UserConfigMessageCreator;
    issueFilingServiceProvider: IssueFilingServiceProvider;
    issueFilingActionMessageCreator: IssueFilingActionMessageCreator;
} & IssueFilingSettingsContainerDeps;

const titleLabel = 'Specify issue filing location';

export interface IssueFilingDialogState {
    selectedIssueFilingService: IssueFilingService;
    issueFilingServicePropertiesMap: IssueFilingServicePropertiesMap;
}

export class IssueFilingDialog extends React.Component<
    IssueFilingDialogProps,
    IssueFilingDialogState
> {
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
        const { onClose, isOpen, deps } = this.props;
        const { selectedIssueFilingService } = this.state;
        const selectedIssueFilingServiceData =
            this.state.selectedIssueFilingService.getSettingsFromStoreData(
                this.state.issueFilingServicePropertiesMap,
            );
        const isSettingsValid = selectedIssueFilingService.isSettingsValid(
            selectedIssueFilingServiceData,
        );

        return (
            <Dialog
                hidden={!isOpen}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: titleLabel,
                    subText: 'This configuration can be changed again in settings.',
                    showCloseButton: false,
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: styles.insightsDialogMainOverride,
                    className: issueFilingDialogStyles.issueFilingDialog,
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
                        primaryButtonText={'File issue'}
                    />
                </DialogFooter>
            </Dialog>
        );
    }

    private onPrimaryButtonClick = (ev: React.SyntheticEvent<Element, Event>) => {
        const newData = this.state.selectedIssueFilingService.getSettingsFromStoreData(
            this.state.issueFilingServicePropertiesMap,
        );
        const service = this.state.selectedIssueFilingService.key;
        const payload = {
            issueFilingServiceName: service,
            issueFilingSettings: newData,
        };
        this.props.deps.userConfigMessageCreator.saveIssueFilingSettings(payload);
        this.props.deps.issueFilingActionMessageCreator.fileIssue(
            ev,
            service,
            this.props.selectedIssueData,
            this.props.deps.toolData,
        );
        this.props.onClose(ev);
    };

    private onSelectedServiceChange: OnSelectedServiceChange = service => {
        this.setState(() => ({
            selectedIssueFilingService: this.props.deps.issueFilingServiceProvider.forKey(
                service.issueFilingServiceName,
            ),
        }));
    };

    private onPropertyUpdateCallback: OnPropertyUpdateCallback = payload => {
        const { issueFilingServiceName, propertyName, propertyValue } = payload;
        const selectedServiceData =
            this.state.selectedIssueFilingService.getSettingsFromStoreData(
                this.state.issueFilingServicePropertiesMap,
            ) || {};
        selectedServiceData[propertyName] = propertyValue;
        const newIssueFilingServicePropertiesMap = {
            ...this.state.issueFilingServicePropertiesMap,
            [issueFilingServiceName]: selectedServiceData,
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
