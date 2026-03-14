const consultModal = document.getElementById("consultModal");
let topNoticeHideTimer = null;

function showTopNotice(message) {
  let notice = document.getElementById("topNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "topNotice";
    notice.className = "top-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    document.body.appendChild(notice);
  }
  notice.textContent = message;
  notice.classList.add("is-visible");
  if (topNoticeHideTimer) clearTimeout(topNoticeHideTimer);
  topNoticeHideTimer = setTimeout(() => {
    notice.classList.remove("is-visible");
  }, 2500);
}

const cookieBanner = document.getElementById("cookieBanner");
const cookieBannerAccept = document.getElementById("cookieBannerAccept");
const COOKIE_CONSENT_KEY = "planeta_cookie_consent_v1";

function showCookieBanner() {
  if (!cookieBanner) return;
  cookieBanner.hidden = false;
  requestAnimationFrame(() => {
    cookieBanner.classList.add("is-visible");
  });
}

function hideCookieBanner() {
  if (!cookieBanner) return;
  cookieBanner.classList.remove("is-visible");
  setTimeout(() => {
    if (!cookieBanner.classList.contains("is-visible")) {
      cookieBanner.hidden = true;
    }
  }, 220);
}

function getCookieConsentAccepted() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch (e) {
    return false;
  }
}

function setCookieConsentAccepted() {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
  } catch (e) {}
}

function updateCookieBannerVisibility() {
  if (!cookieBanner) return;
  if (getCookieConsentAccepted()) {
    hideCookieBanner();
    return;
  }
  showCookieBanner();
}

if (cookieBanner && cookieBannerAccept) {
  cookieBannerAccept.addEventListener("click", () => {
    setCookieConsentAccepted();
    hideCookieBanner();
  });
  updateCookieBannerVisibility();
  window.addEventListener("resize", updateCookieBannerVisibility);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    if (targetId === "#consult" && consultModal) {
      e.preventDefault();
      if (consultModalForm) {
        modalFormSubmitted = false;
        consultModalForm.reset();
        modalNameInput?.classList.remove("input--error");
        modalPhoneInput?.classList.remove("input--error");
        modalCheckbox?.classList.remove("input--error");
        modalNameInput?.classList.add("input--valid");
        modalPhoneInput?.classList.add("input--valid");
        updateModalSubmitState();
      }
      if (consultModalSuccess) consultModalSuccess.hidden = true;
      consultModal.classList.add("is-open");
      consultModal.setAttribute("aria-hidden", "false");
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const yOffset = -80;
    const y =
      target.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    if (targetId === "#hero") {
      history.pushState(null, "", window.location.pathname + window.location.search);
      setActiveNavFromHash();
    } else if (["#directions", "#marks", "#services", "#contacts"].includes(targetId)) {
      history.pushState(null, "", targetId);
      setActiveNavFromHash();
    }
  });
});

function setActiveNavFromHash() {
  const hash = window.location.hash;
  document.querySelectorAll(".nav__link").forEach((a) => {
    a.classList.toggle("nav__link--active", hash && a.getAttribute("href") === hash);
  });
}

window.addEventListener("hashchange", setActiveNavFromHash);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setActiveNavFromHash();
  });
} else {
  history.replaceState(null, "", window.location.pathname + window.location.search);
  setActiveNavFromHash();
}

const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
const navClose = document.getElementById("navClose");
const mainNav = document.getElementById("mainNav");

function closeMobileNav() {
  if (header) header.classList.remove("header--nav-open");
  document.body.style.overflow = "";
}

function openMobileNav() {
  if (header) header.classList.add("header--nav-open");
  document.body.style.overflow = "hidden";
}

