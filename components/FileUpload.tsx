"use client";

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Trash2,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  analysis?: {
    recommendation: string;
    confidence: number;
    keyInsights: string[];
  };
}

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload and processing
    newFiles.forEach(file => {
      simulateFileProcessing(file.id);
    });
  };

  const simulateFileProcessing = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'uploading') {
          const newProgress = file.progress + 10;
          if (newProgress >= 100) {
            clearInterval(uploadInterval);
            setTimeout(() => processFile(fileId), 500);
            return { ...file, progress: 100, status: 'processing' };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  };

  const processFile = (fileId: string) => {
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        recommendation: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 30) + 70,
        keyInsights: [
          'Strong bullish momentum detected in uploaded chart',
          'Support level identified at 1.0825',
          'RSI indicates oversold conditions',
          'Volume analysis suggests accumulation phase'
        ]
      };

      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            status: 'completed',
            analysis: mockAnalysis
          };
        }
        return file;
      }));
    }, 2000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'text-blue-400 border-blue-400';
      case 'processing': return 'text-yellow-400 border-yellow-400';
      case 'completed': return 'text-green-400 border-green-400';
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Upload className="h-5 w-5 mr-2 text-blue-400" />
          Upload Analysis Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-900/20 border-blue-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-blue-200">
            Upload your trading charts, analysis reports, or CSV data files. Our AI will analyze them and provide actionable insights.
            <br />
            <strong>Supported formats:</strong> PNG, JPG, PDF, CSV, XLS, TXT
          </AlertDescription>
        </Alert>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-white mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Maximum file size: 10MB
          </p>
          <Button
            variant="outline"
            onClick={() => document.getElementById('fileInput')?.click()}
            className="border-gray-600 text-black hover:bg-gray-700"
          >
            Select Files
          </Button>
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf,.csv,.xls,.xlsx,.txt"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-white">Uploaded Files</h4>
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-900/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(file.status)}
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(file.status)}>
                      {file.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="mb-2" />
                )}

                {file.status === 'processing' && (
                  <div className="mb-2">
                    <p className="text-sm text-yellow-400">Analyzing with AI...</p>
                    <div className="animate-pulse bg-yellow-400/20 h-1 rounded mt-1" />
                  </div>
                )}

                {file.analysis && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="font-medium text-white">AI Analysis Results</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          file.analysis.recommendation === 'BUY'
                            ? 'text-green-400 border-green-400'
                            : file.analysis.recommendation === 'SELL'
                            ? 'text-red-400 border-red-400'
                            : 'text-yellow-400 border-yellow-400'
                        }
                      >
                        {file.analysis.recommendation}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-400">Confidence Level</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={file.analysis.confidence} className="flex-1" />
                          <span className="text-sm text-white">{file.analysis.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Recommendation</p>
                        <p className="text-sm font-medium text-white">{file.analysis.recommendation}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Key Insights</p>
                      <ul className="space-y-1">
                        {file.analysis.keyInsights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <TrendingUp className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Usage Tips */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Usage Tips</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Upload trading charts for technical analysis and pattern recognition</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>CSV files with historical data will generate comprehensive market analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>PDF reports will be analyzed for sentiment and key trading indicators</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>All uploaded files are processed securely and deleted after analysis</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}