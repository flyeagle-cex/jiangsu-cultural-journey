import type { CitySlug } from "@/types/city";

export const RETRIEVAL_REGRESSION_QUESTIONS: ReadonlyArray<{
  city: CitySlug;
  question: string;
}> = [
  { city: "nanjing", question: "南京有什么代表性的鸭类美食？" },
  { city: "suzhou", question: "苏州有哪些园林文化？" },
  { city: "wuxi", question: "为什么无锡饮食偏甜？" },
  { city: "huaian", question: "淮安和大运河有什么关系？" },
  { city: "xuzhou", question: "徐州有哪些重要历史文化？" },
  { city: "suqian", question: "宿迁和项羽有什么联系？" },
  { city: "yangzhou", question: "扬州有什么代表性非遗？" },
  { city: "yancheng", question: "盐城有哪些湿地文化？" },
];
