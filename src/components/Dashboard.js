import { signal, html, ref, nextTick, suspend, NixComponent, watch } from "@deijose/nix-js";
import { Chart, registerables } from "chart.js";
import { DashboardSettings } from "./DashboardSettings.js";
import { fetchMarketData } from "../api/market.js";
import { TradeConfirmationModal } from "./TradeConfirmationModal.js";

// Nuevos componentes importados
import { StatCards } from "./StatCards.js";
import { MarketLeaders } from "./MarketLeaders.js";
import { TradePanelOverlay } from "./TradePanelOverlay.js";
import { NixEngineStats } from "./NixEngineStats.js";

Chart.register(...registerables);

export class Dashboard extends NixComponent {
    settings = signal({
        totalBalance: 42580.12,
        balanceChange: 5.4,
        chartPoints: 7,
        coinCount: 6,
        refreshInterval: 60,
        chartColor: '#00d2ff',
        showLegend: true,
    });
    
    refreshMarket = signal(0);
    lineChartRef = ref();
    doughnutChartRef = ref();
    lineChartInstance = null;
    doughnutChartInstance = null;
    chartsInitialized = false;
    intervalId = null;
    
    selectedCoinForTrade = signal(null);
    isBalanceHidden = signal(false);

    tradeAmount = signal(1000); 
    isConfirmationOpen = signal(false);
    lastTradeType = signal('buy'); 
    lastTradeCoinName = signal('Bitcoin'); 

    onInit() {
        watch(
            () => this.settings.value,
            (newSettings, oldSettings) => {
                this.chartsInitialized = false;
                nextTick(() => this.initCharts());
                
                if (!oldSettings || newSettings.coinCount !== oldSettings.coinCount) {
                    this.refreshMarket.update(n => n + 1);
                }
                
                if (oldSettings && newSettings.refreshInterval !== oldSettings.refreshInterval) {
                    this.setupAutoRefresh();
                }
            },
            { immediate: false }
        );
    }

    onMount() {
        nextTick(() => this.initCharts());
        this.setupAutoRefresh();
        return () => {
            this.cleanupCharts();
            if (this.intervalId) clearInterval(this.intervalId);
        };
    }

    onUnmount() {
        this.cleanupCharts();
    }

    initCharts() {
        if (this.chartsInitialized) return;
        
        const lineCtx = this.lineChartRef.el;
        const doughnutCtx = this.doughnutChartRef.el;
        
        if (!lineCtx || !doughnutCtx) return;
        
        this.cleanupCharts();

        const s = this.settings.value;
        const labels = Array.from({ length: s.chartPoints }, (_, i) => `Day ${i + 1}`);
        const baseValue = s.totalBalance;
        const variance = baseValue * 0.05;
        
        const chartData = Array.from({ length: labels.length }, () => baseValue - variance + Math.random() * (variance * 2));
        chartData[chartData.length - 1] = baseValue;

        const ctx2d = lineCtx.getContext('2d');
        const gradient = ctx2d.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, s.chartColor + '66');
        gradient.addColorStop(1, s.chartColor + '00');

