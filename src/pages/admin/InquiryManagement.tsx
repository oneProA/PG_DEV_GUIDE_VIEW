import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  type AdminInquiryDetail,
  type AdminInquiryEntry,
  type AdminInquiryStatus,
  fetchAdminInquiries,
  fetchAdminInquiryDetail,
  updateAdminInquiryAnswer,
} from '../../api/admin';

type TabKey = 'ALL' | AdminInquiryStatus;
type InquiryCategoryCode = 'ALL' | 'PAYMENT_ERROR' | 'API_INTEGRATION' | 'ACCOUNT_PERMISSION' | 'ETC';

type AnswerUploadFile = {
  key: string;
  file: File;
  previewUrl: string;
};

const PAGE_SIZE = 10;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png']);

const STATUS_LABEL: Record<AdminInquiryStatus, string> = {
  RECEIVED: '접수',
  IN_PROGRESS: '처리중',
  ANSWERED: '답변완료',
};

const CATEGORY_LABEL: Record<Exclude<InquiryCategoryCode, 'ALL'>, string> = {
  PAYMENT_ERROR: '결제/승인 오류',
  API_INTEGRATION: 'API 연동 문의',
  ACCOUNT_PERMISSION: '계정/권한 설정',
  ETC: '기타',
};

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateText: string, days: number): string {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function daysBetweenInclusive(fromDateText: string, toDateText: string): number {
  const from = new Date(`${fromDateText}T00:00:00`).getTime();
  const to = new Date(`${toDateText}T00:00:00`).getTime();
  return Math.floor((to - from) / (24 * 60 * 60 * 1000)) + 1;
}

function getStatusClass(status: AdminInquiryStatus) {
  if (status === 'RECEIVED') return 'bg-red-50 text-red-500';
  if (status === 'IN_PROGRESS') return 'bg-blue-50 text-blue-500';
  return 'bg-zinc-100 text-zinc-500';
}

function toStatusParam(tab: TabKey): AdminInquiryStatus | undefined {
  return tab === 'ALL' ? undefined : tab;
}

function toCategoryParam(categoryCode: InquiryCategoryCode): Exclude<InquiryCategoryCode, 'ALL'> | undefined {
  return categoryCode === 'ALL' ? undefined : categoryCode;
}

function looksLikeHtml(text: string): boolean {
  return /<\s*[a-zA-Z][^>]*>/.test(text);
}

const InquiryManagement: React.FC = () => {
  const answerEditorRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('RECEIVED');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<InquiryCategoryCode>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    const base = new Date(today);
    base.setDate(base.getDate() - 6);
    return formatDate(base);
  });
  const [toDate, setToDate] = useState(() => formatDate(new Date()));
  const [inquiries, setInquiries] = useState<AdminInquiryEntry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiryDetail | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [answerFiles, setAnswerFiles] = useState<AnswerUploadFile[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState<AdminInquiryStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageTotalCount, setPageTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [allCount, setAllCount] = useState(0);
  const [reloadTick, setReloadTick] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<AdminInquiryStatus, number>>({
    RECEIVED: 0,
    IN_PROGRESS: 0,
    ANSWERED: 0,
  });
  const isDateFilterIgnored = activeTab === 'RECEIVED' || activeTab === 'IN_PROGRESS';

  const applySelectedInquiry = (detail: AdminInquiryDetail) => {
    setSelectedInquiry(detail);
    setAnswerDraft(detail.answerContentText ?? '');
    setAnswerFiles((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  };

  useEffect(() => {
    if (answerEditorRef.current) {
      answerEditorRef.current.innerHTML = answerDraft;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInquiry?.id]);

  useEffect(() => {
    return () => {
      answerFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [answerFiles]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setListLoading(true);
      setErrorMessage(null);

      const keyword = searchKeyword.trim() || undefined;
      const categoryCode = toCategoryParam(selectedCategoryCode);
      const status = toStatusParam(activeTab);
      const dateFrom = isDateFilterIgnored ? undefined : fromDate;
      const dateTo = isDateFilterIgnored ? undefined : toDate;

      if (!isDateFilterIgnored && dateFrom && dateTo && daysBetweenInclusive(dateFrom, dateTo) > 31) {
        setInquiries([]);
        setPageTotalCount(0);
        setTotalPages(1);
        setAllCount(0);
        setStatusCounts({
          RECEIVED: 0,
          IN_PROGRESS: 0,
          ANSWERED: 0,
        });
        setSelectedInquiry(null);
        setAnswerDraft('');
        setErrorMessage('조회 기간은 최대 31일까지 선택할 수 있습니다.');
        setListLoading(false);
        return;
      }

      try {
        const [listResult, allResult, receivedResult, inProgressResult, answeredResult] = await Promise.all([
          fetchAdminInquiries({
            page,
            size: PAGE_SIZE,
            keyword,
            status,
            categoryCode,
            fromDate: dateFrom,
            toDate: dateTo,
          }),
          fetchAdminInquiries({
            page: 1,
            size: 1,
            keyword,
            categoryCode,
            fromDate: dateFrom,
            toDate: dateTo,
          }),
          fetchAdminInquiries({
            page: 1,
            size: 1,
            keyword,
            categoryCode,
            status: 'RECEIVED',
            fromDate: dateFrom,
            toDate: dateTo,
          }),
          fetchAdminInquiries({
            page: 1,
            size: 1,
            keyword,
            categoryCode,
            status: 'IN_PROGRESS',
            fromDate: dateFrom,
            toDate: dateTo,
          }),
          fetchAdminInquiries({
            page: 1,
            size: 1,
            keyword,
            categoryCode,
            status: 'ANSWERED',
            fromDate: dateFrom,
            toDate: dateTo,
          }),
        ]);
        if (!mounted) return;

        setInquiries(listResult.items);
        setPageTotalCount(listResult.totalCount);
        setTotalPages(listResult.totalPages);

        setAllCount(allResult.totalCount);
        setStatusCounts({
          RECEIVED: receivedResult.totalCount,
          IN_PROGRESS: inProgressResult.totalCount,
          ANSWERED: answeredResult.totalCount,
        });

        if (listResult.items.length === 0) {
          setSelectedInquiry(null);
          setAnswerDraft('');
          return;
        }

        const prevId = selectedInquiry?.id;
        const nextId =
          prevId && listResult.items.some((item) => item.id === prevId) ? prevId : listResult.items[0].id;

        setDetailLoading(true);
        try {
          const detail = await fetchAdminInquiryDetail(nextId);
          if (!mounted) return;
          applySelectedInquiry(detail);
        } finally {
          if (mounted) setDetailLoading(false);
        }
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(error instanceof Error ? error.message : '문의 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setListLoading(false);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, [activeTab, page, searchKeyword, selectedCategoryCode, fromDate, toDate, isDateFilterIgnored, reloadTick]);

  const tabs = useMemo(
    () => [
      { id: 'ALL' as const, label: `전체 (${allCount})` },
      { id: 'RECEIVED' as const, label: `접수 (${statusCounts.RECEIVED})` },
      { id: 'IN_PROGRESS' as const, label: `처리중 (${statusCounts.IN_PROGRESS})` },
      { id: 'ANSWERED' as const, label: `답변완료 (${statusCounts.ANSWERED})` },
    ],
    [allCount, statusCounts.ANSWERED, statusCounts.IN_PROGRESS, statusCounts.RECEIVED],
  );

  const openInquiry = async (entry: AdminInquiryEntry) => {
    setDetailLoading(true);
    setErrorMessage(null);
    try {
      const detail = await fetchAdminInquiryDetail(entry.id);
      applySelectedInquiry(detail);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '문의 상세를 불러오지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const generateFileKey = (index: number) =>
    `answer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${index}`;

  const syncAnswerContent = () => {
    setAnswerDraft(answerEditorRef.current?.innerHTML ?? '');
  };

  const insertImageToAnswerEditor = (file: AnswerUploadFile) => {
    const editor = answerEditorRef.current;
    if (!editor) return;

    const image = document.createElement('img');
    image.setAttribute('src', file.previewUrl);
    image.setAttribute('data-inline-key', file.key);
    image.setAttribute('alt', file.file.name);
    image.style.maxWidth = '100%';
    image.style.borderRadius = '12px';
    image.style.margin = '8px 0';
    image.style.display = 'block';

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      range.insertNode(image);
      range.setStartAfter(image);
      range.setEndAfter(image);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editor.appendChild(image);
    }

    image.after(document.createElement('br'));
    syncAnswerContent();
  };

  const removeImageFromAnswerEditor = (fileKey: string) => {
    const editor = answerEditorRef.current;
    if (!editor) return;
    editor.querySelectorAll(`img[data-inline-key="${fileKey}"]`).forEach((node) => node.remove());
    syncAnswerContent();
  };

  const addAnswerFilesToEditor = (selected: File[]) => {
    if (selected.length === 0) return;
    const validNewItems: AnswerUploadFile[] = [];

    for (const file of selected) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        setErrorMessage(`허용되지 않는 파일 형식입니다: ${file.name} (jpg, png만 가능)`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`파일 크기 초과: ${file.name} (최대 10MB)`);
        continue;
      }
      const key = generateFileKey(validNewItems.length);
      const previewUrl = URL.createObjectURL(file);
      validNewItems.push({ key, file, previewUrl });
    }

    if (validNewItems.length > 0) {
      setErrorMessage(null);
      setAnswerFiles((prev) => [...prev, ...validNewItems]);
      validNewItems.forEach((item) => insertImageToAnswerEditor(item));
    }
  };

  const handleAnswerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    addAnswerFilesToEditor(selected);
    event.target.value = '';
  };

  const handleAnswerEditorPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const imageFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));

    if (imageFiles.length === 0) return;
    event.preventDefault();
    addAnswerFilesToEditor(imageFiles);
  };

  const handleRemoveAnswerImage = (fileKey: string) => {
    setAnswerFiles((prev) => {
      const target = prev.find((item) => item.key === fileKey);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.key !== fileKey);
    });
    removeImageFromAnswerEditor(fileKey);
  };

  const handleSaveAndStatus = async (status: AdminInquiryStatus) => {
    if (!selectedInquiry) return;
    setSavingStatus(status);
    setErrorMessage(null);
    try {
      await updateAdminInquiryAnswer(selectedInquiry.id, {
        answerContentText: answerDraft.trim(),
        status,
        files: answerFiles.map((item) => ({ key: item.key, file: item.file })),
      });
      setAnswerFiles((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        return [];
      });
      setReloadTick((prev) => prev + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '답변/상태 저장에 실패했습니다.');
    } finally {
      setSavingStatus(null);
    }
  };

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const startIndex = pageTotalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = pageTotalCount === 0 ? 0 : Math.min(page * PAGE_SIZE, pageTotalCount);

  return (
    <div className="flex-1 animate-in fade-in duration-500 bg-[#f9fafb] p-8 rounded-tl-3xl">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2">문의관리</h1>
          <p className="text-sm text-zinc-500 font-medium">사용자 기술 문의를 확인하고 상태를 관리합니다.</p>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]">
            search
          </span>
          <input
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
              setPage(1);
            }}
            placeholder="문의 번호, 제목, 작성자 검색"
            className="w-80 rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-zinc-700 outline-none focus:border-primary/30"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-white rounded-full p-1 border border-zinc-200 shadow-sm w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`text-xs font-bold px-6 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'border-primary border bg-white text-primary shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={activeTab}
          onChange={(event) => {
            setActiveTab(event.target.value as TabKey);
            setPage(1);
          }}
          className="md:hidden h-[36px] rounded-full border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 outline-none focus:border-primary/30"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>

        <select
          value={selectedCategoryCode}
          onChange={(event) => {
            setSelectedCategoryCode(event.target.value as InquiryCategoryCode);
            setPage(1);
          }}
          className="h-[36px] rounded-full border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 outline-none focus:border-primary/30"
        >
          <option value="ALL">전체 카테고리</option>
          <option value="PAYMENT_ERROR">결제/승인 오류</option>
          <option value="API_INTEGRATION">API 연동 문의</option>
          <option value="ACCOUNT_PERMISSION">계정/권한 설정</option>
          <option value="ETC">기타</option>
        </select>

        <input
          type="date"
          value={fromDate}
          disabled={isDateFilterIgnored}
          onChange={(event) => {
            const nextFrom = event.target.value;
            const maxFrom = toDate;
            const minFrom = addDays(toDate, -30);
            if (nextFrom > maxFrom) {
              setFromDate(maxFrom);
            } else if (nextFrom < minFrom) {
              setFromDate(minFrom);
            } else {
              setFromDate(nextFrom);
            }
            setPage(1);
          }}
          min={addDays(toDate, -30)}
          max={toDate}
          className={`h-[36px] rounded-full border border-zinc-200 bg-white px-3 text-xs font-bold outline-none focus:border-primary/30 ${
            isDateFilterIgnored ? 'text-zinc-400 bg-zinc-100 cursor-not-allowed' : 'text-zinc-700'
          }`}
        />
        <span className="text-zinc-400 text-xs font-bold">~</span>
        <input
          type="date"
          value={toDate}
          disabled={isDateFilterIgnored}
          onChange={(event) => {
            const nextTo = event.target.value;
            const minTo = fromDate;
            const maxTo = addDays(fromDate, 30);
            if (nextTo < minTo) {
              setToDate(minTo);
            } else if (nextTo > maxTo) {
              setToDate(maxTo);
            } else {
              setToDate(nextTo);
            }
            setPage(1);
          }}
          min={fromDate}
          max={addDays(fromDate, 30)}
          className={`h-[36px] rounded-full border border-zinc-200 bg-white px-3 text-xs font-bold outline-none focus:border-primary/30 ${
            isDateFilterIgnored ? 'text-zinc-400 bg-zinc-100 cursor-not-allowed' : 'text-zinc-700'
          }`}
        />
        {isDateFilterIgnored ? (
          <span className="h-[36px] inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 text-[11px] font-bold text-blue-600">
            접수/처리중은 기간 필터 미적용 (전체 조회)
          </span>
        ) : null}
      </div>

      {errorMessage ? <p className="mb-4 text-sm font-bold text-red-500">{errorMessage}</p> : null}

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-3 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          {listLoading ? (
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 text-sm font-bold text-zinc-400">
              문의 목록을 불러오는 중입니다.
            </div>
          ) : inquiries.length === 0 ? (
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 text-sm font-bold text-zinc-400">
              표시할 문의가 없습니다.
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => void openInquiry(inquiry)}
                className={`p-6 rounded-3xl transition-all cursor-pointer ${
                  selectedInquiry?.id === inquiry.id
                    ? 'bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
                    : 'bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-zinc-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{inquiry.inquiryNo}</span>
                  <span className="text-[11px] font-bold text-zinc-400 tracking-widest">{inquiry.createdAt}</span>
                </div>
                <h3
                  className={`font-black text-lg mb-2 leading-tight ${
                    selectedInquiry?.id === inquiry.id ? 'text-zinc-900' : 'text-zinc-700'
                  }`}
                >
                  {inquiry.title}
                </h3>
                <p className="text-xs text-zinc-500 mb-5 line-clamp-1">{inquiry.preview}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 shrink-0" />
                    <span className="text-[11px] font-bold text-zinc-600 truncate">
                      {inquiry.authorName} <span className="opacity-60">({inquiry.authorUsername})</span>
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${getStatusClass(inquiry.status)}`}>
                    {STATUS_LABEL[inquiry.status]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col bg-white rounded-3xl border border-zinc-100 shadow-sm p-8 min-h-[800px]">
          {!selectedInquiry ? (
            <div className="h-full flex items-center justify-center text-sm font-bold text-zinc-400">
              문의를 선택하면 상세 내용이 표시됩니다.
            </div>
          ) : detailLoading ? (
            <div className="h-full flex items-center justify-center text-sm font-bold text-zinc-400">
              문의 상세를 불러오는 중입니다.
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-zinc-900">{selectedInquiry.title}</h2>
                <span className={`text-xs font-black px-3 py-1 rounded-md ${getStatusClass(selectedInquiry.status)}`}>
                  {STATUS_LABEL[selectedInquiry.status]}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-zinc-400 tracking-wider mb-8 pb-8 border-b border-zinc-100">
                <span>문의 번호: {selectedInquiry.inquiryNo}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span>
                  카테고리:{' '}
                  {CATEGORY_LABEL[selectedInquiry.categoryCode as Exclude<InquiryCategoryCode, 'ALL'>] ??
                    selectedInquiry.categoryCode}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span>
                  작성자 {selectedInquiry.authorName} ({selectedInquiry.authorUsername})
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                {looksLikeHtml(selectedInquiry.contentText) ? (
                  <div
                    className="text-sm font-medium text-zinc-700 leading-relaxed mb-6 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-2"
                    dangerouslySetInnerHTML={{ __html: selectedInquiry.contentText }}
                  />
                ) : (
                  <p className="text-sm font-medium text-zinc-700 leading-relaxed mb-6 whitespace-pre-wrap">
                    {selectedInquiry.contentText}
                  </p>
                )}

                {selectedInquiry.files.filter((file) => file.ownerType === 'INQUIRY' && file.fileRole === 'ATTACHMENT')
                  .length > 0 && (
                  <div className="mb-10 space-y-2">
                    {selectedInquiry.files
                      .filter((file) => file.ownerType === 'INQUIRY' && file.fileRole === 'ATTACHMENT')
                      .map((file) => (
                        <a
                          key={file.id}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 group cursor-pointer w-fit"
                        >
                          <span className="material-symbols-outlined text-[18px] text-zinc-400 group-hover:text-zinc-700 transition-colors">
                            attach_file
                          </span>
                          <span className="text-[13px] font-medium text-zinc-500 italic group-hover:text-zinc-700 transition-colors">
                            {file.originalFileName}
                          </span>
                        </a>
                      ))}
                  </div>
                )}
              </div>

              <div className="bg-zinc-50 rounded-2xl p-6 mt-auto">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">dynamic_feed</span>
                    <span className="font-black text-sm text-zinc-900">답변하기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void handleSaveAndStatus('IN_PROGRESS')}
                      disabled={savingStatus !== null}
                      className="bg-blue-50 px-3 py-2 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                    >
                      처리중으로 변경
                    </button>
                    <button
                      onClick={() => void handleSaveAndStatus('ANSWERED')}
                      disabled={savingStatus !== null}
                      className="bg-primary px-3 py-2 rounded-lg text-xs font-black text-white hover:brightness-95 disabled:opacity-50"
                    >
                      답변완료
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    ref={answerEditorRef}
                    contentEditable
                    onInput={syncAnswerContent}
                    onPaste={handleAnswerEditorPaste}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-5 text-sm text-zinc-700 outline-none min-h-[200px] max-h-[360px] overflow-y-auto shadow-sm [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-2"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      multiple
                      onChange={handleAnswerFileChange}
                      className="text-xs text-zinc-600 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-200 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-zinc-800"
                    />
                  </div>

                  {answerFiles.length > 0 ? (
                    <ul className="space-y-1 text-xs text-zinc-500">
                      {answerFiles.map((item) => (
                        <li key={item.key} className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAnswerImage(item.key)}
                            className="text-red-500 hover:text-red-600 font-bold"
                          >
                            제거
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-start px-2 py-6 text-[11px] font-bold tracking-wider text-zinc-400">
        <div className="flex items-center gap-2">
          <span>
            총 {pageTotalCount}건 중 {startIndex}-{endIndex} 표시
          </span>
          <button
            type="button"
            onClick={() => canGoPrev && setPage((prev) => prev - 1)}
            disabled={!canGoPrev}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-black text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => canGoNext && setPage((prev) => prev + 1)}
            disabled={!canGoNext}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-black text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryManagement;
