import type { City, CityDraft, CitySectionId, CitySlug } from "@/types/city";

type HighlightEnglish = {
  title: string;
  summary: string;
};

type SectionEnglish = {
  intro: string;
  highlights: Record<string, HighlightEnglish>;
};

type CityEnglish = {
  summary: string;
  sections: Record<CitySectionId, SectionEnglish>;
};

/**
 * Audience-facing English written for international students. Stable highlight
 * IDs keep this layer aligned with the Chinese archive and future RAG chunks.
 */
export const cityEnglishContent: Record<CitySlug, CityEnglish> = {
  nanjing: {
    summary:
      "The Yangtze and Qinhuai rivers have shaped a capital where Six Dynasties history, the Ming city wall and modern memory remain layered across the city.",
    sections: {
      overview: {
        intro:
          "Built between hills, rivers and lakes, Nanjing is Jiangsu's capital and an ideal starting point for exploring Yangtze civilisation and China's historic capitals.",
        highlights: {
          "capital-of-six-dynasties": {
            title: "Capital of the Six Dynasties",
            summary:
              "Several dynasties established their capitals here. Purple Mountain, Stone City and the old urban plan still define the historical geography of Jinling.",
          },
          "qinhuai-city-image": {
            title: "Life along the Qinhuai River",
            summary:
              "The Confucius Temple, former examination halls, Wuyi Lane and evening boat rides form Nanjing's most recognisable cultural landscape.",
          },
        },
      },
      nature: {
        intro:
          "Mountains, the Yangtze, lakes and the city meet closely in Nanjing, combining former imperial waterscapes with wooded hills and broad riverfronts.",
        highlights: {
          "xuanwu-lake": {
            title: "Xuanwu Lake",
            summary:
              "Five linked islands, seasonal planting and views of the old city skyline make this former imperial lake one of Nanjing's defining landscapes.",
          },
          "zhongshan-scenery": {
            title: "Purple Mountain",
            summary:
              "Woodland, mausoleums and historic temples gather around Purple Mountain, the heart of Nanjing's celebrated mountain setting.",
          },
        },
      },
      history: {
        intro:
          "From Jiankang of the Six Dynasties to the Ming capital and major sites of modern history, Nanjing preserves an unusually continuous urban story.",
        highlights: {
          "ming-capital": {
            title: "Ming capital and city wall",
            summary:
              "Nanjing was rebuilt as an imperial capital in the early Ming. Its surviving walls and gates still reveal the scale and skill of that undertaking.",
          },
          "modern-history": {
            title: "Landmarks of modern history",
            summary:
              "Museums, former institutions and historic districts across Nanjing preserve pivotal chapters of China's nineteenth- and twentieth-century history.",
          },
        },
      },
      heritage: {
        intro:
          "Nanjing's living heritage ranges from courtly design and precision craft to traditions rooted in ordinary urban life.",
        highlights: {
          "yunjin-brocade": {
            title: "Nanjing Yunjin brocade",
            summary:
              "Woven by hand on traditional wooden looms, Yunjin is known for elaborate patterns, complex techniques and a luminous, cloud-like finish.",
          },
          "jinling-crafts": {
            title: "Jinling sutra printing and gold leaf",
            summary:
              "Woodblock printing and hand-beaten gold leaf continue exacting craft traditions linked to religious publishing, architecture and everyday objects.",
          },
        },
      },
      food: {
        intro:
          "Duck dishes and Qinhuai snacks give Nanjing its clearest culinary identity, carrying the flavours and memories of neighbourhood streets.",
        highlights: {
          "salted-duck": {
            title: "Nanjing salted duck",
            summary:
              "Tender, pale-skinned and delicately savoury, salted duck is equally at home at a banquet or on an everyday family table.",
          },
          "qinhuai-snacks": {
            title: "Duck-blood vermicelli and Qinhuai snacks",
            summary:
              "Duck-blood vermicelli soup, beef pot stickers, rice cakes and tea snacks capture the lively flavour of Nanjing's lanes.",
          },
        },
      },
      waterways: {
        intro:
          "Although Nanjing lies away from the Grand Canal's main channel, the Qinhuai, Xu and Yanzhi rivers connect it to the wider canal network.",
        highlights: {
          "qinhuai-waterway": {
            title: "The Qinhuai urban waterway",
            summary:
              "Once a transport route, the Qinhuai also links city gates, markets and cultural landmarks into a living timeline of Nanjing.",
          },
          "ancient-canals": {
            title: "The Xu and Yanzhi rivers",
            summary:
              "Ancient engineered waterways linked Lake Tai, southern Anhui and the Yangtze, revealing Nanjing's wider role in regional water transport.",
          },
        },
      },
    },
  },
  suzhou: {
    summary:
      "Canals, the old city, waterside lanes and classical gardens create Suzhou's distinctive Jiangnan order, where traditional life still unfolds between streets and waterways.",
    sections: {
      overview: {
        intro:
          "With Shanghai to the east and Lake Tai to the west, Suzhou's old city retains a double grid of parallel streets and canals.",
        highlights: {
          "ancient-city-grid": {
            title: "A double grid of land and water",
            summary:
              "Canals, lanes and city gates interlock in an urban pattern that has endured for more than 2,500 years.",
          },
          "gardens-and-lanes": {
            title: "Gardens and waterside lanes",
            summary:
              "The intimate scale of classical gardens and canal streets such as Pingjiang Road presents a Jiangnan way of life designed for both living and wandering.",
          },
        },
      },
      nature: {
        intro:
          "Lake Tai, wetland waterways and gardens within the city give Suzhou a subtle but richly layered natural setting.",
        highlights: {
          "taihu-landscape": {
            title: "Lake Tai landscapes",
            summary:
              "The Dongshan and Xishan peninsulas, bays and islands open onto wide waters while supporting tea, fruit, fishing and village traditions.",
          },
          "classical-gardens": {
            title: "Classical Gardens of Suzhou",
            summary:
              "Gardens such as the Humble Administrator's Garden and Lingering Garden compress mountains and water into intimate spaces; several are UNESCO World Heritage sites.",
          },
        },
      },
      history: {
        intro:
          "Wu culture, ancient city planning and canal commerce have sustained Suzhou's cultural life across the centuries.",
        highlights: {
          "wu-culture": {
            title: "An ancient city of Wu culture",
            summary:
              "Memories of King Helü's city, historic gates and the moat provide important clues to Suzhou's early urban civilisation.",
          },
          "jiangnan-learning": {
            title: "Jiangnan traditions of learning",
            summary:
              "Academies, private libraries, painting, calligraphy and craft converged in gardens and lanes to shape Suzhou's refined urban culture.",
          },
        },
      },
      heritage: {
        intro:
          "Suzhou turns Jiangnan aesthetics into traditions that can be heard, seen and touched through performance, embroidery and printmaking.",
        highlights: {
          "kunqu-and-pingtan": {
            title: "Kunqu opera and Suzhou pingtan",
            summary:
              "Kunqu's flowing vocal style and pingtan's Wu-dialect storytelling carry classical literature and local tales through music and voice.",
          },
          "embroidery-and-prints": {
            title: "Suzhou embroidery and Taohuawu woodblock prints",
            summary:
              "Fine stitching and layered colour printing represent two sides of Suzhou craft: meticulous workmanship and vivid popular imagery.",
          },
        },
      },
      food: {
        intro:
          "Suzhou cooking follows the seasons closely. Lake produce, noodles and rice pastries express the gentle sweet-and-savoury balance of Jiangnan cuisine.",
        highlights: {
          "squirrel-mandarin-fish": {
            title: "Squirrel-shaped mandarin fish",
            summary:
              "Precise knife work shapes the fish before frying and saucing, producing a crisp texture and its famous dramatic form.",
          },
          "seasonal-suzhou-flavours": {
            title: "Seasonal noodles, pastries and lake produce",
            summary:
              "Fengzhen pork noodles, Dafang rice cakes, Fuli duck and Yangcheng Lake produce form a culinary calendar that changes with the season.",
          },
        },
      },
      waterways: {
        intro:
          "The Suzhou section of the Grand Canal joins Lake Tai, the moat and the old city's dense canal network; water is the city's basic structure.",
        highlights: {
          "canal-through-suzhou": {
            title: "The canal around the old city",
            summary:
              "Grand Canal waters flow into the moat and inner waterways, making Suzhou an unusually complete example of a historic canal city.",
          },
          "canal-ten-scenes": {
            title: "Ten scenes along the canal",
            summary:
              "Wangting, Xushuguan, Fengqiao, Pingjiang, Panmen and Baodai Bridge form a cultural route across the wider city.",
          },
        },
      },
    },
  },
  wuxi: {
    summary:
      "Lake Tai, the Grand Canal and the Yangtze system meet around Wuxi, linking waterside neighbourhoods, Wu-region crafts and the story of modern industry.",
    sections: {
      overview: {
        intro:
          "Wuxi occupies the corridor between river and lake. The Grand Canal crosses the city, long known for fertile farmland and pioneering modern enterprise.",
        highlights: {
          "three-waters-meet": {
            title: "Where river, lake and canal meet",
            summary:
              "The Yangtze, Lake Tai and the Grand Canal have shaped Wuxi's transport, produce and everyday life.",
          },
          "industrial-city": {
            title: "A centre of Jiangnan enterprise",
            summary:
              "Rice markets, silk production and Chinese-owned industries grew beside the canal, leaving factories, wharves and stories of industrial pioneers.",
          },
        },
      },
      nature: {
        intro:
          "Lake Tai gives Wuxi its strongest natural identity, with bays, islands and wooded hills creating broad, open Jiangnan scenery.",
        highlights: {
          "yuantouzhu": {
            title: "Yuantouzhu",
            summary:
              "This peninsula reaching into Lake Tai is known for expansive lake views and spring cherry blossom, making it a classic place to experience the lake.",
          },
          "lihu-and-huishan": {
            title: "Lihu Lake and Huishan",
            summary:
              "The urban shore of Lihu and the springs of Huishan Ancient Town connect gardens, wetlands and historic sites.",
          },
        },
      },
      history: {
        intro:
          "The legacy of Taibo and Wu culture, canal trade and modern industry forms the three main strands of Wuxi's history.",
        highlights: {
          "wu-culture-origin": {
            title: "Taibo and the origins of Wu culture",
            summary:
              "Stories associated with Meili and the Bodu River preserve memories of early settlement and the beginnings of Wu culture in Jiangnan.",
          },
          "modern-industry": {
            title: "The rise of modern industry",
            summary:
              "Grain transport, silk reeling and canal-side factories made Wuxi one of China's leading centres of modern private enterprise.",
          },
        },
      },
      heritage: {
        intro:
          "Wuxi's living heritage ranges from vivid folk figures to finely controlled work in clay, bamboo, silk and pottery.",
        highlights: {
          "huishan-clay-figurines": {
            title: "Huishan clay figurines",
            summary:
              "Expressive forms and bright colours portray local characters and customs, giving this folk art a lively, everyday quality.",
          },
          "yixing-zisha": {
            title: "Yixing zisha pottery",
            summary:
              "Hand-shaped from local clay, zisha ware combines practical tea making with the aesthetics of Chinese scholars.",
          },
        },
      },
      food: {
        intro:
          "Wuxi cuisine is known for its rich sweet-savoury character, bringing together Lake Tai produce and carefully made pastries and dumplings.",
        highlights: {
          "wuxi-ribs-and-xiaolong": {
            title: "Braised spare ribs and Wuxi xiaolongbao",
            summary:
              "Glossy braised ribs and soup-filled dumplings with a gentle sweetness are two of Wuxi's most recognisable classics.",
          },
          "taihu-flavours": {
            title: "The Three Whites of Lake Tai and fried gluten",
            summary:
              "Fresh lake produce and wheat-gluten dishes show the Jiangnan preference for seasonal ingredients and delicate preparation.",
          },
        },
      },
      waterways: {
        intro:
          "Wuxi is a classic canal city, with the ancient waterway crossing its centre and still linking neighbourhoods, bridges and industrial heritage.",
        highlights: {
          "qingming-bridge": {
            title: "Qingming Bridge canal district",
            summary:
              "Nanchang Street, Qingming Bridge and the ancient canal preserve a waterside pattern in which streets and waterways run side by side.",
          },
          "bodu-river": {
            title: "Bodu River",
            summary:
              "Traditionally attributed to Taibo, this ancient waterway linked Wuxi and Suzhou and remains part of Wu culture's hydraulic memory.",
          },
        },
      },
    },
  },
  changzhou: {
    summary:
      "Changzhou grew with the canal. Old lanes, the legacy of Su Dongpo, meticulous crafts and unpretentious snacks give the city its distinct Jiangnan character.",
    sections: {
      overview: {
        intro:
          "In the northwest of the Lake Tai plain, Changzhou has long served as a canal port connecting Suzhou and Wuxi with Nanjing.",
        highlights: {
          "canal-port": {
            title: "A historic canal port",
            summary:
              "Wharves, grain transport and workshops once gathered along the water, shaping the commercial life of the old city.",
          },
          "qingguo-lane": {
            title: "The culture of Qingguo Lane",
            summary:
              "This historic district grew beside a canal branch and preserves former residences, traditional homes and intimate Jiangnan lanes.",
          },
        },
      },
      nature: {
        intro:
          "Lakes, wetlands and low hills extend Changzhou's landscape from the Jiangnan water towns into the hill country of southern Jiangsu.",
        highlights: {
          "tianmu-lake": {
            title: "Tianmu Lake",
            summary:
              "Lake coves, bamboo forests and low mountains create Liyang's best-known landscape for outdoor recreation.",
          },
          "gehu-wetlands": {
            title: "Gehu Lake and wetland waterways",
            summary:
              "Lakes and river networks in southeastern Changzhou continue the water-rich ecology of the Lake Tai plain.",
          },
        },
      },
      history: {
        intro:
          "Memories of the Wu region, the changing canal city and generations of writers are woven through Changzhou's history.",
        highlights: {
          "three-wu-history": {
            title: "A crossroads of the Three Wu",
            summary:
              "Located on a key Jiangnan route, Changzhou has long brought together government, commerce and cultural exchange.",
          },
          "dongpo-memory": {
            title: "Su Dongpo's final home",
            summary:
              "The poet Su Shi visited Changzhou repeatedly and spent his final days here; Yizhou Pavilion and other sites preserve that connection.",
          },
        },
      },
      heritage: {
        intro:
          "Changzhou crafts depend on careful handling of materials, blades and stitches, serving everyday needs while reaching a high level of artistic refinement.",
        highlights: {
          "combs-and-bamboo-carving": {
            title: "Changzhou combs and liuqing bamboo carving",
            summary:
              "Fine comb making and shallow carving on bamboo skin reveal a shared attention to detail, texture and touch.",
          },
          "random-stitch-embroidery": {
            title: "Random-stitch embroidery",
            summary:
              "Crossing coloured threads build light and volume in this modern embroidery technique, often described as painting with a needle.",
          },
        },
      },
      food: {
        intro:
          "Changzhou food combines the substance of a port-city breakfast with the refinement of Jiangnan pastry.",
        highlights: {
          "sesame-cake-breakfast": {
            title: "Sesame cake and tofu soup",
            summary:
              "A crisp, filling sesame cake served with hot tofu soup makes a distinctly local and deeply everyday breakfast.",
          },
          "changzhou-seasonal-food": {
            title: "Crab xiaolongbao and fish-head casserole",
            summary:
              "Autumn crab and Tianmu Lake fish show how Changzhou's flavours follow both season and waterscape.",
          },
        },
      },
      waterways: {
        intro:
          "The ancient canal changed course several times while continually shaping central Changzhou; nearby lanes retain memories of trade, bridges and literary life.",
        highlights: {
          "old-canal-city": {
            title: "The ancient canal through the city",
            summary:
              "The old waterway links Qingguo Lane, Biji Lane and other historic places, tracing Changzhou's journey from canal port to modern city.",
          },
          "yizhou-pavilion": {
            title: "Yizhou Pavilion and Su Dongpo's water route",
            summary:
              "Sites associated with Su Dongpo connect the canal, literary memory and public gardens along the water.",
          },
        },
      },
    },
  },
  zhenjiang: {
    summary:
      "Where the Yangtze meets the Grand Canal, Zhenjiang's Jinshan, Jiaoshan and Beigushan hills and the old Xijin Ferry record centuries of river travel and Jingkou culture.",
    sections: {
      overview: {
        intro:
          "On the southern bank of the lower Yangtze, Zhenjiang has long been a gateway where river and canal traffic changed course and moved between land and water.",
        highlights: {
          "river-canal-crossroads": {
            title: "Crossroads of river and canal",
            summary:
              "The Grand Canal reaches the Yangtze here, giving Zhenjiang a lasting role in ferry crossings, cargo transfer and river defence.",
          },
          "jingkou-three-hills": {
            title: "The three hills of Jingkou",
            summary:
              "Jinshan, Jiaoshan and Beigushan face one another along the Yangtze and define Zhenjiang's landscape and cultural imagination.",
          },
        },
      },
      nature: {
        intro:
          "Zhenjiang is known for the close meeting of river and hills, with island peaks, riverbanks, lakes and wetlands creating varied scenery.",
        highlights: {
          "jinshan-and-jiaoshan": {
            title: "Jinshan and Jiaoshan",
            summary:
              "Jinshan is famous for a temple complex that seems to wrap around the hill, while wooded Jiaoshan rises as an island in the Yangtze.",
          },
          "chishan-lake": {
            title: "Chishan Lake Wetland",
            summary:
              "Red-toned hills, open water and wetland flats meet in an important ecological and water-management area in the upper Qinhuai basin.",
          },
        },
      },
      history: {
        intro:
          "The Jingkou stronghold, Yangtze ferries and generations of poetry and legend form the main threads of Zhenjiang's history.",
        highlights: {
          "jingkou-history": {
            title: "The ancient city of Jingkou",
            summary:
              "Commanding the Yangtze route, Jingkou brought military strategy, grain transport and commerce together over many centuries.",
          },
          "poetry-and-legends": {
            title: "Poetry and legend",
            summary:
              "Poems inspired by Beigushan and the legend of the flooding of Jinshan have turned Zhenjiang's scenery into widely shared cultural memory.",
          },
        },
      },
      heritage: {
        intro:
          "Papercraft, local opera, Wu songs and seasonal customs reveal Zhenjiang as a meeting place between Jiangnan and the Jianghuai region.",
        highlights: {
          "paper-cutting": {
            title: "Zhenjiang paper cutting and Danyang carved paper",
            summary:
              "Scissors and knives produce intricate designs of flowers, birds, people and auspicious scenes from folk life.",
          },
          "dan-opera-and-wu-songs": {
            title: "Dan opera and Zhenjiang Wu songs",
            summary:
              "Local theatre and folk songs preserve regional speech and melody while recording work and life along the rivers.",
          },
        },
      },
      food: {
        intro:
          "A local saying sums up three Zhenjiang favourites: fragrant vinegar, crystal pork and noodles cooked with a small pot lid.",
        highlights: {
          "vinegar-and-cured-pork": {
            title: "Zhenjiang vinegar and crystal pork",
            summary:
              "The vinegar is aromatic and mellow rather than harsh, while the translucent cured pork is savoury and springy, a classic pairing at the Zhenjiang table.",
          },
          "pot-cover-noodles": {
            title: "Pot-cover noodles",
            summary:
              "A small wooden lid floats in the noodle pot during cooking. Served with varied toppings and local vinegar, the dish is an everyday city favourite.",
          },
        },
      },
      waterways: {
        intro:
          "Zhenjiang preserves historic canal mouths, ferries and stone bridges while continuing to serve modern river, canal and sea transport.",
        highlights: {
          "xijin-ferry": {
            title: "Xijin Ferry and Jingkou Lock",
            summary:
              "The old ferry quarter and hydraulic remains explain how canal boats reached the Yangtze and transferred people and goods.",
          },
          "jianbi-lock": {
            title: "Jianbi Lock",
            summary:
              "The modern lock links the Jiangnan Canal with the Yangtze, continuing Zhenjiang's working role as a shipping junction.",
          },
        },
      },
    },
  },
  yangzhou: {
    summary:
      "The ancient Han Canal began at Yangzhou. Canal trade brought salt merchants, gardens, writers and Huaiyang cuisine, shaping the city's graceful pace of life.",
    sections: {
      overview: {
        intro:
          "Near the meeting of the Yangtze and Grand Canal, Yangzhou was once a major centre of the salt trade and is now internationally recognised for its cuisine.",
        highlights: {
          "born-of-the-canal": {
            title: "Born of the canal",
            summary:
              "From the digging of the Han Canal to later imperial grain transport, Yangzhou's fortunes have always been closely tied to the waterway.",
          },
          "slow-city-life": {
            title: "Gardens, morning tea and an unhurried rhythm",
            summary:
              "Garden visits, long morning teas and bathing traditions give Yangzhou daily life its relaxed and gracious character.",
          },
        },
      },
      nature: {
        intro:
          "Lakes, wetlands and designed gardens follow the canal system, creating Yangzhou's elegant and gently paced waterscapes.",
        highlights: {
          "slender-west-lake": {
            title: "Slender West Lake",
            summary:
              "A long waterscape formed from old moats and gardens, the lake is known for landmarks such as Five-Pavilion Bridge and Twenty-Four Bridge.",
          },
          "gaoyou-and-shaobo-lakes": {
            title: "Gaoyou and Shaobo lakes",
            summary:
              "Open water, wetland birds and fishing traditions extend the lake-country landscape across northern Yangzhou.",
          },
        },
      },
      history: {
        intro:
          "The canal and salt trade brought long prosperity, leaving Tang poetry, merchant gardens and the lanes of the old city.",
        highlights: {
          "salt-merchant-city": {
            title: "A capital of the salt trade",
            summary:
              "During the Ming and Qing periods, salt and canal commerce attracted wealth, craft and talent, supporting gardens and a thriving urban economy.",
          },
          "poetry-and-city": {
            title: "Yangzhou in poetry",
            summary:
              "Poets across the centuries wrote of Yangzhou, making the canal, moonlit nights and spring blossoms lasting images of the city.",
          },
        },
      },
      heritage: {
        intro:
          "Yangzhou's living heritage combines elaborate handcraft with stage and storytelling traditions shaped by merchant culture and city life.",
        highlights: {
          "lacquerware-and-jade": {
            title: "Yangzhou lacquerware and jade carving",
            summary:
              "Layered lacquer, carving and inlay demand exceptional precision and remain central to Yangzhou's craft identity.",
          },
          "yangzhou-storytelling": {
            title: "Yangzhou storytelling and qingqu",
            summary:
              "Dialect, rhythm and vivid characterisation distinguish these spoken and sung forms, preserving the audible memory of the city.",
          },
        },
      },
      food: {
        intro:
          "Yangzhou is a centre of Huaiyang cuisine, which values carefully chosen ingredients, precise knife work, controlled heat and clear flavours.",
        highlights: {
          "yangzhou-morning-tea": {
            title: "Yangzhou morning tea",
            summary:
              "Shredded tofu, three-dice buns, jade shumai and layered oil cake set the rhythm of a day that begins slowly in the teahouse.",
          },
          "huaiyang-classics": {
            title: "Lion's-head meatballs and Wensi tofu",
            summary:
              "Coarse and fine chopping for the meatballs and near-threadlike tofu cutting demonstrate Huaiyang cuisine's control of texture and heat.",
          },
        },
      },
      waterways: {
        intro:
          "Yangzhou is a key origin and hub of the Grand Canal. The ancient Han Canal, Guazhou and the canal's Three Bays span more than two millennia of water transport.",
        highlights: {
          "han-canal": {
            title: "The ancient Han Canal",
            summary:
              "Dug during the Spring and Autumn period, the Han Canal is regarded as an early source of the Grand Canal and the foundation of Yangzhou's canal identity.",
          },
          "canal-three-bays": {
            title: "The Three Bays and Guazhou",
            summary:
              "The bends of the Three Bays show historic water-engineering skill, while Guazhou marks the vital transfer point between canal and Yangtze.",
          },
        },
      },
    },
  },
  taizhou: {
    summary:
      "River networks, shallow lakes and the Lixiahe water country sustain Taizhou, where old-city culture, opera and morning-tea traditions continue at an unhurried pace.",
    sections: {
      overview: {
        intro:
          "Taizhou, historically known as Hailing, lies on the north bank of the Yangtze within the densely watered Lixiahe region.",
        highlights: {
          "water-city-hailing": {
            title: "Water-shaped Hailing",
            summary:
              "Canals, lanes and bridges spread through the old city, creating an urban landscape influenced by both Jianghuai and Jiangnan culture.",
          },
          "slow-life": {
            title: "Morning tea and a slower pace",
            summary:
              "Teahouses, opera and a carefully composed breakfast give everyday Taizhou a relaxed, welcoming rhythm.",
          },
        },
      },
      nature: {
        intro:
          "Shallow lakes, wetlands and raised fields form Taizhou's most distinctive Lixiahe landscapes.",
        highlights: {
          "qin-lake-wetland": {
            title: "Qin Lake Wetland",
            summary:
              "Open water, reeds and wetland habitats meet here, providing the natural stage for customs such as the Qintong Boat Festival.",
          },
          "xinghua-raised-fields": {
            title: "Xinghua raised fields",
            summary:
              "Water and small elevated fields interlock, turning spring rapeseed flowers into a remarkable floating agricultural landscape.",
          },
        },
      },
      history: {
        intro:
          "The old city of Hailing, salt transport and influential cultural figures define the main lines of Taizhou's history.",
        highlights: {
          "ancient-hailing": {
            title: "Ancient Hailing",
            summary:
              "The old moat and historic streets preserve the plan of the former prefectural city and memories of trade across the Jianghuai region.",
          },
          "mei-lanfang": {
            title: "Home of Mei Lanfang",
            summary:
              "The celebrated Peking opera artist Mei Lanfang is a major cultural figure for Taizhou, remembered through dedicated sites and continuing opera traditions.",
          },
        },
      },
      heritage: {
        intro:
          "From wooden boats and penjing to dough modelling and local opera, Taizhou's living heritage remains close to water-town work and daily life.",
        highlights: {
          "wooden-boat-making": {
            title: "Xinghua wooden-boat building",
            summary:
              "Timber selection, full-scale marking, plank assembly and caulking answer the transport and production needs of a dense water network.",
          },
          "bonsai-and-folk-crafts": {
            title: "Yang-school penjing and folk modelling",
            summary:
              "Penjing, dough figures, wood carving and paper cutting express local taste and festival life through precise, compact forms.",
          },
        },
      },
      food: {
        intro:
          "Taizhou food is best known for morning tea, river produce and finely made noodles and pastries, all carrying the abundance of the water country.",
        highlights: {
          "morning-tea-trio": {
            title: "Shredded tofu, soup dumplings and fish-broth noodles",
            summary:
              "Fine texture, fresh flavour and comforting warmth form the classic trio of a Taizhou morning tea.",
          },
          "waterside-flavours": {
            title: "Qin Lake produce and Xinghua crab",
            summary:
              "Seasonal lake and river ingredients show how the Lixiahe region has long eaten according to its waters.",
          },
        },
      },
      waterways: {
        intro:
          "The Tongyang Canal links Taizhou to the Grand Canal network, while the Fengcheng River and Lixiahe waterways shape life in and around the old city.",
        highlights: {
          "fengcheng-river": {
            title: "Fengcheng River",
            summary:
              "This waterway circles the old city and connects bridges, former defences and cultural sites, offering a clear introduction to historic Hailing.",
          },
          "tongyang-canal-network": {
            title: "Tongyang Canal and the Lixiahe network",
            summary:
              "Regional waterways connect Yangzhou, Nantong and the Yangtze, supporting salt transport, farming and water-town settlements.",
          },
        },
      },
    },
  },
  nantong: {
    summary:
      "The Yangtze, Yellow Sea and Tongyang Canal meet around Nantong, where river-and-sea landscapes sit beside Zhang Jian's pioneering experiments in modern urban development.",
    sections: {
      overview: {
        intro:
          "Nantong stands on the north bank of the Yangtze estuary, serving both as a river port and a gateway to the Yellow Sea.",
        highlights: {
          "river-sea-gateway": {
            title: "Gateway between river and sea",
            summary:
              "Yangtze shipping, coastal ports and the plain's waterways have shaped Nantong's open and practical character.",
          },
          "modern-first-city": {
            title: "A pioneer of modern Chinese urban development",
            summary:
              "Zhang Jian advanced industry, education, museums and public works together, creating a remarkably systematic early-modern city project.",
          },
        },
      },
      nature: {
        intro:
          "Nantong's scenery stretches from the Yangtze shore to Yellow Sea tidal flats, bringing low hills, river and coast into one landscape.",
        highlights: {
          "langshan-hills": {
            title: "Langshan and the five hills",
            summary:
              "Five low hills rise beside the Yangtze. From their heights, visitors can watch the river widen towards the sea.",
          },
          "coastal-wetlands": {
            title: "River-and-sea wetlands",
            summary:
              "Coastal areas such as Yuantuojiao and Liyashan reveal an ecology shaped by tides, mudflats and migratory birds.",
          },
        },
      },
      history: {
        intro:
          "Nantong's history is distinguished by the development of its river and coast, salt transport, and modern industry and education.",
        highlights: {
          "zhang-jian-practice": {
            title: "Zhang Jian's urban programme",
            summary:
              "The Dasheng cotton mill, Nantong Museum and educational institutions record his effort to connect local industry with public culture.",
          },
          "jiang-hai-settlements": {
            title: "River-and-sea settlements and salt transport",
            summary:
              "Old towns, sea walls and salt waterways reflect the long negotiation between coastal communities, tides, reclaimed land and trade.",
          },
        },
      },
      heritage: {
        intro:
          "Textiles, kites and embroidery are Nantong's best-known living traditions, combining practical use with technical refinement.",
        highlights: {
          "blue-calico": {
            title: "Nantong blue calico",
            summary:
              "Resist-printing blocks and indigo dye create crisp patterns once widely used for clothing and household textiles across the river-and-sea region.",
          },
          "kite-and-embroidery": {
            title: "Banyao kites and realistic embroidery",
            summary:
              "Sound-making kites and embroidery that approaches the texture of painting demonstrate the technical imagination of Nantong craft.",
          },
        },
      },
      food: {
        intro:
          "Freshwater fish, seafood and local pastries give Nantong a clear, straightforward cuisine rooted in both river and sea.",
        highlights: {
          "river-sea-seafood": {
            title: "Clams and seasonal river-and-sea produce",
            summary:
              "Tidal-flat shellfish, river fish and seafood arrive with the seasons, offering the most direct taste of Nantong's waters.",
          },
          "nantong-snacks": {
            title: "Xiting crisp biscuits and Dong candy",
            summary:
              "Crisp, sweet and easy to keep, these snacks continue the traditions of market-town travel and seasonal gift giving.",
          },
        },
      },
      waterways: {
        intro:
          "The Tongyang Canal extends the Grand Canal network to the Yangtze estuary, while the Hao River and modern port reveal different scales of urban water.",
        highlights: {
          "tongyang-canal": {
            title: "Tongyang Canal",
            summary:
              "Originally a salt-transport waterway between Yangzhou and Nantong, the canal later served modern industry and river-sea shipping.",
          },
          "hao-river": {
            title: "The Hao River moat",
            summary:
              "Encircling the old city, the former moat preserves Nantong's defensive plan and now links public cultural spaces along the water.",
          },
        },
      },
    },
  },
  yancheng: {
    summary:
      "Yellow Sea mudflats, migrating birds and more than two millennia of sea-salt production meet in Yancheng, bringing coastal ecology and salt-transport memory together.",
    sections: {
      overview: {
        intro:
          "Historically called Yandu, Yancheng is the only Chinese city named directly for salt and has the longest coastline in Jiangsu.",
        highlights: {
          "city-of-sea-salt": {
            title: "Making salt from the sea",
            summary:
              "Salt fields, coastal workers and transport canals preserve a sea-salt culture extending back more than 2,000 years.",
          },
          "wetland-city": {
            title: "A city of eastern wetlands",
            summary:
              "A UNESCO World Heritage site and major nature reserves make ecological conservation Yancheng's most important international identity.",
          },
        },
      },
      nature: {
        intro:
          "Tides, sediment and migratory birds shape Yancheng's vast and exceptionally lively coastal landscape.",
        highlights: {
          "yellow-sea-wetlands": {
            title: "Yellow Sea wetlands",
            summary:
              "The extensive tidal flats are a critical habitat on the East Asian-Australasian Flyway.",
          },
          "cranes-and-milu": {
            title: "Red-crowned cranes and Père David's deer",
            summary:
              "Coastal reserves shelter rare wildlife and offer a distinctive setting for observing Yancheng's wetland ecology.",
          },
        },
      },
      history: {
        intro:
          "Sea-salt production, coastal defence and twentieth-century wartime memory form the main lines of Yancheng's history.",
        highlights: {
          "salt-industry-history": {
            title: "Towns built on sea salt",
            summary:
              "Local place names referring to stoves, work units, storehouses and salt fields record how production was organised and settlements developed.",
          },
          "new-fourth-army": {
            title: "Memory of the New Fourth Army",
            summary:
              "The rebuilding of the New Fourth Army headquarters made Yancheng an important site in the history of resistance in central China.",
          },
        },
      },
      heritage: {
        intro:
          "Yancheng's living heritage combines sea-salt production, Lixiahe performance traditions and customs of the coast.",
        highlights: {
          "sea-salt-making": {
            title: "Traditional sea-salt making",
            summary:
              "Sun-drying, boiling, storage and transport preserve generations of coastal knowledge about using seawater and tidal flats.",
          },
          "huai-opera": {
            title: "Huai opera and Yancheng folk arts",
            summary:
              "Huai opera tells local stories through regional voices and melodies and remains a major stage tradition of the Yancheng area.",
          },
        },
      },
      food: {
        intro:
          "Seafood, freshwater produce and farmhouse cooking give Yancheng a direct, savoury cuisine rooted in the coast and Lixiahe waterways.",
        highlights: {
          "salt-city-seafood": {
            title: "Yellow Sea seafood and inland river produce",
            summary:
              "Fish, prawns, crabs and shellfish connect the coast with the inland water network and form the foundation of the local table.",
          },
          "yancheng-snacks": {
            title: "Funing rice cake and Dongtai fish-soup noodles",
            summary:
              "Soft white rice cake and noodles in a milky fish broth represent the region's traditions of festival gifts and hearty breakfasts.",
          },
        },
      },
      waterways: {
        intro:
          "The Chuanchang River linked coastal salt fields to the Tongyang Canal and the Grand Canal network, making it Yancheng's defining historic waterway.",
        highlights: {
          "chuanchang-river": {
            title: "Chuanchang River",
            summary:
              "This engineered waterway joined coastal salt fields and carried Huai salt inland; it still supports irrigation, drainage and urban ecology.",
          },
          "tongyu-canal": {
            title: "Tongyu Canal and the inland network",
            summary:
              "The modern canal, Sheyang River, Mangshe River and other waterways form a province-spanning system for navigation and water management.",
          },
        },
      },
    },
  },
  huaian: {
    summary:
      "The Huai River, Grand Canal and Hongze Lake meet around Huai'an, where grain-transport administration, hydraulic engineering and Huaiyang cuisine tell the story of a major inland hub.",
    sections: {
      overview: {
        intro:
          "Huai'an lies near the centre of northern Jiangsu and the Qinling-Huai geographic divide, where dense waterways bring northern and southern cultures together.",
        highlights: {
          "canal-capital": {
            title: "Capital of the canal",
            summary:
              "Imperial grain transport, river engineering and commerce converged here, making Huai'an a major centre on the middle reaches of the Grand Canal.",
          },
          "north-south-culture": {
            title: "Where north and south meet",
            summary:
              "Dialect, food, homes and water-town life combine characteristics from both sides of the Jianghuai region.",
          },
        },
      },
      nature: {
        intro:
          "Lakes, rivers and wetlands form Huai'an's broad, level and water-rich natural setting.",
        highlights: {
          "hongze-lake": {
            title: "Hongze Lake and its great embankment",
            summary:
              "Open lake, shoreline and the historic embankment reveal a landscape shared by flood control, navigation and fishing.",
          },
          "li-canal-landscape": {
            title: "Waterscapes of the Li Canal",
            summary:
              "The Li Canal links Qingjiangpu, historic locks and modern public waterfronts, bringing the legacy of grain transport into the present city.",
          },
        },
      },
      history: {
        intro:
          "The old city, canal administration, notable hometowns and modern revolutionary memory give Huai'an a deeply layered history.",
        highlights: {
          "grain-transport-administration": {
            title: "The governor-general of grain transport and the prefectural city",
            summary:
              "The former grain-transport headquarters and Huai'an government offices show how the Ming and Qing states managed administration and tax grain.",
          },
          "zhou-enlai-hometown": {
            title: "Hometown of Zhou Enlai",
            summary:
              "His former residence, memorial hall and sites around Fuma Lane form an important modern cultural landmark in Huai'an.",
          },
        },
      },
      heritage: {
        intro:
          "Huai'an's living heritage can be heard, watched and tasted, with local opera, percussion and lakeside performance carrying a strong water-country character.",
        highlights: {
          "huaihai-opera": {
            title: "Huaihai opera",
            summary:
              "Direct and energetic local singing tells stories of northern Jiangsu in a style affectionately known as the soul-pulling tune.",
          },
          "shifan-and-fishing-drum": {
            title: "Chuzhou shifan percussion and Hongze Lake fishing drums",
            summary:
              "Percussion music and boat-based performances connect festivals and labour with everyday life on the water.",
          },
        },
      },
      food: {
        intro:
          "Huai'an is one of the birthplaces of Huaiyang cuisine, where river and lake produce, precise knife work and clear flavours support one another.",
        highlights: {
          "huaiyang-cuisine": {
            title: "Huaiyang cuisine",
            summary:
              "The cuisine values natural flavour, careful heat control and knife skills, reflecting ingredients and banquet traditions circulated by the canal.",
          },
          "huaian-classics": {
            title: "Stir-fried eel and Pingqiao tofu",
            summary:
              "Familiar ingredients such as eel and tofu are handled with exceptional care in two of Huai'an's best-known dishes.",
          },
        },
      },
      waterways: {
        intro:
          "Huai'an occupies one of the most complex historic meeting points of the Yellow River, Huai River and Grand Canal, making it crucial to navigation and water management.",
        highlights: {
          "qingkou-hub": {
            title: "Qingkou hydraulic complex",
            summary:
              "Embankments, locks, dams and diversion channels balanced difficult water flows, demonstrating the engineering behind reliable grain transport.",
          },
          "grain-transport-hub": {
            title: "Hub of imperial grain transport",
            summary:
              "Warehouses, transfer points and administrative offices lined the canal, placing Huai'an at the centre of the national grain-tribute system.",
          },
        },
      },
    },
  },
  suqian: {
    summary:
      "Luoma Lake, Hongze Lake and the Middle Canal surround Suqian, where memories of the Chu-Han era, distilling traditions and lakeside life shape the city.",
    sections: {
      overview: {
        intro:
          "In northern Jiangsu, Suqian presents three main identities: the hometown of Xiang Yu, a centre of Chinese spirits, and a city sustained by water.",
        highlights: {
          "three-city-identities": {
            title: "Three city identities",
            summary:
              "A Chu-Han hero, a celebrated spirits industry and lake-and-river ecology represent Suqian's history, economy and natural setting.",
          },
          "two-lakes-two-rivers": {
            title: "Two lakes and two rivers",
            summary:
              "Luoma and Hongze lakes, together with the Grand Canal and former Yellow River, form the framework of Suqian's water system.",
          },
        },
      },
      nature: {
        intro:
          "Large lakes, wetlands, forests and flower fields give Suqian both expansive waterscapes and ecological experiences across the seasons.",
        highlights: {
          "luoma-lake": {
            title: "Luoma Lake",
            summary:
              "Open water, sandy shores and rich fisheries make this the defining lake landscape of northern Suqian.",
          },
          "wetlands-and-flower-fields": {
            title: "Hongze Lake Wetland and Santai Mountain",
            summary:
              "Reed-filled bays, bird habitat and broad flower fields reveal the ecological variety behind Suqian's water-shaped identity.",
          },
        },
      },
      history: {
        intro:
          "Chu-Han memory, canal towns and the growth of the spirits industry form the main axis of Suqian's cultural history.",
        highlights: {
          "xiang-yu": {
            title: "Xiang Yu and ancient Xiaxiang",
            summary:
              "Stories of Xiang Yu's birthplace connect Suqian to the history of the Chu-Han struggle and provide the city's strongest human symbol.",
          },
          "zaohe-town": {
            title: "Zaohe Ancient Town",
            summary:
              "The old town, wharves and imperial lodge preserve memories of canal commerce, river engineering and imperial journeys to the south.",
          },
        },
      },
      heritage: {
        intro:
          "Distilling, drum storytelling, opera and fishing-drum performance connect Suqian's grain production with leisure and life around its lakes.",
        highlights: {
          "yanghe-brewing": {
            title: "Traditional Yanghe distilling",
            summary:
              "Grain, water, fermentation starter and old cellars produce Yanghe's characteristically soft style while linking farming, craft and a major local industry.",
          },
          "drum-and-opera": {
            title: "Northern Jiangsu drum stories, Sizhou opera and fishing drums",
            summary:
              "Storytelling, theatre and lake performances use local voices to record community stories and life on the water.",
          },
        },
      },
      food: {
        intro:
          "Suqian's table draws on lake produce, plain-grown grain, mutton and local spirits, reflecting the generous, direct cooking of northern Jiangsu.",
        highlights: {
          "lake-fresh-food": {
            title: "Seasonal produce from Luoma Lake",
            summary:
              "Fish, prawns and crabs appear according to the season, reflecting a food culture built around living beside the lake.",
          },
          "northern-jiangsu-table": {
            title: "Northern Jiangsu noodles, mutton and spirits",
            summary:
              "Straightforward wheat dishes, warming mutton and local baijiu form a regional combination for both banquets and everyday meals.",
          },
        },
      },
      waterways: {
        intro:
          "The Middle Canal and Zaohe place Suqian within the Grand Canal World Heritage system while connecting lakes, historic towns and modern city life.",
        highlights: {
          "middle-canal": {
            title: "The Suqian section of the Middle Canal",
            summary:
              "This heritage section continues to carry boats while linking waterside settlements and ecological landscapes.",
          },
          "dragon-king-temple": {
            title: "Dragon King Temple imperial lodge",
            summary:
              "Water-deity worship, river engineering and memories of imperial southern tours meet at this important canal site in Zaohe.",
          },
        },
      },
    },
  },
  xuzhou: {
    summary:
      "At a major north-south crossroads, Xuzhou combines Han-dynasty culture, the meeting of Yellow River and canal histories, and a bold landscape distinct from Jiangnan.",
    sections: {
      overview: {
        intro:
          "Known historically as Pengcheng, Xuzhou lies in northwestern Jiangsu and serves as a multi-province transport gateway and a major centre of Han culture.",
        highlights: {
          "five-province-crossroads": {
            title: "Crossroads of five provinces",
            summary:
              "Railways, waterways and historic overland routes meet here, giving Xuzhou an open and resilient city character.",
          },
          "han-culture-city": {
            title: "The Han legacy of Pengcheng",
            summary:
              "Han tombs, carved stone reliefs and terracotta warriors offer a concentrated view of the history and art of the Han dynasties.",
          },
        },
      },
      nature: {
        intro:
          "Hills and lakes meet around Xuzhou, while ecological restoration has turned former coal-mining subsidence areas into new wetland landscapes.",
        highlights: {
          "yunlong-lake": {
            title: "Yunlong Lake and Yunlong Mountain",
            summary:
              "Open water and low hills meet the city here, creating Xuzhou's most recognisable landscape for recreation.",
          },
          "panan-lake": {
            title: "Pan'an Lake Wetland",
            summary:
              "Created through the restoration of mining-subsidence land, this lake wetland demonstrates ecological renewal in an industrial region.",
          },
        },
      },
      history: {
        intro:
          "Chu-Han struggles, military geography and changes in the Yellow River and canal systems give Xuzhou's history its weight and scale.",
        highlights: {
          "han-dynasty-heritage": {
            title: "Heritage of the Han dynasties",
            summary:
              "Royal tombs, terracotta warriors and carved stone reliefs reveal Han civilisation through government, daily life and art.",
          },
          "strategic-city": {
            title: "A city of strategic importance",
            summary:
              "Its position on north-south routes repeatedly placed Xuzhou at the centre of major historical events and shifting transport networks.",
          },
        },
      },
      heritage: {
        intro:
          "Xuzhou's living heritage combines a northern sense of strength with the local traditions of northern Jiangsu in opera, paper cutting and folk craft.",
        highlights: {
          "liuqin-opera": {
            title: "Liuqin opera",
            summary:
              "This lively, high-pitched regional opera is accompanied by the willow-leaf-shaped liuyeqin and is popular across the Jiangsu-Shandong-Henan-Anhui border region.",
          },
          "xuzhou-paper-cutting": {
            title: "Xuzhou paper cutting and scented sachets",
            summary:
              "Strong compositions, auspicious designs and seasonal ornaments express the folk aesthetics of northern Jiangsu.",
          },
        },
      },
      food: {
        intro:
          "Influences from the Central Plains, southern Shandong and northern Jiangsu give Xuzhou food bold flavour and generous portions.",
        highlights: {
          "sha-soup": {
            title: "Sha soup and the Xuzhou breakfast",
            summary:
              "A peppery, warming soup often served with fried dough or pan-fried buns is one of the city's most distinctive morning flavours.",
          },
          "xuzhou-hearty-food": {
            title: "Clay-pot chicken and braised pork",
            summary:
              "Flatbread cooked around the pot, richly seasoned meat and savoury sauces express the hearty character of northern cooking.",
          },
        },
      },
      waterways: {
        intro:
          "The former Yellow River, Beijing-Hangzhou Grand Canal and Weishan Lake system interweave near Xuzhou, forming an important river-and-canal junction.",
        highlights: {
          "yellow-river-canal": {
            title: "Where Yellow River and canal histories meet",
            summary:
              "The shifting relationship between the historic Yellow River and the canal profoundly affected navigation, flood control and Xuzhou's growth.",
          },
          "canal-portals": {
            title: "Northern gateway to the Jiangsu canal",
            summary:
              "Waterways and lakes link Shandong with Jiangsu, making Xuzhou a gateway for grain transport and exchange between north and south.",
          },
        },
      },
    },
  },
  lianyungang: {
    summary:
      "The Yuntai Mountains, Haizhou Bay and a modern port meet at Lianyungang, a city shaped by Journey to the West legends, maritime culture and an overland bridge to Eurasia.",
    sections: {
      overview: {
        intro:
          "Lianyungang stands midway along China's coast, where mountains, sea, port and city meet at the eastern starting point of the New Eurasian Land Bridge.",
        highlights: {
          "mountain-sea-port-city": {
            title: "A city of mountains, sea and port",
            summary:
              "The Yuntai range, islands of Haizhou Bay and a deep-water port overlap in one distinctive urban landscape.",
          },
          "east-bridgehead": {
            title: "Eastern bridgehead to Eurasia",
            summary:
              "Railways, port facilities and international freight trains connect Lianyungang with Central Asia and Europe, extending its role in sea-land transfer.",
          },
        },
      },
      nature: {
        intro:
          "Lianyungang is one of Jiangsu's rare mountain-and-sea cities, with islands, sandy bays, rock formations and low mountains creating a varied coast.",
        highlights: {
          "huaguo-and-yuntai": {
            title: "Huaguo Mountain and the Yuntai range",
            summary:
              "Jiangsu's highest peaks, wooded rock landscapes and sea mist create the mountain scenery traditionally praised as the finest in the Eastern Sea.",
          },
          "lian-island-coast": {
            title: "Lian Island and Haizhou Bay",
            summary:
              "Beaches, rocky shore, fishing villages and tidal habitats create a mountain-and-sea landscape rarely found elsewhere on Jiangsu's coast.",
          },
        },
      },
      history: {
        intro:
          "Ancient Haizhou, maritime exchange and a modern open port give Lianyungang a history stretching across both land and sea.",
        highlights: {
          "ancient-haizhou": {
            title: "Ancient Haizhou",
            summary:
              "Early administrative centres, salt and iron production, and sea routes left archaeological sites, cliff carvings and memories of the old city.",
          },
          "modern-open-port": {
            title: "A modern open port",
            summary:
              "Port construction and coastal opening turned Lianyungang into a major maritime gateway between inland China and the wider world.",
          },
        },
      },
      heritage: {
        intro:
          "Journey to the West stories, Haizhou customs and Donghai craftsmanship give Lianyungang's living heritage a strong mountain-and-sea imagination.",
        highlights: {
          "journey-west-traditions": {
            title: "Journey to the West traditions",
            summary:
              "Huaguo Mountain legends, monkey performances and related festivals transform a classical novel into local performance and public culture.",
          },
          "donghai-crystal": {
            title: "Donghai crystal carving",
            summary:
              "Local crystal resources support traditions of selection, cutting, polishing and carving that have become a defining craft of Donghai County.",
          },
        },
      },
      food: {
        intro:
          "Haizhou Bay seafood, northern Jiangsu pancakes and mountain produce give Lianyungang food a fresh, fragrant and straightforward character.",
        highlights: {
          "seafood-and-pancake": {
            title: "Seafood with thin pancakes",
            summary:
              "Swimming crab, prawns and other seafood served with thin pancakes bring fishing-port life together with northern Jiangsu eating traditions.",
          },
          "local-specialties": {
            title: "Guanyun bean caterpillars and Huaguo Mountain cured goose",
            summary:
              "An unusual seasonal insect ingredient and traditionally air-dried goose show local knowledge of available produce and preservation.",
          },
        },
      },
      waterways: {
        intro:
          "Lianyungang lies away from the Grand Canal's main route, but the Yan River, inland waterways and seaport connect the Huai basin with maritime transport.",
        highlights: {
          "salt-river-network": {
            title: "Yan River and inland waterways",
            summary:
              "Regional channels carried salt, irrigation water and goods, linking ancient Haizhou to the water-transport network of northern Jiangsu.",
          },
          "sea-land-transport": {
            title: "Sea-land transport",
            summary:
              "The modern port joins rail and shipping, transforming a historic water gateway into an international logistics hub.",
          },
        },
      },
    },
  },
};

export function applyCityEnglish(cities: CityDraft[]): City[] {
  return cities.map((city) => {
    const translation = cityEnglishContent[city.slug];

    return {
      ...city,
      summary: { ...city.summary, en: translation.summary },
      sections: city.sections.map((section) => {
        const sectionTranslation = translation.sections[section.id];
        return {
          ...section,
          intro: { ...section.intro, en: sectionTranslation.intro },
          highlights: section.highlights.map((highlight) => {
            const highlightTranslation = sectionTranslation.highlights[highlight.id];
            return {
              ...highlight,
              title: { ...highlight.title, en: highlightTranslation.title },
              summary: { ...highlight.summary, en: highlightTranslation.summary },
            };
          }),
        };
      }),
    };
  });
}
