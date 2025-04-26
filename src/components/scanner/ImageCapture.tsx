import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';

interface ImageCaptureProps {
  onTextExtracted: (text: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onTextExtracted }) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cleanIngredientText = (text: string): string => {
    // Remove common non-ingredient sections
    const removePatterns = [
      /ingredients:/i,
      /contains:/i,
      /warning:/i,
      /directions:/i,
      /how to use:/i,
      /manufactured by:/i,
      /distributed by:/i,
      /made in/i,
      /\d+(\.\d+)?%/g, // Remove percentages
      /\([^)]*\)/g, // Remove parentheses and their contents
      /\bmay\s+contain\b.*$/i, // Remove "may contain" statements
    ];

    let cleanedText = text.toLowerCase();
    
    // Apply cleaning patterns
    removePatterns.forEach(pattern => {
      cleanedText = cleanedText.replace(pattern, '');
    });

    // Split by common delimiters and clean each ingredient
    const ingredients = cleanedText
      .split(/[,;•|\n]+/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => 
        ingredient && 
        ingredient.length > 1 && 
        !/^\d+$/.test(ingredient) && // Remove pure numbers
        !/^[a-z]$/.test(ingredient) // Remove single letters
      )
      .join(', ');

    return ingredients;
  };

  const extractText = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      
      // Clean and process the extracted text
      const cleanedText = cleanIngredientText(text);
      onTextExtracted(cleanedText);
    } catch (error) {
      console.error('Error extracting text:', error);
    }
    setIsProcessing(false);
  };

  const handleCapture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      extractText(imageSrc);
      setShowCamera(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        extractText(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {showCamera ? (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-4">
            <button
              onClick={handleCapture}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
              disabled={isProcessing}
            >
              <Camera className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowCamera(false)}
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowCamera(true)}
            className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            disabled={isProcessing}
          >
            <Camera className="h-5 w-5" />
            Open Camera
          </button>
          
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              disabled={isProcessing}
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </button>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Processing image...</p>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;