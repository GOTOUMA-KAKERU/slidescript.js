/* Pages.js - Enhanced HTML Slide Framework with Rich Default Design */

class PagesJS {
  constructor() {
    this.pages = [];
    this.currentPageIndex = 0;
    this.settings = this.parseSettings();
    this.initPages();
    this.applyGlobalCSS();
    this.addKeyboardNavigation();
  }

  parseSettings() {
    const pagesTag = document.querySelector("head > pages");
    if (!pagesTag) return {};
    return {
      version: pagesTag.getAttribute("body") || "1.0.0",
      title: pagesTag.getAttribute("title") || document.title || "PagesJS Slideshow",
      theme: pagesTag.getAttribute("theme") || "light",
    };
  }

  initPages() {
    this.pages = Array.from(document.querySelectorAll("page"));
    this.pages.forEach((pg, i) => {
      pg.style.display = i === 0 ? "block" : "none";
      pg.classList.add("pages-slide");
    });
  }

  showPage(index) {
    if (index < 0 || index >= this.pages.length) return;
    this.pages[this.currentPageIndex].style.display = "none";
    this.currentPageIndex = index;
    this.pages[this.currentPageIndex].style.display = "block";
  }

  nextPage() {
    this.showPage(this.currentPageIndex + 1);
  }

  prevPage() {
    this.showPage(this.currentPageIndex - 1);
  }

  addKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === " ") this.nextPage();
      if (e.key === "ArrowLeft") this.prevPage();
    });
  }

  applyGlobalCSS() {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        margin: 0;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        transition: background 0.5s, color 0.5s;
      }

      page {
        display: none;
        position: relative;
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
        padding: 3em;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        transition: opacity 0.6s ease, transform 0.6s ease;
      }

      page h1, page h2, page h3, page h4 {
        margin: 0.5em 0;
        line-height: 1.2;
      }
      
      page.active { display: flex; opacity: 1; transform: translateY(0); }

      .pages-slide {
        opacity: 0;
        transform: translateY(50px);
      }

      /* Theme Styles */
      body.pages-light {
        background: linear-gradient(135deg, #fafafa, #eaeaea);
        color: #111;
      }
      body.pages-dark {
        background: radial-gradient(circle at top left, #111, #000);
        color: #eee;
      }

      /* Fancy footer */
      .page-footer {
        position: absolute;
        bottom: 15px;
        right: 25px;
        font-size: 14px;
        opacity: 0.8;
        font-style: italic;
      }

      /* Buttons */
      .pages-nav-btn {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.4);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        z-index: 9999;
        transition: background 0.3s;
      }
      .pages-nav-btn:hover { background: rgba(0,0,0,0.7); }
      .pages-prev { left: 20px; }
      .pages-next { right: 20px; }

      /* Custom pseudo states */
      div:anim-after { content: ''; border: 3px dashed #ff5555; }
    `;
    document.head.appendChild(style);
    document.body.classList.add(`pages-${this.settings.theme}`);

    // Navigation buttons
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "◀";
    prevBtn.className = "pages-nav-btn pages-prev";
    prevBtn.onclick = () => this.prevPage();
    document.body.appendChild(prevBtn);

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "▶";
    nextBtn.className = "pages-nav-btn pages-next";
    nextBtn.onclick = () => this.nextPage();
    document.body.appendChild(nextBtn);
  }

  /* Export to PDF */
  async exportPDF(filename = "slides.pdf") {
    if (!window.jspdf) {
      console.error("jsPDF not loaded. Please include jsPDF library.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "px", format: "a4" });

    for (let i = 0; i < this.pages.length; i++) {
      if (i !== 0) pdf.addPage();
      pdf.text(`Page ${i + 1}: ${this.settings.title}`, 20, 20);
      pdf.text(this.pages[i].innerText, 20, 50);
    }

    pdf.save(filename);
  }
}

// Auto-init
window.addEventListener("DOMContentLoaded", () => {
  window.Pages = new PagesJS();
});
