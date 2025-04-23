import { Pagination } from "react-bootstrap";

type PaginateProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

export function Paginate({ currentPage, totalPages, onPageChange }: PaginateProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-3 justify-content-center">
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)} disabled={currentPage === 1} />
      <Pagination.Item active>{currentPage}</Pagination.Item>
      <Pagination.Next onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );
}
