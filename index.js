import fs from "node:fs";

const corePropsPath = "C:/ProgramData/SteelSeries/SteelSeries Engine 3/coreProps.json";
const app = "GAMEDAC_TIME";
const displayName = "GameDAC Time";
const developer = "Entytaiment25";
const timeEvent = "TIME";
let gamesenseUrl = "";

const config = {
  use24HourFormat: false,
  showSeconds: true,
  showAmPm: true,
};

const readCoreProps = () => {
  try {
    const coreProps = JSON.parse(fs.readFileSync(corePropsPath, "utf-8"));
    return coreProps.address;
  } catch (error) {
    console.error("Error reading coreProps.json:", error);
    process.exit(1);
  }
};

const fetchJSON = async (url, method = "POST", body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error with fetch request to ${url}:`, error);
    throw error;
  }
};

const registerClock = async () => {
  const clockMetadata = {
    game: app,
    game_display_name: displayName,
    developer: developer,
    deinitialize_timer_length_ms: 60000,
  };

  try {
    await fetchJSON(`http://${gamesenseUrl}/game_metadata`, "POST", clockMetadata);
    console.log("Clock registered successfully.");
  } catch (error) {
    console.error("Error registering clock:", error);
  }
};

const bindEvents = async () => {
  const clockHandler = [
    {
      event: timeEvent,
      icon_id: 15,
      handlers: [
        {
          "device-type": "screened",
          mode: "screen",
          zone: "one",
          datas: [{ "icon-id": 15, "has-text": true, "length-millis": 1100 }],
        },
      ],
    },
  ];

  try {
    for (const handler of clockHandler) {
      await fetchJSON(`http://${gamesenseUrl}/bind_game_event`, "POST", {
        game: app,
        event: handler.event,
        handlers: handler.handlers,
      });
      console.log(`${handler.event} event bound successfully.`);
    }
  } catch (error) {
    console.error("Error binding events:", error);
  }
};

const formatTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let amPm = "";

  if (!config.use24HourFormat) {
    amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }

  const formattedTime = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    config.showSeconds ? seconds.toString().padStart(2, "0") : null,
  ]
    .filter(Boolean)
    .join(":");

  return config.showAmPm && amPm ? `${formattedTime} ${amPm}` : formattedTime;
};

const sendTime = async () => {
  const timeStr = formatTime(new Date());
  const eventData = {
    game: app,
    event: timeEvent,
    data: { value: timeStr },
  };

  try {
    await fetchJSON(`http://${gamesenseUrl}/game_event`, "POST", eventData);
  } catch (error) {
    console.error("Error sending time:", error);
  }
};

const setupClock = async () => {
  gamesenseUrl = readCoreProps();
  await registerClock();
  await bindEvents();

  setInterval(sendTime, 1000);
};

setupClock();
