// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { GenericPanel, GenericPanelProps } from '../../../../../DetailsView/components/generic-panel';

export class TestableDetailsViewPanel extends GenericPanel {
    public getRenderHeader() {
        return this.renderHeader;
    }
}

describe('DetailsViewPanelTest', () => {
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    });

    test('constructor', () => {
        const testSubject = new GenericPanel({} as GenericPanelProps);
        expect(testSubject).toBeDefined();
    });

    test.each([true, false])('render', (isPanelOpen: boolean) => {
        const childContent =  (
            <div>child content</div>
        );

        const testProps: GenericPanelProps = {
            isOpen: isPanelOpen,
            onDismiss: () => {},
            title: 'panel title',
            className: 'panel-custom-class',
            closeButtonAriaLabel: 'close button label',
            children: childContent,
            hasCloseButton: true,
        };

        const testSubject = new TestableDetailsViewPanel(testProps);

        const expected = (
            <Panel isLightDismiss={true}
                isOpen={isPanelOpen}
                type={PanelType.custom}
                customWidth={'550px'}
                className={'generic-panel panel-custom-class'}
                onDismiss={testProps.onDismiss}
                onRenderHeader={testSubject.getRenderHeader()}
                closeButtonAriaLabel={testProps.closeButtonAriaLabel}>
                {childContent}
            </Panel>
        );

        expect(testSubject.render()).toEqual(expected);
    });

    test('renderHeader', () => {
        const panelTitle = 'panel title';
        const testProps: GenericPanelProps = {
            isOpen: true,
            onDismiss: () => {},
            title: panelTitle,
            className: 'panel-custom-class',
            closeButtonAriaLabel: 'close button label',
            hasCloseButton: true,
        };

        const testSubject = new TestableDetailsViewPanel(testProps);
        const renderHeader = testSubject.getRenderHeader();

        const expected = (
            <div>
                <h1 className={'header-text'}>{panelTitle}</h1>
            </div>
        );

        expect(renderHeader()).toEqual(expected);
    });
});
