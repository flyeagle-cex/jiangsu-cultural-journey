import {
  CITY_SECTION_ORDER,
  type City,
  type CityDraft,
  type CityDraftSection,
  type CitySectionId,
  type CitySourceDocument,
} from "@/types/city";
import { cityIdentityBySlug } from "@/data/city-manifest";
import { applyCityEnglish } from "@/data/cities.en";

type SectionInput = Omit<CityDraftSection, "id">;

function citySections(input: Record<CitySectionId, SectionInput>): CityDraftSection[] {
  return CITY_SECTION_ORDER.map((id) => ({ id, ...input[id] }));
}

function source(fileName: string, note = "依据原始 Word 资料提炼；完整正文待后续批量导入。"): CitySourceDocument[] {
  return [{ kind: "docx", fileName, dataStatus: "brief", note }];
}

const cityChineseContent: CityDraft[] = [
  {
    ...cityIdentityBySlug.nanjing,
    summary: {
      zh: "长江与秦淮河共同塑造的古都，从六朝烟水、明城墙到近现代历史，城市记忆层层相叠。",
    },
    searchTerms: {
      zh: ["六朝", "秦淮河", "明城墙", "云锦", "盐水鸭"],
      en: ["Six Dynasties", "Qinhuai River", "Ming City Wall", "Yunjin brocade", "salted duck"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "南京襟江抱湖、依山筑城，是江苏省会，也是理解长江文明与古都文化的重要入口。" },
        highlights: [
          {
            id: "capital-of-six-dynasties",
            title: { zh: "六朝古都" },
            summary: { zh: "多个王朝曾在此建都，钟山、石头城与古城格局共同构成金陵历史的空间骨架。" },
            keywords: ["金陵", "六朝", "古都"],
          },
          {
            id: "qinhuai-city-image",
            title: { zh: "十里秦淮" },
            summary: { zh: "夫子庙、贡院、乌衣巷与画舫夜景沿秦淮河展开，是南京最鲜明的城市文化名片。" },
            keywords: ["秦淮河", "夫子庙", "夜游"],
          },
        ],
      },
      nature: {
        intro: { zh: "山、江、湖、城在南京紧密交织，既有皇家园林湖泊，也有连绵山林与滨江风光。" },
        highlights: [
          {
            id: "xuanwu-lake",
            title: { zh: "玄武湖" },
            summary: { zh: "五洲相连的皇家园林湖泊，四季花木与古城天际线彼此映照。" },
            keywords: ["玄武湖", "皇家园林", "五洲"],
          },
          {
            id: "zhongshan-scenery",
            title: { zh: "钟山胜境" },
            summary: { zh: "紫金山一带汇集山林、陵寝与古刹，是南京“钟山龙盘”地貌意象的核心。" },
            keywords: ["钟山", "紫金山", "山林"],
          },
        ],
      },
      history: {
        intro: { zh: "从六朝建康到明代都城，再到近现代重大历史现场，南京保存着连续而厚重的城市史。" },
        highlights: [
          {
            id: "ming-capital",
            title: { zh: "明代都城与城墙" },
            summary: { zh: "明初营建南京城，现存城墙与城门仍勾勒出古都规模和营造智慧。" },
            keywords: ["明代", "南京城墙", "中华门"],
          },
          {
            id: "modern-history",
            title: { zh: "近现代历史坐标" },
            summary: { zh: "南京在中国近现代史中具有重要位置，众多纪念馆、旧址与街区保存着城市记忆。" },
            keywords: ["近现代史", "历史旧址", "城市记忆"],
          },
        ],
      },
      heritage: {
        intro: { zh: "南京非遗兼具宫廷审美、精细工艺与市井生活，体现古都文化的层次。" },
        highlights: [
          {
            id: "yunjin-brocade",
            title: { zh: "南京云锦" },
            summary: { zh: "以木机妆花手工织造见长，纹样华美、工序复杂，是南京代表性的织造技艺。" },
            keywords: ["云锦", "织造", "妆花"],
          },
          {
            id: "jinling-crafts",
            title: { zh: "金陵刻经与金箔" },
            summary: { zh: "雕版印刷与金箔锻制延续精密手工传统，连接宗教出版、建筑装饰与日常器物。" },
            keywords: ["金陵刻经", "金箔", "传统工艺"],
          },
        ],
      },
      food: {
        intro: { zh: "南京味道以鸭馔和秦淮小吃最具辨识度，咸鲜之外也保留丰富的街巷记忆。" },
        highlights: [
          {
            id: "salted-duck",
            title: { zh: "盐水鸭" },
            summary: { zh: "皮白肉嫩、咸香清鲜，是南京宴席与日常餐桌都常见的经典风味。" },
            keywords: ["盐水鸭", "桂花鸭", "鸭馔"],
          },
          {
            id: "qinhuai-snacks",
            title: { zh: "鸭血粉丝汤与秦淮小吃" },
            summary: { zh: "鸭血粉丝汤、牛肉锅贴和糕团茶点共同构成南京街巷里的烟火味。" },
            keywords: ["鸭血粉丝汤", "牛肉锅贴", "秦淮小吃"],
          },
        ],
      },
      waterways: {
        intro: { zh: "南京虽不在京杭大运河主航道上，却通过秦淮河、胥河、胭脂河等水系与运河网络相连。" },
        highlights: [
          {
            id: "qinhuai-waterway",
            title: { zh: "秦淮河城市水轴" },
            summary: { zh: "秦淮河既是古代水运通道，也是串联城门、街市与人文景观的城市时间线。" },
            keywords: ["秦淮河", "水运", "城市水轴"],
          },
          {
            id: "ancient-canals",
            title: { zh: "胥河与胭脂河" },
            summary: { zh: "多条古代人工水道沟通太湖、皖南与长江，展示南京在区域水运史中的辐射作用。" },
            keywords: ["胥河", "胭脂河", "古运河"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库 · 南京篇.docx"),
  },
  {
    ...cityIdentityBySlug.suzhou,
    summary: { zh: "运河、古城、水巷与园林共同构成苏州的江南秩序，传统生活至今仍在河街之间延续。" },
    searchTerms: {
      zh: ["苏州园林", "平江路", "昆曲", "苏绣", "大运河"],
      en: ["Suzhou gardens", "Pingjiang Road", "Kunqu opera", "Suzhou embroidery", "Grand Canal"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "苏州东邻上海、西抱太湖，古城保持水陆并行、河街相邻的双棋盘格局。" },
        highlights: [
          {
            id: "ancient-city-grid",
            title: { zh: "水陆双棋盘" },
            summary: { zh: "古城河道、街巷与城门相互咬合，延续两千五百多年的城市空间秩序。" },
            keywords: ["苏州古城", "水陆并行", "河街相邻"],
          },
          {
            id: "gardens-and-lanes",
            title: { zh: "园林与水巷" },
            summary: { zh: "古典园林的精微尺度与平江路等临水街巷，共同呈现可游、可居的江南生活。" },
            keywords: ["古典园林", "水巷", "平江路"],
          },
        ],
      },
      nature: {
        intro: { zh: "太湖烟波、湖荡湿地与城市园林共同构成苏州含蓄而丰富的自然层次。" },
        highlights: [
          {
            id: "taihu-landscape",
            title: { zh: "太湖山水" },
            summary: { zh: "西山、东山与湖湾岛屿展开开阔水景，也孕育茶果、渔业与村落文化。" },
            keywords: ["太湖", "西山", "湖岛"],
          },
          {
            id: "classical-gardens",
            title: { zh: "苏州古典园林" },
            summary: { zh: "拙政园、留园等以叠山理水营造咫尺山林，多座园林列入世界文化遗产。" },
            keywords: ["拙政园", "留园", "世界遗产"],
          },
        ],
      },
      history: {
        intro: { zh: "吴文化、古城营造和运河商业共同塑造苏州绵延不断的城市文脉。" },
        highlights: [
          {
            id: "wu-culture",
            title: { zh: "吴文化古城" },
            summary: { zh: "阖闾大城的历史记忆、古城门与护城河，构成苏州早期城市文明的重要线索。" },
            keywords: ["吴文化", "阖闾城", "盘门"],
          },
          {
            id: "jiangnan-learning",
            title: { zh: "江南文脉" },
            summary: { zh: "书院、藏书、书画与工艺传统在园林和街巷中汇聚，形成细腻的城市审美。" },
            keywords: ["江南文脉", "书画", "藏书"],
          },
        ],
      },
      heritage: {
        intro: { zh: "苏州的表演、织绣与版画传统把江南审美转化为可听、可看、可触的技艺。" },
        highlights: [
          {
            id: "kunqu-and-pingtan",
            title: { zh: "昆曲与苏州评弹" },
            summary: { zh: "水磨腔、弦索与吴语说唱展现江南声音，也承载古典文学与市民故事。" },
            keywords: ["昆曲", "评弹", "吴语"],
          },
          {
            id: "embroidery-and-prints",
            title: { zh: "苏绣与桃花坞木版年画" },
            summary: { zh: "一针一线与一版一色呈现精细手工和民间图像传统，是苏州工艺的重要代表。" },
            keywords: ["苏绣", "桃花坞木版年画", "手工艺"],
          },
        ],
      },
      food: {
        intro: { zh: "苏州菜重时令、讲精细，以湖鲜、面食和糕团体现甜鲜柔和的江南口味。" },
        highlights: [
          {
            id: "squirrel-mandarin-fish",
            title: { zh: "松鼠鳜鱼" },
            summary: { zh: "刀工塑形、炸制定型后浇汁，兼具酥脆口感与鲜明造型。" },
            keywords: ["松鼠鳜鱼", "苏帮菜", "刀工"],
          },
          {
            id: "seasonal-suzhou-flavours",
            title: { zh: "时令面点与湖鲜" },
            summary: { zh: "枫镇大肉面、大方糕、甫里鸭与阳澄湖水产构成随季节变化的味觉地图。" },
            keywords: ["枫镇大肉面", "大方糕", "阳澄湖"],
          },
        ],
      },
      waterways: {
        intro: { zh: "大运河苏州段与太湖、护城河和城内水网相互连通，水系就是古城的基本结构。" },
        highlights: [
          {
            id: "canal-through-suzhou",
            title: { zh: "运河环古城" },
            summary: { zh: "运河水融入护城河和城内河道，使苏州成为沿线少见的整体性水城遗产。" },
            keywords: ["大运河苏州段", "护城河", "水城"],
          },
          {
            id: "canal-ten-scenes",
            title: { zh: "运河十景" },
            summary: { zh: "望亭、浒墅关、枫桥、平江、盘门与宝带桥等节点串起跨城文化线路。" },
            keywords: ["运河十景", "枫桥", "宝带桥"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库·苏州篇.docx"),
  },
  {
    ...cityIdentityBySlug.wuxi,
    summary: { zh: "太湖、大运河与长江水系在无锡交汇，水乡风貌、吴地手艺和近代工商文化彼此相连。" },
    searchTerms: {
      zh: ["太湖", "清名桥", "惠山泥人", "宜兴紫砂", "无锡小笼"],
      en: ["Lake Tai", "Qingming Bridge", "Huishan clay figurines", "Yixing teapot", "Wuxi xiaolongbao"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "无锡位于江湖间走廊，大运河穿城而过，素有鱼米之乡与近代工商名城之称。" },
        highlights: [
          {
            id: "three-waters-meet",
            title: { zh: "江、湖、河交汇" },
            summary: { zh: "长江、太湖和大运河共同影响城市交通、物产与生活方式。" },
            keywords: ["长江", "太湖", "大运河"],
          },
          {
            id: "industrial-city",
            title: { zh: "江南工商名城" },
            summary: { zh: "米市、丝业与民族工商业沿运河成长，留下厂房、码头和实业家故事。" },
            keywords: ["米市", "丝业", "民族工商业"],
          },
        ],
      },
      nature: {
        intro: { zh: "无锡最鲜明的自然底色来自太湖，湖湾、岛屿与山林共同形成开阔的江南景观。" },
        highlights: [
          {
            id: "yuantouzhu",
            title: { zh: "鼋头渚" },
            summary: { zh: "伸入太湖的半岛以湖景和春季樱花闻名，是观赏太湖风光的重要地点。" },
            keywords: ["鼋头渚", "樱花", "太湖"],
          },
          {
            id: "lihu-and-huishan",
            title: { zh: "蠡湖与惠山" },
            summary: { zh: "蠡湖城市水岸与惠山古镇山泉相映，连接园林、湿地与人文景观。" },
            keywords: ["蠡湖", "惠山", "湿地"],
          },
        ],
      },
      history: {
        intro: { zh: "泰伯吴文化、运河商贸与近代实业共同构成无锡历史叙事的三条主线。" },
        highlights: [
          {
            id: "wu-culture-origin",
            title: { zh: "泰伯与吴文化" },
            summary: { zh: "梅里与伯渎河传说保存着江南早期开发和吴文化起源的记忆。" },
            keywords: ["泰伯", "梅里", "吴文化"],
          },
          {
            id: "modern-industry",
            title: { zh: "民族工商业" },
            summary: { zh: "运河两岸的粮运、缫丝和工厂推动无锡成为中国近代实业重镇。" },
            keywords: ["荣氏家族", "近代工业", "运河商贸"],
          },
        ],
      },
      heritage: {
        intro: { zh: "无锡非遗既有鲜活的民间造型，也有对泥、竹、丝和陶土的精细掌控。" },
        highlights: [
          {
            id: "huishan-clay-figurines",
            title: { zh: "惠山泥人" },
            summary: { zh: "以夸张造型和明快色彩表现人物与民俗，代表无锡富有生活气息的民间美术。" },
            keywords: ["惠山泥人", "大阿福", "民间美术"],
          },
          {
            id: "yixing-zisha",
            title: { zh: "宜兴紫砂" },
            summary: { zh: "以当地陶土手工成型，兼具实用与文人审美，形成独特的茶器文化。" },
            keywords: ["宜兴紫砂", "陶艺", "茶器"],
          },
        ],
      },
      food: {
        intro: { zh: "无锡菜以甜鲜醇厚著称，太湖水产与精巧面点共同构成地方味道。" },
        highlights: [
          {
            id: "wuxi-ribs-and-xiaolong",
            title: { zh: "酱排骨与无锡小笼" },
            summary: { zh: "浓油赤酱的排骨与汁多味甜的小笼包，是最具辨识度的无锡经典。" },
            keywords: ["无锡酱排骨", "无锡小笼", "甜鲜"],
          },
          {
            id: "taihu-flavours",
            title: { zh: "太湖三白与油面筋" },
            summary: { zh: "湖鲜和豆制品体现江南水乡对时令食材与轻巧烹调的重视。" },
            keywords: ["太湖三白", "油面筋", "湖鲜"],
          },
        ],
      },
      waterways: {
        intro: { zh: "无锡是古运河横贯城区的典型运河城市，河道至今仍串联街区、古桥与工业遗产。" },
        highlights: [
          {
            id: "qingming-bridge",
            title: { zh: "清名桥水弄堂" },
            summary: { zh: "南长街、清名桥与古运河共同保存路河并行的水乡街区格局。" },
            keywords: ["清名桥", "南长街", "水弄堂"],
          },
          {
            id: "bodu-river",
            title: { zh: "伯渎河" },
            summary: { zh: "相传由泰伯开凿，是连接无锡与苏州的重要古水道，也是吴文化水利记忆的载体。" },
            keywords: ["伯渎河", "古运河", "吴文化"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库 · 无锡篇.docx"),
  },
  {
    ...cityIdentityBySlug.changzhou,
    summary: { zh: "常州因运河而兴，老城街巷、东坡文脉、精细手艺与质朴小吃构成鲜明的江南城市性格。" },
    searchTerms: {
      zh: ["青果巷", "东坡", "常州梳篦", "乱针绣", "大麻糕"],
      en: ["Qingguo Lane", "Su Dongpo", "Changzhou combs", "random-stitch embroidery", "sesame cake"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "常州位于太湖平原西北部，古运河穿城而过，长期是沟通苏锡与金陵的重要商埠。" },
        highlights: [
          {
            id: "canal-port",
            title: { zh: "运河名埠" },
            summary: { zh: "码头、粮运与手工业曾沿河聚集，塑造常州老城的商业脉络。" },
            keywords: ["运河商埠", "码头", "老城"],
          },
          {
            id: "qingguo-lane",
            title: { zh: "青果巷文脉" },
            summary: { zh: "沿运河支流生长的历史街区保存名人故居、传统宅院与江南巷陌。" },
            keywords: ["青果巷", "历史街区", "名人故居"],
          },
        ],
      },
      nature: {
        intro: { zh: "湖泊、湿地与丘陵把常州从江南水乡延伸到苏南山水。" },
        highlights: [
          {
            id: "tianmu-lake",
            title: { zh: "天目湖" },
            summary: { zh: "湖湾、竹海与低山共同形成溧阳代表性的山水休闲景观。" },
            keywords: ["天目湖", "溧阳", "竹海"],
          },
          {
            id: "gehu-wetlands",
            title: { zh: "滆湖与湿地水网" },
            summary: { zh: "常州东南部湖荡与河网延续太湖平原的水乡生态底色。" },
            keywords: ["滆湖", "湿地", "太湖平原"],
          },
        ],
      },
      history: {
        intro: { zh: "春秋吴地记忆、运河城市演变与历代文人故事交织成常州历史。" },
        highlights: [
          {
            id: "three-wu-history",
            title: { zh: "三吴襟带" },
            summary: { zh: "常州处在江南交通要冲，古代行政、商贸与文化交流长期在此汇聚。" },
            keywords: ["三吴", "江南", "古城"],
          },
          {
            id: "dongpo-memory",
            title: { zh: "东坡终老常州" },
            summary: { zh: "苏轼多次到访并终老常州，舣舟亭、藤花旧馆等地点保留相关文化记忆。" },
            keywords: ["苏轼", "舣舟亭", "藤花旧馆"],
          },
        ],
      },
      heritage: {
        intro: { zh: "常州手艺重材料、刀工与针法，既服务日常生活，也发展出高度精细的艺术表达。" },
        highlights: [
          {
            id: "combs-and-bamboo-carving",
            title: { zh: "常州梳篦与留青竹刻" },
            summary: { zh: "“宫梳名篦”与竹材浅刻体现常州传统手工对细节和触感的追求。" },
            keywords: ["常州梳篦", "留青竹刻", "宫梳名篦"],
          },
          {
            id: "random-stitch-embroidery",
            title: { zh: "常州乱针绣" },
            summary: { zh: "以交错彩线表现光影与体积，被称为“以针代笔”的现代刺绣技艺。" },
            keywords: ["乱针绣", "刺绣", "以针代笔"],
          },
        ],
      },
      food: {
        intro: { zh: "常州饮食兼具码头早餐的实在与江南点心的细巧。" },
        highlights: [
          {
            id: "sesame-cake-breakfast",
            title: { zh: "大麻糕与豆腐汤" },
            summary: { zh: "酥香耐饥的大麻糕搭配热豆腐汤，是常州极具生活感的早餐组合。" },
            keywords: ["常州大麻糕", "豆腐汤", "早餐"],
          },
          {
            id: "changzhou-seasonal-food",
            title: { zh: "加蟹小笼与砂锅鱼头" },
            summary: { zh: "秋日蟹香与天目湖鱼鲜，展现常州随季节和水域变化的地方味道。" },
            keywords: ["加蟹小笼", "天目湖砂锅鱼头", "时令"],
          },
        ],
      },
      waterways: {
        intro: { zh: "古运河多次改道并持续塑造常州城区，沿河街巷保存商贸、桥梁与文人遗迹。" },
        highlights: [
          {
            id: "old-canal-city",
            title: { zh: "穿城古运河" },
            summary: { zh: "老运河连接青果巷、篦箕巷等历史空间，见证常州由水运商埠走向现代城市。" },
            keywords: ["常州古运河", "篦箕巷", "水运"],
          },
          {
            id: "yizhou-pavilion",
            title: { zh: "舣舟亭与东坡水路" },
            summary: { zh: "运河岸边的东坡遗迹把城市水路、文学记忆与公共园林联系起来。" },
            keywords: ["舣舟亭", "东坡", "运河遗迹"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库·常州篇.docx"),
  },
  {
    ...cityIdentityBySlug.zhenjiang,
    summary: { zh: "长江与大运河在镇江交汇，金山、焦山、北固山和西津渡共同见证江河交通与京口文脉。" },
    searchTerms: {
      zh: ["西津渡", "京口三山", "金山寺", "香醋", "锅盖面"],
      en: ["Xijin Ferry", "Jingkou Three Hills", "Jinshan Temple", "Zhenjiang vinegar", "pot-cover noodles"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "镇江位于长江下游南岸，是江河交汇、水陆转换的历史门户。" },
        highlights: [
          {
            id: "river-canal-crossroads",
            title: { zh: "江河十字交汇" },
            summary: { zh: "长江与京杭大运河在此衔接，使镇江长期承担渡江、转运与防守功能。" },
            keywords: ["长江", "京杭大运河", "交通枢纽"],
          },
          {
            id: "jingkou-three-hills",
            title: { zh: "京口三山" },
            summary: { zh: "金山、焦山、北固山沿江相望，是镇江山水格局和文化意象的核心。" },
            keywords: ["金山", "焦山", "北固山"],
          },
        ],
      },
      nature: {
        intro: { zh: "镇江以江山相拥见长，长江岛山、滨水崖岸与湖泊湿地形成多样景观。" },
        highlights: [
          {
            id: "jinshan-and-jiaoshan",
            title: { zh: "金山与焦山" },
            summary: { zh: "金山以寺裹山闻名，焦山四面环江、古木葱郁，共同展现大江气象。" },
            keywords: ["金山", "焦山", "长江"],
          },
          {
            id: "chishan-lake",
            title: { zh: "赤山湖湿地" },
            summary: { zh: "红色山体、天然湖泊与湿地滩涂相映，也是秦淮河上游重要的水利生态空间。" },
            keywords: ["赤山湖", "湿地", "秦淮河上游"],
          },
        ],
      },
      history: {
        intro: { zh: "京口要塞、江上渡口和历代诗文共同书写镇江历史。" },
        highlights: [
          {
            id: "jingkou-history",
            title: { zh: "京口古城" },
            summary: { zh: "镇江自古扼守长江，军事、漕运和商贸功能在京口持续交汇。" },
            keywords: ["京口", "古城", "江防"],
          },
          {
            id: "poetry-and-legends",
            title: { zh: "诗词与传说" },
            summary: { zh: "北固山怀古、水漫金山等诗文传说，使镇江山水成为广泛流传的文化场景。" },
            keywords: ["北固山怀古", "水漫金山", "诗词"],
          },
        ],
      },
      heritage: {
        intro: { zh: "纸艺、戏曲、吴歌和节俗展示镇江跨江南与江淮的文化交汇。" },
        highlights: [
          {
            id: "paper-cutting",
            title: { zh: "镇江剪纸与丹阳刻纸" },
            summary: { zh: "以刀剪形成细密纹样，题材覆盖花鸟、人物和吉祥民俗。" },
            keywords: ["镇江剪纸", "丹阳刻纸", "纸艺"],
          },
          {
            id: "dan-opera-and-wu-songs",
            title: { zh: "丹剧与镇江吴歌" },
            summary: { zh: "地方戏曲和民歌保留方言声腔，也记录江河沿岸的劳动与生活。" },
            keywords: ["丹剧", "镇江吴歌", "民间艺术"],
          },
        ],
      },
      food: {
        intro: { zh: "镇江味道常以“香醋摆不坏、肴肉不当菜、面锅里面煮锅盖”概括。" },
        highlights: [
          {
            id: "vinegar-and-cured-pork",
            title: { zh: "镇江香醋与肴肉" },
            summary: { zh: "香醋酸而不涩，水晶肴肉咸鲜弹嫩，是镇江宴席中的经典搭配。" },
            keywords: ["镇江香醋", "肴肉", "三怪"],
          },
          {
            id: "pot-cover-noodles",
            title: { zh: "锅盖面" },
            summary: { zh: "小锅盖随面同煮形成独特制作景象，配浇头和香醋，是镇江日常代表。" },
            keywords: ["锅盖面", "面食", "香醋"],
          },
        ],
      },
      waterways: {
        intro: { zh: "镇江既保存古代入江口、渡口与石桥，也承担现代江海河联运功能。" },
        highlights: [
          {
            id: "xijin-ferry",
            title: { zh: "西津渡与京口闸" },
            summary: { zh: "古渡街区和水工遗址共同讲述运河船只如何抵达长江、完成转运。" },
            keywords: ["西津渡", "京口闸", "古渡口"],
          },
          {
            id: "jianbi-lock",
            title: { zh: "谏壁船闸" },
            summary: { zh: "现代船闸连接江南运河与长江，延续镇江作为航运节点的现实功能。" },
            keywords: ["谏壁船闸", "江海河联运", "现代航运"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库 · 镇江篇.docx"),
  },
  {
    ...cityIdentityBySlug.yangzhou,
    summary: { zh: "邗沟从扬州出发，运河带来盐商、园林、文人和淮扬味道，也塑造了城市的从容气质。" },
    searchTerms: {
      zh: ["邗沟", "瘦西湖", "扬州园林", "淮扬菜", "扬州漆器"],
      en: ["Han Canal", "Slender West Lake", "Yangzhou gardens", "Huaiyang cuisine", "Yangzhou lacquerware"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "扬州位于长江与大运河交汇区域，是古代盐运中心和今日享誉国际的美食城市。" },
        highlights: [
          {
            id: "born-of-the-canal",
            title: { zh: "因运河而生" },
            summary: { zh: "从邗沟开凿到历代漕运，扬州的城市兴衰始终与运河紧密相连。" },
            keywords: ["邗沟", "运河城市", "盐运"],
          },
          {
            id: "slow-city-life",
            title: { zh: "园林、早茶与慢生活" },
            summary: { zh: "园林游赏、清晨早茶和沐浴文化共同构成扬州温润从容的生活方式。" },
            keywords: ["扬州园林", "早茶", "生活方式"],
          },
        ],
      },
      nature: {
        intro: { zh: "湖泊、湿地与人工园林沿运河水系展开，形成扬州秀逸舒缓的水景。" },
        highlights: [
          {
            id: "slender-west-lake",
            title: { zh: "瘦西湖" },
            summary: { zh: "历代城濠与园林共同营造的湖上长卷，以五亭桥、二十四桥等景点闻名。" },
            keywords: ["瘦西湖", "五亭桥", "二十四桥"],
          },
          {
            id: "gaoyou-and-shaobo-lakes",
            title: { zh: "高邮湖与邵伯湖" },
            summary: { zh: "开阔湖面、湿地水鸟与渔业物产延伸出扬州北部的湖乡景观。" },
            keywords: ["高邮湖", "邵伯湖", "湿地"],
          },
        ],
      },
      history: {
        intro: { zh: "运河与盐业带来长期繁荣，也留下唐诗、盐商宅园和古城街巷。" },
        highlights: [
          {
            id: "salt-merchant-city",
            title: { zh: "盐运都会" },
            summary: { zh: "明清盐业和漕运汇聚财富、工艺与人才，推动园林和城市商业繁盛。" },
            keywords: ["盐商", "盐运", "明清扬州"],
          },
          {
            id: "poetry-and-city",
            title: { zh: "诗意扬州" },
            summary: { zh: "历代诗人不断书写扬州，运河、月色与烟花三月成为广为流传的城市意象。" },
            keywords: ["唐诗", "烟花三月", "扬州意象"],
          },
        ],
      },
      heritage: {
        intro: { zh: "扬州非遗兼具精工细作和舞台表达，反映盐商文化与市民生活的双重滋养。" },
        highlights: [
          {
            id: "lacquerware-and-jade",
            title: { zh: "扬州漆器与玉雕" },
            summary: { zh: "髹漆、雕刻与镶嵌工艺精细繁复，是扬州传统工艺的重要代表。" },
            keywords: ["扬州漆器", "扬州玉雕", "雕刻"],
          },
          {
            id: "yangzhou-storytelling",
            title: { zh: "扬州评话与清曲" },
            summary: { zh: "说书与曲艺以方言、节奏和人物塑造见长，保存城市的声音记忆。" },
            keywords: ["扬州评话", "扬州清曲", "曲艺"],
          },
        ],
      },
      food: {
        intro: { zh: "扬州是淮扬菜重镇，讲究选料、刀工、火候与清鲜平和。" },
        highlights: [
          {
            id: "yangzhou-morning-tea",
            title: { zh: "扬州早茶" },
            summary: { zh: "烫干丝、三丁包、翡翠烧卖与千层油糕构成从茶馆开始的一日节奏。" },
            keywords: ["扬州早茶", "烫干丝", "三丁包"],
          },
          {
            id: "huaiyang-classics",
            title: { zh: "狮子头与文思豆腐" },
            summary: { zh: "细切粗斩与极致刀工体现淮扬菜对质地、火候和清鲜的追求。" },
            keywords: ["狮子头", "文思豆腐", "淮扬菜"],
          },
        ],
      },
      waterways: {
        intro: { zh: "扬州是中国大运河的重要起点和枢纽，古邗沟、瓜洲与运河三湾串联两千多年水运史。" },
        highlights: [
          {
            id: "han-canal",
            title: { zh: "古邗沟" },
            summary: { zh: "春秋时期开凿的邗沟被视为大运河重要源头，奠定扬州运河城市的基础。" },
            keywords: ["邗沟", "大运河起点", "春秋"],
          },
          {
            id: "canal-three-bays",
            title: { zh: "运河三湾与瓜洲" },
            summary: { zh: "三湾水工智慧和瓜洲江河交汇，分别展现运河治理与长江转运功能。" },
            keywords: ["运河三湾", "瓜洲古渡", "水工"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库•扬州.docx"),
  },
  {
    ...cityIdentityBySlug.taizhou,
    summary: { zh: "河网、湖荡与里下河水乡滋养泰州，古城文脉、戏曲传统和早茶味道在慢生活中延续。" },
    searchTerms: {
      zh: ["凤城河", "溱湖", "兴化垛田", "梅兰芳", "泰州早茶"],
      en: ["Fengcheng River", "Qin Lake", "Xinghua raised fields", "Mei Lanfang", "Taizhou morning tea"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "泰州地处长江北岸和里下河腹地，水网密布，古称海陵。" },
        highlights: [
          {
            id: "water-city-hailing",
            title: { zh: "水润海陵" },
            summary: { zh: "古城河道、街巷与桥梁依水展开，形成兼具江淮与江南气质的城市空间。" },
            keywords: ["海陵", "水城", "古城"],
          },
          {
            id: "slow-life",
            title: { zh: "早茶与慢生活" },
            summary: { zh: "茶馆、戏曲和一套细致早茶，让泰州日常呈现从容亲切的生活节奏。" },
            keywords: ["泰州早茶", "茶馆", "慢生活"],
          },
        ],
      },
      nature: {
        intro: { zh: "湖荡、湿地和垛田构成泰州最有辨识度的里下河自然景观。" },
        highlights: [
          {
            id: "qin-lake-wetland",
            title: { zh: "溱湖湿地" },
            summary: { zh: "湖泊、芦苇和湿地生境相互交织，也是溱潼会船等民俗发生的自然舞台。" },
            keywords: ["溱湖", "湿地", "溱潼"],
          },
          {
            id: "xinghua-raised-fields",
            title: { zh: "兴化垛田" },
            summary: { zh: "水面与垛田交错，春日油菜花铺展成独特的水上田园景观。" },
            keywords: ["兴化垛田", "千垛菜花", "里下河"],
          },
        ],
      },
      history: {
        intro: { zh: "海陵古城、盐运交通和文化名人共同构成泰州历史脉络。" },
        highlights: [
          {
            id: "ancient-hailing",
            title: { zh: "海陵古城" },
            summary: { zh: "古城河与老街保存州城空间记忆，也见证江淮之间的商贸往来。" },
            keywords: ["海陵", "古城河", "老街"],
          },
          {
            id: "mei-lanfang",
            title: { zh: "梅兰芳故里" },
            summary: { zh: "梅兰芳与京剧艺术成为泰州重要文化名片，相关纪念空间延续戏曲记忆。" },
            keywords: ["梅兰芳", "京剧", "戏曲"],
          },
        ],
      },
      heritage: {
        intro: { zh: "泰州非遗从船作、盆景到面塑和地方戏曲，紧贴水乡生产与日常生活。" },
        highlights: [
          {
            id: "wooden-boat-making",
            title: { zh: "兴化木船制造技艺" },
            summary: { zh: "选材、放样、拼板和捻缝等工序回应密集水网中的交通与生产需求。" },
            keywords: ["兴化木船", "船作", "水乡技艺"],
          },
          {
            id: "bonsai-and-folk-crafts",
            title: { zh: "扬派盆景与民间塑艺" },
            summary: { zh: "盆景、面塑、木雕和剪纸以细巧造型表现地方审美与节庆生活。" },
            keywords: ["扬派盆景", "姜堰面塑", "泰州木雕"],
          },
        ],
      },
      food: {
        intro: { zh: "泰州饮食以早茶、河鲜和细致面点见长，清鲜中带着水乡丰饶。" },
        highlights: [
          {
            id: "morning-tea-trio",
            title: { zh: "烫干丝、汤包与鱼汤面" },
            summary: { zh: "一细、一鲜、一暖构成泰州早茶最经典的味觉组合。" },
            keywords: ["烫干丝", "蟹黄汤包", "鱼汤面"],
          },
          {
            id: "waterside-flavours",
            title: { zh: "溱湖八鲜与兴化蟹" },
            summary: { zh: "湖荡水产随时令入席，展现里下河地区依水而食的传统。" },
            keywords: ["溱湖八鲜", "兴化大闸蟹", "河鲜"],
          },
        ],
      },
      waterways: {
        intro: { zh: "泰州通过通扬运河等河道连接大运河网络，凤城河和里下河水网则塑造古城生活。" },
        highlights: [
          {
            id: "fengcheng-river",
            title: { zh: "凤城河" },
            summary: { zh: "环绕古城的水系串联城河、桥梁与文化景点，是理解海陵空间的入口。" },
            keywords: ["凤城河", "古城河", "夜游"],
          },
          {
            id: "tongyang-canal-network",
            title: { zh: "通扬运河与里下河水网" },
            summary: { zh: "区域河道沟通扬州、南通与长江，支撑盐运、农业和水乡聚落。" },
            keywords: ["通扬运河", "里下河", "盐运"],
          },
        ],
      },
    }),
    media: [],
    sources: source(
      "江苏十三市文化资料库 · 泰州篇.docx",
      "依据原始 Word 正文 XML 提炼；该文件含一条无效的 NULL 媒体关系，后续完整导入需使用容错解析器。",
    ),
  },
  {
    ...cityIdentityBySlug.nantong,
    summary: { zh: "长江、黄海与通扬运河在南通交汇，江海风光与张謇开创的近代城市实践相互映照。" },
    searchTerms: {
      zh: ["濠河", "狼山", "张謇", "蓝印花布", "江海文化"],
      en: ["Hao River", "Langshan Hill", "Zhang Jian", "blue calico", "river-sea culture"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "南通位于长江入海口北岸，既是沿江港口城市，也是面向黄海的门户。" },
        highlights: [
          {
            id: "river-sea-gateway",
            title: { zh: "江海门户" },
            summary: { zh: "长江航运、海岸港口与平原河网共同塑造南通开放而务实的城市性格。" },
            keywords: ["长江入海口", "黄海", "港口"],
          },
          {
            id: "modern-first-city",
            title: { zh: "中国近代第一城" },
            summary: { zh: "张謇推动实业、教育、博物馆与公共建设，形成系统的近代城市实验。" },
            keywords: ["张謇", "近代实业", "城市建设"],
          },
        ],
      },
      nature: {
        intro: { zh: "南通的自然景观从长江岸线延伸到黄海滩涂，呈现山、江、海并见的格局。" },
        highlights: [
          {
            id: "langshan-hills",
            title: { zh: "狼山五山" },
            summary: { zh: "五山临江而立，登高可望长江奔海，是南通最鲜明的城市山水地标。" },
            keywords: ["狼山", "五山", "长江"],
          },
          {
            id: "coastal-wetlands",
            title: { zh: "江海湿地" },
            summary: { zh: "圆陀角、蛎岈山等海岸空间展现潮汐、滩涂与候鸟共同构成的滨海生态。" },
            keywords: ["圆陀角", "蛎岈山", "滨海湿地"],
          },
        ],
      },
      history: {
        intro: { zh: "南通历史叙事以江海开发、盐运交通和近代实业教育最具特色。" },
        highlights: [
          {
            id: "zhang-jian-practice",
            title: { zh: "张謇的城市实践" },
            summary: { zh: "大生纱厂、南通博物苑和教育设施记录实业救国与公共文化建设。" },
            keywords: ["张謇", "大生纱厂", "南通博物苑"],
          },
          {
            id: "jiang-hai-settlements",
            title: { zh: "江海聚落与盐运" },
            summary: { zh: "古镇、海堤和盐运河道反映沿海居民与潮水、土地和贸易长期互动。" },
            keywords: ["盐运", "古镇", "范公堤"],
          },
        ],
      },
      heritage: {
        intro: { zh: "纺织、风筝和刺绣是南通最有代表性的非遗表达，兼具实用与精巧审美。" },
        highlights: [
          {
            id: "blue-calico",
            title: { zh: "南通蓝印花布" },
            summary: { zh: "以防染版和靛蓝形成清爽纹样，曾广泛用于江海地区的衣被与日常织物。" },
            keywords: ["蓝印花布", "靛蓝", "防染"],
          },
          {
            id: "kite-and-embroidery",
            title: { zh: "板鹞风筝与仿真绣" },
            summary: { zh: "会发声的板鹞与追求绘画质感的刺绣，展现南通手艺的技术想象力。" },
            keywords: ["板鹞风筝", "仿真绣", "传统手工"],
          },
        ],
      },
      food: {
        intro: { zh: "江鲜、海味与地方糕点共同构成南通清鲜朴实的江海风味。" },
        highlights: [
          {
            id: "river-sea-seafood",
            title: { zh: "文蛤与江海鲜" },
            summary: { zh: "潮滩贝类、江鲜和海产随季节入菜，是南通依江靠海的直接味觉表达。" },
            keywords: ["文蛤", "江鲜", "海鲜"],
          },
          {
            id: "nantong-snacks",
            title: { zh: "西亭脆饼与董糖" },
            summary: { zh: "酥脆、香甜而便于保存的点心，延续市镇商旅和节令馈赠传统。" },
            keywords: ["西亭脆饼", "董糖", "糕点"],
          },
        ],
      },
      waterways: {
        intro: { zh: "通扬运河把大运河网络延伸至长江口，濠河与港口则展现城市水系的不同尺度。" },
        highlights: [
          {
            id: "tongyang-canal",
            title: { zh: "通扬运河" },
            summary: { zh: "古代盐运水道连接扬州与南通，近代又服务实业运输和江海河联运。" },
            keywords: ["通扬运河", "盐运", "江海河联运"],
          },
          {
            id: "hao-river",
            title: { zh: "濠河古护城河" },
            summary: { zh: "环抱老城的濠河保存城市防御格局，如今成为连接公共文化空间的水上环线。" },
            keywords: ["濠河", "护城河", "老城"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库 ·南通篇.docx"),
  },
  {
    ...cityIdentityBySlug.yancheng,
    summary: { zh: "黄海滩涂、候鸟迁徙与千年海盐生产共同塑造盐城，海岸生态和盐运记忆在这里交汇。" },
    searchTerms: {
      zh: ["黄海湿地", "丹顶鹤", "麋鹿", "海盐文化", "串场河"],
      en: ["Yellow Sea wetlands", "red-crowned crane", "milu deer", "sea-salt culture", "Chuanchang River"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "盐城古称盐渎，是全国唯一以“盐”命名的城市，拥有江苏最长的海岸线。" },
        highlights: [
          {
            id: "city-of-sea-salt",
            title: { zh: "煮海为盐" },
            summary: { zh: "盐场、灶民和盐运河道共同留下延续两千多年的海盐文化。" },
            keywords: ["海盐", "盐场", "灶民"],
          },
          {
            id: "wetland-city",
            title: { zh: "东方湿地之都" },
            summary: { zh: "世界自然遗产和自然保护区让生态保护成为盐城最重要的国际名片。" },
            keywords: ["东方湿地", "世界自然遗产", "生态保护"],
          },
        ],
      },
      nature: {
        intro: { zh: "潮汐、泥沙和候鸟迁徙塑造盐城辽阔而充满生命力的海岸景观。" },
        highlights: [
          {
            id: "yellow-sea-wetlands",
            title: { zh: "黄海湿地" },
            summary: { zh: "广阔滩涂是东亚—澳大利西亚候鸟迁飞路线上的关键栖息地。" },
            keywords: ["黄海湿地", "候鸟", "滩涂"],
          },
          {
            id: "cranes-and-milu",
            title: { zh: "丹顶鹤与麋鹿" },
            summary: { zh: "沿海保护区为珍稀动物提供栖息空间，也构成盐城独特的生态观察体验。" },
            keywords: ["丹顶鹤", "麋鹿", "自然保护区"],
          },
        ],
      },
      history: {
        intro: { zh: "海盐生产、沿海防护与红色记忆构成盐城历史的主要线索。" },
        highlights: [
          {
            id: "salt-industry-history",
            title: { zh: "海盐城镇" },
            summary: { zh: "“灶、团、仓、场”等地名记录盐业生产组织和沿海聚落的演变。" },
            keywords: ["盐业", "地名", "沿海聚落"],
          },
          {
            id: "new-fourth-army",
            title: { zh: "新四军记忆" },
            summary: { zh: "新四军重建军部等历史使盐城成为华中抗战和红色文化的重要坐标。" },
            keywords: ["新四军", "红色文化", "华中抗战"],
          },
        ],
      },
      heritage: {
        intro: { zh: "盐城非遗兼具海盐生产、里下河表演和沿海民俗特色。" },
        highlights: [
          {
            id: "sea-salt-making",
            title: { zh: "海盐制作技艺" },
            summary: { zh: "从晒制、煎煮到储运，传统工序保存沿海居民利用海水和滩涂的经验。" },
            keywords: ["海盐制作", "煮海", "盐业技艺"],
          },
          {
            id: "huai-opera",
            title: { zh: "淮剧与盐阜民间艺术" },
            summary: { zh: "淮剧以地方声腔讲述百姓故事，是盐阜地区重要的舞台传统。" },
            keywords: ["淮剧", "盐阜", "地方戏"],
          },
        ],
      },
      food: {
        intro: { zh: "海产、湖鲜与盐阜农家菜共同构成盐城咸鲜质朴的味觉。" },
        highlights: [
          {
            id: "salt-city-seafood",
            title: { zh: "黄海海鲜与湖荡河鲜" },
            summary: { zh: "鱼、虾、蟹、贝连接海岸与内河水网，是盐城餐桌最鲜明的物产基础。" },
            keywords: ["黄海海鲜", "河鲜", "水产"],
          },
          {
            id: "yancheng-snacks",
            title: { zh: "阜宁大糕与东台鱼汤面" },
            summary: { zh: "洁白软糯的糕点和汤白味鲜的面食，代表盐阜地区的节礼与早餐传统。" },
            keywords: ["阜宁大糕", "东台鱼汤面", "盐阜味道"],
          },
        ],
      },
      waterways: {
        intro: { zh: "串场河把沿海盐场接入通扬运河和大运河网络，是盐城最重要的历史水脉。" },
        highlights: [
          {
            id: "chuanchang-river",
            title: { zh: "串场河" },
            summary: { zh: "人工古河串联沿海盐场，曾承担淮盐外运，也持续服务灌溉、排涝和城市生态。" },
            keywords: ["串场河", "盐运", "母亲河"],
          },
          {
            id: "tongyu-canal",
            title: { zh: "通榆运河与内河水网" },
            summary: { zh: "现代航道与射阳河、蟒蛇河等共同构成纵横全境的水运和调蓄体系。" },
            keywords: ["通榆运河", "射阳河", "水网"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库・盐城篇.docx"),
  },
  {
    ...cityIdentityBySlug.huaian,
    summary: { zh: "淮河、运河与洪泽湖在淮安交织，漕运制度、水利工程和淮扬菜共同讲述一座枢纽城市。" },
    searchTerms: {
      zh: ["漕运", "洪泽湖", "河下古镇", "周恩来故里", "淮扬菜"],
      en: ["grain transport", "Hongze Lake", "Hexia Ancient Town", "Zhou Enlai", "Huaiyang cuisine"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "淮安位于江苏北部中心地域和秦岭—淮河地理分界线上，水系密集、南北文化交融。" },
        highlights: [
          {
            id: "canal-capital",
            title: { zh: "运河之都" },
            summary: { zh: "历代漕运、河工和城市商业在此汇聚，使淮安成为大运河中段的重要中心。" },
            keywords: ["运河之都", "漕运", "河工"],
          },
          {
            id: "north-south-culture",
            title: { zh: "南北交融" },
            summary: { zh: "方言、饮食、民居与水乡生活兼具江淮南北特征。" },
            keywords: ["秦岭淮河", "江淮", "文化交融"],
          },
        ],
      },
      nature: {
        intro: { zh: "湖泊、河道与湿地共同构成淮安开阔平缓的水乡生态。" },
        highlights: [
          {
            id: "hongze-lake",
            title: { zh: "洪泽湖与大堤" },
            summary: { zh: "大湖、水岸与历史大堤共同展现蓄洪、航运和渔业并存的景观。" },
            keywords: ["洪泽湖", "洪泽湖大堤", "湖泊"],
          },
          {
            id: "li-canal-landscape",
            title: { zh: "里运河水城景观" },
            summary: { zh: "里运河串联清江浦、古闸与滨水公共空间，让漕运遗产融入当代城市。" },
            keywords: ["里运河", "清江浦", "滨水景观"],
          },
        ],
      },
      history: {
        intro: { zh: "古城、漕运衙署、名人故里和红色记忆构成淮安厚重的历史层次。" },
        highlights: [
          {
            id: "grain-transport-administration",
            title: { zh: "漕运总督与府城" },
            summary: { zh: "漕运总督部院、淮安府署等遗存展现明清时期国家治理与漕粮管理。" },
            keywords: ["漕运总督", "淮安府署", "国家治理"],
          },
          {
            id: "zhou-enlai-hometown",
            title: { zh: "周恩来故里" },
            summary: { zh: "故居、纪念馆和驸马巷等空间共同构成淮安重要的近现代文化地标。" },
            keywords: ["周恩来", "故里", "纪念馆"],
          },
        ],
      },
      heritage: {
        intro: { zh: "淮安非遗可听、可看、可品，地方戏、锣鼓与湖区表演都带有鲜明水乡气息。" },
        highlights: [
          {
            id: "huaihai-opera",
            title: { zh: "淮海戏" },
            summary: { zh: "质朴热烈的地方声腔讲述苏北生活，也被称为带有乡土气息的“拉魂腔”。" },
            keywords: ["淮海戏", "拉魂腔", "地方戏"],
          },
          {
            id: "shifan-and-fishing-drum",
            title: { zh: "楚州十番锣鼓与洪泽湖渔鼓" },
            summary: { zh: "鼓乐和船上表演把节庆、劳动与水域生活连接起来。" },
            keywords: ["十番锣鼓", "洪泽湖渔鼓", "民间音乐"],
          },
        ],
      },
      food: {
        intro: { zh: "淮安是淮扬菜重要发源地之一，河湖物产、精细刀工与清鲜口味相互成就。" },
        highlights: [
          {
            id: "huaiyang-cuisine",
            title: { zh: "淮扬菜" },
            summary: { zh: "讲究本味、火候和刀工，连接漕运带来的食材交流与宴席传统。" },
            keywords: ["淮扬菜", "美食之都", "刀工"],
          },
          {
            id: "huaian-classics",
            title: { zh: "软兜长鱼与平桥豆腐" },
            summary: { zh: "鳝鱼与豆腐等常见食材经细致处理，成为淮安最具代表性的地方菜。" },
            keywords: ["软兜长鱼", "平桥豆腐", "淮安味道"],
          },
        ],
      },
      waterways: {
        intro: { zh: "淮安处于黄、淮、运历史关系最复杂的区域之一，是运河航行和水利治理的关键节点。" },
        highlights: [
          {
            id: "qingkou-hub",
            title: { zh: "清口水利枢纽" },
            summary: { zh: "堤防、闸坝和引河协调复杂水势，体现古代保障漕运的工程智慧。" },
            keywords: ["清口枢纽", "水利工程", "黄淮运"],
          },
          {
            id: "grain-transport-hub",
            title: { zh: "漕运中枢" },
            summary: { zh: "仓储、转运和管理机构沿运河布局，使淮安成为全国漕粮体系的控制节点。" },
            keywords: ["漕运", "清江浦", "中国漕运博物馆"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库·淮安篇.docx"),
  },
  {
    ...cityIdentityBySlug.suqian,
    summary: { zh: "骆马湖、洪泽湖与中运河环抱宿迁，楚汉记忆、酿酒传统和湖区生活共同塑造城市气质。" },
    searchTerms: {
      zh: ["项羽", "骆马湖", "皂河古镇", "洋河酒", "中运河"],
      en: ["Xiang Yu", "Luoma Lake", "Zaohe Ancient Town", "Yanghe spirits", "Middle Canal"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "宿迁位于江苏北部，常以项王故里、中国酒都和水润之城三张名片展示自己。" },
        highlights: [
          {
            id: "three-city-identities",
            title: { zh: "三张城市名片" },
            summary: { zh: "楚汉英雄、名酒产业与湖河生态分别对应宿迁的历史、产业和自然底色。" },
            keywords: ["项王故里", "中国酒都", "水润之城"],
          },
          {
            id: "two-lakes-two-rivers",
            title: { zh: "两湖两河" },
            summary: { zh: "骆马湖、洪泽湖以及大运河、古黄河共同构成宿迁水系骨架。" },
            keywords: ["骆马湖", "洪泽湖", "古黄河"],
          },
        ],
      },
      nature: {
        intro: { zh: "大湖、湿地、森林与花海让宿迁兼具开阔水景和四季生态体验。" },
        highlights: [
          {
            id: "luoma-lake",
            title: { zh: "骆马湖" },
            summary: { zh: "开阔湖面、沙滩与渔业物产构成宿迁北部最具代表性的水域景观。" },
            keywords: ["骆马湖", "湖景", "渔业"],
          },
          {
            id: "wetlands-and-flower-fields",
            title: { zh: "洪泽湖湿地与三台山" },
            summary: { zh: "湖湾芦苇、候鸟栖息地和衲田花海共同展示水润城市的生态层次。" },
            keywords: ["洪泽湖湿地", "三台山", "衲田花海"],
          },
        ],
      },
      history: {
        intro: { zh: "楚汉英雄记忆、运河古镇与酒业发展构成宿迁历史文化的主轴。" },
        highlights: [
          {
            id: "xiang-yu",
            title: { zh: "项羽与下相" },
            summary: { zh: "项羽故里叙事把宿迁与楚汉历史相连，成为城市最鲜明的人文符号。" },
            keywords: ["项羽", "下相", "楚汉文化"],
          },
          {
            id: "zaohe-town",
            title: { zh: "皂河古镇" },
            summary: { zh: "古镇、码头和行宫共同保存运河市镇、河工治理与南巡交通的记忆。" },
            keywords: ["皂河古镇", "乾隆行宫", "运河市镇"],
          },
        ],
      },
      heritage: {
        intro: { zh: "酿造、鼓书、戏曲和渔鼓展现宿迁从粮食生产到湖区娱乐的生活传统。" },
        highlights: [
          {
            id: "yanghe-brewing",
            title: { zh: "洋河酒酿造技艺" },
            summary: { zh: "粮、水、曲和窖池共同形成绵柔酒体，连接地方农业、手艺和产业品牌。" },
            keywords: ["洋河酒", "酿造", "中国酒都"],
          },
          {
            id: "drum-and-opera",
            title: { zh: "苏北大鼓、泗州戏与渔鼓" },
            summary: { zh: "说唱、戏曲和湖上表演以乡音记录百姓故事与水域生活。" },
            keywords: ["苏北大鼓", "泗州戏", "洪泽湖渔鼓"],
          },
        ],
      },
      food: {
        intro: { zh: "宿迁味道来自湖鲜、平原粮食、羊肉与酒，呈现苏北饮食的质朴丰盛。" },
        highlights: [
          {
            id: "lake-fresh-food",
            title: { zh: "骆马湖鲜" },
            summary: { zh: "鱼、虾、蟹等湖产依时令入菜，体现宿迁围湖而居的饮食传统。" },
            keywords: ["骆马湖鲜", "鱼", "湖区饮食"],
          },
          {
            id: "northern-jiangsu-table",
            title: { zh: "苏北面点、羊肉与酒" },
            summary: { zh: "朴实面食、暖香羊肉和本地白酒构成宴席与日常餐桌的地域组合。" },
            keywords: ["羊肉", "面点", "白酒"],
          },
        ],
      },
      waterways: {
        intro: { zh: "中运河与皂河节点把宿迁纳入大运河世界遗产体系，也连接湖泊、古镇和城市生活。" },
        highlights: [
          {
            id: "middle-canal",
            title: { zh: "中运河宿迁段" },
            summary: { zh: "作为大运河遗产河段，它延续航运功能，也串联沿岸聚落与生态景观。" },
            keywords: ["中运河", "世界遗产", "航运"],
          },
          {
            id: "dragon-king-temple",
            title: { zh: "龙王庙行宫" },
            summary: { zh: "祭祀水神、河工治理与帝王南巡记忆在皂河运河节点交汇。" },
            keywords: ["龙王庙行宫", "水神信仰", "河工"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库·宿迁篇.docx"),
  },
  {
    ...cityIdentityBySlug.xuzhou,
    summary: { zh: "徐州处在南北交通要冲，汉代文化、黄运交汇和雄浑山水共同形成不同于江南的江苏气质。" },
    searchTerms: {
      zh: ["彭城", "汉文化", "云龙湖", "柳琴戏", "地锅鸡"],
      en: ["Pengcheng", "Han culture", "Yunlong Lake", "Liuqin opera", "pot-stewed chicken"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "徐州古称彭城，位于江苏西北部，是连接多省的交通门户和汉文化重镇。" },
        highlights: [
          {
            id: "five-province-crossroads",
            title: { zh: "五省通衢" },
            summary: { zh: "南北铁路、水运与古代驿路在此交汇，形成开放而强健的城市性格。" },
            keywords: ["五省通衢", "交通枢纽", "苏北"],
          },
          {
            id: "han-culture-city",
            title: { zh: "彭城汉韵" },
            summary: { zh: "汉墓、汉画像石和兵马俑等遗存集中呈现两汉历史与艺术。" },
            keywords: ["彭城", "汉文化", "汉画像石"],
          },
        ],
      },
      nature: {
        intro: { zh: "徐州山湖相依，采煤塌陷地生态修复也让工业空间转化为新的湿地景观。" },
        highlights: [
          {
            id: "yunlong-lake",
            title: { zh: "云龙湖与云龙山" },
            summary: { zh: "湖面、低山与城市相接，是徐州最具代表性的山水休闲空间。" },
            keywords: ["云龙湖", "云龙山", "城市山水"],
          },
          {
            id: "panan-lake",
            title: { zh: "潘安湖湿地" },
            summary: { zh: "由采煤塌陷地修复而来的湖泊湿地，展示工业地区的生态更新。" },
            keywords: ["潘安湖", "湿地", "生态修复"],
          },
        ],
      },
      history: {
        intro: { zh: "楚汉风云、军事要冲和黄河运河变迁共同构成徐州厚重雄浑的历史。" },
        highlights: [
          {
            id: "han-dynasty-heritage",
            title: { zh: "两汉文化遗存" },
            summary: { zh: "楚王陵、汉兵马俑与画像石从制度、生活和艺术多个角度呈现汉代文明。" },
            keywords: ["楚王陵", "汉兵马俑", "画像石"],
          },
          {
            id: "strategic-city",
            title: { zh: "兵家必争之地" },
            summary: { zh: "地处南北要冲使徐州屡次成为重大历史事件和交通格局变化的中心。" },
            keywords: ["军事要冲", "彭城", "交通史"],
          },
        ],
      },
      heritage: {
        intro: { zh: "徐州非遗兼具北方力量感与苏北乡土气息，表现在戏曲、剪纸和民间工艺中。" },
        highlights: [
          {
            id: "liuqin-opera",
            title: { zh: "柳琴戏" },
            summary: { zh: "高亢活泼的地方戏曲以柳叶琴伴奏，广泛流传于苏鲁豫皖交界地区。" },
            keywords: ["柳琴戏", "地方戏", "柳叶琴"],
          },
          {
            id: "xuzhou-paper-cutting",
            title: { zh: "徐州剪纸与香包" },
            summary: { zh: "强烈构图、吉祥纹样与节令佩饰共同体现苏北民间审美。" },
            keywords: ["徐州剪纸", "香包", "民间美术"],
          },
        ],
      },
      food: {
        intro: { zh: "徐州饮食受中原、鲁南和苏北共同影响，味道浓郁、分量实在。" },
        highlights: [
          {
            id: "sha-soup",
            title: { zh: "饣它汤与早餐" },
            summary: { zh: "胡椒暖香的汤羹常配油条、煎包，是徐州清晨极有辨识度的味道。" },
            keywords: ["饣它汤", "早餐", "胡椒"],
          },
          {
            id: "xuzhou-hearty-food",
            title: { zh: "地锅鸡与把子肉" },
            summary: { zh: "锅边饼、浓香肉菜和酱汁体现北方饮食的豪爽与烟火气。" },
            keywords: ["地锅鸡", "把子肉", "苏北菜"],
          },
        ],
      },
      waterways: {
        intro: { zh: "黄河故道、京杭大运河与微山湖水系在徐州附近交织，形成重要的黄运交汇节点。" },
        highlights: [
          {
            id: "yellow-river-canal",
            title: { zh: "黄运交汇" },
            summary: { zh: "历史黄河与运河关系不断变化，深刻影响徐州航运、防洪和城市发展。" },
            keywords: ["黄河故道", "京杭大运河", "黄运交汇"],
          },
          {
            id: "canal-portals",
            title: { zh: "苏北运河门户" },
            summary: { zh: "河道和湖区连接山东与江苏，使徐州成为漕运和南北物资交流的重要门户。" },
            keywords: ["苏北运河", "漕运", "南北交通"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库·徐州篇.docx"),
  },
  {
    ...cityIdentityBySlug.lianyungang,
    summary: { zh: "云台山、海州湾与现代港口相依，西游传说、海洋文化和大陆桥共同定义连云港。" },
    searchTerms: {
      zh: ["花果山", "海州湾", "连岛", "西游记", "东海水晶"],
      en: ["Huaguo Mountain", "Haizhou Bay", "Lian Island", "Journey to the West", "Donghai crystal"],
    },
    sections: citySections({
      overview: {
        intro: { zh: "连云港位于中国沿海中部，山、海、港、城相依，也是新亚欧大陆桥东方起点。" },
        highlights: [
          {
            id: "mountain-sea-port-city",
            title: { zh: "山海港城" },
            summary: { zh: "云台山脉、海州湾岛屿与深水港口在同一城市景观中相互叠加。" },
            keywords: ["云台山", "海州湾", "港口"],
          },
          {
            id: "east-bridgehead",
            title: { zh: "大陆桥东方桥头堡" },
            summary: { zh: "铁路、港口和国际班列把连云港连接至中亚与欧洲，延续海陆转运功能。" },
            keywords: ["新亚欧大陆桥", "国际班列", "港口"],
          },
        ],
      },
      nature: {
        intro: { zh: "连云港是江苏少见的山海相拥之地，海岛、沙湾、石林和低山共同构成多样景观。" },
        highlights: [
          {
            id: "huaguo-and-yuntai",
            title: { zh: "花果山与云台山" },
            summary: { zh: "江苏高峰、山林石景和海雾共同形成“东海第一胜境”的山地体验。" },
            keywords: ["花果山", "云台山", "玉女峰"],
          },
          {
            id: "lian-island-coast",
            title: { zh: "连岛与海州湾" },
            summary: { zh: "沙滩、基岩海岸、渔村和潮间带共同展现江苏海岸少见的山海风光。" },
            keywords: ["连岛", "海州湾", "苏马湾"],
          },
        ],
      },
      history: {
        intro: { zh: "古海州、海上交通与现代开放港口构成连云港跨越陆海的历史。" },
        highlights: [
          {
            id: "ancient-haizhou",
            title: { zh: "古海州" },
            summary: { zh: "秦汉郡县、古代盐铁与海路交流留下遗址、摩崖造像和古城记忆。" },
            keywords: ["海州", "孔望山", "盐铁"],
          },
          {
            id: "modern-open-port",
            title: { zh: "现代开放港" },
            summary: { zh: "港口建设和沿海开放使连云港成为连接内陆与世界的重要海运门户。" },
            keywords: ["连云港港", "沿海开放", "海运"],
          },
        ],
      },
      heritage: {
        intro: { zh: "西游叙事、海州民俗和东海手艺共同构成连云港富有山海想象力的非遗表达。" },
        highlights: [
          {
            id: "journey-west-traditions",
            title: { zh: "西游文化民俗" },
            summary: { zh: "花果山传说、猴戏和相关节庆把古典文学转化为地方表演与公共文化。" },
            keywords: ["西游记", "花果山", "猴戏"],
          },
          {
            id: "donghai-crystal",
            title: { zh: "东海水晶雕刻" },
            summary: { zh: "依托水晶资源形成选料、切磨和雕刻技艺，是东海县重要工艺名片。" },
            keywords: ["东海水晶", "水晶雕刻", "工艺"],
          },
        ],
      },
      food: {
        intro: { zh: "海州湾海鲜、苏北面饼和山地物产共同构成连云港鲜、香、质朴的味道。" },
        highlights: [
          {
            id: "seafood-and-pancake",
            title: { zh: "海鲜与小鱼煎饼" },
            summary: { zh: "梭子蟹、对虾等海产与薄煎饼结合，呈现渔港日常和苏北饮食方式。" },
            keywords: ["海鲜", "小鱼煎饼", "梭子蟹"],
          },
          {
            id: "local-specialties",
            title: { zh: "灌云豆丹与花果山风鹅" },
            summary: { zh: "独特昆虫食材与传统风干鹅体现当地物产利用和保存技艺。" },
            keywords: ["灌云豆丹", "花果山风鹅", "地方特产"],
          },
        ],
      },
      waterways: {
        intro: { zh: "连云港不在大运河主航道上，却通过盐河、内河航道和海港连接淮河流域与海上交通。" },
        highlights: [
          {
            id: "salt-river-network",
            title: { zh: "盐河与内河航道" },
            summary: { zh: "区域河道承担盐运、灌溉与物资转运，把古海州接入苏北水运网络。" },
            keywords: ["盐河", "内河航道", "盐运"],
          },
          {
            id: "sea-land-transport",
            title: { zh: "海陆联运" },
            summary: { zh: "现代港口承接铁路与海运，让历史上的水上门户转化为国际物流节点。" },
            keywords: ["连云港港", "海陆联运", "物流"],
          },
        ],
      },
    }),
    media: [],
    sources: source("江苏十三市文化资料库·连云港.docx"),
  },
];

export const cities: City[] = applyCityEnglish(cityChineseContent);

export const cityBySlug = new Map(cities.map((city) => [city.slug, city]));

export function getCityBySlug(slug: string) {
  return cityBySlug.get(slug as City["slug"]);
}
