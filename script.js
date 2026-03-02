// ── Constants ──
const CATEGORY_EMOJI = {
  Fiction: "📖", STEM: "🔬", Kids: "🧒",
  History: "📜", Fantasy: "🐉", "Self-Help": "💡", Philosophy: "🏛️",
};
const CATEGORY_BG = {
  Fiction: "#F5E6E8", STEM: "#E8ECF0", Kids: "#F0EDF2",
  History: "#EFEBE9", Fantasy: "#E8ECF0", "Self-Help": "#F5F0E8", Philosophy: "#F3E8FF",
};
// Aisle number → letter for the floor map SVG
const AISLE_LETTERS = ["A", "B", "C", "D"];

let currentBook = null;
let lastSearchResults = [];

// ── Navigation ──
function goTo(page, linkEl) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
  if (linkEl) linkEl.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Toast ──
function toast(msg) {
  const t = document.getElementById("toast-el");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 3200);
}

// ── Search ──
function fillSearch(text) {
  document.getElementById("searchInput").value = text;
  runSearch();
}

function findMatches(query) {
  const q = query.toLowerCase();

  // Category intent
  const categories = ["fiction", "stem", "kids", "history", "fantasy", "self-help", "philosophy"];
  const catMatch = categories.find(c => q.includes(c));
  if (catMatch) {
    return books.filter(b => b.category.toLowerCase() === catMatch);
  }

  // Tag + title + author fuzzy match
  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
  return books
    .map(b => {
      const haystack = [
        ...b.tags,
        ...b.title.toLowerCase().split(/\s+/),
        ...b.author.toLowerCase().split(/\s+/),
      ];
      const score = tokens.reduce(
        (acc, t) => acc + (haystack.some(h => h.includes(t)) ? 1 : 0),
        0
      );
      return { b, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.b);
}

function runSearch() {
  const val = document.getElementById("searchInput").value.trim();
  if (!val) return;
  lastSearchResults = findMatches(val);
  renderAIResponse(val, lastSearchResults);
  applyFilters(); // renders with current sidebar filters
  toast('AI search complete for: "' + val + '"');
}

function applyFilters() {
  // Determine which results to filter
  let pool = lastSearchResults.length > 0 ? lastSearchResults : books;

  // Category filters
  const catIds = ["Fiction", "STEM", "Kids", "History", "Fantasy", "Self-Help", "Philosophy"];
  const activeCats = catIds.filter(c => document.getElementById("fc-" + c).checked);
  pool = pool.filter(b => activeCats.includes(b.category));

  // Availability filters
  if (document.getElementById("fa-avail").checked) {
    pool = pool.filter(b => b.available);
  }
  if (document.getElementById("fa-digital").checked) {
    pool = pool.filter(b => b.digital);
  }

  // Sort
  const sort = document.getElementById("sortSelect").value;
  if (sort === "rating") {
    pool = [...pool].sort((a, b) => b.rating - a.rating);
  } else if (sort === "title") {
    pool = [...pool].sort((a, b) => a.title.localeCompare(b.title));
  }

  renderResults(pool);
}

function renderResults(matches) {
  const container = document.getElementById("results-container");
  document.getElementById("resultsCount").textContent =
    "Showing " + matches.length + " result" + (matches.length !== 1 ? "s" : "");

  if (matches.length === 0) {
    container.innerHTML =
      '<div class="no-results">No books found. Try a different search or adjust your filters.</div>';
    return;
  }

  container.innerHTML = matches
    .map(b => {
      const emoji = CATEGORY_EMOJI[b.category] || "📖";
      const bg = CATEGORY_BG[b.category] || "#F5F5F5";
      const coverHtml = b.coverId
        ? '<img src="' + COVER_BASE + b.coverId + '-S.jpg" alt="" onerror="this.parentNode.textContent=\'' + emoji + '\'">'
        : emoji;
      const aisleL = AISLE_LETTERS[(b.location.aisle - 1) % 4];

      return (
        '<div class="result-card" onclick="openDetail(\'' + b.id + '\')"' +
        (!b.available ? ' style="opacity:0.75"' : "") + ">" +
          '<div class="rc-spine" style="background:' + bg + ';">' + coverHtml + "</div>" +
          '<div class="rc-body">' +
            '<div class="rc-top">' +
              '<div class="rc-title">' + b.title + "</div>" +
              '<span class="rc-status ' + (b.available ? "avail" : "out") + '">' +
                (b.available ? "Available" : "Checked Out") + "</span>" +
            "</div>" +
            '<div class="rc-author">' + b.author + " · " + b.rating.toFixed(1) + "★</div>" +
            '<div class="rc-meta">' +
              '<span class="rc-tag genre">' + b.category + "</span>" +
              b.tags.slice(0, 2).map(t => '<span class="rc-tag ai">' + t + "</span>").join("") +
            "</div>" +
            '<div class="rc-location">📍 Floor ' + b.location.floor + " · Aisle " + aisleL + " · Shelf " + b.location.shelf + "</div>" +
          "</div>" +
          '<div class="rc-actions">' +
            '<button class="btn-reserve" onclick="event.stopPropagation();reserveBook(\'' + b.id + '\')"' +
              (!b.available ? ' style="background:#ccc;cursor:default;"' : "") + ">" +
              (b.available ? "Reserve" : "Waitlist") + "</button>" +
            '<button class="btn-detail" onclick="event.stopPropagation();openDetail(\'' + b.id + '\')">Details →</button>' +
          "</div>" +
        "</div>"
      );
    })
    .join("");
}

function renderAIResponse(query, matches) {
  const el = document.getElementById("aiResponseText");
  if (matches.length === 0) {
    el.textContent =
      'I couldn\'t find any books matching "' + query + '". Try searching by genre (fiction, fantasy, history), author name, or a specific topic.';
  } else if (matches.length <= 3) {
    el.textContent =
      'I found ' + matches.length + ' match' + (matches.length > 1 ? "es" : "") +
      ' for "' + query + '". "' + matches[0].title + '" by ' + matches[0].author +
      " is the top result — rated " + matches[0].rating.toFixed(1) + "★.";
  } else {
    el.textContent =
      'Based on your search for "' + query + '", I found ' + matches.length +
      " books. The top results are from the " + matches[0].category +
      ' section. "' + matches[0].title + '" by ' + matches[0].author +
      " is the strongest match — rated " + matches[0].rating.toFixed(1) + "★.";
  }
}

function reserveBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book && book.available) toast('Reserved "' + book.title + '"!');
  else if (book) toast('Added to waitlist for "' + book.title + '".');
}

