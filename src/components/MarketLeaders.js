import { html, suspend, repeat } from "@deijose/nix-js";

export const MarketLeaders = ({ loadMarketData, refreshMarket, settings, onSelectCoin, onLoadMore }) => {

    console.log({
        loadMarketData,

    });

    const renderCoinItem = (coin) => {
        const isPositive = coin.price_change_percentage_24h > 0;
        const color = isPositive ? 'var(--accent-success)' : 'var(--accent-danger)';
        const percent = coin.price_change_percentage_24h.toFixed(2);

        return html`
            <div class="coin-item quick-action-wrapper">
                <div class="coin-info">
                    <img src=${coin.image} alt=${coin.name} />
                    <div>
                        <div class="coin-name">${coin.name}</div>
                        <div class="coin-symbol">${coin.symbol.toUpperCase()}</div>
                    </div>
                </div>
            
                <div class="coin-actions">
                    <button class="btn-trade" @click=${()=> onSelectCoin(coin)}>Trade</button>
                </div>
            
                <div class="coin-price">
                    <div class="price-value">$${Number(coin.current_price).toLocaleString()}</div>
                    <div class="price-change" style=xxxxxxxxxxxxxxxxxxxx>${isPositive ? '+' : ''}${percent}%</div>
                </div>
            </div>
        `;
    };

    return suspend(
        loadMarketData,
        (coins) => html`
            <div class="card glow-hover" style="grid-column: span 3;">
                <div class="chart-header"
                    style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 0;">
                    <div>
                        <h3 class="section-title" style="margin-bottom: 4px;">Market Leaders</h3>
                        <p class="text-muted" style="font-size: 0.85rem;">Top ${() => settings.value.coinCount} cryptocurrencies</p>
                    </div>
                    <button class="btn-icon" @click=${()=> refreshMarket.update(n => n + 1)} title="Force Refresh">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                    </button>
                </div>
            
                <div class="market-list">
                    ${() => repeat(coins, (coin) => coin.id, (coin) => renderCoinItem(coin))}
                </div>
            
                <div
                    style="text-align: center; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 1rem;">
                    <button class="btn-primary"
                        style="background: transparent; border: 1px solid var(--accent-primary); color: var(--accent-primary);"
                        @click=${onLoadMore}>
                        Load More Assets
                    </button>
                </div>
            </div>
        `,
        {
            invalidate: refreshMarket,
            fallback: html`<div class="card loading-skeleton-box" style="grid-column: span 3; height: 350px;"></div>`,
            errorFallback: (err) => html`
                <div class="card error-card" style="grid-column: span 3;">
                    <div class="error-content">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff5050" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <h3>API Limit Reached</h3>
                        <p>CoinGecko rate limit exceeded. Please wait a moment.</p>
                        <button class="btn-primary" @click=${()=> refreshMarket.update(n => n + 1)}>Try Again</button>
                    </div>
                </div>
            `
        }
    );
};