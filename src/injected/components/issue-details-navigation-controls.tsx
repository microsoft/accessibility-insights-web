// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
import styles from 'common/styles/button.scss';
import * as React from 'react';
import { NamedFC } from '../../common/react/named-fc';
import { DetailsDialog } from './details-dialog';

export type IssueDetailsNavigationClickHandler = {
    nextButtonClickHandler: (container: DetailsDialog) => void;
    backButtonClickHandler: (container: DetailsDialog) => void;
    isBackButtonDisabled: (container: DetailsDialog) => boolean;
    isNextButtonDisabled: (container: DetailsDialog) => boolean;
    getFailureInfo: (container: DetailsDialog) => string;
};

export type IssueDetailsNavigationControlsProps = {
    container: DetailsDialog;
    dialogHandler: IssueDetailsNavigationClickHandler;
    failuresCount: number;
};

export const IssueDetailsNavigationControls = NamedFC<IssueDetailsNavigationControlsProps>(
    'IssueDetailsNavigationControls',
    props => {
        const onClickNextButton = event =>
            props.dialogHandler.nextButtonClickHandler(props.container);
        const onClickBackButton = event =>
            props.dialogHandler.backButtonClickHandler(props.container);

        if (props.failuresCount <= 1) {
            return null;
        }
        const backText = '< Back';
        const nextText = 'Next >';

        const renderBackButton = () =>
            !props.dialogHandler.isBackButtonDisabled(props.container) && (
                <Button
                    className={styles.detailsDialogButton}
                    data-automation-id="back"
                    onClick={onClickBackButton}
                >
                    {backText}
                </Button>
            );

        const renderNextButton = () =>
            !props.dialogHandler.isNextButtonDisabled(props.container) && (
                <Button
                    className={styles.detailsDialogButton}
                    data-automation-id="next"
                    onClick={onClickNextButton}
                >
                    {nextText}
                </Button>
            );

        return (
            <div className="insights-dialog-next-and-back-container">
                <div>{renderBackButton()}</div>
                <div>{props.dialogHandler.getFailureInfo(props.container)}</div>
                <div>{renderNextButton()}</div>
            </div>
        );
    },
);
