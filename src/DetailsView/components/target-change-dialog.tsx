// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { css } from '@uifabric/utilities';
import { Tab } from 'common/itab';
import { NamedFC } from 'common/react/named-fc';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { UrlParser } from 'common/url-parser';
import {
    ChangeAssessmentDialog,
    ChangeAssessmentDialogProps,
} from 'DetailsView/components/change-assessment-dialog';
import * as styles from 'DetailsView/components/target-change-dialog.scss';
import { isEmpty } from 'lodash';
import { Link, TooltipHost } from 'office-ui-fabric-react';
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

export const TargetChangeDialog = NamedFC<TargetChangeDialogProps>('TargetChangeDialog', props => {
    const dialogProps: ChangeAssessmentDialogProps = {
        deps: props.deps,
        prevTab: props.prevTab,
        dialogContentTitle: 'Assessment in progress',
        subtitleAriaId: 'target-change-dialog-description',
        divId: 'target-change-dialog-description',
        leftButtonText: 'Continue previous',
        leftButtonOnClick: props.deps.detailsViewActionMessageCreator.continuePreviousAssessment,
        rightButtonText: 'Start new',
        rightButtonOnClick: props.deps.detailsViewActionMessageCreator.startOverAllAssessments,
        dialogFirstText: (
            <>
                Would you like to continue your current assessment on the new target of{' '}
                {renderCurrentTabLink(props.newTab)}?
            </>
        ),
        dialogNoteText:
            "If 'Continue previous' is selected, the previous assessment will be connected to this new page.",
        dialogWarningText: "If 'Start new' is selected, all previous progress will be lost.",
        isOpen: showTargetChangeDialog(props.prevTab, props.newTab, props.deps.urlParser),
        rightButtonStyle: styles.restartButton,
        rightButtonDataAutomationId: 'target-change-start-new-button',
    };

    return <ChangeAssessmentDialog {...dialogProps} />;

    function renderCurrentTabLink(tab: Tab): JSX.Element {
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
                    onClick={props.deps.detailsViewActionMessageCreator.switchToTargetTab}
                >
                    {tab.title}
                </Link>
            </TooltipHost>
        );
    }

    function showTargetChangeDialog(
        prevTab: PersistedTabInfo,
        newTab: Tab,
        urlParser: UrlParser,
    ): boolean {
        if (isEmpty(prevTab)) {
            return false;
        }

        if (prevTab.appRefreshed) {
            return true;
        }

        const urlChanged = prevTab.url && urlParser.areURLsEqual(prevTab.url, newTab.url) === false;

        return didTargetTabChanged(prevTab, newTab) || urlChanged === true;
    }

    function didTargetTabChanged(prevTab: PersistedTabInfo, newTab: Tab): boolean {
        return prevTab.id !== newTab.id;
    }
});
