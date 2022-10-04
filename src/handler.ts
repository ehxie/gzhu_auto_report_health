import { ElementHandle, launch, Page } from "puppeteer";
import axios from "axios";

import { RADIO_CONFIG, CONFIG } from "./const";

export const init = async (url: string) => {
  const browser = await launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url);

  return page;
};

export const login = async (page: Page) => {
  console.log("正在登录");
  if (!CONFIG.STUDENT_NUMBER || !CONFIG.PASSWORD) {
    throw TypeError("请先配置账号密码");
  }

  const studentNumberInput = await page.waitForSelector("#un");
  await studentNumberInput?.type(CONFIG.STUDENT_NUMBER, { delay: 100 });

  const passwordInput = await page.waitForSelector("#pd");
  await passwordInput?.type(CONFIG.PASSWORD, { delay: 100 });

  const loginButton = await page.waitForSelector("#index_login_btn", {
    visible: true,
  });
  await loginButton?.click();

  await page.waitForNavigation();

  console.log("登录成功");
};

export const gotoHealthReportPage = async (page: Page) => {
  console.log("进入健康上报页面");

  await page.waitForSelector(".introduce_name", {
    visible: true,
  });

  const startReportBtn = await page.waitForSelector("#preview_start_button");
  await page.tap("#preview_start_button");

  await startReportBtn?.click();
};

export const finishForm = async (page: Page) => {
  console.log("开始填表");

  await page.waitForSelector("#title_content", {
    visible: true,
  });

  // 填写 radio
  await Object.entries(RADIO_CONFIG).reduce(async (p, [name, radioIndex]) => {
    return new Promise((resolve) => {
      Promise.resolve(p).then(async () => {
        const radios = await page.$$(`input[name=${name}]`);
        await page.tap(`input[name=${name}]`);
        radios[radioIndex].click();

        resolve();
      });
    });
  }, Promise.resolve());

  // 勾选承诺
  const checkbox = await page.$(`input[name=fieldCNS]`);
  await page.tap(`input[name=fieldCNS`);
  await checkbox?.click();
  await checkbox?.click();

  console.log("填写完成，提交表单");
  const [submitBtn] = await page.$x('//nobr[contains(text(), "提交")]/..');
  await (submitBtn as ElementHandle<Element>).click();

  await page.waitForXPath('//div[contains(text(), "打卡成功")]');
  console.log("打卡成功");
};

export const notify = async (content: string, title?: string) => {
  const token = CONFIG.PUSHPLUS;
  if (!token) {
    console.log("没有填写 PUSHPLUS token 将不会进行消息推送");
    return;
  }

  const { data } = await axios.post(`http://www.pushplus.plus/send`, {
    token,
    title,
    content,
  });

  console.log("进行消息推送", data);
};
