import { html, transition, portal } from "@deijose/nix-js";

export const TradePanelOverlay = ({ selectedCoin, tradeAmount, onTradeAction, onClose }) => {
    return transition(
        () => selectedCoin.value ? portal(html`
            <div class="trade-panel-overlay" @click=${onClose}>
                <div class="trade-panel" @click.stop=${() => {}}>
                    <div class="trade-header">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src=${selectedCoin.value.image} width="32" style="border-radius: 50%" />
                            <div>
                                <h3>Trade ${selectedCoin.value.name}</h3>
                                <span style="color: var(--text-muted); font-size: 0.8rem;">$${Number(selectedCoin.value.current_price).toLocaleString()}</span>
                            </div>
                        </div>
                        <button class="close-btn" @click=${onClose}>×</button>
                    </div>
                    <div class="trade-body">
                        <div class="trade-input-group">
                            <label>Amount (USD)</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value=${() => tradeAmount.value}
                                @input=${(e) => tradeAmount.value = Number(e.target.value)}
                            />
                        </div>
                        <div class="trade-input-group">
                            <label>You will receive approx.</label>
                            <input 
                                type="number" 
                                disabled 
                                value=${() => (tradeAmount.value / selectedCoin.value.current_price).toFixed(6)} 
                            />
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button class="btn-primary" style="flex: 1; background: var(--accent-success);" @click.stop=${() => onTradeAction('buy')}>Buy</button>
                            <button class="btn-primary" style="flex: 1; background: var(--accent-danger);" @click.stop=${() => onTradeAction('sell')}>Sell</button>
                        </div>
                    </div>
                </div>
            </div>
        `) : null,
        { name: 'slide-right', appear: true }
    );
};