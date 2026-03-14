import { signal, html, NixComponent, createForm, required, min, max, portal, transition } from "@deijose/nix-js";

export function DashboardSettings(props) {
    const isOpen = signal(false);
    
    const form = createForm(
        {
            totalBalance: 42580.12,
            balanceChange: 5.4,
            chartPoints: 7,
            coinCount: 6,
            refreshInterval: 60,
            chartColor: '#00d2ff',
            showLegend: true,
        },
        {
            validators: {
                totalBalance: [required(), min(0)],
                balanceChange: [min(-100), max(1000)],
                chartPoints: [min(3), max(30)],
                coinCount: [min(1), max(50)],
                refreshInterval: [min(5), max(300)],
            },
            validateOn: 'blur',
        }
    );

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    const handleSubmit = form.handleSubmit((values) => {
        if (props) {
            props.value = { ...props.value, ...values };
        }
        isOpen.value = false;
    });

    const handleReset = () => {
        form.reset();
        if (props) {
            props.value = { ...form.values.value };
        }
    };

    const renderField = (name, label, type = 'number', step = '1') => {
        const field = form.fields[name];
        return html`
            <div class="form-group">
                <label>${label}</label>
                <input
                    type=${type}
                    step=${step}
                    value=${() => field.value.value}
                    @input=${field.onInput}
                    @blur=${field.onBlur}
                    class=${() => field.error.value ? 'error' : ''}
                />
                ${() => field.error.value ? html`<span class="field-error">${field.error.value}</span>` : null}
            </div>
        `;
    };

    const renderModal = () => {
        return html`
            <div class="modal-overlay" @click=${toggle}>
                <div class="modal-content" @click.stop=${() => {}}>
                    <div class="modal-header">
                        <h3>Dashboard Settings</h3>
                        <button class="close-btn" @click=${toggle}>×</button>
                    </div>
                    <form @submit.prevent=${handleSubmit}>
                        <div class="form-section">
                            <h4>Portfolio</h4>
                            ${renderField('totalBalance', 'Total Balance ($)', 'number', '0.01')}
                            ${renderField('balanceChange', 'Balance Change (%)', 'number', '0.1')}
                        </div>
                        <div class="form-section">
                            <h4>Charts</h4>
                            ${renderField('chartPoints', 'History Days (Data Points)', 'number')}
                            ${renderField('chartColor', 'Theme Color', 'color')}
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked=${() => form.fields.showLegend.value.value}
                                        @change=${(e) => { 
                                            form.fields.showLegend.value.value = e.target.checked;
                                            form.fields.showLegend.dirty.value = true;
                                        }}
                                    />
                                    Show Legend
                                </label>
                            </div>
                        </div>
                        <div class="form-section">
                            <h4>Data</h4>
                            ${renderField('coinCount', 'Top Coins to Display', 'number')}
                            ${renderField('refreshInterval', 'Refresh Interval (sec)', 'number')}
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" @click=${handleReset}>Reset</button>
                            <button type="submit" class="btn-primary" disabled=${() => !form.valid.value}>Apply Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    };

    return html`
            <button class="settings-btn" @click=${toggle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg> 
                Settings
            </button>
            ${() => transition(
                () => isOpen.value ? portal(renderModal()) : null,
                { name: 'modal', appear: true }
            )}
        `;
}