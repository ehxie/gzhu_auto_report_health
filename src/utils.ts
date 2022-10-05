import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import fs from "fs";
import { Page } from "puppeteer";

dayjs.extend(tz);
dayjs.extend(utc);

export const getNow = () => {
  return dayjs().tz("PRC").format("YYYY_MM_DD-HH_mm_ss");
};

const createDir = (path: fs.PathLike) => {
  if (fs.existsSync(path)) {
    return;
  }
  fs.mkdirSync(path);
};

export const screenshot = (() => {
  let screenshotIndex = 0;

  const now = getNow();

  return async (page: Page, filename?: string) => {
    createDir("screenshot");
    createDir(`screenshot/${now}`);

    ++screenshotIndex;
    const mergeFilename = filename
      ? `${screenshotIndex}__${filename}`
      : screenshotIndex;

    await page.screenshot({
      path: `./screenshot/${now}/${mergeFilename}.png`,
    });
  };
})();
