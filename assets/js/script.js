/* =========================================================
   THE VAULT — script.js  v3
   Jump to any section with Ctrl+F → "SECTION N"

   1.  Configuration & Constants
   2.  State
   3.  Persistence
   4.  Factories
   5.  DOM References
   6.  Selectors & Filters
   7.  Render — Master
   8.  Render — Tab Bar
   9.  Render — Sidebar
   10. Render — Table
   11. Tab Actions
   12. Entry Actions
   13. Modal
   14. Detail Panel
   15. Confirm Dialog
   16. Import / Export
   17. Toast
   18. Utility
   19. Event Listeners
   20. Click Sound
   21. Init
   22. Entry Type System      (NEW)
   23. Tab Behavior System    (NEW)
   24. Audio Player           (NEW)
   25. Book Viewer            (NEW)
   26. Rating System          (NEW)
   27. Theme System           (NEW)
   ========================================================= */


/* ─────────────────────────────────────────────────────────
   SECTION 1 — CONFIGURATION & CONSTANTS
   ───────────────────────────────────────────────────────── */

// ENTRY_TYPES — master schema for every catalogueable type.
// Each entry in the modal uses this to render dynamic fields.
const LEGACY_ENTRY_TYPES = {
  Books: {
    label:       'Book',
    icon:        '📖',
    color:       '#b8864a',
    description: 'Novels, academic texts, graphic novels',
    hasRating:   true,
    fields: [
      { key: 'isbn',        label: 'ISBN',           ph: '978-…',          type: 'text' },
      { key: 'publisher',   label: 'Publisher',      ph: 'Publisher name',  type: 'text' },
      { key: 'language',    label: 'Language',       ph: 'English',         type: 'text' },
      { key: 'genre',       label: 'Genre',          ph: 'Fiction, History…', type: 'text' },
      { key: 'pageCount',   label: 'Pages',          ph: '320',             type: 'number' },
      { key: 'cover',       label: 'Cover URL',      ph: 'https://…',       type: 'url' },
      { key: 'pageContent', label: 'Pages (content — separate each page with a blank line)', ph: 'Page 1 text…\n\nPage 2 text…', type: 'textarea' },
    ],
  },
  Films: {
    label:       'Film',
    icon:        '🎬',
    color:       '#e8c86c',
    description: 'Movies and short films',
    hasRating:   true,
    fields: [
      { key: 'director',  label: 'Director',        ph: 'Name',          type: 'text' },
      { key: 'cinemato',  label: 'Cinematographer', ph: 'Name',          type: 'text' },
      { key: 'genre',     label: 'Genre',           ph: 'Drama, Sci-Fi…', type: 'text' },
      { key: 'country',   label: 'Country',         ph: 'Country',       type: 'text' },
      { key: 'duration',  label: 'Duration (min)',  ph: '120',           type: 'number' },
      { key: 'language',  label: 'Language',        ph: 'English',       type: 'text' },
      { key: 'poster',    label: 'Poster URL',      ph: 'https://…',     type: 'url' },
    ],
  },
  Series: {
    label:       'Series',
    icon:        '📺',
    color:       '#8888ff',
    description: 'TV shows, miniseries, web series',
    hasRating:   true,
    fields: [
      { key: 'creator',  label: 'Creator',         ph: 'Name',             type: 'text' },
      { key: 'seasons',  label: 'Seasons',         ph: '3',                type: 'number' },
      { key: 'episodes', label: 'Episodes',        ph: '24',               type: 'number' },
      { key: 'status',   label: 'Show Status',     ph: 'Ongoing / Ended',  type: 'text' },
      { key: 'genre',    label: 'Genre',           ph: 'Drama, Comedy…',   type: 'text' },
      { key: 'network',  label: 'Network',         ph: 'HBO, Netflix…',    type: 'text' },
      { key: 'poster',   label: 'Poster URL',      ph: 'https://…',        type: 'url' },
    ],
  },
  Sounds: {
    label:       'Sound / Track',
    icon:        '🎵',
    color:       '#00dd38',
    description: 'Music, podcasts, field recordings',
    hasRating:   false,
    fields: [
      { key: 'artist',    label: 'Artist',       ph: 'Artist name',   type: 'text' },
      { key: 'album',     label: 'Album',        ph: 'Album name',    type: 'text' },
      { key: 'genre',     label: 'Genre',        ph: 'Jazz, Classical…', type: 'text' },
      { key: 'duration',  label: 'Duration',     ph: '3:42',          type: 'text' },
      { key: 'label',     label: 'Record Label', ph: 'Label name',    type: 'text' },
      { key: 'audioUrl',  label: 'Audio URL (mp3/ogg/wav)', ph: 'https://…', type: 'url' },
    ],
  },
  Artifacts: {
    label:       'Artifact',
    icon:        '🏺',
    color:       '#8a6a30',
    description: 'Physical objects, artworks, specimens',
    hasRating:   false,
    fields: [
      { key: 'medium',      label: 'Medium / Material', ph: 'Bronze, oil on canvas…', type: 'text' },
      { key: 'dimensions',  label: 'Dimensions',        ph: 'H × W × D cm',           type: 'text' },
      { key: 'culture',     label: 'Culture / Origin',  ph: 'Culture or region',      type: 'text' },
      { key: 'arLocation',  label: 'Current Location',  ph: 'Room, shelf, box',       type: 'text' },
      { key: 'acquisitionDate', label: 'Acquisition Date', ph: 'YYYY-MM-DD',          type: 'date' },
    ],
  },
  Architecture: {
    label:       'Building / Structure',
    icon:        '🏛️',
    color:       '#4488ff',
    description: 'Buildings, infrastructure, urban spaces',
    hasRating:   false,
    fields: [
      { key: 'architect',  label: 'Architect',    ph: 'Name',               type: 'text' },
      { key: 'arLocation', label: 'Location',     ph: 'City, Country',      type: 'text' },
      { key: 'style',      label: 'Style',        ph: 'Modernist, Baroque…', type: 'text' },
      { key: 'materials',  label: 'Materials',    ph: 'Concrete, steel…',   type: 'text' },
      { key: 'area',       label: 'Area (m²)',    ph: '1200',               type: 'number' },
    ],
  },
  Custom: {
    label:       'Custom',
    icon:        '✦',
    color:       '#aaaaaa',
    description: 'Anything else — flexible schema',
    hasRating:   false,
    fields: [
      { key: 'customField1', label: 'Field 1', ph: 'Value', type: 'text' },
      { key: 'customField2', label: 'Field 2', ph: 'Value', type: 'text' },
      { key: 'customField3', label: 'Field 3', ph: 'Value', type: 'text' },
    ],
  },
};

