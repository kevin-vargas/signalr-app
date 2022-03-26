import * as signalR from '@microsoft/signalr'
import { isEmpty } from '../checks'
export type Configuration = {
    url : string;

}
export type TopicResult = {
    topic: string,
    payload: unknown
}

export type TopicsResult = string[]

type OneOfMethodOn = 'received' | 'topics'
type OneOfMethodSend = 'subscribe' | 'publish'
type ArgsSend = {
    method: OneOfMethodSend,
    topic: string,
} & ({
    method: 'publish',
    payload: unknown,
} | {
    method: 'subscribe'
})

export default class SignalR {
    private hub : signalR.HubConnection;
    private static instance: SignalR;
    private configuration: Configuration;

    constructor(configuration: Configuration){
        this.configuration = configuration;
        this.hub = new signalR.HubConnectionBuilder()
        .withUrl(this.configuration.url)
        .build();
    }

    static getInstance(configuration: Configuration): SignalR {
        if (!SignalR.instance) {
            SignalR.instance = new SignalR(configuration);
        }
        else {
            SignalR.instance.configuration = configuration;
        }
        return SignalR.instance; 
    }

    async start() {
        try {
            await this.hub.start()
        } catch( e: any){
            console.log(e)
        }
    }
    async send(args: ArgsSend) {
        const { method, topic, ...rest} = args
        let extraArgs : unknown[] = []
        if ("payload" in rest) {
            extraArgs = [...extraArgs, rest.payload]
        }
        this.hub.invoke(method,topic,...extraArgs);
    }
    on<T>(method: OneOfMethodOn, cb: (result: T) => void) {
        this.hub.on(method, cb);
    }
    off(method: OneOfMethodOn) {
        this.hub.off(method)
    }
    get isConnected() {
        return this.hub.state === signalR.HubConnectionState.Connected
    }
} 

