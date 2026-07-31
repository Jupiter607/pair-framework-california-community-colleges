import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Sparkles, FileCode, Image } from 'lucide-react';
import { analyzeDocument } from '../services/api';
import { UploadedDoc } from '../types';

interface DocumentUploaderProps {
  onDocumentAnalyzed: (doc: UploadedDoc, aiResult: any) => void;
  existingDocs: UploadedDoc[];
  onRemoveDoc: (id: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentAnalyzed,
  existingDocs,
  onRemoveDoc,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      let base64Data: string | undefined;
      let textData: string | undefined;

      const isText = file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json');

      if (isText) {
        textData = await file.text();
      } else {
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const aiResult = await analyzeDocument({
        name: file.name,
        mimeType: file.type || 'application/pdf',
        base64Data,
        textData,
      });

      const newDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        mimeType: file.type || 'application/pdf',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary: aiResult.summary || 'Uploaded document parsed.',
        extractedText: textData,
      };

      onDocumentAnalyzed(newDoc, aiResult);
    } catch (err: any) {
      console.error('Document analysis error:', err);
      setError(err.message || 'Could not analyze document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900 text-sm">Practitioner Document & Notes Ingestion</h3>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          PDF, TXT, MD, Images
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        id="dropzone-document-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt,.md,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-2 gap-2 text-indigo-600">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Gemini AI is parsing document & extracting P.A.I.R. insights...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-slate-600">
            <div className="p-2.5 bg-indigo-50 rounded-full text-indigo-600 mb-1">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-800">
              <span className="text-indigo-600 font-semibold underline">Click to upload</span> or drag and drop meeting notes, guidelines, or policies
            </p>
            <p className="text-xs text-slate-500">
              Supports statewide PDFs, whiteboards, notes, or draft policy documents
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Docs List */}
      {existingDocs.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Ingested Context Documents ({existingDocs.length})
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {existingDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs"
              >
                <div className="flex items-start gap-2.5 overflow-hidden">
                  {doc.mimeType.includes('image') ? (
                    <Image className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : doc.name.endsWith('.md') || doc.name.endsWith('.txt') ? (
                    <FileCode className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-800 truncate max-w-xs">{doc.name}</p>
                    {doc.summary && (
                      <p className="text-slate-500 line-clamp-2 mt-0.5">{doc.summary}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDoc(doc.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-200/60"
                  title="Remove document"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
