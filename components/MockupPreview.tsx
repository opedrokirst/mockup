
import React from 'react';
import { DownloadIcon, ArrowPathIcon, ExclamationTriangleIcon, PhotoIcon } from './Icons';

interface MockupPreviewProps {
  mockups: string[];
  isLoading: boolean;
  error: string | null;
  hasAttemptedGeneration: boolean;
  onRegenerate: (index: number) => void;
}

const Spinner: React.FC = () => (
  <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LoadingState: React.FC = () => (
  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array(4).fill(0).map((_, index) => (
      <div key={index} className="aspect-square bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center animate-pulse">
        <PhotoIcon className="w-12 h-12 text-gray-300" />
      </div>
    ))}
  </div>
);

const MockupCard: React.FC<{ base64Image: string; onDownload: () => void; onRedo: () => void }> = ({ base64Image, onDownload, onRedo }) => {
  return (
    <div className="group relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <img src={`data:image/png;base64,${base64Image}`} alt="Mockup Gerado" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-4">
        <button
          onClick={onDownload}
          className="opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300 delay-100 flex items-center gap-2 bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-100"
        >
          <DownloadIcon className="h-5 w-5" />
          Baixar
        </button>
        <button
          onClick={onRedo}
          className="opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300 delay-200 flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-white"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Refazer
        </button>
      </div>
    </div>
  );
};

const MockupPreview: React.FC<MockupPreviewProps> = ({ mockups, isLoading, error, hasAttemptedGeneration, onRegenerate }) => {
  const handleDownload = (base64Image: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = `mockup-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerateAll = () => {
    // In this simpler version, any "Redo" button triggers a full regeneration.
    // The index is ignored for now, but the prop is kept for future-proofing.
    onRegenerate(0);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col items-center justify-center text-center">
        <Spinner />
        <p className="mt-4 text-lg font-semibold text-gray-700">Gerando seus mockups...</p>
        <p className="text-sm text-gray-500">A mágica da IA está acontecendo. Isso pode levar um momento.</p>
        <div className="w-full mt-8">
            <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 min-h-[400px] flex flex-col items-center justify-center text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-800">Oops, algo deu errado!</p>
        <p className="text-sm text-red-700 max-w-md">{error}</p>
      </div>
    );
  }

  if (!hasAttemptedGeneration) {
    return (
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col items-center justify-center text-center">
        <PhotoIcon className="h-16 w-16 text-gray-300" />
        <p className="mt-4 text-lg font-semibold text-gray-700">Seus mockups aparecerão aqui</p>
        <p className="text-sm text-gray-500 max-w-md">Preencha os campos ao lado e clique em "Gerar" para começar a criar.</p>
      </div>
    );
  }

  if (mockups.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockups.map((base64, index) => (
          <MockupCard
            key={index}
            base64Image={base64}
            onDownload={() => handleDownload(base64)}
            onRedo={handleRegenerateAll}
          />
        ))}
      </div>
    );
  }
  
  return null;
};

export default MockupPreview;
