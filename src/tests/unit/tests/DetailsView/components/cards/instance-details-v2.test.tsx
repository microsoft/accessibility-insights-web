// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    AllPropertyTypes,
    CardRowProps,
    PropertyConfiguration,
} from '../../../../../../common/configs/unified-result-property-configurations';
import { NamedFC, ReactFCWithDisplayName } from '../../../../../../common/react/named-sfc';
import { UnifiedResult } from '../../../../../../common/types/store-data/unified-data-interface';
import {
    InstanceDetailsV2,
    InstanceDetailsV2Deps,
    InstanceDetailsV2Props,
} from '../../../../../../DetailsView/components/cards/instance-details-v2';
import { exampleUnifiedResult } from './sample-view-model-data';

describe('InstanceDetailsV2', () => {
    let props: InstanceDetailsV2Props;
    let deps: InstanceDetailsV2Deps;
    let getPropertyConfigByIdMock: IMock<(id: string) => PropertyConfiguration>;
    let resultStub: UnifiedResult;
    let indexStub: number;

    beforeEach(() => {
        getPropertyConfigByIdMock = Mock.ofInstance(_ => null);
        resultStub = exampleUnifiedResult;
        indexStub = 22;
        deps = {
            getPropertyConfigById: getPropertyConfigByIdMock.object,
        } as InstanceDetailsV2Deps;
        props = {
            deps,
            result: resultStub,
            index: indexStub,
        };
    });

    it('renders', () => {
        AllPropertyTypes.forEach(propertyType => {
            const propertyConfigurationStub: PropertyConfiguration = {
                cardRow: getCardRowStub(propertyType),
            };
            getPropertyConfigByIdMock.setup(mock => mock(propertyType)).returns(() => propertyConfigurationStub);
        });

        const testSubject = shallow(<InstanceDetailsV2 {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    function getCardRowStub(name: string): ReactFCWithDisplayName<CardRowProps> {
        return NamedFC<CardRowProps>(name, _ => null);
    }
});
