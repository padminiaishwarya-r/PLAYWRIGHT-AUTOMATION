import { sendEmail } from "./sendMail.js";
import dotenv from "dotenv";

dotenv.config();

await sendEmail("Test Email", "This is a test email.");
