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

  const MESSAGES = {
    fr: {
      calculating: "Calcul et envoi de votre estimation…",
      sent: "Merci. Votre résultat a été calculé et votre demande a été transmise à Amber Atlas.",
      sendError: "Le résultat ne peut pas être affiché, car l’envoi des données a échoué. Vérifiez la connexion et réessayez.",
      invalid: "Vérifiez les valeurs saisies. La facture, le tarif, l’e-mail et le téléphone sont obligatoires.",
      years: "ans",
      sourcePvgis: "Production calculée à partir des données PVGIS 5.3.",
      sourceFallback: "PVGIS était temporairement indisponible. Une hypothèse locale de secours a été utilisée.",
      roofLimited: "La puissance est limitée par la surface disponible. Un audit peut identifier une ombrière ou une installation au sol.",
      batteryRecommended: "Une étude de stockage est recommandée en raison des coupures ou du besoin d’alimentation de secours.",
      batteryOptional: "La priorité est une installation dimensionnée pour l’autoconsommation. Le stockage peut être étudié selon le profil horaire."
    },
    ar: {
      calculating: "جارٍ حساب التقدير وإرسال البيانات…",
      sent: "شكراً. تم حساب النتيجة وإرسال الطلب إلى Amber Atlas.",
      sendError: "تعذر عرض النتيجة لأن إرسال البيانات لم ينجح. تحقق من الاتصال وحاول مرة أخرى.",
      invalid: "تحقق من البيانات. الفاتورة والسعر والبريد الإلكتروني والهاتف حقول مطلوبة.",
      years: "سنة",
      sourcePvgis: "تم حساب الإنتاج اعتماداً على بيانات PVGIS 5.3.",
      sourceFallback: "تعذر الوصول مؤقتاً إلى PVGIS، لذلك استُخدم افتراض محلي احتياطي.",
      roofLimited: "القدرة محدودة بالمساحة المتاحة. قد يحدد التدقيق إمكانية استخدام مظلة شمسية أو نظام أرضي.",
      batteryRecommended: "يوصى بدراسة نظام تخزين بسبب الانقطاعات أو الحاجة إلى طاقة احتياطية.",
      batteryOptional: "الأولوية لنظام مصمم للاستهلاك الذاتي، ويمكن دراسة التخزين وفق منحنى الاستهلاك."
    },
    en: {
      calculating: "Calculating and sending your estimate…",
      sent: "Thank you. Your result has been calculated and your request was sent to Amber Atlas.",
      sendError: "The result cannot be displayed because the data submission failed. Check your connection and try again.",
      invalid: "Check the entered values. Bill, tariff, email and phone are required.",
      years: "years",
      sourcePvgis: "Production calculated using PVGIS 5.3 data.",
      sourceFallback: "PVGIS was temporarily unavailable. A local fallback assumption was used.",
      roofLimited: "Capacity is limited by the available area. An audit may identify a solar carport or ground-mounted option.",
      batteryRecommended: "A storage study is recommended due to outages or backup-power requirements.",
      batteryOptional: "The priority is a system sized for self-consumption. Storage can be assessed using the hourly load profile."
    },
    pl: {
      calculating: "Obliczanie i wysyłanie kalkulacji…",
      sent: "Dziękujemy. Wynik został obliczony, a zgłoszenie wysłane do Amber Atlas.",
      sendError: "Nie można wyświetlić wyniku, ponieważ wysyłka danych nie powiodła się. Sprawdź połączenie i spróbuj ponownie.",
      invalid: "Sprawdź dane. Rachunek, stawka, e-mail i telefon są wymagane.",
      years: "lat",
      sourcePvgis: "Produkcję obliczono na podstawie danych PVGIS 5.3.",
      sourceFallback: "PVGIS był chwilowo niedostępny. Zastosowano lokalne założenie awaryjne.",
      roofLimited: "Moc jest ograniczona dostępną powierzchnią. Audyt może wskazać możliwość wykonania wiaty lub instalacji gruntowej.",
      batteryRecommended: "Ze względu na przerwy w zasilaniu lub potrzebę rezerwy zalecana jest analiza magazynu energii.",
      batteryOptional: "Priorytetem jest instalacja dobrana do autokonsumpcji. Magazyn można przeanalizować na podstawie godzinowego profilu zużycia."
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const form = $("#solar-calculator-form");
  const language = document.body.dataset.language || document.documentElement.lang || "fr";
  const msg = MESSAGES[language] || MESSAGES.fr;
  const locale = language === "ar" ? "ar-MA" : language === "fr" ? "fr-MA" : language === "pl" ? "pl-PL" : "en-US";

  const dayShare = $("#day-share");
  const dayShareOutput = $("#day-share-output");
  const submitButton = form.querySelector('button[type="submit"]');

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
  }

  function formatMAD(value) {
    return new Intl.NumberFormat(locale, {
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
      const response = await fetch(
        `/api/pvgis?lat=${encodeURIComponent(location.lat)}&lon=${encodeURIComponent(location.lon)}`,
        {
          headers: { Accept: "application/json" },
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error(`PVGIS proxy returned ${response.status}`);
      }

      const data = await response.json();
      const annualYield = Number(data.annualYield);

      if (!Number.isFinite(annualYield) || annualYield < 800 || annualYield > 2600) {
        throw new Error("Unexpected PVGIS result");
      }

      return { annualYield, source: "PVGIS 5.3" };
    } catch (error) {
      console.warn("PVGIS unavailable, using fallback:", error);
      return { annualYield: fallback, source: "local fallback" };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function showStatus(text, type = "") {
    const status = $("#form-status");
    status.hidden = false;
    status.className = `form-status${type ? ` is-${type}` : ""}`;
    status.textContent = text;
  }

  function hideStatus() {
    const status = $("#form-status");
    status.hidden = true;
    status.textContent = "";
    status.className = "form-status";
  }

  function showError(text) {
    const errorBox = $("#form-error");
    errorBox.hidden = false;
    errorBox.textContent = text;
  }

  function hideError() {
    const errorBox = $("#form-error");
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  function collectValues() {
    return {
      city: $("#city").value,
      sector: $("#sector").value,
      monthlyBill: Number($("#monthly-bill").value),
      tariff: Number($("#tariff").value),
      roofArea: Math.max(0, Number($("#roof-area").value || 0)),
      outages: $("#outages").value,
      dayShare: Number(dayShare.value)
    };
  }

  function calculateResult(values, yieldData) {
    const annualConsumption = (values.monthlyBill / values.tariff) * 12;
    const targetDaytimeEnergy = annualConsumption * (values.dayShare / 100);
    const unconstrainedCapacity =
      (targetDaytimeEnergy * CONFIG.directSelfConsumptionFactor) / yieldData.annualYield;
    const roofCapacity =
      values.roofArea > 0
        ? values.roofArea / CONFIG.squareMetersPerKwp
        : CONFIG.maxSystemKwp;
    const roofLimited = values.roofArea > 0 && roofCapacity < unconstrainedCapacity;
    const capacity = roundCapacity(Math.min(unconstrainedCapacity, roofCapacity));
    const production = capacity * yieldData.annualYield;
    const selfConsumed = Math.min(
      production * CONFIG.directSelfConsumptionFactor,
      targetDaytimeEnergy
    );
    const annualSavings = selfConsumed * values.tariff;
    const investment = capacity * CONFIG.systemCostPerKwpMAD;
    const payback = annualSavings > 0 ? investment / annualSavings : 0;
    const requiredArea = capacity * CONFIG.squareMetersPerKwp;
    const co2Tons = (selfConsumed * CONFIG.co2KgPerKwh) / 1000;

    return {
      ...values,
      annualYield: yieldData.annualYield,
      source: yieldData.source,
      annualConsumption,
      capacity,
      production,
      selfConsumed,
      annualSavings,
      payback,
      requiredArea,
      co2Tons,
      roofLimited
    };
  }

  function populateSubmission(result) {
    const citySelect = $("#city");
    const sectorSelect = $("#sector");

    $("#city-label").value = citySelect.options[citySelect.selectedIndex].text;
    $("#sector-label").value = sectorSelect.options[sectorSelect.selectedIndex].text;
    $("#lead-capacity").value = result.capacity.toFixed(0);
    $("#lead-production").value = result.production.toFixed(0);
    $("#lead-savings").value = result.annualSavings.toFixed(0);
    $("#lead-payback").value = result.payback.toFixed(1);
    $("#lead-area").value = result.requiredArea.toFixed(0);
    $("#lead-co2").value = result.co2Tons.toFixed(1);
    $("#lead-yield").value = result.annualYield.toFixed(0);
    $("#lead-source").value = result.source;
    $("#lead-time").value = new Date().toISOString();
    $("#lead-page").value = window.location.href;
  }

  function renderResult(result) {
    $("#result-capacity").textContent = `${formatNumber(result.capacity)} kWp`;
    $("#result-production").textContent = `${formatNumber(result.production / 1000, 1)} MWh`;
    $("#result-savings").textContent = formatMAD(result.annualSavings);
    $("#result-payback").textContent = `${formatNumber(result.payback, 1)} ${msg.years}`;
    $("#result-area").textContent = `${formatNumber(result.requiredArea)} m²`;
    $("#result-co2").textContent = `${formatNumber(result.co2Tons, 1)} t`;

    const recommendations = [];
    if (result.roofLimited) recommendations.push(msg.roofLimited);
    recommendations.push(
      result.outages === "yes" ? msg.batteryRecommended : msg.batteryOptional
    );

    $("#recommendation").textContent = recommendations.join(" ");
    $("#data-source-label").textContent =
      result.source === "PVGIS 5.3" ? msg.sourcePvgis : msg.sourceFallback;

    $("#results-placeholder").hidden = true;
    $("#results-content").hidden = false;
  }

  async function sendToNetlify() {
    const payload = new URLSearchParams(new FormData(form));
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString()
    });

    if (!response.ok) {
      throw new Error(`Netlify form returned ${response.status}`);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    hideError();
    hideStatus();

    if (!form.reportValidity()) {
      showError(msg.invalid);
      return;
    }

    const values = collectValues();

    if (
      !Number.isFinite(values.monthlyBill) ||
      values.monthlyBill <= 0 ||
      !Number.isFinite(values.tariff) ||
      values.tariff <= 0
    ) {
      showError(msg.invalid);
      return;
    }

    submitButton.disabled = true;
    showStatus(msg.calculating);

    try {
      const yieldData = await getAnnualYield(values.city);
      const result = calculateResult(values, yieldData);
      populateSubmission(result);

      await sendToNetlify();

      renderResult(result);
      showStatus(msg.sent, "success");

      if (window.innerWidth < 981) {
        $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      console.error(error);
      $("#results-content").hidden = true;
      $("#results-placeholder").hidden = false;
      showStatus(msg.sendError, "error");
    } finally {
      submitButton.disabled = false;
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

  form.addEventListener("submit", handleSubmit);
})();
