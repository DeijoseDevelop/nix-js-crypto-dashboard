import { html, portal, transition } from "@deijose/nix-js";

export function TradeConfirmationModal({ isOpen, type, amount, coinName, onClose }) {
    return html`
        ${transition(
            () => isOpen.value ? portal(html`
                <div class="modal-overlay" @click=${onClose}>
                    <div class="modal-content success-modal" @click.stop=${() => {}}>
                        <div class="success-icon-wrapper">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h3 class="success-title">Transaction Successful</h3>
                        <p class="success-message">
                            You have successfully ${() => type.value === 'buy' ? 'bought' : 'sold'} 
                            <strong>$${() => amount.value}</strong> worth of <strong>${() => coinName.value}</strong>.
                        </p>
                        <button class="btn-primary" style="width: 100%; margin-top: 1.5rem;" @click=${onClose}>
                            Done
                        </button>
                    </div>
                </div>
            `) : null,
            { name: 'modal', appear: true }
        )}
    `;
}