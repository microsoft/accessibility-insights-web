// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { HTMLElementUtils } from '../common/html-element-utils';
import { WindowUtils } from '../common/window-utils';
import { DetailsDialog } from './components/details-dialog';

export class DetailsDialogHandler {
    private onDevToolChangedHandler: () => void;
    private onUserConfigChangedHandler: () => void;

    constructor(private htmlElementUtils: HTMLElementUtils, private windowUtils: WindowUtils) {}

    public backButtonClickHandler = (dialog: DetailsDialog): void => {
        const currentRuleIndex = dialog.state.currentRuleIndex;
        dialog.setState({
            currentRuleIndex: currentRuleIndex - 1,
        });
    };

    public nextButtonClickHandler = (dialog: DetailsDialog): void => {
        const currentRuleIndex = dialog.state.currentRuleIndex;
        dialog.setState({
            currentRuleIndex: currentRuleIndex + 1,
        });
    };

    public inspectButtonClickHandler = (
        dialog: DetailsDialog,
        event: React.SyntheticEvent<MouseEvent>,
    ): void => {
        if (this.canInspect(dialog)) {
            this.hideDialog(dialog);
            dialog.props.devToolActionMessageCreator.setInspectElement(event, dialog.props.target);
        } else {
            dialog.setState({ showInspectMessage: true });
        }
    };

    public showDialog = (dialog: DetailsDialog): void => {
        dialog.setState({ showDialog: true });
    };

    public hideDialog = (dialog: DetailsDialog): void => {
        dialog.setState({ showDialog: false, showInspectMessage: false });
    };

    public isNextButtonDisabled = (dialog: DetailsDialog): boolean => {
        return dialog.state.currentRuleIndex >= Object.keys(dialog.props.failedRules).length - 1;
    };

    public isBackButtonDisabled = (dialog: DetailsDialog): boolean => {
        return dialog.state.currentRuleIndex <= 0;
    };

    public isInspectButtonDisabled = (dialog: DetailsDialog): boolean => {
        return !dialog.state.canInspect;
    };

    public onDevToolChanged = (dialog: DetailsDialog): void => {
        dialog.setState({ canInspect: this.canInspect(dialog) });
    };

    public canInspect = (dialog: DetailsDialog): boolean => {
        const devToolState = dialog.props.devToolStore.getState();
        return devToolState && devToolState.isOpen;
    };

    public shouldShowInspectButtonMessage = (dialog: DetailsDialog): boolean => {
        return dialog.state.showInspectMessage;
    };

    public onUserConfigChanged = (dialog: DetailsDialog): void => {
        const storeState = dialog.props.userConfigStore.getState();
        dialog.setState({
            userConfigurationStoreData: storeState,
        });
    };

    public getFailureInfo = (dialog: DetailsDialog): string => {
        return `Failure ${dialog.state.currentRuleIndex + 1} of ${
            Object.keys(dialog.props.failedRules).length
        } for this target`;
    };

    public isTargetPageOriginSecure = (): boolean => {
        return this.windowUtils.isSecureOrigin();
    };

    public copyIssueDetailsButtonClickHandler = (
        dialog: DetailsDialog,
        event: React.MouseEvent<MouseEvent>,
    ): void => {
        dialog.props.deps.targetPageActionMessageCreator.copyIssueDetailsClicked(event);
        if (!this.isTargetPageOriginSecure()) {
            dialog.setState({ showInsecureOriginPageMessage: true });
        } else {
            dialog.setState({ showInsecureOriginPageMessage: false });
        }
    };

    public shouldShowInsecureOriginPageMessage = (dialog: DetailsDialog): boolean => {
        return dialog.state.showInsecureOriginPageMessage;
    };

    public onLayoutDidMount = (): void => {
        const dialogContainer = this.htmlElementUtils.querySelector(
            '.insights-dialog-main-override',
        ) as HTMLElement;

        if (dialogContainer == null) {
            return;
        }

        let parentLayer = dialogContainer;

        while (parentLayer != null) {
            if (parentLayer.classList.contains('ms-Layer--fixed')) {
                // office fabric uses z-index value as 10000 which is not configurable. So, we have to do this workaround
                parentLayer.style.zIndex = '2147483647';
            }
            parentLayer = parentLayer.parentElement;
        }
    };

    public componentDidMount = (dialog: DetailsDialog): void => {
        if (!this.hasStore(dialog)) {
            return;
        }

        this.onDevToolChangedHandler = () => {
            this.onDevToolChanged(dialog);
        };
        dialog.props.devToolStore.addChangedListener(this.onDevToolChangedHandler);
        this.onDevToolChanged(dialog);

        this.onUserConfigChangedHandler = () => {
            this.onUserConfigChanged(dialog);
        };
        dialog.props.userConfigStore.addChangedListener(this.onUserConfigChangedHandler);
        this.onUserConfigChanged(dialog);
    };

    public componentWillUnmount = (dialog: DetailsDialog): void => {
        dialog.props.devToolStore.removeChangedListener(this.onDevToolChangedHandler);
        dialog.props.userConfigStore.removeChangedListener(this.onUserConfigChangedHandler);
    };

    private hasStore(dialog: DetailsDialog): boolean {
        return dialog.props != null && dialog.props.devToolStore != null;
    }
}
