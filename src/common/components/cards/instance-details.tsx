// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { forOwn, isEmpty } from 'lodash';
import * as React from 'react';

import { CardRowDeps, PropertyConfiguration } from '../../../common/configs/unified-result-property-configurations';
import { CardSelectionMessageCreator } from '../../../common/message-creators/card-selection-message-creator';
import {
    StoredInstancePropertyBag,
    TargetAppData,
    UnifiedResult,
    UnifiedRule,
} from '../../../common/types/store-data/unified-data-interface';
import { reportInstanceTable } from '../../../reports/components/instance-details.scss';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { HighlightState, InstanceDetailsFooter, InstanceDetailsFooterDeps } from './instance-details-footer';

export type InstanceDetailsDeps = {
    getPropertyConfigById: (id: string) => PropertyConfiguration;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
} & CardRowDeps &
    InstanceDetailsFooterDeps;

export type InstanceDetailsProps = {
    deps: InstanceDetailsDeps;
    result: UnifiedResult;
    index: number;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    rule: UnifiedRule;
};

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetails', props => {
    const { result, index, deps, userConfigurationStoreData, rule, targetAppInfo } = props;

    // This should be updated once selection is implemented to sync highlight state with selection.
    const highlightState: HighlightState = 'unavailable';

    const renderCardRowsForPropertyBag = (propertyBag: StoredInstancePropertyBag) => {
        let propertyIndex = 0;
        const cardRows = [];
        forOwn(propertyBag, (propertyData, propertyName) => {
            const propertyConfig = deps.getPropertyConfigById(propertyName);
            if (!isEmpty(propertyConfig)) {
                const CardRow = propertyConfig.cardRow;
                ++propertyIndex;
                cardRows.push(<CardRow deps={deps} propertyData={propertyData} index={index} key={`${propertyName}-${propertyIndex}`} />);
            }
        });
        return <>{cardRows}</>;
    };

    const cardClickHandler = event => {
        console.log(event);
        deps.cardSelectionMessageCreator.toggleCardSelection(result.uid);
    };
    return (
        <>
            <table className={reportInstanceTable} onClick={cardClickHandler}>
                <tbody>
                    {renderCardRowsForPropertyBag(result.identifiers)}
                    {renderCardRowsForPropertyBag(result.descriptors)}
                    {renderCardRowsForPropertyBag(result.resolution)}
                </tbody>
            </table>
            <InstanceDetailsFooter
                deps={deps}
                result={result}
                highlightState={highlightState}
                userConfigurationStoreData={userConfigurationStoreData}
                rule={rule}
                targetAppInfo={targetAppInfo}
            />
        </>
    );
});
