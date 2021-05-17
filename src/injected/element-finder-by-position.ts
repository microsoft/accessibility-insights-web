// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { BoundRectAccessor, ClientUtils } from './client-utils';

export interface ElementFinderByPositionMessage {
    x: number;
    y: number;
}

export class ElementFinderByPosition {
    public static readonly findElementByPositionCommand = 'insights.findElementByPositionCommand';

    constructor(
        private readonly frameMessenger: FrameMessenger,
        private readonly clientUtils: ClientUtils,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
        private readonly dom: Document,
    ) {}

    public initialize(): void {
        this.frameMessenger.addMessageListener(
            ElementFinderByPosition.findElementByPositionCommand,
            this.onfindElementByPosition,
        );
    }

    protected onfindElementByPosition = async (
        message: CommandMessage,
    ): Promise<CommandMessageResponse> => {
        return await this.processRequest(message.payload);
    };

    public processRequest = async (
        message: ElementFinderByPositionMessage,
    ): Promise<CommandMessageResponse> => {
        let path = [];
        const element = this.getElementByPosition(message);

        if (element == null) {
            return { payload: path };
        }

        path.push(this.getUniqueSelector(element));

        if (element.tagName.toLocaleLowerCase() !== 'iframe') {
            return { payload: path };
        }

        const getDescendentElementsResponse = await this.getDescendentElements(element, message);
        const descendentElements = getDescendentElementsResponse.payload;

        path = path.concat(descendentElements);
        return { payload: path };
    };

    private getDescendentElements = async (
        element: HTMLElement,
        message: ElementFinderByPositionMessage,
    ): Promise<CommandMessageResponse> => {
        const elementRect = this.clientUtils.getOffset(element as BoundRectAccessor);
        const targetFrame = element as HTMLIFrameElement;
        const commandMessage: CommandMessage = {
            command: ElementFinderByPosition.findElementByPositionCommand,
            payload: {
                x: message.x + window.scrollX - elementRect.left,
                y: message.y + window.scrollY - elementRect.top,
            },
        };
        return await this.frameMessenger.sendMessageToFrame(targetFrame, commandMessage);
    };

    private getElementByPosition = (message: ElementFinderByPositionMessage): HTMLElement => {
        const elements = this.dom.elementsFromPoint(message.x, message.y) as HTMLElement[];

        for (let pos = 0; pos < elements.length; pos++) {
            if (elements[pos].id === 'insights-shadow-host') {
                continue;
            }
            return elements[pos];
        }
    };
}
