// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react';
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
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('IframeWarning', () => {
    test('render', () => {
        const onAllowPermissionsClickMock = Mock.ofInstance(
            (e: SupportedMouseEvent): Promise<void> => null,
        );
        const eventStub = {} as any;

        const wrapper = shallow(
            <IframeWarning onAllowPermissionsClick={onAllowPermissionsClickMock.object} />,
        );
        const onAllowPermissionsClick = wrapper.find(Link).prop('onClick');

        onAllowPermissionsClick(eventStub);

        onAllowPermissionsClickMock.verify(m => m(eventStub), Times.once());
        expect(wrapper.getElement()).toMatchSnapshot();
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
        testStub = -1;
        props = {
            deps: {
                allUrlsPermissionHandler: allUrlsPermissionHandlerMock.object,
                assessmentActionMessageCreator: assessmentActionCreatorMock.object,
            } as AssessmentIframeWarningDeps,
            test: testStub,
        };
    });

    test('render', async () => {
        const wrapper = shallow(<AssessmentIframeWarning {...props} />);
        const eventStub = {} as SupportedMouseEvent;
        const onAllowPermissionsClick = wrapper.find(IframeWarning).prop('onAllowPermissionsClick');

        allUrlsPermissionHandlerMock
            .setup(m => m.requestAllUrlsPermission(eventStub, It.isAny()))
            .callback((_, successCallback) => {
                successCallback();
            });

        await onAllowPermissionsClick(eventStub);

        assessmentActionCreatorMock.verify(m => m.startOverTest(eventStub, testStub), Times.once());
        expect(wrapper.getElement()).toMatchSnapshot();
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
        testStub = -1;
        props = {
            deps: {
                allUrlsPermissionHandler: allUrlsPermissionHandlerMock.object,
                detailsViewActionMessageCreator: detailsViewActionCreatorMock.object,
            } as FastPassIframeWarningDeps,
            test: testStub,
        };
    });

    test('render', async () => {
        const wrapper = shallow(<FastPassIframeWarning {...props} />);
        const eventStub = {} as SupportedMouseEvent;
        const onAllowPermissionsClick = wrapper.find(IframeWarning).prop('onAllowPermissionsClick');

        allUrlsPermissionHandlerMock
            .setup(m => m.requestAllUrlsPermission(eventStub, It.isAny()))
            .callback((_, successCallback) => {
                successCallback();
            });

        await onAllowPermissionsClick(eventStub);

        detailsViewActionCreatorMock.verify(
            m => m.rescanVisualization(testStub, eventStub),
            Times.once(),
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
