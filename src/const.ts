// 健康打卡地址
export const TARGET_URL = "https://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start";

/**
 * 填表 radio 配置
 * key: radio 的 name
 * value: 选择的 radio 位置(从0开始)
 */
export const RADIO_CONFIG = {
  fieldJBXXdrsfwc: 0, // 当日是否外出
  fieldYQJLsfjcqtbl: 0, // 是否接触过半个月内有疫情重点地区旅居史的人员
  fieldJKMsfwlm: 0, // 健康码是否为绿码
  fieldCXXXsftjhb: 0, // 健康码是否为绿码
};

export const CONFIG = {
  STUDENT_NUMBER: process.env.STUDENT_NUMBER,
  PASSWORD: process.env.PASSWORD,
  PUSHPLUS: process.env.PUSHPLUS,
};
