'use client';

import { FileText, Download, ExternalLink } from 'lucide-react';

export default function SyllabusPage() {
  const pdfUrl = '/Ntclv7syallabus.pdf';

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Syllabus</h1>
            <p className="text-sm text-muted-foreground">
              NTC Level 7 Syllabus Document
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </a>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card">
        <iframe
          src={pdfUrl}
          className="h-full w-full min-h-[calc(100vh-12rem)]"
          title="NTC Level 7 Syllabus"
        />
      </div>
    </div>
  );
}
