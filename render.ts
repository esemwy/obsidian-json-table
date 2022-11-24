import { MarkdownRenderChild } from 'obsidian';

export class TableRenderer extends MarkdownRenderChild {
  constructor(
    public caption: string, public headers: string[],
    public rows: any[], public container: HTMLElement) {
    super(container)
  }

  async onload() {
    await this.render()
  }

  async render() {
    const tableEl = this.container.createEl('table');
    tableEl.createEl('caption', { text: this.caption });

    const theadEl = tableEl.createEl('thead');
    const tbodyEl = tableEl.createEl('tbody');

    for (const headerLine of this.headers) {
      const headerEl = theadEl.createEl('tr');
      for (const header of headerLine) {
        headerEl.createEl('th', { text: header });
      }
    }

    for (const row of this.rows) {
      const trEl = tbodyEl.createEl('tr');

      for (const col of row) {
        trEl.createEl('td', { text: col });
      }
    }
  }
}

export function renderErrorPre(container: HTMLElement, error: string): HTMLElement {
  let pre = container.createEl('pre', { cls: ["json-table", "json-error"] });
  pre.appendText(error);
  return pre;
}