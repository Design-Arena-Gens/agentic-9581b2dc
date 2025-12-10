'use client'

import { useState } from 'react'
import { Building2, TrendingUp, Users, DollarSign, Target, BarChart3, Loader2 } from 'lucide-react'

interface AnalysisResult {
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  pestle: {
    political: string[]
    economic: string[]
    social: string[]
    technological: string[]
    legal: string[]
    environmental: string[]
  }
  competitors: {
    name: string
    analysis: string
  }[]
  pricing: {
    strategy: string
    recommendations: string[]
  }
  marketing: {
    channels: string[]
    tactics: string[]
  }
  growth: {
    summary: string
    keyActions: string[]
  }
}

export default function Home() {
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!company.trim()) {
      setError('Please enter a company name')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to generate analysis. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AI Business Decision Support Tool</h1>
          </div>
          <p className="text-lg text-gray-600">
            Generate comprehensive business analysis for any company
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name (e.g., Amazon, Flipkart, Zomato)"
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Analysis'
              )}
            </button>
          </div>
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* SWOT Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">SWOT Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-3 text-lg">Strengths</h3>
                  <ul className="space-y-2">
                    {result.swot.strengths.map((item, idx) => (
                      <li key={idx} className="text-green-700 flex items-start">
                        <span className="mr-2">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 mb-3 text-lg">Weaknesses</h3>
                  <ul className="space-y-2">
                    {result.swot.weaknesses.map((item, idx) => (
                      <li key={idx} className="text-red-700 flex items-start">
                        <span className="mr-2">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">Opportunities</h3>
                  <ul className="space-y-2">
                    {result.swot.opportunities.map((item, idx) => (
                      <li key={idx} className="text-blue-700 flex items-start">
                        <span className="mr-2">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-bold text-orange-800 mb-3 text-lg">Threats</h3>
                  <ul className="space-y-2">
                    {result.swot.threats.map((item, idx) => (
                      <li key={idx} className="text-orange-700 flex items-start">
                        <span className="mr-2">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* PESTLE Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">PESTLE Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(result.pestle).map(([key, values]) => (
                  <div key={key} className="bg-purple-50 rounded-xl p-6">
                    <h3 className="font-bold text-purple-800 mb-3 text-lg capitalize">{key}</h3>
                    <ul className="space-y-2">
                      {values.map((item, idx) => (
                        <li key={idx} className="text-purple-700 text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Competitor Analysis</h2>
              </div>
              <div className="space-y-4">
                {result.competitors.map((competitor, idx) => (
                  <div key={idx} className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="font-bold text-indigo-800 mb-2 text-lg">{competitor.name}</h3>
                    <p className="text-indigo-700">{competitor.analysis}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Strategy */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Pricing Strategy</h2>
              </div>
              <div className="bg-green-50 rounded-xl p-6 mb-4">
                <h3 className="font-bold text-green-800 mb-2 text-lg">Strategy</h3>
                <p className="text-green-700">{result.pricing.strategy}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 text-lg">Recommendations</h3>
                <ul className="space-y-2">
                  {result.pricing.recommendations.map((item, idx) => (
                    <li key={idx} className="text-green-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Marketing Strategy */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-8 h-8 text-pink-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Marketing Strategy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-pink-50 rounded-xl p-6">
                  <h3 className="font-bold text-pink-800 mb-3 text-lg">Channels</h3>
                  <ul className="space-y-2">
                    {result.marketing.channels.map((item, idx) => (
                      <li key={idx} className="text-pink-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-pink-50 rounded-xl p-6">
                  <h3 className="font-bold text-pink-800 mb-3 text-lg">Tactics</h3>
                  <ul className="space-y-2">
                    {result.marketing.tactics.map((item, idx) => (
                      <li key={idx} className="text-pink-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-8 h-8 text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Growth Plan Summary</h2>
              </div>
              <div className="bg-teal-50 rounded-xl p-6 mb-4">
                <p className="text-teal-800 text-lg">{result.growth.summary}</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-6">
                <h3 className="font-bold text-teal-800 mb-3 text-lg">Key Actions</h3>
                <ul className="space-y-2">
                  {result.growth.keyActions.map((item, idx) => (
                    <li key={idx} className="text-teal-700 flex items-start">
                      <span className="mr-2 font-bold">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
