// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

import { GenericPanel, GenericPanelProps } from '../../../../../DetailsView/components/generic-panel';

describe('DetailsViewPanelTest', () => {
    test('constructor', () => {
        const testSubject = new GenericPanel({} as GenericPanelProps);
        expect(testSubject).toBeDefined();
    });

    test.each([true, false])('render - isPanelOpen: %s', (isPanelOpen: boolean) => {
        const childContent = <div>child content</div>;

        const testProps: GenericPanelProps = {
            isOpen: isPanelOpen,
            onDismiss: () => {},
            title: 'panel title',
            className: 'panel-custom-class',
            closeButtonAriaLabel: 'close button label',
            children: childContent,
            hasCloseButton: true,
        };

        const testSubject = new GenericPanel(testProps);

        const expected = (
            <Panel
                isLightDismiss={true}
                isOpen={isPanelOpen}
                type={PanelType.custom}
                customWidth={'550px'}
                className={'generic-panel panel-custom-class'}
                onDismiss={testProps.onDismiss}
                closeButtonAriaLabel={testProps.closeButtonAriaLabel}
                hasCloseButton={true}
                headerText={testProps.title}
                headerClassName="header-text"
            >
                {childContent}
            </Panel>
        );

        expect(testSubject.render()).toEqual(expected);
    });
});