const ENTRY_TYPES = {
  Books: {
    label: 'Book / Document',
    icon: 'BK',
    color: '#b8864a',
    description: 'Library records, books, reports, scans',
    hasRating: true,
    fields: [
      { key: 'bookCategory', label: 'Book Category', type: 'select', options: ['Fiction', 'Genre Fiction', 'Poetry', 'Essay', 'Non-Fiction', 'Reference', 'Research', 'Mixed'] },
      { key: 'documentType', label: 'Document Type', type: 'select', options: ['Novel', 'Anthology', 'Graphic Novel', 'Manual', 'Report', 'Magazine', 'Journal', 'Zine', 'Thesis', 'Archive File', 'Letter', 'Other'] },
      { key: 'copyType', label: 'Copy Type', type: 'select', options: ['Physical', 'Digital / Online', 'Hybrid'] },
      { key: 'isbn', label: 'ISBN / Identifier', ph: '978...', type: 'text' },
      { key: 'publisher', label: 'Publisher', ph: 'Publisher name', type: 'text' },
      { key: 'language', label: 'Language', ph: 'English', type: 'text' },
      { key: 'genre', label: 'Genre / Subject', ph: 'History, horror, urban studies...', type: 'text' },
      { key: 'edition', label: 'Edition / Print', ph: 'First edition, scan v2...', type: 'text' },
      { key: 'pageCount', label: 'Pages', ph: '320', type: 'number' },
      { key: 'physicalLocation', label: 'Physical Copy Location', ph: 'Shelf A / Box 4', type: 'text' },
      { key: 'cover', label: 'Cover / Thumbnail URL', ph: 'https://...', type: 'url' },
      { key: 'readerUrl', label: 'Reader URL', ph: 'https://...', type: 'url' },
      { key: 'fileFormat', label: 'Digital File Format', type: 'select', options: ['PDF', 'EPUB', 'CBZ', 'DOCX', 'TXT', 'HTML', 'Image Set', 'Other'] },
      { key: 'source', label: 'Digital Source', type: 'select', options: ['Purchased', 'Scanned', 'Borrowed', 'Web Archive', 'Self-made', 'Shared', 'Unknown'] },
      { key: 'accessLevel', label: 'Access Level', type: 'select', options: ['Private', 'Restricted', 'Reference Only', 'Open Access'] },
      { key: 'scanQuality', label: 'Scan Quality', type: 'select', options: ['N/A', 'Low', 'Standard', 'High', 'Archival'] },
      { key: 'ocrStatus', label: 'OCR Status', type: 'select', options: ['N/A', 'Not Started', 'Partial', 'Complete', 'Verified'] },
      { key: 'digitalCondition', label: 'Digital Condition', type: 'select', options: ['Stable', 'Needs Backup', 'Corrupted', 'Missing Pages', 'Unknown'] },
      { key: 'pageContent', label: 'Reader Pages (separate pages with a blank line)', ph: 'Page 1 text\n\nPage 2 text', type: 'textarea' },
    ],
  },
  Films: {
    label: 'Film',
    icon: 'FM',
    color: '#e8c86c',
    description: 'Movies, shorts, documentaries',
    hasRating: true,
    fields: [
      { key: 'director', label: 'Director', ph: 'Director name', type: 'text' },
      { key: 'cinemato', label: 'Cinematographer', ph: 'Name', type: 'text' },
      { key: 'genre', label: 'Genre', type: 'select', options: ['Drama', 'Comedy', 'Action', 'Sci-Fi', 'Fantasy', 'Animation', 'Documentary', 'Horror', 'Romance', 'Thriller', 'Experimental', 'Mixed'] },
      { key: 'country', label: 'Country / Origin', ph: 'Country', type: 'text' },
      { key: 'duration', label: 'Duration (min)', ph: '120', type: 'number' },
      { key: 'language', label: 'Language', ph: 'English', type: 'text' },
      { key: 'releaseFormat', label: 'Format', type: 'select', options: ['Cinema', 'Blu-ray', 'DVD', 'Digital File', 'Streaming', 'VHS', 'Other'] },
      { key: 'watchPlatform', label: 'Platform / Shelf', ph: 'Criterion, NAS, shelf B', type: 'text' },
      { key: 'poster', label: 'Poster URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Series: {
    label: 'Series',
    icon: 'SR',
    color: '#8888ff',
    description: 'TV, miniseries, web series',
    hasRating: true,
    fields: [
      { key: 'creator', label: 'Creator', ph: 'Showrunner or creator', type: 'text' },
      { key: 'seasons', label: 'Seasons', ph: '3', type: 'number' },
      { key: 'episodes', label: 'Episodes', ph: '24', type: 'number' },
      { key: 'showStatus', label: 'Series Status', type: 'select', options: ['Ongoing', 'Ended', 'Paused', 'Upcoming'] },
      { key: 'genre', label: 'Genre', ph: 'Drama, mystery...', type: 'text' },
      { key: 'network', label: 'Network / Platform', ph: 'HBO, Netflix...', type: 'text' },
      { key: 'poster', label: 'Poster URL', ph: 'https://...', type: 'url' },
    ],
  },
  Sounds: {
    label: 'Sound / Track',
    icon: 'SD',
    color: '#00dd38',
    description: 'Music, podcasts, field recordings, audio notes',
    hasRating: false,
    fields: [
      { key: 'artist', label: 'Artist / Speaker', ph: 'Primary credit', type: 'text' },
      { key: 'album', label: 'Album / Collection', ph: 'Release or folder', type: 'text' },
      { key: 'genre', label: 'Genre', ph: 'Ambient, interview, archive...', type: 'text' },
      { key: 'duration', label: 'Duration', ph: '3:42', type: 'text' },
      { key: 'label', label: 'Label / Source', ph: 'Label, uploader, archive', type: 'text' },
      { key: 'audioFormat', label: 'Audio Format', type: 'select', options: ['MP3', 'OGG', 'WAV', 'M4A', 'AAC', 'FLAC', 'Stream URL', 'Other'] },
      { key: 'playerState', label: 'Player State', type: 'select', options: ['Ready', 'Looped', 'Paused', 'Archived', 'Reference Only'] },
      { key: 'coverArt', label: 'Cover / Waveform URL', ph: 'https://...', type: 'url' },
      { key: 'audioUrl', label: 'Audio URL', ph: 'https://...', type: 'url' },
      { key: 'audioNotes', label: 'Player / Metadata Notes', ph: 'Cue points, source notes, format caveats...', type: 'textarea' },
    ],
  },
  Artifacts: {
    label: 'Artifact',
    icon: 'AR',
    color: '#8a6a30',
    description: 'Objects, specimens, material culture',
    hasRating: false,
    fields: [
      { key: 'artifactType', label: 'Artifact Type', type: 'select', options: ['Tool', 'Document', 'Artwork', 'Specimen', 'Textile', 'Furniture', 'Relic', 'Instrument', 'Other'] },
      { key: 'medium', label: 'Material / Medium', type: 'select', options: ['Paper', 'Wood', 'Metal', 'Stone', 'Ceramic', 'Glass', 'Fabric', 'Mixed', 'Other'] },
      { key: 'dimensions', label: 'Dimensions', ph: 'H x W x D cm', type: 'text' },
      { key: 'functionUse', label: 'Function / Use', ph: 'Display, ritual, utility...', type: 'text' },
      { key: 'culture', label: 'Origin / Context', ph: 'Maker, culture, site, donor...', type: 'text' },
      { key: 'damageType', label: 'Damage Type', type: 'select', options: ['None', 'Surface Wear', 'Tear', 'Crack', 'Corrosion', 'Moisture', 'Pigment Loss', 'Structural Damage'] },
      { key: 'arLocation', label: 'Current Location', ph: 'Cabinet, box, shelf...', type: 'text' },
      { key: 'acquisitionDate', label: 'Acquisition Date', type: 'date' },
      { key: 'imageUrl', label: 'Primary Image URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Architecture: {
    label: 'Building / Structure',
    icon: 'AX',
    color: '#4488ff',
    description: 'Buildings, interiors, sites',
    hasRating: false,
    fields: [
      { key: 'architect', label: 'Architect / Studio', ph: 'Name', type: 'text' },
      { key: 'arLocation', label: 'Location', ph: 'City, district, country', type: 'text' },
      { key: 'style', label: 'Architecture Style', type: 'select', options: ['Modernist', 'Brutalist', 'Baroque', 'Gothic', 'Industrial', 'Vernacular', 'Contemporary', 'Mixed'] },
      { key: 'category', label: 'Category', type: 'select', options: ['Residential', 'Commercial', 'Institutional', 'Infrastructure', 'Landscape', 'Interior', 'Sacred', 'Other'] },
      { key: 'materials', label: 'Primary Materials', ph: 'Concrete, steel, brick...', type: 'text' },
      { key: 'area', label: 'Area (sq m)', ph: '1200', type: 'number' },
      { key: 'siteStatus', label: 'Site Status', type: 'select', options: ['Standing', 'Renovated', 'Ruin', 'Demolished', 'Concept Only'] },
      { key: 'imageUrl', label: 'Preview / Blueprint URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Clothes: {
    label: 'Clothing Piece',
    icon: 'CL',
    color: '#e6789f',
    description: 'Wardrobe pieces, outfits, lookbook references',
    hasRating: false,
    fields: [
      { key: 'mainCategory', label: 'Main Category', type: 'select', options: ['Top', 'Bottom', 'Full Piece', 'Shoes', 'Accessory', 'Add-On Piece'] },
      { key: 'subCategory', label: 'Sub Category', ph: 'Tank, skirt, boots, scarf...', type: 'text' },
      { key: 'styleTags', label: 'Style Tags', ph: 'soft grunge, archive, formal...', type: 'text' },
      { key: 'seasonality', label: 'Season / Weather', type: 'select', options: ['All Season', 'Warm', 'Cold', 'Rain', 'Evening', 'Special Occasion'] },
      { key: 'storage', label: 'Storage Field', ph: 'Closet rail A / box 2', type: 'text' },
      { key: 'colorway', label: 'Colorway', ph: 'Black, cream, olive...', type: 'text' },
      { key: 'materialBlend', label: 'Material Blend', ph: 'Cotton, wool, nylon...', type: 'text' },
      { key: 'fitNote', label: 'Fit / Alteration Notes', ph: 'Oversized, cropped, tailored...', type: 'textarea' },
      { key: 'lookbookName', label: 'Lookbook Group', ph: 'Autumn city / Stage outfit', type: 'text' },
      { key: 'imageUrl', label: 'Primary Image URL', ph: 'https://...', type: 'url' },
      { key: 'pngUrl', label: 'Transparent PNG URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Pets: {
    label: 'Pet / Animal',
    icon: 'PT',
    color: '#8a7cff',
    description: 'Pets, wildlife encounters, profile records',
    hasRating: false,
    fields: [
      { key: 'speciesGroup', label: 'Species Group', type: 'select', options: ['Cat', 'Dog', 'Horse', 'Insect', 'Bird', 'Reptile', 'Small Mammal', 'Other'] },
      { key: 'breedType', label: 'Breed / Type', ph: 'Bombay, husky, atlas moth...', type: 'text' },
      { key: 'encounterType', label: 'Encounter Type', type: 'select', options: ['Companion', 'Household', 'Rescue', 'Observed in Wild', 'Sanctuary', 'Temporary Guest'] },
      { key: 'habitat', label: 'Habitat / Environment', ph: 'Apartment, forest edge, field...', type: 'text' },
      { key: 'animalStatus', label: 'Status', type: 'select', options: ['Healthy', 'Needs Care', 'Missing', 'Deceased', 'Observed Once', 'Unknown'] },
      { key: 'lifeStage', label: 'Life Stage', type: 'select', options: ['Baby', 'Juvenile', 'Adult', 'Senior', 'Unknown'] },
      { key: 'dietNotes', label: 'Care / Diet Notes', ph: 'Food, meds, notes...', type: 'textarea' },
      { key: 'imageUrl', label: 'Profile Image URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Food: {
    label: 'Food / Drink',
    icon: 'FD',
    color: '#ff8b42',
    description: 'Meals, snacks, ingredients, cafe notes',
    hasRating: true,
    fields: [
      { key: 'foodType', label: 'Food Type', type: 'select', options: ['Meal', 'Snack', 'Dessert', 'Drink', 'Ingredient', 'Street Food', 'Packaged'] },
      { key: 'tasteRating', label: 'Taste Rating', type: 'select', options: ['1 - Avoid', '2 - Weak', '3 - Good', '4 - Excellent', '5 - Obsession'] },
      { key: 'cuisine', label: 'Cuisine / Origin', ph: 'Thai, homemade, bakery...', type: 'text' },
      { key: 'mealTime', label: 'Meal Time', type: 'select', options: ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late Night', 'Anytime'] },
      { key: 'placeEaten', label: 'Place Eaten', type: 'select', options: ['Home', 'Cafe', 'Restaurant', 'Street Stall', 'Delivery', 'Travel', 'Other'] },
      { key: 'pricePaid', label: 'Price / Purchase', ph: '12.90 / market haul', type: 'text' },
      { key: 'allergyWarning', label: 'Allergy / Warning', ph: 'Gluten, nuts, dairy...', type: 'text' },
      { key: 'ingredients', label: 'Ingredients / Notes', ph: 'Key ingredients or notes...', type: 'textarea' },
      { key: 'imageUrl', label: 'Primary Image URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Nature: {
    label: 'Nature Record',
    icon: 'NT',
    color: '#3ea56a',
    description: 'Plants, fungi, minerals, weather, field notes',
    hasRating: false,
    fields: [
      { key: 'natureCategory', label: 'Nature Category', type: 'select', options: ['Plant', 'Tree', 'Flower', 'Fungi', 'Rock / Mineral', 'Landscape', 'Weather', 'Body of Water', 'Soil / Terrain', 'Other'] },
      { key: 'speciesGuess', label: 'Identification', ph: 'Latin name or best guess', type: 'text' },
      { key: 'idConfidence', label: 'Identification Confidence', type: 'select', options: ['Low', 'Medium', 'High', 'Verified'] },
      { key: 'locationType', label: 'Location Type', type: 'select', options: ['Garden', 'Park', 'Forest', 'Street', 'Beach', 'Mountain', 'Indoor', 'Unknown'] },
      { key: 'habitat', label: 'Habitat / Environment', ph: 'Wet soil, shade, cliff edge...', type: 'text' },
      { key: 'encounterDate', label: 'Encounter Date', type: 'date' },
      { key: 'statusNote', label: 'Condition / Status', ph: 'Blooming, dried, active, damaged...', type: 'text' },
      { key: 'imageUrl', label: 'Primary Image URL', ph: 'https://...', type: 'url' },
      { key: 'gallery', label: 'Gallery URLs', ph: 'One URL per line', type: 'textarea' },
    ],
  },
  Custom: {
    label: 'Custom',
    icon: 'CU',
    color: '#aaaaaa',
    description: 'Anything else with a flexible schema',
    hasRating: false,
    fields: [
      { key: 'customField1', label: 'Field 1', ph: 'Value', type: 'text' },
      { key: 'customField2', label: 'Field 2', ph: 'Value', type: 'text' },
      { key: 'customField3', label: 'Field 3', ph: 'Value', type: 'text' },
    ],
  },
};

const FORM_VARIANTS = {
  Books: {
    chip: 'Library Intake',
    sectionTitles: {
      core: 'Bibliographic Record',
      dynamic: 'Edition Details',
      admin: 'Library Control',
      conservation: 'Preservation',
      review: 'Catalog Review',
    },
    labels: {
      code: 'Book ID',
      year: 'Publication Year',
      title: 'Book Title',
      creator: 'Author / Editor',
      condition: 'Copy Condition',
      responsible: 'Librarian / Owner',
      location: 'Shelf / Section',
      notes: 'Synopsis / Notes',
    },
    placeholders: {
      code: 'BK-2026-001',
      title: 'Book title',
      creator: 'Author, editor, or translator',
      responsible: 'Collection manager',
      location: 'Aisle, shelf, box...',
      notes: 'Synopsis, edition details, annotations, or reading notes...',
    },
    visibleSections: { rating: true, conservation: true, review: true },
  },
  Films: {
    chip: 'Screening Record',
    sectionTitles: {
      core: 'Film Overview',
      dynamic: 'Production Details',
      admin: 'Release Tracking',
      conservation: 'Archive Checks',
      review: 'Viewing Notes',
    },
    labels: {
      code: 'Film ID',
      year: 'Release Year',
      title: 'Film Title',
      creator: 'Director / Lead Creator',
      condition: 'Archive Quality',
      responsible: 'Curator / Owner',
      location: 'Shelf / Drive / Platform',
      notes: 'Plot / Notes',
    },
    placeholders: {
      code: 'FLM-2026-001',
      title: 'Feature or short title',
      creator: 'Director or studio lead',
      responsible: 'Programmer or archivist',
      location: 'Blu-ray shelf, NAS folder, or platform',
      notes: 'Plot, themes, cut notes, festival history...',
    },
    visibleSections: { rating: true, conservation: false, review: false },
  },
  Series: {
    chip: 'Series Tracker',
    sectionTitles: {
      core: 'Series Overview',
      dynamic: 'Run Details',
      admin: 'Watch Tracking',
      conservation: 'Archive Checks',
      review: 'Season Notes',
    },
    labels: {
      code: 'Series ID',
      year: 'First Air Year',
      title: 'Series Title',
      creator: 'Creator / Showrunner',
      condition: 'Archive Quality',
      responsible: 'Curator / Owner',
      location: 'Shelf / Drive / Platform',
      notes: 'Season / Story Notes',
    },
    placeholders: {
      code: 'SER-2026-001',
      title: 'Series title',
      creator: 'Creator or showrunner',
      responsible: 'Collection manager',
      location: 'Streaming service, drive, or shelf',
      notes: 'Arc notes, standout seasons, cast changes...',
    },
    visibleSections: { rating: true, conservation: false, review: false },
  },
  Sounds: {
    chip: 'Audio Log',
    sectionTitles: {
      core: 'Recording Overview',
      dynamic: 'Track Details',
      admin: 'Library Routing',
      conservation: 'Archive Checks',
      review: 'Listening Notes',
    },
    labels: {
      code: 'Track ID',
      year: 'Release Year',
      title: 'Track / Recording Title',
      creator: 'Primary Artist / Composer',
      condition: 'Audio Quality',
      responsible: 'Archivist / DJ',
      location: 'Playlist / Folder',
      notes: 'Listening Notes',
    },
    placeholders: {
      code: 'AUD-2026-001',
      title: 'Track, set, or recording title',
      creator: 'Artist, composer, or speaker',
      responsible: 'Curator or playlist owner',
      location: 'Playlist, folder, crate...',
      notes: 'Mood, source, standout moments, recording context...',
    },
    visibleSections: { rating: false, conservation: false, review: false },
  },
  Artifacts: {
    chip: 'Object Intake',
    sectionTitles: {
      core: 'Object Record',
      dynamic: 'Material Details',
      admin: 'Collection Control',
      conservation: 'Conservation',
      review: 'Curatorial Review',
    },
    labels: {
      code: 'Inventory No.',
      year: 'Date / Period',
      title: 'Object Name',
      creator: 'Maker / Attribution',
      condition: 'Object Condition',
      responsible: 'Registrar / Curator',
      location: 'Storage Location',
      notes: 'Provenance / Curatorial Notes',
    },
    placeholders: {
      code: 'ART-2026-001',
      title: 'Object title or common name',
      creator: 'Maker, workshop, or attributed culture',
      responsible: 'Registrar or curator',
      location: 'Cabinet, room, or shelf',
      notes: 'Origin, donor chain, exhibition context...',
    },
    visibleSections: { rating: false, conservation: true, review: true },
  },
  Architecture: {
    chip: 'Site Survey',
    sectionTitles: {
      core: 'Site Record',
      dynamic: 'Structure Details',
      admin: 'Project Control',
      conservation: 'Condition Survey',
      review: 'Assessment Notes',
    },
    labels: {
      code: 'Site ID',
      year: 'Completion Year',
      title: 'Project / Building Name',
      creator: 'Architect / Studio',
      condition: 'Site Condition',
      responsible: 'Survey Lead',
      location: 'Site / Address',
      notes: 'Context / Field Notes',
    },
    placeholders: {
      code: 'ARC-2026-001',
      title: 'Building or project name',
      creator: 'Architect or practice',
      responsible: 'Survey lead or project manager',
      location: 'Street, district, or coordinates',
      notes: 'Urban context, interventions, access notes...',
    },
    visibleSections: { rating: false, conservation: true, review: true },
  },
  Clothes: {
    chip: 'Wardrobe Record',
    sectionTitles: {
      core: 'Piece Overview',
      dynamic: 'Wardrobe Metadata',
      admin: 'Closet Control',
      conservation: 'Fabric Condition',
      review: 'Look Notes',
    },
    labels: {
      code: 'Piece ID',
      year: 'Acquired / Made Year',
      title: 'Piece Name',
      creator: 'Brand / Maker',
      condition: 'Wear Condition',
      responsible: 'Owner / Stylist',
      location: 'Storage Location',
      notes: 'Wardrobe Notes',
    },
    placeholders: {
      code: 'CL-2026-001',
      title: 'Piece or look title',
      creator: 'Brand, maker, or source',
      responsible: 'Owner or stylist',
      location: 'Closet / rack / case',
      notes: 'Fit, styling, repair, mood references...',
    },
    visibleSections: { rating: false, conservation: true, review: true },
  },
  Pets: {
    chip: 'Profile Record',
    sectionTitles: {
      core: 'Animal Overview',
      dynamic: 'Species Metadata',
      admin: 'Care Control',
      conservation: 'Health / Status',
      review: 'Observation Notes',
    },
    labels: {
      code: 'Animal ID',
      year: 'Birth / Encounter Year',
      title: 'Name / Profile Title',
      creator: 'Guardian / Source',
      condition: 'Condition',
      responsible: 'Primary Contact',
      location: 'Location',
      notes: 'Profile Notes',
    },
    placeholders: {
      code: 'PT-2026-001',
      title: 'Pet or encounter title',
      creator: 'Guardian, observer, or source',
      responsible: 'Caretaker or recorder',
      location: 'Home, habitat, or enclosure',
      notes: 'Behavior, health, memories, warnings...',
    },
    visibleSections: { rating: false, conservation: true, review: true },
  },
  Food: {
    chip: 'Tasting Log',
    sectionTitles: {
      core: 'Food Overview',
      dynamic: 'Taste Metadata',
      admin: 'Purchase Tracking',
      conservation: 'Freshness / Safety',
      review: 'Review Notes',
    },
    labels: {
      code: 'Food ID',
      year: 'Year',
      title: 'Dish / Product Name',
      creator: 'Maker / Restaurant',
      condition: 'Condition',
      responsible: 'Buyer / Taster',
      location: 'Place',
      notes: 'Taste Notes',
    },
    placeholders: {
      code: 'FD-2026-001',
      title: 'Dish or product name',
      creator: 'Restaurant, brand, or cook',
      responsible: 'Taster or shopper',
      location: 'Kitchen, cafe, city...',
      notes: 'Flavor notes, pairings, digestion notes...',
    },
    visibleSections: { rating: true, conservation: true, review: true },
  },
  Nature: {
    chip: 'Field Notebook',
    sectionTitles: {
      core: 'Encounter Overview',
      dynamic: 'Non-Human Field Metadata',
      admin: 'Observation Control',
      conservation: 'Condition / Status',
      review: 'Review Notes',
    },
    labels: {
      code: 'Field ID',
      year: 'Encounter Year',
      title: 'Observation Title',
      creator: 'Observer',
      condition: 'Condition',
      responsible: 'Recorder',
      location: 'Site',
      notes: 'Field Notes',
    },
    placeholders: {
      code: 'NT-2026-001',
      title: 'Species or landscape title',
      creator: 'Observer or collector',
      responsible: 'Recorder',
      location: 'Trail, park, district...',
      notes: 'Weather, terrain, nearby plants, light, moisture...',
    },
    visibleSections: { rating: false, conservation: true, review: true },
  },
  Custom: {
    chip: 'Flexible Record',
    sectionTitles: {
      core: 'General Record',
      dynamic: 'Custom Details',
      admin: 'Administration',
      conservation: 'Condition Notes',
      review: 'Review Notes',
    },
    labels: {
      code: 'Record ID',
      year: 'Year',
      title: 'Title',
      creator: 'Owner / Creator',
      condition: 'Condition',
      responsible: 'Responsible',
      location: 'Location',
      notes: 'Notes',
    },
    placeholders: {
      code: 'CUS-2026-001',
      title: 'Title',
      creator: 'Name',
      responsible: 'Responsible person',
      location: 'Where it lives',
      notes: 'Anything useful about this record...',
    },
    visibleSections: { rating: false, conservation: false, review: false },
  },
};

const TAB_TYPE_LABELS = {
  Books: 'Books',
  Films: 'Films',
  Series: 'Series',
  Sounds: 'Sounds',
  Artifacts: 'Artifacts',
  Architecture: 'Architecture',
  Clothes: 'Clothes',
  Pets: 'Pets',
  Food: 'Food',
  Nature: 'Nature',
  Custom: 'Collection',
};

// TAB_BEHAVIORS — maps a tab's type string to a behavior mode.
// Behavior modes control how renderByTabType() decides to render the content area.
const TAB_BEHAVIORS = {
  Books:        'books',
  Films:        'media',
  Series:       'media',
  Sounds:       'audio',
  Architecture: 'architecture',
  Artifacts:    'artifact',
  Clothes:      'clothes',
  Pets:         'pets',
  Food:         'food',
  Nature:       'nature',
  Custom:       'custom',
};

// Condition → color (used in sidebar bars and detail panel)
const COND_COLORS = {
  Excellent: '#6aab7a',
  Good:      '#c8a96e',
  Fair:      '#c8962e',
  Poor:      '#c0554a',
  Critical:  '#a03030',
};

// Status → CSS badge class suffix
const STATUS_BADGE = {
  'Draft':             'draft',
  'Pending Review':    'pending',
  'Approved':          'approved',
  'Needs Correction':  'correction',
  'Archived':          'archived',
};

const COLLECTION_ROOMS = {
  Books: 'Library Room',
  Films: 'Screening Room',
  Series: 'Screening Room',
  Sounds: 'Sound Booth',
  Artifacts: 'Museum Storage',
  Architecture: 'Blueprint Desk',
  Clothes: 'Closet',
  Pets: 'Animal Profiles',
  Food: 'Tasting Table',
  Nature: 'Field Notebook',
  Custom: 'Custom Room',
};

const EMPTY_STATE_COPY = {
  Books: 'No books catalogued yet. Start your shelf.',
  Films: 'Your screening room is empty.',
  Series: 'Your screening room is empty.',
  Sounds: 'No sounds in the booth yet.',
  Artifacts: 'No objects in this cabinet.',
  Architecture: 'No sites surveyed yet.',
  Clothes: 'No wardrobe pieces added yet.',
  Pets: 'No animal profiles yet.',
  Food: 'No tasting notes yet.',
  Nature: 'No field records yet.',
  Custom: 'No custom entries yet.',
};

const STORAGE_KEY = 'dump_v4';
const LEGACY_STORAGE_KEYS = ['vault_v3'];
const SOUND_WORKSPACE_DEFAULT_KEY = 'dump_sound_player_default_v1';
const TEST_SEED_VERSION = 2;
const TEST_SEED_TYPE_COUNTS = {
  Books: 6,
  Films: 6,
  Series: 6,
  Sounds: 6,
  Artifacts: 6,
  Architecture: 5,
  Clothes: 5,
  Pets: 5,
  Food: 5,
  Nature: 5,
  Custom: 5,
};

function getTypeDef(type) {
  return ENTRY_TYPES[type] || ENTRY_TYPES.Custom;
}

function hexToRgba(hex, alpha = 1) {
  const clean = String(hex || '').trim().replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(ch => ch + ch).join('')
    : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return `rgba(90, 125, 179, ${alpha})`;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getFormVariant(type) {
  const base = {
    chip: getTypeDef(type).label,
    sectionTitles: {
      core: 'Core Record',
      dynamic: `${getTypeDef(type).label} Fields`,
      admin: 'Administration',
      conservation: 'Conservation',
      review: 'Review',
    },
    labels: {
      code: 'Accession No.',
      year: 'Year',
      title: 'Title',
      creator: 'Creator / Author / Artist',
      condition: 'Condition',
      status: 'Status',
      responsible: 'Responsible',
      location: 'Physical Location',
      consState: 'Conservation State',
      consPriority: 'Priority',
      consDesc: 'Description',
      consRisks: 'Identified Risks',
      consLastInsp: 'Last Inspection',
      consNextInsp: 'Next Inspection',
      consInspector: 'Inspector',
      consRecs: 'Recommendations',
      reviewer: 'Reviewer',
      reviewNote: 'Review Note',
      notes: 'Provenance / Notes',
    },
    placeholders: {
      code: 'e.g. REC-2026-001',
      title: 'Full title',
      creator: 'Name',
      responsible: 'Curator',
      location: 'Room, shelf, box...',
      notes: 'Origin, acquisition history...',
    },
    visibleSections: {
      rating: getTypeDef(type).hasRating,
      conservation: true,
      review: true,
    },
  };

  const custom = FORM_VARIANTS[type] || FORM_VARIANTS.Custom;
  return {
    chip: custom.chip || base.chip,
    sectionTitles: { ...base.sectionTitles, ...(custom.sectionTitles || {}) },
    labels: { ...base.labels, ...(custom.labels || {}) },
    placeholders: { ...base.placeholders, ...(custom.placeholders || {}) },
    visibleSections: { ...base.visibleSections, ...(custom.visibleSections || {}) },
  };
}


/* ─────────────────────────────────────────────────────────
   SECTION 2 — STATE
   ───────────────────────────────────────────────────────── */

let nextId         = 1;
let activeTabId    = null;
let activeView     = 'home';
let activeHomeStatus = '';
let selectedId     = null;
let editingId      = null;
let editingType    = null;   // NEW — type string used in the open modal
let confirmCb      = null;
let ratingValue    = 0;      // NEW — current star selection in modal
let typePickerAction = null;

let sortKey  = 'code';
let sortDir  = 1;
let entryViewMode = 'table';

let searchQuery     = '';
let condFilterVal   = '';
let statusFilterVal = '';
let sidebarCollapsed = localStorage.getItem('dump_sidebar_collapsed') !== '0';
let testSeedVersion = 0;

let tabs = [];

// Audio player state (Section 24)
let audioEl            = new Audio();
let audioPlaylist      = [];   // entries with audioUrl from the active Sounds tab
let audioCurrentIndex  = 0;
let audioCurrentEntry  = null;
let isPlayerOpen       = false;
let isPlayerMinimized  = false;

// Book viewer state (Section 25)
let bookEntry      = null;
let bookPages      = [];   // array of page content strings
let bookPageIndex  = 0;    // 0 = cover, 1+ = page pairs
let activeWorkspace = Object.create(null);
let modalAttachments = [];

const ASSET_DB_NAME = 'dump_assets_v1';
const ASSET_STORE_NAME = 'assets';
const ASSET_REF_PREFIX = 'dump-asset:';
const assetUrlCache = new Map();


/* ─────────────────────────────────────────────────────────
   SECTION 3 — PERSISTENCE
   ───────────────────────────────────────────────────────── */

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nextId, tabs, activeWorkspace, testSeedVersion }));
  } catch (e) {
    showToast('Storage error — data could not be saved.');
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
      || LEGACY_STORAGE_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
    if (!raw) return false;
    const data = JSON.parse(raw);
    nextId = data.nextId || 1;
    tabs   = (data.tabs || []).map(migrateTab);
    activeWorkspace = data.activeWorkspace || Object.create(null);
    testSeedVersion = data.testSeedVersion || 0;
    if (tabs.length) { activeTabId = tabs[0].id; return true; }
  } catch (e) {
    console.error('DUMP: load error', e);
  }
  return false;
}

function migrateTab(tab) {
  tab.entries = (tab.entries || []).map(entry => migrateEntry(entry, tab.type));
  return tab;
}

function migrateEntry(e, fallbackType = '') {
  if (!e.status)       e.status       = 'Draft';
  if (!e.location)     e.location     = '';
  if (!e.responsible)  e.responsible  = '';
  if (!e.updatedAt)    e.updatedAt    = e.createdAt || new Date().toISOString();
  if (!e.entryType)    e.entryType    = fallbackType || '';
  if (!Array.isArray(e.attachments)) e.attachments = [];
  if (!e.rating)       e.rating       = { score: 0, favorite: false };
  if (typeof e.rating.favorite !== 'boolean') e.rating.favorite = !!e.favorite;
  if (!e.review) e.review = { status: 'Pending', reviewer: '', note: '', reviewedAt: '' };
  if (!e.conservation) e.conservation = {
    state: e.condition || 'Good', description: '', risks: '',
    priority: 'Low', lastInspection: '', nextInspection: '', inspector: '', recommendations: '',
  };
  return e;
}

function isAssetRef(value) {
  return typeof value === 'string' && value.startsWith(ASSET_REF_PREFIX);
}

function assetIdFromRef(ref) {
  return isAssetRef(ref) ? ref.slice(ASSET_REF_PREFIX.length) : '';
}

function makeAssetRef(id) {
  return `${ASSET_REF_PREFIX}${id}`;
}

function openAssetDb() {
  if (!window.indexedDB) return Promise.reject(new Error('IndexedDB unavailable'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ASSET_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        db.createObjectStore(ASSET_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function assetTransaction(mode = 'readonly') {
  return openAssetDb().then(db => {
    const tx = db.transaction(ASSET_STORE_NAME, mode);
    tx.oncomplete = () => db.close();
    tx.onabort = tx.onerror = () => db.close();
    return tx.objectStore(ASSET_STORE_NAME);
  });
}

async function putAsset(asset) {
  const store = await assetTransaction('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(asset);
    request.onsuccess = () => resolve(asset);
    request.onerror = () => reject(request.error);
  });
}

async function getAsset(refOrId) {
  const id = assetIdFromRef(refOrId) || refOrId;
  if (!id) return null;
  const store = await assetTransaction('readonly');
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function deleteAsset(refOrId) {
  const id = assetIdFromRef(refOrId) || refOrId;
  if (!id) return;
  const cached = assetUrlCache.get(id);
  if (cached) URL.revokeObjectURL(cached);
  assetUrlCache.delete(id);
  const store = await assetTransaction('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function createAssetFromFile(file) {
  if (!file) return null;
  const id = `asset_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const asset = {
    id,
    name: file.name || 'uploaded-file',
    type: file.type || 'application/octet-stream',
    size: file.size || 0,
    blob: file,
    createdAt: new Date().toISOString(),
  };
  await putAsset(asset);
  return {
    ref: makeAssetRef(id),
    name: asset.name,
    type: asset.type,
    size: asset.size,
    createdAt: asset.createdAt,
  };
}

async function getAssetObjectUrl(ref) {
  const id = assetIdFromRef(ref);
  if (!id) return ref || '';
  if (assetUrlCache.has(id)) return assetUrlCache.get(id);
  const asset = await getAsset(id);
  if (!asset?.blob) return '';
  const url = URL.createObjectURL(asset.blob);
  assetUrlCache.set(id, url);
  return url;
}

function safeUrl(value, kind = 'link') {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (isAssetRef(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^blob:/i.test(raw)) return raw;
  if (kind === 'image' && /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i.test(raw)) return raw;
  if (kind === 'audio' && /^data:audio\/(?:mpeg|mp3|wav|ogg|webm|aac|flac|mp4);base64,/i.test(raw)) return raw;
  if (kind === 'link' && /^data:(?:image\/(?:png|jpe?g|gif|webp|avif)|audio\/(?:mpeg|mp3|wav|ogg|webm|aac|flac|mp4));base64,/i.test(raw)) return raw;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(raw) && !raw.startsWith('//') && !raw.includes('\\') && !/[<>"`]/.test(raw)) return raw;
  return '';
}

function mediaAttrs(src) {
  if (isAssetRef(src)) return `data-asset-ref="${esc(src)}"`;
  return `src="${esc(safeUrl(src, 'image'))}"`;
}

function renderAssetLink(ref, label = 'Open uploaded file') {
  if (isAssetRef(ref)) {
    return `<a class="asset-link" href="#" target="_blank" rel="noopener noreferrer" data-asset-ref="${esc(ref)}">${esc(label)}</a>`;
  }
  return `<a class="asset-link" href="${esc(safeUrl(ref, 'link') || '#')}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
}

function renderDetailFieldValue(field, value) {
  if (!value) return '';
  if (isAssetRef(value)) return renderAssetLink(value, 'Uploaded file');
  if (field.type === 'url' && safeUrl(value, 'link')) return renderAssetLink(value, 'Open link');
  return esc(value);
}

function renderAttachmentLinks(attachments = []) {
  return normalizeAttachments(attachments).map(item => `
    <a class="attachment-link" href="#" target="_blank" rel="noopener noreferrer" download="${esc(item.name || 'uploaded-file')}" data-asset-ref="${esc(item.ref)}">
      <strong>${esc(item.name || 'uploaded-file')}</strong>
      <span>${esc([item.type || 'file', formatFileSize(item.size)].filter(Boolean).join(' / '))}</span>
    </a>`).join('');
}

async function openLocalAsset(ref, fallbackUrl = '') {
  const pendingWindow = isAssetRef(ref) ? window.open('about:blank', '_blank') : null;
  const url = isAssetRef(ref) ? await getAssetObjectUrl(ref) : safeUrl(fallbackUrl || ref, 'link');
  if (!url) {
    if (pendingWindow) pendingWindow.close();
    return;
  }
  if (pendingWindow) pendingWindow.location.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
}

function hydrateAssetElements(root = document) {
  root.querySelectorAll('[data-asset-ref]').forEach(el => {
    const ref = el.dataset.assetRef;
    getAssetObjectUrl(ref)
      .then(url => {
        if (!url) return;
        if (el.tagName === 'A') el.href = url;
        else el.src = url;
      })
      .catch(() => {
        if (el.tagName === 'IMG') el.style.display = 'none';
      });
  });
  bindMediaErrorHandlers(root);
}

function bindMediaErrorHandlers(root = document) {
  root.querySelectorAll('img').forEach(img => {
    if (img.dataset.mediaErrorBound === '1') return;
    img.dataset.mediaErrorBound = '1';
    img.addEventListener('error', () => {
      if (img.closest('.detail-gallery-strip')) img.remove();
      else img.style.display = 'none';
    });
  });
}


/* ─────────────────────────────────────────────────────────
   SECTION 4 — FACTORIES
   ───────────────────────────────────────────────────────── */

function mkTab(name, type) {
  return { id: nextId++, name, type: type || name, entries: [] };
}

function mkEntry(fields) {
  const now = new Date().toISOString();
  return {
    id: nextId++, createdAt: now, updatedAt: now,
    status: 'Draft', location: '', responsible: '',
    entryType: '',
    rating: { score: 0, favorite: false },
    review: { status: 'Pending', reviewer: '', note: '', reviewedAt: '' },
    conservation: {
      state: 'Good', description: '', risks: '', priority: 'Low',
      lastInspection: '', nextInspection: '', inspector: '', recommendations: '',
    },
    ...fields,
  };
}


/* ─────────────────────────────────────────────────────────
   SECTION 5 — DOM REFERENCES
   ───────────────────────────────────────────────────────── */

const TEST_SEED_PREFIX = {
  Books: 'BK',
  Films: 'FM',
  Series: 'SR',
  Sounds: 'SD',
  Artifacts: 'AR',
  Architecture: 'AX',
  Clothes: 'CL',
  Pets: 'PT',
  Food: 'FD',
  Nature: 'NT',
  Custom: 'CU',
};

const TEST_SEED_TITLES = {
  Books: ['Atlas of Quiet Rooms', 'Manual for Rain Maps', 'Letters from the Blue Shelf', 'Field Notes on Dust', 'The Paper Observatory', 'Small Guide to Vanishing Cities'],
  Films: ['Window of Mercury', 'The Last Tram at Noon', 'Blue Static', 'Archive of Soft Lights', 'Harbor Without Shadows', 'A Garden After Midnight'],
  Series: ['Signal House', 'North Wing Files', 'After the Museum Closes', 'Low Battery Summer', 'The Glass District', 'Nine Rooms'],
  Sounds: ['Rain Test 04', 'Basement Synth Loop', 'Morning Market Tape', 'Window Fan Drone', 'Old Keyboard Clicks', 'Station Platform Ambience'],
  Artifacts: ['Brass Compass Fragment', 'Folded Theater Ticket', 'Ceramic Number Tile', 'Glass Sample Jar', 'Painted Drawer Pull', 'Transit Token Set'],
  Architecture: ['Orchid Archive Hall', 'Pale Bridge Study', 'Station Kiosk Prototype', 'Courtyard House Index', 'East Reservoir Steps', 'Glass Atrium Note'],
  Clothes: ['Charcoal Field Jacket', 'Blue Archive Shirt', 'Rainwalk Boots', 'Ivory Knit Vest', 'Signal Scarf', 'Studio Work Trousers'],
  Pets: ['Milo Observation Card', 'Saffron Rescue Profile', 'Tiny Moth Encounter', 'Old Garden Cat', 'Pond Turtle Note', 'Street Dog Intake'],
  Food: ['Lemon Rice Bowl', 'Night Market Tea', 'Spiced Plum Tart', 'Cold Noodle Test', 'Honey Toast Sample', 'Green Soup Batch'],
  Nature: ['Fern Under Glass', 'Cloud Line Survey', 'Moss Wall Sample', 'River Stone Log', 'Dawn Fungi Note', 'Courtyard Rain Record'],
  Custom: ['Prototype Drawer A', 'Workshop Reminder Set', 'Loose Idea Bundle', 'Reference Packet 12', 'Desk Inventory Note', 'Unsorted Archive Object'],
};

const TEST_SEED_CREATORS = {
  Books: ['Irene Vale', 'Marco Lins', 'Naomi Hart', 'Celeste Prado', 'Rafael Moon', 'Ana Brook'],
  Films: ['Tomas Leal', 'Helena Park', 'Mina Torres', 'Jonas Rivers', 'Clara Diniz', 'Noah Sato'],
  Series: ['Beatriz North', 'Luca Ramos', 'Marta Silva', 'Theo Crane', 'Nina Fox', 'Elias Vale'],
  Sounds: ['Cassette Lab', 'Dora Fielding', 'Metro Archive Unit', 'Soft Circuit Club', 'Lina Duarte', 'Room Tone Dept.'],
  Artifacts: ['Unknown maker', 'Archive donor 17', 'M. Costa Studio', 'North Pier Workshop', 'Estate collection', 'Field recovery team'],
  Architecture: ['Vale & Pires Studio', 'Lima Modular', 'Casa Norte Office', 'Bento Field Works', 'Studio Arco', 'Public Works Unit'],
  Clothes: ['Atelier Soma', 'Archive Wardrobe', 'R. Nogueira', 'Fieldwear Co.', 'Mina Pattern House', 'Studio Linha'],
  Pets: ['Care Team A', 'Temporary Foster Log', 'Field Observer Lina', 'Animal Desk', 'Park Survey Team', 'Household Record'],
  Food: ['Kitchen Test Bench', 'Cafe Azul', 'Market Stall 12', 'Mara Bento', 'Night Pantry', 'Rosa Ferment Lab'],
  Nature: ['Field Observer N.', 'Garden Survey Unit', 'River Walk Log', 'North Trail Desk', 'Greenhouse Team', 'Weather Notebook'],
  Custom: ['System Test', 'Archive Desk', 'Workspace Review', 'Loose Records Team', 'Index Builder', 'QA Collection'],
};

const TEST_SEED_IMAGE_URLS = {
  Books: [
    'https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9zdGF0aWMvaW1hZ2Uvd2Vic2l0ZS8yMDIyLTA0L2xyL3B4MTYzNTA5NS1pbWFnZS1rd3Z2bDBmdC5qcGc.jpg',
  ],
  Films: [
    'https://upload.wikimedia.org/wikipedia/commons/0/02/35mm_movie_negative.jpg',
  ],
  Series: [
    'https://upload.wikimedia.org/wikipedia/commons/4/47/Vintage_television_%28Unsplash%29.jpg',
  ],
  Sounds: [
    'https://upload.wikimedia.org/wikipedia/commons/f/f0/Compactcassette.jpg',
  ],
  Artifacts: [
    'https://collectionapi.metmuseum.org/api/collection/v1/iiif/250567/511851/main-image',
  ],
  Architecture: [
    'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fallingwater3.jpg',
  ],
  Clothes: [
    'https://upload.wikimedia.org/wikipedia/commons/0/0d/Safari-Jacket.JPG',
  ],
  Pets: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/European_shorthair_portrait_2_Quincy.jpg',
  ],
  Food: [
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Dolsot-bibimbap.jpg',
  ],
  Nature: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Selaginella_longipinna_176348304.jpg',
  ],
  Custom: [
    'https://images.rawpixel.com/image_png_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsb2ZmaWNlMjBfd2F0ZXJjb2xvcl9vZl9hX2hhbmRfd3JpdGluZ19vbl9ub3RlYm9va19zaW1wbF9hMmZjYTFmZC1kYTk4LTRmMjUtODRjNi04MTI2NjZiNWRlZWFfMS5wbmc.png',
  ],
};

function seedPick(list, index, offset = 0) {
  return list[(index + offset) % list.length];
}

function seedPad(value, size = 3) {
  return String(value).padStart(size, '0');
}

function seedDate(index, year = 2026) {
  const month = seedPad((index % 12) + 1, 2);
  const day = seedPad(((index * 5) % 27) + 1, 2);
  return `${year}-${month}-${day}`;
}

function seedIsoDate(index) {
  const hour = seedPad(8 + (index % 10), 2);
  return `${seedDate(index, 2026)}T${hour}:00:00.000Z`;
}

function seedSlug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function makeTestSeedCode(type, index) {
  return `TST-${TEST_SEED_PREFIX[type] || 'DM'}-${seedPad(index + 1)}`;
}

function seedUrl(type, key, index, ext = 'jpg') {
  return `https://example.com/dump-test/${seedSlug(type)}/${seedPad(index + 1)}-${seedSlug(key)}.${ext}`;
}

function seedImageUrl(type, index) {
  return seedPick(TEST_SEED_IMAGE_URLS[type] || TEST_SEED_IMAGE_URLS.Custom, index);
}

function seedGalleryUrls(type, index) {
  const primary = seedImageUrl(type, index);
  const fallback = seedImageUrl(type, index + 1);
  return primary === fallback ? primary : `${primary}\n${fallback}`;
}

function isSeedImageFieldKey(key) {
  return ['cover', 'poster', 'imageUrl', 'coverArt', 'pngUrl'].includes(key);
}

function seedNumberValue(key, index, globalIndex) {
  if (key === 'pageCount') return 96 + (index * 42);
  if (key === 'duration') return 74 + ((globalIndex * 13) % 66);
  if (key === 'seasons') return 1 + (index % 5);
  if (key === 'episodes') return 6 + (index * 4);
  if (key === 'area') return 180 + (globalIndex * 37);
  return 10 + globalIndex;
}

function seedTextareaValue(type, key, index, globalIndex) {
  if (key === 'gallery') {
    return seedGalleryUrls(type, index);
  }
  if (key === 'pageContent') {
    return `Page 1: Test reading text for ${seedPick(TEST_SEED_TITLES[type] || TEST_SEED_TITLES.Custom, index)}.\n\nPage 2: Notes, margin marks, and sample transcription data for database testing.\n\nPage 3: Closing page with invented archive context and review clues.`;
  }
  if (key === 'audioNotes') return `Cue points checked at 00:12 and 01:48. Test waveform metadata generated for playback validation ${globalIndex + 1}.`;
  if (key === 'fitNote') return `Fit is intentionally documented for testing: relaxed shoulder, clean hem, storage-ready condition ${index + 1}.`;
  if (key === 'dietNotes') return `Care note: routine feeding observed, hydration checked, follow-up reminder added for test cycle ${index + 1}.`;
  if (key === 'ingredients') return `Invented ingredient list: citrus, toasted grain, herb oil, sea salt, and batch note ${index + 1}.`;
  return `Detailed test notes for ${type} record ${index + 1}. This field is filled to validate long text, wrapping, and export behavior.`;
}

function seedTextValue(type, key, index, globalIndex) {
  const person = seedPick(TEST_SEED_CREATORS[type] || TEST_SEED_CREATORS.Custom, index, globalIndex);
  const textPools = {
    publisher: ['North Pier Press', 'Blue Shelf Editions', 'Small Lantern House', 'River Index Books'],
    language: ['Portuguese', 'English', 'Spanish', 'French'],
    genre: ['Archive drama', 'Urban fieldwork', 'Soft science fiction', 'Material culture', 'Domestic mystery'],
    edition: ['First test edition', 'Annotated scan v2', 'Reading copy', 'Reference proof'],
    physicalLocation: ['Shelf A / Box 04', 'Cabinet 2 / Row B', 'Digital folder TEST-LIB', 'Archive cart 3'],
    director: ['Tomas Leal', 'Helena Park', 'Nadia Costa', 'Julian Morais'],
    cinemato: ['Lia Moreno', 'Andre Vale', 'Sofia Kent', 'Rui Campos'],
    country: ['Brazil', 'Portugal', 'Canada', 'Japan', 'Chile'],
    watchPlatform: ['Screening drive A', 'NAS cinema folder', 'Blu-ray shelf B', 'Streaming watchlist'],
    creator: ['Beatriz North', 'Luca Ramos', 'Marta Silva', 'Theo Crane'],
    network: ['Northline TV', 'Lumen Stream', 'Public Channel 8', 'Archive Web'],
    artist: ['Cassette Lab', 'Dora Fielding', 'Room Tone Dept.', 'Soft Circuit Club'],
    album: ['Test Signals', 'Field Folder 06', 'Room Tones', 'Collected Drafts'],
    duration: ['02:48', '03:35', '05:12', '11:09', '28:40'],
    label: ['Field Desk', 'Blue Tape Archive', 'Independent upload', 'Studio notebook'],
    dimensions: ['12 x 8 x 3 cm', '24 x 18 x 2 cm', '41 x 30 x 9 cm', '7 x 7 x 1 cm'],
    functionUse: ['Reference display', 'Handling study', 'Material comparison', 'Storage test'],
    culture: ['Donor collection', 'Local workshop', 'Transit archive', 'Unknown domestic context'],
    arLocation: ['Cabinet 4 / Tray A', 'Blueprint drawer 2', 'North shelf 7', 'Site folder AX'],
    architect: ['Vale & Pires Studio', 'Lima Modular', 'Casa Norte Office', 'Studio Arco'],
    materials: ['Concrete, glass, and steel', 'Brick, wood, and tile', 'Stone, lime, and iron', 'Timber and translucent panels'],
    subCategory: ['Overshirt', 'Work trouser', 'Rain boot', 'Knit layer', 'Utility scarf'],
    styleTags: ['archive casual, rainy day', 'studio uniform, soft contrast', 'fieldwear, compact storage'],
    storage: ['Closet rail A', 'Box 2 / Folded', 'Garment bag 04', 'Shoe shelf lower'],
    colorway: ['Charcoal / blue', 'Ivory / olive', 'Black / brass', 'Dusty rose / grey'],
    materialBlend: ['Cotton twill', 'Wool blend', 'Waxed canvas', 'Linen and nylon'],
    lookbookName: ['Rain Desk', 'Archive Errands', 'Studio Morning', 'Travel Capsule'],
    breedType: ['Mixed breed', 'Bombay type', 'Garden moth', 'Pond turtle', 'Street dog'],
    habitat: ['Apartment balcony', 'Shaded courtyard', 'Park edge', 'Garden wall', 'Temporary foster room'],
    cuisine: ['Brazilian comfort', 'Japanese-inspired', 'Market fusion', 'Home test kitchen'],
    pricePaid: ['R$ 18.90 / test receipt', 'R$ 32.00 / market note', 'R$ 12.50 / cafe slip', 'R$ 44.10 / batch cost'],
    allergyWarning: ['Contains dairy', 'May contain nuts', 'Gluten present', 'No known warning'],
    speciesGuess: ['Nephrolepis test fern', 'Urban moss sample', 'River quartz', 'Pleurotus-like fungi'],
    statusNote: ['Stable and observed twice', 'Blooming after rain', 'Dry edge noted', 'Needs later identification'],
    customField1: ['QA marker alpha', 'Loose tag set', 'Prototype shelf note', 'Manual test bundle'],
    customField2: ['Priority medium', 'Linked to workspace review', 'Needs UI scan', 'Ready for export'],
    customField3: ['Batch 60 seed', 'Regression test item', 'Demo database record', 'Temporary invented data'],
  };
  if (key === 'isbn') return `978-1-${seedPad(43000 + globalIndex, 5)}-${seedPad(100 + index)}`;
  return seedPick(textPools[key] || [`${person} test value`, `${type} sample ${index + 1}`, `Filled ${key} field`], index, globalIndex);
}

function seedFieldValue(type, field, index, globalIndex) {
  if (field.type === 'select') return seedPick(field.options || ['Test'], index, globalIndex);
  if (field.type === 'date') return seedDate(globalIndex, 2024);
  if (field.type === 'number') return seedNumberValue(field.key, index, globalIndex);
  if (field.type === 'url') {
    if (isSeedImageFieldKey(field.key)) return seedImageUrl(type, index);
    if (field.key === 'audioUrl') return seedUrl(type, field.key, index, 'mp3');
    if (field.key === 'readerUrl') return seedUrl(type, field.key, index, 'html');
    return seedUrl(type, field.key, index);
  }
  if (field.type === 'textarea') return seedTextareaValue(type, field.key, index, globalIndex);
  return seedTextValue(type, field.key, index, globalIndex);
}

function buildTestSeedEntry(type, index, globalIndex) {
  const typeDef = getTypeDef(type);
  const status = seedPick(['Draft', 'Pending Review', 'Approved', 'Needs Correction', 'Archived'], globalIndex);
  const title = seedPick(TEST_SEED_TITLES[type] || TEST_SEED_TITLES.Custom, index);
  const creator = seedPick(TEST_SEED_CREATORS[type] || TEST_SEED_CREATORS.Custom, index, globalIndex);
  const condition = seedPick(['Excellent', 'Good', 'Fair', 'Poor'], globalIndex);
  const consState = seedPick(['Excellent', 'Good', 'Fair', 'Poor', 'Critical'], globalIndex + 1);
  const reviewed = ['Approved', 'Needs Correction'].includes(status);
  const dynamicValues = Object.fromEntries(
    typeDef.fields.map(field => [field.key, seedFieldValue(type, field, index, globalIndex)])
  );

  const entry = mkEntry({
    createdAt: seedIsoDate(globalIndex),
    updatedAt: seedIsoDate(globalIndex + 6),
    code: makeTestSeedCode(type, index),
    title,
    entryType: type,
    year: 1992 + ((globalIndex * 3) % 34),
    creator,
    condition,
    notes: `Invented test record for ${type}. Includes complete metadata, admin details, review state, and filled dynamic fields for database testing.`,
    status,
    responsible: seedPick(['Ana QA', 'Rafa Index', 'Mina Curator', 'Leo Archive', 'Clara Review'], globalIndex),
    location: seedPick(['Room A / Shelf 1', 'Room B / Drawer 3', 'Digital Vault / Test', 'Workspace Table 2', 'Archive Cart 5'], globalIndex),
    rating: {
      score: typeDef.hasRating ? ((globalIndex % 5) + 1) : 0,
      favorite: typeDef.hasRating && globalIndex % 4 === 0,
    },
    attachments: [],
    conservation: {
      state: consState,
      priority: seedPick(['Low', 'Medium', 'High'], globalIndex),
      description: `Condition summary for test item ${globalIndex + 1}: visible state recorded and ready for review.`,
      risks: seedPick(['Low humidity variation', 'Handling marks', 'Metadata mismatch', 'Backup required', 'Light exposure'], globalIndex),
      lastInspection: seedDate(globalIndex, 2025),
      nextInspection: seedDate(globalIndex + 4, 2026),
      inspector: seedPick(['Inspector Vale', 'N. Prado', 'QA Conservator', 'Field Desk'], globalIndex),
      recommendations: 'Keep as database test sample; verify filters, export, detail panel, and workspace cards.',
    },
    review: {
      reviewer: seedPick(['Review Desk', 'Lia QA', 'Marco Curator', 'Nina Index'], globalIndex),
      note: `Review note generated for seed item ${globalIndex + 1}. Status and completeness are intentional for testing.`,
      status: status === 'Approved' ? 'Approved' : status === 'Needs Correction' ? 'Needs Correction' : 'Pending',
      reviewedAt: reviewed ? seedIsoDate(globalIndex + 8) : '',
    },
    ...dynamicValues,
  });

  return applyTestSeedImages(entry, type, index);
}

function applyTestSeedImages(entry, type, index) {
  const imageUrl = seedImageUrl(type, index);
  const gallery = seedGalleryUrls(type, index);

  if (type === 'Books') entry.cover = imageUrl;
  else if (type === 'Films' || type === 'Series') entry.poster = imageUrl;
  else if (type === 'Sounds') entry.coverArt = imageUrl;
  else entry.imageUrl = imageUrl;

  if (['Films', 'Artifacts', 'Architecture', 'Clothes', 'Pets', 'Food', 'Nature'].includes(type)) {
    entry.gallery = gallery;
  }

  if (type === 'Clothes') entry.pngUrl = imageUrl;
  if (type === 'Custom') entry.imageUrl = imageUrl;
  entry.updatedAt = new Date().toISOString();
  return entry;
}

function ensureTestSeedTab(type) {
  let tab = tabs.find(item => item.type === type);
  if (!tab) {
    tab = mkTab(uniqueTabName(TAB_TYPE_LABELS[type] || type), type);
    tabs.push(tab);
  }
  if (WORKSPACE_GROUPS[type]?.length && !activeWorkspace[tab.id]) {
    activeWorkspace[tab.id] = WORKSPACE_GROUPS[type][0].id;
  }
  return tab;
}

function applyTestSeed() {
  if (testSeedVersion >= TEST_SEED_VERSION) return 0;

  const existingEntriesByCode = new Map(allEntries().filter(entry => entry.code).map(entry => [entry.code, entry]));
  const existingCodes = new Set(existingEntriesByCode.keys());
  let globalIndex = 0;
  let changed = 0;

  Object.entries(TEST_SEED_TYPE_COUNTS).forEach(([type, count]) => {
    const tab = ensureTestSeedTab(type);
    for (let index = 0; index < count; index++) {
      const code = makeTestSeedCode(type, index);
      if (existingCodes.has(code)) {
        const existingEntry = existingEntriesByCode.get(code);
        if (existingEntry) {
          applyTestSeedImages(existingEntry, type, index);
          changed++;
        }
        globalIndex++;
        continue;
      }
      const entry = buildTestSeedEntry(type, index, globalIndex);
      tab.entries.push(entry);
      existingCodes.add(code);
      existingEntriesByCode.set(code, entry);
      changed++;
      globalIndex++;
    }
  });

  testSeedVersion = TEST_SEED_VERSION;
  if (!activeTabId && tabs.length) activeTabId = tabs[0].id;
  return changed;
}

function applySoundWorkspaceDefault() {
  if (localStorage.getItem(SOUND_WORKSPACE_DEFAULT_KEY) === '1') return false;
  let changed = false;
  tabs.forEach(tab => {
    if (tab.type === 'Sounds' && activeWorkspace[tab.id] !== 'player') {
      activeWorkspace[tab.id] = 'player';
      changed = true;
    }
  });
  localStorage.setItem(SOUND_WORKSPACE_DEFAULT_KEY, '1');
  return changed;
}

const $ = id => document.getElementById(id);

// Layout
const homeScreen = $('homeScreen');
const homeEnterBtn = $('homeEnterBtn');
const tabbar    = $('tabbar');
const tableWrap = $('tableWrap');

// Toolbar
const addTabBtn      = $('addTabBtn');
const addEntryBtn    = $('addEntryBtn');
const searchInput    = $('searchInput');
const condFilterEl   = $('condFilter');
const statusFilterEl = $('statusFilter');
const viewModeBtns   = document.querySelectorAll('[data-view-mode]');

// Topbar meta
const metaCollections = $('metaCollections');
const metaTotal       = $('metaTotal');

// Sidebar
const sidebar = $('sidebar');
const sidebarToggle = $('sidebarToggle');
const statCards    = $('statCards');
const collectionStatus = $('collectionStatus');
const conditionBar = $('conditionBar');
const reviewSummary = $('reviewSummary');
const recentList   = $('recentList');

// Entry modal
const modalOverlay  = $('modalOverlay');
const modalTitle    = $('modalTitle');
const modalSub      = $('modalSub');
const modalTypeChip = $('modalTypeChip');
const modalClose    = $('modalClose');
const modalCancel   = $('modalCancel');
const modalSave     = $('modalSave');
const coreSection   = $('coreSection');
const coreSectionTitle = $('coreSectionTitle');
const dynamicSection = $('dynamicSection');
const dynamicFields = $('dynamicFields');
const dynamicSectionTitle = $('dynamicSectionTitle');
const attachmentUploadBtn = $('attachmentUploadBtn');
const attachmentUploadInput = $('attachmentUploadInput');
const attachmentList = $('attachmentList');
const adminSection = $('adminSection');
const adminSectionTitle = $('adminSectionTitle');
const conservationSection = $('conservationSection');
const conservationSectionTitle = $('conservationSectionTitle');
const reviewSection = $('reviewSection');
const reviewSectionTitle = $('reviewSectionTitle');
const notesSection = $('notesSection');
const ratingSection = $('ratingSection');
const ratingInput   = $('ratingInput');

// Core fields
const fCode      = $('fCode');
const fTitle     = $('fTitle');
const fYear      = $('fYear');
const fCreator   = $('fCreator');
const fCondition = $('fCondition');
const fNotes     = $('fNotes');
const eCode      = $('eCode');
const eTitle     = $('eTitle');
const labelCode      = $('labelCode');
const labelYear      = $('labelYear');
const labelTitle     = $('labelTitle');
const labelCreator   = $('labelCreator');
const labelCondition = $('labelCondition');

// Admin fields
const fStatus      = $('fStatus');
const fResponsible = $('fResponsible');
const fLocation    = $('fLocation');
const labelStatus      = $('labelStatus');
const labelResponsible = $('labelResponsible');
const labelLocation    = $('labelLocation');

// Conservation fields
const fConsState     = $('fConsState');
const fConsPriority  = $('fConsPriority');
const fConsDesc      = $('fConsDesc');
const fConsRisks     = $('fConsRisks');
const fConsLastInsp  = $('fConsLastInsp');
const fConsNextInsp  = $('fConsNextInsp');
const fConsInspector = $('fConsInspector');
const fConsRecs      = $('fConsRecs');
const labelConsState     = $('labelConsState');
const labelConsPriority  = $('labelConsPriority');
const labelConsDesc      = $('labelConsDesc');
const labelConsRisks     = $('labelConsRisks');
const labelConsLastInsp  = $('labelConsLastInsp');
const labelConsNextInsp  = $('labelConsNextInsp');
const labelConsInspector = $('labelConsInspector');
const labelConsRecs      = $('labelConsRecs');

// Review fields
const fReviewer   = $('fReviewer');
const fReviewNote = $('fReviewNote');
const labelReviewer   = $('labelReviewer');
const labelReviewNote = $('labelReviewNote');
const labelNotes      = $('labelNotes');

// Rating fields
const fFavorite = $('fFavorite');

// Detail panel
const detailPanel  = $('detailPanel');
const detailClose  = $('detailClose');
const dpCode       = $('dpCode');
const dpTitle      = $('dpTitle');
const dpBody       = $('dpBody');
const dpEdit       = $('dpEdit');
const dpDelete     = $('dpDelete');
const dpDuplicate  = $('dpDuplicate');
const dpMoveSelect = $('dpMoveSelect');
const dpMoveBtn    = $('dpMoveBtn');

// Confirm dialog
const confirmOverlay = $('confirmOverlay');
const confirmTitle   = $('confirmTitle');
const confirmSub     = $('confirmSub');
const confirmNo      = $('confirmNo');
const confirmYes     = $('confirmYes');

// Type picker
const typePickerOverlay = $('typePickerOverlay');
const typePickerGrid    = $('typePickerGrid');
const typePickerClose   = $('typePickerClose');
const typePickerTitle   = $('typePickerTitle');
const typePickerSub     = $('typePickerSub');

// Audio player
const floatingPlayer = $('floatingPlayer');
const fpTitlebar     = $('fpTitlebar');
const fpBody         = $('fpBody');
const fpVis          = $('fpVis');
const fpMinimize     = $('fpMinimize');
const fpClose        = $('fpClose');
const fpPlay         = $('fpPlay');
const fpPrev         = $('fpPrev');
const fpNext         = $('fpNext');
const fpVolumeUp     = $('fpVolumeUp');
const fpVolumeDown   = $('fpVolumeDown');
const fpTrackName    = $('fpTrackName');
const fpTrackSub     = $('fpTrackSub');
const fpTime         = $('fpTime');
const fpProgressFill = $('fpProgressFill');
const fpProgress     = $('fpProgress');
const fpVolume       = $('fpVolume');

// Book viewer
const bookViewer = $('bookViewer');
const bookClose  = $('bookClose');
const bvMeta     = $('bvMeta');
const bvLeft     = $('bvLeft');
const bvRight    = $('bvRight');
const bvPageNum  = $('bvPageNum');
const bookPrev   = $('bookPrev');
const bookNext   = $('bookNext');
const bvSpread   = $('bvSpread');

// Toast
const toast = $('toast');


/* ─────────────────────────────────────────────────────────
   SECTION 6 — SELECTORS & FILTERS
   ───────────────────────────────────────────────────────── */

function activeTab()   { return tabs.find(t => t.id === activeTabId) || null; }
function allEntries()  { return tabs.flatMap(t => t.entries); }

function findEntry(id) {
  for (const t of tabs) {
    const e = t.entries.find(e => e.id === id);
    if (e) return e;
  }
  return null;
}

function findEntryTab(entryId) {
  return tabs.find(t => t.entries.some(e => e.id === entryId)) || null;
}

function filtered() {
  const tab = activeTab();
  if (!tab) return [];

  let list = [...tab.entries];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(e => {
      const typeDef = getTypeDef(e.entryType || tab.type || 'Custom');
      const dynamicText = (typeDef.fields || [])
        .map(field => e[field.key])
        .filter(Boolean)
        .join(' ');
      const searchIndex = [
        e.title,
        e.code,
        e.creator,
        e.notes,
        e.location,
        e.responsible,
        e.status,
        dynamicText,
      ].filter(Boolean).join(' ').toLowerCase();
      return searchIndex.includes(q);
    });
  }

  if (condFilterVal)   list = list.filter(e => getEntryCondition(e) === condFilterVal);
  if (statusFilterVal) list = list.filter(e => e.status    === statusFilterVal);

  list.sort((a, b) => {
    const av = (a[sortKey] || '').toString().toLowerCase();
    const bv = (b[sortKey] || '').toString().toLowerCase();
    return av < bv ? -sortDir : av > bv ? sortDir : 0;
  });

  return list;
}

function setLabelText(el, text, required = false) {
  if (!el) return;
  el.textContent = text;
  if (required) {
    const req = document.createElement('span');
    req.className = 'req';
    req.textContent = '*';
    el.appendChild(req);
  }
}

function setPlaceholder(el, value) {
  if (el && typeof value === 'string') el.placeholder = value;
}

function uniqueTabName(baseName) {
  let name = baseName;
  let count = 2;
  while (tabs.some(tab => tab.name.toLowerCase() === name.toLowerCase())) {
    name = `${baseName} ${count++}`;
  }
  return name;
}

function formatFileSize(bytes = 0) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(String(value));
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function getUploadAccept(field = {}) {
  const key = String(field.key || '').toLowerCase();
  const label = String(field.label || '').toLowerCase();
  if (/audio|track|mp3|sound/.test(key + label)) return 'audio/*,.mp3,.wav,.ogg,.m4a,.flac';
  if (/cover|poster|image|photo|gallery|png|blueprint|thumbnail|waveform/.test(key + label)) return 'image/*';
  if (/reader|document|file|scan|pdf|epub/.test(key + label)) {
    return '.pdf,.doc,.docx,.txt,.md,.rtf,.epub,.html,.htm,image/*,application/pdf,text/*';
  }
  return 'image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.md,.rtf,.epub,.zip';
}

function supportsFieldUpload(field = {}) {
  const key = String(field.key || '').toLowerCase();
  const label = String(field.label || '').toLowerCase();
  return field.type === 'url' || /gallery|upload|file|document|image|photo|audio|media/.test(key + label);
}

function renderUploadButton(field, multiple = false) {
  if (!supportsFieldUpload(field)) return '';
  const action = multiple ? 'data-upload-append' : 'data-upload-replace';
  return `
    <div class="field-upload-row">
      <button class="btn btn-ghost field-upload-btn" type="button" ${action}="${esc(field.key)}">
        Upload ${multiple ? 'files' : 'file'}
      </button>
      <input class="field-upload-input" type="file" ${multiple ? 'multiple' : ''} data-upload-input="${esc(field.key)}" accept="${esc(getUploadAccept(field))}" style="display:none">
      <span class="field-upload-status" data-upload-status="${esc(field.key)}"></span>
    </div>`;
}

function setUploadStatus(key, text) {
  const el = dynamicFields.querySelector(`[data-upload-status="${cssEscape(key)}"]`);
  if (el) el.textContent = text || '';
}

function normalizeAttachments(value) {
  return Array.isArray(value)
    ? value.filter(item => item && item.ref).map(item => ({
        ref: item.ref,
        name: item.name || 'uploaded-file',
        type: item.type || '',
        size: item.size || 0,
        createdAt: item.createdAt || '',
      }))
    : [];
}

function renderAttachmentList() {
  if (!attachmentList) return;
  attachmentList.innerHTML = modalAttachments.length
    ? modalAttachments.map((item, index) => `
        <div class="attachment-item">
          <div>
            <strong>${esc(item.name || 'uploaded-file')}</strong>
            <span>${esc([item.type || 'file', formatFileSize(item.size)].filter(Boolean).join(' / '))}</span>
          </div>
          <button class="attachment-remove" type="button" data-attachment-remove="${index}" aria-label="Remove upload">&times;</button>
        </div>`).join('')
    : '<div class="attachment-empty">No uploads attached.</div>';

  attachmentList.querySelectorAll('[data-attachment-remove]').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.attachmentRemove);
      if (Number.isNaN(index) || !modalAttachments[index]) return;
      modalAttachments.splice(index, 1);
      renderAttachmentList();
      playDeleteSound();
    });
  });
}

async function uploadFiles(files, onItem) {
  const list = Array.from(files || []);
  if (!list.length) return [];
  const uploaded = [];
  for (const file of list) {
    uploaded.push(await createAssetFromFile(file));
  }
  uploaded.filter(Boolean).forEach(item => onItem?.(item));
  return uploaded.filter(Boolean);
}

function bindDynamicUploadControls() {
  dynamicFields.querySelectorAll('[data-upload-replace], [data-upload-append]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.uploadReplace || button.dataset.uploadAppend;
      const input = dynamicFields.querySelector(`[data-upload-input="${cssEscape(key)}"]`);
      if (input) input.click();
    });
  });

  dynamicFields.querySelectorAll('[data-upload-input]').forEach(input => {
    input.addEventListener('change', async () => {
      const key = input.dataset.uploadInput;
      const target = dynamicFields.querySelector(`.dyn-field[data-key="${cssEscape(key)}"]`);
      if (!target || !input.files?.length) return;
      setUploadStatus(key, 'Uploading...');
      try {
        const multiple = target.tagName === 'TEXTAREA';
        const uploaded = await uploadFiles(input.files);
        if (multiple) {
          const existing = target.value.trim();
          const refs = uploaded.map(item => item.ref).join('\n');
          target.value = [existing, refs].filter(Boolean).join('\n');
          setUploadStatus(key, `${uploaded.length} file${uploaded.length === 1 ? '' : 's'} added`);
        } else {
          target.value = uploaded[0]?.ref || '';
          setUploadStatus(key, uploaded[0] ? uploaded[0].name : '');
        }
      } catch (error) {
        console.error('DUMP upload error', error);
        setUploadStatus(key, 'Upload failed');
        showToast('Upload failed. Try a smaller file or another format.');
      } finally {
        input.value = '';
      }
    });
  });
}

function applyModalVariant(type, typeDef) {
  const variant = getFormVariant(type);

  modalTypeChip.textContent = variant.chip;
  modalOverlay.dataset.entryType = (type || 'custom').toLowerCase();
  modalOverlay.style.removeProperty('--form-accent');
  modalOverlay.style.removeProperty('--form-accent-dim');
  modalOverlay.style.removeProperty('--form-accent-glow');

  coreSectionTitle.textContent = variant.sectionTitles.core;
  dynamicSectionTitle.textContent = variant.sectionTitles.dynamic;
  adminSectionTitle.textContent = variant.sectionTitles.admin;
  conservationSectionTitle.textContent = variant.sectionTitles.conservation;
  reviewSectionTitle.textContent = variant.sectionTitles.review;

  setLabelText(labelCode, variant.labels.code, true);
  setLabelText(labelYear, variant.labels.year);
  setLabelText(labelTitle, variant.labels.title, true);
  setLabelText(labelCreator, variant.labels.creator);
  setLabelText(labelCondition, variant.labels.condition);
  setLabelText(labelStatus, variant.labels.status);
  setLabelText(labelResponsible, variant.labels.responsible);
  setLabelText(labelLocation, variant.labels.location);
  setLabelText(labelConsState, variant.labels.consState);
  setLabelText(labelConsPriority, variant.labels.consPriority);
  setLabelText(labelConsDesc, variant.labels.consDesc);
  setLabelText(labelConsRisks, variant.labels.consRisks);
  setLabelText(labelConsLastInsp, variant.labels.consLastInsp);
  setLabelText(labelConsNextInsp, variant.labels.consNextInsp);
  setLabelText(labelConsInspector, variant.labels.consInspector);
  setLabelText(labelConsRecs, variant.labels.consRecs);
  setLabelText(labelReviewer, variant.labels.reviewer);
  setLabelText(labelReviewNote, variant.labels.reviewNote);
  setLabelText(labelNotes, variant.labels.notes);

  setPlaceholder(fCode, variant.placeholders.code);
  setPlaceholder(fTitle, variant.placeholders.title);
  setPlaceholder(fCreator, variant.placeholders.creator);
  setPlaceholder(fResponsible, variant.placeholders.responsible);
  setPlaceholder(fLocation, variant.placeholders.location);
  setPlaceholder(fNotes, variant.placeholders.notes);

  ratingSection.hidden = !typeDef.hasRating || !variant.visibleSections.rating;
  conservationSection.hidden = !variant.visibleSections.conservation;
  reviewSection.hidden = !variant.visibleSections.review;
}

const WORKSPACE_GROUPS = {
  Sounds: [
    { id: 'player', label: 'Player' },
    { id: 'library', label: 'Library' },
    { id: 'metadata', label: 'Metadata' },
  ],
  Books: [
    { id: 'catalog', label: 'Catalog' },
    { id: 'reader', label: 'Reader' },
    { id: 'preservation', label: 'Preservation' },
  ],
  Artifacts: [
    { id: 'inventory', label: 'Inventory' },
    { id: 'conservation', label: 'Conservation' },
    { id: 'review', label: 'Review' },
  ],
  Architecture: [
    { id: 'index', label: 'Index' },
    { id: 'blueprint', label: 'Blueprint' },
    { id: 'materials', label: 'Materials' },
    { id: 'location', label: 'Location' },
  ],
  Clothes: [
    { id: 'wardrobe', label: 'Wardrobe' },
    { id: 'builder', label: 'Look Builder' },
    { id: 'lookbook', label: 'Lookbook' },
  ],
  Pets: [
    { id: 'directory', label: 'Directory' },
    { id: 'profiles', label: 'Profiles' },
    { id: 'encounters', label: 'Encounters' },
  ],
  Food: [
    { id: 'log', label: 'Tasting Log' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'warnings', label: 'Warnings' },
  ],
  Nature: [
    { id: 'fieldlog', label: 'Field Log' },
    { id: 'viewer', label: 'Viewer' },
    { id: 'status', label: 'Status' },
  ],
};

function getWorkspaceItems(tab) {
  return WORKSPACE_GROUPS[tab?.type] || [];
}

function getWorkspace(tab) {
  const items = getWorkspaceItems(tab);
  if (!items.length) return '';
  return activeWorkspace[tab.id] || items[0].id;
}

function setWorkspace(tab, workspaceId) {
  if (!tab) return;
  activeWorkspace[tab.id] = workspaceId;
  save();
  renderByTabType(tab);
}

function splitMediaList(value) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map(part => part.trim())
    .filter(Boolean);
}

function getEntryCondition(entry) {
  return entry.conservation?.state || entry.condition || 'Good';
}

function isFavorite(entry) {
  return !!entry.rating?.favorite;
}

function getEntryImageCandidates(entry) {
  return [
    entry.cover,
    entry.poster,
    entry.imageUrl,
    entry.coverArt,
    entry.pngUrl,
    ...splitMediaList(entry.gallery),
  ].filter(Boolean);
}

function getEntryThumbnail(entry) {
  return getEntryImageCandidates(entry)[0] || '';
}

function getEntryGallery(entry) {
  return getEntryImageCandidates(entry);
}

function isPhysicalEntry(entry) {
  if ((entry.copyType || '').includes('Physical')) return true;
  if ((entry.copyType || '').includes('Digital')) return false;
  return ['Books', 'Artifacts', 'Architecture', 'Clothes', 'Pets', 'Food', 'Nature'].includes(entry.entryType);
}

function getEntryAlerts(entry) {
  const alerts = [];
  const nextInspection = entry.conservation?.nextInspection;
  if (getEntryCondition(entry) === 'Critical') alerts.push('Critical condition');
  if (entry.status === 'Pending Review') alerts.push('Pending review');
  if (nextInspection && new Date(nextInspection) < new Date()) alerts.push('Inspection overdue');
  if (isPhysicalEntry(entry) && !getEntryThumbnail(entry)) alerts.push('Needs image');
  return alerts;
}

const COLLECTION_STATUS_ITEMS = [
  {
    key: 'approved',
    label: 'Approved',
    sub: 'Approved records',
    match: entry => entry.status === 'Approved',
  },
  {
    key: 'pending',
    label: 'Pending',
    sub: 'Awaiting review',
    match: entry => entry.status === 'Pending Review',
  },
  {
    key: 'favorites',
    label: 'Favorites',
    sub: 'Favorite records',
    match: isFavorite,
  },
  {
    key: 'physical',
    label: 'Physical',
    sub: 'Physical copies',
    match: isPhysicalEntry,
  },
  {
    key: 'digital',
    label: 'Digital',
    sub: 'Digital or online copies',
    match: entry => !isPhysicalEntry(entry),
  },
  {
    key: 'alerts',
    label: 'Alerts',
    sub: 'Records needing attention',
    match: entry => getEntryAlerts(entry).length > 0,
  },
];

function getCollectionStatusItems(entries) {
  return COLLECTION_STATUS_ITEMS.map(item => ({
    ...item,
    entries: entries.filter(item.match),
  }));
}

function openHomeStatus(statusKey) {
  activeHomeStatus = statusKey;
  activeView = 'home';
  selectedId = null;
  detailPanel.classList.remove('open');
  applyTheme();
  render();
}

function clearHomeStatus() {
  activeHomeStatus = '';
  render();
}

function renderWorkspaceHeader(tab, title, summary, body) {
  const items = getWorkspaceItems(tab);
  const workspace = getWorkspace(tab);
  const nav = items.length
    ? `<div class="workspace-nav">${items.map(item => `
        <button class="workspace-chip${item.id === workspace ? ' is-active' : ''}" data-workspace="${item.id}">
          ${esc(item.label)}
        </button>`).join('')}</div>`
    : '';

  tableWrap.innerHTML = `
    <div class="workspace-shell fade-in">
      <div class="workspace-head">
        <div>
          <div class="workspace-kicker">${esc(getEntryRoom(tab.type))} / ${esc(tab.name)}</div>
          <h2 class="workspace-title">${esc(title)}</h2>
          <p class="workspace-summary">${esc(summary)}</p>
        </div>
      </div>
      ${nav}
      ${body}
    </div>`;

  tableWrap.querySelectorAll('[data-workspace]').forEach(button => {
    button.addEventListener('click', () => setWorkspace(tab, button.dataset.workspace));
  });

  bindEntryCardInteractions(tableWrap);
}

function renderWorkspaceEmpty(copy, actionLabel = 'Add entry') {
  const action = actionLabel
    ? `<button class="btn btn-primary" type="button" data-empty-add>${esc(actionLabel)}</button>`
    : '';
  return `
    <div class="workspace-empty-inline workspace-empty-action">
      <span>${esc(copy)}</span>
      ${action}
    </div>`;
}

function renderWorkspaceItems(list, renderItem, emptyCopy, actionLabel = 'Add entry') {
  return list.length
    ? list.map(renderItem).join('')
    : renderWorkspaceEmpty(emptyCopy, actionLabel);
}


/* ─────────────────────────────────────────────────────────
   SECTION 7 — RENDER — MASTER
   ───────────────────────────────────────────────────────── */

function render() {
  document.body.classList.toggle('home-view', activeView === 'home');
  syncViewModeButtons();
  renderTabs();
  renderSidebar();
  activeView === 'home' ? renderHomePage() : renderByTabType(activeTab());
  renderMeta();
  hydrateAssetElements(document);
}

function renderMeta() {
  metaCollections.textContent = tabs.length;
  metaTotal.textContent       = allEntries().length;
}

function applySidebarState() {
  document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  if (sidebarToggle) {
    sidebarToggle.setAttribute('aria-expanded', String(!sidebarCollapsed));
    sidebarToggle.title = sidebarCollapsed ? 'Open sidebar' : 'Close sidebar';
    const icon = sidebarToggle.querySelector('.sidebar-toggle-icon');
    const label = sidebarToggle.querySelector('.sidebar-toggle-label');
    if (icon) icon.textContent = sidebarCollapsed ? '\u203a' : '\u2039';
    if (label) label.textContent = sidebarCollapsed ? 'Stats' : 'Hide';
  }
}

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  localStorage.setItem('dump_sidebar_collapsed', sidebarCollapsed ? '1' : '0');
  applySidebarState();
}

function renderHomePage() {
  const entries = allEntries();
  const recent = [...entries]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 6);
  const pending = entries.filter(e => e.status === 'Pending Review');
  const critical = entries.filter(e => getEntryCondition(e) === 'Critical');
  const favorites = entries.filter(e => e.rating?.favorite);
  const approvedEntries = entries.filter(e => e.status === 'Approved');
  const alertEntries = entries.filter(e => getEntryAlerts(e).length > 0);
  const reviewQueue = [...pending, ...critical.filter(e => !pending.some(p => p.id === e.id))].slice(0, 5);
  const favoriteItems = favorites.slice(0, 4);
  const randomPick = entries.length ? entries[new Date().getDate() % entries.length] : null;
  const statusItems = getCollectionStatusItems(entries);
  const activeStatusItem = statusItems.find(item => item.key === activeHomeStatus) || null;
  const latestDate = recent[0] ? formatDate(recent[0].updatedAt || recent[0].createdAt) : 'No records';
  const baseCopy = entries.length
    ? `${recent.length} recent updates, ${reviewQueue.length} review items, and ${favorites.length} favorites are gathered here.`
    : 'Your archive base is ready for its first collection room.';

  const homeStat = (value, label) => `
    <div class="home-stat-card">
      <div class="home-stat-value">${value}</div>
      <div class="home-stat-label">${label}</div>
    </div>`;

  const homeEntryCard = (entry, extraClass = '') => {
    const tab = findEntryTab(entry.id);
    const type = getEntryType(entry, tab);
    return `<button class="home-mini-entry ${extraClass}" data-entry-id="${entry.id}">
      ${renderEntryVisual(entry, type, 'home-mini-thumb')}
      <span class="home-mini-copy">
        <span class="home-recent-code">${esc(entry.code || 'No code')}</span>
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <small>${esc(getEntryRoom(type))} / ${esc(tab?.name || 'Collection')}</small>
      </span>
    </button>`;
  };

  const recentItems = recent.length
    ? recent.map(e => {
        const tab = findEntryTab(e.id);
        return `<button class="home-recent-item" data-entry-id="${e.id}">
          <span class="home-recent-code">${esc(e.code || 'No code')}</span>
          <span class="home-recent-title">${esc(e.title || 'Untitled')}</span>
          <span class="home-recent-meta">${esc(tab?.name || 'Collection')} / ${formatDate(e.updatedAt || e.createdAt)}</span>
        </button>`;
      }).join('')
    : `<div class="home-empty-note">No records yet. Start by creating the first item in DUMP.</div>`;

  const collectionCards = tabs.map(tab => {
    const typeDef = getTypeDef(tab.type);
    const approved = tab.entries.filter(e => e.status === 'Approved').length;
    return `<button class="home-collection-card" data-tab-id="${tab.id}">
      <span class="home-collection-name">${esc(tab.name)}</span>
      <span class="home-collection-type">${esc(getEntryRoom(tab.type))}</span>
      <span class="home-collection-count">${tab.entries.length}</span>
      <span class="home-collection-sub">${esc(typeDef.label)} / ${approved} approved</span>
    </button>`;
  }).join('');

  const reviewItems = reviewQueue.length
    ? reviewQueue.map(entry => {
        const alerts = getEntryAlerts(entry);
        return `<button class="home-suggestion" data-entry-id="${entry.id}">
          <span>${esc(entry.title || entry.code || 'Untitled')}</span>
          <small>${esc(alerts[0] || entry.status || getEntryCondition(entry))}</small>
        </button>`;
      }).join('')
    : `<div class="home-empty-note">No active review queue.</div>`;

  const favoriteCards = favoriteItems.length
    ? favoriteItems.map(entry => homeEntryCard(entry)).join('')
    : `<div class="home-empty-note">No favorites marked yet.</div>`;

  const randomCard = randomPick
    ? homeEntryCard(randomPick, 'home-mini-entry-featured')
    : `<div class="home-empty-note">Add records to surface an archive pick.</div>`;

  const statusBubble = activeStatusItem ? (() => {
    const items = activeStatusItem.entries;
    const statusEntries = items.length
      ? items.map(e => {
          const tab = findEntryTab(e.id);
          const meta = [tab?.name || 'Collection', e.code || 'No code', formatDate(e.updatedAt || e.createdAt)]
            .filter(Boolean)
            .join(' / ');
          const statusLine = activeStatusItem.key === 'alerts'
            ? getEntryAlerts(e).join(' / ')
            : activeStatusItem.sub;
          return `<button class="home-status-entry" data-entry-id="${e.id}">
            <span class="home-status-entry-kicker">${esc(meta)}</span>
            <strong>${esc(e.title || 'Untitled')}</strong>
            <small>${esc(statusLine)}</small>
          </button>`;
        }).join('')
      : `<div class="home-empty-note">No records in this status yet.</div>`;

    return `
      <section class="home-status-bubble">
        <div class="home-status-head">
          <div>
            <div class="home-panel-title">Status subcategory</div>
            <h3 class="home-status-title">${esc(activeStatusItem.label)}</h3>
            <p class="home-status-copy">${items.length} ${items.length === 1 ? 'record' : 'records'} inside this status.</p>
          </div>
          <button class="home-status-close" type="button" data-home-status-clear aria-label="Close status subcategory">&times;</button>
        </div>
        <div class="home-status-tabs">
          ${statusItems.map(item => `<button class="home-status-chip${item.key === activeStatusItem.key ? ' is-active' : ''}" type="button" data-home-status="${item.key}">
            <span>${item.entries.length}</span>
            ${esc(item.label)}
          </button>`).join('')}
        </div>
        <div class="home-status-list">${statusEntries}</div>
      </section>`;
  })() : '';

  const suggestions = [
    critical.length
      ? { label: 'Review critical items', sub: `${critical.length} need attention`, action: 'critical' }
      : { label: 'Set conservation routine', sub: 'Schedule next inspections for important items', action: 'collection' },
    pending.length
      ? { label: 'Finish reviews', sub: `${pending.length} awaiting review`, action: 'pending' }
      : { label: 'Add new record', sub: 'Keep building the active collection', action: 'entry' },
    { label: 'Create new collection', sub: 'Split out a new collection when it makes sense', action: 'collection' },
  ];

  tableWrap.innerHTML = `
    <div class="vault-home fade-in">
      <section class="home-hero-panel home-base-hero">
        <div class="home-base-main">
          <div class="home-kicker">DUMP HOME BASE</div>
          <h2 class="home-heading">Welcome back</h2>
          <p class="home-hero-copy">${esc(baseCopy)}</p>
          <div class="home-base-status" aria-label="Home status shortcuts">
            <button class="home-base-chip" type="button" data-home-status="approved"><span>${approvedEntries.length}</span> Approved</button>
            <button class="home-base-chip" type="button" data-home-status="pending"><span>${pending.length}</span> Pending</button>
            <button class="home-base-chip" type="button" data-home-status="alerts"><span>${alertEntries.length}</span> Alerts</button>
          </div>
        </div>
        <div class="home-base-console" aria-label="Archive snapshot">
          <div class="home-base-console-title">Archive Snapshot</div>
          <div class="home-base-console-row"><span>Rooms online</span><strong>${tabs.length}</strong></div>
          <div class="home-base-console-row"><span>Latest update</span><strong>${esc(latestDate)}</strong></div>
          <div class="home-base-console-row"><span>Current pick</span><strong>${esc(randomPick?.title || randomPick?.code || 'Ready')}</strong></div>
          <button class="btn btn-primary home-action home-base-add" data-home-action="entry" aria-label="Add entry" title="Add entry">+</button>
        </div>
      </section>

      <section class="home-stats-grid">
        ${homeStat(entries.length, 'Total records')}
        ${homeStat(tabs.length, 'Collection rooms')}
        ${homeStat(reviewQueue.length, 'Needs review')}
        ${homeStat(favorites.length, 'Favorites')}
      </section>

      ${statusBubble}

      <section class="home-layout-grid">
        <div class="home-panel home-panel-large">
          <div class="home-panel-title">Recent additions</div>
          <div class="home-recent-list">${recentItems}</div>
        </div>
        <div class="home-panel">
          <div class="home-panel-title">Needs review</div>
          <div class="home-suggestion-list">${reviewItems}</div>
        </div>
        <div class="home-panel">
          <div class="home-panel-title">Favorites</div>
          <div class="home-mini-list">${favoriteCards}</div>
        </div>
        <div class="home-panel">
          <div class="home-panel-title">Archive pick</div>
          <div class="home-mini-list">${randomCard}</div>
        </div>
        <div class="home-panel">
          <div class="home-panel-title">Next steps</div>
          <div class="home-suggestion-list">
            ${suggestions.map(item => `<button class="home-suggestion" data-home-action="${item.action}">
              <span>${esc(item.label)}</span>
              <small>${esc(item.sub)}</small>
            </button>`).join('')}
          </div>
        </div>
      </section>

      <section class="home-panel">
        <div class="home-panel-title">Collection map</div>
        <div class="home-collection-grid">${collectionCards}</div>
      </section>
    </div>`;

  tableWrap.querySelectorAll('[data-entry-id]').forEach(el => {
    el.addEventListener('click', () => {
      const entry = findEntry(parseInt(el.dataset.entryId));
      if (entry) openDetail(entry);
    });
  });

  tableWrap.querySelectorAll('[data-tab-id]').forEach(el => {
    el.addEventListener('click', () => setActiveTab(parseInt(el.dataset.tabId)));
  });

  tableWrap.querySelectorAll('[data-home-status]').forEach(el => {
    el.addEventListener('click', () => openHomeStatus(el.dataset.homeStatus));
  });

  tableWrap.querySelectorAll('[data-home-status-clear]').forEach(el => {
    el.addEventListener('click', clearHomeStatus);
  });

  tableWrap.querySelectorAll('[data-home-action]').forEach(el => {
    el.addEventListener('click', () => handleHomeAction(el.dataset.homeAction, { pending, critical }));
  });
}

