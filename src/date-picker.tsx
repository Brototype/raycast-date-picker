import { Action, ActionPanel, Grid, getPreferenceValues } from "@raycast/api";
import { useEffect, useMemo, useRef, useState } from "react";

type DateFormatPreference =
  | "yyyy-MM-dd"
  | "dd.MM.yyyy"
  | "MM/dd/yyyy"
  | "dd/MM/yyyy"
  | "yyyy/MM/dd"
  | "yyyyMMdd"
  | "custom";

type DatePickerPreferences = {
  dateFormat: DateFormatPreference;
  customDateFormat?: string;
};

type MonthModel = {
  key: string;
  title: string;
  days: CalendarCell[];
};

type CalendarCell =
  | {
      kind: "week-number";
      key: string;
      label: string;
    }
  | {
      kind: "weekday";
      key: string;
      label: string;
    }
  | {
      kind: "spacer";
      key: string;
    }
  | {
      kind: "day";
      key: string;
      day: number;
      date: Date;
      dateId: string;
      formattedDate: string;
      isToday: boolean;
      isWeekend: boolean;
    };

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});
const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

export default function Command() {
  const preferences = getPreferenceValues<DatePickerPreferences>();
  const dateFormat = useMemo(
    () => resolveDateFormat(preferences),
    [preferences.dateFormat, preferences.customDateFormat],
  );
  const today = useMemo(() => formatISODate(new Date()), []);
  const months = useMemo(
    () => makeMonths(new Date(), dateFormat),
    [dateFormat],
  );
  const isStartupSelectionLocked = useRef(true);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  useEffect(() => {
    const firstNudge = setTimeout(() => {
      setSelectedItemId(today);
    }, 0);
    const secondNudge = setTimeout(() => {
      setSelectedItemId(today);
    }, 40);
    const unlockTimeout = setTimeout(() => {
      isStartupSelectionLocked.current = false;
    }, 120);

    return () => {
      clearTimeout(firstNudge);
      clearTimeout(secondNudge);
      clearTimeout(unlockTimeout);
    };
  }, [today]);

  return (
    <Grid
      columns={8}
      aspectRatio="16/9"
      filtering={false}
      fit={Grid.Fit.Fill}
      inset={Grid.Inset.Zero}
      navigationTitle="Date Picker"
      searchBarPlaceholder="Pick a date to copy"
      selectedItemId={selectedItemId}
      onSelectionChange={(id) => {
        if (!id) {
          return;
        }

        if (isStartupSelectionLocked.current && id !== today) {
          return;
        }

        setSelectedItemId(id);
      }}
    >
      {months.map((month) => (
        <Grid.Section
          key={month.key}
          title={month.title}
          columns={8}
          aspectRatio="16/9"
          fit={Grid.Fit.Fill}
          inset={Grid.Inset.Zero}
        >
          {month.days.map((cell) => {
            if (cell.kind === "week-number") {
              return (
                <Grid.Item
                  key={cell.key}
                  id={cell.key}
                  content={makeTileSvg({
                    label: cell.label,
                    background: "#f3f5f8",
                    foreground: "#7a8492",
                    border: "#e1e6ee",
                    fontSize: 20,
                    weight: 700,
                  })}
                />
              );
            }

            if (cell.kind === "weekday") {
              return (
                <Grid.Item
                  key={cell.key}
                  id={cell.key}
                  content={makeTileSvg({
                    label: cell.label,
                    background: "#eef3fa",
                    foreground: "#6b7788",
                    fontSize: 23,
                    weight: 700,
                  })}
                />
              );
            }

            if (cell.kind === "spacer") {
              return (
                <Grid.Item
                  key={cell.key}
                  id={cell.key}
                  content={makeTileSvg({
                    label: "",
                    background: "#00000000",
                    border: "#00000000",
                  })}
                />
              );
            }

            return (
              <Grid.Item
                key={cell.key}
                id={cell.dateId}
                content={makeTileSvg({
                  label: String(cell.day),
                  background: cell.isToday
                    ? "#1d6dff"
                    : cell.isWeekend
                      ? "#edf1f7"
                      : "#f8fafc",
                  foreground: cell.isToday
                    ? "#ffffff"
                    : cell.isWeekend
                      ? "#697586"
                      : "#1f2a37",
                  border: cell.isToday ? "#1d6dff" : "#d8e0eb",
                  fontSize: cell.day < 10 ? 29 : 27,
                  weight: cell.isToday ? 800 : 650,
                })}
                keywords={[
                  cell.dateId,
                  cell.formattedDate,
                  String(cell.day),
                  month.title,
                ]}
                actions={
                  <ActionPanel title={cell.formattedDate}>
                    <Action.CopyToClipboard
                      title="Copy Date"
                      content={cell.formattedDate}
                    />
                    <Action.Paste
                      title="Paste Date"
                      content={cell.formattedDate}
                    />
                  </ActionPanel>
                }
              />
            );
          })}
        </Grid.Section>
      ))}
    </Grid>
  );
}

