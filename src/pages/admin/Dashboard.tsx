import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type AdminInquiryEntry,
  fetchAdminInquiries,
  fetchAdminInquiryDashboardSummary,
  fetchAdminInquiryDashboardUnhandled,
} from '../../api/admin';

const CATEGORY_LABEL: Record<string, string> = {
  PAYMENT_ERROR: '결제/승인 오류',
  API_INTEGRATION: 'API 연동 문의',
  ACCOUNT_PERMISSION: '계정/권한 설정',
  ETC: '기타',
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: '접수',
  IN_PROGRESS: '처리중',
  ANSWERED: '답변완료',
};

const CATEGORY_COLORS: Record<string, string> = {
  PAYMENT_ERROR: '#f600a6',
  API_INTEGRATION: '#007aff',
  ACCOUNT_PERMISSION: '#971bad',
  ETC: '#22c55e',
};

const CATEGORY_CODES = ['PAYMENT_ERROR', 'API_INTEGRATION', 'ACCOUNT_PERMISSION', 'ETC'] as const;

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildRecent7Dates(endDate: Date): string[] {
  return Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (6 - idx));
    return formatDateOnly(date);
  });
}

function getTodayVsYesterdayRate(todayCount: number, yesterdayCount: number): number {
  if (yesterdayCount <= 0) {
    return todayCount > 0 ? 100 : 0;
  }
  return ((todayCount - yesterdayCount) / yesterdayCount) * 100;
}

function formatSignedPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const absText = Number.isInteger(rounded) ? `${Math.abs(rounded)}` : `${Math.abs(rounded).toFixed(1)}`;
  if (rounded > 0) return `+${absText}%`;
  if (rounded < 0) return `-${absText}%`;
  return '0%';
}

