import type { MoviesSearch } from "@/routes";
import { Pagination as PaginationUI, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from "./ui/pagination";

type Props = {
  search: MoviesSearch
  maxPage: number
}

const getPageRange = (current: number, max: number, delta = 2): number[] => {
  const range: number[] = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(max - 1, current + delta); i++) {
    range.push(i);
  }
  return range;
};

export function Pagination({ search, maxPage }: Props) {
  const currentPage = search.page ?? 0;
  const pages = getPageRange(currentPage, maxPage);

  return <PaginationUI>
    <PaginationContent>
      {/* Previous Button */}
      <PaginationItem>
        <PaginationPrevious
          to="/"
          search={{ ...search, page: Math.max(0, currentPage - 1) }}
          disabled={currentPage <= 0}
        />
      </PaginationItem>
        
      {/* First Page */}
      <PaginationItem>
        <PaginationLink
          to="/"
          isActive={currentPage === 0}
          search={{ ...search, page: 0 }}
        >
          1
        </PaginationLink>
      </PaginationItem>

      {/* Ellipsis Before Current Range */}
      {pages[0] > 1 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            to="/"
            isActive={currentPage === page}
            search={{ ...search, page }}
          >
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      ))}

      {/* Ellipsis After Current Range */}
      {pages[pages.length - 1] < maxPage - 1 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      {/* Last Page */}
      {maxPage > 0 && (
        <PaginationItem>
          <PaginationLink
            to="/"
            isActive={currentPage === maxPage}
            search={{ ...search, page: maxPage }}
          >
            {maxPage + 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Next Button */}
      <PaginationItem>
        <PaginationNext
          to="/"
          search={{ ...search, page: Math.min(maxPage, currentPage + 1) }}
          disabled={currentPage >= maxPage}
        />
      </PaginationItem>
    </PaginationContent>
  </PaginationUI>
}