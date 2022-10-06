import dayjs from "./dayjs";

import fs from "fs";
import { Page } from "puppeteer";

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

export const wait = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, delay);
  });
};

interface RandomWait {
  maxTime?: number;
  minTime?: number;
}
export const randomWait = async (params?: RandomWait) => {
  const { maxTime = 5000, minTime = 1000 } = params ?? {};

  if (maxTime < maxTime) {
    throw TypeError(`maxTime ${maxTime} must be gt then minTime ${minTime}`);
  }

  const random = Math.random();

  let time = random;
  do {
    time = time * 10;
  } while (time <= minTime);
  time = time % maxTime;

  time = Math.floor(time);

  await wait(time);
};
