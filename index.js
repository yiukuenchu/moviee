const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const request = require('request');

const token = ''; //填写你在BotFather申请到的token

const tmdbapi = '';  //填写你在TMDb申请到的API Key

const bot = new TelegramBot(token, {polling: true});

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Telegram moviee bot");
})

app.listen(port);

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, `
    *帮助:*
      1. /latest 获取 1 部最新添加到 TMDB 的电影
      2. /popular 获取 3 部热门的电影
      3. /upcoming 获取 3 部即将上映的电影
      4. /movie Deadpool 2 获取电影《Deadpool2》的信息
      5. /person Bradley Cooper 获取演员 Bradley Cooper 的信息
      6. /help 帮助
      7. /about 关于
    `, {parse_mode: 'Markdown'});
    bot.sendMessage(msg.chat.id, '[The Movie Database](https://www.themoviedb.org/) Telegram Bot!\n我们生活在一个时间和空间的盒子里，电影则是盒子上的窗口。', {parse_mode: 'Markdown'});
});

bot.onText(/\/about/, msg => {
    bot.sendMessage(msg.chat.id, '[The Movie Database](https://www.themoviedb.org/) Telegram Bot!\n我们生活在一个时间和空间的盒子里，电影则是盒子上的窗口。', {parse_mode: 'Markdown'});
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, `
    *帮助:*
      1. /latest 获取 1 部最新添加到 TMDB 的电影
      2. /popular 获取 3 部热门的电影
      3. /upcoming 获取 3 部即将上映的电影
      4. /movie Deadpool 2 获取电影《Deadpool2》的信息
      5. /person Bradley Cooper 获取演员 Bradley Cooper 的信息
      6. /help 帮助
      7. /about 关于
    `, {parse_mode: 'Markdown'});
    }
);

bot.onText(/\/latest/, function(msg, match){
    request('https://api.themoviedb.org/3/movie/latest?language=en-US&api_key=' + tmdbapi, function(error, response, body){
        if(!error && response.statusCode == 200){
            const res = JSON.parse(body);
            //部分电影没有 Poster
            //const posterURL = 'http://image.tmdb.org/t/p/w185/' + res.poster_path;
            bot.sendMessage(msg.chat.id, '*Title: *' + res.original_title + '\n*Date: *' + res.release_date + '\n*Language: *' + res.original_language + '\n*Overview: *' + res.overview, {parse_mode:'Markdown'})
        }else{
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
});

bot.onText(/\/popular/, function(msg, match){
    request('https://api.themoviedb.org/3/movie/popular?api_key=' + tmdbapi, function(error, response, body){
        if(!error && response.statusCode == 200){
            const res = JSON.parse(body);
            const posterURL_1 = 'http://image.tmdb.org/t/p/w185/' + res.results[0].poster_path;
            const posterURL_2 = 'http://image.tmdb.org/t/p/w185/' + res.results[1].poster_path;
            const posterURL_3 = 'http://image.tmdb.org/t/p/w185/' + res.results[2].poster_path;
            bot.sendPhoto(msg.chat.id, posterURL_1, {parse_mode:'Markdown', caption: '*Title: *' + res.results[0].title + '\n*Rating: *' + res.results[0].vote_average + '\n*Overview: *' + res.results[0].overview});
            bot.sendPhoto(msg.chat.id, posterURL_2, {parse_mode:'Markdown', caption: '*Title: *' + res.results[1].title + '\n*Rating: *' + res.results[1].vote_average + '\n*Overview: *' + res.results[1].overview});
            bot.sendPhoto(msg.chat.id, posterURL_3, {parse_mode:'Markdown', caption: '*Title: *' + res.results[2].title + '\n*Rating: *' + res.results[2].vote_average + '\n*Overview: *' + res.results[2].overview});
        }else{
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
});

bot.onText(/\/upcoming/, function(msg, match){
    request('https://api.themoviedb.org/3/movie/upcoming?api_key=' + tmdbapi, function(error, response, body){
        if(!error && response.statusCode == 200){
            const res = JSON.parse(body);
            const posterURL_1 = 'http://image.tmdb.org/t/p/w185/' + res.results[0].poster_path;
            const posterURL_2 = 'http://image.tmdb.org/t/p/w185/' + res.results[1].poster_path;
            const posterURL_3 = 'http://image.tmdb.org/t/p/w185/' + res.results[2].poster_path;
            bot.sendPhoto(msg.chat.id, posterURL_1, {parse_mode:'Markdown', caption: '*Title: *' + res.results[0].title + '\n*Date: *' + res.results[0].release_date + '\n*Rating: *' + res.results[0].vote_average + '\n*Overview: *' + res.results[0].overview});
            bot.sendPhoto(msg.chat.id, posterURL_2, {parse_mode:'Markdown', caption: '*Title: *' + res.results[1].title + '\n*Date: *' + res.results[0].release_date + '\n*Rating: *' + res.results[1].vote_average + '\n*Overview: *' + res.results[1].overview});
            bot.sendPhoto(msg.chat.id, posterURL_3, {parse_mode:'Markdown', caption: '*Title: *' + res.results[2].title + '\n*Date: *' + res.results[0].release_date + '\n*Rating: *' + res.results[2].vote_average + '\n*Overview: *' + res.results[2].overview});
        }else{
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
});

bot.onText(/\/movie (.+)/, function(msg, match){
    const movie = match[1];
    request('https://api.themoviedb.org/3/search/movie?api_key=' + tmdbapi + '&query='+ movie, function(error, response, body){
        if(!error && response.statusCode == 200){
            bot.sendMessage(msg.chat.id, '_Searching for: _' + movie + '...', {parse_mode:'Markdown'})
            .then(function(msg){
                const res = JSON.parse(body);
                const posterURL = 'http://image.tmdb.org/t/p/w185/' + res.results[0].poster_path;
                bot.sendPhoto(msg.chat.id, posterURL, {parse_mode:'Markdown', caption: '*Title: *' + res.results[0].title + '\n*Rating: *' + res.results[0].vote_average + '\n*Data: *' + res.results[0].release_date + '\n*Overview: *' + res.results[0].overview});
            })
        }else{
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
});

bot.onText(/\/person (.+)/, function(msg, match){
    const actor = match[1];
    request('https://api.themoviedb.org/3/search/person?api_key=' + tmdbapi + '&query='+ actor, function(error, response, body){
        if(!error && response.statusCode == 200){
            bot.sendMessage(msg.chat.id, '_Searching for: _' + actor + '...', {parse_mode:'Markdown'})
            .then(function(msg){
                const res = JSON.parse(body);
                const profileURL = 'http://image.tmdb.org/t/p/w185/' + res.results[0].profile_path;
                bot.sendPhoto(msg.chat.id, profileURL, {parse_mode:'Markdown', caption: '*Name: *' + res.results[0].name + '\n*Known For: *' + res.results[0].known_for[0].title + ', ' + res.results[0].known_for[1].title});
            })
        }else{
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
})