// 图片放入 public/images/ 后填写 src（例如 /images/cover.webp）与 alt。
// 留空时显示现有占位；发布真实内容时将对应 isExample 改为 false。
export interface ClubImage {
  src: string;
  alt: string;
}

export const categories = [
  { id: "illustration", label: "插画", placeholder: "插画图片预留" },
  { id: "comic", label: "漫画", placeholder: "漫画封面预留" },
  { id: "writing", label: "文字", placeholder: "文字作品封面预留" },
  { id: "journal", label: "社刊", placeholder: "社刊封面预留" },
] as const;

export type WorkCategory = (typeof categories)[number]["id"];

export interface Activity {
  title: string;
  category: string;
  description: string;
  isExample: boolean;
  image?: ClubImage;
}

export interface Work {
  title: string;
  category: WorkCategory;
  description: string;
  isExample: boolean;
  image?: ClubImage;
  excerpt?: string[];
}

export const club = {
  name: "电子科技大学百合社",
  englishName: "UESTC YURI CLUB",
  journalName: "花间来信",
  introduction: "电子科技大学百合社，属于百合文化爱好者的交流与创作空间。",
  about:
    "从一部动画、一页漫画，到一段写下的故事，我们希望给每一种喜欢留一个位置。在这里交流作品、分享灵感，也认识愿意倾听的同好。",
  contact: "联系方式待补充",
  heroImage: undefined as ClubImage | undefined,
};

// 第一项作为重点活动展示；后续项使用文字栏目，可选填海报。
export const activities: Activity[] = [
  {
    title: "放映室里的共鸣",
    category: "百合动画交流",
    description: "一起聊聊那些打动我们的角色与片段。",
    isExample: true,
  },
  {
    title: "把喜欢写进故事",
    category: "同人创作交流",
    description: "分享灵感、片段与创作中的小发现。",
    isExample: true,
  },
  {
    title: "翻开下一页",
    category: "漫画与小说共读",
    description: "交换书单，也交换不一样的理解。",
    isExample: true,
  },
];

export const works: Work[] = [
  {
    title: "晴天，与你",
    category: "illustration",
    description: "把晴朗的心情，留在与你并肩的午后。",
    isExample: true,
  },
  {
    title: "放学之后",
    category: "comic",
    description: "回家的路绕远一点，话就能多说一点。",
    isExample: true,
  },
  {
    title: "写给夏天的信",
    category: "writing",
    description: "有些心事，适合让一封信慢慢说完。",
    isExample: true,
    excerpt: [
      "“夏天的风",
      "翻过书页。",
      "我没说完的话，",
      "刚好停在",
      "有你的那一行。”",
    ],
  },
  {
    title: "窗边的片刻",
    category: "illustration",
    description: "光落在肩上，平常的一刻也值得珍藏。",
    isExample: true,
  },
  {
    title: "两个人的日常",
    category: "comic",
    description: "从一杯热茶，到那些只有彼此懂的小事。",
    isExample: true,
  },
  {
    title: "花开时，我们相遇",
    category: "journal",
    description: "把分散的喜欢装订在一起，成为共同的一页。",
    isExample: true,
  },
];
