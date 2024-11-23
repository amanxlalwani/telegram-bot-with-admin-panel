const { Telegraf } = require("telegraf");
const axios = require("axios");
const cron = require("node-cron");
const dotenv = require("dotenv");
const {getUser, addUser, removeUser, getUsers } = require("./commands");
const db = require("../config/db");
const Settings = require('../models/settings');
const express = require('express');

const { setServers } = require("dns");
const settings = require("../models/settings");
dotenv.config();
let WEATHER_API_KEY="";
async function setupServer(){
await db.connect();
bot.launch();

const app = express();
const settings=await Settings.findOne({key:"WEATHER_API_KEY"});
WEATHER_API_KEY=settings.value;
setInterval(async ()=>{
  const settings=await Settings.findOne({key:"WEATHER_API_KEY"});
  WEATHER_API_KEY=settings.value;
},600000)
}




//initializing bot

const bot = new Telegraf(process.env.BOT_TOKEN);


// Commands
bot.start((ctx) =>
  ctx.reply("Welcome! Use /subscribe <city> to get weather updates.")
);
bot.command("subscribe", (ctx) => {addUser(ctx) });
bot.command("unsubscribe", (ctx) => {removeUser(ctx)});
bot.command("getweather", (ctx) => {
  sendWeatherUpdate(ctx);
});

async function sendWeatherUpdate(ctx) {
  const user = await getUser(ctx);
  console.log(user);
  if(user){
    try{
    if(user.blocked){
      ctx.reply("Sorry!You have been blocked by the admin.")
    }
    else{
      const weather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=${WEATHER_API_KEY}`
      );
      console.log(weather);

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
        
          ☀️ *Sunrise:* ${new Date(
            weather.data.sys.sunrise * 1000
          ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}  
         🌇 *Sunset:* ${new Date(
           weather.data.sys.sunset * 1000
         ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        
        Stay safe and have a great day! 🌞
        Made By Aman Lalwani`,
        { parse_mode: "Markdown" }
      ); 
    } 
    }
    catch(err){ if(err.response.status == 404){ctx.reply("Please subscribe to valid city.")} 
    else if(err.response.status == 401){ctx.reply("Something went wrong!"); console.log("Invalid Weather API key.");
    }
  }
  }
  else{
     ctx.reply("To get weather updates please first subscribe using /subscribe <city> command.")
  }
}



// Scheduler for sending everyday weather updates
cron.schedule("13 17 * * *", async () => {
  const users = await getUsers();
  users.forEach(async (user) => {
    try{
      if(!user.blocked){
        const weather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=${WEATHER_API_KEY}`
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
          
            ☀️ *Sunrise:* ${new Date(
              weather.data.sys.sunrise * 1000
            ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}  
           🌇 *Sunset:* ${new Date(
             weather.data.sys.sunset * 1000
           ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          
          Stay safe and have a great day! 🌞
          Made By Aman Lalwani`,
          { parse_mode: "Markdown" }
        ); 
      } 
      }
      catch(err){ if(err.response.status == 404){bot.telegram.sendMessage(user.chatId,"Please subscribe to valid city to receive regular updates.")} 
      else if(err.response.status == 401){ctx.reply("Something went wrong!"); console.log("Invalid Weather API key.");
      }
    }
  });
});





app.listen(8000, () => {
  setupServer().then(()=>{console.log("Bot is running!");});
});

module.exports={bot};