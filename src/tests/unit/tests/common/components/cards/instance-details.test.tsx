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
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { UnifiedResolution, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import styles from 'reports/automated-checks-report.scss';
import { IMock, It, Mock, Times } from 'typemoq';
import { exampleUnifiedResult } from './sample-view-model-data';

jest.mock('react', () => {
    const realReact = jest.requireActual('react');
    const useRefMock = jest.fn();
    return {
        ...realReact,
        useRef: useRefMock,
    };
});

describe('InstanceDetails', () => {
    let props: InstanceDetailsProps;
    let deps: InstanceDetailsDeps;
    let getPropertyConfigByIdMock: IMock<(id: string) => PropertyConfiguration>;
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;
    let resultStub: UnifiedResult;
    let indexStub: number;
    let hiddenButtonRefStub: any;

    beforeEach(() => {
        getPropertyConfigByIdMock = Mock.ofInstance(_ => null);
        cardSelectionMessageCreatorMock = Mock.ofType(AutomatedChecksCardSelectionMessageCreator);
        resultStub = exampleUnifiedResult;
        indexStub = 22;
        hiddenButtonRefStub = { current: { focus: jest.fn(), click: jest.fn() } };
        deps = {
            getPropertyConfigById: getPropertyConfigByIdMock.object,
            cardInteractionSupport: allCardInteractionsSupported,
        } as InstanceDetailsDeps;
        props = {
            deps,
            result: resultStub,
            index: indexStub,
            cardSelectionMessageCreator: cardSelectionMessageCreatorMock.object,
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

    it('forwards focus and click events to hidden button when card is clicked', () => {
        (React.useRef as any).mockReturnValueOnce(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();

        const wrapper = shallow(<InstanceDetails {...props} />);
        const element = wrapper.find(`.${styles.instanceDetailsCard}`);
        expect(element.length).toBe(1);

        element.simulate('click');

        expect(hiddenButtonRefStub.current.focus).toHaveBeenCalled();
        expect(hiddenButtonRefStub.current.click).toHaveBeenCalled();
    });

    it('does not forward focus and click events when event was propagated from a button', () => {
        (React.useRef as any).mockReturnValueOnce(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();

        const wrapper = shallow(<InstanceDetails {...props} />);
        const element = wrapper.find(`.${styles.instanceDetailsCard}`);
        expect(element.length).toBe(1);

        const clickTarget = mount(<button />).getDOMNode();
        element.simulate('click', { target: clickTarget });

        expect(hiddenButtonRefStub.current.focus).toHaveBeenCalledTimes(0);
        expect(hiddenButtonRefStub.current.click).toHaveBeenCalledTimes(0);
    });

    it('dispatches the card selection message when hidden highlight button is clicked', () => {
        (React.useRef as any).mockReturnValueOnce(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();
        const stopPropagationMock = jest.fn();
        const eventStub = {
            stopPropagation: stopPropagationMock,
        } as any;

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), eventStub))
            .verifiable(Times.once());

        const wrapper = shallow(<InstanceDetails {...props} />);
        const element = wrapper.find(`.${styles.hiddenHighlightButton}`);
        expect(element.length).toBe(1);

        element.simulate('click', eventStub);
        expect(stopPropagationMock).toHaveBeenCalled();
        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('applies focused styling on card when hidden highlight button is focused', () => {
        (React.useRef as jest.Mock).mockReturnValue(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();
        const wrapper = shallow(<InstanceDetails {...props} />);
        const button = wrapper.find(`.${styles.hiddenHighlightButton}`);
        expect(button.length).toBe(1);

        button.prop('onFocus')({} as any);
        expect(wrapper.find(`.${styles.focused}`).length).toBe(1);

        button.prop('onBlur')({} as any);
        expect(wrapper.find(`.${styles.focused}`).length).toBe(0);
    });

    it('does not dispatch the card selection message when card is clicked if highlighting is not supported', () => {
        (React.useRef as any).mockReturnValueOnce(hiddenButtonRefStub);
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
        const divElem = wrapper.find(`.${styles.instanceDetailsCard}`);
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
