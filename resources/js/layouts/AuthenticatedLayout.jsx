import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatWidget from "../widgets/ChatWidget";
import AppPollers from "../pollers/AppPollers";

const TestMessageHistoryLongPolling = React.lazy(() => import('../components/TestMessageHistoryLongPolling'));

export default function(){
  return <React.Fragment>
    <AppPollers />
    <Routes>
      <Route path="/test/message/long-polling/:conversationHash" element={<TestMessageHistoryLongPolling />} />
      <Route path="*" element={<ChatWidget />} />
    </Routes>
  </React.Fragment>
}