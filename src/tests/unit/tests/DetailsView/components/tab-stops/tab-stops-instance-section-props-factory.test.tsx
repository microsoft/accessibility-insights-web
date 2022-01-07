// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import {
    FastpassTabStopsInstanceSectionPropsFactory,
    ReportTabStopsInstanceSectionPropsFactory,
    TabStopsInstanceSectionPropsFactoryDeps,
    TabStopsInstanceSectionPropsFactoryProps,
} from 'DetailsView/components/tab-stops/tab-stops-instance-section-props-factory';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { IMock, Mock, Times } from 'typemoq';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

describe('TabStopsInstanceSectionPropsFactory', () => {
    let props: TabStopsInstanceSectionPropsFactoryProps;
    let tabStopsRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let tabStopsTestViewControllerMock: IMock<TabStopsTestViewController>;
    const eventStub = {} as React.MouseEvent<any>;
    const requirementId: TabStopRequirementId = 'keyboard-navigation';

    beforeEach(() => {
        tabStopsRequirementActionMessageCreatorMock = Mock.ofType(
            TabStopRequirementActionMessageCreator,
        );
        tabStopsTestViewControllerMock = Mock.ofType(TabStopsTestViewController);

        const deps = {
            tabStopRequirementActionMessageCreator:
                tabStopsRequirementActionMessageCreatorMock.object,
            tabStopsTestViewController: tabStopsTestViewControllerMock.object,
        } as TabStopsInstanceSectionPropsFactoryDeps;
        props = {
            headingLevel: 3,
            tabStopRequirementState: {
                'keyboard-navigation': {
                    status: 'fail',
                    instances: [{ id: 'test-id-1', description: 'test desc 1' }],
                    isExpanded: false,
                },
                'keyboard-traps': {
                    status: 'fail',
                    instances: [{ id: 'test-id-2', description: 'test desc 2' }],
                    isExpanded: false,
                },
            },
            results: [
                {
                    id: 'keyboard-navigation',
                    description: 'test requirement description 1',
                    name: 'test requirement name 1',
                    instances: [
                        { id: 'test-id-1', description: 'test desc 1' },
                        { id: 'test-id-2', description: 'test desc 2' },
                    ],
                    isExpanded: false,
                },
                {
                    id: 'keyboard-traps',
                    description: 'test requirement description 2',
                    name: 'test requirement name 2',
                    instances: [{ id: 'test-id-3', description: 'test desc 3' }],
                    isExpanded: false,
                },
            ],
            deps: deps,
        };
    });

    describe('for Fastpass', () => {
        test('creates props as expected', () => {
            tabStopsRequirementActionMessageCreatorMock
                .setup(m => m.toggleTabStopRequirementExpand(requirementId, eventStub))
                .verifiable(Times.once());

            const instanceSectionProps = FastpassTabStopsInstanceSectionPropsFactory(props);
            const collapsibleComponentProps =
                instanceSectionProps.getCollapsibleComponentPropsWithInstance(
                    props.results[0],
                    0,
                    'label',
                );
            collapsibleComponentProps.onExpandToggle(eventStub);

            tabStopsRequirementActionMessageCreatorMock.verifyAll();
            expect(instanceSectionProps).toMatchSnapshot();
            expect(collapsibleComponentProps).toMatchSnapshot();
        });

        test('adds correct button click handlers', () => {
            const instanceId = 'some instance id';
            const description = 'some description';
            const expectedPayload = {
                instanceId,
                requirementId,
                description,
            };
            tabStopsRequirementActionMessageCreatorMock
                .setup(m => m.removeTabStopInstance(requirementId, instanceId))
                .verifiable(Times.once());
            tabStopsTestViewControllerMock
                .setup(m => m.editExistingFailureInstance(expectedPayload))
                .verifiable(Times.once());

            const instanceSectionProps = FastpassTabStopsInstanceSectionPropsFactory(props);
            const result = instanceSectionProps.getCollapsibleComponentPropsWithInstance(
                props.results[0],
                0,
                'label',
            );
            result.content.props.onEditButtonClicked(requirementId, instanceId, description);
            result.content.props.onRemoveButtonClicked(requirementId, instanceId);

            tabStopsRequirementActionMessageCreatorMock.verifyAll();
            tabStopsTestViewControllerMock.verifyAll();
        });
    });
    describe('for Report', () => {
        test('creates props as expected', () => {
            const instanceSectionProps = ReportTabStopsInstanceSectionPropsFactory(props);

            const collapsibleComponentPropsWithInstance =
                instanceSectionProps.getCollapsibleComponentPropsWithInstance(
                    props.results[0],
                    0,
                    'label',
                );

            const collapsibleComponentPropsWithoutInstance =
                instanceSectionProps.getCollapsibleComponentPropsWithoutInstance(
                    props.results[0],
                    0,
                    'label',
                );

            expect(instanceSectionProps).toMatchSnapshot();
            expect(collapsibleComponentPropsWithInstance).toMatchSnapshot();
            expect(collapsibleComponentPropsWithoutInstance).toMatchSnapshot();
        });
    });
});
