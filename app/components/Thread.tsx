import Image from "next/image";
import React, { useState } from "react";
import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { toast } from "react-toastify";

const Threads = () => {
  // Atom State
  const [thread, setThread] = useAtom(threadAtom);
  const [, setMessages] = useAtom(messagesAtom);
  // States
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ---------------------------Functions---------------->
  // Handle Create
  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await axios.get<{ thread: Thread }>(
        "/api/thread/create"
      );
      const newThread = response.data.thread;
      toast.success("Thread created!", {
        position: "top-center",
        theme: "colored",
      });
      setThread(newThread);
      localStorage.setItem("thread", JSON.stringify(newThread));
    } catch (error) {
      console.log(error);
      toast.error("Error creating thread", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await axios.get<{ thread: Thread }>(
        `/api/thread/delete?threadId=${thread?.id}`
      );

      const deletedThread = response.data.thread;
      console.log("response", deletedThread);
      setThread(null);
      localStorage.removeItem("thread");
      setMessages([]);
      toast.success("Thread deleted successfully!", {
        position: "top-center",
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error creating thread", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="w-full border border-zinc-100/35 py-3 px-2 rounded-md shadow-md">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Image
            src="/a1.jpeg"
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full border-2 border-cyan-500"
            style={{ width: "2.7rem", height: "2.7rem", objectFit: "cover" }}
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Thread
          </h2>
        </div>
        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="btn" onClick={handleCreate}>
            {creating ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              "Create"
            )}
          </button>

          {/* 4 */}
          <button
            className={`btn ${!thread ? "pointer-events-none" : ""}`}
            onClick={handleDelete}
            disabled={!thread}
          >
            {deleting ? (
              <span className="animate-pulse">Deleting...</span>
            ) : (
              "Delete"
            )}
          </button>
          {/* ---- */}
        </div>
      </div>
    </div>
  );
};

export default Threads;