        const neonGlowPlugin = {
            id: 'neonGlow',
            beforeDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.shadowColor = s.chartColor;
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            },
            afterDatasetsDraw: (chart) => {
                chart.ctx.restore();
            }
        };

        this.lineChartInstance = new Chart(lineCtx, {
            type: 'line',
            plugins: [neonGlowPlugin],
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio Value ($)',
                    data: chartData,
                    borderColor: s.chartColor,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#050505',
                    pointBorderColor: s.chartColor,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: s.chartColor
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(5, 5, 5, 0.9)',
                        titleColor: '#fff',
                        bodyColor: s.chartColor,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: { label: (context) => '$' + context.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2}) }
                    }
                },
                scales: {
                    y: { display: true, position: 'right', grid: { color: 'rgba(255, 255, 255, 0.05)' }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)', maxTicksLimit: 6 } },
                    x: { grid: { display: false }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)', maxTicksLimit: 7 } }
                }
            }
        });

        this.doughnutChartInstance = new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['BTC', 'ETH', 'SOL', 'USDT'],
                datasets: [{ data: [45, 25, 15, 15], backgroundColor: ['#f7931a', '#627eea', '#14f195', '#26a17b'], borderWidth: 0, hoverOffset: 4 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '75%',
                plugins: { legend: { display: s.showLegend, position: 'bottom', labels: { color: '#fff', padding: 20, font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }, usePointStyle: true, pointStyle: 'circle' } } }
            }
        });
        
        this.chartsInitialized = true;
    }

    setupAutoRefresh() {
        if (this.intervalId) clearInterval(this.intervalId);
        
        const intervalMs = this.settings.value.refreshInterval * 1000;
        this.intervalId = setInterval(() => {
            console.log("Auto-refreshing market data...");
            this.refreshMarket.update(n => n + 1);
        }, intervalMs);
    }

    cleanupCharts() {
        if (this.lineChartInstance) { this.lineChartInstance.destroy(); this.lineChartInstance = null; }
        if (this.doughnutChartInstance) { this.doughnutChartInstance.destroy(); this.doughnutChartInstance = null; }
        this.chartsInitialized = false;
    }

    handleTradeAction = (type) => {
        const coin = this.selectedCoinForTrade.value;
        if (!coin) return;
        
        const amount = Number(this.tradeAmount.value) || 0;
        if (amount <= 0) return;
        
        this.lastTradeType.value = type;
        this.lastTradeCoinName.value = coin.name;
        
        const currentSettings = this.settings.value;
        const fee = amount * 0.001; 
        const variation = type === 'buy' ? -(amount + fee) : (amount - fee);
        
        this.settings.value = { 
            ...currentSettings, 
            totalBalance: currentSettings.totalBalance + variation 
        };

        this.selectedCoinForTrade.value = null;

        setTimeout(() => {
            this.isConfirmationOpen.value = true;
        }, 50);
    };

    loadMoreCoins = () => {
        if (this.settings.value.coinCount >= 18) return;
        const current = this.settings.value;
        this.settings.value = {
            ...current,
            coinCount: current.coinCount + 6
        };
    };

    loadMarketData = () => fetchMarketData(this.settings.value.coinCount);

    renderCoinItem = (coin) => {
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
                    <button class="btn-trade" @click=${() => this.selectedCoinForTrade.value = coin}>Trade</button>
                </div>

                <div class="coin-price">
                    <div class="price-value">$${Number(coin.current_price).toLocaleString()}</div>
                    <div class="price-change" style=${`color: ${color}`}>${isPositive ? '+' : ''}${percent}%</div>
                </div>
            </div>
        `;
    };

    render() {
        return html`
            <div class="dashboard">
                <header class="header">
                    <div class="title-group">
                        <div class="logo-glow-wrapper">
                            <img src="/nix-js-logo.png" alt="Nix.js" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23646cff\\'/></svg>'" />
                        </div>
                        <div>
                            <h1>Nix Intelligence</h1>
                            <p class="subtitle">Real-time Reactive Architecture</p>
                        </div>
                    </div>
                    
                    <div class="header-actions">
                        ${DashboardSettings(this.settings)}
                        ${suspend(
                            () => new Promise((res) => setTimeout(() => res({ name: "Nix Dev", rank: "Top 1%" }), 600)),
                            (user) => html`
                                <div class="user-profile card">
                                    <div class="avatar"></div>
                                    <div class="user-details">
                                        <span class="user-name">${user.name}</span>
                                        <span class="user-rank">${user.rank}</span>
                                    </div>
                                </div>
                            `,
                            { fallback: html`<div class="card loading-skeleton"></div>` }
                        )}
                    </div>
                </header>

                ${StatCards({ 
                    settings: this.settings, 
                    isBalanceHidden: this.isBalanceHidden 
                })}

                <div class="card chart-main glow-hover">
                    <div class="chart-header">
                        <div class="chart-titles">
                            <h3>Portfolio Performance</h3>
                            <p class="text-muted">Historical value over the last ${() => this.settings.value.chartPoints} days</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="timeframe-tabs">
                                ${[7, 14, 30].map(days => html`
                                    <button 
                                        class=${() => `time-btn ${this.settings.value.chartPoints === days ? 'active' : ''}`}
                                        @click=${() => this.settings.value = { ...this.settings.value, chartPoints: days }}
                                    >${days}D</button>
                                `)}
                            </div>
                            <span class="chart-info interactive-badge">
                                <span class="pulse-dot" style=${() => `background: ${this.settings.value.chartColor}`}></span> Live Sync
                            </span>
                        </div>
                    </div>
                    <div class="chart-container"><canvas ref=${this.lineChartRef}></canvas></div>
                </div>

                <div class="card chart-side glow-hover">
                    <div class="chart-header"><h3>Asset Allocation</h3></div>
                    <div class="chart-container"><canvas ref=${this.doughnutChartRef}></canvas></div>
                </div>

                ${MarketLeaders({
                    loadMarketData: this.loadMarketData,
                    refreshMarket: this.refreshMarket,
                    settings: this.settings,
                    onSelectCoin: (coin) => this.selectedCoinForTrade.value = coin,
                    onLoadMore: this.loadMoreCoins
                })}

                ${NixEngineStats()}

                ${TradePanelOverlay({
                    selectedCoin: this.selectedCoinForTrade,
                    tradeAmount: this.tradeAmount,
                    onTradeAction: this.handleTradeAction,
                    onClose: () => this.selectedCoinForTrade.value = null
                })}

                ${TradeConfirmationModal({
                    isOpen: this.isConfirmationOpen,
                    type: this.lastTradeType,
                    amount: this.tradeAmount,
                    coinName: this.lastTradeCoinName,
                    onClose: () => this.isConfirmationOpen.value = false
                })}
            </div> 
        `;
    }
}