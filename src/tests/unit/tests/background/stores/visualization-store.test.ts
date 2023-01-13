// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { assessmentsProviderForRequirements } from 'assessments/assessments-requirements-filter';
import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { LandmarkTestStep } from 'assessments/landmarks/test-steps/test-steps';
import { QuickAssessRequirementMap } from 'assessments/medium-pass-requirements';
import {
    AssessmentToggleActionPayload,
    InjectionFailedPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateSelectedPivot,
} from 'background/actions/action-payloads';
import { InjectionActions } from 'background/actions/injection-actions';
import { TabActions } from 'background/actions/tab-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { InitialVisualizationStoreDataGenerator } from 'background/initial-visualization-store-data-generator';
import { VisualizationStore } from 'background/stores/visualization-store';
import { TestMode } from 'common/configs/test-mode';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { AdHocTestkeys } from 'common/types/store-data/adhoc-test-keys';
import { cloneDeep } from 'lodash';
import { IMock, Mock, Times } from 'typemoq';
import { StoreNames } from '../../../../../common/stores/store-names';
import { DetailsViewPivotType } from '../../../../../common/types/store-data/details-view-pivot-type';
import {
    InjectingState,
    TestsEnabledState,
    VisualizationStoreData,
} from '../../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { VisualizationStoreDataBuilder } from '../../../common/visualization-store-data-builder';