function reserveCurrentBook() {
  if (currentBook) reserveBook(currentBook.id);
}

// ── Book Details ──
function openDetail(bookId) {
  currentBook = books.find(b => b.id === bookId);
  if (!currentBook) return;
  const b = currentBook;
  const emoji = CATEGORY_EMOJI[b.category] || "📖";
  const bg = CATEGORY_BG[b.category] || "#F5F5F5";
  const aisleL = AISLE_LETTERS[(b.location.aisle - 1) % 4];

  // Cover
  const coverEl = document.getElementById("detail-cover");
  if (b.coverId) {
    coverEl.innerHTML =
      '<img src="' + COVER_BASE + b.coverId + '-M.jpg" alt="Cover of ' + b.title +
      '" onerror="this.parentNode.textContent=\'' + emoji + '\'">';
    coverEl.style.background = bg;
  } else {
    coverEl.innerHTML = "";
    coverEl.textContent = emoji;
    coverEl.style.background = bg;
  }

  // Meta
  document.getElementById("detail-title").textContent = b.title;
  document.getElementById("detail-author").textContent = b.author;
  document.getElementById("detail-genre").textContent = b.category;
  document.getElementById("detail-desc").textContent = b.summary;
  document.getElementById("detail-rating").textContent = b.rating.toFixed(1) + "★ rating";
  document.getElementById("detail-digital").textContent = b.digital ? "Digital Available" : "Print Only";

  const availEl = document.getElementById("detail-avail");
  availEl.textContent = b.available ? "Available" : "Checked Out";
  availEl.className = "detail-badge " + (b.available ? "avail" : "out");

  // Quick stats
  document.getElementById("detail-floor").textContent = "Floor " + b.location.floor;
  document.getElementById("detail-aisle").textContent = "Aisle " + aisleL;
  document.getElementById("detail-shelf").textContent = "Shelf " + b.location.shelf;

  // Location callout
  document.getElementById("loc-callout-text").innerHTML =
    '<div style="font-weight:700;margin-bottom:0.2rem;">Floor ' + b.location.floor +
    " · Aisle " + aisleL + " · Shelf " + b.location.shelf +
    '</div><div style="font-size:0.82rem;opacity:0.8;">Santa Clara Main Library</div>';

  // Step-by-step directions
  document.getElementById("loc-directions").innerHTML =
    "<strong>1.</strong> Enter through main doors on Homestead Rd<br>" +
    "<strong>2.</strong> " + (b.location.floor > 1 ? "Take elevator or stairs to " : "Head to ") +
    "<strong>Floor " + b.location.floor + "</strong><br>" +
    "<strong>3.</strong> Turn left past the Info Desk<br>" +
    "<strong>4.</strong> Walk to <strong>Aisle " + aisleL + "</strong><br>" +
    "<strong>5.</strong> Your book is on <strong>Shelf " + b.location.shelf + "</strong>, spine facing you";

  // Reserve button state
  const reserveBtn = document.getElementById("detail-reserve-btn");
  if (b.available) {
    reserveBtn.textContent = "Reserve This Book";
    reserveBtn.style.background = "";
    reserveBtn.style.cursor = "";
  } else {
    reserveBtn.textContent = "Join Waitlist";
    reserveBtn.style.background = "#ccc";
    reserveBtn.style.cursor = "default";
  }

  // Floor map
  updateFloorMap(b);

  // Also read
  renderAlsoRead(b);

  goTo("detail", null);
}

