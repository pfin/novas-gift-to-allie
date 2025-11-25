// Sample book data for testing the book viewer
// These will be replaced with actual JSON data from the bilingual-books directory

import { Book } from './bookTypes';

export const sampleBooks: Book[] = [
  {
    id: 'butterfly-garden',
    titleEnglish: "The Butterfly Garden",
    titleChinese: "蝴蝶花园",
    titlePinyin: "Húdié Huāyuán",
    author: "Nova",
    coverColor: "from-pink-300 via-purple-300 to-blue-300",
    pages: [
      {
        pageNumber: 1,
        type: 'title',
        englishText: "The Butterfly Garden",
        chineseText: "蝴蝶花园",
        chinesePinyin: "Húdié Huāyuán",
        illustrationPrompt: "A beautiful garden filled with colorful butterflies and flowers"
      },
      {
        pageNumber: 2,
        type: 'story',
        englishText: "In a magical garden, butterflies dance among the flowers.",
        chineseText: "在一个神奇的花园里，蝴蝶在花丛中翩翩起舞。",
        chinesePinyin: "Zài yīgè shénqí de huāyuán lǐ, húdié zài huācóng zhōng piānpiān qǐwǔ.",
        illustrationPrompt: "Butterflies with colorful wings flying around pink and yellow flowers"
      },
      {
        pageNumber: 3,
        type: 'story',
        englishText: "Each butterfly has wings of many colors - red, blue, yellow, and green!",
        chineseText: "每只蝴蝶都有多彩的翅膀——红色、蓝色、黄色和绿色！",
        chinesePinyin: "Měi zhī húdié dōu yǒu duōcǎi de chìbǎng — hóngsè, lánsè, huángsè hé lǜsè!",
        illustrationPrompt: "Close-up of butterflies showing red, blue, yellow, and green wings"
      },
      {
        pageNumber: 4,
        type: 'story',
        englishText: "The butterflies visit every flower, spreading joy and beauty.",
        chineseText: "蝴蝶拜访每一朵花，传播快乐和美丽。",
        chinesePinyin: "Húdié bàifǎng měi yī duǒ huā, chuánbō kuàilè hé měilì.",
        illustrationPrompt: "Butterflies landing on various colorful flowers"
      },
      {
        pageNumber: 5,
        type: 'ending',
        englishText: "And when the sun sets, the butterflies rest on the flowers, dreaming of tomorrow's adventures.",
        chineseText: "当太阳落山时，蝴蝶在花朵上休息，梦想着明天的冒险。",
        chinesePinyin: "Dāng tàiyáng luòshān shí, húdié zài huāduǒ shàng xiūxí, mèngxiǎngzhe míngtiān de màoxiǎn.",
        illustrationPrompt: "Sunset scene with butterflies resting peacefully on flowers"
      }
    ]
  },
  {
    id: 'moon-and-stars',
    titleEnglish: "The Moon and the Stars",
    titleChinese: "月亮和星星",
    titlePinyin: "Yuèliàng hé Xīngxing",
    author: "Nova",
    coverColor: "from-indigo-400 via-purple-400 to-pink-400",
    pages: [
      {
        pageNumber: 1,
        type: 'title',
        englishText: "The Moon and the Stars",
        chineseText: "月亮和星星",
        chinesePinyin: "Yuèliàng hé Xīngxing",
        illustrationPrompt: "A bright moon surrounded by twinkling stars in a dark blue sky"
      },
      {
        pageNumber: 2,
        type: 'story',
        englishText: "Every night, the moon comes out to play with her friends, the stars.",
        chineseText: "每天晚上，月亮出来和她的朋友星星们玩耍。",
        chinesePinyin: "Měitiān wǎnshang, yuèliàng chūlái hé tā de péngyou xīngxing men wánshuǎ.",
        illustrationPrompt: "Smiling moon with friendly stars around her"
      },
      {
        pageNumber: 3,
        type: 'story',
        englishText: "The stars twinkle and shine, making patterns in the sky.",
        chineseText: "星星闪烁发光，在天空中形成图案。",
        chinesePinyin: "Xīngxing shǎnshuò fāguāng, zài tiānkōng zhōng xíngchéng túàn.",
        illustrationPrompt: "Stars forming beautiful patterns and constellations"
      },
      {
        pageNumber: 4,
        type: 'story',
        englishText: "The moon smiles down at everyone sleeping below.",
        chineseText: "月亮微笑着看着下面睡觉的每个人。",
        chinesePinyin: "Yuèliàng wéixiàozhe kànzhe xiàmiàn shuìjiào de měi gèrén.",
        illustrationPrompt: "Gentle moon watching over sleeping houses and people"
      },
      {
        pageNumber: 5,
        type: 'ending',
        englishText: "When morning comes, the moon and stars wave goodbye, saying 'See you tonight!'",
        chineseText: "当早晨来临时，月亮和星星挥手告别，说'今晚见！'",
        chinesePinyin: "Dāng zǎochén láilín shí, yuèliàng hé xīngxing huīshǒu gàobié, shuō 'jīnwǎn jiàn!'",
        illustrationPrompt: "Moon and stars waving goodbye as the sun rises"
      }
    ]
  },
  {
    id: 'rainy-day',
    titleEnglish: "The Rainy Day",
    titleChinese: "下雨天",
    titlePinyin: "Xiàyǔ Tiān",
    author: "Nova",
    coverColor: "from-blue-300 via-cyan-300 to-teal-300",
    pages: [
      {
        pageNumber: 1,
        type: 'title',
        englishText: "The Rainy Day",
        chineseText: "下雨天",
        chinesePinyin: "Xiàyǔ Tiān",
        illustrationPrompt: "Rain falling from grey clouds onto the ground"
      },
      {
        pageNumber: 2,
        type: 'story',
        englishText: "Pitter-patter! The rain falls from the clouds above.",
        chineseText: "滴答滴答！雨从上面的云中落下来。",
        chinesePinyin: "Dīdā dīdā! Yǔ cóng shàngmiàn de yún zhōng luò xiàlái.",
        illustrationPrompt: "Raindrops falling from dark clouds"
      },
      {
        pageNumber: 3,
        type: 'story',
        englishText: "The flowers are happy to get a drink of water!",
        chineseText: "花儿很高兴能喝到水！",
        chinesePinyin: "Huār hěn gāoxìng néng hē dào shuǐ!",
        illustrationPrompt: "Happy flowers with water droplets, looking refreshed"
      },
      {
        pageNumber: 4,
        type: 'story',
        englishText: "We put on our rain boots and splash in the puddles!",
        chineseText: "我们穿上雨靴，在水坑里踩水！",
        chinesePinyin: "Wǒmen chuānshàng yǔxuē, zài shuǐkēng lǐ cǎishuǐ!",
        illustrationPrompt: "Child in rain boots splashing in puddles"
      },
      {
        pageNumber: 5,
        type: 'ending',
        englishText: "After the rain, we see something special - a beautiful rainbow!",
        chineseText: "雨后，我们看到了特别的东西——美丽的彩虹！",
        chinesePinyin: "Yǔ hòu, wǒmen kàn dàole tèbié de dōngxi — měilì de cǎihóng!",
        illustrationPrompt: "Bright rainbow appearing after the rain"
      }
    ]
  },
  {
    id: 'flowers-bloom',
    titleEnglish: "When Flowers Bloom",
    titleChinese: "花儿开放",
    titlePinyin: "Huār Kāifàng",
    author: "Nova",
    coverColor: "from-rose-300 via-pink-300 to-fuchsia-300",
    pages: [
      {
        pageNumber: 1,
        type: 'title',
        englishText: "When Flowers Bloom",
        chineseText: "花儿开放",
        chinesePinyin: "Huār Kāifàng",
        illustrationPrompt: "Various colorful flowers blooming in a garden"
      },
      {
        pageNumber: 2,
        type: 'story',
        englishText: "In the spring, little seeds wake up in the warm soil.",
        chineseText: "春天，小种子在温暖的土壤里醒来。",
        chinesePinyin: "Chūntiān, xiǎo zhǒngzǐ zài wēnnuǎn de tǔrǎng lǐ xǐnglái.",
        illustrationPrompt: "Seeds beginning to sprout in the soil"
      },
      {
        pageNumber: 3,
        type: 'story',
        englishText: "They grow stems and leaves, reaching up toward the sun.",
        chineseText: "它们长出茎和叶子，向太阳伸展。",
        chinesePinyin: "Tāmen zhǎng chū jīng hé yèzi, xiàng tàiyáng shēnzhǎn.",
        illustrationPrompt: "Young plants with stems and leaves growing toward sunlight"
      },
      {
        pageNumber: 4,
        type: 'story',
        englishText: "Then one day, beautiful flowers open their petals!",
        chineseText: "然后有一天，美丽的花朵绽放花瓣！",
        chinesePinyin: "Ránhòu yǒu yītiān, měilì de huāduǒ zhànfàng huābàn!",
        illustrationPrompt: "Flowers opening their colorful petals"
      },
      {
        pageNumber: 5,
        type: 'ending',
        englishText: "The flowers dance in the breeze, filling the world with color and beauty.",
        chineseText: "花儿在微风中起舞，让世界充满色彩和美丽。",
        chinesePinyin: "Huār zài wēifēng zhōng qǐwǔ, ràng shìjiè chōngmǎn sècǎi hé měilì.",
        illustrationPrompt: "Flowers swaying gently in the wind"
      }
    ]
  },
  {
    id: 'rainbow-sky',
    titleEnglish: "The Rainbow in the Sky",
    titleChinese: "天空的彩虹",
    titlePinyin: "Tiānkōng de Cǎihóng",
    author: "Nova",
    coverColor: "from-red-300 via-yellow-300 to-green-300",
    pages: [
      {
        pageNumber: 1,
        type: 'title',
        englishText: "The Rainbow in the Sky",
        chineseText: "天空的彩虹",
        chinesePinyin: "Tiānkōng de Cǎihóng",
        illustrationPrompt: "A bright rainbow arcing across the sky"
      },
      {
        pageNumber: 2,
        type: 'story',
        englishText: "After the rain stops, something magical appears in the sky.",
        chineseText: "雨停后，天空中出现了神奇的东西。",
        chinesePinyin: "Yǔ tíng hòu, tiānkōng zhōng chūxiànle shénqí de dōngxi.",
        illustrationPrompt: "Sky clearing after rain with hint of colors appearing"
      },
      {
        pageNumber: 3,
        type: 'story',
        englishText: "A rainbow! With seven beautiful colors: red, orange, yellow, green, blue, indigo, and violet.",
        chineseText: "彩虹！有七种美丽的颜色：红、橙、黄、绿、蓝、靛、紫。",
        chinesePinyin: "Cǎihóng! Yǒu qī zhǒng měilì de yánsè: hóng, chéng, huáng, lǜ, lán, diàn, zǐ.",
        illustrationPrompt: "Complete rainbow showing all seven colors clearly"
      },
      {
        pageNumber: 4,
        type: 'story',
        englishText: "The rainbow makes an arch from one side of the sky to the other.",
        chineseText: "彩虹从天空的一边延伸到另一边，形成一个拱形。",
        chinesePinyin: "Cǎihóng cóng tiānkōng de yībiān yánshēn dào lìng yībiān, xíngchéng yīgè gǒngxíng.",
        illustrationPrompt: "Rainbow arch stretching across the entire sky"
      },
      {
        pageNumber: 5,
        type: 'ending',
        englishText: "We watch the rainbow until it slowly fades away, but we'll always remember its beauty.",
        chineseText: "我们看着彩虹慢慢消失，但我们会永远记住它的美丽。",
        chinesePinyin: "Wǒmen kànzhe cǎihóng mànmàn xiāoshī, dàn wǒmen huì yǒngyuǎn jìzhù tā de měilì.",
        illustrationPrompt: "Rainbow gradually fading as the sun comes out fully"
      }
    ]
  }
];
