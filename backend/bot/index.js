const { Telegraf } = require("telegraf");
const axios = require("axios");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { getUser, addUser, removeUser, getUsers } = require("./commands");
const db = require("../config/db");
const Settings = require("../models/settings");
const express = require("express");
const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const { setServers } = require("dns");
const settings = require("../models/settings");
dotenv.config();
let WEATHER_API_KEY = "";
const timeZone = "Asia/Kolkata";
async function setupServer() {
  await db.connect();
  bot.launch();

  const settings = await Settings.findOne({ key: "WEATHER_API_KEY" });
  WEATHER_API_KEY = settings.value;
  setInterval(async () => {
    const settings = await Settings.findOne({ key: "WEATHER_API_KEY" });
    WEATHER_API_KEY = settings.value;
  }, 600000);
}

const app = express();

//initializing bot

const bot = new Telegraf(process.env.BOT_TOKEN);

// Commands
bot.start((ctx) => {
  ctx.reply(
    `🌟 Welcome to the Weather Bot! 🌟

Here’s what I can do for you:  

1. **Subscribe to Daily Updates**  
   Receive daily weather updates at **9:00 AM** for your chosen city.  
   🔹 Command: \`/subscribe <city_name>\`  
   Example: \`/subscribe Lucknow\`  

2. **Unsubscribe from Updates**  
   Stop receiving daily weather updates.  
   🔹 Command: \`/unsubscribe\`  

3. **Get Instant Weather Updates**  
   Get the latest weather details for your subscribed city anytime!  
   🔹 Command: \`/getweather\`  

To get started, use **/subscribe <city>** to set up your daily weather updates. 🌤

😎 Made by Aman Lalwani😎 
`,
    { parse_mode: "Markdown" }
  );
});
bot.command("subscribe", (ctx) => {
  addUser(ctx);
});
bot.command("unsubscribe", (ctx) => {
  removeUser(ctx);
});
bot.command("getweather", (ctx) => {
  sendWeatherUpdate(ctx);
});

async function sendWeatherUpdate(ctx) {
  const user = await getUser(ctx);

  if (user) {
    try {
      if (user.blocked) {
        ctx.reply("Sorry!You have been blocked by the admin.");
      } else {
        const weather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=${WEATHER_API_KEY}`
        );
        const sunriseTime = format(
          toZonedTime(new Date(weather.data.sys.sunrise * 1000), timeZone),
          "hh:mm a"
        );
        const sunsetTime = format(
          toZonedTime(new Date(weather.data.sys.sunset * 1000), timeZone),
          "hh:mm a"
        );
        bot.telegram.sendMessage(
          user.chatId,
          `         
          🌤 *Weather Update for ${user.city}* 🌤
          
          *Current Condition:* ${weather.data.weather[0].description} 🌫
          *Temperature:* ${(weather.data.main.temp - 273.15).toFixed(
            1
          )}°C (Feels like ${(weather.data.main.feels_like - 273.15).toFixed(
            1
          )}°C)
          *Humidity:* ${weather.data.main.humidity}%
          *Pressure:* ${weather.data.main.pressure} hPa
          *Visibility:* ${(weather.data.visibility / 1000).toFixed(1)} km
          *Wind:* ${weather.data.wind.speed} m/s from ${weather.data.wind.deg}°
        
          ☀️ *Sunrise:* ${sunriseTime}  
         🌇 *Sunset:* ${sunsetTime}
        
        Stay safe and have a great day! 🌞
        Made By Aman Lalwani`,
          { parse_mode: "Markdown" }
        );
      }
    } catch (err) {
      console.log(err);
      
      if (err.response?.status == 404) {
        bot.telegram.sendMessage(
          user.chatId,
          "Please subscribe to valid city to receive regular updates."
        );
      } else if (err.response?.status == 401) {
        ctx.reply("Something went wrong!");
        console.log("Invalid Weather API key.");
      }
      else{
        console.log(err);
        
      }
    }
  } else {
    ctx.reply(
      "To get weather updates please first subscribe using /subscribe <city> command."
    );
  }
}

// Scheduler for sending everyday weather updates
cron.schedule("0 9 * * *", async () => {
  const users = await getUsers();
  users.forEach(async (user) => {
    try {
      if (!user.blocked) {
        const weather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=${WEATHER_API_KEY}`
        );
        const sunriseTime = format(
          toZonedTime(new Date(weather.data.sys.sunrise * 1000), timeZone),
          "hh:mm a"
        );
        const sunsetTime = format(
          toZonedTime(new Date(weather.data.sys.sunset * 1000), timeZone),
          "hh:mm a"
        );
        bot.telegram.sendMessage(
          user.chatId,
          `         
            🌤 *Weather Update for ${user.city}* 🌤
            
            *Current Condition:* ${weather.data.weather[0].description} 🌫
            *Temperature:* ${(weather.data.main.temp - 273.15).toFixed(
              1
            )}°C (Feels like ${(weather.data.main.feels_like - 273.15).toFixed(
            1
          )}°C)
            *Humidity:* ${weather.data.main.humidity}%
            *Pressure:* ${weather.data.main.pressure} hPa
            *Visibility:* ${(weather.data.visibility / 1000).toFixed(1)} km
            *Wind:* ${weather.data.wind.speed} m/s from ${
            weather.data.wind.deg
          }°
          
            ☀️ *Sunrise:* ${sunriseTime}  
           🌇 *Sunset:* ${sunsetTime}
          
          Stay safe and have a great day! 🌞
          Made By Aman Lalwani`,
          { parse_mode: "Markdown" }
        );
      }
    } catch (err) {
      console.log(err);
      
      if (err.response?.status == 404) {
        bot.telegram.sendMessage(
          user.chatId,
          "Please subscribe to valid city to receive regular updates."
        );
      } else if (err.response?.status == 401) {
        ctx.reply("Something went wrong!");
        console.log("Invalid Weather API key.");
      }
      else{
        console.log(err);
        
      }
    }
  });
});

app.listen(8000, () => {
  setupServer().then(() => {
    console.log("Bot is running!");
  });
});

module.exports = { bot };
