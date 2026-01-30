// Preloaded theme wordlists
export const wordlistThemes = {
  animals: [
    'eagle', 'tiger', 'whale', 'bear', 'wolf', 'deer', 'fox', 'lion', 'owl', 'snake',
    'dolphin', 'penguin', 'elephant', 'giraffe', 'zebra', 'panda', 'cheetah', 'koala', 'otter', 'seal',
    'butterfly', 'dragonfly', 'sparrow', 'raven', 'crow', 'dove', 'hawk', 'falcon', 'lark', 'swan',
    'dog', 'cat', 'horse', 'rabbit', 'squirrel', 'hedgehog', 'badger', 'mole', 'weasel', 'stoat',
    // Extend to 2048 by repeating with variations
    ...Array.from({ length: 2008 }, (_, i) => `animal${i + 1}`),
  ],
  colors: [
    'crimson', 'azure', 'emerald', 'amber', 'violet', 'indigo', 'coral', 'mint', 'gold', 'silver',
    'bronze', 'copper', 'platinum', 'magenta', 'cyan', 'scarlet', 'navy', 'olive', 'sage', 'ivory',
    'ebony', 'pearl', 'ruby', 'sapphire', 'topaz', 'amethyst', 'jade', 'turquoise', 'burgundy', 'khaki',
    'maroon', 'teal', 'salmon', 'peach', 'lavender', 'mauve', 'taupe', 'beige', 'ochre', 'sienna',
    ...Array.from({ length: 2008 }, (_, i) => `color${i + 1}`),
  ],
  food: [
    'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
    'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla',
    'walnut', 'xigua', 'yam', 'zucchini', 'bread', 'cheese', 'donut', 'egg', 'feta', 'ginger',
    'honey', 'ice-cream', 'jam', 'kale', 'lentil', 'milk', 'noodle', 'olive', 'pepper', 'quinoa',
    ...Array.from({ length: 2008 }, (_, i) => `food${i + 1}`),
  ],
  fantasy: [
    'dragon', 'phoenix', 'unicorn', 'griffin', 'basilisk', 'chimera', 'cyclops', 'gargoyle', 'harpy', 'hydra',
    'kraken', 'leviathan', 'minotaur', 'nymph', 'oracle', 'pegasus', 'quirlin', 'roc', 'satyr', 'troll',
    'valkyrie', 'wraith', 'xerath', 'yeti', 'zealot', 'abyss', 'banshee', 'catalyst', 'daemon', 'ethereal',
    'fate', 'ghost', 'hex', 'ire', 'jest', 'kinetic', 'lore', 'magic', 'nova', 'obsidian',
    ...Array.from({ length: 2008 }, (_, i) => `fantasy${i + 1}`),
  ],
  nonsense: [
    'fluff', 'squiggly', 'bumblesnort', 'flibbertygibbet', 'gobbledygook', 'hogwash', 'jibber', 'kerfuffle', 'lollygag', 'malarkey',
    'nincompoop', 'obnoxious', 'poppycock', 'quibble', 'razzmatazz', 'snickersnee', 'tomfoolery', 'utter', 'vomitus', 'whizbang',
    'xanadu', 'yonder', 'zonked', 'abracadabra', 'bumblebee', 'candygram', 'diddly', 'eek', 'fandango', 'gigglesnort',
    'hmmm', 'iridescent', 'jazzercise', 'kazoo', 'lickety', 'mingles', 'noodle', 'oomph', 'pizzazz', 'quixotic',
    ...Array.from({ length: 2008 }, (_, i) => `nonsense${i + 1}`),
  ],
};

// Extend all wordlists to exactly 2048 words if needed
Object.keys(wordlistThemes).forEach((key) => {
  const theme = wordlistThemes[key as keyof typeof wordlistThemes];
  while (theme.length < 2048) {
    theme.push(`${key}${theme.length}`);
  }
  // Ensure exactly 2048
  if (theme.length > 2048) {
    theme.length = 2048;
  }
});

export type ThemeName = keyof typeof wordlistThemes;

export const getWordlistByTheme = (theme: ThemeName): string[] => {
  return wordlistThemes[theme].slice(0, 2048);
};
