/**
 * 请求全屏
 * @param {Element} element 元素
 */
export const requestFullscreen = (element) => {
  if (window.ActiveXObject) {
    let wsShell = new ActiveXObject('WScript.Shell');
    wsShell.SendKeys('{F11}');
  } else if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
};

/**
 *  退出全屏
 * @param {Element} element 元素
 */
export const exitFullscreen = (element) => {
  if (window.ActiveXObject) {
    var wsShell = new ActiveXObject('WScript.Shell');
    wsShell.SendKeys('{F11}');
  } else if (element.requestFullScreen) {
    document.exitFullscreen();
  } else if (element.msRequestFullscreen) {
    document.msExitFullscreen();
  } else if (element.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (element.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
