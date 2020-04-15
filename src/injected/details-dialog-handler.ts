// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { FeatureFlags } from '../common/feature-flags';
import { HTMLElementUtils } from '../common/html-element-utils';
import { DetailsDialog } from './components/details-dialog';

export class DetailsDialogHandler {
    private onDevToolChangedHandler: () => void;
    private onUserConfigChangedHandler: () => void;

    constructor(private htmlElementUtils: HTMLElementUtils) {}

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

        if (dialog.props.featureFlagStoreData[FeatureFlags.shadowDialog]) {
            this.addListenerForDialogInShadowDom(dialog);
        }
    };

    private addListenerForDialogInShadowDom(dialog: DetailsDialog): void {
        const shadowRoot = this.htmlElementUtils.querySelector('#insights-shadow-host').shadowRoot;

        this.addEventListenerToCloseContainer(shadowRoot);
        this.addEventListenerToBackAndNextButton(shadowRoot, dialog);
        this.addEventListenerToInspectButton(shadowRoot, dialog);
    }

    private addEventListenerToCloseContainer(shadowRoot: ShadowRoot): void {
        const closeButtonListener = () => {
            this.closeWindow(shadowRoot);
        };
        this.addShadowClickEventListener(shadowRoot, '.insights-dialog-close', closeButtonListener);

        const modal = shadowRoot.querySelector('.insights-dialog-main-override-shadow');
        if (modal != null) {
            this.htmlElementUtils.getBody().classList.add('insights-modal');
            modal.addEventListener('click', ev => {
                if (modal === ev.target) {
                    this.closeWindow(shadowRoot);
                }
            });
        }
    }

    private addEventListenerToBackAndNextButton(
        shadowRoot: ShadowRoot,
        dialog: DetailsDialog,
    ): void {
        const leftButtonListener = () => {
            if (!dialog.isBackButtonDisabled()) {
                dialog.onClickBackButton();
            }
        };

        const rightButtonListener = () => {
            if (!dialog.isNextButtonDisabled()) {
                dialog.onClickNextButton();
            }
        };

        this.addShadowClickEventListener(
            shadowRoot,
            '.insights-dialog-button-left',
            leftButtonListener,
        );
        this.addShadowClickEventListener(
            shadowRoot,
            '.insights-dialog-button-right',
            rightButtonListener,
        );
    }

    private addEventListenerToInspectButton(shadowRoot: ShadowRoot, dialog: DetailsDialog): void {
        const inspectButtonListener = ev => {
            if (!dialog.isInspectButtonDisabled()) {
                dialog.onClickInspectButton(ev);
                this.closeWindow(shadowRoot);
            }
        };
        this.addShadowClickEventListener(
            shadowRoot,
            '.insights-dialog-button-inspect',
            inspectButtonListener,
        );
    }

    public componentWillUnmount = (dialog: DetailsDialog): void => {
        dialog.props.devToolStore.removeChangedListener(this.onDevToolChangedHandler);
        dialog.props.userConfigStore.removeChangedListener(this.onUserConfigChangedHandler);
    };

    private hasStore(dialog: DetailsDialog): boolean {
        return dialog.props != null && dialog.props.devToolStore != null;
    }

    private addShadowClickEventListener(
        shadowRoot: ShadowRoot,
        selector: string,
        listener: (ev?) => void,
    ): void {
        const clickable = shadowRoot.querySelector(selector);
        if (clickable != null) {
            clickable.addEventListener('click', listener);
        }
    }

    private closeWindow(shadowRoot: ShadowRoot): void {
        const shadowContainer = shadowRoot.querySelector('#insights-shadow-container');
        const dialogContainer = shadowContainer.querySelector('.insights-shadow-dialog-container');
        if (dialogContainer) {
            dialogContainer.parentNode.removeChild(dialogContainer);
        }
        const body = this.htmlElementUtils.getBody();
        body.classList.remove(...['insights-modal']);
    }
}