if (burger && header) {
  burger.addEventListener("click", () => {
    if (header.classList.contains("header--nav-open")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

if (navClose && header) {
  navClose.addEventListener("click", closeMobileNav);
}

if (mainNav) {
  mainNav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

const form = document.getElementById("consultForm");
const successMessage = document.getElementById("formSuccess");
const submitBtn = form?.querySelector(".contacts__submit");
const nameInput = form?.querySelector('input[name="name"]');
const phoneInput = form?.querySelector('input[name="phone"]');
const checkboxInput = form?.querySelector('.form__checkbox input[type="checkbox"]');
let pageFormSubmitted = false;

if (nameInput) {
  nameInput.classList.add("input--valid");
}
if (phoneInput) {
  phoneInput.classList.add("input--valid");
}

function getPhoneDigits(value) {
  let v = (value || "").replace(/\D/g, "");
  if (v.startsWith("8") && v.length <= 11) v = "7" + v.slice(1);
  if (v.startsWith("7")) v = v.slice(1);
  return v;
}

function isPhoneFull(value) {
  return getPhoneDigits(value).length === 10;
}

function stripDigitsFromName(inputEl) {
  if (!inputEl) return;
  const cleaned = (inputEl.value || "").replace(/\d/g, "");
  if (inputEl.value !== cleaned) inputEl.value = cleaned;
}

function formatPhoneInput(inputEl) {
  if (!inputEl) return;
  let v = inputEl.value.replace(/\D/g, "");
  if (v.startsWith("8") && v.length <= 11) v = "7" + v.slice(1);
  if (v.startsWith("7")) v = v.slice(1);
  if (v.length > 10) v = v.slice(0, 10);
  let formatted = "+7";
  if (v.length > 0) formatted += " (" + v.slice(0, 3);
  if (v.length >= 3) formatted += ") " + v.slice(3, 6);
  if (v.length >= 6) formatted += " " + v.slice(6, 8);
  if (v.length >= 8) formatted += " " + v.slice(8, 10);
  inputEl.value = formatted;
}

function updateSubmitButtonState() {
  if (!submitBtn || !nameInput || !phoneInput || !checkboxInput) return;
  const nameFilled = (nameInput.value || "").trim().length > 0;
  const phoneFilled = isPhoneFull(phoneInput.value);
  const checkboxChecked = checkboxInput.checked;
  const isValid = nameFilled && phoneFilled && checkboxChecked;
  submitBtn.classList.toggle("contacts__submit--valid", isValid);
}

function updatePageFormErrors() {
  if (nameInput) {
    const hasError = (nameInput.value || "").trim().length === 0;
    nameInput.classList.toggle("input--error", hasError);
    nameInput.classList.toggle("input--valid", !hasError && !!(nameInput.value || "").trim().length);
  }
  if (phoneInput) {
    const hasError = !isPhoneFull(phoneInput.value);
    phoneInput.classList.toggle("input--error", hasError);
    phoneInput.classList.toggle("input--valid", !hasError && isPhoneFull(phoneInput.value));
  }
  if (checkboxInput) {
    checkboxInput.classList.toggle("input--error", !checkboxInput.checked);
  }
}

function flashSubmittingState(buttonEl, duration = 350) {
  if (!buttonEl) return;
  buttonEl.classList.add("is-submitting");
  setTimeout(() => {
    buttonEl.classList.remove("is-submitting");
  }, duration);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    pageFormSubmitted = true;
    const nameEmpty = (nameInput?.value || "").trim().length === 0;
    const phoneNotFull = !isPhoneFull(phoneInput?.value);
    const checkboxNotChecked = !checkboxInput?.checked;
    if (nameEmpty || phoneNotFull || checkboxNotChecked) {
      if (nameInput) {
        nameInput.classList.toggle("input--error", nameEmpty);
        nameInput.classList.toggle("input--valid", !nameEmpty);
      }
      if (phoneInput) {
        phoneInput.classList.toggle("input--error", phoneNotFull);
        phoneInput.classList.toggle("input--valid", !phoneNotFull);
      }
      if (checkboxInput) checkboxInput.classList.toggle("input--error", checkboxNotChecked);
      return;
    }
    flashSubmittingState(submitBtn);
    if (successMessage) successMessage.hidden = false;
    if (nameInput) nameInput.classList.remove("input--error");
    if (phoneInput) phoneInput.classList.remove("input--error");
    form.reset();
    updateSubmitButtonState();
  });
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      stripDigitsFromName(nameInput);
      updateSubmitButtonState();
      if (pageFormSubmitted) updatePageFormErrors();
    });
    nameInput.addEventListener("blur", () => {
      if (pageFormSubmitted) updatePageFormErrors();
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener("focus", () => {
      if (!phoneInput.value || phoneInput.value.trim() === "") {
        phoneInput.value = "+7 ";
      }
    });
    phoneInput.addEventListener("input", () => {
      formatPhoneInput(phoneInput);
      updateSubmitButtonState();
      if (pageFormSubmitted) updatePageFormErrors();
    });
    phoneInput.setAttribute("maxlength", "18");
  }
  if (checkboxInput) {
    checkboxInput.addEventListener("change", () => {
      updateSubmitButtonState();
      if (pageFormSubmitted) updatePageFormErrors();
    });
  }
}

const consultModalForm = document.getElementById("consultModalForm");
const consultModalSuccess = document.getElementById("consultModalSuccess");
const consultModalClose = consultModal?.querySelector(".consult-modal__close");
const modalSubmitBtn = consultModalForm?.querySelector(".contacts__submit");
const modalNameInput = consultModalForm?.querySelector('input[name="name"]');
const modalPhoneInput = consultModalForm?.querySelector('input[name="phone"]');
const modalCheckbox = consultModalForm?.querySelector('.form__checkbox input[type="checkbox"]');
let modalFormSubmitted = false;

if (modalNameInput) {
  modalNameInput.classList.add("input--valid");
}
if (modalPhoneInput) {
  modalPhoneInput.classList.add("input--valid");
}

function updateModalSubmitState() {
  if (!modalSubmitBtn || !modalNameInput || !modalPhoneInput || !modalCheckbox) return;
  const valid =
    (modalNameInput.value || "").trim().length > 0 &&
    isPhoneFull(modalPhoneInput.value) &&
    modalCheckbox.checked;
  modalSubmitBtn.classList.toggle("contacts__submit--valid", valid);
}

function updateModalFormErrors() {
  if (modalNameInput) {
    const hasError = (modalNameInput.value || "").trim().length === 0;
    modalNameInput.classList.toggle("input--error", hasError);
    modalNameInput.classList.toggle("input--valid", !hasError && !!(modalNameInput.value || "").trim().length);
  }
  if (modalPhoneInput) {
    const hasError = !isPhoneFull(modalPhoneInput.value);
    modalPhoneInput.classList.toggle("input--error", hasError);
    modalPhoneInput.classList.toggle("input--valid", !hasError && isPhoneFull(modalPhoneInput.value));
  }
   if (modalCheckbox) {
    modalCheckbox.classList.toggle("input--error", !modalCheckbox.checked);
  }
}

function closeConsultModal() {
  if (consultModal) {
    consultModal.classList.remove("is-open");
    consultModal.setAttribute("aria-hidden", "true");
  }
}

if (consultModalForm) {
  consultModalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    modalFormSubmitted = true;
    const nameEmpty = (modalNameInput?.value || "").trim().length === 0;
    const phoneNotFull = !isPhoneFull(modalPhoneInput?.value);
    const checkboxNotChecked = !modalCheckbox?.checked;
    if (nameEmpty || phoneNotFull || checkboxNotChecked) {
      if (modalNameInput) {
        modalNameInput.classList.toggle("input--error", nameEmpty);
        modalNameInput.classList.toggle("input--valid", !nameEmpty);
      }
      if (modalPhoneInput) {
        modalPhoneInput.classList.toggle("input--error", phoneNotFull);
        modalPhoneInput.classList.toggle("input--valid", !phoneNotFull);
      }
      if (modalCheckbox) modalCheckbox.classList.toggle("input--error", checkboxNotChecked);
      return;
    }
    flashSubmittingState(modalSubmitBtn);
    closeConsultModal();
    showTopNotice("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
    if (modalNameInput) modalNameInput.classList.remove("input--error");
    if (modalPhoneInput) modalPhoneInput.classList.remove("input--error");
    consultModalForm.reset();
    updateModalSubmitState();
  });
  if (modalNameInput) {
    modalNameInput.addEventListener("input", () => {
      stripDigitsFromName(modalNameInput);
      updateModalSubmitState();
      if (modalFormSubmitted) updateModalFormErrors();
    });
    modalNameInput.addEventListener("blur", () => {
      if (modalFormSubmitted) updateModalFormErrors();
    });
  }
  if (modalPhoneInput) {
    modalPhoneInput.addEventListener("focus", () => {
      if (!modalPhoneInput.value || modalPhoneInput.value === "") {
        modalPhoneInput.value = "+7 ";
      }
    });
    modalPhoneInput.addEventListener("input", () => {
      formatPhoneInput(modalPhoneInput);
      updateModalSubmitState();
      if (modalFormSubmitted) updateModalFormErrors();
    });
    modalPhoneInput.setAttribute("maxlength", "18");
  }
  if (modalCheckbox) {
    modalCheckbox.addEventListener("change", () => {
      updateModalSubmitState();
      if (modalFormSubmitted) updateModalFormErrors();
    });
  }
}

if (consultModal) {
  consultModal.querySelector(".consult-modal__backdrop")?.addEventListener("click", closeConsultModal);
}
if (consultModalClose) {
  consultModalClose.addEventListener("click", closeConsultModal);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && consultModal?.classList.contains("is-open")) closeConsultModal();
});

