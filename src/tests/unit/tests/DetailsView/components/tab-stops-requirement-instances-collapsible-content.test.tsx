// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsList, Icon } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import {
    TabStopsRequirementInstancesCollapsibleContent,
    TabStopsRequirementInstancesCollapsibleContentProps,
} from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { TabStopsRequirementResultInstance } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('TabStopsRequirementInstancesCollapsibleContent', () => {
    mockReactComponents([DetailsList, (Icon as any).type]);
    let onEditButtonClickedMock: IMock<
        (requirementId: TabStopRequirementId, instanceId: string, description: string) => void
    >;
    let onRemoveButtonClickedMock: IMock<
        (requirementId: TabStopRequirementId, instanceId: string) => void
    >;
    let props: TabStopsRequirementInstancesCollapsibleContentProps;
    let requirementResultInstanceStub: TabStopsRequirementResultInstance;

    beforeEach(() => {
        onEditButtonClickedMock =
            Mock.ofType<
                (
                    requirementId: TabStopRequirementId,
                    instanceId: string,
                    description: string,
                ) => void
            >();
        onRemoveButtonClickedMock =
            Mock.ofType<(requirementId: TabStopRequirementId, instanceId: string) => void>();

        props = {
            requirementId: 'keyboard-navigation',
            instances: [{ id: 'test-instance-id', description: 'test-description' }],
            onEditButtonClicked: onEditButtonClickedMock.object,
            onRemoveButtonClicked: onRemoveButtonClickedMock.object,
        };

        requirementResultInstanceStub = {
            id: 'test-instance-id',
            description: 'test requirement description',
        };
    });

    it('renders', () => {
        const renderResult = render(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([DetailsList]);
    });

    test('renders captured instance details column', () => {
        render(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        const columns = getMockComponentClassPropsForCall(DetailsList).columns;
        expect(columns[0].onRender(requirementResultInstanceStub)).toMatchSnapshot();
    });

    test('renders captured instance icons column', () => {
        render(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        const columns = getMockComponentClassPropsForCall(DetailsList).columns;
        expect(columns[1].onRender(requirementResultInstanceStub)).toMatchSnapshot();
    });

    test('click events pass through as expected', async () => {
        onEditButtonClickedMock
            .setup(ebc => ebc('keyboard-navigation', 'test-instance-id', 'test-description'))
            .verifiable(Times.once());
        onRemoveButtonClickedMock
            .setup(rbc => rbc(props.requirementId, 'test-instance-id'))
            .verifiable(Times.once());
        useOriginalReactElements('@fluentui/react', ['DetailsList', 'Link']);

        const renderResult = render(
            <TabStopsRequirementInstancesCollapsibleContent
                requirementId={props.requirementId}
                instances={props.instances}
                onEditButtonClicked={onEditButtonClickedMock.object}
                onRemoveButtonClicked={onRemoveButtonClickedMock.object}
            />,
        );

        const buttons = renderResult.getAllByRole('button');
        buttons.forEach(button => fireEvent.click(button));

        onEditButtonClickedMock.verifyAll();
        onRemoveButtonClickedMock.verifyAll();
    });
});
