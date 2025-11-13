import sql from "mssql";
import dotenv from "dotenv";
dotenv.config(); // ✅ Must be FIRST line here too

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to SQL Server successfully!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ SQL Pool Error:", err);
  });

export { sql, poolPromise };
