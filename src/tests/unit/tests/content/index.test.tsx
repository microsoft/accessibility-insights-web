// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { ContentActionMessageCreator } from '../../../../common/message-creators/content-action-message-creator';
import { contentPages } from '../../../../content';

describe('content', () => {
    const contentActionMessageCreator = Mock.ofType<ContentActionMessageCreator>().object;
    const deps = {
        applicationTitle: 'MY_APPLICATION_TITLE',
        contentActionMessageCreator,
    };

    contentPages.allPaths().forEach(path =>
        it(`can render ${path}`, () => {
            const ThisPage = contentPages.getPage(path);
            expect(ThisPage.displayName).toEqual('ContentPageComponent');
            const result = shallow(<ThisPage deps={deps} />);
            const headerExists =
                result.find('h1').exists() ||
                result.find('h2').exists() ||
                result.find('Title').exists() ||
                result.find('GuidanceTitle').exists();

            expect(headerExists).toBe(true);
        }),
    );
});
