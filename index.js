const { LineBot } = require('bottender');
const { createServer } = require('bottender/express');
const axios = require('axios');
const config = require('./config');

const bot = new LineBot({
  channelSecret: config.channelSecret,
  accessToken: config.accessToken,
});

bot.onEvent(async context => {
  if (context.event.isText) {
  	if (context.event.text === '推播') {
  		context.client.pushText(context.session.user.id,'BROADCASTING!');
  	} else if (context.event.text === '查詢') {
  	  axios.get('http://opendata.epa.gov.tw/ws/Data/AQI/?$format=json')
	  .then(function (response) {
	    let mydata = response.data;
	    for (i = 0; i < mydata.length; i++) { 
			if (mydata[i].SiteName == '松山') {
				context.sendText('目前松山 AQI 指數: ' +  mydata[i].AQI);
			}
		}
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
	} else {
  	  await context.sendText(context.event.text);
  	}
  }
});

const server = createServer(bot);

server.listen(5000, () => {
  console.log('server is running on 5000 port...');
});