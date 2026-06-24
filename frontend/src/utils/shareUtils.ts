export interface ShareData {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

export const shareContent = async (data: ShareData, onFallback: () => void) => {
  if (navigator.share) {
    try {
      const sharePayload: any = {
        title: data.title,
      };      // Try to attach image if the browser supports sharing files and imageUrl is provided
      if (data.imageUrl && navigator.canShare) {
        try {
          const response = await fetch(data.imageUrl);
          const blob = await response.blob();
          
          // Determine extension from URL or fallback to jpeg
          const ext = data.imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
          const file = new File([blob], `share-image.${ext}`, {
            type: blob.type || 'image/jpeg',
          });

          if (navigator.canShare({ files: [file] })) {
            sharePayload.files = [file];
            // Highly optimized marketing text structure for WhatsApp/Instagram captions
            sharePayload.text = `*${data.title}* \n\n${data.text}\n\n👇 *Click the link below to order now!*\n${data.url}`;
          } else {
            sharePayload.text = data.text;
            sharePayload.url = data.url;
          }
        } catch (e) {
          console.warn("Could not fetch image for native share, falling back to url only", e);
          sharePayload.text = data.text;
          sharePayload.url = data.url;
        }
      } else {
        sharePayload.text = data.text;
        sharePayload.url = data.url;
      }

      await navigator.share(sharePayload);
    } catch (error: any) {
      // User cancelled or share failed, fallback if not abort error
      if (error.name !== 'AbortError') {
        console.error("Error sharing", error);
        onFallback();
      }
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    onFallback();
  }
};
