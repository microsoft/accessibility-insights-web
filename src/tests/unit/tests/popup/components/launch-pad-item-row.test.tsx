// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { kebabCase } from 'lodash';
import { LinkBase } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react';
import { Link } from 'office-ui-fabric-react';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { Mock, Times } from 'typemoq';

import {
    LaunchPadItemRow,
    LaunchPadItemRowProps,
} from '../../../../../popup/components/launch-pad-item-row';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('LaunchPadItemRow', () => {
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
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div
                        className="ms-Grid-col ms-sm3 popup-start-dialog-icon-circle"
                        aria-hidden="true"
                    >
                        <Icon iconName={props.iconName} className="popup-start-dialog-icon" />
                    </div>
                    <div className="ms-Grid-col ms-sm9">
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
            </div>
        );

        expect(testObject.render()).toEqual(expected);
    });

    test('on link click', () => {
        const event = eventStubFactory.createKeypressEvent() as any;

        onClickTitleMock.setup(handler => handler(event)).verifiable(Times.once());

        const component = React.createElement(LaunchPadItemRow, props);
        const testObject = TestUtils.renderIntoDocument(component);
        const link = TestUtils.findRenderedComponentWithType(testObject, LinkBase);
        link.props.onClick(event);

        onClickTitleMock.verifyAll();
    });
});