describe('VisualizationStoreTest ', () => {
    let initialVisualizationStoreDataGeneratorMock: IMock<InitialVisualizationStoreDataGenerator>;
    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(VisualizationStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(VisualizationStore);
        expect(StoreNames[StoreNames.VisualizationStore]).toEqual(testObject.getId());
    });

    describe('getDefaultState', () => {
        beforeEach(() => {
            initialVisualizationStoreDataGeneratorMock =
                Mock.ofType<InitialVisualizationStoreDataGenerator>();
        });

        it('with no tests in state', () => {
            const defaultStateStub = {};
            setupDataGeneratorMock(null, defaultStateStub as VisualizationStoreData);

            const testObject = new VisualizationStore(
                null,
                new TabActions(),
                new InjectionActions(),
                new WebVisualizationConfigurationFactory(
                    Assessments,
                    assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
                ),
                null,
                null,
                null,
                null,
                true,
                initialVisualizationStoreDataGeneratorMock.object,
            );

            const actualState = testObject.getDefaultState();

            expect(actualState).toEqual(defaultStateStub);
            initialVisualizationStoreDataGeneratorMock.verifyAll();
        });

        it('with tests in persistedData missing quickAssess data', () => {
            const persistedState: VisualizationStoreData = {
                tests: {
                    adhoc: {},
                    assessments: {},
                } as TestsEnabledState,
            } as VisualizationStoreData;

            const expectedState = {
                tests: {
                    adhoc: {},
                    assessments: {},
                    quickAssess: {},
                },
            };

            setupDataGeneratorMock(
                persistedState as VisualizationStoreData,
                expectedState as VisualizationStoreData,
            );

            const testObject = new VisualizationStore(
                null,
                new TabActions(),
                new InjectionActions(),
                new WebVisualizationConfigurationFactory(
                    Assessments,
                    assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
                ),
                persistedState,
                null,
                null,
                null,
                true,
                initialVisualizationStoreDataGeneratorMock.object,
            );

            const actualState = testObject.getDefaultState();

            expect(actualState).toEqual(expectedState);
            initialVisualizationStoreDataGeneratorMock.verifyAll();
        });
        it('with tests in persistedData including quickAssess data', () => {
            const persistedState: VisualizationStoreData = {
                tests: {
                    adhoc: {},
                    assessments: {},
                    quickAssess: {},
                } as TestsEnabledState,
            } as VisualizationStoreData;

            const expectedState = {
                tests: {
                    adhoc: {},
                    assessments: {},
                    quickAssess: {},
                },
            };
            setupDataGeneratorMock(
                persistedState as VisualizationStoreData,
                expectedState as VisualizationStoreData,
            );
            const testObject = new VisualizationStore(
                null,
                new TabActions(),
                new InjectionActions(),
                new WebVisualizationConfigurationFactory(
                    Assessments,
                    assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
                ),
                persistedState,
                null,
                null,
                null,
                true,
                initialVisualizationStoreDataGeneratorMock.object,
            );

            const actualState = testObject.getDefaultState();

            expect(actualState).toEqual(expectedState);
            initialVisualizationStoreDataGeneratorMock.verifyAll();
        });
    });

    describe('onUpdateSelectedPivotChild', () => {
        const actionName = 'updateSelectedPivotChild';

        test('when pivot is different', async () => {
            const viewType = VisualizationType.TabStops;
            const initialPivot = DetailsViewPivotType.assessment;
            const finalPivot = DetailsViewPivotType.fastPass;

            const initialState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', viewType)
                .with('selectedDetailsViewPivot', initialPivot)
                .build();

            const expectedState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', viewType)
                .with('selectedFastPassDetailsView', viewType)
                .with('selectedDetailsViewPivot', finalPivot)
                .build();

            const payload: UpdateSelectedDetailsViewPayload = {
                detailsViewType: viewType,
                pivotType: finalPivot,
            };
            const storeTester =
                createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('when old pivot does not have current visualization', async () => {
            const viewType = VisualizationType.Landmarks;
            const finalPivot = DetailsViewPivotType.assessment;

            const initialState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', viewType)
                .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
                .build();

            const expectedState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', viewType)
                .with('selectedDetailsViewPivot', finalPivot)
                .build();

            const payload: UpdateSelectedDetailsViewPayload = {
                detailsViewType: viewType,
                pivotType: finalPivot,
            };

            const storeTester =
                createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it.each([DetailsViewPivotType.assessment, DetailsViewPivotType.fastPass])(
            'when view & pivot are the same',
            async pivotType => {
                const viewType = VisualizationType.Issues;

                const expectedState = new VisualizationStoreDataBuilder()
                    .with('selectedAdhocDetailsView', viewType)
                    .with('selectedDetailsViewPivot', pivotType)
                    .build();

                const initialState = new VisualizationStoreDataBuilder()
                    .with('selectedAdhocDetailsView', viewType)
                    .with('selectedDetailsViewPivot', pivotType)
                    .build();

                initialState.tests.adhoc[AdHocTestkeys.Issues] = { enabled: true };
                expectedState.tests.adhoc[AdHocTestkeys.Issues] = { enabled: true };

                const payload: UpdateSelectedDetailsViewPayload = {
                    detailsViewType: viewType,
                    pivotType: pivotType,
                };

                const storeTester =
                    createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
                await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
            },
        );

        test('when view changes to null', async () => {
            const expectedState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', VisualizationType.Landmarks)
                .build();
            const initialState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', VisualizationType.Landmarks)
                .build();

            const payload: UpdateSelectedDetailsViewPayload = {
                detailsViewType: VisualizationType.Issues,
                pivotType: null,
            };

            const storeTester =
                createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('same pivot different view', async () => {
            const selectedPivot = DetailsViewPivotType.fastPass;

            const oldView = VisualizationType.Issues;
            const newView = VisualizationType.Landmarks;

            const initialState = new VisualizationStoreDataBuilder()
                .with('selectedDetailsViewPivot', selectedPivot)
                .with('selectedFastPassDetailsView', oldView)
                .build();

            initialState.tests.adhoc[AdHocTestkeys.Issues] = { enabled: true };
            initialState.tests.adhoc[AdHocTestkeys.Color] = { enabled: true };

            const expectedState = new VisualizationStoreDataBuilder()
                .with('selectedDetailsViewPivot', selectedPivot)
                .with('selectedFastPassDetailsView', newView)
                .build();

            const payload: UpdateSelectedDetailsViewPayload = {
                detailsViewType: newView,
                pivotType: selectedPivot,
            };

            const storeTester =
                createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('when view is different', async () => {
            const initialState = new VisualizationStoreDataBuilder().build();

            const expectedState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', VisualizationType.Issues)
                .build();

            const payload: UpdateSelectedDetailsViewPayload = {
                detailsViewType: VisualizationType.Headings,
                pivotType: null,
            };

            const storeTester =
                createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('when view is null', async () => {
            const initialState = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', VisualizationType.Issues)
                .build();
            const expectedState = cloneDeep(initialState);

            const payload: UpdateSelectedDetailsViewPayload = {
                detailsViewType: null,
                pivotType: null,
            };

            const storeTester =
                createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    test('onUpdateSelectedPivot when pivot value is same as before', async () => {
        const actionName = 'updateSelectedPivot';
        const oldPivotValue = DetailsViewPivotType.fastPass;
        const initialState = new VisualizationStoreDataBuilder()
            .with('selectedDetailsViewPivot', oldPivotValue)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('selectedDetailsViewPivot', oldPivotValue)
            .build();

        const payload: UpdateSelectedPivot = {
            pivotKey: oldPivotValue,
        };

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('onUpdateSelectedPivot when pivot value is different', async () => {
        const actionName = 'updateSelectedPivot';
        const oldPivotValue = DetailsViewPivotType.fastPass;
        const finalPivotValue = DetailsViewPivotType.assessment;
        const fakeStep = 'fake step';
        const initialState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(true, fakeStep)
            .withLandmarksAssessment(true, fakeStep)
            .with('selectedDetailsViewPivot', oldPivotValue)
            .withAllAdhocTestsTo(true)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('selectedDetailsViewPivot', finalPivotValue)
            .withHeadingsAssessment(false, fakeStep)
            .withLandmarksAssessment(false, fakeStep)
            .withAllAdhocTestsTo(false)
            .build();

        const payload: UpdateSelectedPivot = {
            pivotKey: finalPivotValue,
        };

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    describe('onEnableHeadings with headings already enabled or disabled', () => {
        test.each`
            initialDataBuilder
            ${new VisualizationStoreDataBuilder().withHeadingsEnable()}
            ${new VisualizationStoreDataBuilder()}
        `(
            'case enabled = $initialDataBuilder.data.tests.adhoc.headings.enabled',
            async ({ initialDataBuilder }) => {
                const actionName = 'enableVisualization';
                const payload: ToggleActionPayload = {
                    test: VisualizationType.Headings,
                };

                const initialState = initialDataBuilder.build();
                const expectedState = new VisualizationStoreDataBuilder()
                    .withHeadingsEnable()
                    .with('scanning', 'headings')
                    .with('selectedAdhocDetailsView', VisualizationType.Issues)
                    .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
                    .with('injectingState', InjectingState.injectingRequested)
                    .build();

                const storeTester =
                    createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );
    });

    test('onEnableHeadingsAssessment without scan', async () => {
        const actionName = 'enableVisualizationWithoutScan';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: AssessmentToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
            requirement: HeadingsTestStep.missingHeadings,
        };

        const initialState = dataBuilder.build();
        const expectedState = dataBuilder
            .withHeadingsAssessment(true, payload.requirement)
            .with('selectedAdhocDetailsView', VisualizationType.Issues)
            .with('injectingState', InjectingState.injectingRequested)
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onEnableHeadings when headingsAssessment is enabled', async () => {
        const actionName = 'enableVisualization';
        const payload: ToggleActionPayload = {
            test: VisualizationType.Headings,
        };

        const initialState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(true, HeadingsTestStep.missingHeadings)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .withHeadingsEnable()
            .withHeadingsAssessment(false, HeadingsTestStep.missingHeadings)
            .with('injectingState', InjectingState.injectingRequested)
            .with('scanning', 'headings')
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onEnableHeadingsAssessment when some other visualization is already enable', async () => {
        const actionName = 'enableVisualization';
        const payload: AssessmentToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
            requirement: HeadingsTestStep.missingHeadings,
        };

        const initialState = new VisualizationStoreDataBuilder().withHeadingsEnable().build();

        const expectedState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(true, payload.requirement)
            .withHeadingsEnable()
            .with('injectingState', InjectingState.injectingRequested)
            .with('scanning', `${TestMode.Assessments}-${HeadingsTestStep.missingHeadings}`)
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onEnableHeadingsAssessment from onEnableLandmarksAssessment', async () => {
        const actionName = 'enableVisualization';
        const payload: AssessmentToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
            requirement: HeadingsTestStep.missingHeadings,
        };

        const initialState = new VisualizationStoreDataBuilder()
            .withLandmarksAssessment(true, LandmarkTestStep.landmarkRoles)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .withLandmarksAssessment(false, LandmarkTestStep.landmarkRoles)
            .withHeadingsAssessment(true, payload.requirement)
            .with('injectingState', InjectingState.injectingRequested)
            .with('scanning', `${TestMode.Assessments}-${HeadingsTestStep.missingHeadings}`)
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onEnableHeadingsAssessment switch test steps', async () => {
        const actionName = 'enableVisualization';
        const payload: AssessmentToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
            requirement: HeadingsTestStep.missingHeadings,
        };

        const initialState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(true, HeadingsTestStep.headingFunction)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .withHeadingsAssessment(false, HeadingsTestStep.headingFunction)
            .withHeadingsAssessment(true, payload.requirement)
            .with('injectingState', InjectingState.injectingRequested)
            .with('scanning', `${TestMode.Assessments}-${HeadingsTestStep.missingHeadings}`)
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('OnDisableHeadings when headings is enable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Headings,
        };
        const expectedState = dataBuilder.build();
        const initialState = dataBuilder.withHeadingsEnable().build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('disableAssessmentVisualizations', async () => {
        const actionName = 'disableAssessmentVisualizations';
        const dataBuilder = new VisualizationStoreDataBuilder();

        const expectedState = dataBuilder.withHeadingsAssessment(false, 'teststep').build();
        const initialState = dataBuilder.withHeadingsAssessment(true, 'teststep').build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    describe('onEnableTabStops with TabStops already enabled or disabled', () => {
        test.each`
            initialDataBuilder
            ${new VisualizationStoreDataBuilder().withTabStopsEnable()}
            ${new VisualizationStoreDataBuilder()}
        `(
            'case enabled = $initialDataBuilder.data.tests.adhoc.tabStops.enabled',
            async ({ initialDataBuilder }) => {
                const actionName = 'enableVisualization';
                const payload: ToggleActionPayload = {
                    test: VisualizationType.TabStops,
                };

                const initialState = initialDataBuilder.build();
                const expectedState = new VisualizationStoreDataBuilder()
                    .withTabStopsEnable()
                    .with('injectingState', InjectingState.injectingRequested)
                    .with('scanning', 'tabStops')
                    .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
                    .build();

                const storeTester =
                    createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );
    });

    test('OnDisableTabStops when TabStops is enable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.TabStops,
        };
        const expectedState = dataBuilder.build();
        const initialState = dataBuilder.withTabStopsEnable().build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('disableVisualization when already scanning', async () => {
        const actionName = 'disableVisualization';
        const payload: ToggleActionPayload = {
            test: VisualizationType.Issues,
        };

        const initialState = new VisualizationStoreDataBuilder()
            .with('scanning', 'headings')
            .withIssuesEnable()
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('scanning', 'headings')
            .withIssuesEnable()
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('OnDisableHeadings when headings is already disable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Headings,
        };
        const initialState = dataBuilder.build();
        const expectedState = dataBuilder.build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    describe('onEnableLandmarks with landmarks already enabled or disabled', () => {
        test.each`
            initialDataBuilder
            ${new VisualizationStoreDataBuilder().withLandmarksEnable()}
            ${new VisualizationStoreDataBuilder()}
        `(
            'case enabled = $initialDataBuilder.data.tests.adhoc.landmarks.enabled',
            async ({ initialDataBuilder }) => {
                const actionName = 'enableVisualization';
                const payload: ToggleActionPayload = {
                    test: VisualizationType.Landmarks,
                };

                const initialState = initialDataBuilder.build();
                const expectedState = new VisualizationStoreDataBuilder()
                    .withLandmarksEnable()
                    .with('scanning', 'landmarks')
                    .with('injectingState', InjectingState.injectingRequested)
                    .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
                    .build();

                const storeTester =
                    createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );
    });

    test('onDisableLandmarks when landmarks is enable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Landmarks,
        };
        const expectedState = dataBuilder.build();
        const initialState = dataBuilder.withLandmarksEnable().build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onDisableLandmarks when landmarks is already disable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Landmarks,
        };
        const initialState = dataBuilder.build();
        const expectedState = dataBuilder.build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    describe('onEnableIssues with issues already enabled or disabled', () => {
        test.each`
            initialDataBuilder
            ${new VisualizationStoreDataBuilder().withIssuesEnable()}
            ${new VisualizationStoreDataBuilder()}
        `(
            'case enabled = $initialDataBuilder.data.tests.adhoc.issues.enabled',
            async ({ initialDataBuilder }) => {
                const actionName = 'enableVisualization';
                const payload: ToggleActionPayload = {
                    test: VisualizationType.Issues,
                };

                const initialState = initialDataBuilder.build();
                const expectedState = new VisualizationStoreDataBuilder()
                    .withIssuesEnable()
                    .with('scanning', 'issues')
                    .with('injectingState', InjectingState.injectingRequested)
                    .with('selectedAdhocDetailsView', VisualizationType.Issues)
                    .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
                    .build();

                const storeTester =
                    createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );
    });

    test('onDisableIssues when issues is enable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Issues,
        };
        const expectedState = dataBuilder.build();
        const initialState = dataBuilder.withIssuesEnable().build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onDisableIssues when issues is already disable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Issues,
        };
        const initialState = dataBuilder.build();
        const expectedState = dataBuilder.build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('onEnableColor when color is disable', async () => {
        const actionName = 'enableVisualization';

        const initialState = new VisualizationStoreDataBuilder().build();

        const payload: ToggleActionPayload = {
            test: VisualizationType.Color,
        };

        const expectedState = new VisualizationStoreDataBuilder()
            .withColorEnable()
            .with('scanning', 'color')
            .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
            .with('injectingState', InjectingState.injectingRequested)
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onDisableColor when color is enable', async () => {
        const actionName = 'disableVisualization';
        const dataBuilder = new VisualizationStoreDataBuilder();
        const payload: ToggleActionPayload = {
            test: VisualizationType.Color,
        };
        const expectedState = dataBuilder.build();
        const initialState = dataBuilder.withColorEnable().build();

        const storeTester = createStoreTesterForVisualizationActions(actionName).withActionParam(
            payload.test,
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onGetCurrentState', async () => {
        const actionName = 'getCurrentState';
        const initialState = new VisualizationStoreDataBuilder().build();
        const expectedState = new VisualizationStoreDataBuilder().build();

        const storeTester = createStoreTesterForVisualizationActions(actionName);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('enableVisualization when already scanning', async () => {
        const actionName = 'enableVisualization';
        const payload: ToggleActionPayload = {
            test: VisualizationType.Issues,
        };
        const initialState = new VisualizationStoreDataBuilder()
            .with('scanning', 'headings')
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('scanning', 'headings')
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('onInjectionCompleted', async () => {
        const actionName = 'injectionCompleted';

        const initialState = new VisualizationStoreDataBuilder().build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.notInjecting)
            .with('injectionAttempts', 0)
            .build();

        const storeTester = createStoreTesterForInjectionActions(actionName);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onInjectionStarted when injectingState is notInjecting', async () => {
        const actionName = 'injectionStarted';

        const initialState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.notInjecting)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingStarted)
            .build();

        const storeTester = createStoreTesterForInjectionActions(actionName);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onInjectionStarted when injectingState is injectingStarted', async () => {
        const actionName = 'injectionStarted';

        const initialState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingStarted)
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingStarted)
            .build();

        const storeTester = createStoreTesterForInjectionActions(actionName);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('onInjectionFailed when injection has not failed', async () => {
        const actionName = 'injectionFailed';

        const initialState = new VisualizationStoreDataBuilder().build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingRequested)
            .with('injectionAttempts', 1)
            .build();

        const payload = { shouldRetry: true, failedAttempts: 1 } as InjectionFailedPayload;

        const storeTester =
            createStoreTesterForInjectionActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onInjectionFailed when injection failed', async () => {
        const actionName = 'injectionFailed';

        const initialState = new VisualizationStoreDataBuilder().build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('injectingState', InjectingState.injectingFailed)
            .with('injectionAttempts', 4)
            .build();

        const payload = { shouldRetry: false, failedAttempts: 4 } as InjectionFailedPayload;

        const storeTester =
            createStoreTesterForInjectionActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScrollRequested', async () => {
        const actionName = 'scrollRequested';

        const initialState = new VisualizationStoreDataBuilder()
            .with('focusedTarget', ['target'])
            .build();

        const expectedState = new VisualizationStoreDataBuilder()
            .with('focusedTarget', null)
            .build();

        const payload = {};

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScanColorCompleted', async () => {
        const actionName = 'scanCompleted';

        const initialState = new VisualizationStoreDataBuilder().with('scanning', 'color').build();

        const expectedState = new VisualizationStoreDataBuilder().with('scanning', null).build();

        const payload = {};

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScanIssuesCompleted', async () => {
        const actionName = 'scanCompleted';
        const initialState = new VisualizationStoreDataBuilder().with('scanning', 'issues').build();

        const expectedState = new VisualizationStoreDataBuilder().with('scanning', null).build();

        const payload = {};

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScanHeadingsCompleted', async () => {
        const actionName = 'scanCompleted';
        const initialState = new VisualizationStoreDataBuilder()
            .with('scanning', 'headings')
            .build();

        const expectedState = new VisualizationStoreDataBuilder().with('scanning', null).build();

        const payload = {};

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onScanLandmarksCompleted', async () => {
        const actionName = 'scanCompleted';
        const initialState = new VisualizationStoreDataBuilder()
            .with('scanning', 'landmarks')
            .build();

        const expectedState = new VisualizationStoreDataBuilder().with('scanning', null).build();

        const payload = {};

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onUpdateFocusedInstance', async () => {
        const actionName = 'updateFocusedInstance';

        const initialState = new VisualizationStoreDataBuilder().build();

        const payload = ['1'];

        const expectedState = new VisualizationStoreDataBuilder()
            .withFocusedTarget(payload)
            .build();

        const storeTester =
            createStoreTesterForVisualizationActions(actionName).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onExistingTabUpdated', async () => {
        const actionName = 'existingTabUpdated';
        const visualizationType = VisualizationType.Headings;
        const pivot = DetailsViewPivotType.fastPass;
        const expectedState = new VisualizationStoreDataBuilder()
            .with('selectedAdhocDetailsView', visualizationType)
            .with('selectedDetailsViewPivot', pivot)
            .build();

        const initialState = new VisualizationStoreDataBuilder()
            .with('selectedAdhocDetailsView', visualizationType)
            .with('selectedDetailsViewPivot', pivot)
            .withLandmarksEnable()
            .build();

        const storeTester = createStoreTesterForTabActions(actionName);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<VisualizationStoreData, TabActions> {
        const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory(
            Assessments,
            assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
        );
        const factory = (actions: TabActions) =>
            new VisualizationStore(
                new VisualizationActions(),
                actions,
                new InjectionActions(),
                visualizationConfigurationFactory,
                null,
                null,
                null,
                null,
                true,
                new InitialVisualizationStoreDataGenerator(visualizationConfigurationFactory),
            );

        return new StoreTester(TabActions, actionName, factory);
    }

    function createStoreTesterForVisualizationActions(
        actionName: keyof VisualizationActions,
    ): StoreTester<VisualizationStoreData, VisualizationActions> {
        const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory(
            Assessments,
            assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
        );
        const factory = (actions: VisualizationActions) =>
            new VisualizationStore(
                actions,
                new TabActions(),
                new InjectionActions(),
                visualizationConfigurationFactory,
                null,
                null,
                null,
                null,
                true,
                new InitialVisualizationStoreDataGenerator(visualizationConfigurationFactory),
            );

        return new StoreTester(VisualizationActions, actionName, factory);
    }

    function createStoreTesterForInjectionActions(
        actionName: keyof InjectionActions,
    ): StoreTester<VisualizationStoreData, InjectionActions> {
        const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory(
            Assessments,
            assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
        );
        const factory = (actions: InjectionActions) =>
            new VisualizationStore(
                new VisualizationActions(),
                new TabActions(),
                actions,
                visualizationConfigurationFactory,
                null,
                null,
                null,
                null,
                true,
                new InitialVisualizationStoreDataGenerator(visualizationConfigurationFactory),
            );

        return new StoreTester(InjectionActions, actionName, factory);
    }

    function setupDataGeneratorMock(
        persistedData: VisualizationStoreData,
        expectedData: VisualizationStoreData,
        times: Times = Times.once(),
    ): void {
        initialVisualizationStoreDataGeneratorMock
            .setup(im => im.generateInitialState(persistedData))
            .returns(() => expectedData)
            .verifiable(times);
    }
});
