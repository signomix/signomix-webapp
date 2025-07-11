export const prerender = false;
export const ssr = false;

if (typeof process === 'undefined') {
    globalThis.process = { env: {} };
}
if (!process.env.PUBLIC_WEBAPP_MODE) {
    process.env.PUBLIC_WEBAPP_MODE = 'default';
}
console.log('+layout.js',process.env.PUBLIC_WEBAPP_MODE);
