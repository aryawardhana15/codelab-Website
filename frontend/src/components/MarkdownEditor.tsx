import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    Code,
    Quote,
    Image as ImageIcon,
    Pencil,
    Eye,
} from 'lucide-react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder,
    rows = 10,
    className = '',
}: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    const insertFormat = (startTag: string, endTag: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + startTag + selection + endTag + after;

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + startTag.length,
                end + startTag.length,
            );
        }, 0);
    };

    const insertImage = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const url = window.prompt('Enter image URL:');
        if (!url) return;

        const altInput = window.prompt('Enter alt text (optional):', '');
        const alt = altInput ?? '';

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const after = text.substring(end);
        const snippet = `![${alt}](${url})`;

        onChange(before + snippet + after);

        setTimeout(() => {
            textarea.focus();
            const cursor = start + snippet.length;
            textarea.setSelectionRange(cursor, cursor);
        }, 0);
    };

    return (
        <div
            className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${className}`}
        >
            {/* Tabs */}
            <div className="flex items-center border-b border-gray-200 bg-gray-50">
                <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        activeTab === 'edit'
                            ? 'border-primary text-primary bg-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        activeTab === 'preview'
                            ? 'border-primary text-primary bg-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                </button>
            </div>

            {activeTab === 'edit' ? (
                <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                <ToolbarButton
                    icon={<Bold className="w-4 h-4" />}
                    label="Bold"
                    onClick={() => insertFormat('**', '**')}
                />
                <ToolbarButton
                    icon={<Italic className="w-4 h-4" />}
                    label="Italic"
                    onClick={() => insertFormat('_', '_')}
                />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton
                    icon={<Heading1 className="w-4 h-4" />}
                    label="Heading 1"
                    onClick={() => insertFormat('# ')}
                />
                <ToolbarButton
                    icon={<Heading2 className="w-4 h-4" />}
                    label="Heading 2"
                    onClick={() => insertFormat('## ')}
                />
                <ToolbarButton
                    icon={<Heading3 className="w-4 h-4" />}
                    label="Heading 3"
                    onClick={() => insertFormat('### ')}
                />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton
                    icon={<List className="w-4 h-4" />}
                    label="List"
                    onClick={() => insertFormat('- ')}
                />
                <ToolbarButton
                    icon={<Quote className="w-4 h-4" />}
                    label="Quote"
                    onClick={() => insertFormat('> ')}
                />
                <ToolbarButton
                    icon={<Code className="w-4 h-4" />}
                    label="Code Block"
                    onClick={() => insertFormat('```\n', '\n```')}
                />
                <ToolbarButton
                    icon={<ImageIcon className="w-4 h-4" />}
                    label="Image"
                    onClick={insertImage}
                />
            </div>

            {/* Editor */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 focus:outline-none focus:bg-gray-50/50 transition-colors resize-y font-mono text-sm"
                rows={rows}
                placeholder={placeholder}
            />
                </>
            ) : (
                <div
                    className="px-4 py-3 prose prose-sm max-w-none text-gray-700 min-h-[200px] overflow-auto"
                    style={{ minHeight: `${rows * 1.5}rem` }}
                >
                    {value.trim() ? (
                        <ReactMarkdown>{value}</ReactMarkdown>
                    ) : (
                        <p className="text-gray-400 italic">Tidak ada konten untuk ditampilkan.</p>
                    )}
                </div>
            )}

            {/* Legend/Help */}
            <div className="bg-gray-50 px-3 py-1.5 border-t border-gray-200 text-[10px] text-gray-500 flex justify-between">
                <span>Markdown supported</span>
                <a
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                >
                    Guide
                </a>
            </div>
        </div>
    );
}

function ToolbarButton({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-1.5 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-200 transition-colors"
            title={label}
        >
            {icon}
        </button>
    );
}
