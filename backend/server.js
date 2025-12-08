// require("dotenv").config();

// const http = require("http");
// const { Server } = require("socket.io");

// const app = require("./src/app");
// const connectDB = require("./src/config/db");

// connectDB();

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("✅ Dashboard connected:", socket.id);
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
