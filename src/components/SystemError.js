import { html } from "@deijose/nix-js";

export function SystemError(error) {
    return html`
        <div class="error-boundary-wrapper">
            <div class="error-boundary-content card">
                <div class="error-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff5050" stroke-width="2">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h2>System Failure Detected</h2>
                <p class="error-details">
                    ${error?.message || 'An unexpected anomaly occurred in the matrix.'}
                </p>
                <p class="text-muted" style="margin-bottom: 1.5rem; font-size: 0.85rem;">
                    The Nix.js engine has caught the exception to prevent a total crash.
                </p>
                <button class="btn-primary" @click=${() => window.location.reload()}>
                    Reboot System
                </button>
            </div>
        </div>
    `;
}