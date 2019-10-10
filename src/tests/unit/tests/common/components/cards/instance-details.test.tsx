// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceDetails, InstanceDetailsDeps, InstanceDetailsProps } from 'common/components/cards/instance-details';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    AllPropertyTypes,
    CardRowProps,
    PropertyConfiguration,
} from '../../../../../../common/configs/unified-result-property-configurations';
import { NamedFC, ReactFCWithDisplayName } from '../../../../../../common/react/named-fc';
import { UnifiedResolution, UnifiedResult } from '../../../../../../common/types/store-data/unified-data-interface';
import { exampleUnifiedResult } from './sample-view-model-data';

describe('InstanceDetails', () => {
    let props: InstanceDetailsProps;
    let deps: InstanceDetailsDeps;
    let getPropertyConfigByIdMock: IMock<(id: string) => PropertyConfiguration>;
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;
    let resultStub: UnifiedResult;
    let indexStub: number;

    beforeEach(() => {
        getPropertyConfigByIdMock = Mock.ofInstance(_ => null);
        cardSelectionMessageCreatorMock = Mock.ofType(CardSelectionMessageCreator);
        resultStub = exampleUnifiedResult;
        indexStub = 22;
        deps = {
            getPropertyConfigById: getPropertyConfigByIdMock.object,
            cardSelectionMessageCreator: cardSelectionMessageCreatorMock.object,
        } as InstanceDetailsDeps;
        props = {
            deps,
            result: resultStub,
            index: indexStub,
        } as InstanceDetailsProps;
    });

    it('renders', () => {
        setupGetPropertyConfigByIdMock();
        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString()))
            .verifiable(Times.never());

        const testSubject = shallow(<InstanceDetails {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('dispatches the card selection message when card is clicked', () => {
        setupGetPropertyConfigByIdMock();

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString()))
            .verifiable(Times.once());

        const wrapper = shallow(<InstanceDetails {...props} />);
        const tableElem = wrapper.find('table');
        expect(tableElem.length).toBe(1);

        tableElem.simulate('click');

        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('renders nothing when there is no card row config for the property / no property', () => {
        props.result.identifiers = {
            identifier: 'test-id',
            conciseName: 'test-concise-name',
            'this-property-does-not-have-config': 'some value',
        };
        props.result.descriptors = {};
        props.result.resolution = {} as UnifiedResolution;

        setupGetPropertyConfigByIdMock();

        const testSubject = shallow(<InstanceDetails {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    function getCardRowStub(name: string): ReactFCWithDisplayName<CardRowProps> {
        return NamedFC<CardRowProps>(name, _ => null);
    }

    function setupGetPropertyConfigByIdMock(): void {
        AllPropertyTypes.forEach(propertyType => {
            const propertyConfigurationStub: PropertyConfiguration = {
                cardRow: getCardRowStub(propertyType),
            };
            getPropertyConfigByIdMock.setup(mock => mock(propertyType)).returns(() => propertyConfigurationStub);
        });
    }
});
