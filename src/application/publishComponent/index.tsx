import { Button, Grid, TextField } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { usePublish } from '../../utils/signalr';

type State = {
    [key: string] : string
}
const PublishComponent = () => {
    const [state, setState ] = React.useState<State>({
        topic: '',
        payload: '',
    })
    const { publish } = usePublish()
    const handleOnClick = () => {
        const { topic, payload } = state
        publish(topic, payload)
    }

    const handleOnChange = (e : ChangeEvent<HTMLInputElement>) => {
        setState( prev => ({ ...prev, ...{ [e.target.id] : e.target.value }}))
    }
    return (
        <Grid
  container
  direction="row"
  justifyContent="center"
  alignItems="center"
    >
        <TextField id="topic" label="Topic" variant="outlined" onChange={handleOnChange} size="small"/>
        <TextField id="payload" label="Payload" variant="outlined" onChange={handleOnChange} size="small"/>
        <Button variant="outlined" onClick={handleOnClick}>Enviar</Button>
        </Grid>
    )
}

export default PublishComponent