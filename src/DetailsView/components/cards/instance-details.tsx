// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { forOwn } from 'lodash';
import * as React from 'react';
import { reportInstanceTable } from 'reports/components/instance-details.scss';

import { CardRowDeps, PropertyConfiguration } from '../../../common/configs/unified-result-property-configurations';
import { StoredInstancePropertyBag, UnifiedResult, UnifiedRule } from '../../../common/types/store-data/unified-data-interface';

export type InstanceDetailsDeps = {
    getPropertyConfigById: (id: string) => PropertyConfiguration;
} & CardRowDeps;
export type InstanceDetailsProps = {
    deps: InstanceDetailsDeps;
    result: UnifiedResult;
    index: number;
    rule: UnifiedRule;
};

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetails', props => {
    const { result, index, deps } = props;

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
        <table className={reportInstanceTable}>
            <tbody>
                {renderCardRowsForPropertyBag(result.identifiers)}
                {renderCardRowsForPropertyBag(result.descriptors)}
                {renderCardRowsForPropertyBag(result.resolution)}
            </tbody>
        </table>
    );
});
