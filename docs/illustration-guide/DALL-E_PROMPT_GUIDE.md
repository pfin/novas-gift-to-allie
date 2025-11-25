# DALL-E Prompt Engineering Guide for Allie's Books

## Proven Prompt Structure

### Template
```
A whimsical, cartoon-style family illustration featuring [CHARACTERS] in [SETTING].
[CHARACTER 1 FULL DESCRIPTION], [ACTION].
[CHARACTER 2 FULL DESCRIPTION], [ACTION].
[Oscar description if present].
The background includes [BACKGROUND DETAILS].
The lighting is [LIGHTING DESCRIPTION].
The style is colorful, fluffy, and whimsical, suitable for a children's book.
Ensure [EXCLUSIONS - what NOT to include].
```

### Character Description Blocks (Copy-Paste Ready)

**Allie**:
```
Allie, a cheerful toddler with short black hair, wearing [OUTFIT], [ACTION]
```

**Peter**:
```
Peter, a tall, lean blonde man in his 40s wearing [OUTFIT], [ACTION]
```

**Lu**:
```
Lu, a petite adult Asian woman in her 30s with medium-length black hair wearing [OUTFIT], [ACTION]
```

**Popo**:
```
Popo, an Asian grandmother in her early 60s with a short black bob and no glasses, wearing [OUTFIT], [ACTION]
```

**Gong Gong**:
```
Gong Gong, an Asian grandfather in his early 60s with short black hair and a clean-shaven face, wearing [OUTFIT], [ACTION]
```

**Oscar**:
```
Oscar, a fluffy, solid grey Scottish Fold cat with folded ears and no patterns or stripes, [ACTION]
```

## Common Issues and Fixes

### Problem: Grey hair on grandparents
**Fix**: Explicitly state "short black bob (black hair)" and "short black hair"

### Problem: Glasses appearing
**Fix**: Add "and no glasses" after character description

### Problem: Mustache on Gong Gong
**Fix**: Explicitly state "clean-shaven face"

### Problem: Stripes on Oscar
**Fix**: Add "and no patterns or stripes"

### Problem: Extra characters appearing
**Fix**: Add "Ensure no other characters or children are included in the scene"

### Problem: Dogs appearing instead of cats
**Fix**: Make Oscar prominent: "Oscar, a fluffy, solid grey Scottish Fold cat..."

## Tested Successful Prompts

### Beach Scene
```json
{
  "prompt": "A whimsical, cartoon-style family illustration featuring Lu, Allie, Popo, and Oscar on a sunny beach. Lu, a petite adult Asian woman in her 30s with medium-length black hair, is wearing a red shirt and jeans, holding Allie's hand. Allie, a cheerful toddler with short black hair, is wearing a playful outfit and a sun hat. Popo, an Asian grandmother in her early 60s with a short black bob (black hair) and a light cardigan, is walking beside them, also holding Allie's other hand. Oscar, a fluffy, solid grey Scottish Fold cat with folded ears and no patterns or stripes, is lounging playfully near them on the sandy beach. The background includes a bright blue sky, sandy beach, and seaside houses in the distance. The lighting is sunny and vibrant, with colorful, fluffy details suitable for a children's book. Ensure no other characters or children are included in the scene.",
  "size": "1792x1024"
}
```

### Living Room/Christmas Scene
```json
{
  "prompt": "A whimsical, cartoon-style family illustration set in a classic living room with a large window and a decorated Christmas tree. Gong Gong, an Asian grandfather in his early 60s with short black hair and a clean-shaven face, stands on the far left wearing a neat button-up shirt. Popo, an Asian grandmother in her early 60s with a short black bob, wears a patterned coat and holds Allie, a cheerful toddler with short black hair in a festive patterned dress, on her shoulder. Lu, a petite Asian woman in her 30s with medium-length black hair and a solid blue top, stands beside Popo. Peter, a tall, lean blonde man in his 40s wearing a casual button-up shirt and jeans, stands on the far right. A solid grey Scottish Fold cat lounges at their feet, and a ladybug perches subtly on the Christmas tree. The lighting is warm and festive, with intricate details capturing the holiday spirit. The style is fluffy, colorful, and warm, suitable for a children's book.",
  "size": "1792x1024"
}
```

### Playroom Scene
```json
{
  "prompt": "A whimsical, cartoon-style family illustration featuring Allie, Gong Gong, and Oscar in a cozy playroom. Allie, a cheerful toddler with short black hair, is sitting on a soft rug and building a colorful tower with toy blocks. Gong Gong, an Asian grandfather in his early 60s with short black hair and a clean-shaven face, is kneeling beside her, stabilizing the tower and smiling warmly. Oscar, a solid grey Scottish Fold cat with folded ears, is sitting nearby, watching protectively. The playroom has soft rugs, scattered toys, shelves with books, and large windows letting in soft natural light. The style is colorful, fluffy, and whimsical, suitable for a children's book. Ensure Gong Gong is clean-shaven and has black hair.",
  "size": "1792x1024"
}
```

## Image Sizes

- **Book pages (landscape)**: 1792x1024
- **Book pages (portrait)**: 1024x1792
- **Square illustrations**: 1024x1024
- **Website hero**: 1792x1024

## Iteration Process

1. Generate initial image
2. Compare against description
3. Log discrepancies
4. Refine prompt with explicit corrections
5. Regenerate
6. Repeat until loss function < 10%

### Loss Function Checklist
- [ ] Character positions correct
- [ ] Hair colors correct (black for Asians)
- [ ] No unwanted facial hair
- [ ] No glasses unless specified
- [ ] Oscar is solid grey
- [ ] No extra characters
- [ ] Setting matches description
- [ ] Style is whimsical/children's book
