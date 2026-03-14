import { html } from "@deijose/nix-js";

export const StatCards = ({ settings, isBalanceHidden }) => {
    return html`
        <div class="card stat-card glow-hover">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div class="stat-icon-wrapper" style="background: rgba(100, 108, 255, 0.1); color: var(--accent-primary);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
                <button class="btn-icon" @click=${() => isBalanceHidden.value = !isBalanceHidden.value} title="Toggle Privacy">
                    ${() => isBalanceHidden.value 
                        ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                        : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
                    }
                </button>
            </div>
            <p class="stat-label">Total Portfolio</p>
            <div class="stat-value">
                ${() => isBalanceHidden.value 
                    ? '$ •••••••' 
                    : `$${Number(settings.value.totalBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                }
                <span class="stat-change">+${() => settings.value.balanceChange}%</span>
            </div>
        </div>

        <div class="card stat-card glow-hover">
            <div class="stat-icon-wrapper" style="background: rgba(0, 210, 255, 0.1); color: var(--accent-secondary);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
            <p class="stat-label">Market Mood</p><div class="stat-value" style="color: var(--accent-secondary)">Bullish</div>
        </div>

        <div class="card stat-card glow-hover">
            <div class="stat-icon-wrapper" style="background: rgba(0, 255, 170, 0.1); color: var(--accent-success);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
            <p class="stat-label">Signal Accuracy</p><div class="stat-value">94.2%</div>
        </div>

        <div class="card stat-card glow-hover">
            <div class="stat-icon-wrapper" style="background: rgba(255, 255, 255, 0.1); color: #fff;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
            <p class="stat-label">Network Status</p><div class="stat-value" style="color: var(--accent-success)"><span class="pulse-dot green"></span> Optimal</div>
        </div>
    `;
}