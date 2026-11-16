"use client";

import { useEffect, useState } from "react";
import Header from "@/src/common/header/header";
import Footer from "@/src/common/footer/footer";
import "@/app/styles/deals.css";

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDeals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://www.cheapshark.com/api/1.0/deals?pageSize=30&onSale=1",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }

        setDeals(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load deals");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDeals();

    return () => controller.abort();
  }, []);

  const filteredDeals = deals.filter((deal) =>
    deal.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="deals-page">
      <Header />

      <main className="container deals-main">
        <h1>Live Game Deals</h1>
        <p>
          Discover discounted PC games from real online stores.
        </p>

        <input
          className="form-control deals-search"
          type="search"
          placeholder="Search loaded deals..."
          aria-label="Search loaded deals"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {loading && (
          <p role="status">Loading deals...</p>
        )}

        {error && (
          <p role="alert" className="deals-error">
            Failed to load deals: {error}
          </p>
        )}

        {!loading && !error && filteredDeals.length === 0 && (
          <p role="status">
            No deals found. Try another search.
          </p>
        )}

        {!loading && !error && filteredDeals.length > 0 && (
          <>
            <p role="status">
              Showing {filteredDeals.length} deals
            </p>

            <div className="row g-4">
              {filteredDeals.map((deal) => (
                <div
                  className="col-12 col-sm-6 col-lg-4"
                  key={deal.dealID}
                >
                  <article className="deal-card">
                    <img
                      src={deal.thumb}
                      alt={`${deal.title} cover`}
                      loading="lazy"
                    />

                    <h2>{deal.title}</h2>

                    <div className="deal-prices">
                      <span className="deal-old-price">
                        ${Number(deal.normalPrice).toFixed(2)}
                      </span>

                      <strong>
                        ${Number(deal.salePrice).toFixed(2)}
                      </strong>
                    </div>

                    <p>
                      Save {Math.round(Number(deal.savings))}%
                    </p>

                    <a
                      href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn deal-button"
                    >
                      View Deal
                    </a>
                  </article>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
