"use client";
import React, { useState } from "react";
import { assistantAtom, fileAtom, messagesAtom } from "@/atom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAtom } from "jotai";
import { Assistant } from "openai/resources/beta/assistants/assistants.mjs";
import Image from "next/image";

export default function Assistant() {
  // Atom State
  const [assistant, setAssistant] = useAtom(assistantAtom);
  const [, setMessages] = useAtom(messagesAtom);
  const [file] = useAtom(fileAtom);

  // Local State
  const [creating, setCreating] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [listing, setListing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle Create
  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await axios.get<{ assistant: Assistant }>(
        "api/assistant/create"
      );

      const newAssistant = response.data.assistant;
      console.log("newAssistant", newAssistant);
      setAssistant(newAssistant);
      localStorage.setItem("assistant", JSON.stringify(newAssistant));
      toast.success("Successfully created assistant", {
        position: "top-center",
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error creating assistant", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setCreating(false);
    }
  };
  // Handle Modify
  const handleModify = async () => {
    setModifying(true);
    try {
      const response = await axios.get<{ assistant: Assistant }>(
        `/api/assistant/modify?assistantId=${assistant?.id}&fileId=${file}`
      );
      const newAssistant = response.data.assistant;
      setAssistant(newAssistant);
      localStorage.setItem("assistant", JSON.stringify(newAssistant));
      if (response?.data?.assistant) {
        toast.success("Assistant modified successfully!", {
          theme: "dark",
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error modify assistant", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setModifying(false);
    }
  };
  // Handle Listing
  const handleList = async () => {
    setListing(true);
    try {
      const response = await axios.get<{ assistants: Assistant[] }>(
        "/api/assistant/list"
      );
      const assistants = response?.data?.assistants;
      console.log("Assistants List:", assistants);
      toast.success(
        `Assistants:\n${assistants.map((a) => `${a.name + "\n"}`)} `, //`${a.name + "\n"}`
        {
          position: "top-center",
          theme: "colored",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Error list assistant", {
        position: "top-center",
        theme: "dark",
      });
    } finally {
      setListing(false);
    }
  };
  // Handle delete
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const data = localStorage.getItem("assistant");
      if (data !== null) {
        const parsedData = JSON.parse(data);
        console.log("id:", parsedData.id);

        await axios.get(
          `/api/assistant/delete?assistantId=${assistant?.id || parsedData.id}`
        );
        setAssistant(null);
        localStorage.removeItem("assistant");
        toast.success("Assistant delete successfully!", {
          position: "bottom-center",
          theme: "colored",
        });
        setMessages([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error delete assistant", {
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
            src="/logo1.jpeg"
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full border-2 border-cyan-500"
            style={{ width: "2.7rem", height: "2.7rem", objectFit: "cover" }}
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Assistant
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
          {/* 2 */}
          <button className="btn" onClick={handleModify}>
            {modifying ? (
              <span className="animate-pulse">Modifying...</span>
            ) : (
              "Modify"
            )}
          </button>

          {/* 3 */}
          <button className="btn" onClick={handleList}>
            {listing ? (
              <span className="animate-pulse">Listing...</span>
            ) : (
              "List"
            )}
          </button>

          {/* 4 */}
          <button className="btn" onClick={handleDelete}>
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
}
