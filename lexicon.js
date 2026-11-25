/* Master Keys (fka Clue Duel) — custom lexicon for CrossKeys and LockWord (v07d): 3,424 words (304 of them 2-letter answers) plus 114 extra clue sets
   Format, one entry per line:  WORD|literal clue|indirect clue|level 1-5|picture (optional emoji)|Challenge Levels (optional: "7" = 7 and up, "2-4")
   A word listed again adds an EXTRA clue set (one set is picked at random for each grid).
   Level: 1 everyday · 2 common · 3 moderate · 4 advanced · 5 obscure
   Words are 2–7 letters, plus 11-letter words for Large grids (A–Z only). A repeated word adds an extra clue set (see above). */
// Lexicon edition (JM, CD-24 other edits 1.1): its own number, separate from the game version. Add 1 whenever the word data or the Lexicon page changes.
// L01 v07a · L02 v07b · L03 v07c · L04 v07d (wrapping cells) · L05 v07e (8-letter hint clues, edition number) · L06 v08 (8-letter easy and hard hints) · L07 (editor page: Status, Comments, Edit Mode + Copy Edits, advanced search; "/" in 23 Word Vault clues) · L08 v08b (58 country-code clues "Madrid URL" style, JM CD-27; Word Vault tricky hints) · L09 (JM's first Copy Edits, CD-29: ZAR clues, EXCITE added ON-DECK; ";" separates alternative clues, one picked at random) · L10 v08q (JM's Copy Edits, CD-59 + CD-60: 28 clue changes, "on an exchange board" / "on a bag tag" / "on a T-shirt tag" dropped, EXCITE active, new 1-letter clues, T pictures, drawn ICEBERG picture "@iceberg"; the Lexicon page gives each 1-letter row its own key) · L11 v08r (CD-62: 2.1a: 1-letter answers have one clue per row, so F, K and X's new ";" clues became separate rows; page: missing-letter marks drawn as in the game + "Missing-letter clues" filter) · L12 v08s (JM's Copy Edits CD-64 + CD-65: 34 changes, sorted Literal = plain / Indirect = figurative; page: permanent edit record, Reviewed ticks, Wordplay column, Claude drafts) · L13 v08t (JM's Copy Edits CD-66 + CD-67: 375 Claude drafts for A accepted, three-kind test — sound-alike clues to Wordplay, blanks to Indirect; ACRID; 125 new 1-letter clues with the blank inside the word; page: Draft toggle, clue lengths, Wrap / Clip, two-row filters)
self.LEXICON_VER = 'L16'; // L16 (v13c): page change (JM CD-140: each over-length clue choice marked in its cell; Longest clue names its column) + 47 pre-approved ordinal edits (first → 1st, etc.) in Literal and Indirect clues. L15 (v13c): L15 (v13c): page change (JM CD-137: Music Library features: bold FULL CAPS defaults, green active filters with ✕, chevron About, All reviewed, Screen button); same words and clues as L14.12. L14.12 (v13b): JM's CD-135: all 760 drafts accepted, 582 tier-2 KeyRing words ACTIVE; L14.11 (v13; same edition + ICE typo fix "Assassinate", JM 2026-11-24, no version bump per JM's lexicon CP): JM's CD-131: 22 edits; round 8: 100 letter-J-K drafts + KeyRing tier 2 round 2, 269 ON-DECK rows C; L14.10 (v12h): JM's CD-129: 618 drafts + 28 edits applied, tier 1 done; round 7: 84 letter-I drafts + KeyRing tier 2 round 1, 313 ON-DECK rows A-B; L14.09 (v12h): JM's CD-127 Copy Edits: 886 drafts applied, 363 KeyRing words ACTIVE; round 6: 156 letter-H drafts + KeyRing round 4, 462 ON-DECK rows Q-Z; L14.08 (v12g): JM's CD-124 fixes: 6 clues; L14.07 (v12e): JM's CD-108 Copy Edits applied, 335 KeyRing words ACTIVE; round 5: 130 letter-G drafts + KeyRing round 3, 363 ON-DECK rows I-P; L14.06 (v11e): KeyRing everyday words round 2: 335 ON-DECK rows D-H with drafts (CD-104: 2.3); L14.05 (v11e): JM's CD-104 Copy Edits: 2,033 drafts applied, 315 KeyRing words ACTIVE; drafts round 4: 175 letter-F rows; L14.04 (v11c): KeyRing everyday words round 1: 315 ON-DECK rows A-C with drafts (CD-100: 1.2.1; CD-101: 2.1-2.4); L14.03 (v11c): data-only, drafts round 3 (138 letter-E rows); L14.02 (v09a): data-only, drafts round 2 (162 letter-D rows, 32 shorter B rows, short CALF Wordplay); L14.01: drafts round 1 (C, short B Wordplay, shorter A); L14 = the renamed page (Master Keys Lexicon; CrossKeys / LockWord), a structure change
self.LEXICON_DATA = `
# ---------- 2 letters ----------
AD|Commercial; Selling; Promo|Spot on TV; Billboard filler|1
AH|"I see!"; Sound of realization|Sigh of relief; Spa sound|1
AM|Morning hours; Before noon|Rise-and-shine time; I ___ the walrus|1
AN|'A' before a vowel; Little article|___ apple a day|1
AS|Like, in comparisons|"___ you wish"|1
AT|Email symbol, spoken|Located ___ home|1
AX|Chopping tool; Lumberjack's tool|Give the ___ (fire)|2
BE|Exist; Live|To ___ or not to ___; Let it ___|1
BY|Next to; Beside|Stand ___ me; ___ the way|1
DO|Perform; Carry out|Party, informally; Hair ___|1
EH|"Pardon?"; "Huh?"|Canadian tag; Fonzie's word|2
EL|Raised railway|Chicago's L; Letter after K|3
EM|Printer's dash unit|Letter after L; Type measure|4
EN|Half an em|Letter before O; Type measure|4
EX|Former partner|Old flame; Letter before Y|2
GO|Move along|Green-light word; Board game of stones|1|🟢
HA|Laugh sound|Chuckle; "Gotcha!"|1
HE|That man|Helium; ___-man|1
HI|Hello|Aloha State; Wave word|1|👋
ID|Photo card|Ego's partner; Driver's license|2
IF|Conditional word|Big little word; ___ only|1
IN|Not out|Trendy; ___ the know|1
IS|Exists|3rd-person "be"; That ___ to say|1
IT|Tag player|Tech dept.; Stephen King novel|1
LA|Note after so|City of Angels|1
LO|"___ and behold"|Look, old-style|3
MA|Mom|Pa's partner|1
ME|Myself|1st-person object|1
MY|Belonging to me|"Oh ___!"|1
NO|Opposite of yes|Veto|1|🚫
OF|Made ___ wood|Belonging to|1
OH|"I see"|Zero, spoken|1
OK|All right|Fine|1|👌
ON|Switched to go|Not off|1
OR|Either's partner|Gold, in heraldry|2
OW|"Ouch!"|Cry of pain|1
OX|Plow animal|Yoke wearer|2|🐂
PA|Dad|Ma's partner|1
PI|3.14...|Circle ratio|2
SO|Therefore|"Just ___"|1
TO|Toward|Opposite of fro|1
UP|Not down|Awake|1|⬆️
US|You and me|America|1
WE|You and I|Us, as subject|1
YO|Hey there|Casual greeting|2
AI|Smart software; Computer brain|Chatbot's brain; HAL 9000, e.g.|2
TV|Telly|Small screen|1|📺
PC|Desktop computer|Correct, politically|1
UK|Britain|Blighty|1
EU|Brussels-based union|European bloc; Euro zone group|2
UN|World body|Peacekeeping org|2
NY|Big Apple state|Empire State|1
CD|Music disc; Compact disc|Vinyl's successor; Bank savings cert.|1|💿
DJ|Party music host|Record spinner; Turntable pro|1|🎧
GM|Car giant|Chess title; Detroit automaker|3
OZ|Ounce|Land of a wizard|2
RE|Regarding|About|2
EG|For example|"Say," in short; Like, briefly|2
IE|That is|In other words; Namely|3
ET|And, in Latin|"___ cetera"; Spielberg alien|3
PM|Afternoon|Prime Minister|1
AC|Air conditioning; Cool unit|Cool!; Chillin'; Summer's best friend|2
VR|Virtual reality|Goggles tech|2|🥽
MD|Doctor|Physician|2
RN|Nurse|Hospital pro|3
GI|Soldier|U.S. infantryman; ___ Joe|3
SE|Opposite of NW|Compass point|2|🧭
NE|Opposite of SW|Compass point|2
NW|Opposite of SE|Compass point|2
SW|Opposite of NE|Compass point|2
UT|Do, in the old scale|Utah|4
ST|Street|Saint|2
DR|Doctor|Drive, on maps; Title before Seuss|2
MR|Mister|Title for a man|1
MS|Title for a woman|Manuscript|1
TA|Thanks!|Teaching assistant|2
QT|On the ___ (secretly)|Quiet, slangily|4
XL|Extra large|Big tag size|2
HQ|Base|Main office; Command center|2
IQ|Smarts score|Brainpower; Genius gauge|1
FM|Radio band|AM partner; Radio|2|📻
AA|Small battery; Battery size|Remote-control fuel; Twelve-step group|2|🔋
NB|Note well|Take note abbr.|4
PR|Public relations|Spin|3
LP|Vinyl album|Record|3
EP|Short album|Mini-album; Few-track release|3
SF|Sci-fi|San Francisco|3
VP|Number two|2nd in command|2
PE|Gym class|School workout|1
RV|Camper|Motor home|2
OB|Doctor for births|___-GYN|4
TB|Lung disease|Terabyte|4
GB|Gigabyte|Great Britain; Storage unit|3
MB|Megabyte|Data size|3
KO|Knockout|Boxer's win; Down for the count|2|🥊
TI|Note before do|7th note|2
FA|Note after mi|4th note; Do-re-mi-___|2
MI|Note after re|3rd note|2
DA|Prosecutor|Russian yes; Courtroom accuser|3
JA|German yes|Yes, in Berlin; Swedish yes|3
SI|Spanish yes|Yes, in Madrid|3
OM|Meditation chant|Yoga sound|2
UM|Hesitation sound|"Er..."|1
ER|Hospital dept.|Hesitation sound; "Um…" cousin|1|🏥
AW|"How sweet!"|"Shucks!"; Puppy-photo reaction|1
UH|"Hmm..."|Filler word|1
EW|"Gross!"|"Yuck!"; Icky reaction|1|🤢
HM|Pondering sound|"Let me think..."; Thinking noise|2
SH|"Quiet!"|Library sound|2
# ---------- 3 letters ----------
ACE|Top card|Serve no one returns; Best-in-class; Hole-in-one|1
ACT|Perform on stage; Pretend|Bill becomes law; Play a part|1
ADD|Sum up; Tack on|Anti-minus; Minus x -1; Throw in|1
AGE|Years lived; Period; Era|Stone ___; Act your ___|1
AGO|In the past; Back then|Long, long ___; Once upon a time|1
AID|Help|Band-___; First ___; Lend a hand|1
AIM|Point at a target; Goal|Set one's sights; Ready, ___, fire!|1
AIR|What we breathe; Melody|Put on ___s; Hot ___ (empty talk)|1|💨
ALE|Pub drink; Brewpub pour|Pint, perhaps; Hoppy pour|2|🍺
ALL|Every one|The whole shebang; Whole enchilada; One for ___|1
AND|Plus; Ampersand|Rock ___ roll; Ifs, ___s or buts|1
ANT|Tiny insect; Colony worker|Picnic crasher; Aesop's hard worker|1|🐜
ANY|Some; Whichever|___ way you slice it; ___ port in a storm|1
APE|Gorilla|Mimic; Go ___ (lose it)|1|🦍
APT|Fitting; Likely|Right on the nose; Spot-on|2
ARC|Curved line; Story's shape|Rainbow's path|2
ARE|Form of "to be"|"We ___ here"; Hectare part|1
ARK|Noah's boat; Sacred chest|Two-by-two boat|2
ARM|Limb; Weapon, verb|Twist someone's ___; Long ___ of the law|1|💪
ART|Painting; Craft|State of the ___; Museum display|1|🎨
ASH|Fire residue|Tree with keys; Phoenix's bed|1
ASK|Inquire|Pop the question; ___ me anything|1
ATE|Had a meal; Chowed down|Cleaned one's plate; What's ___ you?|1
AWE|Wonder; Reverence|Jaw-drop feeling|2
AXE|Chopping tool|Fire, slangily; Get the ___|2|🪓
BAD|Not good; Poor|Cool, in old slang; Big ___ Wolf|1|👎
BAG|Sack; Pouch|Snag, as a trophy; Grab-___|1|👜
BAN|Forbid; Embargo|No-entry rule; Censor's act|1
BAR|Pub; Tavern|Lawyers as a group; Candy ___|1|🍫
BAT|Cave flyer|Club; Baseball stick; Didn't ___ an eye|1|🦇
BAY|Inlet; Cove|Howl at the moon; Keep at ___|1
BED|Sleeping spot; Cot|Garden plot; Make your ___|1|🛏️
BEE|Honey maker|Spelling contest; Busy as a ___|1|🐝
BET|Wager; Gamble|"You ___!"; Hedge your ___|1
BIB|Baby's napkin|Lobster-dinner wear; Drool catcher|2
BID|Auction offer|Attempt; Paddle raise; Make a ___ for|1
BIG|Large; Huge|Major league; ___ Apple|1
BIN|Trash can; Storage box|Recycling spot; Junk keeper|1|🗑️
BIT|Small piece; Morsel|Comedy routine; Horse's mouthpiece|1
BOA|Big snake; Constrictor|Feather scarf; Jungle squeezer|2
BOB|Short haircut|Float on water; ___ for apples|2
BOG|Swamp; Marsh|Peat land; ___ down (stall)|2
BOO|Scare sound; Jeer|Ghost's line; Halloween cry|1
BOW|Ribbon knot|Ship's front; Take a ___|1|🎀
BOX|Carton; Crate|Spar; Outside the ___|1|📦
BOY|Lad; Son|Oh, ___!; Paper ___|1|👦
BUD|Flower starter|Pal; Nip in the ___; Taste ___|1|🌱
BUG|Insect|Glitch; Wiretap; Snug as a ___|1|🐛
BUN|Bread roll|Hair knot; ___ in the oven|1
BUS|City transport|Clear dishes; Miss the ___|1|🚌
BUT|However; Yet|Ifs, ands or ___s|1
BUY|Purchase|Swallow, as a story; ___ time|1
BYE|Farewell|Free pass in a draw; ___-bye!|1
CAB|Taxi; Hack|Yellow ride; Hail one|1|🚕
CAN|Tin; Is able|Soda holder; Yes, we ___|1|🥫
CAP|Hat; Limit|Ball ___; Feather in one's ___|1|🧢
CAR|Auto; Vehicle|Train unit; Road trip ride|1|🚗
CAT|Feline; Kitty|Mouser; Curiosity killed it|1|🐈
COD|White fish|Fish-and-chips fish; ___ liver oil|2
COG|Gear tooth|Small machine part; ___ in the wheel|2|⚙️
COT|Folding bed; Camp bed|Army bunk; Sleepover spare|2
COW|Milk giver; Dairy animal|Intimidate; Holy ___!|1|🐄
CRY|Weep; Sob|Shout; Battle ___|1
CUB|Young bear|Rookie reporter; ___ Scout|1
CUE|Pool stick; Signal|Actor's prompt; On ___|2|🎱
CUP|Mug; Beaker|Trophy; World ___|1|☕
CUT|Slice; Snip|Edit out; Share of the take|1|✂️
DAD|Father|Pop; Mom's partner|1
DAM|Beaver's barrier|Mother of a foal; Hoover ___|1
DAY|24 hours|Sunlight; Seize the ___|1|☀️
DEN|Lair|Cozy room; Lion's ___|1
DEW|Morning moisture|Grass droplets; Mountain ___|1
DIG|Excavate|Jab; Can you ___ it?|1|⛏️
DIM|Not bright|Slow-witted; ___ the lights|1
DIP|Chip spread|Quick swim; Skinny-___|1
DOE|Female deer|Rabbit mom; Jane ___|1
DOG|Barking pet|Tail closely; Top ___|1|🐕
DOT|Small spot|Polka ___; Connect the ___s|1
DRY|Not wet|Witty, deadpan; ___ humor|1
DUE|Owed|Expected; ___ date|1
DUG|Excavated|Liked, slangily; Shoveled|1
DYE|Color agent|Tint; Tie-___|2
EAR|Hearing organ|Corn unit; Musical knack|1|👂
EAT|Have a meal|Bother; What's ___ing you?|1|🍽️
EBB|Low tide|Decline; ___ and flow|2
EEL|Snaky fish|Slippery one; Sushi unagi|1
EGG|Hen's product|Urge, with "on"; Easter hunt find|1|🥚
EGO|Self-image|Self-esteem; Alter ___|2
ELF|Santa's helper|Pixie; Will Ferrell film|1|🧝
ELK|Big deer|Wapiti; Lodge member|1
ELM|Shade tree|Street tree; Nightmare on ___ St.|1
EMU|Big bird|Flightless Aussie; Ostrich kin|1
END|Finish|Goal; Football lineman|1|🔚
ERA|Age|Epoch; Pitcher's stat|1
ERR|Make a mistake|Goof; To ___ is human|2
EVE|Night before|Holiday's prelude; Adam's partner|1
EWE|Female sheep|Ram's mate; Lamb's mom|1
EYE|Seeing organ|Needle's hole; Storm center|1|👁️
FAN|Cooler|Admirer; Ceiling ___|1
FAR|Distant|Way off; ___ and away|1
FAT|Plump|Lard; Chew the ___|1
FAX|Office machine|Phone-line page; Text by phone|2|📠
FED|Gave food to|Nourished; G-man|1
FEE|Charge|Toll; Late ___|1
FEW|Not many|Handful; ___ and far between|1
FIG|Sweet fruit|Leaf for Adam; ___ Newton|1
FIN|Fish part|Shark's sign; Five-dollar bill|1
FIT|Healthy|Tantrum; Throw a ___|1
FIX|Repair|Dilemma; In a ___|1|🔧
FLU|Illness|Bug; ___ shot|1|🤒
FLY|Buzzing insect|Soar; Zipper area|1|🪰
FOE|Enemy|Rival; Friend or ___|1
FOG|Mist|Mental haze; Brain ___|1|🌫️
FOR|In favor of|Pro; ___ sure|1
FOX|Sly animal|Clever one; Crazy like a ___|1|🦊
FRY|Cook in oil|Small fish; Small ___|1
FUN|Enjoyment|Kicks; ___ and games|1|🎉
FUR|Animal coat|Pelt; ___ ball|1
GAP|Opening|Gulf; Mind the ___|1
GAS|Fuel|Vapor; Step on the ___|1|⛽
GEL|Hair goo|Come together; Ink pen type|1
GEM|Jewel|Treasure; Hidden ___|1
GET|Obtain|Understand; ___ it?|1
GIN|Juniper drink|Rummy game; Cotton ___|2
GOD|Deity|Idol; Zeus, e.g.|2
GOT|Obtained|Understood; ___ milk?|1
GUM|Chewing candy|Gunk up; Bubble ___|1
GUN|Pistol|Rev, as an engine; Jump the ___|1
GUT|Belly|Instinct; ___ feeling|1
GUY|Fellow|Rope line; Fall ___|1
GYM|Workout place|Fitness center; ___ class|1|🏋️
HAD|Owned|Fooled; ___ a ball|1
HAM|Pork meat|Overactor; Radio buff|1|🍖
HAS|Owns|Possesses; ___-been|1
HAT|Head cover|Role; Hard ___|1|🎩
HAY|Dried grass|Horse feed; Hit the ___|1
HEN|Female chicken|Clucker; ___ party|1|🐔
HER|That woman|Possessive she; Not him|1
HEY|"Hi!"|"Psst!"; Hello|1
HID|Concealed|Went undercover; Ducked out|1
HIM|That man|Object pronoun; Not her|1
HIP|Joint|Trendy; ___ hop|1
HIS|Belonging to him|Possessive he; ___ and hers|1
HIT|Strike|Smash song; Box-office ___|1
HOG|Pig|Monopolize; Road ___|1|🐖
HOP|Jump|Short trip; Bunny ___|1|🐇
HOT|Very warm|Popular; Spicy|1
HOW|In what way|"___ come?"; Know-___|1
HUB|Center|Wheel middle; Airline base|1
HUE|Color|Shade; Tint|2
HUG|Embrace|Squeeze; Bear ___|1|🤗
HUM|Closed-mouth sing|Buzz; Drone|1
HUT|Cabin|Shack; Pizza ___|1|🛖
ICE|Frozen water|Cancel; Rink; Assassinate|1
ICY|Freezing|Unfriendly; Slippery|1
ILL|Sick|Badly; Under the weather|1
INK|Pen fluid|Squid's spray; Tattoo|1|🖋️
INN|Small hotel|Lodge; B&B|1
ION|Charged atom|Particle; Lithium-___|2
IRE|Anger|Wrath; Rage|2
IVY|Climbing plant|League of colleges; Poison ___|2
JAM|Fruit spread|Traffic snarl; Tight spot|1|🍓
JAR|Glass container|Jolt; Cookie ___|1
JAW|Chin bone|Chat; ___-dropping|1
JET|Fast plane|Black stone; Spray|1|✈️
JOB|Work|Task; Inside ___|1|💼
JOG|Slow run|Nudge; ___ one's memory|1
JOY|Happiness|Delight; Pride and ___|1|😊
JUG|Pitcher|Jail, slangily; Milk ___|1
KEG|Beer barrel|Party barrel; Powder ___|2
KEY|Lock opener|Crucial; Piano part|1|🔑
KID|Child|Tease; Young goat|1|🧒
KIN|Relatives|Family; Next of ___|2
KIT|Gear set|Fox cub; First-aid ___|1|🧰
LAB|Science room|Retriever|1
LAD|Boy|Young fellow|1
LAP|Track circuit|Drink like a cat|1
LAW|Rule|Legal code|1
LAY|Put down|Not clerical|1
LED|Guided|Diode light|1
LEG|Limb|Stage of a race|1|🦵
LET|Allow|Net serve redo|1
LID|Cover|Eyelid|1
LIE|Fib|Recline|1
LIP|Mouth edge|Sass|1|👄
LIT|Burning|Literature|1
LOG|Tree trunk piece|Record|1|🪵
LOT|Parking area|Fate|1
LOW|Not high|Moo|1
MAD|Angry|Crazy|1
MAN|Adult male|Staff|1
MAP|Chart|Lay out|1|🗺️
MAT|Floor rug|Yoga pad|1
MAY|Spring month|Might|1
MEN|Gents|Chess pieces|1
MET|Encountered|Opera house, with "the"|1
MIX|Blend|Mingle|1
MOB|Crowd|Mafia|1
MOM|Mother|Ma|1
MOP|Floor cleaner|Unruly hair|1
MUD|Wet dirt|Mire|1
MUG|Coffee cup|Rob|1
NAB|Catch|Arrest|2
NAG|Pester|Old horse|2
NAP|Short sleep|Snooze|1
NET|Mesh|Take-home pay|1
NEW|Not old|Fresh|1|🆕
NIL|Zero|Nothing|2
NOD|Head signal|Yes gesture|1
NOR|Neither's partner|And not|1
NOT|Negative|Hardly|1
NOW|At present|Immediately|1
NUN|Sister|Habit wearer|2
NUT|Acorn|Fanatic|1|🥜
OAK|Hard wood|Acorn tree|1
OAR|Rowing blade|Paddle|1
OAT|Grain|Cereal grain|1
ODD|Strange|Not even|1
OFF|Not on|Bad, as milk|1
OIL|Crude|Lubricate|1|🛢️
OLD|Aged|Stale|1|👴
ONE|Single|United|1|1️⃣
OPT|Choose|Elect|2
ORB|Sphere|Globe|2|🔮
ORE|Raw metal|Mine find|2
OUR|Belonging to us|Ours|1
OUT|Not in|Exposed|1
OWE|Be in debt|Be indebted|1
OWL|Night bird|Hooter|1|🦉
OWN|Possess|Personal|1
PAD|Notebook|Apartment|1
PAL|Friend|Buddy|1
PAN|Frying ___|Criticize|1|🍳
PAT|Tap lightly|Butter portion|1
PAW|Animal's foot|Handle clumsily|1|🐾
PAY|Wages|Settle up|1
PEA|Green veggie|Pod member|1
PEN|Writing tool|Pigpen|1|🖊️
PET|Domestic animal|Favorite|1
PIE|Baked dessert|Pizza, in some cities|1|🥧
PIG|Hog|Glutton|1|🐷
PIN|Sewing needle|Bowling target|1|📌
PIT|Hole|Cherry stone|1
POD|Pea case|Whale group|2
POT|Cooking pan|Kitty in poker|1|🪴
PRO|Expert|Professional|1
PUB|Bar|Tavern|1
PUN|Wordplay|Groaner|2
PUP|Young dog|Seal baby|1|🐶
PUT|Place|Set|1
RAG|Cloth|Tabloid|1
RAM|Male sheep|Computer memory|1|🐏
RAN|Sprinted|Managed|1
RAP|Hip-hop|Knock|1|🎤
RAT|Rodent|Snitch|1|🐀
RAW|Uncooked|Sore|1
RAY|Beam|Sting fish|1
RED|Ruby color|Embarrassed, maybe|1|🟥
RIB|Bone|Tease|1
RID|Free of|Clear|1
RIM|Edge|Hoop|1
RIP|Tear|Rest in peace|1
ROB|Steal from|Mug|1
ROD|Pole|Fishing pole|1|🎣
ROE|Fish eggs|Caviar|2
ROT|Decay|Nonsense|1
ROW|Line|Paddle|1|🚣
RUB|Massage|Snag|1
RUG|Carpet|Toupee|1
RUM|Pirate drink|Odd|2
RUN|Sprint|Ladder in tights|1|🏃
RYE|Bread grain|Whiskey type|2
SAD|Unhappy|Blue|1|😢
SAP|Tree juice|Sucker|1
SAT|Took a seat|Test|1
SAW|Cutting tool|Proverb|1|🪚
SAY|Speak|Utter|1
SEA|Ocean|Main|1
SEE|Look|Bishop's seat|1|👀
SET|Group|Tennis unit|1
SEW|Stitch|Needle work|1|🧵
SHE|That woman|Her, as subject|1
SHY|Bashful|Timid|1
SIN|Wrongdoing|Vice|1
SIP|Small drink|Taste|1
SIR|Gentleman's title|Knight's title|1
SIT|Be seated|Pose|1
SIX|Half a dozen|Sides on a die|1|6️⃣
SKI|Snow slide|Slalom gear|1|🎿
SKY|Blue above|Heavens|1
SLY|Crafty|Foxy|1
SON|Male child|Junior|1
SOY|Bean sauce|Tofu bean|1
SPA|Health resort|Wellness retreat|1|💆
SPY|Secret agent|Mole|1|🕵️
SUB|Sandwich|Understudy|1|🥪
SUM|Total|Add up|1
SUN|Star in our sky|Sol|1|🌞
TAB|Bill|Browser page|1
TAG|Label|Chase game|1|🏷️
TAN|Bronze|Beige|1
TAP|Faucet|Light knock|1|🚰
TAR|Road goo|Sailor|1
TAX|Levy|Strain|1
TEA|Brewed drink|Afternoon party|1|🍵
TEN|Decade|Perfect score|1|🔟
THE|Definite article|Ye, old-style|1
TIE|Neckwear|Draw|1|👔
TIN|Metal|Can|1
TIP|Gratuity|Hint|1
TOE|Foot digit|Tip|1
TON|2,000 pounds|Lots|1
TOO|Also|Excessively|1
TOP|Summit|Spinning toy|1
TOY|Plaything|Fiddle|1|🧸
TRY|Attempt|Rugby score|1
TUB|Bath|Container|1|🛁
TUG|Pull|Small boat|1
TWO|Pair|Couple|1|2️⃣
URN|Vase|Coffee maker|2|⚱️
USE|Utilize|Purpose|1
VAN|Delivery vehicle|Vanguard|1|🚐
VAT|Large tub|Sales tax abroad|2
VET|Animal doctor|Check out|1
VIA|By way of|Through|2
VOW|Promise|Oath|1
WAR|Battle|Conflict|1
WAS|Existed|Used to be|1
WAX|Candle stuff|Grow, like the moon|1|🕯️
WAY|Path|Method|1
WEB|Spider's home|Internet|1|🕸️
WET|Damp|Rainy|1
WHO|Which person|Owl's question|1
WHY|For what reason|Riddle|1
WIG|Fake hair|Hairpiece|1
WIN|Victory|Triumph|1|🏆
WIT|Humor|Cleverness|1
WOE|Sorrow|Trouble|2
WON|Triumphed|Korean currency|1
WOO|Court|Romance|2
YAK|Shaggy ox|Chatter|1
YAM|Sweet potato|Orange tuber|1|🍠
YAP|Bark|Chatter|2
YEN|Craving|Tokyo money|2|💴
YES|Affirmative|Aye|1|✅
YET|Still|But|1
YOU|2nd person|Thee|1
ZAP|Shock|Microwave|1|⚡
ZEN|Calm|Meditation school|2
ZIP|Fasten|Zero|1|🤐
ZOO|Animal park|Madhouse|1
ABS|Stomach muscles|Six-pack; Crunch targets|2
ADO|Fuss; Bother; Trouble|Much ___ about…; Song and dance|2
AFT|Toward the stern; Rear, at sea|Sailor's 6; 6 o'clock|3
AHA|"Got it!"; Eureka|Light-bulb moment|1|💡
ALP|Swiss peak; Mountain|Heidi's home; Matterhorn, e.g.|2|🏔️
ALT|Keyboard key; Other, in tech|___-rock; Ctrl-___-Delete|3
AMP|Guitar booster; Ampere|Goes-to-11 gear; ___ up (excite)|2
APP|Phone program; Software|There's one for that; Home-screen icon|1|📱
ASP|Small cobra|Cleopatra's killer; Nile biter|3
AVE|Street|"Hail" in Latin; ___ Maria|3
AWL|Leather punch; Cobbler's tool|Cobbler's poker|4
AYE|Yes; Vote for|___, ___, captain!|2
BAA|Sheep sound; Lamb's cry|___ ___ black sheep|1
BRA|Lingerie item|Car hood cover; Sports ___|2
BRO|Brother; Dude|Fist-bump buddy; Gym ___|1
CAW|Crow's call|Raven sound; Scarecrow's critic|2
CHI|Life force; Greek letter|Tai ___; X-shaped letter|3
COO|Dove sound|Baby talk; Bill and ___|2|🕊️
CUD|Cow's chew|Chew the ___; Ruminant's wad|3
DAB|Small amount|Pat; Little ___'ll do ya|2
DEB|Society girl|Coming-out girl; Ball newcomer|4
DIN|Loud noise|Racket; Crowd roar|2
DOH|"Silly me!"|Forehead-slap word; Homer's cry|2
DUO|Pair; Twosome|Dynamic ___; Comedy pair|1
EON|Long time|Ages; Geologic span|2
EMO|Rock genre|Moody music; Angsty teen style|3
GAG|Joke|Choke; ___ order|1
GAL|Woman|Lass; ___ pal|1
GEE|"Wow!"|Golly; ___ whiz|2
GNU|Wildebeest|Antelope; Serengeti grazer|2
GOO|Slime|Gunk; ___-___ eyes|1
HEM|Skirt edge|Border; ___ and haw|1
HEW|Chop|Cut down; Stick (to)|3
HOE|Garden tool|Weeder; Row to ___|2
HUH|"What?"|"Eh?"; Puzzled grunt|1
ILK|Kind|Sort; Type|3
IMP|Mischief maker|Little devil; Rascal|2|😈
INC|Corp.|Company abbr.; Ltd., in the U.S.|3
ITS|Belonging to it|Possessive pronoun; ___ own reward|1
JAB|Poke|Quick punch; Flu shot|1
JOT|Note down|Iota; ___ down|2
KEN|Understanding|Range of knowledge; Barbie's guy|4
LAG|Delay|Trail|1
LAX|Slack|Lenient|2
LEI|Hawaiian garland|Flower necklace|2|🌺
LEO|Lion sign|August-born sign|2|♌
LOB|High toss|Tennis arc|2
LOO|Bathroom|Restroom, abroad|2|🚽
LYE|Soap ingredient|Caustic|3
MAR|Spoil|Damage|2
MEW|Kitten's cry|Seagull|2
MID|Middle|Halfway|1
MOO|Cow sound|Bovine sound|1
MOW|Cut grass|Lawn work|1
NAY|No vote|Vote against|2
NEE|Born as|Maiden-named|4
NIB|Pen point|Pen tip|3
NIT|Lice egg|Petty fault|3
OAF|Clumsy one|Lout|2
OHM|Resistance unit|Physics unit|3
ORC|Fantasy brute|Killer whale|3
OUD|Arabic lute|Lute ancestor|5
OVA|Eggs|Egg cells|4
PEP|Energy|Vim|1
PEW|Church bench|"Stinky!"|2
PHI|Greek letter|Golden ratio letter|4
PLY|Layer|Use, as a trade|3
POP|Soda|Dad|1
PRY|Snoop|Lever open|2
PUG|Small dog|Flat-nosed dog|2
RHO|Greek P|Greek letter|4
ROC|Mythic bird|Giant legendary bird|5
RUE|Regret|Street in Paris|3
SAC|Pouch|Bag in the body|3
SAG|Droop|Sink|1
SHH|"Quiet!"|Hush!|2|🤫
SOD|Turf|Grass layer|2
SOP|Soak up|Bribe|4
SOU|Old French coin|Small coin|5
STY|Pigpen|Eye bump|2
TAD|Bit|Small amount|1
TAO|The Way|Chinese philosophy|4
TEE|Golf peg|T-shirt|1|⛳
TIC|Twitch|Spasm|2
TOM|Male cat|Tabby|2
TOT|Toddler|Small child|1
TUX|Formal suit|Black-tie wear|2|🤵
UGH|"Yuck!"|Groan|1
UPS|Ascents|Highs|2
VEX|Annoy|Irritate|2
VIE|Compete|Contend|2
WAD|Bundle|Lump|2
WAG|Wave a tail|Joker|2
WRY|Dryly humorous|Twisted|3
YEW|Evergreen tree|Bow wood|3
ZIG|Zag's partner|Sharp turn|3
ODE|Poem|Lyric praise|2
EKE|Squeeze out|Barely manage; ___ out a win|4
ERE|Before|Before, poetically; Old "prior to"|4
ETA|Arrival estimate|Greek letter; Pilot's guess|3
ETC|And so on|And the rest; List ender|1
ORT|Table scrap|Leftover morsel|5
OLE|Bullfight cheer|Spanish cheer|3
ONO|Hawaiian fish|Wahoo fish|5
ALA|In the style of; Like, menu-style|Pie ___ mode|3
TSK|Disapproving sound|Tut|3
# ---------- 4 letters ----------
ABLE|Capable; Competent|Up to the task|1
ACHE|Pain|Yearn; Sore-muscle feeling; Heart's longing|1
ACID|Sour substance; Low pH; Sulfuric|Biting, as wit; ___ test (moment of truth)|2|🧪
ACRE|Land measure; Farm unit|Roughly a gridiron|1
AGED|Old; Matured|Like fine wine; Over the hill|1
AIDE|Assistant; Helper|Right-hand person; Gofer|2
AIRY|Breezy; Light and spacious|Head in the clouds; Like a sunlit loft|2
ALOE|Soothing plant; Gel plant|Sunburn soother|2
ALSO|Too; In addition|And another thing…|1
ALTO|Low female voice; Choir part|Sax size; Range below soprano|2
AMID|Among; In the middle of|In the thick of|2
ANEW|Again; Afresh|Clean slate; From the top|2
ANTE|Poker stake|Up the ___; Poker entry fee|2
APEX|Peak; Summit|Food-chain top|2
AREA|Region; Zone|___ 51; Gray ___|1
ARIA|Opera solo; Diva's song|Opera showstopper|2
ARMY|Military force; Host|___ of one; Ant colony, e.g.|1
ATOM|Tiny particle; Smallest unit|Split this; Bit of everything|1|⚛️
AUNT|Parent's sister; Uncle's wife|Agony ___|1
AURA|Glow; Vibe|Halo effect|2
AWAY|Gone; Not home|Far, far ___; ___ game|1
AXIS|Pivot line|Alliance; Earth's spin line|2
BABY|Infant|Pamper; Rock-a-bye subject|1|👶
BACK|Rear; Support|Spine side; Got your ___|1
BAKE|Cook in oven; Roast|Oven job; ___ sale|1
BALD|Hairless; Bare|___ eagle; Like a cue ball|1
BALL|Sphere|Formal dance; Cinderella's night; Have a ___|1|⚽
BAND|Music group|Ring; Rubber ___; Garage ___|1
BANK|Money place|River edge; Piggy ___; ___ on it|1|🏦
BARE|Naked; Expose|___ minimum; ___-handed|1
BARN|Farm building|Hay storage; ___ owl|1
BASE|Bottom|Home plate; Touch ___; Off ___ (wrong)|1
BATH|Tub soak; Wash|Bubble ___; Rubber-duck time|1
BEAD|Small bauble|Drop; Draw a ___ on; Necklace bit|1
BEAK|Bird's bill|Nose; Toucan's pride|1
BEAM|Ray; Girder|Smile wide; Laser ___|1
BEAN|Legume|Head; Spill the ___s|1
BEAR|Grizzly|Endure; Grin and ___ it; Teddy ___|1|🐻
BEAT|Defeat|Rhythm; Dead ___; Drummer's job|1
BEEF|Cow meat|Complaint; Where's the ___?; Bulk, with "up"|1|🥩
BELL|Ringer; Chime|Saved by the ___; School's end|1|🔔
BELT|Waist strap|Wallop; Notch holder; Tighten one's ___|1
BEND|Curve; Flex|River's turn; ___ over backward|1
BEST|Top; Finest|Gold-medal level; ___ man|1
BIKE|Bicycle; Cycle|Two-wheeler; Training-wheel ride|1
BILL|Invoice|Beak; Duck's ___; Dollar ___|1
BIRD|Feathered flyer|Robin; Early ___|1|🐦
BITE|Nip; Snack|Mosquito souvenir; Grab a ___|1
BLUE|Sky color|Sad; Once in a ___ moon; ___ jeans|1|🟦
BOAT|Vessel; Ship|Rock the ___; Row, row, row it|1|⛵
BODY|Torso; Physique|___ of water; Bod|1
BOIL|Heat to bubbling; Seethe|Kettle's job; Make blood ___|1
BOLD|Brave; Daring; Fearless|Heavy type; ___ move|1
BONE|Skeleton part|Rib; Dog's prize; ___ to pick|1|🦴
BOOK|Novel|Reserve; Read like a ___; By the ___|1|📕
BOOT|Shoe|Start up; Kick out; Car's trunk, UK|1|👢
BORE|Drill; Dullard|Yawn-maker; Snooze-fest|1
BOSS|Manager; Chief|Corner office; Like a ___|1
BOTH|The two; Each|Best of ___ worlds|1
BOWL|Dish|Roll a ball; Super ___; Cereal holder|1|🥣
BULB|Lamp|Tulip root; Bright-idea icon; Onion-shaped root|1
BULL|Ox|Market riser; China-shop menace; Red-cape chaser|1
BURN|Scorch; Sear|Sick ___!; Diss, slangily|1
BUSY|Occupied; Swamped|___ as a bee; Line tone|1
CAFE|Coffee shop; Bistro|Latte spot; Sidewalk ___|1
CAGE|Pen; Enclosure|Birdhouse with bars; Rattle one's ___|1
CAKE|Dessert; Baked treat|Piece of ___; Bar of soap|1|🎂
CALF|Young cow|Leg part; Fatted ___|1
CALL|Phone; Ring|Shout; Referee's ruling|1|📞
CALM|Peaceful; Serene|Eye of the storm; Keep ___|1
CAMP|Tent site; Bivouac|Kitschy; Summer ___|1|⛺
CANE|Walking stick|Sugar stalk; Candy ___|1
CAPE|Cloak; Headland|Superhero wear; ___ Cod|1
CARD|Deck piece|Greeting; Wild ___|1|🃏
CARE|Concern; Worry|Tend; Handle with ___|1
CART|Wagon; Trolley|Shopping ___; Before the horse|1|🛒
CASE|Box; Container|Lawsuit; Detective's job|1
CASH|Money; Bills|___ in; Cold, hard ___|1|💵
CAST|Throw; Toss|Actors; Broken-arm wrap|1
CAVE|Grotto|Give in; Bat's home|1
CELL|Prison room|Phone; Tiny life unit|1
CHEF|Cook|Kitchen boss; Head of the line|1
CHIN|Jaw point|Face part; Keep your ___ up|1
CHIP|Snack crisp; Small break|Silicon wafer; Poker token|1
CITY|Town; Metropolis|Urban center; ___ hall|1|🏙️
CLAM|Shellfish|Close up; Happy as a ___|1
CLAP|Applaud|Thunder; Round of applause|1|👏
CLAW|Talon|Nail; Crab's pincher|1
CLAY|Pottery soil|Earth; Feet of ___|1
CLUB|Society; Group|Golf stick; Night ___|1|♣️
CLUE|Hint|Lead; Detective's find|1|🔍
COAL|Black fuel|Ember; Naughty kid's gift|1
COAT|Jacket|Layer of paint; Lab ___|1|🧥
CODE|Cipher|Program; Secret ___|1
COIN|Money piece|Invent, as a word; Flip a ___|1|🪙
COLD|Chilly|Aloof; Common sniffle|1|🥶
COMB|Hair tool|Search; Honey___|1
CONE|Ice cream holder|Pine fruit; Traffic ___|1|🍦
COOK|Chef|Fiddle with; ___ the books|1
COOL|Chilly; Calm|Hip; Keep your ___|1|😎
COPE|Manage|Deal; Get by|1
COPY|Duplicate|Imitate; Ad text|1
CORD|Rope; String|Firewood stack; Power ___|1
CORE|Center|Apple heart; Hard-___|1
CORN|Grain; Maize|Pop it; Cob crop|1|🌽
COST|Price|Toll; At all ___s|1
COZY|Snug; Comfy|Tea ___; Fireside feel|1
CRAB|Shellfish|Grouch; Sideways walker|1|🦀
CREW|Team; Staff|Rowing team; ___ cut|1
CROP|Harvest|Trim, as a photo; Cream of the ___|1
CROW|Black bird|Boast; As the ___ flies|1
CUBE|Block|Dice; Ice ___|1|🧊
CURE|Remedy|Heal; Preserve, as ham|1
CUTE|Adorable|Clever; ___ as a button|1
DARE|Challenge|Risk; Truth or ___|1
DARK|Unlit|Gloomy; Afraid of the ___|1|🌑
DART|Pointed missile|Dash; Pub game piece|1|🎯
DATA|Facts; Info|Big ___; Spreadsheet fill|1
DATE|Day; Appointment|Calendar square; Palm fruit|1|📅
DAWN|Sunrise|Beginning; Crack of ___|1|🌅
DEAL|Bargain|Agreement; Pass out cards|1
DEAR|Beloved|Pricey; Letter opener|1
DEBT|Owed money|Obligation; IOU total|1
DECK|Card pack|Ship floor; Punch|1
DEED|Act|Property paper; Good ___|1
DEEP|Far down|Profound; ___ end|1
DEER|Antlered animal|Buck; Bambi, e.g.|1|🦌
DESK|Writing table|Bureau; Help ___|1
DIAL|Clock face|Call; Rotary phone part|1
DICE|Cubes|Cut small; Roll the ___|1|🎲
DIET|Food plan|Regimen; Japan's lawmakers|1|🥗
DIME|Ten cents|Coin; Stop on a ___|1
DINE|Eat|Sup; Wine and ___|1
DIRT|Soil|Gossip; ___ cheap|1
DISH|Plate|Gossip; Satellite ___|1
DIVE|Plunge|Seedy bar; Scuba trip|1|🤿
DOCK|Pier|Wharf; Cut, as pay|1
DOLL|Toy figure|Sweetie; Barbie, e.g.|1|🪆
DOME|Rounded roof|Head; Capitol top|1
DOOR|Entry|Portal; Knock-knock spot|1|🚪
DOSE|Amount|Portion; Spoonful of medicine|1|💊
DOVE|Peace bird|Pigeon kin; Plunged|1
DOWN|Below|Feathers; Sad|1|⬇️
DRAW|Sketch|Tie; Luck of the ___|1
DRUM|Percussion|Barrel; Ear part|1|🥁
DUCK|Quacker|Dodge; Sitting ___|1|🦆
DUEL|Fight|Showdown; Pistols at dawn|1|⚔️
DUNE|Sand hill|Sand drift; Desert wave|1
DUSK|Twilight|Nightfall; Dawn's opposite|1
DUST|Dirt; Powder|Bite the ___; Bunny under the bed|1
DUTY|Obligation|Tax; Jury ___|1
EACH|Every|Apiece; Per person|1
EARL|Nobleman|British peer; ___ Grey tea|2
EARN|Make money|Merit; Deserve|1
EASE|Comfort|Relieve; At ___, soldier|1
EAST|Sunrise side|Orient; Compass point|1
EASY|Simple|Relaxed; ___ as pie|1
ECHO|Repeat sound|Reverberate; Radio alphabet E|1
EDGE|Brink|Margin; Advantage|1
EDIT|Revise|Amend; Cut, as film|1
ELSE|Otherwise|Instead; Or ___!|1
EMIT|Give off|Radiate; Send out|2
EPIC|Grand|Saga; Awesome, slangily|1
EVEN|Level|Equal; Divisible by two|1
EVER|Always|At any time; Happily ___ after|1
EVIL|Wicked|Bad; Dr. ___|1
EXAM|Test|Checkup; Finals, e.g.|1|📝
EXIT|Way out|Leave; Highway ramp|1
FACE|Visage|Confront; Clock front; Not back; Facet|1
FACT|Truth|Reality; Fun ___|1
FADE|Dim|Wane; Haircut style|1
FAIL|Flunk|Fall short; Epic ___|1
FAIR|Just|Carnival; County ___|1
FAKE|Phony|Counterfeit; ___ news|1
FALL|Drop|Autumn; ___ for it|1|🍂
FAME|Celebrity|Renown; Hall of ___|1
FARM|Ranch|Grow crops; Agriculture|1|🚜
FAST|Quick|Don't eat; Hold ___|1
FATE|Destiny|Lot; Twist of ___|1
FEAR|Dread|Phobia; Nothing to ___|1|😱
FEAT|Achievement|Exploit; No small ___|1
FEED|Nourish|Fodder; News ___|1
FEEL|Touch|Sense; Get a ___ for|1
FEET|Toe holders|Twelve inches; Cold ___|1
FERN|Leafy plant|Fronds; Boston ___|1
FILE|Folder|Nail tool; Rank and ___|1|📁
FILL|Stuff|Load; ___ in the blank|1
FILM|Movie|Coating; Plastic wrap|1|🎬
FIND|Discover|Locate; Great ___|1
FINE|Okay|Penalty; Parking ticket|1
FIRE|Flames|Dismiss; Open ___!|1|🔥
FIRM|Solid|Company; Law ___|1
FISH|Swimmer|Angle; Go ___|1|🐟
FIST|Clenched hand|Punch; ___ bump|1|✊
FLAG|Banner|Tire; Red ___|1|🚩
FLAT|Level|Apartment; Tire trouble; Lost bubbles; Bye-bye bubbles; Not round; Not peaked|1
FLEA|Jumping insect|Market type; ___ circus|1
FLEW|Soared|Took wing; ___ the coop|1
FLIP|Toss|Somersault; Glib|1
FLOW|Stream|Current; Go with the ___|1
FOAM|Froth|Bubbles; Latte top|1
FOLD|Crease|Give up in poker; Sheep pen|1
FOLK|People|Music genre; ___ tale|1
FOOD|Grub|Good eats; ___ for thought|1
FOOL|Jester|Trick; April ___|1|🤡
FOOT|Twelve inches|Paw; Not hand|1|🦶
FORK|Utensil|Split; ___ in the road|1|🍴
FORM|Shape|Document; Fill out a ___|1
FORT|Stronghold|Castle; Pillow ___|1
FOUR|Two plus two|Quartet; ___-leaf clover|1|4️⃣
FREE|No cost|Liberate; Scot-___|1|🆓
FROG|Croaker|Toad; Kermit, e.g.|1|🐸
FUEL|Gas|Energy; Add ___ to the fire|1
FULL|Stuffed|Complete; ___ moon|1
FUND|Money pool|Finance; Trust ___|1
GAIN|Profit|Earn; No pain, no ___|1
GAME|Sport|Willing; ___ on!|1|🎮
GATE|Entrance|Portal; Boarding ___|1
GEAR|Equipment|Cog; Shift ___s|1
GIFT|Present|Talent; ___ card|1|🎁
GIRL|Lass|Daughter; ___ Scout|1|👧
GIVE|Hand over|Donate; ___ and take|1
GLAD|Happy|Pleased; ___ rags|1
GLOW|Shine|Radiance; ___ stick|1
GLUE|Adhesive|Stick; Super ___|1
GOAL|Aim|Score; Life ___|1|🥅
GOAT|Billy|Greatest of all time; Kid's mom|1|🐐
GOLD|Precious metal|1st prize; ___ medal|1|🥇
GOLF|Links game|Tee sport; Mini-___|1
GONE|Departed|Away; ___ with the Wind|1
GOOD|Fine|Virtuous; ___ morning|1|👍
GRAB|Seize|Snatch; Up for ___s|1
GRAY|Silver color|Ash color; ___ area|1
GRID|Network|Lattice; Off the ___|1
GRIN|Smile|Beam; ___ and bear it|1|😁
GRIP|Hold|Grasp; Get a ___|1
GROW|Expand|Sprout; ___ up!|1
GULF|Bay|Chasm; ___ of Mexico|1
HAIL|Ice storm|Greet; ___ a cab|1
HAIR|Locks|Mane; Split ___s|1
HALF|50%|Partial; ___ time|1
HALL|Corridor|Auditorium; Town ___|1
HAND|Palm|Help; Lend a ___|1|✋
HANG|Suspend|Dangle; ___ out|1
HARD|Difficult|Firm; ___ hat|1
HARM|Hurt|Damage; No ___ done|1
HARP|Strings|Nag; Angel's music|1
HATE|Loathe|Detest; Love-___|1
HAWK|Hunter bird|Peddle; War supporter|1
HEAD|Noggin|Lead; Ship's WC|1
HEAL|Cure|Mend; Get well|1
HEAP|Pile|Mound; Scrap ___|1
HEAR|Listen|Learn; ___, ___!|1
HEAT|Warmth|Race round; Spiciness|1
HELP|Assist|Aid; SOS word|1
HERB|Basil|Spice; Garden green|1|🌿
HERD|Group of cows|Flock; ___ mentality|1
HERO|Champion|Sub sandwich; Idol|1|🦸
HIDE|Conceal|Animal skin; ___-and-seek|1
HIGH|Tall|Elevated; ___ five|1
HIKE|Trek|Raise; Take a ___!|1|🥾
HILL|Mound|Knoll; Over the ___|1
HINT|Clue|Tip; Drop a ___|1
HIRE|Employ|Rent; New ___|1
HOLD|Grasp|Cargo area; On ___|1
HOLE|Pit|Gap; ___ in one|1|🕳️
HOME|House|Abode; ___ plate|1|🏠
HOOK|Fishing ___|Catch; Song's catchy bit|1|🪝
HOPE|Wish|Aspire; High ___s|1
HORN|Car beeper|Antler; Toot your own ___|1|📯
HOSE|Water tube|Stockings; Garden ___|1
HOST|Emcee|Party giver; Big crowd|1
HOUR|60 minutes|Time unit; Rush ___|1|⏰
HUGE|Giant|Massive; Enormous|1
HUNT|Search|Chase; Scavenger ___|1
HURT|Injured|Pained; Ache|1
ICON|Symbol|Idol; App picture|1
IDEA|Thought|Notion; Bright ___|1
IDLE|Inactive|Lazy; Engine at rest|1
INCH|Small unit|Creep; Give an ___|1
INTO|Inside|Keen on; Fond of|1
IRON|Metal|Press; Golf club|1
ISLE|Island|Small island; Key|1|🏝️
ITEM|Thing|Object; Couple|1
JADE|Green gem|Worn out; Weary|2
JAIL|Prison|Lockup; Monopoly corner|1
JAZZ|Music style|Liven up; All that ___|1|🎷
JEAN|Denim|Fabric; ___ jacket|1|👖
JOIN|Unite|Connect; Sign up|1
JOKE|Gag|Jest; Inside ___|1|😂
JUMP|Leap|Spring; ___ the gun|1
JURY|Panel|Twelve judges; ___ duty|1
JUST|Fair|Only; ___ in case|1
KEEN|Eager|Sharp; Peachy ___|1
KEEP|Retain|Castle tower; ___ calm|1
KICK|Boot|Punt; Thrill|1
KILT|Scottish skirt|Tartan wear; Highland garb|1
KIND|Nice|Type; One of a ___|1
KING|Monarch|Chess piece; ___-size bed|1|👑
KISS|Smooch|Peck; ___ and make up|1|💋
KITE|Flying toy|Bad check; Bird of prey|1|🪁
KNEE|Leg joint|Bend; ___-jerk|1
KNIT|Weave|Purl; Close-___|1|🧶
KNOT|Tie|Nautical speed; Tie the ___|1
KNOW|Understand|Ken; In the ___|1
LACE|Shoelace|Mesh|1
LADY|Woman|Dame|1
LAKE|Pond|Loch|1
LAMB|Young sheep|Gentle soul|1
LAMP|Light|Lantern|1
LAND|Ground|Arrive|1
LANE|Path|Alley|1
LAST|Final|Endure|1
LATE|Tardy|Deceased|1
LAWN|Grass|Yard|1
LAZY|Idle|Slothful|1|🦥
LEAD|Guide|Metal|1
LEAF|Foliage|Page|1|🍃
LEAN|Thin|Slant|1
LEAP|Jump|Bound|1
LEFT|Departed|Port side|1|⬅️
LEND|Loan|Give|1
LENS|Glass|Camera eye|1
LESS|Fewer|Minus|1
LIAR|Fibber|Fabricator|1
LIFE|Living|Existence|1
LIFT|Raise|Elevator|1
LIKE|Enjoy|Similar|1
LIME|Green citrus|Calcium compound|1
LINE|Row|Queue|1
LINK|Chain part|Connect|1|🔗
LION|Big cat|King of beasts|1|🦁
LIST|Roster|Tilt|1|📋
LIVE|Exist|Not recorded|1
LOAD|Burden|Fill|1
LOAF|Bread|Laze|1
LOAN|Lend|Credit|1
LOCK|Fasten|Curl of hair|1|🔒
LOFT|Attic|Lift|1
LONG|Lengthy|Yearn|1
LOOK|See|Glance|1
LOOP|Circle|Ring; In the ___ (informed)|1|➰
LORD|Noble|Master|1
LOSE|Misplace|Be beaten|1
LOSS|Defeat|Setback|1
LOST|Missing|Astray|1
LOUD|Noisy|Brash|1|📢
LOVE|Adore|Zero in tennis|1|❤️
LUCK|Fortune|Chance|1|🍀
LUNG|Breathing organ|Air sac|1|🫁
MADE|Created|Built|1
MAIL|Letters|Post|1|📬
MAIN|Primary|Ocean|1
MAKE|Create|Brand|1
MALL|Shopping center|Promenade|1
MANE|Lion's hair|Horse hair|1
MANY|Lots|Numerous|1
MARK|Spot|Grade|1
MASK|Cover|Disguise|1|🎭
MASS|Bulk|Church service|1
MAST|Ship's pole|Spar|1
MATH|Arithmetic|Numbers class|1|➗
MAZE|Labyrinth|Puzzle|1
MEAL|Dinner|Repast|1
MEAN|Unkind|Average|1
MEAT|Flesh|Substance|1
MEET|Encounter|Sports event|1
MELT|Thaw|Soften|1
MENU|Bill of fare|Options list|1
MESS|Clutter|Muddle|1
MICE|Rodents|Computer clickers|1|🐭
MILD|Gentle|Moderate|1
MILE|5,280 feet|Distance|1
MILK|Dairy drink|Exploit|1|🥛
MIND|Brain|Care|1|🧠
MINE|Dig|Belonging to me|1
MINT|Herb|Coin factory|1
MISS|Fail to hit|Young woman|1
MIST|Fog|Haze|1
MOAT|Castle ditch|Ditch|1
MODE|Way|Fashion|1
MOLE|Skin spot|Spy|1
MOOD|Feeling|Temper|1
MOON|Lunar body|Satellite|1|🌙
MORE|Extra|Additional|1
MOSS|Green growth|Lichen kin|1
MOST|Majority|Very|1
MOTH|Night insect|Flutterer|1
MOVE|Shift|Relocate|1
MUCH|Lots|Plenty|1
MULE|Pack animal|Courier|1
MUSE|Ponder|Inspiration|1
NAIL|Fingernail|Spike|1|💅
NAME|Title|Call|1
NAVY|Fleet|Dark blue|1
NEAR|Close|Nigh|1
NEAT|Tidy|Cool|1
NECK|Throat|Smooch|1
NEED|Require|Want|1
NEST|Bird's home|Den|1
NEWS|Report|Headline|1|📰
NEXT|Following|Adjacent|1
NICE|Kind|Pleasant|1
NINE|Number|Cat's lives|1|9️⃣
NODE|Junction|Knot|2
NONE|Not any|Nil|1
NOON|Midday|12 PM|1|🕛
NOSE|Snout|Smell|1|👃
NOTE|Memo|Tone|1|🎵
OATH|Vow|Pledge|1
OBEY|Follow orders|Comply|1
ODOR|Smell|Scent|1
OKRA|Gumbo veggie|Lady's finger|2
OMEN|Sign|Portent|1
ONCE|One time|Formerly|1
ONLY|Sole|Just|1
ONTO|On top of|Wise to|1
OPEN|Unlock|Frank|1|🔓
ORAL|Spoken|Mouth exam|2
OVAL|Egg shape|Ellipse|1
OVEN|Stove|Kiln|1
OVER|Above|Done|1
PACE|Speed|Stride|1
PACK|Bundle|Wolf group|1|🎒
PAGE|Leaf|Summon|1|📄
PAID|Settled|Remunerated|1
PAIN|Ache|Nuisance|1
PAIR|Two|Duo|1
PALE|Wan|Fence stake|1
PALM|Hand part|Tree|1|🌴
PARK|Green space|Leave a car|1|🏞️
PART|Piece|Role|1
PASS|Go by|Throw|1
PAST|History|Beyond|1
PATH|Trail|Course|1
PEAK|Summit|Top|1|⛰️
PEAR|Fruit|Bartlett|1|🍐
PEEL|Skin|Rind|1
PICK|Choose|Guitar plectrum|1
PIER|Dock|Jetty|1
PILE|Heap|Stack|1
PILL|Tablet|Capsule|1
PINE|Evergreen|Yearn|1|🌲
PINK|Rosy color|Salmon color|1
PIPE|Tube|Smoking tube|1
PLAN|Scheme|Blueprint|1
PLAY|Game|Drama|1
PLOT|Story|Scheme|1
PLUG|Stopper|Socket insert|1|🔌
PLUM|Fruit|Prized|1
PLUS|Added|Bonus|1|➕
POEM|Verse|Ode|1|📜
POET|Rhymer|Bard|1
POLE|Rod|Vaulter's aid|1
POLL|Survey|Vote|1|🗳️
POND|Small lake|Pool|1
POOL|Swimming spot|Billiards|1|🏊
POOR|Needy|Broke|1
PORK|Pig meat|Bacon|1
PORT|Harbor|Left side|1|⚓
POSE|Model|Posture|1
POST|Mail|Pole|1
POUR|Rain hard|Flow|1
PRAY|Plead|Beg|1|🙏
PREY|Quarry|Victim|1
PULL|Tug|Drag|1
PUMP|Inflate|Shoe|1
PURE|Clean|Sheer|1
PUSH|Shove|Press|1
QUIT|Leave|Stop|1
QUIZ|Test|Question|1|❓
RACE|Contest|Speed|1|🏁
RACK|Shelf|Stand|1
RAFT|Float|Lot|1
RAGE|Fury|Fad|1
RAID|Attack|Bust|1
RAIL|Train track|Barrier|1
RAIN|Shower|Drizzle|1|🌧️
RAMP|Incline|Slope|1
RANK|Grade|Smelly|1
RARE|Uncommon|Lightly cooked|1
RASH|Hasty|Skin irritation|1
RATE|Speed|Price|1
READ|Peruse|Scan|1|📖
REAL|Genuine|True|1
REAR|Back|Raise|1
REED|Grass|Woodwind|1
REEF|Coral|Ridge|1
REIN|Bridle strap|Control|1
RELY|Depend|Trust|1
REST|Relax|Remainder|1
RICE|Grain|Sushi base|1|🍚
RICH|Wealthy|Hearty|1|🤑
RIDE|Journey|Drive|1
RING|Band|Call|1|💍
RIOT|Uprising|Hoot|1
RISE|Ascend|Increase|1
RISK|Danger|Gamble|1
ROAD|Street|Route|1|🛣️
ROAR|Lion sound|Bellow|1
ROBE|Gown|Bathrobe|1
ROCK|Stone|Sway|1|🪨
ROLE|Part|Character|1
ROLL|Bun|Tumble|1
ROOF|Top|Ceiling|1
ROOM|Chamber|Space|1
ROOT|Origin|Cheer|1
ROPE|Cord|Lasso; Learn the ___s|1
ROSE|Flower|Ascended|1|🌹
RUBY|Red gem|Jewel|1
RUDE|Impolite|Crude|1
RUIN|Wreck|Destroy|1
RULE|Law|Govern|1
RUSH|Hurry|Hasten|1
RUST|Corrosion|Oxidize|1
SAFE|Secure|Strongbox|1
SAGA|Epic|Tale|1
SAIL|Canvas|Cruise|1
SALE|Discount|Deal|1
SALT|Seasoning|Sailor|1|🧂
SAME|Identical|Equal|1
SAND|Beach grit|Smooth|1
SAVE|Rescue|Keep|1
SCAR|Mark|Blemish|1
SEAL|Sea mammal|Stamp|1|🦭
SEAT|Chair|Place|1|🪑
SEED|Pit|Ranking|1
SEEK|Search|Look for|1
SEEM|Appear|Look like|1
SELF|Ego|Identity|1
SELL|Vend|Peddle|1
SEND|Mail|Dispatch|1
SHED|Hut|Cast off|1
SHIP|Vessel|Send|1|🚢
SHOE|Footwear|Horseshoe|1|👟
SHOP|Store|Buy|1
SHOT|Attempt|Injection|1
SHOW|Display|Program|1
SHUT|Closed|Close|1
SICK|Ill|Awesome, slangily|1
SIDE|Edge|Team|1
SIGN|Signal|Autograph|1
SILK|Fabric|Smooth cloth|1
SING|Croon|Chirp|1
SINK|Basin|Descend|1
SIZE|Dimension|Measure|1
SKIN|Hide|Peel|1
SLED|Sledge|Toboggan|1|🛷
SLIM|Thin|Slender|1
SLIP|Slide|Error|1
SLOW|Sluggish|Leisurely|1|🐢
SNOW|Flakes|Winter white|1|❄️
SOAP|Cleaner|Drama|1|🧼
SOCK|Hosiery|Punch|1|🧦
SOFA|Couch|Settee|1|🛋️
SOFT|Gentle|Tender|1
SOIL|Dirt|Stain|1
SOLE|Only|Shoe bottom|1
SONG|Tune|Ballad|1
SOON|Shortly|Anon|1
SORT|Kind|Organize|1
SOUL|Spirit|Essence|1
SOUP|Broth|Bisque|1|🍲
SOUR|Tart|Bitter|1
SPIN|Twirl|Rotate|1
SPOT|Dot|Place|1
STAR|Celebrity|Sun|1|⭐
STAY|Remain|Visit|1
STEM|Stalk|Stop|1
STEP|Pace|Stair|1
STEW|Ragout|Fret|1
STIR|Mix|Commotion|1
STOP|Halt|Cease|1|🛑
SUIT|Outfit|Lawsuit|1
SURE|Certain|Confident|1
SURF|Waves|Browse|1|🏄
SWAN|Graceful bird|Glide|1|🦢
SWIM|Paddle|Bathe|1
TAIL|End|Follow|1
TAKE|Grab|Seize|1
TALE|Story|Fable|1
TALK|Speak|Chat|1|💬
TALL|High|Lofty|1
TAME|Docile|Gentle|1
TANK|Container|Armored vehicle|1
TAPE|Adhesive strip|Record|1
TASK|Job|Chore|1
TEAM|Squad|Crew|1
TEAR|Rip|Drop|1|💧
TELL|Narrate|Inform|1
TEMP|Temporary worker|Fever check|1
TEND|Care for|Lean|1
TENT|Canvas shelter|Camp|1
TERM|Word|Semester|1
TEST|Exam|Trial|1
TEXT|Message|Words|1
THAN|Compared to|Rather|1
THAT|Those|Which|1
THEM|Those|They|1
THEN|Next|At that time|1
THEY|Those people|Them|1
THIN|Slim|Lean|1
TICK|Clock sound|Mite|1
TIDE|Ebb and flow|Current|1
TIDY|Neat|Orderly|1
TILE|Square piece|Floor slab|1
TIME|Clock|Hour; Do ___ (be in jail)|1|⌛
TINY|Small|Wee|1
TIRE|Wheel|Weary|1
TOAD|Frog kin|Croaker|1
TOLD|Said|Informed|1
TOLL|Fee|Ring|1
TOMB|Grave|Crypt|1|🪦
TONE|Sound|Shade|1
TOOL|Implement|Gadget|1|🛠️
TOUR|Trip|Journey|1
TOWN|Village|City|1
TRAP|Snare|Catch|1|🪤
TREE|Oak|Elm|1|🌳
TRIM|Clip|Fit|1
TRIP|Journey|Stumble|1
TRUE|Real|Faithful|1
TUBA|Big brass|Oompah horn|1
TUNE|Melody|Air|1|🎶
TURN|Rotate|Spin|1
TWIN|Double|Pair|1
TYPE|Kind|Keyboard|1|⌨️
UNDO|Reverse|Cancel|1|↩️
UNIT|One|Item|1
UPON|On top of|Atop|1
USED|Secondhand|Utilized|1
USER|Consumer|Customer|1
VAST|Huge|Immense|1
VERB|Action word|Run, e.g.|1
VERY|Really|Truly|1
VEST|Waistcoat|Grant|1|🦺
VIEW|Sight|Scene|1
VINE|Grape plant|Creeper|1
VOTE|Ballot|Elect|1
WADE|Ford|Walk in water|1
WAGE|Pay|Salary|1
WAIT|Hold on|Stay|1|⏳
WAKE|Rise|Arise|1
WALK|Stroll|Amble|1|🚶
WALL|Barrier|Partition|1|🧱
WAND|Magic stick|Rod|1|🪄
WANT|Desire|Need|1
WARM|Toasty|Heated|1
WARN|Caution|Alert|1|⚠️
WASH|Clean|Laundry|1
WAVE|Swell|Gesture|1|🌊
WEAK|Feeble|Frail|1
WEAR|Don|Erode|1
WEED|Pest plant|Pull up|1
WEEK|Seven days|Calendar row|1
WELL|Fine|Water source|1
WEST|Sunset side|Occident|1
WHAT|Which thing|Huh?|1
WHEN|What time|At which time|1
WIDE|Broad|Spacious|1
WIFE|Spouse|Partner|1
WILD|Untamed|Savage|1
WILL|Testament|Desire|1
WIND|Breeze|Gust|1|🌬️
WINE|Vino|Grape drink|1|🍷
WING|Arm|Flank|1
WIRE|Cable|Telegram|1
WISE|Sage|Smart|1
WISH|Desire|Want|1
WOLF|Wild dog|Gobble|1|🐺
WOOD|Timber|Lumber|1
WOOL|Fleece|Yarn|1
WORD|Term|Promise|1
WORK|Labor|Job|1
WORM|Crawler|Grub|1|🪱
WRAP|Bundle|Burrito|1
YARD|Lawn|Three feet|1
YARN|Thread|Tale|1
YEAR|12 months|Annum|1|📆
YELL|Shout|Holler|1
YOGA|Mindful stretch|Asana practice|1|🧘
ZERO|Nothing|Nil|1|0️⃣
ZONE|Area|Region|1
ABET|Aid a crime|Egg on; Help a crook|3
ADZE|Woodworking ax; Shaping blade|Strange ax; Shipwright's swinger|5
ALEE|Away from wind; Sheltered side|Helm's ___!|5
ANON|Soon, old-style; Shortly, poetically|Unsigned, briefly|4
ARID|Very dry; Parched|Like the Sahara; Dry as a bone|2
ATOP|On top of; Upon|Perched on; Cherry on ___|2
AVER|Assert; Declare firmly|Swear up and down|4
AVID|Eager; Keen|Diehard|2
BRIO|Vigor; Verve|Zest, in music; Con ___|4
BUOY|Float marker|Lift spirits; Channel bobber; Life ring|3
CLEF|Music symbol|Staff sign; Treble ___|3
CZAR|Russian ruler|Policy chief; Drug ___|3
DAIS|Platform|Speaker's stage; Head-table spot|4
DOFF|Take off, as a hat|Remove; Tip one's cap|4
DOUR|Sullen|Stern; Grim-faced|4
DUPE|Fool|Patsy; Con's target|3
EDDY|Whirlpool|Swirl; Current curl|3
ELAN|Flair|Panache; Dash|4
ENVY|Jealousy|Green-eyed monster; Covet|2
EPEE|Fencing sword|Blade; Duel weapon|5
ERGO|Therefore|Hence; Thus|4
ETCH|Engrave|Inscribe; Mark with acid|3
EXPO|Fair|Show; Trade show|3
FAUX|Fake|Imitation; ___ fur|3
FLAW|Defect|Blemish; Fatal ___|2
FRAY|Brawl|Unravel; Join the ___|3
GALA|Party|Fete; Met ___|2
GIST|Main point|Essence; Get the ___|3
GLIB|Smooth-talking|Facile; Slick|3
GNAT|Small fly|Midge; Picnic pest|3
HALO|Angel's ring|Nimbus; Saintly glow|2|😇
HEED|Pay attention|Mind; Take ___|3
HONE|Sharpen|Perfect; Refine|3
IDOL|Star|Icon; American ___|2
INKY|Black|Dark; Squid-like|3
IOTA|Tiny bit|Greek letter; Not one ___|3
JEST|Joke|Quip; In ___|3
LAUD|Praise|Extol|4
LIEU|In ___ of|Place|4
LIMB|Arm or leg|Branch; Out on a ___ (taking a risk)|2
LORE|Folklore|Tradition|3
LURE|Bait|Tempt|2
LUTE|Old guitar|Strings|3
MAIM|Injure|Cripple|4
MEEK|Gentle|Timid|3
MIEN|Bearing|Demeanor|5
MOOT|Debatable|Irrelevant|4
MURK|Gloom|Darkness|4
NAPE|Back of neck|Neck|3
NOVA|Exploding star|New star|3
OBOE|Woodwind|Reed instrument|3
OGLE|Stare|Eye|3
OMIT|Leave out|Skip|2
OPAL|Gem|Iridescent stone|3
OPUS|Work|Composition|3
ORCA|Killer whale|Whale|3|🐋
OUST|Expel|Eject|3
PALL|Gloom|Cloud|4
PANE|Window glass|Sheet|3
PARE|Peel|Trim|3
PITH|Core|Essence|4
PLEA|Appeal|Request|3
PLOD|Trudge|Slog|3
POSH|Fancy|Luxurious|3
PUNY|Tiny|Weak|3
QUAY|Wharf|Dock|4
RAVE|Rant|Party|3
REAP|Harvest|Gather|3
RIFE|Widespread|Abundant|4
ROAM|Wander|Rove|3
RUSE|Trick|Ploy|3
SAGE|Wise|Herb|2
SCAN|Survey|Read quickly|2
SEER|Prophet|Oracle|3
SHUN|Avoid|Snub|3
SILO|Grain tower|Missile pit|3
SKIT|Sketch|Short play|3
SMUG|Self-satisfied|Superior|3
SNUB|Ignore|Slight|3
SOAR|Fly high|Rise|2
SPAR|Box|Pole|3
SPUR|Urge|Rider's prod|3
STOW|Pack|Store|3
SWAY|Rock|Influence|2
TACT|Diplomacy|Discretion|3
TAUT|Tight|Tense|3
TOGA|Roman robe|Wrap|3
TOME|Big book|Volume|4
TORE|Ripped|Rent|2
TOTE|Bag|Carry|3
TRIO|Three|Threesome|2
TUSK|Ivory|Elephant tooth|2|🐘
UNTO|To|Toward, old-style|4
URGE|Push|Impulse|2
VAIN|Proud|Futile|3
VALE|Valley|Dale|4
VEER|Swerve|Turn|3
VETO|Reject|Block|3
VIAL|Small bottle|Phial|3
VILE|Nasty|Disgusting|3
VISA|Travel permit|Entry stamp|2
VOID|Empty|Invalid|3
WANE|Decrease|Fade|3
WARY|Cautious|Careful|3
WEAN|Detach from milk|Gradually give up|4
WHIM|Fancy|Impulse|3
WILT|Droop|Fade|3
WILY|Cunning|Crafty|3
WREN|Tiny bird|Songbird|3
YAWN|Sleepy gape|Bore|2|🥱
YOKE|Harness|Burden|3
ZANY|Wacky|Crazy|3
ZEAL|Passion|Fervor|3
ZEST|Gusto|Peel|3
AGOG|Excited; Eager|All eyes and ears; On tenterhooks|5
ALIT|Landed; Dismounted|Settled, as a moth|5
AMEN|Prayer end; So be it|Preach!; You said it!|2
ARCH|Curve; Chief|Gateway to the West; Foot's bridge|2
AXLE|Wheel shaft; Spindle|Car's backbone|2
EMIR|Ruler|Prince; Gulf leader|5
ESPY|Spot|Catch sight of; Glimpse|5
ETUI|Needle case|Small case; Sewing kit|5
OLIO|Hodgepodge|Medley|5
ORZO|Rice-shaped pasta|Pasta|4
STOA|Greek portico|Colonnade|5
TSAR|Czar|Russian ruler|4
UNAU|Two-toed sloth|Sloth|5
ERNE|Sea eagle|Eagle; Coastal raptor|5
AEON|Very long time; Epoch; Era; Age|Forever and a day; Ages and ages|4
ONUS|Burden|Responsibility|4
EDEN|Paradise|Garden; Adam's home|2
IRIS|Eye part|Flower; Rainbow goddess|2
AGUE|Fever; Chills|Swamp-fever shakes|5
# ---------- 5 letters ----------
ABOUT|Approximately; Regarding|Give or take; In the ballpark|1
ABOVE|Over; Overhead|___ board (honest); Over one's head|1
ACORN|Oak nut; Oak seed|Squirrel fav; Mighty oak's start|1|🌰
ACTOR|Performer; Thespian|Shakespearean; Oscar hopeful|1
ADAPT|Adjust; Flex; Bend; Modify|Roll with punches; Go with the flow|1
ADMIT|Confess; Let in|Own up; Fess up|1
ADOPT|Take in; Embrace|Give a home to; Take under wing|1
ADULT|Grown-up; Mature|18+; Past the kids' table|1
AFTER|Later; Subsequent; Behind|Happily ever ___; Post-|1
AGAIN|Once more; Anew|>once; Encore!; Take two|1
AGENT|Spy; Rep; Proxy; Representative|Double ___; 007, e.g.|2
AGREE|Concur; Accept|See eye to eye; Shake on it|1
AHEAD|In front; Forward|Leading the pack; Full steam ___|1
ALARM|Alert; Fear|Wake-up call; Raise the ___|1|🚨
ALBUM|Record; Photo book|Wedding keepsake; Scrapbook of snaps|1
ALERT|Watchful; Warning|On one's toes; Red ___|1
ALIEN|Extraterrestrial; Foreign|E.T.; Space visitor|1|👽
ALIKE|Similar; Same|Two peas in a pod; Birds of a feather|1
ALIVE|Living; Lively|Stayin' ___; Still kicking|1
ALLOW|Permit; Let|Give the green light|1
ALONE|Solo; Lonely|Home ___ (1990 film); On one's own|1
ALONG|Beside; Onward|Sing-___; Tag ___|1
ALTER|Change; Modify|___ ego; Tailor's job|1
AMBER|Fossil resin; Yellow light|Jurassic DNA keeper; Caution signal|2
AMPLE|Plenty; Enough|More than enough; Room to spare|2
ANGEL|Cherub|Sweetheart; Shoulder guardian|1|👼
ANGER|Rage; Fury|Seeing red; Steam from the ears|1
ANGLE|Corner|Fish; Spin on a story|1|📐
ANGRY|Mad; Irate|Hot under the collar; Fit to be tied|1|😡
ANKLE|Leg joint; Foot joint|Bracelet spot; Sprain site|1
APART|Separated; Aside|Worlds ___; Falling to pieces|1
APPLE|Fruit|Tech giant; Big ___ (New York)|1|🍎
APRON|Cook's cover; Smock|Mom's ___ strings|1
ARENA|Stadium; Venue|Gladiators' stage|1|🏟️
ARGUE|Debate; Bicker|Go round and round; Lock horns|1
ARISE|Get up; Emerge|Rise and shine; Crop up, as trouble|2
ARMOR|Plate mail; Shield|Knight's suit; Chink in the ___|2|🛡️
AROMA|Scent; Fragrance|Bakery welcome|2
ARROW|Pointer; Shaft|Cupid's dart; Straight as an ___|1|🏹
ASIDE|Apart|Stage whisper; By the way|1
ASSET|Plus; Resource|Feather in one's cap|2
ATLAS|Map book|Titan; World-holder|2
AUDIO|Sound; Hearing|Heard, not seen|1
AVOID|Evade; Shun|Steer clear of; Duck|1
AWAKE|Alert; Up|Wide-eyed at 3 a.m.|1
AWARD|Prize; Grant|Oscar, e.g.|1|🏅
AWARE|Conscious; Informed|In the know|1
BACON|Pork strips; Breakfast meat|Bring home the ___; Sizzler|1|🥓
BADGE|Pin; Emblem|Sheriff's star; Scout's reward|1
BAGEL|Ring roll; Bread ring|Lox holder; Schmear base|1|🥯
BAKER|Bread maker; Pastry pro|___'s dozen; Dough boy|1
BASIC|Simple; Fundamental|No-frills; ___ training|1
BASIN|Sink; Bowl|River's catchment; Wash ___|1
BATCH|Group; Lot|Cookie run; Small-___|1
BEACH|Shore; Sands|Sandcastle site; ___ ball|1|🏖️
BEARD|Whiskers; Facial hair|Santa's trademark; Grown-out stubble|1|🧔
BEAST|Monster; Brute|Beauty's partner; ___ mode|1
BEGIN|Start; Commence|Let the games ___; Kick off|1
BEING|Existence; Creature|Human ___; Well-___|1
BELOW|Under; Beneath|Down there; ___ the belt|1
BENCH|Seat|Bank; Sideline seat; Judge's seat|1
BERRY|Fruit|Bead; Smoothie add-in; Blue or straw|1|🫐
BIRTH|Delivery; Origin|Stork's job; ___day|1
BLADE|Edge; Sword|Grass ___; Skate part|1
BLAME|Fault; Accuse|Point the finger; ___ game|1
BLANK|Empty; Void|Fill-in space; Draw a ___|1
BLAST|Explosion; Blow|Had a ___ (fun); Rocket's start|1
BLAZE|Fire; Flame|Trail mark; Forest fire|1
BLEND|Mix; Combine|Smoothie step; ___ in|1
BLIND|Sightless|Shade; Window cover; Love is ___|1
BLINK|Wink; Flash|In a ___; Eye flutter|1
BLOCK|Cube; Obstruct|Writer's ___; City ___|1
BLOOM|Flower; Flourish|Late ___er; Spring show|1|🌸
BLUSH|Redden; Flush|Rosy cheeks; Makeup powder|1
BOARD|Plank|Climb aboard; Chess surface; ___ game|1
BOAST|Brag; Crow|Toot one's horn; Show off|1
BONUS|Extra; Reward|Icing on the cake; Year-end perk|1
BOOST|Lift; Increase|Leg up; Morale ___|1
BRAIN|Mind; Intellect|Gray matter; ___storm|1
BRAKE|Stop; Slow|Pedal on the left; Pump the ___s|1
BRAND|Make; Mark|Name on the label; Cattle mark|1
BRAVE|Bold; Fearless|Home of the ___; Lionhearted|1
BREAD|Loaf|Money, slangily; Sliced ___|1|🍞
BREAK|Smash; Rest|Coffee ___; ___ a leg|1
BRICK|Block|Loyal pal; Lego piece|1
BRIDE|Newlywed; Wife-to-be|Veil wearer; Here comes the ___|1|👰
BRIEF|Short; Concise|Lawyer's paper; In ___|1
BRING|Fetch; Carry|___ it on; Potluck verb|1
BROOK|Stream; Creek|Babbling ___; Trout stream|1
BROOM|Sweeper; Brush|Witch's ride; Janitor's tool|1|🧹
BROWN|Chocolate color; Tan|Toast's goal; ___ bag lunch|1|🟫
BRUSH|Comb; Bristle|Paint ___; ___ off|1|🪥
BUILD|Construct; Make|Lego verb; Physique|1
BUNCH|Bundle; Lot|Grape cluster; Brady ___|1
CABIN|Hut; Cottage|Log ___; Plane section|1
CABLE|Wire; Cord|TV service; ___ car|1
CAMEL|Desert beast|Humped animal; Last straw's victim|1|🐫
CANDY|Sweets|Confection; Eye ___|1|🍬
CANOE|Small boat|Kayak kin; Paddle your own ___|1|🛶
CARGO|Freight; Load|___ pants; Ship's haul|1
CAROL|Christmas song|Hymn; Door-to-door song|1
CARRY|Bear; Transport|Tote; Math's "___ the one"|1
CATCH|Grab; Snag|Hidden problem; Fly ball out|1
CAUSE|Reason|Movement; Charity|1
CHAIN|Links|Shackle; Store group|1|⛓️
CHAIR|Seat|Lead a meeting; Rocking ___|1
CHALK|Board writer|Limestone; ___ it up|1
CHARM|Allure; Appeal|Spell; Bracelet trinket|1
CHART|Graph; Map|Top 40 list; Sea map|1|📊
CHASE|Pursue|Hunt; Car-___ scene|1
CHEAP|Inexpensive|Stingy; ___ seats|1
CHECK|Verify|Bill; Chess threat|1|✔️
CHEEK|Face part|Nerve; Tongue in ___|1
CHEER|Applaud; Joy|Rah!; Good spirits|1
CHESS|Board game|Strategy game; Checkmate game|1|♟️
CHEST|Trunk; Torso|Treasure ___; Get it off your ___|1
CHICK|Baby bird|Peeper; Easter ___|1|🐤
CHIEF|Boss; Head|___ of staff; Top dog|1
CHILD|Kid|Youngster; ___'s play|1
CHILL|Cold; Relax|Spine tingle; ___ out|1
CHOIR|Singers; Chorus|Preaching to the ___; Church group|1
CIVIC|Civil; Public|___ duty; Honda model|2
CLAIM|Assert; Demand|Gold-rush plot; Insurance form|1
CLASS|Group; Lesson|Style; ___ clown|1
CLEAN|Spotless|Wash; ___ slate|1|🧽
CLEAR|Transparent|Obvious; Empty out|1
CLERK|Office worker|Cashier; Court record keeper|1
CLICK|Tap; Snap|Mouse sound; Hit it off|1
CLIFF|Bluff; Precipice|___hanger; Edge of a drop|1
CLIMB|Scale; Ascend|Rise in the charts; Rock ___|1|🧗
CLOCK|Timepiece|Punch in; Grandfather ___|1|🕰️
CLOSE|Near; Shut|___ call; Neck and neck|1
CLOTH|Fabric; Material|Cut from same ___; Dish rag|1
CLOUD|Sky puff|Haze; Online storage|1|☁️
CLOWN|Jester; Joker|Class ___; Big-top cut-up|1
COACH|Trainer|Bus; Economy seats|1
COAST|Shore|Glide; West ___|1
COCOA|Hot chocolate|Cacao; Campfire mug|1
COLOR|Hue; Shade|Crayon box; Rainbow part|1
COMET|Space rock; Icy visitor|Halley's ___; Shooting star|1|☄️
CORAL|Reef builder|Pinkish orange; Great Barrier Reef|1
COUCH|Sofa|Phrase carefully; ___ potato|1
COUNT|Number; Tally|Earl; Dracula's title|1
COURT|Tribunal|Woo; Tennis area|1
COVER|Lid; Hide|Book jacket; Band's remake|1
CRAFT|Skill; Trade|Vessel; Arts and ___s|1
CRANE|Lifting machine|Wading bird; Stretch, as a neck|1|🏗️
CRASH|Collide; Smash|Computer failure; Sleep over|1
CRAWL|Creep|Swim stroke; Pub ___|1
CRAZY|Mad; Wild|Nuts; ___ about you|1
CREAM|Dairy|Elite; Coffee whitener|1
CREEK|Brook; Stream|Up a ___; Trout spot|1
CRIME|Offense; Wrong|___ scene; Cops' beat|1
CROWD|Throng; Mob|Three's a ___; ___ surfing|1
CROWN|Tiara; Crest|Tooth cap; Royal headgear|1
CRUMB|Morsel; Bit|Cookie ___; Trail of ___s|1
CRUSH|Squash|Infatuation; Puppy love|1
CURVE|Arc; Bend|Grading scale; ___ball|1
CYCLE|Bike; Loop|Washer setting; Life ___|1
DAILY|Everyday|Journal; ___ grind|1
DAIRY|Milk farm|Milk products; ___ aisle|1
DAISY|Flower|Ox-eye; Fresh as a ___|1|🌼
DANCE|Waltz; Boogie|Prom; Ballroom move|1|💃
DEALT|Distributed|Handled; ___ a bad hand|1
DECAY|Rot|Decompose; Tooth trouble|1
DELAY|Wait; Postpone|Hold-up; Flight board word|1
DEPTH|Deepness|Profundity; Out of one's ___|1
DIARY|Journal|Log; Dear ___|1|📔
DIRTY|Soiled|Unfair; ___ laundry|1
DITCH|Trench|Abandon; Last-___ effort|1
DIZZY|Giddy|Dazed; Spun out|1|😵
DONOR|Giver|Benefactor; Blood-drive hero|1
DOUGH|Bread mix|Money; Cookie ___|1
DOZEN|Twelve|Baker's ___; Egg carton count|1
DRAFT|Sketch|Breeze; 1st try|1
DRAIN|Sink hole|Exhaust; Down the ___|1
DRAMA|Theater|Tension; ___ queen|1
DREAM|Fantasy|Vision; American ___|1|💭
DRESS|Gown; Frock|Bandage a wound; ___ code|1|👗
DRIFT|Float|Meander; Snow pile|1
DRILL|Bore|Practice; Fire ___|1
DRINK|Beverage|Sip; The sea, informally|1|🥤
DRIVE|Steer|Motivation; Road trip|1
EAGER|Keen|Enthusiastic; ___ beaver|1
EAGLE|Raptor; Bald bird|Two under par; U.S. emblem|1|🦅
EARLY|Prompt|Ahead of time; ___ bird|1
EARTH|Planet|Soil; Our home|1|🌍
EASEL|Art stand|Painter's stand; Canvas holder|2
EIGHT|Two times four|Octet; Figure ___|1|8️⃣
ELBOW|Arm joint|Nudge; ___ grease|1
ELDER|Senior|Old one; Berry tree|1
EMPTY|Hollow|Vacant; Running on ___|1
ENEMY|Foe|Rival; Public ___ No. 1|1
ENJOY|Like|Relish; Savor|1
ENTER|Go in|Input; Return key kin|1
ENTRY|Entrance|Record; Diary page|1
ERROR|Mistake|Blunder; Fielding slip|1|❌
EVENT|Occasion|Incident; Track meet race|1
EXACT|Precise|Accurate; ___ change|1
EXTRA|More|Bonus; Film crowd member|1
FABLE|Moral tale|Myth; Aesop work|1
FAINT|Weak|Pass out; ___ of heart|1
FAITH|Belief|Trust; Leap of ___|1
FALSE|Untrue|Wrong; ___ alarm|1
FANCY|Ornate|Fond; Tickle one's ___|1
FEAST|Banquet|Spread; ___ your eyes|1
FENCE|Barrier|Sword fight; Stolen-goods|1|🤺
FERRY|Boat|Ship; Island transport|1|⛴️
FEVER|Temperature|Frenzy; Cabin ___|1
FIELD|Meadow|Domain; Left ___|1
FIFTY|Half a hundred|Number; ___-___ chance|1
FIGHT|Battle|Brawl; Food ___|1
FINAL|Last|Ultimate; Cup ___|1
FLAME|Fire|Old love; Fan the ___s|1
FLASH|Blink|Burst; In a ___|1
FLEET|Navy|Swift; ___ of foot|1
FLOAT|Drift|Raft; Root beer ___|1
FLOOD|Deluge|Overflow; ___ the market|1
FLOOR|Ground|Level; Amaze|1
FLOUR|Baking powder|Meal; Bread base|1
FOCUS|Concentrate|Center; In ___|1
FORCE|Power|Compel; Jedi power|1
FORGE|Smithy|Fake; ___ ahead|1
FORTY|Two score|Number; ___ winks|1
FOUND|Discovered|Establish; Lost and ___|1
FRAME|Border|Set up; Picture holder|1|🖼️
FRESH|New|Cheeky; ___ start|1
FRONT|Facade|Fore; Cold ___|1
FROST|Ice|Freeze; Jack ___|1
FRUIT|Produce|Result; ___ of one's labor|1
FUDGE|Chocolate candy|Fake; ___ the numbers|1
FUNNY|Comic|Odd; ___ bone|1
GHOST|Spirit|Phantom; ___ town|1|👻
GIANT|Huge|Titan; Jolly Green ___|1
GLASS|Pane|Tumbler; Half-full ___|1
GLOBE|Sphere|World; Snow ___|1|🌐
GLOVE|Mitt|Gauntlet; Fits like a ___|1|🧤
GRACE|Elegance|Prayer; Saving ___|1
GRADE|Mark|Level; Slope|1
GRAIN|Cereal|Texture; Against the ___|1|🌾
GRAND|Great|Thousand dollars; ___ piano|1
GRAPE|Vine fruit|Raisin, once; ___ juice|1|🍇
GRASS|Lawn|Turf; Snake in the ___|1
GREAT|Excellent|Huge; ___ Wall|1
GREEN|Leaf color|Inexperienced; Eco-friendly|1|🟩
GREET|Welcome|Hail; Meet and ___|1
GRILL|Barbecue|Interrogate; Bar and ___|1
GROUP|Set|Bunch; Study ___|1
GUARD|Protect|Sentry; Off ___|1|💂
GUESS|Estimate|Hunch; Wild ___|1
GUEST|Visitor|Caller; Be my ___|1
GUIDE|Lead|Manual; Tour ___|1
HABIT|Custom|Nun's dress; Bad ___|1
HAPPY|Glad|Content; ___ hour|1|😀
HARSH|Severe|Rough; Cruel|1
HEART|Ticker|Core; Card suit|1|💗
HEAVY|Weighty|Serious; ___ metal|1
HEDGE|Shrub|Waffle; ___ fund; Caution|1
HELLO|Hi|Greeting; Phone opener|1
HONEY|Bee syrup|Darling; ___moon|1|🍯
HORSE|Steed|Mare; Dark ___|1|🐎
HOTEL|Inn|Lodge; Five-star stay|1|🏨
HOUSE|Home|Dwelling; Full ___|1
HUMAN|Person|Mortal; ___ being|1
HUMOR|Comedy|Wit; Go along with; Indulge|1
HURRY|Rush|Hasten; ___ up!|1
IDEAL|Perfect|Model; Dream|1
IMAGE|Picture|Likeness; Public ___|1
INDEX|List|Pointer finger; Book's back pages|1
INNER|Inside|Internal; ___ child|1
INPUT|Data entry|Feedback; Two cents|1
IRONY|Sarcasm|Twist; Oh, the ___!|2
ISSUE|Problem|Edition; Hot-button ___|1
IVORY|Tusk material|Off-white; Piano key|2
JEANS|Denims|Work pants; Blue ___|1
JELLY|Jam|Gelatin; ___ bean|1
JEWEL|Gem|Treasure; Crown ___|1|💎
JOINT|Hinge|Shared; Knee or elbow|1
JUDGE|Referee|Magistrate; Size up|1
JUICE|Drink|Power; OJ|1|🧃
KNIFE|Blade|Cutter; Butter ___|1|🔪
KNOCK|Rap|Criticize; ___-___ joke|1
KOALA|Aussie bear|Eucalyptus eater; Tree hugger|1|🐨
LABEL|Tag|Brand|1
LADLE|Soup spoon|Dipper|1
LARGE|Big|Ample|1
LASER|Light beam|Ray|1
LATER|After|Afterward|1
LAUGH|Chuckle|Giggle|1
LAYER|Tier|Coat|1
LEARN|Study|Discover|1
LEASH|Dog lead|Rein|1
LEAST|Minimum|Fewest|1
LEAVE|Exit|Holiday|1
LEMON|Citrus|Dud car|1|🍋
LEVEL|Floor|Even|1
LIGHT|Lamp|Not heavy|1
LIMIT|Cap|Boundary|1
LINEN|Sheets|Fabric|1
LLAMA|Andean beast|Alpaca kin|1|🦙
LOCAL|Nearby|Resident|1
LODGE|Inn|Cabin|1
LOGIC|Reason|Sense|1
LOOSE|Free|Slack|1
LOVER|Sweetheart|Beau|1
LOWER|Reduce|Under|1
LOYAL|Faithful|True|1
LUCKY|Fortunate|Charmed|1
LUNAR|Moon-related|Of the moon|1
LUNCH|Midday meal|Noon meal|1
MAGIC|Sorcery|Wizardry|1
MAJOR|Main|Army rank|1
MAKER|Creator|Producer|1
MANGO|Tropical fruit|Fruit|1|🥭
MAPLE|Syrup tree|Leaf of Canada|1|🍁
MARCH|Parade|Month|1
MATCH|Game|Lighter|1
MAYOR|City head|Town leader|1
MEDAL|Award|Honor|1
MERCY|Pity|Leniency|1
MERIT|Worth|Deserve|1
METAL|Iron|Rock genre|1
METER|Measure|Gauge|1
MIGHT|Power|May|1
MINOR|Small|Underage|1
MINUS|Less|Negative|1|➖
MODEL|Example|Poser|1
MONEY|Cash|Dough|1|💰
MONTH|Calendar unit|Moon cycle|1
MORAL|Ethical|Lesson|1
MOTOR|Engine|Drive|1
MOUSE|Rodent|Clicker|1
MOUTH|Lips|River end|1
MOVIE|Film|Flick|1
MUSIC|Tunes|Melody|1
NERVE|Courage|Gall|1
NEVER|Not ever|At no time|1
NIGHT|Evening|Dark|1|🌃
NOBLE|Aristocrat|Honorable|1
NOISE|Sound|Din|1
NORTH|Up on a map|Pole direction|1
NOVEL|Book|New|1
NURSE|Caregiver|Tend|1
OCEAN|Sea|Deep|1
OFFER|Propose|Bid|1
OFTEN|Frequently|Repeatedly|1
OLIVE|Martini fruit|Green fruit|1|🫒
ONION|Bulb veggie|Tear-jerker|1|🧅
OPERA|Musical drama|Show|1
ORBIT|Circle|Revolve|1
ORDER|Command|Sequence|1
OTHER|Different|Else|1
OTTER|River animal|Sea mammal|1|🦦
OUTER|External|Outside|1
OWNER|Holder|Proprietor|1
PAINT|Color|Coat|1
PANDA|Bamboo bear|Black-and-white bear|1|🐼
PANEL|Board|Committee|1
PAPER|Sheet|Newspaper|1
PARTY|Celebration|Bash|1|🥳
PASTA|Noodles|Spaghetti|1|🍝
PATCH|Fix|Plot|1
PEACE|Calm|Harmony|1|☮️
PEACH|Fruit|Something lovely|1|🍑
PEARL|Gem|Oyster jewel|1
PEDAL|Bike lever|Push|1
PENNY|Cent|Coin|1
PHONE|Telephone|Call|1
PHOTO|Picture|Snap|1|📷
PIANO|Keyboard|Ivories|1|🎹
PIECE|Part|Fragment|1|🧩
PILOT|Aviator|Test episode|1
PIZZA|Pie|Slice|1|🍕
PLACE|Spot|Put|1
PLAIN|Simple|Prairie|1
PLANE|Aircraft|Flat surface|1
PLANT|Flora|Factory|1
PLATE|Dish|Home base|1
POINT|Tip|Purpose|1|👉
POLAR|Arctic|Opposite|1
POUCH|Pocket|Bag|1
POWER|Strength|Electricity|1
PRESS|Push|Media|1
PRICE|Cost|Value|1
PRIDE|Lion group|Ego|1
PRIZE|Award|Reward|1
PROOF|Evidence|Draft print|1
PROUD|Pleased|Arrogant|1
PUPIL|Student|Eye part|1
PUPPY|Young dog|Pup|1
QUEEN|Monarch|Chess piece|1|👸
QUEST|Search|Mission|1
QUICK|Fast|Swift|1
QUIET|Silent|Calm|1
QUOTE|Cite|Price estimate|1
RADIO|Wireless|Broadcast|1
RAISE|Lift|Pay increase|1
RANCH|Farm|Dressing|1
RANGE|Scope|Stove|1
RAPID|Fast|White water|1
RAVEN|Black bird|Corvid|1
REACH|Extend|Arrive|1
READY|Prepared|Set|1
REPLY|Answer|Respond|1
RIDER|Horseman|Clause|1
RIDGE|Crest|Mountain spine|1
RIGHT|Correct|Direction|1|➡️
RIVER|Stream|Waterway|1
ROAST|Cook|Tease|1
ROBIN|Red bird|Songbird|1
ROBOT|Android|Automaton|1|🤖
ROCKY|Stony|Unsteady|1
ROUND|Circular|Lap|1
ROUTE|Path|Way|1
ROYAL|Regal|Majestic|1
RULER|King|Measuring stick|1|📏
RURAL|Country|Rustic|1
SALAD|Greens|Mixed dish|1
SAUCE|Gravy|Sass|1
SCALE|Weigh|Climb|1|⚖️
SCARF|Muffler|Wolf down|1|🧣
SCENE|View|Setting; Make a ___ (cause a fuss)|1
SCORE|Points|Twenty|1
SCOUT|Explore|Spy|1
SEVEN|Number|Days in a week|1|7️⃣
SHADE|Shadow|Hue|1
SHAKE|Tremble|Milkshake|1
SHAPE|Form|Figure|1
SHARE|Divide|Stock|1
SHARK|Predator fish|Card cheat|1|🦈
SHARP|Keen|Clever|1
SHEEP|Ewe|Followers|1|🐑
SHELF|Ledge|Rack|1
SHELL|Casing|Seashell|1|🐚
SHIFT|Change|Work period|1
SHINE|Glow|Polish|1
SHIRT|Top|Tee|1|👕
SHOCK|Surprise|Jolt|1
SHORE|Coast|Beach|1
SHORT|Brief|Small|1
SHOUT|Yell|Cry|1
SIGHT|Vision|View|1
SKATE|Glide|Fish|1|⛸️
SKILL|Talent|Ability|1
SKIRT|Dress|Avoid|1
SKULL|Head bone|Cranium|1|💀
SLEEP|Rest|Snooze|1|😴
SLICE|Piece|Cut|1
SLIDE|Glide|Chute|1
SMALL|Little|Tiny|1
SMART|Clever|Sting|1
SMELL|Scent|Sniff|1
SMILE|Grin|Beam|1|🙂
SMOKE|Fumes|Puff|1
SNACK|Bite|Treat|1
SNAIL|Slow mollusk|Slowpoke|1|🐌
SNAKE|Serpent|Traitor|1|🐍
SOLID|Firm|Reliable|1
SOLVE|Resolve|Crack|1
SOUND|Noise|Healthy|1|🔊
SOUTH|Down on a map|Direction|1
SPACE|Room|Cosmos|1
SPARE|Extra|Save|1
SPEAK|Talk|Say|1
SPEED|Pace|Velocity|1
SPELL|Charm|Write letters|1
SPEND|Pay out|Use up|1
SPICE|Seasoning|Zest|1|🌶️
SPINE|Backbone|Book's back|1
SPOON|Utensil|Cuddle|1|🥄
SPORT|Game|Good loser|1
STACK|Pile|Heap|1
STAFF|Crew|Rod|1
STAGE|Platform|Phase|1
STAIR|Step|Flight|1
STAMP|Postage|Stomp|1
STAND|Rise|Booth|1
STEAM|Vapor|Energy|1
STEEL|Metal|Brace|1
STICK|Twig|Adhere|1
STONE|Rock|Pit|1
STORE|Shop|Save|1|🏪
STORM|Tempest|Rage|1|⛈️
STORY|Tale|Floor|1
STOVE|Range|Oven|1
STRAW|Hay|Drinking tube|1
STUDY|Learn|Office|1
SUGAR|Sweetener|Honey|1
SUNNY|Bright|Cheerful|1
SUPER|Great|Superb|1
SWEET|Sugary|Cute|1
SWING|Sway|Playground seat|1
SWORD|Blade|Saber|1|🗡️
TABLE|Desk|Postpone|1
TASTE|Flavor|Style|1|😋
TEACH|Educate|Train|1
TEETH|Molars|Choppers|1|🦷
THEME|Topic|Motif|1
THICK|Dense|Stocky|1
THING|Object|Item|1
THINK|Ponder|Reflect|1|🤔
THREE|Trio|Number|1|3️⃣
THROW|Toss|Pitch|1
THUMB|Digit|Flip through|1
TIGER|Striped cat|Big cat|1|🐯
TIMER|Clock|Stopwatch|1|⏱️
TIRED|Weary|Sleepy|1
TITLE|Name|Championship|1
TOAST|Grilled bread|Salute|1
TODAY|This day|Now|1
TOOTH|Molar|Tusk; Sweet ___|1
TOPIC|Subject|Theme|1
TORCH|Flashlight|Burn|1|🔦
TOTAL|Sum|Complete|1
TOUCH|Feel|Contact|1
TOWEL|Bath cloth|Dryer|1
TOWER|Spire|Loom|1|🗼
TRACK|Path|Trail|1
TRADE|Swap|Craft|1
TRAIL|Path|Follow|1
TRAIN|Locomotive|Coach|1|🚆
TREAT|Reward|Snack|1
TREND|Fad|Tendency|1
TRIAL|Test|Court case|1
TRIBE|Clan|Group|1
TRICK|Prank|Stunt|1
TRUCK|Lorry|Big rig|1|🚚
TRUST|Belief|Faith|1
TRUTH|Fact|Honesty|1
TULIP|Spring flower|Dutch bloom|1|🌷
TWIST|Turn|Plot surprise|1
UNCLE|Aunt's husband|Sam, for one|1
UNDER|Below|Beneath|1
UNION|Alliance|Merger|1
UNTIL|Till|Up to|1
UPPER|Higher|Top|1
UPSET|Distressed|Surprise loss|1
URBAN|City|Metropolitan|1
USUAL|Normal|Typical|1
VALUE|Worth|Prize|1
VIDEO|Clip|Footage|1
VISIT|Call on|Stay|1
VITAL|Crucial|Essential|1
VOICE|Speech|Say|1
WAGON|Cart|Station car|1
WATCH|Look|Timepiece|1|⌚
WATER|H2O|Aqua|1
WHALE|Big sea mammal|Huge|1|🐳
WHEAT|Grain|Cereal|1
WHEEL|Wheel|Steering ring; Big ___ (important person)|1
WHITE|Snow color|Pale|1|⬜
WHOLE|Entire|Complete|1
WOMAN|Lady|Female|1
WORLD|Earth|Globe|1
WORRY|Fret|Anxiety|1|😟
WRIST|Arm joint|Watch spot|1
WRITE|Pen|Author|1|✍️
YACHT|Luxury boat|Sailboat|1
YOUNG|Youthful|New|1
YOUTH|Teen|Juvenile|1
ZEBRA|Striped horse|Crosswalk|1|🦓
ABHOR|Hate; Loathe|Can't stand|4
ACRID|Pungent; Harsh; Bitter|Rotten smell; Eye-stinging; Putrid smell|4
ADAGE|Saying; Proverb|Old saw; Words to live by|3
ADEPT|Skilled; Talented; Expert|Old hand; Whiz|3
ADORN|Decorate; Enhance; Embellish|Makeup; Deck the halls|3
AEGIS|Protection; Shielding; Sponsorship|Under the wing of; Zeus's shield|5
AGILE|Nimble; Athletic; Flexible; Spry|Quick on one's feet; Cat-like|3
AGLOW|Shining; Radiant|Lit up like a tree; Beaming|4
ALOFT|In the air; Overhead|Up in the rigging; Sky-high|4
AMBLE|Stroll; Saunter|Take one's time; Mosey along|3
AMISS|Wrong; Awry|Out of whack; Something's ___|4
ANNEX|Addition; Wing|Take over, as land; Add-on building|4
ARDOR|Passion; Zeal|Fire in the belly|4
ASKEW|Crooked; Awry|Out of whack; Tilted, like a frame|4
ASTIR|Moving; Up and about|Up early, poetically|5
ATONE|Make amends; Repent|Make up for it|4
AUDIT|Inspect accounts; Review|Taxpayer's nightmare|3
AVAIL|Use; Benefit|To no ___|4
AWASH|Flooded; Overflowing|Swimming in it|4
BALMY|Mild; Pleasant|Tropical-night feel; Like a spring day|3
BANAL|Trite; Commonplace|Ho-hum; Same old|4
BATON|Wand; Relay stick|Conductor's tool; Pass the ___|3
BAYOU|Swamp; Marshy outlet|Gator's home; Louisiana waterway|4
BEFIT|Suit; Become|Be right for; As would ___|5
BELIE|Contradict; Misrepresent|Mask the truth; Give the lie to|5
BERET|Flat cap; French hat|Painter's cap; Green ___|3
BISON|Buffalo; Wild ox|Plains grazer; Yellowstone giant|3|🦬
BLASE|Unimpressed; Jaded|Seen-it-all; Shrug-worthy|4
BOGUS|Fake; Phony|Three-dollar bill; Not legit|3
BRINE|Salt water; Pickle juice|Ocean, poetically; Pickling bath|3
BRINY|Salty|The sea; Like ocean air|4
CACHE|Hidden store; Hoard|Browser memory; Pirate's stash|4
CADET|Trainee; Recruit|Space ___; West Point student|3
CAMEO|Small role|Carved brooch; Star's walk-on|3
CANNY|Shrewd; Astute|Street-smart; Sharp as a tack|4
CHAOS|Disorder; Mayhem|Free-for-all; Total madhouse|2
CHIDE|Scold; Rebuke|Wag a finger; Tsk-tsk|4
CIDER|Apple drink|Fall drink; Hard ___|2
CIVET|Catlike mammal|Musky animal; Coffee-bean critter|5
CLOUT|Influence|Whack; Political pull|3
COVET|Desire; Crave|Thou shalt not ___; Green with envy|4
COVEN|Witches' group|Circle; Cauldron crowd|4
CREDO|Belief; Motto|Life motto; Words to live by|4
CRONY|Pal; Buddy|Sidekick; Insider's pal|4
CRYPT|Vault; Tomb|Church basement; Tales from the ___|3
CUMIN|Spice|Seed; Chili spice|3
DEBUT|1st appearance|Launch; Opening night|2
DECOR|Interior design|Furnishings; Room style|3
DEIGN|Condescend|Stoop; Lower oneself|5
DELTA|River mouth|Greek letter; Mississippi ___|3
DENIM|Jean fabric|Twill; Blue jeans stuff|2
DETER|Discourage|Prevent; Scare off|3
DITTO|Same; Likewise|Me too; Copy mark|3
DIVOT|Turf chunk|Golf scar; Replace your ___|4
DOGMA|Doctrine|Belief; Party line|4
DOWRY|Bride's gift|Dower; Old wedding deal|4
DROLL|Amusing|Wry; Dry-witted|4
DRYAD|Tree nymph|Wood nymph; Forest spirit|5
DUVET|Quilt|Comforter; Bed cover|3
EBONY|Black wood|Dark; Piano key wood|3
EDICT|Decree|Command; Royal order|4
EERIE|Spooky|Uncanny; Creepy|3
EGRET|White heron|Wader; Marsh bird|4
ELATE|Thrill|Delight; Overjoy|4
ELITE|Best|Upper class; Top tier|2
ELUDE|Escape|Evade; Slip past|3
EMBER|Glowing coal|Spark; Campfire glow|3
ENNUI|Boredom|Listlessness; Blahs|5
ENVOY|Diplomat|Messenger; Emissary|4
EPOCH|Era|Age; Long period|4
EQUIP|Supply|Arm; Outfit|3
ESSAY|Composition|Attempt; Term paper|2
ETHIC|Moral|Principle; Work ___|4
EVADE|Dodge|Avoid; Sidestep|3
EXALT|Praise|Glorify; Raise high|4
EXILE|Banish|Outcast; Napoleon on Elba|3
EXPEL|Eject|Oust; Kick out|3
FACET|Aspect|Gem side; Angle|3
FEIGN|Pretend|Fake; Put on|4
FERAL|Wild|Untamed; Gone wild|4
FETID|Smelly|Stinking; Rank|5
FICUS|Rubber plant|Fig tree; Office plant|4
FJORD|Steep sea inlet|Norway feature; Glacial bay|4
FLAIR|Talent|Panache; Style|3
FLORA|Plants|Plant life; ___ and fauna|3
FOLIO|Page|Book size; Page number|5
FORAY|Raid|Venture; 1st ___|4
FOYER|Lobby|Entrance hall; Front hall|3
FRAIL|Weak|Fragile; Delicate|3
FUROR|Uproar|Outcry; Commotion|5
GAMUT|Range|Scale; Run the ___|4
GAUDY|Flashy|Showy; Garish|4
GAUZE|Bandage|Mesh; First-aid wrap|3
GECKO|Lizard|Wall climber; Insurance mascot|3|🦎
GENRE|Category|Style; Film type|3
GLEAN|Gather|Pick up; Infer|4
GLOAT|Crow|Brag; Rub it in|3
GNOME|Garden figure|Dwarf; Pointy-hat figure|3
GORGE|Ravine|Overeat; Canyon|3
GUILE|Cunning|Cleverness; Craftiness|5
GUSTO|Zest|Relish; With ___|4
HAIKU|Short poem|Japanese verse; 5-7-5 poem|3
HARDY|Tough|Robust; Laurel's partner|3
HAVEN|Refuge|Shelter; Safe ___|3
HEIST|Robbery|Holdup; Caper film|3
HELIX|Spiral|Coil; DNA shape|4
HERON|Wading bird|Egret kin; Marsh stalker|3
HOVEL|Shack|Hut; Dump|4
HUSKY|Sled dog|Hoarse; Burly|3
IDIOM|Expression|Phrase; Turn of phrase|3
IGLOO|Ice house|Snow hut; Arctic dome|2
IMBUE|Instill|Infuse; Steep|5
IMPEL|Drive|Urge; Spur|5
INANE|Silly|Senseless; Pointless|4
INEPT|Clumsy|Incompetent; All thumbs|4
INERT|Inactive|Still; Noble, as gas|4
INFER|Deduce|Conclude; Read into|3
INLET|Bay|Cove; Sound|3
IRATE|Angry|Furious; Seeing red|3
JUMBO|Huge|Giant; ___ jet|2
KARMA|Fate|Destiny; What goes around|3
KAYAK|Canoe|Paddle boat; Inuit boat|2
KNACK|Talent|Gift; Flair|3
LAPSE|Error|Slip|3
LATTE|Coffee drink|Milky coffee|2
LEDGE|Shelf|Sill|3
LIEGE|Lord|Sovereign|5
LITHE|Supple|Agile|4
LUCID|Clear|Coherent|4
LUNGE|Lurch|Thrust|3
LYRIC|Song words|Poetic|3
MANOR|Mansion|Estate|3
MAXIM|Saying|Rule|4
MIRTH|Joy|Glee|4
MOGUL|Tycoon|Ski bump|4
MOTIF|Theme|Pattern|3
MURAL|Wall painting|Fresco|3
NADIR|Low point|Bottom|5
NAIVE|Innocent|Unworldly|3
NICHE|Nook|Specialty|3
NOMAD|Wanderer|Rover|3
OAKEN|Of oak|Wooden|5
OASIS|Desert spring|Refuge|2
OCTET|Group of eight|Eight|4
OPTIC|Visual|Lens|4
ORATE|Speechify|Declaim|4
OVERT|Open|Obvious|4
OXIDE|Rust|Compound|4
OZONE|Gas layer|Fresh air|3
PARCH|Dry out|Scorch|4
PATIO|Terrace|Courtyard|2
PECAN|Nut|Pie nut|2
PERIL|Danger|Risk|3
PIQUE|Irritate|Arouse|5
PIVOT|Turn|Hinge|3
PLAZA|Square|Mall|2
PLUME|Feather|Cloud|3
POISE|Grace|Balance|3
POLKA|Dance|Dots|3
PRISM|Light splitter|Crystal|3
PROBE|Investigate|Explore|3
PROSE|Text|Writing|3
PROXY|Agent|Stand-in|4
PSALM|Hymn|Song|4
QUALM|Doubt|Scruple|4
QUASI|Seemingly|Partly|5
QUELL|Suppress|Calm|4
QUIRK|Oddity|Trait|3
RADAR|Detection system|Tracker|2|📡
RAVEL|Tangle|Unravel|5
REALM|Kingdom|Domain|3
REBUS|Picture puzzle|Puzzle|4
REMIT|Pay|Scope|5
RESIN|Sap|Gum|3
REVEL|Celebrate|Party|4
RHINO|Horned beast|Horn|2|🦏
RIVET|Bolt|Fascinate|3
ROGUE|Rascal|Renegade|3
RUSTY|Corroded|Out of practice|2
SABLE|Fur|Black|5
SAUNA|Steam room|Sweat room|2
SAVOR|Relish|Taste|3
SCION|Heir|Descendant|5
SCOFF|Mock|Sneer|4
SEDAN|Car|Saloon|2
SERUM|Fluid|Antidote|3
SHEEN|Gloss|Shine|3
SIEGE|Blockade|Attack|3
SINEW|Tendon|Muscle|4
SKIFF|Small boat|Dinghy|4
SLOTH|Lazy animal|Laziness|3
SONAR|Echo finder|Sound radar|3
SPIEL|Pitch|Patter|4
SQUAT|Crouch|Settle|3
STAID|Sedate|Serious|5
STOIC|Unemotional|Impassive|4
SUAVE|Smooth|Charming|4
SWAMI|Hindu teacher|Guru|4
TABOO|Forbidden|Banned|3
TACIT|Unspoken|Implied|5
TALON|Claw|Nail|3
TAPIR|Snouted mammal|Jungle beast|5
TAUNT|Mock|Jeer|3
TENET|Principle|Doctrine|4
TEPID|Lukewarm|Halfhearted|4
THYME|Herb|Spice|3
TIARA|Crown|Diadem|3
TONIC|Mixer|Remedy|3
TOPAZ|Gem|Yellow gem|3
TOTEM|Emblem|Symbol|4
TRYST|Rendezvous|Meeting|5
TUTOR|Teacher|Coach|2
ULCER|Sore|Lesion|3
UMBRA|Shadow|Dark core|5
UNIFY|Unite|Merge|3
USURP|Seize|Take over|5
UTTER|Speak|Total|3
VALOR|Courage|Bravery|3
VAPOR|Mist|Steam|3
VAULT|Safe|Leap|3
VENOM|Poison|Malice|3
VERVE|Energy|Vigor|4
VIGIL|Watch|Wake|4
VIPER|Snake|Traitor|3
VISOR|Brim|Eyeshade|3
VIXEN|She-fox|Shrew|4
VOGUE|Fashion|Style|3
WALTZ|Dance|Breeze through|3
WIDOW|Bereaved wife|Lone line|3
WRATH|Anger|Fury|3
YEARN|Long|Crave|3
YODEL|Alpine song|Sing|4
ZESTY|Spicy|Lively|3
# ---------- 6 letters ----------
ACTION|Deed; Movement|Lights, camera, ___!; Where the fun is|1
ACTIVE|Busy; Lively|On the go; Full of beans|1
ADVICE|Counsel; Tip|Two cents' worth; Dear Abby's stock|1
AGENDA|Plan; Schedule|Hidden ___; Meeting's road map|2
ANCHOR|Ship's weight|News host; Drop it to stay put|1
ANIMAL|Creature; Beast|Party ___; Zoo resident|1
ANSWER|Reply; Solution|What this grid wants; Final ___|1
ARTIST|Painter; Creator|Starving ___; Con ___|1
ATTACK|Assault; Strike|Charge!; Go on the offense|1
AUTUMN|Fall; Harvest season|Leaf-peeping time|1
BAKERY|Bread shop; Patisserie|Doughnut stop; Croissant source|1|🥐
BANANA|Yellow fruit|Peel; Top ___; ___ split|1|🍌
BASKET|Hamper|Hoop; Picnic carrier; Easter ___|1|🧺
BEAVER|Dam builder|Busy animal; Eager ___|1|🦫
BEETLE|Bug; Insect|VW classic; Ladybug, e.g.|1|🪲
BOTTLE|Flask; Container|Message holder; Genie's home|1|🍾
BRIDGE|Span|Card game; Golden Gate, e.g.; Cross that ___|1|🌉
BRIGHT|Shiny|Smart; ___ and early; Sunny|1
BUCKET|Pail; Bin|___ list; Kick the ___|1|🪣
BUTTER|Spread|Flatter; ___ up; Bread's partner|1|🧈
BUTTON|Knob; Fastener|Cute as a ___; Panic ___|1
CACTUS|Desert plant|Prickly plant; Saguaro, e.g.|1|🌵
CAMERA|Photo device|Camcorder; Say cheese to it|1
CANDLE|Taper; Wick|Birthday ___; Can't hold a ___ to|1
CARROT|Orange root|Reward; Bugs Bunny's snack|1|🥕
CASTLE|Fortress|Chess rook; King's fortress|1|🏰
CELERY|Veggie stick|Stalk; Ants-on-a-log base|1
CHEESE|Dairy product|Smile word; Say ___!|1|🧀
CHERRY|Red fruit|Sundae topper; ___ on top|1|🍒
CIRCLE|Ring; Round|Social group; Full ___|1|⭕
CLEVER|Smart; Witty|Quick-witted; Too ___ by half|1
COFFEE|Java; Brew|Wake-up cup; ___ break|1
COOKIE|Biscuit|Web tracker; Smart ___|1|🍪
COUSIN|Relative; Kin|Aunt's child; Kissing ___|1
DANGER|Peril; Risk|Hazard sign; Stranger ___|1
DESERT|Arid land|Abandon; Sahara, e.g.|1|🏜️
DINNER|Supper|Evening meal; ___ bell|1
DOCTOR|Physician|MD; Fake, as a photo|1|🩺
DRAGON|Mythic beast|Fire breather; Komodo ___|1|🐉
EASILY|Simply|Without effort; Hands down|1
EDITOR|Reviser|Newspaper boss; Film cutter|1
ENERGY|Power|Vigor; Pep|1
ENGINE|Motor|Machine; Search ___|1
ESCAPE|Flee|Getaway; Keyboard exit|1
FAMILY|Kin|Relatives; ___ tree|1
FAMOUS|Well-known|Noted; ___ last words|1
FATHER|Dad|Priest; ___ Time|1
FINGER|Digit|Point at; ___ food; Index; Pinkie; Ring ___|1
FLOWER|Blossom|River; ___ power|1
FOREST|Woods|Woodland; Rain ___|1
FRIEND|Pal|Companion; Fair-weather ___|1
GALAXY|Star system|Milky Way; Andromeda|1|🌌
GARDEN|Plot|Yard; Rock ___|1
GARLIC|Pungent bulb|Vampire deterrent; ___ bread|1|🧄
GINGER|Spice root|Redhead; ___ ale|1
GUITAR|String instrument|Axe; Air ___|1|🎸
HAMMER|Tool|Pound; Sledge___|1|🔨
HELMET|Hard hat|Headgear; Bike ___|1|⛑️
HIDDEN|Concealed|Secret; ___ gem|1
HOCKEY|Ice sport|Puck game; Stanley Cup|1|🏒
INSECT|Bug|Creepy crawler; Six-legger|1
ISLAND|Isle|Atoll; Kitchen counter|1
JACKET|Coat|Cover; Book cover|1
JIGSAW|Puzzle|Saw; Piece work|1
JUNGLE|Rainforest|Wild; ___ gym|1
KETTLE|Teapot|Pot; Pot calling the ___|1
KITTEN|Young cat|Kitty; ___ heels|1|🐱
LADDER|Steps|Hierarchy|1|🪜
LAPTOP|Notebook PC|Portable computer|1|💻
LEADER|Head|Chief|1
LEGEND|Myth|Map key|1
LETTER|Note|Character|1|✉️
LIZARD|Reptile|Gecko kin|1
MAGNET|Attractor|Draw|1|🧲
MARKET|Bazaar|Sell|1
MIRROR|Looking glass|Reflect|1|🪞
MOMENT|Instant|Second|1
MONKEY|Ape|Imp|1|🐒
MOTHER|Mom|Mama|1
MUFFIN|Cupcake|Bun|1|🧁
NATURE|Environment|Character|1
NEEDLE|Pin|Tease|1|🪡
NUMBER|Digit|Song|1|🔢
ORANGE|Citrus|Color|1|🍊
OYSTER|Shellfish|Pearl maker|1|🦪
PARADE|Procession|March|1
PARENT|Mom or dad|Guardian|1
PARROT|Talking bird|Mimic|1|🦜
PENCIL|Writing tool|Lead holder|1|✏️
PEPPER|Spice|Bell veggie|1|🫑
PICNIC|Outdoor meal|Easy task|1
PIRATE|Buccaneer|Copier|1
PLANET|World|Globe|1|🪐
POCKET|Pouch|Pocket money|1
POTATO|Spud|Tater|1|🥔
PRINCE|Royal son|Heir|1|🤴
PUZZLE|Riddle|Mystery|1
RABBIT|Bunny|Hare|1|🐰
RECIPE|Formula|Instructions|1
RESCUE|Save|Free|1
ROCKET|Spacecraft|Salad green|1|🚀
SADDLE|Seat|Burden|1
SAFARI|Expedition|Trek|1
SALMON|Pink fish|Fish|1
SCHOOL|Academy|Fish group|1|🏫
SECRET|Hidden|Mystery|1
SHADOW|Shade|Follow|1
SHOWER|Rain|Wash|1|🚿
SILVER|Metal|2nd prize|1|🥈
SISTER|Sibling|Nun|1
SMOOTH|Even|Slick|1
SPIDER|Arachnid|Web spinner|1|🕷️
SPRING|Season|Coil|1
STREAM|Brook|Broadcast|1
STREET|Road|Avenue|1
STRONG|Powerful|Tough|1
SUMMER|Season|Warm months|1
SUNSET|Dusk|Ending|1|🌇
TABLET|Pad|Pill|1
TEACUP|China cup|Tiny dog|2
TENNIS|Racket sport|Court game|1|🎾
THRONE|Royal seat|Seat of power|1
TICKET|Pass|Fine|1|🎟️
TOMATO|Red fruit|Salsa base|1|🍅
TRAVEL|Journey|Tour|1|🧳
TURKEY|Thanksgiving bird|Flop|1|🦃
TURTLE|Shelled reptile|Slow mover|1
TWELVE|Dozen|Number|1
UNIQUE|One of a kind|Rare|1
VELVET|Soft fabric|Plush|1
WALNUT|Nut|Wood|1
WINDOW|Pane|Opening|1|🪟
WINTER|Season|Cold season|1|⛄
WIZARD|Sorcerer|Genius|1|🧙
YELLOW|Lemon color|Cowardly|1|🟨
ZIPPER|Fastener|Slide fastener|1
ABJECT|Wretched; Hopeless|Down and out|4
ACUMEN|Shrewdness; Insight|Biz wiz; Business savvy|4
ADROIT|Skillful; Deft|Nimble-fingered|5
AGHAST|Horrified; Speechless; Appalled|Jaw on the floor; Shocked stiff|4
ALLURE|Charm; Appeal|Siren song; Bright-lights pull|3
ARCANE|Obscure; Mysterious|Wizards-only lore|4
ASTUTE|Shrewd; Sharp|Sharp as a tack|4
BANTER|Teasing chat; Repartee|Witty back-and-forth; Ribbing|3
BAZAAR|Market; Fair|Souk; Charity sale|3
BEDLAM|Chaos; Uproar|Madhouse; Free-for-all|4
BEMUSE|Confuse; Bewilder|Leave puzzled|5
BESTOW|Grant; Confer|Hand out honors|4
BLITHE|Carefree; Casual|Happy-go-lucky; Without a care|5
CAJOLE|Coax; Wheedle|Sweet-talk; Butter up|5
CANDOR|Honesty; Frankness|Straight talk; No sugarcoating|4
CHALET|Swiss cabin|Ski lodge; Alpine cabin|3
COHORT|Group; Companion|Sidekick; Same-year group|4
DEMURE|Modest|Shy; Prim and proper|4
DOTAGE|Old age|Senility; Golden years|5
ELICIT|Draw out|Evoke; Bring forth|4
ELIXIR|Potion|Remedy; Cure-all|4
ENIGMA|Puzzle|Mystery; Riddle|3
ERSATZ|Fake|Imitation; Knockoff|5
EXODUS|Mass departure|Flight; Bible book|3
FERVOR|Passion|Zeal; Ardor|4
FIASCO|Disaster|Flop; Debacle|3
GALORE|Plenty|Aplenty; In abundance|4
GAMBIT|Opening move|Ploy; Chess ploy|4
GARISH|Gaudy|Flashy; Loud|4
HAMLET|Small village|Dane prince; To be or...|3
HEYDAY|Prime|Peak; Glory days|4
INCITE|Provoke|Stir up; Spur on|4
JOVIAL|Cheerful|Jolly; Merry|4
LAMENT|Mourn|Dirge|4
LUSTER|Shine|Gloss|4
MALICE|Spite|Ill will|4
MANTRA|Chant|Slogan|3
MOROSE|Gloomy|Sullen|5
NIMBLE|Agile|Quick|3
NOVICE|Beginner|Rookie|3
OBLONG|Rectangular|Elongated|4
ORACLE|Prophet|Seer|3
PALATE|Taste|Mouth roof|4
PARODY|Spoof|Satire|3
PLACID|Calm|Serene|4
QUAINT|Charming|Old-fashioned|3
RAVINE|Gorge|Gully|3
RECANT|Retract|Take back|5
RELISH|Enjoy|Condiment|3
REMEDY|Cure|Fix|2
RUSTIC|Rural|Countrified|3
SAVANT|Scholar|Genius|5
SERENE|Calm|Peaceful|3
SOLACE|Comfort|Consolation|4
SOLEMN|Serious|Grave|3
SPRITE|Elf|Fairy|3
STANZA|Verse|Poem part|4
SUBTLE|Delicate|Understated|3
TANGLE|Snarl|Knot|2
THWART|Foil|Frustrate|4
TIRADE|Rant|Outburst|4
UNEASE|Anxiety|Disquiet|3
VELLUM|Parchment|Fine paper|5
VERITY|Truth|Fact|5
WANDER|Roam|Stray|2
ZEALOT|Fanatic|Extremist|4
ZENITH|Peak|Summit|4
# ---------- 7 letters ----------
ABILITY|Skill; Talent|What it takes; Know-how|1
ACROBAT|Gymnast; Tumbler|PDF reader; Adobe viewer; Circus flier|1|🤸
ADDRESS|Location; Speech|House ID; Gettysburg ___|1
AIRPORT|Airfield; Terminal|Where flights land; Runway home|1|🛫
ANIMATE|Bring to life; Enliven|Make Mickey move|2
ANTENNA|Aerial|Feeler; Bug's radar|1
APRICOT|Orange fruit; Stone fruit|Peachy cousin|2
BALANCE|Equilibrium|Remainder; Tightrope skill; Bank-statement sum|1
BALLOON|Inflatable|Swell; Party float; Hot-air ride|1|🎈
BANDAGE|Dressing; Wrap|Band-Aid; Gauze job|1|🩹
BATTERY|Power cell|Assault; AA, e.g.; Low-___ warning|1
BEDROOM|Sleeping room; Chamber|Where dreams happen; ___ eyes|1
BICYCLE|Bike; Two-wheeler|Tandem, e.g.; Pedal pusher|1|🚲
BLANKET|Cover; Throw|Security ___; Wet ___|1
BROTHER|Sibling|Monk; Big ___; Oh, ___!|1
CABBAGE|Leafy veggie|Slaw base; Cash, slangily|1|🥬
CAPTAIN|Skipper; Leader|Team head; Ship's boss|1
CARAMEL|Toffee|Candy; Salted ___|1
CARTOON|Animation|Comic; Saturday fare|1
CEILING|Overhead|Upper limit; Glass ___|1
CHAPTER|Section|Branch; Book part|1
CHICKEN|Hen|Coward; Which came 1st?|1
CIRCUIT|Loop; Lap|Electric path; Tour route|1
CLIMATE|Weather|Atmosphere; ___ change|1
CONCERT|Show; Performance|Gig; Rock ___|1
COUNTRY|Nation|Rural; ___ music|1
CRYSTAL|Quartz|Clear; ___ ball|1
CURTAIN|Drape|End; ___ call|1
DIAMOND|Gem|Baseball field; Rough ___|1
DOLPHIN|Sea mammal|Flipper; Miami team|1|🐬
EARRING|Jewelry|Stud; Lobe sparkle|1
ECLIPSE|Blot out|Overshadow; Solar event|2|🌘
ELEMENT|Part|Component; Iron or gold|1
EMPEROR|Monarch|Ruler; ___ penguin|1
EVENING|Night|Dusk; After sunset|1
FASHION|Style|Trend; ___ show|1
FEATHER|Plume|Quill; Light as a ___|1|🪶
FICTION|Story|Invention; Science ___|1
FIREMAN|Firefighter|Stoker; Ladder climber|1|🚒
FREEDOM|Liberty|Release; Independence|1|🗽
GALLERY|Art space|Balcony; Peanut ___|1
GIRAFFE|Tallest animal|Savanna browser; Long-necked one|1|🦒
GLACIER|Ice mass|Ice river; ___ Bay|1
HARVEST|Crop|Reap; ___ moon|1
HEALTHY|Well|Fit; Wholesome|1
HISTORY|Past|Record; ___ buff|1
HOLIDAY|Vacation|Festival; Day off|1
HORIZON|Skyline|Range; Sunset line|1
HUNDRED|Century|Number; C-note|1|💯
JOURNEY|Trip|Voyage; Trek|1
KITCHEN|Cookroom|Galley; ___ sink|1
LEOPARD|Spotted cat|Big cat|1|🐆
LIBRARY|Book room|Archive|1|📚
LOBSTER|Shellfish|Crustacean|1|🦞
MACHINE|Device|Engine|1
MAGICAL|Enchanting|Wondrous|1
MESSAGE|Note|Text|1
MINERAL|Ore|Rock|1
MONSTER|Beast|Ogre|1|👾
MORNING|AM|Dawn|1
NETWORK|Web|Chain|1
NOTHING|Zero|Nil|1
OCTOPUS|Eight-armed sea beast|Sea creature|1|🐙
OPINION|View|Belief|1
ORCHARD|Fruit farm|Grove|1
OSTRICH|Big bird|Head-in-sand bird|1
PAINTER|Artist|Decorator|1
PANCAKE|Flapjack|Griddle cake|1|🥞
PATTERN|Design|Template|1
PELICAN|Pouched bird|Seabird|1
PENGUIN|Flightless bird|Tux bird|1|🐧
PERFECT|Flawless|Ideal|1
PICTURE|Photo|Image|1
PILGRIM|Traveler|Pioneer|1
PLASTIC|Polymer|Credit card|1
POPCORN|Movie snack|Snack|1|🍿
PRESENT|Gift|Current|1
PROBLEM|Issue|Trouble|1
PROJECT|Plan|Venture|1
PROMISE|Pledge|Vow|1|🤞
PYRAMID|Triangle|Egyptian tomb|1
RAINBOW|Arc of colors|Spectrum|1|🌈
RECEIPT|Proof of purchase|Slip|1|🧾
SCIENCE|Study|Knowledge|1|🔬
SEAFOOD|Fish|Shellfish|1
SOLDIER|Trooper|Fighter|1|🪖
SPINACH|Leafy green|Sailor's food|1
SUNBURN|Red skin|Burn|1
TEACHER|Educator|Tutor|1
THUNDER|Boom|Roar|1|🌩️
TORNADO|Twister|Cyclone|1|🌪️
TRAFFIC|Congestion|Trade|1|🚦
TRUMPET|Brass horn|Blare|1|🎺
UNICORN|Horned horse|Mythical beast|1|🦄
VAMPIRE|Bloodsucker|Night biter|1|🧛
VOLCANO|Erupting peak|Lava mountain|1|🌋
WEATHER|Climate|Endure|1
WEEKEND|Saturday|Days off|1
WHISKER|Hair|Bristle|1
WITNESS|Observer|See|1
ABANDON|Desert; Leave|Jump ship; Leave high and dry|2
ALCHEMY|Magic; Transmutation|Lead-into-gold trick; Kitchen wizardry|4
ANAGRAM|Rearranged word|Wordplay|3
ARMOIRE|Wardrobe; Cabinet|Narnia's portal|4
AVARICE|Greed; Cupidity|Scrooge's sin|5
BRAVADO|Swagger; Boldness|Big talk; False courage|4
CADENCE|Rhythm|Lilt; Marching beat|4
CAPRICE|Whim|Impulse; Sudden fancy|5
CHIMERA|Mythic hybrid|Illusion; Pipe dream|5
CLARION|Trumpet call|Clear call; ___ call to action|5
DECORUM|Propriety|Dignity; Good manners|4
EPITOME|Model|Embodiment; Perfect example|4
FERVENT|Passionate|Ardent; Heartfelt|4
FIDGETY|Restless|Jittery; Antsy|3
GALLANT|Brave|Chivalrous; Dashing|4
GLIMMER|Flicker|Hint; ___ of hope|3
HAUGHTY|Proud|Arrogant; Snooty|4
INKLING|Hint|Notion; Faint idea|4
JOCULAR|Joking|Funny; Playful|5
KINDRED|Related|Kin; ___ spirits|4
LACONIC|Terse|Brief|5
MIRACLE|Wonder|Marvel|2
NOSTRUM|Remedy|Panacea|5
OPULENT|Luxurious|Rich|4
PARAGON|Model|Ideal|5
PENSIVE|Thoughtful|Reflective|4
RAPPORT|Bond|Harmony|4
RESOLVE|Determination|Settle|3
REVERIE|Daydream|Musing|5
TANGENT|Digression|Math line|4
TEMPEST|Storm|Turmoil|4
TENUOUS|Weak|Flimsy|5
VERBOSE|Wordy|Long-winded|4
WAYWARD|Unruly|Errant|4
ZEALOUS|Eager|Fervent|4
# ---------- v02c additions (for CLUE PICS v02) ----------
TOW|Pull a car|Haul behind|2
BEET|Red root veggie|Borscht base; Red as a ___|2
BLEW|Exhaled hard|Wasted, as a chance; ___ it (fumbled)|2
BURY|Put underground|Hide in the yard; ___ the hatchet|2
FARE|Ticket price|Get along; Food served|2
HIVE|Bee home|Buzzing colony; ___ mind|1
HOOT|Owl's call|Great fun; Don't give a ___|2
ITCH|Need to scratch|Strong urge; Seven-year ___|1
MALE|Not female|Masculine|1
ODDS|Betting chances|Likelihood|2
SEAM|Stitched line|Coal layer|2
WEEP|Cry|Shed tears|1
FANG|Snake tooth|Vampire's tooth; Wolf's tooth|2
SPADE|Digging tool|Card suit|2
THORN|Rose prickle|Constant annoyance|2
PETAL|Flower part|Daisy piece|1
BREW|Make tea|Beer, informally; Witch's pot; Home-___|2
STING|Bee's jab|Undercover operation|2
COUGH|Throat clear|Hack; ___ drop|1
WOUND|Injury|Coiled up|2
GRAVE|Burial site|Very serious; Turn in one's ___|2
WITCH|Broom rider|Spell caster|1
SOLAR|Of the sun|Sun-powered|2
STEAL|Take without paying|Bargain|1
WEIGH|Put on a scale|Consider|2
HEARD|Listened to|Caught, as news; Word got out|1
AISLE|Store walkway; Wedding path|Down the ___; Window-seat rival|2
KNIGHT|Armored warrior|Chess piece; Sir|2
WEIGHT|Heaviness|Gym plate|2
SAILOR|Seaman|Deckhand|1
CHANCE|Luck|Opportunity; Fat ___|1
RACKET|Tennis bat|Loud din|2
BALLET|Tutu dance|Swan Lake art; Barre work|2
SNEEZE|"Achoo!"|Allergy reaction|1
CIRCUS|Big-top show|Chaotic scene; Three-ring ___|1
POISON|Toxin|Venom|1
HOARSE|Raspy-voiced|Croaky; Talked out|3
SEASON|Spring or fall|Add salt|1
DENTIST|Tooth doctor|Driller with a chair; Say "ahh" spot|1
COWBOY|Ranch hand|Rodeo rider; Dallas team|1
CARPET|Floor covering; Rug|Red ___; Magic ___|1
HOTDOG|Ballpark snack|Show-off; Frank|1
CATFISH|Whiskered fish|Online impostor; Fake profile|2
BULLDOG|Wrinkly dog|Tenacious type; Yale mascot|1
CUPCAKE|Frosted treat|Muffin's cousin; Sweetie|1
SNOWMAN|Frosty figure|Carrot-nosed figure|1
MAILBOX|Letter drop|Inbox|1
HANDBAG|Purse|Clutch; Tote|1
SEAWEED|Kelp|Ocean plant|1
SEAGULL|Beach bird|Fry thief|1
KEYHOLE|Lock opening|Peeping spot; ___ surgery|1
BOWTIE|Formal neckwear|Farfalle shape; Tux topper|2
EYEBALL|Orb of sight|Look over; Size up|2
PIGPEN|Sty|Messy room|2
DOGSLED|Snow ride|Musher's ride; Iditarod rig|2
SUNDIAL|Shadow clock|Garden timepiece|2
BEEHIVE|Bee home|Tall hairdo; Buzzing box|2
BOOKEND|Shelf support|Book stopper; Shelf's end piece|2
SANDBOX|Kids' play pit|Test area|1
EGGCUP|Breakfast holder|Soft-boiled stand; Yolk perch|2
ICEBOX|Old fridge|Cold storage; Cooler|2|🧊
EARWAX|Cerumen|Q-tip target; Canal gunk|2
FISHNET|Mesh catch|Stocking style; Trawler's mesh|2
MOONLIT|Lit by the moon|Like a night stroll|2
SUNLIT|Bright with sunshine|Daylit|2
BELLHOP|Hotel porter; Bag carrier|Tip-earner; Luggage-cart pusher|2
CARPOOL|Shared ride|Commute group; ___ lane|1
BEDBUG|Mattress pest|Night biter; "Sleep tight" foe|1
SUNDAY|Weekend day|Day of rest|1
BULLPEN|Relievers' area|Open office; Warm-up zone|3
# ---------- v04: easy 6–7-letter words (Medium grids at levels 1–3, JM CD-8: 10.1) ----------
BATHTUB|Place for a soak|Tub for bubbles; Rubber-duck pond|1|🛁
PILLOW|Head rest in bed|Soft thing on a bed|1
STUDENT|Person at school|Learner|1
CRAYON|Wax coloring stick|Kid's drawing stick; Box of 64|1|🖍️
ERASER|Mistake remover|Pencil's pink tip; Whiteboard wiper|1
LUNCHES|Midday meals|School cafeteria meals|1
COOKIES|Sweet baked treats|Milk's dunkers; Jar fillers|1|🍪
WAFFLES|Grid-pattern breakfast cakes|Syrup holders|1|🧇
DONKEY|Small horse kin|Animal that brays; Shrek's pal|1|🫏
HAMSTER|Wheel pet|Cheeky pet; Pocket pet|1|🐹
FARMER|Crop grower|Barn owner; ___'s market|1|🧑‍🌾
SINGER|Person who sings|Vocalist|1|🎤
DANCER|Person who dances|Ballet performer; Rudolph's pal|1|💃
MUSEUM|Place with exhibits|Art or history hall|1|🏛️
TONIGHT|This evening|After today's sunset|1
CANDLES|Wax lights|Birthday-cake lights; Blow them out|1|🕯️
CLOWNS|Circus jokers|Big-shoe performers; Red-nose crew|1|🤡
KINGDOM|Royal realm|Realm; Animal ___|1
VIOLIN|Instrument played with a bow|Fiddle|1|🎻
DRUMMER|Band's beat keeper|Person with sticks; Little ___ boy|1|🥁
SOCCER|Game with goals and a round ball|Football, outside the US|1|⚽
SCOOTER|Kick-along ride|Little two-wheeled ride|1|🛴
STATION|Train stop|Place for trains|1|🚉
PHONES|Things you call on|Cell devices|1
DOORWAY|Entrance|Opening in a wall; Threshold|1
HALLWAY|Corridor|Passage; Hall|1
TOWELS|Bath drying cloths|Beach cloths|1
SWEATER|Knit top|Cozy pullover|1|🧶
MITTENS|Warm hand covers|Gloves without fingers|1|🧤
SLIPPER|Soft house shoe|Cinderella's glass shoe|1
SNEAKER|Running shoe|Gym shoe|1|👟
BUTTONS|Shirt fasteners|Remote things; Elevator panel|1
POCKETS|Places in pants|Spots for keys|1
PUMPKIN|Big orange squash|Jack-o'-lantern|1|🎃
LETTUCE|Salad leaf|Green in a burger|1|🥬
ORANGES|Juicy citrus fruits|Navel fruits|1|🍊
BANANAS|Yellow fruits|Monkey food; Gone ___ (crazy)|1|🍌
LEMONS|Sour yellow fruits|Lemonade fruits|1|🍋
PEANUTS|Ballpark snack|Nuts in shells|1|🥜
NOODLES|Pasta strands|Soup strands|1|🍜
PRETZEL|Twisted snack|Salty knot|1|🥨
ICEBERG|Floating ice|Titanic's foe; Tip of the ___|1|@iceberg
CANYON|Deep valley; Gorge|Grand ___; Echo spot|1
RIVERS|Flowing waters|Streams|1
OCEANS|Big seas|Atlantic and Pacific|1|🌊
PLANETS|Worlds in space|Mars and Venus|1
COMPASS|Direction finder|North pointer; Moral ___|1|🧭
LANTERN|Carried light|Camping lamp|1|🏮
BLOSSOM|Flower|Tree bloom; Spring burst|1
SHADOWS|Dark shapes from light|Things that follow you|1
MARBLES|Small glass balls|Rolling toys|1
YOGURT|Creamy dairy snack|Cup with fruit|1
FRIENDS|Pals|Buddies; '90s sitcom|1
COUSINS|Aunt's kids|Uncle's children; Family reunion crowd|1
HELPER|Assistant|Aide; Sidekick|1
HAPPILY|With joy|Gladly; ___ ever after|1
QUICKLY|Fast|In a hurry|1
SLOWLY|Not fast|At a snail's pace|1
QUIETLY|Without noise|Softly|1
SOMEONE|A person|Anybody|1
FOREVER|For all time|Always; ___ young|1
FAIRIES|Tiny winged sprites|Tinker Bell; Tooth takers|1|🧚
GIANTS|Huge folk|Beanstalk dwellers; NY football team|1
ROBOTS|Metal helpers|Machines that act human|1|🤖
ALIENS|Space visitors; Little green men|E.T. and friends; Roswell visitors|1|👽
JEWELS|Gems|Crown stones; Bling|1|💎
WALLET|Money holder|Billfold|1|👛
STAMPS|Postage|Envelope stickers|1
POSTER|Wall picture|Big printed sign|1
MEADOW|Grassy field|Pasture|1
VILLAGE|Small town|Hamlet|1|🏘️
COTTAGE|Small house|Country cabin; ___ cheese|1|🏡
CHIMNEY|Smoke outlet|Santa's entrance; Smoke like a ___|1
POSTMAN|Mail carrier|Letter deliverer|1
BARBER|Haircutter|Striped-pole shop; Sweeney Todd|1|💈
PLUMBER|Pipe fixer|Leak repairer|1
TAILOR|Clothes maker|Person who hems pants|1
AVOCADO|Guacamole fruit; Green, pitted fruit|Toast topper|1|🥑
BROWNIE|Chocolate square|Fudgy bar; Junior Girl Scout|1
BURRITO|Wrapped Mexican meal|Tortilla roll; Bean wrap|1|🌯
CEREAL|Breakfast flakes|Corn flakes, e.g.; Bowl with milk|1|🥣
CHOWDER|Thick soup|Clam soup; New England bowl|1
COCONUT|Hairy palm fruit|Palm-tree fruit; Piña colada flavor|1|🥥
CRACKER|Crisp snack|Saltine; Animal ___|1
DESSERT|After-dinner sweet|Pie or cake course; Sweet tooth's goal|1|🍨
HOTDOGS|Ballpark franks|Wieners in buns; Show-offs|1|🌭
KETCHUP|Tomato sauce|Fries dip; Catsup|1
MUSTARD|Yellow hot dog topper|Tangy spread|1
NUGGETS|Chicken bites|Gold lumps|1
OATMEAL|Hot breakfast cereal|Porridge|1
OMELET|Folded egg dish|Eggs with fillings|1
PEACHES|Fuzzy fruits|Georgia fruits|1|🍑
PICKLES|Sour cucumbers|Dill spears|1|🥒
RAISINS|Dried grapes|Lunchbox snack|1
SAUSAGE|Breakfast link|Ground meat roll|1
TOASTER|Bread browner|Kitchen pop-up machine|1
TEAPOT|Spouted brewing pot|Little tea pourer|1|🫖
PITCHER|Lemonade jug|Baseball thrower|1
NAPKIN|Lap cloth|Mouth wiper|1
SAUCER|Cup's plate|Flying ___|1
SPOONS|Soup tools|Teaspoons, e.g.|1|🥄
FREEZER|Ice cream keeper|Coldest box; Colder fridge|1
CLOSET|Clothes room|Place for hangers; Skeleton's spot|1
DRAWER|Desk compartment|Sock holder; Junk ___|1
TOILET|Bathroom fixture|Loo|1|🚽
BALCONY|Upper-floor porch|Juliet's perch; Upper theater seats|1
GARAGE|Car house|Place for a car; ___ sale|1
CELLAR|Basement|Wine room below; Root ___|1
FENCES|Yard borders|Picket barriers; Mends ___|1
DOORMAT|Welcome mat|Shoe wiper; Pushover|1
RATTLE|Baby's shaker|Snake's tail noise|1
CRADLE|Baby's bed|Rocking crib; Rock-a-bye spot|1
DIAPER|Baby's undergarment|Nappy; Changing-table item|1
TODDLER|Little walker|Young child|1
PARENTS|Mom and dad|Folks|1
UNCLES|Dad's brothers|Aunts' husbands|1
NEPHEW|Sibling's son|Niece's brother|1
NIECES|Siblings' daughters|Nephews' sisters|1
WEDDING|Marriage ceremony|Event with a bride|1|💒
GUESTS|Visitors|Party invitees; House ___|1
RECESS|Playground break|School break|1
LESSON|Class|Thing learned|1
READING|Book time|Story time|1|📖
WRITING|Putting words on paper|Penmanship|1
CRAYONS|Wax colors|Coloring sticks; Art-box set|1
STICKER|Peel-off label|Gold star, e.g.|1
GLITTER|Sparkly flakes|Craft sparkle; All that ___s|1
STAPLER|Paper fastener|Desk clicker|1
FOLDER|Paper holder|File holder; Manila ___|1|📁
BINDER|Ring notebook|Three-ring holder; School-bag staple|1
RULERS|Measuring sticks|Kings|1
RIDDLE|Puzzle question|Brain teaser|1
MYSTERY|Puzzle to solve|Whodunit|1
EXPLORE|Search new places|Expedition time!; Adventure; Wild ride; Safari; Dr. Livingstone|1
CAMPING|Tent stay|Outdoor trip; S'mores time|1|🏕️
HIKING|Trail walking|Mountain walking; Trekking|1|🥾
FISHING|Angling|Casting a line; ___ trip|1|🎣
SKIING|Gliding on snow|Slope sport|1|⛷️
SURFING|Riding waves|Beach board sport|1|🏄
BOWLING|Pins game|Strike sport; Ten-pin night|1|🎳
GOLFER|Club swinger|Swing-sport; 9 or 18; Tee-time; Fore!; Irons and woods; Putter|1
TROPHY|Prize cup|Winner's award|1|🏆
MEDALS|Olympic prizes|Gold, silver and bronze|1|🏅
WINNER|Champ|Victor|1
PLAYER|Team member|Game participant|1
REFEREE|Game official|Whistle blower|1
STADIUM|Big sports arena|Ballpark|1|🏟️
JUMPING|Leaping|Hopping; ___ jacks|1
RUNNING|Jogging|Racing on foot|1|🏃
SINGING|Making music with your voice|Vocal music|1
DANCING|Moving to music|Ballroom fun; ___ queen|1
DRAWING|Sketch|Pencil picture; Raffle|1
COOKING|Making meals|Kitchen work; What's ___?|1|🍳
BAKING|Oven cooking|Cookie making; Oven time|1
SLEEPY|Tired|Ready for bed|1|😴
HUNGRY|Wanting food|Starving; Peckish|1
THIRSTY|Wanting a drink|Parched|1
GENTLE|Soft and kind|Mild; ___ giant|1
SPECIAL|Unique|Out of the ordinary|1
PRETTY|Lovely|Cute|1
PURPLE|Grape color|Violet|1|🟣
GOLDEN|Made of gold|Retriever's coat; ___ Gate|1
MONDAY|Start of the work week|Day after Sunday|1
FRIDAY|Workweek end|<SAT; TGIF day|1
TUESDAY|Day after Monday|Taco day|1
JANUARY|1st month|New Year's month; Jan.|1
OCTOBER|Halloween month|10th month|1
AUGUST|8th month; Summer month|Dog days month; Majestic|1
MINUTES|Sixty-second spans|Clock units|1
SECONDS|Short time units|2nd helpings|1
CLOCKS|Time tellers|Things with hands; Spring-forward items|1
# ---------- v04: 11 letters (the left column of Large grids, JM CD-9: 1.1) ----------
BUTTERFLIES|Bright-winged bugs|Ex-caterpillars; Stage nerves|1|🦋
GRASSHOPPER|Jumping green insect|Field leaper; Kung fu pupil|1|🦗
WATERMELONS|Big striped summer fruits|Picnic melons with black seeds|1|🍉
BASKETBALLS|Hoop balls|Things shot at a rim; NBA balls|1|🏀
VOLLEYBALLS|Balls hit over a high net|Beach-game balls|1|🏐
PLAYGROUNDS|Parks with swings and slides|Recess spots|1
SCHOOLHOUSE|Building for classes|Old one-room learning place|1|🏫
THUNDERBOLT|Lightning strike|Flash from a storm|1|⚡
FIREFIGHTER|Blaze extinguisher|Hose handler; Red truck rider; Blaze-master; Pole-slider; 4-alarmist|1|🧑‍🚒
FINGERNAILS|Digit tips|Manicure; Clipped tips; Mani|1|💅
GRANDMOTHER|Parent's mother|Granny; Nana|1|👵
GRANDFATHER|Parent's father|Pop-pop; ___ clock|1|👴
GRANDPARENT|Parent's parent|Family elder; Nana or Pop|1
SANDCASTLES|Beach buildings with towers|Things kids build by the waves|1
SKATEBOARDS|Boards with four wheels|Half-pipe rides|1|🛹
MOTORCYCLES|Two-wheelers with engines|Bikers' rides|1|🏍️
HELICOPTERS|Rotor aircraft|Choppers; Whirlybirds|1|🚁
CATERPILLAR|Butterfly larva|Leaf-munching larva; Fuzzy crawler|1|🐛
RATTLESNAKE|Snake with a shaking tail|Desert hisser that buzzes|1
WOODPECKERS|Birds that drum on trees|Tree-tapping birds|1
HUMMINGBIRD|Tiny hovering bird|Nectar-sipper; Fast flapper|1
DRAGONFLIES|Pond insects|Darting insects; Four-winged fliers|1
LIGHTHOUSES|Coastal towers with beams|They guide ships at night|1
GINGERBREAD|Spiced cookie|Holiday house cookie; ___ man|1
MARSHMALLOW|Puffy campfire treat|S'more filling|1
PEPPERMINTS|Cool white candies|After-dinner mints|1
CAULIFLOWER|White veggie|Pale florets; Broccoli's cousin|1
POMEGRANATE|Red fruit full of seeds|Jewel-seeded fruit|2
BLUEBERRIES|Small blue fruits|Muffin berries; Pie fillers|1|🫐
RASPBERRIES|Red berries|Jam berries|1
GRAPEFRUITS|Sour citrus|Breakfast halves; Ruby reds|1
TELEVISIONS|TVs|Screens for shows|1|📺
MICROPHONES|Things singers sing into|Mics|1|🎤
CALCULATORS|Math machines|Number crunchers; Exam gadgets|1|🧮
BOOKSHELVES|Places to keep books|Library racks; Reading nooks|1|📚
WHEELBARROW|One-wheeled garden cart|Gardener's load carrier|1
PHOTOGRAPHS|Pictures taken with a camera|Snapshots|1|📷
TRAMPOLINES|Bouncy backyard mats|Places to jump high|1
FIRECRACKER|Popping firework|Party popper; Big bangs|1|🧨
CELEBRATION|Party|Festive event; Confetti time|1|🎉
DECORATIONS|Party trimmings|Holiday hangings; Streamers|1
INVITATIONS|Party cards|RSVP cards|1|💌
GREENHOUSES|Glass plant houses|Winter tomato homes; Hothouses|1
RESTAURANTS|Places to eat out|Diners and cafes|1|🍽️
SUPERMARKET|Big grocery store|Place with carts and aisles|1|🛒
PHARMACISTS|Drugstore workers|People who fill prescriptions|2
ELECTRICIAN|Wiring worker|Outlet fixer; Sparky|2
PROGRAMMING|Writing code|Computer instructions work|2|💻
PROGRAMMERS|Code writers|App builders|2
POLICEWOMAN|Female officer|Woman on the beat|2|👮‍♀️
TAMBOURINES|Jingly hand drums|Shakers with little cymbals|2
INSTRUMENTS|Music makers|Band gear; Tools|1|🎻
EXPLORATION|Searching new lands|Adventurer's work; Mapping the unknown|2
IMAGINATION|Make-believe power|Dream stuff; Creativity|1
INFORMATION|Facts|Data; Desk at the mall|1
COMPETITION|Contest|Rivalry; Friendly ___|1|🏆
EDUCATIONAL|Teaching something|Good for learning; Instructive|2
INTERESTING|Not boring|Engaging; Curious|1
BEAUTIFULLY|In a lovely way; Gorgeously|With style; Picture-perfect|2
WONDERFULLY|In a great way|Marvelously|2
FRIENDSHIPS|Bonds between pals|Buddy ties; Pen-pal links|1
DISAPPEARED|Vanished|Went out of sight; Poof!|1
UNDERGROUND|Beneath the earth|Subway, in London|1
TEMPERATURE|How hot or cold it is|Thermometer reading|1
THERMOMETER|Fever checker|Temperature tool|1|🌡️
EARTHQUAKES|Ground shakers|Tremors; Seismic events|1
HANDWRITING|Penmanship|Pen's trail; Script|1|✍️
EXPERIMENTS|Science tests|Lab trials; Trial runs|1|🧪
DISCOVERIES|1st finds|Explorers' finds; Eureka moments|2
LOCOMOTIVES|Train engines|Steam pullers|2|🚂
CONVERTIBLE|Folding-roof car|Top-down car; Sofa bed|2
SKYSCRAPERS|Very tall buildings|City towers|1|🏙️
CANDLELIGHT|Wick's glow|Romantic glow; Dinner by ___|1|🕯️
DAYDREAMING|Mind wandering|Woolgathering; Staring off|2
SLEEPWALKER|Person who roams at night asleep|Somnambulist|2
STORYTELLER|Person who spins tales|Bedtime yarn spinner|1
SHIPWRECKED|Stranded after a sinking|Castaway, maybe|2
SALAMANDERS|Lizard-like amphibians|Newts' relatives|2|🦎
CHIMPANZEES|Clever apes|Chimps; Jane Goodall's study|1|🐒
NUTCRACKERS|Tools that open shells|Ballet soldiers|2
CHEESECAKES|Creamy desserts|New York desserts; Graham-crust cakes|1|🍰
WATERCOLORS|Paints mixed with water|Artist's paint box|1|🎨
SCREWDRIVER|Tool for turning screws|Phillips or flathead|1|🪛
FLASHLIGHTS|Handheld lights|U.K. torches; Dark tools|1|🔦
CANDLESTICK|Taper holder|Dinner-table holder; Clue weapon|2
TABLECLOTHS|Dinner-table covers|Linens on a table|1
SWEATSHIRTS|Warm tops with sleeves|Hoodies, maybe|1
BROTHERHOOD|Fellowship|Band of brothers; Lodge bond|2
COUNTRYSIDE|Rural area|Farmland; Rolling hills|1
HONEYSUCKLE|Sweet-smelling vine|Fragrant climber; Nectar vine|2
SNAPDRAGONS|Garden flowers with "mouths"|Tall bloom spikes|2
WILDFLOWERS|Meadow blooms|Flowers nobody planted|1|🌼
MOUNTAINTOP|Summit|Peak|1|🏔️
SNOWMOBILES|Winter motor sleds|Snow scooters|2
QUARTERBACK|Football passer|Team leader in a huddle|2|🏈
GOALKEEPERS|Net guards|Goalies; Shot stoppers|1|🥅
CHEERLEADER|Pom-pom waver|Sideline motivator; Biggest fan|1|📣
SCOREBOARDS|Game tally displays|Signs showing points|1
STOPWATCHES|Race timers|Coach's timers|1|⏱️
TOURNAMENTS|Series of contests|Championship events|1
ARCHAEOLOGY|Study of ruins; Dig science|Indy Jones's field|3
ASTRONOMERS|Star scientists; Telescope users|Galileo and company|2|🔭
MATHEMATICS|Numbers subject|Math, in full|1
BIOGRAPHIES|Life stories|Books about people; Lives in print|2
JOURNALISTS|News writers|Reporters; The press|2
MAGNIFICENT|Splendid|Grand|2
SPECTACULAR|Amazing to see|Showstopping|1
MISCHIEVOUS|Playfully naughty|Prankish|2
ADVENTUROUS|Daring; Bold and curious|Up for anything; Off the beaten path|2
INDEPENDENT|Free|Self-reliant; 3rd-party voter|2
REFRESHMENT|Snack or drink|Pick-me-up|2
ENVIRONMENT|Surroundings|Nature around us; Habitat|2
NEWSLETTERS|Club bulletins|Regular mailed updates|2
ANNIVERSARY|Yearly celebration; Wedding milestone|Silver or gold day|1
SIGHTSEEING|Touring the sights|Tourist's activity|1
CAMPGROUNDS|Tent sites|Places for RVs; Bonfire spots|1|🏕️
BACKGROUNDS|Scenery behind|Wallpaper settings; Photo backdrops|2
BATTLEFIELD|Place of combat|War zone; Gettysburg, once|2
BATTLESHIPS|Navy warships|Grid guessing game; Navy giants|2
WINDSHIELDS|Car front windows|Wiper surfaces|1
SPEEDOMETER|Dashboard gauge|It shows how fast you go|1
BLOCKBUSTER|Huge hit movie|Box-office smash; Summer tentpole|2|🎬
MASTERPIECE|Great work of art|Artist's finest|1|🖼️
ILLUSTRATOR|Book artist|Drawing pro; Picture maker|2
CARTOONISTS|Comic artists|Funny-page drawers; Strip makers|2
MARIONETTES|Puppets on strings|String-pulled figures|2
RINGMASTERS|Circus hosts|Big-top announcers|2|🎪
WEATHERVANE|Rooftop wind pointer|Barn-top rooster, maybe|2
SNOWBOARDER|Rider on a slope board|Winter halfpipe athlete|1|🏂
BIRDWATCHER|Birder|Binocular hobbyist; Audubon fan|2
HAIRBRUSHES|Grooming tools|Comb cousins; Tangle fixers|1
TRAFFICJAMS|Rush-hour backups|Gridlock|1
RAINFORESTS|Jungles|Tropical woods|1|🌳
WATERSLIDES|Pool chutes|Water park rides|1
PAPERWEIGHT|Desk item that holds sheets down|Desk paper holder|2
SWEETHEARTS|Darlings|Valentines|1|💕
HEARTBREAKS|Romance endings|Lovers' sorrows; Sad songs' topic|2
BOOKKEEPING|Account records work|Ledger work; Double-entry job|3
STEPBROTHER|Brother by marriage|Blended-family sibling|2
STEPMOTHERS|Dad's wives, to kids|Fairy-tale villains, often|2
SCHOOLGIRLS|Young students|Girls in class|1
BLACKBOARDS|Classroom slates|Chalk surfaces; Teacher's canvas|1
HIGHLIGHTER|Bright marker pen|Yellow pen; Text marker|1|🖍️
SPREADSHEET|Table of data on a computer|Excel file|2
DISHWASHERS|Kitchen machines|Plate scrubbers; Busboys' jobs|1
SALTSHAKERS|Table seasoning dispensers|Pepper partners|1|🧂
PEPPERMILLS|Grinders for a spice|Table spice grinders|2
REFRIGERATE|Keep cold|Chill in the fridge|2
MICROWAVING|Zapping food|Heating in seconds|2
BREADSTICKS|Long crunchy snacks|Italian table snack; Pasta-night sides|1|🥖
CHOCOLATIER|Chocolate maker|Truffle crafter; Bonbon pro|3
SWEETPOTATO|Orange root veggie|Thanksgiving casserole veggie|1|🍠
NIGHTLIGHTS|Bedroom glow lamps|Kid's lamps for the dark|1
HOUSEPLANTS|Indoor greenery|Potted pals; Sill-sitters; CO2-lovers; Green = grow|1|🪴
WATERINGCAN|Gardener's sprinkling pot|Spout pot for plants|1
HOMECOMINGS|Returns home|School dances; Reunions|2
HOUSEKEEPER|Home caretaker|Maid; Cleaner|2
SHOPKEEPERS|Store owners|Merchants|2
BATHINGSUIT|Swimwear|Beach outfit; Poolside wear|2|🩱
SUPERHEROES|Caped crime fighters|Comic-book saviors|1|🦸
SUPERPOWERS|Heroes' special abilities|Flying and X-ray vision, e.g.|1
TRANSFORMER|Thing that changes shape|Robot that becomes a truck|2
# ---------- v05 additions (JM CD-10: 7.1.1.1) ----------
# Easy 2-letter answers: they let the 'full' grid style fill more clue cells (levels 1–2)
AB|Stomach muscle|Six-pack; Crunch target|2
AK|Alaska; Juneau's state|Last Frontier; Midnight-sun state|2
AL|Alabama; Montgomery's state|Heart of Dixie; Roll Tide state|2
AP|Big news agency; Advanced Placement|___ exam; ___ Calculus|2
AR|Arkansas; Little Rock's state|Natural State|2
AV|Audiovisual|Projector dept.; ___ club|2
AZ|Arizona; Grand Canyon State|Saguaro state|2
BA|College degree|Arts degree, briefly; Four-year sheepskin|2
BB|Tiny air-gun pellet|Small round shot; ___ gun|2
BC|Before Christ|Vancouver's province; Caveman era, briefly|2
CA|California|Golden State; LA's state|1
CB|Trucker's radio|Breaker, breaker!; 10-4 device|2
CC|Email copy line|Extra recipients; Courtesy copy|2
CO|Colorado|Company; Rockies state|2
CT|Connecticut|Hartford's state; Nutmeg State|2
CV|Résumé|Career summary; Job-hunt paper|2
DC|U.S. capital|Washington letters; Not AC|1
DE|Delaware|1st State; Wilmington's state|2
DM|Direct message|Private note online; Slide into the ___s|2
EA|Each|Per item; Price-tag abbr.|2
ED|Education|Driver's ___; Phys ___|2
EV|Electric car|Plug-in ride; Tesla, e.g.|2
FE|Iron|Magnet metal; Element 26|2
FL|Florida|Sunshine State; Miami's state|1
FT|Foot or feet|Ruler unit, abbr.; Fort, on maps|1
FX|Special effects|Movie magic; CGI|2
GA|Georgia|Peach State; Atlanta's state|2
GG|"Good game!" online|Gamer's sign-off; Match-end chat|2
GP|Family doctor|General practitioner; Grand Prix|2
HD|High definition|Sharp picture; ___ TV|1
HP|Horsepower|Engine power; Printer brand|2
HR|Hour|Hiring dept.; Home run|1
IA|Iowa|Des Moines; Hawkeye State|2
IL|Illinois|Chicago; Prairie State|2
IM|Instant message|Quick online note; DM, earlier|2
IP|Internet address|Online ID #; Brand rights|2
IV|Hospital drip|Roman four; Saline line|2
JR|Junior|Son of a "Sr."; Kid, briefly|2
JK|"Just kidding!"|"Only joking"; Text joke tag|1
KG|Kilogram|1,000 grams; Weight unit|2
KM|Kilometer|1,000 meters; Road-sign unit|2
KS|Kansas|Topeka's state; Sunflower State|2
KY|Kentucky|Bluegrass State; Derby state|2
KB|Kilobyte|Tiny file size; Data unit|2
LB|Pound, as a weight|Scale unit|2
LT|Lieutenant|Army rank|2
MC|Host of a show|Emcee|2
MG|Milligram|Pill-dose unit|2
MM|Millimeter|Yummy sound|1
MN|Minnesota|Land of 10,000 Lakes|2
MO|Missouri|"Just a ___!" (moment)|2
MP|Member of Parliament|Military police|2
MT|Montana|Mountain, on maps|2
NC|North Carolina|Raleigh's state|2
ND|North Dakota|Bismarck's state|2
NH|New Hampshire|Concord's state|2
NJ|New Jersey|Garden State|2
NM|New Mexico|Santa Fe's state|2
NU|Greek >Mu|Greek N|2
NV|Nevada|Las Vegas's state|2
OJ|Orange juice|Breakfast drink|1
OP|Photo ___ (posed moment)|___ art (optical style)|2
OS|Computer's operating system|Windows or macOS, e.g.|2
OT|Overtime|Extra period in a tied game|2
PB|Peanut butter|Runner's personal best|2
PD|Police department|Cop-shop letters|2
PG|Movie rating: parental guidance|Rating just above G|1
PH|Acid-test number|Pool-water reading|2
PO|Post office|___ box (mail slot)|2
PS|Note after a letter's signature|Afterthought in a letter|1
PT|Physical therapy|Pint|2
QB|Quarterback|Football passer|2
RA|Egyptian sun god|Dorm adviser|2
RC|Radio-controlled, as a toy car|Remote-run|2
RD|Road, on maps|Street|1
RI|Rhode Island|Smallest state|2
RM|Room|Hotel space|2
RR|Railroad|Train-line letters|2
RX|Doctor's prescription|Pharmacy symbol|2
SC|South Carolina|Columbia's state|2
SD|South Dakota|Camera memory-card letters|2
SK|Slovakia, on maps|Bratislava's land|2
SM|Small, on a size tag|Shirt size below Med.|1
SQ|Square|___ ft. (area unit)|2
TD|Touchdown|Six-pointer|2
TE|Tight end, in football|Blocker who also catches|2
TM|Trademark letters|Brand-name mark|2
TN|Tennessee|Nashville's state|2
TP|Toilet paper|Bathroom roll|1
TX|Texas|Lone Star State|1
TY|"Thanks!" in a text|Quick gratitude|1
UI|User interface|Screen layout, to app makers|2
UV|Sunburn rays|Ultraviolet|2
VA|Virginia|Richmond's state|2
VI|Six, in Roman numerals|Half of XII|2
VS|Versus|Matchup letters|1
VT|Vermont|Maple-syrup state|2
WA|Washington State|Seattle's state|2
WC|Restroom, in Europe|Water closet|2
WI|Wisconsin|Cheese state|2
WK|Week|Seven days|1
WV|West Virginia|Mountain State|2
WY|Wyoming|Cheyenne's state|2
XO|Hugs-and-kisses sign-off|Love, in a note|1
XS|Extra small T-shirt|Tiniest shirt size|1
YA|Young adult, as a book section|Teen-fiction label|2
YD|Yard|Three feet|2
YR|Year|12 months|1
# 3 letters
ZZZ|Sound of snoring|Comic-strip sleep|1|💤
AIL|Be sick; Feel poorly|Under the weather; "What ___s you?"|3
BAH|Scrooge's scoff|"Humbug" partner; Grumpy grunt|2
BEG|Plead|Doggy treat trick; ___ to differ|1
BIO|Life story; Profile summary|Social-media blurb; ___ class|2
BOP|Light head tap|Dance, informally; Be-___|2
COB|Corn's core|Male swan; Corn on the ___|3
COP|Police officer|Steal, slangily; ___ a plea|1
COY|Shy|Playing hard to get; Flirty and shy|3
DON|Put on, as a coat|Mafia boss; Oxford teacher|3
DUB|Nickname|Revoice a film; Knight|3
DUD|Failure|Fizzled firework; Flop|2
FAD|Short-lived craze|Once; Passing trend; Viral|2
FIB|Small lie|White one, often; Stretch the truth|1
FIR|Evergreen tree|Christmas tree|2
GIG|Music job|One-night booking; Side ___|2
PEG|Wooden pin|Hat hook|2
RIG|Big truck|Fix, as a contest|2
RUT|Groove in a road|Boring routine|2
SOB|Cry loudly|Weep and weep|1
SOW|Plant seeds|Mother pig|2
WOK|Stir-fry pan|Chinese cooking bowl|2
# 4 letters
AJAR|Slightly open; Not shut tight|Open a crack|2
BALM|Soothing ointment|Lip ___; Salve for the soul|2
BARK|Dog's sound|Tree's skin; Woof|1
BLUR|Fuzzy image|Speeding streak; Out-of-focus shot|2
BOLT|Lightning flash|Run off fast; Nut's partner|1
BRIM|Hat's edge|Very top of a cup; Full to the ___|2
BUZZ|Bee's sound|Quick call; Crew cut|1
CHAP|Fellow, in Britain|Crack, as lips; Old ___|3
CURL|Lock of hair|Biceps exercise; ___ up with a book|1
DAMP|Slightly wet|Moist; Muggy|1
DOZE|Light sleep|Nod off; Catnap|1
DUET|Song for two|Pair performance; Piano for four hands|1
DULL|Boring|Not sharp; Ho-hum|1
FAWN|Baby deer|Light brown; Suck up|2
FLAP|Wave, as wings|Envelope part; Fuss|1
FOIL|Kitchen wrap|Thwart; Sword|2
FUSS|Needless bother|A big deal; Hubbub; Ado|1
GERM|Microbe|Seed of an idea; ___-free|1|🦠
GOWN|Long formal dress|Prom outfit; Ball ___|1
GULP|Swallow quickly|Big swig; Nervous swallow|1
GUST|Sudden wind|Blast of air; Strong ___s|1
HAZE|Light mist|Smoggy blur; Mental fog|2
HOOP|Basketball ring|Hula ___; Earring style|1
HUSH|Make quiet|Lullaby's 1st word; ___ puppy|1
JEEP|Rugged vehicle|Off-roader; Army ride|2
JOLT|Sudden jerk|Coffee's kick; Shock|2
KALE|Leafy green|Smoothie green; ___ chips|2
KEEL|Boat's backbone|Fall, with "over"; Even ___|4
KIWI|Fuzzy green fruit|New Zealander; Flightless bird|1|🥝
LAVA|Volcano's flow|Molten rock|1
LILY|Easter flower|Pond pad flower|1
PAIL|Bucket|Jack and Jill's carrier|1
PONY|Small horse|Pay, with "up"|1
PROP|Stage object|Hold up|2
PUFF|Short breath of air|Cream ___ (pastry)|1
PUMA|Mountain lion|Cougar|2
PURR|Cat's sound|Happy cat noise|1
RAKE|Leaf gatherer|Rogue|2
SKIP|Hop along|Leave out|1
SLAM|Shut hard|Grand ___ (tennis)|1
SNAP|Break with a crack|Easy task|1
SODA|Fizzy drink|Pop|1|🥤
SPUD|Potato, informally|Tater|2
TACO|Folded tortilla|Tuesday treat|1|🌮
TUNA|Big ocean fish|Sandwich fish|1
VASE|Flower holder|Pottery piece|1
WASP|Stinging insect|Yellowjacket|1
WINK|Close one eye|Quick signal|1|😉
WIPE|Clean with a cloth|Erase|1
YOLK|Yellow of an egg|Egg's center|1
ZINC|Metal in brass|Sunscreen ingredient|3
ZOOM|Move fast|Video call app|1
# 5 letters
ATTIC|Room under the roof|Old-trunk spot; Grandma's trove|1
BADLY|Poorly|Want it ___; Not well|1
BASIL|Pesto herb|Herb in a caprese; Sweet ___|2
BELLY|Tummy|Underside; ___ flop|1
BIRCH|Tree with white bark|Canoe-bark tree; Paper ___|2
BOOTH|Small enclosed stall|Voting spot; Photo ___|2
BRAID|Plaited hair|Pigtail style; Challah shape|1
BRISK|Quick|Chilly, as a morning; ___ walk|2
BUDDY|Pal; Close friend|___ system; Sidekick|1
BUGLE|Small brass horn|Reveille player; Taps horn|2|📯
BUNNY|Rabbit|Easter animal; Dust ___|1|🐰
CHIME|Bell sound|Doorbell sound; ___ in|1
CHIRP|Bird's sound|Cricket's call; Tweet|1
CHUNK|Big piece; Hunk|Cookie ___; Lump|1
CLOAK|Cape|Disguise; ___-and-dagger|2
COBRA|Hooded snake|Charmer's snake; Yoga pose|2
CRISP|Crunchy|Potato chip, UK; ___ fall air|1
DINER|Roadside restaurant|Customer at a table; Greasy spoon|1
DONUT|Ring pastry|Cop's snack; Glazed treat|1|🍩
DWARF|Very small star|Snow White's helper; Tiny tree|2
EQUAL|Same|Peer; ___ sign|1
ERASE|Rub out|Delete; Wipe clean|1
FAIRY|Tiny winged spirit|Tooth taker; ___ tale|1|🧚
FLOCK|Group of sheep|Church group; Birds group; Sheep group|1
FLUTE|Reedless woodwind|Champagne glass; Mozart's Magic ___|2
GAVEL|Judge's hammer|Auctioneer's tool; Order! tool|3
GRAVY|Meat sauce|Easy extra; ___ train|1
HATCH|Emerge from an egg|Small door; Escape ___|2
HIPPO|River horse|Big-mouthed beast; Nile wallower; Whale relative|1|🦛
HOBBY|Pastime|Interest; Weekend passion|1
HONEST|Truthful|Sincere; ___ Abe|1
JOKER|Wild card|Class clown; Batman foe|1|🃏
LEMUR|Madagascar primate|Ring-tailed animal|3
LILAC|Pale purple|Fragrant spring shrub|2
LOTUS|Water lily of Asia|Yoga pose|2|🪷
MELON|Cantaloupe, e.g.|Big round fruit|1|🍈
MOCHA|Chocolate coffee|Coffee-shop flavor|2
MOOSE|Antlered giant deer|Canadian icon with a big snout|1
MUDDY|Covered in wet dirt|Unclear, as water|1
NACHO|Chip with cheese|Tex-Mex snack|1
PLAID|Tartan pattern|Checkered pattern|2
PLUSH|Soft and fancy|Luxurious|2
PORCH|Covered entrance|Front stoop|1
PURSE|Handbag|Pucker, as lips|1|👛
QUAIL|Small game bird|Cower|3
QUILT|Patchwork bed cover|Comforter|1
RELAX|Calm down|Unwind|1
RHYME|Words that sound alike|Verse|1
SALSA|Chip dip|Latin dance|1
SKUNK|Smelly black-and-white animal|Shut out in a game|1|🦨
SNEAK|Move quietly|Tattletale|1
SPARK|Tiny flash|Ignite|1
SPIRE|Church steeple|Tapering top|3
SPRAY|Fine mist|Spritz|1
SQUID|Ten-armed sea creature|Ink squirter|1|🦑
STOOL|Seat with no back|Bar seat|1
STORK|Bird of baby lore|Long-legged wader|2
SUSHI|Japanese rice dish|Raw fish roll|1|🍣
SWIFT|Fast|Fast flier|2
TROUT|Freshwater fish|Rainbow fish|2
TRUNK|Elephant's nose|Car storage|1
VIOLA|Larger cousin of a violin|String instrument|3
# 6 letters
BREEZE|Gentle wind|Easy task; Shoot the ___|1
BRANCH|Tree limb|Local office; Olive ___|1
BUBBLE|Soapy sphere|Gum blower's pop; Burst one's ___|1|🫧
CANVAS|Painter's cloth|Tent fabric; Blank ___|2
COBWEB|Old spider web|Dusty-corner decor; Clear the ___s|2
COMEDY|Funny show|Laughs; Stand-up|1
COTTON|Fluffy-plant fabric|T-shirt fabric; ___ candy|1
DAGGER|Short knife|Deadly look; Cloak-and-___|2|🗡️
DOLLAR|Hundred cents|Greenback; Bet your bottom ___|1|💵
FABRIC|Cloth|Material; ___ softener|1
FALCON|Fastest prey bird|Hunting hawk; Millennium ___|2
FOSSIL|Rock-bound remains|Old-timer; Dino bone; Antique; Outdated|2
FREEZE|Turn to ice|Stand still; Brain ___|1
FRIDGE|Kitchen cooler|Leftovers' home; Magnet board|1
GLOBAL|Worldwide|Planet-wide; ___ warming|2
GOBLIN|Ugly little creature|Halloween ghoul; Gremlin kin|2
HANGER|Closet hook|Coat holder; Wire ___|1
HARBOR|Ship's shelter|Hold, as a grudge; Pearl ___|2
IGUANA|Large lizard|Pet with a dewlap; Green reptile|2
JERSEY|Team shirt|New ___; Dairy cow|1
JUNIOR|Younger person|3rd-year student; Jr.|1
KIDNEY|Bean-shaped organ|Filter organ; ___ bean|2
LAGOON|Shallow coastal pool|Water behind a reef|2
LOCKET|Pendant with a photo|Keepsake necklace|2
MARBLE|Small glass ball|Statue stone|1
MITTEN|Thumb-only glove|Winter hand warmer|1
PADDLE|Canoe oar|Ping-pong bat|1
PEANUT|Ballpark snack|Little one|1|🥜
PEBBLE|Small smooth stone|Beach stone|1
PICKLE|Sour cucumber|Tight spot|1
PLENTY|Lots|Abundance|1
POETRY|Verse|Rhymed writing|1
POODLE|Curly-haired dog|French dog|1|🐩
PUDDLE|Small pool of rain|Splash spot|1
PUPPET|Hand doll|Person controlled by another|1
REMOTE|TV controller|Far-off|1
RIBBON|Bow material|Award strip|1|🎀
SCREEN|Monitor|Movie surface|1
SEESAW|Teeter-totter|Waver|1
SHOVEL|Digging tool|Snow mover|1
SKETCH|Rough drawing|Comedy bit|1
SLEEVE|Arm part of a shirt|Record cover|1
SPONGE|Absorbent pad|Freeloader|1|🧽
SQUASH|Gourd vegetable|Flatten|1
STABLE|Horse barn|Steady|1
STRING|Thin cord|Kite line|1
SUMMIT|Mountaintop|Leaders' meeting|2
TOFFEE|Chewy candy|Butterscotch|2
TONGUE|Taste organ|Language|1|👅
TUNNEL|Underground passage|Burrow|1
TUXEDO|Formal suit|Black-tie wear|2
VALLEY|Low land between hills|Dale|1
WAFFLE|Grid breakfast|Waver|1|🧇
WALRUS|Tusked sea mammal|Seal with a mustache|1
WEASEL|Slinky mammal|Sneak|2
# 7 letters
BAGPIPE|Scottish horn|Highland ___; Kilted piper's horn|3
BISCUIT|Small soft bread|Dog treat; Gravy partner|1
BRACKET|Wall support|Tournament chart; Tax ___|2
BUFFALO|Bison|New York city; ___ wings|1|🐃
CARAVAN|Line of travelers|Camel train; Wagon train|3
CASHIER|Checkout clerk|Store's money taker; Till keeper|1
CHARIOT|Ancient horse cart|Racing cart; Ben-Hur's ride|4
CHEETAH|Fastest land animal|Spotted sprinter; Savanna speedster|1|🐆
COMPOST|Rotting garden pile|Garden fertilizer; Scraps heap|2
COWGIRL|Ranch woman|Rodeo rider; Lasso twirler|1
CRICKET|Chirping insect|Bat-and-ball game; Jiminy ___|2|🦗
CUSTARD|Egg pudding|Flan, basically; ___ pie|2|🍮
DRESSER|Chest of drawers|Fashion plate; Sharp ___|1
FIREFLY|Glowing bug|Lightning bug; Summer glow|1
GARBAGE|Trash|Nonsense; ___ truck|1
GORILLA|Large ape|Silverback; 800-pound ___|1|🦍
HAIRCUT|Trim|Barber's work; Buzz, e.g.|1
HALIBUT|Flatfish|Large flatfish; Fish-and-chips|4
HICCUPS|Diaphragm spasms|Small setbacks; Hiccoughs; Geeku|1
HIGHWAY|Main road|Freeway; ___ robbery|1
JACKPOT|Big prize|Big win; Hit the ___|1
JASMINE|Fragrant flower|Tea flower; ___ rice|2
LADYBUG|Red spotted beetle|Spotted bug|1|🐞
LAUNDRY|Dirty clothes|Wash-day pile|1
MAMMOTH|Woolly elephant of old|Huge|2|🦣
MERMAID|Half-fish maiden|Sea siren|1
MINIVAN|Family vehicle|Soccer mom's ride|1
MONSOON|Seasonal rain wind|Big Asian downpour|3
MUSICAL|Show with songs|Melodic|1
NECKTIE|Office neckwear|Father's Day gift, often|1|👔
ORGANIC|Grown naturally|Farm-label word|2
PAJAMAS|Sleepwear|Bedtime outfit|1
PARSLEY|Garnish herb|Green garnish|2
PEACOCK|Bird with a showy tail|Show-off|1|🦚
PLAYPEN|Baby's enclosure|Toddler's corral|1
POTHOLE|Road crater|Bump in the road|1
QUARTZ|Common crystal mineral|Watch crystal|3
RACCOON|Masked animal|Trash bandit|1|🦝
RAVIOLI|Stuffed pasta|Pasta squares|1
SAPLING|Young tree|Sprout|2
SARDINE|Small canned fish|Packed fish|2
SHAMPOO|Hair soap|Hair wash|1
SHELTER|Refuge|Pet ___|1
SKATING|Gliding on ice|Rink activity|1|⛸️
SNORKEL|Swimmer's breathing tube|Reef-viewing tube|2|🤿
SPARROW|Small brown bird|Common bird|1
SPATULA|Flipping tool|Pancake turner|1
SUNRISE|Dawn|Morning's start|1|🌅
TADPOLE|Baby frog|Polliwog|1
TRACTOR|Farm vehicle|Plow puller|1|🚜
TREETOP|Highest branches|Bird's lookout|1
TWISTER|Tornado|Party game|2|🌪️
UKULELE|Hawaiian guitar|Small 4-string|2
VITAMIN|Daily pill|C or D|1
WARRIOR|Fighter|Battler|1
WETSUIT|Diver's rubber suit|Surfer's outfit|2
WHISTLE|Referee's tool|Blow a tune|1
# ---------- v06 additions (JM CD-11): 54 more easy 2-letter answers ----------
# Families that work worldwide: words and interjections, Greek letters, metric units, chemical symbols and
# common global abbreviations. No US state codes. Country and airport codes are NOT used as clues (under discussion).
# Words and interjections
OI|"Hey, you!" in Britain|Cockney shout for attention|1
AY|Yes vote, variant; Sailor's yes|___, there's the rub|1
OY|"___ vey!"|Yiddish groan|1
HO|"Land ___!"|"Westward ___!"; Santa's laugh|1
YE|"Hear ___! Hear ___!"|Olde "you"|1
QI|Life force in Chinese medicine|Tai chi energy|2
OD|Overdose|Have way too much of, in slang|2
OG|The original, in slang|Old-school pioneer, in slang|2
# Greek letters
MU|Greek M|Greek >Lambda|1
XI|Greek >Nu|Greek letter drawn as three stacked lines|1
# Metric units
CM|Centimeter|100th of a meter; Ruler mark|1
ML|Milliliter|Medicine-spoon unit|1
DL|Deciliter|10th of a liter; Down-low, slangily|2
KW|Kilowatt|Thousand watts; Power unit|1
HZ|Hertz|Radio-frequency; RF; Cycles / sec|2
DB|Decibel|Loudness unit; Sound-meter mark|1
KJ|Kilojoule|Food-energy unit; Label energy|2
MW|Megawatt|Power-plant output unit|2
NS|Nanosecond|Billionth of a second|2
# Chemical symbols
NA|Sodium|Half of table salt|1
LI|Lithium|Phone-battery metal|1
CL|Chlorine|Pool chemical; Bleach element|1
CR|Chromium|Shiny-bumper metal; Chrome element|2
NI|Nickel|Coin metal that sticks to magnets|1
CU|Copper|Wire metal; Penny element|1
ZN|Zinc|Sunscreen metal|1
AG|Silver; 2nd-place metal|Gold's kid brother; 2nd-place symbol|1
AU|Gold|1st-place metal; Gold medal symbol|1
HG|Mercury|Thermo metal; Element 80|2
SN|Tin|Tin-can metal|2
XE|Xenon|Bright-headlight gas|2
KR|Krypton|Superman's gas; Element 36|2
BR|Bromine|Red-brown element; Element 35|3
PU|Plutonium|Reactor fuel|2
# Common global abbreviations
CE|Common Era|Modern era, like AD; Year label|1
FC|Football Club|Soccer club|1
QR|___ code (scan it with a phone)|Square-barcode letters|1
UX|User experience|App designer's focus|2
QA|Quality assurance|Product testers' department|2
BP|Blood pressure|Nurse's cuff reading; Cuff reading|1
XP|Experience points, in games|Gamer's level-up points|1
PK|Penalty kick|Soccer spot shot|2
HT|Half-time|Mid-match break; Height, abbr.|2
NP|"No problem," in texts|"Don't mention it," in texts|1
BF|Boyfriend, in texts|Steady guy, in texts; Date-night guy|1
GF|Girlfriend, in texts|Steady gal, in texts; Date-night gal|1
SR|Senior|A Jr.'s father, often|1
EQ|Emotional IQ|IQ's feelings cousin; People smarts|2
VO|Voice-over|Unseen narrator's work|2
FR|Father, briefly|Priest's title; Padre, abbr.|1
CF|"Compare," in notes|Scholar's "see also"; Footnote word|3
HB|Middle pencil grade|No. 2 grade; Pencil letters|2
GT|Gran Turismo|Sports-car letters; Grand tourer|2
IR|Infrared|TV remote's beam; Heat light|2
# ---------- v07a additions (JM CD-13: 2.1–2.3, CD-17: 2.3.1, CD-18: 5.1) ----------
# Format adds an optional 6th field: the Challenge Levels where the clue set may be used ("2-4" = 2 to 4, "7" = 7 and up).
# A word that is already in the list gets an EXTRA clue set from these lines (one set is picked at random per grid).
# Country codes (web endings), Challenge Levels 2-4
AR|Argentina URL|Buenos Aires URL|2||2-4
AT|Austria URL|Vienna URL|2||2-4
AU|Australia URL|Sydney URL|2||2-4
BE|Belgium URL|Brussels URL; Waffle-land web|2||2-4
BR|Brazil URL|Rio URL; Samba-land web|2||2-4
CA|Canada URL|Toronto URL; Maple-leaf web|2||2-4
CH|Switzerland URL|Zurich URL; Alpine web|2||2-4
CL|Chile URL|Santiago URL; Andes web|2||2-4
CN|China URL|Beijing URL; Great Wall web|2||2-4
CO|Colombia URL|Bogota URL; Coffee-land web|2||2-4
CU|Cuba URL|Havana URL; Cigar-land web|2||2-4
CZ|Czechia URL|Prague URL; Bohemia web|2||2-4
DE|Germany URL|Berlin URL; Autobahn web|2||2-4
DK|Denmark URL|Copenhagen URL; Lego-land web|2||2-4
EG|Egypt URL|Cairo URL; Nile web tag|2||2-4
ES|Spain URL|Madrid URL; Flamenco web tag|2||2-4
FI|Finland URL|Helsinki URL; Sauna-land web|2||2-4
FR|France URL|Paris URL; Eiffel web|2||2-4
GR|Greece URL|Athens URL; Acropolis web|2||2-4
HK|Hong Kong URL|Kowloon URL; Dim sum web|2||2-4
HU|Hungary URL|Budapest URL; Danube web|2||2-4
ID|Indonesia URL|Jakarta URL; Bali web|2||2-4
IE|Ireland URL|Dublin URL; Emerald web|2||2-4
IL|Israel URL|Tel Aviv URL; Jaffa web|2||2-4
IN|India URL|Mumbai URL; Taj web|2||2-4
IS|Iceland URL|Reykjavik URL; Geyser web|2||2-4
IT|Italy URL|Rome URL; Pasta web|2||2-4
JM|Jamaica URL|Kingston URL; Reggae web|2||2-4
JP|Japan URL|Tokyo URL; Sushi web|2||2-4
KE|Kenya URL|Nairobi URL; Safari web|2||2-4
KR|South Korea URL|Seoul URL; K-pop web|2||2-4
MA|Morocco URL|Casablanca URL|2||2-4
MX|Mexico URL|Cancun URL|2||2-4
MY|Malaysia URL|Kuala Lumpur URL|2||2-4
NG|Nigeria URL|Lagos URL|2||2-4
NL|Netherlands URL|Amsterdam URL|2||2-4
NO|Norway URL|Oslo URL|2||2-4
NZ|New Zealand URL|Auckland URL|2||2-4
PE|Peru URL|Lima URL|2||2-4
PH|Philippines URL|Manila URL|2||2-4
PK|Pakistan URL|Karachi URL|2||2-4
PL|Poland URL|Warsaw URL|2||2-4
PT|Portugal URL|Lisbon URL|2||2-4
RO|Romania URL|Bucharest URL|2||2-4
RU|Russia URL|Moscow URL|2||2-4
SA|Saudi Arabia URL|Riyadh URL|2||2-4
SE|Sweden URL|Stockholm URL|2||2-4
SG|Singapore URL|Lion City URL|2||2-4
TH|Thailand URL|Bangkok URL|2||2-4
TR|Turkey URL|Istanbul URL|2||2-4
TW|Taiwan URL|Taipei URL|2||2-4
UA|Ukraine URL|Kyiv URL|2||2-4
UK|United Kingdom URL|London URL|2||2-4
VE|Venezuela URL|Caracas URL|2||2-4
VN|Vietnam URL|Hanoi URL|2||2-4
ZA|South Africa URL|Cape Town URL|2||2-4
AE|Emirates URL|Dubai URL|2||2-4
QA|Qatar URL|Doha URL|2||2-4
# Currency codes, Challenge Level 4 and up
USD|U.S. dollar's code|Greenback|3||4
EUR|EU money code|Rome money tag; Berlin cash code|3||4
GBP|British pound code|Sterling; UK's money; Royal coin; U.K. cash|3||4
JPY|Japanese yen code|Tokyo money; Japanese cash|3||4
CNY|Chinese yuan code|Beijing money; Renminbi tag|3||4
INR|Indian rupee code|Mumbai money; Indian cash|3||4
CAD|Canadian dollar code|Loonie; Maple money|3||4
AUD|Aussie dollar code|Aussie money; Money down under; G'day mate money|3||4
CHF|Swiss franc code|Zurich money; Alpine cash|3||4
MXN|Mexican peso's code|Peso|3||4
BRL|Brazil's money code|Rio money; Samba cash|3||4
KRW|Korean won code|Seoul money; Korean cash; We won|3||4
ZAR|S. African rand; Money in S. Africa; S. African currency|Rand; S. African cash|3||4
SEK|Swedish krona's code|Stockholm money|3||4
NOK|Norwegian krone's code|Oslo money|3||4
DKK|Danish krone code|Copenhagen money; Krone tag|3||4
NZD|New Zealand dollar's code|Kiwi money|3||4
SGD|Singapore dollar's code|Lion City money|3||4
HKD|Hong Kong cash code|Kowloon money; HK cash|3||4
TRY|Turkish lira's code|Istanbul money|3||4
THB|Thai baht's code|Bangkok money|3||4
PLN|Polish zloty's code|Warsaw money|3||4
AED|UAE dirham's code|Dubai money; Dubai cash|3||4
# Airport codes, Challenge Level 7 and up
LAX|Los Angeles airport code|Bag tag for Hollywood trips|4||7
JFK|New York airport|Queens trip tag; Big Apple gateway|4||7
LHR|London Heathrow code|Bag tag for Big Ben trips|4||7
CDG|Paris airport|Eiffel trip tag; Charles de Gaulle|4||7
ORD|Chicago O'Hare code|Bag tag for Windy City trips|4||7
ATL|Atlanta airport code|Busiest airport; Peachy planes|4||7
DFW|Dallas airport|Texas trip tag; Big D gateway|4||7
DEN|Denver airport|Mile High trip tag; Rockies gateway|4||7
SFO|San Francisco airport code|Bag tag for Golden Gate trips|4||7
SEA|Seattle airport code|Bag tag for Space Needle trips|4||7
MIA|Miami airport code|Bag tag for South Beach trips|4||7
BOS|Boston airport code|Logan, on a ticket; Pahk the cahr|4||7
LAS|Vegas airport code|Bag tag for Strip trips|4||7
MCO|Orlando airport code|Bag tag for theme-park trips|4||7
YYZ|Toronto airport code|Bag tag for CN Tower trips|4||7
YVR|Vancouver airport code|Bag tag for Stanley Park trips|4||7
MEX|Mexico City airport code|Bag tag for Aztec-capital trips|4||7
GRU|Sao Paulo airport|Brazil trip tag; Samba gateway|4||7
FRA|Frankfurt airport|DE bank city; German gate|4||7
AMS|Amsterdam airport|Canal-city gateway|4||7
MAD|Madrid airport code|Bag tag for Spanish-capital trips|4||7
FCO|Rome airport|Colosseum; Eternal City|4||7
MUC|Munich airport code|Bag tag for Oktoberfest trips|4||7
ZRH|Zurich airport code|Bag tag for Swiss banking trips|4||7
DUB|Dublin airport|Irish trip tag; Emerald Isle gateway|4||7
IST|Istanbul airport|Bosphorus trip tag; Turkish gateway|4||7
DXB|Dubai airport|Burj trip tag; Gulf gateway|4||7
DOH|Doha airport|Qatar trip tag; Gulf hub|4||7
SIN|Singapore airport code|Bag tag for Lion City trips|4||7
HKG|Hong Kong airport|Harbour trip tag; Kowloon gateway|4||7
NRT|Tokyo Narita code|Bag tag for Japan trips|4||7
ICN|Seoul airport|K-pop trip tag; Korea gateway|4||7
PEK|Beijing airport code|Bag tag for Forbidden City trips|4||7
SYD|Sydney airport code|Bag tag for Opera House trips|4||7
AKL|Auckland airport|Kiwi gateway; Sky Tower city|4||7
JNB|Johannesburg airport|Safari trip tag; Joburg gateway|4||7
CAI|Cairo airport|Pyramid trip tag; Nile gateway|4||7
DEL|Delhi airport|Taj Mahal trip tag; India gateway|4||7
BOM|Mumbai airport code|Bollywood gateway|4||7
# Element symbols (JM CD-17: 2.3.1): extra clue sets for existing words, plus a few new words
HE|Helium|Balloon gas; Element 2|1
NE|Neon|Glowing-sign gas|1
AL|Aluminum|Soda-can metal|1
AR|Argon|Light-bulb noble gas|2
CA|Calcium|Bone mineral; Milk mineral|1
CO|Cobalt|Blue-glass metal; Element 27|2
MG|Magnesium|Flare metal|2
MN|Manganese|Steel-hardening metal|3||4
PB|Lead|Old water-pipe metal|2
PT|Platinum|Precious-ring metal|2
SI|Silicon|Computer-chip element|1
TI|Titanium|Strong, light metal|2
BA|Barium|X-ray drink element; Element 56|3||4
RA|Radium|Curie's glowing element|2
PO|Polonium|Element named for Poland|3||4
CD|Cadmium|Old battery metal; Element 48|3||4
SE|Selenium|Element named for the moon|3||4
ND|Neodymium|Super-magnet metal|3||4
AM|Americium|Smoke-alarm element|3||4
CF|Californium|Golden State element; Element 98|3||4
MD|Mendelevium|Element named for the periodic table's creator|4||7
IR|Iridium|Rustproof metal; Element 77|3||4
SR|Strontium|Red-firework metal|3||4
AS|Arsenic|Old-mystery poison|2
BE|Beryllium|Emerald element; Element 4|3||4
OS|Osmium|Densest metal|3||4
IN|Indium|Touch-screen metal; Element 49|3||4
GA|Gallium|Melts-in-hand metal; Element 31|3||4
PD|Palladium|Car-converter metal|3||4
NO|Nobelium|Element named for Nobel|3||4
EU|Europium|Element 63; Continent element|3||4
CM|Curium|Curies' element; Element 96|3||4
BI|Bismuth|Stomach-remedy metal; Element 83|3||4
CS|Cesium|Atomic-clock element; Element 55|3||4
ES|Einsteinium|Element 99; Einstein's element|3||4
GE|Germanium|Transistor element; Element 32|3||4
TH|Thorium|Element named for the god of thunder|3||4
CN|Copernicium|Copernicus's element; Element 112|4||7
BK|Berkelium|Berkeley's element; Element 97|4||7
# ---------- v07b additions (JM CD-20: 3.4.6–3.4.8) ----------
# Chemistry both ways (a formula or symbol as the clue, the word as the answer), formula clues from Challenge Level 5
AMMONIA|Pungent cleaning gas; Cleaner chemical|Smelling-salt sniff|3
AMMONIA|NH3|Nitrogen + hydrogen|3||5
OXYGEN|Gas we breathe|Element number 8|1
OXYGEN|O2|Air's life-giving gas, chemically|2||5
METHANE|Natural gas|Swamp gas|3
METHANE|CH4|Cow-burp gas, chemically|3||5
COPPER|Wire metal|Penny metal; Police, slangily|1
COPPER|Cu|Element 29; Penny element|2||5
NEON|Glowing-sign gas|Las Vegas lights gas|1
NEON|Ne|Element 10|2||5
HELIUM|Balloon gas|Squeaky gas; Blimp filler|1
HELIUM|He|Element 2; Noble gas|2||5
SODIUM|Salt element|Partner of chlorine in salt|2
SODIUM|Na|Element 11|2||5
CARBON|Diamond element|Graphite element; ___ copy|1
CARBON|C|Element 6; Life's element|2||5
DRYICE|Frozen CO2|Stage-fog maker; Smoky punch maker|3
DRYICE|Solid CO2|Theater-fog block; Cooler chiller|3||5
NACL|Salt|Sodium chloride|3||5
SALT|NaCl|Sodium chloride|2||5
WATER|Two H's and an O|Wet compound|2||5
RUST|Fe2O3|Iron oxide|2||5
IRON|Fe|Element 26; Steel base|2||5
SILVER|Ag|Element 47|2||5
GOLD|Au|Element 79; Fort Knox metal|2||5
TIN|Sn|Element 50|2||5
LEAD|Pb|Element 82|2||5
ZINC|Zn|Element 30|3||5
# Synonym variants: the same answer with fresh wording (JM CD-20: 3.4.6)
TUNA|Large sea fish|Huge ocean swimmer|1
WHALE|Huge ocean mammal|Giant sea swimmer|1
SHARK|Sea predator|Toothy swimmer|1
ERR|Blunder|Make a boo-boo; Slip up|2
EVE|Prior night|Christmas ___; Night before|1
DIME|Ten pennies|Small silver coin; Roosevelt coin|1
DOLLAR|Hundred pennies|Buck; Washington bill|1
PENNY|One cent|Smallest U.S. coin|1
LION|Large cat|Jungle king|1
ELK|Large deer|Antlered giant; Moose kin|1
EMU|Large bird|Outback runner; Ostrich cousin|1
BOA|Large snake|Fluffy scarf; Constrictor|2
TOME|Large book|Hefty volume|4
TUBA|Large brass horn|Low oompah maker|1
INN|Little hotel|Roadside lodge; Coaching ___|1
POND|Little lake|Duck pool|1
CANOE|Little boat|Paddle craft; Camp boat|1
SIP|Tiny drink|Wee taste|1
DOT|Tiny spot|Period; Web address part|1
ANT|Small insect|Picnic pest|1
INCH|Tiny unit|Move slowly; ___worm|1
VIAL|Little bottle|Lab tube|3
CAMEO|Brief role|Walk-on part; Star's drop-in|3
OCEAN|Big sea|The deep blue|1
# ---------- Lexicon L09: JM's Copy Edits (CD-29: 1.8). Status ON-DECK = not in the games yet ----------
EXCITE|Energize; Thrill|Light one's fire; Get going|2||4
# ---------- KeyRing everyday words, tier 1, round 1 A-C (CD-100: 1.2.1; CD-101: 2.1-2.4). Drafts accepted, ACTIVE since L14.05 (CD-104) ----------
ABSENCE|Not being there|Missing day; AWOL state|1
ABUSE|Mistreat|Misuse; Name-calling|1
ACADEMIC|Scholarly|Professor; Moot, as a point|1
ACCEPT|Take willingly|Say yes to; Admit, as a fact|1
ACCEPTED|Taken willingly|Said yes to; Mainstream|1
ACCEPTS|Takes willingly|Says yes to; Allows in|1
ACCESS|Way in|Entry; Log in to|1
ACCORD|Agreement|Harmony; Honda model|1
ACCORDED|Granted|Gave; Agreed|1
ACCORDS|Agreements|Treaties; Grants|1
ACCOUNT|Report|Bank record; Story|1
ACCOUNTS|Reports|Bank records; Explains, with "for"|1
ACCURACY|Precision|Exactness; Bull's-eye skill|1
ACCURATE|Correct|Precise; On target|1
ACHIEVE|Accomplish|Reach; Attain a goal|1
ACHIEVED|Accomplished|Reached; Attained|1
ACHIEVES|Accomplishes|Reaches; Attains|1
ACQUIRE|Get|Obtain; Buy out|1
ACQUIRED|Gotten|Obtained; ___ taste|1
ACQUIRES|Gets|Obtains; Buys out|1
ACROSS|On the other side|Crossword direction; Over|1
ACTUAL|Real|Genuine; True to life|1
ACTUALLY|Really|In fact; Truth be told|1
ADEQUATE|Enough|Sufficient; Passable|1
ADJUST|Tweak|Fine-tune; Adapt|1
ADMITTED|Confessed|Let in; Owned up|1
ADVANCE|Move forward|Progress; Loan ahead of pay|1
ADVANCED|Moved forward|Progressed; Highly developed|1
ADVANCES|Moves forward|Progresses; Romantic passes|1
ADVISE|Counsel|Recommend; Inform|1
ADVISED|Counseled|Recommended; Well-___|1
ADVISES|Counsels|Recommends; Informs|1
ADVISING|Counseling|Recommending; Guiding|1
AFFAIR|Matter|Event; Fling|1
AFFAIRS|Matters|Business; State ___|1
AFFECT|Influence|Sway; Put on, as airs|1
AFFECTED|Influenced|Moved; Put-on, artificial|1
AFFECTS|Influences|Sways; Moves emotionally|1
AFFORD|Pay for|Manage; Provide|1
AFRAID|Scared|Fearful; Sorry to say|1
AGAINST|Opposed to|Leaning on; Versus|1
AGENCY|Firm|Bureau; Ad shop|1
ALIAS|Assumed name|AKA; Pen name|1
ALMOST|Nearly|Not quite; Close to|1
ALREADY|By now|So soon!; Even now|1
ALTHOUGH|Even though|Despite the fact; Yet|1
ALWAYS|Forever|Every time; Constantly|1
AMONG|In the midst of|Amid; Between several|1
AMOUNT|Quantity|Sum; Total|1
AMOUNTS|Quantities|Sums; Adds up, with "to"|1
AMUSE|Entertain|Tickle; Divert|1
AMUSED|Entertained|Tickled; Not ___ (miffed)|1
AMUSES|Entertains|Tickles; Diverts|1
AMUSING|Funny|Entertaining; Droll|1
ANALOG|Non-digital|Dial-faced; Vinyl, e.g.|1
ANALOGUE|Comparable thing|Parallel; Non-digital|1
ANALYSIS|Close study|Breakdown; Examination|1
ANCIENT|Very old|Antique; Of olden times|1
ANNOUNCE|Declare|Proclaim; Make public|1
ANNOY|Bother|Irk; Bug|1
ANNOYED|Bothered|Irked; Peeved|1
ANNOYING|Bothersome|Irksome; Pesky|1
ANNOYS|Bothers|Irks; Bugs|1
ANNUAL|Yearly|Plant that dies; Yearbook|1
ANOTHER|One more|Yet ___ day; A different one|1
ANYBODY|Any person|Whoever; Is ___ home?|1
ANYONE|Any person|Whoever; ___ for tennis?|1
ANYPLACE|Wherever|Any spot; Any old spot|1
ANYWAY|In any case|Regardless; Nevertheless|1
ANYWHERE|Wherever|Any old place; In all spots|1
APOLOGY|Saying sorry|Regret; Mea culpa|1
APPARENT|Obvious|Evident; Seeming|1
APPEAL|Charm|Plea; Higher court ask|1
APPEAR|Show up|Seem; Come into view|1
APPEARED|Showed up|Seemed; Came into view|1
APPEARS|Shows up|Seems; Comes into view|1
APPLIED|Put on|Used; Practical, as math|1
APPLIES|Puts on|Uses; Is relevant|1
APPLYING|Putting on|Using; Job hunting|1
APPROVAL|Okay|Consent; Thumbs-up|1
APPROVE|Okay|Endorse; Sign off on|1
APPROVED|Okayed|Endorsed; Signed off on|1
APPROVES|Okays|Endorses; Signs off on|1
ARGUING|Quarreling|Debating; Bickering|1
AROUND|About|Nearby; In circles|1
ARRANGE|Set up|Organize; Score, as music|1
ARRANGED|Set up|Organized; Scored, as music|1
ARRANGES|Sets up|Organizes; Scores, as music|1
ARRIVE|Get there|Come; Make it big|1
ARRIVED|Got there|Came; Made it big|1
ARRIVES|Gets there|Comes; Shows up|1
ARRIVING|Getting there|Pulling in; Due any minute|1
ARTICLE|News story|Item; "The" or "a"|1
ARTICLES|News stories|Items; Clauses|1
ASLEEP|Sleeping|Dozing; Numb, as a foot|1
ASPECT|Feature|Facet; Angle|1
ASPECTS|Features|Facets; Angles|1
ASSEMBLY|Gathering|Construction; School meeting|1
ASSUME|Suppose|Presume; Take on|1
ASSUMED|Supposed|Presumed; Fake, as a name|1
ASSUMES|Supposes|Presumes; Takes on|1
ASSUMING|Supposing|Presuming; Taking on|1
ASSURE|Promise|Guarantee; Put at ease|1
ASSURED|Promised|Confident; Certain|1
ASSURES|Promises|Guarantees; Puts at ease|1
ASSURING|Promising|Guaranteeing; Putting at ease|1
ATTACH|Fasten|Connect; Add to an email|1
ATTACHED|Fastened|Connected; Fond of|1
ATTEMPT|Try|Effort; Stab|1
ATTEMPTS|Tries|Efforts; Stabs|1
ATTEND|Be present at|Go to; Tend to|1
ATTENDED|Was present at|Went to; Tended to|1
ATTENDS|Is present at|Goes to; Tends to|1
ATTITUDE|Outlook|Mindset; Sass|1
ATTRACT|Draw in|Pull; Lure|1
AUDIENCE|Spectators|Crowd at a show; Royal meeting|1
AUTHOR|Writer|Novelist; Create|1
AUTHORS|Writers|Novelists; Creates|1
AVERAGE|Typical|Mean; Batting ___|1
AWFUL|Terrible|Dreadful; Very, informally|1
AWKWARD|Clumsy|Uncomfortable; Teen phase|1
BASING|Grounding|Founding; Rooting|1
BASIS|Foundation|Grounds; Footing|1
BECAME|Turned into|Grew; Suited|1
BECAUSE|Since|Due to; "Just ___!"|1
BECOME|Turn into|Grow; Suit|1
BECOMES|Turns into|Grows; Suits|1
BECOMING|Turning into|Flattering; Growing|1
BEEN|Existed|Has-___; Gone and come back|1
BEFORE|Earlier|Prior to; Ahead of|1
BEGAN|Started|Kicked off; Opened|1
BEGUN|Started|Under way; Let the games ___|1
BEHALF|Interest|On ___ of; Sake|1
BEHAVE|Act properly|Mind your manners; Conduct oneself|1
BEHAVIOR|Conduct|Manners; Actions|1
BEHIND|In back of|Late; Rear end|1
BELIEVE|Trust|Think; Have faith|1
BELIEVED|Trusted|Thought; Had faith|1
BELIEVES|Trusts|Thinks; Has faith|1
BELONG|Fit in|Be owned; Be a member|1
BELONGS|Fits in|Is owned; Is a member|1
BENEFIT|Advantage|Perk; Charity event|1
BENEFITS|Advantages|Perks; Helps|1
BESIDES|Also|In addition; Except for|1
BETTER|Improved|Superior; Gambler|1
BETTING|Wagering|Gambling; Laying odds|1
BETWEEN|In the middle|Amid two; Among|1
BEYOND|Past|Farther; Outside of|1
BIDDING|Offering|Auctioning; Command|1
BIGGER|Larger|Grander; More sizable|1
BIGGEST|Largest|Most major; Top-size|1
BINARY|Two-part|Ones and zeros; Base two|1
BINDING|Tying|Book spine; Obligatory|1
BINDS|Ties|Fixes; Jams|1
BIOLOGY|Life science|Lab class; Makeup|1
BITTEN|Nipped|Stung; Smitten|1
BIZARRE|Very strange|Off-the-wall; Weird|1
BLACK|Dark color|Ebony; In the ___ (profit)|1
BLOW|Puff|Hit; Squander|1
BODIES|Torsos|Groups; Celestial objects|1
BORNE|Carried|Endured; Shouldered|1
BORROW|Take on loan|Use for now; Ask for a cup|1
BORROWED|Took on loan|Used for now; Something ___|1
BORROWS|Takes on loan|Uses for now; Takes out|1
BOTHERED|Annoyed|Troubled; Hot and ___|1
BOTHERS|Annoys|Troubles; Pesters|1
BOTTOM|Base|Lowest point; Rock ___|1
BOUGHT|Purchased|Believed, slangily; Paid for|1
BOUND|Tied|Leap; Headed|1
BREACH|Break|Gap; Violation|1
BROKE|Shattered|Penniless; Went bust|1
BROKEN|Shattered|Out of order; Busted|1
BROUGHT|Carried along|Fetched; ___ up (raised)|1
BUDGET|Spending plan|Low-cost; Balance the ___|1
BUFFER|Cushion|Shield; Polisher|1
BUILT|Constructed|Made; Muscular|1
BULK|Mass|Size; Buy in ___|1
BULLETIN|Announcement|News flash; Notice|1
BURIED|Interred|Hidden; Swamped|1
BURIES|Inters|Hides; Covers|1
BYTE|Eight bits|Data unit; Mega- or giga- unit|1
BYTES|Data units|Groups of eight bits; Storage units|1
CAME|Arrived|Showed up; Approached|1
CAMPAIGN|Organized drive|Election run; Ad blitz|1
CANNOT|Is unable to|Won't be able; Must not|1
CAPABLE|Able|Skilled; Competent|1
CAPACITY|Volume|Role; Full house|1
CAPITAL|Main city|Money; Upper-case letter|1
CAREFUL|Cautious|Watchful; Prudent|1
CARRIED|Took along|Bore; Passed, as a vote|1
CARRIES|Takes along|Bears; Stocks|1
CASSETTE|Tape|Mixtape case; 80s audio|1
CATALOG|List|Mail-order book; Index|1
CATEGORY|Class|Group; Kind|1
CAUGHT|Grabbed|Nabbed; ___ red-handed|1
CAUSING|Bringing about|Creating; Producing|1
CEASE|Stop|End; ___ and desist|1
CENT|Penny|100th; Red ___|1
CENTER|Middle|Core; Hub|1
CENTRAL|Main|Middle; Grand ___|1
CENTURY|Hundred years|Age; 100-mile bike ride|1
CERTAIN|Sure|Definite; Particular|1
CHAIRMAN|Board head|Leader; Presiding officer|1
CHANGE|Alter|Coins; Switch|1
CHANGED|Altered|Different; Switched|1
CHANGES|Alters|Switches; Shifts|1
CHANGING|Altering|Switching; ___ room|1
CHANNEL|TV station|Strait; Route|1
CHANNELS|TV stations|Straits; Routes|1
CHAR|Scorch|Singe; Trout kin|1
CHARGE|Fee|Attack; Power up|1
CHARGED|Billed|Powered up; Accused|1
CHARGES|Fees|Attacks; Accusations|1
CHARGING|Billing|Powering up; Rushing|1
CHARS|Scorches|Code letters; Grills dark|1
CHEAPEST|Lowest-priced|Thriftiest; Bargain-bin best|1
CHEMICAL|Substance|Lab compound; Synthetic|1
CHOICE|Selection|Option; Top quality|1
CHOOSE|Pick|Select; Opt|1
CHOOSES|Picks|Selects; Opts|1
CHOOSING|Picking|Selecting; Opting|1
CHOSE|Picked|Selected; Opted|1
CHOSEN|Picked|Elected; The ___ One|1
CHURCH|Place of worship|Sunday service; Steeple site|1
CITIZEN|Resident|National; Voter|1
CLARIFY|Explain|Make clear; Clear up|1
CLEAREST|Most transparent|Plainest; Least cloudy|1
CLOSEST|Nearest|Dearest; Most like|1
CLOSING|Shutting|Ending; ___ time|1
COLLAPSE|Cave in|Fall down; Breakdown|1
COLLECT|Gather|Save up; Call ___|1
COLLECTS|Gathers|Saves up; Picks up|1
COLLEGE|University|School; ___ try|1
COLLEGES|Universities|Schools; Campuses|1
COLUMN|Pillar|Newspaper piece; Vertical line|1
COMBINE|Join|Blend; Farm harvester|1
COMBINED|Joined|Blended; Total|1
COMBINES|Joins|Blends; Harvesters|1
COME|Arrive|Approach; ___ again?|1
COMES|Arrives|Approaches; Happens|1
COMING|Arriving|Approaching; Up next|1
COMMAND|Order|Control; Mastery|1
COMMANDS|Orders|Controls; Directs|1
COMMENT|Remark|Note; No ___|1
COMMENTS|Remarks|Notes; Feedback|1
COMMON|Ordinary|Shared; Town green|1
COMMONLY|Usually|Often; Generally|1
COMPANY|Business|Guests; Army unit|1
COMPARE|Liken|Contrast; Weigh|1
COMPARED|Likened|Contrasted; Weighed|1
COMPARES|Likens|Contrasts; Weighs|1
COMPILER|Code translator|Programmer's tool; Anthology maker|1
COMPLAIN|Gripe|Grumble; Whine|1
COMPLEX|Intricate|Building group; Hang-up|1
COMPOSE|Write|Create; Calm|1
COMPOSED|Wrote|Calm; Made up of|1
COMPOSES|Writes|Creates; Calms|1
COMPUTE|Calculate|Figure; Make sense|1
COMPUTED|Calculated|Figured; Tallied|1
COMPUTES|Calculates|Figures; Adds up|1
CONCEPT|Idea|Notion; Theory|1
CONCERN|Worry|Business; Matter|1
CONCERNS|Worries|Matters; Is about|1
CONFIRM|Verify|Prove; Ratify|1
CONFIRMS|Verifies|Proves; Ratifies|1
CONFUSE|Puzzle|Baffle; Mix up|1
CONFUSED|Puzzled|Baffled; Mixed up|1
CONFUSES|Puzzles|Baffles; Mixes up|1
CONNECT|Join|Link; Relate|1
CONNECTS|Joins|Links; Relates|1
CONSIDER|Think about|Ponder; Regard|1
CONSIST|Be made up|Comprise; Lie, with "in"|1
CONSISTS|Is made up|Comprises; Lies, with "in"|1
CONSTANT|Steady|Unchanging; Fixed value|1
CONTACT|Touch|Reach out; Connection|1
CONTAIN|Hold|Include; Restrain|1
CONTAINS|Holds|Includes; Restrains|1
CONTENT|Satisfied|Substance; Matter|1
CONTENTS|Insides|Table of ___; Components|1
CONTEXT|Setting|Background; Circumstances|1
CONTINUE|Keep going|Carry on; Resume|1
CONTRARY|Opposite|Stubborn; On the ___|1
CONTRAST|Difference|Compare; Screen setting|1
CONTROL|Command|Manage; Self-___|1
CONTROLS|Commands|Manages; Dashboard knobs|1
CONVERT|Change|Transform; New believer|1
CONVINCE|Persuade|Win over; Sway|1
COPIED|Duplicated|Imitated; Cc'd|1
COPIES|Duplicates|Imitates; Prints|1
CORNERS|Angles|Nooks; Traps|1
CORRECT|Right|Accurate; Fix|1
CORRECTS|Fixes|Amends; Grades|1
CORRUPT|Dishonest|Crooked; Damage, as a file|1
CORRUPTS|Taints|Spoils; Damages, as files|1
COULD|Was able to|Might; ___ be|1
COUNCIL|Board|Committee; City ___|1
COUNTY|Region|Shire; ___ fair|1
COUPLE|Pair|Twosome; A few|1
COURSE|Route|Class; Meal part|1
COURSES|Routes|Classes; Meal parts|1
CREATE|Make|Invent; Produce|1
CREATED|Made|Invented; Produced|1
CREATES|Makes|Invents; Produces|1
CREATING|Making|Inventing; Producing|1
CREATION|Invention|Work; The world|1
CREATURE|Being|Animal; ___ comforts|1
CREDIT|Recognition|Loan trust; ___ card|1
CRISIS|Emergency|Turning point; Midlife ___|1
CROSS|Go over|Angry; Hybrid|1
CULTURE|Arts|Customs; Lab growth|1
CURIOUS|Inquisitive|Odd; ___ George|1
CURRENT|Present|Flow; Up-to-date|1
CURSOR|Blinking marker|Screen pointer; Mouse arrow|1
CUSTOMER|Buyer|Client; Shopper|1
CUTTING|Slicing|Sharp, as a remark; Plant start|1
# ---------- KeyRing everyday words, tier 1, round 2 D-H (CD-104: 2.3). Drafts accepted, ACTIVE since L14.07 (CD-108) ----------
DAMAGE|Harm|Injury; Cost, slangily|1
DAMAGED|Harmed|Hurt; Dinged; Marred; ___ Goods|1
DAMAGES|Harms|Court award; Injures; Injuries|1
DAMAGING|Harmful|Hurtful; Ruinous|1
DATABASE|Records store|Info bank; SQL home; DBMS|1
DATING|Going out|Courting; Carbon ___|1
DATUM|Single fact|Data point; Given|1
DEAD|Lifeless|Exhausted; ___ end; No energy|1
DEATH|End of life|Demise; Grim Reaper; Decease|1
DEBATE|Argue|Discussion; Face-off; O&R|1
DECADE|Ten years|The '80s, e.g.; 10% Century|1
DECENT|Proper|Respectable; Fairly good; Acceptable; OK|1
DECIDE|Settle|Choose; Conclude|1
DECIDED|Settled|Chose; Clear-cut|1
DECIDES|Settles|Chooses; Rules|1
DECIDING|Settling|Choosing; ___ vote|1
DECLARE|Announce|State; Customs-form verb|1
DECLARED|Announced|Stated; Official|1
DECLARES|Announces|States; Proclaims|1
DECREASE|Reduce|Drop; Dwindle|1
DEDICATE|Devote|Commit; Book Credit|1
DEDUCE|Infer|Figure out; Sherlock's skill|1
DEEM|Judge|Consider; Regard as|1
DEEMED|Judged|Considered; Regarded as|1
DEEMING|Judging|Considering; Regarding|1
DEEMS|Judges|Considers; Regards as|1
DEFAULT|Preset|Standard; Fail to pay|1
DEFENSE|Protection|Guard; Not offense|1
DEFINE|Explain|Spell out; Outline|1
DEFINED|Explained|Spelled out; Clear-cut|1
DEFINES|Explains|Spells out; Outlines|1
DEFINING|Explaining|Spelling out; Meaningful; Important|1
DEFINITE|Certain|Sure; Clear-cut; Specific|1
DEGREE|Level|Diploma; Celsius; Fahrenheit|1
DEGREES|Levels|Diplomas; °C units; °F units|1
DELETE|Erase|Remove; Backspace's job|1
DELETED|Erased|Removed; Cut|1
DELETES|Erases|Removes; Cuts|1
DELETING|Erasing|Removing; Cutting|1
DELIVER|Bring|Hand over; Give; Present|1
DELIVERS|Brings|Hands over; Comes through|1
DELIVERY|Drop-off|Shipment; Birth; Package|1
DEMAND|Insist on|Call for; Supply's partner; Need; Order; Require|1
DEMANDS|Insists on|Calls for; Needs; Orders; Requires|1
DEPEND|Rely|Count on; Hinge|1
DEPENDED|Relied|Counted on; Hinged|1
DEPENDS|Relies|Counts on; "It ___"|1
DERIVE|Draw|Get from; Trace back|1
DERIVED|Drew|Got from; Secondhand|1
DERIVES|Draws|Gets from; Stems|1
DERIVING|Drawing|Getting from; Stemming|1
DESCRIBE|Portray|Depict; Spell out|1
DESIGN|Plan|Layout; Draft|1
DESIGNED|Planned|Laid out; Intended|1
DESIGNS|Plans|Layouts; Schemes|1
DESIRE|Want|Longing; Crave|1
DESIRED|Wanted|Longed for; Sought|1
DESIRES|Wants|Longings; Craves|1
DESIRING|Wanting|Longing for; Craving|1
DESPITE|In spite of|Even with; Regardless of|1
DESTROY|Wreck|Ruin; Demolish|1
DESTROYS|Wrecks|Ruins; Demolishes|1
DETAIL|Particular|Fine point; Car wash job|1
DETAILED|Thorough|In-depth; Itemized|1
DETAILS|Particulars|Fine points; Specifics|1
DETECT|Notice|Spot; Sense|1
DETECTED|Noticed|Spotted; Sensed|1
DETECTS|Notices|Spots; Senses|1
DEVELOP|Grow|Evolve; Process; Create|1
DEVELOPS|Grows|Evolves; Builds|1
DEVICE|Gadget|Tool; Scheme|1
DEVICES|Gadgets|Tools; To one's own ___|1
DEVOTE|Dedicate|Commit; Give, as time|1
DEVOTED|Dedicated|Loyal; Committed|1
DEVOTES|Dedicates|Commits; Gives|1
DEVOTING|Dedicating|Committing; Giving|1
DID|Performed|Carried out; Pulled off|1
DIE|Pass away|Cube with dots; Expire|1
DIED|Passed away|Expired; Faded out|1
DIES|Passes away|Expires; Fades out|1
DIFFER|Disagree|Vary; Beg to ___|1
DIGIT|Number|Finger; Toe|1
DIGITAL|Electronic|Not analog; Online|1
DIGITS|Numbers|Fingers; Phone #, slang|1
DIRECT|Straight|Steer; Run, as a film|1
DIRECTED|Steered|Led; Ran, as a film|1
DIRECTLY|Straight|Right away; Head-on|1
DIRECTOR|Film boss|Manager; Board member|1
DIRECTS|Steers|Leads; Runs, as a film|1
DISAGREE|Differ|Argue; Beg to differ|1
DISASTER|Catastrophe|Calamity; Fiasco|1
DISC|Round plate|Frisbee; Back cushion|1
DISCOUNT|Markdown|Sale price; Dismiss|1
DISCS|Round plates|CDs; Spine cushions|1
DISCUSS|Talk over|Debate; Go over|1
DISK|Platter|HDD part; Round plate|1
DISLIKE|Distaste|Aversion; Thumbs-down|1
DISPLAY|Show|Exhibit; Screen|1
DISPLAYS|Shows|Exhibits; Screens|1
DISTANT|Far|Remote; Aloof|1
DISTINCT|Clear|Separate; Unmistakable|1
DISTRICT|Area|Zone; School ___|1
DISTURB|Bother|Interrupt; Do not ___|1
DISTURBS|Bothers|Interrupts; Unsettles|1
DIVIDE|Split|Separate; Long ___|1
DIVIDED|Split|Separated; Torn|1
DIVIDES|Splits|Separates; Rifts|1
DIVIDING|Splitting|Separating; ___ line|1
DIVISION|Split|Department; Math operation|1
DOCUMENT|Paper|File; Record|1
DOING|Performing|Up to; What're you ___?|1
DOMAIN|Realm|Territory; Web address|1
DONE|Finished|Over; Well-___|1
DOUBLE|Twice|Twin; Look-alike|1
DOUBT|Uncertainty|Question|1
DOUBTFUL|Unlikely|Iffy; Skeptical|1
DRASTIC|Extreme|Severe; Radical|1
DRAWN|Sketched|Pulled; Haggard|1
DREW|Sketched|Pulled; Attracted|1
DRIVEN|Motivated|Ambitious; Steered|1
DRIVERS|Motorists|Golf clubs; Software aids; Chauffeurs; Taxi owners|1
DRIVING|Steering|Motoring; Pounding, as rain|1
DROP|Fall|Drip; Let go|1
DROPPED|Fell|Let go; Quit|1
DROPPING|Falling|Letting go; Name-___|1
DROPS|Falls|Drips; Eye ___|1
DROVE|Steered|Herd; Motored|1
DUBIOUS|Doubtful|Fishy; Iffy|1
DUMB|Silly|Mute, old-style; ___ luck|1
DUMP|Unload|Junkyard; Ditch|1
DURING|Throughout|In the course of; While|1
DYING|Expiring|Fading; ___ to know|1
EARLIER|Before|Sooner; Previously|1
EARLIEST|1st|Soonest; Oldest|1
EASIER|Simpler|Less hard; Smoother|1
EASIEST|Simplest|Least hard; Smoothest|1
EATEN|Consumed|Devoured; Dined on|1
ECONOMIC|Financial|Fiscal; Money-related|1
ECONOMY|Thrift|Coach class; Market system|1
EDITION|Version|Issue; Printing|1
EFFECT|Result|Impact; Special ___|1
EFFECTS|Results|Belongings; Special ___|1
EFFORT|Try|Attempt; Elbow grease|1
EFFORTS|Tries|Attempts; Labors|1
EITHER|One or the other|Each; Me ___|1
ELECT|Choose|Vote in; President-___|1
ELECTED|Chosen|Voted in; In office|1
ELECTING|Choosing|Voting in; Picking|1
ELECTION|Vote|Poll; Ballot day|1
ELECTRIC|Powered|Thrilling; ___ guitar|1
ELECTS|Chooses|Votes in; Picks|1
ELEVATOR|Lift|Floor-to-floor ride; ___ music; Raiser; U.K lift; Not escalator; Skips stairs|1
EMPHASIS|Stress|Importance; Italics|1
EMPLOYEE|Worker|Staffer; Hire|1
ENABLE|Allow|Empower; Switch on|1
ENABLES|Allows|Empowers; Switches on|1
ENORMOUS|Huge|Gigantic; Massive|1
ENOUGH|Sufficient|Plenty; ___ already!|1
ENSURE|Make sure|Guarantee; Secure|1
ENSURED|Made sure|Guaranteed; Secured|1
ENSURES|Makes sure|Guarantees; Secures|1
ENSURING|Making sure|Guaranteeing; Securing|1
ENTIRE|Whole|Complete; Full|1
ENTIRELY|Wholly|Completely; Fully|1
ENTITLE|Name|Authorize; Give a right|1
ENTITLED|Named|Deserving; Spoiled|1
ENTITLES|Names|Authorizes; Gives a right|1
ENTITY|Being|Thing; Organization|1
ENTRANCE|Way in|Door; Captivate|1
ENTRIES|Submissions|Records; Contestants|1
ESTIMATE|Guess|Ballpark figure; Quote; RFQ|1
EVERY|Each|All; ___ which way|1
EVIDENCE|Proof|Clues; Exhibit A|1
EXAMINE|Inspect|Study; Check over|1
EXAMINED|Inspected|Studied; Checked over|1
EXAMINES|Inspects|Studies; Checks over|1
EXAMPLE|Instance|Model; For ___|1
EXAMPLES|Instances|Models; Samples|1
EXCEPT|But|Excluding; Leave out|1
EXCESS|Surplus|Too much; Overkill|1
EXCHANGE|Swap|Trade; Stock ___|1
EXCLUDE|Leave out|Omit; Bar|1
EXCLUDED|Left out|Omitted; Barred|1
EXCLUDES|Leaves out|Omits; Bars|1
EXCUSE|Pardon|Alibi; Reason|1
EXECUTE|Carry out|Perform; Run, as code|1
EXECUTED|Carried out|Performed; Ran, as code|1
EXECUTES|Carries out|Performs; Runs, as code|1
EXIST|Be|Live; Survive|1
EXISTED|Was|Lived; Survived|1
EXISTING|Current|Present; Living|1
EXISTS|Is|Lives; Survives|1
EXPAND|Grow|Enlarge; Swell|1
EXPANDED|Grew|Enlarged; Swelled|1
EXPANDS|Grows|Enlarges; Swells|1
EXPECT|Anticipate|Await; Count on|1
EXPECTED|Anticipated|Due; Predicted|1
EXPECTS|Anticipates|Awaits; Counts on|1
EXPENSE|Cost|Outlay; At the ___ of|1
EXPERT|Specialist|Pro; Skilled|1
EXPERTS|Specialists|Pros; Authorities|1
EXPLAIN|Clarify|Spell out; Account for|1
EXPLAINS|Clarifies|Spells out; Accounts for|1
EXPLICIT|Clear|Spelled out; Graphic|1
EXPRESS|State|Nonstop; Pony ___|1
EXTEND|Stretch|Lengthen; Offer|1
EXTENDED|Stretched|Lengthened; Long|1
EXTENDS|Stretches|Lengthens; Offers|1
EXTENT|Scope|Range; Degree|1
EXTERNAL|Outside|Outer; Outward|1
EXTRACT|Remove|Pull out; Vanilla ___|1
EXTREME|Utmost|Radical; ___ sports|1
FACILITY|Building|Ease; Plant|1
FACTOR|Element|Ingredient; X ___|1
FACTORS|Elements|Considerations; Ingredients|1
FAILURE|Flop|Dud; Breakdown|1
FALLEN|Dropped|Toppled; Slain|1
FARTHER|More distant|Beyond; Further|1
FARTHEST|Most distant|Remotest; Furthest|1
FASTEST|Quickest|Speediest; Swiftest|1
FATAL|Deadly|Lethal; ___ flaw|1
FAULT|Blame|Flaw; San Andreas ___|1
FAULTS|Blames|Flaws; Quake lines|1
FAVOR|Kindness|Prefer; Party ___|1
FAVORITE|Preferred|Pet; Front-runner|1
FEASIBLE|Doable|Workable; Viable|1
FEATURE|Trait|Characteristic; Main film|1
FEATURES|Traits|Face parts; Stars|1
FEDERAL|National|U.S. gov't; Make a ___ case; FedEx; National|1
FEEDBACK|Response|Comments; Mic squeal|1
FELL|Dropped|Tumbled; Cut down a tree|1
FELT|Sensed|Touched; Hat fabric|1
FEWEST|Least|Smallest number; Scarcest|1
FIGURE|Shape|Number; Think|1
FIGURES|Shapes|Numbers; Thinks|1
FILING|Paperwork|Nail smoothing; Tax ___|1
FINISH|End|Complete; Surface coat|1
FINISHED|Ended|Done; Polished|1
FINISHES|Ends|Completes; Coatings|1
FINITE|Limited|Bounded; Not endless|1
FIRST|Earliest|Initial; ___ place|1
FIRSTLY|To begin with|For one; At the outset|1
FISCAL|Financial|Budgetary; ___ year|1
FITTED|Tailored|Snug; Equipped|1
FITTING|Suitable|Apt; Tailor's session; Appropriate|1
FIVE|Number after four|Quintet; High ___; >4; <6|1
FLAVOR|Taste|Savor; Ice cream choice; Essence|1
FLEXIBLE|Bendable|Adaptable; Supple|1
FLIED|Hit a pop-up|___ out; Batted high|1
FLIES|Soars|Insects; Zippers|1
FLIGHT|Air trip|Escape; Stairway|1
FLOWN|Soared|Gone by air; Fled|1
FOLLOW|Go after|Trail; Understand|1
FOLLOWED|Went after|Trailed; Understood|1
FOLLOWS|Goes after|Trails; Ensues|1
FORCING|Compelling|Pushing; Prying|1
FOREIGN|Alien|Overseas; ___ language|1
FORGET|Not recall|Overlook; ___ about it|1
FORGETS|Doesn't recall|Overlooks; Leaves behind|1
FORGOT|Didn't recall|Overlooked; Left behind|1
FORMAL|Official|Dressy; Black-tie|1
FORMAT|Layout|Arrangement; Wipe a disk|1
FORTH|Forward|Onward; Back and ___|1
FORTUNE|Luck|Wealth; Cookie message|1
FORWARD|Ahead|Onward; Pass along|1
FOURTH|Quarter|After 3rd; ___ of July|1
FRENCH|Of France|Paris speaks; ___ fries; Paris country|1
FREQUENT|Common|Often; Haunt|1
FRIES|Cooks in oil|Spuds; Burger side|1
FROM|Out of|Starting at; Sent by|1
FULLY|Completely|Wholly; Entirely|1
FUNCTION|Purpose|Role; Gala|1
FURTHER|More|Additional; Farther|1
FURTHEST|Most distant|Remotest; Farthest|1
FUTURE|What's ahead|Tomorrow; Back to the ___|1
GASOLINE|Fuel|Gas; Petrol|1
GATHER|Collect|Assemble; Infer|1
GAVE|Donated|Handed; Presented|1
GENERAL|Overall|Army officer; Broad|1
GENERATE|Produce|Create; Make|1
GENUINE|Real|Authentic; Sincere|1
GETTING|Obtaining|Receiving; Becoming|1
GIVEN|Granted|Fact; Presented|1
GIVING|Generous|Donating; Handing|1
GOES|Leaves|Departs; Works|1
GOING|Leaving|Departing; Rate|1
GOTTEN|Obtained|Received; Become|1
GOVERNOR|State head|Ruler; Speed limiter|1
GRADUATE|Alum|Finish school; Pass on|1
GRANT|Give|Allow; Scholarship|1
GRANTED|Given|Allowed; Admittedly|1
GRANTING|Giving|Allowing; Conceding|1
GRANTS|Gives|Allows; Funds|1
GRAPH|Chart|Plot; Bar ___|1
GRAPHIC|Vivid|Explicit; Image|1
GRAPHICS|Images|Visuals; Artwork|1
GREATEST|Best|Finest; G.O.A.T.|1
GREW|Got bigger|Raised; Sprouted|1
GRINDING|Crushing|Tedious; Teeth ___|1
GRINDS|Crushes|Mills; Daily ___|1
GROSS|Disgusting|Yucky; Twelve dozen|1
GROSSES|Earns|$ takes in; Box-office $|1
GROUND|Earth|Soil; Milled|1
GROUNDS|Reasons|Coffee dregs; Campus|1
GROWN|Adult|Raised; Mature|1
GROWTH|Increase|Expansion; Spurt|1
HACK|Chop|Cabbie; Break in|1
HANDLE|Grip|Knob; Manage|1
HANDLED|Managed|Dealt with; Touched|1
HANDLES|Manages|Grips; Knobs|1
HANDLING|Managing|Treatment; Shipping and ___|1
HANDY|Useful|Nearby; Skilled|1
HAPPEN|Occur|Take place; Come about|1
HAPPENS|Occurs|Takes place; Stuff ___|1
HARDEST|Toughest|Most difficult; Firmest|1
HARMFUL|Damaging|Hurtful; Toxic|1
HARMLESS|Safe|Innocent; Gentle|1
HAVE|Own|Possess; Hold|1
HAVING|Owning|Possessing; Eating|1
HEALTH|Wellness|Fitness; Wealth's partner|1
HEAVILY|Weightily|Densely; A lot|1
HELD|Gripped|Owned; Detained|1
HELPFUL|Useful|Handy; Kind|1
HENCE|Therefore|Thus; From now|1
HERE|In this spot|Present!; Roll-call answer|1
HEREBY|By this|Thus; Formally now|1
HERSELF|She alone|By ___; In person|1
HES|He is|He has; ___ the one|1
HIGHEST|Tallest|Top; Loftiest|1
HIMSELF|He alone|By ___; In person|1
HITTING|Striking|Batting; Smacking|1
HORRIBLE|Awful|Dreadful; Terrible|1
HOWEVER|But|Yet; In any way|1
HUNG|Suspended|Draped; ___ up|1
HUSBAND|Spouse|Groom; Not wife; non-wife|1
# ---------- KeyRing everyday words, tier 1, round 3 I-P (CD-108: 2.1.1). Drafts accepted, ACTIVE since L14.09 (CD-127) ----------
IDENTIFY|Recognize|Name; Pick out|1
IDENTITY|Who you are|Self; ID theft target|1
IGNORE|Disregard|Overlook; Snub|1
IGNORED|Disregarded|Overlooked; Snubbed|1
IGNORES|Disregards|Overlooks; Snubs|1
IGNORING|Disregarding|Overlooking; Snubbing|1
ILLEGAL|Unlawful|Against the law; Banned|1
IMAGINE|Picture|Dream up; Lennon song|1
IMPACT|Effect|Collision; Make an ___|1
IMPLIED|Suggested|Hinted; Unspoken|1
IMPLIES|Suggests|Hints; Means|1
IMPLYING|Suggesting|Hinting; Meaning|1
IMPOSE|Force on|Levy; Intrude|1
IMPOSED|Forced on|Levied; Intruded|1
IMPOSES|Forces on|Levies; Intrudes|1
IMPOSING|Forcing on|Grand; Towering|1
IMPROVE|Get better|Upgrade; Refine|1
IMPROVED|Got better|Upgraded; New and ___|1
IMPROVES|Gets better|Upgrades; Refines|1
INCIDENT|Event|Episode; Mishap|1
INCLINE|Slope|Ramp; Lean|1
INCLINED|Sloped|Apt; Leaning|1
INCLINES|Slopes|Ramps; Leans|1
INCLUDE|Contain|Count in; Add|1
INCLUDED|Contained|Counted in; Added|1
INCLUDES|Contains|Counts in; Adds|1
INCOME|Earnings|Pay; ___ tax|1
INDEED|Truly|Yes, really; Certainly|1
INDICATE|Show|Signal; Point out|1
INDUSTRY|Business|Trade; Hard work|1
INFERIOR|Lesser|2nd-rate; Subpar|1
INFINITE|Endless|Limitless; Boundless|1
INFO|Facts, briefly|Data; Need-to-know stuff|1
INFORM|Tell|Notify; Brief|1
INFORMED|Told|Notified; Well-read|1
INFORMS|Tells|Notifies; Briefs|1
INITIAL|1st|Opening; Sign briefly|1
INITIALS|1st letters|Monogram; JFK, e.g.|1
INNOCENT|Not guilty|Naive; Blameless|1
INPUTTED|Entered|Typed in; Keyed|1
INSERT|Put in|Add; Slip in|1
INSERTED|Put in|Added; Slipped in|1
INSERTS|Puts in|Adds; Flyers|1
INSIDE|Within|Indoors; ___ joke|1
INSIST|Demand|Stand firm; Urge|1
INSISTED|Demanded|Stood firm; Urged|1
INSISTS|Demands|Stands firm; Urges|1
INSTALL|Set up|Put in; Load, as an app|1
INSTALLS|Sets up|Puts in; Loads|1
INSTANT|Moment|Immediate; ___ coffee|1
INSTEAD|Rather|In place; As an alternative|1
INTEGER|Whole number|Digit set; Not a fraction|1
INTEGERS|Whole numbers|Counting numbers; Math set|1
INTEGRAL|Essential|Key; Calculus term|1
INTEND|Plan|Mean; Aim|1
INTENDED|Planned|Meant; Fiancé(e)|1
INTENDS|Plans|Means; Aims|1
INTERACT|Engage|Mix; Connect|1
INTERNAL|Inside|Inner; In-house|1
INTERVAL|Gap|Break; Musical step|1
INVALID|Not valid|Void; Null|1
INVENT|Create|Devise; Make up|1
INVENTED|Created|Devised; Made up|1
INVENTS|Creates|Devises; Makes up|1
INVITE|Ask over|Welcome; Request|1
INVITED|Asked over|Welcomed; On the list|1
INVITES|Asks over|Welcomes; Party cards|1
INVITING|Appealing|Tempting; Asking over|1
INVOLVE|Include|Entail; Draw in|1
INVOLVED|Included|Complex; Engaged|1
INVOLVES|Includes|Entails; Draws in|1
IRRITATE|Annoy|Bug; Chafe|1
ISOLATE|Separate|Cut off; Quarantine|1
ISOLATED|Separated|Remote; Alone|1
ISOLATES|Separates|Cuts off; Quarantines|1
ISSUING|Handing out|Releasing; Putting out|1
ITSELF|On its own|By ___; In ___|1
JUDGMENT|Verdict|Good sense; Ruling|1
JUNK|Trash|Clutter; ___ food|1
JUSTIFY|Defend|Explain; Line up text|1
KEPT|Held|Saved; Retained|1
KILL|Slay|Stop, as an engine; Make a ___|1
KILLED|Slew|Shut off; Vetoed|1
KILLING|Slaying|Big profit; Hilarious|1
KILLS|Slays|Turns off; Wows|1
KNEW|Understood|Was aware; Recognized|1
KNOWN|Familiar|Famous; Recognized|1
LABOR|Work|Toil; ___ Day|1
LACK|Shortage|Need; Be without|1
LACKED|Needed|Was without; Missed|1
LACKING|Missing|Short of; Wanting|1
LACKS|Needs|Is without; Misses|1
LADIES|Women|Gals; ___ and gentlemen|1
LAIN|Rested|Reclined; Stayed in bed|1
LARGEST|Biggest|Most massive; Top size|1
LATEST|Newest|Most recent; At the ___|1
LAYOUT|Arrangement|Design; Floor plan|1
LEACH|Drain away|Seep out; Filter|1
LEAVING|Departing|Going; Exiting|1
LECTURE|Talk|Speech; Scold|1
LECTURES|Talks|Speeches; Scolds|1
LEGAL|Lawful|Allowed; ___ pad|1
LEGALLY|Lawfully|By law; Officially|1
LENGTH|Distance|Span; Duration|1
LETTING|Allowing|Permitting; Renting out|1
LIABLE|Responsible|Likely; Accountable|1
LIFETIME|Life span|All one's days; Once in a ___|1
LIKEWISE|Also|Same here; Ditto|1
LIKING|Fondness|Taste; Soft spot|1
LINEAR|Straight|In a line; Step-by-step|1
LISTEN|Hear|Pay attention; Lend an ear|1
LITTLE|Small|Tiny; ___ League|1
LIVING|Alive|Livelihood; Cost of ___|1
LOCATION|Place|Spot; Site|1
LOGGED|Recorded|Noted; Chopped trees|1
LOGGING|Recording|Tree cutting; Noting|1
LOGICAL|Reasonable|Rational; Makes sense|1
LONGEST|Most lengthy|Farthest; Day in June|1
LORRIES|Trucks, in UK|Big rigs; Haulers|1
LORRY|Truck, in UK|Big rig; Hauler|1
LOSING|Being beaten|Misplacing; ___ streak|1
LOWEST|Least|Bottom; Rock-bottom|1
LYING|Resting|Fibbing; Reclining|1
MAINTAIN|Keep up|Uphold; Claim|1
MAJORITY|Most|Bulk; Voting edge|1
MAKING|Creating|Building; In the ___|1
MANAGE|Run|Handle; Cope|1
MANAGED|Ran|Handled; Coped|1
MANAGER|Boss|Supervisor; Team skipper|1
MANAGES|Runs|Handles; Copes|1
MANAGING|Running|Handling; Coping|1
MANNER|Way|Style; Bedside ___|1
MANUAL|By hand|Handbook; Stick shift|1
MANUALS|Handbooks|Guides; How-to books|1
MARRIAGE|Wedlock|Union; Wedding|1
MARRY|Wed|Tie the knot; Unite|1
MASSIVE|Huge|Enormous; Hefty|1
MATTER|Substance|Issue; What's the ___?|1
MATTERS|Issues|Counts; Affairs|1
MAXIMUM|Most|Top limit; To the max|1
MAYBE|Perhaps|Possibly; Could be|1
MEANINGS|Senses|Definitions; Significance|1
MEANT|Intended|Signified; Destined|1
MEASURE|Gauge|Size up; Step|1
MEASURED|Gauged|Careful; Sized up|1
MEASURES|Gauges|Steps; Bars of music|1
MECHANIC|Car fixer|Repairer; Game rule|1
MEDIA|Press|News outlets; Social ___|1
MEDICAL|Health-related|Clinical; ___ school|1
MEDIUM|Middle|Average; Psychic|1
MEDIUMS|Middles|Psychics; Channels|1
MEETINGS|Gatherings|Sessions; Conferences|1
MEMBER|Part|Club joiner; Limb|1
MEMBERS|Parts|Club joiners; Limbs|1
MEMORY|Recall|Recollection; Computer RAM|1
MENTION|Refer to|Note; Shout-out|1
MENTIONS|Refers to|Notes; Shout-outs|1
MERE|Only|Simple; Just|1
MERELY|Only|Just; Simply|1
MESSY|Untidy|Sloppy; Cluttered|1
METHOD|Way|Approach; System|1
METHODS|Ways|Approaches; Systems|1
MIDDLE|Center|Midpoint; ___ school|1
MILITARY|Armed forces|Army; Martial|1
MILLION|Thousand thousands|Big number; One in a ___|1
MILLIONS|Huge numbers|Tons; A fortune|1
MINIMAL|Least|Slight; Bare|1
MINIMUM|Least|Lowest limit; ___ wage|1
MINORITY|Smaller part|Few; Lesser share|1
MINUTE|Sixty seconds|Tiny; Wait a ___|1
MISLEAD|Deceive|Fool; Lead astray|1
MISLEADS|Deceives|Fools; Leads astray|1
MISLED|Deceived|Fooled; Led astray|1
MISTAKE|Error|Slip; Blunder|1
MISTAKEN|Wrong|In error; Misjudged|1
MISTAKES|Errors|Slips; Blunders|1
MISTOOK|Confused|Misread; Got wrong|1
MISUSE|Abuse|Misapply; Wrong use|1
MOD|Update, briefly|Change; Sixties style|1
MODERN|Current|Up-to-date; Contemporary|1
MODIFIED|Changed|Altered; Adjusted|1
MODIFIES|Changes|Alters; Adjusts|1
MODIFY|Change|Alter; Adjust|1
MONITOR|Screen|Watch; Hall ___|1
MOTION|Movement|Gesture; Proposal|1
MOVEMENT|Motion|Campaign; Symphony part|1
MOVING|Touching|Relocating; In motion|1
MULTIPLE|Many|Several; Times table|1
MUST|Have to|Need to; Essential|1
MYSELF|Me|I alone; By ___|1
NAMING|Calling|Christening; Labeling|1
NASTY|Mean|Vile; Spiteful|1
NATION|Country|Land; State|1
NATIONAL|Countrywide|Federal; Citizen|1
NATURAL|Normal|Organic; Born talent|1
NAUGHTY|Bad|Mischievous; ___ list|1
NEARBY|Close|Near at hand; Local|1
NEAREST|Closest|Next door; Handiest|1
NEGATIVE|No|Minus; Pessimistic|1
NEITHER|Not either|Nor; Not one|1
NERVOUS|Anxious|Jittery; On edge|1
NICEST|Kindest|Most pleasant; Sweetest|1
NOBODY|No one|Nonentity; Zero people|1
NOISY|Loud|Rowdy; Raucous|1
NONSENSE|Rubbish|Baloney; Hogwash|1
NORMAL|Usual|Typical; Regular|1
NORMALLY|Usually|Typically; As a rule|1
NOTICE|See|Spot; Sign|1
NOTICED|Saw|Spotted; Observed|1
NOTICES|Sees|Spots; Signs|1
NOTICING|Seeing|Spotting; Observing|1
NOTIFY|Tell|Inform; Alert|1
NOWADAYS|These days|Today; Currently|1
NOWHERE|No place|Middle of ___; Lost|1
NUMB|Without feeling|Frozen; Dazed|1
NUMBEST|Least feeling|Most frozen; Most dazed|1
OBJECT|Thing|Item; Protest|1
OBJECTED|Protested|Opposed; Complained|1
OBJECTS|Things|Items; Protests|1
OBSCURE|Unknown|Hidden; Vague|1
OBSERVE|Watch|Notice; Follow, as a law|1
OBSERVED|Watched|Noticed; Remarked|1
OBSERVES|Watches|Notices; Remarks|1
OBTAIN|Get|Acquire; Gain|1
OBTAINED|Got|Acquired; Gained|1
OBTAINS|Gets|Acquires; Gains|1
OBVIOUS|Clear|Evident; No-brainer|1
OCCUPIED|Busy|Taken; Lived in|1
OCCUPIES|Fills|Takes up; Lives in|1
OCCUPY|Fill|Take up; Live in|1
OCCUR|Happen|Arise; Come to mind|1
OCCURRED|Happened|Arose; Came to mind|1
OCCURS|Happens|Arises; Comes to mind|1
OFFICE|Workplace|Bureau; Post|1
OFFICER|Cop|Badge holder; Ranking soldier|1
OFFICES|Workplaces|Bureaus; Posts|1
OFFICIAL|Formal|Authorized; Referee|1
OLDEST|Most aged|Eldest; Firstborn|1
OMITTED|Left out|Skipped; Dropped|1
OMITTING|Leaving out|Skipping; Dropping|1
OPERATE|Run|Work; Do surgery|1
OPERATED|Ran|Worked; Did surgery|1
OPERATES|Runs|Works; Does surgery|1
OPERATOR|Phone helper|Driver; Smooth ___|1
OPPOSE|Resist|Fight; Be against|1
OPPOSED|Resisted|Against; Contrary|1
OPPOSES|Resists|Fights; Is against|1
OPPOSING|Resisting|Rival; Contrary|1
OPPOSITE|Reverse|Contrary; Across from|1
OPTION|Choice|Alternative; Stock deal|1
OPTIONAL|Not required|Elective; Voluntary|1
OPTIONS|Choices|Alternatives; Menu items|1
ORGANIZE|Arrange|Sort; Plan|1
ORIGIN|Source|Root; Birthplace|1
OUGHT|Should|Must; Is obliged|1
OUTPUT|Production|Yield; Printout|1
OUTSIDE|Exterior|Outdoors; ___ chance|1
OVERALL|In general|Total; On the whole|1
OWING|Due|Unpaid; Thanks to|1
PACKAGE|Parcel|Bundle; Deal|1
PACKAGES|Parcels|Bundles; Deals|1
PACKET|Small pack|Sachet; Data unit|1
PAINFUL|Sore|Hurtful; Agonizing|1
PARTIAL|Incomplete|Biased; Fond of|1
PARTIES|Celebrations|Bashes; Sides|1
PATIENT|Calm|Tolerant; Hospital guest|1
PAUSE|Break|Hesitate; Hold button|1
PECULIAR|Odd|Strange; Unusual|1
PEOPLE|Persons|Folks; Public|1
PER|For each|Apiece; As ___ usual|1
PERFORM|Do|Act; Play|1
PERFORMS|Does|Acts; Plays|1
PERHAPS|Maybe|Possibly; Could be|1
PERIOD|Era|Full stop; Class time|1
PERMIT|Allow|License; Let|1
PERMITS|Allows|Licenses; Lets|1
PERSON|Human|Individual; Somebody|1
PERSONAL|Private|Own; Individual|1
PERSONS|Humans|Individuals; People|1
PERSUADE|Convince|Win over; Sway|1
PETROL|Gas, in UK|Fuel; Gasoline|1
PHASE|Stage|Step; Moon shape|1
PHRASE|Expression|Saying; Word group|1
PHRASES|Expressions|Sayings; Word groups|1
PHYSICAL|Bodily|Material; Checkup|1
PINT|Half a quart|Beer glass; Ice cream size|1
PLACING|Putting|Setting; Ranking|1
PLANNED|Intended|Arranged; Scheduled|1
PLANNING|Arranging|Scheduling; Plotting|1
PLEASE|Kindly|Delight; Satisfy|1
PLEASED|Happy|Delighted; Content|1
PLEASES|Delights|Satisfies; Suits|1
PLEASING|Nice|Agreeable; Delightful|1
POLICE|Cops|Law officers; Patrol|1
POLICIES|Rules|Plans; Insurance deals|1
POLICY|Rule|Plan; Insurance deal|1
POPULAR|Well-liked|In demand; Trendy|1
POSITION|Spot|Job; Stance|1
POSSIBLY|Maybe|Perhaps; Conceivably|1
POUND|Hit|Sixteen ounces; Dog shelter|1
POUNDS|Hits|Weight units; UK money|1
POWERFUL|Strong|Mighty; Potent|1
PRECISE|Exact|Accurate; Specific|1
PREFER|Favor|Like better; Choose|1
PREFERS|Favors|Likes better; Chooses|1
PREPARE|Get ready|Make; Prime|1
PREPARED|Ready|Made; Set|1
PREPARES|Gets ready|Makes; Primes|1
PRESERVE|Protect|Keep; Jam|1
PRESSURE|Force|Stress; Peer ___|1
PRESUME|Assume|Suppose; Dare|1
PREVENT|Stop|Avert; Block|1
PREVENTS|Stops|Averts; Blocks|1
PREVIOUS|Earlier|Prior; Former|1
PRIMARY|Main|Chief; Election round|1
PRIME|Main|Best; ___ number|1
PRINT|Type|Publish; Photo, e.g.|1
PRINTED|Typed|Published; Inked|1
PRINTER|Inkjet, e.g.|Laser ___; Press|1
PRINTERS|Inkjets, e.g.|Presses; Publishers|1
PRINTING|Typing|Publishing; Run of copies|1
PRINTOUT|Hard copy|Paper copy; Report sheet|1
PRINTS|Types|Publishes; Photos|1
PRIOR|Earlier|Former; ___ to|1
PRIVATE|Personal|Secret; Army rank|1
PROCESS|Method|Steps; Handle|1
PRODUCE|Make|Create; Fruit and veg|1
PRODUCED|Made|Created; Staged|1
PRODUCES|Makes|Creates; Yields|1
PRODUCT|Item|Goods; Math result|1
PRODUCTS|Items|Goods; Wares|1
PROGRAM|Plan|Show; Software|1
PROGRAMS|Plans|Shows; Software|1
PROGRESS|Advance|Headway; Growth|1
PROMPT|On time|Cue; Punctual|1
PROMPTLY|On time|Right away; Swiftly|1
PRONE|Lying face down|Likely; Inclined|1
PROPERLY|Correctly|Right; Fittingly|1
PROPOSAL|Offer|Plan; Marriage ask|1
PROPOSE|Suggest|Offer; Pop the question|1
PROPOSED|Suggested|Offered; Planned|1
PROPOSES|Suggests|Offers; Plans|1
PROTECT|Guard|Shield; Defend|1
PROTECTS|Guards|Shields; Defends|1
PROTEST|Object|Rally; Demonstration|1
PROVE|Show|Confirm; Rise, as dough|1
PROVED|Showed|Confirmed; Rose, as dough|1
PROVES|Shows|Confirms; Rises, as dough|1
PROVIDE|Supply|Give; Furnish|1
PROVIDED|Supplied|Given; If|1
PROVIDES|Supplies|Gives; Furnishes|1
PROVING|Showing|Confirming; ___ ground|1
PUBLIC|Open|Common; General ___|1
PUBLICLY|Openly|Out in the open; Out loud|1
PUBLISH|Print|Release; Put out|1
PUNCTURE|Pierce|Hole; Flat tire|1
PURCHASE|Buy|Acquisition; Grip|1
PURPOSE|Aim|Goal; Reason|1
PURPOSES|Aims|Goals; Reasons|1
PUTT|Tap in|Short stroke; Green shot|1
PUTTED|Tapped in|Stroked; Holed out|1
PUTTING|Placing|Setting; ___ green|1
PUTTS|Taps in|Short strokes; Green shots|1
# ---------- KeyRing everyday words, tier 1, round 4 Q-Z (CD-127: 1.1). Drafts accepted, ACTIVE since L14.10 (CD-129) ----------
QUALIFY|Be eligible|Make the cut; Limit|1
QUALITY|Grade|Caliber; Trait|1
QUANTITY|Amount|Number; Sum|1
QUARTER|1/4|Coin; School term|1
QUEUE|Line|Wait in line; Playlist|1
QUICKEST|Fastest|Speediest; Swiftest|1
QUITE|Very|Rather; Completely|1
QUITTING|Stopping|Leaving; ___ time|1
QUOTING|Citing|Repeating; Pricing|1
RAISING|Lifting|Rearing; Hand-___|1
RANDOM|Chance|Haphazard; Arbitrary|1
RANDOMLY|By chance|Haphazardly; Aimlessly|1
RATHER|Somewhat|Instead; Quite|1
REACT|Respond|Answer; Kick back|1
READABLE|Legible|Clear; Easy to follow|1
READERS|Bookworms|Audience; Glasses|1
READILY|Easily|Willingly; Gladly|1
REALITY|Truth|Fact; ___ TV|1
REALIZE|Grasp|Understand; Achieve|1
REALIZED|Grasped|Understood; Achieved|1
REALIZES|Grasps|Understands; Achieves|1
REASON|Cause|Logic; Motive|1
REASONS|Causes|Motives; Grounds|1
RECALL|Remember|Product return; Call back|1
RECEIVE|Get|Accept; Take in|1
RECEIVED|Got|Accepted; Took in|1
RECEIVES|Gets|Accepts; Takes in|1
RECENT|New|Latest; Fresh|1
RECENTLY|Lately|Not long ago; Of late|1
RECORD|Log|Vinyl disc; Best ever|1
RECORDED|Logged|Taped; Noted|1
RECORDS|Logs|Files; Vinyl discs|1
RECOVER|Get well|Regain; Bounce back|1
RECOVERS|Gets well|Regains; Bounces back|1
REDUCE|Cut|Lessen; Shrink|1
REDUCED|Cut|Marked down; Lessened|1
REDUCES|Cuts|Lessens; Shrinks|1
REDUCING|Cutting|Lessening; Shrinking|1
REFER|Point to|Mention; Send on|1
REFERRED|Pointed to|Mentioned; Sent on|1
REFERS|Points to|Mentions; Sends on|1
REFLECT|Mirror|Ponder; Bounce back|1
REFLECTS|Mirrors|Ponders; Shows|1
REFUSE|Decline|Trash; Turn down|1
REFUSED|Declined|Turned down; Denied|1
REFUSES|Declines|Turns down; Denies|1
REFUSING|Declining|Turning down; Denying|1
REGARD|Consider|Respect; Look at|1
REGARDED|Considered|Viewed; Esteemed|1
REGARDS|Wishes|Considers; Best ___|1
REGION|Area|Zone; District|1
REGISTER|Enroll|Cash ___; Sign up|1
REGRET|Remorse|Rue; No ___s|1
REGULAR|Usual|Normal; Steady customer|1
REJECT|Turn down|Refuse; Discard|1
REJECTED|Turned down|Refused; Spurned|1
REJECTS|Turns down|Refuses; Seconds|1
RELATE|Connect|Tell; Empathize|1
RELATED|Connected|Kin; Told|1
RELATES|Connects|Tells; Empathizes|1
RELATING|Connecting|Telling; Empathizing|1
RELATION|Link|Kin; Connection|1
RELEASE|Free|Let go; Launch|1
RELEASED|Freed|Let go; Launched|1
RELEASES|Frees|Lets go; New albums|1
RELEVANT|Pertinent|Related; Apt|1
RELIABLE|Dependable|Trusty; Solid|1
RELIGION|Faith|Belief; Creed|1
REMAIN|Stay|Last; Linger|1
REMAINED|Stayed|Lasted; Lingered|1
REMAINS|Stays|Leftovers; Ruins|1
REMARK|Comment|Note; Say|1
REMARKS|Comments|Notes; Says|1
REMIND|Prompt|Jog the memory; Nudge|1
REMINDED|Prompted|Nudged; Recalled|1
REMINDS|Prompts|Nudges; Echoes|1
REMOVAL|Taking away|Extraction; Snow ___|1
REMOVE|Take off|Delete; Extract|1
REMOVED|Taken off|Deleted; Distant|1
REMOVES|Takes off|Deletes; Extracts|1
REMOVING|Taking off|Deleting; Extracting|1
REPAIR|Fix|Mend; Restore|1
REPEAT|Redo|Rerun; Echo|1
REPEATED|Redid|Reran; Recurring|1
REPEATS|Redoes|Reruns; Echoes|1
REPLACE|Swap|Substitute; Put back|1
REPLACED|Swapped|Substituted; Put back|1
REPLACES|Swaps|Substitutes; Puts back|1
REPLIED|Answered|Responded; Wrote back|1
REPLIES|Answers|Responses; Writes back|1
REPORT|Account|Tell; Book ___|1
REPORTED|Told|Stated; Alleged|1
REPORTS|Accounts|Tells; Papers|1
REQUEST|Ask|Plea; Petition|1
REQUESTS|Asks|Pleas; Petitions|1
REQUIRE|Need|Demand; Call for|1
REQUIRED|Needed|Mandatory; Demanded|1
REQUIRES|Needs|Demands; Calls for|1
RESERVE|Book|Hold back; Backup|1
RESERVED|Booked|Shy; Held|1
RESERVES|Books|Backups; Stockpiles|1
RESIDENT|Inhabitant|Local; Doctor in training|1
RESORT|Spa hotel|Last ___; Fall back|1
RESOURCE|Asset|Supply; Means|1
RESPECT|Esteem|Honor; Regard|1
RESPECTS|Esteems|Honors; Pay one's ___|1
RESPOND|Answer|Reply; React|1
RESPONSE|Answer|Reply; Reaction|1
RESTART|Begin again|Reboot; Resume|1
RESTORE|Repair|Bring back; Renew|1
RESTORED|Repaired|Brought back; Renewed|1
RESTORES|Repairs|Brings back; Renews|1
RESTRICT|Limit|Confine; Curb|1
RESULT|Outcome|Effect; Score|1
RESULTED|Followed|Ended up; Came about|1
RESULTS|Outcomes|Effects; Scores|1
RETAIN|Keep|Hold; Hire, as a lawyer|1
RETURN|Come back|Give back; Tax ___|1
RETURNED|Came back|Gave back; Sent back|1
RETURNS|Comes back|Gives back; Profits|1
REVEAL|Show|Disclose; Unveil|1
REVEALED|Showed|Disclosed; Unveiled|1
REVEALS|Shows|Discloses; Unveils|1
REVERSE|Back up|Opposite; Undo|1
REVIEW|Critique|Look over; Recap|1
REWRITE|Redo|Revise; Edit|1
RIDDING|Clearing|Freeing; Purging|1
ROUGH|Coarse|Bumpy; Approximate|1
ROUGHLY|About|Coarsely; Harshly|1
ROUTINE|Habit|Regular; Act|1
RUBBER|Elastic|Eraser; Tire stuff|1
RUBBISH|Trash|Nonsense; Junk|1
RUMOR|Gossip|Hearsay; Buzz|1
SAFEST|Most secure|Least risky; Surest|1
SAFETY|Security|Protection; ___ pin|1
SAID|Spoke|Stated; Aforementioned|1
SAINT|Holy one|Angel; Patron ___|1
SAKE|Benefit|Behalf; Rice wine|1
SAMPLE|Taste|Example; Specimen|1
SATISFY|Please|Fulfill; Content|1
SAVING|Rescuing|Thrifty; Daylight ___|1
SCHEME|Plot|Plan; Color ___|1
SCRAP|Bit|Junk; Discard|1
SCRATCH|Scrape|Itch; From ___|1
SCRIPT|Screenplay|Handwriting; Lines|1
SEARCH|Look for|Hunt; Google|1
SEARCHED|Looked for|Hunted; Combed|1
SEARCHES|Looks for|Hunts; Combs|1
SECOND|Next|Moment; Runner-up|1
SECONDLY|Next|Also; In addition|1
SECTION|Part|Segment; Division|1
SECTIONS|Parts|Segments; Divisions|1
SECURE|Safe|Fasten; Obtain|1
SECURITY|Safety|Protection; Guards|1
SEEN|Spotted|Noticed; Witnessed|1
SELECT|Choose|Pick; Elite|1
SELECTED|Chosen|Picked; Elite|1
SELECTS|Chooses|Picks; Elects|1
SEMINAR|Class|Workshop; Study group|1
SENIOR|Elder|Older; Final student|1
SENSE|Feel|Meaning; Common ___|1
SENSIBLE|Practical|Wise; Sound|1
SENSIBLY|Wisely|Practically; Soundly|1
SENT|Mailed|Shipped; Dispatched|1
SEPARATE|Divide|Apart; Distinct|1
SEQUENCE|Order|Series; Chain|1
SERIAL|In a series|Episodic; ___ number|1
SERIES|Set|Run; TV show|1
SERIOUS|Grave|Solemn; Earnest|1
SERVE|Help|Wait on; Tennis start|1
SERVED|Helped|Waited on; Dished up|1
SERVER|Waiter|Host computer; Tennis starter|1
SERVES|Helps|Waits on; Portions|1
SERVICE|Help|Ceremony; Maintenance|1
SERVICES|Helps|Ceremonies; Utilities|1
SERVING|Portion|Helping; Waiting on|1
SESSION|Meeting|Sitting; Term|1
SESSIONS|Meetings|Sittings; Terms|1
SETTING|Scene|Backdrop; Placing|1
SETTLE|Resolve|Calm down; Colonize|1
SETTLED|Resolved|Calm; Paid|1
SETTLES|Resolves|Calms down; Pays|1
SETTLING|Resolving|Calming; Sinking|1
SEVERAL|Some|A few; Various|1
SEVERE|Harsh|Strict; Intense|1
SEVERELY|Harshly|Strictly; Badly|1
SHALL|Will|Must; ___ we?|1
SHAME|Disgrace|Pity; Embarrass|1
SHARING|Splitting|Giving; Show-and-tell|1
SHEET|Bed cover|Page; Layer|1
SHOOT|Fire|Sprout; Photo session|1
SHOPPED|Bought|Browsed; Mall-time!|1
SHOPPING|Buying|Browsing; ___ cart|1
SHORTAGE|Lack|Scarcity; Deficit|1
SHORTEST|Briefest|Least tall; Quickest|1
SHOULD|Ought to|Must; Had better|1
SHOWN|Displayed|Revealed; Exhibited|1
SHUTTING|Closing|Sealing; Locking|1
SIGNAL|Sign|Cue; Turn ___|1
SIGNALS|Signs|Cues; Indicates|1
SILLY|Foolish|Goofy; Absurd|1
SIMILAR|Alike|Comparable; Close|1
SIMPLE|Easy|Plain; Basic|1
SIMPLER|Easier|Plainer; More basic|1
SIMPLEST|Easiest|Plainest; Most basic|1
SIMPLY|Just|Plainly; Merely|1
SINCE|Because|After; From then|1
SINGLE|One|Unmarried; Base hit|1
SITE|Location|Web page; Spot|1
SITTING|Seated|Session; Perched|1
SLIGHT|Small|Snub; Slender|1
SLIGHTLY|A little|Somewhat; Barely|1
SLOWEST|Least fast|Pokiest; Last|1
SMALLEST|Tiniest|Least; Runt|1
SOCIAL|Friendly|Party; ___ media|1
SOCIETY|Community|Club; High ___|1
SOFTWARE|Programs|Apps; Code|1
SOLD|Traded|Convinced; ___ out|1
SOLVING|Working out|Cracking; Figuring|1
SOME|A few|Several; Certain|1
SOMEHOW|Some way|Anyhow; 1 way or another|1
SOMETIME|Someday|Eventually; Once|1
SOMEWHAT|Rather|Kind of; Partly|1
SOONEST|Earliest|1st; Quickest|1
SORRY|Apologetic|Pitiful; My bad|1
SOUGHT|Looked for|Wanted; Pursued|1
SOURCE|Origin|Root; Informant|1
SOURCES|Origins|Roots; Informants|1
SOUTHERN|Dixie|Down-home; ___ Cross|1
SPEAKERS|Talkers|Orators; Stereo parts|1
SPECIFIC|Exact|Particular; Precise|1
SPECIFY|Name|State; Detail|1
SPEECH|Talk|Address; Language|1
SPENT|Used up|Tired; Paid|1
SPIRIT|Soul|Ghost; Team ___|1
SPITE|Malice|Ill will; In ___ of|1
SPLIT|Divide|Crack; Banana ___|1
SPLITS|Divides|Cracks; Gymnast's move|1
SPOKE|Talked|Wheel rod; Said|1
SPOKEN|Said|Oral; Voiced|1
SPOTTED|Seen|Dotted; Noticed|1
SPOTTING|Seeing|Noticing; Gym help|1
SPREAD|Scatter|Feast; Butter, e.g.|1
SPREADS|Scatters|Jams; Feasts|1
SQUARE|Four-sided shape|Plaza; Nerd|1
STANDARD|Norm|Usual; Flag|1
START|Begin|Launch; Jump|1
STARTED|Began|Launched; Jumped|1
STARTING|Beginning|Launching; ___ line|1
STARTS|Begins|Launches; Jumps|1
STATE|Say|Condition; Ohio, e.g.|1
STATED|Said|Declared; Set|1
STATES|Says|Conditions; Nations|1
STATING|Saying|Declaring; Noting|1
STATUS|Standing|Rank; Update|1
STILL|Yet|Calm; Motionless|1
STOCK|Supply|Shares; Soup base|1
STOOD|Rose|Endured; Was upright|1
STOPPED|Halted|Quit; Blocked|1
STOPPING|Halting|Quitting; Blocking|1
STORAGE|Keeping|Warehouse; Disk space|1
STORING|Keeping|Saving; Stashing|1
STRANGE|Odd|Weird; Unfamiliar|1
STRATEGY|Plan|Tactics; Game plan|1
STRICT|Firm|Stern; Exact|1
STRICTLY|Firmly|Exactly; Solely|1
STRIKE|Hit|Walkout; Bowling X|1
STRIKES|Hits|Walkouts; Three ___|1
STRIKING|Hitting|Stunning; Walking out|1
STRUCK|Hit|Stunned; Walked out|1
STUCK|Jammed|Trapped; Glued|1
STUDIED|Learned|Read up; Examined|1
STUDIES|Learns|Research; Dens|1
STUFF|Things|Cram; Gear|1
STUPID|Dumb|Dense; Silly|1
STYLE|Fashion|Manner; Flair|1
SUBJECT|Topic|Theme; Prone|1
SUBJECTS|Topics|Courses; Citizens|1
SUBMIT|Hand in|Yield; Send|1
SUBMITS|Hands in|Yields; Sends|1
SUBSET|Part of a set|Subgroup; Segment|1
SUCCEED|Win|Achieve; Follow|1
SUCCESS|Triumph|Win; Hit|1
SUCH|So|Like that; ___ as|1
SUDDEN|Abrupt|Quick; Unexpected|1
SUDDENLY|All at once|Abruptly; Out of nowhere|1
SUFFER|Endure|Hurt; Ache|1
SUFFERED|Endured|Hurt; Ached|1
SUFFERS|Endures|Hurts; Aches|1
SUFFICE|Be enough|Do; Serve|1
SUGGEST|Propose|Hint; Imply|1
SUGGESTS|Proposes|Hints; Implies|1
SUITABLE|Fitting|Apt; Right|1
SUITABLY|Fittingly|Aptly; Properly|1
SUMMARY|Recap|Synopsis; Brief|1
SUPERIOR|Better|Boss; Top-notch|1
SUPPLIED|Provided|Stocked; Gave|1
SUPPLIES|Provisions|Stock; Provides|1
SUPPLY|Provide|Stock; Demand's partner|1
SUPPORT|Back|Help; Brace|1
SUPPORTS|Backs|Helps; Braces|1
SUPPOSE|Assume|Guess; Imagine|1
SUPPOSED|Assumed|Alleged; Meant to|1
SUPPOSES|Assumes|Guesses; Imagines|1
SURFACE|Top|Exterior; Come up|1
SURVEY|Poll|Study; Look over|1
SURVIVE|Live on|Outlast; Endure|1
SURVIVED|Lived on|Outlasted; Endured|1
SURVIVES|Lives on|Outlasts; Endures|1
SUSPECT|Doubt|Accused; Distrust|1
SUSPECTS|Doubts|Accused ones; Distrusts|1
SUSPEND|Hang|Halt; Bench|1
SUSPENDS|Hangs|Halts; Benches|1
SWITCH|Change|Swap; Light ___|1
SWITCHED|Changed|Swapped; Traded|1
SWITCHES|Changes|Swaps; Toggles|1
SYMBOL|Sign|Emblem; Icon|1
SYMBOLS|Signs|Emblems; Icons|1
SYNTAX|Grammar|Sentence order; Code rules|1
SYSTEM|Method|Network; Setup|1
SYSTEMS|Methods|Networks; Setups|1
TAKEN|Grabbed|Occupied; Fooled|1
TAKING|Grabbing|Captivating; Removing|1
TARGET|Goal|Aim; Bull's-eye|1
TAUGHT|Instructed|Schooled; Trained|1
TEDIOUS|Boring|Dull; Tiresome|1
TENDENCY|Leaning|Habit; Trend|1
TERMINAL|Final|Airport hub; Fatal|1
TERRIBLY|Awfully|Very; Badly|1
THANK|Show gratitude|Credit; ___ you|1
THANKS|Gratitude|Ta; ___giving|1
THEIR|Belonging to them|Not there; Them, possessive|1
THEORY|Idea|Hypothesis; In ___|1
THERE|In that place|Yonder; Here and ___|1
THEREBY|By that|Thus; So|1
THESE|Those here|This group; ___ days|1
THIRD|After 2nd|Bronze place; One of three|1
THIS|The one here|Today's; ___ and that|1
THOSE|The ones there|Them; ___ were the days|1
THOUGH|However|Even so; Yet|1
THOUGHT|Idea|Notion; Pondered|1
THOUGHTS|Ideas|Notions; Musings|1
THREAT|Menace|Danger; Warning|1
THREW|Tossed|Hurled; Flung|1
THROUGH|Done|Finished; Via|1
THROWN|Tossed|Hurled; Baffled|1
THUS|So|Hence; Therefore|1
TIGHT|Snug|Taut; Stingy|1
TILL|Until|Cash drawer; Plow|1
TIMING|Timekeeping|Tempo; Good ___|1
TOKEN|Symbol|Coin proxy; Keepsake|1
TOOK|Grabbed|Seized; Carried|1
TOWARD|In the direction of|Facing; Near|1
TOWARDS|In the direction of|Facing; Near|1
TRACE|Outline|Hint; Tiny bit|1
TRANSFER|Move|Shift; Bus pass|1
TRAPPED|Caught|Stuck; Cornered|1
TRAPPING|Catching|Snaring; Cornering|1
TRASH|Garbage|Junk; Wreck|1
TRIED|Attempted|Tested; Judged|1
TRIES|Attempts|Tests; Rugby scores|1
TRIVIAL|Minor|Petty; Trifling|1
TROUBLE|Problem|Bother; Hot water|1
TRULY|Really|Sincerely; Honestly|1
TWENTY|Score|Number; ___ questions|1
TWICE|Two times|Doubly; Again|1
TYING|Knotting|Binding; Drawing even|1
TYPICAL|Usual|Normal; Standard|1
TYPING|Keyboarding|Writing; Classifying|1
UGLY|Unsightly|Hideous; Nasty|1
ULTIMATE|Final|Best; Frisbee game|1
UNABLE|Can't|Incapable; Powerless|1
UNAWARE|Unknowing|Oblivious; Clueless|1
UNCLEAR|Vague|Murky; Uncertain|1
UNHAPPY|Sad|Displeased; Glum|1
UNIFORM|Outfit|Same; Even|1
UNITE|Join|Combine; Unify|1
UNKNOWN|Unfamiliar|Mystery; Anonymous|1
UNLESS|Except if|If not; Barring|1
UNLIKE|Different from|Not like; Contrary to|1
UNLIKELY|Doubtful|Improbable; Long-shot|1
UNUSUAL|Rare|Odd; Uncommon|1
UNWANTED|Undesired|Unwelcome; Spare|1
UPDATE|Refresh|News; Upgrade|1
UPDATED|Refreshed|Current; Upgraded|1
UPDATES|Refreshes|News items; Upgrades|1
UPDATING|Refreshing|Upgrading; Revising|1
UPWARDS|Up|Higher; Skyward|1
USAGE|Use|Custom; Consumption|1
USEFUL|Handy|Helpful; Practical|1
USELESS|Pointless|Futile; Worthless|1
USING|Employing|Applying; Utilizing|1
UTILITY|Usefulness|Power company; Service|1
VAGUE|Unclear|Fuzzy; Hazy|1
VAGUELY|Faintly|Dimly; Somewhat|1
VALID|Sound|Legit; In force|1
VALIDITY|Soundness|Legitimacy; Truth|1
VALUABLE|Precious|Worthy; Costly|1
VARIABLE|Changing|Factor; X in math|1
VARIED|Mixed|Diverse; Changed|1
VARIES|Differs|Changes; Ranges|1
VARIETY|Mix|Range; Type|1
VARIOUS|Many|Assorted; Different|1
VARY|Differ|Change; Range|1
VARYING|Differing|Changing; Assorted|1
VECTOR|Direction|Course; Carrier|1
VERSION|Edition|Take; Variant|1
VERSIONS|Editions|Takes; Variants|1
VICE|Bad habit|Deputy; Clamp|1
VIRTUE|Goodness|Merit; Asset|1
VISIBLE|Seen|In view; Clear|1
VISION|Sight|Dream; Foresight|1
VOLUME|Loudness|Book; Amount|1
WASTE|Squander|Trash; Fritter|1
WASTED|Squandered|Trashed; Used up|1
WASTES|Squanders|Trashes; Wild lands|1
WASTING|Squandering|Using up; Withering|1
WEAPON|Arm|Tool; Secret ___|1
WEIRD|Odd|Strange; Eerie|1
WELCOME|Greet|Hello; You're ___|1
WELCOMED|Greeted|Received; Embraced|1
WELCOMES|Greets|Receives; Embraces|1
WENT|Left|Departed; Traveled|1
WERE|Existed|Used to be; As it ___|1
WESTERN|Of the west|Cowboy film; Occidental|1
WHENEVER|Any time|Each time; At any time|1
WHERE|What place|In what spot; At which place|1
WHEREAS|While|Since; On the other hand|1
WHEREBY|By which|Through which; How|1
WHEREVER|Anyplace|No matter the place; All over|1
WHETHER|If|In case; ___ or not|1
WHICH|What one|That; What one?|1
WHILE|During|Whereas; Spell of time|1
WHILST|While|During; Whereas|1
WHOEVER|Anyone who|Any person; No matter who|1
WHOM|Which person|___ it may concern; For ___|1
WHOSE|Of whom|Belonging to...; ___ line?|1
WIDEST|Broadest|Roomiest; Most open|1
WINNING|Victorious|Charming; Triumphant|1
WITH|Alongside|Using; Including|1
WITHDRAW|Pull out|Retreat; Take out cash|1
WITHIN|Inside|In; Indoors|1
WITHOUT|Lacking|Minus; Sans|1
WOMEN|Ladies|Gals; Females|1
WONDER|Marvel|Ponder; Awe|1
WONDERED|Pondered|Marveled; Mused|1
WONDERS|Marvels|Ponders; Seven ___|1
WOODEN|Made of wood|Stiff; Timber|1
WORE|Had on|Sported; Dressed in|1
WORKERS|Laborers|Staff; Hands|1
WORN|Used|Tired; Shabby|1
WORRIED|Anxious|Fretted; Uneasy|1
WORRIES|Concerns|Frets; Cares|1
WORSE|Inferior|Poorer; Not as good|1
WORST|Poorest|Lowest; Least good|1
WORTH|Value|Merit; Deserving|1
WORTHY|Deserving|Fit; Good enough|1
WOULD|Was willing to|Should; ___ you mind?|1
WRITTEN|Penned|In writing; Composed|1
WRONG|Incorrect|Mistaken; Injustice|1
WROTE|Penned|Composed; Authored|1
YOURS|Belonging to you|Thine; Sincerely ___|1
# ---------- KeyRing everyday words, tier 2, round 1 A-B (CD-129: 2.1). Drafts accepted (CD-135), ACTIVE since L14.12 ----------
AARDVARK|Ant-eating mammal|Master digger|2
ABIDE|Tolerate|Stand; Dwell|2
ABNORMAL|Unusual|Odd; Irregular|2
ABOLISH|End|Do away with; Repeal|2
ABORT|Call off|Cancel; Scrub, as a launch|2
ABORTED|Called off|Canceled; Scrubbed|2
ABORTING|Calling off|Canceling; Scrubbing|2
ABORTS|Calls off|Cancels; Scrubs|2
ABROAD|Overseas|Away from home; Widely|2
ABSENT|Missing|Away; Not here|2
ABSORB|Soak up|Take in; Engross|2
ABSORBED|Soaked up|Engrossed; Took in|2
ABSORBS|Soaks up|Takes in; Engrosses|2
ABSTRACT|Theoretical|Summary; Inexact; Imprecise|2
ABSURD|Ridiculous|Silly; Nonsensical|2
ABUSED|Mistreated|Misused; Harmed|2
ABUSES|Mistreats|Misuses; Wrongs|2
ABUSING|Mistreating|Misusing; Harming|2
ABUSIVE|Cruel|Harmful; Insulting|2
ABYSMAL|Dreadful|Terrible; Bottomless|2
ACCENT|Way of speaking|Stress; Highlight|2
ACCENTS|Speech styles|Stresses; Highlights|2
ACCESSED|Got into|Opened; Reached|2
ACCESSES|Gets into|Opens; Ways in|2
ACCUSE|Blame|Charge; Point at|2
ACCUSED|Blamed|Charged; Defendant|2
ACCUSES|Blames|Charges; Points at|2
ACCUSING|Blaming|Charging; Pointing at|2
ACCUSTOM|Get used to|Adapt; Familiarize|2
ACOUSTIC|Sound-related|Unplugged; Hall quality|2
ACRONYM|Initials word|NASA, e.g.; Abbreviation|2
ACRONYMS|Initials words|NASA and RADAR; Abbreviations|2
ACTIVATE|Turn on|Start; Trigger|2
ACUTE|Sharp|Severe; ___ angle|2
ADDICT|Dependent|Junkie; Big fan|2
ADDICTED|Hooked|Dependent; Obsessed|2
ADDICTS|Dependents|Junkies; Big fans|2
ADHERE|Stick|Follow; Cling|2
ADHERED|Stuck|Followed; Clung|2
ADHERES|Sticks|Follows; Clings|2
ADHERING|Sticking|Following; Clinging|2
ADJACENT|Next to|Neighboring; Beside|2
ADJUSTED|Tweaked|Adapted; Fine-tuned|2
ADJUSTS|Tweaks|Adapts; Fine-tunes|2
ADMIRE|Look up to|Respect; Gaze at|2
ADOPTION|Taking in|Acceptance; Pet rescue|2
ADVENT|Arrival|Coming|2
ADVERSE|Harmful|Unfavorable; Hostile|2
ADVERT|Ad, in UK|Commercial; Promo|2
ADVERTS|Ads, in UK|Commercials; Promos|2
ADVISER|Counselor|Consultant; Mentor|2
ADVISERS|Counselors|Consultants; Mentors|2
ADVISOR|Counselor|Consultant; Guide|2
ADVISORS|Counselors|Consultants; Guides|2
ADVISORY|Warning|Consultative; Weather alert|2
ADVOCATE|Supporter|Champion; Argue for|2
AERIAL|Antenna|Airborne; Overhead view|2
AGING|Getting older|Maturing; Ripening|2
AGONY|Anguish|Torment; ___ aunt|2
AIRCRAFT|Plane|Jet; Flying machine|2
AKIN|Similar|Related; Like|2
ALBEIT|Although|Though; Even if|2
ALCOHOL|Liquor|Spirits; Booze|2
ALGEBRA|Math with x|Equations; Solve for x|2
ALIASES|Assumed names|Pen names; AKAs|2
ALIGN|Line up|Straighten; Side with|2
ALIGNED|Lined up|Straight; In sync|2
ALIGNING|Lining up|Straightening; Syncing|2
ALIGNS|Lines up|Straightens; Sides with|2
ALLEGE|Claim|Assert; Charge|2
ALLEGED|Claimed|Supposed; So-called|2
ALLEGES|Claims|Asserts; Charges|2
ALLEGING|Claiming|Asserting; Charging|2
ALLERGIC|Sensitive|Averse; Sneezy|2
ALLIANCE|Union|Pact; Coalition|2
ALLIES|Partners|Friends; WWII winners|2
ALLOCATE|Assign|Allot; Budget|2
ALLY|Partner|Friend; Supporter|2
ALOUD|Out loud|Audibly; Vocally|2
ALPHA|1st letter|Top dog; ___ male|2
AMATEUR|Hobbyist|Novice; Unpaid|2
AMAZE|Astonish|Stun; Wow|2
AMAZED|Astonished|Stunned; Wowed|2
AMAZES|Astonishes|Stuns; Wows|2
AMAZING|Astonishing|Stunning; Awesome|2
AMBIENT|Surrounding|Background; Chill music|2
AMENDED|Changed|Revised; Fixed|2
AMENDING|Changing|Revising; Fixing|2
AMENDS|Changes|Revisions; Make ___|2
ANALOGY|Comparison|Likeness; Parallel|2
ANALYSES|Studies|Breakdowns; Reviews|2
ANALYST|Examiner|Expert; Shrink|2
ANALYZE|Examine|Study; Break down|2
ANALYZED|Examined|Studied; Broke down|2
ANALYZES|Examines|Studies; Breaks down|2
ANARCHY|Chaos|Lawlessness; Disorder|2
ANATOMY|Body science|Structure; Makeup|2
ANCESTOR|Forebear|Forefather; Root|2
ANECDOTE|Short story|Tale; Yarn|2
ANGUISH|Agony|Torment; Heartache|2
ANNUALLY|Yearly|Each year; Per annum|2
ANOMALY|Oddity|Exception; Fluke|2
ANORAK|Parka|Rain jacket; Geek, in UK|2
ANORAKS|Parkas|Rain jackets; Geeks, in UK|2
ANTIDOTE|Cure|Remedy; Poison fix|2
ANTIQUE|Old|Vintage; Heirloom|2
ANXIOUS|Worried|Nervous; Eager|2
ANYHOW|Anyway|Regardless; In any case|2
APATHY|Indifference|Unconcern; Who cares?|2
APPALL|Horrify|Shock; Dismay|2
APPALLED|Horrified|Shocked; Dismayed|2
APPALLS|Horrifies|Shocks; Dismays|2
APPEALED|Pleaded|Attracted; Went to court|2
APPEALS|Pleas|Attracts; Charms|2
APPEND|Add|Attach; Tack on|2
APPENDED|Added|Attached; Tacked on|2
APPENDIX|Supplement|Organ; Book's ending|2
APPENDS|Adds|Attaches; Tacks on|2
APPLAUSE|Clapping|Ovation; Hand|2
APPOINT|Name|Assign; Choose|2
APPOINTS|Names|Assigns; Chooses|2
ARCADE|Game hall|Covered walk; Pinball spot|2
ARCHAIC|Ancient|Outdated; Old-fashioned|2
ARCHIVE|Record store|Store; File away|2
ARCHIVED|Stored|Filed away; Saved|2
ARCHIVES|Records|Stores; Files|2
ARGUABLE|Debatable|Disputable; Moot|2
ARGUABLY|Possibly|Debatably; It could be said|2
ARISEN|Come up|Emerged; Risen|2
ARISING|Coming up|Emerging; Rising|2
AROSE|Came up|Emerged; Rose|2
ARRAY|Range|Display; Lineup|2
ARRAYS|Ranges|Displays; Lineups|2
ARREST|Detain|Stop; Collar|2
ARRESTED|Detained|Stopped; Busted|2
ARRESTS|Detains|Stops; Busts|2
ARRIVAL|Coming|Entrance; Newcomer|2
ARROGANT|Haughty|Cocky; Conceited|2
ARTISTIC|Creative|Arty; Stylish|2
ASCEND|Climb|Rise; Go up|2
ASCENDED|Climbed|Rose; Went up|2
ASCENDS|Climbs|Rises; Goes up|2
ASHAMED|Embarrassed|Sheepish; Red-faced|2
ASHCAN|Garbage bin|Dustbin; ___ School art|2
ASS|Donkey|Burro; Fool|2
ASSAULT|Attack|Raid; Onslaught|2
ASSEMBLE|Put together|Gather; Build|2
ASSERT|Declare|Claim; Insist|2
ASSERTED|Declared|Claimed; Insisted|2
ASSERTS|Declares|Claims; Insists|2
ASSESS|Evaluate|Judge; Size up|2
ASSESSED|Evaluated|Judged; Sized up|2
ASSESSES|Evaluates|Judges; Sizes up|2
ASSIGN|Allot|Appoint; Give out|2
ASSIGNED|Allotted|Appointed; Given|2
ASSIGNS|Allots|Appoints; Gives out|2
ASSIST|Help|Aid; Pass to a scorer|2
ASSISTED|Helped|Aided; Supported|2
ASSISTS|Helps|Aids; Passes|2
ASSORT|Sort|Classify; Group|2
ASSORTED|Mixed|Various; Sundry|2
ASSORTS|Sorts|Classifies; Groups|2
ASTERISK|Star symbol|Footnote mark; Caveat|2
ATHEISM|Disbelief in God|Unbelief|2
ATHEIST|Nonbeliever|Skeptic; Unbeliever|2
ATHEISTS|Nonbelievers|Skeptics; Unbelievers|2
ATOMIC|Nuclear|Tiny; ___ clock|2
ATROCITY|Horror|Outrage; Crime|2
ATTAIN|Reach|Achieve; Gain|2
ATTORNEY|Lawyer|Counsel; ___ general|2
ATTRACTS|Draws|Pulls; Lures|2
AUDIBLE|Hearable|Clear|2
AUTOMATE|Mechanize|Computerize; Robotize|2
AWAIT|Wait for|Expect; Anticipate|2
AWAITED|Waited for|Expected; Long-___|2
AWAITING|Waiting for|Expecting; Pending|2
AWAITS|Waits for|Expects; Lies ahead|2
AWFULLY|Terribly|Very; Badly|2
AXIOM|Truth|Principle; Maxim|2
AXIOMS|Truths|Principles; Maxims|2
BABIES|Infants|Tots; Pampers|2
BACKBONE|Spine|Courage; Mainstay|2
BACKLOG|Pile-up|Arrears; To-do pile|2
BACKWARD|Reverse|Behind; Shy|2
BACTERIA|Germs|Microbes; Bugs|2
BAFFLE|Puzzle|Confuse; Stump|2
BAFFLED|Puzzled|Confused; Stumped|2
BAFFLES|Puzzles|Confuses; Stumps|2
BAFFLING|Puzzling|Confusing; Mysterious|2
BAGGAGE|Luggage|Bags; Emotional ___|2
BALLOT|Vote|Ticket; Voting paper|2
BANG|Boom|Slam; Fringe|2
BANKRUPT|Broke|Insolvent; Bust|2
BANNED|Barred|Forbidden; Outlawed|2
BANNER|Flag|Sign; Headline|2
BANNING|Barring|Forbidding; Outlawing|2
BARGAIN|Deal|Haggle; Steal|2
BAROQUE|Ornate|Bach's era; Fancy|2
BARRED|Banned|Blocked; Striped|2
BARREL|Cask|Keg; Gun tube|2
BARRIER|Wall|Obstacle; Fence|2
BARRIERS|Walls|Obstacles; Fences|2
BARRING|Excluding|Banning; Except for|2
BASEMENT|Cellar|Lower level; Bargain ___|2
BASH|Party|Hit; Criticize|2
BASHED|Hit|Dented; Criticized|2
BASHES|Parties|Hits; Criticizes|2
BASHING|Hitting|Criticism; Pounding|2
BASS|Low voice|Fish; Guitar type|2
BASSES|Low voices|Fish; Low singers|2
BATTLE|Fight|Combat; Clash|2
BAUD|Modem speed unit|Data rate; Old modem measure|2
BEATEN|Defeated|Whipped; Worn path|2
BEAUTY|Loveliness|Looker; ___ & the Beast|2
BEERS|Brews|Ales; Lagers|2
BEGINNER|Newcomer|Novice; Rookie|2
BEHAVED|Acted|Self-conducted; Well-___|2
BEHAVES|Acts|Conducts oneself; Minds manners|2
BEHAVING|Acting|Minding manners; Conducting oneself|2
BELIEF|Faith|Trust; Conviction|2
BELIEFS|Faiths|Convictions; Views|2
BELIEVER|Faithful one|Follower; Fan|2
BELONGED|Fit in|Was owned; Was a member|2
BELOVED|Dear|Darling; Cherished|2
BENEATH|Under|Below; Unworthy of|2
BENT|Curved|Crooked; Knack|2
BESIDE|Next to|Near; ___ oneself|2
BETA|2nd letter|Test version; ___ test|2
BEWARE|Watch out|Be careful; ___ of dog|2
BIAS|Prejudice|Slant; Leaning|2
BIASED|Prejudiced|Slanted; One-sided|2
BIASES|Prejudices|Slants; Leanings|2
BIASING|Prejudicing|Slanting; Skewing|2
BIBLE|Scripture|Good Book; Guide|2
BIBLICAL|Scriptural|Epic; The Good Book|2
BIGOT|Intolerant one|Zealot; Racist|2
BIGOTED|Intolerant|Prejudiced; Narrow-minded|2
BIGOTRY|Intolerance|Prejudice; Bias|2
BILLFOLD|Wallet|Purse; Money holder|2
BILLION|Thousand millions|Huge number; Big sum; 2-comma Club; Sagan's phrase|2
BILLIONS|Huge numbers|Countless; Fortunes|2
BISHOP|Church leader|Chess piece; Diocese head|2
BITTER|Sour|Resentful; Harsh|2
BLACKS|Darks|Ebonies; Inks|2
BLAMING|Accusing|Faulting; Pointing at|2
BLATANT|Obvious|Glaring; Flagrant|2
BLESS|Sanctify|Consecrate; ___ you!|2
BLESSED|Holy|Lucky; Sacred|2
BLESSES|Sanctifies|Favors; Consecrates|2
BLESSING|Gift|Approval; Grace|2
BLISS|Joy|Happiness; Heaven|2
BLOB|Lump|Glob; Mass|2
BLOOD|Red fluid|Kin; ___ type|2
BLOODY|Bleeding|Gory; Brit intensifier|2
BLOWING|Puffing|Gusting; Squandering|2
BLOWN|Puffed|Gusted; Squandered|2
BLOWS|Puffs|Hits; Gusts|2
BLURB|Short ad|Cover copy; Promo text|2
BOGGED|Stuck|Mired; ___ down|2
BOGGING|Sticking|Miring; ___ down|2
BOGGLE|Baffle|Stun; Mind-___|2
BOGGLES|Baffles|Stuns; Mind-___|2
BOMB|Explosive|Flop; Dud|2
BOMBED|Flopped|Failed; Blew up|2
BOMBING|Flopping|Failing; Air raid|2
BOMBS|Flops|Failures; Explosives|2
BOND|Tie|Link; Agent 007|2
BOOKLET|Pamphlet|Brochure; Leaflet|2
BOOKSHOP|Book retailer|Reading shop; Literary store|2
BOOM|Bang|Surge; Sonic ___|2
BORDER|Edge|Frontier; Boundary|2
BOREDOM|Tedium|Dullness; Ennui|2
BORING|Dull|Tedious; Drilling|2
BORN|Brought forth|Natural; Newly ___|2
BOUNCE|Rebound|Bound; Spring|2
BOUNDARY|Limit|Edge; Border|2
BOUNDS|Limits|Leaps; Out of ___|2
BOUT|Match|Round; Spell|2
BRASS|Copper alloy|Top officers; Horns|2
BREATH|Inhale|Puff; Gasp|2
BREATHE|Inhale|Exhale; Live|2
BREATHED|Inhaled|Exhaled; Lived|2
BREATHES|Inhales|Exhales; Lives|2
BRED|Raised|Reared; Born and ___|2
BREED|Raise|Type; Pedigree|2
BREEDING|Raising|Manners; Upbringing|2
BREEDS|Raises|Types; Pedigrees|2
BRETHREN|Brothers|Kin; Fellow members|2
BRIGADE|Troop|Unit; Fire ___|2
BROAD|Wide|General; Sweeping|2
BROADLY|Widely|Generally; In general|2
BROWSE|Look around|Skim; Window-shop|2
BROWSED|Looked around|Skimmed; Window-shopped|2
BROWSES|Looks around|Skims; Grazes|2
BROWSING|Looking around|Skimming; Surfing|2
BRUTAL|Savage|Harsh; Cruel|2
BUCK|Dollar|Male deer; Pass the ___|2
BUCKS|Dollars|Male deer; Milwaukee team|2
BUFFERED|Cushioned|Shielded; Padded|2
BUFFERS|Cushions|Shields; Pads|2
BULLET|Round|Dot point; Bite the ___|2
BULLETS|Rounds|Dot points; List marks|2
BUMP|Bulge|Knock; Fist ___|2
BUNDLE|Bunch|Package; Fortune|2
BURDEN|Load|Weight; Duty|2
BURNT|Scorched|Charred; Singed|2
BURST|Pop|Explode; Spurt|2
BURSTING|Popping|Exploding; To the brim|2
BURSTS|Pops|Explodes; Spurts|2
BUSH|Shrub|Thicket; Outback|2
BUST|Statue|Flop; Raid|2
BUYERS|Shoppers|Customers; Purchasers|2
BYPASS|Detour|Go around; Heart surgery|2
# ---------- KeyRing everyday words, tier 2, round 2 C (+ BUGGERS, JM CD-131: 2.2 N) (CD-131: 2.3). Drafts accepted (CD-135), ACTIVE since L14.12 ----------
BUGGERS|Rascals, in UK|Scamps; Little devils|2
CABINET|Cupboard|Advisers; Kitchen ___|2
CABLING|Wiring|Cords; Network lines|2
CAFFEINE|Coffee kick|Stimulant; Jolt in a cup|2
CALCULUS|Advanced math|Derivatives class; Tartar|2
CAM|Video recorder|Web ___; Engine part|2
CAMPUS|College grounds|School site; Quad|2
CANCEL|Call off|Scrap; Void|2
CANCELED|Called off|Scrapped; Voided|2
CANCELS|Calls off|Scraps; Voids|2
CANCER|Disease|Zodiac crab; Tumor|2
CANT|Jargon|Hypocrisy; Tilt|2
CAPITALS|Main cities|Upper-case letters; Funds|2
CAPTURE|Catch|Seize; Record|2
CAPTURED|Caught|Seized; Recorded|2
CAPTURES|Catches|Seizes; Records|2
CAREERS|Professions|Jobs; Callings|2
CARELESS|Sloppy|Negligent; Heedless|2
CARRIAGE|Coach|Buggy; Posture|2
CARRIER|Bearer|Airline; Phone company|2
CASING|Cover|Shell; Window frame|2
CASUAL|Relaxed|Informal; Laid-back|2
CATALOGS|Lists|Mail-order books; Indexes|2
CATERED|Supplied food|Served; Indulged|2
CATERING|Food service|Serving; Indulging|2
CATERS|Supplies food|Serves; Indulges|2
CATHOLIC|Universal|Wide-ranging; Roman ___|2
CATTLE|Cows|Livestock; Herd|2
CAUSAL|Cause-related|Linked; Underlying|2
CAUTION|Care|Warning; Yellow light|2
CAVEAT|Warning|Proviso; ___ emptor|2
CEASED|Stopped|Ended; Quit|2
CEASES|Stops|Ends; Quits|2
CEASING|Stopping|Ending; Quitting|2
CELLULAR|Mobile|Cell-based; Phone type|2
CENSOR|Ban|Bleep; Suppress|2
CENSORED|Banned|Bleeped; Cut|2
CENSORS|Bans|Bleeps; Cuts|2
CENTERED|Middled|Balanced; Focused|2
CENTERS|Middles|Hubs; Focuses|2
CEREMONY|Rite|Ritual; Formal event|2
CHAMBER|Room|Hall; ___ music|2
CHAOTIC|Disorderly|Wild; Messy|2
CHAPEL|Small church|Sanctuary; Wedding ___|2
CHARITY|Generosity|Aid group; Kindness|2
CHASING|Pursuing|Following; Hunting|2
CHAT|Talk|Gab; Text session|2
CHATS|Talks|Gabs; Texts|2
CHATTED|Talked|Gabbed; Texted|2
CHATTING|Talking|Gabbing; Texting|2
CHEAT|Swindle|Trick; Copy answers|2
CHEATED|Swindled|Tricked; Copied|2
CHEATING|Swindling|Tricking; Copying|2
CHEATS|Swindles|Tricks; Copies|2
CHEERFUL|Happy|Sunny; Upbeat|2
CHEMIST|Scientist|Pharmacist; Lab worker|2
CHEMISTS|Scientists|Pharmacists; Lab workers|2
CHESTNUT|Nut|Reddish brown; Old joke|2
CHEW|Munch|Gnaw; ___ the fat|2
CHEWED|Munched|Gnawed; ___ out|2
CHEWING|Munching|Gnawing; ___ gum|2
CHEWS|Munches|Gnaws; Taffy treats|2
CHILDISH|Immature|Babyish; Silly|2
CHOICES|Options|Picks; Selections|2
CHOP|Cut|Hack; Pork ___|2
CHOPPED|Cut|Hacked; Minced|2
CHOPPING|Cutting|Hacking; ___ block|2
CHOPS|Cuts|Hacks; Lamb ___|2
CHORAL|Sung|Choir-based; Vocal|2
CHORD|Notes together|Harmony; Strike a ___|2
CHORUS|Refrain|Choir; In unison|2
CHUCK|Toss|Throw; ___ steak|2
CHUCKED|Tossed|Threw; Dumped|2
CHUCKING|Tossing|Throwing; Dumping|2
CHUCKS|Tosses|Throws; Sneakers|2
CHURCHES|Chapels|Places of worship; Congregations|2
CINEMA|Movies|Theater; Film art|2
CIRCA|About|Around; Approximately|2
CIRCULAR|Round|Flyer; Ring-shaped|2
CITE|Quote|Mention; Ticket|2
CITED|Quoted|Mentioned; Ticketed|2
CITES|Quotes|Mentions; Tickets|2
CITIES|Towns|Metropolises; Urban areas|2
CITING|Quoting|Mentioning; Ticketing|2
CITIZENS|Residents|Nationals; Voters|2
CIVIL|Polite|Courteous; Not military|2
CIVILIAN|Non-soldier|Private citizen; Layperson|2
CIVILIZE|Refine|Educate; Tame|2
CLARITY|Clearness|Lucidity; Precision|2
CLASH|Conflict|Collide; Bang|2
CLASHES|Conflicts|Collides; Fights|2
CLASSIC|Timeless|Vintage; Standard|2
CLASSICS|Timeless works|Greats; Old favorites|2
CLASSIFY|Sort|Categorize; Make secret|2
CLAUSE|Section|Provision; Sentence part|2
CLAUSES|Sections|Provisions; Sentence parts|2
CLEANERS|Janitors|Dry ___; Detergents|2
CLEANEST|Purest|Most spotless; Tidiest|2
CLIENT|Customer|Patron; Account|2
CLIENTS|Customers|Patrons; Accounts|2
CLINIC|Health center|Workshop; Outpatient site|2
CLINICAL|Medical|Detached; ___ trial|2
CLIP|Fastener|Trim; Video snippet|2
CLIPPED|Fastened|Trimmed; Curt|2
CLIPPING|Cutting|Trimming; News cutout|2
CLIPS|Fasteners|Trims; Snippets|2
CLIQUE|In-crowd|Circle; Gang|2
CLOG|Block|Jam; Wooden shoe|2
CLONE|Copy|Duplicate; Dolly the sheep|2
CLONES|Copies|Duplicates; Look-alikes|2
CLOSURE|Ending|Closing; Peace of mind|2
CLOTHE|Dress|Garb; Outfit|2
CLUMSY|Awkward|Bumbling; All thumbs|2
CLUSTER|Bunch|Group; Star ___|2
CLUSTERS|Bunches|Groups; Clumps|2
COARSE|Rough|Crude; Grainy|2
COBBLER|Shoemaker|Fruit pie; Peach ___|2
COBBLERS|Shoemakers|Fruit pies; Nonsense, in UK|2
COHERENT|Logical|Clear; Consistent|2
COINCIDE|Concur|Overlap; Clash, as dates|2
COKE|Cola|Soda; Coal fuel|2
COLLAR|Neckband|Arrest; Blue-___|2
COLLATE|Gather|Sort pages; Compare|2
COLLATED|Gathered|Sorted; Compared|2
COLLATES|Gathers|Sorts; Compares|2
COLON|Punctuation mark|Intestine; Two dots|2
COLONY|Settlement|Outpost; Ant ___|2
COLUMNS|Pillars|Newspaper pieces; Vertical lines|2
COMBAT|Fight|Battle; Oppose|2
COMFORT|Ease|Console; ___ food|2
COMIC|Funny|Comedian; Cartoon book|2
COMICS|Comedians|Cartoons; Funny pages|2
COMMA|Punctuation mark|Pause mark; Oxford ___|2
COMMAS|Pause marks|Punctuation; List separators|2
COMMENCE|Begin|Start; Kick off|2
COMMIT|Pledge|Perform; Devote|2
COMMITS|Pledges|Performs; Devotes|2
COMMONS|Shared land|Green; House of ___|2
COMMUNAL|Shared|Common; Collective|2
COMPACT|Small|Dense; Makeup case|2
COMPEL|Force|Oblige; Drive|2
COMPELS|Forces|Obliges; Drives|2
COMPETE|Contend|Vie; Race|2
COMPETED|Contended|Vied; Raced|2
COMPETES|Contends|Vies; Races|2
COMPILE|Gather|Assemble; Build code|2
COMPILED|Gathered|Assembled; Built|2
COMPILES|Gathers|Assembles; Builds|2
COMPLY|Obey|Follow; Conform|2
COMPOSER|Songwriter|Mozart, e.g.; Creator|2
COMPOUND|Mixture|Combine; Walled area|2
COMPRESS|Squeeze|Condense; Cold pack|2
COMPRISE|Include|Consist of; Make up|2
CON|Swindle|Trick; Pro's opposite|2
CONCEAL|Hide|Cover up; Mask|2
CONCEALS|Hides|Covers up; Masks|2
CONCEDE|Admit|Yield; Give up|2
CONCEIVE|Imagine|Devise; Dream up|2
CONCEPTS|Ideas|Notions; Theories|2
CONCERTO|Solo piece|Orchestral work; Violin ___|2
CONCISE|Brief|Short; Succinct|2
CONCLUDE|End|Finish; Deduce|2
CONCUR|Agree|Coincide; Assent|2
CONDEMN|Denounce|Sentence; Blame|2
CONDEMNS|Denounces|Sentences; Blames|2
CONDENSE|Shorten|Compress; Thicken|2
CONDONE|Excuse|Allow; Overlook|2
CONDUCT|Behavior|Lead; Direct music|2
CONDUCTS|Leads|Directs; Transmits|2
CONFESS|Admit|Own up; Come clean|2
CONFINE|Limit|Restrict; Imprison|2
CONFINED|Limited|Cramped; Restricted|2
CONFINES|Limits|Boundaries; Restricts|2
CONFLICT|Clash|Fight; Disagreement|2
CONFORM|Comply|Fit in; Follow|2
CONFRONT|Face|Challenge; Stand up to|2
CONGEST|Clog|Crowd; Jam|2
CONGESTS|Clogs|Crowds; Jams|2
CONSENT|Agree|Permission; OK|2
CONSENTS|Agrees|Permits; OKs|2
CONSOLE|Comfort|Control panel; Game box|2
CONSULT|Ask|Confer; Check with|2
CONSULTS|Asks|Confers; Checks with|2
CONSUME|Eat|Use up; Devour|2
CONSUMED|Ate|Used up; Obsessed|2
CONSUMER|Buyer|User; Shopper|2
CONSUMES|Eats|Uses up; Devours|2
CONTACTS|Connections|Lenses; Touches|2
CONTEMPT|Scorn|Disdain; ___ of court|2
CONTEND|Compete|Argue; Claim|2
CONTEST|Competition|Dispute; Game|2
CONTEXTS|Settings|Backgrounds; Frames|2
CONTOUR|Outline|Shape; Map line|2
CONTRIVE|Devise|Scheme; Engineer|2
CONVERSE|Talk|Opposite; Chat|2
CONVERTS|Changes|New believers; Transforms|2
CONVEY|Carry|Transmit; Express|2
CONVICT|Prisoner|Find guilty; Inmate|2
CONVICTS|Prisoners|Finds guilty; Inmates|2
CORPSE|Body|Remains; Cadaver|2
CORPSES|Bodies|Remains; Cadavers|2
CORRIDOR|Hallway|Passage; Aisle|2
COSMIC|Universal|Vast; Space-related|2
COUNCILS|Boards|Committees; Assemblies|2
COUNSEL|Advice|Lawyer; Advise|2
COUNSELS|Advises|Guides; Lawyers|2
COUPLED|Paired|Joined; Linked|2
COUPLES|Pairs|Twosomes; Joins|2
COUPLING|Joint|Link; Pairing|2
COURAGE|Bravery|Nerve; Valor|2
COURIER|Messenger|Delivery person; Carrier|2
COVERAGE|Reporting|Insurance; Extent|2
CRACK|Split|Break; Quip|2
CRACKED|Split|Broke; Solved|2
CRACKING|Splitting|Breaking; Solving|2
CRACKS|Splits|Breaks; Fissures|2
CRAMP|Spasm|Restrict; Charley horse|2
CRAMPED|Tight|Confined; Spasmed|2
CRAMPING|Spasming|Restricting; ___ one's style|2
CRAMPS|Spasms|Restricts; Pangs|2
CRASS|Crude|Tasteless; Vulgar|2
CREATOR|Maker|Inventor; Author|2
CREDIBLE|Believable|Plausible; Trusty|2
CREDITS|Movie list|Loan amounts; Praise|2
CREED|Belief|Faith; Doctrine|2
CREEP|Crawl|Sneak; Weirdo|2
CRIED|Wept|Shouted; Sobbed|2
CRIES|Weeps|Shouts; Sobs|2
CRIMINAL|Crook|Outlaw; Illegal|2
CRITERIA|Standards|Measures; Benchmarks|2
CRITIC|Reviewer|Judge; Faultfinder|2
CRITICS|Reviewers|Judges; Faultfinders|2
CROSSED|Went over|Angered; Traversed|2
CROSSES|Goes over|Hybrids; Crucifixes|2
CROSSING|Intersection|Zebra stripes; Journey|2
CRUCIAL|Vital|Key; Critical|2
CRUDE|Raw|Rough; Oil|2
CRUEL|Mean|Harsh; Brutal|2
CRUELTY|Meanness|Brutality; Harshness|2
CRUISE|Sail|Voyage; Coast|2
CRUISED|Sailed|Coasted; Glided|2
CRUISES|Sails|Voyages; Coasts|2
CRUISING|Sailing|Coasting; ___ altitude|2
CRUNCH|Munch|Squeeze; Ab exercise|2
CRUNCHED|Munched|Squeezed; Calculated|2
CRUNCHES|Munches|Ab exercises; Squeezes|2
CRYPTIC|Mysterious|Puzzling; Coded|2
CUBIC|Cube-shaped|Three-dimensional; ___ feet|2
CUCKOO|Bird|Crazy; ___ clock|2
CUDDLY|Huggable|Cozy; Soft|2
CULPRIT|Wrongdoer|Offender; Guilty party|2
CULT|Sect|Following; ___ film|2
CULTURAL|Artistic|Ethnic; Societal|2
CULTURES|Societies|Civilizations; Lab growths|2
CUNNING|Sly|Crafty; Shrewd|2
CUPBOARD|Cabinet|Closet; Pantry|2
CURING|Healing|Smoking, as meat; Remedying|2
CURLY|Wavy|Kinky; Coiled|2
CURRENCY|Money|Cash; Tender|2
CURRY|Spicy dish|Indian stew; ___ favor|2
CURSE|Swear|Hex; Jinx|2
CUSTOM|Tradition|Habit; Tailor-made|2
CUSTOMS|Traditions|Border check; Habits|2
CYCLING|Biking|Rotating; Tour de France sport|2
CYCLIST|Biker|Rider; Peloton member|2
CYCLISTS|Bikers|Riders; Peloton|2
CYLINDER|Tube|Drum; Engine part|2
CYNIC|Skeptic|Doubter; Pessimist|2
CYNICAL|Skeptical|Doubting; Jaded|2
`;

/* v04 (JM, CD-9: 1.1): clues for 1-letter answers, which let every clue cell hold a clue.
   Format: LETTER|clue|level 1-3|picture (optional). Fill-ins use _ for the missing letter and have only one answer. */
self.LETTER_DATA = `
A|ZEBR_|1
A|PIZZ_|1
A|Top grade|1
A|1st letter|1
A|Blood type|1|🅰️
A|Vitamin in carrots|2
A|Note before B|3
B|_ANANA|1
B|Grade after A|1
B|Blood type|1|🅱️
B|2nd letter|1
B|Sounds like a honey maker|2
B|Boron|3
C|_AMEL|1
C|Grade for average work|1
C|Vitamin in oranges|1
C|Sounds like the ocean|2
C|Roman 100|2
C|Carbon|3
D|_INOSAUR|1
D|Grade below C|1
D|Vitamin from sunshine|2
D|Roman 500|2
D|Musical note after C|3
E|_LEPHANT|1
E|East|1
E|5th letter|1
E|Most common letter in English|2
E|Vitamin in nuts and seeds|3
F|_LAMINGO|1
F|Failing grade|1
F|6th letter|1
F|°_, in USA|2
F|Fluorine|3
F|Old-school degrees|2
F|Old-fash temp|2
F|N.A. temps|2
G|_IRAFFE|1
G|7th letter|1
G|Sounds like "gee!"|2
G|Musical note after F|3
G|A thousand dollars, in slang|3
H|_IPPO|1
H|_ELICOPTER|1
H|8th letter|1
H|Hydrogen|2
H|Shape of a rugby goalpost|3
I|_GLOO|1
I|Myself, as a subject|1
I|Information sign letter|1|ℹ️
I|Roman 1|2
I|Sounds like an eye|2
J|_ELLYFISH|1
J|_UICE|1
J|10th letter|1
J|Sounds like a blue bird|3
K|_ANGAROO|1
K|_OALA|1
K|J _ L|1
K|A thousand (as in 5_)|2
K|Potassium|3
K|Strikeout, on a baseball scorecard|3
K|Half-OK|2
K|Lazy fine|2
L|_OLLIPOP|1
L|Large T-shirt|1
L|12th letter|1
L|Roman 50|2
L|Shape of a carpenter's square|3
M|_USHROOM|1
M|Medium T-shirt|1
M|Metro sign letter|1|Ⓜ️
M|Roman 1000|2
M|13th letter|1
N|PEA _ UT|1
N|North|1
N|14th letter|1
N|Nitrogen|3
O|_CTOPUS|1
O|Shape of a donut|1|⭕
O|Hug, in XOXO|2
O|Oxygen|2
O|Zero, when reading a phone number|2
P|_ENGUIN|1
P|Parking sign letter|1|🅿️
P|Sounds like a green veggie|2
P|Phosphorus|3
Q|_UEEN|1
Q|_UILT|1
Q|Letter nearly always before U|2
Q|Sounds like a line of people|2
R|_ABBIT|1
R|_AINBOW|1
R|A pirate's favorite letter|2
R|Movie rating for adults|3
S|_NAKE|1
S|Small T-shirt|1
S|South|1
S|Shape of a winding road|2
S|Plural ending|3
T|_OMATO|1|🍅
T|_IGER|1|🐯
T|Sounds like a hot drink|2|🍵
T|Shape of a T-shirt|2|👕
T|Golf peg, by sound|3
U|_MBRELLA|1
U|___-turn|1
U|Sounds like "you"|1
U|Shape of a horseshoe magnet|2
U|Uranium|3
V|_IOLIN|1
V|Peace-sign letter|1|✌️
V|Roman 5|2
V|Shape of a flock of geese|3
W|_ATERMELON|1
W|West|1
W|23rd letter|1
W|Double-U|2
W|Tungsten|3
X|_YLOPHONE|1
X|Marks the spot|1|❌
X|Roman 10|2
X|Kiss, at the end of a note|2
X|Unknown, in algebra|3
X|Cancel|2
X|Close|2
Y|_OGURT|1
Y|_O-YO|1
Y|Sounds like "why?"|1
Y|Shape of a fork in the road|3
Z|_EBRA|1
Z|Last letter|1
Z|Sleep sound, in comics|1|💤
Z|Zed, in Britain|3
# L13 (JM, CD-67: 3.4.1): more blanks INSIDE words, added to the ones above. Every "_" is the same answer letter; only that letter makes a word.
A|B _ NANA|1
A|CAN _ DA|1
A|GIR _ FFE|1
A|TOM _ TO|1
B|RA _ _ IT|2
B|CO _ WEB|1
B|CA _ IN|1
B|BU _ _ LE|2
B|RI _ _ ON|2
C|SO _ _ ER|2
C|PI _ NIC|1
C|RA _ _ OON|2
C|O _ EAN|1
C|BI _ YCLE|1
D|CAN _ LE|1
D|GAR _ EN|1
D|PA _ _ LE|2
D|SAN _ AL|1
D|WI _ OW|1
E|SH _ _ P|2
E|QU _ _ N|2
E|GR _ _ N|2
E|P _ NCIL|1
E|PR _ SENT|1
F|CO _ _ EE|2
F|GIRA _ _ E|2
F|MU _ _ IN|2
F|BU _ _ ALO|2
F|SA _ ARI|1
F|WAF _ LE|1
G|WA _ ON|1
G|DRA _ ON|1
G|JU _ _ LE|2
G|PI _ EON|1
H|C _ AIR|1
H|ELEP _ ANT|1
H|W _ ALE|1
H|MOT _ ER|1
I|P _ ZZA|1
I|K _ TTEN|1
I|PENC _ L|1
I|MAG _ C|1
I|CH _ LI|1
J|PA _ AMAS|1
J|BAN _ O|1
J|RE _ OICE|1
J|OB _ ECT|1
J|A _ AR|1
K|BAS _ ET|1
K|MON _ EY|1
K|TUR _ EY|1
K|CHIC _ EN|1
K|PIC _ LE|1
L|BAL _ OON|1
L|SA _ AD|1
L|YE _ _ OW|2
L|PI _ _ OW|2
L|TU _ IP|1
M|HA _ MER|1
M|LE _ ON|1
M|SUM _ ER|1
M|CA _ EL|1
M|TO _ ATO|1
N|BA _ ANA|1
N|PEN _ Y|1
N|DIN _ ER|1
N|PLA _ ET|1
N|O _ ION|1
O|B _ _ K|2
O|M _ _ N|2
O|R _ BOT|1
O|C _ _ KIE|2
O|LEM _ N|1
P|AP _ LE|1
P|PUP _ Y|1
P|HAP _ Y|1
P|PEP _ ER|1
P|LA _ TOP|1
Q|S _ UID|1
Q|S _ UIRREL|1
Q|A _ UA|1
Q|LI _ UID|1
Q|E _ UAL|1
R|CA _ _ OT|2
R|MI _ _ OR|2
R|CHE _ _ Y|2
R|PA _ _ OT|2
R|ST _ AW|1
S|DE _ _ ERT|2
S|LE _ _ ON|2
S|BA _ KET|1
S|MU _ IC|1
T|KI _ _ EN|2
T|PO _ ATO|1
T|BOT _ LE|1
T|TUR _ LE|1
T|GUI _ AR|1
U|Q _ EEN|1
U|J _ MP|1
U|T _ RTLE|1
U|M _ SIC|1
U|S _ GAR|1
V|SE _ EN|1
V|E _ ERY|1
V|SHO _ EL|1
V|LE _ EL|1
V|SIL _ ER|1
W|FLO _ ER|1
W|S _ EATER|1
W|TO _ EL|1
W|SAND _ ICH|1
W|T _ ELVE|1
X|TA _ I|1
X|O _ YGEN|1
X|SI _ TY|1
X|MA _ IMUM|1
X|E _ TRA|1
Y|P _ RAMID|1
Y|ST _ LE|1
Y|RH _ THM|1
Y|CR _ STAL|1
Y|OX _ GEN|1
Z|PI _ _ A|2
Z|BLI _ _ ARD|2
Z|PUZ _ LE|1
Z|LI _ ARD|1
Z|DO _ EN|1
`;
