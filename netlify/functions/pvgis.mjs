const PVGIS_ENDPOINT = "https://re.jrc.ec.europa.eu/api/v5_3/PVcalc";

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
      ...extraHeaders
    }
  });
}

export default async (request) => {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405, { allow: "GET" });
  }

  const requestUrl = new URL(request.url);
  const lat = Number(requestUrl.searchParams.get("lat"));
  const lon = Number(requestUrl.searchParams.get("lon"));

  // Broad Morocco bounds. They also prevent the endpoint from becoming an open global proxy.
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 20 || lat > 36.5 || lon < -18 || lon > -0.5) {
    return json({ error: "Invalid coordinates" }, 400);
  }

  const pvgisUrl = new URL(PVGIS_ENDPOINT);
  pvgisUrl.searchParams.set("lat", lat.toFixed(6));
  pvgisUrl.searchParams.set("lon", lon.toFixed(6));
  pvgisUrl.searchParams.set("peakpower", "1");
  pvgisUrl.searchParams.set("loss", "14");
  pvgisUrl.searchParams.set("optimalangles", "1");
  pvgisUrl.searchParams.set("outputformat", "json");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(pvgisUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "AmberAtlasSolarCalculator/1.0"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return json({ error: "PVGIS service unavailable", status: response.status }, 502);
    }

    const data = await response.json();
    const annualYield = Number(data?.outputs?.totals?.fixed?.E_y);

    if (!Number.isFinite(annualYield)) {
      return json({ error: "Unexpected PVGIS response" }, 502);
    }

    return json({
      annualYield,
      unit: "kWh/kWp/year",
      source: "PVGIS 5.3",
      coordinates: { lat, lon }
    });
  } catch (error) {
    const message = error?.name === "AbortError" ? "PVGIS request timeout" : "PVGIS request failed";
    return json({ error: message }, 502);
  } finally {
    clearTimeout(timeout);
  }
};

export const config = {
  path: "/api/pvgis"
};
