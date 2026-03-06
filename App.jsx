import { useEffect } from "react";
import "./styles.css";

function App() {
  useEffect(() => {
    // load your old scripts AFTER React renders the HTML
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        // prevent double-loading on hot reload
        if (document.querySelector(`script[src="${src}"]`)) return resolve();

        const s = document.createElement("script");
        s.src = src;
        s.defer = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    (async () => {
      try {
        await loadScript("/catalogue.js");
        await loadScript("/script.js");
      } catch (e) {
        console.error("Script load failed:", e);
      }
    })();
  }, []);

  return (
    <>
      {/* NAV */}
      <nav id="main-nav">
        <a className="nav-brand" href="#">
          <div className="nav-brand-icon">📚</div>
          <span className="nav-brand-name">SCAIL</span>
        </a>

        <div className="nav-links">
          <a
            href="#"
            className="active"
            onClick={(e) => {
              e.preventDefault();
              window.goTo?.("home", e.currentTarget);
            }}
          >
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.goTo?.("sustainability", e.currentTarget);
            }}
          >
            Sustainability
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.goTo?.("search", e.currentTarget);
            }}
          >
            AI Search
          </a>

          {/* if you moved help.html into public/, this works */}
          <a href="help.html">Help</a>
        </div>

        <div className="system-status" aria-live="polite">
          <span id="status-dot" className="status-dot"></span>
          <span id="status-text">Ready</span>
        </div>

        <button
          className="nav-cta secondary"
          onClick={() => window.toggleShelfPanel?.()}
        >
          My List (<span id="shelf-count">0</span>)
        </button>

        <button className="nav-cta" onClick={() => window.toast?.("Coming soon!")}>
          Sign In
        </button>
      </nav>

      {/* ═══ PAGE 1: HOME ═══ */}
      <div id="page-home" className="page active">
        <section className="home-hero">
          <div className="hero-left">
            <div className="hero-tag">Sustainability · AI · Community</div>
            <h1 className="hero-h1">
              The Library,
              <br />
              <em>Reimagined</em>
              <br />
              for Today.
            </h1>
            <p className="hero-p">
              Discover books through AI-powered search, find your exact aisle in seconds,
              and track your real environmental impact — all in one place.
            </p>

            <div className="hero-actions">
              <button
                className="btn-hero btn-hero-primary"
                onClick={() =>
                  window.goTo?.("search", document.querySelectorAll(".nav-links a")[2])
                }
              >
                Search Books
              </button>
              <button
                className="btn-hero btn-hero-ghost"
                onClick={() =>
                  window.goTo?.("sustainability", document.querySelectorAll(".nav-links a")[1])
                }
              >
                Our Impact
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-cards-stack">
              <div className="hero-card">
                <div className="hc-icon">🤖</div>
                <div className="hc-text">
                  <h4>AI Librarian</h4>
                  <p>Describe what you want in plain English</p>
                </div>
              </div>

              <div className="hero-card">
                <div className="hc-icon">🗺️</div>
                <div className="hc-text">
                  <h4>Exact Aisle Finder</h4>
                  <p>Computer vision guides you shelf-by-shelf</p>
                </div>
              </div>

              <div className="hero-card">
                <div className="hc-icon">🌿</div>
                <div className="hc-text">
                  <h4>Eco Impact Tracker</h4>
                  <p>See the trees you save every time you borrow</p>
                </div>
              </div>

              <div className="hero-card">
                <div className="hc-icon">💺</div>
                <div className="hc-text">
                  <h4>Live Seat Availability</h4>
                  <p>Check any branch before heading over</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="home-stats">
          <div className="hs-item">
            <div className="hs-num" id="stat-books">
              56
            </div>
            <div className="hs-label">Books Available</div>
          </div>
          <div className="hs-item">
            <div className="hs-num">7</div>
            <div className="hs-label">Categories</div>
          </div>
          <div className="hs-item">
            <div className="hs-num">8,217</div>
            <div className="hs-label">Trees Saved This Year</div>
          </div>
          <div className="hs-item">
            <div className="hs-num">94%</div>
            <div className="hs-label">User Satisfaction</div>
          </div>
        </div>

        <section className="home-features">
          <div className="section-eyebrow">What We Offer</div>
          <h2 className="section-h2">
            Everything you need,
            <br />
            beautifully connected.
          </h2>
          <p className="section-sub">
            We took the best parts of the public library experience and upgraded them with
            modern technology and sustainability in mind.
          </p>

          <div className="feat-grid">
            <div
              className="feat-card"
              onClick={() =>
                window.goTo?.("search", document.querySelectorAll(".nav-links a")[2])
              }
            >
              <div className="fc-icon-wrap" style={{ background: "#F5E6E8" }}>
                🤖
              </div>
              <h3>AI Book Search</h3>
              <p>
                Type anything — a mood, a topic, a half-remembered title. Our AI matches you
                to the perfect book across our entire catalog.
              </p>
              <div className="fc-link">Try it now →</div>
            </div>

            <div
              className="feat-card"
              onClick={() =>
                window.goTo?.("search", document.querySelectorAll(".nav-links a")[2])
              }
            >
              <div className="fc-icon-wrap" style={{ background: "#F0EDF2" }}>
                🗺️
              </div>
              <h3>Aisle &amp; Shelf Locator</h3>
              <p>
                Never wander again. Our system shows you the exact floor, aisle, and shelf
                number for any book in real time.
              </p>
              <div className="fc-link">See example →</div>
            </div>

            <div
              className="feat-card"
              onClick={() =>
                window.goTo?.("sustainability", document.querySelectorAll(".nav-links a")[1])
              }
            >
              <div className="fc-icon-wrap" style={{ background: "#E8ECF0" }}>
                🌿
              </div>
              <h3>Sustainability Tracker</h3>
              <p>
                Every book borrowed is a book not bought. Track your personal CO2 savings,
                paper saved, and contribution to our community total.
              </p>
              <div className="fc-link">See our impact →</div>
            </div>
          </div>
        </section>

        <footer>
          CSEN 163 Final Project &nbsp;·&nbsp; Team: Bemmy · Aarush · Keona · Blessy
          &nbsp;·&nbsp; <span>SCAIL 2026</span>
        </footer>
      </div>

      { /* ═══ PAGE 2: SUSTAINABILITY ═══ */}
