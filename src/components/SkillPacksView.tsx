import { useState, useEffect } from 'react';
import { Package, Download, ArrowLeft, Tag, Wrench, Info } from 'lucide-react';

interface SkillPackSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  tags: string[];
  category: string;
  skillCount: number;
  author: string;
  created_at: string;
  updated_at: string;
}

interface SkillInPack {
  path: string;
  name: string;
  description: string;
  metadata: {
    name: string;
    description: string;
    tags: string[];
    category: string;
    subcategory: string;
  } | null;
}

interface SkillPackDetail extends SkillPackSummary {
  skills: SkillInPack[];
  prerequisites: {
    required_tools: string[];
    optional_tools: string[];
    recommended_knowledge: string[];
  };
  installation_notes: string;
  use_cases: string[];
  related_packs: string[];
}

export default function SkillPacksView() {
  const [packs, setPacks] = useState<SkillPackSummary[]>([]);
  const [selectedPack, setSelectedPack] = useState<SkillPackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skill-packs');
      if (!response.ok) throw new Error('Failed to fetch skill packs');
      const data = await response.json();
      setPacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load packs');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackDetail = async (packId: string) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/skill-packs/${packId}`);
      if (!response.ok) throw new Error('Failed to fetch pack details');
      const data = await response.json();
      setSelectedPack(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pack details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePackClick = (packId: string) => {
    fetchPackDetail(packId);
  };

  const handleBack = () => {
    setSelectedPack(null);
  };

  const handleDownloadPack = async (packId: string) => {
    try {
      // Request download from backend
      const response = await fetch(`/api/skill-packs/${packId}/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download pack');
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${packId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download pack. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={fetchPacks}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  // Pack detail view
  if (selectedPack) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Skill Packs
          </button>

          <div className="flex items-start gap-4">
            <div className="text-6xl">{selectedPack.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedPack.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedPack.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Wrench className="w-4 h-4" />
                  {selectedPack.skillCount} skills
                </span>
                <span>v{selectedPack.version}</span>
                <span>{selectedPack.author}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {selectedPack.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedPack.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Download this pack
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get all {selectedPack.skillCount} skills as a ZIP file with complete documentation
              </p>
            </div>
            <button 
              onClick={() => handleDownloadPack(selectedPack.id)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Download ZIP
            </button>
          </div>
        </div>

        {/* Use Cases */}
        {selectedPack.use_cases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Use Cases</h2>
            <ul className="space-y-2">
              {selectedPack.use_cases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {(selectedPack.prerequisites.required_tools.length > 0 ||
          selectedPack.prerequisites.optional_tools.length > 0 ||
          selectedPack.prerequisites.recommended_knowledge.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Prerequisites</h2>
            <div className="space-y-4">
              {selectedPack.prerequisites.required_tools.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Required Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPack.prerequisites.required_tools.map(tool => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedPack.prerequisites.optional_tools.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Optional Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPack.prerequisites.optional_tools.map(tool => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedPack.prerequisites.recommended_knowledge.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Recommended Knowledge</h3>
                  <ul className="space-y-1">
                    {selectedPack.prerequisites.recommended_knowledge.map((knowledge, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                        • {knowledge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills List */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Included Skills ({selectedPack.skillCount})
          </h2>
          <div className="space-y-3">
            {selectedPack.skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {skill.metadata?.name || skill.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {skill.metadata?.description || skill.description}
                    </p>
                    {skill.metadata?.tags && skill.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skill.metadata.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Notes */}
        {selectedPack.installation_notes && (
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Installation Notes</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedPack.installation_notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Packs grid view
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Skill Packs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Curated collections of skills for specific domains and workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map(pack => (
          <div
            key={pack.id}
            onClick={() => handlePackClick(pack.id)}
            className="group cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all"
          >
            {/* Icon and Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{pack.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1">
                  {pack.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                  <Wrench className="w-4 h-4" />
                  {pack.skillCount} skills
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {pack.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {pack.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {pack.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 dark:text-gray-500 text-xs">
                  +{pack.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              <span>v{pack.version}</span>
              <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                View Details
                <span>→</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {packs.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No skill packs available</p>
        </div>
      )}
    </div>
  );
}
