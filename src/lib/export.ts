import html2canvas from 'html2canvas';

export interface ExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  width?: number;
  height?: number;
}

export const exportElementAsImage = async (
  elementId: string,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'cee-market-map',
    format = 'png',
    quality = 1,
    width = 1200,
    height = 800,
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Wait for images to load
    const images = element.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(void 0);
            } else {
              img.onload = () => resolve(void 0);
              img.onerror = () => resolve(void 0); // Continue even if image fails
            }
          })
      )
    );

    const canvas = await html2canvas(element, {
      width,
      height,
      scale: 2, // High DPI for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      removeContainer: true,
      logging: false,
    });

    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      `image/${format}`,
      quality
    );
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

export const shareToLinkedIn = (
  text: string,
  url?: string
): void => {
  const shareUrl = url || window.location.href;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(text)}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=500');
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};