function makeMonths(referenceDate: Date, dateFormat: string): MonthModel[] {
  const currentMonth = startOfMonth(referenceDate);
  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1,
    12,
  );
  return [
    makeMonth(currentMonth, dateFormat),
    makeMonth(nextMonth, dateFormat),
  ];
}

function makeMonth(monthStart: Date, dateFormat: string): MonthModel {
  const monthKey = formatISODate(monthStart);
  const weekdayCells: CalendarCell[] = [
    {
      kind: "week-number",
      key: `${monthKey}-week-number-header`,
      label: "Wk",
    },
    ...getWeekdayLabels().map((label, index) => ({
      kind: "weekday" as const,
      key: `${monthKey}-weekday-${index}`,
      label,
    })),
  ];
  const startOffset = getStartOffset(monthStart);
  const calendarCells: CalendarCell[] = [];
  const totalDays = daysInMonth(monthStart);
  const weekCount = Math.ceil((startOffset + totalDays) / 7);

  for (let week = 0; week < weekCount; week += 1) {
    const firstVisibleDay = 1 - startOffset + week * 7;
    const firstVisibleDate = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      firstVisibleDay,
      12,
    );

    calendarCells.push({
      kind: "week-number",
      key: `${monthKey}-week-${week}`,
      label: String(getISOWeekNumber(firstVisibleDate)),
    });

    for (let column = 0; column < 7; column += 1) {
      const slot = week * 7 + column;
      const day = slot - startOffset + 1;

      if (day < 1 || day > totalDays) {
        calendarCells.push({
          kind: "spacer",
          key: `${monthKey}-spacer-${slot}`,
        });
      } else {
        const date = new Date(
          monthStart.getFullYear(),
          monthStart.getMonth(),
          day,
          12,
        );
        const dateId = formatISODate(date);
        const formattedDate = formatDateWithPattern(date, dateFormat);
        calendarCells.push({
          kind: "day",
          key: dateId,
          day,
          date,
          dateId,
          formattedDate,
          isToday: dateId === formatISODate(new Date()),
          isWeekend: isWeekend(date),
        });
      }
    }
  }

  return {
    key: monthKey,
    title: monthFormatter.format(monthStart),
    days: [...weekdayCells, ...calendarCells],
  };
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function daysInMonth(monthStart: Date): number {
  return new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
    12,
  ).getDate();
}

function getStartOffset(monthStart: Date): number {
  const firstWeekday = getFirstWeekday();
  return (monthStart.getDay() - firstWeekday + 7) % 7;
}

function getFirstWeekday(): number {
  const locale = new Intl.Locale(
    Intl.DateTimeFormat().resolvedOptions().locale,
  ) as Intl.Locale & {
    weekInfo?: { firstDay: number };
  };
  const weekInfo = locale.weekInfo ?? { firstDay: 1 };
  return weekInfo.firstDay % 7;
}

function getWeekdayLabels(): string[] {
  const firstWeekday = getFirstWeekday();
  const sunday = new Date(2026, 6, 12, 12);

  return Array.from({ length: 7 }, (_, index) => {
    const day = (firstWeekday + index) % 7;
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + day);
    return weekdayFormatter.format(date).slice(0, 2).toUpperCase();
  });
}

function isWeekend(date: Date): boolean {
  const weekday = date.getDay();
  return weekday === 0 || weekday === 6;
}

function getISOWeekNumber(date: Date): number {
  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );
  const mondayBasedWeekday = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - mondayBasedWeekday + 3);

  const firstThursday = new Date(target.getFullYear(), 0, 4, 12);
  const firstThursdayWeekday = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstThursdayWeekday + 3);

  return (
    1 +
    Math.round(
      (target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
  );
}

function resolveDateFormat(preferences: DatePickerPreferences): string {
  if (preferences.dateFormat === "custom") {
    return preferences.customDateFormat?.trim() || "yyyy-MM-dd";
  }

  return preferences.dateFormat || "yyyy-MM-dd";
}

function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateWithPattern(date: Date, pattern: string): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const replacements: Record<string, string> = {
    yyyy: year,
    YYYY: year,
    MM: month.padStart(2, "0"),
    M: month,
    dd: day.padStart(2, "0"),
    DD: day.padStart(2, "0"),
    d: day,
  };

  return pattern.replace(
    /yyyy|YYYY|MM|M|dd|DD|d/g,
    (token) => replacements[token] ?? token,
  );
}

function makeTileSvg({
  label,
  background,
  foreground = "#1f2a37",
  border = "#d8e0eb",
  fontSize = label.length > 2 ? 22 : 28,
  weight = 650,
}: {
  label: string;
  background: string;
  foreground?: string;
  border?: string;
  fontSize?: number;
  weight?: number;
}): string {
  const baselineY = 45 + fontSize * 0.34;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90">
  <rect x="2" y="3" width="156" height="84" rx="10" fill="${background}" stroke="${border}" stroke-width="2"/>
  <text x="80" y="${baselineY}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${foreground}">${escapeXml(label)}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
