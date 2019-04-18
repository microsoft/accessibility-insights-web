// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { VisibilitySwitchProps, withVisibilitySwitch } from '../../../../../common/components/with-visibility-switch';
import { NamedSFC } from '../../../../../common/react/named-sfc';

describe('withVisibilitySwitchTest', () => {
    type TestComponentProps = VisibilitySwitchProps & { text: string };

    const TestComponent = NamedSFC<TestComponentProps>('testComponent', props => {
        return (
            <>
                <DefaultButton className={'test-button'} onClick={() => (props.isVisible ? props.onHide() : props.onShow())}>
                    Switch Visibility
                </DefaultButton>
                {props.isVisible ? <h1>{props.text} </h1> : null}
            </>
        );
    });

    const WrappedComponent = withVisibilitySwitch<TestComponentProps>(TestComponent);

    test('render WrappedComponent', () => {
        const wrapper = mount(<WrappedComponent text="TEXT" />);
        expect(wrapper.getDOMNode()).toMatchSnapshot();
    });

    test('verify onShow/onHide sets the state properly', () => {
        const wrapper = shallow(<WrappedComponent text="TEXT" />);
        expect(wrapper.state().isVisible).toBe(false);
        wrapper.props().onShow();
        expect(wrapper.state().isVisible).toBe(true);
        wrapper.props().onHide();
        expect(wrapper.state().isVisible).toBe(false);
    });
});
