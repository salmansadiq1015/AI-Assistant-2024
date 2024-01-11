"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { assistantAtom, assistantFileAtom, fileAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import { FileObject } from "openai/resources/files.mjs";
import {
  AssistantFilesPage,
  AssistantFile,
} from "openai/resources/beta/assistants/files.mjs";
import { toast } from "react-toastify";
import Image from "next/image";

const AssistantFiles = () => {
  // Atom State
  const [assistant] = useAtom(assistantAtom);
  const [file, setFile] = useAtom(fileAtom);
  const [assistantFile, setAssistantFile] = useAtom(assistantFileAtom);

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // States
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [listing, setListing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // <-----------------------Finctions------------------------>
  // Handle file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleUpload(file);
    } else {
      toast.error("No File Selected", {
        position: "top-center",
        theme: "colored",
      });
    }
  };
  // Upload File
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("file", file);

      // Send Form data in backend
      const response = await axios.post<{ file: FileObject }>(
        "/api/file/upload",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadFile = response.data.file;
      console.log("Upload File Response", uploadFile);
      toast.success("File Uploaded Successfully", {
        position: "top-center",
        theme: "colored",
      });
      setFile(uploadFile?.id);
      localStorage.setItem("file", uploadFile?.id);
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading File", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setUploading(false);
    }
  };
  // Handle Create
  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await axios.get<{ assistantFile: AssistantFile }>(
        `/api/assistant-file/create?assistantId=${assistant?.id}&fileId=${file}`
      );
      const assistantFile = response.data.assistantFile;
      console.log("Assistant file", assistantFile);

      toast.success("Assistant file created successfully!", {
        theme: "colored",
        position: "top-center",
      });
      setAssistantFile(assistantFile?.id);
      localStorage.setItem("assistantFile", assistantFile?.id);
    } catch (error) {
      console.log(error);
      toast.error("Error create file", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle List
  const handleList = async () => {
    if (!assistant) {
      toast.error("No assistant found!", {
        theme: "colored",
        position: "top-center",
      });
      throw new Error("No assistant found");
    }
    setListing(true);
    try {
      const response = await axios.get<{
        assistantFiles: AssistantFilesPage;
      }>(`/api/assistant-file/list?assistantId=${assistant.id}`);

      const fetchedAssistantFiles = response.data.assistantFiles;
      console.log("Assistant Files:", fetchedAssistantFiles);

      toast.success(
        `Assistant Files:\n${fetchedAssistantFiles.data.map(
          (af) => `${af.id + "\n"}`
        )} `,
        {
          position: "top-center",
          theme: "colored",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Error list file", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setListing(false);
    }
  };
  // Handle Delete
  const handleDelete = async () => {
    if (!assistant || !assistantFile) {
      throw new Error("No assistant");
    }
    setDeleting(true);
    try {
      await axios.get<{}>(
        `/api/assistant-file/delete?assistantId=${assistant?.id}&fileId=${file}`
      );

      toast.success("Assistant file deleted successfully!", {
        theme: "colored",
        position: "top-center",
      });

      setAssistantFile("");
      localStorage.removeItem("assistantFile");
    } catch (error) {
      console.log(error);
      toast.error("Error delete file", {
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
            src="/file.jpeg"
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full border-2 border-cyan-500"
            style={{ width: "2.7rem", height: "2.7rem", objectFit: "cover" }}
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            File Assistant
          </h2>
        </div>
        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <div className="">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              className="btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : (
                "Upload"
              )}
            </button>
          </div>
          {/* 2 */}
          <button
            className={`btn ${
              !assistant || !file ? "pointer-events-none" : ""
            } `}
            onClick={handleCreate}
            disabled={!assistant || !file}
          >
            {creating ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              "Create"
            )}
          </button>

          {/* 3 */}
          <button
            className={`btn ${!assistant ? "pointer-events-none" : ""} `}
            onClick={handleList}
            disabled={!assistant}
          >
            {listing ? (
              <span className="animate-pulse">Listing...</span>
            ) : (
              "List"
            )}
          </button>

          {/* 4 */}
          <button
            className={`btn ${
              !assistant || !assistantFile ? "pointer-events-none" : ""
            } `}
            onClick={handleDelete}
            disabled={!assistant || !assistantFile}
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

export default AssistantFiles;
