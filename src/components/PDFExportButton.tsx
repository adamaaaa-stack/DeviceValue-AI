'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileDown, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFExportButtonProps {
  deviceData: {
    brand: string
    model: string
    storage?: string
    ram?: string
    accessories?: string
    valueMin: number
    valueMax: number
    confidence: number
    suggestedListing: string
    damageAnalysis?: {
      severity: string
      description: string
    }
    photoUrl?: string
  }
  marketData?: {
    averagePrice: number
    priceRange: { min: number; max: number }
    demandLevel: string
  }
}

export default function PDFExportButton({ deviceData, marketData }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 20
      let yPosition = margin

      // Header
      pdf.setFillColor(16, 185, 129) // Emerald-500
      pdf.rect(0, 0, pageWidth, 40, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('DeviceValue AI', margin, 26)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Valuation Report', pageWidth - margin - 40, 26)

      yPosition = 55

      // Device Info Section
      pdf.setTextColor(31, 41, 55) // Gray-800
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${deviceData.brand} ${deviceData.model}`, margin, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(107, 114, 128) // Gray-500
      
      const specs = []
      if (deviceData.storage) specs.push(`Storage: ${deviceData.storage}`)
      if (deviceData.ram) specs.push(`RAM: ${deviceData.ram}`)
      if (specs.length > 0) {
        pdf.text(specs.join(' | '), margin, yPosition)
        yPosition += 8
      }

      if (deviceData.accessories) {
        pdf.text(`Accessories: ${deviceData.accessories}`, margin, yPosition)
        yPosition += 8
      }

      yPosition += 10

      // Value Estimate Box
      pdf.setFillColor(243, 244, 246) // Gray-100
      pdf.roundedRect(margin, yPosition, pageWidth - margin * 2, 45, 5, 5, 'F')
      
      yPosition += 12
      pdf.setTextColor(107, 114, 128)
      pdf.setFontSize(10)
      pdf.text('ESTIMATED VALUE RANGE', margin + 10, yPosition)
      
      yPosition += 12
      pdf.setTextColor(16, 185, 129) // Emerald
      pdf.setFontSize(28)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`$${deviceData.valueMin.toLocaleString()} - $${deviceData.valueMax.toLocaleString()}`, margin + 10, yPosition)
      
      yPosition += 12
      pdf.setTextColor(107, 114, 128)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Confidence Score: ${deviceData.confidence}%`, margin + 10, yPosition)
      
      yPosition += 25

      // Damage Analysis
      if (deviceData.damageAnalysis) {
        pdf.setTextColor(31, 41, 55)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Damage Analysis', margin, yPosition)
        yPosition += 8
        
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(107, 114, 128)
        
        const severityColors: Record<string, number[]> = {
          none: [16, 185, 129],
          minor: [234, 179, 8],
          moderate: [249, 115, 22],
          severe: [239, 68, 68]
        }
        
        const color = severityColors[deviceData.damageAnalysis.severity] || severityColors.minor
        pdf.setTextColor(color[0], color[1], color[2])
        pdf.text(`Severity: ${deviceData.damageAnalysis.severity.toUpperCase()}`, margin, yPosition)
        yPosition += 6
        
        pdf.setTextColor(107, 114, 128)
        const descLines = pdf.splitTextToSize(deviceData.damageAnalysis.description, pageWidth - margin * 2)
        pdf.text(descLines, margin, yPosition)
        yPosition += descLines.length * 5 + 10
      }

      // Suggested Listing
      pdf.setTextColor(31, 41, 55)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Suggested Listing', margin, yPosition)
      yPosition += 8
      
      pdf.setFillColor(243, 244, 246)
      const listingLines = pdf.splitTextToSize(`"${deviceData.suggestedListing}"`, pageWidth - margin * 2 - 20)
      const listingBoxHeight = listingLines.length * 5 + 16
      pdf.roundedRect(margin, yPosition - 4, pageWidth - margin * 2, listingBoxHeight, 3, 3, 'F')
      
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(10)
      pdf.setTextColor(55, 65, 81)
      pdf.text(listingLines, margin + 10, yPosition + 6)
      yPosition += listingBoxHeight + 10

      // Market Comparison
      if (marketData) {
        pdf.setTextColor(31, 41, 55)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Market Comparison', margin, yPosition)
        yPosition += 10

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(107, 114, 128)
        
        pdf.text(`Average Market Price: $${marketData.averagePrice.toLocaleString()}`, margin, yPosition)
        yPosition += 6
        pdf.text(`Market Price Range: $${marketData.priceRange.min.toLocaleString()} - $${marketData.priceRange.max.toLocaleString()}`, margin, yPosition)
        yPosition += 6
        pdf.text(`Demand Level: ${marketData.demandLevel.toUpperCase()}`, margin, yPosition)
        yPosition += 15
      }

      // Footer
      pdf.setDrawColor(229, 231, 235)
      pdf.line(margin, pdf.internal.pageSize.getHeight() - 25, pageWidth - margin, pdf.internal.pageSize.getHeight() - 25)
      
      pdf.setFontSize(8)
      pdf.setTextColor(156, 163, 175)
      pdf.text(
        `Generated by DeviceValue AI | ${new Date().toLocaleDateString()}`,
        margin,
        pdf.internal.pageSize.getHeight() - 15
      )
      pdf.text(
        'This is an estimated value. Actual selling prices may vary.',
        margin,
        pdf.internal.pageSize.getHeight() - 10
      )

      // Save the PDF
      pdf.save(`DeviceValue_${deviceData.brand}_${deviceData.model}_Report.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileDown className="w-5 h-5" />
          Export PDF Report
        </>
      )}
    </motion.button>
  )
}

