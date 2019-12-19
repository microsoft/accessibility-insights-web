// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { AllUrlsPermissionHandler } from 'DetailsView/handlers/allurls-permission-handler';
import { Link } from 'office-ui-fabric-react';
import * as React from 'react';

export type IframeWarningProps = {
    onAllowPermissionsClick: (e: SupportedMouseEvent) => Promise<void>;
};

export const IframeWarning = NamedFC<IframeWarningProps>('IframeWarning', props => (
    <>
        There are iframes in the target page. To have complete results,{' '}
        <Link onClick={props.onAllowPermissionsClick}>give Accessibility Insights additional permissions</Link>; this will trigger a re-scan{' '}
        of the test. <NewTabLink href={'https://accessibilityinsights.io/docs/en/faq'}>Learn more here.</NewTabLink>
    </>
));

export type AssessmentIframeWarningDeps = {
    allUrlsPermissionHandler: AllUrlsPermissionHandler;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export type AssessmentIframeWarningProps = {
    deps: AssessmentIframeWarningDeps;
    test: VisualizationType;
};

export const AssessmentIframeWarning = NamedFC<AssessmentIframeWarningProps>('AssessmentIframeWarning', props => {
    const { deps, test } = props;

    const onAllowPermissionsClick = async (event: SupportedMouseEvent) => {
        const rescanTest = () => {
            deps.detailsViewActionMessageCreator.startOverTest(event, test);
        };

        await deps.allUrlsPermissionHandler.requestAllUrlsPermission(event, rescanTest);
    };

    return <IframeWarning onAllowPermissionsClick={onAllowPermissionsClick} />;
});

export type FastPassIframeWarningDeps = {
    allUrlsPermissionHandler: AllUrlsPermissionHandler;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export type FastPassIframeWarningProps = {
    deps: FastPassIframeWarningDeps;
    test: VisualizationType;
};

export const FastPassIframeWarning = NamedFC<FastPassIframeWarningProps>('FastPassIframeWarning', props => {
    const { deps, test } = props;

    const onAllowPermissionsClick = async (event: SupportedMouseEvent) => {
        const rescanTest = () => {
            deps.detailsViewActionMessageCreator.rescanVisualization(test, event);
        };

        await deps.allUrlsPermissionHandler.requestAllUrlsPermission(event, rescanTest);
    };

    return <IframeWarning onAllowPermissionsClick={onAllowPermissionsClick} />;
});
