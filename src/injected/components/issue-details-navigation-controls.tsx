// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { FeatureFlags } from '../../common/feature-flags';
import { NamedSFC } from '../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
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
    featureFlagStoreData: FeatureFlagStoreData;
    failuresCount: number;
};

export const IssueDetailsNavigationControls = NamedSFC<IssueDetailsNavigationControlsProps>('IssueDetailsNavigationControls', props => {
    const onClickNextButton = event => props.dialogHandler.nextButtonClickHandler(props.container);
    const onClickBackButton = event => props.dialogHandler.backButtonClickHandler(props.container);

    const getOnClickWhenNotInShadowDom = (func: (ev: any) => void): ((ev: any) => void) => {
        if (props.featureFlagStoreData[FeatureFlags.shadowDialog]) {
            return null;
        } else {
            return func;
        }
    };

    if (props.failuresCount <= 1) {
        return null;
    }

    return (
        <div className="ms-Grid insights-dialog-next-and-back-container">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 insights-dialog-button-left">
                    <PrimaryButton
                        data-automation-id="back"
                        disabled={props.dialogHandler.isBackButtonDisabled(props.container)}
                        text="< Back"
                        onClick={getOnClickWhenNotInShadowDom(onClickBackButton)}
                    />
                </div>
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 insights-dialog-footer">
                    <div>{props.dialogHandler.getFailureInfo(props.container)}</div>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 insights-dialog-button-right">
                    <PrimaryButton
                        data-automation-id="next"
                        disabled={props.dialogHandler.isNextButtonDisabled(props.container)}
                        text="Next >"
                        onClick={getOnClickWhenNotInShadowDom(onClickNextButton)}
                    />
                </div>
            </div>
        </div>
    );
});