function handleHomeAction(action, lists = {}) {
  if (action === 'entry') {
    openNewEntryModal();
    return;
  }
  if (action === 'collection') {
    openTabTypePicker();
    return;
  }
  const target = action === 'pending' ? lists.pending?.[0] : lists.critical?.[0];
  if (target) openDetail(target);
}

function openNewEntryModal() {
  const tab = activeTab();
  if (!tab) return;
  if (tab.type && tab.type !== 'Custom' && ENTRY_TYPES[tab.type]) {
    openModal(null, tab.type);
    return;
  }
  openEntryTypePicker();
}


/* ─────────────────────────────────────────────────────────
   SECTION 8 — RENDER — TAB BAR
   ───────────────────────────────────────────────────────── */

function syncViewModeButtons() {
  viewModeBtns.forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.viewMode === entryViewMode);
  });
}

function setEntryViewMode(mode) {
  if (!['table', 'gallery', 'cards'].includes(mode)) return;
  entryViewMode = mode;
  syncViewModeButtons();
  if (activeView !== 'home') renderByTabType(activeTab());
}

function getEntryType(entry, tab = activeTab()) {
  return entry.entryType || tab?.type || findEntryTab(entry.id)?.type || 'Custom';
}

function getEntryRoom(type) {
  return COLLECTION_ROOMS[type] || COLLECTION_ROOMS.Custom;
}

