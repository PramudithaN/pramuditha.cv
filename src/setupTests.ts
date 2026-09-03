import "@testing-library/jest-dom";
import { webcrypto } from "crypto";
import { TextEncoder, TextDecoder } from "util";

if (!global.crypto || !global.crypto.subtle) {
  // @ts-ignore
  global.crypto = webcrypto;
}

if (!global.TextEncoder) {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}