const markImages = document.querySelectorAll(".card__image--mark");
const lightbox = document.getElementById("lightbox");
const cardModalThumbnails = document.getElementById("cardModalThumbnails");
const cardModalMainImage = document.getElementById("cardModalMainImage");
const cardModalMain = document.querySelector(".card-modal__main");
const cardModalClose = document.querySelector(".card-modal__close");
const cardModalCounter = document.getElementById("cardModalCounter");
const cardModalMobileSlider = document.getElementById("cardModalMobileSlider");

let cardModalGallery = [];
let cardModalIndex = 0;
let cardModalTouchStartX = null;

function renderCardModalMobileSlider(total, activeIndex) {
  if (!cardModalMobileSlider) return;
  cardModalMobileSlider.innerHTML = "";
  const segmentsCount = Math.max(1, total);
  const safeIndex = Math.max(0, Math.min(activeIndex, segmentsCount - 1));
  for (let i = 0; i < segmentsCount; i++) {
    const seg = document.createElement("div");
    seg.className = "card-modal__mobile-slider-segment" + (i === safeIndex ? " is-active" : "");
    if (total > 1) {
      seg.addEventListener("click", () => setCardModalSlide(i));
    }
    cardModalMobileSlider.appendChild(seg);
  }
}

function setCardModalSlide(index) {
  if (!cardModalMainImage || !cardModalGallery.length) return;
  cardModalIndex = Math.max(0, Math.min(index, cardModalGallery.length - 1));
  cardModalMainImage.src = cardModalGallery[cardModalIndex];
  if (cardModalCounter) {
    cardModalCounter.textContent = `${cardModalIndex + 1} из ${cardModalGallery.length}`;
  }
  if (cardModalThumbnails) {
    cardModalThumbnails.querySelectorAll(".card-modal__thumb-btn").forEach((b, i) => {
      b.classList.toggle("is-active", i === cardModalIndex);
    });
  }
  renderCardModalMobileSlider(cardModalGallery.length, cardModalIndex);
}

