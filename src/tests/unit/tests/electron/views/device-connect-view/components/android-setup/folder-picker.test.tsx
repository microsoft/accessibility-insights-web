// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FolderPicker,
    FolderPickerProps,
} from 'electron/views/device-connect-view/components/android-setup/folder-picker';
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('FolderPicker', () => {
    let props: FolderPickerProps;

    beforeEach(() => {
        props = {
            instructionsText: 'some instructions',
            value: '/path/to/folder',
            onChange: null,
        };
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<FolderPicker {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it("coordinates the instructions' id with the TextField's aria-describedby", () => {
        const rendered = shallow(<FolderPicker {...props} />);
        expect(rendered.find('.instructions').prop('id')).toBe(
            rendered.find(TextField).prop('aria-describedby'),
        );
    });

    it('invokes onChange when the TextField is changed', () => {
        const onChangeMock = Mock.ofType<typeof props.onChange>();
        props.onChange = onChangeMock.object;

        const eventStub = {} as React.FormEvent<any>;
        const rendered = shallow(<FolderPicker {...props} />);
        rendered.find(TextField).prop('onChange')(eventStub, 'new text');

        onChangeMock.verify(m => m('new text'), Times.once());
    });
});
