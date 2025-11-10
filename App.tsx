import React, { useState, useCallback } from 'react';
import { CATEGORIES } from './constants';
import { generateMockups } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import CategorySelector from './components/CategorySelector';
import PromptInput from './components/PromptInput';
import MockupPreview from './components/MockupPreview';
import { SparklesIcon } from './components/Icons';

interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
}

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [customBackground, setCustomBackground] = useState<UploadedFile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setGeneratedMockups([]);
    setError(null);
  };

  const handleImageRemove = () => {
    setUploadedFile(null);
    setGeneratedMockups([]);
  };
  
  const handleBackgroundUpload = (file: UploadedFile) => {
    setCustomBackground(file);
  };

  const handleBackgroundRemove = () => {
    setCustomBackground(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedFile || !selectedCategory) {
      setError('Por favor, envie uma imagem e selecione uma categoria.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMockups([]);

    try {
      const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory;
      const mockups = await generateMockups(
        { base64: uploadedFile.base64, mimeType: uploadedFile.mimeType },
        categoryName,
        prompt,
        customBackground ? { base64: customBackground.base64, mimeType: customBackground.mimeType } : null
      );
      setGeneratedMockups(mockups);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar os mockups. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, selectedCategory, prompt, customBackground]);

  const canGenerate = uploadedFile !== null && selectedCategory !== '' && !isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
          <SparklesIcon className="h-8 w-8 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Gerador de Mockups com IA</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">1. Envie sua imagem</h2>
                <p className="text-sm text-gray-500 mb-4">Envie um arquivo PNG ou JPG.</p>
                <ImageUploader onImageUpload={handleImageUpload} onImageRemove={handleImageRemove} />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">2. Escolha o contexto</h2>
                <p className="text-sm text-gray-500 mb-4">Selecione onde sua imagem será aplicada.</p>
                <CategorySelector
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">3. Fundo Personalizado (Opcional)</h2>
                <p className="text-sm text-gray-500 mb-4">Envie uma imagem para usar como cenário.</p>
                <ImageUploader onImageUpload={handleBackgroundUpload} onImageRemove={handleBackgroundRemove} />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">4. Detalhe o estilo (Opcional)</h2>
                <p className="text-sm text-gray-500 mb-4">Descreva o estilo, cores ou ambiente.</p>
                <PromptInput value={prompt} onChange={setPrompt} />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <SparklesIcon className="h-5 w-5" />
                {isLoading ? 'Gerando...' : 'Gerar 4 Mockups'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 xl:col-span-9">
            <MockupPreview
              mockups={generatedMockups}
              isLoading={isLoading}
              error={error}
              hasAttemptedGeneration={generatedMockups.length > 0 || isLoading || !!error}
              onRegenerate={handleGenerate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;