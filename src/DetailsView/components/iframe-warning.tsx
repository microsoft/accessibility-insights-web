// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react-components';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { AllUrlsPermissionHandler } from 'DetailsView/handlers/allurls-permission-handler';
import * as React from 'react';

export type IframeWarningProps = {
    onAllowPermissionsClick: (e: SupportedMouseEvent) => Promise<void>;
};

export const IframeWarningContainerAutomationId = 'iframe-warning-container';

export const IframeWarning = NamedFC<IframeWarningProps>('IframeWarning', props => (
    <div data-automation-id={IframeWarningContainerAutomationId}>
        There are iframes in the target page. To have complete results,{' '}
        <Link
            className="insights-link"
            onClick={props.onAllowPermissionsClick}
            style={{ fontSize: 12 }}
        >
            give Accessibility Insights additional permissions
        </Link>
        ; this will trigger a rescan of the test.
        <NewTabLink
            href={
                'https://accessibilityinsights.io/docs/en/web/reference/faq#why-does-accessibility-insights-for-web-ask-for-additional-permissions-when-it-detects-iframes'
            }
        >
            Learn more here.
        </NewTabLink>
    </div>
));

export type AssessmentIframeWarningDeps = {
    allUrlsPermissionHandler: AllUrlsPermissionHandler;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator;
};

export type AssessmentIframeWarningProps = {
    deps: AssessmentIframeWarningDeps;
    test: VisualizationType;
};

export const AssessmentIframeWarning = NamedFC<AssessmentIframeWarningProps>(
    'AssessmentIframeWarning',
    props => {
        const { deps, test } = props;

        const onAllowPermissionsClick = async (event: SupportedMouseEvent) => {
            const rescanTest = () => {
                deps.getAssessmentActionMessageCreator().startOverTest(event, test);
            };

            await deps.allUrlsPermissionHandler.requestAllUrlsPermission(event, rescanTest);
        };

        return <IframeWarning onAllowPermissionsClick={onAllowPermissionsClick} />;
    },
);

export type FastPassIframeWarningDeps = {
    allUrlsPermissionHandler: AllUrlsPermissionHandler;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export type FastPassIframeWarningProps = {
    deps: FastPassIframeWarningDeps;
    test: VisualizationType;
};

export const FastPassIframeWarning = NamedFC<FastPassIframeWarningProps>(
    'FastPassIframeWarning',
    props => {
        const { deps, test } = props;

        const onAllowPermissionsClick = async (event: SupportedMouseEvent) => {
            const rescanTest = () => {
                deps.detailsViewActionMessageCreator.rescanVisualization(test, event);
            };

            await deps.allUrlsPermissionHandler.requestAllUrlsPermission(event, rescanTest);
        };

        return <IframeWarning onAllowPermissionsClick={onAllowPermissionsClick} />;
    },
);
