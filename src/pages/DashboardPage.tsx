import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Flame,
  Search,
  ArrowUpRight,
  TrendingUp,
  ExternalLink,
  Cpu,
  Layers,
  Database,
  Crosshair,
  Server,
  Sparkles
} from 'lucide-react'
import { useScanStore } from '../store/scanStore'
import { Button } from '../components/ui/button'

export default function DashboardPage() {
  const { history, addResult } = useScanStore()
  const [activeWindow, setActiveWindow] = useState<'24h' | '7d' | '30d'>('24h')

  // Sample data generator for quick test exploration
  const handleSeedSampleData = () => {
    const samples = [
      {
        scan_id: `demo-${Date.now()}-1`,
        target: '198.51.100.42',
        type: 'ip' as const,
        risk: { score: 92, level: 'CRITICAL', matched_rules: ['C2 Beacon', 'Known Botnet'] },
        signals: { abuse_score: 95, breach_count: 3, virustotal_detections: 14 },
        providers: { abuseipdb: { reports: 120 } }
      },
      {
        scan_id: `demo-${Date.now()}-2`,
        target: 'evil-phish-portal.com',
        type: 'domain' as const,
        risk: { score: 78, level: 'HIGH', matched_rules: ['Typosquatting', 'Phishing Domain'] },
        signals: { abuse_score: 80, breach_count: 1, virustotal_detections: 9 },
        providers: { urlscan: { malicious: true } }
      },
      {
        scan_id: `demo-${Date.now()}-3`,
        target: 'finance-auth-update.net',
        type: 'url' as const,
        risk: { score: 62, level: 'MEDIUM', matched_rules: ['Suspicious Redirect'] },
        signals: { abuse_score: 45, breach_count: 0, virustotal_detections: 3 },
        providers: { gemini: { verdict: 'suspicious' } }
      },
      {
        scan_id: `demo-${Date.now()}-4`,
        target: 'api.production-auth.net',
        type: 'domain' as const,
        risk: { score: 8, level: 'SAFE', matched_rules: ['Valid TLS', 'Verified DNS'] },
        signals: { abuse_score: 0, breach_count: 0, virustotal_detections: 0 },
        providers: { dns: { valid: true } }
      }
    ]
    samples.forEach(s => addResult(s))
  }

  const metrics = useMemo(() => {
    const critical = history.filter((scan) => scan.risk.level === 'CRITICAL' || scan.risk.score >= 85).length
    const high = history.filter((scan) => scan.risk.level === 'HIGH' || (scan.risk.score >= 60 && scan.risk.score < 85)).length
    const medium = history.filter((scan) => scan.risk.level === 'MEDIUM' || (scan.risk.score >= 35 && scan.risk.score < 60)).length
    const low = history.filter((scan) => scan.risk.level === 'LOW' || (scan.risk.score >= 15 && scan.risk.score < 35)).length
    const safe = history.filter((scan) => scan.risk.level === 'SAFE' || scan.risk.score < 15).length
    const avg = history.length > 0
      ? Math.round(history.reduce((sum, scan) => sum + scan.risk.score, 0) / history.length)
      : 0
    return { critical, high, medium, low, safe, avg }
  }, [history])

  const riskRows = [
    { label: 'Critical Risk (Sev-1)', count: metrics.critical, color: '#ef4444' },
    { label: 'High Exposure (Sev-2)', count: metrics.high, color: '#f97316' },
    { label: 'Medium Advisory', count: metrics.medium, color: '#f59e0b' },
    { label: 'Low Anomaly', count: metrics.low, color: '#0ea5e9' },
    { label: 'Verified Safe', count: metrics.safe, color: '#10b981' },
  ]

  const attackVectors = [
    { label: 'Ransomware & C2 Beacons', percentage: 38, color: '#ef4444' },
    { label: 'Credential Harvesting & Phish', percentage: 28, color: '#f97316' },
    { label: 'Zero-Day Vulnerability Probes', percentage: 20, color: '#f59e0b' },
    { label: 'Malicious IP Infrastructure', percentage: 14, color: '#3b82f6' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Top Banner / Operational Command */}
      <div className="cyber-card-elevated" style={{ background: 'linear-gradient(135deg, var(--surface-1) 0%, rgba(37,99,235,0.06) 100%)' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="pulse-indicator" style={{ color: '#10b981' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                SecOps Threat Command
              </h2>
              <span className="stat-metric-badge neutral">Active Sensor Node v4.8</span>
            </div>
            <p className="helper-text" style={{ margin: 0, fontSize: '0.85rem' }}>
              Telemetry pipeline listening to distributed threat intelligence feeds and real-time heuristics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div className="tab-pill-group">
              <button
                type="button"
                className={`tab-pill-item ${activeWindow === '24h' ? 'active' : ''}`}
                onClick={() => setActiveWindow('24h')}
              >
                24 Hours
              </button>
              <button
                type="button"
                className={`tab-pill-item ${activeWindow === '7d' ? 'active' : ''}`}
                onClick={() => setActiveWindow('7d')}
              >
                7 Days
              </button>
              <button
                type="button"
                className={`tab-pill-item ${activeWindow === '30d' ? 'active' : ''}`}
                onClick={() => setActiveWindow('30d')}
              >
                30 Days
              </button>
            </div>

            <Link to="/scan-center">
              <Button size="sm" startIcon={<Search size={14} />}>
                Launch Indicator Scan
              </Button>
            </Link>

            {history.length === 0 && (
              <Button variant="outline" size="sm" startIcon={<Sparkles size={14} />} onClick={handleSeedSampleData}>
                Load Live Sample Telemetry
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="dashboard-metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>

        {/* KPI 1 */}
        <div className="cyber-card-elevated">
          <div className="metric-card-head">
            <span className="cyber-label" style={{ fontSize: '0.74rem', fontWeight: 600 }}>TOTAL SCANS EXECUTED</span>
            <div style={{ padding: '0.35rem', background: 'var(--brand-soft)', borderRadius: '6px', color: 'var(--brand)' }}>
              <Layers size={16} />
            </div>
          </div>
          <div className="metric-number-lg">{history.length}</div>
          <div className="metric-meta-sub">
            <span className="stat-metric-badge positive">
              <TrendingUp size={11} /> +18.4%
            </span>
            <span>vs previous period</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="cyber-card-elevated">
          <div className="metric-card-head">
            <span className="cyber-label" style={{ fontSize: '0.74rem', fontWeight: 600 }}>CRITICAL SEV-1 THREATS</span>
            <div style={{ padding: '0.35rem', background: 'var(--color-critical-bg)', borderRadius: '6px', color: 'var(--color-critical)' }}>
              <Flame size={16} />
            </div>
          </div>
          <div className="metric-number-lg" style={{ color: metrics.critical > 0 ? '#ef4444' : 'inherit' }}>
            {metrics.critical}
          </div>
          <div className="metric-meta-sub">
            {metrics.critical > 0 ? (
              <span className="stat-metric-badge alert">Immediate Action Required</span>
            ) : (
              <span className="stat-metric-badge positive">Zero Active Breaches</span>
            )}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="cyber-card-elevated">
          <div className="metric-card-head">
            <span className="cyber-label" style={{ fontSize: '0.74rem', fontWeight: 600 }}>HIGH RISK VULNERABILITIES</span>
            <div style={{ padding: '0.35rem', background: 'var(--color-medium-bg)', borderRadius: '6px', color: 'var(--color-medium)' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="metric-number-lg">{metrics.high}</div>
          <div className="metric-meta-sub">
            <span className="stat-metric-badge neutral">
              <Activity size={11} /> Automated quarantine
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="cyber-card-elevated">
          <div className="metric-card-head">
            <span className="cyber-label" style={{ fontSize: '0.74rem', fontWeight: 600 }}>AGGREGATE RISK INDEX</span>
            <div style={{ padding: '0.35rem', background: 'var(--brand-soft)', borderRadius: '6px', color: 'var(--brand)' }}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="metric-number-lg">{metrics.avg}<span style={{ fontSize: '1.1rem', color: 'var(--text-2)', fontWeight: 500 }}> /100</span></div>
          <div className="metric-meta-sub">
            <span className={`stat-metric-badge ${metrics.avg > 50 ? 'alert' : 'positive'}`}>
              {metrics.avg > 50 ? 'High Threat Posture' : 'Guarded Posture'}
            </span>
          </div>
        </div>

      </div>

      {/* Middle Operations Matrix */}
      <div className="cyber-grid-2">

        {/* Risk Distribution Breakdown Panel */}
        <div className="cyber-card-elevated">
          <div className="row-between" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Crosshair size={18} style={{ color: 'var(--brand)' }} />
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Risk Exposure Breakdown</h3>
                <p className="helper-text" style={{ fontSize: '0.75rem', margin: 0 }}>Classified across {history.length} intelligence points</p>
              </div>
            </div>
            <span className="stat-metric-badge neutral">Heuristic Engine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {riskRows.map((row) => {
              const total = Math.max(history.length, 1)
              const pct = history.length > 0 ? Math.round((row.count / total) * 100) : 0
              return (
                <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>
                      {row.count} <span style={{ color: 'var(--text-2)', fontSize: '0.75rem' }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--bg-1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: row.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Threat Vector / Surface Breakdown */}
        <div className="cyber-card-elevated">
          <div className="row-between" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} style={{ color: 'var(--brand)' }} />
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Observed Attack Vectors</h3>
                <p className="helper-text" style={{ fontSize: '0.75rem', margin: 0 }}>Signature clusters from honeypots & feeds</p>
              </div>
            </div>
            <span className="stat-metric-badge positive">Live MITRE ATT&CK</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attackVectors.map((v) => (
              <div key={v.label} className="attack-vector-item">
                <div className="vector-header">
                  <span>{v.label}</span>
                  <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{v.percentage}%</span>
                </div>
                <div className="vector-bar">
                  <div
                    className="vector-bar-fill"
                    style={{ width: `${v.percentage}%`, background: v.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Live Recent Indicators Table / Feed */}
      <div className="cyber-card-elevated">
        <div className="row-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--brand)' }} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent Indicators of Compromise (IoC)</h3>
              <p className="helper-text" style={{ fontSize: '0.76rem', margin: 0 }}>
                Chronological ledger of analyzed IP addresses, domains, and suspicious endpoints
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link to="/threat-feed">
              <Button variant="ghost" size="sm" endIcon={<ArrowUpRight size={13} />}>
                View Global Feed
              </Button>
            </Link>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="table-wrap">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Target Indicator</th>
                  <th>Type</th>
                  <th className="align-right">Confidence Score</th>
                  <th className="align-right">Severity</th>
                  <th className="align-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 6).map((scan) => {
                  const level = scan.risk.level.toLowerCase().replace('_risk', '')
                  return (
                    <tr key={scan.scan_id}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {scan.target}
                      </td>
                      <td>
                        <span className="status-chip status-default" style={{ fontSize: '0.7rem' }}>
                          {scan.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="align-right" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {scan.risk.score} / 100
                      </td>
                      <td className="align-right">
                        <span className={`status-chip status-${level}`}>
                          {scan.risk.level}
                        </span>
                      </td>
                      <td className="align-right">
                        <Link to="/reports">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            Report <ExternalLink size={12} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: 'var(--bg-1)',
              borderRadius: '8px',
              border: '1px dashed var(--line-strong)'
            }}
          >
            <Cpu size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--text-2)', opacity: 0.7 }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.35rem' }}>No Telemetry Indicators Logged Yet</h4>
            <p className="helper-text" style={{ maxWidth: '420px', margin: '0 auto 1.25rem', fontSize: '0.82rem' }}>
              Your SOC dashboard populates automatically when indicator scans are conducted or live telemetry feeds are loaded.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/scan-center">
                <Button size="sm" startIcon={<Search size={14} />}>
                  Run First Scan
                </Button>
              </Link>
              <Button variant="outline" size="sm" startIcon={<Sparkles size={14} />} onClick={handleSeedSampleData}>
                Load Live Sample Telemetry
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
