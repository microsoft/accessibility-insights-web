// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import { forOwn } from 'lodash';
import * as React from 'react';
import { reportInstanceTable } from 'reports/components/instance-details.scss';

import { CardRowDeps, PropertyConfiguration } from '../../../common/configs/unified-result-property-configurations';
import { StoredInstancePropertyBag, UnifiedResult } from '../../../common/types/store-data/unified-data-interface';

export type InstanceDetailsV2Deps = {
    getPropertyConfigById?: (id: string) => PropertyConfiguration;
} & CardRowDeps;
export type InstanceDetailsV2Props = {
    deps: InstanceDetailsV2Deps;
    result: UnifiedResult;
    index: number;
};

export const InstanceDetailsV2 = NamedFC<InstanceDetailsV2Props>('InstanceDetailsV2', props => {
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
