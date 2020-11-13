// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HighlightBox } from 'electron/views/screenshot/highlight-box';
import { HighlightBoxViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HighlightBox', () => {
    const baseViewModel: Partial<HighlightBoxViewModel> = {
        resultUid: 'test-uid',
        top: '50%',
        left: '50%',
        width: '100px',
        height: '50px',
    };

    it.each([null, '!'])('renders for label=%p with appropriate position and dimensions', label => {
        const viewModel = {
            ...baseViewModel,
            label,
        } as HighlightBoxViewModel;
        const testObject = shallow(<HighlightBox viewModel={viewModel} />);
        expect(testObject.getElement()).toMatchSnapshot();
    });
});
