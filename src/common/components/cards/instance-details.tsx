// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRowDeps, PropertyConfiguration } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import { StoredInstancePropertyBag, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { forOwn } from 'lodash';
import * as React from 'react';
import { reportInstanceTable } from 'reports/components/instance-details.scss';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { HighlightState, InstanceDetailsFooter, InstanceDetailsFooterDeps } from './instance-details-footer';

export type InstanceDetailsDeps = {
    getPropertyConfigById: (id: string) => PropertyConfiguration;
} & CardRowDeps &
    InstanceDetailsFooterDeps;

export type InstanceDetailsProps = {
    deps: InstanceDetailsDeps;
    result: UnifiedResult;
    index: number;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetails', props => {
    const { result, index, deps, userConfigurationStoreData } = props;

    // This should be updated once selection is implemented to sync highlight state with selection.
    const highlightState: HighlightState = 'unavailable';

    const renderCardRowsForPropertyBag = (propertyBag: StoredInstancePropertyBag) => {
        let propertyIndex = 0;
        const cardRows = [];
        forOwn(propertyBag, (propertyData, propertyName) => {
            const CardRow = deps.getPropertyConfigById(propertyName).cardRow;
            ++propertyIndex;
            cardRows.push(<CardRow deps={deps} propertyData={propertyData} index={index} key={`${propertyName}-${propertyIndex}`} />);
        });
        return <>{cardRows}</>;
    };

    return (
        <>
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
                highlightState={highlightState}
                userConfigurationStoreData={userConfigurationStoreData}
            />
        </>
    );
});
