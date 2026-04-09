import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '../hooks/useAuth';
import { createSupportInquiry, fetchMySupportInquiries, type MySupportInquiryEntry } from '../api/support';

const CATEGORY_OPTIONS = [
  { value: 'PAYMENT_ERROR', label: '결제/승인 오류' },
  { value: 'API_INTEGRATION', label: 'API 연동 문의' },
  { value: 'ACCOUNT_PERMISSION', label: '계정/권한 설정' },
  { value: 'ETC', label: '기타' },
] as const;

const STATUS_LABEL: Record<MySupportInquiryEntry['status'], string> = {
  RECEIVED: '접수',
  IN_PROGRESS: '처리중',
  ANSWERED: '답변완료',
};

const CATEGORY_LABEL: Record<MySupportInquiryEntry['categoryCode'], string> = {
  PAYMENT_ERROR: '결제/승인 오류',
  API_INTEGRATION: 'API 연동 문의',
  ACCOUNT_PERMISSION: '계정/권한 설정',
  ETC: '기타',
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png']);
const PAGE_SIZE = 5;

type EditorUploadFile = {
  key: string;
  file: File;
  previewUrl: string;
};

function toYmdHmLabel(value: string): string {
  if (!value) return '-';
  return value;
}

function generateFileKey(index: number): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${index}`;
}

function hasContent(html: string): boolean {
  const textOnly = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  const hasImage = /<img\b/i.test(html);
  return textOnly.length > 0 || hasImage;
}

const Support: React.FC = () => {
  const { user, setLoginOpen } = useAuthStore();
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [categoryCode, setCategoryCode] = useState<MySupportInquiryEntry['categoryCode']>('PAYMENT_ERROR');
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [editorFiles, setEditorFiles] = useState<EditorUploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<MySupportInquiryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedInquiries = useMemo(
    () =>
      [...inquiries].sort((a, b) => {
        const left = new Date(a.createdAt).getTime();
        const right = new Date(b.createdAt).getTime();
        return right - left;
      }),
    [inquiries],
  );

  const totalPages = Math.max(1, Math.ceil(sortedInquiries.length / PAGE_SIZE));

  const pagedInquiries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedInquiries.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedInquiries]);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && hasContent(contentHtml) && !submitting,
    [contentHtml, submitting, title],
  );

  const loadInquiries = async () => {
    if (!user) return;
    setLoadingList(true);
    try {
      const data = await fetchMySupportInquiries(user.username, 100);
      setInquiries(data);
      setCurrentPage(1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '문의 내역을 불러오지 못했습니다.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    void loadInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    return () => {
      editorFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [editorFiles]);

  const syncEditorContent = () => {
    const html = editorRef.current?.innerHTML ?? '';
    setContentHtml(html);
  };

  const insertImageToEditor = (file: EditorUploadFile) => {
    const editor = editorRef.current;
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

    const breakNode = document.createElement('br');
    image.after(breakNode);
    syncEditorContent();
    editor.focus();
  };

  const removeImageFromEditor = (fileKey: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.querySelectorAll(`img[data-inline-key="${fileKey}"]`).forEach((node) => {
      node.remove();
    });
    syncEditorContent();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;

    addFilesToEditor(selected);
    event.target.value = '';
  };

  const addFilesToEditor = (selected: File[]) => {
    if (selected.length === 0) return;

    const validNewItems: EditorUploadFile[] = [];

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
      setEditorFiles((prev) => [...prev, ...validNewItems]);
      validNewItems.forEach((item) => insertImageToEditor(item));
    }
  };

  const handleEditorPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const imageFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));

    if (imageFiles.length === 0) {
      return;
    }

    event.preventDefault();
    addFilesToEditor(imageFiles);
  };

  const handleRemoveImage = (fileKey: string) => {
    setEditorFiles((prev) => {
      const target = prev.find((item) => item.key === fileKey);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.key !== fileKey);
    });
    removeImageFromEditor(fileKey);
  };

  const resetEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    editorFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setEditorFiles([]);
    setContentHtml('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const created = await createSupportInquiry({
        username: user.username,
        categoryCode,
        title,
        contentText: contentHtml,
        files: editorFiles.map((item) => ({ key: item.key, file: item.file })),
      });
      setSuccessMessage(`문의가 등록되었습니다. 문의번호: ${created.inquiryNo}`);
      setTitle('');
      resetEditor();
      await loadInquiries();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '문의 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-8">
        <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-800 shadow-sm animate-pulse">
          <span className="material-symbols-outlined text-4xl text-zinc-300">lock</span>
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">로그인이 필요한 서비스입니다</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-10 leading-relaxed font-medium">
          지원 센터와 1:1 기술 문의를 이용하시려면
          <br />
          먼저 로그인해 주세요.
        </p>
        <button
          onClick={() => setLoginOpen(true)}
          className="bg-primary text-white px-10 py-4 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-8 lg:p-10 max-w-none mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">Support Center</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
          CJ PG 연동 중 발생하는 기술적인 이슈나 궁금한 점을 등록해 주세요.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10">
            <div className="mb-8">
              <h3 className="text-xl font-black mb-2">1:1 기술 문의</h3>
              <p className="text-white/60 text-xs font-medium leading-relaxed">
                본문에 이미지를 직접 삽입할 수 있습니다. (jpg, png / 최대 10MB)
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={categoryCode}
                  onChange={(event) => setCategoryCode(event.target.value as MySupportInquiryEntry['categoryCode'])}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-all"
                >
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value} className="text-zinc-900 bg-white">
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-all"
                  placeholder="문의 제목을 입력해 주세요."
                />
              </div>

              <div className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-[280px]">
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={syncEditorContent}
                  onPaste={handleEditorPaste}
                  className="outline-none min-h-[240px] leading-relaxed"
                  data-placeholder="상세한 문의 내용을 입력해 주세요. 이미지 업로드 시 본문에 바로 삽입됩니다."
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                {!hasContent(contentHtml) ? (
                  <p className="text-white/40 text-sm pointer-events-none -mt-[240px] select-none">
                    상세한 문의 내용을 입력해 주세요. 이미지 업로드 시 본문에 바로 삽입됩니다.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col md:flex-row md:items-stretch gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs font-bold text-white/80">첨부 이미지</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange}
                      className="text-xs text-white/80 file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-zinc-900"
                    />
                  </div>
                  {editorFiles.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-[11px] text-white/70">
                      {editorFiles.map((item) => (
                        <li key={item.key} className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item.key)}
                            className="text-red-200 hover:text-red-100 font-bold"
                          >
                            제거
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="md:shrink-0 md:self-stretch md:flex md:items-center md:justify-center bg-white text-zinc-900 px-5 py-3 rounded-xl text-sm font-black hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? '등록 중...' : '문의 등록하기'}
                </button>
              </div>

              {errorMessage ? <p className="text-xs font-bold text-red-300">{errorMessage}</p> : null}
              {successMessage ? <p className="text-xs font-bold text-emerald-300">{successMessage}</p> : null}
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              내 문의 내역
              <span className="bg-primary/10 text-primary text-[11px] px-2 py-1 rounded-lg font-bold">{inquiries.length}</span>
            </h3>
          </div>

          {loadingList ? (
            <p className="text-sm font-bold text-zinc-400">문의 내역을 불러오는 중입니다.</p>
          ) : inquiries.length === 0 ? (
            <p className="text-sm font-bold text-zinc-400">등록된 문의가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {pagedInquiries.map((inquiry) => (
                <div
                  key={inquiry.inquiryId}
                  className="group p-5 rounded-2xl border border-zinc-50 dark:border-zinc-900 hover:border-primary/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      {CATEGORY_LABEL[inquiry.categoryCode]} · {inquiry.inquiryNo}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                        inquiry.status === 'ANSWERED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : inquiry.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {STATUS_LABEL[inquiry.status]}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2 group-hover:text-primary transition-colors">
                    {inquiry.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium">{toYmdHmLabel(inquiry.createdAt)}</p>
                </div>
              ))}

              {sortedInquiries.length > PAGE_SIZE ? (
                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="text-xs font-bold text-zinc-500 min-w-[64px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
