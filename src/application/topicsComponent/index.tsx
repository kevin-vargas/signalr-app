import { Button, Grid, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { usePublish, useTopics } from '../../utils/signalr'

const TopicsComponent = () => {
    const { topics } = useTopics()
    const [selectedTopics, setSelectedTopics ] = useState<string[]>([])
    const handleTopicSelection = (event: React.MouseEvent<HTMLElement, MouseEvent>, selected: string[]) => {
        setSelectedTopics(() => selected)
    }
    useEffect(() => {
        setSelectedTopics(prev => prev.filter(elem => topics.includes(elem)))
    }, [topics])

    return (
        <ToggleButtonGroup
        value={selectedTopics}
        color="primary"
        onChange={handleTopicSelection}
      >
          {topics.map((topic) => <ToggleButton value={topic}>{topic}</ToggleButton>)}
      </ToggleButtonGroup>
    )
}

export default TopicsComponent
