'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';

interface ChatBubbleProps {
  message: Message;
  isSentByCurrentUser: boolean;
  onEdit?: (messageId: number, newContent: string) => void;
  onDelete?: (messageId: number) => void;
}

export default function ChatBubble({ message, isSentByCurrentUser, onEdit, onDelete }: ChatBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);

  // Update editContent when message content changes
  useEffect(() => {
    if (!isEditing) {
      setEditContent(message.content);
    }
  }, [message.content, isEditing]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      if (onDelete) {
        onDelete(message.id);
      }
    }
    setShowMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-end space-x-2 group ${isSentByCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {!isSentByCurrentUser && (
        <div className="flex-shrink-0">
          {message.sender_photo ? (
            <img
              src={message.sender_photo}
              alt={message.sender_name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <span className="text-xs font-bold text-gray-500">
                {message.sender_name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isSentByCurrentUser ? 'items-end' : 'items-start'} relative`}>
        {!isSentByCurrentUser && (
          <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-2 tracking-wide">{message.sender_name}</span>
        )}

        {isEditing ? (
          <div className="w-full">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-2 border border-primary-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
              rows={3}
              autoFocus
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary-600 font-medium"
              >
                Simpan
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`px-4 py-3 rounded-2xl relative shadow-sm ${isSentByCurrentUser
                  ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-br-sm shadow-orange-500/10'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-gray-100'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

              {message.file_url && (
                <a
                  href={message.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${isSentByCurrentUser ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>File Attachment</span>
                </a>
              )}

              {/* Menu Button (only for own messages) */}
              {isSentByCurrentUser && (onEdit || onDelete) && (
                <div ref={menuRef} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[140px] overflow-hidden">
                      {onEdit && (
                        <button
                          onClick={handleEdit}
                          className="w-full px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left flex items-center space-x-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Pesan</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={handleDelete}
                          className="w-full px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 text-left flex items-center space-x-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus Pesan</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 mt-1 px-1">
              <span className="text-[10px] text-gray-400 font-medium">{formatTime(message.created_at)}</span>
              {isSentByCurrentUser && !!message.is_read ? (
                <div className="bg-primary/10 rounded-full p-0.5">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


