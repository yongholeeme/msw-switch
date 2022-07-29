import Cookies from "js-cookie";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getGlobalMultiCaseHandlers } from "../browser";
import { makeKey } from "../utils";

@customElement("msw-switch-handler-item")
export class MswSwitchHandlerItem extends LitElement {
  static styles = css`
    li {
      margin-bottom: 0.5rem;
      margin-top: 0;
      border-radius: 20px;
      background-color: #f6f8fa;
      padding: 1rem;
      color: black;
    }
    .list-item-body {
      border-radius: 8px;
      margin-top: 1rem;
      overflow: hidden;
    }
    .list-item-body > div {
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #efeff0;
    }
    .list-item-body > div.current {
      background-color: #09aa5c;
      color: white;
    }
  `;

  @property() key = "";

  get data() {
    const handlers = getGlobalMultiCaseHandlers();
    const targetHandler = handlers.find(
      (handler) => makeKey(handler.method, handler.url) === this.key
    );

    if (!targetHandler) {
      throw new Error();
    }

    return targetHandler;
  }

  get currentCase() {
    return Cookies.get(makeKey(this.data.method, this.data.url)) || "";
  }

  render() {
    const { description, method, url, responseResolvers } = this.data;

    return html`<li>
      <div class="list-item-header">
        <div class="description">${description}</div>
        <div>
          <span class="method">${method.toUpperCase()}</span>
          <span class="url">${url}</span>
        </div>
      </div>
      <div class="list-item-body">
        ${Object.keys(responseResolvers).map((caseName) => {
          return html`<div
            @click=${() => this.changeCurrentCase(caseName)}
            class=${this.currentCase === caseName ? "current" : ""}
          >
            ${caseName}
          </div>`;
        })}
      </div>
    </li>`;
  }

  private changeCurrentCase(caseName: string) {
    if (this.currentCase === caseName) return;
    Cookies.set(makeKey(this.data.method, this.data.url), caseName);
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "msw-switch-handler-item": MswSwitchHandlerItem;
  }
}
