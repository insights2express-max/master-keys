/* Clue Duel — CLUE PICS v02 (Phase C)
   One entry per line:  WORD|type|picture
   Types, and the lowest Challenge Level that uses them (JM, CD-2: 4.1):
     lit    literal          🐟 = FISH                     (level 1+)
     cat    category         🍎🍌🍇 = FRUIT                 (level 3+)
     assoc  association      🔒 = KEY                      (level 4+)
     rebus  compound rebus   🐄 + 👦 = COWBOY              (level 6+)
     sound  sound-alike      🌻 = FLOUR                    (level 7+)
     math   letter math      🐻 − B + P = PEAR             (level 8+)
   Only words that are in the word list (lexicon.js) are used. Literal pictures already in lexicon.js still count.
   Emoji are limited to ones that display on Windows 10/11, iPhone and Android (Unicode 12 or older). */
self.CLUEPIC_DATA = `
# ---------- literal (adds to the pictures already in lexicon.js) ----------
AX|lit|🪓
PC|lit|💻
LP|lit|💿
RV|lit|🚐
BOA|lit|🐍
ASP|lit|🐍
CRY|lit|😢
DAD|lit|👨
DEW|lit|💧
DOE|lit|🦌
ELK|lit|🦌
DOT|lit|🔵
EWE|lit|🐑
LAMB|lit|🐑
FRY|lit|🍳
GEM|lit|💎
GIN|lit|🍸
GUN|lit|🔫
HOT|lit|🔥
ICE|lit|🧊
ICY|lit|🥶
ILL|lit|🤒
INN|lit|🏨
IVY|lit|🌿
JOG|lit|🏃
KEG|lit|🛢️
LAB|lit|🧪
LIE|lit|🤥
MAD|lit|😠
MAN|lit|👨
MOM|lit|👩
MUG|lit|☕
NAP|lit|😴
NET|lit|🥅
OAK|lit|🌳
OAR|lit|🚣
OAT|lit|🌾
PAD|lit|📝
PAL|lit|🤝
PET|lit|🐕
PUB|lit|🍺
RIB|lit|🍖
ROB|lit|🦹
RUM|lit|🥃
SEA|lit|🌊
SKY|lit|☁️
SON|lit|👦
SUM|lit|➕
TAX|lit|💸
TIN|lit|🥫
TIP|lit|💵
TOE|lit|🦶
TOP|lit|🔝
VET|lit|🩺
WAR|lit|⚔️
WET|lit|💦
WON|lit|🏆
ZEN|lit|🧘
ZOO|lit|🦒
ABS|lit|💪
BRA|lit|👙
DUO|lit|👯
GNU|lit|🐃
MOO|lit|🐄
MEW|lit|🐱
PEW|lit|⛪
POP|lit|🥤
PUG|lit|🐶
STY|lit|🐖
TOM|lit|🐈
TOT|lit|👶
UGH|lit|🤢
ODE|lit|📜
ACHE|lit|🤕
ARMY|lit|💂
BAKE|lit|🧁
BALD|lit|👨‍🦲
BAND|lit|🎸
BATH|lit|🛁
BEAD|lit|📿
BIKE|lit|🚲
BILL|lit|🧾
BOIL|lit|♨️
BULB|lit|💡
BULL|lit|🐂
BURN|lit|🔥
CAFE|lit|☕
CALF|lit|🐄
CANE|lit|🦯
CAPE|lit|🦸
CHEF|lit|👨‍🍳
CHIP|lit|🍟
CLAM|lit|🦪
CLAW|lit|🦀
COOK|lit|🍳
DIAL|lit|☎️
DISH|lit|🍽️
DOCK|lit|⚓
DOVE|lit|🕊️
DUNE|lit|🏜️
DUSK|lit|🌆
EXIT|lit|🚪
FACE|lit|🙂
FEET|lit|🦶
FERN|lit|🌿
FORT|lit|🏰
FUEL|lit|⛽
GEAR|lit|⚙️
GLOW|lit|✨
GOLF|lit|⛳
HAIL|lit|🌨️
HAIR|lit|💇
HAWK|lit|🦅
HEAT|lit|🌡️
HILL|lit|⛰️
HOST|lit|🎤
KNEE|lit|🦵
LADY|lit|👩
LAKE|lit|🏞️
LAMP|lit|🪔
LENS|lit|🔍
LOAF|lit|🍞
MALL|lit|🛍️
MANE|lit|🦁
MAST|lit|⛵
MEAL|lit|🍽️
MEAT|lit|🥩
MINE|lit|⛏️
MINT|lit|🌿
MIST|lit|🌫️
NAVY|lit|⚓
OVAL|lit|🥚
PEEL|lit|🍌
PILL|lit|💊
PORK|lit|🥓
POST|lit|📮
POUR|lit|🌧️
RAIL|lit|🛤️
ROBE|lit|👘
ROOF|lit|🏠
SAIL|lit|⛵
SALE|lit|🏷️
SAND|lit|🏖️
SEED|lit|🌱
SHOP|lit|🏪
SINK|lit|🚰
SONG|lit|🎵
SOUR|lit|🍋
SPIN|lit|🌀
STEM|lit|🌱
STEW|lit|🍲
SUIT|lit|👔
SWIM|lit|🏊
TENT|lit|⛺
TEST|lit|📝
TEXT|lit|💬
TICK|lit|⏰
TIDE|lit|🌊
TOAD|lit|🐸
TWIN|lit|👯
VINE|lit|🍇
VOTE|lit|🗳️
WOOL|lit|🧶
YARN|lit|🧶
CLEF|lit|🎼
CZAR|lit|👑
EPEE|lit|🤺
GNAT|lit|🦟
OPAL|lit|💎
TOME|lit|📕
TOTE|lit|👜
VIAL|lit|🧪
WREN|lit|🐦
ACTOR|lit|🎭
ALBUM|lit|💿
ATLAS|lit|🗺️
AUDIO|lit|🔊
BADGE|lit|📛
BAKER|lit|🥖
BEAST|lit|👹
BIRTH|lit|👶
BLADE|lit|🔪
BLAST|lit|💥
BLAZE|lit|🔥
BLINK|lit|😉
BLOCK|lit|🧱
BRAIN|lit|🧠
BRICK|lit|🧱
CABLE|lit|🔌
CARGO|lit|📦
CHAIR|lit|🪑
CHEER|lit|📣
CHEST|lit|🧰
CHILD|lit|🧒
CLOWN|lit|🤡
COUCH|lit|🛋️
COURT|lit|⚖️
CROWN|lit|👑
CYCLE|lit|🚲
DAIRY|lit|🥛
DRAMA|lit|🎭
EASEL|lit|🎨
FEAST|lit|🍗
FEVER|lit|🤒
FIELD|lit|🌾
FLAME|lit|🔥
FLASH|lit|⚡
FLEET|lit|🚢
FLOOD|lit|🌊
FROST|lit|❄️
FUDGE|lit|🍫
GLASS|lit|🥛
GRASS|lit|🌱
HOUSE|lit|🏠
IMAGE|lit|🖼️
JEANS|lit|👖
JUDGE|lit|⚖️
LAUGH|lit|😂
LEASH|lit|🦮
LIGHT|lit|💡
LUNAR|lit|🌙
LUNCH|lit|🥪
MEDAL|lit|🏅
METAL|lit|🔩
MOUSE|lit|🐭
MOUTH|lit|👄
MOVIE|lit|🎬
MUSIC|lit|🎵
NOISE|lit|🔊
NORTH|lit|🧭
NOVEL|lit|📖
OCEAN|lit|🌊
OPERA|lit|🎭
ORBIT|lit|🪐
PAINT|lit|🖌️
PAPER|lit|📄
PEARL|lit|🦪
PHONE|lit|📱
PLANE|lit|✈️
PLANT|lit|🌱
PLATE|lit|🍽️
POLAR|lit|🐻‍❄️
PRIZE|lit|🏆
PUPPY|lit|🐶
RADIO|lit|📻
RIVER|lit|🏞️
ROAST|lit|🍗
ROBIN|lit|🐦
ROYAL|lit|👑
SALAD|lit|🥗
SKIRT|lit|👗
SLICE|lit|🍕
SMOKE|lit|💨
SNACK|lit|🍿
SPACE|lit|🚀
SPORT|lit|⚽
STEAM|lit|♨️
SUNNY|lit|☀️
TOAST|lit|🍞
TOOTH|lit|🦷
VIDEO|lit|📹
WATER|lit|💧
WHEAT|lit|🌾
WORLD|lit|🌍
YACHT|lit|🛥️
DENIM|lit|👖
HUSKY|lit|🐕
KAYAK|lit|🛶
LATTE|lit|☕
MURAL|lit|🖼️
OASIS|lit|🏝️
PECAN|lit|🥜
SAUNA|lit|🧖
SEDAN|lit|🚗
SLOTH|lit|🦥
THYME|lit|🌿
TIARA|lit|👸
TOPAZ|lit|💎
VAULT|lit|🏦
VIPER|lit|🐍
WALTZ|lit|💃
ANCHOR|lit|⚓
ANIMAL|lit|🐾
ARTIST|lit|🎨
AUTUMN|lit|🍂
BUTTON|lit|🔘
CAMERA|lit|📷
CANDLE|lit|🕯️
CELERY|lit|🥬
COFFEE|lit|☕
DINNER|lit|🍽️
ENGINE|lit|🚂
FAMILY|lit|👪
FATHER|lit|👨
FINGER|lit|👆
FLOWER|lit|🌸
FOREST|lit|🌲
FRIEND|lit|🤝
GARDEN|lit|🏡
INSECT|lit|🐛
ISLAND|lit|🏝️
JACKET|lit|🧥
JIGSAW|lit|🧩
JUNGLE|lit|🌴
LIZARD|lit|🦎
MARKET|lit|🛒
MOTHER|lit|👩
PARADE|lit|🎉
PICNIC|lit|🧺
PIRATE|lit|🏴‍☠️
PUZZLE|lit|🧩
SADDLE|lit|🐎
SAFARI|lit|🦒
SALMON|lit|🐟
SECRET|lit|🤫
SPRING|lit|🌷
STREET|lit|🛣️
STRONG|lit|💪
SUMMER|lit|☀️
TABLET|lit|💊
TEACUP|lit|🍵
TURTLE|lit|🐢
ZIPPER|lit|🤐
ELIXIR|lit|🧪
ORACLE|lit|🔮
SPRITE|lit|🧚
ANTENNA|lit|📡
APRICOT|lit|🍑
BATTERY|lit|🔋
BEDROOM|lit|🛏️
BROTHER|lit|👦
CHICKEN|lit|🐔
CONCERT|lit|🎤
CRYSTAL|lit|🔮
DIAMOND|lit|💎
GALLERY|lit|🖼️
GLACIER|lit|🧊
HARVEST|lit|🌾
HOLIDAY|lit|🏖️
KITCHEN|lit|🍳
MACHINE|lit|⚙️
MESSAGE|lit|✉️
PAINTER|lit|🎨
PICTURE|lit|🖼️
PRESENT|lit|🎁
PYRAMID|lit|🔺
SEAFOOD|lit|🦐
SPINACH|lit|🥬
WEATHER|lit|🌦️
MIRACLE|lit|✨
TEMPEST|lit|🌪️

# ---------- category: several pictures, one group word ----------
FRUIT|cat|🍎🍌🍇
HERD|cat|🐄🐄🐄
FLEET|cat|🚢🚢🚢
ARMY|cat|💂💂💂
TRIO|cat|🎻🎻🎻
PAIR|cat|🧦🧦
DUO|cat|🎤🎤
TWIN|cat|👶👶
SNACK|cat|🍿🥨🍪
SPORT|cat|⚽🏀🎾
MUSIC|cat|🎸🎹🥁
MEDAL|cat|🥇🥈🥉
INSECT|cat|🐜🐝🐞
ANIMAL|cat|🐶🐱🐮
FLOWER|cat|🌹🌻🌷
DAIRY|cat|🥛🧀🍦
MEAT|cat|🥩🍗🥓
FAMILY|cat|👨👩👧
GEM|cat|💎💍
METAL|cat|🥇🔩🥄
WEATHER|cat|☀️🌧️❄️
SEAFOOD|cat|🦐🦀🦞
SALAD|cat|🥬🍅🥒
MEAL|cat|🍳🥪🍝
TOOL|cat|🔨🔧🪓
GAME|cat|♟️🎲🃏
TOY|cat|🧸🪀🪁
DESK|cat|✏️📎📏
SPACE|cat|🌍🪐🌙
OCEAN|cat|🐳🐙🐠
FARM|cat|🐄🐖🐔
JUNGLE|cat|🐒🐍🌴
CANDY|cat|🍬🍭🍫
BREAD|cat|🥖🥐🍞
DRINK|cat|🥤☕🍵
SHAPE|cat|🔺🟦⚪
COLOR|cat|🔴🟢🔵
SIGN|cat|🛑⚠️🚸
HAT|cat|🎩🧢👒
SHOE|cat|👟👠👞
BIRD|cat|🐦🦅🦆
TREE|cat|🌳🌲🌴
TIME|cat|⏰⏳⌚
MONEY|cat|💵💶🪙
CARD|cat|🃏🎴
SEASON|cat|🌷☀️🍂❄️
NUMBER|cat|1️⃣2️⃣3️⃣
CLOCK|cat|🕐🕑🕒

# ---------- association: a picture that goes with the word ----------
KEY|assoc|🔒
LOCK|assoc|🔑
CUB|assoc|🐻
PRIDE|assoc|🦁
ROAR|assoc|🦁
MANE|assoc|🐎
HIVE|assoc|🐝
HONEY|assoc|🐝
WEB|assoc|🕷️
NEST|assoc|🥚
EGG|assoc|🐔
MILK|assoc|🐄
WOOL|assoc|🐑
INK|assoc|🐙
IVORY|assoc|🐘
PEARL|assoc|🦪
SILK|assoc|🐛
BONE|assoc|🐕
HOOT|assoc|🦉
WISE|assoc|🦉
SLY|assoc|🦊
BUSY|assoc|🐝
SLOW|assoc|🐌
FAST|assoc|🐆
TALL|assoc|🦒
TINY|assoc|🐜
BRAVE|assoc|🦁
LAZY|assoc|🦥
PEACE|assoc|🕊️
WAND|assoc|🧙
SPELL|assoc|🧙
MAGIC|assoc|🎩
THRONE|assoc|👑
KING|assoc|♚
WITCH|assoc|🧹
GHOST|assoc|👻
TEACHER|assoc|🍎
DOCTOR|assoc|🩺
NURSE|assoc|🏥
PILOT|assoc|✈️
SAILOR|assoc|⚓
CHEF|assoc|🍝
BAKER|assoc|🎂
JUDGE|assoc|🔨
COURT|assoc|🎾
LAW|assoc|⚖️
TIDE|assoc|🌙
LUNAR|assoc|🌕
SOLAR|assoc|☀️
SNOW|assoc|⛄
WINTER|assoc|⛄
SUMMER|assoc|🏖️
SPRING|assoc|🐣
AUTUMN|assoc|🍁
BEACH|assoc|🏄
RAIN|assoc|☂️
STORM|assoc|⛈️
FIRE|assoc|🚒
SMOKE|assoc|🔥
ASH|assoc|🌋
HEAR|assoc|👂
SEE|assoc|👀
LOOK|assoc|👀
SMELL|assoc|👃
TASTE|assoc|👅
SPEAK|assoc|🗣️
SING|assoc|🎤
DRAW|assoc|✏️
READ|assoc|📚
SLEEP|assoc|💤
DREAM|assoc|💭
KISS|assoc|💋
HUG|assoc|🤗
ANGER|assoc|😡
IRE|assoc|😠
RAGE|assoc|🤬
FEAR|assoc|😱
SHY|assoc|🙈
LUCK|assoc|🍀
LUCKY|assoc|🍀
CHANCE|assoc|🎲
ODDS|assoc|🎲
RICH|assoc|💰
BANK|assoc|🏦
CASH|assoc|💵
WIN|assoc|🏆
GIFT|assoc|🎀
PARTY|assoc|🎈
CAKE|assoc|🕯️
CANDLE|assoc|🎂
WRIST|assoc|⌚
TIME|assoc|⏳
HOUR|assoc|⌛
NORTH|assoc|🧭
MAIL|assoc|📬
STAMP|assoc|✉️
POST|assoc|📬
SAIL|assoc|🌬️
MAST|assoc|🏴‍☠️
BOAT|assoc|⚓
TRAIN|assoc|🛤️
TRACK|assoc|🚂
ROAD|assoc|🚗
CAR|assoc|🔑
FUEL|assoc|🚗
GOLF|assoc|🏌️
NET|assoc|🎾
RACKET|assoc|🎾
GLOVE|assoc|⚾
BAT|assoc|⚾
GOAL|assoc|🥅
CHESS|assoc|♟️
DICE|assoc|🎲
CARD|assoc|♠️
ACE|assoc|♠️
SPADE|assoc|♠️
HEART|assoc|♥️
LOVE|assoc|💘
ROSE|assoc|🥀
THORN|assoc|🌹
STEM|assoc|🌹
PETAL|assoc|🌸
ROOT|assoc|🥕
SEED|assoc|🍉
PIT|assoc|🍑
PEEL|assoc|🍊
CORE|assoc|🍎
JUICE|assoc|🍊
TOAST|assoc|🥂
BREW|assoc|🍺
GRAPE|assoc|🍷
VINE|assoc|🍷
CHEESE|assoc|🐭
TRAP|assoc|🐭
CAGE|assoc|🦜
PARROT|assoc|🏴‍☠️
PIRATE|assoc|🦜
TREASURE|assoc|🗺️
MAP|assoc|🧭
TENT|assoc|🏕️
CAMP|assoc|⛺
FOREST|assoc|🦌
DEER|assoc|🌲
SNAKE|assoc|🥚
VENOM|assoc|🐍
STING|assoc|🐝
ITCH|assoc|🦟
DENTIST|assoc|🦷
BRUSH|assoc|🦷
COMB|assoc|💇
SOAP|assoc|🛁
TOWEL|assoc|🛁
BED|assoc|💤
NIGHT|assoc|🌙
DAWN|assoc|🌅
NOON|assoc|🕛
LIGHT|assoc|🔦
SHADOW|assoc|🔦
GLASS|assoc|🍷
LENS|assoc|📷
FILM|assoc|🎥
MOVIE|assoc|🍿
STAGE|assoc|🎭
DANCE|assoc|💃
BALLET|assoc|🩰
PIANO|assoc|🎹
DRUM|assoc|🥁
NOTE|assoc|🎵
SONG|assoc|🎤
HERO|assoc|🦸
ROBOT|assoc|🤖
ALIEN|assoc|🛸
SPACE|assoc|🚀
ORBIT|assoc|🛰️
EARTH|assoc|🌍
VOLCANO|assoc|🌋
DESERT|assoc|🐫
CAMEL|assoc|🏜️
OASIS|assoc|🌴
ICE|assoc|⛸️
SKATE|assoc|⛸️
SKI|assoc|⛷️
SLED|assoc|🛷
IGLOO|assoc|🐧
POLAR|assoc|🐧
SALT|assoc|🌊
PEPPER|assoc|🌶️
SPICE|assoc|🌶️
HOT|assoc|🌶️
COLD|assoc|🥶
FROST|assoc|⛄
FLU|assoc|🤧
COUGH|assoc|😷
SNEEZE|assoc|🤧
HOSPITAL|assoc|🚑
CURE|assoc|💊
HEAL|assoc|🩹
WOUND|assoc|🩹
TEAR|assoc|😢
WEEP|assoc|😭
SMILE|assoc|😁
JOKE|assoc|😂
CLOWN|assoc|🎪
CIRCUS|assoc|🎪
TENT|assoc|🎪
OWL|assoc|🌙
BAT|assoc|🦇
FANG|assoc|🧛
VAMPIRE|assoc|🦇
SKULL|assoc|☠️
POISON|assoc|☠️
GRAVE|assoc|⚰️

# ---------- compound rebus: picture + picture = word ----------
RAINBOW|rebus|🌧️ + 🎀
COWBOY|rebus|🐄 + 👦
BEDROOM|rebus|🛏️ + 🚪
SUNBURN|rebus|☀️ + 🔥
EARRING|rebus|👂 + 💍
SEAFOOD|rebus|🌊 + 🍔
TEACUP|rebus|🍵 + 🏆
CARPET|rebus|🚗 + 🐕
HOTDOG|rebus|🔥 + 🐕
CATFISH|rebus|🐈 + 🐟
BULLDOG|rebus|🐂 + 🐕
FIREMAN|rebus|🔥 + 👨
CUPCAKE|rebus|🏆 + 🎂
PANCAKE|rebus|🍳 + 🎂
SNOWMAN|rebus|❄️ + 👨
MAILBOX|rebus|✉️ + 📦
HANDBAG|rebus|✋ + 👜
SEAWEED|rebus|🌊 + 🌿
SEAGULL|rebus|🌊 + 🐦
KEYHOLE|rebus|🔑 + 🕳️
BOWTIE|rebus|🎀 + 👔
EYEBALL|rebus|👁️ + ⚽
PIGPEN|rebus|🐖 + 🖊️
DOGSLED|rebus|🐕 + 🛷
SUNDIAL|rebus|☀️ + ☎️
BEEHIVE|rebus|🐝 + 🍯
BOOKEND|rebus|📖 + 🔚
TOPHAT|rebus|🔝 + 🎩
CARGO|rebus|🚗 + 🟢
SANDBOX|rebus|🏖️ + 📦
EGGCUP|rebus|🥚 + 🏆
TOECAP|rebus|🦶 + 🧢
BATCAVE|rebus|🦇 + 🕳️
ICEBOX|rebus|🧊 + 📦
EARWAX|rebus|👂 + 🕯️
FISHNET|rebus|🐟 + 🥅
BEARHUG|rebus|🐻 + 🤗
MOONLIT|rebus|🌙 + 🔥
SUNLIT|rebus|☀️ + 🔥
BELLHOP|rebus|🔔 + 🐇
CARPOOL|rebus|🚗 + 🏊
BEDBUG|rebus|🛏️ + 🐛
SUNDAY|rebus|☀️ + 📅
BULLPEN|rebus|🐂 + 🖊️

# ---------- sound-alike: the picture sounds like the word ----------
FLOUR|sound|🌻
PAIR|sound|🍐
PEAR|sound|👫
BARE|sound|🐻
HAIR|sound|🐇
DEAR|sound|🦌
SEA|sound|👀
SEE|sound|🌊
BE|sound|🐝
TOO|sound|2️⃣
TO|sound|2️⃣
FOR|sound|4️⃣
ATE|sound|8️⃣
WON|sound|1️⃣
SON|sound|☀️
SUN|sound|👦
TAIL|sound|📖
ROWS|sound|🌹
MEAT|sound|🤝
MEET|sound|🥩
PEACE|sound|🧩
SAIL|sound|🏷️
SALE|sound|⛵
WHOLE|sound|🕳️
PLAIN|sound|✈️
WEAK|sound|📅
BLEW|sound|🔵
READ|sound|🔴
BREAK|sound|🛑
STEAL|sound|🔩
STEEL|sound|🦹
HEAL|sound|👠
DUE|sound|💧
PREY|sound|🙏
ROLE|sound|🍞
ROLL|sound|🎭
SOUL|sound|👟
SOLE|sound|👻
MAIN|sound|🦁
FLEA|sound|🏃
BURY|sound|🍓
KNOWS|sound|👃
NOSE|sound|🧠
WAIT|sound|🏋️
WEIGHT|sound|⏳
NIGHT|sound|🤺
KNIGHT|sound|🌙
EIGHT|sound|🍽️
AISLE|sound|🏝️
BEET|sound|🥁
TOW|sound|🦶
HOARSE|sound|🐎
HORSE|sound|🗣️
MAIL|sound|👨
MALE|sound|📬
BYE|sound|🛒
BUY|sound|👋
DEER|sound|💌
HERD|sound|👂
HEARD|sound|🐄🐄
POLE|sound|🗳️
SEAM|sound|🤔
FAIR|sound|🚌
FARE|sound|🎡
CELL|sound|🏷️
NONE|sound|🧕
NUN|sound|0️⃣
YOU|sound|🐑
OH|sound|0️⃣
WAY|sound|⚖️
WEIGH|sound|🛣️

# ---------- letter math: change the picture's word into the answer ----------
PEAR|math|🐻 − B + P
DEAR|math|🐻 − B + D
GEAR|math|🐻 − B + G
NEAR|math|🐻 − B + N
YEAR|math|🐻 − B + Y
TEAR|math|🐻 − B + T
FEAR|math|🐻 − B + F
HEAR|math|🐻 − B + H
WEAR|math|🐻 − B + W
REAR|math|🐻 − B + R
BAT|math|🐈 − C + B
HAT|math|🐈 − C + H
MAT|math|🐈 − C + M
RAT|math|🐈 − C + R
SAT|math|🐈 − C + S
FAT|math|🐈 − C + F
PAT|math|🐈 − C + P
LOG|math|🐕 − D + L
FOG|math|🐕 − D + F
JOG|math|🐕 − D + J
HOG|math|🐕 − D + H
RUN|math|☀️ − S + R
FUN|math|☀️ − S + F
BUN|math|☀️ − S + B
GUN|math|☀️ − S + G
NUN|math|☀️ − S + N
BIG|math|🐖 − P + B
DIG|math|🐖 − P + D
WIG|math|🐖 − P + W
FIG|math|🐖 − P + F
SEE|math|🐝 − B + S
FEE|math|🐝 − B + F
HEY|math|🔑 − K + H
BOX|math|🦊 − F + B
WELL|math|🔔 − B + W
TELL|math|🔔 − B + T
SELL|math|🔔 − B + S
FELL|math|🔔 − B + F
HIRE|math|🔥 − F + H
WIRE|math|🔥 − F + W
TIRE|math|🔥 − F + T
LAKE|math|🎂 − C + L
BAKE|math|🎂 − C + B
MAKE|math|🎂 − C + M
RAKE|math|🎂 − C + R
TAKE|math|🎂 − C + T
WAKE|math|🎂 − C + W
NOSE|math|🌹 − R + N
HOSE|math|🌹 − R + H
POSE|math|🌹 − R + P
HORN|math|🌽 − C + H
KING|math|💍 − R + K
SING|math|💍 − R + S
WING|math|💍 − R + W
SOON|math|🌙 − M + S
NOON|math|🌙 − M + N
COAT|math|⛵ − B + C
GOAT|math|⛵ − B + G
MOAT|math|⛵ − B + M
DISH|math|🐟 − F + D
WISH|math|🐟 − F + W
FREE|math|🌳 − T + F
LUCK|math|🦆 − D + L
ROCK|math|🔒 − L + R
DOCK|math|🔒 − L + D
SOCK|math|🔒 − L + S
CONE|math|🦴 − B + C
TONE|math|🦴 − B + T
ZONE|math|🦴 − B + Z
SAND|math|✋ − H + S
BAND|math|✋ − H + B
LAND|math|✋ − H + L
COOK|math|📖 − B + C
LOOK|math|📖 − B + L
HOOK|math|📖 − B + H
JAR|math|🚗 − C + J
FAR|math|🚗 − C + F
TAR|math|🚗 − C + T
WAR|math|🚗 − C + W
CAP|math|🗺️ − M + C
NAP|math|🗺️ − M + N
TAP|math|🗺️ − M + T
LAP|math|🗺️ − M + L
TEN|math|🖊️ − P + T
HEN|math|🖊️ − P + H
DEN|math|🖊️ − P + D
MEN|math|🖊️ − P + M
RED|math|🛏️ − B + R
FED|math|🛏️ − B + F
LED|math|🛏️ − B + L
HOW|math|🐄 − C + H
NOW|math|🐄 − C + N
VOW|math|🐄 − C + V
BOW|math|🐄 − C + B
ROW|math|🐄 − C + R
MOUSE|math|🏠 − H + M
`;