function openCardModal(gallery, initialIndex = 0) {
  if (!lightbox || !cardModalMainImage || !cardModalThumbnails || !gallery.length) return;
  cardModalGallery = gallery.slice();
  cardModalThumbnails.innerHTML = "";
  cardModalGallery.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-modal__thumb-btn" + (i === initialIndex ? " is-active" : "");
    btn.setAttribute("data-index", String(i));
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Фото " + (i + 1);
    btn.appendChild(img);
    btn.addEventListener("click", () => setCardModalSlide(i));
    cardModalThumbnails.appendChild(btn);
  });
  setCardModalSlide(initialIndex);
  lightbox.setAttribute("aria-hidden", "false");
  lightbox.classList.add("lightbox--open");
}

markImages.forEach((imageEl) => {
  const slidesAttr = imageEl.getAttribute("data-slides");
  const slides = slidesAttr ? slidesAttr.split(",").map((s) => s.trim()) : [];
  if (!slides.length) return;

  const galleryAttr = imageEl.getAttribute("data-gallery");
  const galleryFromAttr = galleryAttr ? galleryAttr.split(",").map((s) => s.trim()) : [];
  const hoverSlides = galleryFromAttr.length ? [slides[0], ...galleryFromAttr] : slides;
  const zones = hoverSlides.length;
  imageEl.classList.toggle("card__image--has-gallery", zones > 1);

  const SLIDER_WIDTH = 260;
  const SLIDER_PADDING = 4;
  const SLIDER_GAP = 3;
  const contentWidth = SLIDER_WIDTH - SLIDER_PADDING * 2;
  const segmentWidth = (contentWidth - (zones - 1) * SLIDER_GAP) / zones;

  const sliderEl = imageEl.querySelector(".mark-slider");
  if (sliderEl) {
    sliderEl.innerHTML = "";
    sliderEl.style.width = SLIDER_WIDTH + "px";
    const segments = [];
    for (let i = 0; i < zones; i++) {
      const seg = document.createElement("div");
      seg.className = "mark-slider__segment" + (i === 0 ? " mark-slider__segment--active" : "");
      seg.style.width = segmentWidth + "px";
      sliderEl.appendChild(seg);
      segments.push(seg);
    }
    const setActiveSegment = (activeIndex) => {
      segments.forEach((s, i) => s.classList.toggle("mark-slider__segment--active", i === activeIndex));
    };
    imageEl._markSliderSetActive = setActiveSegment;
  }
  imageEl.style.backgroundImage = `url("${hoverSlides[0]}")`;
  imageEl.dataset.currentIndex = "0";

  imageEl.addEventListener("mousemove", (e) => {
    const rect = imageEl.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const index = Math.min(
      zones - 1,
      Math.max(0, Math.floor(relativeX * zones))
    );
    if (String(index) === imageEl.dataset.currentIndex) return;
    imageEl.dataset.currentIndex = String(index);
    imageEl.style.backgroundImage = `url("${hoverSlides[index]}")`;
    if (imageEl._markSliderSetActive) imageEl._markSliderSetActive(index);
  });

  imageEl.addEventListener("mouseleave", () => {
    imageEl.dataset.currentIndex = "0";
    imageEl.style.backgroundImage = `url("${hoverSlides[0]}")`;
    if (imageEl._markSliderSetActive) imageEl._markSliderSetActive(0);
  });

  imageEl.addEventListener("click", (e) => {
    e.preventDefault();
    const galleryAttr = imageEl.getAttribute("data-gallery");
    const galleryFromAttr = galleryAttr ? galleryAttr.split(",").map((s) => s.trim()) : [];
    const gallery = slides.length ? [slides[0], ...galleryFromAttr] : galleryFromAttr;
    if (!gallery.length) return;
    openCardModal(gallery, 0);
  });
});

