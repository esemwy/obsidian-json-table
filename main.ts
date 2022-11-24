import { Plugin, parseYaml, TFile } from "obsidian";
import { TableRenderer, renderErrorPre } from "./render";

export default class JsonTablePlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      "jsontable",
      async (jsonSpecString: string, el, ctx) => {
        try {
          let tableSpec = {
            source: "", // Assert that this has a proper value below
          };
          try {
            tableSpec = parseYaml(jsonSpecString);
          } catch (e) {
            throw new Error(`Could not parse JSON table spec: ${e.message}`);
          }

          if (!tableSpec.source) {
            throw new Error("Parameter 'source' is required.");
          }

          const file = this.app.vault.getAbstractFileByPath(tableSpec.source);
          if (!(file instanceof TFile)) {
            throw new Error(
              `JSON file '${tableSpec.source}' could not be found.`
            );
          }
          const jsonData = await this.app.vault.cachedRead(file);
		  const filteredJsonData = JSON.parse(jsonData);
          ctx.addChild(
            new TableRenderer(
				filteredJsonData.caption, 
				filteredJsonData.headers, 
				filteredJsonData.rows,
				el)
          );
        } catch (e) {
          renderErrorPre(el, e.message);
          return;
        }
      }
    );
  }
}