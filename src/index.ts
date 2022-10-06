import { Page } from "puppeteer";

import {
  init,
  login,
  gotoHealthReportPage,
  finishForm,
  notify,
} from "./handler";
import { TARGET_URL } from "./const";
import { getNow, screenshot } from "./utils";
import { exit } from "process";

const pipeline: ((page: Page) => Promise<void>)[] = [
  login,
  gotoHealthReportPage,
  finishForm,
];

const MAX_RETRY_TIME = 3;

(async () => {
  // 是否打卡成功
  let isSuccess = false;

  let index = 0;
  let retry = 0;
  const page = await init(TARGET_URL);

  console.log("begin:", getNow());

  while (retry < MAX_RETRY_TIME && index < pipeline.length) {
    try {
      await pipeline[index](page);
      retry = 0;
      index++;
      isSuccess = true;
    } catch (e) {
      isSuccess = false;
      console.error(e);
      await screenshot(page, `error_${index}_${retry}`);

      retry++;
      console.log(`重试第${retry}次`);
      await page.reload();
    }
  }
  console.log("end:", getNow());

  if (isSuccess) {
    await notify("健康打卡通知", "健康打卡成功");
  } else {
    await notify("健康打卡通知", "健康打卡失败，请自行打卡！");
  }
  exit();
})();
