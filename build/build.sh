npx vite build;

sed -i "1i\
// ==UserScript==\n\
// @name        华科验证码好烦好烦好烦！！！\n\
// @match       https://pass.hust.edu.cn/cas/login\n\
// @grant       none\n\
// @version     1.0\n\
// @author      https://github.com/HomeArchbishop\n\
// @description https://github.com/HomeArchbishop/hustcode\n\
// ==/UserScript==\n\
" `dirname "$0"`/../dist/hustcode.user.js
