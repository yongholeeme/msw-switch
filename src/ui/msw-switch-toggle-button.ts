import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("msw-switch-toggle-button")
export class MswSwitchToggleButton extends LitElement {
  static styles = css`
    button {
      border: 0;
      position: fixed;
      bottom: 20px;
      right: 20px;
      color: white;
      background-color: #b9f0ff;
      border-radius: 50%;
      padding: 0.5rem;
      box-shadow: 0 0 10px rgb(0 0 0 / 40%);
    }
  `;

  render() {
    return html`<button type="button">🕹</button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "msw-switch-toggle-button": MswSwitchToggleButton;
  }
}
