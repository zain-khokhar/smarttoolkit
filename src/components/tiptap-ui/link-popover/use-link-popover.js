"use client";
import * as React from "react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Lib ---
import { isMarkInSchema, sanitizeUrl } from "@/lib/tiptap-utils";

/**
 * Checks if a link can be set in the current editor state
 */
export function canSetLink(editor) {
  if (!editor || !editor.isEditable) return false
  return editor.can().setMark("link");
}

/**
 * Checks if a link is currently active in the editor
 */
export function isLinkActive(editor) {
  if (!editor || !editor.isEditable) return false
  return editor.isActive("link");
}

/**
 * Determines if the link button should be shown
 */
export function shouldShowLinkButton(props) {
  const { editor, hideWhenUnavailable } = props

  const linkInSchema = isMarkInSchema("link", editor)

  if (!linkInSchema || !editor) {
    return false
  }

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canSetLink(editor);
  }

  return true
}

/**
 * Custom hook for handling link operations in a Tiptap editor
 */
export function useLinkHandler(props) {
  const { editor, onSetLink } = props
  const [url, setUrl] = React.useState(null)

  React.useEffect(() => {
    if (!editor) return

    // Get URL immediately on mount
    const { href } = editor.getAttributes("link")

    if (isLinkActive(editor) && url === null) {
      setUrl(href || "")
    }
  }, [editor, url])

  React.useEffect(() => {
    if (!editor) return

    const updateLinkState = () => {
      const { href } = editor.getAttributes("link")
      setUrl(href || "")
    }

    editor.on("selectionUpdate", updateLinkState)
    return () => {
      editor.off("selectionUpdate", updateLinkState)
    };
  }, [editor])

  const setLink = React.useCallback(() => {
    if (!url || !editor) return

    const { selection } = editor.state
    const isEmpty = selection.empty

    let chain = editor.chain().focus()

    chain = chain.extendMarkRange("link").setLink({ href: url })

    if (isEmpty) {
      chain = chain.insertContent({ type: "text", text: url })
    }

    chain.run()

    setUrl(null)

    onSetLink?.()
  }, [editor, onSetLink, url])

  const removeLink = React.useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .setMeta("preventAutolink", true)
      .run()
    setUrl("")
  }, [editor])

  const openLink = React.useCallback((target = "_blank", features = "noopener,noreferrer") => {
    if (!url) return

    const safeUrl = sanitizeUrl(url, window.location.href)
    if (safeUrl !== "#") {
      window.open(safeUrl, target, features)
    }
  }, [url])

  return {
    url: url || "",
    setUrl,
    setLink,
    removeLink,
    openLink,
  }
}

/**
 * Custom hook for link popover state management
 */
export function useLinkState(props) {
  const { editor, hideWhenUnavailable = false } = props

  const canSet = canSetLink(editor)
  const isActive = isLinkActive(editor)

  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowLinkButton({
        editor,
        hideWhenUnavailable,
      }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    };
  }, [editor, hideWhenUnavailable])

  return {
    isVisible,
    canSet,
    isActive,
  }
}

/**
 * Main hook that provides link popover functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MyLinkButton() {
 *   const { isVisible, canSet, isActive, Icon, label } = useLinkPopover()
 *
 *   if (!isVisible) return null
 *
 *   return <button disabled={!canSet}>Link</button>
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedLinkButton() {
 *   const { isVisible, canSet, isActive, Icon, label } = useLinkPopover({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onSetLink: () => console.log('Link set!')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       disabled={!canSet}
 *       aria-label={label}
 *       aria-pressed={isActive}
 *     >
 *       <Icon />
 *       {label}
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useLinkPopover(config) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSetLink,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)

  const { isVisible, canSet, isActive } = useLinkState({
    editor,
    hideWhenUnavailable,
  })

  const linkHandler = useLinkHandler({
    editor,
    onSetLink,
  })

  return {
    isVisible,
    canSet,
    isActive,
    label: "Link",
    Icon: LinkIcon,
    ...linkHandler,
  }
}
