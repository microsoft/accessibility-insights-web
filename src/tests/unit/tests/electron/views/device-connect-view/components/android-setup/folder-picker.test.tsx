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
            labelText: 'Test label',
            value: '/path/to/folder',
            onChange: null,
        };
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<FolderPicker {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it("coordinates the label's for attribute with the TextField's id", () => {
        const rendered = shallow(<FolderPicker {...props} />);
        expect(rendered.find('label').prop('htmlFor')).toBe(rendered.find(TextField).prop('id'));
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
