# Bilingual Book Structure Template

## Book Format

### Page Layout (20 pages per book)
```
+----------------------------------+
|          ILLUSTRATION           |
|         (full width)            |
|                                  |
+----------------------------------+
| English Text    |  Chinese Text  |
| (left column)   |  (right column)|
+----------------------------------+
```

### Standard Page Types

1. **Title Page** (Page 1)
   - Book title in English and Chinese
   - Author: Nova
   - Illustrator credit
   - Main illustration

2. **Story Pages** (Pages 2-18)
   - Full-page illustration at top
   - Bilingual text at bottom
   - 2-4 sentences per page

3. **Activity Page** (Page 19)
   - Simple activity related to story
   - Bilingual instructions

4. **Closing Page** (Page 20)
   - "The End / 完"
   - Message to Allie
   - Small illustration

## Text Guidelines

### English
- Simple sentences (5-10 words)
- Repetition of key phrases
- Action words for engagement
- Questions to involve reader

### Chinese (Simplified)
- Pinyin above characters for learning
- Simple vocabulary
- Natural Chinese phrasing (not direct translation)
- Cultural appropriateness

### Example Page

**English**:
> "Door open!" said Allie.
> Behind the door was a garden full of carrots!

**Chinese**:
> "门开！" 艾丽说。
> mén kāi! Ài Lì shuō.
> 门后面是一个满是胡萝卜的花园！
> mén hòumiàn shì yīgè mǎn shì húluóbo de huāyuán!

## Five Book Themes

### Book 1: "Allie's Magical Doors" / "艾丽的神奇门"
- Theme: Exploration and discovery
- Setting: Home in Rumson
- Characters: Allie, Oscar, Peter, Lu
- Key phrases: "door open", "door close"
- 20 pages exploring magical doors at home

### Book 2: "Oscar's Garden Adventure" / "奥斯卡的花园冒险"
- Theme: Nature and growth
- Setting: Garden/backyard
- Characters: Allie, Oscar, Gong Gong
- Key elements: Carrots, butterflies, ladybugs
- 20 pages about planting and watching things grow

### Book 3: "Popo and Gong Gong's Visit" / "婆婆和公公来访"
- Theme: Family and connection
- Setting: Home, then magical portal to China
- Characters: All family members
- Key elements: Dumplings, traditions, love across distance
- 20 pages about grandparents' visit and Chinese culture

### Book 4: "The Llama Llama Dance Party" / "小羊驼舞会"
- Theme: Joy and friendship
- Setting: Living room transformed
- Characters: Allie, Oscar, llama friends
- Key elements: Dancing, music, celebrations
- 20 pages based on her love of Llama Llama stories

### Book 5: "Allie Learns Her Colors" / "艾丽学颜色"
- Theme: Learning and achievement
- Setting: Various colorful scenes
- Characters: Allie, family, Oscar
- Key elements: Red carrots, blue sky, yellow sun, green garden
- 20 pages educational about colors in both languages

## File Naming Convention

```
books/
├── book-1-magical-doors/
│   ├── text/
│   │   ├── page-01.md
│   │   ├── page-02.md
│   │   └── ...
│   ├── illustrations/
│   │   ├── page-01-prompt.md
│   │   ├── page-01.png
│   │   └── ...
│   └── README.md
├── book-2-garden-adventure/
├── book-3-grandparents-visit/
├── book-4-llama-dance/
└── book-5-colors/
```

## Illustration Requirements Per Page

Each page needs:
1. **Prompt file**: DALL-E prompt using character guide
2. **Generated image**: 1792x1024 landscape
3. **Iteration log**: Notes on refinements needed

## Quality Checklist Per Book

- [ ] All 20 pages have text in both languages
- [ ] All illustrations are consistent with character guide
- [ ] Pinyin included above Chinese characters
- [ ] Oscar appears as guardian in appropriate scenes
- [ ] Ladybug motif included somewhere
- [ ] Story has clear beginning, middle, end
- [ ] Age-appropriate vocabulary (21 months)
- [ ] Repetitive phrases for learning
- [ ] Interactive elements (find Oscar, count ladybugs)