function getEntrySubtitle(entry, type = getEntryType(entry)) {
  const partsByType = {
    Books: [entry.creator, entry.publisher, entry.copyType],
    Films: [entry.director || entry.creator, entry.genre, entry.releaseFormat],
    Series: [entry.creator, entry.genre, entry.showStatus],
    Sounds: [entry.artist || entry.creator, entry.album, entry.audioFormat],
    Artifacts: [entry.medium, entry.culture, entry.arLocation],
    Architecture: [entry.architect || entry.creator, entry.style, entry.arLocation],
    Clothes: [entry.mainCategory, entry.styleTags, entry.storage],
    Pets: [entry.speciesGroup, entry.breedType, entry.animalStatus],
    Food: [entry.cuisine, entry.mealTime, entry.tasteRating],
    Nature: [entry.natureCategory, entry.speciesGuess, entry.idConfidence],
  };
  const parts = (partsByType[type] || [entry.creator, entry.location, entry.year]).filter(Boolean);
  return parts.join(' / ') || entry.notes || 'No extra details yet';
}

function renderEntryVisual(entry, type, className = 'entry-card-thumb') {
  const thumb = getEntryThumbnail(entry);
  const icon = (getTypeDef(type).icon || 'DM').slice(0, 2);
  return thumb
    ? `<img class="${className}" ${mediaAttrs(thumb)} alt="${esc(entry.title || 'Preview')}" loading="lazy">`
    : `<div class="${className} entry-card-placeholder">${esc(icon)}</div>`;
}

