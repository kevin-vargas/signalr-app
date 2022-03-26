import SignalR, {Configuration, TopicResult} from './instance'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isArray, isString } from '../checks'
import { arrayEquals } from '../checks/array';
type PropsBrokerContext = {
    config: Configuration,
    instance : SignalR | undefined,
}
const defaultConfig : Configuration = {
    url:  'http://localhost:8081/chat'
    //url:  'http://fast.ar:8081/chat'
}

const defaultState = {
    config: defaultConfig,
    instance: undefined,
};
  
const BrokerContext = createContext<PropsBrokerContext>(defaultState);

type PropsBrokerProvider = {
    children: React.ReactNode,
} & {
    config: Configuration
}
export const BrokerProvider = ({ children, ...props }: PropsBrokerProvider) => {
    const [instance, setInstance ] = useState<SignalR>()
    
    useEffect(() => {
        const init = async () => {
            const newInstance = SignalR.getInstance(props.config)
            await newInstance.start()
            setInstance(newInstance)
        }
        init()
    }, [props.config])

    return (
        <BrokerContext.Provider value={{...props, instance}}>
            {children}
        </BrokerContext.Provider>
    )
}


type Subscriptions = string | string[]

const useBrokerContext = () => useContext(BrokerContext);

export const useSubscription = (subs: Subscriptions) => {
    //const [message, setMessage] = useState<undefined|unknown>(undefined)
    const [result,setResult] = useState<undefined|TopicResult>(undefined)

    const {instance} = useBrokerContext()

    const onReceived = useCallback( ({ payload, topic }: TopicResult) =>  {
        console.log("Se recibio algo")
        console.log("TOPIC ", topic, " SUBS ", subs)
        if (isString(subs) && topic === subs) {
            setResult({topic, payload})
        } else if (isArray(subs) && subs.includes(topic)) {
            setResult({topic, payload})
        }
    }, [subs])

    useEffect(() => {
        console.log(subs)
        if(instance?.isConnected){
            const subscriptions = isString(subs) ? [subs] : subs
            subscriptions.forEach( (topic) =>  
                instance.send({ method: 'subscribe', topic})
            )
            instance.on('received',onReceived)
        }
        return () => {
            instance?.off('received')
        }
    },[instance, onReceived, subs])

    return { message: result?.payload, result  }
}

export const usePublish = () => {
    const {instance} = useBrokerContext()
    return {
        publish: (topic: string, payload: unknown) => {
            instance?.isConnected && instance.send({ method: 'publish',topic, payload})
        }
    }
}

export const useTopics = () => {
    const [topics,setTopics] = useState<string[]>([])

    const {instance} = useBrokerContext()

    const onReceived = useCallback( (result: string[]) =>  {
        const areEquals = () => arrayEquals(topics.sort(), result.sort())
        if(!areEquals()){
            setTopics(result)
        }
    }, [topics])

    useEffect(() => {
        instance?.on('topics',onReceived)

        return () => {
            instance?.off('topics')
        }
    },[instance, onReceived])

    return { topics }
}