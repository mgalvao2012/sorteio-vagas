require("dotenv").config();

const { Pool } = require("pg");
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});


const development_env = process.env.ENV == "development" ? true : false;
const redis = require("redis");
const redisClient = redis.createClient({
  url: process.env.REDIS_TLS_URL,
  legacyMode: true,
  socket: {
    tls: development_env ? false : true,
    rejectUnauthorized: false,
  },
});

// Conecta no Redis
async function redisConnect() {
  await redisClient.connect();
  // console.log("Redis " + redisClient.isOpen); // this is true
  redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
  });
}
redisConnect();


// module.exports = { pool };
module.exports = { pool, redisClient };