function renderEntryBadges(entry) {
  const condition = getEntryCondition(entry);
  const statusClass = STATUS_BADGE[entry.status] || 'draft';
  return `
    <span class="badge badge-${condition.toLowerCase()}">${esc(condition)}</span>
    <span class="badge badge-${statusClass}">${esc(entry.status || 'Draft')}</span>
    ${isFavorite(entry) ? '<span class="badge badge-favorite">Favorite</span>' : ''}
  `;
}

function getEntryActionHTML(entry, behavior) {
  return `
    <div class="row-actions entry-card-actions">
      <button class="btn btn-ghost row-btn js-fav${isFavorite(entry) ? ' is-active' : ''}" data-id="${entry.id}" title="Favorite">Heart</button>
      ${behavior === 'audio' ? `<button class="btn btn-ghost row-btn js-play" data-id="${entry.id}" title="Play">Play</button>` : ''}
      ${behavior === 'books' ? `<button class="btn btn-ghost row-btn js-book" data-id="${entry.id}" title="Open viewer">Read</button>` : ''}
      <button class="btn btn-ghost row-btn js-edit" data-id="${entry.id}">Edit</button>
      <button class="btn btn-ghost row-btn js-dup" data-id="${entry.id}">Dup</button>
      <button class="btn btn-danger row-btn js-del" data-id="${entry.id}">Del</button>
    </div>
  `;
}

function renderEmptyState(tab, filteredOut = false) {
  const type = tab?.type || 'Custom';
  const typeDef = getTypeDef(type);
  const title = filteredOut ? 'No matching records' : tab?.name || 'Collection';
  const copy = filteredOut
    ? 'No entries match the current filter or search.'
    : (EMPTY_STATE_COPY[type] || EMPTY_STATE_COPY.Custom);
  const action = filteredOut
    ? '<button class="btn btn-ghost" type="button" data-empty-clear>Clear filters</button>'
    : '<button class="btn btn-primary" type="button" data-empty-add>Add entry</button>';
  return `
    <div class="empty-state fade-in">
      <div class="empty-room-chip">${esc(getEntryRoom(type))}</div>
      <div class="empty-glyph">${esc(typeDef.icon || 'DM')}</div>
      <div class="empty-title">${esc(title)}</div>
      <p class="empty-sub">${esc(copy)}</p>
      ${action}
    </div>`;
}

function clearEntryFilters() {
  searchQuery = '';
  condFilterVal = '';
  statusFilterVal = '';
  searchInput.value = '';
  condFilterEl.value = '';
  statusFilterEl.value = '';
  renderByTabType(activeTab());
}

function renderGalleryView(tab, list) {
  const behavior = TAB_BEHAVIORS[tab.type] || 'custom';
  tableWrap.innerHTML = `
    <div class="entry-view-grid entry-gallery-grid fade-in">
      ${list.map(entry => {
        const type = getEntryType(entry, tab);
        return `<article class="entry-gallery-card${selectedId === entry.id ? ' is-selected' : ''}" data-entry-id="${entry.id}" tabindex="0" role="button">
          <div class="entry-card-media">${renderEntryVisual(entry, type)}</div>
          <div class="entry-card-body">
            <div class="entry-card-kicker">
              <span>${esc(getEntryRoom(type))}</span>
              <span>${esc(entry.code || 'No code')}</span>
            </div>
            <strong>${esc(entry.title || 'Untitled')}</strong>
            <span class="entry-card-subtitle">${esc(getEntrySubtitle(entry, type))}</span>
            <div class="entry-card-badges">${renderEntryBadges(entry)}</div>
            ${getEntryActionHTML(entry, behavior)}
          </div>
        </article>`;
      }).join('')}
    </div>`;
  bindTableInteractions();
}

function renderArchiveCardView(tab, list) {
  const behavior = TAB_BEHAVIORS[tab.type] || 'custom';
  tableWrap.innerHTML = `
    <div class="entry-view-grid entry-archive-grid fade-in">
      ${list.map(entry => {
        const type = getEntryType(entry, tab);
        return `<article class="entry-archive-card${selectedId === entry.id ? ' is-selected' : ''}" data-entry-id="${entry.id}" tabindex="0" role="button">
          ${renderEntryVisual(entry, type, 'entry-archive-thumb')}
          <div class="entry-archive-main">
            <div class="entry-card-kicker">
              <span>${esc(entry.code || 'No code')}</span>
              <span>${esc(getEntryRoom(type))}</span>
            </div>
            <strong>${esc(entry.title || 'Untitled')}</strong>
            <span class="entry-card-subtitle">${esc(getEntrySubtitle(entry, type))}</span>
          </div>
          <div class="entry-archive-side">
            <div class="entry-card-badges">${renderEntryBadges(entry)}</div>
            ${getEntryActionHTML(entry, behavior)}
          </div>
        </article>`;
      }).join('')}
    </div>`;
  bindTableInteractions();
}

function bindEntryCardInteractions(root = tableWrap) {
  root.querySelectorAll('[data-entry-id]').forEach(el => {
    if (el.closest('tbody')) return;
    if (el.dataset.entryBound) return;
    el.dataset.entryBound = '1';
    const open = event => {
      if (event?.target?.closest('.row-actions, .rating-stars')) return;
      const entry = findEntry(parseInt(el.dataset.entryId));
      if (entry) openDetail(entry);
    };
    el.addEventListener('click', open);
    el.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target?.closest('.row-actions, .rating-stars')) return;
      event.preventDefault();
      open(event);
    });
  });

  root.querySelectorAll('[data-empty-add]').forEach(button => {
    if (button.dataset.emptyBound) return;
    button.dataset.emptyBound = '1';
    button.addEventListener('click', openNewEntryModal);
  });

  root.querySelectorAll('[data-empty-clear]').forEach(button => {
    if (button.dataset.emptyBound) return;
    button.dataset.emptyBound = '1';
    button.addEventListener('click', clearEntryFilters);
  });
}

function renderTabs() {
  tabbar.querySelectorAll('.tab').forEach(el => el.remove());

  const homeEl = document.createElement('div');
  homeEl.className = 'tab tab-home' + (activeView === 'home' ? ' tab--active' : '');
  homeEl.innerHTML = `
    <span class="tab-name">Home</span>
  `;
  homeEl.addEventListener('click', setHomeView);
  tabbar.insertBefore(homeEl, addTabBtn);

  tabs.forEach(tab => {
    const el = document.createElement('div');
    el.className  = 'tab' + (activeView !== 'home' && tab.id === activeTabId ? ' tab--active' : '');
    el.dataset.id = tab.id;

    el.innerHTML = `
      <span class="tab-name">${esc(tab.name)}</span>
      <span class="tab-count">${tab.entries.length}</span>
      <input class="tab-rename-input" type="text" maxlength="32"
             value="${esc(tab.name)}" aria-label="Rename collection"/>
      <button class="tab-del" title="Delete collection">&#x2715;</button>
    `;

    tabbar.insertBefore(el, addTabBtn);

    el.addEventListener('click', e => {
      if (e.target.classList.contains('tab-del'))          return;
      if (e.target.classList.contains('tab-rename-input')) return;
      setActiveTab(tab.id);
    });

    el.addEventListener('dblclick', e => {
      if (e.target.classList.contains('tab-del')) return;
      startRename(el, tab);
    });

    el.querySelector('.tab-del').addEventListener('click', e => {
      e.stopPropagation();
      confirmAction(
        'Delete collection?',
        `"${tab.name}" and all ${tab.entries.length} entries will be removed.`,
        () => deleteTab(tab.id)
      );
    });
  });
}

function startRename(el, tab) {
  const label = el.querySelector('.tab-name');
  const input = el.querySelector('.tab-rename-input');
  label.style.display = 'none';
  input.style.display = 'block';
  input.focus(); input.select();

  const commit = () => { const v = input.value.trim(); if (v) tab.name = v; save(); render(); };
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') render(); });
  input.addEventListener('blur', commit);
}


/* ─────────────────────────────────────────────────────────
   SECTION 9 — RENDER — SIDEBAR
   ───────────────────────────────────────────────────────── */

