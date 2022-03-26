import { Button, Grid, TextField } from '@mui/material';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { usePublish, useSubscription } from '../../utils/signalr';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import internal from 'stream';

const getRandom = (maxValue: number) => () => Math.floor(Math.random() * maxValue)
type Entry = {
    x: number;
    y1: number;
    y2: number;
}
const topic = ["position"]
const GraphicComponent = () => {
    const [ data, setData] = useState<Entry[]>([])
    const { publish } = usePublish()
    const { result } = useSubscription(topic)
    const [positionX, setPositionX] = useState<number>(0)
    const getRandomY = getRandom(100)
    const handleOnClick = () => {
        setPositionX( prev => prev+1)
    }
    useEffect(() => {
        if(result){
            const {payload} = result
            const entry = payload as Entry
            console.log("ENTRY", entry)
            setData( prev => [...prev, entry])
        }
    }, [result])
    useEffect(() => {
        publish(topic[0], { x: positionX, y1: getRandomY(), y2: getRandomY()})
    },[positionX])

    return (
        <Grid
  container
  direction="row"
  justifyContent="center"
  alignItems="center"
    >
  <LineChart width={500} height={300} data={data}>
    <XAxis dataKey="x"/>
    <YAxis/>
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <Line type="monotone" dataKey="y1" stroke="#8884d8" />
    <Line type="monotone" dataKey="y2" stroke="#82ca9d" />
  </LineChart>
        <Button variant="outlined" onClick={handleOnClick}>Enviar</Button>
        </Grid>
    )
}

export default GraphicComponent