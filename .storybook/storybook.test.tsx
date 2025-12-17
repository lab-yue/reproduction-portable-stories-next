import { globSync, readdirSync } from "node:fs";
import path from "node:path";

import { composeStories } from "@storybook/nextjs";
import type { Meta, StoryFn } from "@storybook/nextjs";
import { render } from "@testing-library/react";
import { addSerializer } from "@vitest/snapshot";
import { describe, test, expect, vi } from "vitest";

const reactTestingLibrarySerializer = {
  // eslint-disable-next-line
  print: (val: any, serialize: Function) => {
    return serialize(val.container.firstChild);
  },
  test: (val: object) => val && val.hasOwnProperty("container"),
};

addSerializer(reactTestingLibrarySerializer);

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

function getAllStoryFiles() {
  const stories = globSync(
    path.join(__dirname, "../stories/*stories.ts"),
  ).toSorted();
  return Promise.all(
    stories.map(async (filePath) => {
      const componentName = path
        .basename(filePath)
        .replace(/\.(stories|story)\.[^/.]+$/, "")
        .replace(path.join(import.meta.dirname, ".."), "");

      return { filePath, componentName };
    }),
  );
}

describe("Storyshots", async () => {
  const files = await getAllStoryFiles();
  const stories: {
    filePath: string;
    componentName: string;
    storyFile: StoryFile;
  }[] = [];
  for (const file of files) {
    const storyFile = await import(file.filePath);
    await vi.dynamicImportSettled();
    stories.push({ ...file, storyFile });
  }

  stories.map(async ({ componentName, filePath, storyFile }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;
    const dir = path.join(path.dirname(filePath), "__snapshots__");
    const fileBasename = path.basename(filePath, ".tsx");

    describe(title, () => {
      const stories = Object.entries(composeStories(storyFile)).map(
        ([name, story]) => ({ name, story }),
      );

      let i = 0;
      for (const { name, story: Story } of stories) {
        test(Story.storyName || name || componentName, async () => {
          // const mounted = render(<Story {...Story.args} />);
          await Story.run()
          const filename = `${fileBasename}${i ? `.${i}` : ""}.storyshot`;
          const snapshotPath = path.join(dir, filename);
          await expect(document.body).toMatchFileSnapshot(snapshotPath);
          i++;
        });
      }
    });
  });
});
