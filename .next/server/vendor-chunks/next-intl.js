"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/next-intl";
exports.ids = ["vendor-chunks/next-intl"];
exports.modules = {

/***/ "(ssr)/./node_modules/next-intl/dist/esm/development/routing/defineRouting.js":
/*!******************************************************************************!*\
  !*** ./node_modules/next-intl/dist/esm/development/routing/defineRouting.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ defineRouting)\n/* harmony export */ });\nfunction defineRouting(config) {\n  if (config.domains) {\n    validateUniqueLocalesPerDomain(config.domains);\n  }\n  return config;\n}\nfunction validateUniqueLocalesPerDomain(domains) {\n  const domainsByLocale = new Map();\n  for (const {\n    domain,\n    locales\n  } of domains) {\n    for (const locale of locales) {\n      const localeDomains = domainsByLocale.get(locale) || new Set();\n      localeDomains.add(domain);\n      domainsByLocale.set(locale, localeDomains);\n    }\n  }\n  const duplicateLocaleMessages = Array.from(domainsByLocale.entries()).filter(([, localeDomains]) => localeDomains.size > 1).map(([locale, localeDomains]) => `- \"${locale}\" is used by: ${Array.from(localeDomains).join(', ')}`);\n  if (duplicateLocaleMessages.length > 0) {\n    console.warn('Locales are expected to be unique per domain, but found overlap:\\n' + duplicateLocaleMessages.join('\\n') + '\\nPlease see https://next-intl.dev/docs/routing#domains');\n  }\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmV4dC1pbnRsL2Rpc3QvZXNtL2RldmVsb3BtZW50L3JvdXRpbmcvZGVmaW5lUm91dGluZy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxS0FBcUssT0FBTyxnQkFBZ0IscUNBQXFDO0FBQ2pPO0FBQ0E7QUFDQTtBQUNBOztBQUVvQyIsInNvdXJjZXMiOlsiL1VzZXJzL2hhbnNldWxraS9Qcm9qZWN0X3NpL2tvdHJpcy9sYWIvd2ViX2FjY2Vzc2liaWxpdHkvbm9kZV9tb2R1bGVzL25leHQtaW50bC9kaXN0L2VzbS9kZXZlbG9wbWVudC9yb3V0aW5nL2RlZmluZVJvdXRpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZGVmaW5lUm91dGluZyhjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5kb21haW5zKSB7XG4gICAgdmFsaWRhdGVVbmlxdWVMb2NhbGVzUGVyRG9tYWluKGNvbmZpZy5kb21haW5zKTtcbiAgfVxuICByZXR1cm4gY29uZmlnO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVVbmlxdWVMb2NhbGVzUGVyRG9tYWluKGRvbWFpbnMpIHtcbiAgY29uc3QgZG9tYWluc0J5TG9jYWxlID0gbmV3IE1hcCgpO1xuICBmb3IgKGNvbnN0IHtcbiAgICBkb21haW4sXG4gICAgbG9jYWxlc1xuICB9IG9mIGRvbWFpbnMpIHtcbiAgICBmb3IgKGNvbnN0IGxvY2FsZSBvZiBsb2NhbGVzKSB7XG4gICAgICBjb25zdCBsb2NhbGVEb21haW5zID0gZG9tYWluc0J5TG9jYWxlLmdldChsb2NhbGUpIHx8IG5ldyBTZXQoKTtcbiAgICAgIGxvY2FsZURvbWFpbnMuYWRkKGRvbWFpbik7XG4gICAgICBkb21haW5zQnlMb2NhbGUuc2V0KGxvY2FsZSwgbG9jYWxlRG9tYWlucyk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGR1cGxpY2F0ZUxvY2FsZU1lc3NhZ2VzID0gQXJyYXkuZnJvbShkb21haW5zQnlMb2NhbGUuZW50cmllcygpKS5maWx0ZXIoKFssIGxvY2FsZURvbWFpbnNdKSA9PiBsb2NhbGVEb21haW5zLnNpemUgPiAxKS5tYXAoKFtsb2NhbGUsIGxvY2FsZURvbWFpbnNdKSA9PiBgLSBcIiR7bG9jYWxlfVwiIGlzIHVzZWQgYnk6ICR7QXJyYXkuZnJvbShsb2NhbGVEb21haW5zKS5qb2luKCcsICcpfWApO1xuICBpZiAoZHVwbGljYXRlTG9jYWxlTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnNvbGUud2FybignTG9jYWxlcyBhcmUgZXhwZWN0ZWQgdG8gYmUgdW5pcXVlIHBlciBkb21haW4sIGJ1dCBmb3VuZCBvdmVybGFwOlxcbicgKyBkdXBsaWNhdGVMb2NhbGVNZXNzYWdlcy5qb2luKCdcXG4nKSArICdcXG5QbGVhc2Ugc2VlIGh0dHBzOi8vbmV4dC1pbnRsLmRldi9kb2NzL3JvdXRpbmcjZG9tYWlucycpO1xuICB9XG59XG5cbmV4cG9ydCB7IGRlZmluZVJvdXRpbmcgYXMgZGVmYXVsdCB9O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/next-intl/dist/esm/development/routing/defineRouting.js\n");

/***/ })

};
;