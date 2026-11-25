"use strict";

// Thanksgiving backdrop: the doodle wallpaper and drifting pieces. The page includes this script inside
// .festive-layer; it puts the scene in its own place and removes itself, so the page ends up as if the
// markup were written there. Colors and motion are in the matching .css file.
(() => {
  const script = document.currentScript;
  script.insertAdjacentHTML("beforebegin", `
    <div class="festive-scene" data-scene="thanksgiving">
      <svg class="festive-doodles" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <defs>
          <g id="d-pumpkin"><path class="dd-o" d="M32 20c-4-2-9-1.6-12 .8C11 18.6 5 26 5.5 37s8 18 16 15.6c3.4 2 7.2 2.4 10.5.6 3.3 1.8 7.1 1.4 10.5-.6 8 2.4 15.5-4.6 16-15.6S53 18.6 44 20.8c-3-2.4-8-2.8-12-.8z"/><path d="M20 20.8c-3.6 4.4-5.4 10-5.2 16.4.2 6 2.2 11.4 6.7 15.4M44 20.8c3.6 4.4 5.4 10 5.2 16.4-.2 6-2.2 11.4-6.7 15.4M32 21c-1.2 10-1.2 22 0 32"/><path class="dd-g" d="M30.6 20.6c-.4-4.2.8-8.2 3.4-11.2l2.8 1.6c-2 2.6-3 5.6-2.8 9z"/><path d="M36.4 11.6c3.6-1.6 8-.6 8.6 2.6.4 2.4-1.8 4-3.6 3"/></g>
          <g id="d-gourd"><path class="dd-y" d="M32 15c-3.4 0-6.4 1-8.4 3C17 19.4 13 27 13 38c0 11.6 5 19.6 12 20.6 2 1.2 4.4 1.8 7 1.8s5-.6 7-1.8c7-1 12-9 12-20.6 0-11-4-18.6-10.6-20C38.4 16 35.4 15 32 15z"/><path d="M23.6 18c-3 6-4.4 12.6-4.4 20 0 8.4 2 15.4 5.8 20.6M40.4 18c3 6 4.4 12.6 4.4 20 0 8.4-2 15.4-5.8 20.6M32 16c-.8 14-.8 30 0 44"/><path class="dd-g" d="M30.6 15.4c-.2-3.6.6-7 2.6-9.6l2.8 1.4c-1.6 2.2-2.4 5-2.2 8.2z"/></g>
          <g id="d-maple"><path class="dd-r" d="M32 5l4.5 10.5 7.5-4-2 12.5 9.5-3.5-3 8.5 7.5 2.5-12.5 9.5 2 5.5-10.5-2.2L34 57h-4l-1.5-12.7-10.5 2.2 2-5.5L7.5 31.5 15 29l-3-8.5 9.5 3.5-2-12.5 7.5 4z"/><path d="M32 61V13M32 41l-11-9M32 41l11-9M32 33l-6-11M32 33l6-11"/></g>
          <g id="d-oak"><path class="dd-b" d="M30 54Q13.5 50 27 46Q8 39 25 36Q10.5 27 26 26Q15 15 28 16Q26 6 32 5Q38 6 36 16Q49 15 38 26Q53.5 27 39 36Q56 39 37 46Q50.5 50 34 54Q32 56 30 54Z"/><path d="M32 61V10M32 48l-7-3M32 48l7-3M32 40l-9-2M32 40l9-2M32 31l-8-2M32 31l8-2M32 22l-4-3M32 22l4-3"/></g>
          <g id="d-leaf"><path class="dd-y" d="M32 6C46 16 50 34 32 55 14 34 18 16 32 6Z"/><path d="M32 61V12M32 22l-6-5M32 22l6-5M32 32l-9-6M32 32l9-6M32 42l-8-6M32 42l8-6"/></g>
          <g id="d-acorn"><path class="dd-y" d="M18.5 28c0 12 5 22 13.5 27 8.5-5 13.5-15 13.5-27z"/><path class="dd-b" d="M15.5 28.5c0-9 7-15.5 16.5-15.5s16.5 6.5 16.5 15.5z"/><path d="M20 27l8-11M27 27.5l9-12.5M34 27.5l7.6-11M44 27l-8-11M37 27.5l-9-12.5M30 27.5l-7.6-11"/><path d="M32 13c0-3 1-5.4 3.4-7.4M24 34c0 5 2 9.6 5 12.6"/></g>
          <g id="d-corn"><path class="dd-g" d="M32 60c-8-4-13.5-13-14-26 4 5 8 11 11 19zM32 60c8-4 13.5-13 14-26-4 5-8 11-11 19z"/><path class="dd-y" d="M32 7c6 0 9 8 9 20s-3 21-9 24c-6-3-9-12-9-24s3-20 9-20z"/><path d="M25 16h14M23.6 22h16.8M23 28h18M23.6 34h16.8M25 40h14M28 45h8M28.4 11c-1.4 11-1.4 24 0 35M35.6 11c1.4 11 1.4 24 0 35M32 60v3"/></g>
          <g id="d-sunflower"><path class="dd-y" transform="rotate(0 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(30 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(60 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(90 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(120 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(150 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(180 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(210 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(240 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(270 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(300 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><path class="dd-y" transform="rotate(330 32 32)" d="M32 23c-3.4-4.4-3.6-10-.2-16.4 3.6 6.2 3.4 12 .2 16.4z"/><circle class="dd-b" cx="32" cy="32" r="9"/><path d="M26 28h12M25 32h14M26 36h12M28 26v12M32 25v14M36 26v12"/></g>
          <g id="d-pieslice"><path class="dd-y" d="M7 36v8l50-3v-8z"/><path class="dd-o" d="M7 36l42-14c2.6-2.6 7.4-1.4 8 2 .4 2.6 0 6 0 9z"/><path d="M11 40.6l45-2.6"/><path class="dd-c" d="M30 28c-3.6-.4-4-4.6-.4-5.4-.4-3.4 4-4.6 6-2 2.8-1.6 6 1 4.6 3.6 2.6.6 2.4 4.2-.6 4.6z"/></g>
          <g id="d-pie"><path class="dd-b" d="M8 36h48l-4.6 14H12.6z"/><path d="M16.5 37l2 13M24.5 37l1 13M32 37v13M39.5 37l-1 13M47.5 37l-2 13"/><path class="dd-o" d="M9 35c1.6-10 11.6-17 23-17s21.4 7 23 17z"/><path d="M8 36 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0 c1.6-2.4 4.4-2.4 6 0"/><path d="M25 27c2-2 4-2 6 0M33 24c2-2 4-2 6 0M30 31c2-2 4-2 6 0"/></g>
          <g id="d-apple"><path class="dd-r" d="M32 21c-4-3-11-3.4-15 1.6-5 6-4.4 18 1.6 26 4 5 9 7 13.4 4.4 4.4 2.6 9.4.6 13.4-4.4 6-8 6.6-20 1.6-26-4-5-11-4.6-15-1.6z"/><path d="M32 21c0-4 1-7.4 3.4-9.6M22.6 29c-2 3.4-2.2 7.4-1 10.6"/><path class="dd-g" d="M35 15c3-4 9-5.4 12.6-3.4-2 4-8 6-12.6 3.4z"/></g>
          <g id="d-pear"><path class="dd-y" d="M32 15c-4 0-6 3-6 8 0 5-2 7-5.4 11-4.2 5-4.2 12 0 17 3 4 7 5.4 11.4 5.4s8.4-1.4 11.4-5.4c4.2-5 4.2-12 0-17C40 30 38 28 38 23c0-5-2-8-6-8z"/><path d="M32 15c0-3.4 1-6.4 3.4-8.6M24 40c-.6 4 .4 7.6 3 10"/><path class="dd-g" d="M34 11.4c2.4-3.4 7-4.4 10.4-2.4-2.4 3.4-6.8 4.4-10.4 2.4z"/></g>
          <g id="d-mushroom"><path class="dd-c" d="M26 34c-.6 8-1.6 14-3 18.4 3 2.2 15 2.2 18 0-1.4-4.4-2.4-10.4-3-18.4z"/><path class="dd-r" d="M11 33c0-11 9.4-19 21-19s21 8 21 19c-6 2.4-14 3.4-21 3.4S17 35.4 11 33z"/><circle class="dd-c" cx="23" cy="24" r="2.4"/><circle class="dd-c" cx="35" cy="20" r="2.8"/><circle class="dd-c" cx="43" cy="27" r="1.8"/><circle class="dd-c" cx="29" cy="29.6" r="1.6"/><path d="M28 41c0 3 0 6-.6 8"/></g>
          <g id="d-wheat"><path d="M31 63C31.4 46 32.6 26 35.2 6"/><path class="dd-y" d="M35.2 8c-1.8-2.6-1.8-5.4 0-7 1.8 1.6 1.8 4.4 0 7zM34.3 14c-5-1.5-7.5-5.5-7-10 4.5 1.5 7 5.5 7 10zM34.3 14c5-1.5 7.5-5.5 7-10-4.5 1.5-7 5.5-7 10zM33.8 22c-5-1.5-7.5-5.5-7-10 4.5 1.5 7 5.5 7 10zM33.8 22c5-1.5 7.5-5.5 7-10-4.5 1.5-7 5.5-7 10zM33.3 30c-5-1.5-7.5-5.5-7-10 4.5 1.5 7 5.5 7 10zM33.3 30c5-1.5 7.5-5.5 7-10-4.5 1.5-7 5.5-7 10zM32.7 38c-5-1.5-7.5-5.5-7-10 4.5 1.5 7 5.5 7 10zM32.7 38c5-1.5 7.5-5.5 7-10-4.5 1.5-7 5.5-7 10z"/><path class="dd-g" d="M31.4 52c-6-2.5-10-8-11.5-15 5.5 2.5 9.5 8 11.5 15z"/></g>
          <g id="d-grapes"><path d="M33 18c0-4 2-7.4 5-9.4M29 15c-4-2.4-8.4-.4-7.6 3.4.6 2.4 3.6 2.4 4 .4"/><path class="dd-g" d="M38 11c4-4.4 11-4.4 14.4 0-4 4.4-10.4 4.4-14.4 0z"/><path d="M40 11h10"/><circle class="dd-p" cx="20.5" cy="23" r="4.6"/><circle class="dd-p" cx="29.5" cy="22" r="4.6"/><circle class="dd-p" cx="38.5" cy="22" r="4.6"/><circle class="dd-p" cx="47.5" cy="23" r="4.6"/><circle class="dd-p" cx="25" cy="31" r="4.6"/><circle class="dd-p" cx="34" cy="30.6" r="4.6"/><circle class="dd-p" cx="43" cy="31" r="4.6"/><circle class="dd-p" cx="29.5" cy="39" r="4.6"/><circle class="dd-p" cx="38.5" cy="39" r="4.6"/><circle class="dd-p" cx="34" cy="47" r="4.6"/></g>
          <g id="d-berries"><path d="M10 56C20 42 34 30 54 20M31 34.4l-3.4 9.8M31 34.4l5 8.6M31 34.4v16.4"/><path class="dd-g" d="M20 45c-2.4-5.4-.4-10 4.6-12.4 1.4 5-.6 9.6-4.6 12.4zM36 31c4-3.4 9.4-3.4 12.6-.4-4 3.4-9 3.6-12.6.4zM44 25c-1.4-5 .6-9.4 5-11 1.4 4.4-.2 8.6-5 11z"/><circle class="dd-r" cx="27.4" cy="48.2" r="4.2"/><circle class="dd-r" cx="36.4" cy="47" r="4.2"/><circle class="dd-r" cx="31" cy="54.8" r="4.2"/><path d="M26.4 47.2l2 2M28.4 47.2l-2 2M35.4 46l2 2M37.4 46l-2 2M30 53.8l2 2M32 53.8l-2 2"/></g>
          <g id="d-candle"><path class="dd-c" d="M24 56V28c0-1.6 1-2.4 2.4-2.4h11.2c1.4 0 2.4.8 2.4 2.4v28z"/><path d="M24 31c2.4 0 3.4 1.6 3.4 4s1 3.6 2.4 3.6 2-1.6 2-3.6v-3.4M36 30.4v4M32 25.6v-4"/><path class="dd-o" d="M32 21.6c-4.4-3-4.6-8.4-.2-14 4.6 5.6 4.4 11 .2 14z"/><path class="dd-y" d="M32 18.6c-1.6-1.2-1.6-3.4 0-5.4 1.6 2 1.6 4.2 0 5.4z"/><path class="dd-b" d="M17 56h30c0 2.4-2 4.4-4.4 4.4H21.4C19 60.4 17 58.4 17 56z"/><path d="M22 13l-3.4-2.4M42 13l3.4-2.4M32 4.6V2"/></g>
          <g id="d-mug"><path d="M46 31h3c4 0 6.4 3 6.4 6.4S53 44 49 44h-3"/><path class="dd-o" d="M14 24h32v21c0 6.4-4.4 11-11 11H25c-6.6 0-11-4.6-11-11z"/><path transform="translate(30 39.4) scale(1)" d="M0-2c-2-3-6.4-1.4-4.6 2L0 4.4 4.6 0C6.4-3.4 2-5 0-2z"/><path d="M21 19c-2.4-3 2.4-5 0-8.4M30 19c-2.4-3 2.4-5 0-8.4M39 19c-2.4-3 2.4-5 0-8.4"/></g>
          <g id="d-cup"><path class="dd-c" d="M19 22h26l-4 38H23z"/><path class="dd-b" d="M20.6 31h22.8l-1.6 15H22.2z"/><path class="dd-o" d="M17 16.4h30l-1.4 5.6H18.4z"/><path d="M22 16.4l1.4-4.4h17.2l1.4 4.4M28 42c0-4 3.4-7 7.6-7 0 4-3.6 7-7.6 7zM28 42l4.4-3.6"/></g>
          <g id="d-hat"><path class="dd-b" d="M5 43c0-4.4 12-7 27-7s27 2.6 27 7-12 7-27 7S5 47.4 5 43z"/><path class="dd-b" d="M18 44.6L20.6 17c4.4-1.6 18.4-1.6 22.8 0L46 44.6c-4 1.4-9 2-14 2s-10-.6-14-2z"/><path class="dd-k" d="M19.2 33.4c4 1 8.4 1.4 12.8 1.4s8.8-.4 12.8-1.4l.6 7c-4 1-8.8 1.6-13.4 1.6s-9.4-.6-13.4-1.6z"/><path class="dd-y" d="M27.4 33.2h9.2v9h-9.2z"/><path d="M30 35.8h4v3.8h-4z"/></g>
          <g id="d-mitt"><path class="dd-r" d="M21 51V25c0-8.4 4.6-14 11.4-14 6.6 0 11 5.4 11 13.4v5c2.2-3.6 6-5 8.6-3.2 2.6 2 2 6.2-1 9.6L43.4 44v7z"/><path class="dd-c" d="M19 51h26.4v9H19z"/><path d="M23.4 51v9M27.8 51v9M32.2 51v9M36.6 51v9M41 51v9"/><path transform="translate(30.4 32) scale(1)" d="M0-2c-2-3-6.4-1.4-4.6 2L0 4.4 4.6 0C6.4-3.4 2-5 0-2z"/></g>
          <g id="d-envelope"><path class="dd-y" d="M10 26l22-14 22 14zM10 26h44v27H10z"/><path class="dd-c" d="M16 34V14h32v20z"/><path d="M26 25c2-3.4 6.4-4.4 10-3.4-1.4 3.4-6 4.4-10 3.4zM26 25l6-2M20 18h10"/><path class="dd-o" d="M10 26l22 16 22-16v27H10z"/><path d="M10 53l17-13M54 53l-17-13"/></g>
          <g id="d-bread"><path class="dd-y" d="M7 41c0-8.4 11-14.4 25-14.4S57 32.6 57 41s-7 10.4-25 10.4S7 49.4 7 41z"/><path d="M17 34c2.4 2 2.4 6.4 0 8.6M27 31.4c2.6 2.6 2.6 7.6 0 10.6M37 31.4c2.6 2.6 2.6 7.6 0 10.6M47 34c2.4 2 2.4 6.4 0 8.6"/></g>
          <g id="d-jar"><path class="dd-r" d="M18 27h28v25c0 4-3 6.4-6.4 6.4H24.4C21 58.4 18 56 18 52z"/><path class="dd-c" d="M15 23c5-7.4 29-7.4 34 0l-2.6 3.4 c-1.6-1-3.2 1-4.8 0 c-1.6-1-3.2 1-4.8 0 c-1.6-1-3.2 1-4.8 0 c-1.6-1-3.2 1-4.8 0 c-1.6-1-3.2 1-4.8 0 c-1.6-1-3.2 1-4.8 0z"/><path d="M20 24.6h24M32 24c-3-4.4-7.4-2.4-5.4 1 2 1 5.4 0 5.4-1zM32 24c3-4.4 7.4-2.4 5.4 1-2 1-5.4 0-5.4-1z"/><path class="dd-c" d="M24 37h16v11H24z"/><path transform="translate(32 42.4) scale(0.7)" d="M0-2c-2-3-6.4-1.4-4.6 2L0 4.4 4.6 0C6.4-3.4 2-5 0-2z"/></g>
          <g id="d-cutlery"><path d="M22 8v11c0 4 2 6.4 4.6 6.4S31 23 31 19V8M26.6 8v11M26.6 25.4V57"/><path class="dd-c" d="M40 8c4.4 4 5.6 12.4 4.4 21H40z"/><path d="M42 29v28"/></g>
          <g id="d-feather"><path class="dd-y" d="M47 9C33 12 21 25 18 42l-3.4 7.6c3.4-2 6-3 9-3.4C40 41 47 27 47 9z"/><path d="M12 58L47 9M41 18l-9 2M37 24l-10 3M33 30l-10 4M29 36l-8 5M40 26l-1 7M35 33l-2 6"/></g>
          <g id="d-sprig"><path d="M32 59C30 44 32 25 38 8"/><path class="dd-g" d="M31 49c-6-1-9-5-9.4-9.4 5 0 8.4 4 9.4 9.4zM31.4 41c6-1 9-5 9.4-9.4-5 0-8.4 4-9.4 9.4zM32 32.6c-6-1-8.4-5-8.4-9.4 5 0 7.6 4 8.4 9.4zM34 24.6c6-1 8.4-5 8.4-9.4-5 0-7.6 4-8.4 9.4zM35.6 16.4c-5-1-7-4.4-6.4-8.4 4 1 6 4.4 6.4 8.4z"/></g>
          <g id="df-star"><path class="dd-y" d="M0-5.5l1.6 3.4 3.8.5-2.8 2.6.7 3.7L0 2.9l-3.3 1.8.7-3.7-2.8-2.6 3.8-.5z"/></g>
          <g id="df-dots"><circle class="dd-k" r="1.3"/><circle class="dd-k" cx="5" cy="3" r="1"/><circle class="dd-k" cx="-3" cy="5" r=".9"/></g>
          <g id="df-swirl"><path d="M-6 2c0-5 6-7 9-4s1 7-3 6-3-5 0-5"/></g>
          <g id="df-heart"><path class="dd-r" d="M0-2c-2-3-6.4-1.4-4.6 2L0 4.4 4.6 0C6.4-3.4 2-5 0-2z"/></g>
          <g id="df-sparkle"><path d="M0-6v12M-6 0h12M-3 -3l6 6M3-3l-6 6"/></g>
          <g id="df-sprout"><path class="dd-o" d="M0-7c5 3 5 10 0 14-5-4-5-11 0-14z"/><path d="M0-4v13"/></g>
          <g id="db-happy-thanksgiving"><path class="dd-b" d="M-76-3h14v14h-14l4.4-7z"/><path class="dd-b" d="M76-3H62v14h14l-4.4-7z"/><path class="dd-k" d="M-62 11l-2-6h2zM62 11l2-6h-2z"/><path class="dd-c" d="M-64-9c22 3 106 3 128 0v14c-22 3-106 3-128 0z"/><text class="dd-text" y="3.8" font-size="10.5" text-anchor="middle">happy thanksgiving</text></g>
          <g id="db-give-thanks"><path class="dd-b" d="M-76-3h14v14h-14l4.4-7z"/><path class="dd-b" d="M76-3H62v14h14l-4.4-7z"/><path class="dd-k" d="M-62 11l-2-6h2zM62 11l2-6h-2z"/><path class="dd-c" d="M-64-9c22 3 106 3 128 0v14c-22 3-106 3-128 0z"/><text class="dd-text" y="4.3" font-size="12" text-anchor="middle">give thanks</text></g>
          <g id="db-be-grateful"><path class="dd-b" d="M-76-3h14v14h-14l4.4-7z"/><path class="dd-b" d="M76-3H62v14h14l-4.4-7z"/><path class="dd-k" d="M-62 11l-2-6h2zM62 11l2-6h-2z"/><path class="dd-c" d="M-64-9c22 3 106 3 128 0v14c-22 3-106 3-128 0z"/><text class="dd-text" y="4.3" font-size="12" text-anchor="middle">be grateful</text></g>
          <pattern id="doodle-tile" width="960" height="960" patternUnits="userSpaceOnUse">
            <use href="#db-happy-thanksgiving" transform="translate(861.1 658.3) rotate(-6.0)"/>
            <use href="#db-give-thanks" transform="translate(392.6 499.9) rotate(-0.5)"/>
            <use href="#db-be-grateful" transform="translate(681.3 52.5) rotate(-7.5)"/>
            <use href="#db-be-grateful" transform="translate(681.3 1012.5) rotate(-7.5)"/>
            <use href="#d-pie" transform="translate(-39.8 212.2) rotate(-15) scale(1.23) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(920.2 212.2) rotate(-15) scale(1.23) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(203.1 370.3) rotate(-8) scale(0.91) translate(-32 -32)"/>
            <use href="#d-maple" transform="translate(889.5 779.3) rotate(-42) scale(0.91) translate(-32 -32)"/>
            <use href="#d-bread" transform="translate(760.9 884.2) rotate(3) scale(1.11) translate(-32 -32)"/>
            <use href="#d-cutlery" transform="translate(403.0 740.8) rotate(-7) scale(1.17) translate(-32 -32)"/>
            <use href="#d-oak" transform="translate(519.2 201.3) rotate(8) scale(1.24) translate(-32 -32)"/>
            <use href="#d-grapes" transform="translate(77.0 578.8) rotate(-22) scale(1.08) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(-35.3 530.8) rotate(-11) scale(1.15) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(924.7 530.8) rotate(-11) scale(1.15) translate(-32 -32)"/>
            <use href="#d-pear" transform="translate(23.6 374.3) rotate(-15) scale(1.20) translate(-32 -32)"/>
            <use href="#d-pear" transform="translate(983.6 374.3) rotate(-15) scale(1.20) translate(-32 -32)"/>
            <use href="#d-maple" transform="translate(458.8 832.0) rotate(2) scale(0.97) translate(-32 -32)"/>
            <use href="#d-feather" transform="translate(679.4 373.5) rotate(29) scale(1.06) translate(-32 -32)"/>
            <use href="#d-corn" transform="translate(593.8 645.8) rotate(-14) scale(1.23) translate(-32 -32)"/>
            <use href="#d-acorn" transform="translate(555.7 451.2) rotate(19) scale(0.95) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(23.4 462.8) rotate(-19) scale(0.88) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(983.4 462.8) rotate(-19) scale(0.88) translate(-32 -32)"/>
            <use href="#d-wheat" transform="translate(558.8 368.6) rotate(-6) scale(1.16) translate(-32 -32)"/>
            <use href="#d-mug" transform="translate(666.5 -37.9) rotate(-17) scale(1.04) translate(-32 -32)"/>
            <use href="#d-mug" transform="translate(666.5 922.1) rotate(-17) scale(1.04) translate(-32 -32)"/>
            <use href="#d-sprig" transform="translate(379.9 383.4) rotate(-33) scale(1.34) translate(-32 -32)"/>
            <use href="#d-mitt" transform="translate(171.0 100.9) rotate(2) scale(0.97) translate(-32 -32)"/>
            <use href="#d-oak" transform="translate(349.6 643.1) rotate(-9) scale(0.97) translate(-32 -32)"/>
            <use href="#d-hat" transform="translate(735.4 733.3) rotate(-21) scale(1.25) translate(-32 -32)"/>
            <use href="#d-berries" transform="translate(280.2 127.9) rotate(3) scale(1.14) translate(-32 -32)"/>
            <use href="#d-leaf" transform="translate(685.7 222.2) rotate(-8) scale(1.24) translate(-32 -32)"/>
            <use href="#d-acorn" transform="translate(118.6 848.3) rotate(-0) scale(1.19) translate(-32 -32)"/>
            <use href="#d-candle" transform="translate(187.6 262.9) rotate(13) scale(1.35) translate(-32 -32)"/>
            <use href="#d-sunflower" transform="translate(41.4 883.8) rotate(-18) scale(0.95) translate(-32 -32)"/>
            <use href="#d-sunflower" transform="translate(1001.4 883.8) rotate(-18) scale(0.95) translate(-32 -32)"/>
            <use href="#d-grapes" transform="translate(247.7 792.4) rotate(-22) scale(1.10) translate(-32 -32)"/>
            <use href="#d-jar" transform="translate(776.0 292.9) rotate(18) scale(0.99) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(229.2 27.5) rotate(1) scale(1.19) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(229.2 987.5) rotate(1) scale(1.19) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(524.4 59.6) rotate(-15) scale(0.99) translate(-32 -32)"/>
            <use href="#d-bread" transform="translate(791.2 145.3) rotate(2) scale(0.90) translate(-32 -32)"/>
            <use href="#d-feather" transform="translate(881.9 36.8) rotate(20) scale(1.34) translate(-32 -32)"/>
            <use href="#d-feather" transform="translate(881.9 996.8) rotate(20) scale(1.34) translate(-32 -32)"/>
            <use href="#d-mushroom" transform="translate(586.1 168.7) rotate(-4) scale(0.93) translate(-32 -32)"/>
            <use href="#d-leaf" transform="translate(258.7 705.0) rotate(-39) scale(1.02) translate(-32 -32)"/>
            <use href="#d-candle" transform="translate(197.5 -49.3) rotate(-22) scale(1.12) translate(-32 -32)"/>
            <use href="#d-candle" transform="translate(197.5 910.7) rotate(-22) scale(1.12) translate(-32 -32)"/>
            <use href="#d-corn" transform="translate(95.2 482.3) rotate(-4) scale(1.27) translate(-32 -32)"/>
            <use href="#d-berries" transform="translate(303.3 862.3) rotate(10) scale(1.32) translate(-32 -32)"/>
            <use href="#d-sunflower" transform="translate(270.5 361.4) rotate(6) scale(0.93) translate(-32 -32)"/>
            <use href="#d-pear" transform="translate(171.5 739.6) rotate(-9) scale(1.32) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(763.6 397.6) rotate(-9) scale(1.04) translate(-32 -32)"/>
            <use href="#d-sprig" transform="translate(856.5 469.5) rotate(-2) scale(1.34) translate(-32 -32)"/>
            <use href="#d-mug" transform="translate(872.0 304.2) rotate(-13) scale(0.89) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(53.2 775.5) rotate(6) scale(0.97) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(369.5 17.7) rotate(2) scale(1.14) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(369.5 977.7) rotate(2) scale(1.14) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(375.1 111.4) rotate(-14) scale(0.92) translate(-32 -32)"/>
            <use href="#d-maple" transform="translate(253.9 572.0) rotate(-33) scale(1.27) translate(-32 -32)"/>
            <use href="#d-hat" transform="translate(176.9 485.1) rotate(-2) scale(1.07) translate(-32 -32)"/>
            <use href="#d-envelope" transform="translate(279.2 259.9) rotate(20) scale(1.12) translate(-32 -32)"/>
            <use href="#d-mushroom" transform="translate(882.0 380.0) rotate(14) scale(1.18) translate(-32 -32)"/>
            <use href="#d-wheat" transform="translate(37.4 183.2) rotate(39) scale(1.13) translate(-32 -32)"/>
            <use href="#d-wheat" transform="translate(997.4 183.2) rotate(39) scale(1.13) translate(-32 -32)"/>
            <use href="#d-cup" transform="translate(669.3 481.3) rotate(16) scale(1.01) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(596.2 868.8) rotate(-0) scale(0.98) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(477.9 600.6) rotate(-22) scale(1.30) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(50.5 662.6) rotate(3) scale(1.31) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(1010.5 662.6) rotate(3) scale(1.31) translate(-32 -32)"/>
            <use href="#d-maple" transform="translate(465.7 104.2) rotate(-47) scale(1.12) translate(-32 -32)"/>
            <use href="#d-bread" transform="translate(346.1 192.6) rotate(-18) scale(1.34) translate(-32 -32)"/>
            <use href="#d-cutlery" transform="translate(702.8 601.8) rotate(17) scale(1.38) translate(-32 -32)"/>
            <use href="#d-oak" transform="translate(133.3 28.0) rotate(-16) scale(1.05) translate(-32 -32)"/>
            <use href="#d-oak" transform="translate(133.3 988.0) rotate(-16) scale(1.05) translate(-32 -32)"/>
            <use href="#d-grapes" transform="translate(596.1 771.9) rotate(-2) scale(1.30) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(424.1 310.6) rotate(-19) scale(1.13) translate(-32 -32)"/>
            <use href="#d-pear" transform="translate(430.8 675.2) rotate(4) scale(0.90) translate(-32 -32)"/>
            <use href="#d-maple" transform="translate(819.1 562.1) rotate(30) scale(0.90) translate(-32 -32)"/>
            <use href="#d-feather" transform="translate(744.6 808.8) rotate(-18) scale(0.99) translate(-32 -32)"/>
            <use href="#d-corn" transform="translate(570.7 -6.9) rotate(21) scale(1.19) translate(-32 -32)"/>
            <use href="#d-corn" transform="translate(570.7 953.1) rotate(21) scale(1.19) translate(-32 -32)"/>
            <use href="#d-acorn" transform="translate(-7.5 90.2) rotate(21) scale(0.99) translate(-32 -32)"/>
            <use href="#d-acorn" transform="translate(952.5 90.2) rotate(21) scale(0.99) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(839.9 -40.3) rotate(16) scale(1.17) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(839.9 919.7) rotate(16) scale(1.17) translate(-32 -32)"/>
            <use href="#d-wheat" transform="translate(773.3 497.9) rotate(-17) scale(0.96) translate(-32 -32)"/>
            <use href="#d-mug" transform="translate(525.0 703.7) rotate(-10) scale(0.99) translate(-32 -32)"/>
            <use href="#d-sprig" transform="translate(889.4 867.2) rotate(41) scale(1.03) translate(-32 -32)"/>
            <use href="#d-mitt" transform="translate(454.5 -36.0) rotate(-15) scale(0.92) translate(-32 -32)"/>
            <use href="#d-mitt" transform="translate(454.5 924.0) rotate(-15) scale(0.92) translate(-32 -32)"/>
            <use href="#d-oak" transform="translate(836.3 242.2) rotate(-41) scale(0.99) translate(-32 -32)"/>
            <use href="#d-hat" transform="translate(576.9 525.6) rotate(15) scale(0.93) translate(-32 -32)"/>
            <use href="#d-berries" transform="translate(512.0 283.9) rotate(15) scale(0.97) translate(-32 -32)"/>
            <use href="#d-leaf" transform="translate(93.0 305.1) rotate(29) scale(1.02) translate(-32 -32)"/>
            <use href="#d-acorn" transform="translate(273.4 441.9) rotate(3) scale(1.17) translate(-32 -32)"/>
            <use href="#d-candle" transform="translate(666.7 688.2) rotate(5) scale(1.06) translate(-32 -32)"/>
            <use href="#d-sunflower" transform="translate(154.3 578.9) rotate(-13) scale(1.06) translate(-32 -32)"/>
            <use href="#d-grapes" transform="translate(817.8 835.6) rotate(-4) scale(0.93) translate(-32 -32)"/>
            <use href="#d-jar" transform="translate(202.6 645.2) rotate(21) scale(0.96) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(600.4 292.3) rotate(-2) scale(1.11) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(50.8 28.5) rotate(1) scale(1.00) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(50.8 988.5) rotate(1) scale(1.00) translate(-32 -32)"/>
            <use href="#d-bread" transform="translate(484.3 416.6) rotate(-19) scale(1.32) translate(-32 -32)"/>
            <use href="#d-feather" transform="translate(-13.7 719.3) rotate(-4) scale(0.89) translate(-32 -32)"/>
            <use href="#d-feather" transform="translate(946.3 719.3) rotate(-4) scale(0.89) translate(-32 -32)"/>
            <use href="#d-mushroom" transform="translate(105.2 229.7) rotate(1) scale(1.10) translate(-32 -32)"/>
            <use href="#d-leaf" transform="translate(843.1 722.8) rotate(28) scale(1.19) translate(-32 -32)"/>
            <use href="#d-candle" transform="translate(516.4 882.1) rotate(3) scale(1.02) translate(-32 -32)"/>
            <use href="#d-corn" transform="translate(335.4 783.3) rotate(-37) scale(0.95) translate(-32 -32)"/>
            <use href="#d-berries" transform="translate(676.4 124.8) rotate(-9) scale(1.00) translate(-32 -32)"/>
            <use href="#d-sunflower" transform="translate(8.7 288.9) rotate(-20) scale(1.06) translate(-32 -32)"/>
            <use href="#d-sunflower" transform="translate(968.7 288.9) rotate(-20) scale(1.06) translate(-32 -32)"/>
            <use href="#d-pear" transform="translate(201.3 164.8) rotate(16) scale(0.95) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(400.8 590.7) rotate(19) scale(1.09) translate(-32 -32)"/>
            <use href="#d-sprig" transform="translate(121.5 376.6) rotate(41) scale(0.98) translate(-32 -32)"/>
            <use href="#d-mug" transform="translate(94.4 98.4) rotate(17) scale(1.27) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(876.0 142.8) rotate(-17) scale(1.00) translate(-32 -32)"/>
            <use href="#d-pieslice" transform="translate(672.8 768.4) rotate(-11) scale(0.91) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(-7.3 -15.8) rotate(-3) scale(1.02) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(-7.3 944.2) rotate(-3) scale(1.02) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(952.7 -15.8) rotate(-3) scale(1.02) translate(-32 -32)"/>
            <use href="#d-gourd" transform="translate(952.7 944.2) rotate(-3) scale(1.02) translate(-32 -32)"/>
            <use href="#d-maple" transform="translate(689.2 298.2) rotate(-13) scale(1.02) translate(-32 -32)"/>
            <use href="#d-hat" transform="translate(436.4 217.6) rotate(10) scale(0.95) translate(-32 -32)"/>
            <use href="#d-envelope" transform="translate(660.7 851.3) rotate(-3) scale(0.91) translate(-32 -32)"/>
            <use href="#d-mushroom" transform="translate(388.8 875.8) rotate(16) scale(0.92) translate(-32 -32)"/>
            <use href="#d-wheat" transform="translate(323.6 325.5) rotate(-26) scale(1.03) translate(-32 -32)"/>
            <use href="#d-cup" transform="translate(811.9 77.3) rotate(-15) scale(1.17) translate(-32 -32)"/>
            <use href="#d-pumpkin" transform="translate(631.4 421.9) rotate(3) scale(0.91) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(-11.3 595.4) rotate(8) scale(0.95) translate(-32 -32)"/>
            <use href="#d-pie" transform="translate(948.7 595.4) rotate(8) scale(0.95) translate(-32 -32)"/>
            <use href="#d-apple" transform="translate(519.4 790.0) rotate(17) scale(1.02) translate(-32 -32)"/>
            <use href="#df-dots" transform="translate(822.6 783.3) rotate(38) scale(1.27)"/>
            <use href="#df-heart" transform="translate(802.2 351.7) rotate(37) scale(1.49)"/>
            <use href="#df-sparkle" transform="translate(147.9 638.3) rotate(-27) scale(1.64)"/>
            <use href="#df-swirl" transform="translate(540.3 144.1) rotate(10) scale(1.39)"/>
            <use href="#df-heart" transform="translate(404.9 438.2) rotate(37) scale(0.97)"/>
            <use href="#df-star" transform="translate(758.6 222.5) rotate(29) scale(1.14)"/>
            <use href="#df-heart" transform="translate(43.7 533.7) rotate(-7) scale(1.13)"/>
            <use href="#df-swirl" transform="translate(325.4 942.3) rotate(-36) scale(1.05)"/>
            <use href="#df-sprout" transform="translate(416.5 145.0) rotate(14) scale(1.25)"/>
            <use href="#df-heart" transform="translate(640.3 335.5) rotate(34) scale(0.95)"/>
            <use href="#df-swirl" transform="translate(186.5 855.2) rotate(-26) scale(1.01)"/>
            <use href="#df-star" transform="translate(601.8 476.7) rotate(12) scale(1.44)"/>
            <use href="#df-star" transform="translate(661.2 536.0) rotate(-18) scale(1.39)"/>
            <use href="#df-star" transform="translate(323.9 568.4) rotate(-3) scale(1.28)"/>
            <use href="#df-sparkle" transform="translate(585.5 706.9) rotate(-22) scale(1.54)"/>
            <use href="#df-sprout" transform="translate(367.9 824.5) rotate(30) scale(0.96)"/>
            <use href="#df-dots" transform="translate(364.3 284.2) rotate(36) scale(1.33)"/>
            <use href="#df-dots" transform="translate(900.7 698.5) rotate(8) scale(1.29)"/>
            <use href="#df-star" transform="translate(393.2 811.8) rotate(-12) scale(0.93)"/>
            <use href="#df-sparkle" transform="translate(315.7 398.0) rotate(21) scale(1.51)"/>
            <use href="#df-heart" transform="translate(103.7 628.9) rotate(25) scale(0.95)"/>
            <use href="#df-sprout" transform="translate(805.0 11.1) rotate(-28) scale(1.61)"/>
            <use href="#df-sprout" transform="translate(805.0 971.1) rotate(-28) scale(1.61)"/>
            <use href="#df-dots" transform="translate(291.0 41.0) rotate(-1) scale(0.95)"/>
            <use href="#df-star" transform="translate(420.4 796.2) rotate(-19) scale(0.90)"/>
            <use href="#df-swirl" transform="translate(626.2 541.3) rotate(-27) scale(1.17)"/>
            <use href="#df-dots" transform="translate(622.1 205.1) rotate(-35) scale(1.41)"/>
            <use href="#df-sprout" transform="translate(399.1 252.7) rotate(26) scale(1.27)"/>
            <use href="#df-star" transform="translate(519.7 546.8) rotate(35) scale(0.96)"/>
            <use href="#df-sparkle" transform="translate(266.5 500.7) rotate(36) scale(1.47)"/>
            <use href="#df-dots" transform="translate(296.8 933.2) rotate(29) scale(1.13)"/>
            <use href="#df-sprout" transform="translate(548.3 592.4) rotate(-37) scale(1.55)"/>
            <use href="#df-swirl" transform="translate(156.3 324.0) rotate(33) scale(1.40)"/>
            <use href="#df-sparkle" transform="translate(719.6 440.0) rotate(21) scale(1.17)"/>
            <use href="#df-heart" transform="translate(208.9 427.7) rotate(-25) scale(1.19)"/>
            <use href="#df-swirl" transform="translate(300.3 646.4) rotate(-32) scale(0.94)"/>
            <use href="#df-sprout" transform="translate(246.7 310.2) rotate(33) scale(1.65)"/>
            <use href="#df-swirl" transform="translate(594.1 574.2) rotate(-38) scale(0.92)"/>
            <use href="#df-heart" transform="translate(767.1 627.9) rotate(-19) scale(1.69)"/>
            <use href="#df-sparkle" transform="translate(155.3 423.4) rotate(30) scale(1.03)"/>
            <use href="#df-heart" transform="translate(139.7 178.0) rotate(15) scale(1.60)"/>
            <use href="#df-star" transform="translate(722.5 152.0) rotate(21) scale(1.22)"/>
            <use href="#df-heart" transform="translate(236.4 200.6) rotate(13) scale(1.00)"/>
            <use href="#df-star" transform="translate(102.6 917.9) rotate(-30) scale(1.40)"/>
            <use href="#df-sprout" transform="translate(941.2 795.5) rotate(20) scale(1.08)"/>
            <use href="#df-sparkle" transform="translate(344.1 712.5) rotate(35) scale(0.99)"/>
            <use href="#df-heart" transform="translate(235.8 85.4) rotate(38) scale(1.13)"/>
            <use href="#df-star" transform="translate(-15.9 859.7) rotate(7) scale(1.51)"/>
            <use href="#df-star" transform="translate(944.1 859.7) rotate(7) scale(1.51)"/>
            <use href="#df-dots" transform="translate(455.5 48.5) rotate(-26) scale(0.96)"/>
            <use href="#df-star" transform="translate(503.8 11.1) rotate(-38) scale(1.00)"/>
            <use href="#df-star" transform="translate(503.8 971.1) rotate(-38) scale(1.00)"/>
            <use href="#df-swirl" transform="translate(262.2 925.5) rotate(19) scale(0.97)"/>
            <use href="#df-swirl" transform="translate(767.8 587.8) rotate(-33) scale(0.95)"/>
            <use href="#df-swirl" transform="translate(884.8 579.1) rotate(-38) scale(1.20)"/>
            <use href="#df-star" transform="translate(579.4 109.6) rotate(-26) scale(1.10)"/>
            <use href="#df-star" transform="translate(762.0 188.7) rotate(-1) scale(1.25)"/>
            <use href="#df-star" transform="translate(716.6 514.6) rotate(22) scale(1.60)"/>
            <use href="#df-swirl" transform="translate(589.3 230.2) rotate(-21) scale(0.92)"/>
            <use href="#df-sparkle" transform="translate(176.1 808.7) rotate(-11) scale(1.11)"/>
            <use href="#df-heart" transform="translate(702.3 884.3) rotate(9) scale(1.07)"/>
            <use href="#df-dots" transform="translate(303.1 72.8) rotate(-11) scale(1.05)"/>
            <use href="#df-swirl" transform="translate(66.4 931.7) rotate(-7) scale(1.41)"/>
            <use href="#df-heart" transform="translate(465.1 737.4) rotate(-8) scale(0.98)"/>
            <use href="#df-dots" transform="translate(886.3 611.8) rotate(22) scale(1.23)"/>
            <use href="#df-swirl" transform="translate(457.8 767.0) rotate(-26) scale(0.93)"/>
            <use href="#df-heart" transform="translate(113.9 673.4) rotate(1) scale(1.08)"/>
            <use href="#df-star" transform="translate(944.6 152.9) rotate(-8) scale(0.97)"/>
            <use href="#df-dots" transform="translate(463.9 355.8) rotate(37) scale(1.34)"/>
            <use href="#df-heart" transform="translate(446.0 19.2) rotate(30) scale(1.19)"/>
            <use href="#df-star" transform="translate(25.1 830.4) rotate(-15) scale(1.13)"/>
            <use href="#df-heart" transform="translate(761.9 552.3) rotate(-13) scale(1.36)"/>
            <use href="#df-swirl" transform="translate(857.9 532.8) rotate(-17) scale(1.22)"/>
            <use href="#df-swirl" transform="translate(734.8 256.4) rotate(20) scale(1.19)"/>
            <use href="#df-sparkle" transform="translate(380.3 923.4) rotate(7) scale(1.05)"/>
            <use href="#df-star" transform="translate(457.8 167.6) rotate(27) scale(1.11)"/>
            <use href="#df-swirl" transform="translate(489.3 476.3) rotate(17) scale(0.97)"/>
            <use href="#df-sprout" transform="translate(327.4 91.1) rotate(-27) scale(0.93)"/>
            <use href="#df-swirl" transform="translate(492.3 341.2) rotate(-27) scale(0.96)"/>
            <use href="#df-sprout" transform="translate(746.5 659.2) rotate(33) scale(1.52)"/>
            <use href="#df-sparkle" transform="translate(468.3 260.6) rotate(28) scale(0.97)"/>
            <use href="#df-star" transform="translate(741.6 335.1) rotate(-23) scale(1.24)"/>
            <use href="#df-swirl" transform="translate(307.6 539.7) rotate(-20) scale(0.95)"/>
            <use href="#df-star" transform="translate(935.6 766.0) rotate(26) scale(0.97)"/>
            <use href="#df-sparkle" transform="translate(495.3 522.0) rotate(3) scale(1.46)"/>
            <use href="#df-star" transform="translate(702.1 4.0) rotate(36) scale(1.00)"/>
            <use href="#df-star" transform="translate(702.1 964.0) rotate(36) scale(1.00)"/>
            <use href="#df-sparkle" transform="translate(36.8 726.0) rotate(-33) scale(1.04)"/>
            <use href="#df-dots" transform="translate(379.3 451.4) rotate(16) scale(1.10)"/>
            <use href="#df-star" transform="translate(108.2 789.3) rotate(35) scale(1.30)"/>
            <use href="#df-sparkle" transform="translate(838.7 186.4) rotate(30) scale(1.33)"/>
            <use href="#df-dots" transform="translate(22.2 555.1) rotate(-34) scale(0.94)"/>
            <use href="#df-sprout" transform="translate(133.3 920.4) rotate(-26) scale(0.95)"/>
            <use href="#df-sparkle" transform="translate(235.7 509.6) rotate(27) scale(0.93)"/>
            <use href="#df-swirl" transform="translate(932.9 469.2) rotate(19) scale(1.48)"/>
            <use href="#df-sprout" transform="translate(610.7 121.6) rotate(37) scale(1.13)"/>
            <use href="#df-sparkle" transform="translate(95.5 730.7) rotate(23) scale(0.92)"/>
            <use href="#df-star" transform="translate(300.5 9.1) rotate(23) scale(1.69)"/>
            <use href="#df-star" transform="translate(300.5 969.1) rotate(23) scale(1.69)"/>
            <use href="#df-heart" transform="translate(822.5 616.2) rotate(23) scale(1.60)"/>
            <use href="#df-star" transform="translate(577.4 66.6) rotate(33) scale(1.27)"/>
            <use href="#df-heart" transform="translate(621.9 591.6) rotate(1) scale(1.30)"/>
            <use href="#df-swirl" transform="translate(23.8 131.3) rotate(24) scale(0.90)"/>
            <use href="#df-sprout" transform="translate(140.5 141.4) rotate(17) scale(1.13)"/>
            <use href="#df-heart" transform="translate(767.8 -10.8) rotate(25) scale(0.92)"/>
            <use href="#df-heart" transform="translate(767.8 949.2) rotate(25) scale(0.92)"/>
            <use href="#df-sparkle" transform="translate(856.0 602.3) rotate(14) scale(1.13)"/>
            <use href="#df-heart" transform="translate(232.4 853.4) rotate(-22) scale(1.22)"/>
            <use href="#df-heart" transform="translate(557.3 834.5) rotate(2) scale(0.96)"/>
            <use href="#df-sprout" transform="translate(98.8 163.1) rotate(40) scale(1.31)"/>
            <use href="#df-sprout" transform="translate(482.8 661.5) rotate(30) scale(0.92)"/>
            <use href="#df-swirl" transform="translate(57.7 420.1) rotate(2) scale(1.10)"/>
            <use href="#df-sparkle" transform="translate(528.8 506.7) rotate(13) scale(1.03)"/>
            <use href="#df-swirl" transform="translate(638.2 171.0) rotate(-32) scale(1.49)"/>
            <use href="#df-heart" transform="translate(723.8 92.7) rotate(-27) scale(1.50)"/>
            <use href="#df-swirl" transform="translate(347.4 439.0) rotate(-19) scale(1.13)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#doodle-tile)" stroke="none"/>
      </svg>
      <svg class="festive-item" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 4vw; --y: 30vh; --size: 96px; --dur: 110s; --delay: -10s; --drift: 60px; --spin: 120deg"><use href="#d-pumpkin"></use></svg>
      <svg class="festive-item" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 37vw; --y: 62vh; --size: 84px; --dur: 124s; --delay: -70s; --drift: -50px; --spin: -100deg"><use href="#d-gourd"></use></svg>
      <svg class="festive-item" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 66vw; --y: 80vh; --size: 88px; --dur: 104s; --delay: -38s; --drift: 40px; --spin: 140deg"><use href="#d-pumpkin"></use></svg>
      <svg class="festive-item" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 89vw; --y: 45vh; --size: 104px; --dur: 130s; --delay: -95s; --drift: -60px; --spin: -110deg"><use href="#d-pumpkin"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 18vw; --y: 38vh; --size: 64px; --dur: 64s; --delay: -12s; --drift: 60px; --spin: 220deg"><use href="#d-maple"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 46vw; --y: 12vh; --size: 58px; --dur: 72s; --delay: -40s; --drift: -50px; --spin: -260deg"><use href="#d-oak"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 73vw; --y: 58vh; --size: 70px; --dur: 76s; --delay: -55s; --drift: 60px; --spin: 200deg"><use href="#d-maple"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 94vw; --y: 26vh; --size: 56px; --dur: 70s; --delay: -30s; --drift: -60px; --spin: -220deg"><use href="#d-leaf"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 7vw; --y: 50vh; --size: 60px; --dur: 74s; --delay: -62s; --drift: 50px; --spin: 250deg"><use href="#d-oak"></use></svg>
      <svg class="festive-item falls" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--x: 84vw; --y: 70vh; --size: 62px; --dur: 66s; --delay: -24s; --drift: -50px; --spin: -200deg"><use href="#d-maple"></use></svg>
    </div>
`);
  script.remove();
})();
