// ---------- Simple "router" ----------
const screens = {
  home: document.getElementById("screen-home"),
  chat: document.getElementById("screen-chat"),
  details: document.getElementById("screen-details"),
  location: document.getElementById("screen-location"),
  impact: document.getElementById("screen-impact"),
};

const screenLabel = document.getElementById("screenLabel");
let navStack = ["home"]; // for Back

function showScreen(name, push=true){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  screenLabel.textContent = name[0].toUpperCase() + name.slice(1);

  if(push){
    navStack.push(name);
  }
}

function goBack(){
  if(navStack.length <= 1) return;
  navStack.pop();
  const prev = navStack[navStack.length - 1];
  showScreen(prev, false);
}

// ---------- Prototype data (simulated backend) ----------
const books = [
  {
    id: "m1",
    title: "Shadow Protocol",
    author: "R. K. Lin",
    summary: "A fast-paced mystery with covert ops, shifting alliances, and a case that refuses to stay buried.",
    rating: 4.4,
    category: "Fiction",
    tags: ["mystery", "action", "thriller"],
    location: { floor: 1, aisle: 3, shelf: "C" },
    available: true,
    digital: true,
  },
  {
    id: "m2",
    title: "The Midnight Cipher",
    author: "Elena Voss",
    summary: "A codebreaker uncovers a pattern of crimes linked to a decades-old disappearance.",
    rating: 4.2,
    category: "Fiction",
    tags: ["mystery", "suspense"],
    location: { floor: 1, aisle: 4, shelf: "A" },
    available: true,
    digital: false,
  },
  {
    id: "s1",
    title: "Deep Work (Library Edition)",
    author: "Cal Newport",
    summary: "A practical guide to focused work in a distracted world—perfect for career growth and study habits.",
    rating: 4.6,
    category: "STEM",
    tags: ["career", "productivity", "study"],
    location: { floor: 2, aisle: 1, shelf: "B" },
    available: true,
    digital: true,
  },
  {
    id: "k1",
    title: "Rocket Science for Kids",
    author: "Maya Patel",
    summary: "Hands-on experiments and stories that make STEM fun and approachable.",
    rating: 4.3,
    category: "Kids",
    tags: ["kids", "stem", "science"],
    location: { floor: 1, aisle: 7, shelf: "D" },
    available: false,
    digital: true,
  }
];

// ---------- Sustainability / impact state (matches Lo-Fi fields) ----------
const impact = {
  booksBorrowed: 8,
  treesSaved: 3,
  waterSaved: 200,
  co2Reduced: 10
};

function renderImpact(){
  document.getElementById("booksBorrowed").textContent = impact.booksBorrowed;
  document.getElementById("treesSaved").textContent = impact.treesSaved;
  document.getElementById("waterSaved").textContent = impact.waterSaved;
  document.getElementById("co2Reduced").textContent = impact.co2Reduced;
}

// simple demo math
function simulateBorrowIncrement(){
  impact.booksBorrowed += 1;

  // lightweight fake scaling (demo only)
  impact.treesSaved = Math.round(impact.booksBorrowed * 0.35);
  impact.waterSaved = Math.round(impact.booksBorrowed * 25);
  impact.co2Reduced = Math.round(impact.booksBorrowed * 1.2);

  renderImpact();
}

// ---------- Hook up topbar impact ----------
document.getElementById("impactChip").addEventListener("click", () => showScreen("impact"));
document.getElementById("goImpact").addEventListener("click", () => showScreen("impact"));
document.getElementById("chatToImpact").addEventListener("click", () => showScreen("impact"));
document.getElementById("detailsToImpact").addEventListener("click", () => showScreen("impact"));
document.getElementById("locationToImpact").addEventListener("click", () => showScreen("impact"));

document.getElementById("impactReset").addEventListener("click", () => {
  impact.booksBorrowed = 8;
  impact.treesSaved = 3;
  impact.waterSaved = 200;
  impact.co2Reduced = 10;
  renderImpact();
});
document.getElementById("impactSimBorrow").addEventListener("click", simulateBorrowIncrement);

// ---------- Navigation buttons ----------
document.getElementById("goChat").addEventListener("click", () => showScreen("chat"));
document.getElementById("backFromChat").addEventListener("click", goBack);
document.getElementById("backFromDetails").addEventListener("click", goBack);
document.getElementById("backFromLocation").addEventListener("click", goBack);
document.getElementById("backFromImpact").addEventListener("click", goBack);

// ---------- Category browse ----------
document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    const starter = `Show me ${category} books`;
    showScreen("chat");
    pushUserMessage(starter);
    respondAsAI(starter);
  });
});

// ---------- Search (Home -> Chat) ----------
document.getElementById("homeSearchBtn").addEventListener("click", () => {
  const q = document.getElementById("homeSearch").value.trim();
  if(!q) return;
  showScreen("chat");
  pushUserMessage(q);
  respondAsAI(q);
});

document.getElementById("homeSearch").addEventListener("keydown", (e) => {
  if(e.key === "Enter") document.getElementById("homeSearchBtn").click();
});

// ---------- Chat system ----------
const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");

