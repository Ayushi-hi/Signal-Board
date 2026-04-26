
import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onCommandPalette?: () => void;
  onFocusSearch?: () => void;
  onShowHelp?: () => void;
  onNextItem?: () => void;
  onPrevItem?: () => void;
  onOpenSelected?: () => void;
  onEscapePressed?: () => void;
  onMarkReviewed?: () => void;
  onEscalate?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMacOS = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const modKey = isMacOS ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + K: Command palette
      if (modKey && event.key === 'k') {
        event.preventDefault();
        shortcuts.onCommandPalette?.();
      }

      // /: Focus search
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        if ((event.target as HTMLElement).tagName !== 'INPUT' && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
          event.preventDefault();
          shortcuts.onFocusSearch?.();
        }
      }

      // ?: Show help
      if (event.shiftKey && event.key === '?') {
        event.preventDefault();
        shortcuts.onShowHelp?.();
      }

      // j: Next item
      if (event.key === 'j' && !event.ctrlKey && !event.metaKey) {
        if ((event.target as HTMLElement).tagName !== 'INPUT' && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
          shortcuts.onNextItem?.();
        }
      }

      // k: Previous item
      if (event.key === 'k' && !event.ctrlKey && !event.metaKey) {
        if ((event.target as HTMLElement).tagName !== 'INPUT' && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
          shortcuts.onPrevItem?.();
        }
      }

      // Enter: Open selected item
      if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
        if ((event.target as HTMLElement).tagName !== 'INPUT' && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
          shortcuts.onOpenSelected?.();
        }
      }

      // Escape: Close detail view
      if (event.key === 'Escape') {
        shortcuts.onEscapePressed?.();
      }

      // r: Mark as reviewed
      if (event.key === 'r' && !event.ctrlKey && !event.metaKey) {
        if ((event.target as HTMLElement).tagName !== 'INPUT' && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
          shortcuts.onMarkReviewed?.();
        }
      }

      // e: Escalate
      if (event.key === 'e' && !event.ctrlKey && !event.metaKey) {
        if ((event.target as HTMLElement).tagName !== 'INPUT' && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
          shortcuts.onEscalate?.();
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};