function closeCardModal() {
  if (lightbox) {
    lightbox.classList.remove("lightbox--open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  cardModalGallery = [];
  cardModalIndex = 0;
  if (cardModalThumbnails) cardModalThumbnails.innerHTML = "";
  if (cardModalMobileSlider) cardModalMobileSlider.innerHTML = "";
  if (cardModalCounter) cardModalCounter.textContent = "";
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target.classList.contains("lightbox__backdrop")) {
      closeCardModal();
      return;
    }
    if (isMobileView() && cardModalMain && !e.target.closest(".card-modal__main") && !e.target.closest(".card-modal__close")) {
      closeCardModal();
    }
  });
}
if (cardModalClose) {
  cardModalClose.addEventListener("click", closeCardModal);
}

if (cardModalMainImage) {
  cardModalMainImage.addEventListener("touchstart", (e) => {
    if (!cardModalGallery.length) return;
    cardModalTouchStartX = e.touches[0]?.clientX ?? null;
  }, { passive: true });

  cardModalMainImage.addEventListener("touchend", (e) => {
    if (cardModalTouchStartX === null || cardModalGallery.length <= 1) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? cardModalTouchStartX;
    const deltaX = touchEndX - cardModalTouchStartX;
    cardModalTouchStartX = null;
    const SWIPE_THRESHOLD = 30;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (deltaX < 0) {
      setCardModalSlide(cardModalIndex + 1);
    } else {
      setCardModalSlide(cardModalIndex - 1);
    }
  }, { passive: true });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox?.classList.contains("lightbox--open")) closeCardModal();
});

const makerToBrands = {
  "great-wall": ["Haval", "Tank"],
  nissan: ["350Z", "Almera", "240SX"],
  mazda: ["CX-5", "CX-7"],
  toyota: ["Camry", "Corolla", "LC 200", "LC 300"],
};

const makerOptions = [
  { value: "honda", label: "Honda" },
  { value: "great-wall", label: "Great Wall Motor" },
  { value: "nissan", label: "Nissan" },
  { value: "mazda", label: "Mazda" },
  { value: "mitsubishi", label: "Mitsubishi" },
  { value: "subaru", label: "Subaru" },
  { value: "toyota", label: "Toyota" },
  { value: "lexus", label: "Lexus" },
];

const marksFilterBtn = document.getElementById("marksFilterBtn");
const filterPanelOverlay = document.getElementById("filterPanelOverlay");
const filterPanelClose = document.getElementById("filterPanelClose");
const filterPanelMaker = document.getElementById("filterPanelMaker");
const filterPanelBrand = document.getElementById("filterPanelBrand");
const filterPanelShow = document.getElementById("filterPanelShow");
const filterPanelReset = document.getElementById("filterPanelReset");
const filterPanelContent = document.querySelector(".filter-panel__content");
const mainFilterText = document.querySelector('.filter-dropdown[data-filter="maker-brand"] .filter-dropdown__text');
const combinedDropdown = document.querySelector('.filter-dropdown[data-filter="maker-brand"]');
const marksFilterMakerPc = document.getElementById("marksFilterMakerPc");
const marksFilterBrandPc = document.getElementById("marksFilterBrandPc");
const marksMakerListPc = document.getElementById("marksMakerListPc");
const marksBrandListPc = document.getElementById("marksBrandListPc");
const makerPcDropdown = document.querySelector('.filter-dropdown[data-filter="maker-pc"]');
const brandPcDropdown = document.querySelector('.filter-dropdown[data-filter="brand-pc"]');
const marksCards = document.querySelector(".cards--marks");
const marksShowAllWrapper = document.getElementById("marksShowAllWrapper");
const marksShowAllLink = document.getElementById("marksShowAllLink");

let selectedMaker = null;
let selectedBrand = null;

function getMakerLabel(value) {
  return makerOptions.find((o) => o.value === value)?.label || value;
}