function renderSidebar() {
  const tab     = activeTab();
  const entries = activeView === 'home' ? allEntries() : (tab ? tab.entries : []);
  const total   = entries.length;
  const all     = allEntries();
  const statusItems = getCollectionStatusItems(entries);

  const earliest = entries.reduce((m, e) => (!m || (e.year && e.year < m) ? e.year : m), null);
  const critical  = entries.filter(e => getEntryCondition(e) === 'Critical').length;
  const pending   = entries.filter(e => e.status === 'Pending Review').length;
  const approved  = entries.filter(e => e.status === 'Approved').length;

  statCards.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${total}</div>
      <div class="stat-label">${activeView === 'home' ? 'Entries in DUMP' : 'Entries in room'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${earliest || '—'}</div>
      <div class="stat-label">Earliest year</div>
    </div>
    <div class="stat-card ${critical > 0 ? 'stat-card--critical' : ''}">
      <div class="stat-value">${critical}</div>
      <div class="stat-label">Critical condition</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${pending}</div>
      <div class="stat-label">Pending review</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${approved}</div>
      <div class="stat-label">Approved</div>
    </div>
  `;

  collectionStatus.innerHTML = statusItems.map(item => `
    <button class="status-card${activeView === 'home' && activeHomeStatus === item.key ? ' is-active' : ''}" type="button" data-status-key="${item.key}">
      <span class="status-card-value">${item.entries.length}</span>
      <span class="status-card-label">${esc(item.label)}</span>
    </button>
  `).join('');

  collectionStatus.querySelectorAll('[data-status-key]').forEach(el => {
    el.addEventListener('click', () => openHomeStatus(el.dataset.statusKey));
  });

  const conds  = ['Excellent','Good','Fair','Poor','Critical'];
  const counts = Object.fromEntries(conds.map(c => [c, 0]));
  entries.forEach(e => { const s = e.conservation?.state || e.condition || 'Good'; if (counts[s] !== undefined) counts[s]++; });

  conditionBar.innerHTML = conds.map(c => {
    const pct = total ? Math.round((counts[c] / total) * 100) : 0;
    return `<div>
      <div class="cond-row">
        <span class="cond-dot" style="background:${COND_COLORS[c]}"></span>
        <span class="cond-name">${c}</span>
        <span class="cond-count">${counts[c]}</span>
      </div>
      <div class="cond-track"><div class="cond-fill" style="width:${pct}%;background:${COND_COLORS[c]}"></div></div>
    </div>`;
  }).join('');

  const statusList = ['Draft','Pending Review','Approved','Needs Correction','Archived'];
  const sCounts = Object.fromEntries(statusList.map(s => [s, 0]));
  entries.forEach(e => { if (sCounts[e.status] !== undefined) sCounts[e.status]++; });

  reviewSummary.innerHTML = statusList.map(s =>
    `<div class="review-row"><span>${s}</span><span class="review-row-count">${sCounts[s]}</span></div>`
  ).join('');

  const recent = all
    .slice()
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    .slice(0, 6);

  recentList.innerHTML = recent.length
    ? recent.map(e => `
        <div class="recent-item" data-eid="${e.id}">
          <span class="recent-item-code">${esc(e.code || '—')}</span>
          <span>${esc(e.title || 'Untitled')}</span>
          ${getEntryAlerts(e)[0] ? `<span class="recent-item-alert">${esc(getEntryAlerts(e)[0])}</span>` : ''}
        </div>`
      ).join('')
    : '<div style="font-size:.75rem;color:var(--text-3)">No entries yet</div>';

  recentList.querySelectorAll('.recent-item').forEach(el => {
    el.addEventListener('click', () => {
      const id    = parseInt(el.dataset.eid);
      const entry = allEntries().find(e => e.id === id);
      if (!entry) return;
      const owner = findEntryTab(id);
      if (owner) { activeTabId = owner.id; render(); }
      openDetail(entry);
    });
  });
}


/* ─────────────────────────────────────────────────────────
   SECTION 10 — RENDER — TABLE
   Core table renderer — never modified per the architecture rules.
   Extensions are added in Section 23 (renderByTabType).
   ───────────────────────────────────────────────────────── */

function renderTable() {
  const tab  = activeTab();
  const list = filtered();

  if (!tab) { tableWrap.innerHTML = ''; return; }

  if (tab.entries.length === 0) {
    tableWrap.innerHTML = renderEmptyState(tab);
    bindEntryCardInteractions();
    return;
  }

  if (list.length === 0) {
    tableWrap.innerHTML = renderEmptyState(tab, true);
    bindEntryCardInteractions();
    return;
  }

  if (entryViewMode === 'gallery') {
    renderGalleryView(tab, list);
    return;
  }

  if (entryViewMode === 'cards') {
    renderArchiveCardView(tab, list);
    return;
  }

  // Detect tab behavior for extra columns
  const behavior  = TAB_BEHAVIORS[tab.type] || 'custom';
  const showRating = ['books', 'media', 'food'].includes(behavior);
  const showThumb  = true;
  const showReader = behavior === 'books';
  const showPlay   = behavior === 'audio';

  const th = (k, l) =>
    `<th data-sort="${k}" class="${sortKey === k ? 'sorted' : ''}">${l}${sortKey === k ? (sortDir === 1 ? ' ↑' : ' ↓') : ''}</th>`;

  tableWrap.innerHTML = `
    <table class="vault-table">
      <thead>
        <tr>
          ${showThumb ? '<th>Preview</th>' : ''}
          ${th('code',      'Acc. No.')}
          ${th('title',     'Title')}
          ${th('creator',   'Creator')}
          ${th('year',      'Year')}
          ${th('condition', 'Condition')}
          <th>Status</th>
          ${showRating ? `${th('rating', 'Rating')}` : ''}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(e => buildRow(e, { showThumb, showRating, showPlay, showReader })).join('')}
      </tbody>
    </table>`;

  // Row click → detail panel
  tableWrap.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.row-actions'))  return;
      if (e.target.closest('.rating-stars')) return;
      const entry = findEntry(parseInt(row.dataset.id));
      if (entry) openDetail(entry);
    });
  });

  // Column sorting
  tableWrap.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (sortKey === k) sortDir *= -1;
      else { sortKey = k; sortDir = 1; }
      renderByTabType(activeTab());
    });
  });

  // Row action buttons
  tableWrap.querySelectorAll('.js-edit').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(parseInt(btn.dataset.id)); })
  );
  tableWrap.querySelectorAll('.js-dup').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); duplicateEntry(parseInt(btn.dataset.id)); })
  );
  tableWrap.querySelectorAll('.js-del').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const entry = findEntry(parseInt(btn.dataset.id));
      if (entry) confirmDelete(entry);
    })
  );
  tableWrap.querySelectorAll('.js-fav').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(parseInt(btn.dataset.id));
    })
  );

  // Play buttons (Sounds tab)
  tableWrap.querySelectorAll('.js-play').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const entry = findEntry(parseInt(btn.dataset.id));
      if (entry) openAudioPlayer(entry);
    })
  );

  // Book viewer buttons
  tableWrap.querySelectorAll('.js-book').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const entry = findEntry(parseInt(btn.dataset.id));
      if (entry) openBookViewer(entry);
    })
  );

  // Inline star clicks
  tableWrap.querySelectorAll('.rating-stars').forEach(wrap => {
    wrap.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', e => {
        e.stopPropagation();
        const entryId = parseInt(wrap.dataset.id);
        const score   = parseInt(star.dataset.score);
        setRating(entryId, score);
      });
    });
  });

}

function buildRow(e, opts = {}) {
  const { showThumb, showRating, showPlay, showReader } = opts;
  const condClass   = getEntryCondition(e).toLowerCase();
  const statusClass = STATUS_BADGE[e.status] || 'draft';
  const isCritical  = getEntryCondition(e) === 'Critical';
  const thumb = getEntryThumbnail(e);
  const alerts = getEntryAlerts(e);

  const thumbCell = showThumb ? `<td>
    ${thumb
      ? `<img class="cell-cover" ${mediaAttrs(thumb)} alt="" loading="lazy">`
      : `<div class="cell-cover-placeholder">${esc((getTypeDef(e.entryType || activeTab()?.type || 'Custom').icon || '??').slice(0, 2))}</div>`
    }
  </td>` : '';

  const ratingCell = showRating
    ? `<td>${renderStarsHTML(e)}</td>`
    : '';

  const actions = `
    <div class="row-actions">
      <button class="btn btn-ghost row-btn js-fav${isFavorite(e) ? ' is-active' : ''}" data-id="${e.id}" title="Favorite">♥</button>
      ${showPlay ? `<button class="btn btn-ghost row-btn js-play" data-id="${e.id}" title="Play">▶</button>` : ''}
      ${showReader ? `<button class="btn btn-ghost row-btn js-book" data-id="${e.id}" title="Open viewer">Read</button>` : ''}
      <button class="btn btn-ghost  row-btn js-edit" data-id="${e.id}">Edit</button>
      <button class="btn btn-ghost  row-btn js-dup"  data-id="${e.id}">Dup</button>
      <button class="btn btn-danger row-btn js-del"  data-id="${e.id}">Del</button>
    </div>`;

  return `
    <tr data-id="${e.id}"
        class="${selectedId === e.id ? 'selected' : ''} ${isCritical ? 'row--critical' : ''}">
      ${thumbCell}
      <td class="cell-code">${esc(e.code || '—')}</td>
      <td>
        <div class="cell-title-row">
          <div class="cell-title">${esc(e.title || 'Untitled')}</div>
          ${alerts[0] ? `<span class="row-alert-chip">${esc(alerts[0])}</span>` : ''}
        </div>
        ${e.notes ? `<div class="cell-sub">${esc(e.notes.slice(0,55))}${e.notes.length>55?'…':''}</div>` : ''}
      </td>
      <td style="color:var(--text-2);font-size:.8rem">${esc(e.creator || '—')}</td>
      <td style="font-family:var(--font-mono);font-size:.75rem;color:var(--text-2)">${esc(e.year || '—')}</td>
      <td><span class="badge badge-${condClass}">${esc(getEntryCondition(e))}</span></td>
      <td><span class="badge badge-${statusClass}">${esc(e.status || 'Draft')}</span></td>
      ${ratingCell}
      <td>${actions}</td>
    </tr>`;
}


/* ─────────────────────────────────────────────────────────
   SECTION 11 — TAB ACTIONS
   ───────────────────────────────────────────────────────── */

function bindTableInteractions() {
  bindEntryCardInteractions();

  tableWrap.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.row-actions'))  return;
      if (e.target.closest('.rating-stars')) return;
      const entry = findEntry(parseInt(row.dataset.id));
      if (entry) openDetail(entry);
    });
  });

  tableWrap.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (sortKey === k) sortDir *= -1;
      else { sortKey = k; sortDir = 1; }
      renderByTabType(activeTab());
    });
  });

  tableWrap.querySelectorAll('.js-edit').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(parseInt(btn.dataset.id)); })
  );
  tableWrap.querySelectorAll('.js-dup').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); duplicateEntry(parseInt(btn.dataset.id)); })
  );
  tableWrap.querySelectorAll('.js-del').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const entry = findEntry(parseInt(btn.dataset.id));
      if (entry) confirmDelete(entry);
    })
  );
  tableWrap.querySelectorAll('.js-fav').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(parseInt(btn.dataset.id));
    })
  );
  tableWrap.querySelectorAll('.js-play').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const entry = findEntry(parseInt(btn.dataset.id));
      if (entry) openAudioPlayer(entry);
    })
  );
  tableWrap.querySelectorAll('.js-book').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const entry = findEntry(parseInt(btn.dataset.id));
      if (entry) openBookViewer(entry);
    })
  );
  tableWrap.querySelectorAll('.rating-stars').forEach(wrap => {
    wrap.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', e => {
        e.stopPropagation();
        const entryId = parseInt(wrap.dataset.id);
        const score   = parseInt(star.dataset.score);
        setRating(entryId, score);
      });
    });
  });
}

function setActiveTab(id) {
  activeView = 'collection';
  activeHomeStatus = '';
  activeTabId = id;
  selectedId  = null;
  detailPanel.classList.remove('open');
  applyTheme();
  render();
}

function setHomeView() {
  activeView = 'home';
  selectedId = null;
  detailPanel.classList.remove('open');
  applyTheme();
  render();
}

function createTypedTab(type = 'Custom') {
  const normalizedType = ENTRY_TYPES[type] ? type : 'Custom';
  const baseName = TAB_TYPE_LABELS[normalizedType] || TAB_TYPE_LABELS.Custom;
  const tab = mkTab(uniqueTabName(baseName), normalizedType);
  tabs.push(tab);
  if (WORKSPACE_GROUPS[normalizedType]?.length) {
    activeWorkspace[tab.id] = WORKSPACE_GROUPS[normalizedType][0].id;
  }
  activeTabId = tab.id;
  activeView = 'collection';
  activeHomeStatus = '';
  save();
  applyTheme();
  render();
  const el = tabbar.querySelector(`.tab[data-id="${tab.id}"]`);
  if (el) startRename(el, tab);
}

function addTab() {
  openTabTypePicker();
}

function deleteTab(id) {
  if (tabs.length === 1) { showToast('You must keep at least one collection.'); return; }
  const index = tabs.findIndex(t => t.id === id);
  if (index === -1) return;
  tabs.splice(index, 1);
  if (activeTabId === id) activeTabId = tabs[Math.min(index, tabs.length - 1)].id;
  if (detailPanel.classList.contains('open')) closeDetail();
  save(); render();
  showToast('Collection deleted.');
  playDeleteSound();
}


/* ─────────────────────────────────────────────────────────
   SECTION 12 — ENTRY ACTIONS
   ───────────────────────────────────────────────────────── */

function saveEntry(fields) {
  const tab = activeTab();
  if (!tab) return;

  if (editingId !== null) {
    const idx = tab.entries.findIndex(e => e.id === editingId);
    if (idx !== -1) {
      tab.entries[idx] = { ...tab.entries[idx], ...fields, updatedAt: new Date().toISOString() };
      showToast('Entry updated.');
    }
  } else {
    tab.entries.push(mkEntry(fields));
    showToast('Entry added.');
    playAddSound();
  }

  save(); render();
}

function deleteEntry(id) {
  for (const t of tabs) {
    const idx = t.entries.findIndex(e => e.id === id);
    if (idx !== -1) {
      t.entries.splice(idx, 1);
      if (selectedId === id) closeDetail();
      save(); render();
      showToast('Entry deleted.');
      playDeleteSound();
      return;
    }
  }
}

function duplicateEntry(id) {
  const original = findEntry(id);
  const tab      = findEntryTab(id);
  if (!original || !tab) return;
  const now  = new Date().toISOString();
  const copy = { ...JSON.parse(JSON.stringify(original)), id: nextId++, code: (original.code || '') + '-COPY', status: 'Draft', createdAt: now, updatedAt: now };
  tab.entries.push(copy);
  save(); render();
  showToast('Entry duplicated.');
  playAddSound();
}

function moveEntry(entryId, targetTabId) {
  const sourceTab = findEntryTab(entryId);
  const targetTab = tabs.find(t => t.id === targetTabId);
  if (!sourceTab || !targetTab || sourceTab.id === targetTab.id) return;
  const idx = sourceTab.entries.findIndex(e => e.id === entryId);
  if (idx === -1) return;
  const [entry] = sourceTab.entries.splice(idx, 1);
  entry.updatedAt = new Date().toISOString();
  targetTab.entries.push(entry);
  closeDetail(); save(); render();
  showToast(`Entry moved to "${targetTab.name}".`);
}


/* ─────────────────────────────────────────────────────────
   SECTION 13 — MODAL
   ───────────────────────────────────────────────────────── */

function openModal(entryId = null, forcedType = null) {
  const tab   = activeTab();
  if (!tab) return;
  const entry = entryId !== null ? findEntry(entryId) : null;

  // Resolve the entry type in order of priority
  const type = forcedType || entry?.entryType || tab.type || 'Custom';
  const typeDef = getTypeDef(type);

  editingId   = entryId;
  editingType = type;
  ratingValue = entry?.rating?.score || 0;

  // Header
  modalTitle.textContent = entry ? `Edit ${typeDef.label}` : `New ${typeDef.label}`;
  modalSub.textContent   = tab.name.toUpperCase();
  modalSave.textContent  = entry ? 'Save Changes' : `Add ${typeDef.label}`;
  applyModalVariant(type, typeDef);

  // Core fields
  fCode.value      = entry?.code      || '';
  fTitle.value     = entry?.title     || '';
  fYear.value      = entry?.year      || '';
  fCreator.value   = entry?.creator   || '';
  fCondition.value = entry?.condition || 'Good';
  fNotes.value     = entry?.notes     || '';

  eCode.textContent  = '';
  eTitle.textContent = '';
  fCode.classList.remove('is-error');
  fTitle.classList.remove('is-error');

  // Rating section — show only for types that have it
  updateStarInputs(ratingValue);
  fFavorite.checked = entry?.rating?.favorite || false;

  // Dynamic fields from ENTRY_TYPES schema
  dynamicFields.innerHTML = typeDef.fields.map(f => {
    const rawValue = entry?.[f.key];
    const value = rawValue === 0 ? '0' : esc(rawValue || '');
    if (f.type === 'textarea') {
      return `<div class="field span-2">
        <label class="field-label">${esc(f.label)}</label>
        <textarea class="field-textarea dyn-field" data-key="${f.key}" placeholder="${esc(f.ph || '')}">${value}</textarea>
        ${renderUploadButton(f, true)}
      </div>`;
    }
    if (f.type === 'select') {
      const options = (f.options || []).map(option => {
        const selected = String(rawValue || '') === option ? ' selected' : '';
        return `<option value="${esc(option)}"${selected}>${esc(option)}</option>`;
      }).join('');
      return `<div class="field">
        <label class="field-label">${esc(f.label)}</label>
        <select class="field-select dyn-field" data-key="${f.key}">
          <option value="">Select</option>
          ${options}
        </select>
      </div>`;
    }
    const inputType = f.type === 'url' ? 'text' : ['number', 'date'].includes(f.type) ? f.type : 'text';
    return `<div class="field">
      <label class="field-label">${esc(f.label)}</label>
      <input class="field-input dyn-field" data-key="${f.key}"
             type="${inputType}" placeholder="${esc(f.ph || '')}"
             value="${value}"/>
      ${renderUploadButton(f, false)}
    </div>`;
  }).join('');
  bindDynamicUploadControls();
  dynamicFields.querySelectorAll('.dyn-field').forEach(inp => {
    if (isAssetRef(inp.value)) setUploadStatus(inp.dataset.key, 'Uploaded file ready');
  });
  modalAttachments = normalizeAttachments(entry?.attachments);
  renderAttachmentList();

  // Admin fields
  fStatus.value      = entry?.status      || 'Draft';
  fResponsible.value = entry?.responsible || '';
  fLocation.value    = entry?.location    || '';

  // Conservation fields
  const cons = entry?.conservation || {};
  fConsState.value     = cons.state           || 'Good';
  fConsPriority.value  = cons.priority        || 'Low';
  fConsDesc.value      = cons.description     || '';
  fConsRisks.value     = cons.risks           || '';
  fConsLastInsp.value  = cons.lastInspection  || '';
  fConsNextInsp.value  = cons.nextInspection  || '';
  fConsInspector.value = cons.inspector       || '';
  fConsRecs.value      = cons.recommendations || '';

  // Review fields
  const rev = entry?.review || {};
  fReviewer.value   = rev.reviewer || '';
  fReviewNote.value = rev.note     || '';

  modalOverlay.classList.add('open');
  setTimeout(() => fTitle.focus(), 80);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.removeAttribute('data-entry-type');
  editingId = null;
  editingType = null;
  modalAttachments = [];
  renderAttachmentList();
}

function submitModal() {
  let valid = true;
  const code  = fCode.value.trim();
  const title = fTitle.value.trim();

  if (!code) {
    eCode.textContent = 'Accession number is required.';
    fCode.classList.add('is-error');
    valid = false;
  }
  if (!title) {
    eTitle.textContent = 'Title is required.';
    fTitle.classList.add('is-error');
    valid = false;
  }

  const allCodes = allEntries().filter(e => e.id !== editingId).map(e => e.code);
  if (code && allCodes.includes(code)) {
    eCode.textContent = 'Accession number already exists.';
    fCode.classList.add('is-error');
    valid = false;
  }

  if (!valid) return;

  // Collect dynamic fields
  const dynValues = {};
  dynamicFields.querySelectorAll('.dyn-field').forEach(inp => {
    dynValues[inp.dataset.key] = inp.value.trim();
  });

  const fields = {
    code, title, entryType: editingType,
    year:        fYear.value   ? parseInt(fYear.value) : null,
    creator:     fCreator.value.trim(),
    condition:   fCondition.value,
    notes:       fNotes.value.trim(),
    status:      fStatus.value,
    responsible: fResponsible.value.trim(),
    location:    fLocation.value.trim(),
    rating: {
      score:    ratingValue,
      favorite: fFavorite.checked,
    },
    attachments: normalizeAttachments(modalAttachments),
    conservation: {
      state:           fConsState.value,
      priority:        fConsPriority.value,
      description:     fConsDesc.value.trim(),
      risks:           fConsRisks.value.trim(),
      lastInspection:  fConsLastInsp.value,
      nextInspection:  fConsNextInsp.value,
      inspector:       fConsInspector.value.trim(),
      recommendations: fConsRecs.value.trim(),
    },
    review: {
      reviewer:   fReviewer.value.trim(),
      note:       fReviewNote.value.trim(),
      status:     fStatus.value === 'Approved' ? 'Approved' : fStatus.value === 'Needs Correction' ? 'Needs Correction' : 'Pending',
      reviewedAt: ['Approved','Needs Correction'].includes(fStatus.value) ? new Date().toISOString() : '',
    },
    ...dynValues,
  };

  saveEntry(fields);
  closeModal();
}


/* ─────────────────────────────────────────────────────────
   SECTION 14 — DETAIL PANEL
   ───────────────────────────────────────────────────────── */

function openDetail(entry) {
  selectedId = entry.id;
  const tab    = findEntryTab(entry.id);
  const type   = entry.entryType || tab?.type || '';
  const typeDef = ENTRY_TYPES[type] || null;
  const thumb = getEntryThumbnail(entry);
  const gallery = getEntryGallery(entry);
  const alerts = getEntryAlerts(entry);
  const condition = getEntryCondition(entry);
  const statusClass = STATUS_BADGE[entry.status] || 'draft';
  const room = getEntryRoom(type);

  dpCode.textContent  = entry.code  || '—';
  dpTitle.textContent = entry.title || 'Untitled';

  const coreRows = [
    ['Creator',    esc(entry.creator      || '—')],
    ['Year',       esc(entry.year         || '—')],
    ['Room',       esc(room               || '—')],
    ['Type',       esc(typeDef?.label || type || '—')],
    ['Condition',  `<span class="badge badge-${condition.toLowerCase()}">${esc(condition)}</span>`],
    ['Status',     `<span class="badge badge-${statusClass}">${esc(entry.status||'Draft')}</span>`],
    ['Favorite',   isFavorite(entry) ? 'Yes' : 'No'],
    ['Responsible', esc(entry.responsible || '—')],
    ['Location',    esc(entry.location    || '—')],
    ['Created',    entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-GB') : '—'],
    ['Updated',    entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : '—'],
  ];

  // Rating row (for types that have it)
  if (entry.rating?.score) {
    coreRows.push(['Rating', renderStarsHTMLDetail(entry)]);
  }

  // Dynamic fields
  const dynRows = typeDef
    ? typeDef.fields
        .filter(f => entry[f.key] && f.type !== 'textarea')
        .map(f => [f.label, renderDetailFieldValue(f, entry[f.key])])
    : [];

  // Conservation
  const cons = entry.conservation || {};
  const consRows = [
    ['State',      cons.state    ? `<span class="badge badge-${cons.state.toLowerCase()}">${esc(cons.state)}</span>` : '—'],
    ['Priority',   esc(cons.priority    || '—')],
    ['Inspector',  esc(cons.inspector   || '—')],
    ['Last Insp.', cons.lastInspection  ? formatDate(cons.lastInspection) : '—'],
    ['Next Insp.', cons.nextInspection  ? formatDate(cons.nextInspection) : '—'],
  ];

  // Review
  const rev = entry.review || {};
  const revRows = [
    ['Reviewer',      esc(rev.reviewer  || '—')],
    ['Review Status', esc(rev.status    || '—')],
    ['Reviewed At',   rev.reviewedAt    ? formatDate(rev.reviewedAt) : '—'],
  ];

  const mkRows = rows =>
    rows.map(([k, v]) =>
      `<div class="detail-row"><span class="detail-key">${k}</span><span class="detail-val">${v}</span></div>`
    ).join('');

  dpBody.innerHTML = `
    ${thumb ? `<div class="detail-media-hero">
      <img class="detail-hero-image" ${mediaAttrs(thumb)} alt="${esc(entry.title || type || 'Preview')}" loading="lazy">
    </div>` : ''}
    <div class="detail-record-head">
      <span class="detail-type-chip">${esc(typeDef?.icon || 'DM')} ${esc(room)}</span>
      <span class="badge badge-${condition.toLowerCase()}">${esc(condition)}</span>
      <span class="badge badge-${statusClass}">${esc(entry.status || 'Draft')}</span>
      ${isFavorite(entry) ? '<span class="badge badge-favorite">Favorite</span>' : ''}
    </div>
    <div class="detail-group">
      <div class="detail-group-title">Core Record</div>
      ${mkRows(coreRows)}
    </div>
    ${alerts.length ? `<div class="detail-group">
      <div class="detail-group-title">Collection Status</div>
      <div class="detail-alert-list">${alerts.map(alert => `<span class="row-alert-chip">${esc(alert)}</span>`).join('')}</div>
    </div>` : ''}
    ${dynRows.length ? `<div class="detail-group">
      <div class="detail-group-title">${esc(type)} Fields</div>
      ${mkRows(dynRows)}
    </div>` : ''}
    <div class="detail-group">
      <div class="detail-group-title">Conservation</div>
      ${mkRows(consRows)}
      ${cons.description     ? `<div class="detail-notes">${esc(cons.description)}</div>` : ''}
      ${cons.risks           ? `<div class="detail-notes">${esc(cons.risks)}</div>` : ''}
      ${cons.recommendations ? `<div class="detail-notes">${esc(cons.recommendations)}</div>` : ''}
    </div>
    <div class="detail-group">
      <div class="detail-group-title">Review</div>
      ${mkRows(revRows)}
      ${rev.note ? `<div class="detail-notes">${esc(rev.note)}</div>` : ''}
    </div>
    ${entry.notes ? `<div class="detail-group">
      <div class="detail-group-title">Provenance / Notes</div>
      <div class="detail-notes">${esc(entry.notes)}</div>
    </div>` : ''}
    ${entry.attachments?.length ? `<div class="detail-group">
      <div class="detail-group-title">Uploads</div>
      <div class="attachment-link-list">${renderAttachmentLinks(entry.attachments)}</div>
    </div>` : ''}
    ${gallery.length > 1 ? `<div class="detail-group">
      <div class="detail-group-title">Gallery</div>
      <div class="detail-gallery-strip">${gallery.map(url => `<img ${mediaAttrs(url)} alt="" loading="lazy">`).join('')}</div>
    </div>` : ''}
  `;
  hydrateAssetElements(dpBody);

  dpMoveSelect.innerHTML = tabs
    .filter(t => t.id !== tab?.id)
    .map(t => `<option value="${t.id}">${esc(t.name)}</option>`)
    .join('');

  dpEdit.onclick      = () => { closeDetail(); openModal(entry.id); };
  dpDelete.onclick    = () => confirmDelete(entry);
  dpDuplicate.onclick = () => { duplicateEntry(entry.id); closeDetail(); };
  dpMoveBtn.onclick   = () => { const targetId = parseInt(dpMoveSelect.value); if (targetId) moveEntry(entry.id, targetId); };

  detailPanel.classList.add('open');
  activeView === 'home' ? renderHomePage() : renderByTabType(activeTab());
}

function closeDetail() {
  selectedId = null;
  detailPanel.classList.remove('open');
  activeView === 'home' ? renderHomePage() : renderByTabType(activeTab());
}


/* ─────────────────────────────────────────────────────────
   SECTION 15 — CONFIRM DIALOG
   ───────────────────────────────────────────────────────── */

function confirmAction(title, sub, cb) {
  confirmTitle.textContent = title;
  confirmSub.textContent   = sub;
  confirmCb = cb;
  confirmOverlay.classList.add('open');
}

function confirmDelete(entry) {
  confirmAction(
    'Delete this entry?',
    `"${entry.title || 'Untitled'}" (${entry.code || 'no code'}) will be permanently removed.`,
    () => deleteEntry(entry.id)
  );
}

confirmYes.addEventListener('click', () => {
  confirmOverlay.classList.remove('open');
  if (confirmCb) { confirmCb(); confirmCb = null; }
});

confirmNo.addEventListener('click', () => { confirmOverlay.classList.remove('open'); confirmCb = null; });


/* ─────────────────────────────────────────────────────────
   SECTION 16 — IMPORT / EXPORT
   ───────────────────────────────────────────────────────── */

function exportCSV() {
  const tab = activeTab();
  if (!tab || tab.entries.length === 0) { showToast('Nothing to export.'); return; }
  const headers = ['code','title','creator','year','condition','status','location','responsible','notes','createdAt','updatedAt'];
  const rows = tab.entries.map(e => headers.map(k => `"${String(e[k] ?? '').replace(/"/g, '""')}"`).join(','));
  downloadBlob(new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' }), `dump-${slugify(tab.name)}-${dateStamp()}.csv`);
  showToast(`Exported ${tab.entries.length} entries as CSV.`);
}

function exportJSON() {
  downloadBlob(new Blob([JSON.stringify({ nextId, tabs, activeWorkspace }, null, 2)], { type: 'application/json' }), `dump-full-${dateStamp()}.json`);
  showToast('Full DUMP export ready.');
}

function handleImport(file) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = e => {
    try {
      if (ext === 'json')      importJSON(e.target.result);
      else if (ext === 'csv')  importCSV(e.target.result);
      else showToast('Unsupported file type. Use .json or .csv');
    } catch (err) {
      showToast('Import failed — check the file format.');
      console.error('DUMP import error:', err);
    }
  };
  reader.readAsText(file);
}

function importJSON(text) {
  const data = JSON.parse(text);
  if (!data.tabs || !Array.isArray(data.tabs)) throw new Error('Invalid JSON');
  confirmAction('Import JSON?', 'This will replace your entire DUMP workspace. This cannot be undone.', () => {
    nextId = data.nextId || 1;
    tabs   = data.tabs.map(migrateTab);
    activeWorkspace = data.activeWorkspace || Object.create(null);
    activeTabId = tabs[0]?.id || null;
    save(); render();
    showToast('DUMP imported successfully.');
  });
}

function importCSV(text) {
  const tab = activeTab();
  if (!tab) return;
  const lines   = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const imported = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return mkEntry({ code: obj.code||'', title: obj.title||'Imported Entry', creator: obj.creator||'', year: obj.year?parseInt(obj.year):null, condition: obj.condition||'Good', status: obj.status||'Draft', location: obj.location||'', responsible: obj.responsible||'', notes: obj.notes||'', entryType: tab.type || '' });
  });
  confirmAction('Import CSV?', `${imported.length} entries will be added to "${tab.name}".`, () => {
    tab.entries.push(...imported);
    save(); render();
    showToast(`${imported.length} entries imported.`);
  });
}

function parseCSVLine(line) {
  const result = []; let current = ''; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQuotes && line[i+1] === '"') { current += '"'; i++; } else inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else current += ch;
  }
  result.push(current.trim());
  return result;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click(); URL.revokeObjectURL(url);
}


/* ─────────────────────────────────────────────────────────
   SECTION 17 — TOAST
   ───────────────────────────────────────────────────────── */

let toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}


/* ─────────────────────────────────────────────────────────
   SECTION 18 — UTILITY
   ───────────────────────────────────────────────────────── */

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function dateStamp() { return new Date().toISOString().slice(0, 10); }

function slugify(str) { return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }

function formatDate(str) { try { return new Date(str).toLocaleDateString('en-GB'); } catch { return str || '—'; } }

