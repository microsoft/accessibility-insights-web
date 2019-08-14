// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { Theme } from '../../../../common/components/theme';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { configMutator } from '../../../../common/configuration';
import { DocumentManipulator } from '../../../../common/document-manipulator';
import { DropdownClickHandler } from '../../../../common/dropdown-click-handler';
import { InspectActionMessageCreator } from '../../../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../../../common/message-creators/scoping-action-message-creator';
import { IssuesTableHandler } from '../../../../DetailsView/components/issues-table-handler';
import { DetailsView, DetailsViewContainerDeps } from '../../../../DetailsView/details-view-container';
import { DetailsViewRenderer } from '../../../../DetailsView/details-view-renderer';
import { AssessmentInstanceTableHandler } from '../../../../DetailsView/handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from '../../../../DetailsView/handlers/preview-feature-flags-handler';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';
import { TestDocumentCreator } from '../../common/test-document-creator';

describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const deps = Mock.ofType<DetailsViewContainerDeps>().object;

        const scopingActionMessageCreatorStrictMock = Mock.ofType<ScopingActionMessageCreator>(null, MockBehavior.Strict);
        const inspectActionMessageCreatorStrictMock = Mock.ofType<InspectActionMessageCreator>(null, MockBehavior.Strict);

        const fakeDocument = TestDocumentCreator.createTestDocument('<div id="details-container"></div>');

        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);
        const selectionMock = Mock.ofType<ISelection>(Selection);
        const clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory);
        const visualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        const issuesTableHandlerMock = Mock.ofType(IssuesTableHandler);
        const previewFeatureFlagsHandlerMock = Mock.ofType(PreviewFeatureFlagsHandler);
        const scopingFlagsHandlerMock = Mock.ofType(PreviewFeatureFlagsHandler);
        const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        const assessmentsProviderMock = Mock.ofInstance(CreateTestAssessmentProvider());

        const expectedIcon16 = 'icon128.png';
        configMutator.setOption('icon128', expectedIcon16);
        const documentManipulatorMock = Mock.ofType(DocumentManipulator);
        documentManipulatorMock.setup(des => des.setShortcutIcon('../' + expectedIcon16)).verifiable();

        renderMock
            .setup(r =>
                r(
                    It.isValue(
                        <>
                            <Theme deps={deps} />
                            <DetailsView
                                deps={deps}
                                scopingActionMessageCreator={scopingActionMessageCreatorStrictMock.object}
                                inspectActionMessageCreator={inspectActionMessageCreatorStrictMock.object}
                                issuesSelection={selectionMock.object}
                                clickHandlerFactory={clickHandlerFactoryMock.object}
                                visualizationConfigurationFactory={visualizationConfigurationFactoryMock.object}
                                issuesTableHandler={issuesTableHandlerMock.object}
                                assessmentInstanceTableHandler={assessmentInstanceTableHandlerMock.object}
                                previewFeatureFlagsHandler={previewFeatureFlagsHandlerMock.object}
                                scopingFlagsHandler={scopingFlagsHandlerMock.object}
                                dropdownClickHandler={dropdownClickHandlerMock.object}
                                assessmentsProvider={assessmentsProviderMock.object}
                            />
                        </>,
                    ),
                    fakeDocument.getElementById('details-container'),
                ),
            )
            .verifiable();

        const renderer = new DetailsViewRenderer(
            deps,
            fakeDocument,
            renderMock.object,
            scopingActionMessageCreatorStrictMock.object,
            inspectActionMessageCreatorStrictMock.object,
            selectionMock.object,
            clickHandlerFactoryMock.object,
            visualizationConfigurationFactoryMock.object,
            issuesTableHandlerMock.object,
            assessmentInstanceTableHandlerMock.object,
            previewFeatureFlagsHandlerMock.object,
            scopingFlagsHandlerMock.object,
            dropdownClickHandlerMock.object,
            assessmentsProviderMock.object,
            documentManipulatorMock.object,
        );

        renderer.render();

        renderMock.verifyAll();
        documentManipulatorMock.verifyAll();
    });
});
