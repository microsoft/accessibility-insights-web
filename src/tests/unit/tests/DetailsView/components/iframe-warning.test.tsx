// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react';
import { render } from '@testing-library/react';
import { NewTabLink } from 'common/components/new-tab-link';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentIframeWarning,
    AssessmentIframeWarningDeps,
    AssessmentIframeWarningProps,
    FastPassIframeWarning,
    FastPassIframeWarningDeps,
    FastPassIframeWarningProps,
    IframeWarning,
} from 'DetailsView/components/iframe-warning';
import { AllUrlsPermissionHandler } from 'DetailsView/handlers/allurls-permission-handler';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';
jest.mock('@fluentui/react');
jest.mock('common/components/new-tab-link');
describe('IframeWarning', () => {
    mockReactComponents([Link, NewTabLink]);
    test('render', () => {
        const onAllowPermissionsClickMock = Mock.ofInstance(
            (e: SupportedMouseEvent): Promise<void> => null,
        );
        const eventStub = {} as any;

        const renderResult = render(
            <IframeWarning onAllowPermissionsClick={onAllowPermissionsClickMock.object} />,
        );
        const onAllowPermissionsClick = getMockComponentClassPropsForCall(Link).onClick;

        onAllowPermissionsClick(eventStub);

        onAllowPermissionsClickMock.verify(m => m(eventStub), Times.once());
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('AssessmentIframeWarning', () => {
    let allUrlsPermissionHandlerMock: IMock<AllUrlsPermissionHandler>;
    let assessmentActionCreatorMock: IMock<AssessmentActionMessageCreator>;
    let testStub: VisualizationType;
    let props: AssessmentIframeWarningProps;

    beforeEach(() => {
        allUrlsPermissionHandlerMock = Mock.ofType<AllUrlsPermissionHandler>();
        assessmentActionCreatorMock = Mock.ofType<AssessmentActionMessageCreator>();
        testStub = -1 as VisualizationType;
        props = {
            deps: {
                allUrlsPermissionHandler: allUrlsPermissionHandlerMock.object,
                getAssessmentActionMessageCreator: () => assessmentActionCreatorMock.object,
            } as AssessmentIframeWarningDeps,
            test: testStub,
        };
    });

    test('render', async () => {
        const renderResult = render(<AssessmentIframeWarning {...props} />);
        const eventStub = {} as SupportedMouseEvent;
        const onAllowPermissionsClick = getMockComponentClassPropsForCall(Link).onClick;

        allUrlsPermissionHandlerMock
            .setup(m => m.requestAllUrlsPermission(It.isAny(), It.isAny()))
            .callback((_, successCallback) => {
                successCallback();
            });
        await onAllowPermissionsClick(eventStub);
        assessmentActionCreatorMock.verify(
            m => m.startOverTest(It.isAny(), It.isAny()),
            Times.once(),
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('FastPassIframeWarning', () => {
    let allUrlsPermissionHandlerMock: IMock<AllUrlsPermissionHandler>;
    let detailsViewActionCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let testStub: VisualizationType;
    let props: FastPassIframeWarningProps;

    beforeEach(() => {
        allUrlsPermissionHandlerMock = Mock.ofType<AllUrlsPermissionHandler>();
        detailsViewActionCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        testStub = -1 as VisualizationType;
        props = {
            deps: {
                allUrlsPermissionHandler: allUrlsPermissionHandlerMock.object,
                detailsViewActionMessageCreator: detailsViewActionCreatorMock.object,
            } as FastPassIframeWarningDeps,
            test: testStub,
        };
    });

    test('render', async () => {
        const renderResult = render(<FastPassIframeWarning {...props} />);
        const eventStub = {} as SupportedMouseEvent;
        const onAllowPermissionsClick = getMockComponentClassPropsForCall(Link).onClick;

        allUrlsPermissionHandlerMock
            .setup(m => m.requestAllUrlsPermission(It.isAny(), It.isAny()))
            .callback((_, successCallback) => {
                successCallback();
            });
        await onAllowPermissionsClick(eventStub);
        detailsViewActionCreatorMock.verify(
            m => m.rescanVisualization(testStub, eventStub),
            Times.once(),
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
