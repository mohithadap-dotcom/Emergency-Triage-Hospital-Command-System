import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RefreshCw, Zap, ShieldAlert, BrainCircuit, ArrowRight } from 'lucide-react';
import { AiDisasterRecommendation, DisasterIncident } from '../../types';

interface DisasterAiCommanderViewProps {
  disaster: DisasterIncident;
  recommendations: AiDisasterRecommendation[];
  onExecuteRecommendation: (id: string) => void;
}

export const DisasterAiCommanderView: React.FC<DisasterAiCommanderViewProps> = ({
  disaster,
  recommendations,
  onExecuteRecommendation,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiAnalysisText, setGeminiAnalysisText] = useState<string | null>(null);

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/disaster/ai-commander', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          setGeminiAnalysisText(data.analysis);
        } else if (data.recommendation) {
          setGeminiAnalysisText(data.recommendation);
        }
      }
    } catch (err) {
      console.error('Failed to run Gemini AI commander analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded uppercase">
                Gemini 2.5 Flash Engine
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">Statewide AI Disaster Commander</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              National Disaster AI Decision Intelligence Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Continuous real-time optimization of casualty routing, green corridors, field hospitals, and surge balancing.
            </p>
          </div>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing State...' : 'RUN GEMINI DEEP ANALYSIS'}</span>
          </button>
        </div>

        {geminiAnalysisText && (
          <div className="bg-slate-950 border border-amber-500/50 p-4 rounded-lg text-xs font-mono text-amber-200 leading-relaxed whitespace-pre-wrap">
            {geminiAnalysisText}
          </div>
        )}
      </div>

      {/* Recommendations Feed */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
          Active AI Decision Intelligence Directives ({recommendations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                rec.status === 'EXECUTED'
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-amber-50/50 border-amber-300 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  {rec.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{rec.timestamp}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{rec.rationale}</p>

              <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-sky-800 font-bold">
                Suggested Action: {rec.suggestedAction}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="font-bold text-emerald-700">Impact: {rec.impactMetric}</span>
                {rec.status === 'PENDING' ? (
                  <button
                    onClick={() => onExecuteRecommendation(rec.id)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded text-xs shadow flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Execute Directive
                  </button>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Executed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
