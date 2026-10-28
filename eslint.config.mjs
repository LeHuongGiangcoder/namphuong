import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /*
        Ảnh trong /public/art đã được scripts/prepare-assets.py cắt, thu nhỏ và
        xuất WebP sẵn ở đúng cỡ hiển thị. Cho next/image tối ưu lại lần nữa lúc
        chạy chỉ tốn thêm tiền mà không nhanh hơn, nên dùng thẳng <img>.
      */
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
