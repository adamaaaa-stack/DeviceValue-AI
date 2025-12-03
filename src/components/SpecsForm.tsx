'use client'

import { motion } from 'framer-motion'
import { Smartphone, HardDrive, Cpu, Package } from 'lucide-react'

interface DeviceSpecs {
  brand: string
  model: string
  storage: string
  ram: string
  accessories: string
}

interface SpecsFormProps {
  specs: DeviceSpecs
  onChange: (specs: DeviceSpecs) => void
}

const brandSuggestions = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony', 
  'Microsoft', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'
]

const storageSuggestions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB']
const ramSuggestions = ['4GB', '6GB', '8GB', '12GB', '16GB', '32GB', '64GB']

export default function SpecsForm({ specs, onChange }: SpecsFormProps) {
  const updateSpec = (key: keyof DeviceSpecs, value: string) => {
    onChange({ ...specs, [key]: value })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Brand */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Brand
        </label>
        <input
          type="text"
          value={specs.brand}
          onChange={(e) => updateSpec('brand', e.target.value)}
          placeholder="e.g., Apple, Samsung"
          className="input-field"
          list="brands"
        />
        <datalist id="brands">
          {brandSuggestions.map(brand => (
            <option key={brand} value={brand} />
          ))}
        </datalist>
      </motion.div>

      {/* Model */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Model
        </label>
        <input
          type="text"
          value={specs.model}
          onChange={(e) => updateSpec('model', e.target.value)}
          placeholder="e.g., iPhone 15 Pro, Galaxy S24"
          className="input-field"
        />
      </motion.div>

      {/* Storage & RAM row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            Storage
          </label>
          <select
            value={specs.storage}
            onChange={(e) => updateSpec('storage', e.target.value)}
            className="input-field"
          >
            <option value="">Select...</option>
            {storageSuggestions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400" />
            RAM
          </label>
          <select
            value={specs.ram}
            onChange={(e) => updateSpec('ram', e.target.value)}
            className="input-field"
          >
            <option value="">Select...</option>
            {ramSuggestions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Accessories */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Package className="w-4 h-4 text-emerald-400" />
          Included Accessories
        </label>
        <textarea
          value={specs.accessories}
          onChange={(e) => updateSpec('accessories', e.target.value)}
          placeholder="e.g., Original box, charger, earbuds, case..."
          className="input-field min-h-[80px] resize-none"
        />
      </motion.div>

      {/* Quick tips */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
      >
        <p className="text-xs text-slate-400">
          💡 <span className="text-emerald-400 font-medium">Pro Tip:</span> Include all accessories and mention any special editions or variants for a more accurate valuation.
        </p>
      </motion.div>
    </motion.div>
  )
}

