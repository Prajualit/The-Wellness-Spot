import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
dotenv.config();

// Repairs a service-account JSON that got mangled while stored in a .env file.
// dotenv expands "\n" to real newlines for double-quoted values, and pretty-printed
// JSON also uses "\n" for line breaks, so newlines can end up both inside string
// values (invalid) and between tokens. This walks the string and:
//   - keeps "\n" escapes inside string literals (valid JSON),
//   - converts "\n" outside strings into real newlines (JSON whitespace),
//   - converts real newlines inside strings back to "\n" escapes,
//   - handles stray backslashes.
const repairJson = (input) => {
  let out = "";
  let inString = false;
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (inString) {
      if (ch === "\\") {
        const next = input[i + 1];
        if (next === undefined) {
          out += "\\\\";
          i += 1;
        } else if (next === "\n") {
          out += "\\n";
          i += 2;
        } else if (next === "\r") {
          out += "\\r";
          i += 2;
        } else if ('"\\/bfnrtu'.includes(next)) {
          out += ch + next;
          i += 2;
        } else {
          out += "\\\\" + next;
          i += 2;
        }
      } else if (ch === '"') {
        inString = false;
        out += ch;
        i += 1;
      } else if (ch === "\n") {
        out += "\\n";
        i += 1;
      } else if (ch === "\r") {
        out += "\\r";
        i += 1;
      } else {
        out += ch;
        i += 1;
      }
    } else {
      if (ch === '"') inString = true;
      if (ch === "\\" && input[i + 1] === "n") {
        out += "\n";
        i += 2;
      } else if (ch === "\\" && input[i + 1] === "r") {
        out += "\r";
        i += 2;
      } else if (ch === "\\") {
        i += 1;
      } else {
        out += ch;
        i += 1;
      }
    }
  }
  return out;
};

const parseServiceAccountKey = (raw) => {
  let value = (raw || "").trim();

  // Remove surrounding quotes if the whole value was quoted
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  // Unescape quotes that were escaped for .env storage
  value = value.replace(/\\"/g, '"');

  return JSON.parse(repairJson(value));
};

const serviceAccount = parseServiceAccountKey(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);

// Fix the PEM format of private_key (handles real newlines, "\n" and "\\n" escapes)
serviceAccount.private_key = serviceAccount.private_key.replace(/\\+n/g, "\n");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const admin = {
  apps: getApps(),
  auth: getAuth,
};

export default admin;
