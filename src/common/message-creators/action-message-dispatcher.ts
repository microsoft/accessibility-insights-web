import { PayloadWithEventName } from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { TelemetryData } from '../telemetry-events';

export class ActionMessageDispatcher {
    constructor(private postMessageDelegate: (message: Message) => void, private tabId: number) { }

    public dispatchMessage(message: Message): void {
        if (this.tabId != null) {
            message.tabId = this.tabId;
        }

        this.postMessageDelegate(message);
    }

    public dispatchType(messageType: string): void {
        this.dispatchMessage({
            type: messageType,
        });
    }

    public sendTelemetry(eventName: string, eventData: TelemetryData): void {
        const payload: PayloadWithEventName = {
            eventName: eventName,
            telemetry: eventData,
        };

        const message: Message = {
            type: Messages.Telemetry.Send,
            payload,
        };

        this.dispatchMessage(message);
    }
}
