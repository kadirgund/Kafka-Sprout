import React, { useState, useEffect } from 'react';
import TopicDisplay from './TopicDisplay';
import BrokerDisplay from './BrokerDisplay';
import { StartCluster } from './StartCluster';
import { RootDiv } from '../UIComponents/RootDiv';
import Loader from 'react-loader-spinner';
import constants from '../UIComponents/constants';
import MetricsDisplay from './MetricsDisplay';
import FlexContainer from "../UIComponents/FlexContainer";


const Main = props => {
  const [broker, setBroker] = useState(null);
  const [topic, setTopic] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const updateBrokerList = () => {
    fetch('/describeBrokers')
      .then(res => res.json())
      .then(res => {
        setBroker(res);
      })
      .catch(err => {
        console.log('Error in getting brokers', err);
      });
  };

  const updateTopicList = () => {
    fetch('/describeTopics')
      .then(res => res.json())
      .then(res => {
        setTopic(res);
      })
      .catch(err => {
        console.log('Error in getting topics', err);
      });
  };

  const updateList = async () => {
    const res = await fetch('/describeTopicsAndBrokers');
    if (!res.ok) {
      console.log('Error in loading data', res);
    }
    const data = await res.json();
    setTopic(data.Topics);
    setBroker(data.Brokers);
  };

  useEffect(() => {
    updateList().then(() => setIsLoaded(true));
  }, []);

  if (isLoaded) {
    if (props.status === 'false') {
      return (
        <RootDiv>
          <BrokerDisplay brokerData={broker} />
          <TopicDisplay topicData={topic} />
          <StartCluster />
        </RootDiv>
      );
    } else {
      return (
        <FlexContainer flexDirection='row'>
          <RootDiv>
            <MetricsDisplay />
          </RootDiv>
          <RootDiv>
            <BrokerDisplay
              brokerData={broker}
              updateBrokerList={updateBrokerList}
            />
            <TopicDisplay topicData={topic} updateTopicList={updateTopicList} />
          </RootDiv>
        </FlexContainer>
      );
    }
  } else {
    return (
      <RootDiv>
        <Loader
          type='Hearts'
          color={constants.LIGHTER_GREEN}
          height={80}
          width={80}
        />
      </RootDiv>
    );
  }
};

export default Main;