document.getElementById("sendChat").addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if(!msg) return;
  chatInput.value = "";
  pushUserMessage(msg);
  respondAsAI(msg);
});

chatInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") document.getElementById("sendChat").click();
});

function pushUserMessage(text){
  const b = document.createElement("div");
  b.className = "bubble user";
  b.textContent = text;
  chatLog.appendChild(b);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function pushAIMessage(html){
  const b = document.createElement("div");
  b.className = "bubble ai";
  b.innerHTML = html;
  chatLog.appendChild(b);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// "AI" matching logic (prototype)
function findMatches(query){
  const q = query.toLowerCase();

  // category intent
  const categoryMatch = ["fiction","stem","kids"].find(c => q.includes(c));
  if(categoryMatch){
    const cat = categoryMatch.toUpperCase() === "STEM" ? "STEM" : categoryMatch[0].toUpperCase() + categoryMatch.slice(1);
    return books.filter(b => b.category.toLowerCase() === cat.toLowerCase());
  }

  // tag intent
  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
  return books
    .map(b => {
      const score = tokens.reduce((acc,t) => acc + (b.tags.includes(t) ? 1 : 0), 0);
      return { b, score };
    })
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score)
    .map(x => x.b);
}

function respondAsAI(query){
  // mimic the Lo-Fi example prompt (mystery + action) :contentReference[oaicite:3]{index=3}
  const matches = findMatches(query);

  if(matches.length === 0){
    pushAIMessage(`
      <div><strong>I understand.</strong> I couldn’t find a direct match.</div>
      <div class="meta">Try: mystery, action, career, STEM, kids</div>
    `);
    return;
  }

  const list = matches.slice(0, 3).map((b, idx) => {
    const loc = `Aisle ${b.location.aisle} • Shelf ${b.location.shelf}`;
    const avail = b.available ? "✅ Available" : "⏳ Checked out";
    const digital = b.digital ? "Digital Copy ✅" : "No Digital Copy";
    return `
      <div class="resultRow">
        <div><strong>${idx + 1}. ${b.title}</strong></div>
        <div class="meta">${loc} • ${avail} • ${digital}</div>
        <button class="btn small" data-open="${b.id}" type="button">Open</button>
      </div>
    `;
  }).join("");

  pushAIMessage(`
    <div><strong>I understand.</strong> Here are options:</div>
    <div class="resultList">${list}</div>
    <div class="meta">Tip: click “Open” to view the Book Details page.</div>
  `);

  // attach handlers after render
  chatLog.querySelectorAll("button[data-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const bookId = btn.getAttribute("data-open");
      openBookDetails(bookId);
    });
  });
}

// ---------- Book Details + Location ----------
let selectedBook = null;

function openBookDetails(bookId){
  selectedBook = books.find(b => b.id === bookId);
  if(!selectedBook) return;

  document.getElementById("detailsTitle").textContent = selectedBook.title;
  document.getElementById("detailsAuthor").textContent = selectedBook.author;
  document.getElementById("detailsSummary").textContent = selectedBook.summary;

  document.getElementById("detailsRating").textContent = "★".repeat(Math.floor(selectedBook.rating)) + "☆".repeat(5 - Math.floor(selectedBook.rating)) + `  (${selectedBook.rating.toFixed(1)})`;

  document.getElementById("detailsStatus").textContent = `Status: ${selectedBook.available ? "Available" : "Checked out"}`;
  document.getElementById("detailsFormat").textContent = selectedBook.digital ? "Digital Copy ✅" : "No Digital Copy";

  document.getElementById("detailsToast").textContent = "";
  showScreen("details");
}

document.getElementById("viewLocationBtn").addEventListener("click", () => {
  if(!selectedBook) return;
  const { floor, aisle, shelf } = selectedBook.location;

  document.getElementById("locationStatus").textContent = `Status: ${selectedBook.available ? "Available" : "Checked out"}`;
  document.getElementById("locationPath").textContent = `Floor ${floor} → Aisle ${aisle} → Shelf ${shelf}`;

  showScreen("location");
});

document.getElementById("reserveBtn").addEventListener("click", () => {
  if(!selectedBook) return;
  document.getElementById("detailsToast").textContent = "Reserved! (Simulated)";
  simulateBorrowIncrement(); // tie reserve to impact for demo
});

document.getElementById("saveBtn").addEventListener("click", () => {
  if(!selectedBook) return;
  document.getElementById("detailsToast").textContent = "Saved to your list. (Simulated)";
});

// ---------- Minor UI helpers for chat results ----------
const styleTag = document.createElement("style");
styleTag.textContent = `
  .resultList{ margin-top:10px; display:flex; flex-direction:column; gap:10px; }
  .resultRow{
    border:1px solid var(--line);
    background:#fff;
    border-radius: 14px;
    padding: 10px 12px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 10px;
  }
`;
document.head.appendChild(styleTag);

// ---------- Boot ----------
function boot(){
  renderImpact();

  // Seed the chat with the Lo-Fi-style example so demo instantly works. :contentReference[oaicite:4]{index=4}
  pushAIMessage(`
    <div><strong>Hi!</strong> Tell me what you're in the mood for.</div>
    <div class="meta">Example: “mystery but also has some action”</div>
  `);
}
boot();