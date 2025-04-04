import { writeFile } from "fs/promises";
import { join } from "path";

const wcagUrl = "https://www.w3.org/WAI/WCAG$VERSION/wcag.json";

const [wcag21, wcag22] = await Promise.all(
  ["21", "22"].map((version) =>
    fetch(wcagUrl.replace("$VERSION", version)).then((response) => {
      if (response.status >= 400)
        throw new Error(`HTTP error code received: ${response.status}`);
      return response.json();
    })
  )
);

// Include only principles (drop terms)
const data = { principles: wcag22.principles };

// Incorporate 2.1's version of 4.1.1 Parsing, but remove techniques
data.principles[3].guidelines[0].successcriteria[0] =
  wcag21.principles[3].guidelines[0].successcriteria[0];
data.principles[3].guidelines[0].successcriteria[0].techniquesHtml = {};

// Prune unneeded fields
for (const principle of data.principles) {
  delete principle.content;
  for (const guideline of principle.guidelines) {
    delete guideline.content;
    for (const criterion of guideline.successcriteria) {
      delete criterion.content;
    }
  }
}

await writeFile(join("_data", "wcag22.json"), JSON.stringify(data, null, "  ") + "\n");
