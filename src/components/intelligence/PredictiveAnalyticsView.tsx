import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  PieChart,
  Activity,
  Zap,
  Building2,
  HeartPulse,
} from 'lucide-react';
import { PredictiveAnalyticsData } from '../../types';

interface PredictiveAnalyticsViewProps {
  analytics: PredictiveAnalyticsData;
}

export const PredictiveAnalyticsView: React.FC<PredictiveAnalyticsViewProps> = ({ analytics }) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-black text-white tracking-wide">Predictive Model Performance & Intelligence Analytics</h3>
            <span className="text-[10px] bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-700">
              STATEWIDE PERFORMANCE BENCHMARKS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous validation metrics, AI forecast accuracy, doctor acceptance rates, latency diagnostics & resource demand curves.
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-xs text-right">
          <span className="text-[10px] text-slate-400 block">Model Inference Latency</span>
          <span className="font-mono font-black text-emerald-400">{analytics.modelLatencyMs} ms</span>
        </div>
      </div>

      {/* Primary Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Overall Prediction Accuracy</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400">{analytics.overallPredictionAccuracy}%</span>
          <span className="text-[10px] text-slate-400 block">Validated against ground truth clinical outcomes</span>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Recommendation Acceptance Rate</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-3xl font-black text-purple-300">{analytics.recommendationAcceptanceRate}%</span>
          <span className="text-[10px] text-slate-400 block">Approved by State Control & Clinical Medical Officers</span>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Forecast Accuracy Score</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-400">{analytics.forecastAccuracyScore}%</span>
          <span className="text-[10px] text-slate-400 block">Resource demand & ICU capacity predictions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emergency Trends: Actual vs Predicted */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between border-b pb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Emergency Trends (Actual vs AI Predicted)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">LAST 24 HOURS</span>
          </h4>

          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2 text-center text-xs">
              {analytics.emergencyTrends.map((tr, i) => (
                <div key={i} className="bg-slate-900 text-white p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">{tr.timeLabel}</span>
                  <span className="text-xs font-black text-emerald-400 block">Act: {tr.actual}</span>
                  <span className="text-[10px] text-purple-300 block">Pred: {tr.predicted}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Demand Index vs Capacity Index */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between border-b pb-2">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600" />
              Resource Demand vs Capacity Index
            </span>
            <span className="text-[10px] text-slate-500 font-mono">STATEWIDE</span>
          </h4>

          <div className="space-y-2">
            {analytics.resourceForecasts.map((rf, i) => (
              <div key={i} className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{rf.resource}</span>
                  <span className="text-slate-500">Demand: {rf.demandIndex} / Capacity: {rf.capacityIndex}</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-purple-600 h-full"
                    style={{ width: `${(rf.demandIndex / 100) * 100}%` }}
                    title={`Demand ${rf.demandIndex}`}
                  />
                  <div
                    className="bg-emerald-500 h-full opacity-60"
                    style={{ width: `${(rf.capacityIndex / 100) * 100}%` }}
                    title={`Capacity ${rf.capacityIndex}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
