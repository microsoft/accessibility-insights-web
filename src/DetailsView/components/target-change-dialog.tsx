// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import * as React from 'react';

import * as Markup from '../../assessments/markup';
import { NewTabLink } from '../../common/components/new-tab-link';
import { ITab } from '../../common/itab';
import { PersistedTabInfo } from '../../common/types/store-data/iassessment-result-data';
import { UrlParser } from '../../common/url-parser';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export type TargetChangeDialogDeps = {
    urlParser: UrlParser;
};

export interface TargetChangeDialogProps {
    deps: TargetChangeDialogDeps;
    prevTab: PersistedTabInfo;
    newTab: ITab;
    actionMessageCreator: DetailsViewActionMessageCreator;
}

export class TargetChangeDialog extends React.Component<TargetChangeDialogProps> {
    public render(): JSX.Element {
        const { prevTab, newTab } = this.props;
        if (!this.showTargetChangeDialog(prevTab, newTab)) {
            return null;
        }
        return (
            <Dialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Assessment in progress',
                }}
                modalProps={{
                    className: 'target-change-dialog-modal',
                    isBlocking: true,
                    containerClassName: 'insights-dialog-main-override target-change-dialog',
                    subtitleAriaId: 'target-change-dialog-description',
                }}
            >
                <div id="target-change-dialog-description">
                    <div>
                        There is already an assessment running on&nbsp;
                        {this.renderPreviousTabLink(this.props.prevTab)}. Would you like to continue your current assessment on the new
                        target of&nbsp;
                        {this.renderCurrentTabLink(this.props.newTab)}?
                    </div>
                    <p>
                        <Markup.Term>Note</Markup.Term>: If 'Continue previous' is selected, the previous assessment will be connected to
                        this new page.
                    </p>
                    <p>If 'Start new' is selected, all previous progress will be lost.</p>
                </div>

                <DialogFooter>
                    <div className="target-change-dialog-button-container">
                        <div className="button ms-Grid-col  action-cancel-button-col restart-button">
                            <DefaultButton text="Start new" onClick={this.props.actionMessageCreator.startOverAllAssessments} />
                        </div>

                        <div className="button ms-Grid-col  action-cancel-button-col continue-button">
                            <DefaultButton
                                autoFocus={true}
                                text="Continue previous"
                                onClick={this.props.actionMessageCreator.continuePreviousAssessment}
                            />
                        </div>
                    </div>
                </DialogFooter>
            </Dialog>
        );
    }

    private renderPreviousTabLink(tab: ITab): JSX.Element {
        return (
            <TooltipHost content={tab.url} id={'previous-target-page-link'} calloutProps={{ gapSpace: 0 }}>
                <NewTabLink role="link" className="target-page-link" href={tab.url}>
                    {tab.title}
                </NewTabLink>
            </TooltipHost>
        );
    }

    private renderCurrentTabLink(tab: ITab): JSX.Element {
        return (
            <TooltipHost content={tab.url} id={'current-target-page-link'} calloutProps={{ gapSpace: 0 }}>
                <Link role="link" className="target-page-link" onClick={this.props.actionMessageCreator.switchToTargetTab}>
                    {tab.title}
                </Link>
            </TooltipHost>
        );
    }

    private showTargetChangeDialog(prevTab: PersistedTabInfo, newTab: ITab): boolean {
        if (isEmpty(prevTab)) {
            return false;
        }

        if (prevTab.appRefreshed) {
            return true;
        }

        const { urlParser } = this.props.deps;
        const urlChanged = prevTab.url && urlParser.areURLHostNamesEqual(prevTab.url, newTab.url) === false;

        return this.didTargetTabChanged(prevTab, newTab) || urlChanged === true;
    }

    private didTargetTabChanged(prevTab: PersistedTabInfo, newTab: ITab): boolean {
        return prevTab.id !== newTab.id;
    }
}