function openFilterPanel() {
  if (filterPanelOverlay) {
    filterPanelOverlay.classList.add("is-open");
    filterPanelOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeFilterPanel() {
  if (filterPanelOverlay) {
    filterPanelOverlay.classList.remove("is-open");
    filterPanelOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (filterPanelContent) filterPanelContent.innerHTML = "";
}

function renderPanelFields() {
  if (filterPanelMaker) {
    filterPanelMaker.querySelector(".filter-panel__field-text").textContent = selectedMaker ? getMakerLabel(selectedMaker) : "Производитель";
    filterPanelMaker.classList.toggle("filter-panel__field--selected", !!selectedMaker);
  }
  if (filterPanelBrand) {
    filterPanelBrand.querySelector(".filter-panel__field-text").textContent = selectedBrand || "Марка";
    filterPanelBrand.disabled = !selectedMaker || !makerToBrands[selectedMaker];
    filterPanelBrand.classList.toggle("filter-panel__field--selected", !!selectedBrand);
  }
  if (mainFilterText) {
    if (!selectedMaker) mainFilterText.textContent = "Производитель и марка";
    else if (!selectedBrand) mainFilterText.textContent = getMakerLabel(selectedMaker);
    else mainFilterText.textContent = `${getMakerLabel(selectedMaker)} — ${selectedBrand}`;
  }
  if (combinedDropdown) {
    combinedDropdown.classList.toggle("filter-dropdown--selected", !!selectedMaker || !!selectedBrand);
  }
  if (filterPanelShow) {
    filterPanelShow.classList.toggle("filter-panel__btn--active", !!selectedMaker);
  }
  if (marksFilterMakerPc) {
    const t = marksFilterMakerPc.querySelector(".filter-dropdown__text");
    if (t) t.textContent = selectedMaker ? getMakerLabel(selectedMaker) : "Производитель";
    if (makerPcDropdown) makerPcDropdown.classList.toggle("filter-dropdown--selected", !!selectedMaker);
  }
  if (marksFilterBrandPc) {
    const t = marksFilterBrandPc.querySelector(".filter-dropdown__text");
    if (t) t.textContent = selectedBrand || "Марка";
    marksFilterBrandPc.disabled = !selectedMaker || !makerToBrands[selectedMaker];
    if (brandPcDropdown) brandPcDropdown.classList.toggle("filter-dropdown--selected", !!selectedBrand);
  }
}

function showMakersInContent() {
  if (!filterPanelContent) return;
  filterPanelContent.innerHTML = "";
  const list = document.createElement("div");
  list.className = "filter-panel__content-list";
  makerOptions.forEach((m) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = m.label;
    btn.addEventListener("click", () => {
      selectedMaker = m.value;
      selectedBrand = null;
      if (makerToBrands[m.value]) {
        showBrandsInContent();
        renderPanelFields();
      } else {
        filterPanelContent.innerHTML = "";
        renderPanelFields();
      }
    });
    list.appendChild(btn);
  });
  filterPanelContent.appendChild(list);
}

function showBrandsInContent() {
  if (!filterPanelContent || !selectedMaker || !makerToBrands[selectedMaker]) return;
  filterPanelContent.innerHTML = "";
  const list = document.createElement("div");
  list.className = "filter-panel__content-list";
  makerToBrands[selectedMaker].forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    btn.addEventListener("click", () => {
      selectedBrand = name;
      filterPanelContent.innerHTML = "";
      renderPanelFields();
    });
    list.appendChild(btn);
  });
  filterPanelContent.appendChild(list);
}

function closePcDropdowns() {
  if (makerPcDropdown) makerPcDropdown.classList.remove("filter-dropdown--open");
  if (brandPcDropdown) brandPcDropdown.classList.remove("filter-dropdown--open");
}

function openMakerDropdownPc() {
  if (isMobileView() || !marksMakerListPc || !makerPcDropdown) return;
  if (brandPcDropdown) brandPcDropdown.classList.remove("filter-dropdown--open");
  const isOpen = makerPcDropdown.classList.toggle("filter-dropdown--open");
  if (isOpen) {
    marksMakerListPc.innerHTML = "";
    makerOptions.forEach((m) => {
      const opt = document.createElement("button");
      opt.type = "button";
      opt.className = "filter-dropdown__option";
      opt.textContent = m.label;
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedMaker = m.value;
        selectedBrand = null;
        closePcDropdowns();
        renderPanelFields();
        if (typeof updateMarksByMaker === "function") updateMarksByMaker();
      });
      marksMakerListPc.appendChild(opt);
    });
  }
}

function openBrandDropdownPc() {
  if (isMobileView() || !marksBrandListPc || !brandPcDropdown || !selectedMaker || !makerToBrands[selectedMaker]) return;
  if (makerPcDropdown) makerPcDropdown.classList.remove("filter-dropdown--open");
  const isOpen = brandPcDropdown.classList.toggle("filter-dropdown--open");
  if (isOpen) {
    marksBrandListPc.innerHTML = "";
    makerToBrands[selectedMaker].forEach((name) => {
      const opt = document.createElement("button");
      opt.type = "button";
      opt.className = "filter-dropdown__option";
      opt.textContent = name;
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedBrand = name;
        closePcDropdowns();
        renderPanelFields();
        if (typeof updateMarksByMaker === "function") updateMarksByMaker();
      });
      marksBrandListPc.appendChild(opt);
    });
  }
}

if (marksFilterBtn) {
  marksFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    renderPanelFields();
    openFilterPanel();
  });
}

if (marksFilterMakerPc) {
  marksFilterMakerPc.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isMobileView()) openMakerDropdownPc();
  });
}
if (marksFilterBrandPc) {
  marksFilterBrandPc.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isMobileView() && !marksFilterBrandPc.disabled) openBrandDropdownPc();
  });
}
document.addEventListener("click", () => {
  if (!isMobileView()) closePcDropdowns();
});

