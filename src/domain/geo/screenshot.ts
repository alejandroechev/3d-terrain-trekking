/**
 * Generate a timestamped filename for screenshot exports.
 */
export function generateScreenshotFilename(prefix: string): string {
  const now = new Date()
  const ts = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return `${prefix}-${ts}.png`
}

/**
 * Export a Three.js canvas as a downloadable PNG.
 * Call this with the canvas element from the R3F renderer.
 */
export function downloadCanvasScreenshot(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
