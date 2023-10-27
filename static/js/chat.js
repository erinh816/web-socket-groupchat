"use strict";

/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);

const name = prompt("Username? (no spaces)");


/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = async function (evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else if (msg.type === "chat" && msg.text !== '/joke' && msg.text !== '/members') {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  } else if (msg.text === '/joke') {
    //item = $(`<li>this is joke</li>`);
    const joke = getRandomJoke(jokes);
    item = $(`<li>${joke}</li>`);
  }
  else if (msg.text === '/members') {
    //item = $(`<li>this is memberske</li>`);
    const members = Room.members(msg.name);
    item = $(`<li>${members}</li>`);

  }
  else {
    return console.error(`bad message: ${msg}`);
  }

  $("#messages").append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$("form").submit(function (evt) {
  evt.preventDefault();

  let data = { type: "chat", text: $("#m").val() };
  ws.send(JSON.stringify(data));

  $("#m").val("");
});


const jokes = [
  'Why do bees have sticky hair? Because they use honey combs!',
  'How does the moon cut his hair? Eclipse it.',
  "I used to work in a shoe recycling shop. It was sole destroying.",
  'which flower is most fierce? Dandelion',
  'What do vegetarian zombies eat? Grrrrrainnnnnssss.',
  "What do you call someone with no nose? Nobody knows.",
  'Camping is intense.'
];

function getRandomJoke(jokes) {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}
