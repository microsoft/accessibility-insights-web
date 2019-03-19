// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { IToggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

import { VisualizationToggle } from '../../../common/components/visualization-toggle';
import { VisualizationConfiguration, VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { KeyCodeConstants } from '../../../common/constants/keycode-constants';
import { FeatureFlags } from '../../../common/feature-flags';
import { TelemetryEventSource } from '../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { IVisualizationStoreData } from '../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DictionaryStringTo } from '../../../types/common-types';
import { ContentLink, ContentLinkDeps } from '../../../views/content/content-link';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { DiagnosticViewClickHandler } from '../handlers/diagnostic-view-toggle-click-handler';

export interface DiagnosticViewToggleProps {
    deps: DiagnosticViewToggleDeps;
    featureFlags: DictionaryStringTo<boolean>;
    type: VisualizationType;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    visualizationStoreData: IVisualizationStoreData;
    actionMessageCreator: PopupActionMessageCreator;
    clickHandler: DiagnosticViewClickHandler;
    shortcutCommands: chrome.commands.Command[];
    telemetrySource: TelemetryEventSource;
    dom: NodeSelector & Node;
}

export type DiagnosticViewToggleDeps = ContentLinkDeps;

export interface DiagnosticViewToggleState {
    isFocused: boolean;
}

export class DiagnosticViewToggle extends React.Component<DiagnosticViewToggleProps, DiagnosticViewToggleState> {
    private configuration: VisualizationConfiguration;
    private _toggle: React.RefObject<IToggle> = React.createRef<IToggle>();
    private dom: NodeSelector & Node;
    private _isMounted: boolean;
    private _userEventListenerAdded: boolean;

    constructor(props: DiagnosticViewToggleProps) {
        super(props);
        this.configuration = this.props.visualizationConfigurationFactory.getConfiguration(this.props.type);
        this.dom = this.props.dom;
        this._isMounted = false;
        this._userEventListenerAdded = false;
        this.state = {
            isFocused: false,
        };
    }

    public render(): JSX.Element {
        const displayableData = this.configuration.displayableData;
        const shortcut = this.getCommandShortcut();
        return (
            <div>
                <div className="ms-Grid-row view-toggle-row">
                    <div className="ms-Grid-col ms-sm7">
                        <div className="ms-fontColor-neutralPrimary ms-fontWeight-semibold ms-fontSize-mPlus">{displayableData.title}</div>
                    </div>
                    <div className="ms-Grid-col ms-sm5 view-toggle-col" style={{ float: 'right' }}>
                        {this.renderToggleOrSpinner()}
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm8">{this.renderLink(displayableData.linkToDetailsViewText)}</div>
                    <div className="ms-Grid-col ms-sm4 shortcut-label" style={{ float: 'right' }}>
                        <div className="ms-font-xs">{shortcut}</div>
                    </div>
                </div>
            </div>
        );
    }

    private renderToggleOrSpinner(): JSX.Element {
        const _scanning = this.props.visualizationStoreData.scanning;
        const id = this.configuration.getIdentifier();
        const _scanData = this.configuration.getStoreData(this.props.visualizationStoreData.tests);

        if (_scanning === id) {
            return <Spinner size={SpinnerSize.small} componentRef={this.addUserEventListener} />;
        } else {
            const disabled = _scanning != null;
            return (
                <VisualizationToggle
                    checked={_scanData.enabled}
                    disabled={disabled}
                    onClick={ev => this.props.clickHandler.toggleVisualization(this.props.visualizationStoreData, this.props.type, ev)}
                    visualizationName={this.configuration.displayableData.title}
                    componentRef={this._toggle}
                    onFocus={this.onFocusHandler}
                    onBlur={this.onBlurHandler}
                />
            );
        }
    }

    public componentDidMount(): void {
        this._isMounted = true;
        this.setFocus();
    }

    public componentDidUpdate(): void {
        this.setFocus();
    }

    private setFocus(): void {
        if (this._isMounted && this.state.isFocused && this._toggle.current) {
            this._toggle.current.focus();
        }
    }

    @autobind
    private onFocusHandler(): void {
        if (this._isMounted) {
            this.setState({
                isFocused: true,
            });
        }
    }

    @autobind
    private onBlurHandler(): void {
        if (this._isMounted) {
            this.setState({
                isFocused: false,
            });
        }
    }

    @autobind
    private addUserEventListener(): void {
        if (!this._userEventListenerAdded) {
            this.dom.addEventListener('keydown', (event: any) => {
                if (event.keyCode === KeyCodeConstants.TAB) {
                    this.onBlurHandler();
                }
            });

            const hamburgerButton = this.dom.querySelector('.feedback-collapse-menu-button');
            if (hamburgerButton != null) {
                hamburgerButton.addEventListener('click', event => {
                    this.onBlurHandler();
                });
            }

            this._userEventListenerAdded = true;
        }
    }

    private renderLink(linkText: string): JSX.Element {
        const isAssessmentEnabled = this.props.featureFlags[FeatureFlags.newAssessmentExperience];
        if (isAssessmentEnabled && this.configuration.guidance) {
            return <ContentLink deps={this.props.deps} reference={this.configuration.guidance} linkText={linkText} />;
        }

        const pivot = isAssessmentEnabled ? DetailsViewPivotType.fastPass : DetailsViewPivotType.allTest;

        return (
            <Link
                className="insights-link"
                href="#"
                onClick={ev =>
                    this.props.actionMessageCreator.openDetailsView(ev as any, this.props.type, this.props.telemetrySource, pivot)
                }
            >
                {linkText}
            </Link>
        );
    }

    private getCommandShortcut(): string {
        const commandName: string = this.configuration.chromeCommand;

        for (const command of this.props.shortcutCommands) {
            if (command.name === commandName) {
                return command.shortcut;
            }
        }

        throw new Error(`Cannot find command for name: ${commandName}`);
    }
}
