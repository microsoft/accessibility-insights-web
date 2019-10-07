// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceDetails, InstanceDetailsDeps, InstanceDetailsProps } from 'common/components/cards/instance-details';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    AllPropertyTypes,
    CardRowProps,
    PropertyConfiguration,
} from '../../../../../../common/configs/unified-result-property-configurations';
import { NamedFC, ReactFCWithDisplayName } from '../../../../../../common/react/named-fc';
import { UnifiedResult } from '../../../../../../common/types/store-data/unified-data-interface';
import { exampleUnifiedResult } from './sample-view-model-data';

describe('InstanceDetails', () => {
    let props: InstanceDetailsProps;
    let deps: InstanceDetailsDeps;
    let getPropertyConfigByIdMock: IMock<(id: string) => PropertyConfiguration>;
    let resultStub: UnifiedResult;
    let indexStub: number;

    beforeEach(() => {
        getPropertyConfigByIdMock = Mock.ofInstance(_ => null);
        resultStub = exampleUnifiedResult;
        indexStub = 22;
        deps = {
            getPropertyConfigById: getPropertyConfigByIdMock.object,
        } as InstanceDetailsDeps;
        props = {
            deps,
            result: resultStub,
            index: indexStub,
        } as InstanceDetailsProps;
    });

    it('renders', () => {
        AllPropertyTypes.forEach(propertyType => {
            const propertyConfigurationStub: PropertyConfiguration = {
                cardRow: getCardRowStub(propertyType),
            };
            getPropertyConfigByIdMock.setup(mock => mock(propertyType)).returns(() => propertyConfigurationStub);
        });

        const testSubject = shallow(<InstanceDetails {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    function getCardRowStub(name: string): ReactFCWithDisplayName<CardRowProps> {
        return NamedFC<CardRowProps>(name, _ => null);
    }
});
