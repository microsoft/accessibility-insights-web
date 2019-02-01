// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.
// import { ISelection, Selection } from 'office-ui-fabric-react/lib/DetailsList';
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { IMock, It, Mock, MockBehavior } from 'typemoq';

// import { UserConfigurationStore } from '../../../../background/stores/global/user-configuration-store';
// import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
// import { configMutator } from '../../../../common/configuration';
// import { DocumentManipulator } from '../../../../common/document-manipulator';
// import { DropdownClickHandler } from '../../../../common/dropdown-click-handler';
// import { InspectActionMessageCreator } from '../../../../common/message-creators/inspect-action-message-creator';
// import { ScopingActionMessageCreator } from '../../../../common/message-creators/scoping-action-message-creator';
// import { StoreActionMessageCreator } from '../../../../common/message-creators/store-action-message-creator';
// import { BaseClientStoresHub } from '../../../../common/stores/base-client-stores-hub';
// import { IssuesTableHandler } from '../../../../DetailsView/components/issues-table-handler';
// import { DetailsView, DetailsViewContainerDeps } from '../../../../DetailsView/details-view-container';
// import { DetailsViewRenderer } from '../../../../DetailsView/details-view-renderer';
// import { AssessmentInstanceTableHandler } from '../../../../DetailsView/handlers/assessment-instance-table-handler';
// import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
// import { PreviewFeatureFlagsHandler } from '../../../../DetailsView/handlers/preview-feature-flags-handler';
// import { ReportGenerator } from '../../../../DetailsView/reports/report-generator';
// import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';
// import { Theme } from '../../../../common/components/theme';

// describe('DetailsViewRendererTest', () => {
//     test('render', () => {
//         const deps = Mock.ofType<DetailsViewContainerDeps>().object;

//         const scopingActionMessageCreatorStrictMock = Mock.ofType<ScopingActionMessageCreator>(null, MockBehavior.Strict);
//         const inspectActionMessageCreatorStrictMock = Mock.ofType<InspectActionMessageCreator>(null, MockBehavior.Strict);
//         const detailsViewStoreActionCreatorStrictMock = Mock.ofType<StoreActionMessageCreator>(null, MockBehavior.Strict);

//         const dom = document.createElement('div');
//         const detailsViewContainer = document.createElement('div');

//         const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);
//         const selectionMock = Mock.ofType<ISelection>(Selection);
//         const clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory);
//         const visualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);

//         const storesHubMock: IMock<BaseClientStoresHub<any>> = Mock.ofType(BaseClientStoresHub);
//         const userConfigStore = {};
//         storesHubMock.setup(s => s.getStore(It.isAny())).returns(() => userConfigStore as UserConfigurationStore);
//         const issuesTableHandlerMock = Mock.ofType(IssuesTableHandler);
//         const previewFeatureFlagsHandlerMock = Mock.ofType(PreviewFeatureFlagsHandler);
//         const scopingFlagsHandlerMock = Mock.ofType(PreviewFeatureFlagsHandler);
//         const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
//         const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
//         const reportGeneratorMock = Mock.ofType(ReportGenerator);
//         const assessmentsProviderMock = Mock.ofInstance(CreateTestAssessmentProvider());

//         const expectedIcon16 = 'icon16.png';
//         configMutator.setOption('icon16', expectedIcon16);
//         const documentManipulatorMock = Mock.ofType(DocumentManipulator);
//         documentManipulatorMock.setup(des => des.setShortcutIcon('../' + expectedIcon16)).verifiable();

//         detailsViewContainer.setAttribute('id', 'details-container');
//         dom.appendChild(detailsViewContainer);

//         renderMock
//             .setup(r =>
//                 r(
//                     It.isValue(
//                         <>
//                             <Theme userConfigurationStore={userConfigStore as UserConfigurationStore} />
//                             <DetailsView
//                                 deps={deps}
//                                 scopingActionMessageCreator={scopingActionMessageCreatorStrictMock.object}
//                                 inspectActionMessageCreator={inspectActionMessageCreatorStrictMock.object}
//                                 storeActionCreator={detailsViewStoreActionCreatorStrictMock.object}
//                                 document={dom as any}
//                                 issuesSelection={selectionMock.object}
//                                 clickHandlerFactory={clickHandlerFactoryMock.object}
//                                 visualizationConfigurationFactory={visualizationConfigurationFactoryMock.object}
//                                 storesHub={storesHubMock.object}
//                                 issuesTableHandler={issuesTableHandlerMock.object}
//                                 assessmentInstanceTableHandler={assessmentInstanceTableHandlerMock.object}
//                                 previewFeatureFlagsHandler={previewFeatureFlagsHandlerMock.object}
//                                 scopingFlagsHandler={scopingFlagsHandlerMock.object}
//                                 reportGenerator={reportGeneratorMock.object}
//                                 dropdownClickHandler={dropdownClickHandlerMock.object}
//                                 assessmentsProvider={assessmentsProviderMock.object}
//                                 storeState={null}
//                             />
//                         </>,
//                     ),
//                     detailsViewContainer,
//                 ),
//             )
//             .verifiable();

//         const renderer = new DetailsViewRenderer(
//             deps,
//             dom,
//             renderMock.object,
//             scopingActionMessageCreatorStrictMock.object,
//             inspectActionMessageCreatorStrictMock.object,
//             detailsViewStoreActionCreatorStrictMock.object,
//             selectionMock.object,
//             clickHandlerFactoryMock.object,
//             visualizationConfigurationFactoryMock.object,
//             storesHubMock.object,
//             issuesTableHandlerMock.object,
//             assessmentInstanceTableHandlerMock.object,
//             reportGeneratorMock.object,
//             previewFeatureFlagsHandlerMock.object,
//             scopingFlagsHandlerMock.object,
//             dropdownClickHandlerMock.object,
//             assessmentsProviderMock.object,
//             documentManipulatorMock.object,
//         );

//         renderer.render();

//         renderMock.verifyAll();
//         documentManipulatorMock.verifyAll();
//     });
// });
