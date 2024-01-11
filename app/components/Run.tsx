import React, { useEffect, useState } from "react";
import {
  assistantAtom,
  messagesAtom,
  runAtom,
  runStateAtom,
  threadAtom,
} from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { toast } from "react-toastify";
import Image from "next/image";

const Runs = () => {
  // Atom State
  const [thread] = useAtom(threadAtom);
  const [run, setRun] = useAtom(runAtom);
  const [, setMessages] = useAtom(messagesAtom);
  const [assistant] = useAtom(assistantAtom);
  const [runState, setRunState] = useAtom(runStateAtom);

  // Custom State
  const [creating, setCreating] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [pollingIntervalId, setPollingIntervalId] =
    useState<NodeJS.Timeout | null>(null);

  // ---------------------------Functions---------------->
  useEffect(() => {
    // Cleaning up polling on unmount
    return () => {
      if (pollingIntervalId) clearInterval(pollingIntervalId);
    };
  }, [pollingIntervalId]);

  // Start Polling
  const startPolling = (runId: string) => {
    if (!thread) return;
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get<{ run: Run }>(
          `/api/run/retrieve?threadId=${thread.id}&runId=${runId}`
        );

        const updatedRun = response.data.run;
        setRun(updatedRun);
        setRunState(updatedRun.status);

        if (
          ["cancelled", "failed", "completed", "expired"].includes(
            updatedRun.status
          )
        ) {
          clearInterval(intervalId);
          setPollingIntervalId(null);
          fetchMessages();
        }
      } catch (error) {
        console.log(error);
        console.error("Error polling run status:", error);
        clearInterval(intervalId);
        setPollingIntervalId(null);
      }
    }, 500);
    setPollingIntervalId(intervalId);
  };

  // Handle create
  const handleCreate = async () => {
    if (!thread || !assistant) return;
    setCreating(true);
    try {
      const response = await axios.get<{ run: Run }>(
        `/api/run/create?threadId=${thread.id}&assistantId=${assistant.id}`
      );

      const newRun = response.data.run;
      setRunState(newRun.status);
      setRun(newRun);
      toast.success("Run created", {
        position: "top-center",
        theme: "colored",
      });
      localStorage.setItem("run", JSON.stringify(newRun));

      // Start polling after creation
      startPolling(newRun.id);
    } catch (error) {
      console.log(error);
      toast.error("Error creating run", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle Cancel
  const handleCancel = async () => {
    if (!run || !thread) return;
    setCanceling(true);
    try {
      const response = await axios.get<{ run: Run }>(
        `/api/run/cancel?runId=${run.id}&threadId=${thread.id}`
      );

      const newRun = response.data.run;
      setRunState(newRun.status);
      setRun(newRun);
      toast.success("Run canceled", { position: "bottom-center" });
      localStorage.setItem("run", JSON.stringify(newRun));
    } catch (error) {
      console.log(error);
      toast.error("Error cancel run", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setCanceling(false);
    }
  };

  // Fetch Messages
  const fetchMessages = async () => {
    if (!thread) return;
    try {
      axios
        .get<{ messages: ThreadMessage[] }>(
          `/api/message/list?threadId=${thread.id}`
        )
        .then((response) => {
          let newMessages = response.data.messages;

          // Sort messages in descending order by createdAt
          newMessages = newMessages.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
          setMessages(newMessages);
        });
    } catch (error) {
      console.log(error);
      toast.error("Error fetching messages", {
        position: "top-center",
        theme: "colored",
      });
    }
  };
  return (
    <div className="w-full border border-zinc-100/35 py-3 px-2 rounded-md shadow-md">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Image
            src="/state.gif"
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full border-2 border-cyan-500"
            style={{ width: "2.7rem", height: "2.7rem", objectFit: "cover" }}
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Run</h2>
        </div>
        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            className={`btn ${
              creating || !assistant || !thread ? "pointer-events-none" : ""
            }`}
            onClick={handleCreate}
            disabled={creating || !assistant || !thread}
          >
            {creating ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              "Create"
            )}
          </button>

          {/* 2 */}
          <button
            className={`btn ${
              ["N/A"].includes(runState) || !run ? "pointer-events-none" : ""
            }`}
            onClick={handleCancel}
            disabled={["N/A"].includes(runState) || !run}
          >
            {canceling ? (
              <span className="animate-pulse">Canceling...</span>
            ) : (
              "Cancel"
            )}
          </button>
          {/* ---- */}
        </div>
      </div>
    </div>
  );
};

export default Runs;
