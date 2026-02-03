const composer = document.querySelector("#composer");
const messageInput = document.querySelector("#messageInput");
const chatBody = document.querySelector("#chatBody");
const chatItems = document.querySelectorAll(".chat-list__item");

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

const createBubble = (text) => {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "bubble--outgoing");

  const content = document.createElement("p");
  content.textContent = text;

  const meta = document.createElement("span");
  meta.textContent = `${formatTime()} ✓`;

  bubble.append(content, meta);
  return bubble;
};

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  const bubble = createBubble(message);
  chatBody.appendChild(bubble);
  messageInput.value = "";
  scrollToBottom();
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
