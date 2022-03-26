import React, { ChangeEvent, useEffect } from 'react';
import { useSubscription } from '../../utils/signalr'
import { isString } from '../../utils/checks'
import { Button, Grid, List, ListItemText, TextField } from '@mui/material';
type State = {
    [key: string] : string
}
const SubscribeComponent = () => {
    const [messages, setMessages ] = React.useState<string[]>([])
    const [state, setState ] = React.useState<State>({
        topics: '',
    })
    const [subs, setSubs ] = React.useState<string[]>([])
    console.log(subs)
    const { message, result } = useSubscription(subs)
    /*
    useEffect( () => {
        
            if (isString(message) && message !== '') {
                setMessages(prev => [...prev, message])
            }

    }, [message])
    */
    useEffect(() => {
        if(result) {
            const { topic, payload } = result
            if (isString(payload) && payload !== '') {
                const msg = `${topic} : ${payload}`
                setMessages(prev => [...prev, msg])
            }
        }
    },[result])
    const handleOnChange = (e : ChangeEvent<HTMLInputElement>) => {
        setState( prev => ({ ...prev, ...{ [e.target.id] : e.target.value }}))
    }
    const handleOnClick = () => {
        const subscriptionTopics = state.topics.split(',')
        setSubs(subscriptionTopics)
    }
    return (
        <>
        <Grid
  container
  direction="row"
  justifyContent="center"
  alignItems="center"
    >
        <TextField id="topics" label="Topics" variant="outlined" onChange={handleOnChange} size="small"/>
        <Button variant="outlined" onClick={handleOnClick}>Set Topics</Button>
        </Grid>
        <Grid
  container
  direction="row"
  justifyContent="center"
  alignItems="center"
    >
        <List>
        {messages.map(
            (msg) => <ListItemText>{msg}</ListItemText>
        )}
        </List>    
        </Grid>    
        </>
    )
}

export default SubscribeComponent