if (filterPanelClose) {
  filterPanelClose.addEventListener("click", closeFilterPanel);
}

if (filterPanelOverlay) {
  filterPanelOverlay.addEventListener("click", (e) => {
    if (e.target === filterPanelOverlay) closeFilterPanel();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (brandPickerOverlay?.classList.contains("is-open")) closeBrandPicker();
  else if (makerPickerOverlay?.classList.contains("is-open")) closeMakerPicker();
  else if (filterPanelOverlay?.classList.contains("is-open")) closeFilterPanel();
});

const makerPickerOverlay = document.getElementById("makerPickerOverlay");
const makerPickerBack = document.getElementById("makerPickerBack");
const makerPickerList = document.getElementById("makerPickerList");
const makerPickerApply = document.getElementById("makerPickerApply");

function isMobileView() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function openMakerPicker() {
  if (!makerPickerOverlay || !makerPickerList) return;
  pendingMaker = selectedMaker;
  makerPickerList.innerHTML = "";
  makerOptions.forEach((m) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "maker-picker__item" + (selectedMaker === m.value ? " is-selected" : "");
    btn.textContent = m.label;
    btn.addEventListener("click", () => selectMakerInPicker(m.value, btn));
    makerPickerList.appendChild(btn);
  });
  if (makerPickerApply) makerPickerApply.classList.toggle("maker-picker__apply--active", !!pendingMaker);
  makerPickerOverlay.classList.add("is-open");
  makerPickerOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

let pendingMaker = null;

function selectMakerInPicker(value, clickedBtn) {
  pendingMaker = value;
  makerPickerList.querySelectorAll(".maker-picker__item").forEach((el) => el.classList.remove("is-selected"));
  if (clickedBtn) clickedBtn.classList.add("is-selected");
  if (makerPickerApply) makerPickerApply.classList.toggle("maker-picker__apply--active", value != null);
}

function closeMakerPicker() {
  if (makerPickerOverlay) {
    makerPickerOverlay.classList.remove("is-open");
    makerPickerOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = filterPanelOverlay?.classList.contains("is-open") ? "hidden" : "";
  }
  pendingMaker = null;
}

if (makerPickerOverlay) {
  makerPickerOverlay.addEventListener("click", (e) => {
    if (e.target === makerPickerOverlay) closeMakerPicker();
  });
}

if (makerPickerBack) {
  makerPickerBack.addEventListener("click", closeMakerPicker);
}

if (makerPickerApply) {
  makerPickerApply.addEventListener("click", () => {
    selectedMaker = pendingMaker;
    selectedBrand = null;
    if (selectedMaker && makerToBrands[selectedMaker]) {
      if (filterPanelBrand) filterPanelBrand.disabled = false;
    }
    renderPanelFields();
    if (filterPanelContent) filterPanelContent.innerHTML = "";
    closeMakerPicker();
  });
}

const brandPickerOverlay = document.getElementById("brandPickerOverlay");
const brandPickerBack = document.getElementById("brandPickerBack");
const brandPickerList = document.getElementById("brandPickerList");
const brandPickerApply = document.getElementById("brandPickerApply");

let pendingBrand = null;

function openBrandPicker() {
  if (!brandPickerOverlay || !brandPickerList || !selectedMaker || !makerToBrands[selectedMaker]) return;
  pendingBrand = selectedBrand;
  brandPickerList.innerHTML = "";
  const brands = makerToBrands[selectedMaker];
  brands.forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "maker-picker__item" + (selectedBrand === name ? " is-selected" : "");
    btn.textContent = name;
    btn.addEventListener("click", () => selectBrandInPicker(name, btn));
    brandPickerList.appendChild(btn);
  });
  if (brandPickerApply) brandPickerApply.classList.toggle("brand-picker__apply--active", pendingBrand !== null && pendingBrand !== undefined);
  brandPickerOverlay.classList.add("is-open");
  brandPickerOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function selectBrandInPicker(value, clickedBtn) {
  pendingBrand = value;
  brandPickerList.querySelectorAll(".maker-picker__item").forEach((el) => el.classList.remove("is-selected"));
  if (clickedBtn) clickedBtn.classList.add("is-selected");
  if (brandPickerApply) brandPickerApply.classList.toggle("brand-picker__apply--active", value !== null && value !== undefined);
}

function closeBrandPicker() {
  if (brandPickerOverlay) {
    brandPickerOverlay.classList.remove("is-open");
    brandPickerOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow =
      makerPickerOverlay?.classList.contains("is-open") || filterPanelOverlay?.classList.contains("is-open")
        ? "hidden"
        : "";
  }
  pendingBrand = null;
}

if (brandPickerOverlay) {
  brandPickerOverlay.addEventListener("click", (e) => {
    if (e.target === brandPickerOverlay) closeBrandPicker();
  });
}

