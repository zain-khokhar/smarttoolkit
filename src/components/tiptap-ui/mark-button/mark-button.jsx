"use client";
import * as React from "react"

// --- Lib ---
import { parseShortcutKeys } from "@/lib/tiptap-utils"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

import { MARK_SHORTCUT_KEYS, useMark } from "@/components/tiptap-ui/mark-button"

import { Button } from "@/components/tiptap-ui-primitive/button"
import { Badge } from "@/components/tiptap-ui-primitive/badge"

export function MarkShortcutBadge({
  type,
  shortcutKeys = MARK_SHORTCUT_KEYS[type]
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for toggling marks in a Tiptap editor.
 *
 * For custom button implementations, use the `useMark` hook instead.
 */
export const MarkButton = React.forwardRef((
  {
    editor: providedEditor,
    type,
    text,
    hideWhenUnavailable = false,
    onToggled,
    showShortcut = false,
    onClick,
    children,
    ...buttonProps
  },
  ref
) => {
  const { editor } = useTiptapEditor(providedEditor)
  const {
    isVisible,
    handleMark,
    label,
    canToggle,
    isActive,
    Icon,
    shortcutKeys,
  } = useMark({
    editor,
    type,
    hideWhenUnavailable,
    onToggled,
  })

  const handleClick = React.useCallback((event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    handleMark()
  }, [handleMark, onClick])

  if (!isVisible) {
    return null
  }

  return (
    <Button
      type="button"
      disabled={!canToggle}
      data-style="ghost"
      data-active-state={isActive ? "on" : "off"}
      data-disabled={!canToggle}
      role="button"
      tabIndex={-1}
      aria-label={label}
      aria-pressed={isActive}
      tooltip={label}
      onClick={handleClick}
      {...buttonProps}
      ref={ref}>
      {children ?? (
        <>
          <Icon className="tiptap-button-icon" />
          {text && <span className="tiptap-button-text">{text}</span>}
          {showShortcut && (
            <MarkShortcutBadge type={type} shortcutKeys={shortcutKeys} />
          )}
        </>
      )}
    </Button>
  );
})

MarkButton.displayName = "MarkButton"
