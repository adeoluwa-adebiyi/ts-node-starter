import { env } from "custom-env";

env("dev");

export const {PORT=80, HOST="0.0.0.0", DB_URI, SECRET, DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT=5432, DB_NAME } = process.env;