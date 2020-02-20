// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import {
    PlatformBodyClassModifier,
    PlatformBodyClassModifierDeps,
} from 'electron/views/root-container/components/platform-body-class-modifier';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe(PlatformInfo, () => {
    let mockPlatformInfo: IMock<PlatformInfo>;
    let mockDeps: PlatformBodyClassModifierDeps;

    beforeEach(() => {
        mockPlatformInfo = Mock.ofType<PlatformInfo>();
        mockDeps = {
            platformInfo: mockPlatformInfo.object,
            documentManipulator: ({ id: 'stubDocumentManipulator' } as any) as DocumentManipulator,
        };
    });

    it('Renders as null for non-mac', () => {
        mockPlatformInfo.setup(m => m.isMac()).returns(() => false);

        const testSubject = shallow(<PlatformBodyClassModifier deps={mockDeps} />);

        expect(testSubject.getElement()).toBeNull();
    });

    it('Renders per snapshot for mac', () => {
        mockPlatformInfo.setup(m => m.isMac()).returns(() => true);

        const testSubject = shallow(<PlatformBodyClassModifier deps={mockDeps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
