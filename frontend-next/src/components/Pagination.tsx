import { Pagination } from 'react-bootstrap';

type PaginateProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

export function Paginate({ currentPage, totalPages, onPageChange }: PaginateProps) {
  if (totalPages <= 1) return null;

  const visiblePages = 5;
  const halfRange = Math.floor(visiblePages / 2);

  let startPage = Math.max(1, currentPage - halfRange);
  let endPage = Math.min(totalPages, currentPage + halfRange);

  if (currentPage <= halfRange) {
    endPage = Math.min(totalPages, visiblePages);
  } else if (currentPage + halfRange >= totalPages) {
    startPage = Math.max(1, totalPages - visiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="mt-3 justify-content-center">
      <Pagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      />

      {pageNumbers.map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}

      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      />
    </Pagination>
  );
}
