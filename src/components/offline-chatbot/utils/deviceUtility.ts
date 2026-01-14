export const captureScreen = async (): Promise<string | null> => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    const video = document.createElement("video");
    video.srcObject = stream;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
      video.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    stream.getTracks().forEach((track) => track.stop());
    return imageUrl;
  } catch (err) {
    console.error("Screen capture failed:", err);
    return null;
  }
};

export const writeToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Clipboard write failed:", err);
    return false;
  }
};

export const readFromClipboard = async (): Promise<string | null> => {
  try {
    return await navigator.clipboard.readText();
  } catch (err) {
    console.error("Clipboard read failed:", err);
    return null;
  }
};
