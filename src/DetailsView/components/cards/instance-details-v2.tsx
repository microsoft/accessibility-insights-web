// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import { forOwn } from 'lodash';
import * as React from 'react';

import { PropertyConfiguration } from '../../../common/configs/unified-result-property-configurations';
import { StoredInstancePropertyBag, UnifiedResult } from '../../../common/types/store-data/unified-data-interface';

export type InstanceDetailsV2Props = {
    result: UnifiedResult;
    index: number;
    fixInstructionProcessor: FixInstructionProcessor;
    getPropertyConfigById?: (id: string) => PropertyConfiguration;
};

export const InstanceDetailsV2 = NamedSFC<InstanceDetailsV2Props>('InstanceDetailsV2', props => {
    const { result, index } = props;

    const deps = {
        fixInstructionProcessor: props.fixInstructionProcessor,
    };

    const renderCardRowForProperty = (propertyBag: StoredInstancePropertyBag) => {
        let propertyIndex = 0;
        return (
            <>
                {forOwn(propertyBag, (propertyData, propertyName) => {
                    const CardRow = props.getPropertyConfigById(propertyName).cardRow;
                    return <CardRow deps={deps} propertyData={propertyData} index={index} key={`${propertyName}-${++propertyIndex}`} />;
                })}
            </>
        );
    };

    return (
        <table className="report-instance-table">
            <tbody>
                {renderCardRowForProperty(result.identifiers)}
                {renderCardRowForProperty(result.descriptors)}
                {renderCardRowForProperty(result.resolution)}
            </tbody>
        </table>
    );
});
