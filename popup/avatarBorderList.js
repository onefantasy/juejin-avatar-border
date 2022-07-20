export default [
  {
    "name": "彩虹框",
    "value": {
      "element": `
        box-shadow: 0 0 0 2px red, 
          0 0 0 4px orange,
          0 0 0 6px yellow,
          0 0 0 8px green,
          0 0 0 10px #10b981,
          0 0 0 12px blue,
          0 0 0 12px purple;
        border-radius: 50%;
      `,
      "before": "",
      "after": "",
      "other": ""
    }
  },
  {
    "name": "BLUE",
    "value": {
      "element": `
        position: relative;
      `,
      "before": "",
      "after": `
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        width: calc(100% + 10px);
        height: calc(100% + 10px);
        border-radius: 50%;
        background-image: linear-gradient(to right, #06b6d4, #3b82f6, #6366f1, #d946ef, #ec4899);
        animation: rotateBorder 2s linear infinite;
      `,
      "other": `
        @keyframes rotateBorder {
          0% {
            transform: rotateZ(0);
          }
          100% {
            transform: rotateZ(720deg);
          }
        }
        .my-avatar-border img {
          z-index: 1;
        }
      `
    }
  },
  {
    "name": "蝴蝶结",
    "value": {
      "element": `
        width: 36px;
        height: 36px;
        position: relative;
        border-radius: 50%;
      `,
      "before": `
        content: '';
        position: absolute;
        bottom: -2.5px;
        left: 50%;
        transform: translateX(-50%);
        height: 15px;
        width: 10px;
        background-color: #334155;
        z-index: 1;
        border-radius: 5px;
      `,
      "after": `
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-width: 15px;
        border-style: solid;
        border-color: transparent;
        border-left-color: #1e293b;
        border-right-color: #1e293b;
        border-radius: 5px;
      `,
      "other": ""
    }
  },
  {
    "name": "test_4",
    "value": {
      "element": "",
      "before": "",
      "after": "",
      "other": ""
    }
  }
]