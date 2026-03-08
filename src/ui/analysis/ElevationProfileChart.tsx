import { useRef, useEffect } from 'react'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'
import { buildElevationProfileData } from '../../domain/elevation/elevation-profile'
import { gradientToColor } from '../../domain/elevation/gradient-color'

interface ElevationProfileChartProps {
  route: GPXRoute
  width?: number
  height?: number
}

const PADDING = { top: 10, right: 10, bottom: 25, left: 40 }

export function ElevationProfileChart({
  route,
  width = 280,
  height = 120,
}: ElevationProfileChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const profileData = buildElevationProfileData(route.points)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || profileData.points.length < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const chartW = width - PADDING.left - PADDING.right
    const chartH = height - PADDING.top - PADDING.bottom
    const { minElevation, maxElevation, totalDistanceM } = profileData
    const elevRange = maxElevation - minElevation || 1

    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // Fill area under the profile with gradient colors
    for (let i = 1; i < profileData.points.length; i++) {
      const prev = profileData.points[i - 1]
      const curr = profileData.points[i]

      const x1 = PADDING.left + (prev.distanceM / totalDistanceM) * chartW
      const x2 = PADDING.left + (curr.distanceM / totalDistanceM) * chartW
      const y1 = PADDING.top + chartH - ((prev.elevation - minElevation) / elevRange) * chartH
      const y2 = PADDING.top + chartH - ((curr.elevation - minElevation) / elevRange) * chartH

      const rgb = gradientToColor(curr.gradientPercent)
      ctx.fillStyle = `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, 0.3)`
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineTo(x2, PADDING.top + chartH)
      ctx.lineTo(x1, PADDING.top + chartH)
      ctx.closePath()
      ctx.fill()

      // Line segment
      ctx.strokeStyle = `rgb(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Axes labels
    ctx.fillStyle = '#888'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(maxElevation)}m`, PADDING.left - 4, PADDING.top + 8)
    ctx.fillText(`${Math.round(minElevation)}m`, PADDING.left - 4, PADDING.top + chartH)

    ctx.textAlign = 'center'
    ctx.fillText('0', PADDING.left, height - 4)
    ctx.fillText(`${(totalDistanceM / 1000).toFixed(1)}km`, width - PADDING.right, height - 4)
  }, [profileData, width, height])

  return (
    <div className="bg-black/70 rounded-lg p-2">
      <h4 className="text-xs text-green-400 font-bold mb-1">{route.name}</h4>
      <canvas
        ref={canvasRef}
        data-testid="elevation-chart"
        width={width}
        height={height}
        className="rounded"
      />
    </div>
  )
}
