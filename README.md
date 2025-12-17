# reproduction-portable-stories-next

```sh
node -v
# v24.12.0
pnpm -v
# 10.25.0
pnpm install
pnpm vitest
```

```
Error: Cannot find module '<REDUCTED>/node_modules/.pnpm/@storybook+nextjs@10.1.9_esbuild@0.27.2_next@16.0.10_@babel+core@7.28.5_react-dom@19.2._fb92b71e4bbbffb1b122e48ebb3990e6/node_modules/next/dist/client/components/navigation' imported from <REDUCTED>/node_modules/.pnpm/@storybook+nextjs@10.1.9_esbuild@0.27.2_next@16.0.10_@babel+core@7.28.5_react-dom@19.2._fb92b71e4bbbffb1b122e48ebb3990e6/node_modules/@storybook/nextjs/dist/export-mocks/navigation/index.js
Did you mean to import "next/dist/client/components/navigation.js"?
```