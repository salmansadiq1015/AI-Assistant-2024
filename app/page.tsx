"use client";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import Assistant from "./components/Assistant";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssistantFiles from "./components/AssistantFile";
import Threads from "./components/Thread";
import Runs from "./components/Run";
import { useAtom } from "jotai";
import {
  assistantAtom,
  fileAtom,
  runStateAtom,
  threadAtom,
  isValidRunState,
  assistantFileAtom,
  runAtom,
} from "@/atom";
import { useEffect } from "react";

export default function Home() {
  // Atom State
  const [, setAssistant] = useAtom(assistantAtom);
  const [, setFile] = useAtom(fileAtom);
  const [, setAssistantFile] = useAtom(assistantFileAtom);
  const [, setThread] = useAtom(threadAtom);
  const [, setRun] = useAtom(runAtom);
  const [, setRunState] = useAtom(runStateAtom);

  //  Set Local Storage
  // Load default data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localAssistant = localStorage.getItem("assistant");
      if (localAssistant) {
        setAssistant(JSON.parse(localAssistant));
      }
      const localFile = localStorage.getItem("file");
      if (localFile) {
        setFile(localFile);
      }
      const localAssistantFile = localStorage.getItem("assistantFile");
      if (localAssistantFile) {
        setAssistantFile(localAssistantFile);
      }
      const localThread = localStorage.getItem("thread");
      if (localThread) {
        setThread(JSON.parse(localThread));
      }
      const localRun = localStorage.getItem("run");
      if (localRun) {
        setRun(JSON.parse(localRun));
      }
      const localRunState = localStorage.getItem("runState");
      if (localRunState && isValidRunState(localRunState)) {
        setRunState(localRunState);
      }
    }
    // eslint-disable-next-line
  }, []);
  return (
    <main className="w-full min-h-screen bg-gray-900 text bg flex flex-col gap-2 pb-4 ">
      <Header />
      <div className="flex flex-wrap items-center gap-4 px-2">
        <div className="w-full md:w-[27%] min-w-[10%] h-[calc(100vh-5.5rem)] flex flex-col gap-6  text-white py-6 px-2 sm:px-4 bg-zinc-950/30 border border-zinc-200 rounded-md shadow-lg overflow-y-scroll overflow-hidden">
          <Assistant />
          <AssistantFiles />
          <Threads />
          <Runs />
        </div>
        <div className="w-full md:w-[70%] min-w-[40%] h-[calc(100vh-5.5rem)] text-white p-2 bg-zinc-950/40 border border-zinc-200 rounded-md shadow-lg ">
          <ChatContainer />
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
