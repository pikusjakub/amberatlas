(() => {
  "use strict";

  const CONFIG = {
    systemCostPerKwpMAD: 9500,
    squareMetersPerKwp: 5.5,
    directSelfConsumptionFactor: 0.90,
    co2KgPerKwh: 0.60,
    minSystemKwp: 10,
    maxSystemKwp: 2000,
    fallbackYield: {
      agadir: 1800,
      marrakech: 1810,
      casablanca: 1660,
      rabat: 1650,
      fes: 1710,
      tanger: 1510,
      ouarzazate: 1920
    }
  };

  const CITIES = {
    agadir: { lat: 30.4278, lon: -9.5981 },
    marrakech: { lat: 31.6295, lon: -7.9811 },
    casablanca: { lat: 33.5731, lon: -7.5898 },
    rabat: { lat: 34.0209, lon: -6.8416 },
    fes: { lat: 34.0331, lon: -5.0003 },
    tanger: { lat: 35.7595, lon: -5.8340 },
    ouarzazate: { lat: 30.9335, lon: -6.9370 }
  };

  const SECTOR_DAY_SHARE = {
    hotel: 55,
    manufacturing: 80,
    agriculture: 85,
    logistics: 70,
    commercial: 75,
    clinic: 65,
    other: 65
  };

  const I18N = {
    fr: {
      eyebrow: "Pré-estimation gratuite pour les entreprises au Maroc",
      heroTitle: "Combien votre entreprise peut-elle économiser grâce au solaire ?",
      heroText: "Obtenez en moins d’une minute une première estimation de la puissance, de la production annuelle, des économies et du temps de retour.",
      point1: "Résultat immédiat",
      point2: "Données solaires PVGIS",
      point3: "Sans engagement",
      step1: "Étape 1",
      calculatorTitle: "Décrivez votre consommation",
      calculatorIntro: "Les valeurs peuvent être modifiées. Le calcul reste une pré-estimation et ne remplace pas un audit énergétique.",
      cityLabel: "Ville / région",
      sectorLabel: "Type d’activité",
      billLabel: "Facture mensuelle moyenne",
      tariffLabel: "Prix moyen de l’électricité",
      tariffHelp: "Utilisez votre facture si le tarif réel est connu.",
      roofLabel: "Surface exploitable du toit ou du terrain",
      roofHelp: "Laissez 0 si la surface n’est pas connue.",
      outageLabel: "Coupures ou besoin d’alimentation de secours ?",
      dayShareLabel: "Part de la consommation entre 8h et 18h",
      dayShareHelp: "Plus la consommation est diurne, plus l’autoconsommation solaire est avantageuse.",
      calculateButton: "Calculer mon potentiel solaire",
      placeholderTitle: "Votre estimation apparaîtra ici",
      placeholderText: "Renseignez les informations à gauche, puis lancez le calcul.",
      step2: "Étape 2",
      resultsTitle: "Votre potentiel solaire estimé",
      capacityResult: "Puissance recommandée",
      productionResult: "Production annuelle",
      savingsResult: "Économies annuelles",
      paybackResult: "Retour simple estimé",
      roofResult: "Surface nécessaire",
      co2Result: "CO₂ évité par an",
      disclaimer: "Pré-estimation non contractuelle, hors TVA, financement, renforcement éventuel de toiture et travaux de raccordement. Les économies sont calculées sur l’autoconsommation, sans revenu de vente d’un éventuel surplus au réseau.",
      leadTitle: "Recevez une analyse personnalisée",
      leadText: "Laissez vos coordonnées. Un expert Amber Atlas vérifiera votre facture, votre profil de consommation et la surface disponible.",
      nameLabel: "Nom et prénom",
      companyLabel: "Entreprise",
      emailLabel: "E-mail",
      phoneLabel: "Téléphone",
      consentText: "J’accepte d’être contacté par Amber Atlas au sujet de cette estimation et d’un éventuel audit énergétique.",
      sendButton: "Demander mon audit gratuit",
      trustEyebrow: "Pourquoi Amber Atlas",
      trustTitle: "Un partenaire unique, de l’analyse au service après-vente",
      trust1: "années d’expérience sur les marchés européens",
      trust2: "de projets auxquels notre expertise technique a contribué",
      trust3: "audit, ingénierie, solaire, stockage, monitoring et maintenance",
      backHome: "Retour au site principal",
      years: "ans",
      sourcePvgis: "Production calculée à partir de PVGIS 5.3.",
      sourceFallback: "Production calculée avec une hypothèse locale de secours — PVGIS était temporairement indisponible.",
      roofLimited: "La puissance est limitée par la surface disponible. Un audit peut identifier des zones supplémentaires, une ombrière ou une installation au sol.",
      batteryRecommended: "Une étude de stockage est recommandée en raison des coupures ou du besoin d’alimentation de secours.",
      batteryOptional: "La priorité est une installation dimensionnée pour l’autoconsommation. Le stockage peut être étudié séparément selon le profil horaire.",
      calculationError: "Vérifiez les valeurs saisies. La facture et le tarif doivent être supérieurs à zéro.",
      sending: "Envoi en cours…",
      leadSuccess: "Merci. Votre demande a été enregistrée. L’équipe Amber Atlas vous contactera.",
      leadError: "La demande n’a pas pu être envoyée. Vérifiez la connexion et réessayez.",
      submitLoading: "Calcul en cours…"
    },
    en: {
      eyebrow: "Free pre-assessment for businesses in Morocco",
      heroTitle: "How much could your business save with solar energy?",
      heroText: "Get an initial estimate of system size, annual production, savings and payback in under one minute.",
      point1: "Instant result",
      point2: "PVGIS solar data",
      point3: "No obligation",
      step1: "Step 1",
      calculatorTitle: "Describe your energy use",
      calculatorIntro: "You can adjust all values. This is a preliminary estimate and does not replace an energy audit.",
      cityLabel: "City / region",
      sectorLabel: "Business activity",
      billLabel: "Average monthly bill",
      tariffLabel: "Average electricity price",
      tariffHelp: "Use the actual rate from your bill when available.",
      roofLabel: "Usable roof or land area",
      roofHelp: "Enter 0 if the area is unknown.",
      outageLabel: "Power outages or backup power requirement?",
      dayShareLabel: "Share of consumption between 8 a.m. and 6 p.m.",
      dayShareHelp: "The more energy is used during daylight hours, the stronger the self-consumption case.",
      calculateButton: "Calculate my solar potential",
      placeholderTitle: "Your estimate will appear here",
      placeholderText: "Complete the information on the left and start the calculation.",
      step2: "Step 2",
      resultsTitle: "Your estimated solar potential",
      capacityResult: "Recommended capacity",
      productionResult: "Annual production",
      savingsResult: "Annual savings",
      paybackResult: "Estimated simple payback",
      roofResult: "Required area",
      co2Result: "CO₂ avoided per year",
      disclaimer: "Non-binding preliminary estimate, excluding VAT, financing, possible roof reinforcement and grid connection works. Savings are based on self-consumption and exclude revenue from exporting any surplus to the grid.",
      leadTitle: "Receive a personalised assessment",
      leadText: "Leave your details. An Amber Atlas expert will review your bill, consumption profile and available area.",
      nameLabel: "Full name",
      companyLabel: "Company",
      emailLabel: "Email",
      phoneLabel: "Phone",
      consentText: "I agree to be contacted by Amber Atlas about this estimate and a potential energy audit.",
      sendButton: "Request my free audit",
      trustEyebrow: "Why Amber Atlas",
      trustTitle: "One partner from assessment through after-sales service",
      trust1: "years of experience in European markets",
      trust2: "of projects supported by our technical expertise",
      trust3: "audit, engineering, solar, storage, monitoring and maintenance",
      backHome: "Back to the main website",
      years: "years",
      sourcePvgis: "Production calculated using PVGIS 5.3.",
      sourceFallback: "Production calculated with a local backup assumption — PVGIS was temporarily unavailable.",
      roofLimited: "Capacity is limited by the available area. An audit may identify additional roof zones, a solar carport or a ground-mounted option.",
      batteryRecommended: "A battery storage study is recommended due to outages or backup power requirements.",
      batteryOptional: "The priority is a system sized for self-consumption. Storage can be assessed separately using the hourly load profile.",
      calculationError: "Check the entered values. The bill and electricity rate must be greater than zero.",
      sending: "Sending…",
      leadSuccess: "Thank you. Your request has been recorded. The Amber Atlas team will contact you.",
      leadError: "The request could not be sent. Check your connection and try again.",
      submitLoading: "Calculating…"
    }
  };

  let currentLanguage = localStorage.getItem("amberAtlasCalculatorLanguage") || "fr";
  let latestResult = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const calculatorForm = $("#calculator-form");
  const leadForm = $("#lead-form");
  const dayShare = $("#day-share");
  const dayShareOutput = $("#day-share-output");
  const calculateButton = calculatorForm.querySelector("button[type='submit']");

  function t(key) {
    return I18N[currentLanguage][key] || key;
  }

  function setLanguage(language) {
    currentLanguage = language === "en" ? "en" : "fr";
    localStorage.setItem("amberAtlasCalculatorLanguage", currentLanguage);
    document.documentElement.lang = currentLanguage;
    document.title = currentLanguage === "fr"
      ? "Calculateur solaire B2B | Amber Atlas"
      : "B2B solar calculator | Amber Atlas";

    $$('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (I18N[currentLanguage][key]) element.textContent = I18N[currentLanguage][key];
    });

    $$('option[data-fr][data-en]').forEach((option) => {
      option.textContent = option.dataset[currentLanguage];
    });

    $$(".lang-button").forEach((button) => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    $("#lead-language").value = currentLanguage;
    if (latestResult) renderResult(latestResult);
  }

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat(currentLanguage === "fr" ? "fr-MA" : "en-US", {
      maximumFractionDigits
    }).format(value);
  }

  function formatMAD(value) {
    return new Intl.NumberFormat(currentLanguage === "fr" ? "fr-MA" : "en-US", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 0
    }).format(value);
  }

  function roundCapacity(value) {
    if (!Number.isFinite(value)) return CONFIG.minSystemKwp;
    const rounded = Math.round(value / 5) * 5;
    return Math.min(CONFIG.maxSystemKwp, Math.max(CONFIG.minSystemKwp, rounded));
  }

  async function getAnnualYield(cityKey) {
    const location = CITIES[cityKey];
    const fallback = CONFIG.fallbackYield[cityKey];
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`/api/pvgis?lat=${encodeURIComponent(location.lat)}&lon=${encodeURIComponent(location.lon)}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`PVGIS proxy returned ${response.status}`);
      const data = await response.json();
      const annualYield = Number(data.annualYield);
      if (!Number.isFinite(annualYield) || annualYield < 800 || annualYield > 2600) {
        throw new Error("Unexpected PVGIS result");
      }
      return { annualYield, source: "pvgis" };
    } catch (error) {
      console.warn("PVGIS unavailable, using fallback:", error);
      return { annualYield: fallback, source: "fallback" };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function validateInputs(values) {
    return values.monthlyBill > 0 && values.tariff > 0 && values.dayShare >= 20 && values.dayShare <= 100;
  }

  async function calculate(event) {
    event.preventDefault();
    const formError = $("#form-error");
    formError.hidden = true;

    const values = {
      city: $("#city").value,
      sector: $("#sector").value,
      monthlyBill: Number($("#monthly-bill").value),
      tariff: Number($("#tariff").value),
      roofArea: Math.max(0, Number($("#roof-area").value || 0)),
      outages: $("#outages").value,
      dayShare: Number(dayShare.value)
    };

    if (!validateInputs(values)) {
      formError.textContent = t("calculationError");
      formError.hidden = false;
      return;
    }

    calculateButton.disabled = true;
    const originalButtonText = calculateButton.textContent;
    calculateButton.textContent = t("submitLoading");
    $("#results").setAttribute("aria-busy", "true");

    try {
      const yieldData = await getAnnualYield(values.city);
      const annualConsumption = (values.monthlyBill / values.tariff) * 12;
      const targetDaytimeEnergy = annualConsumption * (values.dayShare / 100);
      const unconstrainedCapacity = (targetDaytimeEnergy * CONFIG.directSelfConsumptionFactor) / yieldData.annualYield;
      const roofCapacity = values.roofArea > 0 ? values.roofArea / CONFIG.squareMetersPerKwp : CONFIG.maxSystemKwp;
      const roofLimited = values.roofArea > 0 && roofCapacity < unconstrainedCapacity;
      const capacity = roundCapacity(Math.min(unconstrainedCapacity, roofCapacity));
      const production = capacity * yieldData.annualYield;
      const selfConsumed = Math.min(production * CONFIG.directSelfConsumptionFactor, targetDaytimeEnergy);
      const annualSavings = selfConsumed * values.tariff;
      const investment = capacity * CONFIG.systemCostPerKwpMAD;
      const payback = annualSavings > 0 ? investment / annualSavings : 0;
      const requiredRoof = capacity * CONFIG.squareMetersPerKwp;
      const co2Tons = (selfConsumed * CONFIG.co2KgPerKwh) / 1000;

      latestResult = {
        ...values,
        annualYield: yieldData.annualYield,
        source: yieldData.source,
        annualConsumption,
        capacity,
        production,
        selfConsumed,
        annualSavings,
        payback,
        requiredRoof,
        co2Tons,
        roofLimited
      };

      renderResult(latestResult);
      $("#results-placeholder").hidden = true;
      $("#results-content").hidden = false;
      if (window.innerWidth < 981) $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      calculateButton.disabled = false;
      calculateButton.textContent = originalButtonText;
      $("#results").setAttribute("aria-busy", "false");
    }
  }

  function renderResult(result) {
    $("#result-capacity").textContent = `${formatNumber(result.capacity)} kWp`;
    $("#result-production").textContent = `${formatNumber(result.production / 1000, 1)} MWh`;
    $("#result-savings").textContent = formatMAD(result.annualSavings);
    $("#result-payback").textContent = `${formatNumber(result.payback, 1)} ${t("years")}`;
    $("#result-roof").textContent = `${formatNumber(result.requiredRoof)} m²`;
    $("#result-co2").textContent = `${formatNumber(result.co2Tons, 1)} t`;
    $("#data-source-label").textContent = result.source === "pvgis" ? t("sourcePvgis") : t("sourceFallback");

    const messages = [];
    if (result.roofLimited) messages.push(t("roofLimited"));
    messages.push(result.outages === "yes" ? t("batteryRecommended") : t("batteryOptional"));
    $("#recommendation").textContent = messages.join(" ");

    $("#lead-city").value = result.city;
    $("#lead-sector").value = result.sector;
    $("#lead-capacity").value = result.capacity.toFixed(0);
    $("#lead-production").value = result.production.toFixed(0);
    $("#lead-savings").value = result.annualSavings.toFixed(0);
    $("#lead-payback").value = result.payback.toFixed(1);
  }

  async function submitLead(event) {
    event.preventDefault();
    const status = $("#lead-status");
    const button = leadForm.querySelector("button[type='submit']");
    status.className = "lead-status";
    status.textContent = t("sending");
    button.disabled = true;

    try {
      const body = new URLSearchParams(new FormData(leadForm));
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      if (!response.ok) throw new Error(`Form returned ${response.status}`);
      status.classList.add("is-success");
      status.textContent = t("leadSuccess");
      leadForm.reset();
      $("#lead-language").value = currentLanguage;
      if (latestResult) renderResult(latestResult);
    } catch (error) {
      console.error(error);
      status.classList.add("is-error");
      status.textContent = t("leadError");
    } finally {
      button.disabled = false;
    }
  }

  dayShare.addEventListener("input", () => {
    dayShareOutput.textContent = `${dayShare.value}%`;
  });

  $("#sector").addEventListener("change", (event) => {
    const suggested = SECTOR_DAY_SHARE[event.target.value] || 65;
    dayShare.value = String(suggested);
    dayShareOutput.textContent = `${suggested}%`;
  });

  $$(".lang-button").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  calculatorForm.addEventListener("submit", calculate);
  leadForm.addEventListener("submit", submitLead);
  setLanguage(currentLanguage);
})();
