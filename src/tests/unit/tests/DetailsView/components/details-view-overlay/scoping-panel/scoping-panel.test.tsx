// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from '@fluentui/react';
import { ScopingInputTypes } from 'background/scoping-input-types';
import { InspectActionMessageCreator } from 'common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from 'common/message-creators/scoping-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { ScopingContainer } from 'DetailsView/components/details-view-overlay/scoping-panel/scoping-container';
import {
    ScopingPanel,
    ScopingPanelProps,
} from 'DetailsView/components/details-view-overlay/scoping-panel/scoping-panel';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('ScopingPanelTest', () => {
    test('constructor', () => {
        const testSubject = new ScopingPanel({} as ScopingPanelProps);
        expect(testSubject).toBeDefined();
    });

    test('render', () => {
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const scopingActionMessageCreatorMock = Mock.ofType(ScopingActionMessageCreator);
        const inspectActionMessageCreatorMock = Mock.ofType(InspectActionMessageCreator);

        const testProps: ScopingPanelProps = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            isOpen: true,
            scopingActionMessageCreator: scopingActionMessageCreatorMock.object,
            featureFlagData: {},
            scopingSelectorsData: {
                selectors: {
                    [ScopingInputTypes.include]: [],
                    [ScopingInputTypes.exclude]: [],
                },
            },
            inspectActionMessageCreator: inspectActionMessageCreatorMock.object,
        };

        const testSubject = new ScopingPanel(testProps);

        const expected = (
            <GenericPanel
                isOpen={true}
                className={'scoping-panel'}
                onDismiss={testProps.deps.detailsViewActionMessageCreator.closeScopingPanel}
                closeButtonAriaLabel={'Close scoping feature panel'}
                hasCloseButton={true}
                headerText="Scoping"
            >
                <ScopingContainer
                    deps={testProps.deps}
                    featureFlagData={testProps.featureFlagData}
                    scopingSelectorsData={testProps.scopingSelectorsData}
                    scopingActionMessageCreator={testProps.scopingActionMessageCreator}
                    inspectActionMessageCreator={testProps.inspectActionMessageCreator}
                />
                <DefaultButton
                    className="closing-scoping-panel"
                    primary={true}
                    text="OK"
                    onClick={testProps.deps.detailsViewActionMessageCreator.closeScopingPanel}
                />
            </GenericPanel>
        );

        expect(testSubject.render()).toEqual(expected);
    });
});
