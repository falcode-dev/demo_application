export const isPowerAppsEnvironment = (): boolean => {
  try {
    return window.parent !== window && (window.parent as any).Xrm !== undefined;
  } catch (e) {
    return window.parent !== window;
  }
};

export const closePage = (): void => {
  if (isPowerAppsEnvironment()) {
    try {
      window.parent.postMessage({
        type: 'closePage'
      }, '*');
    } catch (e) {
      window.close();
    }
  } else {
    window.close();
  }
};