<div id="page-sustainability" className="page">
  <section className="sus-hero">
    <div className="sus-hero-text">
      <div
        className="hero-tag"
        style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.9)" }}
      >
        🌱 Environmental Mission
      </div>
      <h1>
        Every borrow is
        <br />a <em>better</em> choice
        <br />
        for the planet.
      </h1>
      <p style={{ marginTop: "1rem" }}>
        Physical libraries are one of the most sustainable institutions ever created. We
        make that impact visible, trackable, and shareable — inspiring communities to
        borrow more and buy less.
      </p>
    </div>

    <div className="sus-meter">
      <div className="sus-meter-title">Community Impact — 2026 YTD</div>
      <div className="sus-counter">
        <div className="sus-big-num">8,217</div>
        <div className="sus-big-label">Trees Equivalent Saved</div>
      </div>

      <div className="sus-bars">
        <div className="sus-bar-row">
          <div className="sus-bar-label">
            <span>CO2 Avoided</span>
            <span>42,800 kg</span>
          </div>
          <div className="sus-bar-track">
            <div className="sus-bar-fill" style={{ width: "78%" }}></div>
          </div>
        </div>

        <div className="sus-bar-row">
          <div className="sus-bar-label">
            <span>Paper Saved</span>
            <span>186,000 kg</span>
          </div>
          <div className="sus-bar-track">
            <div className="sus-bar-fill" style={{ width: "65%" }}></div>
          </div>
        </div>

        <div className="sus-bar-row">
          <div className="sus-bar-label">
            <span>Water Conserved</span>
            <span>9.4M liters</span>
          </div>
          <div className="sus-bar-track">
            <div className="sus-bar-fill" style={{ width: "54%" }}></div>
          </div>
        </div>

        <div className="sus-bar-row">
          <div className="sus-bar-label">
            <span>Books Circulated</span>
            <span>124,500</span>
          </div>
          <div className="sus-bar-track">
            <div className="sus-bar-fill" style={{ width: "88%" }}></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Interactive Personal Tracker */}
  <section
    style={{
      background: "linear-gradient(160deg,#862633 0%,#4A0E17 100%)",
      padding: "4rem 5rem",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
      <div className="section-eyebrow" style={{ color: "#E8C6CB" }}>
        Your Personal Impact
      </div>
      <h2 className="section-h2" style={{ color: "white" }}>
        How many books have you borrowed?
      </h2>
      <p
        className="section-sub"
        style={{ color: "rgba(255,255,255,0.6)", margin: "0 auto" }}
      >
        Use the buttons to add your borrowed books and watch your environmental savings
        grow in real time.
      </p>
    </div>

    <div className="tracker-widget">
      <h3>Books You've Borrowed</h3>

      <div className="tracker-count-row">
        <button className="tracker-btn" onClick={() => window.changeTrackerCount?.(-1)}>
          -
        </button>
        <div className="tracker-num" id="tracker-count">
          0
        </div>
        <button className="tracker-btn" onClick={() => window.changeTrackerCount?.(1)}>
          +
        </button>
      </div>

      <div className="tracker-label">Click + to add books you've borrowed this year</div>

      <div className="tracker-savings">
        <div className="tracker-saving-item">
          <div className="tracker-saving-icon">💧</div>
          <div className="tracker-saving-num" id="tracker-water">
            0
          </div>
          <div className="tracker-saving-label">Gallons of water saved</div>
        </div>

        <div className="tracker-saving-item">
          <div className="tracker-saving-icon">🌳</div>
          <div className="tracker-saving-num" id="tracker-trees">
            0
          </div>
          <div className="tracker-saving-label">Trees preserved</div>
        </div>

        <div className="tracker-saving-item">
          <div className="tracker-saving-icon">💨</div>
          <div className="tracker-saving-num" id="tracker-co2">
            0
          </div>
          <div className="tracker-saving-label">lbs of CO2 avoided</div>
        </div>
      </div>
    </div>
  </section>

  <section className="sus-metrics">
    <div className="section-eyebrow">Your Personal Impact</div>
    <p className="section-sub">
      These values show your running total for this demo session based on books you add
      below.
    </p>

    <h2 className="section-h2">What 1 borrowed book saves.</h2>
    <p className="section-sub">
      Compared to purchasing a new copy of the same title — averaged across our catalog.
    </p>

    <div className="sus-metrics-grid">
      <div className="sus-metric-card">
        <div className="smc-emoji">🌳</div>
        <div className="smc-num">0.116</div>
        <div className="smc-label">Trees saved per borrowed book (pulp equivalent)</div>
      </div>

      <div className="sus-metric-card">
        <div className="smc-emoji">💨</div>
        <div className="smc-num">344g</div>
        <div className="smc-label">CO2 not emitted vs. buying &amp; shipping a new book</div>
      </div>

      <div className="sus-metric-card">
        <div className="smc-emoji">💧</div>
        <div className="smc-num">75L</div>
        <div className="smc-label">Water conserved in paper production per book</div>
      </div>
    </div>
  </section>

  <section className="sus-comparison">
    <div className="section-eyebrow">The Case for Borrowing</div>
    <h2 className="section-h2">Old way vs. SCAIL way.</h2>

    <div className="sus-comp-grid">
      <div className="sus-comp-card old">
        <h3>Buying a New Book</h3>
        <div className="sus-comp-item">
          <span className="ci-icon">🌲</span> Trees cut for pulp and paper production
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">🏭</span> Factory energy to print, bind, and package
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">🚚</span> Shipping emissions from warehouse to your door
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">📦</span> Book often discarded or sits unread on a shelf
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">💸</span> Average cost: $18–$28 per book
        </div>
      </div>

      <div className="sus-comp-card new">
        <h3>Borrowing via SCAIL</h3>
        <div className="sus-comp-item">
          <span className="ci-icon">♻️</span> One physical copy shared by hundreds of readers
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">🚶</span> Walking or transit to the library = near-zero emissions
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">📊</span> Real-time impact score shows your personal contribution
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">🌿</span> Community total tracked and published monthly
        </div>
        <div className="sus-comp-item">
          <span className="ci-icon">🆓</span> Always free — for everyone
        </div>
      </div>
    </div>
  </section>

  <footer>
    CSEN 163 Final Project &nbsp;·&nbsp; Team: Bemmy · Aarush · Keona · Blessy &nbsp;·&nbsp;{" "}
    <span>SCAIL 2026</span>
  </footer>
</div> 

{/* ═══ PAGE 3: AI SEARCH ═══ */}
<div id="page-search" className="page">
  <section className="search-hero">
    <h1>
      Find Your Next<br />
      <em>Great Read</em>
    </h1>
    <p>Search by title, author, genre — or just describe what you're in the mood for.</p>

    <div className="search-bar-wrap">
      <div className="search-bar">
        <input
          type="text"
          id="searchInput"
          placeholder="e.g. 'mystery thriller' or 'Tolkien' or 'self-help motivation'"
        />
        <button
          className="search-bar-btn"
          id="searchBtn"
          onClick={() => window.runSearch?.()}
        >
          AI Search
        </button>
      </div>

      <div className="search-helper">
        Search = exact title/author/topic. AI Librarian below explains why matches fit. You can also tap
        any suggested tag below the search bar.
      </div>

      <div className="search-error" id="searchError"></div>

      <div className="search-pills">
        <span className="search-pill" onClick={() => window.fillSearch?.("fiction")}>Fiction</span>
        <span className="search-pill" onClick={() => window.fillSearch?.("stem science")}>STEM</span>
        <span className="search-pill" onClick={() => window.fillSearch?.("kids adventure")}>Kids</span>
        <span className="search-pill" onClick={() => window.fillSearch?.("history biography")}>History</span>
        <span className="search-pill" onClick={() => window.fillSearch?.("fantasy")}>Fantasy &amp; Sci-Fi</span>
        <span className="search-pill" onClick={() => window.fillSearch?.("self-help")}>Self-Help</span>
        <span className="search-pill" onClick={() => window.fillSearch?.("philosophy art")}>Philosophy &amp; Art</span>
      </div>
    </div>
  </section>

  <div className="search-body">
    <div className="search-layout">
      {/* Sidebar filters */}
      <div className="filter-sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <div className="filter-group-label">Category</div>

          <div className="filter-option">
            <input type="checkbox" id="fc-Fiction" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-Fiction">Fiction</label>
            <span className="fo-count">11</span>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fc-STEM" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-STEM">STEM</label>
            <span className="fo-count">8</span>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fc-Kids" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-Kids">Kids</label>
            <span className="fo-count">8</span>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fc-History" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-History">History</label>
            <span className="fo-count">7</span>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fc-Fantasy" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-Fantasy">Fantasy &amp; Sci-Fi</label>
            <span className="fo-count">8</span>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fc-Self-Help" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-Self-Help">Self-Help</label>
            <span className="fo-count">5</span>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fc-Philosophy" defaultChecked onChange={() => window.applyFilters?.()} />
            <label htmlFor="fc-Philosophy">Philosophy &amp; Art</label>
            <span className="fo-count">6</span>
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group-label">Availability</div>

          <div className="filter-option">
            <input type="checkbox" id="fa-avail" onChange={() => window.applyFilters?.()} />
            <label htmlFor="fa-avail">Available Now</label>
          </div>

          <div className="filter-option">
            <input type="checkbox" id="fa-digital" onChange={() => window.applyFilters?.()} />
            <label htmlFor="fa-digital">Digital Copy (instant checkout)</label>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div>
        <div className="ai-response-box">
          <div className="ai-response-header">
            <div className="ai-dot"></div>
            <span>AI Librarian</span>

            <div className="ai-response-actions">
              <button className="ai-reset-btn" onClick={() => window.resetSearchSession?.()}>
                New Search Session
              </button>
            </div>
          </div>

          <div className="ai-response-text" id="aiResponseText">
            Try a search above — describe a mood, genre, or book you already loved. I&apos;ll find the best matches and
            explain why each one fits. You can also tap any suggested tag below the search bar.
          </div>
        </div>

        <div className="results-header">
          <h2 id="resultsCount">Showing featured books</h2>

          <select className="sort-select" id="sortSelect" onChange={() => window.applyFilters?.()}>
            <option value="relevance">Sort: Relevance</option>
            <option value="rating">Sort: Rating</option>
            <option value="title">Sort: Title A–Z</option>
          </select>
        </div>

        <div id="results-container"></div>
      </div>
    </div>
  </div>

  <footer>
    CSEN 163 Final Project &nbsp;·&nbsp; Team: Bemmy · Aarush · Keona · Blessy &nbsp;·&nbsp; <span>SCAIL 2026</span>
  </footer>
</div>

{/* ═══ PAGE 4: BOOK DETAILS ═══ */}
<div id="page-detail" className="page">
  <section className="detail-hero" id="detail-hero-section">
    <div>
      <button
        className="detail-back"
        onClick={() => window.goTo?.("search", document.querySelectorAll(".nav-links a")[2])}
      >
        ← Back to Search
      </button>
      <div className="detail-cover" id="detail-cover">📖</div>
    </div>

    <div className="detail-meta">
      <h1 id="detail-title">Book Title</h1>
      <div className="detail-author" id="detail-author">Author</div>

      <div className="detail-badges">
        <span className="detail-badge genre" id="detail-genre">Genre</span>
        <span className="detail-badge avail" id="detail-avail">Available</span>
        <span className="detail-badge pages" id="detail-rating">Rating</span>
        <span className="detail-badge pages" id="detail-digital">Format</span>
      </div>

      <p className="detail-desc" id="detail-desc">Book summary.</p>

      <div className="detail-action-group">
        <button className="btn-lg btn-lg-primary" id="detail-reserve-btn" onClick={() => window.reserveCurrentBook?.()}>
          Reserve This Book
        </button>
        <button className="btn-lg btn-lg-outline" onClick={() => window.addCurrentBookToWishlist?.()}>
          Add to Wishlist
        </button>
      </div>
    </div>

    <div className="detail-quick-stats">
      <div className="dqs-item"><div className="dqs-label">Branch</div><div className="dqs-value">Santa Clara Main</div></div>
      <div className="dqs-item"><div className="dqs-label">Floor</div><div className="dqs-value" id="detail-floor">Floor 1</div></div>
      <div className="dqs-item"><div className="dqs-label">Aisle</div><div className="dqs-value" id="detail-aisle">Aisle A</div></div>
      <div className="dqs-item"><div className="dqs-label">Shelf</div><div className="dqs-value" id="detail-shelf">Shelf A</div></div>
    </div>
  </section>

  <section className="detail-body">
    <div className="detail-layout">
      <div className="floor-map-section">
        <h2>Floor Map &amp; Exact Location</h2>
        <p>Tap a floor tab to see where your book is. The gold pin marks the exact shelf.</p>

        <div className="floor-map">
          <div className="floor-tabs">
            <button className="floor-tab" onClick={(e) => window.setFloor?.(1, e.currentTarget)}>Floor 1</button>
            <button className="floor-tab" onClick={(e) => window.setFloor?.(2, e.currentTarget)}>Floor 2</button>
            <button className="floor-tab" onClick={(e) => window.setFloor?.(3, e.currentTarget)}>Floor 3</button>
          </div>

          <div className="floor-svg-wrap" id="floor-wrap">
            <svg className="floor-plan" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="380" height="260" rx="8" fill="#F8F9FA" stroke="#CCC" strokeWidth="2" />
              <rect x="165" y="254" width="70" height="16" rx="4" fill="#E8EFEA" stroke="#C5D9C8" />
              <text x="200" y="265" textAnchor="middle" className="aisle-label" fontSize="9" fill="#888">ENTRY</text>
              <rect x="155" y="225" width="90" height="20" rx="4" fill="#F5E6E8" stroke="#E8C6CB" />
              <text x="200" y="238" textAnchor="middle" className="aisle-label">Info Desk</text>

              <text x="30" y="40" className="aisle-label" fontWeight="bold" fill="#555" id="label-aisle-A">AISLE A</text>
              <rect x="22" y="45" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="1" />
              <rect x="22" y="65" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="2" />
              <rect x="22" y="85" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="3" />
              <rect x="22" y="105" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="4" />
              <rect x="22" y="125" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="5" />
              <rect x="22" y="145" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="6" />
              <rect x="22" y="165" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="A" data-shelf="7" />

              <text x="120" y="40" className="aisle-label" fontWeight="bold" fill="#555" id="label-aisle-B">AISLE B</text>
              <rect x="112" y="45" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="1" />
              <rect x="112" y="65" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="2" />
              <rect x="112" y="85" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="3" />
              <rect x="112" y="105" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="4" />
              <rect x="112" y="125" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="5" />
              <rect x="112" y="145" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="6" />
              <rect x="112" y="165" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="B" data-shelf="7" />

              <text x="210" y="40" className="aisle-label" fontWeight="bold" fill="#555" id="label-aisle-C">AISLE C</text>
              <rect x="202" y="45" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="1" />
              <rect x="202" y="65" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="2" />
              <rect x="202" y="85" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="3" />
              <rect x="202" y="105" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="4" />
              <rect x="202" y="125" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="5" />
              <rect x="202" y="145" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="6" />
              <rect x="202" y="165" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="C" data-shelf="7" />

              <text x="300" y="40" className="aisle-label" fontWeight="bold" fill="#555" id="label-aisle-D">AISLE D</text>
              <rect x="292" y="45" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="1" />
              <rect x="292" y="65" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="2" />
              <rect x="292" y="85" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="3" />
              <rect x="292" y="105" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="4" />
              <rect x="292" y="125" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="5" />
              <rect x="292" y="145" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="6" />
              <rect x="292" y="165" width="80" height="14" rx="3" className="aisle-shelf" data-aisle="D" data-shelf="7" />

              <rect x="340" y="220" width="42" height="40" rx="4" fill="#EEE" stroke="#CCC" />
              <text x="361" y="244" textAnchor="middle" className="aisle-label">Stairs</text>

              <circle cx="200" cy="214" r="6" fill="#758592" stroke="white" strokeWidth="2" />
              <text x="200" y="211" textAnchor="middle" className="aisle-label" fill="#758592" fontSize="8">YOU</text>

              <circle id="map-pin" cx="152" cy="72" r="7" fill="#862633" stroke="white" strokeWidth="2.5">
                <animate attributeName="r" values="7;9;7" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.7;1" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="floor-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#E8C6CB", border: "1px solid #862633" }}></div>
              Your Book&apos;s Shelf
            </div>
            <div className="legend-item">
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#862633", marginRight: 2 }}></div>
              Exact Location
            </div>
            <div className="legend-item">
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#758592", marginRight: 2 }}></div>
              Your Position
            </div>
          </div>
        </div>
      </div>

      <div className="location-details">
        <h2>Location Details</h2>

        <div className="loc-callout">
          <div className="loc-callout-icon">📍</div>
          <div id="loc-callout-text">
            <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Floor 1 · Aisle 3 · Shelf C</div>
            <div style={{ fontSize: "0.82rem", opacity: 0.8 }}>Santa Clara Main Library</div>
          </div>
        </div>

        <div className="loc-card">
          <h3>Branch Info</h3>
          <p>
            2635 Homestead Rd, Santa Clara, CA<br />
            Mon–Thu: 10am–8pm · Fri–Sat: 10am–6pm<br />
            Sun: Noon–5pm
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", background: "#F5E6E8", color: "#862633", padding: "0.2rem 0.6rem", borderRadius: 6, fontWeight: 600 }}>
              24 seats free
            </span>
            <span style={{ fontSize: "0.75rem", background: "#F5E6E8", color: "#862633", padding: "0.2rem 0.6rem", borderRadius: 6, fontWeight: 600 }}>
              Free parking
            </span>
          </div>
        </div>

        <div className="loc-card">
          <h3>Step-by-Step Directions</h3>
          <p id="loc-directions">
            <strong>1.</strong> Enter through main doors on Homestead Rd<br />
            <strong>2.</strong> Head to <strong>Floor 1</strong><br />
            <strong>3.</strong> Turn left past the Info Desk<br />
            <strong>4.</strong> Walk to <strong>Aisle 3</strong><br />
            <strong>5.</strong> Your book is on <strong>Shelf C</strong>
          </p>
        </div>

        <div className="cv-section">
          <h4>Computer Vision Assist</h4>
          <p>
            Can&apos;t find it? Open the SCAIL app and point your camera at the shelves. Our YOLO-based CV system will highlight your book in real time with an AR overlay.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section className="also-read">
    <div className="section-eyebrow">You Might Also Like</div>
    <h2 className="section-h2">AI Recommendations</h2>
    <div className="also-grid" id="also-grid"></div>
  </section>

  <footer>
    CSEN 163 Final Project &nbsp;·&nbsp; Team: Bemmy · Aarush · Keona · Blessy &nbsp;·&nbsp; <span>SCAIL 2026</span>
  </footer>
</div>

{/* ═══ PAGE 5: HELP ═══ */}
<div id="page-help" className="page">

  <section className="help-hero">
    <h1>Help & User Guide</h1>
    <p>
      Learn how to use SCAIL to search books, find exact shelf locations,
      and track your sustainability impact.
    </p>
  </section>

  <section className="help-section">
    <h2>🔎 Searching for Books</h2>
    <p>
      Go to the <strong>AI Search</strong> page and type anything like:
    </p>
    <ul>
      <li>"mystery thriller"</li>
      <li>"books like Harry Potter"</li>
      <li>"science for beginners"</li>
    </ul>
    <p>
      The AI Librarian will explain why each book matches your search.
    </p>
  </section>

  <section className="help-section">
    <h2>📍 Finding the Exact Shelf</h2>
    <p>
      Every book result shows its exact location including:
    </p>
    <ul>
      <li>Floor number</li>
      <li>Aisle</li>
      <li>Shelf</li>
    </ul>
    <p>
      The interactive floor map highlights where the book is located in the library.
    </p>
  </section>

  <section className="help-section">
    <h2>🌱 Sustainability Tracking</h2>
    <p>
      Borrowing books reduces paper waste and environmental impact.
      SCAIL tracks your reading activity and estimates the environmental
      savings your borrowing contributes to the community.
    </p>
  </section>

  <section className="help-section">
    <h2>⭐ My List</h2>
    <p>
      You can reserve books or add them to your wishlist.
      Open <strong>My List</strong> in the top right to view your saved books.
    </p>
  </section>

  <footer>
    CSEN 163 Final Project · Team: Bemmy · Aarush · Keona · Blessy ·
    <span>SCAIL 2026</span>
  </footer>

</div>


      {/* Shelf Panel */}
      <div className="shelf-panel" id="shelf-panel">
        <h3>My Holds, Waitlist & Wishlist</h3>
        <div className="shelf-empty" id="shelf-empty">
          Your list is empty right now.
        </div>
        <div className="shelf-list" id="shelf-list"></div>
      </div>

      {/* Welcome Modal */}
      <div className="welcome-modal" id="welcome-modal">
        <div className="welcome-card">
          <h2>Welcome to SCAIL 👋</h2>
          <p>
            Explore Santa Clara AI Library to find books fast, locate shelves instantly, and
            track your sustainability impact.
          </p>
          <button onClick={() => window.closeWelcomeModal?.()}>Start Exploring</button>
        </div>
      </div>

      {/* Toast */}
      <div className="toast" id="toast-el"></div>
    </>
  );
} 


export default App;