// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as Markup from 'assessments/markup';
import { BlockingDialog } from 'common/components/blocking-dialog';
import { NewTabLink } from 'common/components/new-tab-link';
import { Tab } from 'common/itab';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { UrlParser } from 'common/url-parser';
import * as styles from 'DetailsView/components/target-change-dialog.scss';
import { isEmpty } from 'lodash';
import { DefaultButton, DialogFooter, DialogType, Link, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export type TargetChangeDialogDeps = {
    urlParser: UrlParser;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface TargetChangeDialogProps {
    deps: TargetChangeDialogDeps;
    prevTab: PersistedTabInfo;
    newTab: Tab;
}

export class TargetChangeDialog extends React.Component<TargetChangeDialogProps> {
    public render(): JSX.Element {
        const { prevTab, newTab } = this.props;
        if (!this.showTargetChangeDialog(prevTab, newTab)) {
            return null;
        }
        return (
            <BlockingDialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Assessment in progress',
                }}
                modalProps={{
                    className: styles.targetChangeDialogModal,
                    containerClassName: css(
                        'insights-dialog-main-override',
                        styles.targetChangeDialog,
                    ),
                    subtitleAriaId: 'target-change-dialog-description',
                }}
            >
                <div id="target-change-dialog-description">
                    <div>
                        There is already an assessment running on&nbsp;
                        {this.renderPreviousTabLink(this.props.prevTab)}. Would you like to continue
                        your current assessment on the new target of&nbsp;
                        {this.renderCurrentTabLink(this.props.newTab)}?
                    </div>
                    <p>
                        <Markup.Term>Note</Markup.Term>: If 'Continue previous' is selected, the
                        previous assessment will be connected to this new page.
                    </p>
                    <p>If 'Start new' is selected, all previous progress will be lost.</p>
                </div>

                <DialogFooter>
                    <div className={styles.targetChangeDialogButtonContainer}>
                        <div className={css(styles.actionCancelButtonCol, styles.continueButton)}>
                            <DefaultButton
                                autoFocus={true}
                                text="Continue previous"
                                onClick={
                                    this.props.deps.detailsViewActionMessageCreator
                                        .continuePreviousAssessment
                                }
                            />
                        </div>
                        <div className={css(styles.actionCancelButtonCol, styles.restartButton)}>
                            <DefaultButton
                                text="Start new"
                                onClick={
                                    this.props.deps.detailsViewActionMessageCreator
                                        .startOverAllAssessments
                                }
                            />
                        </div>
                    </div>
                </DialogFooter>
            </BlockingDialog>
        );
    }

    private renderPreviousTabLink(tab: Tab): JSX.Element {
        return (
            <TooltipHost
                content={tab.url}
                id={'previous-target-page-link'}
                calloutProps={{ gapSpace: 0 }}
            >
                <NewTabLink role="link" href={tab.url}>
                    {tab.title}
                </NewTabLink>
            </TooltipHost>
        );
    }

    private renderCurrentTabLink(tab: Tab): JSX.Element {
        return (
            <TooltipHost
                content={tab.url}
                id={'current-target-page-link'}
                calloutProps={{ gapSpace: 0 }}
            >
                <Link
                    as="a" // force Link to use an anchor tag in order have proper dom structure
                    tabIndex={0}
                    role="link"
                    className={css('insights-link')}
                    onClick={this.props.deps.detailsViewActionMessageCreator.switchToTargetTab}
                >
                    {tab.title}
                </Link>
            </TooltipHost>
        );
    }

    private showTargetChangeDialog(prevTab: PersistedTabInfo, newTab: Tab): boolean {
        if (isEmpty(prevTab)) {
            return false;
        }

        if (prevTab.appRefreshed) {
            return true;
        }

        const { urlParser } = this.props.deps;
        const urlChanged = prevTab.url && urlParser.areURLsEqual(prevTab.url, newTab.url) === false;

        return this.didTargetTabChanged(prevTab, newTab) || urlChanged === true;
    }

    private didTargetTabChanged(prevTab: PersistedTabInfo, newTab: Tab): boolean {
        return prevTab.id !== newTab.id;
    }
}
