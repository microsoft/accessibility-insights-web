// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { VisibilitySwitchProps, withVisibilitySwitch } from '../../../../../common/components/with-visibility-switch';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { shallow } from 'enzyme';

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
        const wrapper = shallow(<WrappedComponent text="TEXT" />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
