// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { createEvent, fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
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
import * as React from 'react';
import styles from 'reports/automated-checks-report.scss';
import { IMock, It, Mock, Times } from 'typemoq';
import { InstanceDetailsFooter } from '../../../../../../common/components/cards/instance-details-footer';
import { expectMockedComponentPropsToMatchSnapshots, mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';
import { exampleUnifiedResult } from './sample-view-model-data';
import '@testing-library/jest-dom';

jest.mock('react', () => {
    const realReact = jest.requireActual('react');
    const useRefMock = jest.fn();
    return {
        ...realReact,
        useRef: useRefMock,
    };
});

jest.mock('../../../../../../common/components/cards/instance-details-footer');
describe('InstanceDetails', () => {
    mockReactComponents([InstanceDetailsFooter]);
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

        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        expect(renderResult.asFragment()).toMatchSnapshot();
        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('forwards focus and click events to hidden button when card is clicked', async () => {
        (React.useRef as any).mockReturnValueOnce(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), It.isAny()))
            .verifiable(Times.once());

        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        const element = renderResult.container.querySelector(`.${styles.instanceDetailsCard}`);
        expect(element).toBeInTheDocument();

        fireEvent.click(element);
        const button = renderResult.getByRole('button');
        expect(button).toHaveFocus();

        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('dispatches the card selection message when hidden highlight button is clicked', async () => {
        (React.useRef as any).mockReturnValueOnce(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();
        const stopPropagationMock = jest.fn();

        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleCardSelection(It.isAnyString(), It.isAnyString(), It.isAny()))
            .verifiable(Times.once());

        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        const element = renderResult.getByRole('button');
        expect(element).toBeInTheDocument();

        const event = createEvent.click(element);
        event.stopPropagation = stopPropagationMock;

        fireEvent(element, event);

        expect(stopPropagationMock).toHaveBeenCalledTimes(1);
        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('applies focused styling on card when hidden highlight button is focused', () => {
        (React.useRef as jest.Mock).mockReturnValue(hiddenButtonRefStub);
        setupGetPropertyConfigByIdMock();
        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        const button = renderResult.getAllByRole('button');
        expect(button).toHaveLength(1);

        fireEvent.focus(button[0]);
        expect(renderResult.container.getElementsByClassName(`${styles.focused}`).length).toBe(1);

        fireEvent.blur(button[0]);
        expect(renderResult.container.getElementsByClassName(`${styles.focused}`).length).toBe(0);
    });

    it('does not dispatch the card selection message when card is clicked if highlighting is not supported', async () => {
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

        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        const divElem = renderResult.container.getElementsByClassName(
            `${styles.instanceDetailsCard}`,
        );
        expect(divElem).toHaveLength(1);

        await userEvent.click(divElem[0]);

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

        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it.each([true, false])('isSelected drives the styling for the card', isSelected => {
        props.result.isSelected = isSelected;
        setupGetPropertyConfigByIdMock();

        const renderResult = render(<InstanceDetails {...props} />);
        expectMockedComponentPropsToMatchSnapshots([InstanceDetailsFooter]);
        expect(renderResult.asFragment()).toMatchSnapshot();
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
