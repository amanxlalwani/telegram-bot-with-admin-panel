const User = require('../models/user');

async function addUser(ctx) {
    try{
    const city = ctx.message.text.split(' ')[1];
    if (!city) {
        return ctx.reply('Please provide a city: /subscribe <city>');
    }

    const user = await User.findOne({ chatId: ctx.chat.id });
    if (user) {
        user.city = city;
        await user.save();
        return ctx.reply('Updated your subscription.');
    }

    await User.create({ chatId: ctx.chat.id, city });
    ctx.reply(`Subscribed to weather updates for ${city}.`);
}
catch(err){
    console.log(err);
    console.log("Something went wrong!");
    return ctx.reply("Something went wrong! Try again after sometime.");
  }
}

async function removeUser(ctx) {

    try{
    await User.deleteOne({ chatId: ctx.chat.id });
    ctx.reply('Unsubscribed from weather updates.');}
    catch(err){
        console.log(err);
        console.log("Something went wrong!");
        return ctx.reply("Something went wrong! Try again after sometime.");
      }
}

async function getUsers() {
    try{
    return await User.find();}
    catch(err){
        console.log(err);
        console.log("Something went wrong!");
        return ctx.reply("Something went wrong! Try again after sometime.");
      }    
}
async function getUser(ctx) {
    try{
    return await User.findOne({ chatId: ctx.chat.id });}
    catch(err){
        console.log(err);
        console.log("Something went wrong!");
        return ctx.reply("Something went wrong! Try again after sometime.");
      }
}

module.exports = { getUser,addUser, removeUser, getUsers };