import { Route, Routes } from "react-router-dom";
import ChatWidget from "../widgets/ChatWidget";
import TestMessageHistoryLongPolling from "../components/TestMessageHistoryLongPolling";

export default function(){
  return <Routes>
    <Route path="/test/message/long-polling/:conversationHash" element={<TestMessageHistoryLongPolling />} />
    <Route path="*" element={<ChatWidget />} />
  </Routes>
}