"use client";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback } from "react";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
}

export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam,
}: PaginationWithLinksProps) {
  const t = useTranslations("pagination");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      if (!searchParams) return `${pathname}?${key}=${newPage}`;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, String(newPage));
      return `${pathname}?${newSearchParams.toString()}`;
    },
    [searchParams, pathname, pageSearchParam],
  );

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.set(key, String(newPageSize));
      newSearchParams.delete(pageSearchParam || "page"); // Clear the page number when changing page size
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, pageSearchParam, pageSizeSelectOptions, router],
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={buildLink(i)} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href={buildLink(1)} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis label={t("morePages")} />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={buildLink(i)} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis label={t("morePages")} />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink href={buildLink(totalPageCount)} isActive={page === totalPageCount}>
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            label={t("rowsPerPage")}
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination aria-label={t("label")} className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              label={t("previous")}
              aria-label={t("goPrevious")}
              href={buildLink(Math.max(page - 1, 1))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              label={t("next")}
              aria-label={t("goNext")}
              href={buildLink(Math.min(page + 1, totalPageCount))}
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={page === totalPageCount ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  label,
  options,
  setPageSize,
  pageSize,
}: {
  label: string;
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">{label}</span>

      <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger>
          <SelectValue>{String(pageSize)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}