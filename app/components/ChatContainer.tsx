import React, { useEffect, useState } from "react";
import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import Image from "next/image";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import Markdown from "react-markdown";
import { toast } from "react-toastify";
import { IoSend } from "react-icons/io5";
import remarkGfm from "remark-gfm";

const ChatContainer = () => {
  // Atom State
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);

  // Custom State
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(false);

  // UseEffect
  useEffect(() => {
    const fetchMessages = async () => {
      if (!thread) return;
      setFetching(true);
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
      } finally {
        setFetching(false);
      }
    };
    fetchMessages();
    // eslint-disable-next-line
  }, [thread]);

  //Send Messages
  const sendMessage = async () => {
    if (!thread) return;
    setSending(true);
    try {
      const response = await axios.post<{ message: ThreadMessage }>(
        `/api/message/create?threadId=${thread.id}&message=${message}`,
        { message: message, threadId: thread.id }
      );
      const newMessage = response.data.message;
      console.log("newMessage", newMessage);
      setMessages([...messages, newMessage]);
      setMessage("");
      // toast.success("Successfully sent message", {
      //   position: "bottom-center",
      // });
    } catch (error) {
      console.log(error);
      toast.error("Error sending message", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setSending(false);
    }
  };

  // AutoScroll
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex flex-col gap-2 w-full h-full  rounded-md shadow-md ">
      <div
        id="message-container"
        className="w-full h-[88%] border-2 border-zinc-200/35 rounded-md px-3 py-5 overflow-y-auto"
      >
        {fetching && (
          <div className="m-auto font-semibold text-lg">Fetching messages.</div>
        )}
        {!fetching && messages.length === 0 && (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
            <Image
              src="/empty.png"
              alt="Empty"
              height={80}
              width={80}
              className="w-[10rem] h-[10rem] sm:h-[14rem] sm:w-[14rem]"
            />
            <h3 className="text-lg font-semibold text-white">
              No messages found for thread.
            </h3>
          </div>
        )}
        {messages.map((message) => (
          <>
            {message.role === "user" ? (
              <span className="text-right flex items-center justify-end">
                <Image
                  src="/user1.webp"
                  alt="You"
                  width={40}
                  height={40}
                  className="rounded-full border border-blue-500 bg-white"
                />
              </span>
            ) : (
              <Image
                src="/ChatbotF.png"
                alt="You"
                width={40}
                height={40}
                className="rounded-full border border-orange-700 bg-white "
                style={{ width: "40px", height: "40px" }}
              />
            )}

            {/* ----------Messages---------> */}
            <div
              key={message.id}
              className={`px-4 py-2 mb-3 rounded-2xl mt-1 shadow-md text-white w-fit text-sm ${
                message.role === "user"
                  ? " bg-blue-500 ml-auto text-right rounded-tr-none mr-3"
                  : " bg-gray-500 rounded-tl-none ml-3"
              }`}
            >
              <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                {message.content[0].type === "text"
                  ? message.content[0].text.value
                  : null}
              </Markdown>
            </div>
          </>
        ))}
      </div>
      <div className="w-full flex items-center gap-1 h-[10%] border-2 border-zinc-200/35 rounded-md p-[.3rem] bg-zinc-500/10">
        <input
          type="text"
          placeholder="Message Assistant..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-[94%] border-2 border-cyan-500 rounded-md outline-none py-1 px-3 h-full bg-transparent text-[1rem] "
        />
        <button
          disabled={!thread || sending || message === ""}
          className="btn w-[3.1rem] h-full flex items-center justify-center disabled:bg-pink-400 "
          style={{
            pointerEvents:
              !thread || sending || message === "" ? "none" : "auto",
          }}
          onClick={() => {
            sendMessage();
          }}
        >
          <IoSend size={25} color="white" className="" />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
