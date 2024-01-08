This is a discord bot I made for the Project Grindstone Discord server. Its main feature is a quaint snake game I made to be controllable by discord messages. It's mainly included in this portfolio for the sentimental value it contained to me and the effort that was behind it.

I choose to highlight the lines 33-38 in [index.js](https://github.com/NathanDonagi/Roomba-Discord-Bot/blob/main/index.js). These lines create a simple file server that serves a blank html document. I needed this bot to stay up 24/7 for the server and to do that I needed a quick way to test if it was online, and to send an alert if it wasn't. I had spent god knows how long attempting to use a discord api to check the online status of the bot, but they all ran into the same issue. Any code that was interacting with the Discord server would have too be on a bot, if said bot was down the code wouldn't be running, meaning I could only check if the bot was offline while the bot was online. That was not an effective strategy.

My solution was to add a few lines to create a webpage that could be queried to see if the bot was online. If the webpage could not be found and returned a 404 error then the bot was down and I'd be messaged by a separate service.