function formatMonthDay(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const todayLabel = new Date().toLocaleDateString('ko-KR');
  const now = new Date();
  const monthLabel = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')} 기준`;

  const [summary, setSummary] = useState({
    todayReceivedCount: 0,
    unhandledCount: 0,
    avgResponseMinutes: 0,
  });
  const [todayReceivedChangeRate, setTodayReceivedChangeRate] = useState(0);
  const [recentUnhandled, setRecentUnhandled] = useState<AdminInquiryEntry[]>([]);
  const [dailyInquiryCounts, setDailyInquiryCounts] = useState<number[]>(Array(7).fill(0));
  const [dailyWindowOffsetDays, setDailyWindowOffsetDays] = useState(0);
  const [monthlyCategoryCounts, setMonthlyCategoryCounts] = useState<Record<string, number>>({
    PAYMENT_ERROR: 0,
    API_INTEGRATION: 0,
    ACCOUNT_PERMISSION: 0,
    ETC: 0,
  });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const current = new Date();
        const today = formatDateOnly(current);

        const yesterdayDate = new Date(current);
        yesterdayDate.setDate(current.getDate() - 1);
        const yesterday = formatDateOnly(yesterdayDate);

        const monthStartDate = new Date(current.getFullYear(), current.getMonth(), 1);
        const monthStart = formatDateOnly(monthStartDate);

        const categoryRequests = CATEGORY_CODES.map((categoryCode) =>
          fetchAdminInquiries({
            page: 1,
            size: 1,
            categoryCode,
            fromDate: monthStart,
            toDate: today,
          }),
        );

        const [summaryData, unhandledData, todayAllData, yesterdayAllData, ...categoryData] = await Promise.all([
          fetchAdminInquiryDashboardSummary(),
          fetchAdminInquiryDashboardUnhandled(5),
          fetchAdminInquiries({
            page: 1,
            size: 1,
            fromDate: today,
            toDate: today,
          }),
          fetchAdminInquiries({
            page: 1,
            size: 1,
            fromDate: yesterday,
            toDate: yesterday,
          }),
          ...categoryRequests,
        ]);

        if (!mounted) return;

        const todayAllCount = Number(todayAllData.totalCount ?? 0);
        const yesterdayAllCount = Number(yesterdayAllData.totalCount ?? 0);

        setSummary({
          ...summaryData,
          todayReceivedCount: todayAllCount,
        });
        setTodayReceivedChangeRate(getTodayVsYesterdayRate(todayAllCount, yesterdayAllCount));
        setRecentUnhandled(unhandledData);

        const nextMonthlyCounts = CATEGORY_CODES.reduce<Record<string, number>>((acc, categoryCode, index) => {
          acc[categoryCode] = Number(categoryData[index]?.totalCount ?? 0);
          return acc;
        }, {});
        setMonthlyCategoryCounts(nextMonthlyCounts);
      } catch {
        if (!mounted) return;
        setSummary({
          todayReceivedCount: 0,
          unhandledCount: 0,
          avgResponseMinutes: 0,
        });
        setTodayReceivedChangeRate(0);
        setRecentUnhandled([]);
        setMonthlyCategoryCounts({
          PAYMENT_ERROR: 0,
          API_INTEGRATION: 0,
          ACCOUNT_PERMISSION: 0,
          ETC: 0,
        });
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const trendEndDate = new Date();
        trendEndDate.setDate(trendEndDate.getDate() - dailyWindowOffsetDays);

        const recent7Dates = buildRecent7Dates(trendEndDate);
        const dailyData = await Promise.all(
          recent7Dates.map((dateText) =>
            fetchAdminInquiries({
              page: 1,
              size: 1,
              fromDate: dateText,
              toDate: dateText,
            }),
          ),
        );

        if (!mounted) return;
        setDailyInquiryCounts(dailyData.map((item) => Number(item?.totalCount ?? 0)));
      } catch {
        if (!mounted) return;
        setDailyInquiryCounts(Array(7).fill(0));
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, [dailyWindowOffsetDays]);

  const trendWindowEndDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - dailyWindowOffsetDays);
    return date;
  }, [dailyWindowOffsetDays]);

  const trendWindowStartDate = useMemo(() => {
    const date = new Date(trendWindowEndDate);
    date.setDate(trendWindowEndDate.getDate() - 6);
    return date;
  }, [trendWindowEndDate]);

  const trendRangeLabel = `${formatMonthDay(trendWindowStartDate)} - ${formatMonthDay(trendWindowEndDate)}`;

  const dailyTrendMaxCount = Math.max(...dailyInquiryCounts, 1);
  const dailyTrend = useMemo(
    () =>
      dailyInquiryCounts.map((count, idx) => {
        const date = new Date(trendWindowStartDate);
        date.setDate(trendWindowStartDate.getDate() + idx);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const isToday = dailyWindowOffsetDays === 0 && idx === dailyInquiryCounts.length - 1;
        const height = Math.max(8, Math.round((count / dailyTrendMaxCount) * 100));

        return {
          height,
          count,
          isToday,
          label: isToday ? '오늘' : `${month}/${day}`,
        };
      }),
    [dailyInquiryCounts, dailyTrendMaxCount, dailyWindowOffsetDays, trendWindowStartDate],
  );

  const donutTotal = useMemo(
    () => CATEGORY_CODES.reduce((sum, code) => sum + Number(monthlyCategoryCounts[code] ?? 0), 0),
    [monthlyCategoryCounts],
  );

  const donutSegments = useMemo(() => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let offsetLength = 0;

    return CATEGORY_CODES.map((code) => {
      const count = Number(monthlyCategoryCounts[code] ?? 0);
      const ratio = donutTotal > 0 ? count / donutTotal : 0;
      const arcLength = ratio * circumference;
      const segment = {
        code,
        count,
        stroke: CATEGORY_COLORS[code],
        strokeDasharray: `${arcLength} ${circumference}`,
        strokeDashoffset: `${-offsetLength}`,
      };
      offsetLength += arcLength;
      return segment;
    });
  }, [donutTotal, monthlyCategoryCounts]);

  const stats = useMemo(
    () => [
      {
        label: '오늘 접수 문의',
        value: `${summary.todayReceivedCount}`,
        unit: '건',
        badge: `전일 대비 ${formatSignedPercent(todayReceivedChangeRate)}`,
        badgeType: todayReceivedChangeRate > 0 ? 'green' : todayReceivedChangeRate < 0 ? 'red' : 'gray',
        icon: 'dvr',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
      },
      {
        label: '미처리 문의',
        value: `${summary.unhandledCount}`,
        unit: '건',
        badge: '현재 기준',
        badgeType: 'red',
        icon: 'assignment_late',
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50',
      },
      {
        label: '평균 응답시간',
        value: `${summary.avgResponseMinutes}`,
        unit: '분',
        badge: monthLabel,
        badgeType: 'gray',
        icon: 'schedule',
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
      },
    ],
    [monthLabel, summary.avgResponseMinutes, summary.todayReceivedCount, summary.unhandledCount, todayReceivedChangeRate],
  );

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500 bg-[#f9fafb] p-8 rounded-tl-3xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 mb-2">대시보드</h1>
          <p className="text-sm text-zinc-500 font-medium">실시간 고객 문의 현황 및 서비스 지표</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-zinc-200">
            <span className="material-symbols-outlined text-zinc-400 text-sm">calendar_today</span>
            <span className="text-sm font-bold text-zinc-700">오늘: {todayLabel}</span>
          </div>
          <button className="bg-primary hover:brightness-95 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[18px]">download</span>
            보고서 다운로드
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 ${stat.iconBg} ${stat.iconColor} rounded-xl flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[20px] font-bold">{stat.icon}</span>
              </div>
              {stat.badge ? (
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                    stat.badgeType === 'blue'
                      ? 'bg-blue-50 text-blue-500'
                      : stat.badgeType === 'red'
                        ? 'bg-red-50 text-red-500'
                        : stat.badgeType === 'gray'
                          ? 'bg-zinc-100 text-zinc-500'
                          : 'bg-green-50 text-green-500'
                  }`}
                >
                  {stat.badge}
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-bold mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-[32px] leading-none font-black text-zinc-900">{stat.value}</h3>
                <span className="text-sm font-bold text-zinc-400">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border border-zinc-100 shadow-sm">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-lg font-black text-zinc-900">일별 문의 추이</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDailyWindowOffsetDays((prev) => prev + 7)}
                className="w-7 h-7 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                aria-label="이전 7일"
              >
                {'<'}
              </button>
              <span className="text-[11px] font-bold text-zinc-400 min-w-[120px] text-center">{trendRangeLabel}</span>
              <button
                type="button"
                onClick={() => setDailyWindowOffsetDays((prev) => Math.max(0, prev - 7))}
                disabled={dailyWindowOffsetDays === 0}
                className="w-7 h-7 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="다음 7일"
              >
                {'>'}
              </button>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 px-4">
            {dailyTrend.map((item, idx) => (
              <div key={`${item.label}-${idx}`} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div className="relative w-full h-full flex items-end group">
                  <div
                    className={`w-full rounded-t-lg ${
                      item.isToday ? 'bg-primary shadow-[0_4px_20px_rgba(246,0,166,0.2)]' : 'bg-primary/10'
                    }`}
                    style={{ height: `${item.height}%` }}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {item.count}건
                  </span>
                </div>
                <span className={`text-[10px] ${item.isToday ? 'font-black text-primary' : 'font-bold text-zinc-400'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-zinc-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-black text-zinc-900 mb-2 self-start">유형별 문의 분포</h3>
          <p className="text-xs font-bold text-zinc-400 self-start mb-6">{monthLabel}</p>
          <div className="relative w-40 h-40 mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="16" />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.code}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={segment.stroke}
                  strokeWidth="16"
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-zinc-900 leading-none mb-1">{donutTotal}</span>
              <span className="text-[8px] font-bold text-zinc-400 tracking-widest uppercase">Total</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            {CATEGORY_CODES.map((code) => {
              const count = Number(monthlyCategoryCounts[code] ?? 0);
              const ratio = donutTotal > 0 ? Math.round((count / donutTotal) * 100) : 0;
              return (
                <div key={code} className="flex items-center justify-between text-xs font-bold text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[code] }} />
                    <span>{CATEGORY_LABEL[code]}</span>
                  </div>
                  <span>
                    {count}건 ({ratio}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[24px] border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-zinc-900">최근 미처리 문의 리스트</h3>
          <button
            className="text-xs font-bold text-primary hover:underline"
            onClick={() => navigate('/admin/support')}
          >
            전체보기
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">문의 ID</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">고객/회원</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">유형</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider w-1/3">제목</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider">상태</th>
                <th className="pb-4 text-[11px] font-black text-zinc-400 tracking-wider text-right">접수시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {recentUnhandled.map((q) => (
                <tr key={q.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-4 text-sm font-bold text-zinc-400">{q.inquiryNo}</td>
                  <td className="py-4 text-sm font-bold text-zinc-800">
                    {q.authorName} <span className="text-zinc-500">({q.authorUsername})</span>
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-zinc-100 text-zinc-600">
                      {CATEGORY_LABEL[q.categoryCode] ?? q.categoryCode}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-bold text-zinc-700 truncate">{q.title}</td>
                  <td className="py-4 text-sm font-bold text-zinc-700">{STATUS_LABEL[q.status] ?? q.status}</td>
                  <td className="py-4 text-sm font-medium text-zinc-400 text-right">{q.createdAt}</td>
                </tr>
              ))}
              {recentUnhandled.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm font-bold text-zinc-400">
                    표시할 미처리 문의가 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