function formatTime(secs) {
  if (!isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}


/* ─────────────────────────────────────────────────────────
   SECTION 19 — EVENT LISTENERS
   ───────────────────────────────────────────────────────── */

function initTabbarScrolling() {
  if (!tabbar) return;

  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let didDrag = false;
  let suppressNextClick = false;
  let suppressClickTimer = null;
  let pointerId = null;

  tabbar.addEventListener('wheel', event => {
    if (tabbar.scrollWidth <= tabbar.clientWidth) return;

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;

    const before = tabbar.scrollLeft;
    tabbar.scrollLeft += delta;
    if (tabbar.scrollLeft !== before) event.preventDefault();
  }, { passive: false });

  tabbar.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    if (event.target.closest('.tab-del, .tab-rename-input')) return;
    if (tabbar.scrollWidth <= tabbar.clientWidth) return;

    isPointerDown = true;
    didDrag = false;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = tabbar.scrollLeft;
    tabbar.classList.add('is-dragging');
  });

  document.addEventListener('pointermove', event => {
    if (!isPointerDown || event.pointerId !== pointerId) return;

    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > 4) didDrag = true;
    if (!didDrag) return;

    tabbar.scrollLeft = startScrollLeft - deltaX;
    event.preventDefault();
  });

  const endDrag = event => {
    if (!isPointerDown) return;
    if (event.pointerId !== undefined && pointerId !== null && event.pointerId !== pointerId) return;

    const shouldSuppressClick = didDrag;
    isPointerDown = false;
    pointerId = null;
    tabbar.classList.remove('is-dragging');

    if (shouldSuppressClick) {
      suppressNextClick = true;
      window.clearTimeout(suppressClickTimer);
      suppressClickTimer = window.setTimeout(() => {
        suppressNextClick = false;
        didDrag = false;
      }, 80);
    } else {
      didDrag = false;
    }
  };

  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  tabbar.addEventListener('click', event => {
    if (!suppressNextClick) return;
    window.clearTimeout(suppressClickTimer);
    suppressNextClick = false;
    didDrag = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

homeEnterBtn.addEventListener('click', () => {
  document.body.classList.remove('home-open');
});

addTabBtn.addEventListener('click', addTab);
sidebarToggle?.addEventListener('click', toggleSidebar);

// "Add Entry" now routes through the type system
addEntryBtn.addEventListener('click', openNewEntryModal);

tableWrap.addEventListener('click', event => {
  const createButton = event.target.closest('[data-empty-add]');
  if (!createButton || !tableWrap.contains(createButton)) return;
  event.preventDefault();
  event.stopPropagation();
  openNewEntryModal();
}, true);

tableWrap.addEventListener('click', event => {
  const clearButton = event.target.closest('[data-empty-clear]');
  if (!clearButton || !tableWrap.contains(clearButton)) return;
  event.preventDefault();
  event.stopPropagation();
  clearEntryFilters();
}, true);

searchInput.addEventListener('input',    () => { searchQuery     = searchInput.value;    renderByTabType(activeTab()); });
condFilterEl.addEventListener('change',  () => { condFilterVal   = condFilterEl.value;   renderByTabType(activeTab()); });
statusFilterEl.addEventListener('change',() => { statusFilterVal = statusFilterEl.value; renderByTabType(activeTab()); });
viewModeBtns.forEach(btn => {
  btn.addEventListener('click', () => setEntryViewMode(btn.dataset.viewMode));
});

$('exportCsvBtn').addEventListener('click',  exportCSV);
$('exportJsonBtn').addEventListener('click', exportJSON);
$('importBtn').addEventListener('click',     () => $('importFileInput').click());
$('importFileInput').addEventListener('change', e => { handleImport(e.target.files[0]); e.target.value = ''; });

modalClose.addEventListener('click',   closeModal);
modalCancel.addEventListener('click',  closeModal);
modalSave.addEventListener('click',    submitModal);
attachmentUploadBtn.addEventListener('click', () => attachmentUploadInput.click());
attachmentUploadInput.addEventListener('change', async () => {
  if (!attachmentUploadInput.files?.length) return;
  try {
    await uploadFiles(attachmentUploadInput.files, item => modalAttachments.push(item));
    renderAttachmentList();
  } catch (error) {
    console.error('DUMP attachment upload error', error);
    showToast('Upload failed. Try a smaller file or another format.');
  } finally {
    attachmentUploadInput.value = '';
  }
});
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

fCode.addEventListener('input',  () => { fCode.classList.remove('is-error');  eCode.textContent  = ''; });
fTitle.addEventListener('input', () => { fTitle.classList.remove('is-error'); eTitle.textContent = ''; });

detailClose.addEventListener('click', closeDetail);

typePickerClose.addEventListener('click', closeTypePicker);
typePickerOverlay.addEventListener('click', e => { if (e.target === typePickerOverlay) closeTypePicker(); });
typePickerGrid.addEventListener('click', event => {
  const card = event.target.closest('.type-card');
  if (!card || !typePickerGrid.contains(card)) return;
  event.preventDefault();
  chooseEntryType(card.dataset.type);
});

confirmOverlay.addEventListener('click', e => { if (e.target === confirmOverlay) { confirmOverlay.classList.remove('open'); confirmCb = null; } });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (confirmOverlay.classList.contains('open'))  { confirmOverlay.classList.remove('open'); confirmCb = null; return; }
    if (modalOverlay.classList.contains('open'))    { closeModal(); return; }
    if (typePickerOverlay.classList.contains('open')){ closeTypePicker(); return; }
    if (!bookViewer.classList.contains('bv-hidden')) { closeBookViewer(); return; }
    if (detailPanel.classList.contains('open'))     { closeDetail(); return; }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); openNewEntryModal(); }
});


/* ─────────────────────────────────────────────────────────
   SECTION 20 — CLICK SOUND
   ───────────────────────────────────────────────────────── */

const clickAudio = $('clickSound');
const addAudio = $('addSound');
const deleteAudio = $('deleteSound');
let uiAudioContext = null;

function getUiAudioContext() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!uiAudioContext) uiAudioContext = new AudioContextCtor();
  if (uiAudioContext.state === 'suspended') uiAudioContext.resume().catch(() => {});
  return uiAudioContext;
}

function playSynthTone(ctx, freq, start, duration, gainValue, type = 'square') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playSynthNoise(ctx, start, duration, gainValue, filterType = 'highpass', filterFreq = 1200) {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const progress = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - progress, 1.8);
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = filterType;
  filter.frequency.setValueAtTime(filterFreq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(start);
}

function playSynthEffect(kind) {
  const ctx = getUiAudioContext();
  if (!ctx) return false;
  const now = ctx.currentTime + 0.01;

  if (kind === 'add') {
    playSynthNoise(ctx, now, 0.22, 0.11, 'highpass', 1050);
    playSynthTone(ctx, 1240, now + 0.025, 0.055, 0.045, 'triangle');
    playSynthTone(ctx, 1760, now + 0.20, 0.07, 0.04, 'square');
    return true;
  }

  if (kind === 'delete') {
    playSynthNoise(ctx, now, 0.14, 0.12, 'highpass', 1500);
    playSynthNoise(ctx, now + 0.07, 0.17, 0.09, 'bandpass', 1100);
    playSynthNoise(ctx, now + 0.18, 0.18, 0.075, 'bandpass', 760);
    playSynthNoise(ctx, now + 0.34, 0.13, 0.055, 'lowpass', 520);
    playSynthTone(ctx, 128, now + 0.48, 0.095, 0.035, 'triangle');
    return true;
  }

  if (kind === 'click') {
    playSynthTone(ctx, 1500, now, 0.025, 0.025, 'square');
    return true;
  }

  return false;
}

function playUiSound(audio) {
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise?.catch) playPromise.catch(() => {});
    return true;
  } catch {
    return false;
  }
}

function playClickSound() {
  if (!playUiSound(clickAudio)) playSynthEffect('click');
}

function playAddSound() {
  if (!playSynthEffect('add')) playUiSound(addAudio);
}

function playDeleteSound() {
  if (!playSynthEffect('delete')) playUiSound(deleteAudio);
}

document.addEventListener('click', event => {
  const target = event.target.closest('button, .tab, .tab-add, .tab-del, .row-btn, .recent-item, .vault-table tbody tr, input, select');
  if (target) playClickSound();
}, true);


/* ─────────────────────────────────────────────────────────
   SECTION 21 — INIT
   ───────────────────────────────────────────────────────── */

function init() {
  const restored = load();

  if (!restored) {
    tabs = [
      mkTab('Books',        'Books'),
      mkTab('Films',        'Films'),
      mkTab('Sounds',       'Sounds'),
      mkTab('Artifacts',    'Artifacts'),
      mkTab('Architecture', 'Architecture'),
      mkTab('Clothes',      'Clothes'),
      mkTab('Pets',         'Pets'),
      mkTab('Food',         'Food'),
      mkTab('Nature',       'Nature'),
    ];
    activeTabId = tabs[0].id;
  }

  const seeded = applyTestSeed();
  const soundDefaulted = applySoundWorkspaceDefault();
  if (!restored || seeded || soundDefaulted) save();

  applyTheme();
  applySidebarState();
  initTabbarScrolling();
  render();
  initAudioPlayer();
  initPlayerDrag();
}

init();


/* ─────────────────────────────────────────────────────────
   SECTION 22 — ENTRY TYPE SYSTEM
   ───────────────────────────────────────────────────────── */

// openEntryTypePicker — shows the type selection modal.
// Called when tab type is Custom or user clicks + Add Entry on an ambiguous tab.
function openEntryTypePicker() {
  openTypePicker(
    'Choose Entry Type',
    'What are you cataloguing?',
    type => openModal(null, type),
  );
}

function openTabTypePicker() {
  openTypePicker(
    'Choose Collection Type',
    'Pick the kind of collection you want to create.',
    type => createTypedTab(type),
  );
}

function openTypePicker(title, subtitle, onChoose) {
  typePickerTitle.textContent = title;
  typePickerSub.textContent = subtitle;
  typePickerAction = onChoose;
  renderTypePickerGrid();
  typePickerOverlay.classList.add('open');
}

function closeTypePicker() {
  typePickerOverlay.classList.remove('open');
  typePickerAction = null;
}

// renderTypePickerGrid — builds the type cards inside the picker modal.
function renderTypePickerGrid() {
  typePickerGrid.innerHTML = Object.entries(ENTRY_TYPES).map(([key, def]) => `
    <div class="type-card" data-type="${key}">
      <div class="type-card-label">${esc(def.label)}</div>
      <div class="type-card-desc">${esc(def.description)}</div>
    </div>
  `).join('');
}

// chooseEntryType — closes picker and opens the correct modal.
function chooseEntryType(type) {
  const action = typePickerAction;
  closeTypePicker();
  if (action) action(type);
}


/* ─────────────────────────────────────────────────────────
   SECTION 23 — TAB BEHAVIOR SYSTEM
   renderByTabType wraps renderTable and dispatches to
   specialized renderers based on the tab's type.
   renderTable itself is never modified.
   ───────────────────────────────────────────────────────── */

// renderByTabType — the single entry point for rendering content.
// Replaces direct calls to renderTable() in the master render cycle.
function renderByTabType(tab) {
  if (!tab) { renderTable(); return; }

  const behavior = TAB_BEHAVIORS[tab.type] || 'custom';

  switch (behavior) {
    case 'audio':        renderAudioView(tab);        break;
    case 'books':        renderBooksView(tab);        break;
    case 'media':        renderMediaView(tab);        break;
    case 'architecture': renderArchitectureView(tab); break;
    case 'artifact':     renderArtifactView(tab);     break;
    case 'clothes':      renderClothesView(tab);      break;
    case 'pets':         renderPetsView(tab);         break;
    case 'food':         renderFoodView(tab);         break;
    case 'nature':       renderNatureView(tab);       break;
    default:             renderTable();               break;
  }
  hydrateAssetElements(tableWrap);
}

// renderBooksView — Books tab: standard table + cover column + viewer button.
// Delegates the actual table build to renderTable(), which already handles
// the showCover and js-book flags via the buildRow function.
function renderBooksView(tab) {
  const workspace = getWorkspace(tab);

  if (workspace === 'reader') {
    const readable = filtered().filter(entry => entry.pageContent || entry.readerUrl);
    const body = readable.length
      ? `<div class="workspace-card-grid">
          ${readable.map(entry => `
            <button class="workspace-media-card js-reader-open" data-id="${entry.id}">
              ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">BK</div>`}
              <strong>${esc(entry.title || 'Untitled')}</strong>
              <span>${esc(entry.creator || entry.publisher || 'No author')}</span>
              <small>${entry.readerUrl ? 'External reader linked' : 'Local reader pages ready'}</small>
            </button>`).join('')}
        </div>`
      : renderWorkspaceEmpty('Add page content or a reader URL to unlock the library reader.');
    renderWorkspaceHeader(tab, 'Library Reader', 'Paginated reading, scan metadata, and document access in one place.', body);
    tableWrap.querySelectorAll('.js-reader-open').forEach(button => {
      button.addEventListener('click', async () => {
        const entry = findEntry(parseInt(button.dataset.id));
        if (!entry) return;
        if (entry.pageContent) openBookViewer(entry);
        else if (entry.readerUrl) await openLocalAsset(entry.readerUrl);
      });
    });
    return;
  }

  if (workspace === 'preservation') {
    const flagged = filtered().filter(entry => getEntryAlerts(entry).length);
    const body = `
      <div class="workspace-panel-grid">
        <div class="workspace-panel">
          <div class="workspace-panel-title">Preservation Alerts</div>
          <div class="workspace-list">
            ${flagged.length ? flagged.map(entry => `<button class="workspace-list-item" data-entry-id="${entry.id}">
              <strong>${esc(entry.title || entry.code)}</strong>
              <span>${esc(getEntryAlerts(entry).join(' • '))}</span>
            </button>`).join('') : '<div class="workspace-empty-inline">No active preservation alerts.</div>'}
          </div>
        </div>
        <div class="workspace-panel">
          <div class="workspace-panel-title">Copy Mix</div>
          <div class="workspace-stat-stack">
            <div><strong>${filtered().filter(entry => (entry.copyType || '').startsWith('Physical')).length}</strong><span>Physical copies</span></div>
            <div><strong>${filtered().filter(entry => (entry.copyType || '').startsWith('Digital')).length}</strong><span>Digital copies</span></div>
            <div><strong>${filtered().filter(entry => entry.ocrStatus === 'Verified').length}</strong><span>OCR verified</span></div>
          </div>
        </div>
      </div>`;
    renderWorkspaceHeader(tab, 'Preservation Control', 'Condition, scan quality, OCR, and review rules for the library collection.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }

  renderTable();
  const body = tableWrap.innerHTML;
  renderWorkspaceHeader(tab, 'Catalog', 'Document intake, thumbnails, review status, and collection-state checks.', body);
  bindTableInteractions();
}

function renderSoundDeckPlayer(entry = null) {
  const title = entry?.title || 'Unknown';
  const sub = [entry?.artist || entry?.creator, entry?.album || entry?.audioFormat].filter(Boolean).join(' / ') || 'Select a sound entry';
  const pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) * 100 : 0;
  const isPlaying = isPlayerOpen && !audioEl.paused && audioCurrentEntry;

  return `
    <div class="sound-deck-player${isPlaying ? ' is-playing' : ''}" data-sound-deck>
      <div class="sound-deck-capsule">
        <div class="sound-deck-pod">
          <button class="sound-deck-volume" type="button" data-audio-control="volume-up">+</button>
          <div class="sound-deck-pod-controls">
            <button class="sound-deck-btn sound-deck-skip" type="button" data-audio-control="prev">&#9664;&#9664;</button>
            <button class="sound-deck-btn sound-deck-play" type="button" data-audio-control="play">${isPlaying ? '&#10074;&#10074;' : '&#9654;'}</button>
            <button class="sound-deck-btn sound-deck-skip" type="button" data-audio-control="next">&#9654;&#9654;</button>
          </div>
          <button class="sound-deck-volume" type="button" data-audio-control="volume-down">-</button>
        </div>
        <div class="sound-deck-display">
          <div class="sound-deck-title js-sound-deck-title">${esc(title)}</div>
          <div class="sound-deck-progress" data-audio-control="seek" style="--progress-left:${Math.max(0, Math.min(100, pct))}%">
            <div class="sound-deck-progress-fill js-sound-deck-progress" style="width:${Math.max(0, Math.min(100, pct))}%"></div>
            <span class="sound-deck-progress-knob"></span>
          </div>
          <div class="sound-deck-footer">
            <span>&#8644;</span>
            <strong class="js-sound-deck-time">${formatTime(audioEl.currentTime || 0)}</strong>
            <span>&#8635;</span>
          </div>
          <div class="sound-deck-sub js-sound-deck-sub">${esc(sub)}</div>
        </div>
      </div>
      <div class="sound-deck-actions">
        <button class="btn btn-primary" type="button" data-audio-control="mini">Mini player</button>
      </div>
    </div>`;
}

function getCurrentAudioEntry() {
  return audioCurrentEntry || audioPlaylist[audioCurrentIndex] || audioPlaylist[0] || null;
}

function ensureAudioEntryLoaded() {
  const entry = getCurrentAudioEntry();
  if (!entry) {
    showToast('Add a playable sound entry first.');
    return null;
  }
  if (!audioCurrentEntry) {
    const index = audioPlaylist.findIndex(item => item.id === entry.id);
    audioCurrentIndex = index >= 0 ? index : 0;
    loadAudioEntry(entry);
    floatingPlayer.classList.remove('fp-hidden');
    isPlayerOpen = true;
  }
  return entry;
}

function setAudioVolume(value) {
  const next = Math.max(0, Math.min(1, value));
  audioEl.volume = next;
  fpVolume.value = String(next);
}

function handleAudioControl(action, event = null) {
  if (action === 'play') {
    const entry = ensureAudioEntryLoaded();
    if (!entry) return;
    if (audioEl.paused) audioEl.play().catch(() => showToast('Cannot play - check the audio URL.'));
    else audioEl.pause();
    return;
  }
  if (action === 'prev') {
    audioPlayerPrev();
    return;
  }
  if (action === 'next') {
    audioPlayerNext();
    return;
  }
  if (action === 'mini') {
    const entry = ensureAudioEntryLoaded();
    if (!entry) return;
    floatingPlayer.classList.remove('fp-hidden');
    isPlayerOpen = true;
    minimizeAudioPlayer();
    return;
  }
  if (action === 'volume-up') {
    setAudioVolume(parseFloat(fpVolume.value) + 0.08);
    return;
  }
  if (action === 'volume-down') {
    setAudioVolume(parseFloat(fpVolume.value) - 0.08);
    return;
  }
  if (action === 'seek' && event && audioEl.duration) {
    const rect = event.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audioEl.currentTime = pct * audioEl.duration;
  }
}

function bindSoundDeckControls(root = document) {
  root.querySelectorAll('[data-audio-control]').forEach(button => {
    if (button.dataset.audioBound) return;
    button.dataset.audioBound = '1';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      handleAudioControl(button.dataset.audioControl, event);
    });
  });
}

function updateSoundDeckDisplay() {
  const entry = getCurrentAudioEntry();
  const title = entry?.title || 'Unknown';
  const sub = [entry?.artist || entry?.creator, entry?.album || entry?.audioFormat].filter(Boolean).join(' / ') || 'Select a sound entry';
  const pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) * 100 : 0;
  const isPlaying = isPlayerOpen && !audioEl.paused && !!entry;

  document.querySelectorAll('[data-sound-deck]').forEach(deck => {
    deck.classList.toggle('is-playing', isPlaying);
    deck.querySelector('.js-sound-deck-title').textContent = title;
    deck.querySelector('.js-sound-deck-sub').textContent = sub;
    deck.querySelector('.js-sound-deck-time').textContent = formatTime(audioEl.currentTime || 0);
    deck.querySelector('.js-sound-deck-progress').style.width = `${Math.max(0, Math.min(100, pct))}%`;
    deck.querySelector('.sound-deck-progress').style.setProperty('--progress-left', `${Math.max(0, Math.min(100, pct))}%`);
    const playButton = deck.querySelector('[data-audio-control="play"]');
    if (playButton) playButton.innerHTML = isPlaying ? '&#10074;&#10074;' : '&#9654;';
  });
}

