import "dotenv/config";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../helpers/mailTransport";
import { systemLogger } from "./Logger";

const sendEmail = async (
  email: string,
  subject: string,
  payload: Record<string, unknown>,
  template: string
) => {
  try {
    const sourceDirectory = fs.readFileSync(
      path.join(process.cwd(), template),
      "utf-8"
    );
    const compiledTemplate = handlebars.compile(sourceDirectory);

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };
    await transporter.sendMail(emailOptions);
  } catch (error) {
    systemLogger.error(`email not sent: ${error}`);
  }
};

export default sendEmail;
