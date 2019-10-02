// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { CardKebabMenuButton, CardKebabMenuButtonProps } from '../../../../../../common/components/cards/card-kebab-menu-button';

describe('CardKebabMenuButtonTest', () => {
    let defaultProps: CardKebabMenuButtonProps;

    beforeEach(() => {
        defaultProps = {} as CardKebabMenuButtonProps;
    });

    it('render', () => {
        const rendered = shallow(<CardKebabMenuButton {...defaultProps} />);

        expect(rendered.debug()).toMatchSnapshot();
    });
});
