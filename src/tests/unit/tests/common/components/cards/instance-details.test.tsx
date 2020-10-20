// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    allCardInteractionsSupported,
    noCardInteractionsSupported,
} from 'common/components/cards/card-interaction-support';
import {
    InstanceDetails,
    InstanceDetailsDeps,
    InstanceDetailsProps,
} from 'common/components/cards/instance-details';
import {
    AllPropertyTypes,
    CardRowProps,
    PropertyConfiguration,
} from 'common/configs/unified-result-property-configurations';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { UnifiedResolution, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    focused,
    hiddenHighlightButton,
    instanceDetailsCard,
} from 'reports/components/instance-details.scss';
import { IMock, It, Mock, Times } from 'typemoq';

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
            cardInteractionSupport: allCardInteractionsSupported,
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
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), It.isAny()))
            .verifiable(Times.never());

        const testSubject = shallow(<InstanceDetails {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
        cardSelectionMessageCreatorMock.verifyAll();
    });

    it.each([
        ['card', instanceDetailsCard],
        ['hidden highlight button', hiddenHighlightButton],
    ])('dispatches the card selection message when %s is clicked', (_, className) => {
        setupGetPropertyConfigByIdMock();
        const stopPropagationMock = jest.fn();
        const eventStub = {
            stopPropagation: stopPropagationMock,
        } as any;

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), eventStub))
            .verifiable(Times.once());

        const wrapper = shallow(<InstanceDetails {...props} />);
        const button = wrapper.find(`.${className}`);
        expect(button.length).toBe(1);

        button.simulate('click', eventStub);
        expect(stopPropagationMock).toHaveBeenCalled();
        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('applies focused styling on card when hidden highlight button is focused', () => {
        setupGetPropertyConfigByIdMock();
        const testSubject = shallow(<InstanceDetails {...props} />);

        const wrapper = shallow(<InstanceDetails {...props} />);
        const button = wrapper.find(`.${hiddenHighlightButton}`);
        expect(button.length).toBe(1);

        button.prop('onFocus')({} as any);
        expect(wrapper.find(`.${focused}`).length).toBe(1);

        button.prop('onBlur')({} as any);
        expect(wrapper.find(`.${focused}`).length).toBe(0);
    });

    it('does not dispatch the card selection message when card is clicked if highlighting is not supported', () => {
        deps = {
            ...deps,
            cardInteractionSupport: noCardInteractionsSupported,
        };
        props = {
            ...props,
            deps,
        };

        setupGetPropertyConfigByIdMock();

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), It.isAny()))
            .verifiable(Times.never());

        const wrapper = shallow(<InstanceDetails {...props} />);
        const divElem = wrapper.find(`.${instanceDetailsCard}`);
        expect(divElem.length).toBe(1);

        divElem.simulate('click');

        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('renders nothing when there is no card row configuration for the property / no property', () => {
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

    it.each([true, false])('isSelected drives the styling for the card', isSelected => {
        props.result.isSelected = isSelected;
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
            getPropertyConfigByIdMock
                .setup(mock => mock(propertyType))
                .returns(() => propertyConfigurationStub);
        });
    }
});
