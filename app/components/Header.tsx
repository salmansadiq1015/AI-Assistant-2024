"use client";

import {
  assistantAtom,
  fileAtom,
  assistantFileAtom,
  threadAtom,
  runAtom,
  runStateAtom,
} from "@/atom";
import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";

export default function Header() {
  const [assistant] = useAtom(assistantAtom);
  const [file] = useAtom(fileAtom);
  const [assistantFile] = useAtom(assistantFileAtom);
  const [thread] = useAtom(threadAtom);
  const [run] = useAtom(runAtom);
  const [runState] = useAtom(runStateAtom);
  return (
    <div className="sticky top-0 left-0 w-full h-[5rem] py-1  flex items-center justify-between bg-black border-b border-zinc-200 shadow-lg px-4">
      <div className=" flex items-center gap-2">
        <Image
          src="/logo1.jpeg"
          alt="Logo"
          width={45}
          height={45}
          className="rounded-full border-2 border-fuchsia-600"
        />
        <h1
          className=" text-white font-bold text-xl  sm:text-2xl hidden sm:flex"
          style={{ textShadow: "-1px 1px 0px #ccc" }}
        >
          Assis<span className="text-purple-500">tant.ai</span>
        </h1>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div
          className={` hidden sm:flex  flex-col  gap-2 w-[8.5rem]  ${
            assistant?.id ? "bg-green-500 " : "bg-fuchsia-500 "
          } rounded-md shadow-md hover:shadow-2xl cursor-pointer active:shadow-md transition duration-200 border border-cyan-500 py-1 px-2 hover:shadow-cyan-500`}
        >
          <div className="flex gap-1 items-center">
            <Image
              src="/logo1.jpeg"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full border-2 border-fuchsia-600"
              style={{ width: "2.2rem", height: "2.2rem", objectFit: "cover" }}
            />
            <h3 className="text-white font-semibold text-[13px] w-full">
              Assistant
            </h3>
          </div>
          <span
            className={`text-white font-semibold text-xs ml-1 text-center rounded-md  py-1 px-2 ${
              assistant?.id && "bg-cyan-500 shadow-md"
            }`}
          >
            {assistant?.id.slice(0, 10)}
            {assistant?.id && "..."}
          </span>
        </div>
        {/* 2 */}
        <div
          className={` hidden md:flex  flex-col  gap-2 w-[8.5rem]  ${
            file ? "bg-blue-600 " : "bg-fuchsia-500 "
          } rounded-md shadow-md hover:shadow-2xl cursor-pointer active:shadow-md transition duration-200 border border-cyan-500 py-1 px-2 hover:shadow-cyan-500`}
        >
          <div className="flex gap-1 items-center">
            <Image
              src="/file.jpeg"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full border-2 border-white"
              style={{ width: "2.2rem", height: "2.2rem", objectFit: "cover" }}
            />
            <h3 className="text-white font-semibold text-[13px] w-full">
              File
            </h3>
          </div>
          <span
            className={`text-white font-semibold text-xs ml-1  overflow-x-auto text-center rounded-md  py-1 px-2 ${
              file && "bg-cyan-500 shadow-md h-[1.5rem] "
            }`}
          >
            {file?.slice(0, 10)}
            {file && "..."}
          </span>
        </div>
        {/* 3 */}
        <div
          className={` hidden lg:flex  flex-col  gap-2 w-[8.5rem]  ${
            assistantFile ? "bg-pink-600 " : "bg-fuchsia-500 "
          } rounded-md shadow-md hover:shadow-2xl cursor-pointer active:shadow-md transition duration-200 border border-cyan-500 py-1 px-2 hover:shadow-cyan-500`}
        >
          <div className="flex gap-1 items-center">
            <Image
              src="/assis file.webp"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full border-2 border-fuchsia-600"
              style={{ width: "2.2rem", height: "2.2rem", objectFit: "cover" }}
            />
            <h3 className="text-white font-semibold text-[12px] w-full">
              Assistant File
            </h3>
          </div>
          <span
            className={`text-white font-semibold text-xs ml-1 text-center rounded-md  py-1 px-2 ${
              assistantFile && "bg-cyan-500 shadow-md"
            }`}
          >
            {assistantFile?.slice(0, 10)}
            {assistantFile && "..."}
          </span>
        </div>
        {/* 4 */}
        <div
          className={` hidden lg:flex  flex-col  gap-2 w-[8.5rem]  ${
            thread?.id ? "bg-cyan-600 " : "bg-fuchsia-500 "
          } rounded-md shadow-md hover:shadow-2xl cursor-pointer active:shadow-md transition duration-200 border border-cyan-500 py-1 px-2 hover:shadow-cyan-500`}
        >
          <div className="flex gap-1 items-center">
            <Image
              src="/a1.jpeg"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full border-2 border-fuchsia-600"
              style={{ width: "2.2rem", height: "2.2rem", objectFit: "cover" }}
            />
            <h3 className="text-white font-semibold text-[13px] w-full">
              Thread
            </h3>
          </div>
          <span
            className={`text-white font-semibold text-xs ml-1 text-center rounded-md  py-1 px-2 ${
              thread?.id && "bg-cyan-500 shadow-md"
            }`}
          >
            {thread?.id.slice(0, 10)} {thread?.id && "..."}
          </span>
        </div>
        {/* 5 */}
        <div
          className={` hidden xl:flex  flex-col  gap-2 w-[8.5rem]  ${
            run?.id ? "bg-orange-600 " : "bg-fuchsia-500 "
          } rounded-md shadow-md hover:shadow-2xl cursor-pointer active:shadow-md transition duration-200 border border-cyan-500 py-1 px-2 hover:shadow-cyan-500`}
        >
          <div className="flex gap-1 items-center">
            <Image
              src="/run.png"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full border-2 border-cyan-500"
              style={{ width: "2.2rem", height: "2.2rem", objectFit: "cover" }}
            />
            <h3 className="text-white font-semibold text-[13px] w-full">Run</h3>
          </div>
          <span
            className={`text-white font-semibold text-xs ml-1 text-center rounded-md  py-1 px-2 ${
              run?.id && "bg-cyan-500 shadow-md"
            }`}
          >
            {run?.id.slice(0, 13)}
            {run?.id && "..."}
          </span>
        </div>
        {/* 6 */}
        <div
          className={`flex  flex-col  gap-2 w-[8.5rem]  ${
            runState !== "N/A" ? "bg-purple-600 " : "bg-fuchsia-500 "
          } rounded-md shadow-md hover:shadow-2xl cursor-pointer active:shadow-md transition duration-200 border border-cyan-500 py-1 px-2 hover:shadow-cyan-500`}
        >
          <div className="flex gap-1 items-center">
            {runState !== "N/A" && runState !== "completed" ? (
              <Image
                src="/state.gif"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full border-2 border-fuchsia-600 "
                style={{
                  width: "2.2rem",
                  height: "2.2rem",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Image
                src="/state1.gif"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full border-2 border-fuchsia-600 "
                style={{
                  width: "2.2rem",
                  height: "2.2rem",
                  objectFit: "cover",
                }}
              />
            )}
            <h3 className="text-white font-semibold text-[13px] w-full">
              Run State
            </h3>
          </div>
          <span
            className={`text-white font-semibold text-xs ml-1 text-center rounded-md  py-1 px-2 ${
              runState && "bg-cyan-500 shadow-md"
            }`}
          >
            {runState}
          </span>
        </div>
      </div>
    </div>
  );
}