// ── Floor Map ──
function updateFloorMap(book) {
  const aisleIdx = (book.location.aisle - 1) % 4; // 0-3 → A-D
  const aisleL = AISLE_LETTERS[aisleIdx];

  // Set active floor tab
  document.querySelectorAll(".floor-tab").forEach((tab, i) => {
    tab.classList.toggle("active", i + 1 === book.location.floor);
  });

  // Reset all shelf highlights
  document.querySelectorAll(".aisle-shelf").forEach(s => s.classList.remove("target"));

  // Highlight the target shelf
  const shelfMap = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 };
  const shelfIdx = shelfMap[book.location.shelf] || 1;
  const targetShelf = document.querySelector(
    '.aisle-shelf[data-aisle="' + aisleL + '"][data-shelf="' + shelfIdx + '"]'
  );
  if (targetShelf) targetShelf.classList.add("target");

  // Move the gold pin to the target shelf
  const pin = document.getElementById("map-pin");
  if (targetShelf) {
    const x = parseFloat(targetShelf.getAttribute("x")) + parseFloat(targetShelf.getAttribute("width")) / 2;
    const y = parseFloat(targetShelf.getAttribute("y")) + 7;
    pin.setAttribute("cx", x);
    pin.setAttribute("cy", y);
  }

  // Update aisle labels to show which is the target
  AISLE_LETTERS.forEach(letter => {
    const label = document.getElementById("label-aisle-" + letter);
    if (label) {
      label.textContent = letter === aisleL ? "AISLE " + letter + " ★" : "AISLE " + letter;
      label.setAttribute("fill", letter === aisleL ? "#862633" : "#555");
    }
  });
}

function setFloor(n, el) {
  document.querySelectorAll(".floor-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  if (currentBook && currentBook.location.floor === n) {
    toast("Your book is on Floor " + n + "!");
  } else {
    toast("Floor " + n + " — your book is not on this floor.");
  }
}

// ── Also Read ──
function renderAlsoRead(book) {
  const similar = books
    .filter(b => b.id !== book.id && b.category === book.category)
    .slice(0, 5);

  const container = document.getElementById("also-grid");
  container.innerHTML = similar
    .map(b => {
      const emoji = CATEGORY_EMOJI[b.category] || "📖";
      const bg = CATEGORY_BG[b.category] || "#F5F5F5";
      const coverHtml = b.coverId
        ? '<img src="' + COVER_BASE + b.coverId + '-S.jpg" alt="" onerror="this.parentNode.textContent=\'' + emoji + '\'">'
        : emoji;
      return (
        '<div class="also-card" onclick="openDetail(\'' + b.id + '\')">' +
          '<div class="also-cover" style="background:' + bg + ';">' + coverHtml + "</div>" +
          '<div class="also-title">' + b.title + "</div>" +
          '<div class="also-author">' + b.author + "</div>" +
        "</div>"
      );
    })
    .join("");
}

// ── Sustainability Tracker ──
let trackerCount = 0;
const WATER_PER_BOOK = 19.8; // gallons of water saved per borrowed book
const TREES_PER_BOOK = 0.116; // trees preserved per borrowed book
const CO2_PER_BOOK = 0.76; // lbs of CO2 avoided per borrowed book

function changeTrackerCount(delta) {
  trackerCount = Math.max(0, trackerCount + delta);
  updateTrackerDisplay();
}

function updateTrackerDisplay() {
  document.getElementById("tracker-count").textContent = trackerCount;

  const water = (trackerCount * WATER_PER_BOOK).toFixed(1);
  const trees = (trackerCount * TREES_PER_BOOK).toFixed(2);
  const co2 = (trackerCount * CO2_PER_BOOK).toFixed(1);

  animateValue("tracker-water", water);
  animateValue("tracker-trees", trees);
  animateValue("tracker-co2", co2);
}

function animateValue(id, newVal) {
  const el = document.getElementById(id);
  el.style.transform = "scale(1.15)";
  el.textContent = newVal;
  setTimeout(function() { el.style.transform = "scale(1)"; }, 200);
}

// ── Init ──
document.addEventListener("DOMContentLoaded", function () {
  // Enter key in search
  document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") runSearch();
  });

  // Update book count stat
  document.getElementById("stat-books").textContent = books.length;

  // Show featured books on first visit to search page
  lastSearchResults = [];
  var featured = books.filter(function (b) { return b.available; }).slice(0, 8);
  renderResults(featured);
  document.getElementById("resultsCount").textContent = "Showing " + featured.length + " featured books";
});
