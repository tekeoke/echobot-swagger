const botbuilder = require("botbuilder");
const restify = require("restify");

// Server settings
const PORT = 3978;

// Create a bot adapter, which defines how the bot sends and receives messages.
const adapter = new botbuilder.BotFrameworkAdapter();

// Create an HTTP server
const server = restify.createServer();
server.listen(PORT, () => {
  console.log("%s listening to %s", server.name, server.url);
});

var restifySwaggerJsdoc = require("restify-swagger-jsdoc");
restifySwaggerJsdoc.createSwaggerPage({
  title: "API documentation", // Page title
  version: "1.0.0", // Server version
  server: server, // Restify server instance created with restify.createServer()
  path: "/docs/swagger", // Public url where the swagger page will be available
  apis: [`${__dirname}/index.js`],
});

/**
 * @swagger
 * /api/messages:
 *   post:
 *     description: Listen for incoming requests at /api/messages.
 *     produces:
 *       - api/messages
 *     parameters:
 *       - name: req
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: res
 */
server.post("/api/messages", (req, res) => {
  // Use the adapter to process the incoming web request into a TurnContext object.
  adapter.processActivity(req, res, async (turnContext) => {
    if (turnContext.activity.type === "message") {
      const utterance = turnContext.activity.text;
      await turnContext.sendActivity(`You said: ${utterance}`);
    }
  });
});
