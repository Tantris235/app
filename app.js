const composer = document.querySelector("#composer");
const messageInput = document.querySelector("#messageInput");
const chatBody = document.querySelector("#chatBody");
const chatItems = document.querySelectorAll(".chat-list__item");
const onlineCount = document.querySelector("#onlineCount");
const connectionStatus = document.querySelector("#connectionStatus");
const chatStatus = document.querySelector("#chatStatus");

const chats = [
  {
    name: "Ala Kowalska",
    status: "aktywny(-a) 3 min temu",
  },
  {
    name: "Krzysiek D.",
    status: "aktywny(-a) 10 min temu",
  },
  {
    name: "Zespół Apki",
    status: "aktywny(-a) 1 h temu",
  },
];

const headerTitle = document.querySelector(".chat__header h2");
const headerStatus = document.querySelector(".chat__header p");

const clientId =
  localStorage.getItem("clientId") ?? crypto.randomUUID();

localStorage.setItem("clientId", clientId);

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const scrollToBottom = () => {
  chatBody.scrollTop = chatBody.scrollHeight;
};

const createBubble = (text, isOutgoing, timestamp) => {
  const bubble = document.createElement("div");
  bubble.classList.add(
    "bubble",
    isOutgoing ? "bubble--outgoing" : "bubble--incoming",
  );

  const content = document.createElement("p");
  content.textContent = text;

  const meta = document.createElement("span");
  meta.textContent = `${timestamp ?? formatTime()} ${isOutgoing ? "✓" : ""}`.trim();

  bubble.append(content, meta);
  return bubble;
};

const appendMessage = ({ text, senderId, time }) => {
  const isOutgoing = senderId === clientId;
  const bubble = createBubble(text, isOutgoing, time);
  chatBody.appendChild(bubble);
  scrollToBottom();
};

const setConnectionState = (isOnline) => {
  connectionStatus.textContent = isOnline ? "online" : "offline";
  connectionStatus.classList.toggle("is-online", isOnline);
};

let socket;

const connect = () => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  socket = new WebSocket(`${protocol}://${window.location.host}`);

  socket.addEventListener("open", () => {
    setConnectionState(true);
  });

  socket.addEventListener("close", () => {
    setConnectionState(false);
    chatStatus.textContent = "rozłączono - ponawiam...";
    setTimeout(connect, 2000);
  });

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);

    if (payload.type === "presence") {
      onlineCount.textContent = payload.count;
      chatStatus.textContent = `aktywny(-a) teraz (${payload.count} online)`;
      return;
    }

    if (payload.type === "message") {
      appendMessage(payload.data);
    }
  });
};

connect();

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "message",
        data: {
          text: message,
          senderId: clientId,
          time: formatTime(),
        },
      }),
    );
  } else {
    appendMessage({ text: message, senderId: clientId, time: formatTime() });
  }
  messageInput.value = "";
});

chatItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    chatItems.forEach((button) => button.classList.remove("is-active"));
    item.classList.add("is-active");
    headerTitle.textContent = chats[index].name;
    headerStatus.textContent = chats[index].status;
    chatBody.scrollTop = 0;
  });
});

scrollToBottom();