function renderAudioView(tab) {
  const workspace = getWorkspace(tab);
  audioPlaylist = tab.entries.filter(entry => entry.audioUrl);

  if (!tab.entries.length) {
    renderWorkspaceHeader(tab, 'Sound Library', 'Player-ready audio records, format notes, and metadata routing.', renderEmptyState(tab));
    bindEntryCardInteractions();
    return;
  }

  if (workspace === 'player') {
    const currentEntry = getCurrentAudioEntry();
    const body = `
      <div class="sound-workspace-layout">
        <div class="workspace-panel sound-player-workspace-panel">
          <div class="workspace-panel-title">Playback Deck</div>
          ${renderSoundDeckPlayer(currentEntry)}
        </div>
        <div class="workspace-panel">
          <div class="workspace-panel-title">Player Queue</div>
          <div class="workspace-list">
            ${audioPlaylist.length ? audioPlaylist.map(entry => `<button class="workspace-list-item js-sound-play" data-id="${entry.id}">
              <strong>${esc(entry.title || 'Untitled')}</strong>
              <span>${esc([entry.artist || entry.creator, entry.audioFormat || entry.duration].filter(Boolean).join(' • '))}</span>
            </button>`).join('') : '<div class="workspace-empty-inline">No playable URLs yet.</div>'}
          </div>
        </div>
        <div class="workspace-panel">
          <div class="workspace-panel-title">Session File Loader</div>
          <p class="workspace-copy">Load a local audio file into the floating player for the current session without changing the saved record.</p>
          <button class="btn btn-primary" id="audioSessionPickerBtn">Load local audio</button>
          <input type="file" id="audioSessionPickerInput" accept="audio/*" style="display:none">
        </div>
      </div>`;
    renderWorkspaceHeader(tab, 'Player Deck', 'Floating playback controls, supported audio formats, and quick queue access.', body);
    bindSoundDeckControls(tableWrap);
    tableWrap.querySelectorAll('.js-sound-play').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.id));
        if (entry) openAudioPlayer(entry);
      });
    });
    const pickerBtn = $('audioSessionPickerBtn');
    const pickerInput = $('audioSessionPickerInput');
    if (pickerBtn && pickerInput) {
      pickerBtn.addEventListener('click', () => pickerInput.click());
      pickerInput.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (!file) return;
        const tempEntry = {
          id: -1,
          title: file.name.replace(/\.[^.]+$/, ''),
          creator: 'Local session file',
          album: 'Session playback',
          audioUrl: URL.createObjectURL(file),
        };
        audioPlaylist = [tempEntry];
        openAudioPlayer(tempEntry);
        event.target.value = '';
      });
    }
    return;
  }

  if (workspace === 'metadata') {
    const byFormat = Object.entries(filtered().reduce((acc, entry) => {
      const key = entry.audioFormat || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}));
    const byState = Object.entries(filtered().reduce((acc, entry) => {
      const key = entry.playerState || 'Ready';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}));
    const body = `
      <div class="workspace-panel-grid">
        <div class="workspace-panel">
          <div class="workspace-panel-title">Formats</div>
          <div class="workspace-stat-list">
            ${byFormat.map(([label, count]) => `<div><strong>${count}</strong><span>${esc(label)}</span></div>`).join('') || '<div class="workspace-empty-inline">No formats catalogued yet.</div>'}
          </div>
        </div>
        <div class="workspace-panel">
          <div class="workspace-panel-title">Player States</div>
          <div class="workspace-stat-list">
            ${byState.map(([label, count]) => `<div><strong>${count}</strong><span>${esc(label)}</span></div>`).join('') || '<div class="workspace-empty-inline">No states catalogued yet.</div>'}
          </div>
        </div>
      </div>`;
    renderWorkspaceHeader(tab, 'Sound Metadata', 'Audio format support, player states, and label/source overview.', body);
    return;
  }

  renderTable();
  renderWorkspaceHeader(tab, 'Sound Library', 'Track thumbnails, playback actions, and collection-state alerts.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderMediaView(tab) {
  renderTable();
  renderWorkspaceHeader(tab, 'Screen Index', 'Poster-ready film and series tracking with ratings, reviews, and status.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderArchitectureView(tab) {
  const workspace = getWorkspace(tab);
  if (workspace === 'blueprint') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-media-card" data-entry-id="${entry.id}">
        ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">AX</div>`}
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc(entry.architect || entry.creator || 'Architect pending')}</span>
        <small>${esc(entry.siteStatus || 'Site status unknown')}</small>
      </button>`, 'No blueprint records yet. Add architecture records with preview or blueprint URLs.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Blueprint Board', 'Visual previews, concept images, and status snapshots for architecture records.', body);
    return;
  }
  if (workspace === 'materials') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-info-card" data-entry-id="${entry.id}">
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc(entry.materials || 'No materials noted')}</span>
        <small>${esc(entry.style || entry.category || 'Unclassified')}</small>
      </button>`, 'No material cards yet. Add an architecture record to populate this workspace.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Material Index', 'Materials, site categories, and survey notes for built environments.', body);
    return;
  }
  if (workspace === 'location') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-info-card" data-entry-id="${entry.id}">
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc(entry.arLocation || 'Location pending')}</span>
        <small>${esc(entry.siteStatus || 'Status unknown')}</small>
      </button>`, 'No site locations yet. Add an architecture record to map this workspace.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Location View', 'Site locations, address fields, and blueprint-linked records.', body);
    return;
  }
  renderTable();
  renderWorkspaceHeader(tab, 'Structure Index', 'Blueprint, material, and site-status catalog for architecture records.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderArtifactView(tab) {
  const workspace = getWorkspace(tab);
  if (workspace === 'conservation') {
    const flagged = filtered().filter(entry => getEntryAlerts(entry).length);
    const materialSummary = Object.entries(filtered().reduce((acc, entry) => {
      const key = entry.medium || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}));
    const body = `<div class="workspace-panel-grid">
      <div class="workspace-panel">
        <div class="workspace-panel-title">Priority Objects</div>
        <div class="workspace-list">
          ${renderWorkspaceItems(flagged, entry => `<button class="workspace-list-item" data-entry-id="${entry.id}">
            <strong>${esc(entry.title || entry.code)}</strong>
            <span>${esc(getEntryAlerts(entry).join(' • '))}</span>
          </button>`, 'No flagged objects.', null)}
        </div>
      </div>
      <div class="workspace-panel">
        <div class="workspace-panel-title">Material Summary</div>
        <div class="workspace-stat-list">
          ${materialSummary.length ? materialSummary.map(([label, count]) => `<div><strong>${count}</strong><span>${esc(label)}</span></div>`).join('') : renderWorkspaceEmpty('No material data yet.', null)}
        </div>
      </div>
    </div>`;
    renderWorkspaceHeader(tab, 'Conservation Desk', 'Condition index, damage types, and preservation priorities.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  if (workspace === 'review') {
    const entries = filtered().filter(entry => ['Pending Review', 'Needs Correction'].includes(entry.status) || entry.review?.status === 'Pending');
    const body = `<div class="workspace-panel">
      <div class="workspace-panel-title">Curatorial Review Queue</div>
      <div class="workspace-list">
        ${renderWorkspaceItems(entries, entry => `<button class="workspace-list-item" data-entry-id="${entry.id}">
          <strong>${esc(entry.title || entry.code || 'Untitled object')}</strong>
          <span>${esc([entry.status || 'Draft', entry.review?.reviewer || 'No reviewer', entry.medium || 'Material pending'].filter(Boolean).join(' • '))}</span>
        </button>`, 'No objects are waiting for review. Add an artifact or change its status to Pending Review.')}
      </div>
    </div>`;
    renderWorkspaceHeader(tab, 'Review Queue', 'Curatorial status, reviewer ownership, and correction work for artifact records.', body);
    return;
  }
  renderTable();
  renderWorkspaceHeader(tab, 'Artifact Inventory', 'Object intake, image previews, and museum-style review control.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderClothesView(tab) {
  const workspace = getWorkspace(tab);
  if (workspace === 'builder') {
    const body = `
      <div class="workspace-panel-grid">
        ${['Top', 'Bottom', 'Full Piece', 'Shoes', 'Accessory', 'Add-On Piece'].map(category => {
          const matches = filtered().filter(entry => entry.mainCategory === category).slice(0, 4);
          return `<div class="workspace-panel">
            <div class="workspace-panel-title">${esc(category)}</div>
            <div class="workspace-mini-list">
              ${matches.length ? matches.map(entry => `<button class="workspace-mini-card" data-entry-id="${entry.id}">
                ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">${esc((entry.mainCategory || 'CL').slice(0,2))}</div>`}
                <span>${esc(entry.title || 'Untitled')}</span>
              </button>`).join('') : '<div class="workspace-empty-inline">No pieces yet.</div>'}
            </div>
          </div>`;
        }).join('')}
      </div>`;
    renderWorkspaceHeader(tab, 'Look Builder', 'Mix tops, bottoms, full looks, shoes, and accessories from the wardrobe.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  if (workspace === 'lookbook') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-media-card" data-entry-id="${entry.id}">
        ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">CL</div>`}
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc(entry.lookbookName || entry.styleTags || 'No lookbook group')}</span>
      </button>`, 'No wardrobe cards yet. Add clothing records to build this lookbook.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Lookbook', 'Visual outfit groupings, style tags, and PNG-ready wardrobe references.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  renderTable();
  renderWorkspaceHeader(tab, 'Wardrobe', 'Storage, style tags, and thumbnail support for clothing records.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderPetsView(tab) {
  const workspace = getWorkspace(tab);
  if (workspace === 'profiles') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-media-card" data-entry-id="${entry.id}">
        ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">PT</div>`}
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc([entry.speciesGroup, entry.breedType].filter(Boolean).join(' • ') || 'Species pending')}</span>
        <small>${esc(entry.animalStatus || 'Status pending')}</small>
      </button>`, 'No animal profiles yet. Add a pet or encounter record to populate profiles.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Profiles', 'Photo-led pet profiles with breed, life stage, habitat, and status.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  if (workspace === 'encounters') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-info-card" data-entry-id="${entry.id}">
        <strong>${esc(entry.title || 'Untitled encounter')}</strong>
        <span>${esc([entry.encounterType, entry.habitat].filter(Boolean).join(' • ') || 'Encounter details pending')}</span>
        <small>${esc([entry.lifeStage, entry.animalStatus].filter(Boolean).join(' • ') || 'Status pending')}</small>
      </button>`, 'No encounters yet. Add a pet or animal observation record.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Encounter Log', 'Animal sightings, companion records, habitat notes, and care status in one view.', body);
    return;
  }
  renderTable();
  renderWorkspaceHeader(tab, 'Animal Directory', 'Encounter tracking, habitat notes, and care-state alerts.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderFoodView(tab) {
  const workspace = getWorkspace(tab);
  if (workspace === 'gallery') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-media-card" data-entry-id="${entry.id}">
        ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">FD</div>`}
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc([entry.cuisine, entry.mealTime].filter(Boolean).join(' • ') || 'Untagged')}</span>
        <small>${esc(entry.tasteRating || 'No taste rating')}</small>
      </button>`, 'No food cards yet. Add tasting records to populate the gallery.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Food Gallery', 'Photo-first tasting records with cuisine, meal time, and taste rating.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  if (workspace === 'warnings') {
    const flagged = filtered().filter(entry => entry.allergyWarning || getEntryAlerts(entry).length);
    const body = `<div class="workspace-panel">
      <div class="workspace-panel-title">Allergy and Warning Index</div>
      <div class="workspace-list">
        ${flagged.length ? flagged.map(entry => `<button class="workspace-list-item" data-entry-id="${entry.id}">
          <strong>${esc(entry.title || entry.code)}</strong>
          <span>${esc(entry.allergyWarning || getEntryAlerts(entry).join(' • '))}</span>
        </button>`).join('') : '<div class="workspace-empty-inline">No warnings recorded.</div>'}
      </div>
    </div>`;
    renderWorkspaceHeader(tab, 'Warning Desk', 'Quick scan for allergies, ingredient notes, and freshness alerts.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  renderTable();
  renderWorkspaceHeader(tab, 'Tasting Log', 'Meal records, purchase fields, and image-backed food tracking.', tableWrap.innerHTML);
  bindTableInteractions();
}

function renderNatureView(tab) {
  const workspace = getWorkspace(tab);
  if (workspace === 'viewer') {
    const entries = filtered();
    const body = `<div class="workspace-card-grid">
      ${renderWorkspaceItems(entries, entry => `<button class="workspace-media-card" data-entry-id="${entry.id}">
        ${getEntryThumbnail(entry) ? `<img ${mediaAttrs(getEntryThumbnail(entry))} alt="" loading="lazy">` : `<div class="workspace-media-placeholder">NT</div>`}
        <strong>${esc(entry.title || 'Untitled')}</strong>
        <span>${esc(entry.speciesGuess || entry.natureCategory || 'Unidentified')}</span>
        <small>${esc(entry.idConfidence || 'Confidence pending')}</small>
      </button>`, 'No field viewer cards yet. Add field records to populate this workspace.')}
    </div>`;
    renderWorkspaceHeader(tab, 'Field Viewer', 'Image-led observation records with identification confidence and habitat context.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  if (workspace === 'status') {
    const entries = filtered();
    const confidenceSummary = Object.entries(entries.reduce((acc, entry) => {
      const key = entry.idConfidence || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}));
    const body = `<div class="workspace-panel-grid">
      <div class="workspace-panel">
        <div class="workspace-panel-title">Confidence Overview</div>
        <div class="workspace-stat-list">
          ${confidenceSummary.length ? confidenceSummary.map(([label, count]) => `<div><strong>${count}</strong><span>${esc(label)}</span></div>`).join('') : renderWorkspaceEmpty('No confidence data yet.', null)}
        </div>
      </div>
      <div class="workspace-panel">
        <div class="workspace-panel-title">Condition / Status Notes</div>
        <div class="workspace-list">
          ${renderWorkspaceItems(entries, entry => `<button class="workspace-list-item" data-entry-id="${entry.id}">
            <strong>${esc(entry.title || entry.code)}</strong>
            <span>${esc(entry.statusNote || 'No status note')}</span>
          </button>`, 'No status notes yet. Add field records to populate this panel.')}
        </div>
      </div>
    </div>`;
    renderWorkspaceHeader(tab, 'Status View', 'Identification confidence, encounter condition, and habitat status in one panel.', body);
    tableWrap.querySelectorAll('[data-entry-id]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = findEntry(parseInt(button.dataset.entryId));
        if (entry) openDetail(entry);
      });
    });
    return;
  }
  renderTable();
  renderWorkspaceHeader(tab, 'Field Log', 'Observation records, thumbnails, and review-ready nature metadata.', tableWrap.innerHTML);
  bindTableInteractions();
}


/* ─────────────────────────────────────────────────────────
   SECTION 24 — AUDIO PLAYER
   Winamp-style floating media player.
   Uses the native HTML Audio API via audioEl (Section 2).
   ───────────────────────────────────────────────────────── */

function initAudioPlayer() {
  // Sync progress bar with playback
  audioEl.addEventListener('timeupdate', () => {
    if (!audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    fpProgressFill.style.width = pct + '%';
    fpProgress.style.setProperty('--progress-left', pct + '%');
    fpTime.textContent = formatTime(audioEl.currentTime);
    updateSoundDeckDisplay();
  });

  audioEl.addEventListener('loadedmetadata', updateSoundDeckDisplay);

  // When a track ends, move to next in playlist
  audioEl.addEventListener('ended', () => audioPlayerNext());

  // Toggle play/pause state on play/pause events
  audioEl.addEventListener('play',  () => {
    fpPlay.innerHTML = '&#10074;&#10074;';
    fpVis.classList.remove('fp-paused');
    floatingPlayer.classList.add('fp-playing');
    updateSoundDeckDisplay();
  });

  audioEl.addEventListener('pause', () => {
    fpPlay.innerHTML = '&#9654;';
    fpVis.classList.add('fp-paused');
    floatingPlayer.classList.remove('fp-playing');
    updateSoundDeckDisplay();
  });

  // Volume
  fpVolume.addEventListener('input', () => setAudioVolume(parseFloat(fpVolume.value)));
  fpVolumeUp?.addEventListener('click', () => handleAudioControl('volume-up'));
  fpVolumeDown?.addEventListener('click', () => handleAudioControl('volume-down'));

  // Seek on progress bar click
  fpProgress.addEventListener('click', e => {
    handleAudioControl('seek', e);
  });

  fpPlay.addEventListener('click', () => {
    if (audioEl.paused) audioEl.play().catch(() => showToast('Cannot play — check the audio URL.'));
    else audioEl.pause();
  });

  fpPrev.addEventListener('click', audioPlayerPrev);
  fpNext.addEventListener('click', audioPlayerNext);
  fpMinimize.addEventListener('click', togglePlayerMinimize);
  fpClose.addEventListener('click', closeAudioPlayer);
}

// openAudioPlayer — loads an entry and shows the player.
function openAudioPlayer(entry) {
  const playlist = audioPlaylist.length ? audioPlaylist : [entry];
  const idx = playlist.findIndex(e => e.id === entry.id);
  audioCurrentIndex = idx >= 0 ? idx : 0;

  loadAudioEntry(entry);
  floatingPlayer.classList.remove('fp-hidden');
  isPlayerOpen = true;
  minimizeAudioPlayer();
}

// loadAudioEntry — sets the audio source and updates the player display.
async function loadAudioEntry(entry) {
  audioCurrentEntry = entry;
  fpTrackName.textContent = entry.title || 'Unknown Track';
  fpTrackSub.textContent  = [entry.creator || entry.artist, entry.album].filter(Boolean).join(' — ') || '—';
  fpTime.textContent      = '0:00';
  fpProgressFill.style.width = '0%';
  updateSoundDeckDisplay();

  if (entry.audioUrl) {
    const audioUrl = isAssetRef(entry.audioUrl)
      ? await getAssetObjectUrl(entry.audioUrl)
      : safeUrl(entry.audioUrl, 'audio');
    if (!audioUrl) {
      audioEl.src = '';
      showToast('Blocked unsafe audio URL.');
      return;
    }
    audioEl.src = audioUrl;
    setAudioVolume(parseFloat(fpVolume.value));
    audioEl.play().catch(() => showToast('Cannot play — check the audio URL in the entry.'));
  } else {
    audioEl.src = '';
    fpTrackName.textContent = entry.title + ' (no audio URL)';
    showToast('This entry has no audio URL. Add one by editing the entry.');
  }
}

function audioPlayerNext() {
  if (!audioPlaylist.length) return;
  audioCurrentIndex = (audioCurrentIndex + 1) % audioPlaylist.length;
  loadAudioEntry(audioPlaylist[audioCurrentIndex]);
}

function audioPlayerPrev() {
  if (!audioPlaylist.length) return;
  audioCurrentIndex = (audioCurrentIndex - 1 + audioPlaylist.length) % audioPlaylist.length;
  loadAudioEntry(audioPlaylist[audioCurrentIndex]);
}

function minimizeAudioPlayer() {
  isPlayerMinimized = true;
  floatingPlayer.classList.add('fp-minimized');
  floatingPlayer.style.left = 'auto';
  floatingPlayer.style.top = 'auto';
  floatingPlayer.style.right = '1.25rem';
  floatingPlayer.style.bottom = '1.25rem';
  fpMinimize.innerHTML = '&#x25A1;';
  updateSoundDeckDisplay();
}

function restoreAudioPlayer() {
  isPlayerMinimized = false;
  floatingPlayer.classList.remove('fp-minimized');
  floatingPlayer.style.left = 'auto';
  floatingPlayer.style.top = 'auto';
  floatingPlayer.style.right = '2rem';
  floatingPlayer.style.bottom = '2rem';
  fpMinimize.innerHTML = '-';
  updateSoundDeckDisplay();
}

function togglePlayerMinimize() {
  minimizeAudioPlayer();
}

function closeAudioPlayer() {
  audioEl.pause();
  floatingPlayer.classList.add('fp-hidden');
  floatingPlayer.classList.remove('fp-minimized', 'fp-playing');
  isPlayerOpen = false;
  isPlayerMinimized = false;
  updateSoundDeckDisplay();
}

// initPlayerDrag — makes the floating player draggable by its title bar.
function initPlayerDrag() {
  let isDragging = false;
  let startX, startY, initLeft, initTop;

  fpTitlebar.addEventListener('mousedown', e => {
    isDragging = true;
    const rect = floatingPlayer.getBoundingClientRect();
    startX  = e.clientX; startY = e.clientY;
    initLeft = rect.left; initTop = rect.top;
    floatingPlayer.style.right  = 'auto';
    floatingPlayer.style.bottom = 'auto';
    floatingPlayer.style.left   = initLeft + 'px';
    floatingPlayer.style.top    = initTop  + 'px';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    floatingPlayer.style.left = (initLeft + dx) + 'px';
    floatingPlayer.style.top  = (initTop  + dy) + 'px';
  });

  document.addEventListener('mouseup', () => { isDragging = false; });
}


/* ─────────────────────────────────────────────────────────
   SECTION 25 — BOOK VIEWER
   Full-screen overlay with CSS 3-D page flip simulation.
   ───────────────────────────────────────────────────────── */

// openBookViewer — parses entry pages and shows the viewer.
function openBookViewer(entry) {
  bookEntry = entry;
  bookPageIndex = 0;

  // Parse page content — each paragraph block separated by blank line is one page
  const raw = entry.pageContent || '';
  bookPages = raw.trim()
    ? raw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    : [];

  // Meta header
  bvMeta.textContent = `${entry.title || 'Untitled'}${entry.creator ? ' — ' + entry.creator : ''}`;

  renderBookSpread();
  bookViewer.classList.remove('bv-hidden');
}

// closeBookViewer — hides the viewer overlay.
function closeBookViewer() {
  bookViewer.classList.add('bv-hidden');
  bookEntry     = null;
  bookPages     = [];
  bookPageIndex = 0;
}

// renderBookSpread — updates both pages for the current spread.
// Index 0 = cover. Index 1+ = page pairs (left/right).
function renderBookSpread() {
  if (!bookEntry) return;

  if (bookPageIndex === 0) {
    // Cover spread
    bvPageNum.textContent = 'Cover';

    bvLeft.innerHTML = `
      <div class="bv-page-cover">
        ${bookEntry.cover
          ? `<img class="bv-cover-img" ${mediaAttrs(bookEntry.cover)} alt="Cover">`
          : `<div style="font-size:4rem;color:#c8b89a">📖</div>`}
        <div class="bv-cover-title">${esc(bookEntry.title || 'Untitled')}</div>
        <div class="bv-cover-author">${esc(bookEntry.creator || '')}</div>
      </div>`;

    bvRight.innerHTML = bookPages.length
      ? `<div class="bv-page-content">${esc(bookPages[0])}</div><div class="bv-page-num-text">p. 1</div>`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#b8a888;font-style:italic;font-size:.9rem">No page content added yet.</div>`;
  } else {
    // Content spreads — left page = even index, right = odd
    const leftIdx  = (bookPageIndex - 1) * 2 + 1;  // 1, 3, 5…
    const rightIdx = leftIdx + 1;                    // 2, 4, 6…

    const leftPage  = bookPages[leftIdx]  || null;
    const rightPage = bookPages[rightIdx] || null;

    bvLeft.innerHTML = leftPage
      ? `<div class="bv-page-content">${esc(leftPage)}</div><div class="bv-page-num-text">p. ${leftIdx + 1}</div>`
      : '';

    bvRight.innerHTML = rightPage
      ? `<div class="bv-page-content">${esc(rightPage)}</div><div class="bv-page-num-text">p. ${rightIdx + 1}</div>`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#b8a888;font-style:italic;font-size:.9rem">End of content.</div>`;

    const spread = bookPageIndex;
    const total  = Math.ceil(bookPages.length / 2);
    bvPageNum.textContent = `Spread ${spread} / ${total || 1}`;
  }

  // Navigation button states
  bookPrev.disabled = bookPageIndex === 0;
  const maxSpread   = Math.ceil(bookPages.length / 2);
  bookNext.disabled = bookPageIndex >= maxSpread;
  hydrateAssetElements(bookViewer);
}

function nextBookPage() {
  const maxSpread = Math.ceil(bookPages.length / 2);
  if (bookPageIndex >= maxSpread) return;

  // Animate page flip
  bvRight.classList.add('flipping-out');
  setTimeout(() => {
    bvRight.classList.remove('flipping-out');
    bookPageIndex++;
    renderBookSpread();
  }, 300);
}

function previousBookPage() {
  if (bookPageIndex <= 0) return;

  bvLeft.classList.add('flipping-out');
  setTimeout(() => {
    bvLeft.classList.remove('flipping-out');
    bookPageIndex--;
    renderBookSpread();
  }, 300);
}

// Book viewer button listeners
bookClose.addEventListener('click', closeBookViewer);
bookNext.addEventListener('click',  nextBookPage);
bookPrev.addEventListener('click',  previousBookPage);


/* ─────────────────────────────────────────────────────────
   SECTION 26 — RATING SYSTEM
   ───────────────────────────────────────────────────────── */

// renderStarsHTML — builds the inline star widget for a table row.
function renderStarsHTML(entry) {
  const score = entry.rating?.score || 0;

  const stars = [1,2,3,4,5].map(n =>
    `<span class="star ${n <= score ? 'filled' : ''}" data-score="${n}">★</span>`
  ).join('');

  return `<div style="display:flex;align-items:center;gap:4px;">
    <div class="rating-stars" data-id="${entry.id}">${stars}</div>
  </div>`;
}

// renderStarsHTMLDetail — plain display for the detail panel (no click handlers needed).
function renderStarsHTMLDetail(entry) {
  const score = entry.rating?.score || 0;
  return [1,2,3,4,5].map(n =>
    `<span style="color:${n <= score ? 'var(--accent)' : 'var(--border-light)'}">★</span>`
  ).join('');
}

// setRating — persists a star score for an entry.
function setRating(entryId, score) {
  const entry = findEntry(entryId);
  if (!entry) return;
  entry.rating = { ...entry.rating, score };
  entry.updatedAt = new Date().toISOString();
  save();
  renderByTabType(activeTab());
}

// toggleFavorite — flips the favourite flag.
function toggleFavorite(entryId) {
  const entry = findEntry(entryId);
  if (!entry) return;
  entry.rating = { ...entry.rating, favorite: !entry.rating?.favorite };
  entry.updatedAt = new Date().toISOString();
  save();
  render();
  if (detailPanel.classList.contains('open') && selectedId === entryId) openDetail(entry);
}

// updateStarInputs — highlights star inputs in the modal to match ratingValue.
function updateStarInputs(value) {
  ratingInput.querySelectorAll('.star-input').forEach(star => {
    const n = parseInt(star.dataset.score);
    star.classList.toggle('selected', n <= value);
  });
}

// Star input click events inside the modal
ratingInput.addEventListener('click', e => {
  if (!e.target.classList.contains('star-input')) return;
  ratingValue = parseInt(e.target.dataset.score);
  // If clicking the same star twice, clear the rating
  if (ratingValue === parseInt(e.target.dataset.score) && e.target.classList.contains('selected')) {
    // Allow deselect only if clicking the first star with score 1 already selected
  }
  updateStarInputs(ratingValue);
});

// Hover preview
ratingInput.addEventListener('mouseover', e => {
  if (!e.target.classList.contains('star-input')) return;
  const n = parseInt(e.target.dataset.score);
  ratingInput.querySelectorAll('.star-input').forEach(star => {
    star.classList.toggle('selected', parseInt(star.dataset.score) <= n);
  });
});

ratingInput.addEventListener('mouseleave', () => updateStarInputs(ratingValue));


/* ─────────────────────────────────────────────────────────
   SECTION 27 — THEME SYSTEM
   Applies the fixed app theme by setting body.dataset.theme.
   The CSS in style.css uses body[data-theme="..."] selectors
   to override specific CSS custom properties.
   ───────────────────────────────────────────────────────── */

// applyTheme — keeps the visual theme fixed while tabs change content.
function applyTheme() {
  document.body.dataset.theme = 'books';
}
