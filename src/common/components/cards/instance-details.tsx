// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import { KeyCodeConstants } from 'common/constants/keycode-constants';
import { NamedFC } from 'common/react/named-fc';
import { CardResult } from 'common/types/store-data/card-view-model';
import { forOwn, isEmpty } from 'lodash';
import * as React from 'react';
import {
    instanceDetailsCard,
    instanceDetailsCardContainer,
    reportInstanceTable,
    selected,
} from 'reports/components/instance-details.scss';

import {
    CardRowDeps,
    PropertyConfiguration,
} from '../../../common/configs/unified-result-property-configurations';
import { CardSelectionMessageCreator } from '../../../common/message-creators/card-selection-message-creator';
import {
    StoredInstancePropertyBag,
    TargetAppData,
    UnifiedRule,
} from '../../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { InstanceDetailsFooter, InstanceDetailsFooterDeps } from './instance-details-footer';

export const instanceCardAutomationId = 'instance-card';

export type InstanceDetailsDeps = {
    getPropertyConfigById: (id: string) => PropertyConfiguration;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
} & CardRowDeps &
    InstanceDetailsFooterDeps;

export type InstanceDetailsProps = {
    deps: InstanceDetailsDeps;
    result: CardResult;
    index: number;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    rule: UnifiedRule;
};

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetails', props => {
    const { result, index, deps, userConfigurationStoreData, rule, targetAppInfo } = props;

    const isHighlightSupported: boolean = deps.cardInteractionSupport.supportsHighlighting;

    const renderCardRowsForPropertyBag = (propertyBag: StoredInstancePropertyBag) => {
        let propertyIndex = 0;
        const cardRows = [];
        forOwn(propertyBag, (propertyData, propertyName) => {
            const propertyConfig = deps.getPropertyConfigById(propertyName);
            if (!isEmpty(propertyConfig)) {
                const CardRow = propertyConfig.cardRow;
                ++propertyIndex;
                cardRows.push(
                    <CardRow
                        deps={deps}
                        propertyData={propertyData}
                        index={index}
                        key={`${propertyName}-${propertyIndex}`}
                    />,
                );
            }
        });
        return <>{cardRows}</>;
    };

    const cardClickHandler = (event: React.SyntheticEvent): void => {
        if (isHighlightSupported) {
            deps.cardSelectionMessageCreator.toggleCardSelection(result.ruleId, result.uid, event);
        }
    };

    const cardKeyPressHandler = (event: React.KeyboardEvent<any>): void => {
        if (
            event.keyCode === KeyCodeConstants.ENTER ||
            event.keyCode === KeyCodeConstants.SPACEBAR
        ) {
            event.preventDefault();
            cardClickHandler(event);
        }
    };

    const instanceDetailsCardStyling = classNames({
        [instanceDetailsCard]: true,
        [selected]: isHighlightSupported ? result.isSelected : false,
    });

    const instanceDetailsCardContainerStyling = classNames({
        [instanceDetailsCardContainer]: true,
        [selected]: isHighlightSupported ? result.isSelected : false,
    });

    const cardAriaLabel = `${
        result.identifiers && result.identifiers.identifier ? result.identifiers.identifier : ''
    } card`;

    return (
        <div
            data-automation-id={instanceCardAutomationId}
            className={instanceDetailsCardContainerStyling}
            role="table"
        >
            <div
                className={instanceDetailsCardStyling}
                tabIndex={0}
                onClick={cardClickHandler}
                onKeyDown={cardKeyPressHandler}
                aria-selected={result.isSelected}
                aria-label={cardAriaLabel}
                role="row"
            >
                <div role="gridcell">
                    <table className={reportInstanceTable}>
                        <tbody>
                            {renderCardRowsForPropertyBag(result.identifiers)}
                            {renderCardRowsForPropertyBag(result.descriptors)}
                            {renderCardRowsForPropertyBag(result.resolution)}
                        </tbody>
                    </table>
                    <InstanceDetailsFooter
                        deps={deps}
                        result={result}
                        userConfigurationStoreData={userConfigurationStoreData}
                        rule={rule}
                        targetAppInfo={targetAppInfo}
                    />
                </div>
            </div>
        </div>
    );
});
