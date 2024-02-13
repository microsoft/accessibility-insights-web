// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { Link } from '@fluentui/react';
import { render } from '@testing-library/react';
import { kebabCase } from 'lodash';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock, Times } from 'typemoq';

import {
    LaunchPadItemRow,
    LaunchPadItemRowProps,
} from '../../../../../popup/components/launch-pad-item-row';
import { EventStubFactory } from '../../../common/event-stub-factory';

jest.mock('@fluentui/react');

describe('LaunchPadItemRow', () => {
    mockReactComponents([Link]);
    const descriptionClassName = 'launch-pad-item-description';

    const eventStubFactory = new EventStubFactory();

    const onClickTitleMock = Mock.ofInstance((ev?) => {});

    const props: LaunchPadItemRowProps = {
        title: 'test title',
        iconName: 'test icon name',
        description: 'test description',
        onClickTitle: onClickTitleMock.object,
    };

    function getPrivate(obj: LaunchPadItemRow): { descriptionId: string } {
        return obj as {} as { descriptionId: string };
    }

    it('has unique description ids', () => {
        function getId(): string {
            return getPrivate(new LaunchPadItemRow(props)).descriptionId;
        }
        const id1 = getId();
        const id2 = getId();
        expect(id1).not.toEqual(id2);
        expect(id1).toEqual(expect.stringContaining(descriptionClassName));
        expect(id2).toEqual(expect.stringContaining(descriptionClassName));
    });

    it('renders', () => {
        const testObject = new LaunchPadItemRow(props);

        const { descriptionId } = getPrivate(testObject);
        const testId = kebabCase(props.title);

        const expected = (
            <div className="launch-pad-item-grid">
                <div className="popup-start-dialog-icon-circle" aria-hidden="true">
                    <Icon iconName={props.iconName} className="popup-start-dialog-icon" />
                </div>
                <div>
                    <div className="launch-pad-item-title">
                        <Link
                            role="link"
                            className="insights-link"
                            id={testId}
                            onClick={props.onClickTitle}
                            aria-describedby={descriptionId}
                        >
                            {props.title}
                        </Link>
                    </div>
                    <div className={descriptionClassName} id={descriptionId}>
                        {props.description}
                    </div>
                </div>
            </div>
        );

        expect(testObject.render()).toEqual(expected);
    });

    test('on link click', () => {
        const event = eventStubFactory.createKeypressEvent() as any;

        onClickTitleMock.setup(handler => handler(event)).verifiable(Times.once());

        render(<LaunchPadItemRow {...props} />);
        const linkProps = getMockComponentClassPropsForCall(Link);
        linkProps.onClick(event);

        onClickTitleMock.verifyAll();
    });
});
