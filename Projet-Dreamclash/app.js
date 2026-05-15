(function () {
  const app = document.querySelector("#app");
  const mainNav = document.querySelector("#main-nav");
  const sideNav = document.querySelector("#side-nav");

  function orderedFeatures() {
    return window.Dreamclash.features.slice().sort((a, b) => a.order - b.order);
  }

  function currentFeatureId() {
    const hash = window.location.hash.replace("#", "");
    return hash || "dashboard";
  }

  function renderNav(activeId) {
    const features = orderedFeatures();
    const buttonMarkup = features.map((feature) => {
      const activeClass = feature.id === activeId ? " is-active" : "";
      return `<button class="nav-button${activeClass}" type="button" data-view="${feature.id}">${feature.shortLabel || feature.label}</button>`;
    }).join("");

    const sideMarkup = features.map((feature) => {
      const activeClass = feature.id === activeId ? " is-active" : "";
      return `<button class="side-link${activeClass}" type="button" data-view="${feature.id}">${feature.label}</button>`;
    }).join("");

    mainNav.innerHTML = buttonMarkup;
    sideNav.innerHTML = sideMarkup;
  }

  function render() {
    const featureId = currentFeatureId();
    const feature = orderedFeatures().find((item) => item.id === featureId) || orderedFeatures()[0];
    renderNav(feature.id);
    app.innerHTML = feature.render(window.Dreamclash.state);
    if (typeof feature.attach === "function") {
      feature.attach(app, window.Dreamclash.state, render);
    }
  }

  document.body.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-view]");
    if (!trigger) {
      return;
    }
    window.location.hash = trigger.dataset.view;
  });

  window.addEventListener("hashchange", render);
  render();
})();
