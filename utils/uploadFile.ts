
export const uploadFile = async (file: File): Promise<string> => {

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://lively-delicate-twill.glitch.me/uploadDocuments', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };