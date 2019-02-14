export interface TelemetryBaseData {
    name: string;
    properties: {
        [name: string]: string;
    };
}
