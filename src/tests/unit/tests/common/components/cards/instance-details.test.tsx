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
import { KeyCodeConstants } from 'common/constants/keycode-constants';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { UnifiedResolution, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import { instanceDetailsCard } from 'reports/components/instance-details.scss';
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

    it('dispatches the card selection message when card is clicked', () => {
        setupGetPropertyConfigByIdMock();
        const eventStub = {} as React.SyntheticEvent;

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), eventStub))
            .verifiable(Times.once());

        const wrapper = shallow(<InstanceDetails {...props} />);
        const divElem = wrapper.find(`.${instanceDetailsCard}`);
        expect(divElem.length).toBe(1);

        divElem.simulate('click', eventStub);

        cardSelectionMessageCreatorMock.verifyAll();
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

    const supportedKeyCodes = [KeyCodeConstants.ENTER, KeyCodeConstants.SPACEBAR];
    it.each(supportedKeyCodes)(
        'dispatches the card selection message when key with keycode %s is pressed',
        keyCode => {
            const preventDefaultMock = jest.fn();
            const eventStub = { keyCode: keyCode, preventDefault: preventDefaultMock } as any;
            setupGetPropertyConfigByIdMock();

            cardSelectionMessageCreatorMock
                .setup(mock =>
                    mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), eventStub),
                )
                .verifiable(Times.once());

            const wrapper = shallow(<InstanceDetails {...props} />);
            const divElem = wrapper.find(`.${instanceDetailsCard}`);
            expect(divElem.length).toBe(1);

            divElem.simulate('keydown', eventStub);

            cardSelectionMessageCreatorMock.verifyAll();
            expect(preventDefaultMock).toHaveBeenCalled();
        },
    );

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
