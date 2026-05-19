import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/ui/loader";
import {
  countRenderSidebar,
  downloadUrl,
  filterByPicType,
  filterRenderSidebar,
  formatProjectDate,
  formatRelativeTime,
  normalizeAlbumGalleryItems,
  normalizeConstructionFiles,
  normalizeRenderGalleryItems,
  pickCoverFromBasic,
  pickTitleFromBasic,
} from "../utils/kujialeRenders";

const TABS = [
  { id: "renders", label: "Render Picture" },
  { id: "video", label: "Video" },
  { id: "construction", label: "Construction drawings" },
];

const ProjectDetail = () => {
  const { designId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const listFallback = location.state?.project;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [basic, setBasic] = useState(null);
  const [renders, setRenders] = useState([]);
  const [videos, setVideos] = useState([]);
  const [construction, setConstruction] = useState([]);
  const [panoUrls, setPanoUrls] = useState({});
  const [workbenchUrl, setWorkbenchUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("renders");
  const [renderSidebar, setRenderSidebar] = useState("all");
  const [selected, setSelected] = useState(() => new Set());
  const [lightbox, setLightbox] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [planId, setPlanId] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [folderOpen, setFolderOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProject = useCallback(async () => {
    if (!designId) return;
    setLoading(true);
    setError(null);

    try {
      const { functions } = await import("../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      // Use designList (same Cloud Run as My Projects) — projectDetail is a separate service without env vars
      const getDesignList = httpsCallable(functions, "designList");
      const { data } = await getDesignList({ designId: String(designId) });

      setBasic(data?.basic ?? null);
      setRenders(normalizeRenderGalleryItems(data?.renders));
      setVideos(normalizeAlbumGalleryItems(data?.videos, "Video"));
      setConstruction(normalizeConstructionFiles(data?.constructionFiles));
      setPanoUrls(data?.panoUrls ?? {});
      setWorkbenchUrl(data?.workbenchUrl ?? null);
      setPlanId(data?.planId ?? data?.basic?.basicInfo?.planId ?? designId);

      if (data?.credentials) {
        console.info("Kujiale credentials in Cloud Function:", data.credentials);
      }

      const diagnostics = data?.apiDiagnostics;
      const renderCount = data?.renderCount ?? 0;
      const failed = Array.isArray(diagnostics)
        ? diagnostics.filter((d) => !d.ok)
        : [];
      if (failed.length > 0 && renderCount === 0 && !data?.videos?.length) {
        const msg = failed.map((d) => `${d.api} (${d.signMode}): ${d.m || d.c}`).join("; ");
        console.warn("Kujiale API diagnostics:", diagnostics);
        setError(`Could not load gallery data — ${msg}`);
      }
    } catch (err) {
      console.error("Project detail load failed:", err);
      setError("Could not load project details.");
    } finally {
      setLoading(false);
    }
  }, [designId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    setSelected(new Set());
  }, [activeTab, renderSidebar]);

  const title = pickTitleFromBasic(basic, listFallback?.name);
  const cover = pickCoverFromBasic(basic, listFallback?.coverPic);
  const info = basic?.basicInfo;
  const modified = formatRelativeTime(info?.modifiedTime ?? listFallback?.modifiedTime);
  const created = formatProjectDate(info?.created ?? listFallback?.createdTime);
  const srcArea = info?.srcArea != null ? Number(info.srcArea).toFixed(2) : null;
  const innerArea = info?.area != null ? Number(info.area).toFixed(2) : null;
  const levels = basic?.levels;
  const storyCount = Array.isArray(levels) ? levels.length : null;

  const renderSidebarCounts = useMemo(() => countRenderSidebar(renders), [renders]);
  const renderItems = useMemo(() => {
    const bySidebar = filterRenderSidebar(renders, renderSidebar);
    return filterByPicType(bySidebar, typeFilter);
  }, [renders, renderSidebar, typeFilter]);

  const activeItems = useMemo(() => {
    if (activeTab === "video") return videos;
    if (activeTab === "construction") return construction;
    return renderItems;
  }, [activeTab, renderItems, videos, construction]);

  const tabCounts = useMemo(
    () => ({
      renders: renders.length,
      video: videos.length,
      construction: construction.length,
    }),
    [renders.length, videos.length, construction.length],
  );

  const openWorkbench = () => {
    if (workbenchUrl) window.open(workbenchUrl, "_blank", "noopener,noreferrer");
  };

  const openEditor = () => {
    navigate(`/console?designid=${encodeURIComponent(designId)}`);
  };

  const open3DPreview = () => {
    const url = panoUrls?.designPanoUrl || panoUrls?.designAIPanoUrl || info?.designPanoUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === activeItems.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(activeItems.map((i) => i.id)));
    }
  };

  const downloadSelected = async () => {
    const items = activeItems.filter((i) => selected.has(i.id) && i.url);
    if (items.length === 0) return;

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      try {
        await downloadUrl(item.url, `${item.name || "asset"}-${idx + 1}`);
      } catch (e) {
        console.error(e);
        alert(`Download failed for ${item.name || "item"}.`);
        break;
      }
      if (idx < items.length - 1) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  };

  const handleCopyDesign = async () => {
    setMoreOpen(false);
    setActionLoading(true);
    try {
      const { functions } = await import("../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      const copy = httpsCallable(functions, "copyDesign");
      const { data } = await copy({ designId: String(designId) });
      const newId = data?.d?.designId || data?.d?.obsDesignId;
      if (newId) {
        navigate(`/my-projects/${encodeURIComponent(newId)}`, { replace: false });
      } else {
        alert("Copy requested. Check My Projects for the new plan.");
      }
    } catch (e) {
      console.error(e);
      alert("Copy failed. The plan may not be in a copyable state.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setMoreOpen(false);
    if (!window.confirm(`Delete project "${title}"?`)) return;
    setActionLoading(true);
    try {
      const { functions } = await import("../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      await httpsCallable(functions, "deleteDesign")({ designid: designId });
      navigate("/my-projects");
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const openMoveFolder = async () => {
    setMoreOpen(false);
    setFolderOpen(true);
    try {
      const { functions } = await import("../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      const { data } = await httpsCallable(functions, "listDesignTags")({ start: 0, num: 50 });
      const list = data?.d?.result || data?.d || [];
      setFolders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setFolders([]);
    }
  };

  const handleMoveToFolder = async (tagId) => {
    if (!planId) return;
    setActionLoading(true);
    try {
      const { functions } = await import("../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      await httpsCallable(functions, "moveDesignToTag")({ tagId, planId: String(planId) });
      setFolderOpen(false);
      alert("Moved to folder.");
    } catch (e) {
      console.error(e);
      alert("Move to folder failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelectedRenders = async () => {
    if (activeTab !== "renders" || selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} render image(s)?`)) return;
    setActionLoading(true);
    try {
      const { functions } = await import("../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      const picIds = activeItems.filter((i) => selected.has(i.id)).map((i) => i.id);
      await httpsCallable(functions, "deleteRenderPictures")({ picIds });
      setSelected(new Set());
      await loadProject();
    } catch (e) {
      console.error(e);
      alert("Delete render(s) failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-24">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-10">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/my-projects" className="hover:text-white transition-colors">
            My plan
          </Link>
          <span>/</span>
          <span className="text-gray-400">{info?.commName || listFallback?.commName || "Uncategorized"}</span>
          <span>/</span>
          <span className="text-white">Plan Detail</span>
        </nav>

        {error && (
          <p className="text-red-400 text-sm mb-6 border border-red-900/50 bg-red-950/20 px-4 py-3">
            {error}
          </p>
        )}

        <header className="border border-gray-900 bg-neutral-950/50 p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-44 h-32 bg-neutral-900 border border-gray-800 overflow-hidden shrink-0">
              {cover ? (
                <img
                src={cover}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 uppercase tracking-widest">
                  No cover
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-light tracking-tight">{title}</h1>
                  <div className="mt-3 space-y-1 text-sm text-gray-400">
                    {modified && <p>Modified: {modified}</p>}
                    {info?.city && <p>Address: {info.city}</p>}
                    {(srcArea || innerArea) && (
                      <p>
                        Space: Building {srcArea || "—"}m², Inside {innerArea || "—"}m²
                      </p>
                    )}
                    {storyCount != null && <p>Stories: {storyCount}</p>}
                    {created && <p>Time of creation: {created}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openEditor}
                    className="px-5 py-2.5 bg-white text-black text-xs font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors"
                  >
                    Design
                  </button>
                  <button
                    type="button"
                    onClick={open3DPreview}
                    disabled={!panoUrls?.designPanoUrl && !info?.designPanoUrl}
                    className="px-5 py-2.5 border border-gray-600 text-xs tracking-wider uppercase hover:border-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    3D Preview
                  </button>
                  {workbenchUrl && (
                    <button
                      type="button"
                      onClick={openWorkbench}
                      className="px-5 py-2.5 border border-gray-600 text-xs tracking-wider uppercase hover:border-white transition-colors"
                    >
                      Open gallery
                    </button>
                  )}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMoreOpen((o) => !o)}
                      className="px-5 py-2.5 border border-gray-600 text-xs tracking-wider uppercase hover:border-white transition-colors"
                    >
                      More
                    </button>
                    {moreOpen && (
                      <div className="absolute right-0 top-full mt-1 z-20 min-w-[200px] border border-gray-800 bg-neutral-950 shadow-xl py-1">
                        {workbenchUrl && (
                          <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-900" onClick={() => { setMoreOpen(false); openWorkbench(); }}>
                            Open gallery
                          </button>
                        )}
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-900" onClick={handleCopyDesign}>
                          Copy plan
                        </button>
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-900" onClick={openMoveFolder}>
                          Move to folder
                        </button>
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-900" onClick={() => { setMoreOpen(false); navigator.clipboard?.writeText(designId); }}>
                          Copy design ID
                        </button>
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/30" onClick={handleDeleteProject}>
                          Delete plan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="border-b border-gray-800 flex gap-6 overflow-x-auto mb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-white text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              {tabCounts[tab.id] > 0 ? ` ${tabCounts[tab.id]}` : ""}
            </button>
          ))}
        </div>

        <div className="border border-t-0 border-gray-900 bg-neutral-950/30 min-h-[420px] flex flex-col lg:flex-row">
          {activeTab === "renders" && (
            <aside className="lg:w-52 border-b lg:border-b-0 lg:border-r border-gray-900 p-4 shrink-0">
              {[
                { key: "all", label: "All pictures", count: renderSidebarCounts.all },
                { key: "topview", label: "Top view", count: renderSidebarCounts.topview },
                { key: "standard", label: "Standard", count: renderSidebarCounts.standard },
                { key: "pano", label: "Panorama", count: renderSidebarCounts.pano },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRenderSidebar(key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm mb-1 rounded-sm transition-colors ${
                    renderSidebar === key
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-gray-500 text-xs">{count}</span>
                </button>
              ))}
            </aside>
          )}

          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 mb-5 pb-4 border-b border-gray-900">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeItems.length > 0 && selected.size === activeItems.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-600"
                />
                select all {selected.size}/{activeItems.length}
              </label>
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={downloadSelected}
                className="px-4 py-1.5 text-xs tracking-widest uppercase border border-gray-700 hover:border-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Download
              </button>
              {activeTab === "renders" && (
                <>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-black border border-gray-700 text-xs px-3 py-1.5 text-gray-300"
                  >
                    <option value="all">All types</option>
                    <option value="standard">Standard</option>
                    <option value="pano">Panorama</option>
                    <option value="topview">Top view</option>
                  </select>
                  <button
                    type="button"
                    disabled={selected.size === 0}
                    onClick={handleDeleteSelectedRenders}
                    className="px-4 py-1.5 text-xs tracking-widest uppercase border border-gray-700 text-red-400 hover:border-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {activeItems.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-500 text-sm mb-4">
                  {activeTab === "renders" && "No render images for this category yet."}
                  {activeTab === "video" && "No videos returned for this plan."}
                  {activeTab === "construction" && "No construction archives found."}
                </p>
                {workbenchUrl && (
                  <button
                    type="button"
                    onClick={openWorkbench}
                    className="text-xs tracking-widest uppercase border border-gray-700 px-6 py-3 hover:border-white transition-colors"
                  >
                    Open gallery
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {activeItems.map((item) => {
                  const isSelected = selected.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`group relative aspect-[4/3] bg-neutral-900 border overflow-hidden ${
                        isSelected ? "border-white" : "border-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <label className="absolute top-2 right-2 z-10 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-600 bg-black/60"
                        />
                      </label>
                      <button
                        type="button"
                        className="w-full h-full text-left"
                        onClick={() => setLightbox(item)}
                      >
                        {item.pending ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs p-4 text-center">
                            <span>Rendering…</span>
                            <span className="text-[10px] mt-1 text-gray-600">{item.name}</span>
                          </div>
                        ) : item.thumbUrl || item.url ? (
                          <img
                            src={item.thumbUrl || item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                            {item.fileType || "File"}
                          </div>
                        )}
                        {item.qualityLabel && !item.pending && (item.thumbUrl || item.url) && (
                          <span className="absolute top-2 left-2 z-10 text-[9px] uppercase tracking-wider bg-black/80 px-1.5 py-0.5 text-gray-300">
                            {item.qualityLabel}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-xs tracking-widest uppercase bg-black/70 px-3 py-1.5">
                            View larger
                          </span>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                          <p className="text-[10px] text-gray-300 truncate">{item.name}</p>
                          {item.isPano && (
                            <span className="text-[9px] text-gray-500 tracking-widest">PANORAMA</span>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {folderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md border border-gray-800 bg-neutral-950 p-6">
            <h2 className="text-lg font-light mb-4">Move to folder</h2>
            {folders.length === 0 ? (
              <p className="text-gray-500 text-sm mb-4">No folders found.</p>
            ) : (
              <ul className="max-h-64 overflow-y-auto mb-4 space-y-1">
                {folders.map((f) => (
                  <li key={f.tagId || f.id}>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleMoveToFolder(f.tagId || f.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-sm transition-colors"
                    >
                      {f.tagName || f.name || f.tagId}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setFolderOpen(false)}
              className="text-xs tracking-widest uppercase border border-gray-700 px-4 py-2 hover:border-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {actionLoading && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center pointer-events-none">
          <Loader />
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="absolute top-6 right-6 flex gap-3">
            {lightbox.panoLink && (
              <a
                href={lightbox.panoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-gray-300 hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                Open panorama
              </a>
            )}
            {lightbox.url && !lightbox.isConstruction && (
              <button
                type="button"
                className="text-xs tracking-widest uppercase text-gray-300 hover:text-white"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await downloadUrl(lightbox.url, lightbox.name || "render");
                  } catch (err) {
                    alert(err.message || "Download failed.");
                  }
                }}
              >
                Download
              </button>
            )}
            <button
              type="button"
              className="text-xs tracking-widest uppercase text-gray-400 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              Close
            </button>
          </div>
          {lightbox.url && !lightbox.isConstruction && (
            <img
            src={lightbox.url}
            alt={lightbox.name}
            className="max-w-full max-h-[80vh] object-contain"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
          )}
          {lightbox.isConstruction && lightbox.url && (
            <button
              type="button"
              className="text-xs tracking-widest uppercase border border-gray-600 px-6 py-3 hover:border-white"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await downloadUrl(lightbox.url, lightbox.name || "drawing");
                } catch (err) {
                  alert(err.message || "Download failed.");
                }
              }}
            >
              Download {lightbox.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
