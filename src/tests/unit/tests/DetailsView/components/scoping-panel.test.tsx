// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { Mock } from 'typemoq';

import { ScopingInputTypes } from 'background/scoping-input-types';
import { InspectActionMessageCreator } from '../../../../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../../../../common/message-creators/scoping-action-message-creator';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { GenericPanel } from '../../../../../DetailsView/components/generic-panel';
import { ScopingContainer } from '../../../../../DetailsView/components/scoping-container';
import {
    ScopingPanel,
    ScopingPanelProps,
} from '../../../../../DetailsView/components/scoping-panel';

describe('ScopingPanelTest', () => {
    test('constructor', () => {
        const testSubject = new ScopingPanel({} as ScopingPanelProps);
        expect(testSubject).toBeDefined();
    });

    test('render', () => {
        const actionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
        );
        const scopingActionMessageCreatorMock = Mock.ofType(
            ScopingActionMessageCreator,
        );
        const inspectActionMessageCreatorMock = Mock.ofType(
            InspectActionMessageCreator,
        );

        const testProps: ScopingPanelProps = {
            isOpen: true,
            actionMessageCreator: actionMessageCreatorMock.object,
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
                onDismiss={testProps.actionMessageCreator.closeScopingPanel}
                closeButtonAriaLabel={'Close scoping feature panel'}
                hasCloseButton={true}
                title="Scoping"
            >
                <ScopingContainer
                    featureFlagData={testProps.featureFlagData}
                    actionMessageCreator={testProps.actionMessageCreator}
                    scopingSelectorsData={testProps.scopingSelectorsData}
                    scopingActionMessageCreator={
                        testProps.scopingActionMessageCreator
                    }
                    inspectActionMessageCreator={
                        testProps.inspectActionMessageCreator
                    }
                />
                <DefaultButton
                    className="closing-scoping-panel"
                    primary={true}
                    text="OK"
                    onClick={testProps.actionMessageCreator.closeScopingPanel}
                />
            </GenericPanel>
        );

        expect(testSubject.render()).toEqual(expected);
    });
});
