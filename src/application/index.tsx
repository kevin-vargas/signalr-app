import { useTopics, BrokerProvider } from '../utils/signalr'
import PublishComponent from './publishComponent'
import SubscribeComponent from './subscribeComponent'
import TopicsComponent from './topicsComponent'
import { Stack } from '@mui/material';
import GraphicComponent from './graphicComponent';

const URL = 'http://fast.ar:8081/chat';

const App = () => {
 /*
  useEffect(() => {
    const HUB = SignalR.getInstance({ url: URL})
    const init = async () => {
      HUB.on('received',(result) => console.log(`FROM TOPIC ${result.topic} WITH CONTENT: ${result.payload}`))
      await HUB.start()
      await HUB.send({method: 'subscribe', topic: 'test'})
      await HUB.send({method: 'publish', topic: 'test', payload: {"asd" : "asd"}})
    }
    init()
  },[])
*/

  return (
    <>
    <BrokerProvider config={ {url: URL} }>
        <Stack spacing={2}>
          <h1>
              HOLA
          </h1>
          <TopicsComponent />
          <PublishComponent />
          <SubscribeComponent />
        </Stack>
        <h1>
            Charts
        </h1>
        <GraphicComponent />
    </BrokerProvider>

    </>
  )

}


export default App;
