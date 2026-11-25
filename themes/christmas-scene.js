"use strict";

// Christmas backdrop: the doodle wallpaper and drifting pieces. The page includes this script inside
// .festive-layer; it puts the scene in its own place and removes itself, so the page ends up as if the
// markup were written there. Colors and motion are in the matching .css file.
(() => {
  const script = document.currentScript;
  script.insertAdjacentHTML("beforebegin", `
    <div class="festive-scene" data-scene="christmas">
      <svg class="festive-doodles" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <defs>
          <g id="x-tree"><path class="dd-b" d="M28.6 55h6.8v7h-6.8z"/><path class="dd-g" d="M32 10L18 30h6L14 44h8L10 56h44L42 44h8L40 30h6z"/><path d="M23 35c6 3 13 2 18-2M17 49c9 4 21 3 29-3"/><circle class="dd-r" cx="27" cy="25" r="1.9"/><circle class="dd-r" cx="36" cy="30" r="1.9"/><circle class="dd-r" cx="24" cy="41" r="1.9"/><circle class="dd-r" cx="40" cy="40" r="1.9"/><circle class="dd-r" cx="31" cy="46" r="1.9"/><circle class="dd-r" cx="20" cy="53" r="1.9"/><circle class="dd-r" cx="44" cy="52" r="1.9"/><path class="dd-y" d="M32 2.4L33.4 6.1L37.3 6.3L34.3 8.7L35.3 12.5L32 10.4L28.7 12.5L29.7 8.7L26.7 6.3L30.6 6.1Z"/></g>
          <g id="x-ball"><circle class="dd-r" cx="32" cy="38" r="16"/><path d="M17 34c10 3 20 3 30 0M17 42c10 3 20 3 30 0M18 38l4-2.4 4 2.4 4-2.4 4 2.4 4-2.4 4 2.4 4-2.4 4 2.4M22 29c1.4-3 3.6-5 6.4-6"/><path class="dd-y" d="M27 17.4h10v5H27z"/><path d="M30.4 17.4c-2-5 5.2-5 3.2 0"/></g>
          <g id="x-drop"><path class="dd-g" d="M32 14c-6 4-10 12-10 20 0 9 5 16 10 24 5-8 10-15 10-24 0-8-4-16-10-20z"/><path d="M23.4 28h17.2M22.2 36h19.6M24 44h16"/><circle class="dd-y" cx="28" cy="32" r="1.4"/><circle class="dd-y" cx="32" cy="32" r="1.4"/><circle class="dd-y" cx="36" cy="32" r="1.4"/><circle class="dd-y" cx="30" cy="40" r="1.4"/><circle class="dd-y" cx="34" cy="40" r="1.4"/><path class="dd-y" d="M29 10h6v4.4h-6z"/><path d="M30.6 10c-1.6-4 4.4-4 2.8 0"/></g>
          <g id="x-stocking"><path class="dd-r" d="M22 16h18v24h6c5 0 8 3 8 7s-3 7-8 7H30c-5 0-8-4-8-9z"/><path class="dd-c" d="M46 40c5 0 8 3 8 7s-3 7-8 7zM22 45c0 5 3 9 8 9V45z"/><path d="M22 24h18M22 32h18M22 28l3-2 3 2 3-2 3 2 3-2 3 2"/><rect class="dd-c" x="20" y="9" width="22" height="8" rx="2"/><path d="M40 9.4c3-4 8-2 6 2"/></g>
          <g id="x-candycane"><path class="dd-c" d="M30 58V20a5.5 5.5 0 0 0-11 0v4a3.5 3.5 0 0 1-7 0v-4a12.5 12.5 0 0 1 25 0v38a3.5 3.5 0 0 1-7 0z"/><path class="ds-r" d="M30 31l7-4M30 39l7-4M30 47l7-4M30 55l7-4M19.7 17.3L13.7 13.8M23.1 14.7L21.3 7.9M27.3 15.2L30.8 9.2M29.8 18.6L36.6 16.8"/><path fill="none" d="M30 58V20a5.5 5.5 0 0 0-11 0v4a3.5 3.5 0 0 1-7 0v-4a12.5 12.5 0 0 1 25 0v38a3.5 3.5 0 0 1-7 0z"/></g>
          <g id="x-gingerbread"><path class="dd-b" d="M32 8c5 0 8 3.6 8 8 0 3-1.4 5.4-3.6 6.8H46c3 0 5 2 5 4.6s-2 4.6-5 4.6h-7l3 10 4 8c1.4 3-.6 6-3.6 6-1.8 0-3.2-1-4-2.6L32 46l-4.4 7.4c-.8 1.6-2.2 2.6-4 2.6-3 0-5-3-3.6-6l4-8 3-10h-7c-3 0-5-2-5-4.6s2-4.6 5-4.6h9.6C25.4 21.4 24 19 24 16c0-4.4 3-8 8-8z"/><circle class="dd-k" cx="29.4" cy="15" r="1.1"/><circle class="dd-k" cx="34.6" cy="15" r="1.1"/><path d="M29 18.6c2 1.6 4 1.6 6 0M17.6 26c1-1.2 2 1.2 3 0M43.4 26c1-1.2 2 1.2 3 0M22.6 50c1.2-1 2.4 1 3.6 0M37.8 50c1.2-1 2.4 1 3.6 0"/><circle class="dd-r" cx="32" cy="29" r="1.6"/><circle class="dd-r" cx="32" cy="35.4" r="1.6"/></g>
          <g id="x-snowman"><circle class="dd-c" cx="32" cy="46" r="13"/><circle class="dd-c" cx="32" cy="24" r="9.5"/><path d="M19.5 42l-9-7M12.6 36.6l-3-3.4M44.5 42l9-7M51.4 36.6l3-3.4"/><path class="dd-r" d="M23.5 31.5c5 2.6 12 2.6 17 0l.6 4.4c-5.4 2.6-12.8 2.6-18.2 0zM36 35l2 9 4.4-1.2-2-8.6z"/><path class="dd-k" d="M22.5 16.6h19v2.4h-19zM26 16.6V7h12v9.6z"/><circle class="dd-k" cx="29" cy="22" r="1.2"/><circle class="dd-k" cx="35" cy="22" r="1.2"/><circle class="dd-k" cx="32" cy="41" r="1.2"/><circle class="dd-k" cx="32" cy="47" r="1.2"/><circle class="dd-k" cx="32" cy="53" r="1.2"/><path class="dd-o" d="M32 25l7 1.6-7 1.6z"/></g>
          <g id="x-mitten"><path class="dd-r" d="M21 52V28c0-9 5-15 12-15s12 6 12 14v6c2-3 6-4 8-2 2.4 2 2 6-1 9l-6 6v6z"/><rect class="dd-c" x="19" y="50" width="27" height="9" rx="2"/><path d="M23.4 50v9M28 50v9M32.6 50v9M37.2 50v9M41.8 50v9"/><path d="M32 25v13M26.4 28.2l11.2 6.6M37.6 28.2l-11.2 6.6"/></g>
          <g id="x-gift"><path class="dd-r" d="M12 30h40v26H12z"/><path class="dd-r" d="M10 22h44v9H10z"/><path class="dd-y" d="M29 22h6v34h-6z"/><path class="dd-y" d="M32 22c-3-7-12-10-13-5s8 5 13 5zM32 22c3-7 12-10 13-5s-8 5-13 5z"/><circle class="dd-c" cx="18" cy="38" r="1.4"/><circle class="dd-c" cx="46" cy="48" r="1.4"/><circle class="dd-c" cx="20" cy="50" r="1.4"/><circle class="dd-c" cx="44" cy="36" r="1.4"/><circle class="dd-c" cx="17" cy="26" r="1.4"/><circle class="dd-c" cx="47" cy="26" r="1.4"/></g>
          <g id="x-bow"><path class="dd-r" d="M30 27l-7 22 5-3 4 4 1-23zM34 27l7 22-5-3-4 4-1-23z"/><path class="dd-r" d="M32 24c-5-8-17-12-19-5s9 9 19 5zM32 24c5-8 17-12 19-5s-9 9-19 5z"/><path d="M17 19c3 0 7 2 9 4M47 19c-3 0-7 2-9 4"/><rect class="dd-r" x="28.5" y="20.5" width="7" height="7" rx="2"/></g>
          <g id="x-holly"><path class="dd-g" d="M32 38Q30.2 35.6 30.2 29.8Q25.4 31.3 24.5 25.5Q19.2 28 17.7 23.4Q13 26.3 10 26Q11.9 28.4 12 33.8Q16.6 32.7 17.5 38.5Q22.8 36.1 24.1 40.9Q29 37.8 32 38ZM32 38Q35 37.8 39.9 40.9Q41.2 36.1 46.5 38.5Q47.4 32.7 52 33.8Q52.1 28.4 54 26Q51 26.3 46.3 23.4Q44.8 28 39.5 25.5Q38.6 31.3 33.8 29.8Q33.8 35.6 32 38Z"/><path d="M32 38L11.8 27M32 38L52.2 27"/><circle class="dd-r" cx="28.6" cy="39" r="3.6"/><circle class="dd-r" cx="35.4" cy="39" r="3.6"/><circle class="dd-r" cx="32" cy="33.6" r="3.6"/></g>
          <g id="x-wreath"><circle cx="32" cy="32" r="19.5"/><path class="dd-g" d="M51.5 32Q46.4 33.7 47.5 38.9Q52.6 37.2 51.5 32ZM50.3 38.7Q45.6 42 47.8 47.3Q52.5 44 50.3 38.7ZM46.9 44.5Q42 42.5 39.5 47.3Q44.4 49.3 46.9 44.5ZM41.8 48.9Q36 48.4 34.3 53.9Q40 54.4 41.8 48.9ZM35.4 51.2Q32.9 46.5 27.9 48.5Q30.4 53.2 35.4 51.2ZM28.6 51.2Q24.5 47.1 19.7 50.2Q23.8 54.3 28.6 51.2ZM22.3 48.9Q23.4 43.6 18.2 42Q17.1 47.2 22.3 48.9ZM17.1 44.5Q16.6 38.8 10.9 38.1Q11.4 43.8 17.1 44.5ZM13.7 38.7Q17.9 35.4 15 30.8Q10.8 34.1 13.7 38.7ZM12.5 32Q15.8 27.3 11.9 23.1Q8.6 27.8 12.5 32ZM13.7 25.3Q19 25.5 19.8 20.2Q14.4 20 13.7 25.3ZM17.1 19.5Q22.6 18 22.4 12.2Q16.8 13.7 17.1 19.5ZM22.2 15.1Q26.2 18.7 30.2 15.1Q26.2 11.5 22.2 15.1ZM28.6 12.8Q33.8 15.2 37.3 10.7Q32.1 8.2 28.6 12.8ZM35.4 12.8Q36.1 18.1 41.5 17.9Q40.8 12.6 35.4 12.8ZM41.8 15.1Q44.2 20.3 49.8 19.1Q47.4 13.9 41.8 15.1ZM46.9 19.5Q44.1 24 48.3 27.3Q51.2 22.8 46.9 19.5ZM50.3 25.3Q48.8 30.9 53.9 33.5Q55.4 28 50.3 25.3Z"/><circle class="dd-r" cx="13.7" cy="25.3" r="1.9"/><circle class="dd-r" cx="16.7" cy="26.9" r="1.9"/><circle class="dd-r" cx="14.3" cy="28.7" r="1.9"/><circle class="dd-r" cx="25.3" cy="13.7" r="1.9"/><circle class="dd-r" cx="28.3" cy="15.3" r="1.9"/><circle class="dd-r" cx="25.9" cy="17.1" r="1.9"/><circle class="dd-r" cx="46.9" cy="19.5" r="1.9"/><circle class="dd-r" cx="49.9" cy="21.1" r="1.9"/><circle class="dd-r" cx="47.5" cy="22.9" r="1.9"/><circle class="dd-r" cx="50.3" cy="38.7" r="1.9"/><circle class="dd-r" cx="53.3" cy="40.3" r="1.9"/><circle class="dd-r" cx="50.9" cy="42.1" r="1.9"/><path class="dd-r" d="M32 52c-4-5-11-6-11-2s7 4 11 2zM32 52c4-5 11-6 11-2s-7 4-11 2zM31 53l-4 9 3-1 2 2 1-9zM33 53l4 9-3-1-2 2-1-9z"/></g>
          <g id="x-snowflake"><g transform="rotate(0 32 32)"><path d="M32 32V7M32 15l-5-5M32 15l5-5M32 23l-4.4-4.4M32 23l4.4-4.4"/></g><g transform="rotate(60 32 32)"><path d="M32 32V7M32 15l-5-5M32 15l5-5M32 23l-4.4-4.4M32 23l4.4-4.4"/></g><g transform="rotate(120 32 32)"><path d="M32 32V7M32 15l-5-5M32 15l5-5M32 23l-4.4-4.4M32 23l4.4-4.4"/></g><g transform="rotate(180 32 32)"><path d="M32 32V7M32 15l-5-5M32 15l5-5M32 23l-4.4-4.4M32 23l4.4-4.4"/></g><g transform="rotate(240 32 32)"><path d="M32 32V7M32 15l-5-5M32 15l5-5M32 23l-4.4-4.4M32 23l4.4-4.4"/></g><g transform="rotate(300 32 32)"><path d="M32 32V7M32 15l-5-5M32 15l5-5M32 23l-4.4-4.4M32 23l4.4-4.4"/></g><circle class="dd-p" cx="32" cy="32" r="3.4"/></g>
          <g id="x-star"><path class="dd-y" d="M32 14L37.1 27L51 27.8L40.2 36.7L43.8 50.2L32 42.6L20.2 50.2L23.8 36.7L13 27.8L26.9 27Z"/><path d="M32 22v4M24 34h3M40 34h-3M10 10l3 3M54 10l-3 3M32 4v4"/></g>
          <g id="x-bell"><path class="dd-y" d="M32 14c-8 0-12 7-12 15v9l-4 6h32l-4-6v-9c0-8-4-15-12-15z"/><circle class="dd-y" cx="32" cy="48" r="3.2"/><path d="M16 44h32M24 27c0-4 2-7 5-8"/><path class="dd-r" d="M32 13c-3-4-9-5-9-2s6 3 9 2zM32 13c3-4 9-5 9-2s-6 3-9 2z"/></g>
          <g id="x-cocoa"><path d="M44 32h3c4 0 6.4 3 6.4 6.4S51 45 47 45h-3"/><path class="dd-r" d="M14 26h30v20c0 6.4-4.4 11-11 11h-8c-6.6 0-11-4.6-11-11z"/><rect class="dd-c" x="17" y="21.6" width="7" height="6" rx="1.6" transform="rotate(-8 20.5 24.6)"/><rect class="dd-c" x="26" y="20" width="7" height="6.4" rx="1.6" transform="rotate(6 29.5 23.2)"/><rect class="dd-c" x="34.4" y="21.4" width="7" height="6" rx="1.6" transform="rotate(-4 37.9 24.4)"/><path transform="translate(29 40.6) scale(1)" d="M0-2c-2-3-6.4-1.4-4.6 2L0 4.4 4.6 0C6.4-3.4 2-5 0-2z"/><path d="M21 17c-2.4-3 2.4-5 0-8.4M29.4 16c-2.4-3 2.4-5 0-8.4M38 17c-2.4-3 2.4-5 0-8.4"/></g>
          <g id="x-candle"><path class="dd-r" d="M26 24h12v31H26z"/><path class="dd-c" d="M26 24h12v3.4c-1.4 0-1.4 3-3 3s-1-2.4-2.6-2.4-1.4 4-3 4-1.4-4-3.4-4z"/><path d="M32 24v-4"/><path class="dd-o" d="M32 20c-4.4-3-4.6-8.4-.2-14 4.6 5.6 4.4 11 .2 14z"/><path class="dd-y" d="M32 17c-1.6-1.2-1.6-3.4 0-5.4 1.6 2 1.6 4.2 0 5.4z"/><path class="dd-g" d="M32 56Q30.8 54.9 30.2 51.7Q27.8 53.1 26.7 50Q24.1 52 22.8 49.7Q20.6 51.8 19 52Q20.2 53.1 20.9 56.1Q23.2 54.9 24.3 58Q26.9 56 28.1 58.5Q30.4 56.2 32 56ZM32 56Q33.6 56.2 35.9 58.5Q37.1 56 39.7 58Q40.8 54.9 43.1 56.1Q43.8 53.1 45 52Q43.4 51.8 41.2 49.7Q39.9 52 37.3 50Q36.2 53.1 33.8 51.7Q33.2 54.9 32 56Z"/><path d="M32 56L20 52.3M32 56L44 52.3"/><circle class="dd-r" cx="30" cy="55" r="2.2"/><circle class="dd-r" cx="34" cy="55" r="2.2"/></g>
          <g id="x-pine"><path d="M8 58Q26 40 56 8"/><path class="ds-g" d="M11.7 54.3l0.2 -8.1M11.7 54.3l8.1 -0.3M14.7 51.3l0.2 -7.9M14.7 51.3l7.9 -0.3M17.8 48.1l0.2 -7.6M17.8 48.1l7.6 -0.4M21 44.8l0.2 -7.4M21 44.8l7.4 -0.4M24.3 41.4l0.1 -7.1M24.3 41.4l7.1 -0.4M27.8 37.7l0.1 -6.8M27.8 37.7l6.8 -0.4M31.4 34l0.1 -6.6M31.4 34l6.6 -0.4M35.2 30l0.1 -6.3M35.2 30l6.3 -0.4M39.1 25.9l0.1 -6M39.1 25.9l6 -0.4M43.1 21.7l0 -5.8M43.1 21.7l5.8 -0.4M47.3 17.3l0 -5.5M47.3 17.3l5.5 -0.4M51.6 12.7l0 -5.3M51.6 12.7l5.3 -0.3M56 8l0.2 -5M56 8l5 -0.2"/></g>
          <g id="x-mistletoe"><path d="M32 16L21 48M32 16l12 32M32 16v36"/><path class="dd-g" d="M26 34Q20.3 27.6 12 30Q17.7 36.4 26 34ZM28 26Q25.5 18.9 18 18Q20.5 25.1 28 26ZM38 32Q46.5 33.8 52 27Q43.5 25.2 38 32ZM36 25Q43.5 24.1 46 17Q38.5 17.9 36 25ZM32 40Q26.2 45.9 28 54Q33.8 48.1 32 40Z"/><circle class="dd-c" cx="20" cy="50" r="2.6"/><circle class="dd-c" cx="24" cy="52" r="2.6"/><circle class="dd-c" cx="43" cy="50" r="2.6"/><circle class="dd-c" cx="47" cy="47" r="2.6"/><circle class="dd-c" cx="32" cy="54" r="2.6"/><circle class="dd-c" cx="35.4" cy="55.6" r="2.6"/><path class="dd-r" d="M32 16c-4-5-11-6-11-2s7 4 11 2zM32 16c4-5 11-6 11-2s-7 4-11 2z"/></g>
          <g id="x-poinsettia"><g transform="rotate(30 32 32)"><path class="dd-g" d="M32 32Q38.6 18 32 4Q25.4 18 32 32Z"/><path d="M32 32V9"/></g><g transform="rotate(90 32 32)"><path class="dd-g" d="M32 32Q38.6 18 32 4Q25.4 18 32 32Z"/><path d="M32 32V9"/></g><g transform="rotate(150 32 32)"><path class="dd-g" d="M32 32Q38.6 18 32 4Q25.4 18 32 32Z"/><path d="M32 32V9"/></g><g transform="rotate(210 32 32)"><path class="dd-g" d="M32 32Q38.6 18 32 4Q25.4 18 32 32Z"/><path d="M32 32V9"/></g><g transform="rotate(270 32 32)"><path class="dd-g" d="M32 32Q38.6 18 32 4Q25.4 18 32 32Z"/><path d="M32 32V9"/></g><g transform="rotate(330 32 32)"><path class="dd-g" d="M32 32Q38.6 18 32 4Q25.4 18 32 32Z"/><path d="M32 32V9"/></g><g transform="rotate(0 32 32)"><path class="dd-r" d="M32 32Q38 20.5 32 9Q26 20.5 32 32Z"/><path d="M32 30V13"/></g><g transform="rotate(60 32 32)"><path class="dd-r" d="M32 32Q38 20.5 32 9Q26 20.5 32 32Z"/><path d="M32 30V13"/></g><g transform="rotate(120 32 32)"><path class="dd-r" d="M32 32Q38 20.5 32 9Q26 20.5 32 32Z"/><path d="M32 30V13"/></g><g transform="rotate(180 32 32)"><path class="dd-r" d="M32 32Q38 20.5 32 9Q26 20.5 32 32Z"/><path d="M32 30V13"/></g><g transform="rotate(240 32 32)"><path class="dd-r" d="M32 32Q38 20.5 32 9Q26 20.5 32 32Z"/><path d="M32 30V13"/></g><g transform="rotate(300 32 32)"><path class="dd-r" d="M32 32Q38 20.5 32 9Q26 20.5 32 32Z"/><path d="M32 30V13"/></g><circle class="dd-y" cx="32" cy="29.4" r="1.9"/><circle class="dd-y" cx="34.6" cy="31.4" r="1.9"/><circle class="dd-y" cx="33.6" cy="34.4" r="1.9"/><circle class="dd-y" cx="30.4" cy="34.4" r="1.9"/><circle class="dd-y" cx="29.4" cy="31.4" r="1.9"/></g>
          <g id="x-house"><path class="dd-b" d="M14 32h36v24H14z"/><path class="dd-r" d="M41 22v-8h6v14"/><path class="dd-c" d="M10 34L32 13l22 21"/><path d="M12 34c2 3 5 3 7 0 2 3 5 3 7 0 2 3 5 3 7 0 2 3 5 3 7 0 2 3 5 3 7 0 2 3 5 3 6 0"/><path class="dd-r" d="M27 56V46c0-3 2-5 5-5s5 2 5 5v10z"/><path class="dd-y" d="M17.6 38h7v6.4h-7zM39.4 38h7v6.4h-7z"/><path d="M21.1 38v6.4M17.6 41.2h7M42.9 38v6.4M39.4 41.2h7"/><circle class="dd-g" cx="18" cy="50" r="1.3"/><circle class="dd-g" cx="46" cy="50" r="1.3"/><circle class="dd-g" cx="32" cy="37" r="1.3"/></g>
          <g id="x-santahat"><path class="dd-r" d="M12 46C15 30 24 18 40 14c6-1.4 11 2 13 8-5-3-9-1.6-11 2.4L36 46z"/><rect class="dd-c" x="7" y="43" width="36" height="9" rx="4.5"/><circle class="dd-c" cx="52" cy="26" r="5.5"/></g>
          <g id="x-globe"><circle class="dd-p" cx="32" cy="28" r="17"/><path d="M16.4 34c5-2 10.4-3 15.6-3s10.6 1 15.6 3"/><path class="dd-g" d="M32 16.6l-6 9.4h3.4l-4.4 6.4h14l-4.4-6.4H38z"/><circle class="dd-c" cx="22" cy="20" r="1.1"/><circle class="dd-c" cx="41" cy="18" r="1.1"/><circle class="dd-c" cx="44" cy="27" r="1.1"/><circle class="dd-c" cx="20" cy="28" r="1.1"/><circle class="dd-c" cx="36" cy="13.6" r="1.1"/><circle class="dd-c" cx="26" cy="14" r="1.1"/><path class="dd-r" d="M15 44c0-2 2-3 4-3h26c2 0 4 1 4 3l-3 13H18z"/></g>
          <g id="x-pinecone"><path class="dd-b" d="M32 10c8 0 13 10 13 22s-5 22-13 24c-8-2-13-12-13-24s5-22 13-22z"/><path d="M22 22c3 3 7 3 10 0 3 3 7 3 10 0M20 30c4 3 8 3 12 0 4 3 8 3 12 0M20 38c4 3 8 3 12 0 4 3 8 3 12 0M22 46c3 3 7 3 10 0 3 3 7 3 10 0M32 10V5"/><path class="ds-g" d="M32 7c-4-4-10-4-14-2M32 7c4-4 10-4 14-2"/></g>
          <g id="x-cookie"><path class="dd-b" d="M32 10L38.5 24.1L53.9 25.9L42.5 36.4L45.5 51.6L32 44L18.5 51.6L21.5 36.4L10.1 25.9L25.5 24.1Z"/><path class="ds-c" d="M32 16.5L36.5 26.9L47.7 27.9L39.2 35.3L41.7 46.3L32 40.6L22.3 46.3L24.8 35.3L16.3 27.9L27.5 26.9Z"/><path class="ds-r" d="M30 27l2 1M36 33l1 2M27 36l2-1M33 40h2"/></g>
          <g id="x-lantern"><circle cx="32" cy="7.6" r="3"/><path class="dd-r" d="M21 17l11-6.4L43 17z"/><path class="dd-y" d="M23 17h18v31H23z"/><path d="M23 17v31M41 17v31"/><path class="dd-c" d="M29 34h6v12h-6z"/><path class="dd-o" d="M32 32.6c-2.4-2-2.4-5 0-8 2.4 3 2.4 6 0 8z"/><path class="dd-r" d="M20 48h24v5H20z"/><path d="M23 53v3M41 53v3"/></g>
          <g id="x-reindeer"><path d="M26 25c-1-5-4-9-8-12M22 19l-6 1M20 16l-2-5M38 25c1-5 4-9 8-12M42 19l6 1M44 16l2-5"/><path class="dd-b" d="M22 31c-5-2-10-1-12 2 4 2 9 2 12 0zM42 31c5-2 10-1 12 2-4 2-9 2-12 0z"/><path class="dd-b" d="M32 24c-7 0-11 6-11 13 0 8 5 15 11 18 6-3 11-10 11-18 0-7-4-13-11-13z"/><path class="dd-c" d="M25.6 45c2 5 4 8 6.4 8s4.4-3 6.4-8c-2-1-4-1.4-6.4-1.4s-4.4.4-6.4 1.4z"/><circle class="dd-k" cx="28" cy="36" r="1.5"/><circle class="dd-k" cx="36" cy="36" r="1.5"/><circle class="dd-r" cx="32" cy="48" r="3.4"/></g>
          <g id="x-candy"><path class="dd-c" d="M24 32l-10-7v14zM40 32l10-7v14z"/><path d="M18 28l3 2M18 36l3-2M46 28l-3 2M46 36l-3-2"/><circle class="dd-r" cx="32" cy="32" r="8.5"/><path d="M28 30c1.6-3 7-3 8 1s-4 5-6 2"/></g>
          <g id="x-pudding"><path class="dd-c" d="M8 41h48c0 3-3 5-6 5H14c-3 0-6-2-6-5z"/><path class="dd-b" d="M14 41c0-12 8-20 18-20s18 8 18 20z"/><path class="dd-c" d="M17 30c3-5 9-8 15-8s12 3 15 8c-2 2-4 0-5 2s-3 3-5 1-3 2-5 1-3-2-5 0-3 1-4-1-3-2-4 0-2 0-2-2z"/><circle class="dd-k" cx="22" cy="36" r="0.8"/><circle class="dd-k" cx="28" cy="38" r="0.8"/><circle class="dd-k" cx="38" cy="36" r="0.8"/><circle class="dd-k" cx="43" cy="38" r="0.8"/><circle class="dd-k" cx="33" cy="37" r="0.8"/><path class="dd-g" d="M32 22Q31.3 20.9 31.4 18.4Q29.4 19.1 29.2 16.5Q26.8 17.7 26.3 15.7Q24.3 17.1 23 17Q23.7 18 23.7 20.5Q25.6 19.9 25.8 22.5Q28.1 21.3 28.6 23.4Q30.7 22 32 22ZM32 22Q33.3 22 35.4 23.4Q35.9 21.3 38.2 22.5Q38.4 19.9 40.3 20.5Q40.3 18 41 17Q39.7 17.1 37.7 15.7Q37.2 17.7 34.8 16.5Q34.6 19.1 32.6 18.4Q32.7 20.9 32 22Z"/><path d="M32 22L23.7 17.4M32 22L40.3 17.4"/><circle class="dd-r" cx="30.6" cy="20.6" r="1.9"/><circle class="dd-r" cx="33.6" cy="20" r="1.9"/></g>
          <g id="xf-flake"><path d="M0-6v12M-5.2-3l10.4 6M-5.2 3l10.4-6"/></g>
          <g id="xf-star"><path class="dd-y" d="M0-5.5l1.6 3.4 3.8.5-2.8 2.6.7 3.7L0 2.9l-3.3 1.8.7-3.7-2.8-2.6 3.8-.5z"/></g>
          <g id="xf-sparkle"><path class="dd-y" d="M0-6c.6 4 2 5.4 6 6-4 .6-5.4 2-6 6-.6-4-2-5.4-6-6 4-.6 5.4-2 6-6z"/></g>
          <g id="xf-dots"><circle class="dd-k" r="1.3"/><circle class="dd-k" cx="5" cy="3" r="1"/><circle class="dd-k" cx="-3" cy="5" r=".9"/></g>
          <g id="xf-heart"><path class="dd-r" d="M0-2c-2-3-6.4-1.4-4.6 2L0 4.4 4.6 0C6.4-3.4 2-5 0-2z"/></g>
          <g id="xf-berries"><circle class="dd-r" cx="0" cy="0" r="1.8"/><circle class="dd-r" cx="3.4" cy="1.4" r="1.8"/><circle class="dd-r" cx="0.8" cy="3.6" r="1.8"/></g>
          <g id="xb-merry-christmas"><path class="dd-r" d="M-76-3h14v14h-14l4.4-7z"/><path class="dd-r" d="M76-3H62v14h14l-4.4-7z"/><path class="dd-k" d="M-62 11l-2-6h2zM62 11l2-6h-2z"/><path class="dd-c" d="M-64-9c22 3 106 3 128 0v14c-22 3-106 3-128 0z"/><text class="dd-text" y="4.0" font-size="11" text-anchor="middle">merry christmas</text></g>
          <g id="xb-let-it-snow"><path class="dd-r" d="M-76-3h14v14h-14l4.4-7z"/><path class="dd-r" d="M76-3H62v14h14l-4.4-7z"/><path class="dd-k" d="M-62 11l-2-6h2zM62 11l2-6h-2z"/><path class="dd-c" d="M-64-9c22 3 106 3 128 0v14c-22 3-106 3-128 0z"/><text class="dd-text" y="4.3" font-size="12" text-anchor="middle">let it snow</text></g>
          <g id="xb-ho-ho-ho"><path class="dd-r" d="M-76-3h14v14h-14l4.4-7z"/><path class="dd-r" d="M76-3H62v14h14l-4.4-7z"/><path class="dd-k" d="M-62 11l-2-6h2zM62 11l2-6h-2z"/><path class="dd-c" d="M-64-9c22 3 106 3 128 0v14c-22 3-106 3-128 0z"/><text class="dd-text" y="4.5" font-size="12.5" text-anchor="middle">ho ho ho</text></g>
          <pattern id="xmas-tile" width="960" height="960" patternUnits="userSpaceOnUse">
            <use href="#xb-merry-christmas" transform="translate(676.0 787.6) rotate(4.6)"/>
            <use href="#xb-let-it-snow" transform="translate(168.6 624.1) rotate(-7.5)"/>
            <use href="#xb-ho-ho-ho" transform="translate(194.5 43.1) rotate(-4.8)"/>
            <use href="#xb-ho-ho-ho" transform="translate(194.5 1003.1) rotate(-4.8)"/>
            <use href="#x-snowman" transform="translate(583.1 -27.6) rotate(14) scale(1.23) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(583.1 932.4) rotate(14) scale(1.23) translate(-32 -32)"/>
            <use href="#x-drop" transform="translate(620.1 299.7) rotate(21) scale(1.15) translate(-32 -32)"/>
            <use href="#x-snowflake" transform="translate(565.1 113.2) rotate(46) scale(1.00) translate(-32 -32)"/>
            <use href="#x-star" transform="translate(-5.6 721.9) rotate(-14) scale(1.27) translate(-32 -32)"/>
            <use href="#x-star" transform="translate(954.4 721.9) rotate(-14) scale(1.27) translate(-32 -32)"/>
            <use href="#x-ball" transform="translate(141.6 305.7) rotate(-6) scale(0.90) translate(-32 -32)"/>
            <use href="#x-gingerbread" transform="translate(848.0 789.6) rotate(-12) scale(1.33) translate(-32 -32)"/>
            <use href="#x-bow" transform="translate(380.7 374.4) rotate(-20) scale(1.27) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(704.6 227.6) rotate(-16) scale(1.11) translate(-32 -32)"/>
            <use href="#x-bell" transform="translate(569.4 567.8) rotate(-3) scale(0.98) translate(-32 -32)"/>
            <use href="#x-candycane" transform="translate(656.8 135.2) rotate(48) scale(0.88) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(351.0 743.3) rotate(21) scale(0.90) translate(-32 -32)"/>
            <use href="#x-mitten" transform="translate(262.6 891.8) rotate(-41) scale(1.01) translate(-32 -32)"/>
            <use href="#x-star" transform="translate(747.3 538.6) rotate(-25) scale(0.95) translate(-32 -32)"/>
            <use href="#x-pudding" transform="translate(477.1 638.6) rotate(12) scale(1.13) translate(-32 -32)"/>
            <use href="#x-bell" transform="translate(478.3 162.2) rotate(0) scale(1.37) translate(-32 -32)"/>
            <use href="#x-holly" transform="translate(191.2 692.3) rotate(1) scale(1.01) translate(-32 -32)"/>
            <use href="#x-bow" transform="translate(760.5 106.5) rotate(-9) scale(1.20) translate(-32 -32)"/>
            <use href="#x-drop" transform="translate(412.7 47.6) rotate(18) scale(1.29) translate(-32 -32)"/>
            <use href="#x-drop" transform="translate(412.7 1007.6) rotate(18) scale(1.29) translate(-32 -32)"/>
            <use href="#x-mitten" transform="translate(678.9 425.2) rotate(21) scale(1.36) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(293.9 514.7) rotate(16) scale(1.16) translate(-32 -32)"/>
            <use href="#x-holly" transform="translate(450.8 281.8) rotate(47) scale(0.94) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(869.4 -55.1) rotate(10) scale(1.25) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(869.4 904.9) rotate(10) scale(1.25) translate(-32 -32)"/>
            <use href="#x-poinsettia" transform="translate(868.0 400.1) rotate(5) scale(1.25) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(-9.8 51.5) rotate(11) scale(1.31) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(-9.8 1011.5) rotate(11) scale(1.31) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(950.2 51.5) rotate(11) scale(1.31) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(950.2 1011.5) rotate(11) scale(1.31) translate(-32 -32)"/>
            <use href="#x-holly" transform="translate(774.8 385.3) rotate(17) scale(1.23) translate(-32 -32)"/>
            <use href="#x-candy" transform="translate(131.4 189.8) rotate(6) scale(1.16) translate(-32 -32)"/>
            <use href="#x-mistletoe" transform="translate(363.6 839.7) rotate(16) scale(1.38) translate(-32 -32)"/>
            <use href="#x-globe" transform="translate(496.9 72.2) rotate(-22) scale(1.23) translate(-32 -32)"/>
            <use href="#x-wreath" transform="translate(539.2 786.3) rotate(-10) scale(1.33) translate(-32 -32)"/>
            <use href="#x-ball" transform="translate(421.2 541.0) rotate(-7) scale(1.37) translate(-32 -32)"/>
            <use href="#x-wreath" transform="translate(900.9 148.3) rotate(0) scale(1.25) translate(-32 -32)"/>
            <use href="#x-gingerbread" transform="translate(224.0 331.0) rotate(0) scale(0.92) translate(-32 -32)"/>
            <use href="#x-pinecone" transform="translate(158.2 849.4) rotate(5) scale(1.14) translate(-32 -32)"/>
            <use href="#x-candycane" transform="translate(382.9 200.3) rotate(-9) scale(0.92) translate(-32 -32)"/>
            <use href="#x-candy" transform="translate(736.1 657.8) rotate(-10) scale(1.31) translate(-32 -32)"/>
            <use href="#x-candycane" transform="translate(335.3 626.1) rotate(25) scale(1.07) translate(-32 -32)"/>
            <use href="#x-santahat" transform="translate(269.2 727.4) rotate(-8) scale(1.02) translate(-32 -32)"/>
            <use href="#x-snowflake" transform="translate(313.6 152.4) rotate(-16) scale(0.91) translate(-32 -32)"/>
            <use href="#x-reindeer" transform="translate(843.7 706.1) rotate(2) scale(0.97) translate(-32 -32)"/>
            <use href="#x-cocoa" transform="translate(564.4 212.6) rotate(0) scale(0.99) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(69.4 683.8) rotate(9) scale(1.04) translate(-32 -32)"/>
            <use href="#x-pinecone" transform="translate(69.7 370.8) rotate(6) scale(1.33) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(727.1 -29.2) rotate(-12) scale(1.34) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(727.1 930.8) rotate(-12) scale(1.34) translate(-32 -32)"/>
            <use href="#x-cocoa" transform="translate(-6.3 415.5) rotate(-9) scale(1.07) translate(-32 -32)"/>
            <use href="#x-cocoa" transform="translate(953.7 415.5) rotate(-9) scale(1.07) translate(-32 -32)"/>
            <use href="#x-cookie" transform="translate(307.5 292.4) rotate(-16) scale(1.01) translate(-32 -32)"/>
            <use href="#x-pine" transform="translate(-19.2 293.2) rotate(38) scale(0.88) translate(-32 -32)"/>
            <use href="#x-pine" transform="translate(940.8 293.2) rotate(38) scale(0.88) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(313.2 430.6) rotate(17) scale(0.89) translate(-32 -32)"/>
            <use href="#x-mistletoe" transform="translate(-22.4 556.2) rotate(-47) scale(1.11) translate(-32 -32)"/>
            <use href="#x-mistletoe" transform="translate(937.6 556.2) rotate(-47) scale(1.11) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(375.1 -30.8) rotate(14) scale(1.28) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(375.1 929.2) rotate(14) scale(1.28) translate(-32 -32)"/>
            <use href="#x-lantern" transform="translate(216.8 212.0) rotate(14) scale(0.92) translate(-32 -32)"/>
            <use href="#x-house" transform="translate(147.0 534.6) rotate(-5) scale(1.30) translate(-32 -32)"/>
            <use href="#x-poinsettia" transform="translate(148.4 421.2) rotate(5) scale(1.25) translate(-32 -32)"/>
            <use href="#x-stocking" transform="translate(835.4 323.5) rotate(6) scale(1.17) translate(-32 -32)"/>
            <use href="#x-cookie" transform="translate(-36.1 849.7) rotate(-31) scale(0.96) translate(-32 -32)"/>
            <use href="#x-cookie" transform="translate(923.9 849.7) rotate(-31) scale(0.96) translate(-32 -32)"/>
            <use href="#x-santahat" transform="translate(651.9 682.8) rotate(-9) scale(1.04) translate(-32 -32)"/>
            <use href="#x-snowflake" transform="translate(859.2 509.4) rotate(-41) scale(1.22) translate(-32 -32)"/>
            <use href="#x-pine" transform="translate(541.8 354.0) rotate(28) scale(0.91) translate(-32 -32)"/>
            <use href="#x-stocking" transform="translate(98.3 905.2) rotate(15) scale(0.99) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(462.2 747.6) rotate(17) scale(1.03) translate(-32 -32)"/>
            <use href="#x-drop" transform="translate(574.5 676.2) rotate(-19) scale(0.91) translate(-32 -32)"/>
            <use href="#x-snowflake" transform="translate(777.4 222.8) rotate(29) scale(1.09) translate(-32 -32)"/>
            <use href="#x-star" transform="translate(48.9 110.1) rotate(37) scale(1.01) translate(-32 -32)"/>
            <use href="#x-ball" transform="translate(716.0 311.4) rotate(0) scale(0.98) translate(-32 -32)"/>
            <use href="#x-gingerbread" transform="translate(455.1 455.5) rotate(-17) scale(1.27) translate(-32 -32)"/>
            <use href="#x-bow" transform="translate(63.5 231.5) rotate(-17) scale(1.09) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(-10.0 -29.9) rotate(5) scale(0.89) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(-10.0 930.1) rotate(5) scale(0.89) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(950.0 -29.9) rotate(5) scale(0.89) translate(-32 -32)"/>
            <use href="#x-snowman" transform="translate(950.0 930.1) rotate(5) scale(0.89) translate(-32 -32)"/>
            <use href="#x-bell" transform="translate(60.6 513.0) rotate(-11) scale(0.96) translate(-32 -32)"/>
            <use href="#x-candycane" transform="translate(674.1 586.0) rotate(43) scale(1.08) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(639.4 52.4) rotate(21) scale(1.05) translate(-32 -32)"/>
            <use href="#x-mitten" transform="translate(800.6 29.7) rotate(-21) scale(1.05) translate(-32 -32)"/>
            <use href="#x-mitten" transform="translate(800.6 989.7) rotate(-21) scale(1.05) translate(-32 -32)"/>
            <use href="#x-star" transform="translate(469.6 873.6) rotate(42) scale(1.32) translate(-32 -32)"/>
            <use href="#x-pudding" transform="translate(222.5 101.7) rotate(16) scale(1.05) translate(-32 -32)"/>
            <use href="#x-bell" transform="translate(37.0 803.1) rotate(-17) scale(1.18) translate(-32 -32)"/>
            <use href="#x-bell" transform="translate(997.0 803.1) rotate(-17) scale(1.18) translate(-32 -32)"/>
            <use href="#x-holly" transform="translate(884.8 637.3) rotate(30) scale(1.04) translate(-32 -32)"/>
            <use href="#x-bow" transform="translate(804.0 457.7) rotate(-7) scale(1.03) translate(-32 -32)"/>
            <use href="#x-drop" transform="translate(206.5 468.1) rotate(9) scale(0.91) translate(-32 -32)"/>
            <use href="#x-mitten" transform="translate(41.2 295.2) rotate(-8) scale(0.95) translate(-32 -32)"/>
            <use href="#x-mitten" transform="translate(1001.2 295.2) rotate(-8) scale(0.95) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(579.3 487.2) rotate(20) scale(1.03) translate(-32 -32)"/>
            <use href="#x-holly" transform="translate(321.2 80.5) rotate(12) scale(0.94) translate(-32 -32)"/>
            <use href="#x-gift" transform="translate(283.4 213.1) rotate(-19) scale(0.94) translate(-32 -32)"/>
            <use href="#x-poinsettia" transform="translate(127.4 749.5) rotate(-8) scale(1.23) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(650.0 876.9) rotate(11) scale(1.05) translate(-32 -32)"/>
            <use href="#x-holly" transform="translate(73.8 42.1) rotate(24) scale(0.89) translate(-32 -32)"/>
            <use href="#x-candy" transform="translate(878.3 24.2) rotate(-39) scale(0.96) translate(-32 -32)"/>
            <use href="#x-candy" transform="translate(878.3 984.2) rotate(-39) scale(0.96) translate(-32 -32)"/>
            <use href="#x-mistletoe" transform="translate(781.8 841.9) rotate(18) scale(0.96) translate(-32 -32)"/>
            <use href="#x-globe" transform="translate(0.5 629.2) rotate(-8) scale(1.00) translate(-32 -32)"/>
            <use href="#x-globe" transform="translate(960.5 629.2) rotate(-8) scale(1.00) translate(-32 -32)"/>
            <use href="#x-wreath" transform="translate(163.8 -16.1) rotate(2) scale(1.06) translate(-32 -32)"/>
            <use href="#x-wreath" transform="translate(163.8 943.9) rotate(2) scale(1.06) translate(-32 -32)"/>
            <use href="#x-ball" transform="translate(264.8 796.1) rotate(6) scale(0.93) translate(-32 -32)"/>
            <use href="#x-wreath" transform="translate(593.6 399.9) rotate(-7) scale(0.88) translate(-32 -32)"/>
            <use href="#x-gingerbread" transform="translate(395.2 681.7) rotate(5) scale(1.32) translate(-32 -32)"/>
            <use href="#x-pinecone" transform="translate(380.5 298.8) rotate(-3) scale(1.08) translate(-32 -32)"/>
            <use href="#x-candycane" transform="translate(847.1 248.5) rotate(-13) scale(1.10) translate(-32 -32)"/>
            <use href="#x-candy" transform="translate(302.0 361.9) rotate(-5) scale(0.91) translate(-32 -32)"/>
            <use href="#x-candycane" transform="translate(80.9 577.7) rotate(13) scale(0.91) translate(-32 -32)"/>
            <use href="#x-santahat" transform="translate(502.4 -4.7) rotate(20) scale(0.97) translate(-32 -32)"/>
            <use href="#x-santahat" transform="translate(502.4 955.3) rotate(20) scale(0.97) translate(-32 -32)"/>
            <use href="#x-snowflake" transform="translate(458.3 366.2) rotate(0) scale(1.02) translate(-32 -32)"/>
            <use href="#x-reindeer" transform="translate(297.0 -5.3) rotate(9) scale(0.92) translate(-32 -32)"/>
            <use href="#x-reindeer" transform="translate(297.0 954.7) rotate(9) scale(0.92) translate(-32 -32)"/>
            <use href="#x-cocoa" transform="translate(503.6 523.5) rotate(16) scale(0.89) translate(-32 -32)"/>
            <use href="#x-candle" transform="translate(654.0 505.1) rotate(-2) scale(0.88) translate(-32 -32)"/>
            <use href="#x-pinecone" transform="translate(820.3 585.1) rotate(-16) scale(1.09) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(635.1 221.6) rotate(-13) scale(0.90) translate(-32 -32)"/>
            <use href="#x-cocoa" transform="translate(230.0 398.8) rotate(-9) scale(0.89) translate(-32 -32)"/>
            <use href="#x-cookie" transform="translate(527.1 427.8) rotate(-6) scale(0.97) translate(-32 -32)"/>
            <use href="#x-pine" transform="translate(121.4 111.3) rotate(22) scale(0.95) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(-35.9 227.7) rotate(-15) scale(1.03) translate(-32 -32)"/>
            <use href="#x-tree" transform="translate(924.1 227.7) rotate(-15) scale(1.03) translate(-32 -32)"/>
            <use href="#x-mistletoe" transform="translate(377.4 465.9) rotate(-40) scale(1.15) translate(-32 -32)"/>
            <use href="#xf-heart" transform="translate(276.7 110.1) rotate(11) scale(1.16)"/>
            <use href="#xf-sparkle" transform="translate(320.1 697.7) rotate(11) scale(1.56)"/>
            <use href="#xf-star" transform="translate(707.6 744.6) rotate(15) scale(1.64)"/>
            <use href="#xf-dots" transform="translate(786.3 733.0) rotate(-5) scale(1.02)"/>
            <use href="#xf-sparkle" transform="translate(432.8 804.9) rotate(-31) scale(1.22)"/>
            <use href="#xf-dots" transform="translate(274.8 587.2) rotate(2) scale(1.50)"/>
            <use href="#xf-berries" transform="translate(223.1 927.9) rotate(-31) scale(1.17)"/>
            <use href="#xf-star" transform="translate(536.6 856.3) rotate(13) scale(1.31)"/>
            <use href="#xf-flake" transform="translate(935.5 783.8) rotate(32) scale(1.35)"/>
            <use href="#xf-dots" transform="translate(505.6 716.1) rotate(0) scale(1.37)"/>
            <use href="#xf-dots" transform="translate(699.4 28.8) rotate(38) scale(1.22)"/>
            <use href="#xf-berries" transform="translate(224.8 522.7) rotate(23) scale(0.97)"/>
            <use href="#xf-berries" transform="translate(705.0 89.7) rotate(25) scale(0.90)"/>
            <use href="#xf-dots" transform="translate(816.7 141.5) rotate(6) scale(1.18)"/>
            <use href="#xf-sparkle" transform="translate(885.8 293.5) rotate(4) scale(0.92)"/>
            <use href="#xf-star" transform="translate(60.7 460.7) rotate(-35) scale(1.11)"/>
            <use href="#xf-flake" transform="translate(891.9 347.4) rotate(-25) scale(0.91)"/>
            <use href="#xf-heart" transform="translate(95.2 472.6) rotate(7) scale(1.28)"/>
            <use href="#xf-berries" transform="translate(849.4 69.2) rotate(31) scale(1.36)"/>
            <use href="#xf-dots" transform="translate(918.4 491.5) rotate(-32) scale(1.54)"/>
            <use href="#xf-dots" transform="translate(71.9 173.0) rotate(-39) scale(1.16)"/>
            <use href="#xf-dots" transform="translate(256.5 670.5) rotate(13) scale(0.92)"/>
            <use href="#xf-star" transform="translate(262.5 448.6) rotate(-34) scale(1.17)"/>
            <use href="#xf-flake" transform="translate(365.6 136.5) rotate(3) scale(1.59)"/>
            <use href="#xf-sparkle" transform="translate(333.9 568.8) rotate(-22) scale(1.08)"/>
            <use href="#xf-dots" transform="translate(5.2 483.2) rotate(26) scale(0.97)"/>
            <use href="#xf-dots" transform="translate(965.2 483.2) rotate(26) scale(0.97)"/>
            <use href="#xf-berries" transform="translate(540.2 292.8) rotate(3) scale(1.08)"/>
            <use href="#xf-heart" transform="translate(764.5 294.4) rotate(17) scale(1.26)"/>
            <use href="#xf-heart" transform="translate(215.6 745.1) rotate(37) scale(1.30)"/>
            <use href="#xf-heart" transform="translate(724.3 868.1) rotate(-35) scale(1.36)"/>
            <use href="#xf-berries" transform="translate(403.3 142.8) rotate(39) scale(1.57)"/>
            <use href="#xf-flake" transform="translate(179.0 141.9) rotate(-32) scale(0.92)"/>
            <use href="#xf-heart" transform="translate(282.5 652.6) rotate(40) scale(1.51)"/>
            <use href="#xf-dots" transform="translate(608.5 831.7) rotate(-4) scale(1.48)"/>
            <use href="#xf-star" transform="translate(319.8 788.3) rotate(-27) scale(1.02)"/>
            <use href="#xf-flake" transform="translate(437.0 932.1) rotate(18) scale(1.03)"/>
            <use href="#xf-flake" transform="translate(75.9 845.2) rotate(12) scale(1.25)"/>
            <use href="#xf-berries" transform="translate(743.9 167.6) rotate(-21) scale(0.94)"/>
            <use href="#xf-sparkle" transform="translate(556.6 33.8) rotate(7) scale(1.47)"/>
            <use href="#xf-heart" transform="translate(225.5 837.3) rotate(35) scale(1.46)"/>
            <use href="#xf-star" transform="translate(541.8 724.8) rotate(10) scale(0.98)"/>
            <use href="#xf-berries" transform="translate(716.9 481.7) rotate(0) scale(1.69)"/>
            <use href="#xf-star" transform="translate(185.5 372.2) rotate(-21) scale(1.49)"/>
            <use href="#xf-flake" transform="translate(44.4 -10.2) rotate(-1) scale(1.47)"/>
            <use href="#xf-flake" transform="translate(44.4 949.8) rotate(-1) scale(1.47)"/>
            <use href="#xf-heart" transform="translate(385.3 106.9) rotate(12) scale(0.90)"/>
            <use href="#xf-sparkle" transform="translate(831.2 847.8) rotate(20) scale(1.04)"/>
            <use href="#xf-berries" transform="translate(603.8 160.5) rotate(-10) scale(1.02)"/>
            <use href="#xf-berries" transform="translate(854.1 189.0) rotate(17) scale(1.07)"/>
            <use href="#xf-berries" transform="translate(743.7 34.0) rotate(9) scale(1.44)"/>
            <use href="#xf-star" transform="translate(580.3 862.9) rotate(28) scale(1.39)"/>
            <use href="#xf-star" transform="translate(182.1 777.4) rotate(3) scale(1.12)"/>
            <use href="#xf-star" transform="translate(7.4 340.3) rotate(-23) scale(1.30)"/>
            <use href="#xf-star" transform="translate(967.4 340.3) rotate(-23) scale(1.30)"/>
            <use href="#xf-flake" transform="translate(922.8 365.0) rotate(-12) scale(1.51)"/>
            <use href="#xf-dots" transform="translate(328.8 238.5) rotate(34) scale(1.33)"/>
            <use href="#xf-dots" transform="translate(109.3 810.5) rotate(-8) scale(1.27)"/>
            <use href="#xf-heart" transform="translate(395.4 617.9) rotate(9) scale(1.61)"/>
            <use href="#xf-heart" transform="translate(18.1 871.8) rotate(3) scale(1.25)"/>
            <use href="#xf-flake" transform="translate(786.0 785.4) rotate(4) scale(1.15)"/>
            <use href="#xf-sparkle" transform="translate(539.9 611.4) rotate(16) scale(1.16)"/>
            <use href="#xf-dots" transform="translate(577.8 735.2) rotate(26) scale(1.08)"/>
            <use href="#xf-sparkle" transform="translate(185.0 265.1) rotate(38) scale(1.08)"/>
            <use href="#xf-berries" transform="translate(617.9 611.6) rotate(-10) scale(0.97)"/>
            <use href="#xf-sparkle" transform="translate(368.0 577.0) rotate(-16) scale(1.17)"/>
            <use href="#xf-dots" transform="translate(895.9 698.5) rotate(-25) scale(1.23)"/>
            <use href="#xf-heart" transform="translate(845.2 119.6) rotate(-38) scale(1.12)"/>
            <use href="#xf-berries" transform="translate(639.1 374.2) rotate(11) scale(1.40)"/>
            <use href="#xf-sparkle" transform="translate(482.7 582.2) rotate(19) scale(0.93)"/>
            <use href="#xf-flake" transform="translate(437.5 219.3) rotate(1) scale(1.55)"/>
            <use href="#xf-star" transform="translate(223.7 556.1) rotate(11) scale(1.47)"/>
            <use href="#xf-berries" transform="translate(353.0 33.0) rotate(-4) scale(1.29)"/>
            <use href="#xf-flake" transform="translate(784.4 902.5) rotate(38) scale(1.21)"/>
            <use href="#xf-berries" transform="translate(116.4 6.9) rotate(-20) scale(0.93)"/>
            <use href="#xf-berries" transform="translate(116.4 966.9) rotate(-20) scale(0.93)"/>
            <use href="#xf-berries" transform="translate(765.7 591.2) rotate(-5) scale(1.06)"/>
            <use href="#xf-heart" transform="translate(133.2 253.7) rotate(-22) scale(1.21)"/>
            <use href="#xf-berries" transform="translate(53.4 431.4) rotate(-7) scale(0.93)"/>
            <use href="#xf-star" transform="translate(60.1 750.5) rotate(-3) scale(1.25)"/>
            <use href="#xf-heart" transform="translate(523.3 255.4) rotate(-29) scale(1.44)"/>
            <use href="#xf-heart" transform="translate(796.3 524.2) rotate(-12) scale(1.29)"/>
            <use href="#xf-dots" transform="translate(588.5 622.7) rotate(13) scale(1.53)"/>
            <use href="#xf-heart" transform="translate(687.1 359.0) rotate(-10) scale(1.33)"/>
            <use href="#xf-star" transform="translate(322.2 894.9) rotate(-37) scale(0.95)"/>
            <use href="#xf-star" transform="translate(235.2 261.7) rotate(-24) scale(1.35)"/>
            <use href="#xf-heart" transform="translate(161.4 238.6) rotate(-37) scale(1.02)"/>
            <use href="#xf-sparkle" transform="translate(12.7 255.4) rotate(-7) scale(1.04)"/>
            <use href="#xf-sparkle" transform="translate(572.8 269.5) rotate(37) scale(1.18)"/>
            <use href="#xf-berries" transform="translate(508.4 286.3) rotate(3) scale(1.12)"/>
            <use href="#xf-berries" transform="translate(672.9 4.6) rotate(9) scale(1.27)"/>
            <use href="#xf-berries" transform="translate(672.9 964.6) rotate(9) scale(1.27)"/>
            <use href="#xf-sparkle" transform="translate(677.2 274.9) rotate(-29) scale(1.00)"/>
            <use href="#xf-heart" transform="translate(527.8 891.5) rotate(-37) scale(0.97)"/>
            <use href="#xf-star" transform="translate(220.3 163.2) rotate(-13) scale(0.93)"/>
            <use href="#xf-star" transform="translate(741.3 723.7) rotate(5) scale(1.55)"/>
            <use href="#xf-sparkle" transform="translate(751.1 463.9) rotate(-8) scale(1.01)"/>
            <use href="#xf-dots" transform="translate(468.9 809.1) rotate(-24) scale(1.55)"/>
            <use href="#xf-heart" transform="translate(700.2 516.2) rotate(23) scale(1.13)"/>
            <use href="#xf-star" transform="translate(902.6 757.4) rotate(4) scale(1.41)"/>
            <use href="#xf-berries" transform="translate(360.3 534.5) rotate(-38) scale(0.96)"/>
            <use href="#xf-star" transform="translate(517.6 570.3) rotate(18) scale(0.96)"/>
            <use href="#xf-flake" transform="translate(797.9 649.1) rotate(-9) scale(1.20)"/>
            <use href="#xf-flake" transform="translate(-0.6 168.6) rotate(-35) scale(1.16)"/>
            <use href="#xf-flake" transform="translate(959.4 168.6) rotate(-35) scale(1.16)"/>
            <use href="#xf-sparkle" transform="translate(690.9 171.5) rotate(-30) scale(1.20)"/>
            <use href="#xf-dots" transform="translate(203.0 900.9) rotate(16) scale(1.33)"/>
            <use href="#xf-berries" transform="translate(621.7 727.7) rotate(4) scale(1.08)"/>
            <use href="#xf-sparkle" transform="translate(504.4 318.2) rotate(35) scale(1.25)"/>
            <use href="#xf-flake" transform="translate(207.6 797.0) rotate(-32) scale(1.39)"/>
            <use href="#xf-berries" transform="translate(93.0 288.0) rotate(18) scale(1.35)"/>
            <use href="#xf-flake" transform="translate(651.8 738.5) rotate(36) scale(1.20)"/>
            <use href="#xf-flake" transform="translate(251.7 150.8) rotate(-37) scale(1.63)"/>
            <use href="#xf-sparkle" transform="translate(881.5 582.2) rotate(8) scale(1.34)"/>
            <use href="#xf-dots" transform="translate(45.9 893.0) rotate(17) scale(0.97)"/>
            <use href="#xf-star" transform="translate(687.6 836.3) rotate(3) scale(1.36)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#xmas-tile)" stroke="none"/>
      </svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 3vw; --y: 20vh; --size: 44px; --dur: 70s; --delay: -10s; --drift: 50px; --spin: 180deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 14vw; --y: 20vh; --size: 30px; --dur: 62s; --delay: -40s; --drift: -40px; --spin: -160deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 24vw; --y: 20vh; --size: 52px; --dur: 84s; --delay: -20s; --drift: 60px; --spin: 200deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 38vw; --y: 20vh; --size: 34px; --dur: 66s; --delay: -55s; --drift: -50px; --spin: -180deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 52vw; --y: 20vh; --size: 40px; --dur: 78s; --delay: -5s; --drift: 40px; --spin: 160deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 63vw; --y: 20vh; --size: 28px; --dur: 60s; --delay: -30s; --drift: -30px; --spin: -140deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 74vw; --y: 20vh; --size: 48px; --dur: 82s; --delay: -62s; --drift: 50px; --spin: 190deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 86vw; --y: 20vh; --size: 36px; --dur: 68s; --delay: -14s; --drift: -40px; --spin: -170deg"><use href="#x-snowflake"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 95vw; --y: 20vh; --size: 42px; --dur: 74s; --delay: -48s; --drift: -50px; --spin: 180deg"><use href="#x-snowflake"></use></svg>
    </div>
`);
  script.remove();
})();
