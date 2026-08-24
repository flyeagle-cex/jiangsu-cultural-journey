# 十三市数据约定

本目录使用两层数据：`city-manifest.ts` 是城市身份信息的唯一事实来源，`cities.ts` 在其上补充完整文化正文。首页只加载轻量清单，不会把尚未展示的详情正文打入首屏包。

## 数据层级

- `CityMapIdentity`：路由、地图代码、城市中英文名、标签和坐标；只在 `city-manifest.ts` 维护。
- `City`：复用城市身份信息，并补充搜索词、六模块正文、媒体和来源。
- `CitySection`：固定为城市名片、自然风光、历史文化、非遗技能、特色美食、大运河与水系六类。
- `CityHighlight`：详情页最小内容单元；`id` 在所属城市内保持稳定，可直接作为锚点或未来 RAG chunk ID。
- `BilingualText` / `TranslatableText`：已发布内容必须同时具备中文与英文。
- `DraftTranslatableText` / `CityDraft`：仅用于导入中文源资料；合并英文层后才可生成正式 `City`。
- `CitySourceDocument`：记录原 Word 文件名、当前数据状态与导入注意事项。

六个模块的顺序由 `CITY_SECTION_ORDER` 控制。新增或扩写内容时，不应在组件中重新定义模块顺序。

## Word 资料导入流程

1. 保持 `江苏十三市文化资料库` 中的原始 Word 文件不变。
2. 读取正文段落、表格和媒体关系，为每个段落保留源文件名与顺序号。
3. 将原文标题归一到六个 `CitySectionId`；无法自动判断的段落进入人工复核队列。
4. 生成 `expanded` 草稿，不覆盖现有稳定的城市 slug、adcode、highlight id 和已审核译文。
5. 人工校对事实、删除重复段落，并把状态改为 `reviewed`。
6. 在 `cities.en.ts` 按稳定 ID 补充并审核英文；素材登记为 `CityMedia` 后，再通过 `mediaIds` 关联到具体条目。

泰州源文件包含一条目标为 `NULL` 的无效媒体关系，常规 `python-docx` 会中断。完整导入时应先从 `word/document.xml` 容错读取正文，再单独跳过无效关系并审计剩余媒体。