if (brandPickerBack) {
  brandPickerBack.addEventListener("click", closeBrandPicker);
}

if (brandPickerApply) {
  brandPickerApply.addEventListener("click", () => {
    selectedBrand = pendingBrand;
    renderPanelFields();
    if (filterPanelContent) filterPanelContent.innerHTML = "";
    closeBrandPicker();
  });
}

if (filterPanelMaker) {
  filterPanelMaker.addEventListener("click", () => {
    if (isMobileView() && makerPickerOverlay) {
      openMakerPicker();
    } else {
      showMakersInContent();
    }
  });
}

if (filterPanelBrand) {
  filterPanelBrand.addEventListener("click", () => {
    if (filterPanelBrand.disabled || !selectedMaker || !makerToBrands[selectedMaker]) return;
    if (isMobileView() && brandPickerOverlay) {
      openBrandPicker();
    } else {
      showBrandsInContent();
    }
  });
}

if (filterPanelShow) {
  filterPanelShow.addEventListener("click", () => {
    if (typeof updateMarksByMaker === "function") updateMarksByMaker();
    renderPanelFields();
    closeFilterPanel();
  });
}

if (filterPanelReset) {
  filterPanelReset.addEventListener("click", () => {
    selectedMaker = null;
    selectedBrand = null;
    renderPanelFields();
    if (typeof updateMarksByMaker === "function") updateMarksByMaker();
    closeFilterPanel();
  });
}

function getSelectedMakerValue() {
  return selectedMaker;
}

function getSelectedBrandValue() {
  if (!selectedMaker || !makerToBrands[selectedMaker]) return null;
  return selectedBrand ? selectedBrand.toLowerCase().replace(/\s+/g, "-") : null;
}

function updateMarksByMaker(selectedMakerValue) {
  if (!marksCards) return;
  const cards = Array.from(marksCards.querySelectorAll(".card--mark"));
  const makerValue =
    selectedMakerValue !== undefined && selectedMakerValue !== null
      ? String(selectedMakerValue).trim()
      : getSelectedMakerValue();
  const brandValue = getSelectedBrandValue();

  let visible = makerValue
    ? cards.filter((c) => String(c.getAttribute("data-maker") || "").trim() === makerValue)
    : cards.slice();

  if (brandValue && makerValue && makerToBrands[makerValue]) {
    visible = visible.filter((c) => String(c.getAttribute("data-brand") || "").trim() === brandValue);
  }

  visible.sort((a, b) => {
    const pa = parseInt(a.getAttribute("data-popularity") || "0", 10);
    const pb = parseInt(b.getAttribute("data-popularity") || "0", 10);
    return pa - pb;
  });

  const hidden = cards.filter((c) => !visible.includes(c));
  visible.forEach((c) => {
    c.classList.remove("card--mark--hidden");
    c.classList.remove("card--mark--overflow");
    c.style.display = "";
  });
  hidden.forEach((c) => {
    c.classList.add("card--mark--hidden");
    c.style.display = "none";
  });

  visible.forEach((c, i) => {
    if (i >= 8) c.classList.add("card--mark--overflow");
  });

  const fragment = document.createDocumentFragment();
  visible.forEach((c) => fragment.appendChild(c));
  hidden.forEach((c) => fragment.appendChild(c));
  marksCards.appendChild(fragment);

  if (marksShowAllWrapper && marksShowAllLink) {
    if (visible.length > 8) {
      marksShowAllWrapper.hidden = false;
      marksShowAllWrapper.classList.add("is-visible");
      if (!makerValue && window.innerWidth <= 768) {
        marksCards.classList.add("cards--marks--collapsed");
      }
    } else {
      marksShowAllWrapper.hidden = true;
      marksShowAllWrapper.classList.remove("is-visible");
      marksCards.classList.remove("cards--marks--collapsed");
      marksShowAllLink.textContent = "Показать все";
    }
  }
}

if (marksCards) {
  updateMarksByMaker();
}

if (marksCards && marksShowAllWrapper && marksShowAllLink) {
  marksShowAllLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isCollapsed = marksCards.classList.contains("cards--marks--collapsed");
    const visibleCards = marksCards.querySelectorAll(".card--mark:not(.card--mark--hidden)");
    if (visibleCards.length <= 8) return;
    if (isCollapsed) {
      marksCards.classList.remove("cards--marks--collapsed");
      visibleCards.forEach((c, i) => {
        if (i >= 8) c.classList.remove("card--mark--overflow");
      });
      marksShowAllLink.textContent = "Свернуть";
    } else {
      marksCards.classList.add("cards--marks--collapsed");
      visibleCards.forEach((c, i) => {
        if (i >= 8) c.classList.add("card--mark--overflow");
      });
      marksShowAllLink.textContent = "Показать все";
    }
  });
}

